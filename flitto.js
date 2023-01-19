LAME_OLD_HREF = '';


function checkLocation() {
  const myLoc = window.location.href;
  if (!myLoc.includes('arcade-service')) return
  
  if (LAME_OLD_HREF == myLoc
      || myLoc === 'https://www.flitto.com/arcade-service/problems/32'
      || myLoc === 'https://www.flitto.com/arcade-service/problems/193') {
    document.querySelector('i.checkbox__icon')?.click();
    document.querySelector('.text-button.primary-light-fill.start-btn')?.click();
    return
  }
    
  if (/problems\/\w+\/\w+$/.test(myLoc)) {
      //example:
      //https://www.flitto.com/arcade-service/problems/63c539909f134b08daa48d93/63c539909f134b08daa48d87
    
      LAME_OLD_HREF = myLoc;
      
      // Wait for load
      setTimeout(()=>{
      // Make target div contenteditable, so the spellcheck extension kicks in
          
      let targetArea = document.querySelector('p.translation__content');
      targetArea?.setAttribute('contenteditable','true');
      targetArea?.focus()
      
      // Final accept
      let acceptBtn = document.querySelector('.accept-button');
      acceptBtn?.addEventListener('click', ()=>{
        setTimeout(()=>{
          sendBtn = document.querySelector('button.primary-light-fill');
          sendBtn?.click()
          }, 50);
      });
          
      // For re-reviewing. Remove irrelevant, already accepted translation.
      document.querySelector('.translation__re-accepted-text').closest('.translation').remove();
          
    }, 500);
      
  }
    
}



function lameify() {
  setInterval(checkLocation, 100);
}
