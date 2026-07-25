// 1. Select DOM elements
const fetchBtn = document.getElementById("fetch-btn");
const statusMsg = document.getElementById("status-msg");
const ayahContainer = document.getElementById("ayah-container");
const arabicText = document.getElementById("arabic-text");
const englishText = document.getElementById("english-text");
const reference = document.getElementById("reference");

const API_URL = "https://api.alquran.cloud/v1/ayah/random/editions/quran-uthmani,en.asad";

// 2. Main fetch function
async function getRandomAyah() {
    // --- UI State: Loading Phase ---
    fetchBtn.disabled = true;               // Prevent double clicks
    statusMsg.textContent = "Loading Ayah...";
    statusMsg.classList.remove("error");
    ayahContainer.classList.add("hidden");   // Hide previous content

    try {
        const response = await fetch(API_URL);

        // Check if the HTTP request was successful
        if (!response.ok) {
            throw new Error(`Failed to fetch data (Status: ${response.status})`);
        }

        const json = await response.json();
        
        // Extract array items from response
        const arabicData = json.data[0];
        const englishData = json.data[1];

        // --- UI State: Success Phase ---
        arabicText.textContent = arabicData.text;
        englishText.textContent = englishData.text;
        reference.textContent = `— Surah ${arabicData.surah.englishName} (${arabicData.surah.number}:${arabicData.numberInSurah})`;

        // Reset status message & reveal content
        statusMsg.textContent = "";
        ayahContainer.classList.remove("hidden");

    } catch (error) {
        // --- UI State: Error Phase ---
        statusMsg.textContent = "Unable to load Ayah. Please check your internet connection.";
        statusMsg.classList.add("error");
        console.error("Fetch Error:", error.message);

    } finally {
        // Re-enable button whether request succeeded or failed
        fetchBtn.disabled = false;
    }
}

// 3. Attach Event Listener
fetchBtn.addEventListener("click", getRandomAyah);

// Optional: Automatically fetch one Ayah when page loads initially
getRandomAyah();
