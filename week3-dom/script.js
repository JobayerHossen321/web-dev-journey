// Step-01: Grabbing the elements.

// Grabbing the single secret elements
const revealBtn = document.getElementById('revealBtn');
const secretText = document.getElementById('secretText');

// Grabbing the multiple secret elements
const revealAllBtn = document.getElementById('revealAllBtn');
const hiddenItems = document.querySelectorAll('.hidden-item');

// Step 2: Add event listener to the first button
revealBtn.addEventListener('click', function() {
// If it's currently hidden (none) or hasn't been set yet ('')
    if (secretText.style.display === 'none' || secretText.style.display === '') {
        secretText.style.display = 'block';
        revealBtn.textContent = 'Hide Secret';
    } else {
        secretText.style.display = 'none';
        revealBtn.textContent = 'Reveal Secret';
    }
});

// Step 3: Add event listener to the "Reveal All" button
revealAllBtn.addEventListener('click', function() {
// Look at the very first item to check the current state
    const firstItem = hiddenItems[0];
    
    if (firstItem.style.display === 'none' || firstItem.style.display === '') {
        // Loop through EVERY item and change display to 'block'
        hiddenItems.forEach(function(item) {
            item.style.display = 'block';
        });
        revealAllBtn.textContent = 'Hide All';
    } else {
        // Loop through EVERY item and change display to 'none'
        hiddenItems.forEach(function(item) {
            item.style.display = 'none';
        });
        revealAllBtn.textContent = 'Reveal All';
    }
});
