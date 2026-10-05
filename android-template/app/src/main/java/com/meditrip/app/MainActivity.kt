package com.meditrip.app

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity

class MainActivity : ComponentActivity() {
    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        val web = findViewById<WebView>(R.id.webview)
        web.settings.javaScriptEnabled = true
        web.settings.domStorageEnabled = true
        web.webViewClient = WebViewClient()
        web.webChromeClient = WebChromeClient()
        web.loadUrl("file:///android_asset/www/index.html")
    }

    override fun onBackPressed() {
        val web = findViewById<WebView>(R.id.webview)
        if (web.canGoBack()) web.goBack() else super.onBackPressed()
    }
}
