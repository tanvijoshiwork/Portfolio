
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
    try{history.replaceState(null,'',name==='case'?'#master-components':'#')}catch(x){}
  });
  var h0=location.hash.slice(1),t0=h0&&document.getElementById(h0);
  if(t0&&t0.closest('[data-view="case"]'))show('case',h0==='master-components'?null:h0);
  // method steps: pick a step, see it in the case
  var steps=document.querySelectorAll('.step'),egs=document.querySelectorAll('.eg-item');
  steps.forEach(function(b){b.addEventListener('click',function(){var i=+b.getAttribute('data-i');
    steps.forEach(function(x){x.setAttribute('aria-pressed',x===b)});egs.forEach(function(e,j){e.classList.toggle('on',j===i)})})});
  // case rail: mark the section being read
  var rail=document.getElementById('rail'),links=rail.querySelectorAll('a'),map={};
  links.forEach(function(a){map[a.getAttribute('href').slice(1)]=a});
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var a=map[e.target.id];if(!a)return;
      links.forEach(function(x){x.classList.toggle('cur',x===a)});
      rail.scrollTo({left:a.offsetLeft-rail.clientWidth/2+a.offsetWidth/2})})},{rootMargin:'-25% 0px -65% 0px'});
    Object.keys(map).forEach(function(id){var t=document.getElementById(id);if(t)io.observe(t)});
  }
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
  var b=document.getElementById('copy'),em=document.getElementById('email');
  b.addEventListener('click',function(){
    function sel(){var r=document.createRange();r.selectNodeContents(em);var s=getSelection();s.removeAllRanges();s.addRange(r);b.textContent='Selected, press Ctrl+C'}
    try{navigator.clipboard.writeText(em.textContent).then(function(){b.textContent='Copied'},sel)}catch(x){sel()}
    setTimeout(function(){b.textContent='Copy email'},2500);
  });
})();
