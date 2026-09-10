// 상단 바·왼쪽 문서 트리·오른쪽 페이지 목차·하단 도움됐나요 를 모든 페이지에 공통으로 그린다.
const PAGES=[
 {file:'index.html',title:'시작하기',num:''},
 {file:'ch1.html',num:1,title:'AI는 이렇게 채점해요',subs:[['s1-1','세 단계로 진행돼요'],['s1-2','참고하는 건 두 가지뿐이에요'],['s1-3','실제 화면은 이렇게 생겼어요'],['s1-4','AI가 읽은 내용을 확인하고 고칠 수 있어요']]},
 {file:'ch2.html',num:2,title:'채점기준이 정확도를 정해요',subs:[['s2-1','잘 맞는 4가지 쓰기 방식'],['s2-2','실물로 보면 이래요'],['s2-3','갈리기 쉬운 3가지'],['s2-4','같은 기준을 이렇게 바꾸면 돼요']]},
 {file:'examples.html',num:'',title:'과목별 채점 예시',parent:'ch2.html'},
 {file:'ch3.html',num:3,title:'과제물은 이렇게 준비해요',subs:[['s3-1','세 가지만 지켜 주세요'],['s3-2','잘 안 읽히는 표기'],['s3-3','학생용 안내 한 줄'],['s3-4','파일 조건']]},
 {file:'ch4.html',num:4,title:'이런 답안은 어때요?',subs:[['s4-1','형태별로 한눈에'],['s4-2','잘 돼요 · 조건이 있어요 · 아직 어려워요']]},
 {file:'ch5.html',num:5,title:'AI 채점 결과가 기대와 다를 때',subs:[['s5-1','순서대로 확인해요'],['s5-2','화면에서는 이렇게 보여요'],['s5-3','알아 두면 좋은 것']]},
 {file:'ch6.html',num:6,title:'자주 묻는 질문',subs:[]},
];
(function(){
  const here=location.pathname.split('/').pop()||'index.html';
  const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
  // 현재 페이지의 소제목(h3) → 오른쪽 목차 + 왼쪽 트리 하위 항목
  const heads=[...document.querySelectorAll('.doc-body h3[id]')];
  // 상단 바
  document.body.insertAdjacentHTML('afterbegin',`
  <header class="hdr">
    <a class="home-link" href="index.html"><span class="logo">CLIPO</span></a><span class="divider"></span><a class="home-link doc" href="index.html">AI 채점 안내</a>
    <button class="menu-btn" id="menuBtn" aria-label="메뉴 접기/펼치기">메뉴</button>
  </header>`);
  // 왼쪽 트리
  let tree='<ul>';
  for(const p of PAGES){
    if(p.parent) continue;
    const kids=PAGES.filter(k=>k.parent===p.file);
    const subs=(p.subs||[]).map(([id,t])=>`<li><a href="${p.file}#${id}" data-sub="${here===p.file?id:''}">${esc(t)}</a></li>`).join('');
    const kidLinks=kids.map(k=>`<li><a href="${k.file}"${here===k.file?' class="active"':''}>${esc(k.title)}</a></li>`).join('');
    const hasSub=!!(subs||kidLinks);
    tree+=`<li><a href="${p.file}"${here===p.file?' class="active"':''}>${p.num!==''?`<span class="num">${p.num}</span>`:''}${esc(p.title)}${hasSub?'<span class="chev"></span>':''}</a>${hasSub?`<ul>${subs}${kidLinks}</ul>`:''}</li>`;
  }
  tree+='</ul>';
  document.body.insertAdjacentHTML('afterbegin',`<aside class="side" id="side">${tree}</aside>`);
  // 오른쪽 목차 (데스크톱) + 본문 상단 접이식 목차 (좁은 화면)
  if(heads.length){
    const items=heads.map(h=>`<li><a href="#${h.id}" data-sub="${h.id}">${esc(h.textContent)}</a></li>`).join('');
    document.querySelector('.wrap').insertAdjacentHTML('beforeend',`<nav class="toc" id="toc"><div class="ttl">이 페이지에서</div><ul>${items}</ul><button class="top" id="topBtn">맨 위로 ↑</button></nav>`);
    document.getElementById('topBtn').addEventListener('click',()=>window.scrollTo(0,0));
  }
  // 스크롤 스파이
  const links=[...document.querySelectorAll('a[data-sub]')].filter(a=>a.dataset.sub);
  function spy(){
    if(!heads.length) return;
    const y=window.scrollY+120; let c=null;
    for(const h of heads){ if(h.offsetTop<=y) c=h; }
    if(!c && window.scrollY<80) c=null;
    links.forEach(a=>a.classList.toggle('active',!!c&&a.dataset.sub===c.id));
  }
  window.addEventListener('scroll',spy,{passive:true}); window.addEventListener('load',spy); spy();
  // 모바일 메뉴
  const side=document.getElementById('side');
  document.getElementById('menuBtn').addEventListener('click',()=>side.classList.toggle('closed'));
  side.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{ if(matchMedia('(max-width:640px)').matches) side.classList.add('closed'); }));
  // 트리 접기: 쉐브론 클릭
  side.querySelectorAll('.chev').forEach(ch=>ch.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();ch.closest('li').classList.toggle('collapsed');}));
})();
