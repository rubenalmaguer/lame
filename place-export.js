USER_TOKEN = localStorage.getItem('access_token');
OPTIONS_FOR_GET = {
  method: 'GET',
  headers: { Authorization: 'Bearer ' + USER_TOKEN, 'content-type': 'application/json' }
};
//ROLLBACK: DEPLOYMENT_URL = 'https://script.google.com/macros/s/AKfycbymErM-dQUQtjZBzIUPdDk0Pxcv3kkCWpHVPJ1SPBoIY_wG6Naj4LIowy6PH97poPnsEw/exec'
// RB: DEPLOYMENT_URL = 'https://script.google.com/macros/s/AKfycbwpJT991dhw3eDgVIlIXFv7Ft5TqdgHswdrRv5Zd98mOtH5Cw4myvxSnPiwtXBkA2gPlg/exec'
DEPLOYMENT_URL = 'https://script.google.com/macros/s/AKfycbxDED5k-IoaBn0QFqMD5IgmMU_TMCSkQ4nPYamAlVGUTJt0tR3xOZvRB7ja1dw0RIsWmA/exec';
// NEXT (broken?)DEPLOYMENT_URL = 'https://script.google.com/macros/s/AKfycbxEcgPvkCRZbS3HFQ-8dc1J5Cq3DzaEL6ai_KiCXj9ZKQ4bUGtzBSdBZWLQMYC5ixd1OA/exec';


const LameModal = {
  style: 'margin-top: 5rem; padding: 1em 2em 2em 2em ; min-width:50ch; max-width:100ch; max-height: 80vh; border: 0; box-shadow: #000 0px 0px 1em; border-radius: 5px;',
  template: `
    <div style="display: flex; align-items: end; justify-content: space-between;">
      <a href="https://drive.google.com/drive/u/1/folders/1F3Bvh5c5isrsDU9JtQ53kIkKHsY6VagX" target="_blank" tabindex="-1">
        <i _ngcontent-rvc-c130="" class="fa fa-external-link"></i> Open HO folder TEST!!!
      </a>
      <button id="btn-close-lame-modal" type="button" class="btn btn-xs btn-secondary" style="border-radius: 50%; transform: translate(50%);">
        <i class="fa fa-times fa-lg" style="transform: translate(0, -10%);"></i>
      </button>
    </div>
    <div style="padding-top: 2em;max-height: 60vh; overflow-y: auto; display: flex; flex-direction: column; gap: 0.5em">
      <span>Input place IDs separated by commas</span>

      <input id="lame-input" autocomplete="off" tabindex="1"></input>

      <label style="align-self: start; display: flex; align-items: center; gap:5px; margin-bottom:0;">
        <input id="lame-ckbox" type="checkbox">
        Source only
      </label>
      
      <div style="padding-top: 1em ;display: flex; justify-content: space-around;">
        <button id="btn-horz" onclick="go(1)" class="btn btn-info" disabled><i _ngcontent-rvc-c130="" class="fa fa-link"></i> Horizontal (HO)</button>
        <button id="btn-vert" onclick="go(0)" class="btn btn-primary" disabled><i _ngcontent-rvc-c130="" class="fa fa-download"></i> Vertical (HB)</button>
      </div>
    </div>`,
  
  backdropStyle: 'dialog::backdrop { background: #000; opacity: 0.5; transition: opacity .15s linear; }',

  add: function() {
    if (document.getElementById('lame-ui')) { return }
    LameModal.dialog = Object.assign(document.createElement('dialog'), {
      id: 'lame-ui',
      open: '',
      style: LameModal.style,
      innerHTML: LameModal.template,
      /*
        onmousedown: (e) => {
        e.preventDefault(); 
        let input = document.getElementById('lame-input');
        if (document.activeElement != input) input.focus()
      },
      */ //Why was this even here?
    });
    document.body.append(LameModal.dialog);
  
    const styleSheet = Object.assign(document.createElement('style'), { textContent: LameModal.backdropStyle });
    document.head.appendChild(styleSheet);

    LameModal.inputField = document.getElementById('lame-input');
    LameModal.btnClose = document.getElementById('btn-close-lame-modal');
    LameModal.btnHorz = document.getElementById('btn-horz');
    LameModal.btnVert = document.getElementById('btn-vert');

    LameModal.inputField.addEventListener('input', () => LameModal.validateInput());
    LameModal.btnClose.addEventListener('click', e => LameModal.close());
  },

  validateInput: function() {
    let val = LameModal.inputField.value;
    //let rx = /^\d+(\s*,\s*\d+)*\s*$/ /* Digits separated by commas an optional spaces (trailing comma not allowed)*/
    let rxMulti = /^\s*\d{1,6}(\s*,\s*\d{1,6})*\s*,?\s*$/ /* Digits separated by commas an optional spaces */
    let rxSingle = /^\s*\d{1,6}\s*$/;
    let isMulti = rxMulti.test(val);
    let isSingle = rxSingle.test(val);
    
    LameModal.btnHorz.disabled = !isMulti;
    LameModal.btnVert.disabled = !isMulti; //!isSingle;
  },

  close() {
    LameModal.btnHorz.disabled = true;
    LameModal.btnVert.disabled = true;
    LameModal.inputField.value = '';
    LameModal.dialog.close()
  }


}

/* lameify(); */


function lameify() {
  let lameDialog = document.querySelector('#lame-ui');
  if (!lameDialog) {
    LameModal.add();
    lameDialog = document.querySelector('#lame-ui')
  }

  if (!lameDialog?.open) {
    LameModal.dialog.showModal();
    document.getElementById('lame-input').focus();
  }
}


function go(isHO) {
  
  const MAX_LENGTH = 6;
  let inputStr = document.getElementById('lame-input').value;
  let inputArr = inputStr.split(/\s*,\s*/).filter(item => (item));
  let inputSet = new Set(inputArr);

  LameModal.close()

  let cb = (isHO) ? getHorzLink : getVertLink;
  inputSet.forEach( id => { if (id.length <= MAX_LENGTH) cb(id) } )

}


async function getVertLink(chosenPlaceId) {
  let spinner = appendSpinner();
  /* # */ spinner.querySelector('p').innerHTML = `Processing place #${chosenPlaceId}<br>for download...`;
  let reverticalSheetUrl = await fetchReverticalSheet(chosenPlaceId);

  if (/^http/.test(reverticalSheetUrl)) {
    console.log(reverticalSheetUrl);
    //open(reverticalSheetUrl);
    //closeSpinner(spinner);
    spinner.innerHTML = `
    <div style="width: 100%; display: flex; justify-content: end;">
      <button onclick="closeSpinner(this)" style="border:0;background-color:transparent;">x</button>
    </div>
    <div style="flex-grow: 1; display: grid; place-items: center;">
    <a href="${reverticalSheetUrl}" style="text-align: center; margin-bottom:1em">Download HB sheet<br>for Place ${chosenPlaceId}</a>
    </div>
    `;
  }
  else if (/^#ERROR/.test(reverticalSheetUrl)) {
    spinner.innerHTML = `
    <div style="width: 100%; display: flex; justify-content: space-between;">
        <span></span>
        <button onclick="closeSpinner(this)" style="border:0;background-color:transparent;">x</button>
    </div>
    <div style="flex-grow: 1; display: grid; place-items: center; color: indianred">
        <span>Formula error(s) found.</span>
        <span>Search for <b>"#"</b> in:</span>
        <a href="${reverticalSheetUrl.slice(6, reverticalSheetUrl.length)}" target="_blank" style="text-decoration:underline; text-align: center; margin-bottom:1em">SOURCE SHEET</a>
    </div>
    `
  }
  else if (reverticalSheetUrl != -1) {
    spinner.innerHTML = `
    <div style="width: 100%; display: flex; justify-content: space-between;">
      <span>Not found.</span>
      <button onclick="closeSpinner(this)" style="border:0;background-color:transparent;">x</button>
    </div>
    <div style="flex-grow: 1; display: grid; place-items: center;">
     <span>${reverticalSheetUrl}</span>
    </div>
    `
  }
  else {
    closeSpinner(spinner);
  }
  


  async function fetchReverticalSheet(placeId) {
    let url = DEPLOYMENT_URL + '?' + 'v' + placeId; //Notice the "v" for vertical!

    try {
      let response = await fetch(url, {method: 'GET'});
      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }
      return await response.text();
    } 
    
    catch(err) {
      console.log(err);
      return -1
    }

  }

}

async function getHorzLink(chosenPlaceId) {

  let spinner = appendSpinner();

  /* Fetch general info */
  /* # */ spinner.querySelector('p').textContent = 'Fetching place details...';
  let placeDetails = await fetchPlaceDetails(chosenPlaceId);

  if (placeDetails == -1) {
    /* 
    closeSpinner(spinner);
    alert(`Place ${chosenPlaceId} not found.`);
   */
    spinner.innerHTML = `
    <div style="width: 100%; display: flex; justify-content: space-between;">
      <span>Not found.</span>
      <button onclick="closeSpinner(this)" style="border:0;background-color:transparent;">x</button>
    </div>
    <div style="flex-grow: 1; display: grid; place-items: center;">
     <span>${chosenPlaceId}</span>
    </div>
    `
    return
  }

  let fullPlaceName = `${placeDetails.place_id}. ${placeDetails.place_info.title}`;



  /* Check if already exists */
  /* # */ spinner.querySelector('p').textContent = 'Checking existing files...';
  let preExistingSheetUrl = await fetchPreExistingSheet(chosenPlaceId);
  if (preExistingSheetUrl != -1) {
    console.log(preExistingSheetUrl);
    showResultPre(preExistingSheetUrl, spinner);
    return
  }


  /* Fetch pages */
  let promises = [];
  let i = 0;
  for (let item of placeDetails.item) {
    i++;
    /* # */ spinner.querySelector('p').textContent = `Working on image ${i} / ${placeDetails.item.length}`;
    let promise = await fetchItem(item.item_id);
    promises.push(promise);
  }


  let pages = await Promise.all(promises).then(results => { return results } ).catch(error => console.log(`Error in promises ${error}`));
  if (!pages.length) {
    closeSpinner(spinner);
    alert(`No images found for ${chosenPlaceId}`);
    return
  }

  let activePages = pages.filter( p => p.status == 'Y');
  if (!activePages.length) {
    closeSpinner(spinner);
    alert(`Place ${chosenPlaceId} has no active images`);
    return
  }

  let simplifiedData = simplifyData(placeDetails, activePages);
  console.log(simplifiedData);
  
  requestSheet(simplifiedData);
  /* # */ spinner.querySelector('p').innerHTML = 'Making spreadsheet...<br>(May take a while)';


  function requestSheet(data) {
    let sData = JSON.stringify(data);
  
    let options = {
      method: 'POST',
      body: sData,
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }
    };
  
    fetch(DEPLOYMENT_URL, options)
    .then(response => {
      if (!response.ok) { throw new Error(`Request failed with status ${response.status}`) }
      return response.text();
    })
    .then(responseAsText => {

      showResultNew(responseAsText, spinner);

    })
    .catch(error => {
      console.log(error);
      closeSpinner(spinner);
      alert(error);
    });
  }


  async function fetchPreExistingSheet(placeId) {
    let url = DEPLOYMENT_URL + '?' + placeId;

    try {
      let response = await fetch(url, {method: 'GET'});
      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }
      return await response.text();
    } 
    
    catch(err) {
      console.log(err);
      return -1
    }

  }
  
  async function fetchPlaceDetails(id) {
    let url = `https://a3-prod.flit.to:1443/v2/qr-place/places/${id}?place_id=${id}&_method=GET`;
    
    try {
      let response = await fetch(url, OPTIONS_FOR_GET);
      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }
      return await response.json();
    } 
    
    catch(err) {
      console.log(err);
      return -1
    }
  
  }

  async function fetchItem(itemId) {
    let itemUrl = `https://a3-prod.flit.to:1443/v2/qr-place/items/${itemId}?_method=GET`;
    let response = await fetch(itemUrl, OPTIONS_FOR_GET);
    let json = await response.json();
    return json
  }

  function showResultNew(sheetId, displayElement) {
    let newUrl = `https://docs.google.com/spreadsheets/d/${sheetId}`;

    displayElement.innerHTML = `
    <div style="width: 100%; display: flex; justify-content: end;">
      <button onclick="closeSpinner(this)" style="border:0;background-color:transparent;">x</button>
    </div>
    <div style="flex-grow: 1; display: grid; place-items: center; margin-bottom: 1rem;">
    <a href="${newUrl}" target="_blank" style="text-decoration:underline;">${fullPlaceName}</a>
    </div>
    `
  }

  function showResultPre(preExistingSheetUrl, displayElement) {
    displayElement.innerHTML = `
    <div style="width: 100%; display: flex; justify-content: end;">
      <button onclick="closeSpinner(this)" style="border:0;background-color:transparent;">x</button>
    </div>
    <div style="flex-grow: 1; display: grid; place-items: center; margin-bottom: 1rem;">
    <a href="${preExistingSheetUrl}" target="_blank" style="text-decoration:underline;">${fullPlaceName}</a>
    <s style="text-decoration:none;">(기존시트)</s>
    </div>
    `
  }
}






function appendSpinner() {
  /* Make container for all spinners */
  if (!document.getElementById('spinners-wrap')) { 
    let wrap = Object.assign(document.createElement('div'), {
      id: 'spinners-wrap',
      style: 'z-index: 3001; min-width: 200px; max-height: 90vh; overflow-y: auto; display: flex; flex-direction: column; gap: 5px; position: fixed; top: 5px; right: 5px; background-color: white; border: 5px solid lightgray; padding: 0 5px 5px 5px;',
      innerHTML: `
      <div style="z-index: 3002; position: sticky; top: 0; background-color: white; padding-top: 5px; box-shadow: 0px 15px 10px -10px #fff;">
        <button style="
          margin-right: auto;
          background: none!important;
          border: none;
          padding: 0!important;
          color: #069;
          text-decoration: underline;
          cursor: pointer;
        "
        onclick="closeSpinnerAll()"
        >Close all</button>
      </div>
      `
    });
    document.body.append(wrap);
  }

  /* Make each spinner */
  let spinner = Object.assign(document.createElement('div'), {
    classList: 'spinner',
    style: 'position: relative; display: flex; flex-direction:column; align-items:center; justify-content:center; background-color: whitesmoke; padding: 5px;',
    innerHTML: `
      <!-- https://loading.io/css/ -->
      <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
      <p style="text-align:center">Getting ready...</p>
    `,
  });
  document.getElementById('spinners-wrap').append(spinner);

  /* Animate spinner */
  if (document.getElementById('spinner-styleSheet')) { return spinner }

  let styleSheet = Object.assign(document.createElement('style'), {
  id: 'spinner-styleSheet',
  textContent: `
    /* https://loading.io/css/ */
    .lds-ring {
      display: inline-block;
      position: relative;
      width: 80px;
      height: 80px;
    }
    .lds-ring div {
      box-sizing: border-box;
      display: block;
      position: absolute;
      width: 64px;
      height: 64px;
      margin: 8px;
      border: 8px solid steelblue;
      border-radius: 50%;
      animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
      border-color: steelblue transparent transparent transparent;
    }
    .lds-ring div:nth-child(1) {
      animation-delay: -0.45s;
    }
    .lds-ring div:nth-child(2) {
      animation-delay: -0.3s;
    }
    .lds-ring div:nth-child(3) {
      animation-delay: -0.15s;
    }
    @keyframes lds-ring {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `,
  });
  document.head.appendChild(styleSheet);

  return spinner

}

function closeSpinner(element) {
    element.closest('.spinner').remove();
    const wrap = document.getElementById('spinners-wrap');
    if (wrap.children.length <= 1) { // child 1 = Close all button 
        wrap.remove();
    }
}

function closeSpinnerAll() {
  document.getElementById('spinners-wrap').remove();
}


function simplifyData(placeDetails, pages) {
    const flittoLangs = {
      "1": "Afrikaans(Afrikaans)",
      "2": "Albanian(gjuha shqipe)",
      "3": "Arabic(العربية)",
      "4": "Armenian(Հայերեն)",
      "5": "Azerbaijani(azərbaycan dili)",
      "6": "Belarusian(беларуская мова)",
      "7": "Bengali(বাংলা)",
      "8": "Bosnian(bosanski jezik)",
      "9": "Bulgarian(български език)",
      "10": "Catalan(català, valencià)",
      "11": "Chinese (Simplified)(中文(简体))",
      "12": "Chinese (Traditional)(中文(繁體))",
      "13": "Croatian(hrvatski jezik)",
      "14": "Czech(Čeština)",
      "15": "Danish(dansk)",
      "16": "Dutch(Nederlands)",
      "17": "English(English)",
      "18": "Estonian(eesti, eesti keel)",
      "19": "Finnish(suomi)",
      "20": "French(Français)",
      "21": "Georgian(ქართული)",
      "22": "German(Deutsch)",
      "23": "Greek(ελληνικά)",
      "24": "Hebrew(עברית)",
      "25": "Hindi(हिन्दी, हिंदी)",
      "26": "Hungarian(magyar)",
      "27": "Indonesian(Bahasa Indonesia)",
      "28": "Icelandic(Íslenska)",
      "29": "Italian(Italiano)",
      "30": "Japanese(日本語)",
      "31": "Kazakh(қазақ тілі)",
      "32": "Khmer(ខ្មែរ, ខេមរភាសា, ភាសាខ្មែរ)",
      "33": "Korean(한국어)",
      "34": "Lao(ພາສາລາວ)",
      "35": "Lithuanian(lietuvių kalba)",
      "36": "Latvian(latviešu valoda)",
      "37": "Macedonian(македонски јазик)",
      "38": "Malay(Bahasa Melayu)",
      "39": "Maltese(Malti)",
      "40": "Mongolian(монгол)",
      "41": "Norwegian Bokmål(Norsk bokmål)",
      "42": "Punjabi(ਪੰਜਾਬੀ, پنجابی‎)",
      "43": "Persian(فارسی)",
      "44": "Polish(Polski)",
      "45": "Portuguese(Português)",
      "46": "Romansh(rumantsch grischun)",
      "47": "Romanian(limba română, limba moldovenească)",
      "48": "Russian(Русский язык)",
      "49": "Serbian(српски језик)",
      "50": "Slovak(slovenčina, slovenský jazyk)",
      "51": "Slovene(slovenski jezik, slovenščina)",
      "52": "Spanish(Español)",
      "53": "Swedish(Svenska)",
      "54": "Tamil(தமிழ்)",
      "55": "Tajik(тоҷикӣ, toğikī, تاجیکی‎)",
      "56": "Thai(ไทย)",
      "57": "Turkish(Türkçe)",
      "58": "Ukrainian(українська мова)",
      "59": "Urdu(اردو)",
      "60": "Uzbek(O'zbek, Ўзбек, أۇزبېك‎)",
      "61": "Vietnamese(Tiếng Việt)",
      "62": "Tagalog(Tagalog)",
      "63": "Swahili(Kiswahili)",
      "64": "English(British)(English(British))",
      "65": "Spanish(Latin America)(Español(Latinoamérica))",
      "66": "Portuguese(Brazil)(Português(Brasil))",
      "67": "French(Canada)(français(canadien))",
      "68": "Burmese(Burmese)",
      "69": "Chinese (Cantonese)(中文(廣東話))",
      "Afrikaans(Afrikaans)": 1,
      "Albanian(gjuha shqipe)": 2,
      "Arabic(العربية)": 3,
      "Armenian(Հայերեն)": 4,
      "Azerbaijani(azərbaycan dili)": 5,
      "Belarusian(беларуская мова)": 6,
      "Bengali(বাংলা)": 7,
      "Bosnian(bosanski jezik)": 8,
      "Bulgarian(български език)": 9,
      "Catalan(català, valencià)": 10,
      "Chinese (Simplified)(中文(简体))": 11,
      "Chinese (Traditional)(中文(繁體))": 12,
      "Croatian(hrvatski jezik)": 13,
      "Czech(Čeština)": 14,
      "Danish(dansk)": 15,
      "Dutch(Nederlands)": 16,
      "English(English)": 17,
      "Estonian(eesti, eesti keel)": 18,
      "Finnish(suomi)": 19,
      "French(Français)": 20,
      "Georgian(ქართული)": 21,
      "German(Deutsch)": 22,
      "Greek(ελληνικά)": 23,
      "Hebrew(עברית)": 24,
      "Hindi(हिन्दी, हिंदी)": 25,
      "Hungarian(magyar)": 26,
      "Indonesian(Bahasa Indonesia)": 27,
      "Icelandic(Íslenska)": 28,
      "Italian(Italiano)": 29,
      "Japanese(日本語)": 30,
      "Kazakh(қазақ тілі)": 31,
      "Khmer(ខ្មែរ, ខេមរភាសា, ភាសាខ្មែរ)": 32,
      "Korean(한국어)": 33,
      "Lao(ພາສາລາວ)": 34,
      "Lithuanian(lietuvių kalba)": 35,
      "Latvian(latviešu valoda)": 36,
      "Macedonian(македонски јазик)": 37,
      "Malay(Bahasa Melayu)": 38,
      "Maltese(Malti)": 39,
      "Mongolian(монгол)": 40,
      "Norwegian Bokmål(Norsk bokmål)": 41,
      "Punjabi(ਪੰਜਾਬੀ, پنجابی‎)": 42,
      "Persian(فارسی)": 43,
      "Polish(Polski)": 44,
      "Portuguese(Português)": 45,
      "Romansh(rumantsch grischun)": 46,
      "Romanian(limba română, limba moldovenească)": 47,
      "Russian(Русский язык)": 48,
      "Serbian(српски језик)": 49,
      "Slovak(slovenčina, slovenský jazyk)": 50,
      "Slovene(slovenski jezik, slovenščina)": 51,
      "Spanish(Español)": 52,
      "Swedish(Svenska)": 53,
      "Tamil(தமிழ்)": 54,
      "Tajik(тоҷикӣ, toğikī, تاجیکی‎)": 55,
      "Thai(ไทย)": 56,
      "Turkish(Türkçe)": 57,
      "Ukrainian(українська мова)": 58,
      "Urdu(اردو)": 59,
      "Uzbek(O'zbek, Ўзбек, أۇزبېك‎)": 60,
      "Vietnamese(Tiếng Việt)": 61,
      "Tagalog(Tagalog)": 62,
      "Swahili(Kiswahili)": 63,
      "English(British)(English(British))": 64,
      "Spanish(Latin America)(Español(Latinoamérica))": 65,
      "Portuguese(Brazil)(Português(Brasil))": 66,
      "French(Canada)(français(canadien))": 67,
      "Burmese(Burmese)": 68,
      "Chinese (Cantonese)(中文(廣東話))": 69
    };
  
    let targetLangs = placeDetails.place_lang_pair.reduce((prev, curr) => {
      //Flip target and source langs if source is not Korean, don't ask why
      let tarLangId = (curr.dst_lang_id == placeDetails.place_info.lang_id) ? curr.src_lang_id : curr.dst_lang_id;
      return [...prev, flittoLangs[tarLangId]]
    }, []);
    targetLangs.sort();
    
    let sortedLangIds = targetLangs.map( lang => flittoLangs[lang] );
  
    let simple = {
      placeName: placeDetails.place_info.title,
      placeId: placeDetails.place_info.place_id,
      mainImageUrl: placeDetails.place_image[0].image_url,
      langs: targetLangs,
    };
  
    let excludeTranslations = document.querySelector('#lame-ckbox').checked;
    let simplePages = pages.map(p => {
      return {
        pageId: p.item_id,
        imageUrl: p.image_url,
        segments:
          /* 1. If segment is empty, wrap in 2d array, as required by Google Sheets */
          (!p.item_org.length) ? [['']]
  
          : p.item_org.reduce((prev, seg) => {
  
              /* 2. Filter out 삭제됨 items (status = 'D'), leaving only 사용 가능 (status = 'Y') */
              if (seg.status != 'Y') { return prev }
  
              /* 3. Get "id", "source language", and "content" columns */
              let sourceInfo = [seg.item_org_id, flittoLangs[seg.lang_id], seg.content];
  
              /* NEW: 3.5 Skip sorting translationg is clicked source-only checkbox*/
              if (excludeTranslations) {
                return [...prev, sourceInfo];
              }

              /* 4. Get translations sorted alphabetically by target language, by looping through lang ids */
              let sortableTranslations = seg.item_tr;
              let sortedTranslations = sortedLangIds.reduce((prev, currLangId) => {
                let matchingIndex = sortableTranslations.findIndex( tr => tr.lang_id == currLangId );
                let content = (matchingIndex == -1) ? '': sortableTranslations[matchingIndex].content;
                return [...prev, content]
              }, new Array);
  
              let rowInfo = [...sourceInfo, ...sortedTranslations];
  
              return [...prev, rowInfo];
  
          }, new Array)
  
          /* 5. Sort in ascending order by id */
          .sort((a, b) => {
              return a[0] - b[0]
          }),
  
      }
    });
  
    simple.menuPages = simplePages;
  
    return simple
  
  }
