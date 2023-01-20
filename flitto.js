LAME_OLD_LOCATION = '';
TERMS_CONDITIONS_URLS = [
  'https://www.flitto.com/arcade-service/problems/32',
  'https://www.flitto.com/arcade-service/problems/193'
];

function lameify() {
  setInterval(checkLocation, 100);
}

function checkLocation() {
  const myLocation = window.location.href;

  // Exit if not first time or not in New Arcade
  if (myLocation == LAME_OLD_LOCATION || !myLocation.includes('arcade-service')) return;

  //
  if (TERMS_CONDITIONS_URLS.includes(myLocation)) {
    bypassTermsAndConditions();
    return;
  }
  
  // It's a "problem/question" page like https://www.flitto.com/arcade-service/problems/63c539909f134b08daa48d93/63c539909f134b08daa48d87
  if (/problems\/\w+\/\w+$/.test(myLocation)) {
    LAME_OLD_LOCATION = myLocation;
    setTimeout(tweakProblemPage, 500);
  } 
}

function bypassTermsAndConditions() {
  document.querySelector('i.checkbox__icon')?.click();
  document.querySelector('.text-button.primary-light-fill.start-btn')?.click();
}

function tweakProblemPage() {
  // Make target div contenteditable, so the spellcheck extension kicks in    
  let targetAreas = [...document.querySelectorAll('p.translation__content')];
  targetAreas?.forEach(area => {
    area.setAttribute('contenteditable','true');
    area.focus();
  });
  //targetAreas?.[0].focus();

  // Auto-send afer Accept button is clicked
  let acceptButtons = [...document.querySelectorAll('.accept-button')];
  acceptButtons?.forEach(btn => btn.addEventListener('click', clickSend));
      
  // In case it's a re-review. Remove irrelevant, already accepted translation.
  document.querySelector('.translation__re-accepted-text')?.closest('.translation')?.remove();
}

function clickSend() {
  setTimeout(()=>{
    document.querySelector('button.primary-light-fill')?.click()
  }, 50);
}

