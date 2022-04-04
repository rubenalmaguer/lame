/* Compi v1.5 (
    - Fix for empty "Score" row issue. (while loop + diff1 → diff0)
) */


main();

function main() {
    alert('Hello!');
    console.log('main');
    let nestedTables = [...document.querySelectorAll('tbody tbody')];
	/* Remove existing row, to enable switching from word to char */
    while (document.getElementById('diff0')) {
        nestedTables.forEach (t => { t.deleteRow(-1) })    
    }
        
    let unit = setting; /* 'char'|'word' */
    	
	/*Add events (needs re-applying on in-app tab change) */
	document.querySelector('[role="tablist"]').setAttribute('listener', 'true'); /* navBar */
	document.querySelector('[role="tablist"]').addEventListener('click', ostinato, { once: true });
	document.getElementsByClassName('fa-search')[0].parentNode.addEventListener('click', ostinato, { once: true }); /* searchBtn */
	document.getElementsByTagName('pagination')[0].childNodes[0].addEventListener('click', ostinato, { once: true }); /* pageNav */
	if (document.querySelectorAll('.btn-group-md').length > 0) {
	document.querySelectorAll('.btn-group-md')[0].addEventListener('click', ostinato, { once: true }); /* image tab's sub-tab buttons */
	}
    /* Accept obj buttons */
	[...document.getElementsByClassName('btn-success')].forEach(btn=>{
        btn.addEventListener('click', ostinato, { once: true });
    });

    /* Deny obj buttons */
    [...document.getElementsByClassName('btn-danger')].forEach(btn=>{
        btn.addEventListener('click', hijackModal, { once: true });
    });

    /* Page setup */
    nestedTables.forEach ((t,i) => {
        let newRow = t.insertRow();
        let newCell = newRow.insertCell();
            newCell.classList.add('text-left');
            newCell.id = 'diff' + i;
            newCell.style = 'white-space:pre-wrap;';
        let th = document.createElement('th');
            newRowHead = newRow.insertBefore(th, newCell);
            newRowHead.classList.add('bg-muted');
        let newText = document.createTextNode('Score');
            newRowHead.appendChild(newText);

    });

    /* Diff */
    nestedTables.forEach ((t,i) => {
        let fragment = document.createDocumentFragment();
        
        /* Get text and make array of words (" ") or characters ("") */
        let oldText, newText;
        if (unit == 'char') {
            oldText = t.getElementsByTagName('tr')[t.rows.length - 3].childNodes[3].textContent.split("");
            newText = t.getElementsByTagName('tr')[t.rows.length - 2].childNodes[3].textContent.split("");
        }

        /*Make spaces and new lines traceable by adding placeholders surrounded by actual spaces*/
        if (unit == 'word') {
            oldText = t.getElementsByTagName('tr')[t.rows.length - 3].childNodes[3].textContent.replaceAll(' ', ' «space» ').replaceAll('\n', ' \n ').split(" ");
            newText = t.getElementsByTagName('tr')[t.rows.length - 2].childNodes[3].textContent.replaceAll(' ', ' «space» ').replaceAll('\n', ' \n ').split(" ");
        }
        

        /*Generate diff*/
        let diff = patienceDiff(oldText , newText);

        /*lines are a property of the object returned by patienceDiff, in this case: words or characters*/
        diff.lines.forEach((o) => {
        var color = "";
        var deco = "";
        
        /*Format*/
        if (o.aIndex < 0) {
            /*INSERTION*/
            color = 'rgba(0, 255, 0, 0.3)';
            deco = 'underline';
            /*Show added lines*/
            if (o.line == "\n") {o.line = "[↵]\n"}  
        
        } else if (o.bIndex < 0) {
            /*DELETION*/
            color = 'rgba(255, 0, 0, 0.3)';
            deco = 'line-through';
            /*Show removed lines*/
            if (o.line == "\n") {o.line = "[↵]"}  
        } 

        span = document.createElement('span');
        span.style.backgroundColor = color;
        span.style.textDecoration = deco;
        if (unit == 'word') {o.line = o.line.replaceAll('«space»', ' ');}
        span.appendChild(document.createTextNode(o.line));
        fragment.appendChild(span);
    
    	document.getElementById('diff'+ i).appendChild(fragment);
    });
    });

    /*Similarity*/
    nestedTables.forEach ((t) => {
        /*Get text*/
        let oldText = t.getElementsByTagName('tr')[t.rows.length - 3].childNodes[3].textContent;
        let newText = t.getElementsByTagName('tr')[t.rows.length - 2].childNodes[3].textContent;
        /*Compare*/
        var score = compareTwoStrings(oldText, newText);
        /*Display results*/
        if (score == 100) {t.getElementsByTagName('tr')[t.rows.length - 1].childNodes[0].style.color = 'crimson'}
        let scoreCard = t.getElementsByTagName('tr')[t.rows.length - 1].childNodes[0];
        scoreCard.textContent = `Simi: ${percentStyle(score)}`;
    });
}


function ostinato() {
    setTimeout(main,500);
    setTimeout(main,1200);
    setTimeout(main,2500);
}

function hijackModal() {
    /* Deny btn inside deny modal */
    setTimeout(()=>{
        document.querySelector('section > .btn-primary').addEventListener('click', ostinato, { once: true });
    }, 200);
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



function percentStyle(float){
    return float.toFixed(2).replace(/[.,]00$/, "") + '%';
}
