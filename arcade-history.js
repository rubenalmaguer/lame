function lameify() {
  if (!document.querySelectorAll('table').length) { return }
  if (!document.getElementById('lame-progress-modal')) { addModal() }
  main();
}

function addModal() {
  let progressModal = Object.assign(document.createElement('dialog'), {
    id: 'lame-progress-modal',
    open: '',
    style: 'padding: 2em; border: 0; box-shadow: #000 0px 0px 1em; border-radius: 5px;',
    innerHTML: `
    <p>Loading more entries...</p>
    <progress id="tables-loading-progress" max="100" value="0" style="width: 100%"></progress>`,
  });
  document.body.append(progressModal);

  let styleSheet = Object.assign(document.createElement('style'), {
  textContent: `
    dialog::backdrop {
      background: #000;
      opacity: 0.5;
      transition: opacity .15s linear;
    }
    `,
  });
  document.head.appendChild(styleSheet);
}

function main() {
  let initialEntryCount = document.querySelectorAll('table').length;
  let remoteTotal = parseInt(document.querySelector('.fs-12.font-bold').textContent.replace(',', ''));
  let progressModal = document.getElementById('lame-progress-modal');

  if (initialEntryCount < remoteTotal) {
    progressModal.showModal()
  } else {
    alert('No more results.');
    return
  }

  let LIMIT_PER_CLICK = initialEntryCount + 400; /* Just so it doesn't take too long */
  let stopPoint = (remoteTotal < LIMIT_PER_CLICK) ? remoteTotal : LIMIT_PER_CLICK;
  let progressBar= document.getElementById('tables-loading-progress');

  let clickerInterval = setInterval(()=>{
    let loadedEntryCount = document.querySelectorAll('table').length;
    console.log(`Loaded entries: ${loadedEntryCount}`);
    progressBar.value = (loadedEntryCount - initialEntryCount) / (stopPoint - initialEntryCount)  * 100;

    if (loadedEntryCount < stopPoint) {
      document.querySelector('.btn-primary.full-width').click()
    }
    else {
      progressBar.value = 0;
      progressModal.close();
      clearInterval(clickerInterval);
    }
  }, 500);
}

/* lameify() */
