// 1. Select DOM elements
const fetchBtn = document.getElementById("fetch-btn");
const statusMsg = document.getElementById("status-msg");
const ayahContainer = document.getElementById("ayah-container");

const arabicText = document.getElementById("arabic-text");
const bengaliText = document.getElementById("bengali-text");
const englishText = document.getElementById("english-text");
const reference = document.getElementById("reference");

// 2. Endpoint with 3 requested editions: Arabic, English, Bengali
const API_URL = "https://api.alquran.cloud/v1/ayah/random/editions/quran-uthmani,en.asad,bn.bengali";

// 3. Main fetch function
async function getRandomAyah() {
    // --- UI State: Loading Phase ---
    fetchBtn.disabled = true;
    statusMsg.textContent = "Loading Ayah...";
    statusMsg.classList.remove("error");
    ayahContainer.classList.add("hidden");

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Failed to fetch data (Status: ${response.status})`);
        }

        const json = await response.json();
        
        // --- Index mapping according to URL request order ---
        const arabicData = json.data[0];  // quran-uthmani
        const englishData = json.data[1]; // en.asad
        const bengaliData = json.data[2]; // bn.bengali

        // --- UI State: Render Data ---
        arabicText.textContent = arabicData.text;
        bengaliText.textContent = bengaliData.text;
        englishText.textContent = englishData.text;
        
        // Surah details retrieved from the Arabic object metadata
        reference.textContent = `— Surah ${arabicData.surah.englishName} (${arabicData.surah.number}:${arabicData.numberInSurah})`;

        // Clear loading text & unhide container
        statusMsg.textContent = "";
        ayahContainer.classList.remove("hidden");

    } catch (error) {
        // --- UI State: Error Handling ---
        statusMsg.textContent = "Unable to load Ayah. Please check your internet connection.";
        statusMsg.classList.add("error");
        console.error("Fetch Error:", error.message);

    } finally {
        // Always re-enable button whether fetch succeeded or failed
        fetchBtn.disabled = false;
    }
}

// 4. Attach Click Event
fetchBtn.addEventListener("click", getRandomAyah);

// 5. Initial fetch when the page loads
getRandomAyah();
