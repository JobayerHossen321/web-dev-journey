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
    
   // SAFE STEP: Set text via textContent to block script injections
    newLi.textContent = skillText + " "; 
    
    // Create the delete button dynamically
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'X';
    
    // Nest the button safely inside the <li>
    newLi.appendChild(deleteBtn);
    
    // Append the entire clean row inside our main list <ul>
    skillsList.appendChild(newLi);
    
    newSkillInput.value = "";
});

// 3. Logic to DELETE a skill using Event Delegation
skillsList.addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-btn')) {
        const liToRemove = event.target.parentElement;
        liToRemove.remove();
    }
});

// ==========================================================================
// FEATURE 5: INLINE PROFILE EDITING WITH VALIDATION
// ==========================================================================

// 1. Grab the element
const welcomeHeading = document.getElementById('welcome-heading');

// 2. Listen for a click on the heading
welcomeHeading.addEventListener('click', function() {
    // If we are already editing, do nothing
    if (welcomeHeading.querySelector('input')) return;

    // Extract the current text name (removing any dynamic time greetings for clean editing)
    const currentFullText = welcomeHeading.textContent;
    // Let's grab just the name part or edit the full greeting
    
    // Create a temporary input element
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.value = currentFullText;
    inputField.className = 'edit-input';
    
    // Clear out the heading text and drop the input field inside it
    welcomeHeading.textContent = '';
    welcomeHeading.appendChild(inputField);
    
    // Automatically focus the cursor into the input field
    inputField.focus();
    
    // Function to save the changes
    function saveChanges() {
        const newValue = inputField.value.trim();
        
        // STRETCH GOAL: Form Validation (Field cannot be empty!)
        if (newValue === "") {
            alert("Name field cannot be empty!");
            inputField.focus();
            return;
        }
        
        // Restore the heading text with the new value
        welcomeHeading.textContent = newValue;
    }
    
    // Save when the user presses 'Enter'
    inputField.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            saveChanges();
        }
    });
    
    // Save when the user clicks away from the text box (blur event)
    inputField.addEventListener('blur', function() {
        saveChanges();
    });
});
