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
const hiddenItems = document.querySelectorAll('.hidden-item');

console.log(hiddenItems);

revealAllBtn.addEventListener('click', function () {
  hiddenItems.forEach(function (item) {
    item.style.display = 'block';
  });
});

hiddenItems.forEach(item => {
  if (item.style.display === 'none' || item.style.display === '') {
    item.style.display = 'block';
  } else {
    item.style.display = 'none';
  }
});
