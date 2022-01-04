<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LAME Tools</title>
    <link rel="icon" type="image/png" href="lame.png">

<style>
    *, *::before, *::after {
    box-sizing: border-box;
    text-align: center;
    font-family: montserrat,sans-serif;
    margin: 0;
    
    }

    .masthead {
        background: rgba(245,245,245,1);
        padding-top: 2rem;
        white-space: nowrap;
    }
        h1 {
            margin-bottom: 0;
            font-weight: 600;
            font-size: 7rem;
            line-height: 1.25;
            color: #313131;
            text-rendering: optimizeLegibility;
            word-wrap: break-word;
            word-break: break-word;
            hyphens: manual;
        }


    .wrapper {
        padding-top: 6rem;

        background: rgb(253,253,253);
        background: linear-gradient(0deg, rgba(253,253,253,1) 50%, rgba(245,245,245,1) 100%);

        display:flex;
        flex-direction: row;
        align-items:center;
        justify-content: space-evenly;
    }
    .column {   
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
    }

    p {
        margin:0;
        font-size: 1.25rem;
    }

    .step {
        font-weight: bold;
    }

    .link-btn {
        font-size: 1.25rem;
        color: snow;
        background-color: mediumseagreen;
        border: transparent solid 3px;
        padding: 10px 20px;
        border-radius: 15px;
        margin: 15px;
        text-decoration: none;
    }

    .link-btn:hover {
        border: mediumaquamarine solid 3px;
        color: aquamarine;
    }

    
</style>
</head>

<body>
    <div class="masthead">
        <h1>L.&nbsp;A.&nbsp;M.&nbsp;E.</h1>
        <h2>Linguist&nbsp;Assessment&nbsp;and&nbsp;Monitoring&nbsp;Environment</h2>
    </div>

    <div class="wrapper">
        <div class="column left">
            <p><span class="step">1.</span> Korean version</p>
            <a class="link-btn" href="javascript:
            %2F%2A%20SETTINGS%20%2A%2F%0AUIlang%20%3D%20%27ko%27%3B%0AsusLimit%20%3D%2085%3B%0Asetting%20%3D%20%28typeof%20setting%20%3D%3D%20%27undefined%27%20%7C%7C%20setting%20%3D%3D%20%27word%27%29%20%3F%20%27char%27%20%3A%20%27word%27%3B%20%2F%2A%20for%20objection%20similarity%20%2A%2F%0A%0A%2F%2A%20LINKS%20%2A%2F%0AreleaseRoot%20%3D%20%27https%3A%2F%2Fcdn.jsdelivr.net%2Fgh%2Fdokdospanish%2Flame%40v0.0%2F%27%3B%0AcurrentUrl%20%3D%20window.location.href%3B%0A%0A%2F%2A%20REGEX%20%2A%2F%0ArxLameSite%20%3D%20%2Flame%5C.netlify%5C.app%2F%3B%0ArxCrowdMonitoring%20%3D%20%2Fa%5C.flit%5C.to%3A4435%5C%2Fadmin%23%5C%2Fadmin%5C%2Freq_tr%2F%3B%0ArxObjection%20%3D%20%2Fa3%5C.flit%5C.to%5C%2F%23%5C%2Farcade%5C%2Farcade-objection%2F%3B%0ArxFlittoApi%20%3D%20%2Fapi-demo%5C.flit%5C.to%2F%3B%0ArxTranslatorsTo%20%3D%20%2Ftranslators%5C.to%2F%3B%0ArxProApplicant%20%3D%20%2Fa3%5C.flit%5C.to%5C%2F%23%5C%2Fpro-tr%5C%2Fpro-applicant%5C%2F%5Cd%2F%3B%0A%0A%2F%2A%20FLOW%20%2A%2F%0Aif%20%28rxCrowdMonitoring.test%28currentUrl%29%29%20%7B%0A%20%20if%20%28%21document.head.querySelectorAll%28%60%5Bsrc%3D%22%24%7BreleaseRoot%7Dcrowd-monitoring.js%22%5D%60%29.length%29%20%7B%20injectRemoteScript%28%60%24%7BreleaseRoot%7Dcrowd-monitoring.js%60%29%20%7D%0A%20%20else%20%7B%20translateCK%28%29%20%7D%0A%7D%0A%0Aelse%20if%20%28%0A%20%20rxObjection.test%28currentUrl%29%0A%20%20%29%20%7B%20injectRemoteScript%28%60%24%7BreleaseRoot%7Dobjection-compare.js%60%29%20%7D%0A%0Aelse%20if%20%28%0A%20%20rxFlittoApi.test%28currentUrl%29%0A%20%20%7C%7C%20rxTranslatorsTo.test%28currentUrl%29%0A%20%20%29%20%7B%20injectRemoteScript%28%60%24%7BreleaseRoot%7Dmt-similarity.js%60%29%20%7D%0A%0Aelse%20if%20%28%20%20rxLameSite.test%28currentUrl%29%0A%20%20%29%20%7B%20alert%28%271.%20Drag%20button%20to%20bookmarks%20bar.%5Cn%5Cn2.%20Use%20button%20in%20one%20of%20these%20sites%3A%5Cn%20%20%20-%20Vitamin%5C%27s%20Arcade%20Objection%5Cn%20%20%20-%20Flitto%5C%27s%20API%20demo%5Cn%20%20%20-%20translators.to%20%5Cn%20%20%20-%20Old%20Flitto%20Admin%20%3E%20crowd_tr%20%3E%20req_tr%27%29%20%7D%0A%0A%0A%0A%0A%2F%2A%20HELPERS%20%2A%2F%0Afunction%20injectRemoteScript%28src%29%20%7B%0A%20%20return%20new%20Promise%28%28resolve%2C%20reject%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20const%20script%20%3D%20document.createElement%28%27script%27%29%3B%0A%20%20%20%20%20%20script.src%20%3D%20src%3B%0A%20%20%20%20%20%20script.addEventListener%28%27load%27%2C%20resolve%29%3B%0A%20%20%20%20%20%20script.addEventListener%28%27error%27%2C%20e%20%3D%3E%20reject%28e.error%29%29%3B%0A%20%20%20%20%20%20document.head.appendChild%28script%29%3B%0A%20%20%7D%29%3B%0A%7D%0A%0Afunction%20translateCK%28%29%20%7B%0A%20%20let%20labels%20%3D%20%5B...errataWrap.querySelectorAll%28%27input%27%29%5D%3B%0A%20%20labels.forEach%28ck%20%3D%3E%20%7B%0A%20%20%20%20let%20ckid%20%3D%20ck.id%3B%0A%20%20%20%20%2F%2A%20UIlangIndex%20%3D%20supportLang.indexOf%28meta.tCode%29%3B%20%2A%2F%0A%20%20%20%20let%20la%20%3D%20document.getElementById%28%60labelfor%24%7Bckid%7D%60%29%3B%0A%20%20%20%20la.innerText%20%3D%20errTypes%5Bckid%5D%5BUIlangIndex%5D%3B%0A%20%20%7D%29%3B%0A%7D
            ">
                레임 0.0</a>
        </div>
        <div class="column right">
            <p><span class="step">2.</span> English version</p>
            <a class="link-btn" href="javascript:
            %2F%2A%20SETTINGS%20%2A%2F%0AUIlang%20%3D%20%27en%27%3B%0AsusLimit%20%3D%2085%3B%0Asetting%20%3D%20%28typeof%20setting%20%3D%3D%20%27undefined%27%20%7C%7C%20setting%20%3D%3D%20%27word%27%29%20%3F%20%27char%27%20%3A%20%27word%27%3B%20%2F%2A%20for%20objection%20similarity%20%2A%2F%0A%0A%2F%2A%20LINKS%20%2A%2F%0AreleaseRoot%20%3D%20%27https%3A%2F%2Fcdn.jsdelivr.net%2Fgh%2Fdokdospanish%2Flame%40v0.0%2F%27%3B%0AcurrentUrl%20%3D%20window.location.href%3B%0A%0A%2F%2A%20REGEX%20%2A%2F%0ArxLameSite%20%3D%20%2Flame%5C.netlify%5C.app%2F%3B%0ArxCrowdMonitoring%20%3D%20%2Fa%5C.flit%5C.to%3A4435%5C%2Fadmin%23%5C%2Fadmin%5C%2Freq_tr%2F%3B%0ArxObjection%20%3D%20%2Fa3%5C.flit%5C.to%5C%2F%23%5C%2Farcade%5C%2Farcade-objection%2F%3B%0ArxFlittoApi%20%3D%20%2Fapi-demo%5C.flit%5C.to%2F%3B%0ArxTranslatorsTo%20%3D%20%2Ftranslators%5C.to%2F%3B%0ArxProApplicant%20%3D%20%2Fa3%5C.flit%5C.to%5C%2F%23%5C%2Fpro-tr%5C%2Fpro-applicant%5C%2F%5Cd%2F%3B%0A%0A%2F%2A%20FLOW%20%2A%2F%0Aif%20%28rxCrowdMonitoring.test%28currentUrl%29%29%20%7B%0A%20%20if%20%28%21document.head.querySelectorAll%28%60%5Bsrc%3D%22%24%7BreleaseRoot%7Dcrowd-monitoring.js%22%5D%60%29.length%29%20%7B%20injectRemoteScript%28%60%24%7BreleaseRoot%7Dcrowd-monitoring.js%60%29%20%7D%0A%20%20else%20%7B%20translateCK%28%29%20%7D%0A%7D%0A%0Aelse%20if%20%28%0A%20%20rxObjection.test%28currentUrl%29%0A%20%20%29%20%7B%20injectRemoteScript%28%60%24%7BreleaseRoot%7Dobjection-compare.js%60%29%20%7D%0A%0Aelse%20if%20%28%0A%20%20rxFlittoApi.test%28currentUrl%29%0A%20%20%7C%7C%20rxTranslatorsTo.test%28currentUrl%29%0A%20%20%29%20%7B%20injectRemoteScript%28%60%24%7BreleaseRoot%7Dmt-similarity.js%60%29%20%7D%0A%0Aelse%20if%20%28%20%20rxLameSite.test%28currentUrl%29%0A%20%20%29%20%7B%20alert%28%271.%20Drag%20button%20to%20bookmarks%20bar.%5Cn%5Cn2.%20Use%20button%20in%20one%20of%20these%20sites%3A%5Cn%20%20%20-%20Vitamin%5C%27s%20Arcade%20Objection%5Cn%20%20%20-%20Flitto%5C%27s%20API%20demo%5Cn%20%20%20-%20translators.to%20%5Cn%20%20%20-%20Old%20Flitto%20Admin%20%3E%20crowd_tr%20%3E%20req_tr%27%29%20%7D%0A%0A%0A%0A%0A%2F%2A%20HELPERS%20%2A%2F%0Afunction%20injectRemoteScript%28src%29%20%7B%0A%20%20return%20new%20Promise%28%28resolve%2C%20reject%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20const%20script%20%3D%20document.createElement%28%27script%27%29%3B%0A%20%20%20%20%20%20script.src%20%3D%20src%3B%0A%20%20%20%20%20%20script.addEventListener%28%27load%27%2C%20resolve%29%3B%0A%20%20%20%20%20%20script.addEventListener%28%27error%27%2C%20e%20%3D%3E%20reject%28e.error%29%29%3B%0A%20%20%20%20%20%20document.head.appendChild%28script%29%3B%0A%20%20%7D%29%3B%0A%7D%0A%0Afunction%20translateCK%28%29%20%7B%0A%20%20let%20labels%20%3D%20%5B...errataWrap.querySelectorAll%28%27input%27%29%5D%3B%0A%20%20labels.forEach%28ck%20%3D%3E%20%7B%0A%20%20%20%20let%20ckid%20%3D%20ck.id%3B%0A%20%20%20%20%2F%2A%20UIlangIndex%20%3D%20supportLang.indexOf%28meta.tCode%29%3B%20%2A%2F%0A%20%20%20%20let%20la%20%3D%20document.getElementById%28%60labelfor%24%7Bckid%7D%60%29%3B%0A%20%20%20%20la.innerText%20%3D%20errTypes%5Bckid%5D%5BUIlangIndex%5D%3B%0A%20%20%7D%29%3B%0A%7D
            ">
                LAME 0.0</a>
        </div>           
    </div>
</body>

</html>
