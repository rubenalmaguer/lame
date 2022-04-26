LAME_CDN = `https://lame.netlify.com/`;
LAME_CURRENT_URL = window.location.href;
LAME_SUPPORTED_SITES = [
  {rx: /lame\.netlify\.app/, scriptSrc: `${LAME_CDN}project-page.js`},
  {rx: /a\.flit\.to:4435\/admin#\/admin\/req_tr/, scriptSrc: `${LAME_CDN}crowd-monitoring.js`},
  {rx: /a3\.flit\.to\/#\/arcade\/arcade-objection/, scriptSrc: `${LAME_CDN}arcade-objection.js`},
  {rx: /a3\.flit\.to\/#\/arcade\/arcade-user-history/, scriptSrc: `${LAME_CDN}arcade-history.js`},
  {rx: /api-demo\.flit\.to/, scriptSrc: `${LAME_CDN}extend-simi-sites.js`},
  {rx: /translators\.to/, scriptSrc: `${LAME_CDN}extend-simi-sites.js`},
  {rx: /a3\.flit\.to\/#\/pro-tr\/pro-applicant\/\d/, scriptSrc: `${LAME_CDN}pro-applicant.js`},
  {rx: /desertfox\.io.+post/, scriptSrc: `${LAME_CDN}df-multirequest.js`},
];

matchedScript = '';
for (let {rx, scriptSrc} of LAME_SUPPORTED_SITES) {
  if (rx.test(LAME_CURRENT_URL)) { matchedScript = scriptSrc }
}

if (matchedScript) {
  if (!document.head.querySelectorAll(`[src="${matchedScript}"]`).length) {
    injectRemoteScript(matchedScript).then(()=> { lameify() })
  }
  else {
    lameify()
  }
}

function injectRemoteScript(src) {
  return new Promise((resolve, reject) => {
    let script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(/* script */);
    script.onerror = () => reject(new Error(`Script load error for ${src}`));
    document.head.append(script);
  });
}
