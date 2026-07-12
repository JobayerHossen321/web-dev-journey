// 1. Grab the heading element
const heading = document.getElementById('welcome-heading');

// 2. Get the current hour (0 to 23) using the Date object
const currentHour = new Date().getHours();
let greeting = "";

// 3. Determine the greeting based on the hour
if (currentHour < 12) {
  greeting = "Good morning";
} else if (currentHour < 18) {
  greeting = "Good afternoon";
} else {
  greeting = "Good evening";
}

// 4. Update the text dynamically!
heading.textContent = `${greeting}, I am Jobayer Hossen`;
