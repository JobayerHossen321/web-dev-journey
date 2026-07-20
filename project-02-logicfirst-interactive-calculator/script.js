// 1. Grab DOM Elements
const display = document.getElementById('display');
const buttonsContainer = document.getElementById('buttons-container');

// 2. State Variable to hold the expression string
let currentExpression = "";

// 3. Event Delegation: Listen for clicks anywhere on the button container
buttonsContainer.addEventListener('click', function(event) {
    // Only respond if the clicked element is a button
    if (!event.target.matches('button')) return;

    const buttonValue = event.target.textContent;

    // Handle CLEAR ('C')
    if (buttonValue === 'C') {
        clearCalculator();
    } 
    // Handle EVALUATE ('=')
    else if (buttonValue === '=') {
        calculateResult();
    } 
    // Handle NUMBERS, OPERATORS, & DECIMAL
    else {
        appendValue(buttonValue);
    }
});

// Function to append characters to our screen
function appendValue(value) {
    // If the display currently shows just '0' and we press a number, replace the '0'
    if (currentExpression === "" && value !== ".") {
        currentExpression = value;
    } else {
        currentExpression += value;
    }
    
    updateDisplay();
}

// Function to clear everything
function clearCalculator() {
    currentExpression = "";
    display.value = "0";
}

// Function to calculate the math result safely
function calculateResult() {
    if (currentExpression === "") return;

    try {
        // Function() constructor is a safer way to evaluate simple math strings than raw eval()
        const result = new Function(`return ${currentExpression}`)();
        
        // Handle division by zero or invalid calculations
        if (!isFinite(result)) {
            display.value = "Error";
            currentExpression = "";
        } else {
            // Update expression and screen with result (rounded to max 4 decimal places if needed)
            currentExpression = String(Math.round(result * 10000) / 10000);
            updateDisplay();
        }
    } catch (error) {
        display.value = "Error";
        currentExpression = "";
    }
}

// Helper to refresh screen input value
function updateDisplay() {
    display.value = currentExpression || "0";
}
