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

let skills = ["HTML", "CSS", "JavaScript", "Python", "Git"];

for (let i = 0; i < skills.lenth; i++) {
  console.log((i +1) + ": " + skills[i]);
}

skills.push("React");

for (let skill of skills) {
  if (skill.length > 4) {
    console.log(skill);
  }
}
