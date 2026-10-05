export function getRoute(){const h=location.hash.replace(/^#/,'')||'/';const [path,query='']=h.split('?');return{path,params:new URLSearchParams(query)}}
export function go(path){if(document.startViewTransition)document.startViewTransition(()=>{location.hash=path});else location.hash=path}
export function back(){if(history.length>1)history.back();else go('/')}
