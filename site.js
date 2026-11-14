
(function(){
  var root=document.documentElement;root.classList.add('js');
  var views=document.querySelectorAll('[data-view]');
  function show(name,then){
    views.forEach(function(v){v.classList.toggle('on',v.getAttribute('data-view')===name)});
    var t=then&&document.getElementById(then);
    if(t){t.scrollIntoView()}else{window.scrollTo(0,0)}
    document.querySelectorAll('[data-slider]').forEach(function(b){b.dispatchEvent(new Event('sync'))});
  }
  document.addEventListener('click',function(e){
    var a=e.target.closest('[data-go]');if(!a)return;e.preventDefault();
    var name=a.getAttribute('data-go');show(name,a.getAttribute('data-then'));
    try{history.replaceState(null,'',name==='home'?'#':'#'+name)}catch(x){}
  });
  var h0=location.hash.slice(1),t0=h0&&document.getElementById(h0);
  var v0=t0&&t0.closest('[data-view]');if(v0&&v0.getAttribute('data-view')!=='home')show(v0.getAttribute('data-view'),t0===v0?null:h0);
  // method steps: pick a step, see it in the case
  var steps=document.querySelectorAll('.step'),egs=document.querySelectorAll('.eg-item');
  function setStep(i){steps.forEach(function(x,j){x.setAttribute('aria-pressed',j===i)});egs.forEach(function(e,j){e.classList.toggle('on',j===i)})}
  steps.forEach(function(b){b.addEventListener('click',function(){setStep(+b.getAttribute('data-i'))})});
  document.querySelectorAll('[data-slider]').forEach(function(box){
    var t=box.querySelector('.s-track'),sl=t.children,p=box.querySelector('.s-prev'),n=box.querySelector('.s-next'),c=box.querySelector('.s-count');
    function step(){return sl[0]?sl[0].getBoundingClientRect().width+16:1}
    function per(){return Math.max(1,Math.round(t.clientWidth/step()))}
    function idx(){return Math.round(t.scrollLeft/step())}
    function upd(){var i=idx(),last=Math.max(0,sl.length-per());c.textContent=(Math.min(i,last)+1)+' / '+(last+1);p.disabled=i<=0;n.disabled=i>=last}
    p.addEventListener('click',function(){t.scrollTo({left:(idx()-1)*step()})});
    n.addEventListener('click',function(){t.scrollTo({left:(idx()+1)*step()})});
    t.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){e.preventDefault();n.click()}if(e.key==='ArrowLeft'){e.preventDefault();p.click()}});
    var r;t.addEventListener('scroll',function(){cancelAnimationFrame(r);r=requestAnimationFrame(upd)},{passive:true});
    addEventListener('resize',upd);box.addEventListener('sync',upd);upd();
  });
  // motion, skipped when the reader has asked for reduced motion
  if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion:reduce)').matches){
    var rv=document.querySelectorAll('.pcard,.also,.ctx>div,.blist li,.screen .col,.gap,.quotes blockquote,.case-end');
    var ro=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');ro.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});
    rv.forEach(function(el){el.classList.add('rv');ro.observe(el)});
    function fmt(n){return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,',')}
    var co=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;co.unobserve(e.target);
      var el=e.target,full=el.textContent,m=full.match(/^(\D*?)(?:([\d,]+)( to ))?([\d,]+)(\D*)$/);if(!m)return;
      var from=m[2]?+m[2].replace(/,/g,''):0,to=+m[4].replace(/,/g,''),pre=m[1]+(m[2]?m[2]+m[3]:''),t0=null;if(to===from)return;
      function tick(t){if(t0===null)t0=t;var k=Math.min(1,(t-t0)/1100),v=Math.round(from+(to-from)*(1-Math.pow(1-k,3)));
        el.textContent=pre+fmt(v)+m[5];if(k<1)requestAnimationFrame(tick);else el.textContent=full}
      requestAnimationFrame(tick)})},{threshold:.6});
    document.querySelectorAll('.measures b,.metric b').forEach(function(el){co.observe(el)});
  }
  var b=document.getElementById('copy'),em=document.getElementById('email');
  b.addEventListener('click',function(){
    function sel(){var r=document.createRange();r.selectNodeContents(em);var s=getSelection();s.removeAllRanges();s.addRange(r);b.textContent='Selected, press Ctrl+C'}
    try{navigator.clipboard.writeText(em.textContent).then(function(){b.textContent='Copied'},sel)}catch(x){sel()}
    setTimeout(function(){b.textContent='Copy email'},2500);
  });
})();
