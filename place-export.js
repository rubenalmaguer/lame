IS_FLITTO = false; // else, is personal account - used by LameModal

USER_TOKEN = localStorage.getItem('access_token');

DEPLOYMENT_URL = (IS_FLITTO) ? 'https://script.google.com/macros/s/AKfycbyv_zSd9V7WPCm9HCB-ZPsuKiFy6zVCqlntulD8U_n9M75nxZ77FwAmGqyWCo4j12h8LQ/exec'
  :'https://script.google.com/macros/s/AKfycbwmfCR2ZihT6WWwAVlq-1scEmfKB4JsMGeRHhguedtc-0zQXHsaoAzv0FIHXJJnFplRJA/exec'; //personal account

PLACES_FOLDER_URL = 'https://drive.google.com/drive/u/1/folders/1F3Bvh5c5isrsDU9JtQ53kIkKHsY6VagX'; // Always Flitto folder
  /*
   IS_FLITTO ? 'https://drive.google.com/drive/u/1/folders/1F3Bvh5c5isrsDU9JtQ53kIkKHsY6VagX'
  : 'https://drive.google.com/drive/u/0/folders/1yu1exkolwnzUfAMn4nFBd28y3VEVIZDu'
  */ // personal account


class LameModal {
  static html = `
    <div id="lame-ui-header">
      <a href="` + `${PLACES_FOLDER_URL}` + `" target="_blank" tabindex="-1">
        <i _ngcontent-rvc-c130="" class="fa fa-external-link"></i>
        Open HO folder
      </a>
      <button id="lame-ui-close-btn" type="button" class="btn btn-xs btn-secondary">
        <i class="fa fa-times fa-lg"></i>
      </button>
    </div>
    <div id="lame-ui-body">
      <span>Input place IDs separated by commas</span>

      <input id="lame-input" autocomplete="off" tabindex="1"></input>

      <label>
        <input id="lame-ckbox" type="checkbox">
        Source only
      </label>
      
      <div id="lame-ui-main-btn-group">
        <button id="btn-horz" onclick="go(1)" class="btn btn-info" disabled>
          <i _ngcontent-rvc-c130="" class="fa fa-link"></i>
          Horizontal (HO)
        </button>
        <button id="btn-vert" onclick="go(0)" class="btn btn-primary" disabled>
          <i _ngcontent-rvc-c130="" class="fa fa-download"></i>
          Vertical (HB)
        </button>
      </div>
    </div>`;
  
  static css = `
    #lame-ui {
      margin-top: 5rem;
      padding: 1em 2em 2em 2em;
      min-width:50ch;
      max-width:100ch;
      max-height: 80vh;
      border: 0;
      box-shadow: #000 0px 0px 1em;
      border-radius: 5px;
    }

    #lame-ui-header {
      display: flex;
      align-items: end;
      justify-content: space-between;
    }

    #lame-ui-close-btn {
      border-radius: 50%;
      transform: translate(50%);
    }

    #lame-ui-close-btn i {
      transform: translate(0, -10%);
    }

    #lame-ui-body {
      padding-top: 2em;
      max-height: 60vh;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 0.5em;
    }

    #lame-ui-body label {
      align-self: start;
      display: flex;
      align-items: center;
      gap:5px;
      margin-bottom:0;
      user-select: none;
    }

    #lame-ui-main-btn-group {
      padding-top: 1em;
      display: flex;
      justify-content: space-around;
    }

    dialog::backdrop {
      background: #000;
      opacity: 0.5;
      transition: opacity .15s linear;
    }
  `;

  constructor() {
    // Limit to one instance
    if (!LameModal.dialog) { 
      
      // Make dialog
      LameModal.dialog = Object.assign(document.createElement('dialog'), {
        id: 'lame-ui',
        open: '',
        innerHTML: LameModal.html,
      });
      document.body.append(LameModal.dialog);
    
      // Add css
      const styleSheet = Object.assign(document.createElement('style'), { textContent: LameModal.css });
      document.head.appendChild(styleSheet);

      // Get references for use in OTHER methods
      LameModal.inputField = LameModal.dialog.querySelector('#lame-input');
      LameModal.btnClose = LameModal.dialog.querySelector('#lame-ui-close-btn');
      LameModal.btnHorz = LameModal.dialog.querySelector('#btn-horz');
      LameModal.btnVert = LameModal.dialog.querySelector('#btn-vert');

      // Add events
      LameModal.inputField.addEventListener('input', () => LameModal.validateInput());
      LameModal.btnClose.addEventListener('click', () => LameModal.close());
    }

    // Show if hidden
    if (!LameModal.dialog.open) {
      LameModal.dialog.showModal();
      LameModal.dialog.querySelector('#lame-input').focus();
    }

    return LameModal.dialog
  };

  static validateInput () {
    let val = LameModal.inputField.value;
    //let rx = /^\d+(\s*,\s*\d+)*\s*$/ /* Digits separated by commas an optional spaces (trailing comma not allowed)*/
    let rxMulti = /^\s*\d{1,6}(\s*,\s*\d{1,6})*\s*,?\s*$/ /* Digits separated by commas an optional spaces */
    let rxSingle = /^\s*\d{1,6}\s*$/; // Not used
    let rxGoogleSheetUrl = /^https:\/\/docs\.google\.com\/spreadsheets\/d\/\S+$/ //Not strict

    let isMulti = rxMulti.test(val);
    let isGoogleSheetUrl = rxGoogleSheetUrl.test(val);
    
    LameModal.btnHorz.disabled = !isMulti;
    LameModal.btnVert.disabled = !(isMulti || isGoogleSheetUrl); //!isSingle;
  };

  static close() {
    LameModal.btnHorz.disabled = true;
    LameModal.btnVert.disabled = true;
    LameModal.inputField.value = '';
    LameModal.dialog.close()
  }


}

const lameify = () => new LameModal;

class Spinner {
  static wrapper;

  static templates = {
    wrapper: `
      <header id="spinners-sticky-header">
        <button style=
        "
          margin-right: auto;
          background: none!important;
          border: none;
          padding: 0!important;
          color: #069;
          text-decoration: underline;
          cursor: pointer;
          user-select: none;
        "
        onclick="Spinner.close('all')"
        
        >Close all</button>
      </header>
    `,

    loading: function (msg = 'Getting ready...') {
      return `
      <!-- https://loading.io/css/ -->
      <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
      <p class="progress-msg" style="text-align:center; word-break: break-all;">${msg}</p>
      `
    },

    ho: {
      notFound: function (notFoundPlaceId) {
        return `
          <div style="width: 100%; display: flex; justify-content: space-between;">
            <span>No place data found for:</span>
            <button onclick="Spinner.close(this)" style="border:0;background-color:transparent;user-select:none;">x</button>
          </div>
          <div style="flex-grow: 1; display: grid; place-items: center;">
          <span>${notFoundPlaceId}</span>
          </div>
        `
      },
      preexisting: function (values) {
        return `
          <div style="width: 100%; display: flex; justify-content: end;">
            <button onclick="Spinner.close(this)" style="border:0;background-color:transparent;user-select:none;">x</button>
          </div>
          <div style="flex-grow: 1; display: grid; place-items: center; margin-bottom: 1rem;">
          <a class="ho-link" href="${values.sheetUrl}" target="_blank" style="text-decoration:underline;">${values.sheetName}</a>
          <s style="text-decoration:none;">(기존시트)</s>
          </div>
        `
      },
      new: function (values) {
        let newUrl = `https://docs.google.com/spreadsheets/d/${values.newSheetId}`;
        return `
          <div style="width: 100%; display: flex; justify-content: end;">
          <button onclick="Spinner.close(this)" style="border:0;background-color:transparent;user-select:none;">x</button>
          </div>
          <div style="flex-grow: 1; display: grid; place-items: center; margin-bottom: 1rem;">
          <a class="ho-link" href="${newUrl}" target="_blank" style="text-decoration:underline;">${values.fullPlaceName}</a>
          </div>
        `
      },

       project: function(projectSheetUrl) {
        return `
          <div style="width: 100%; display: flex; justify-content: end;">
            <button onclick="Spinner.close(this)" style="border:0;background-color:transparent;user-select:none;">x</button>
          </div>
          <div style="flex-grow: 1; display: grid; place-items: center; margin-bottom: 1rem;">
          <a class="ho-link" href="${projectSheetUrl}" target="_blank" style="text-decoration:underline;">Your Project</a>
          </div>
        </div>
        `
      }, 
    },

    hb: {
      success: function (values) {
        // response is url to vertical (hb) sheet
        return `
          <div style="width: 100%; display: flex; justify-content: end;">
            <button onclick="Spinner.close(this)" style="border:0;background-color:transparent;user-select:none;">x</button>
          </div>
          <div style="flex-grow: 1; display: grid; place-items: center;">
            <a href="${values.res}"
              style="text-align: center;word-break: break-all;
              margin-bottom:1em">Download HB sheet<br>${(isNaN(values.chosenPlaceId))
                ? (values.chosenPlaceId)
                : ' for place ' + values.chosenPlaceId }</a>
          </div>
        `
      },
      formulaError: function (hoSheetUrl) {
        // hoSheetUrl's firs 6 chars == '#ERROR'
        return `
          <div style="width: 100%; display: flex; justify-content: space-between;">
              <span></span>
              <button onclick="Spinner.close(this)" style="border:0;background-color:transparent;user-select:none;">x</button>
          </div>
          <div style="flex-grow: 1; display: grid; place-items: center; color: indianred">
              <span>Formula error(s) found.</span>
              <span>Search for <b>"#"</b> in:</span>
              <a href="${hoSheetUrl.slice(6, hoSheetUrl.length)}" target="_blank" style="text-decoration:underline; text-align: center; margin-bottom:1em">SOURCE SHEET</a>
          </div>
        `
      },
      notFound: function (notFoundPlaceId) {
        return `
          <div style="width: 100%; display: flex; justify-content: space-between;">
            <span>No sheet found for:</span>
            <button onclick="Spinner.close(this)" style="border:0;background-color:transparent;user-select:none;">x</button>
          </div>
          <div style="flex-grow: 1; display: grid; place-items: center;">
          <span>${notFoundPlaceId}</span>
          </div>
        `
      }
    },

    unknownError: function (values) {
      return `
        <div style="width: 100%; display: flex; justify-content: space-between;">
            <span></span>
            <button onclick="Spinner.close(this)" style="border:0;background-color:transparent;user-select:none;">x</button>
        </div>
        <div style="flex-grow: 1; display: grid; place-items: center; color: indianred; word-break: break-all;">
            <span>Something went wrong</span>
            <span>${(isNaN(values.chosenPlaceId))
              ? values.chosenPlaceId
              : ' with place ' + values.chosenPlaceId + '.' }</span>
            <button style=
            "
              background: none!important;
              border: none;
              padding: 0!important;
              color: #069;
              text-decoration: underline;
              cursor: pointer;
            "
            onclick="alert(\`${values.err}\`)"
            >See details</button>
        </div>
      `
    },


  };

  static css = `
    #spinners-wrap {
      z-index: 3001;
      min-width: 200px;
      max-width: 300px;
      max-height: 90vh;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 5px;
      position: fixed;
      top: 5px;
      right: 5px;
      background-color: white;
      border: 5px solid lightgray;
      padding: 0 5px 5px 5px;
    }

    #spinners-sticky-header {
      z-index: 3002;
      position: sticky;
      top: 0;
      background-color: #fff;
      padding-top: 5px;
      box-shadow: 0px 15px 10px -10px #fff;
    }

    .spinner {
      position: relative;
      display: flex;
      flex-direction:column;
      align-items:center;
      justify-content:center;
      background-color: whitesmoke;
      padding: 5px;
    }

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
  `;

  static close = function (element) {
    const wrap = document.getElementById('spinners-wrap');

    if (element == 'all') {
      wrap.remove();
      return
    }

    else {
      element.closest('.spinner').remove();
    
      if (wrap.children.length <= 1) { // child 1 = Close all button 
          wrap.remove();
      }
    }
  }

  setMsg(msg) {
    this.element.querySelector('.progress-msg').innerHTML = msg;
  }

  setInnerHTML(html) {
    this.element.innerHTML= html;
  }

  setTemplate(templatePath, values) {
    let template = Spinner.resolveObjPath(templatePath, Spinner.templates);
    let filledUpTemplate = template(values);
    this.element.innerHTML= filledUpTemplate;
  }

  static resolveObjPath(path, obj=self, separator='.') {
    var properties = Array.isArray(path) ? path : path.split(separator)
    return properties.reduce((prev, curr) => prev?.[curr], obj)
  }

  constructor(initMsg = '') {
    //Make wrapper if not exist
    if (!document.getElementById('spinners-wrap')) { 
      Spinner.wrapper = Object.assign(document.createElement('div'), {
        id: 'spinners-wrap',
        innerHTML: Spinner.templates.wrapper,
        onclick: function (e) {
          if ((e.detail === 3 && e.target.id === 'spinners-wrap')
          || (e.detail === 3 && e.target.id === 'spinners-sticky-header')) {
            //On triple click:
            if (!document.querySelectorAll('#spinners-wrap a.ho-link').length) return
            window.getSelection().removeAllRanges();
            if (confirm('Combine HO sheets into project sheet?')) {
              combineProject()
            }
          }
        },
      });
      document.body.append(Spinner.wrapper);
    }

    // Append CSS if not exist
    if (!document.getElementById('spinner-styleSheet')) {
      let styleSheet = Object.assign(document.createElement('style'), {
        id: 'spinner-styleSheet',
        textContent: Spinner.css,
        });
      document.head.appendChild(styleSheet);
    }

    // Make individual spinner
    this.element = Object.assign(document.createElement('div'), {
      classList: 'spinner',
      innerHTML: Spinner.templates.loading(initMsg),
    });
    document.getElementById('spinners-wrap').append(this.element);

    return this

  }

}

function go(isHO) {

  let inputStr = LameModal.inputField.value;

  if (isNaN(inputStr[0])) {
    // Input is URL:
    const baseUrlLen = 39;
    const idLen = 44;
    const id = inputStr.slice(baseUrlLen, baseUrlLen + idLen);

    processProjRevert(id)
    LameModal.close()  
    return
  }

  // Input is IDs:  

  let inputArr = inputStr.split(/\s*,\s*/).filter(item => (item));
  let inputSet = new Set(inputArr);

  LameModal.close()

  let cb = (isHO) ? processHO : processHB;

  let delay = 500; // just in case
  inputSet.forEach( (id, i) => /* setTimeout( */cb(id)/* , delay * i) */ )

}



async function processProjRevert(sheetId) {
  let chosenPlaceId = sheetId; //deconstructed name expected by template
  let spinner = new Spinner(`Processing for download...<br>(${sheetId})`);
  try {
    let res = await fetchGetFromGS('id' + sheetId) // 'id' string used for routing
    if (/^http/.test(res)) {
      console.log(res);
      spinner.setTemplate('hb.success', {chosenPlaceId, res});
      return
    }
    else if (/^#ERROR/.test(res)) {
      spinner.setTemplate('hb.formulaError', res);
      return
    }
  }
  catch(err) {
    console.error(`Error on ${arguments.callee.name} for ${chosenPlaceId}:`, err);
    spinner.setTemplate('unknownError', {chosenPlaceId, err});
    return
  }
  
}



async function processHB(chosenPlaceId) {
  let spinner = new Spinner(`Processing place #${chosenPlaceId}<br>for download...`);
  try {
    let res = await fetchGetFromGS('v' + chosenPlaceId); //Notice the "v" for vertical!

    if (/^http/.test(res)) {
      console.log(res);
      spinner.setTemplate('hb.success', {chosenPlaceId, res});
      return
    }
    else if (/^#ERROR/.test(res)) {
      spinner.setTemplate('hb.formulaError', res);
      return
    }
    else {
      spinner.setTemplate('hb.notFound', res);
      return
    }
  }
  catch(err) {
    console.error(`Error on ${arguments.callee.name} for ${chosenPlaceId}:`, err);
    spinner.setTemplate('unknownError', {chosenPlaceId, err});
    return
  }

}

async function fetchGetFromGS(query) {
  let url = DEPLOYMENT_URL + '?' + query;
  let sResponse = await fetch(url, {method: 'GET'});
  let oResponse = JSON.parse(await sResponse.text());
  
  // Response.ok / Response.status / etc. not available here.
  // Because Google Sheets always returns 200.
  // (Or redirects to error page, causing some CORS error)
  if (oResponse['server-error'] > 0) throw new Error(oResponse.innards)

  return oResponse.innards;
}

async function processHO(chosenPlaceId) {
  // Check if sheet already exists -----------------------------------------
  let spinner = new Spinner('Checking existing files...');
  try {
    let preexisting = await fetchGetFromGS(chosenPlaceId);
    if (preexisting.found) {
      let {sheetUrl, sheetName} = preexisting;
      spinner.setTemplate('ho.preexisting', {sheetUrl, sheetName});
      return
    }
  }
  catch(err) {
    console.error(`Error on ${arguments.callee.name} for ${chosenPlaceId}:`, err);
    spinner.setTemplate('unknownError', {chosenPlaceId, err});
    return
  }

  // Doesn't already exist, so fetch basic info -----------------------------------
  spinner.setMsg('Fetching place details...');

  let basicPlaceInfo;
  try {
    basicPlaceInfo = await fetchBasicPlaceInfo(chosenPlaceId);
    if (!basicPlaceInfo) {
      spinner.setTemplate('ho.notFound', chosenPlaceId);
      return
    }
  }
  catch(err) {
    console.error(`Error on ${arguments.callee.name} for ${chosenPlaceId}:`, err);
    spinner.setTemplate('unknownError', {chosenPlaceId, err});
    return
  }

  // Now, fetch every page listed in basic info -----------------------------
  let promises = [];
  let i = 0;
  for (let item of basicPlaceInfo.item) {
    i++;
    spinner.setMsg(`Working on image ${i} / ${basicPlaceInfo.item.length}`);
    let promise = await fetchItem(item.item_id);
    promises.push(promise);
  }

  let pages = await Promise.all(promises)
    .then(results => { return results } )
    .catch(error => {
      console.error(`Error in page promises: ${error}`)
      spinner.setTemplate('unknownError', {chosenPlaceId, err});
      return
    });


  if (!pages.length) {
    Spinner.close(spinner);
    alert(`No images found for ${chosenPlaceId}`);
    return
  }

  let activePages = pages.filter( p => p.status == 'Y');
  if (!activePages.length) {
    Spinner.close(spinner);
    alert(`Place ${chosenPlaceId} has no active images`);
    return
  }

  // Reshuffle data in preparation to request make sheet

  let simplifiedData = simplifyData(basicPlaceInfo, activePages);
  console.log(simplifiedData);
  
  // Request making of new HO sheet -----------------------------------------
  spinner.setMsg('Making spreadsheet...<br>(May take a while)');
  try {
    let newSheetId = await requestSheet(simplifiedData);
    let fullPlaceName = `${basicPlaceInfo.place_id}. ${basicPlaceInfo.place_info.title}`;
    spinner.setTemplate('ho.new', {newSheetId, fullPlaceName})
    return
  }
  catch(err) {
    console.error(`Error on ${arguments.callee.name} for ${chosenPlaceId}:`, err);
    spinner.setTemplate('unknownError', {chosenPlaceId, err});
    return
  }


  async function requestSheet(data) {
    let sData = JSON.stringify(data);
    let options = {
      method: 'POST',
      body: sData,
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }
    };
  
    let sResponse = await fetch(DEPLOYMENT_URL, options)
    let oResponse = JSON.parse(await sResponse.text());
    
    // Response.ok / Response.status / etc. not available here.
    // Because Google Sheets always returns 200.
    // (Or redirects to error page, causing some CORS error)
    if (oResponse['server-error'] > 0) throw new Error(oResponse.innards)
    
    return oResponse.innards;
  }

  async function fetchBasicPlaceInfo(placeId) {
    let url = `https://a3-prod.flit.to:1443/v2/qr-place/places/${placeId}?place_id=${placeId}&_method=GET`;
    let options  = {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + USER_TOKEN,  'content-type': 'application/json' }
    };
    
    let response = await fetch(url, options);

    if (!response.ok) {
      const message = `Fetching of place ${placeId} details failed w/ status: ${response.status}`;
      console.log(message);
      throw new Error(message);
    }

    let responseBody = await response.text();    
    if (!responseBody) return null; // An empty body means the place doesn't exist

    return JSON.parse(responseBody);
  
  }

  async function fetchItem(itemId) {
    let itemUrl = `https://a3-prod.flit.to:1443/v2/qr-place/items/${itemId}?_method=GET`;
    let options  = {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + USER_TOKEN,  'content-type': 'application/json' }
    };
    let response = await fetch(itemUrl, options);

    if (!response.ok) {
      const message = `Fetching of item (page) ${itemId} failed w/ status: ${response.status}`;
      console.log(message);
      throw new Error(message);
    }

    let json = await response.json();
    return json
  }
}




async function combineProject() {
  let spinner = new Spinner(`Merging sheets... `);
  const hoLinkElems = [...document.querySelectorAll('#spinners-wrap a.ho-link')]
  const urlArray = hoLinkElems.map(a => a.href)
  
  try{
    const projectSheetUrl = await requestMergeProject(urlArray);
    spinner.setTemplate('ho.project', projectSheetUrl);
    return
  }
  catch(err) {
    console.error(`Error on ${arguments.callee.name}`, err);
    let chosenPlaceId = 'when combining files.';
    spinner.setTemplate('unknownError', {chosenPlaceId, err});
    return
  }
  



  async function requestMergeProject(urlArray) {
    let sData = JSON.stringify(urlArray);
    let options = {
      method: 'POST',
      body: sData,
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }
    };

    console.log(sData)
  
    let sResponse = await fetch(DEPLOYMENT_URL, options)
    let oResponse = JSON.parse(await sResponse.text());
    
    // Response.ok / Response.status / etc. not available here.
    // Because Google Sheets always returns 200.
    // (Or redirects to error page, causing some CORS error)
    if (oResponse['server-error'] > 0) throw new Error(oResponse.innards)
    
    return oResponse.innards;
  }
}




function simplifyData(basicPlaceInfo, pages) {
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

  let targetLangs = basicPlaceInfo.place_lang_pair.reduce((prev, curr) => {
    //Flip target and source langs if source is not Korean, don't ask why
    let tarLangId = (curr.dst_lang_id == basicPlaceInfo.place_info.lang_id) ? curr.src_lang_id : curr.dst_lang_id;
    return [...prev, flittoLangs[tarLangId]]
  }, []);
  targetLangs.sort();
  
  let sortedLangIds = targetLangs.map( lang => flittoLangs[lang] );

  let simple = {
    placeName: basicPlaceInfo.place_info.title,
    placeId: basicPlaceInfo.place_info.place_id,
    mainImageUrl: basicPlaceInfo.place_image[0].image_url,
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
