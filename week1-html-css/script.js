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

printLongWords(skills);

function getLongWords (words) {
  for (let i = 0; i < words.length; i++) {
    if (words[i].length > 4) {
      longWords.push(words[i]);
    }  
  }
  return longWords;
}
let result = getLongWords(skills);
console.log(result);

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
  
