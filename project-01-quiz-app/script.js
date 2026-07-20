//Step-02: Store the Quiz Data in JavaScript
// Our Quiz Questions Array
const quizData = [
    {
        question: "Which language runs in a web browser?",
        options: ["Java", "C", "Python", "JavaScript"],
        correct: "JavaScript"
    },
    {
        question: "What does HTML stand for?",
        options: [
            "Hypertext Markup Language",
            "High Text Machine Language",
            "Hyper Transfer Mark Language",
            "Home Tool Markup Language"
        ],
        correct: "Hypertext Markup Language"
    },
    {
        question: "Which symbol is used for strict equality in JS?",
        options: ["=", "==", "===", "=>"],
        correct: "==="
    }
];

// Step 3: Track App State & Grab DOM Elements
// State Variables
let currentQuestionIndex = 0;
let score = 0;

// Grab DOM Elements
const questionElement = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const scoreElement = document.getElementById('score-text');
const feedbackElement = document.getElementById('feedback-text');

// Step 4: Display the Current Question
function loadQuestion() {
    // Clear out feedback from previous question
    feedbackElement.textContent = "";

    // Grab the current question object
    const currentQuiz = quizData[currentQuestionIndex];

    // Set the question text on screen
    questionElement.textContent = currentQuiz.question;

    // Clear out old buttons before rendering new ones
    optionsContainer.innerHTML = "";

    // Loop through options and create a button for each
    currentQuiz.options.forEach(optionText => {
        const button = document.createElement('button');
        button.textContent = optionText;
        
        // Listen for user clicks on option buttons
        button.addEventListener('click', function() {
            checkAnswer(optionText);
        });

        optionsContainer.appendChild(button);
    });
}

// Step 5: Check Answers & Progress the Quiz
function checkAnswer(selectedOption) {
    const currentQuiz = quizData[currentQuestionIndex];

    // Check if user chose correctly
    if (selectedOption === currentQuiz.correct) {
        score++;
        scoreElement.textContent = `Score: ${score}`;
        feedbackElement.textContent = "Correct! 🎉";
    } else {
        feedbackElement.textContent = `Wrong! The correct answer was: ${currentQuiz.correct}`;
    }

    // Move to next question after a brief delay so the user sees the feedback
    currentQuestionIndex++;

    setTimeout(function() {
        if (currentQuestionIndex < quizData.length) {
            loadQuestion(); // Load next question
        } else {
            showFinalResults(); // Quiz finished!
        }
    }, 1200); // 1.2 second pause
}

// Step 6: Handle Quiz Completion
function showFinalResults() {
    questionElement.textContent = "Quiz Completed!";
    optionsContainer.innerHTML = "";
    feedbackElement.textContent = `Final Score: ${score} out of ${quizData.length}`;
}

// Start the quiz on page load!
loadQuestion();
