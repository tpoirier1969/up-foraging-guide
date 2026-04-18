
const state={view:'home',query:'',plants:[],mushrooms:[],rare:[]};

async function loadJSON(path){const r=await fetch(path,{cache:'no-store'}); if(!r.ok) throw new Error(path+' '+r.status); return r.json();}
function safe(v){return String(v??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));}
function first(text){const t=String(text||'').trim(); if(!t) return ''; return t.split(/(?<=[.!?])\s+/)[0];}
function blob(r){return [r.display_name,r.common_name,r.scientific_name,r.notes,r.culinary_uses,r.medicinal_uses,r.effects_on_body,r.edibility_detail,(r.habitat||[]).join(' '),(r.look_alikes||[]).join(' ')].filter(Boolean).join(' ').toLowerCase();}
function img(src){if(!src) return ''; if(/^https?:/i.test(src)) return src; return src;}
function isMedicinal(r){return !!(String(r.medicinal_uses||'').trim() || (r.medicinalAction||[]).length || (r.medicinalSystem||[]).length || (r.medicinalTerms||[]).length || r.is_medicinal);}
function isNonEdible(r){return !!r.is_non_edible;}
function filter(list){const q=state.query.trim().toLowerCase(); if(!q) return list; return list.filter(r=>blob(r).includes(q));}
function tags(r, extra=''){let out=''; if(r.primary_type) out+=`<span class="tag">${safe(r.primary_type)}</span>`; if(isMedicinal(r)) out+=`<span class="tag">Medicinal</span>`; if(isNonEdible(r)) out+=`<span class="tag warn">${safe(r.non_edible_severity || 'Non-edible / caution')}</span>`; if(extra) out+=extra; return out;}
function card(r, extra=''){const image=(r.images||[])[0]; return `<article class="card"><div class="thumb">${image?`<img loading="lazy" src="${safe(img(image))}" alt="${safe(r.display_name||r.common_name||'')}">`:'No image'}</div><div><h3><button data-detail="${safe(r.slug)}">${safe(r.display_name||r.common_name||r.slug)}</button></h3><p class="sci">${safe(r.scientific_name||'')}</p><p class="summary">${safe(first(r.notes||r.reason||r.edibility_detail||r.effects_on_body||r.culinary_uses||r.medicinal_uses)||'No summary yet.')}</p><div class="tags">${tags(r,extra)}</div></div></article>`}
function home(){return `<section class="panel"><div class="stats"><div class="stat"><strong>${state.plants.length}</strong><span>Plants</span></div><div class="stat"><strong>${state.mushrooms.length}</strong><span>Mushrooms</span></div><div class="stat"><strong>${state.plants.filter(isMedicinal).length+state.mushrooms.filter(isMedicinal).length}</strong><span>Medicinal</span></div><div class="stat"><strong>${state.plants.filter(isNonEdible).length+state.mushrooms.filter(isNonEdible).length}</strong><span>Non-edible / caution</span></div></div></section><section class="panel" style="margin-top:14px"><h2>What changed</h2><div class="grid">${[
['Canonical plants file','data/plants.json now holds plant-side records.'],
['Canonical mushrooms file','data/mushrooms.json now holds mushroom-side records.'],
['Rare / endangered separated','data/rare_endangered.json is its own file.'],
['Medicinal is a flag','Not its own duplicate master category.'],
['Non-edible is a flag','Not a duplicate species store.']
].map(x=>`<article class="card" style="grid-template-columns:1fr"><div><h3>${safe(x[0])}</h3><p class="summary">${safe(x[1])}</p></div></article>`).join('')}</div></section>`}
function listPage(title, list, extraRare=false){const rows=filter(list); document.getElementById('meta').textContent=`${rows.length} result${rows.length===1?'':'s'}`; return `<section class="panel"><h2>${safe(title)}</h2><div class="grid" style="margin-top:12px">${rows.length?rows.map(r=>card(r, extraRare&&r.status?`<span class="tag rare">${safe(r.status)}</span>`:'')).join(''):'<div class="empty">No entries matched.</div>'}</div></section>`}
function render(){document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('active', b.dataset.view===state.view)); document.getElementById('meta').textContent=''; const app=document.getElementById('app'); if(state.view==='home') app.innerHTML=home(); else if(state.view==='plants') app.innerHTML=listPage('Plants', state.plants); else if(state.view==='mushrooms') app.innerHTML=listPage('Mushrooms', state.mushrooms); else if(state.view==='medicinal') app.innerHTML=listPage('Medicinal', [...state.plants,...state.mushrooms].filter(isMedicinal)); else if(state.view==='nonedible') app.innerHTML=listPage('Non-edible / caution', [...state.plants,...state.mushrooms].filter(isNonEdible)); else if(state.view==='rare') app.innerHTML=listPage('Rare / Endangered', state.rare, true); bindDetail();}
function bindDetail(){document.querySelectorAll('[data-detail]').forEach(b=>b.onclick=()=>openDetail(b.dataset.detail));}
function openDetail(slug){const rec=[...state.plants,...state.mushrooms,...state.rare].find(r=>r.slug===slug); if(!rec) return; const imgs=(rec.images||[]).map(img); const field=(title,val)=>{if(!val||Array.isArray(val)&&!val.length) return ''; const body=Array.isArray(val)?`<ul>${val.map(v=>`<li>${safe(v)}</li>`).join('')}</ul>`:`<p>${safe(val)}</p>`; return `<section class="box"><h3>${safe(title)}</h3>${body}</section>`}; document.getElementById('modalContent').innerHTML=`<div class="detail"><aside class="gallery">${imgs.length?imgs.map(s=>`<img src="${safe(s)}" alt="${safe(rec.display_name||rec.common_name||'')}">`).join(''):'<div class="thumb">No image</div>'}</aside><section><h2>${safe(rec.display_name||rec.common_name||rec.slug)}</h2><p class="sci">${safe(rec.scientific_name||'')}</p><div class="tags">${tags(rec, rec.status?`<span class="tag rare">${safe(rec.status)}</span>`:'')}</div><div class="detail-grid">${[
field('Culinary uses', rec.culinary_uses),
field('Medicinal uses', rec.medicinal_uses),
field('Notes', rec.notes||rec.reason),
field('Habitat', rec.habitat),
field('Seasonality', rec.months_available),
field('Identification tips', rec.field_marks),
field('Looks-alikes', rec.look_alikes),
field('Effects on body', rec.effects_on_body),
field('Edibility detail', rec.edibility_detail),
field('Other uses', rec.other_uses),
field('Care note', rec.care_note)
].filter(Boolean).join('')}</div></section></div>`; document.getElementById('detailModal').showModal();}
async function init(){const [p,m,r]=await Promise.all([loadJSON('data/plants.json'),loadJSON('data/mushrooms.json'),loadJSON('data/rare_endangered.json')]); state.plants=p.records; state.mushrooms=m.records; state.rare=r.records; render();}
document.getElementById('nav').onclick=e=>{const b=e.target.closest('[data-view]'); if(!b) return; state.view=b.dataset.view; render();};
document.getElementById('search').oninput=e=>{state.query=e.target.value||''; render();};
document.getElementById('closeModal').onclick=()=>document.getElementById('detailModal').close();
document.getElementById('detailModal').addEventListener('click', e=>{ if(e.target.id==='detailModal') e.currentTarget.close(); });
init().catch(err=>{document.getElementById('app').innerHTML=`<div class="empty">Load failed: ${safe(err.message||String(err))}</div>`;});
