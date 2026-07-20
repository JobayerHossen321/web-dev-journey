// 1. Quiz Data
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

// 2. State Variables
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 10;
let timerInterval = null; // Will store our clock interval

// 3. Grab DOM Elements
const questionElement = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const scoreElement = document.getElementById('score-text');
const feedbackElement = document.getElementById('feedback-text');
const timerElement = document.getElementById('timer-text');
const restartContainer = document.getElementById('restart-container');

// ⏱️ Function to start/reset the 10-second timer
function startTimer() {
    // Stop any existing timer running in the background
    clearInterval(timerInterval);

    timeLeft = 10;
    timerElement.textContent = `Time Left: ${timeLeft}s`;

    // Run this function every 1000 milliseconds (1 second)
    timerInterval = setInterval(function() {
        timeLeft--;
        timerElement.textContent = `Time Left: ${timeLeft}s`;

        // When time runs out!
        if (timeLeft <= 0) {
            clearInterval(timerInterval); // Stop timer
            handleTimeout();
        }
    }, 1000);
}

// Function triggered when time reaches 0
function handleTimeout() {
    feedbackElement.textContent = `⏰ Time's up! Correct answer: ${quizData[currentQuestionIndex].correct}`;
    disableOptionButtons();
    advanceToNextQuestion();
}

// Disable all answer buttons so user can't click after time is up or after answering
function disableOptionButtons() {
    const buttons = optionsContainer.querySelectorAll('button');
    buttons.forEach(btn => btn.disabled = true);
}

// 4. Load & Display Question
function loadQuestion() {
    // Reset screen elements
    feedbackElement.textContent = "";
    restartContainer.innerHTML = ""; // Hide restart button while playing

    const currentQuiz = quizData[currentQuestionIndex];
    questionElement.textContent = currentQuiz.question;
    optionsContainer.innerHTML = "";

    // Render Answer Buttons
    currentQuiz.options.forEach(optionText => {
        const button = document.createElement('button');
        button.textContent = optionText;
        
        button.addEventListener('click', function() {
            checkAnswer(optionText);
        });

        optionsContainer.appendChild(button);
    });

    // Start the clock for this question
    startTimer();
}

// 5. Check User Answer
function checkAnswer(selectedOption) {
    // Immediately stop the clock when user answers
    clearInterval(timerInterval);
    disableOptionButtons();

    const currentQuiz = quizData[currentQuestionIndex];

    if (selectedOption === currentQuiz.correct) {
        score++;
        scoreElement.textContent = `Score: ${score}`;
        feedbackElement.textContent = "Correct! 🎉";
    } else {
        feedbackElement.textContent = `Wrong! Correct answer: ${currentQuiz.correct}`;
    }

    advanceToNextQuestion();
}

// Helper function to handle timing delay before moving to next question
function advanceToNextQuestion() {
    currentQuestionIndex++;

    setTimeout(function() {
        if (currentQuestionIndex < quizData.length) {
            loadQuestion();
        } else {
            showFinalResults();
        }
    }, 1500); // 1.5 second pause to view feedback
}

// 6. Show Final Results & Restart Button
function showFinalResults() {
    clearInterval(timerInterval); // Stop clock
    timerElement.textContent = ""; // Clear timer display
    
    questionElement.textContent = "Quiz Completed!";
    optionsContainer.innerHTML = "";
    feedbackElement.textContent = `Final Score: ${score} out of ${quizData.length}`;

    // 🔄 Create "Restart Quiz" button dynamically
    const restartBtn = document.createElement('button');
    restartBtn.textContent = "Restart Quiz 🔄";
    
    restartBtn.addEventListener('click', function() {
        // Reset state
        currentQuestionIndex = 0;
        score = 0;
        scoreElement.textContent = `Score: ${score}`;
        
        // Reload first question
        loadQuestion();
    });

    restartContainer.appendChild(restartBtn);
}

// Start Quiz on Page Load
loadQuestion();
