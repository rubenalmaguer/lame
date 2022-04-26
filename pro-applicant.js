function lameify() {
  
  /* Limit to once */
  if (!document.querySelector('.score')) { 
    waitForLoad();
  }

  /* Wait for every loading icon to disappear (<i class="fa fa-spinner fa-spin"></i>) */
  function waitForLoad(){
    let waitItOut = setInterval(()=>{
      if (!document.querySelector('.fa-spinner')) {
        main();
        clearInterval(waitItOut);
      }
    }, 200);
  }
  
}  


async function main() {
  let tableHeadings = document.querySelectorAll('th');
  let mainTable = null;
  /* Get main table */
  for (let i = 0; i < tableHeadings.length; i++) {
      if (tableHeadings[i].textContent === 'Lang Pair') {
          mainTable = tableHeadings[i].closest('table');
          break
      };
  }
  /* Add score containers */
  if (mainTable) {
    let contentRows = mainTable.querySelectorAll('tr');
    for (let i = 1; i < contentRows.length; i++) { /* "0" is headings */
      let dataCells = contentRows[i].querySelectorAll('td');
      let scoreWrapper = dataCells[0].querySelector('.mg-t-5');
      scoreWrapper.innerHTML = `<span class='score' style="color:red;">Loading...</span>`;
    }

    for (let i = 1; i < contentRows.length; i++) { /* ASYNC for */
      console.log(`ROW ${i}:`);
      let dataCells = contentRows[i].querySelectorAll('td');
      /* let clone = dataCells[0].cloneNode(true); Find out loading icon id by cloning node before it fully loads*/
      let langSrc = getLangCode(dataCells[0].querySelector('.label-default').textContent);
      let langTar = getLangCode(dataCells[0].querySelector('.label-primary').textContent);
      let srcContent = dataCells[1].innerText.trim()/* .replaceAll('\\n','\\\\n') */; /* innerText !!! textContent loses line breaks */
      let tarContent = dataCells[2].innerText.trim(); /* encodeURIComponent not needed (only for GET) */
      
      let srcContentEsc = JSON.stringify(srcContent); /* Escape straight double quotes for JSON */
      srcContentEsc = srcContentEsc.slice(1, srcContentEsc.length-1); /* Remove surrouding quotes added by JSON.stringify */

      /* POST request to add translations to cards */
      let response = await postFlittoApi(langSrc, langTar, srcContentEsc);
      /* GET request to read updated cards */
      try {
        if (response.result === 'done') {
          let data = await getFlittoApi(langSrc, langTar, srcContentEsc);
          let translations;
          for (let i = 0; i < data.data.length; i++) {
            if (data.data[i].org_text === srcContent) { /* Compare to without escaping */
              console.log(data.data[i]);
              translations = data.data[i].trans_text;
              id = data.data[i].id;
                break
            };
          }
          let scoreWrapper = dataCells[0].querySelector('.mg-t-5');
          displayScore(translations, tarContent, scoreWrapper);
          deleteFromFlittoApi(id, i);
        }
      } catch (error) {
        console.log(error);
        let scoreWrapper = dataCells[0].querySelector('.mg-t-5');
        scoreWrapper.textContent = 'FAILED';
      }
    }   
  }
}

function getComparisons(translations, human) {
  let highestScore = 0;

  for (var key in translations) {
    if (translations.hasOwnProperty(key)) {
      let similarity = compareTwoStrings(translations[key], human);
      highestScore = (similarity > highestScore) ? similarity : highestScore;
      translations[key] = {
        translation: translations[key],
        similarity: (translations[key] === '지원하지 않음') ? '지원하지 않음' : similarity,
      };
    }
  }
  
  for (var key in translations) {
		if (translations.hasOwnProperty(key)) {
		  translations[key]['isHighest'] = (translations[key]['similarity'] == highestScore) ?
		  true : false;
	  }
	}
	
	return translations
};

function displayScore(translations, human, displayElement) {
  addModal();

  translations = getComparisons(translations, human);

  Object.assign(displayElement, {
    innerHTML: '',
    style: 'display:flex; flex-direction:column; align-items:center; padding-top: 10px;',
    classList: 'score',
  });

  for (var key in translations) {
		if (translations.hasOwnProperty(key)) {
      let notSupported = (translations[key]['translation'] === '지원하지 않음');
      let score = (notSupported) ? 'Not supported' : percentStyle(translations[key]['similarity']);
      let fontWeight = (translations[key]['isHighest']) ? 'bold' : 'normal';
      let clickable = `onMouseOver="this.style.color='#007bff'; this.style.cursor='pointer'"
      onMouseOut="this.style.color='#1F618D'; this.style.cursor='default'"
      onclick="showDiff(event)"`;

      displayElement.innerHTML += `<div style="display:flex; flex-direction:row; align-items: center;">
      <img src="https://api-demo.flit.to:2222/img/${key}.png" alt="${key}"
      style="width: 16px; height: 16px; border: 1px solid gray; border-radius: 10px; margin-right: 5px;">
      <span style="${(notSupported) ? '' : 'text-decoration: underline; '}margin-top:2px; color: #1F618D; font-size: 16px; font-weight: ${fontWeight};"
      data-translation="${escapeMarkup(translations[key]['translation'])}"
      ${(notSupported) ? '' : clickable}>
      ${score}
      </span>
      </div>`
      }
  }
}

function showDiff(e) {
  let tl = getLangCode(e.target.closest('tr').querySelectorAll('td')[0].querySelector('.label-primary').textContent);
  let unit = (['ko','ja','zh-CN','zh-TW','zh'].includes(tl)) ? 'char' : 'word';
  let direction = (['ar', 'iw', 'fa', 'ur'].includes(tl)) ? ['right', 'rtl'] : ['left', 'ltr'];

  let diffDiv = document.getElementById('diff-goes-here');
  diffDiv.innerHTML = '';
  diffDiv.style.cssText +=`; text-align: ${direction[0]}; direction: ${direction[1]};`;
  
  let mt = e.target.dataset['translation'];
  let human = e.target.closest('tr').querySelectorAll('td')[2].innerText.trim();
  diffDiv.appendChild(getDiff(mt, human, unit));

  document.getElementById('diff-viewer').showModal();
  /* TODO: Save diff as attribute data */
}

function addModal() {
  if (document.getElementById('diff-viewer')) { return }
  let diffViewer = Object.assign(document.createElement('dialog'), {
    id: 'diff-viewer',
    open: '',
    style: 'padding: 1em 2em 2em 2em ; min-width:80ch; max-width:100ch; max-height: 80vh; border: 0; box-shadow: #000 0px 0px 1em; border-radius: 5px;',
    innerHTML: `
    <div style="display: flex; align-items: start; justify-content: space-between;">
    <h3 style="user-select: none;">🟥 MT</h3>
    <h3 style="user-select: none;">🟩 USER</h3>
    <button id="btn-close-diff-modal" type="button" class="btn btn-xs btn-secondary" style="border-radius: 50%; transform: translate(50%);">
    <i class="fa fa-times fa-lg"></i>
    </button>
    </div>
    <div id='diff-goes-here' style="max-height: 60vh; overflow-y: auto; border: solid 1px lightgray; padding: 1em;"></div>`,
  });
  document.body.append(diffViewer);

  let btnCloseModal = document.getElementById('btn-close-diff-modal');
  btnCloseModal.addEventListener('click', () => {
    diffViewer.close();
  });

  let styleSheet = Object.assign(document.createElement('style'), {
  textContent: 'dialog::backdrop { background: #000; opacity: 0.5; transition: opacity .15s linear; }',
  });
  document.head.appendChild(styleSheet);
}

async function postFlittoApi(sl, tl, ogTxt) {
  const url = 'https://api-demo.flit.to:2222/cards';

  /* Escape quotes */

  let options = {
    method: 'POST',
    headers: {Authorization: '', 'content-type': 'application/json'},
    body: `{"org_text":"${ogTxt}","status":"-","name":"Flitto","org_lang":"${sl}","dst_lang":"${tl}","is_polite":"n","is_html":"n"}`
  };

  console.log(options);

  return fetch( url, options )
        .then(response => {
          if (!response.ok) { /* was it successful (status code 200-299) ? */
            throw new Error(`Request failed with status ${response.status}`)
          }
          return response.json()
        })
        .catch(error => console.log(error))
  
}

async function getFlittoApi(sl, tl) {
  const options = {method: 'GET', headers: {'content-type': 'application/json'}};

  return fetch(`https://api-demo.flit.to:2222/cards?name=Flitto&org_lang=${sl}&dst_lang=${tl}`, options)
        .then(response => {
          return response.json()
        })
        .catch(err => console.error(err));
}

function deleteFromFlittoApi(id, row) {
  const options = {
    method: 'DELETE',
    headers: {Authorization: '', 'content-type': 'application/json'},
    body: '{}'
  };
  
  fetch(`https://api-demo.flit.to:2222/cards/${id}`, options)
    .then(response => response.json())
    .then(response => { if (response.result === 'done') { console.log(`%c deletion complete (ID ${id} / ROW ${row})`, 'color:green')} })
    .catch(err => console.error(err));
}

function getLangCode(flittoName) {
  let gtCodes= {
    'Arabic': 'ar',
    'Chinese(Simplified)': 'zh-CN',
    'Chinese(Traditional)': 'zh-TW',
    'Croatian': 'hr',
    'Czech': 'cs',
    'Dutch': 'nl',
    'English': 'en',
    'Finnish': 'fi',
    'French': 'fr',
    'German': 'de',
    'Greek': 'el',
    'Hebrew': 'iw',
    'Hindi': 'hi',
    'Hungarian': 'hu',
    'Indonesian': 'id',
    'Italian': 'it',
    'Japanese': 'ja',
    'Khmer': 'km',
    'Korean': 'ko',
    'Malay': 'ms',
    'Persian': 'fa',
    'Polish': 'pl',
    'Portuguese': 'pt',
    'Romanian': 'ro',
    'Russian': 'ru',
    'Slovak': 'sk',
    'Spanish': 'es',
    'Swedish': 'sv',
    'Thai': 'th',
    'Turkish': 'tr',
    'Ukrainian': 'uk',
    'Uzbek': 'uz',
    'Vietnamese': 'vi',
    'Tagalog': 'tl',
    'Swahili': 'sw',
    'English(British)': 'en' /* unavailiable */,
    'Spanish(LatinAmerica)': 'es' /* unavailiable */,
    'Portuguese(Brazil)': 'pt' /* unavailiable */,
    'French(Canada)': 'fr' /* unavailiable */,
    'Burmese': 'my',
    'Chinese(Cantonese)': 'zh-TW' /* unavailiable */,
    };

  return gtCodes[flittoName.replace(' ', '')];
}

function percentStyle(float){
  return float.toFixed(2).replace(/[.,]00$/, "") + '%';
}

function compareTwoStrings(first, second) {
/*https://github.com/aceakash/string-similarity/blob/master/src/index.js*/
  first = first.replace(/\s+/g, '');
  second = second.replace(/\s+/g, '');
  
  if (first === second) return 100; /* identical or empty */
  if (first.length < 2 || second.length < 2) return 0; /* if either is a 0-letter or 1-letter string */
  
  let firstBigrams = new Map();
  for (let i = 0; i < first.length - 1; i++) {
      const bigram = first.substring(i, i + 2);
      const count = firstBigrams.has(bigram)
          ? firstBigrams.get(bigram) + 1
          : 1;
  
      firstBigrams.set(bigram, count);
  };
  
  let intersectionSize = 0;
  for (let i = 0; i < second.length - 1; i++) {
      const bigram = second.substring(i, i + 2);
      const count = firstBigrams.has(bigram)
          ? firstBigrams.get(bigram)
          : 0;
  
      if (count > 0) {
          firstBigrams.set(bigram, count - 1);
          intersectionSize++;
      }
  }
  return (2.0 * intersectionSize) / (first.length + second.length - 2) * 100;
}


function escapeMarkup(dangerousInput) {
  const dangerousString = String(dangerousInput);
  const matchHtmlRegExp = /["'&<>]/;
  const match = matchHtmlRegExp.exec(dangerousString);
  if (!match) {
    return dangerousInput;
  }

  const encodedSymbolMap = {
    '"': '&quot;',
    '\'': '&#39;',
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
  };
  const dangerousCharacters = dangerousString.split('');
  const safeCharacters = dangerousCharacters.map(function (character) {
    return encodedSymbolMap[character] || character;
  });
  const safeString = safeCharacters.join('');
  return safeString;
}

function patienceDiff(aLines, bLines, diffPlusFlag) {
  /*https://github.com/jonTrent/PatienceDiff/blob/dev/PatienceDiff.js*/
      function findUnique(arr, lo, hi) {
      
      var lineMap = new Map();
      
      for (let i = lo; i <= hi; i++) {
          let line = arr[i];
          if (lineMap.has(line)) {
          lineMap.get(line).count++;
          lineMap.get(line).index = i;
          } else {
          lineMap.set(line, {count:1, index: i});
          }  
      }
      
      lineMap.forEach((val, key, map) => {
          if (val.count !== 1) {
          map.delete(key);
          } else {
          map.set(key, val.index);
          }
      });
      
      return lineMap;
      }
  
      function uniqueCommon(aArray, aLo, aHi, bArray, bLo, bHi) {
      let ma = findUnique(aArray, aLo, aHi);
      let mb = findUnique(bArray, bLo, bHi);
      
      ma.forEach((val, key, map) => {
          if (mb.has(key)) {
          map.set(key, {indexA: val, indexB: mb.get(key)});
          } else {
          map.delete(key);
          }
      });
      
      return ma;
      }
  
      function longestCommonSubsequence(abMap) {
      
      var ja = [];
      
      abMap.forEach((val, key, map) => {
          let i = 0;
          while (ja[i] && ja[i][ja[i].length-1].indexB < val.indexB) {
          i++;
          }
          
          if (!ja[i]) {
          ja[i] = [];
          }
  
          if (0 < i) {
          val.prev = ja[i-1][ja[i-1].length - 1];
          }
  
          ja[i].push(val);
      });
      
      var lcs = [];
      if (0 < ja.length) {
          let n = ja.length - 1;
          var lcs = [ja[n][ja[n].length - 1]];
          while (lcs[lcs.length - 1].prev) {
          lcs.push(lcs[lcs.length - 1].prev);
          }
      }
      
      return lcs.reverse();
      }
      let result = [];
      let deleted = 0;
      let inserted = 0;	
      let aMove = [];
      let aMoveIndex = [];
      let bMove = [];
      let bMoveIndex = [];
      
      function addToResult(aIndex, bIndex) {
      
      if (bIndex < 0) {
          aMove.push(aLines[aIndex]);
          aMoveIndex.push(result.length);
          deleted++;
      } else if (aIndex < 0) {
          bMove.push(bLines[bIndex]);
          bMoveIndex.push(result.length);
          inserted++;
      }
  
      result.push({line: 0 <= aIndex ? aLines[aIndex] : bLines[bIndex], aIndex: aIndex, bIndex: bIndex});
      }
      
      function addSubMatch(aLo, aHi, bLo, bHi) {
      
      while (aLo <= aHi && bLo <= bHi && aLines[aLo] === bLines[bLo]) {
          addToResult(aLo++, bLo++);
      }
  
      let aHiTemp = aHi;
      while (aLo <= aHi && bLo <= bHi && aLines[aHi] === bLines[bHi]) {
          aHi--;
          bHi--;
      }
      
      let uniqueCommonMap = uniqueCommon(aLines, aLo, aHi, bLines, bLo, bHi);
      if (uniqueCommonMap.size === 0) {
          while (aLo <= aHi) {
          addToResult(aLo++, -1);
          }
          while (bLo <= bHi) {
          addToResult(-1, bLo++);
          }    
      } else {
          recurseLCS(aLo, aHi, bLo, bHi, uniqueCommonMap);
      }
      
      while (aHi < aHiTemp) {
          addToResult(++aHi, ++bHi);
      } 
      }
  
      function recurseLCS(aLo, aHi, bLo, bHi, uniqueCommonMap) {
      var x = longestCommonSubsequence(uniqueCommonMap || uniqueCommon(aLines, aLo, aHi, bLines, bLo, bHi));
      if (x.length === 0) {
          addSubMatch(aLo, aHi, bLo, bHi);
      } else {
          if (aLo < x[0].indexA || bLo < x[0].indexB) {
          addSubMatch(aLo, x[0].indexA-1, bLo, x[0].indexB-1);
          }
  
          let i;
          for (i = 0; i < x.length - 1; i++) {
          addSubMatch(x[i].indexA, x[i+1].indexA-1, x[i].indexB, x[i+1].indexB-1);
          }
          
          if (x[i].indexA <= aHi || x[i].indexB <= bHi) {
          addSubMatch(x[i].indexA, aHi, x[i].indexB, bHi);
          }
      }
      }
      
      recurseLCS(0, aLines.length-1, 0, bLines.length-1);
      
      if (diffPlusFlag) {
      return {lines: result, lineCountDeleted: deleted, lineCountInserted: inserted, lineCountMoved: 0, aMove: aMove, aMoveIndex: aMoveIndex, bMove: bMove, bMoveIndex: bMoveIndex};
      }
      
      return {lines: result, lineCountDeleted: deleted, lineCountInserted: inserted, lineCountMoved:0};
  }

  

function getDiff(oldText, newText, unit) {
let fragment = document.createDocumentFragment();

/* Make array of words (" ") or characters ("") */
if (unit == 'char') {
    oldText = oldText.split("");
    newText = newText.split("");
}

/*Make spaces and new lines traceable by adding placeholders surrounded by actual spaces*/
if (unit == 'word') {
    oldText = oldText.replaceAll(' ', ' «space» ').replaceAll('\n', ' \n ').split(" ");
    newText = newText.replaceAll(' ', ' «space» ').replaceAll('\n', ' \n ').split(" ");
}

/*Generate diff object*/
let diff = patienceDiff(oldText, newText);

/* In this case, the 'lines' property refers to words or characters */
diff.lines.forEach((o) => {
  var color = "";
  var deco = "";

  /*Format*/
  if (o.aIndex < 0) {
      /*INSERTION*/
      color = 'rgba(0, 255, 0, 0.3)';
      deco = 'underline';
      /*Show added line breaks*/
      if (o.line == "\n") {o.line = "[↵]\n"}  

  } else if (o.bIndex < 0) {
      /*DELETION*/
      color = 'rgba(255, 0, 0, 0.3)';
      deco = 'line-through';
      /*Show removed lines breaks*/
      if (o.line == "\n") {o.line = "[↵]"}  
  } 

  span = document.createElement('span');
  span.style.backgroundColor = color;
  span.style.textDecoration = deco;
  if (unit == 'word') {o.line = o.line.replaceAll('«space»', ' ');}
  span.appendChild(document.createTextNode(o.line));
  if (o.line == '[↵]\n' || o.line == '\n') span.appendChild(document.createElement('br')); /*Show ALL line breaks*/
  fragment.appendChild(span);
  });
return fragment;
}
