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
