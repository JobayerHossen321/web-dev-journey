const name = "Jobayer";
let age = 35;
let daysLearning = 8;

console.log(`My name is ${name}, I am ${age} years old, and I've been learning for ${daysLearning} days.`);

daysLearning = 9;

if (daysLearning < 7) {
  console.log(`Day ${daysLearning}: Just getting started`);
} else if (daysLearning >= 7 && daysLearning <=30) {
  console.log(`Day ${daysLearning}: Building momentum`);
} else {
  console.log(`Day ${daysLearning}: Solid Progress`);
}  

let skills = ["HTML", "CSS", "JavaScript", "Python", "Git"];   //Creating the array

for (let i = 0; i < skills.length; i++) {    //Loop to print each skill with its position
  console.log(`${i+1}: ${skills[i]}`);
}

skills.push("React");  //Add "React" to the array

// ৩. বড় শব্দ সরাসরি প্রিন্ট করার ফাংশন
function printLongWords(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].length > 4) {
      console.log(arr[i]);
    }
  } 
}     
printLongWords(skills);

// ৪. বড় শব্দ নতুন ঝুড়িতে জমা করার ফাংশন (এখানে ভুল ঠিক করা হয়েছে)
function getLongWords (words) {
  let longWords = []; // ল্যাপটপকে বললাম: এই নাও একটা নতুন খালি ঝুড়ি
  for (let i = 0; i < words.length; i++) {
    if (words[i].length > 4) {
      longWords.push(words[i]); // এখন খালি ঝুড়িতে স্কিল ঢুকবে
    }  
  }
  return longWords; // ঝুড়িটা ফেরত দিলাম
}
let result = getLongWords(skills);
console.log(result); // আউটপুট দেখাবে: ['JavaScript', 'React']

// ৫. সব সংখ্যা যোগ করার ফাংশন
function sumArray(numbers) {
  let total = 0;
  for (let i = 0; i < numbers.length; i++) {
    total += numbers[i];
  }
  return total;
}

let myNumbers = [10, 25, 3, 7, 15];
let totalSum = sumArray(myNumbers);
console.log(totalSum); // আউটপুট দেখাবে: 60

// Interactive Design

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

const themeBtn = document.getElementById('theme-toggle');

// Add the Dark Mode logic

themeBtn.addEventListener('click', function() {
  // Toggle the class on the entire body element
  document.body.classList.toggle('dark-theme');
  
  // Update the button text so the user knows what will happen next click
  if (document.body.classList.contains('dark-theme')) {
    themeBtn.textContent = "Switch to Light Mode";
  } else {
    themeBtn.textContent = "Switch to Dark Mode";
  }
});
