/* AurelyStudio — install, offline readiness and English date controls. */
(() => {
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  function englishDates() {
    document.querySelectorAll('input[type="month"],input[type="date"]').forEach(input => {
      const withDay=input.type==='date', initial=input.value.split('-');
      let browseYear=+initial[0]||new Date().getFullYear(),browseMonth=+initial[1]||new Date().getMonth()+1;
      const group=document.createElement('span');group.className='english-date';
      const label=input.getAttribute('aria-label')||input.parentElement.textContent.trim()||'Date';
      const trigger=document.createElement('button');trigger.type='button';trigger.className='date-trigger';trigger.setAttribute('aria-expanded','false');
      const popup=document.createElement('span');popup.className='date-popover';popup.hidden=true;popup.setAttribute('role','group');popup.setAttribute('aria-label',label+' calendar');
      input.type='hidden';input.before(group);group.append(trigger,popup);
      function updateLabel(){const v=input.value.split('-');trigger.textContent=input.value?months[+v[1]-1]+(withDay?' '+Number(v[2])+',':'')+' '+v[0]+' ▾':withDay?'Choose date ▾':'Choose month ▾';trigger.setAttribute('aria-label',label+': '+trigger.textContent.replace(' ▾',''));}
      function close(){popup.hidden=true;trigger.setAttribute('aria-expanded','false');}
      function choose(value){input.value=value;updateLabel();close();trigger.focus();input.dispatchEvent(new Event('change',{bubbles:true}));}
      function action(text,fn,cls=''){const b=document.createElement('button');b.type='button';b.textContent=text;b.className=cls;b.addEventListener('click',e=>{e.preventDefault();fn();});return b;}
      function paint(){
        popup.replaceChildren();const head=document.createElement('span');head.className='date-picker-head';
        function move(step){if(withDay){browseMonth+=step;if(browseMonth<1){browseMonth=12;browseYear--;}if(browseMonth>12){browseMonth=1;browseYear++;}}else browseYear+=step;browseYear=Math.max(1000,Math.min(9999,browseYear));paint();}
        const prev=action('‹',()=>move(-1));prev.setAttribute('aria-label',withDay?'Previous month':'Previous year');head.append(prev);
        if(withDay){const m=document.createElement('select');m.setAttribute('aria-label','Calendar month');months.forEach((name,i)=>m.add(new Option(name,String(i+1))));m.value=String(browseMonth);m.addEventListener('change',e=>{e.stopPropagation();browseMonth=+m.value;paint();});head.append(m);}
        const y=document.createElement('input');y.type='number';y.min='1000';y.max='9999';y.value=String(browseYear);y.setAttribute('aria-label','Calendar year');
        y.addEventListener('input',e=>{e.stopPropagation();if(/^\d{4}$/.test(y.value)&&y.checkValidity()){browseYear=+y.value;paintGrid();}});y.addEventListener('change',e=>{e.stopPropagation();if(!/^\d{4}$/.test(y.value)||!y.checkValidity()){y.value=String(browseYear);toast('Enter a year from 1000 to 9999.');}});head.append(y);
        const next=action('›',()=>move(1));next.setAttribute('aria-label',withDay?'Next month':'Next year');head.append(next);popup.append(head);
        const grid=document.createElement('span');grid.className=withDay?'date-day-grid':'date-month-grid';popup.append(grid);
        function paintGrid(){grid.replaceChildren();const prefix=browseYear+'-'+String(browseMonth).padStart(2,'0');
          if(withDay){['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].forEach(name=>{const s=document.createElement('span');s.textContent=name;grid.append(s);});const offset=(new Date(browseYear,browseMonth-1,1).getDay()+6)%7;for(let i=0;i<offset;i++)grid.append(document.createElement('span'));const count=new Date(browseYear,browseMonth,0).getDate();for(let i=1;i<=count;i++){const value=prefix+'-'+String(i).padStart(2,'0');const b=action(String(i),()=>choose(value));b.setAttribute('aria-label',months[browseMonth-1]+' '+i+', '+browseYear);b.setAttribute('aria-pressed',String(input.value===value));grid.append(b);}}
          else months.forEach((name,i)=>{const value=browseYear+'-'+String(i+1).padStart(2,'0');const b=action(name,()=>choose(value));b.setAttribute('aria-pressed',String(input.value===value));grid.append(b);});
        }
        paintGrid();const foot=document.createElement('span');foot.className='date-picker-foot';foot.append(action('Clear',()=>choose('')),action('Today',()=>choose(localDate().slice(0,withDay?10:7))));popup.append(foot);
      }
      trigger.addEventListener('click',e=>{e.preventDefault();const opening=popup.hidden;document.querySelectorAll('.date-popover').forEach(p=>p.hidden=true);document.querySelectorAll('.date-trigger').forEach(b=>b.setAttribute('aria-expanded','false'));if(opening){const v=input.value.split('-');browseYear=+v[0]||new Date().getFullYear();browseMonth=+v[1]||new Date().getMonth()+1;paint();popup.hidden=false;popup.style.left='0px';popup.style.left=Math.min(0,window.innerWidth-12-popup.getBoundingClientRect().right)+'px';trigger.setAttribute('aria-expanded','true');}else close();});
      group.addEventListener('keydown',e=>{if(e.key==='Escape'&&!popup.hidden){e.preventDefault();e.stopPropagation();close();trigger.focus();}});updateLabel();
    });
  }
  document.addEventListener('click',e=>{document.querySelectorAll('.english-date').forEach(g=>{if(!g.contains(e.target)){g.querySelector('.date-popover').hidden=true;g.querySelector('.date-trigger').setAttribute('aria-expanded','false');}});});
  const originalRender=render;render=function(...args){originalRender(...args);englishDates();};
  const originalDialog=showDialog;showDialog=function(...args){originalDialog(...args);englishDates();};englishDates();
  const bar=document.createElement('section');bar.className='install-bar';bar.setAttribute('aria-label','App installation and offline access');
  bar.innerHTML='<div><strong>Your planner, with you</strong><small id="offline-status" role="status">Preparing offline access…</small></div><div class="install-actions"><button data-action="offline-retry" hidden>Retry offline download</button><button class="primary" data-action="install-center">Install app</button></div>';
  document.querySelector('.workspace > header').after(bar);
  const installed=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
  function updateInstall(){bar.querySelector('[data-action="install-center"]').textContent=installed()?'App installed':'Install app';}
  function installHelp(){showDialog('Your planner on every device',`<p>Keep your Halloween planner on your home screen or desktop.</p><div class="install-guide">${installed()?'<p><strong>This device is running the installed app.</strong></p>':installPrompt?'<button class="primary" data-action="install-native">Install on this device</button>':''}<section><h3>iPhone & iPad</h3><p>Open this link in Safari. Tap Share, then Add to Home Screen, then Add. If offered, keep Open as Web App enabled.</p></section><section><h3>Android phones & tablets</h3><p>Open in Chrome. Tap Install app here when available, or use the browser menu → Install app / Add to Home screen.</p></section><section><h3>Windows & Mac computers</h3><p>Open in Chrome or Edge. Use Install app here when available, or the install option in the browser address bar or menu.</p></section></div><p class="instructions">Keep the app open online until “All images & PDFs ready offline” appears. Then you can use it without internet. Each device saves its own plans; use Settings & Backup to move them. Clearing browser storage removes offline files.</p>`);}
  async function requestInstall(){if(installed()||!installPrompt){installHelp();return;}const prompt=installPrompt;installPrompt=null;try{await prompt.prompt();const choice=await prompt.userChoice;if(choice.outcome==='accepted')toast('Installation requested. Confirm any remaining device prompt.');else installHelp();}catch{installHelp();}updateInstall();}
  document.addEventListener('click',e=>{const action=e.target.closest('[data-action]')?.dataset.action;if(['install','install-center','install-native'].includes(action)){e.preventDefault();e.stopImmediatePropagation();requestInstall();}else if(action==='offline-retry'){prepareOffline();}},true);
  window.addEventListener('appinstalled',()=>{updateInstall();toast('App installed.');});
  matchMedia('(display-mode: standalone)').addEventListener('change',updateInstall);updateInstall();
  const status=bar.querySelector('#offline-status'),retry=bar.querySelector('[data-action="offline-retry"]');
  function showOffline(data){if(data.type!=='OFFLINE_PROGRESS')return;status.textContent=data.done===data.total?'All images & PDFs ready offline':data.failed?`Offline download incomplete (${data.done}/${data.total}). Reconnect and retry.`:`Preparing offline: ${data.done}/${data.total} files`;retry.hidden=!data.failed;}
  async function prepareOffline(){if(!('serviceWorker'in navigator)||!['https:','http:'].includes(location.protocol)){status.textContent='Open the hosted link for installation and offline access.';return;}try{const reg=await navigator.serviceWorker.ready;reg.active?.postMessage({type:'PREPARE_OFFLINE'});}catch{status.textContent='Offline access unavailable. Check browser storage.';}}
  if('serviceWorker'in navigator){navigator.serviceWorker.addEventListener('message',e=>showOffline(e.data));navigator.serviceWorker.addEventListener('controllerchange',prepareOffline);}
  window.addEventListener('online',prepareOffline);setTimeout(prepareOffline,1500);
  if(new URL(location.href).searchParams.get('install')==='1')installHelp();
})();
