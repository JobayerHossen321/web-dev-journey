const revealBtn = document.getElementById('revealBtn');
const secretText = document.getElementById('secretText');

revealBtn.addEventListener('click', () => {
   if (secretText.style.display === 'none' || secretText.style.display === '') {
    secretText.style.display = 'block';
  } else {
    secretText.style.display = 'none';
  }  
});

const revealAllBtn = document.getElementById('revealAllBtn');
const hiddenItems = doument.querySelectorAll('.hidden-item');

console.log(hiddenItems);
