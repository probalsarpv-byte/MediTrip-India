const key='meditrip-v1-state';
export function getState(){try{return JSON.parse(localStorage.getItem(key))||{favorites:[],compare:[],journey:{diagnosis:true,hospital:false,reports:false,visa:false,travel:false,treatment:false,followup:false},expenses:[]}}catch{return {favorites:[],compare:[],journey:{}}}}
export function setState(v){localStorage.setItem(key,JSON.stringify(v))}
export function toggleFavorite(id){const s=getState();s.favorites=s.favorites||[];s.favorites=s.favorites.includes(id)?s.favorites.filter(x=>x!==id):[...s.favorites,id];setState(s);return s}
export function toggleCompare(id){const s=getState();s.compare=s.compare||[];if(s.compare.includes(id))s.compare=s.compare.filter(x=>x!==id);else if(s.compare.length<3)s.compare.push(id);setState(s);return s}
