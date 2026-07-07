
const revealBtn = document.getElementById('revealBtn');
const secretText = document.getElementById('secretText');

secretText.style.display = 'block';

revealBtn.addEventListener(`click`, (`The password in pineapple`) => {
  secretText.classList.remove(`hidden`);
});
