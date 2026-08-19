(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function e(e){if(typeof e!=`object`||!e)return!1;let t=Object.getPrototypeOf(e);return t!==null&&t!==Object.prototype&&Object.getPrototypeOf(t)!==null||Symbol.iterator in e?!1:Symbol.toStringTag in e?Object.prototype.toString.call(e)===`[object Module]`:!0}function t(n,r,i=`.`,a){if(!e(r))return t(n,{},i,a);let o={...r};for(let r of Object.keys(n)){if(r===`__proto__`||r===`constructor`)continue;let s=n[r];s!=null&&(a&&a(o,r,s,i)||(o[r]=Array.isArray(s)&&Array.isArray(o[r])?[...s,...o[r]]:e(s)&&e(o[r])?t(s,o[r],(i?`${i}.`:``)+r.toString(),a):s))}return o}function n(e){return(...n)=>n.reduce((n,r)=>t(n,r,``,e),{})}var r=n();function i(e){let t=new Set,n=e,r=n;return{get value(){return n},set value(e){if(n!==e){n=e;for(let e of t)e(n,r);r=n}},watch(e,r={}){return t.add(e),r.immediate&&e(n),()=>{t.delete(e)}},async toMatch(e){return await new Promise(t=>{let n=this.watch(async(r,i)=>{await e(r,i)&&(n(),t())},{immediate:!0})})},async toBe(e){return await this.toMatch(t=>t===e)}}}var a=[];for(let e=0;e<256;++e)a.push((e+256).toString(16).slice(1));function o(e,t=0){return(a[e[t+0]]+a[e[t+1]]+a[e[t+2]]+a[e[t+3]]+`-`+a[e[t+4]]+a[e[t+5]]+`-`+a[e[t+6]]+a[e[t+7]]+`-`+a[e[t+8]]+a[e[t+9]]+`-`+a[e[t+10]]+a[e[t+11]]+a[e[t+12]]+a[e[t+13]]+a[e[t+14]]+a[e[t+15]]).toLowerCase()}var s=new Uint8Array(16);function c(){return crypto.getRandomValues(s)}var l={};function u(e,t,n){let r;if(e)r=f(e.random??e.rng?.()??c(),e.msecs,e.seq,t,n);else{let e=Date.now(),i=c();d(l,e,i),r=f(i,l.msecs,l.seq,t,n)}return t??o(r)}function d(e,t,n){return e.msecs??=-1/0,e.seq??=0,t>e.msecs?(e.seq=n[6]<<23|n[7]<<16|n[8]<<8|n[9],e.msecs=t):(e.seq=e.seq+1|0,e.seq===0&&e.msecs++),e}function f(e,t,n,r,i=0){if(e.length<16)throw Error(`Random bytes length must be >= 16`);if(!r)r=new Uint8Array(16),i=0;else if(i<0||i+16>r.length)throw RangeError(`UUID byte range ${i}:${i+15} is out of buffer bounds`);return t??=Date.now(),n??=e[6]*127<<24|e[7]<<16|e[8]<<8|e[9],r[i++]=t/1099511627776&255,r[i++]=t/4294967296&255,r[i++]=t/16777216&255,r[i++]=t/65536&255,r[i++]=t/256&255,r[i++]=t&255,r[i++]=112|n>>>28&15,r[i++]=n>>>20&255,r[i++]=128|n>>>14&63,r[i++]=n>>>6&255,r[i++]=n<<2&255|e[10]&3,r[i++]=e[11],r[i++]=e[12],r[i++]=e[13],r[i++]=e[14],r[i++]=e[15],r}var p=`modulepreload`,m=function(e){return`/ghoulscript/`+e},h={},g=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e=document.getElementsByTagName(`link`),i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}function s(e){return import.meta.resolve?import.meta.resolve(e):new URL(e,import.meta.url).href}r=o(t.map(t=>{if(t=m(t,n),t=s(t),t in h)return;h[t]=!0;let r=t.endsWith(`.css`);for(let n=e.length-1;n>=0;n--){let i=e[n];if(i.href===t&&(!r||i.rel===`stylesheet`))return}let i=document.createElement(`link`);if(i.rel=r?`stylesheet`:p,r||(i.as=`script`),i.crossOrigin=``,i.href=t,a&&i.setAttribute(`nonce`,a),document.head.appendChild(i),r)return new Promise((e,n)=>{i.addEventListener(`load`,e),i.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${t}`)))})}))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})},_={useWorker:typeof window<`u`&&!!window.Worker};function v(){return _}var y=i(),b=i(!1);async function x(){if(b.value&&await b.toBe(!1),!y.value){b.value=!0;try{let{default:e}=await g(async()=>{let{default:e}=await import(`./worker-CLgv7ZHo-Bv5fWA7i.js`);return{default:e}},[]);y.value=new e({name:`rpc-worker`})}finally{b.value=!1}}return y.value}async function S(e,t){let n=u(),r=await x();return await new Promise((i,a)=>{let o=e=>{e.data.id===n&&(c(),e.data.error?a(e.data.error):i(e.data.result))},s=e=>{c(),a(e)},c=()=>{r.removeEventListener(`message`,o),r.removeEventListener(`error`,s)};r.addEventListener(`message`,o),r.addEventListener(`error`,s),r.postMessage({jsonrpc:`2.0`,id:n,method:e,params:t})})}async function C(e,t){return(await g(async()=>{let{callRPC:e}=await import(`./call-D356AZYz-BX7_DcHU.js`);return{callRPC:e}},[])).callRPC(e,t)}async function w(e,t){return v().useWorker?S(e,t):C(e,t)}var T=async(...e)=>await w(`optimizePDF`,e),E=async(...e)=>await w(`combinePDF`,e),D=async(...e)=>await w(`splitPdf`,e),O=async(...e)=>await w(`addPassword`,e),k=async(...e)=>await w(`removePassword`,e),A=async(...e)=>await w(`renderPageAsImage`,e),j=async(...e)=>await w(`getInfo`,e),M=async(...e)=>await w(`isRequirePassword`,e);function N(e,t=2,n=1024){if(e===0)return`0 Bytes`;let r=[`${e===1?`Byte`:`Bytes`}`,`KB`,`MB`,`GB`,`TB`,`PB`,`EB`,`ZB`,`YB`],i=Math.floor(Math.log(e)/Math.log(n));return`${Number.parseFloat((e/n**+i).toFixed(t))} ${r[i]}`}function P(e,t){e&&(e.innerHTML=`<div class="error-msg">${I(t)}</div>`)}function F(e,t=`Processing…`){e&&(e.innerHTML=`<div class="loading">${t}</div>`)}function I(e){return e.replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`)}function L(e,t){let n=e.querySelector(`input[type="file"]`);n.addEventListener(`change`,()=>{let e=n.files?.[0];e&&t(e)}),e.addEventListener(`dragover`,t=>{t.preventDefault(),e.classList.add(`drag-over`)}),e.addEventListener(`dragleave`,()=>{e.classList.remove(`drag-over`)}),e.addEventListener(`drop`,n=>{n.preventDefault(),e.classList.remove(`drag-over`);let r=n.dataTransfer?.files?.[0];r&&t(r)})}function R(){let e=document.createElement(`div`);e.className=`card`,e.innerHTML=`
    <h3>Optimize PDF</h3>
    <div class="drop-zone">
      <input type="file" accept="application/pdf">
      <div class="drop-zone-label">
        Drop a PDF here or <strong>click to browse</strong>
      </div>
    </div>
    <div id="result"></div>
  `;let t=e.querySelector(`.drop-zone`),n=e.querySelector(`#result`);return L(t,async e=>{F(n,`Optimizing PDF…`);try{let t=performance.now(),r=await T(e),i=((performance.now()-t)/1e3).toFixed(2),a=e.size-r.byteLength,o=Math.round(a/e.size*100),s=URL.createObjectURL(new Blob([r],{type:`application/pdf`}));n.innerHTML=`
        <div class="result">
          <div>${N(e.size)} &rarr; ${N(r.byteLength)} (${o>0?`−`:`+`}${Math.abs(o)}%)</div>
          <div style="color:var(--text-muted);font-size:0.75rem;margin-top:4px">${i}s</div>
          <div style="margin-top:8px"><a href="${s}" download="optimized.pdf" class="btn" onclick="URL.revokeObjectURL(this.href)">Download optimized PDF</a></div>
        </div>
      `}catch(e){P(n,String(e))}}),e}function z(){let e=document.createElement(`div`);e.className=`card`,e.innerHTML=`
    <h3>Combine PDFs</h3>
    <div class="drop-zone">
      <input type="file" accept="application/pdf" multiple>
      <div class="drop-zone-label">
        Drop <strong>one or more PDFs</strong> here or <strong>click to browse</strong>
      </div>
    </div>
    <div id="result"></div>
  `;let t=e.querySelector(`.drop-zone`),n=e.querySelector(`#result`);return L(t,async e=>{let r=[...t.querySelector(`input[type="file"]`).files??[]].filter(e=>e.type===`application/pdf`||e.name.endsWith(`.pdf`));if(r.length===0){P(n,`No PDF files selected`);return}F(n,`Combining PDFs…`);try{let e=await E(r),t=await j(e),i=URL.createObjectURL(new Blob([e],{type:`application/pdf`}));n.innerHTML=`
        <div class="result">
          <div>Combined: ${t.numPages} pages — ${N(e.byteLength)}</div>
          <div style="margin-top:8px"><a href="${i}" download="combined.pdf" class="btn" onclick="URL.revokeObjectURL(this.href)">Download</a></div>
        </div>
      `}catch(e){P(n,String(e))}}),e}function B(){let e=document.createElement(`div`);e.className=`card`,e.innerHTML=`
    <h3>Split PDF</h3>
    <div class="drop-zone">
      <input type="file" accept="application/pdf">
      <div class="drop-zone-label">
        Drop a PDF here or <strong>click to browse</strong>
      </div>
    </div>
    <div class="field" style="margin-top:12px">
      <label for="page-ranges">Page ranges (e.g. 1-3, 5, 7-9)</label>
      <input type="text" id="page-ranges" placeholder="1-3, 5, 7-9">
    </div>
    <button class="btn btn-secondary" id="split-btn">Split</button>
    <div id="result"></div>
  `;let t=e.querySelector(`.drop-zone`),n=e.querySelector(`#result`),r=e.querySelector(`#page-ranges`),i=e.querySelector(`#split-btn`),a;return L(t,e=>{a=e,n.innerHTML=``}),i.addEventListener(`click`,async()=>{if(!a){P(n,`Please select a PDF first`);return}let e=r.value.trim();if(!e){P(n,`Enter page ranges`);return}let t=e.split(`,`).map(e=>e.trim());F(n,`Splitting PDF…`);try{let e=(await D(a,t,{})).map((e,t)=>`<a href="${URL.createObjectURL(new Blob([e],{type:`application/pdf`}))}" download="split-${t+1}.pdf" class="btn" onclick="URL.revokeObjectURL(this.href)">Split ${t+1} (${N(e.byteLength)})</a>`).join(``);n.innerHTML=`<div class="result"><output-links>${e}</output-links></div>`}catch(e){P(n,String(e))}}),e}function V(){let e=document.createElement(`div`);e.className=`card`,e.innerHTML=`
    <h3>Encrypt PDF</h3>
    <div class="drop-zone">
      <input type="file" accept="application/pdf">
      <div class="drop-zone-label">
        Drop a PDF here or <strong>click to browse</strong>
      </div>
    </div>
    <div class="field" style="margin-top:12px">
      <label for="user-pass">User password</label>
      <input type="password" id="user-pass">
    </div>
    <div class="field">
      <label for="owner-pass">Owner password (optional)</label>
      <input type="password" id="owner-pass">
    </div>
    <button class="btn" id="encrypt-btn">Encrypt</button>
    <div id="result"></div>
  `;let t=e.querySelector(`.drop-zone`),n=e.querySelector(`#result`),r=e.querySelector(`#user-pass`),i=e.querySelector(`#owner-pass`),a=e.querySelector(`#encrypt-btn`),o;return L(t,e=>{o=e,n.innerHTML=``}),a.addEventListener(`click`,async()=>{if(!o){P(n,`Please select a PDF first`);return}let e=r.value;if(!e){P(n,`Enter a user password`);return}F(n,`Encrypting PDF…`);try{let t=await O(o,e,i.value||void 0),r=await M(t),a=URL.createObjectURL(new Blob([t],{type:`application/pdf`}));n.innerHTML=`
        <div class="result">
          <div>Encrypted &mdash; ${r?`<span class="status-badge true">Requires password</span>`:`<span class="status-badge false">Not locked</span>`}</div>
          <div style="margin-top:8px"><a href="${a}" download="encrypted.pdf" class="btn" onclick="URL.revokeObjectURL(this.href)">Download</a></div>
        </div>
      `}catch(e){P(n,String(e))}}),e}function H(){let e=document.createElement(`div`);e.className=`card`,e.innerHTML=`
    <h3>Decrypt PDF</h3>
    <div class="drop-zone">
      <input type="file" accept="application/pdf">
      <div class="drop-zone-label">
        Drop a PDF here or <strong>click to browse</strong>
      </div>
    </div>
    <div class="field" style="margin-top:12px">
      <label for="decrypt-pass">Password</label>
      <input type="password" id="decrypt-pass" placeholder="123456">
    </div>
    <button class="btn" id="decrypt-btn">Remove password</button>
    <div id="result"></div>
  `;let t=e.querySelector(`.drop-zone`),n=e.querySelector(`#result`),r=e.querySelector(`#decrypt-pass`),i=e.querySelector(`#decrypt-btn`),a;return L(t,e=>{a=e,n.innerHTML=``}),i.addEventListener(`click`,async()=>{if(!a){P(n,`Please select a PDF first`);return}let e=r.value;if(!e){P(n,`Enter the password`);return}F(n,`Removing password…`);try{let t=await k(a,e),r=await M(t),i=URL.createObjectURL(new Blob([t],{type:`application/pdf`}));n.innerHTML=`
        <div class="result">
          <div>Decrypted &mdash; ${r?`<span class="status-badge true">Still requires password</span>`:`<span class="status-badge false">No password required</span>`}</div>
          <div style="margin-top:8px"><a href="${i}" download="decrypted.pdf" class="btn" onclick="URL.revokeObjectURL(this.href)">Download</a></div>
        </div>
      `}catch(e){P(n,String(e))}}),e}function U(){let e=document.createElement(`div`);e.className=`card`,e.innerHTML=`
    <h3>Render PDF Page as Image</h3>
    <div class="drop-zone">
      <input type="file" accept="application/pdf">
      <div class="drop-zone-label">
        Drop a PDF here or <strong>click to browse</strong>
      </div>
    </div>
    <div class="field" style="margin-top:12px">
      <label for="page-num">Page number</label>
      <input type="number" id="page-num" value="1" min="1">
    </div>
    <div class="field">
      <label for="format">Format</label>
      <select id="format">
        <option value="jpg">JPG</option>
        <option value="png">PNG</option>
      </select>
    </div>
    <div class="field">
      <label for="resolution">Resolution (DPI)</label>
      <input type="number" id="resolution" value="96" min="16" max="600" step="16">
    </div>
    <button class="btn" id="render-btn">Render</button>
    <div id="result"></div>
  `;let t=e.querySelector(`.drop-zone`),n=e.querySelector(`#result`),r=e.querySelector(`#page-num`),i=e.querySelector(`#format`),a=e.querySelector(`#resolution`),o=e.querySelector(`#render-btn`),s;return L(t,e=>{s=e,n.innerHTML=``}),o.addEventListener(`click`,async()=>{if(!s){P(n,`Please select a PDF first`);return}F(n,`Rendering page…`);try{let e=Number.parseInt(r.value,10)||1,t=i.value,o=Number.parseInt(a.value,10)||96,c=await A(s,e,{format:t,resolution:o}),l=t===`png`?`image/png`:`image/jpeg`,u=t,d=URL.createObjectURL(new Blob([c],{type:l})),f=document.createElement(`img`);f.src=d,f.alt=`Page ${e}`,f.style.maxWidth=`100%`;let p=document.createElement(`a`);p.href=d,p.download=`page-${e}.${u}`,p.textContent=`Download .${u}`,p.className=`btn btn-secondary`,p.addEventListener(`click`,()=>URL.revokeObjectURL(d));let m=document.createElement(`span`);m.textContent=` ${N(c.byteLength)}`,m.style.color=`var(--text-muted)`,m.style.fontSize=`0.75rem`,n.innerHTML=``,n.append(f),n.append(document.createElement(`br`)),n.append(p),n.append(m)}catch(e){P(n,String(e))}}),e}function W(){let e=document.createElement(`div`);e.className=`card`,e.innerHTML=`
    <h3>Get PDF Info</h3>
    <div class="drop-zone">
      <input type="file" accept="application/pdf">
      <div class="drop-zone-label">
        Drop a PDF here or <strong>click to browse</strong>
      </div>
    </div>
    <div class="field" style="margin-top:12px">
      <label for="info-pass">Password (if protected)</label>
      <input type="password" id="info-pass">
    </div>
    <div id="result"></div>
  `;let t=e.querySelector(`.drop-zone`),n=e.querySelector(`#result`),r=e.querySelector(`#info-pass`);return L(t,async e=>{F(n,`Reading metadata…`),n.innerHTML=``;try{let t=await j(e,r.value?{password:r.value}:{}),i=document.createElement(`table`);i.innerHTML=`
        <thead>
          <tr><th>Page</th><th>Width (pt)</th><th>Height (pt)</th></tr>
        </thead>
        <tbody>
          ${t.pages.map(e=>`<tr><td>${e.page}</td><td>${e.width}</td><td>${e.height}</td></tr>`).join(``)}
        </tbody>
      `,n.innerHTML=`
        <div class="result">
          <div>Pages: <strong>${t.numPages}</strong></div>
          ${i.outerHTML}
        </div>
      `}catch(e){P(n,String(e))}}),e}function G(){let e=document.createElement(`div`);e.className=`card`,e.innerHTML=`
    <h3>Check Password Lock</h3>
    <div class="drop-zone">
      <input type="file" accept="application/pdf">
      <div class="drop-zone-label">
        Drop a PDF here or <strong>click to browse</strong>
      </div>
    </div>
    <div id="result"></div>
  `;let t=e.querySelector(`.drop-zone`),n=e.querySelector(`#result`);return L(t,async e=>{F(n,`Checking…`);try{let t=await M(e);n.innerHTML=``;let r=document.createElement(`div`);r.className=`result`,r.style.textAlign=`center`,r.style.padding=`24px`;let i=document.createElement(`span`);i.className=`status-badge ${t?`true`:`false`}`,i.textContent=t?`REQUIRES PASSWORD`:`NOT LOCKED`;let a=document.createElement(`div`);a.style.marginTop=`8px`,a.style.fontSize=`0.75rem`,a.style.color=`var(--text-muted)`,a.textContent=e.name,r.append(i),r.append(a),n.append(r)}catch(e){P(n,String(e))}}),e}var K=document.querySelector(`#tabs`),q=document.querySelector(`#panels`),J=document.querySelector(`#timer`),Y=[{label:`Optimize`,create:R},{label:`Combine`,create:z},{label:`Split`,create:B},{label:`Encrypt`,create:V},{label:`Decrypt`,create:H},{label:`Render`,create:U},{label:`Info`,create:W},{label:`Lock Check`,create:G}];for(let[e,t]of Y.entries()){let n=document.createElement(`button`);n.className=`tab-btn${e===0?` active`:``}`,n.textContent=t.label,n.dataset.target=t.label;let r=t.create();r.className=`panel${e===0?` active`:``}`,n.addEventListener(`click`,()=>{for(let e of K.querySelectorAll(`.tab-btn`))e.classList.remove(`active`);for(let e of q.querySelectorAll(`.panel`))e.classList.remove(`active`);n.classList.add(`active`),r.classList.add(`active`)}),K.append(n),q.append(r)}setInterval(()=>{J&&(J.textContent=new Date().toString())},1e3);export{r as n,g as t};