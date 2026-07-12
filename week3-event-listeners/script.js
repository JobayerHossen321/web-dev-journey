// 1. Grab the parent container from the DOM
const container = document.getElementById('box-container');

// 2. Add ONE listener to the parent
container.addEventListener('click', function(event) {
  
  // 3. Log event.target to the console (as requested in the task)
  console.log("You clicked on:", event.target);

  // 4. Critical Check: Ensure the user actually clicked a box, 
  // and not the empty space inside the parent container.
  if (event.target.classList.contains('box')) {
    
    // 5. Change that specific box's background color
    event.target.style.backgroundColor = '#301934'; 
    // Tip: You can change 'darkpurple' to any color you like, or randomize it!
  }
});
