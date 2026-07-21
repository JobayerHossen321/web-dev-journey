// 1. Define the checkAge function that returns a Promise
function checkAge(age) {
    return new Promise((resolve, reject) => {
        // Simulate a 1-second delay (1000ms)
        setTimeout(() => {
            if (age >= 18) {
                resolve("Access granted");
            } else {
                reject("Access denied - too young");
            }
        }, 1000);
    });
}

// ==========================================
// 2. Testing the Promise (Success Case)
// ==========================================
checkAge(20)
    .then((message) => {
        console.log("Success:", message);
    })
    .catch((error) => {
        console.error("Error:", error);
    });

// ==========================================
// 3. Testing the Promise (Failure Case)
// ==========================================
checkAge(15)
    .then((message) => {
        console.log("Success:", message);
    })
    .catch((error) => {
        console.error("Error:", error);
    });
