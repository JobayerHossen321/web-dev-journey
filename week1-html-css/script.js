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

for (let i = 0; i < skills.length; i++) {   //Loop to print only skills with more than 4 characters
  if (skills[i].length >4) {
    console.log(skills[i]);
  }
}

function double(num) {
  return num * 2;
}
console.log(double(5));
console.log(double(100));
console.log(double(1.5));

function printLongWords(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].length > 4) {
      console.log(arr[i]);
    }
  } 
}     

