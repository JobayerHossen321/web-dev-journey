const revealBtn = document.getElementById('revealBtn');
const secretText = document.getElementById('secretText');

revealBtn.addEventListener('click', () => {
  secretText.style.display = 'block';
});
