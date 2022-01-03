/* 0.3 (
  - Removed injectRemoteScript as it will be used by bookmark to call CDN
  - Checkbox labels no longer translates [only 2 UI lang instead, as prferred by linguists]
  - ck buttons= +"consistency" , - "guidelines" [as they don't exist])
  - Added counter for "revisions in page"
  - Added Edit option to highlighted spans
) */

/* Settings */
UIlang = 'ko';
supportLang = ['ko', 'en'];
errTypes = {
  ckTypo: ['오타', 'typo'],
  ckGrammar: ['문법', 'grammar'],
  ckOrthography: ['맞춤법', 'orthography'],
  ckPunctuation: ['구두법', 'punctuation'],
  ckTone: ['톤앤매너', 'tone/manner'],
  ckOmissionAddition: ['누락/추가', 'omission/addition'],
  /* ckNoncompliance: ['지침 준수', 'guidelines'], */
  ckConsistency: ['일관성', 'consistency'],
  ckLiteral: ['직역', 'literal translation'],
  ckAwkward: ['어색한 표현', 'unnatural expression'],
  ckMistranslation: ['오역', 'mistranslation'],
};
suggestion = ['TIP', 'suggestion'];
/* minWordCount = 20; */
/* maxSimil; */

/*global*/
let selection;
let selectedRange; /* different methods */
let meta = {reviewer: document.querySelector('.nav>li>a').innerText.split('Hi, ')[1]};
let revCounter = 0;

/* Copy all button */
let xlBtn = document.querySelector('[ng-click="func.getXlsx()"]');
let copyAllBtn = document.createElement('button');
xlBtn.insertAdjacentElement('afterEnd', copyAllBtn);
copyAllBtn.setAttribute('class','btn btn-info btn-xs');
copyAllBtn.style.marginLeft = '5px';
copyAllBtn.innerText = '⚡ Copy Revisions ⚡';
copyAllBtn.setAttribute('onclick','copyAllRevs(event)');

/* Counter display */
let countSpan = document.createElement('span');
copyAllBtn.insertAdjacentElement('afterEnd', countSpan);
countSpan.style.marginLeft = '5px';
countSpan.style.fontWeight = 'bold';
countSpan.innerText = `Reviewed in this page: ${revCounter} SIDs`;

function copyAllRevs(e) {
  console.log(revCounter);
  let allRevs = [...document.querySelectorAll('[data-grade]')];
  if (allRevs.length == 0) {
    showToast('🚫 Nothing to copy 🚫', 1000, e.clientX - 40, e.clientY - 40, 'maroon');
    return
  }

  let copiable = '';
  let copiableAll = '';
  allRevs.forEach(rev => {
    let thisTrContentElem = rev.querySelector('[data-rev-id]');
    updateThisMeta(thisTrContentElem);

    let g;
    let summary ='';
    if (rev.getAttribute('data-grade') > 0 ) {
      g = 'Perfect';
      let messages = ['Great!', 'Great job!', 'Excellent.', 'A translation of the utmost quality.', 'Excellet work', 'Excellent translation.', 'Very good.', 'Outstanding translation.', 'Exactly right.', 'Excellent!', 'A job well done.', 'Exceptional translation.', 'Wonderful!', 'Outstanding!', 'Way to go!', 'Simply superb.', 'Stupendous!', 'First class job.', 'First class work.', 'Right on!', 'I’m impressed!', 'Very well done.', 'Nicely done.', 'Pretty good job.', `Couldn't ask for a better Translation.`, 'Very nice job.', 'Really good work.', 'Really good job.', 'It’s perfect!', 'Well done!', 'What a neat work!', 'That’s the right way to do it.'];
      summary = messages[messages.length * Math.random() | 0];
    } else if (rev.getAttribute('data-grade') == 0 ) {
      g = 'So so';
      summary = '특이사항 없음.';
    } else {
      g = 'Bad';
      let hls = [...rev.querySelectorAll('.highlighted')];
      hls.forEach(hl=> {
        let errataF = hl.dataset.errata.split(',').join(', ');
        if (!errataF) {errataF = suggestion[UIlangIndex]}
        summary += `(${errataF}) ${hl.dataset.memo} || `;
      });
      summary = summary.substring(0, summary.length - 4);
    }

    let nowDate = new Date();
    let xlDate = `${nowDate.getFullYear()}-${nowDate.getMonth()+1}-${nowDate.getDate()}`;
    
    /* empty string for hidden columns */
    copiable = [meta.translator, `${meta.sLang}>${meta.tLang}`, xlDate, summary, '', g, `https://www.flitto.com/crowd/translations/${meta.idRQ}`];
    copiableAll += `${copiable.join('\t')}\r\n`;
    navigator.clipboard.writeText(copiableAll);

    showToast('Copied!', 1000, e.clientX - 40, e.clientY - 40, 'black');
  });
}

/* Annotator HMTL*/
UIlangIndex = supportLang.indexOf(UIlang);
let jab = `
<section id="stateInitial">
  <button id="badBtn" type="button" class="btn btn-danger" onclick="expandAnnotator()">Bad</button>
  <button id="sosoBtn" type="button" class="btn btn-info" onclick="gradeTranslation(0)">So so</button>
  <button id="goodBtn" type="button" class="btn btn-success" onclick="gradeTranslation(1)">Good</button>
</section>
<section id="stateAnnotate">
<textarea id='tatorTextArea'></textarea>
<div id="errataWrap">
`;
for (const [key, value] of Object.entries(errTypes)) {
  jab += `
  <input class="tatorInput" id="${key}" type="checkbox" tabindex="-1">
  <label class="tatorLabel" id="labelfor${key}" for="${key}">${value[UIlangIndex]}</label>
  `;
}
jab += `
</div>
<div id="btnWrap">
  <button id="deleteAllBtn" type="button" class="btn btn-secondary" style="color:black;" onclick="deleteAllAnnotations()">Reset</button>
  <button id="deleteBtn" type="button" class="btn btn-secondary" style="color:black;" onclick="deleteThisAnnotation()">Remove</button>
  <button id="editBtn" type="button" class="btn btn-warning" onclick="editAnnotation()">Edit</button>
  <button id="applyBtn" type="button" class="btn btn-primary" onclick="applyAnnotation()">Add</button>
</div>
</section>
<section id="stateReset">
  <button id="resetBtn" type="button" class="btn btn-secondary" style="color:black;" onclick="resetGrade()">Reset</button>
</section>
`;

let tatorWin = document.createElement('div');
tatorWin.setAttribute('id', 'tatorWin');
tatorWin.innerHTML = jab;

document.body.appendChild(tatorWin);

/* Annotator CSS*/
let styles = `
/* ANNOTATOR */
  #tatorWin {
    z-index: 1000;
    display: flex;
    color: black;
    width: 350px;
    resize: none; /* both; */
    overflow: auto;
    position: fixed;
    border: solid gray 3px;
    border-radius: 3px; 
    background-color: lightgray;
    color: white;
    padding: 10px;
    font-size: 20px;
    font-weight: bold;
    filter: drop-shadow(0 1px 10px rgba(113,158,206,0.8));
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
    #stateInitial, #btnWrap {
      display: flex;
      flex-direction: row;
      flex: 1 0 100%;
      gap: 10px;
    }
      #badBtn, #sosoBtn, #goodBtn {
        margin-left: auto; /* aligns right*/
        flex: 0 0 30%;
        align-self: right;
      }

      #deleteBtn, #deleteAllBtn, #applyBtn { /* Notice editBtn is missing */
        margin-left: auto; /* aligns right*/
        flex: 0 0 25%;
        align-self: right;
      }

    #stateReset {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }

      #resetBtn {
        flex: 0 0 50%;
        align-self: center;
      }

/*CHECK BUTTONS*/
  #errataWrap{
    margin: 4px 0;
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
  `;
let styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

/* Annotator events*/
window.addEventListener('click', () => {resetAnnotator();}); /* Hide when anything clicked */
tatorWin.addEventListener('click', e => {e.stopPropagation();}); /* Exclude from window.onclick (Don't reset when self clicked) */  
document.addEventListener('keyup', e => { if(e.key === "Escape"){ resetAnnotator(); } });/* Hide with esc key */
document.addEventListener('scroll', () => { resetAnnotator(); }); /* Hide on scroll */

/* Get Supabase client */
let supaClient = '';
injectRemoteScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js')
  .then(() => {
    /* Supabase credentials */
    const SUPABASE_URL = 'https://iedvqnynungxixxcledf.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjM5MDUxNDUzLCJleHAiOjE5NTQ2Mjc0NTN9.NbzvOdTLfH9Aiw76MS3_Xz9co78iF8qMfgxMML8H-N0';
    supaClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    /*****/
    bringExistingRevs();
    /*****/
  }).catch(error => {console.error(error);});

/* Tooltip */
/* https://raw.githubusercontent.com/zoltantothcom/vanilla-js-tooltip/master/scripts/vanilla-js-tooltip.min.js */
let Tooltip=function(t){function e(t,e,o,a){var i,s,r=t.getBoundingClientRect();switch(o){case"left":i=parseInt(r.left)-n-e.offsetWidth,parseInt(r.left)-e.offsetWidth<0&&(i=n);break;case"right":i=r.right+n,parseInt(r.right)+e.offsetWidth>document.documentElement.clientWidth&&(i=document.documentElement.clientWidth-e.offsetWidth-n);break;default:case"center":i=parseInt(r.left)+(t.offsetWidth-e.offsetWidth)/2}switch(a){case"center":s=(parseInt(r.top)+parseInt(r.bottom))/2-e.offsetHeight/2;break;case"bottom":s=parseInt(r.bottom)+n;break;default:case"top":s=parseInt(r.top)-e.offsetHeight-n}i=0>i?parseInt(r.left):i,s=0>s?parseInt(r.bottom)+n:s,e.style.left=i+"px",e.style.top=s+pageYOffset+"px"}var o=t.theme||"dark",a=t.delay||0,n=t.distance||10;document.body.addEventListener("mouseover",function(t){if(t.target.hasAttribute("data-tooltip")){var a=document.createElement("div");a.className="b-tooltip b-tooltip-"+o,a.innerHTML=t.target.getAttribute("data-tooltip"),document.body.appendChild(a);var n=t.target.getAttribute("data-position")||"center top",i=n.split(" ")[0];posVertical=n.split(" ")[1],e(t.target,a,i,posVertical)}}),document.body.addEventListener("mouseout",function(t){t.target.hasAttribute("data-tooltip")&&setTimeout(function(){document.body.removeChild(document.querySelector(".b-tooltip"))},a)})};
let tooltip = new Tooltip({
  theme: "dark",
  delay: 0
});

/* SETUP PAGE (BRING PREVIOUS REVS AND ADD EVENT LISTENERS) ////////////////////////////////////*/
function bringExistingRevs(){
  allresInPage = [...document.querySelectorAll('[res-id]')];
  allresInPage.forEach(res => {

    let rev = res.querySelector('.col-md-12.tr').querySelector('[ng-show="tr\\.tr_content"]');
    rev.dataset['revId'] = res.getAttribute('res-id'); /* to detect rev area on show anno */
    rev.onclick = e => showAnnotator(e);

    querySB(res)
    .then(data => {
      /* copy grade and summary locally to avoid further queries */
      res.dataset['grade'] = data[0].grade;

      /* bring comments */
      if (data[0].annotated) { rev.innerHTML = data[0].annotated; }
      
      /* re-color */
      if (data[0].grade < 0) {
        res.style.background = 'lightpink';
      } else if (data[0].grade == 0) {
        res.style.background = 'paleturquoise';
      } else if (data[0].grade >0) {
        res.style.background = 'palegreen';
      }

      /* count */
      revCounter += 1;
      countSpan.innerText = `Reviewed in this page: ${revCounter} SIDs`;

    })
    .catch(e => {
      console.log(`bah ${e}`);
    });
  });
}
/* //////////////////////////////////////////////////////////////////////////////////////// */

async function querySB(res) {
  let rvid = res.getAttribute('res-id');
  const { data, error } = await supaClient
                          .from('Revisions')
                          .select()
                          .eq('rvid', rvid);

  if (error) {
    alert('Something went wrong.');
    console.log(error);
  }

  return await data;
}

async function insertSB(points, opt1) {
  let anno = (typeof opt1 === 'undefined') ? null : meta.elemRV.innerHTML;
  let payload = [{
    rvid: meta.idRS,
    submitted_at: meta.submissionDate,
    reviewer: meta.reviewer,
    translator: meta.translator,
    profile: meta.profile,
    src_lang: meta.sLang,
    tar_lang: meta.tLang,
    /* ntv_lang: meta.nLAng, */
    grade: points,
    annotated: anno,
  }];

  let { error } = await supaClient
                    .from('Revisions')
                    .insert(payload);

  if (error) {
    alert('Something went wrong.');
    console.log(error);
  }
}

async function deleteSB() {
  let { error } = await supaClient
                          .from('Revisions')
                          .delete()
                          .eq('rvid', meta.idRS);

  if (error) {
    alert('Something went wrong.');
    console.log(error);
  }
}

async function updateSB() {
  let { error } = await supaClient
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
}

function getSelected() {
  if (window.getSelection) {
      selection = window.getSelection();
  } else if (document.getSelection) {
      selection = document.getSelection();
  } else if (document.selection) {
      selection = document.selection.createRange().text;
  }
  return selection
}

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
}

function showAnnotator(e) {
  /* Limit selection to one node */
  e.stopPropagation(); /* Exclude from closing on window.onclick */
  selectedRange = getSelected().getRangeAt(0); /* Support only first selected range in Firefox + access range methods */
  if (selectedRange == "") {resetAnnotator(); return} /* Nothing selected */
  if (containsPartialNode(selectedRange)) {
    if (window.getSelection) {window.getSelection().removeAllRanges()}
    else if (document.selection) {document.selection.empty();}
    resetAnnotator();
    return
  }

  /* Update global meta object*/
  let thisTrContent = selectedRange.commonAncestorContainer.closest('[data-rev-id]');
  if (thisTrContent != meta.elemRV) { updateThisMeta(thisTrContent); }
  /* Pre-populate */
  meta.hlText = selection.toString().trim();
  tatorTextArea.value = meta.hlText;
  
  /* Handle state */
  if (!meta.elemRS.dataset['grade']) {
    stateInitial.style.display = 'flex';
    stateAnnotate.style.display = 'none';
    stateReset.style.display = 'none';
  }
  else if (meta.elemRS.dataset['grade'] >= 0) {
    stateInitial.style.display = 'none';
    stateAnnotate.style.display = 'none';
    stateReset.style.display = 'flex';
  } else {
    stateInitial.style.display = 'none';
    stateAnnotate.style.display = 'block';
    stateReset.style.display = 'none';

      /* Translate checkboxes */
      /* translateCK(); */
  }

  /* Show apply button? */
  if(selectedRange.toString() == selection.focusNode.textContent) {
    applyBtn.style.visibility = 'hidden';
  } else {
    applyBtn.style.visibility = 'visible';
  }

  /* Show reset, delete, edit buttons? */
  if (selection.focusNode.className === 'highlighted') {
    deleteBtn.style.visibility = 'visible';
    editBtn.style.visibility = 'visible';
    deleteAllBtn.style.visibility = 'hidden';
  } else {
    deleteBtn.style.visibility = 'hidden';
    editBtn.style.visibility = 'hidden';
    /* Show delete All button ? */
    deleteAllBtn.style.visibility = (meta.elemRS.querySelector('.highlighted')) ? 'visible' : 'hidden';
  }

  /* Show */
  tatorWin.style.setProperty('left', `${e.clientX}px`);
  tatorWin.style.setProperty('top', `${e.clientY}px`);
  tatorWin.style.setProperty('display','block');

  /* Reposition */
  repositionIfOverflow(10, 10);

  /* Select and focus */
  tatorTextArea.select();
  tatorTextArea.focus();
}

function updateThisMeta(thisTrContentElem) {
  meta.elemRV = thisTrContentElem;
  meta.elemRS = meta.elemRV.closest('[res-id]');
  meta.elemRQ = meta.elemRS.closest('.req_tr');
  meta.idRS = meta.elemRS.getAttribute('res-id');
  meta.idRQ = meta.elemRQ.querySelector('.req_id>a').innerText;
  meta.translator = meta.elemRS.querySelector('a.username').innerText;
  meta.langs = meta.elemRQ.querySelector('.lang').innerText;
  meta.sLang = meta.langs.split(' ')[0];
  meta.tLang = meta.langs.split(' ')[2];
  /* meta.nLang */
  meta.sCode = getLangCodeFromName(meta.sLang);
  meta.tCode = getLangCodeFromName(meta.tLang);
  meta.profile = `${meta.translator}_${meta.sCode}${meta.tCode}`;
  meta.submissionDate = new Date(meta.elemRS.querySelector('.date').innerText.split(' (')[0]).toISOString();
}

function repositionIfOverflow(pxLower, pxRighter) {
  /* Calculate position to prevent overflow (must be visible first) */
  annotatorRight = tatorWin.getBoundingClientRect().right;
  annotatorLeft = tatorWin.getBoundingClientRect().left;
  annotatorTop = tatorWin.getBoundingClientRect().top;
  annotatorBottom = tatorWin.getBoundingClientRect().bottom;
  winWidth = document.documentElement.clientWidth || document.body.clientWidth || window.innerWidth;
  winHeight = document.documentElement.clientHeight || document.body.clientHeight || window.innerHeight;

  /* Set Y */
  if (annotatorBottom + 15 >= winHeight) {
    tatorWin.style.setProperty('top', `${winHeight - (annotatorBottom - annotatorTop)}px`);
  } else {
    tatorWin.style.setProperty('top',  `${annotatorTop + pxLower}px`);
  }

  /* Set X */
  if (annotatorRight >= winWidth) {
    tatorWin.style.setProperty('left', `${winWidth - (annotatorRight - annotatorLeft)}px`);
  } else {
    tatorWin.style.setProperty('left',  `${annotatorLeft + pxRighter}px`);
  }
}

/* function translateCK() {
  let labels = [...errataWrap.querySelectorAll('input')];
  labels.forEach(ck => {
    let ckid = ck.id;
    UIlangIndex = supportLang.indexOf(meta.tCode);
    let la = document.getElementById(`labelfor${ckid}`);
    la.innerText = errTypes[ckid][UIlangIndex];
  });
} */

function expandAnnotator() {
  /* translateCK(); */
  stateAnnotate.style.display = 'block';
  stateInitial.style.display = 'none'; 
  repositionIfOverflow(0, 0);
  tatorTextArea.select();
  tatorTextArea.focus();
}

function resetAnnotator() {
  /* hide */
  tatorWin.style.setProperty('display','none');
  /* uncheck boxes */
  for (let key in errTypes) {
    document.getElementById(key).checked = false;
  }
}

function gradeTranslation(points) {
  let color;
  if (points > 0) { color ='palegreen' }
  else { color ='paleturquoise'; }

  insertSB(points).then(() => {
    meta.elemRS.dataset['grade'] = points;
    meta.elemRS.style.background = color;
    revCounter += 1;
    countSpan.innerText = `Reviewed in this page: ${revCounter} SIDs`;
  });

  resetAnnotator();
}

function applyAnnotation() {   
  let points = -1; 
  
  /* Get ERRATA and add to HL data attribute */
  let chosenErrata = [];
  for (const [key, value] of Object.entries(errTypes)) {
    let ck = document.getElementById(key);
    if (ck.checked) {chosenErrata.push(value[UIlangIndex])}
  }

  /* Get MEMO and add to HL data attribute */
  let memo = tatorTextArea.value;

  applyHighlighter(chosenErrata, memo);

  if (!meta.elemRS.dataset['grade']) {
    /* (1st time -> Insert) */
      insertSB(points, true).then(() => {
        meta.elemRS.dataset['grade'] = points;
        meta.elemRS.style.background ='lightpink';
        revCounter += 1;
        countSpan.innerText = `Reviewed in this page: ${revCounter} SIDs`;
      }); /* Add catch */
  } else {
    /* (NOT 1st time -> Update) */
    updateSB();
  }
  resetAnnotator();
}

function editAnnotation() {
  let thisAnno = selectedRange.commonAncestorContainer;

  /* Get ERRATA and add to HL data attribute */
  let chosenErrata = [];
  for (const [key, value] of Object.entries(errTypes)) {
    let ck = document.getElementById(key);
    if (ck.checked) {chosenErrata.push(value[UIlangIndex])}
  }

  /* Get MEMO and add to HL data attribute */
  let memo = tatorTextArea.value;

  /* Update attributes */
  thisAnno.dataset.errata = chosenErrata;
  thisAnno.dataset.memo = memo;
  if (chosenErrata.length > 0) {
    memo = `<b><i>(${chosenErrata.join(', ')})</i></b> ${memo}`
  } else {
    memo = `<b><i>(${suggestion[UIlangIndex]})</i></b> ${memo}`
  }
  thisAnno.dataset.tooltip = memo;

  updateSB();

  resetAnnotator();

}

function applyHighlighter(chosenErrata, memo) {
  let hs = document.createElement('span');
  hs.className = "highlighted";
  hs.dataset.position = "center bottom";
  hs.dataset.errata = chosenErrata;
  hs.dataset.memo = memo;
  /* tooltip data */
  if (chosenErrata.length > 0) {
    memo = `<b><i>(${chosenErrata.join(', ')})</i></b> ${memo}`
  } else {
    memo = `<b><i>(${suggestion[UIlangIndex]})</i></b> ${memo}`
  }
  hs.dataset.tooltip = memo;
  
  try {
      selectedRange.surroundContents(hs);
  } catch {
      if (window.getSelection) {window.getSelection().removeAllRanges();}
      else if (document.selection) {document.selection.empty();}
      return
  }
}

function deleteThisAnnotation() {
  let thisAnno = selectedRange.commonAncestorContainer;
  unwrapElement(thisAnno);
  if (meta.elemRS.querySelectorAll('.highlighted').length == 0) {resetGrade(); return}
  updateSB();
  resetAnnotator();
}

function unwrapElement(el) {
  /* get the element's parent node */
  var parent = el.parentNode;
  
  /* move all children out of the element */
  while (el.firstChild) parent.insertBefore(el.firstChild, el);
  
  /* remove the empty element */
  parent.removeChild(el);
}

function deleteAllAnnotations() {
  if (!window.confirm(`Reset this submission?`)) { return }
  deleteSB()
  .then (()=>{
    meta.elemRS.style.background ='transparent';
    meta.elemRS.removeAttribute('data-grade');
    [...meta.elemRS.querySelectorAll('.highlighted')].forEach(el => {unwrapElement(el)});
    revCounter += -1;
    countSpan.innerText = `Reviewed in this page: ${revCounter} SIDs`
  });
  resetAnnotator();

}

function resetGrade() {
  deleteSB()
  .then (()=>{
  meta.elemRS.style.background ='transparent';
  meta.elemRS.removeAttribute('data-grade');
  revCounter += -1;
  countSpan.innerText = `Reviewed in this page: ${revCounter} SIDs`
  });
  resetAnnotator();
  deselect();
}

function getLangCodeFromName (langName) {
  let isoCodes = {
  'English' : 'en',
  'Spanish' : 'es',
  'Korean' : 'ko',
  'Indonesian' : 'in',
  };
  return isoCodes[langName];
}

function deselect() {
    if (window.getSelection) {window.getSelection().removeAllRanges();}
    else if (document.selection) {document.selection.empty();}
}


function showToast(msg, ms, x, y, bgColor) {
  let t = document.createElement('div');

  /* APPEAR */
  const PromiseIn = new Promise((resolve, reject) => {
    t.innerText = msg;
    t.setAttribute('style', `
    x-index: 1000;
    box-sizing: border-box;
    display: block;
    position: fixed;
    top: ${y}px;
    left: -200px; /*out of sight*/
    background-color: transparent;
    color: whitesmoke;
    border-radius: 5px;
    padding: 5px 10px;
    transition: left 200ms linear, background-color 200ms linear;`);
    document.body.appendChild(t);

    resolve();
  });

  /* IN */
  PromiseIn.then(() => {setTimeout(() => {t.style.left = `${x}px`; t.style.backgroundColor = `${bgColor}`;}, 100);});
  
  /* OUT */
  const PromiseOut = new Promise((resolve, reject) => {
      setTimeout(() => {
          t.style.left = '-200px';
          t.style.backgroundColor = 'transparent';
          resolve();
      }, ms);
  });

  /* DISAPPEAR */
  PromiseOut.then(() => {setTimeout(() => {t.remove();}, 1000);});
}
