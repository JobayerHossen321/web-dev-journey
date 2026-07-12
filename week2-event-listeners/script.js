// 1. Grab the parent container
const container = document.getElementById('box-container');

// 2. Add the click event listener using event delegation
container.addEventListener('click', function(event) {
  
  // 3. Make sure the user actually clicked a box
  if (event.target.classList.contains('box')) {
    
    // 4. Generate random numbers for Red, Green, and Blue on EVERY click
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    
    // 5. Construct the RGB string (e.g., "rgb(120, 45, 210)")
    const randomColor = `rgb(${r}, ${g}, ${b})`;
    
    // 6. Apply it to the exact box that was clicked!
    event.target.style.backgroundColor = randomColor;
  }
});
