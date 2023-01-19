LAME_OLD_HREF = '';

new MutationObserver(mutations => {
    mutations.forEach(() => {
      if (LAME_OLD_HREF != winddow.location.href) {
        LAME_OLD_HREF = window.location.href;
        lameify();
      }
    });
  })
.observe(document.querySelector('body'), { childList: true, subtree: true });


/*
LAME_ROUTES = [
  // New Arcade
  {rx: /api-demo\.flit\.to/, funcName: `${LAME_CDN}extend-simi-sites.js`},
  {rx: /translators\.to/, funcName: `${LAME_CDN}extend-simi-sites.js`},
  {rx: /desertfox\.io.+post/, funcName: `${LAME_CDN}df-multirequest.js`},
  
];
window['lameify']()
*/



function lameify() {
  alert('Pulito!')
}
