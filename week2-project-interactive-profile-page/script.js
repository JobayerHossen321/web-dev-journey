// ==========================================================================
// 📚 EARLY PRACTICE EXERCISES (Keep 'em or delete 'em, they are safe now!)
// ==========================================================================
const name = "Jobayer";
let age = 35;
let daysLearning = 8;

console.log(`My name is ${name}, I am ${age} years old, and I've been learning for ${daysLearning} days.`);

daysLearning = 9;
if (daysLearning < 7) {
    console.log(`Day ${daysLearning}: Just getting started`);
} else if (daysLearning >= 7 && daysLearning <= 30) {
    console.log(`Day ${daysLearning}: Building momentum`);
} else {
    console.log(`Day ${daysLearning}: Solid Progress`);
}

let skills = ["HTML", "CSS", "JavaScript", "Python", "Git"]; 

for (let i = 0; i < skills.length; i++) { 
    console.log(`${i+1}: ${skills[i]}`);
}
skills.push("React"); 

// ৩. বড় শব্দ সরাসরি প্রিন্ট করার ফাংশন
function printLongWords(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].length > 4) {
            console.log(arr[i]);
        }
    }
}
printLongWords(skills);

// ৪. বড় শব্দ নতুন ঝুড়িতে জমা করার ফাংশন
function getLongWords (words) {
    let longWords = []; 
    for (let i = 0; i < words.length; i++) {
        if (words[i].length > 4) {
            longWords.push(words[i]); 
        }
    }
    return longWords; 
}
let result = getLongWords(skills);
console.log(result); 

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
console.log(totalSum); 


// ==========================================================================
// 🌐 INTERACTIVE DESIGN: PROFILE SCRIPT
// ==========================================================================

// 1. Dynamic Greeting
const heading = document.getElementById('welcome-heading');
const currentHour = new Date().getHours();
let greeting = "";

if (currentHour < 12) {
    greeting = "Good morning";
} else if (currentHour < 18) {
    greeting = "Good afternoon";
} else {
    greeting = "Good evening";
}

// Fixed with backticks!
heading.textContent = `${greeting}, I am Jobayer Hossen`;


// 2. Theme Toggle Logic
const themeBtn = document.getElementById('theme-toggle');

themeBtn.addEventListener('click', function() {
    document.body.classList.toggle('dark-theme');
    
    if (document.body.classList.contains('dark-theme')) {
        themeBtn.textContent = "Switch to Light Mode";
    } else {
        themeBtn.textContent = "Switch to Dark Mode";
    }
});


// 3. Collapsible About Me Section
const aboutHeader = document.getElementById('about-header');
const aboutContent = document.getElementById('about-content');

aboutHeader.addEventListener('click', function() {
    aboutContent.classList.toggle('hidden');
});

// ==========================================================================
// FEATURE 4: DYNAMIC SKILLS LIST (ADD & DELETE VIA EVENT DELEGATION)
// ==========================================================================

// 1. Grab our DOM elements
const skillsList = document.getElementById('skills-list');
const newSkillInput = document.getElementById('new-skill-input');
const addSkillBtn = document.getElementById('add-skill-btn');

// 2. Logic to ADD a new skill
addSkillBtn.addEventListener('click', function() {
    const skillText = newSkillInput.value.trim(); // Grab text and trim accidental extra spaces
    
    // Validation: Don't allow empty skills!
    if (skillText === "") {
        alert("Please type a skill name first!");
        return;
    }
    
    // Create a new <li> element dynamically
    const newLi = document.createElement('li');
    
    // Inject the text alongside its own delete button
    newLi.innerHTML = `${skillText} <button class="delete-btn">X</button>`;
    
    // Append the brand new <li> inside our <ul> container
    skillsList.appendChild(newLi);
    
    // Reset the input box text field to blank
    newSkillInput.value = "";
});

// 3. Logic to DELETE a skill using Event Delegation
// Instead of adding listeners to individual buttons, we listen to the parent <ul>
skillsList.addEventListener('click', function(event) {
    // Check if what the user clicked is actually a delete button
    if (event.target.classList.contains('delete-btn')) {
        // Find the parent <li> containing this specific button
        const liToRemove = event.target.parentElement;
        // Remove it from the DOM entirely!
        liToRemove.remove();
    }
});
