function lameify() {
  /* SAME-LANG: .svg-translate, DF: .svg-translate.purple, LITE: .svg-translate.blue AI: PURPLE: .svg-translate.yellow*/
  let mainPostButtonsYellowCount = [...document.querySelectorAll('.df-post__content .svg-translate.yellow')].length;
  if (mainPostButtonsYellowCount < 1) { return }

  let path = window.location.pathname.split('/');
  let userLang = (path[1] == 'post') ? 'en': path[1];
  let postId = path[path.length - 1];
  if (confirm(`Do you want to make ${mainPostButtonsYellowCount} ${(mainPostButtonsYellowCount > 1) ? 'requests' : 'request'}?\nLanguage code: ${userLang}`)) {


    let mainPostButtonsAndImages = [...document.querySelectorAll('.df-post__content .df-btn--translate, .df-post__thumbnail')]; /* Include images, as they are counted when index is sent to Flitto Lite */
    mainPostButtonsAndImages.forEach( (b, i) => {
      if (b.querySelector('.yellow')) {

        requestLiteTranslation(postId, userLang, i)
      }
    });
    
  }
}


function requestLiteTranslation(postId, targetLang, index) {
  let payload = (index == 0) ? `{"type":"crowd","post_id":"${postId}","lang":"${targetLang}","dest":{"type":"post","title":true}}`
  : `{"type":"crowd","post_id":"${postId}","lang":"${targetLang}","dest":{"type":"post","title":false,"content_index":${(index - 1).toString()}}}`; /* Minus title */

  const options = {
    method: 'POST',
    headers: {
      authority: 'www.desertfox.io:5501',
      authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjIzYWUxYmE0YTliMzc5M2MwMzczNzExIiwiaWF0IjoxNjQ5MTM4MjQwLCJleHAiOjE2ODA2NzQyNDB9.S2XCdTaY5n3uX12NQ1umycA0kQvApqmiSY4uqGQKYi8',
      'content-type': 'application/json'
    },
    body: payload
  };

  console.log(options);

  fetch('https://www.desertfox.io:5501/post/flitto-translate', options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));

}


lameify()
