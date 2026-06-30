const name = "Jobayer";
let age = 35;
let daysLearning = 8;

console.log(`My name is ${name}, I am ${age} years old, and I've been learning for ${daysLearning} days.`);

let dayslearning = 9;

if (dayslearning < 7) {
  console.log(`Day ${dayslearning}: Just getting started`);
} else if (dayslearning >= 7 && dayslearning <=30) {
  console.log(`Day $(dayslearning}: Building momentum`);
} else {
  console.log(`Day ${dayslearning}:Solid Progress`);
}  
