const revealBtn = document.getElementById('revealBtn');
const secretText = document.getElementById('secretText');

revealBtn.addEventListener('click', () => {
   if (secretText.style.display === 'none' || secretText.style.display === '') {
    secretText.style.display = 'block';
  } else {
    secretText.style.display = 'none';
  }  
});

