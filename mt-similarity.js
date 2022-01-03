/*Simi V1.0*/

/*SETTINGS*/
susLimit = 85;

/*Global variables*/
site = '', sourceWrapper = '', jab = '', providers = [],
score = 0, sum = 0, avgScore = 0, highest = 0;

/*Control flow based on url*/
 currentUrl = window.location.href;
 regex1 = /api-demo\.flit\.to/,
    regex2 = /translators\.to/,
    regex3 = /a3\.flit\.to\/#\/pro-tr\/pro-applicant\/\d/;
if (regex1.test(currentUrl)) {
    site = 'flitto';
    providers = ['flitto','google','papago','kakao'];
    render();
} else if (regex2.test(currentUrl)) {
    site = 'transto';
    providers = ['googleNmt','papago','kakao', 'azure', 'watson', 'yandex', 'systran', 'baidu', 'youdao', 'sogou', 'tencent', 'alibaba'];
    render();
} else {
    if (window.confirm(`Go to Flitto's API demo?`)) {
        window.location.href='https://api-demo.flit.to:2222/index.html';
    };
}

/*RENDER*/
function render() {   
    if (site === 'flitto') {
        sourceWrapper = document.querySelector('.flexBox2');
        jab = `
        <input type="text" id="similarityInput" class="input svelte-1a66zs5" placeholder="비교할 (사람의 번역) 문장을 입력해주세요.">
        <button class="btn svelte-1a66zs5" onclick="compareMain()" style="background-color:darkslateblue;border-color:slateblue;color:mintcream;">비교</button>       
        <div id="similaritySummary" class="card svelte-11xeqgg" style="background-color:darkslateblue;border-color:slateblue; height:50%;display:none;">
            Similarity:
            <span id="high" style="margin:8px 5px 0 5px"></span>
            <span id="avg" style="margin:8px 5px 0 0px; border-left:slateblue 2px solid;padding-left:8px;"></span>
         </div>`;
    }
    
    if (site === 'transto') {
        sourceWrapper = document.querySelector('.section .container .columns.is-desktop .column .field.source-content-wrapper');
        jab = `
        <div class="field source-content-wrapper" style="margin-top:12px;" id="jab">
            <div class="control is-relative control-textarea-wrapper">
            <textarea class="textarea source-content" placeholder="비교할 인간 번역을 입력하세요." maxlength="500" dir="ltr" style="height: 100px;" id="similarityInput"></textarea>
            <div class="field is-grouped is-marginless">
                <p class="control">
                <button class="button has-tooltip-top" data-tooltip="문장 복사하기" id="copyButton"><span class="icon"><i class="far fa-copy"></i></span></button>
                </p>
            <div id="spacer" style="width:10px;border-right:WhiteSmoke solid 1px;"></div><div id="spacer" style="width:20px;border-left:WhiteSmoke solid 1px;"></div>
                <div id="high" style="margin:8px 5px 0 5px"></div>
                <div id="avg" style="margin:8px 5px 0 0px"></div>
            <div class="is-right-control-wrapper">
                <p class="control">
                <i class="fas fa-user fa-2x" style="margin:5px 5px 0 5px"></i>
                <button class="button is-link" title="비교하기 (ctrl+Enter)" style ="background-color:#ffdd57;color:rgba(0,0,0,.7);" onclick="compareMain()">COMPARE</button>
                </p>
            </div>
            </div>
                <button class="button reset " id="cross">
                <i class="fas fa-times" style="vertical-align: bottom;"></i>
                </button>
            </div>
        </div>`;
    }
    if (!(document.getElementById('similarityInput'))) {
        let dv = document.createElement('div');
        sourceWrapper.append(dv);
        dv.innerHTML = jab;
    }
    addEvents();
}

/*MAIN*/
function compareMain(){
    /*Reset*/
    clearResults();
	/*Loop through providers*/
	let human = document.getElementById("similarityInput").value;
    let i = 0; /*Built- in 'forEach' index increases despite return statement*/
	providers.forEach((provider) => {
        if (site == 'flitto') {
            prediction = document.querySelector(`[src="../img/${provider}.png"] + span`).parentNode.childNodes[2].textContent;
        }
        if (site == 'transto') {
            prediction = document.getElementById(provider).value;
        }
        if (prediction == "") {return;}
        score = compareTwoStrings(human, prediction);
		i++;
		sum += score;
		avgScore = sum / i;
		if (score > highest) {
			highest = score;
		}
		displayIndividualResult(provider, score);
	});
    displaySummary ();
    if (site == 'flitto') {hijackTrashButtons();} /*AddEvents? hijackTranslationButton?*/
}

function displayIndividualResult(provider, score) {
    if (site == 'flitto') {
        let logoNode = document.querySelector(`[src="../img/${provider}.png"]`);
	    let bgColor = (score >= susLimit) ? 'firebrick' : 'darkslateblue';
	    logoNode.insertAdjacentHTML('afterend',`<span class="individualResult" style="background-color:${bgColor};
        border-radius:20px;padding:0 7px 2px 7px;margin-left:3px;">${percentStyle(score)}</span>`);
    }
    if (site == 'transto') {
        let logoNode = document.querySelector(`.label[for=${provider}]`);
        let scoreNode = document.createElement('p');
        scoreNode.classList.add('individualResult');
        scoreNode.textContent = percentStyle(score);
        scoreNode.style.lineHeight = '40px';
        scoreNode.style.paddingLeft = '10px';
        if (score >= susLimit) {
            scoreNode.style.color = 'red';
        }
        logoNode.parentNode.insertBefore(scoreNode, logoNode.nextSibling);
    }
}

function displaySummary () {
    let highNode = document.getElementById('high');
    let avgNode = document.getElementById('avg');

    if (highest >= susLimit) {
        highNode.style.color = 'tomato';
    }
    if (avgScore >= susLimit) {
        avgNode.style.color = 'tomato';
    }

    /*Show highest*/
    highNode.textContent = `Highest: ${percentStyle(highest)}`;

    if (site == 'flitto') {
        /*Show average*/
        avgNode.textContent = `Average: ${percentStyle(avgScore)}`;
        /*Show summary card*/
        document.getElementById('similaritySummary').style.display='block';
    }

    if (site == 'transto') {
        /*Show average*/
        avgNode.textContent = `|    Average: ${percentStyle(avgScore)}`;
    }
}

function clearResults () {
    /*Clear individual results*/
    removeElementsByClass('individualResult');

    /*Reset global variables*/
    score = 0, sum = 0, avgScore = 0, highest = 0;

    if (site == 'flitto') {
        /*Hide summary*/
        document.getElementById('similaritySummary').style.display = 'none';
        /*Reset summary containers*/
        document.getElementById('high').textContent='';
        document.getElementById('high').style.color = 'snow';
        document.getElementById('avg').textContent='';
        document.getElementById('avg').style.color = 'snow';
    }

    if (site == 'transto') {
        /*Clear summary*/
        if (document.getElementById('high')) {
            document.getElementById('high').textContent='';
            document.getElementById('high').style.color = 'black';
        }
        if (document.getElementById('avg')) {
            document.getElementById('avg').textContent='';
            document.getElementById('avg').style.color = 'black';
        }
    }
}

/* EVENTS */

function addEvents() {
    if (site === 'flitto') {
        /*Hijack translate button*/
        buttons = [...document.querySelectorAll('.btn.svelte-1a66zs5')];
        buttons.forEach(btn => {
            if (btn.textContent === '입력') {
                btn.addEventListener('mouseup', () => {clearResults();});
            }
        });

        /*Hijack source input*/
        input = document.querySelector(`[placeholder="번역을 원하는 영어 문장을 입력해주세요."]`);	
        input.addEventListener('keyup', e => {
            if (e.key === 'Enter') {
                clearResults();
            }
        });

        /*Hijack trash buttons*/
        hijackTrashButtons();

        /*Clear on input change*/
        similarityInput.addEventListener('input', function() {
	        clearResults();

        });
        /*Compare on enter*/
        similarityInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                compareMain();
            }
        });
    }

    if (site === 'transto') {
        /*Clear on input change*/
        sourceWrapper.addEventListener('input', function() {
            clearResults();
        });

        /*Compare on ctrl+Enter*/
        sourceWrapper.addEventListener('keyup', function(event) {
            if (event.ctrlKey && event.key === 'Enter' && document.activeElement === document.getElementById('similarityInput')) {
                event.preventDefault();
                compareMain();
            }
        });

        /*Copy button*/
        let copyButton = document.getElementById('copyButton');
        let copiable = document.getElementById("similarityInput");
        copyButton.onclick = () => {
            copiable.select();
            copiable.setSelectionRange(0, 99999); /* For mobile devices */
            if (copiable.value != '') {
            navigator.clipboard.writeText(copiable.value);
            copyButton.focus();
            toast();
            } 
        };

        /*Clear (X) button*/
        let crossButton = document.getElementById('cross');
        let inputBox = document.getElementById("similarityInput");
        crossButton.onclick = () => {
            inputBox.value='';
            inputBox.focus();
            clearResults();
        };


    }
}

function hijackTrashButtons() {
    /*Trash buttons (button added with each request)*/
    let trashButtons = [...document.querySelectorAll('.btn2.svelte-11xeqgg')];
    trashButtons.forEach(btn => {
        btn.addEventListener('mouseup', () => {clearResults();});
    });
}


/* HELPERS */

function removeElementsByClass(className){
    const elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}

function percentStyle(float){
	return float.toFixed(2).replace(/[.,]00$/, "") + '%';
}

function toast() {
	var toastDiv = document.createElement('div');
	document.body.appendChild(toastDiv);
	toastDiv.innerHTML = '<div class="Toastify"><div class="Toastify__toast-container Toastify__toast-container--bottom-left"><div id="yxx5iumlv0" class="Toastify__toast Toastify__toast--dark" style="animation-fill-mode: forwards; animation-duration: 750ms;"><div role="alert" class="Toastify__toast-body"><div class="toast-content">복사되었습니다.</div></div></div></div></div></div>';
	/*Remove element*/
	setTimeout(function () {
		toastDiv.remove();
	}, 2000);
}

/* MEAT */
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
