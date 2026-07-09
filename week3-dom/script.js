// Step-01: Grabbing the elements.

// Grabbing the single secret elements
const revealBtn = document.getElementById('revealBtn');
const secretText = document.getElementById('secretText');

// Grabbing the multiple secret elements
const revealAllBtn = document.getElementById('revealAllBtn');
const hiddenItems = document.querySelectorAll('.hidden-item');

// Step 2: Add event listener to the first button
revealBtn.addEventListener('click', function() {
    // Change the CSS display property to show the paragraph
    secretText.style.display = 'block';
});

// Step 3: Add event listener to the "Reveal All" button
revealAllBtn.addEventListener('click', function() {
    // Loop through each hidden paragraph in the collection
    hiddenItems.forEach(function(item) {
        item.style.display = 'block';
    });
});

// Step 4: Rewritten with an if/else statement to toggle
revealBtn.addEventListener('click', function() {
    if (secretText.style.display === 'block') {
        secretText.style.display = 'none';
        revealBtn.textContent = 'Reveal Secret'; // Optional: Change button text back
    } else {
        secretText.style.display = 'block';
        revealBtn.textContent = 'Hide Secret';   // Optional: Change button text dynamically
    }
});
