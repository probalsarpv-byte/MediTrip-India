const cache = {};
export async function loadJSON(name){if(cache[name])return cache[name];const r=await fetch(`data/${name}.json`);if(!r.ok)throw new Error(`Failed to load ${name}`);cache[name]=await r.json();return cache[name]}
export async function getAllData(){const [hospitals,doctors,treatments,cities,phrases,visa]=await Promise.all(['hospitals','doctors','treatments','cities','phrases','visa'].map(loadJSON));return{hospitals,doctors,treatments,cities,phrases,visa}}
