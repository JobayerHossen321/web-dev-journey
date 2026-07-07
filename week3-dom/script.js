const revealBtn = document.getElementById('revealBtn');
const secretText = document.getElementById('secretText');

revealBtn.addEventListener('click', () => {
  secretText.style.display = 'block';

  if (secretText.style.display === 'block') {
  secretText.style.display = 'none';
} else {
  secretText.style.display = 'block';
}  
});


