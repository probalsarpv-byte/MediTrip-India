package com.meditrip.india;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import android.speech.tts.Voice;
import android.view.View;
import android.view.WindowInsets;
import android.webkit.JavascriptInterface;
import android.webkit.JsResult;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import org.json.JSONObject;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

/** Bundled, isolated origin. No remote pages, AI services or network permission. */
public final class MainActivity extends Activity {
    private static final String HOST = "appassets.androidplatform.net";
    private static final String START = "https://" + HOST + "/assets/index.html#/home";
    private static final int OPEN_PLAN = 100, SAVE_PLAN = 101;
    private WebView web;
    private TextToSpeech tts;
    private volatile boolean voiceReady;
    private ValueCallback<Uri[]> fileCallback;
    private String pendingExport, uiLanguage = "bn";
    private volatile String activeUtterance;
    private volatile long speechGeneration;

    @SuppressLint("SetJavaScriptEnabled")
    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(Color.rgb(16,63,68));
        web = new WebView(this);
        root.addView(web, new FrameLayout.LayoutParams(-1,-1));
        setContentView(root);
        if (Build.VERSION.SDK_INT >= 30) {
            getWindow().setDecorFitsSystemWindows(false);
            root.setOnApplyWindowInsetsListener((v,insets)->{
                android.graphics.Insets bars = insets.getInsets(WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout() | WindowInsets.Type.ime());
                v.setPadding(bars.left,bars.top,bars.right,bars.bottom);return insets;
            });
        }
        WebSettings settings = web.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(true); // Only user-picked JSON files; navigation stays blocked.
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setMediaPlaybackRequiresUserGesture(true);
        settings.setSupportMultipleWindows(true);
        settings.setJavaScriptCanOpenWindowsAutomatically(false);
        WebView.setWebContentsDebuggingEnabled(BuildConfig.DEBUG);
        android.webkit.CookieManager.getInstance().setAcceptCookie(false);
        android.webkit.CookieManager.getInstance().setAcceptThirdPartyCookies(web,false);
        web.addJavascriptInterface(new NativeBridge(),"MediNative");
        web.setWebViewClient(new WebViewClient(){
            @Override public boolean shouldOverrideUrlLoading(WebView view,WebResourceRequest request) {
                Uri uri=request.getUrl();
                if (isBundled(uri)) return false;
                if (request.isForMainFrame()) external(uri);
                return true;
            }
            @Override public WebResourceResponse shouldInterceptRequest(WebView view,WebResourceRequest request){
                return assetResponse(request.getUrl());
            }
        });
        web.setWebChromeClient(new WebChromeClient(){
            @Override public boolean onJsConfirm(WebView view,String url,String message,JsResult result){
                new AlertDialog.Builder(MainActivity.this).setMessage(message)
                  .setPositiveButton(label("Confirm","নিশ্চিত করুন","पुष्टि करें"),(d,w)->result.confirm())
                  .setNegativeButton(label("Cancel","বাতিল","रद्द करें"),(d,w)->result.cancel())
                  .setOnCancelListener(d->result.cancel()).show();return true;
            }
            @Override public boolean onShowFileChooser(WebView view,ValueCallback<Uri[]> callback,FileChooserParams params){
                if(fileCallback!=null)fileCallback.onReceiveValue(null);
                fileCallback=callback;
                Intent intent=new Intent(Intent.ACTION_OPEN_DOCUMENT).addCategory(Intent.CATEGORY_OPENABLE).setType("application/json");
                try{startActivityForResult(intent,OPEN_PLAN);}catch(ActivityNotFoundException e){fileCallback.onReceiveValue(null);fileCallback=null;}
                return true;
            }
            @Override public boolean onCreateWindow(WebView view,boolean dialog,boolean userGesture,android.os.Message message){
                if(!userGesture)return false;
                WebView temporary=new WebView(MainActivity.this);
                temporary.setWebViewClient(new WebViewClient(){
                    @Override public boolean shouldOverrideUrlLoading(WebView ignored,WebResourceRequest request){
                        external(request.getUrl());temporary.destroy();return true;
                    }
                });
                ((WebView.WebViewTransport)message.obj).setWebView(temporary);message.sendToTarget();return true;
            }
        });
        tts = new TextToSpeech(this,status->{
            voiceReady=status==TextToSpeech.SUCCESS;
            if(voiceReady)tts.setOnUtteranceProgressListener(new UtteranceProgressListener(){
                @Override public void onStart(String id){}
                @Override public void onDone(String id){if(id.equals(activeUtterance))callback("onNativeSpeech","done");}
                @Override public void onError(String id){if(id.startsWith("mt-"+speechGeneration+"-"))callback("onNativeSpeech","error");}
            });
        });
        if(state!=null)web.restoreState(state);
        if(web.getUrl()==null)web.loadUrl(START);
        if(Build.VERSION.SDK_INT>=33)getOnBackInvokedDispatcher().registerOnBackInvokedCallback(0,this::goBack);
    }
    private String label(String en,String bn,String hi){return uiLanguage.equals("bn")?bn:uiLanguage.equals("hi")?hi:en;}
    private boolean isBundled(Uri uri){return "https".equals(uri.getScheme())&&HOST.equals(uri.getHost())&&uri.getPort()==-1&&uri.getPath()!=null&&uri.getPath().startsWith("/assets/");}
    private WebResourceResponse assetResponse(Uri uri){
        if(!isBundled(uri))return blocked();
        String path=uri.getPath().substring(8);
        if(path.isEmpty())path="index.html";
        if(path.contains("..")||path.contains("\\")||path.startsWith("/")||!path.matches("[a-zA-Z0-9_./-]+"))return blocked();
        String mime=path.endsWith(".html")?"text/html":path.endsWith(".js")?"application/javascript":path.endsWith(".css")?"text/css":path.endsWith(".svg")?"image/svg+xml":path.endsWith(".png")?"image/png":path.endsWith(".webmanifest")?"application/manifest+json":"application/octet-stream";
        try{
            Map<String,String> headers=new HashMap<>();headers.put("X-Content-Type-Options","nosniff");headers.put("Cache-Control","no-cache");
            return new WebResourceResponse(mime,"UTF-8",200,"OK",headers,getAssets().open(path));
        }catch(IOException e){return blocked();}
    }
    private WebResourceResponse blocked(){return new WebResourceResponse("text/plain","UTF-8",403,"Forbidden",null,new ByteArrayInputStream(new byte[0]));}
    private void external(Uri uri){
        String scheme=uri.getScheme();
        if(!"https".equals(scheme)&&!"tel".equals(scheme)&&!"mailto".equals(scheme))return;
        if("https".equals(scheme)&&(uri.getHost()==null||uri.getUserInfo()!=null))return;
        if("tel".equals(scheme)&&!uri.getSchemeSpecificPart().matches("\\+?[0-9]{6,15}"))return;
        try{startActivity(new Intent(Intent.ACTION_VIEW,uri));}catch(ActivityNotFoundException e){callback("onNativeAction","unavailable");}
    }
    private void callback(String function,String status){runOnUiThread(()->{if(web!=null)web.evaluateJavascript("window."+function+" && window."+function+"("+JSONObject.quote(status)+")",null);});}
    private void stopSpeech(){speechGeneration++;activeUtterance=null;if(tts!=null)tts.stop();}
    private void speakOffline(String text,String language,float speed){
        stopSpeech();
        if(!voiceReady||text==null||text.isEmpty()||text.length()>30000){callback("onNativeSpeech","missing");return;}
        Locale locale=Locale.forLanguageTag(language);
        if(!java.util.Arrays.asList("bn","en","hi").contains(locale.getLanguage())){callback("onNativeSpeech","missing");return;}
        Set<Voice> voices=tts.getVoices(); Voice selected=null;
        if(voices!=null)for(Voice voice:voices){
            if(!voice.isNetworkConnectionRequired()&&!voice.getFeatures().contains(TextToSpeech.Engine.KEY_FEATURE_NOT_INSTALLED)&&voice.getLocale().getLanguage().equals(locale.getLanguage())){
                selected=voice;if(voice.getLocale().getCountry().equals(locale.getCountry()))break;
            }
        }
        if(selected==null||tts.setVoice(selected)!=TextToSpeech.SUCCESS){callback("onNativeSpeech","missing");return;}
        tts.setSpeechRate(Math.max(.6f,Math.min(1.4f,speed)));
        int size=Math.min(3000,TextToSpeech.getMaxSpeechInputLength()-1),index=0;
        String last="mt-"+speechGeneration+"-"+((text.length()-1)/size);
        activeUtterance=last;
        for(int start=0;start<text.length();start+=size){
            String part=text.substring(start,Math.min(text.length(),start+size));
            if(tts.speak(part,TextToSpeech.QUEUE_ADD,null,"mt-"+speechGeneration+"-"+(index++))==TextToSpeech.ERROR){callback("onNativeSpeech","error");break;}
        }
    }
    private final class NativeBridge {
        @JavascriptInterface public void setInterfaceLanguage(String language){runOnUiThread(()->{if(java.util.Arrays.asList("bn","en","hi").contains(language))uiLanguage=language;});}
        @JavascriptInterface public void speak(String text,String language,double speed){runOnUiThread(()->speakOffline(text,language,(float)speed));}
        @JavascriptInterface public void stop(){runOnUiThread(()->stopSpeech());}
        @JavascriptInterface public void voiceSettings(){runOnUiThread(()->{try{startActivity(new Intent("com.android.settings.TTS_SETTINGS"));}catch(ActivityNotFoundException e){startActivity(new Intent(android.provider.Settings.ACTION_SETTINGS));}});}
        @JavascriptInterface public void downloadPlan(String text){runOnUiThread(()->{
            try{if(text==null||text.getBytes(StandardCharsets.UTF_8).length>100000)throw new IllegalArgumentException();
                JSONObject object=new JSONObject(text);if(!"meditrip-plan-v1".equals(object.optString("schema")))throw new IllegalArgumentException();
                pendingExport=text;Intent intent=new Intent(Intent.ACTION_CREATE_DOCUMENT).addCategory(Intent.CATEGORY_OPENABLE).setType("application/json").putExtra(Intent.EXTRA_TITLE,"meditrip-plan.json");startActivityForResult(intent,SAVE_PLAN);
            }catch(Exception e){pendingExport=null;callback("onNativeSave","error");}
        });}
        @JavascriptInterface public void shareText(String text){runOnUiThread(()->{if(text!=null&&text.length()<30000){try{startActivity(Intent.createChooser(new Intent(Intent.ACTION_SEND).setType("text/plain").putExtra(Intent.EXTRA_TEXT,text),label("Share journey","যাত্রার পরিকল্পনা শেয়ার করুন","यात्रा साझा करें")));}catch(ActivityNotFoundException e){callback("onNativeAction","unavailable");}}});}
    }
    @Override protected void onActivityResult(int request,int result,Intent intent){
        super.onActivityResult(request,result,intent);
        Uri uri=result==RESULT_OK&&intent!=null?intent.getData():null;
        if(request==OPEN_PLAN&&fileCallback!=null){fileCallback.onReceiveValue(uri==null?null:new Uri[]{uri});fileCallback=null;}
        if(request==SAVE_PLAN){
            if(uri!=null&&pendingExport!=null){try(OutputStream out=getContentResolver().openOutputStream(uri,"w")){if(out==null)throw new IOException();out.write(pendingExport.getBytes(StandardCharsets.UTF_8));}catch(Exception e){callback("onNativeSave","error");}}
            pendingExport=null;
        }
    }
    private void goBack(){web.evaluateJavascript("(function(){var d=document.getElementById('match-dialog');if(d&&d.open){d.close();return 'dialog';}return location.hash;})()",value->{
        if("\"dialog\"".equals(value))return;
        if(!"\"#/home\"".equals(value)&&!"\"\"".equals(value))web.evaluateJavascript("location.hash='/home'",null);else finish();
    });}
    // API 33+ uses the registered platform OnBackInvokedCallback above.
    // This override exists only for API 26-32; no AndroidX runtime is needed.
    @SuppressLint("GestureBackNavigation")
    @Override public void onBackPressed(){if(Build.VERSION.SDK_INT<33)goBack();else super.onBackPressed();}
    @Override protected void onSaveInstanceState(Bundle state){web.saveState(state);super.onSaveInstanceState(state);}
    @Override protected void onPause(){super.onPause();stopSpeech();if(web!=null)web.evaluateJavascript("window.onNativeSpeech && window.onNativeSpeech('done')",null);}
    @Override protected void onDestroy(){stopSpeech();if(tts!=null)tts.shutdown();if(fileCallback!=null)fileCallback.onReceiveValue(null);if(web!=null){web.removeJavascriptInterface("MediNative");web.destroy();web=null;}super.onDestroy();}
}
