/* Page logic. Each key matches <body data-page="...">. */
const C={blue:'#0a5c99',teal:'#0fb5ae',aqua:'#7fd8d4',amber:'#f2a93b',red:'#d9534f',grey:'#9fb3c8'};
const STC={available:C.teal,low:C.amber,dry:C.red};
const mk=(id,cfg)=>{const e=document.getElementById(id);if(e&&window.Chart){Chart.defaults.font.family="'Plus Jakarta Sans',sans-serif";return new Chart(e,cfg)}};
const qs=k=>new URLSearchParams(location.search).get(k);
const osm=(id,c,z)=>{const m=L.map(id).setView(c,z);L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'&copy; OpenStreetMap contributors',maxZoom:18}).addTo(m);return m};
const pin=s=>L.divIcon({className:'',html:`<span class="pin ${s}"><i class="bi bi-droplet-fill"></i></span>`,iconSize:[34,34],iconAnchor:[17,34],popupAnchor:[0,-30]});
const barCls=s=>({available:'bg-teal',low:'bg-warning',dry:'bg-danger'}[s]);
const srcName=id=>(getSources().find(s=>s.id==id)||{name:'-'}).name;
const empty=()=>`<div class="text-center text-muted py-5 w-100"><i class="bi bi-droplet display-4"></i><p class="mt-2 mb-0">${t('none')}</p></div>`;
const card=s=>`<div class="col-md-6 col-xl-4"><div class="card br-card h-100"><div class="card-body">
 <div class="d-flex justify-content-between align-items-center mb-2"><span class="type-pill"><i class="bi ${TYPE_ICON[s.type]||'bi-droplet'}"></i> ${s.type}</span>${badge(s.status)}</div>
 <h5>${s.name}</h5><p class="text-muted small mb-3"><i class="bi bi-geo-alt"></i> ${s.city}, ${s.region}</p>
 <div class="progress mb-1" style="height:8px"><div class="progress-bar ${barCls(s.status)}" style="width:${s.capacity}%"></div></div>
 <small class="text-muted">${t('level')} ${s.capacity}% &middot; ${t('quality')} ${s.quality}%</small></div>
 <div class="card-footer bg-transparent border-0 pb-3"><a class="btn btn-outline-teal btn-sm w-100" href="source-details.html?id=${s.id}">${t('details')}</a></div></div></div>`;
const repRow=(r,admin)=>`<tr><td>${fmtDate(r.date)}</td><td>${srcName(r.sourceId)}</td><td>${r.type}</td><td><span class="sev sev-${r.severity}">${t('sev_'+r.severity)}</span></td><td>${rbadge(r.status)}</td></tr>`;
const FORMS={};

const PAGES={
home(){
  const S=getSources();
  const c=(id,v)=>{const e=$('#'+id);if(!e)return;let n=0;const step=Math.max(1,Math.ceil(v/40));const i=setInterval(()=>{n=Math.min(v,n+step);e.textContent=n.toLocaleString();if(n>=v)clearInterval(i)},25)};
  c('cSources',S.length);c('cRegions',new Set(S.map(s=>s.region)).size);c('cResolved',getReports().filter(r=>r.status==='resolved').length+SL_STATS.resolvedBase);c('cUsers',SL_STATS.users);
  const live=['Hargeisa','Berbera','Burao','Las Anod'].map(c=>S.find(s=>s.city===c)).filter(Boolean);
  $('#liveList').innerHTML=live.map(s=>`<div class="row-s"><span>${s.city}</span><b>${s.capacity}%</b></div><div class="progress"><div class="progress-bar ${barCls(s.status)}" style="width:${Math.max(3,s.capacity)}%"></div></div>`).join('');
  $('#featured').innerHTML=S.filter(s=>s.status==='available').slice(0,3).map(card).join('');
},
register(){
  FORMS.regForm=f=>{store.set('br_user',{name:$('#rName').value,email:$('#rEmail').value,phone:$('#rPhone').value,region:$('#rRegion').value});toast(t('msg_registered'));setTimeout(()=>location.href='login.html',1200)};
  $('#rPass2').addEventListener('input',e=>e.target.setCustomValidity(e.target.value===$('#rPass').value?'':'x'));
  $('#rPass').addEventListener('input',()=>$('#rPass2').dispatchEvent(new Event('input')));
},
login(){
  const go=r=>{localStorage.setItem('br_role',r);if(!store.get('br_user'))store.set('br_user',{name:r==='admin'?'Admin Farah':'Amina Hassan',email:r==='admin'?'admin@biyoraad.org':'amina@example.org',phone:'+252 63 555 0123',region:'Maroodi Jeex'});location.href=r==='admin'?'admin.html':'dashboard.html'};
  FORMS.loginForm=f=>go(/admin/i.test($('#lEmail').value)?'admin':'user');
  $('#demoUser').onclick=()=>go('user');$('#demoAdmin').onclick=()=>go('admin');
  $('#togglePw').onclick=()=>{const p=$('#lPass');p.type=p.type==='password'?'text':'password'};
},
dashboard(){
  const S=getSources(),R=getReports().filter(r=>r.user==='me');
  $('#kSources').textContent=S.filter(s=>s.status==='available').length;$('#kReports').textContent=R.length;
  $('#kResolved').textContent=R.filter(r=>r.status==='resolved').length;$('#kAlerts').textContent=S.filter(s=>s.status!=='available').length;
  const tc=[C.blue,C.teal,C.amber];
  mk('chTrend',{type:'line',data:{labels:MONTHS,datasets:S.slice(0,3).map((x,i)=>({label:x.city,data:x.history,borderColor:tc[i],backgroundColor:i?'transparent':'rgba(10,92,153,.1)',fill:i===0,tension:.4}))},options:{responsive:true,maintainAspectRatio:false,scales:{y:{beginAtZero:true,max:100}}}});
  const n=k=>S.filter(s=>s.status===k).length;
  mk('chStatus',{type:'doughnut',data:{labels:[t('s_available'),t('s_low'),t('s_dry')],datasets:[{data:[n('available'),n('low'),n('dry')],backgroundColor:[C.teal,C.amber,C.red],borderWidth:0}]},options:{responsive:true,maintainAspectRatio:false,cutout:'68%',plugins:{legend:{position:'bottom'}}}});
  $('#recent').innerHTML=R.slice(0,4).map(r=>repRow(r)).join('');
  $('#alerts').innerHTML=S.filter(s=>s.status!=='available').map(s=>`<a class="alert-item" href="source-details.html?id=${s.id}"><div><b>${s.name}</b><small class="d-block text-muted">${s.city}</small></div>${badge(s.status)}</a>`).join('');
},
sources(){
  const S=getSources(),reg=[...new Set(S.map(s=>s.region))].sort(),typ=[...new Set(S.map(s=>s.type))].sort();
  $('#fRegion').innerHTML+=reg.map(r=>`<option>${r}</option>`).join('');$('#fType').innerHTML+=typ.map(r=>`<option>${r}</option>`).join('');
  const draw=()=>{const q=$('#fSearch').value.toLowerCase(),r=$('#fRegion').value,ty=$('#fType').value,st=$('#fStatus').value;
    const l=S.filter(s=>(!q||(s.name+s.city).toLowerCase().includes(q))&&(!r||s.region===r)&&(!ty||s.type===ty)&&(!st||s.status===st));
    $('#grid').innerHTML=l.length?l.map(card).join(''):empty();$('#count').textContent=l.length};
  $$('#fSearch,#fRegion,#fType,#fStatus').forEach(e=>e.addEventListener('input',draw));
  $('#fReset').onclick=()=>{$$('#fSearch,#fRegion,#fType,#fStatus').forEach(e=>e.value='');draw()};draw();
},
map(){
  const S=getSources(),m=osm('map',SL_CENTER,SL_ZOOM),layer=L.layerGroup().addTo(m);let f='all';const mk_={};
  const draw=()=>{layer.clearLayers();const l=S.filter(s=>f==='all'||s.status===f);
    l.forEach(s=>{mk_[s.id]=L.marker([s.lat,s.lng],{icon:pin(s.status)}).addTo(layer).bindPopup(`<b>${s.name}</b><br>${s.city} &middot; ${t('s_'+s.status)}<br>${t('level')} ${s.capacity}%<br><a href="source-details.html?id=${s.id}">${t('details')}</a>`)});
    $('#mapList').innerHTML=l.map(s=>`<button class="map-item" data-id="${s.id}"><span class="dot ${s.status}"></span><span><b>${s.name}</b><small class="d-block text-muted">${s.city}</small></span></button>`).join('')||empty();
    $$('.map-item').forEach(b=>b.onclick=()=>{const s=S.find(x=>x.id==b.dataset.id);m.flyTo([s.lat,s.lng],11);mk_[s.id].openPopup()})};
  $$('[data-f]').forEach(b=>b.onclick=()=>{f=b.dataset.f;$$('[data-f]').forEach(x=>x.classList.toggle('active',x===b));draw()});draw();
  $('#locate').onclick=()=>navigator.geolocation?navigator.geolocation.getCurrentPosition(p=>{const c=[p.coords.latitude,p.coords.longitude];m.flyTo(c,11);L.circleMarker(c,{color:C.blue,radius:9}).addTo(m).bindPopup(t('you_here')).openPopup()},()=>toast(t('msg_noloc'),'warning')):toast(t('msg_noloc'),'warning');
},
details(){
  const S=getSources(),s=S.find(x=>x.id==qs('id'))||S[0];document.title=s.name+' | BiyoRaad';
  $('#dName').textContent=s.name;$('#dLoc').innerHTML=`<i class="bi bi-geo-alt"></i> ${s.city}, ${s.region}`;$('#dBadge').innerHTML=badge(s.status);$('#dDesc').textContent=s.desc;
  const info=[['type',s.type],['quality',s.quality+'%'],['level',s.capacity+'%'],['hours',s.hours],['cost',s.cost],['coords',s.lat.toFixed(3)+', '+s.lng.toFixed(3)]];
  $('#dInfo').innerHTML=info.map(([k,v])=>`<div class="col-6"><div class="info-tile"><small>${t('i_'+k)}</small><b>${v}</b></div></div>`).join('');
  $('#dReport').href='report.html?source='+s.id;
  const m=osm('miniMap',[s.lat,s.lng],12);L.marker([s.lat,s.lng],{icon:pin(s.status)}).addTo(m);
  mk('chHist',{type:'bar',data:{labels:MONTHS,datasets:[{label:t('level')+' %',data:s.history,backgroundColor:STC[s.status],borderRadius:6}]},options:{responsive:true,maintainAspectRatio:false,scales:{y:{beginAtZero:true,max:100}},plugins:{legend:{display:false}}}});
  $('#dRel').innerHTML=S.filter(x=>x.id!==s.id&&x.region!==s.region).slice(0,3).map(card).join('');
  const rr=getReports().filter(r=>r.sourceId===s.id);$('#dReps').innerHTML=rr.length?rr.map(r=>`<li class="list-group-item d-flex justify-content-between"><span>${r.type} <small class="text-muted">${fmtDate(r.date)}</small></span>${rbadge(r.status)}</li>`).join(''):`<li class="list-group-item text-muted">${t('none')}</li>`;
},
report(){
  const S=getSources(),sel=$('#rSource');sel.innerHTML=S.map(s=>`<option value="${s.id}">${s.name} - ${s.city}</option>`).join('');
  if(qs('source'))sel.value=qs('source');
  const cur=()=>S.find(s=>s.id==sel.value),m=osm('pickMap',[cur().lat,cur().lng],10);let mkr=L.marker([cur().lat,cur().lng],{draggable:true}).addTo(m);
  const set=ll=>{mkr.setLatLng(ll);$('#rLat').value=ll.lat.toFixed(5);$('#rLng').value=ll.lng.toFixed(5)};
  set(mkr.getLatLng());m.on('click',e=>set(e.latlng));mkr.on('dragend',()=>set(mkr.getLatLng()));
  sel.onchange=()=>{m.flyTo([cur().lat,cur().lng],11);set(L.latLng(cur().lat,cur().lng))};
  $('#rPhoto').onchange=e=>{const f=e.target.files[0];const p=$('#rPrev');if(f){p.src=URL.createObjectURL(f);p.classList.remove('d-none')}};
  FORMS.reportForm=f=>{const R=getReports();R.unshift({id:Date.now(),user:'me',sourceId:+sel.value,type:$('#rType').value,severity:$('#rSev').value,status:'pending',date:new Date().toISOString().slice(0,10),desc:$('#rDesc').value});store.set('br_reports',R);toast(t('msg_reported'));setTimeout(()=>location.href='my-reports.html',1100)};
},
myreports(){
  const draw=()=>{const st=$('#mrFilter').value,R=getReports().filter(r=>r.user==='me'&&(!st||r.status===st));
    $('#mrBody').innerHTML=R.map(r=>`<tr><td>#${r.id%1000}</td><td>${fmtDate(r.date)}</td><td><a href="source-details.html?id=${r.sourceId}">${srcName(r.sourceId)}</a></td><td>${r.type}</td><td><span class="sev sev-${r.severity}">${t('sev_'+r.severity)}</span></td><td>${rbadge(r.status)}</td>
    <td class="text-end"><button class="btn btn-sm btn-light" data-view="${r.id}"><i class="bi bi-eye"></i></button> ${r.status==='pending'?`<button class="btn btn-sm btn-light text-danger" data-del="${r.id}"><i class="bi bi-trash"></i></button>`:''}</td></tr>`).join('')||`<tr><td colspan="7">${empty()}</td></tr>`;
    $$('[data-del]').forEach(b=>b.onclick=()=>{if(confirm(t('confirm_del'))){store.set('br_reports',getReports().filter(r=>r.id!=b.dataset.del));toast(t('msg_deleted'));draw()}});
    $$('[data-view]').forEach(b=>b.onclick=()=>{const r=getReports().find(x=>x.id==b.dataset.view);$('#vBody').innerHTML=`<p><b>${srcName(r.sourceId)}</b><br><span class="text-muted">${r.type} &middot; ${fmtDate(r.date)}</span></p><p>${r.desc}</p>${rbadge(r.status)}`;new bootstrap.Modal('#viewModal').show()})};
  $('#mrFilter').onchange=draw;draw();
},
profile(){
  const u=store.get('br_user',{name:'Amina Hassan',email:'amina@example.org',phone:'+252 63 555 0123',region:'Maroodi Jeex'});
  ['name','email','phone','region'].forEach(k=>$('#p_'+k).value=u[k]||'');
  $('#pAvatar').textContent=u.name.split(' ').map(w=>w[0]).slice(0,2).join('');$('#pName').textContent=u.name;$('#pEmail').textContent=u.email;
  $('#pReports').textContent=getReports().filter(r=>r.user==='me').length;
  FORMS.profileForm=f=>{const n={};['name','email','phone','region'].forEach(k=>n[k]=$('#p_'+k).value);store.set('br_user',n);toast(t('msg_saved'));$('#pName').textContent=n.name;$('#pEmail').textContent=n.email;buildSide()};
  FORMS.pwForm=f=>{f.reset();f.classList.remove('was-validated');toast(t('msg_pw'))};
},
admin(){
  const S=getSources(),R=getReports();$('#aSources').textContent=S.length;$('#aUsers').textContent=SL_STATS.users.toLocaleString();$('#aPending').textContent=R.filter(r=>r.status==='pending').length;$('#aResolved').textContent=R.filter(r=>r.status==='resolved').length;
  mk('chMonth',{type:'bar',data:{labels:MONTHS,datasets:[{label:t('nav_report'),data:[14,19,12,24,28,R.length+14],backgroundColor:C.blue,borderRadius:6},{label:t('r_resolved'),data:[11,15,10,20,23,R.filter(r=>r.status==='resolved').length+9],backgroundColor:C.teal,borderRadius:6}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom'}}}});
  const ty=[...new Set(S.map(s=>s.type))];
  mk('chTypes',{type:'doughnut',data:{labels:ty,datasets:[{data:ty.map(k=>S.filter(s=>s.type===k).length),backgroundColor:[C.blue,C.teal,C.aqua,C.amber,C.grey,'#06335f'],borderWidth:0}]},options:{responsive:true,maintainAspectRatio:false,cutout:'62%',plugins:{legend:{position:'bottom'}}}});
  $('#aRecent').innerHTML=R.slice(0,5).map(r=>`<tr><td>${r.user==='me'?'Amina Hassan':r.user}</td><td>${srcName(r.sourceId)}</td><td>${r.type}</td><td>${rbadge(r.status)}</td></tr>`).join('');
  $('#aAttn').innerHTML=S.filter(s=>s.status!=='available').map(s=>`<a class="alert-item" href="manage-sources.html"><div><b>${s.name}</b><small class="d-block text-muted">${s.city}</small></div>${badge(s.status)}</a>`).join('');
},
managesources(){
  let edit=null;const modal=new bootstrap.Modal('#srcModal');
  const draw=()=>{const q=$('#msSearch').value.toLowerCase(),S=getSources().filter(s=>(s.name+s.city+s.region).toLowerCase().includes(q));
    $('#msBody').innerHTML=S.map(s=>`<tr><td><b>${s.name}</b><small class="d-block text-muted">${s.type}</small></td><td>${s.city}, ${s.region}</td><td>${badge(s.status)}</td><td>${s.capacity}%</td><td>${s.quality}%</td>
    <td class="text-end text-nowrap"><button class="btn btn-sm btn-light" data-e="${s.id}"><i class="bi bi-pencil"></i></button> <button class="btn btn-sm btn-light text-danger" data-d="${s.id}"><i class="bi bi-trash"></i></button></td></tr>`).join('')||`<tr><td colspan="6">${empty()}</td></tr>`;
    $$('[data-e]').forEach(b=>b.onclick=()=>open(+b.dataset.e));
    $$('[data-d]').forEach(b=>b.onclick=()=>{if(confirm(t('confirm_del'))){store.set('br_sources',getSources().filter(s=>s.id!=b.dataset.d));toast(t('msg_deleted'));draw()}})};
  const F=['name','city','region','type','status','capacity','quality','lat','lng'];
  const open=id=>{edit=id;const s=id?getSources().find(x=>x.id===id):{name:'',city:'',region:'Maroodi Jeex',type:'Borehole',status:'available',capacity:50,quality:80,lat:9.56,lng:44.065};
    F.forEach(k=>$('#s_'+k).value=s[k]);$('#srcTitle').textContent=t(id?'edit':'add_source');modal.show()};
  $('#msAdd').onclick=()=>open(null);$('#msSearch').oninput=draw;
  FORMS.srcForm=f=>{const S=getSources(),o={};F.forEach(k=>o[k]=['capacity','quality','lat','lng'].includes(k)?+$('#s_'+k).value:$('#s_'+k).value);
    if(edit){Object.assign(S.find(s=>s.id===edit),o)}else{Object.assign(o,{id:Date.now()%100000,cost:'Free',hours:'24 hours',desc:'New water source added by admin.',history:[o.capacity,o.capacity,o.capacity,o.capacity,o.capacity,o.capacity]});S.unshift(o)}
    store.set('br_sources',S);modal.hide();toast(t('msg_saved'));draw()};
  $('#msReset').onclick=()=>{localStorage.removeItem('br_sources');draw();toast(t('msg_reset'))};draw();
},
managereports(){
  const draw=()=>{const st=$('#mrStatus').value,q=$('#mrSearch').value.toLowerCase(),R=getReports().filter(r=>(!st||r.status===st)&&(!q||(r.user+srcName(r.sourceId)+r.type).toLowerCase().includes(q)));
    $('#mrBody').innerHTML=R.map(r=>`<tr><td>${fmtDate(r.date)}</td><td>${r.user==='me'?'Amina Hassan':r.user}</td><td>${srcName(r.sourceId)}</td><td>${r.type}<small class="d-block text-muted">${r.desc}</small></td><td><span class="sev sev-${r.severity}">${t('sev_'+r.severity)}</span></td>
    <td><select class="form-select form-select-sm st-sel" data-id="${r.id}">${['pending','investigating','resolved'].map(s=>`<option value="${s}" ${s===r.status?'selected':''}>${t('r_'+s)}</option>`).join('')}</select></td>
    <td class="text-end"><button class="btn btn-sm btn-light text-danger" data-d="${r.id}"><i class="bi bi-trash"></i></button></td></tr>`).join('')||`<tr><td colspan="7">${empty()}</td></tr>`;
    $$('.st-sel').forEach(s=>s.onchange=()=>{const A=getReports();A.find(r=>r.id==s.dataset.id).status=s.value;store.set('br_reports',A);toast(t('msg_updated'))});
    $$('[data-d]').forEach(b=>b.onclick=()=>{if(confirm(t('confirm_del'))){store.set('br_reports',getReports().filter(r=>r.id!=b.dataset.d));toast(t('msg_deleted'));draw()}})};
  $$('#mrStatus,#mrSearch').forEach(e=>e.addEventListener('input',draw));draw();
},
about(){
  const S=getSources();$('#abSources').textContent=S.length;$('#abRegions').textContent=new Set(S.map(x=>x.region)).size;$('#abResolved').textContent=(SL_STATS.resolvedBase+getReports().filter(r=>r.status==='resolved').length)+'+';
},
contact(){
  const OFF=[9.5610,44.0640];const m=osm('offMap',OFF,13);L.marker(OFF,{icon:pin('available')}).addTo(m).bindPopup('BiyoRaad HQ');
  FORMS.contactForm=f=>{f.reset();f.classList.remove('was-validated');toast(t('msg_sent'))};
}
};
document.addEventListener('DOMContentLoaded',()=>{const p=PAGES[document.body.dataset.page];if(p)p();applyI18n()});
