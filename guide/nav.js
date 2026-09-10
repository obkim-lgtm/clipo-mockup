// 상단 바·왼쪽 문서 목록·오른쪽 페이지 목차를 모든 페이지에 공통으로 그린다.
// 왼쪽 목록은 **지금 보는 문서의 소제목만** 펼친다. 모든 장의 소제목을 늘 펼치면 목록이 서른 줄이 된다.
// 소제목은 각 페이지의 h3[id]에서 직접 읽는다. 여기에 따로 적어 두면 본문을 고칠 때마다 어긋난다.
const PAGES=[
 {file:'index.html',num:0,title:'시작하기'},
 {file:'ch1.html',num:1,title:'AI는 이렇게 채점해요'},
 {file:'ch2.html',num:2,title:'채점기준은 이렇게 써요'},
 {file:'ch3.html',num:3,title:'과제물은 이렇게 준비해요'},
 {file:'ch4.html',num:4,title:'이런 답안까지 채점돼요'},
 {file:'ch5.html',num:5,title:'결과가 다를 땐 이렇게 해요'},
 {file:'ch6.html',num:6,title:'자주 묻는 질문'},
];
// 순서대로 읽는 흐름 밖에 있는 참고 문서
const REFS=[
 {file:'examples.html',title:'과목별 채점 예시'},
];
(function(){
  const here=location.pathname.split('/').pop()||'index.html';
  const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
  // 현재 페이지의 소제목(h3) → 오른쪽 목차 + 왼쪽 트리 하위 항목
  const heads=[...document.querySelectorAll('.doc-body h3[id]')];
  // 문서 목록 접힘 상태 (기기별로 기억, 휴대폰은 기본 접힘)
  const SIDE_KEY='clipo-guide-side';
  const isPhone=()=>matchMedia('(max-width:640px)').matches;
  // 휴대폰에서는 목록이 본문을 덮으므로 저장값과 무관하게 늘 접고 시작한다
  let closed=true;
  if(!isPhone()){
    try{ closed = localStorage.getItem(SIDE_KEY)==='closed'; }catch(e){ closed=false; }
  }
  // 상단 바
  document.body.insertAdjacentHTML('afterbegin',`
  <header class="hdr">
    <button class="menu-btn" id="menuBtn" aria-label="문서 목록 접기·펼치기" aria-expanded="${closed?'false':'true'}"><i></i></button>
    <a class="home-link" href="https://clipo.ai" aria-label="클리포 홈"><img class="logo" src="clipo_wordmark.svg" alt="CLIPO" width="76" height="16"></a><span class="divider"></span><a class="home-link doc" href="index.html">AI 채점 안내</a>
    <a class="hdr-cta" href="https://clipo.ai">클리포로 이동</a>
  </header>`);
  // 왼쪽 문서 목록
  const subList=heads.length?`<ul>${heads.map(h=>`<li><a href="#${h.id}" data-sub="${h.id}">${esc(h.textContent)}</a></li>`).join('')}</ul>`:'';
  const item=p=>{
    const on=here===p.file;
    const num=p.num!==undefined&&p.num!==''?`<span class="num">${p.num}</span>`:'<span class="num blank"></span>';
    return `<li><a href="${p.file}"${on?' class="active"':''}>${num}${esc(p.title)}</a>${on?subList:''}</li>`;
  };
  let tree=`<div class="grp">가이드</div><ul>${PAGES.map(item).join('')}</ul>`;
  tree+=`<div class="grp">참고</div><ul>${REFS.map(item).join('')}</ul>`;
  document.body.insertAdjacentHTML('afterbegin',`<aside class="side${closed?' closed':''}" id="side">${tree}</aside>`);
  if(closed) document.body.classList.add('side-closed');
  // 오른쪽 목차 (데스크톱) + 본문 상단 접이식 목차 (좁은 화면)
  if(heads.length){
    const items=heads.map(h=>`<li><a href="#${h.id}" data-sub="${h.id}">${esc(h.textContent)}</a></li>`).join('');
    document.querySelector('.wrap').insertAdjacentHTML('beforeend',`<nav class="toc" id="toc"><div class="ttl">이 페이지에서</div><ul>${items}</ul><button class="top" id="topBtn">맨 위로 ↑</button></nav>`);
    document.getElementById('topBtn').addEventListener('click',()=>window.scrollTo(0,0));
  }
  // 스크롤 스파이
  const links=[...document.querySelectorAll('a[data-sub]')].filter(a=>a.dataset.sub);
  const paint=id=>links.forEach(a=>a.classList.toggle('active',a.dataset.sub===id));
  // 목차를 눌렀을 때는 누른 절을 그대로 표시한다. 페이지 끝이라 그 절이 화면 위까지 못 올라와도 마찬가지
  let pinned=null, pinnedY=0;
  function pin(id){ if(!heads.some(h=>h.id===id)) return; pinned=id; pinnedY=window.scrollY; paint(id); }
  links.forEach(a=>a.addEventListener('click',()=>setTimeout(()=>pin(a.dataset.sub),0)));
  window.addEventListener('hashchange',()=>setTimeout(()=>pin(location.hash.slice(1)),0));
  function spy(){
    if(!heads.length) return;
    if(pinned){
      if(Math.abs(window.scrollY-pinnedY)<40){ paint(pinned); return; }   // 사용자가 직접 움직이면 놓아준다
      pinned=null;
    }
    let c=null;
    for(const h of heads){ if(h.getBoundingClientRect().top<=140) c=h; }
    // 맨 아래에서는 남은 절들이 기준선까지 올라오지 못한다. 바닥에 닿으면 화면 위쪽 절반의 마지막 절로 본다
    const doc=document.documentElement;
    if(window.innerHeight+window.scrollY>=doc.scrollHeight-2){
      const shown=heads.filter(h=>h.getBoundingClientRect().top<window.innerHeight/2);
      c=shown.length?shown[shown.length-1]:heads[heads.length-1];
    }
    if(!c && window.scrollY<80) c=null;
    paint(c?c.id:null);
  }
  window.addEventListener('scroll',spy,{passive:true}); window.addEventListener('load',spy); spy();
  if(location.hash) setTimeout(()=>pin(location.hash.slice(1)),0);
  // 문서 목록 접기 (모든 화면 폭에서. 버튼으로 접은 것만 기억한다)
  const side=document.getElementById('side');
  const menuBtn=document.getElementById('menuBtn');
  function setClosed(v,remember){
    side.classList.toggle('closed',v);
    document.body.classList.toggle('side-closed',v);
    menuBtn.setAttribute('aria-expanded',v?'false':'true');
    if(remember){ try{ localStorage.setItem(SIDE_KEY,v?'closed':'open'); }catch(e){} }
  }
  requestAnimationFrame(()=>side.classList.add('ready'));   // 첫 그림에서 접힘 애니메이션이 보이지 않게
  menuBtn.addEventListener('click',()=>setClosed(!side.classList.contains('closed'),true));
  side.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{ if(isPhone()) setClosed(true,false); }));
})();
