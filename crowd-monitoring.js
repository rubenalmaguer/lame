/*
v1.2.5
- Arabic arrow
- TODO: Add errata categories: Proper nouns, style
- TODO: Maybe: tone → consistency / style   +   proper nouns
- TODO: "So-so all" button on each req. (not yey implemented [ctrl+F sosofier])
*/

/* let */ styles = `
/* ANNOTATOR */
#tatorWin {
  z-index: 1000;
  position: absolute;
  display: none;
  flex-direction: column;
  color: black;
  width: 350px;
  resize: none; /* both; */
  overflow: auto;
  border: solid gray 3px;
  border-radius: 3px; 
  background-color: lightgray;
  color: white;
  padding: 0px;
  font-size: 20px;
  font-weight: bold;
  filter: drop-shadow(0 1px 10px rgba(113,158,206,0.8));

  cursor:move;
}

#tatorTitleBar {
  direction: rtl;
  padding: 0 2px 0 0;
  display: flex;
  justify-content:space-between;
}

#s0 {
  padding:5px 0px 0px 10px;
}

/*   #btnCloseTator {
  border: 0px;
  background-color: transparent;
  color:gray; 
}
  #btnCloseTator:hover {
    color: black;
  } */

.memoContainer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  padding:0 10px;
}
  #srcArea {
      width: 100%;
      height: 26px;
      font-family: Verdana, Geneva, Tahoma, sans-serif;
      font-size: small;
      font-weight: normal;
      color: slategray;
      background-color: #EFEFEF;
      resize: none; 
    }
  #tatorTextArea {
    width: 100%;
    height: 70px;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    font-size: small;
    font-weight: normal;
    color: black;
    background-color: white;
    resize: none; 
  }

  .tripletBtnContainer {
    flex: 1 0 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    gap: 10px;
    margin: 0px 10px 10px 10px;
  }
    .tripletBtn {
      flex: 0 0 30%;
    }


  .lonelyBtnContainer {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
  }
    .lonelyBtn {
      flex: 0 0 50%;
      align-self: center;
    }

#textDirToggle {
font-size: x-small;
color: black;
}

/*CHECK BUTTONS*/
#errataWrap{
  user-select: none;
  margin: 0 0 4px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 2px 4px;
  justify-content: space-between;
}
/* last row align left */
#errataWrap::after {
  content: "";
  flex: auto;
}

.tatorInput {
    position: absolute;
    left: -100vw; /* Out of sight */
}
.tatorLabel {
  font-size: x-small;
  color: black;
  background-color: #EFEFEF;
  border-radius: 40px;
  overflow: auto;
  float: left;
  padding: 4px 10px;
  text-align: center;
  justify-content: center;
}
.tatorLabel:hover {
    background: rgb(231, 78, 78);
}
.tatorInput[type="checkbox"]:checked + .tatorLabel {
    background-color: rgb(209, 49, 49);
    color: #fff;
}

/* TOGGLE SWITCH*/
.switch {
position: relative;
display: inline-block;
width: 20px;
height: 10px;

}

.switch input { 
opacity: 0;
width: 0;
height: 0;
}

.slider {
position: absolute;
cursor: pointer;
top: 0;
left: 0;
right: 0;
bottom: 0;
background-color: #ccc;
transition: .4s;
}

.slider:before {
position: absolute;
content: "";
height: 10px;
width: 10px;
left: 2px;
bottom: 0px;
background-color: white;
transition: .2s;
}

input:checked + .slider {
background-color: #2196F3;
}

input:focus + .slider {
box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
transform: translateX(6px);
}

/* Rounded sliders */
.slider.round {
border-radius: 10px;
}

.slider.round:before {
border-radius: 50%;
}

/*HIGHLIGHTER*/
.highlighted {
  position: relative;
  border-left: rgba(255, 0, 255, 1) solid 1px;
  border-right: rgba(255, 0, 255, 1) solid 1px;
  background-color: rgba(255, 0, 255, 0.12);
}
/*FAKE SELECT*/
.fakeSelect {
position: relative;
background-color: highlight;
color: highlighttext;
}
/* TOOLTIP */
.b-tooltip {
  /* border:3px solid #fff; */
  display:inline-block;
  font-size:.875em;
  padding:.5em;
  position:absolute;
  text-align:center;
  max-width: 500px;
}
.b-tooltip-light {
  background:#eaeaea;
  background:linear-gradient(to bottom, #fdfdfd 0%, #eaeaea 100%);
  box-shadow:0px 0px 6px 2px rgba(110,110,110,0.4);
  color:#242424
}
.b-tooltip-dark {
  background:rgba(0, 0, 0, 0.7);
  /* background:linear-gradient(to bottom, #6e6e6e 0%, #242424 100%); */
  box-shadow:0px 0px 6px 2px #6e6e6e;
  color:#fff
}

/* ACTION PANEL */
#actionPanel {
  position: fixed;
  right: 10px;
  top: 10px;
  width: fit-content;
  z-index: 999;
  color: black;
  resize: none; /* both; */
  overflow: auto;
  border: solid gray 3px;
  border-radius: 3px; 
  background-color: rgba(113,158,206,0.1);
  color: white;
  padding: 10px;
  font-size: 20px;
  font-weight: bold;
  filter: drop-shadow(0 1px 10px rgba(113,158,206,0.8));
  display: flex;
  flex-direction: column;
  row-gap: 5px;

  cursor:move;
}

  #copyAllBtn {
    magrin-left: 4px;
  }

  #jumboTron {
    color: dimgray;
    font-size: small;
    font-weight: bold;
  }
`;

/* let */ styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

/* let */ messages = {
compliments: {
0: ['Great!', 'Great job!', 'Excellent.', 'A translation of the utmost quality.', 'Excellent work', 'Excellent translation.', 'Very good.', 'Outstanding translation.', 'Exactly right.', 'Excellent!', 'A job well done.', 'Exceptional translation.', 'Wonderful!', 'Outstanding!', 'Way to go!', 'Simply superb.', 'Stupendous!', 'First class job.', 'First class work.', 'Right on!', 'I’m impressed!', 'Very well done.', 'Nicely done.', 'Pretty good job.', `Couldn't ask for a better translation.`, 'Very nice job.', 'Really good work.', 'Really good job.', 'It’s perfect!', 'Well done!', 'What a neat work!', 'That’s the right way to do it.'],
1: ['좋은 번역',],
2: ['好翻译',],
3: ['良い翻訳',],
},
};

/* let */ errata = {
supportLang : ['en', 'ko', 'zh', 'ja'],

get currLangIndex() {
let langIndex = (this.supportLang.indexOf(meta.tCode) === -1) ? 0 : this.supportLang.indexOf(meta.tCode);
return langIndex;
},

errTypes : {
ckTypo: ['typo / punctuation', '오타·맞춤법', '오타·맞춤법', '오타·맞춤법',],
ckOmissionAddition: ['omission / addition', '누락·추가', '누락·추가', '누락·추가',],
ckGrammar: ['grammar', '문법', '문법', '문법',],
ckTone: ['tone / style', '톤앤매너', '톤앤매너', '톤앤매너',],
ckConsistency: ['consistency', '일관성', '일관성', '일관성',],
ckNames: ['proper nouns', '고유명사', '고유명사', '고유명사',],
ckLiteral: ['literal / unnatural', '직역·어색함', '직역·어색함', '직역·어색함',],
ckMistranslation: ['mistranslation', '오역', '오역', '오역',],
},

reset() {
for (let key in this.errTypes) {
    document.getElementById(key).checked = false;
  }
},

translate() {
let checkboxes = [...errataWrap.querySelectorAll('input')];
checkboxes.forEach(ck => {
  let ckid = ck.id;
  let label = document.getElementById(`labelfor${ckid}`);
  let langIndex = (this.supportLang.indexOf(meta.tCode) === -1) ? 0 : this.supportLang.indexOf(meta.tCode);
  label.innerText = this.errTypes[ckid][langIndex];
});
},

check() {
let inputElems = [...errataWrap.getElementsByTagName("input")];

count = 0;
for (var i=0; i<inputElems.length; i++) {
  if (inputElems[i].type === "checkbox" && inputElems[i].checked === true) { count++ }
}

if (count > 0) {
  let m = s3.dataset['mode'];
  let s = (m == 'edit') ? ['s0','s3','s5'] : ['s0','s3','s4'] ;
  tator.setView(s);
} else { tator.setView(['s0', 's3']) }
},

};

/* let */ meta = {
reviewer: document.querySelector('.nav>li>a').innerText.split('Hi, ')[1],

contextualize(thisTrContentElem) {
if (thisTrContentElem === meta.elemRV) { return }

meta.elemRV = thisTrContentElem;
meta.elemRS = meta.elemRV.closest('[res-id]');
meta.elemRQ = meta.elemRS.closest('.req_tr');
meta.idRS = meta.elemRS.getAttribute('res-id');
meta.idRQ = meta.elemRQ.querySelector('.req_id>a').innerText;
meta.translator = meta.elemRS.querySelector('a.username').innerText;
meta.langs = meta.elemRQ.querySelector('.lang').innerText;
meta.sLang = meta.langs.split(' ➔ ')[0];
meta.tLang = meta.langs.split(' ➔ ')[1];
meta.sLangIsNative = meta.elemRS.querySelector('[ng-show="tr.user.crowd_level.src_lang"]').textContent.trim().slice(-6) === 'Native';
meta.tLangIsNative = meta.elemRS.querySelector('[ng-show="tr.user.crowd_level.dst_lang"]').textContent.trim().slice(-6) === 'Native';
meta.nLang = (meta.sLangIsNative) ? meta.sLang : (meta.tLangIsNative) ? meta.tLang : null;
meta.gLang = (meta.tLangIsNative) ? meta.sLang : (meta.sLangIsNative) ? meta.tLang : null;
meta.sCode = this.getLangCodeFromName(meta.sLang);
meta.tCode = this.getLangCodeFromName(meta.tLang);
meta.arrow = (meta.tCode == 'ar') ? '←' : '→';
meta.profile = `${meta.translator}_${meta.sCode}${meta.tCode}`;
meta.submissionDate = new Date(meta.elemRS.querySelector('.date').innerText.split(' (')[0]).toISOString();
},

getLangCodeFromName(langName) {
let isoCodes = {
'English' : 'en',
'Spanish' : 'es',
'Korean' : 'ko',
'Indonesian' : 'id',
'Chinese' : 'zh',
'Chinese (Simplified)' : 'zh',
'Chinese (Traditional)' : 'zh',
'Chinese (Cantonese)' : 'zh',
'Japanese' : 'ja',
'Arabic' : 'ar',
};
return isoCodes[langName] || 0;
},
};

/* let */ page = {
setup() {       
tator.mount();
let excludeFromDrag = [s0, srcSwitch, srcToggle, srcToggleSpan, btnCloseTator, badBtn, sosoBtn, goodBtn, removeBtn, editBtn, addBtn, tatorTextArea, srcArea, applyBtn, updateBtn];
this.makeDraggable(document.getElementById('tatorWin'), excludeFromDrag);

actionPanel.mount();
this.makeDraggable(document.getElementById('actionPanel'), [copyAllBtn]);

this.addEvents();

/* TODO: disconnect observers on page change? */
let resObserver = new MutationObserver(mutationRecord => {
  let rs = mutationRecord[0].target;
  let rq = rs.closest('.req_tr');
  let oldVal = mutationRecord[0].oldValue;
  let newVal = rs.dataset['grade'];
  let wasntGraded = oldVal === null || oldVal === 'x';
  let isGraded = newVal === '-1' || newVal === '0' || newVal === '1';
  
  if ( wasntGraded && isGraded ) {
    rq.dataset['gradedCount'] = parseInt(rq.dataset['gradedCount']) + 1;
  }
  
  if ( !wasntGraded && !isGraded ) {
    rq.dataset['gradedCount'] = parseInt(rq.dataset['gradedCount']) - 1;
  }

});

let reqObserver = new MutationObserver(mutationRecord => {
  let oldVal = parseInt(mutationRecord[0].oldValue);
  let newVal = parseInt(mutationRecord[0].target.dataset['gradedCount']);

  /* SID */
  if (oldVal < newVal) {SIDcount.textContent = parseInt(SIDcount.textContent) + 1; }
  if (oldVal > newVal) {SIDcount.textContent = parseInt(SIDcount.textContent) - 1; }

  /* REQ */
  if (oldVal === 0 && newVal > 0) {REQcount.textContent = parseInt(REQcount.textContent) + 1; }
  if (oldVal > 0 && newVal === 0) {REQcount.textContent = parseInt(REQcount.textContent) - 1; }


});

let allReqInPage = [...document.querySelectorAll('.req_tr')];
allReqInPage.forEach(req => { 
  req.dataset['gradedCount'] = 0;

  reqObserver.observe( req, {
    attributes: true,
    attributeOldValue: true,
    attributeFilter: ['data-graded-count'],
  } );

  /* sosofier.add(req); */

});

let allResInPage = [...document.querySelectorAll('[res-id]')];
allResInPage.forEach( (res, index) => {
  let req = res.closest('.req_tr');
  let revWrap = res.querySelector('.col-md-12.tr');
  let revContent = revWrap.querySelector('[ng-bind-html="tr\\.tr_content | nl2brV2"]');

  resObserver.observe( res, {
    attributes: true,
    attributeOldValue: true,
    attributeFilter: ['data-grade'],
  } );

  revContent.normalize();

  SB.query(res)
  .then(data => {
    /* copy grade and summary locally to avoid further queries */
    res.dataset['grade'] = data[0].grade;

    /* bring comments */
    if (data[0].annotated) { revContent.innerHTML = data[0].annotated; }
    
    /* re-color */
    if (data[0].grade < 0) {
      res.style.background = 'lightpink';
    } else if (data[0].grade == 0) {
      res.style.background = 'paleturquoise';
    } else if (data[0].grade >0) {
      res.style.background = 'palegreen';
    }

    /* copy/reset button */
    botonera.add(res);

  }).catch(e => {
    res.dataset['grade'] = 'x';
    console.log(`bah ${e}`);
    /* if (index === allResInPage.length - 1) {  console.log('catch'); resolve() } */
  });
});
},

addEvents() {
tatorTextArea.addEventListener('mousedown', e => { e.stopPropagation() /* Workaround to keep clickable while allowing dragging*/ });
s0.addEventListener('mousedown', e => { e.stopPropagation() /* Workaround to keep clickable while allowing dragging*/ });
tatorWin.addEventListener('click', e => { e.stopPropagation() }); /* Don't close when clicked) */
document.addEventListener('keyup', e => { if(e.key === "Escape"){ tator.close(true) } });

/*
╔════════════════════════════════════════════════════════════════════════════╗
║'.req_tr'                                                                   ║
║ ╔════════════════════════════════════════════════════════════════════════╗ ║
║ ║'[res-id]'                                                              ║ ║
║ ║ ╔════════════════════════════════════════════════════════════════════╗ ║ ║
║ ║ ║'.col-md-12.tr'                                                     ║ ║ ║
║ ║ ║ ┌────────────────────────────────────────────────┐ ┌─────────────┐ ║ ║ ║
║ ║ ║ │'.left-side'                                    │ │'.right-side'│ ║ ║ ║
║ ║ ║ │ ┌────────────────────────────────────────────┐ │ │             │ ║ ║ ║
║ ║ ║ │ │'[ng-bind-html="tr\\.tr_content | nl2brV2"]'│ │ │             │ ║ ║ ║
║ ║ ║ │ └────────────────────────────────────────────┘ │ │             │ ║ ║ ║
║ ║ ║ └────────────────────────────────────────────────┘ └─────────────┘ ║ ║ ║
║ ║ ╚════════════════════════════════════════════════════════════════════╝ ║ ║
║ ╚════════════════════════════════════════════════════════════════════════╝ ║
╚════════════════════════════════════════════════════════════════════════════╝
*/
[...document.querySelectorAll('.right-side')].forEach(righty => {
  righty.addEventListener('click', e => {
    const isCompact = s3.style.display === 'none';
    if (isCompact) { tator.close(false) } else { tator.blink() }
    e.stopPropagation() })
});

window.addEventListener('click', e => {
  let sel = getSelection(); 
  
  /* Case: triple click last line / Test: ReqID 11077701 */
  if (sel.focusNode.matches && (sel.focusNode.matches('.report.ng-binding') || sel.focusNode.matches('.memo.click-pointer.ng-binding'))) {        
    sel.extend(sel.anchorNode, sel.anchorNode.textContent.length);
  }
  
  const isVisible = tatorWin.style.display === 'flex';
  const isCompact = s3.style.display === 'none';
  const isExpanded = s3.style.display === 'flex';
  const clickedOnContent = e.target.matches('[ng-bind-html="tr\\.tr_content | nl2brV2"]') || e.target.classList.contains('highlighted');
  const clickedOnWrapper = e.target.matches('.col-md-12') || e.target.matches('.left-side');
  const clickedOnTopBar = e.target.matches('[res-id]');

  if (sel == "" && isCompact) { tator.close(true); return }
  if (sel == "" && isExpanded) { tator.blink(); return }   
  
  if (!isVisible || isCompact) {

    if (clickedOnContent) { tator.show(e)

    } else if (clickedOnTopBar) {
      let contentElem = window.getSelection().anchorNode.parentElement.closest('[ng-bind-html="tr\\.tr_content | nl2brV2"]');
      let newFocus = contentElem.firstChild;
      let newOffset = 0;
      sel.extend(newFocus, newOffset); 
      tator.show(e);
      
    } else if (clickedOnWrapper) {
      /* Inside → Out */
      if (sel.anchorNode.nodeType === 3) {   /* 3 means text node */
        console.log('IO');
        let contentElem = sel.anchorNode.parentElement.closest('[ng-bind-html="tr\\.tr_content | nl2brV2"]');
        if (!contentElem) {contentElem = sel.anchorNode.parentElement.querySelector('[ng-bind-html="tr\\.tr_content | nl2brV2"]');}

        let newFocus = (e.clientX < contentElem.getBoundingClientRect()['left']) ? contentElem.firstChild : contentElem.lastChild;
        let newOffset = (e.clientX < contentElem.getBoundingClientRect()['left']) ? 0 : newFocus.textContent.length;
        sel.extend(newFocus, newOffset); 
      }

      /* Outside → In (WITH MEMO) */
      else if (sel.anchorNode.matches('.memo.click-pointer.ng-binding')) {
        let contentElem = sel.focusNode.parentElement.closest('[ng-bind-html="tr\\.tr_content | nl2brV2"]');
        console.log('OI - w/memo');
        if (!contentElem) {contentElem = sel.focusNode.parentElement.querySelector('[ng-bind-html="tr\\.tr_content | nl2brV2"]');}
        sel.setBaseAndExtent(contentElem.lastChild,contentElem.lastChild.textContent.length,sel.focusNode,sel.focusOffset);
      }
      /* Outside → In (NO MEMO) */
      else {
        let contentElem = window.getSelection().focusNode.parentElement.closest('[ng-bind-html="tr\\.tr_content | nl2brV2"]');
        console.log('OI - NO memo');
        if (!contentElem) {contentElem = sel.focusNode.parentElement.querySelector('[ng-bind-html="tr\\.tr_content | nl2brV2"]');}
        sel.setBaseAndExtent(contentElem.firstChild,0,sel.focusNode,sel.focusOffset);

      }

      tator.show(e);
    }
    
    else { tator.close(false) }
    return
  }

  if (isVisible && isExpanded) { tator.blink(); return }
});

let reloadTriggers = [
  document.querySelector('[ng-click="func\\.pageChange()"]'),
  document.querySelector('[ng-click="func\\.lastWeek()"]'),
  document.querySelector('[ng-click="func\\.thisMonth()"]'),
  document.querySelector('[ng-click="func\\.initFilter()"]'),
  document.querySelector('.pagination-first'),
  document.querySelector('.pagination-prev'),
  ...document.querySelectorAll('.pagination-page'),
  document.querySelector('.pagination-next'),
  document.querySelector('.pagination-last')
];

reloadTriggers.forEach( el => {
  el.addEventListener('click', () => {
    setTimeout(location.reload(),1000);
  });
}); 
},

makeDraggable :  function(elmnt, excludeFromDrag) {
var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
if (document.getElementById(elmnt.id + "header")) {
  /* if present, the header is where you move the DIV from: */
  document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
} else {
  /* otherwise, move the DIV from anywhere inside the DIV */
  elmnt.onmousedown = dragMouseDown;
}

function dragMouseDown(e) {
  e = e || window.event;
  e.preventDefault(); /* Don't deselect text when clicking on tator body */
  if (excludeFromDrag.includes(e.target)) { return }

  /* get the mouse cursor position at startup */
  pos3 = e.clientX;
  pos4 = e.clientY;
  document.onmouseup = closeDragElement;
  /* call a function whenever the cursor moves */
  document.onmousemove = elementDrag;
}

function elementDrag(e) {
  e = e || window.event;
  e.preventDefault();
  /* calculate the new cursor position */
  pos1 = pos3 - e.clientX;
  pos2 = pos4 - e.clientY;
  pos3 = e.clientX;
  pos4 = e.clientY;
  /* set the element's new position */
  elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
  elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
}

function closeDragElement(e) {
  /* stop moving when mouse button is released */
  document.onmouseup = null;
  document.onmousemove = null;

  page.repositionIfOverflow(elmnt, 0, 0); 
}
},

repositionIfOverflow(elem, pxLower, pxRighter) {
/* if (elem.style.position != 'absolute') { return } */

/* Calculate position to prevent overflow (must be visible first) */
let elemRight = elem.getBoundingClientRect().right;
let elemLeft = elem.getBoundingClientRect().left;
let elemTop = elem.getBoundingClientRect().top;
let elemBottom = elem.getBoundingClientRect().bottom;
let winWidth = document.documentElement.clientWidth || document.body.clientWidth || window.innerWidth;
let winHeight = document.documentElement.clientHeight || document.body.clientHeight || window.innerHeight;
let scrollY = (window.getComputedStyle(elem).position == 'absolute') ? window.scrollY : 0;
let scrollX = (window.getComputedStyle(elem).position == 'absolute') ? window.scrollX : 0;

/* Set Y */
if (elemTop < 0) { elem.style.setProperty('top', `${(0 + scrollY)}`) }

else if (elemBottom + pxLower >= winHeight) {
  elem.style.setProperty('top', `${(winHeight + scrollY) - (elemBottom - elemTop)}px`);
} else {
  elem.style.setProperty('top',  `${elemTop + pxLower + scrollY}px`);
}

/* Set X */

if (elemLeft < 0) { elem.style.setProperty('left', '0') }

else if (elemRight + pxRighter >= winWidth) {
  elem.style.setProperty('left', `${(winWidth + scrollX) - (elemRight - elemLeft )}px`);
} else {
  elem.style.setProperty('left',  `${elemLeft + pxRighter + scrollX}px`);
}
},
};

/* let */ tator = {
mount() {
let el = document.createElement('div'); el.id = 'tatorWin';
el.innerHTML = this.render();
document.body.append(el);
},

render() {
let jab = `
<div id='tatorTitleBar'>
  <button id="btnCloseTator" class="close" onclick="tator.close(true)">×</button>
  <section id="s0">
      <label id="srcSwitch" class="switch">
        <input id="srcToggle" type="checkbox" onclick="srcArea.style.display = (srcArea.style.display == 'none') ? 'inline-block' : 'none'" checked>
        <span id="srcToggleSpan" class="slider round"></span>
      </label>
      <!--LTR|RTL-->
  </section>
</div>

<section id="s1" class="tripletBtnContainer">
  <button id="badBtn" type="button" class="tripletBtn btn btn-danger" onclick="s3.dataset['mode'] = 'add'; tator.setView(['s0', 's3'], tator.populate())">Bad</button>
  <button id="sosoBtn" type="button" class="tripletBtn btn btn-info" onclick="tator.gradeSimply(0)">So so</button>
  <button id="goodBtn" type="button" class="tripletBtn btn btn-success" onclick="tator.gradeSimply(1)">Good</button>
</section>

<section id="s2" class="tripletBtnContainer">
  <button id="removeBtn" type="button" class="tripletBtn btn btn-secondary" style="color:black;" onclick="tator.deleteThisAnnotation()">Remove</button>
  <button id="editBtn" type="button" class="tripletBtn btn btn-warning" onclick="s3.dataset['mode'] = 'edit'; tator.setView(['s0', 's3', 's5'], tator.populate())">Edit</button>
  <section id="s6" class="tripletBtn">
    <button id="addBtn" type="button" style="width:100%;" class="btn btn-primary" onclick="s3.dataset['mode'] = 'add'; tator.setView(['s0', 's3'], tator.populate())">Add</button>
  </section>
</section>

<section id="s3" class="memoContainer" data-mode="add">
<div> <textarea id="srcArea" spellcheck="false" dir="auto" disabled></textarea> </div>
<div> <textarea id="tatorTextArea" lang="es" dir="auto"></textarea> </div>
<div id="errataWrap">`;    
let langIndex = (errata.currLangIndex < errata.supportLang.length) ? errata.currLangIndex : 0;
for (const [key, value] of Object.entries(errata.errTypes)) {
  jab += `
  <input class="tatorInput" id="${key}" type="checkbox" tabindex="-1" oninput="errata.check()">
  <label class="tatorLabel" id="labelfor${key}" for="${key}">${value[langIndex]}</label>
  `;
}
jab += `</div></section>


<section id="s4" class="lonelyBtnContainer">
  <button id="applyBtn" type="button" class="lonelyBtn btn btn-primary" onclick="tator.gradeDetailed()">Apply</button>
</section>

<section id="s5" class="lonelyBtnContainer">
  <button id="updateBtn" type="button" class="lonelyBtn btn btn-warning" onclick="tator.edit()">Update</button>
</section>
`;
return jab;
},

close(deselect) {
if (deselect === true) { window.getSelection().removeAllRanges() }
this.setView();
srcArea.innerText = "";
tatorTextArea.value = "";
errata.reset();
s3.dataset['mode'] = 'add';
if (srcArea.style.display === 'none') { srcToggle.click() }
},

blink() {
let animation = setInterval(()=>{
  tatorWin.style.border = 'solid black 3px';
  setTimeout(()=>{
    tatorWin.style.border = 'solid gray 3px';
  }, 200);
}, 400);

setTimeout(() => {
  clearInterval(animation);
  tatorWin.style.border = 'solid gray 3px';
}, 2100);
},

setView(arrayOfShowables, optionalCallback) {
if (optionalCallback) {optionalCallback()}

/* Inner */
let sections = [...tatorWin.getElementsByTagName('section')];
sections.forEach(s => {
  if (arrayOfShowables && arrayOfShowables.includes(s.id)) {s.style.display = 'flex'}
  else {s.style.display = 'none'}
});
/* Outer */
tatorWin.style.display = (arrayOfShowables) ? 'flex' : 'none';

/* Position */
page.repositionIfOverflow(tatorWin, 0, 0);
},

populate() {
if (s3.dataset['mode'] === 'edit') {
  let highlighted = closestHighlighted(meta.selectedRange.endContainer);

  /* meta.selectedRange.setStart(meta.selectedRange.startContainer, 0);
  meta.selectedRange.setEnd(meta.selectedRange.endContainer, meta.selectedRange.endContainer.textContent.length); */
  meta.selectedRange.selectNodeContents(highlighted);
  getSelection().removeAllRanges();
  getSelection().addRange(meta.selectedRange);

  tatorTextArea.value = highlighted.dataset['memo'];

  if (highlighted.dataset['toggle'] === 'false') { srcToggle.click() }

  let prevErrata = highlighted.dataset['errata'].split(', ');
  let checkboxes = [...errataWrap.querySelectorAll('input')];
  checkboxes.forEach(ck => {
    let ckid = ck.id;
    let label = document.getElementById(`labelfor${ckid}`);
    if (prevErrata.includes(label.innerText)) {
      ck.checked = true;
    }
  });
}


/* BOTH Edit / Add */
meta.hlText = getSelection().toString().trim();
let noBreakSr = meta.hlText.replace('\n',' ');
let croppedSrc = (noBreakSr.length > 20) ? `${noBreakSr.substring(0,20)}...  ${meta.arrow}` : `${noBreakSr}  ${meta.arrow}`;
srcArea.textContent = croppedSrc;


if (s3.dataset['mode'] === 'add') {
  tatorTextArea.value = meta.hlText;
}
},

show(e) {
let x = e.clientX, y = e.clientY;
e.stopPropagation();

/* Limit selection to tr content node */
meta.selectedRange = window.getSelection().getRangeAt(0);
if (meta.selectedRange == "") { return }
if (containsPartialNode(meta.selectedRange)) { console.log('overlap:'); console.log(meta.selectedRange); tator.close(true); return }

/* Update meta object */
let thisTrContent = meta.selectedRange.endContainer.closest('[ng-bind-html="tr\\.tr_content | nl2brV2"]');
meta.contextualize(thisTrContent);

/* Show */
errata.translate();
let grade = meta.elemRS.dataset['grade'];

let visibleSections = (meta.selectedRange.endContainer.classList.contains('highlighted') && meta.selectedRange.commonAncestorContainer.textContent === meta.selectedRange.toString() ) ? ['s2']
                    : (meta.selectedRange.endContainer.classList.contains('highlighted')) ? ['s2', 's6']
                    : (grade >= 0) ? null /* good | soso */
                    : (grade < 0) ? ['s0', 's3'] /* bad */
                    : ['s1']; /* default */    

this.setView(visibleSections, tator.populate());

/* Position */
tatorWin.style.setProperty('left', `${x - 20 + window.scrollX}px`);
tatorWin.style.setProperty('top', `${y + 10 + window.scrollY}px`);

meta.elemRV.normalize();
},

gradeSimply(points) {
let color;
if (points > 0) { color ='palegreen' }
else { color ='paleturquoise'; }

  SB.insert(points).then(() => {
    meta.elemRS.dataset['grade'] = points;
    meta.elemRS.style.background = color;
/*         revCounter += 1;
    countSpan.innerText = `Reviewed SIDs: ${revCounter} `; */
  }).catch(error => { 
    let msg = (error.code === '23505') ? 'SID already has a revision and will not be updated.'
    : (error.code && error.details && error.message) ? error.code + '\n' + error.details + '\n' +  error.message
    : (error.details) ? error.details : (error.message) ? error.message : 'Something went wrong.';
    console.log(error);
    alert(msg);
  });

botonera.add(meta.elemRS);
},

gradeDetailed() {
let points = -1; 
let color = 'lightpink';

applyHighlighter();

if (meta.elemRS.dataset['grade'] === 'x') {
  /* (1st time -> Insert) */
    SB.insert(points).then(() => {
      meta.elemRS.dataset['grade'] = points;
      meta.elemRS.style.background = color;
      botonera.add(meta.elemRS);
    }).catch(error => { 
      let msg = (error.code === '23505') ? 'SID already has a revision and will not be updated.'
      : (error.code && error.details && error.message) ? error.code + '\n' + error.details + '\n' +  error.message
      : (error.details) ? error.details : (error.message) ? error.message : 'Something went wrong.';
      console.log(error);
      alert(msg);
    });

} else { SB.update() }
},

deleteThisAnnotation() {
let thisAnno = closestHighlighted(meta.selectedRange.endContainer);

unwrapElement(thisAnno);

if (meta.elemRS.querySelectorAll('.highlighted').length == 0) {tator.gradeReset(); return}
SB.update();
},

gradeReset() {
tator.close(true);

SB.delete(meta.idRS)
.then (()=>{
meta.elemRS.style.background ='transparent';
meta.elemRS.dataset['grade'] = 'x';
botonera.removeButtons(meta.elemRS);
});
},

edit() {
let highlighted = closestHighlighted(meta.selectedRange.endContainer);

let chosenErrata = [];
for (const [key, value] of Object.entries(errata.errTypes)) {
  let ck = document.getElementById(key);
  let label = document.getElementById(`labelfor${ck.id}`);
  if (ck.checked) {chosenErrata.push(label.innerText)}
}
let isSrcToggled = srcToggle.checked;
let memo = tatorTextArea.value;



highlighted.dataset['toggle'] = isSrcToggled;
highlighted.dataset['errata'] = chosenErrata.join(', ');
highlighted.dataset['memo'] = memo;
highlighted.dataset['tooltip'] = `<b><i>(${chosenErrata.join(', ')})</i></b> ${(isSrcToggled) ? `${meta.hlText} → ${memo}` : memo}`;

SB.update();
},
};

/* let */ SB = {
async query(res) {
let rvid = res.getAttribute('res-id');
const { data, error } = await SB.client
                        .from('Revisions')
                        .select()
                        .eq('rvid', rvid);

if (error) {
  alert('Something went wrong.');
  console.log(error);
}

return await data;
},

async insert(points) {
tator.close(true);
let anno = (points < 0) ? meta.elemRV.innerHTML : null;
let payload = [{
  rvid: meta.idRS,
  rqid: meta.idRQ,
  submitted_at: meta.submissionDate,
  reviewer: meta.reviewer,
  translator: meta.translator,
  profile: meta.profile,
  src_lang: meta.sLang,
  tar_lang: meta.tLang,
  ntv_lang: meta.nLang,
  grd_lang: meta.gLang,
  grade: points,
  annotated: anno,
}];

let { error } = await SB.client
                  .from('Revisions')
                  .insert(payload);

if (error) {
  throw (error);
}
},

async delete(resId) {
let { error } = await SB.client
                        .from('Revisions')
                        .delete()
                        .eq('rvid', resId);

if (error) {
  alert('Something went wrong.');
  console.log(error);
}
},

async update() {
tator.close(true);
let { error } = await SB.client
                .from('Revisions')
                .update([
                    { annotated: meta.elemRV.innerHTML ,
                    }
                ])
                .eq('rvid', meta.idRS);

if (error) {
  alert('Something went wrong.');
  console.log(error);
}
},
};

/* let */ /* sosofier = {
add(req) {
if ([...req.querySelectorAll('.RA')][0]) {return}
action-side col-xs-2
},
}; */

/* let */ botonera = {
add(res) {
if ([...res.querySelectorAll('.RA')][0]) {return}

let delBtn = res.querySelector('.right-side .btn-danger');
let btnSpan = document.createElement('span');
delBtn.parentNode.appendChild(btnSpan);
btnSpan.innerHTML = `
<button class="btn btn-info btn-xs RA" onclick="botonera.copyThis(event)" style="background-color:rgba(51,51,51,.5); border-color:rgba(51,51,51,.6);">Copy</button><!-- 📋 -->
<button class="btn btn-info btn-xs RA" onclick="botonera.resetThis(event)" style="margin-left:3px; background-color:rgba(51,51,51,.5); border-color:rgba(51,51,51,.6);">Reset</button><!-- 🔄 -->
`;
},

removeButtons(res) {
let buttons = [...res.querySelectorAll('.RA')];
buttons.forEach(b => {b.remove();});
},

resetThis(e) {
/* deleteAllAnnotations */
if (!window.confirm(`Reset this submission?`)) { return }

trContentElem = e.target.closest('[res-id]').querySelector('[ng-bind-html="tr\\.tr_content | nl2brV2"]');
meta.contextualize(trContentElem);
[...meta.elemRS.querySelectorAll('.highlighted')].forEach(el => {unwrapElement(el)});
tator.gradeReset();
},

copyThis(e) {
let res = e.target.closest('[res-id]');
let copiable = this.getCopiable(res);

navigator.clipboard.writeText(copiable);

/* showToast('Copied!', 700, e.clientX - 10, e.clientY - 40, 'black', 'right'); */
showToast2('Copied!', 700, e, 'black');
},

getCopiable(res) {
let trContentElem = res.querySelector('[ng-show="tr.user.crowd_level.src_lang"]');
meta.contextualize(trContentElem);

let reqDate = new Date((this.getDateFromUrl()) || res.closest('.req_tr').querySelector('.create-date').innerText.substring(9,33));
let csDate = new Date(reqDate); csDate.setDate(csDate.getDate() + 7);
let xlDate = `${csDate.getFullYear()}-${ ('0' + (csDate.getMonth()+1)).slice(-2) }-${ ('0' + csDate.getDate()).slice(-2) }`;
let quality = (res.dataset['grade'] > 0 ) ? 'Good' : (res.dataset['grade'] == 0 ) ? 'SoSo' : 'Bad';
let random = messages.compliments[errata.currLangIndex].length * Math.random() | 0;
let summary = ''; /* `"` */
if (res.dataset['grade'] > 0 ) { summary = messages.compliments[errata.currLangIndex][random] }
else if (res.dataset['grade'] == 0 ) { summary = '특이사항 없음.' }
else {
  let hls = [...res.querySelectorAll('.highlighted')];
  hls.forEach(hl=> {
    let errataFormatted = hl.dataset.errata.split(',').join(', ');
    summary += `(${errataFormatted}) ${(hl.dataset.toggle == 'false') ? hl.dataset.memo : hl.textContent + ' '+ meta.arrow + ' ' + hl.dataset.memo }\v`;
  });
  summary = summary.substring(0, summary.length - 1);
  summary = summary.replaceAll('\n','\v');
  /* summary += `"` */};

copiable = [
  meta.translator, 
  `${meta.sLang}>${meta.tLang}`,
  xlDate,
  summary, 
  meta.reviewer, /* hidden column in gSheet, but used by formula */
  quality,
  `https://www.flitto.com/crowd/translations/${meta.idRQ}`,
];

return copiable.join('\t');
},

getDateFromUrl() {
let url = window.location.href;
let rx = /to_date\=[\d]+/;

if (!rx.test(url)) { return 0 }
return parseInt(rx.exec(url)[0].slice(8));
},
};

/* let */ actionPanel = {
mount() {
let el = document.createElement('div'); el.id = 'actionPanel';
el.innerHTML = this.render();
document.body.append(el);
},

render() {
jab = `
<!-- CopyAll button -->
<button id="copyAllBtn" class="btn btn-info btn-xs" onclick="actionPanel.copyAllRevs(event)">⚡ Copy Revisions ⚡</button>

<!-- Counter display -->
<section id="jumboTron">
  Reviewed REQs:
  <span id="REQcount">0</span>
<br/>
  Reviewed SIDs:
  <span id="SIDcount">0</span>
</section>
<div style="font-size:x-small;padding-top:2px;margin:0;">
<a href="javascript:actionPanel.resetAll()">Reset all</a>
</div>
`;
return jab;
},

copyAllRevs(e) {

let allCopiables = '';
let thisManyCopiables = 0;
let allResInPage = [...document.querySelectorAll('[res-id]')];
allResInPage.forEach( res => {
  if (res.dataset['grade'] === null || res.dataset['grade'] === 'x') { return }
  thisManyCopiables += 1;
  allCopiables +=`${botonera.getCopiable(res)}\r\n`;
});

if (thisManyCopiables === 0) {
  showToast2('🚫 Nothing to copy 🚫', 1000, e, 'maroon');
  return
}

navigator.clipboard.writeText(allCopiables);

showToast2('Copied!', 1000, e, 'black');

},

resetAll() {
if (!window.confirm(`Reset all reviews in this page?`)) { return }
if (!window.confirm(`There's no going back. Are you sure?`)) { return }

allResInPage = [...document.querySelectorAll('[res-id]')];
allResInPage.forEach(res => {
  if (res.dataset['grade'] === null || res.dataset['grade'] === 'x') { return }

  [...res.querySelectorAll('.highlighted')].forEach(el => {unwrapElement(el)});

  SB.delete(res.getAttribute('res-id'))
  .then (()=>{
  res.style.background ='transparent';
  res.dataset['grade'] = 'x';
  botonera.removeButtons(res);
  });
});
},
};

function containsPartialNode(range) {
/* Get range contents as document fragment (not plain text) */
let originalFragment = range.cloneContents();
let temptag = document.createElement('temptag');
try {
range.surroundContents(temptag); /* Fails when selection includes partial node */
} catch {
  return 1;
}

/* Remove 'temptag' node */
document.getElementsByTagName('temptag')[0].remove();
/* Restore original untagged content     */
document.getSelection().getRangeAt(0).insertNode(originalFragment);
/* Restore user selection */
document.getSelection().removeAllRanges(); /* to avoid 'deprecated' warning */
document.getSelection().addRange(range);
return 0;
};

function applyHighlighter() {
let chosenErrata = [];
for (const [key, value] of Object.entries(errata.errTypes)) {
let ck = document.getElementById(key);
let label = document.getElementById(`labelfor${ck.id}`);
if (ck.checked) {chosenErrata.push(label.innerText)}
}

let isSrcToggled = srcToggle.checked;
let memo = tatorTextArea.value;

let hs = document.createElement('span');
hs.className = "highlighted";
hs.dataset['position'] = "center bottom";
hs.dataset['toggle'] = isSrcToggled;
hs.dataset['errata'] = chosenErrata.join(', ');
hs.dataset['memo'] = memo;
hs.dataset['tooltip'] = `<b><i>(${chosenErrata.join(', ')})</i></b> ${(isSrcToggled) ? `${meta.hlText} → ${memo}` : memo}`;

try {
  meta.selectedRange.surroundContents(hs);
} catch {
  if (window.getSelection) {window.getSelection().removeAllRanges();}
  else if (document.selection) {document.selection.empty();}
  return
}
};

function unwrapElement(el) {
/* get the element's parent node */
let parent = el.parentNode;

/* move all children out of the element */
while (el.firstChild) parent.insertBefore(el.firstChild, el);

/* remove the empty element */
parent.removeChild(el);
}

function closestHighlighted(node) {
return (node.classList && node.classList.contains('highlighted')) ? node : closestHighlighted(node.parentElement);
};


/* Tooltip */
/* https://raw.githubusercontent.com/zoltantothcom/vanilla-js-tooltip/master/scripts/vanilla-js-tooltip.min.js */
/* let */ Tooltip=function(t){function e(t,e,o,a){var i,s,r=t.getBoundingClientRect();switch(o){case"left":i=parseInt(r.left)-n-e.offsetWidth,parseInt(r.left)-e.offsetWidth<0&&(i=n);break;case"right":i=r.right+n,parseInt(r.right)+e.offsetWidth>document.documentElement.clientWidth&&(i=document.documentElement.clientWidth-e.offsetWidth-n);break;default:case"center":i=parseInt(r.left)+(t.offsetWidth-e.offsetWidth)/2}switch(a){case"center":s=(parseInt(r.top)+parseInt(r.bottom))/2-e.offsetHeight/2;break;case"bottom":s=parseInt(r.bottom)+n;break;default:case"top":s=parseInt(r.top)-e.offsetHeight-n}i=0>i?parseInt(r.left):i,s=0>s?parseInt(r.bottom)+n:s,e.style.left=i+"px",e.style.top=s+pageYOffset+"px"}var o=t.theme||"dark",a=t.delay||0,n=t.distance||10;document.body.addEventListener("mouseover",function(t){if(t.target.hasAttribute("data-tooltip")){var a=document.createElement("div");a.className="b-tooltip b-tooltip-"+o,a.innerHTML=t.target.getAttribute("data-tooltip"),document.body.appendChild(a);var n=t.target.getAttribute("data-position")||"center top",i=n.split(" ")[0];posVertical=n.split(" ")[1],e(t.target,a,i,posVertical)}}),document.body.addEventListener("mouseout",function(t){t.target.hasAttribute("data-tooltip")&&setTimeout(function(){document.body.removeChild(document.querySelector(".b-tooltip"))},a)})};
/* let */ tooltip = new Tooltip({
theme: "dark",
delay: 0
});

function showToast2(msg, ms, e, bgColor) {
let t = document.createElement('div');

/* APPEAR */
const PromiseIn = new Promise((resolve, reject) => {
t.innerText = msg;
t.setAttribute('style', `
z-index: 1000;
width: max-content;
box-sizing: border-box;
display: block;
position: fixed;
top: ${e.clientY}px;
left: ${e.clientX}px;
background-color: transparent;
color: whitesmoke;
border-radius: 5px;
padding: 5px 10px;
transform: translateX(-50%) translateY(-50%) scale(0);
transition: transform 200ms, background-color 200ms linear;`);
document.body.appendChild(t);
resolve();
});

/* IN */
PromiseIn.then(() => {setTimeout(() => {
t.style.transform = `translateX(-50%) translateY(-100%) scale(1)`; t.style.backgroundColor = bgColor;
}, 100);});

/* OUT */
const PromiseOut = new Promise((resolve, reject) => {
  setTimeout(() => {
    t.style.transform = `translateX(-50%) translateY(-50%) scale(0)`;
    t.style.backgroundColor = 'transparent';
    resolve();
  }, ms);
});

/* DISAPPEAR */
PromiseOut.then(() => {setTimeout(() => {t.remove();}, 1000);});
}


/* /////////////////////////////////////////////////////////////////////// */
/* Auto execute */
/* /////////////////////////////////////////////////////////////////////// */

function main() {

  if (!document.getElementById('tatorWin')) {
    injectRemoteScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js')
    .then(() => {
      /* Supabase credentials */
      const SUPABASE_URL = 'https://iedvqnynungxixxcledf.supabase.co';
      const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjM5MDUxNDUzLCJleHAiOjE5NTQ2Mjc0NTN9.NbzvOdTLfH9Aiw76MS3_Xz9co78iF8qMfgxMML8H-N0';
      SB.client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      /*****/
      page.setup();
      /*****/
    }).catch(error => {console.error(error);});
  }
  /*
  else if (document.querySelector('#jumboTron')) {
    location.reload();
  }
  */
}


function lameify() {
 waitForLoad(); 
}

function waitForLoad() {
  let timedLoop = setInterval(()=>{
    let loadedReqs = document.querySelectorAll('.req_id');
    if (loadedReqs.length > 0) {
      console.log('Loaded reqs: ' + loadedReqs.length);
      main();
      clearInterval(timedLoop);
    } else ( console.log('Awaiting reqs... ... ...'))
  }, 50);
}
