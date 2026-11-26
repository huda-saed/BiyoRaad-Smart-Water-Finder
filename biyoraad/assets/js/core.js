/* Core: helpers, i18n, layout (navbar, sidebar, footer), demo auth */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const store={get:(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}},set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
/* Clear sample data saved by the previous (Somalia-wide) version so Somaliland data shows */
try{if(localStorage.getItem('br_data_v')!==DATA_VERSION){['br_sources','br_reports'].forEach(k=>localStorage.removeItem(k));
  try{const u=JSON.parse(localStorage.getItem('br_user'));if(u&&!SL_REGIONS.includes(u.region)){u.region=SL_REGIONS[0];localStorage.setItem('br_user',JSON.stringify(u))}}catch(e){}
  localStorage.setItem('br_data_v',DATA_VERSION)}}catch(e){}
const getSources=()=>store.get('br_sources',DEFAULT_SOURCES), getReports=()=>store.get('br_reports',DEFAULT_REPORTS);
const LANG=localStorage.getItem('br_lang')||'en', ROLE=localStorage.getItem('br_role'), LAY=document.body.dataset.layout||'public';
const t=k=>(I18N[k]?I18N[k][LANG]:k);
if((LAY==='user'&&!ROLE)||(LAY==='admin'&&ROLE!=='admin')) location.replace('login.html');
document.documentElement.lang=LANG;

function applyI18n(){
  $$('[data-i18n]').forEach(e=>{if(I18N[e.dataset.i18n])e.textContent=t(e.dataset.i18n)});
  $$('[data-i18n-ph]').forEach(e=>e.placeholder=t(e.dataset.i18nPh));
}
function toast(msg,type='success'){
  let c=$('#toasts');if(!c){c=document.createElement('div');c.id='toasts';c.className='toast-container position-fixed bottom-0 end-0 p-3';document.body.appendChild(c)}
  const el=document.createElement('div');el.className=`toast align-items-center text-bg-${type} border-0`;
  el.innerHTML=`<div class="d-flex"><div class="toast-body">${msg}</div><button class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>`;
  c.appendChild(el);new bootstrap.Toast(el,{delay:3000}).show();el.addEventListener('hidden.bs.toast',()=>el.remove());
}
const badge=s=>`<span class="status-badge st-${s}"><i class="bi bi-circle-fill"></i> ${t('s_'+s)}</span>`;
const rbadge=s=>`<span class="status-badge rs-${s}">${t('r_'+s)}</span>`;
const TYPE_ICON={Borehole:'bi-arrow-down-circle',Well:'bi-bucket','Water Kiosk':'bi-shop',Berkad:'bi-water',River:'bi-tsunami',Spring:'bi-droplet-half'};
const fmtDate=d=>new Date(d).toLocaleDateString(LANG==='so'?'so':'en-GB',{day:'numeric',month:'short',year:'numeric'});

function buildNav(){
  const cur=location.pathname.split('/').pop()||'index.html';
  const L=[['index.html','nav_home'],['sources.html','nav_sources'],['map.html','nav_map'],['report.html','nav_report'],['about.html','nav_about'],['contact.html','nav_contact']];
  const auth=ROLE?`<a class="btn btn-teal btn-sm" href="${ROLE==='admin'?'admin.html':'dashboard.html'}">${t('nav_dashboard')}</a><button class="btn btn-outline-light btn-sm" id="logout">${t('nav_logout')}</button>`
    :`<a class="btn btn-outline-light btn-sm" href="login.html">${t('nav_login')}</a><a class="btn btn-teal btn-sm" href="register.html">${t('nav_register')}</a>`;
  $('#nav').innerHTML=`<nav class="navbar navbar-expand-lg br-nav sticky-top"><div class="container-xl">
  <a class="navbar-brand" href="index.html"><i class="bi bi-droplet-fill"></i>Biyo<span>Raad</span></a>
  <button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#mn" aria-label="Menu"><i class="bi bi-list"></i></button>
  <div class="collapse navbar-collapse" id="mn"><ul class="navbar-nav me-auto">${L.map(([h,k])=>`<li class="nav-item"><a class="nav-link ${cur===h?'active':''}" href="${h}">${t(k)}</a></li>`).join('')}</ul>
  <div class="d-flex gap-2 align-items-center flex-wrap"><div class="btn-group btn-group-sm lang"><button class="btn ${LANG==='en'?'active':''}" data-lang="en">EN</button><button class="btn ${LANG==='so'?'active':''}" data-lang="so">SO</button></div>${auth}</div></div></div></nav>`;
  $$('[data-lang]').forEach(b=>b.onclick=()=>{localStorage.setItem('br_lang',b.dataset.lang);location.reload()});
  const lo=$('#logout');if(lo)lo.onclick=()=>{localStorage.removeItem('br_role');location.href='index.html'};
}
function buildSide(){
  const s=$('#side');if(!s)return;const cur=location.pathname.split('/').pop();
  const U=[['dashboard.html','bi-speedometer2','nav_dashboard'],['sources.html','bi-droplet','nav_sources'],['map.html','bi-map','nav_map'],['report.html','bi-megaphone','nav_report'],['my-reports.html','bi-card-checklist','side_myreports'],['profile.html','bi-person-circle','side_profile']];
  const A=[['admin.html','bi-speedometer2','side_admin'],['manage-sources.html','bi-droplet-half','side_sources'],['manage-reports.html','bi-clipboard-data','side_reports'],['map.html','bi-map','nav_map'],['profile.html','bi-person-circle','side_profile']];
  const u=store.get('br_user',{name:'Amina Hassan'});
  s.innerHTML=`<div class="side-user"><span class="avatar">${u.name.split(' ').map(w=>w[0]).slice(0,2).join('')}</span><div><b>${u.name}</b><small>${ROLE==='admin'?t('role_admin'):t('role_user')}</small></div></div>`+
   (ROLE==='admin'?A:U).map(([h,i,k])=>`<a href="${h}" class="${cur===h?'active':''}"><i class="bi ${i}"></i>${t(k)}</a>`).join('');
}
function buildFoot(){
  $('#foot').innerHTML=`<footer class="br-foot"><div class="container-xl"><div class="row g-4">
  <div class="col-lg-4"><a class="navbar-brand" href="index.html"><i class="bi bi-droplet-fill"></i>Biyo<span>Raad</span></a><p class="mt-2">${t('foot_about')}</p></div>
  <div class="col-6 col-lg-2"><h6>${t('foot_links')}</h6><a href="sources.html">${t('nav_sources')}</a><a href="map.html">${t('nav_map')}</a><a href="report.html">${t('nav_report')}</a></div>
  <div class="col-6 col-lg-2"><h6>${t('foot_company')}</h6><a href="about.html">${t('nav_about')}</a><a href="contact.html">${t('nav_contact')}</a><a href="login.html">${t('nav_login')}</a></div>
  <div class="col-lg-4"><h6>${t('nav_contact')}</h6><p class="mb-1"><i class="bi bi-envelope"></i> info@biyoraad.org</p><p class="mb-1"><i class="bi bi-telephone"></i> +252 63 000 0000</p><p><i class="bi bi-geo-alt"></i> ${t('office_short')}</p></div>
  </div><div class="copy">&copy; 2026 BiyoRaad. ${t('foot_rights')}</div></div></footer>`;
}
document.addEventListener('submit',e=>{const f=e.target;if(!f.dataset.demo)return;e.preventDefault();
  if(!f.checkValidity()){f.classList.add('was-validated');return}
  if(typeof FORMS!=='undefined'&&FORMS[f.id])FORMS[f.id](f);});
document.addEventListener('DOMContentLoaded',()=>{buildNav();buildSide();buildFoot();applyI18n()});
