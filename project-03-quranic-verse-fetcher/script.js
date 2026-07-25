// 1. Select DOM elements
const fetchBtn = document.getElementById("fetch-btn");
const surahSelect = document.getElementById("surah-select");
const statusMsg = document.getElementById("status-msg");
const surahContainer = document.getElementById("surah-container");
const surahTitle = document.getElementById("surah-title");

// 2. Main function to fetch a FULL Surah
async function getFullSurah() {
    const surahNum = surahSelect.value;
    const API_URL = `https://api.alquran.cloud/v1/surah/${surahNum}/editions/quran-uthmani,en.asad,bn.bengali`;

    // --- Loading State ---
    fetchBtn.disabled = true;
    statusMsg.textContent = "Loading full Surah...";
    statusMsg.classList.remove("error");
    surahContainer.innerHTML = ""; // Clear previous verses

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const json = await response.json();

        // Extract edition arrays
        const arabicAyahs = json.data[0].ayahs;  // Array of all Arabic verses
        const englishAyahs = json.data[1].ayahs; // Array of all English verses
        const bengaliAyahs = json.data[2].ayahs; // Array of all Bengali verses

        // Update Title
        const surahName = json.data[0].englishName;
        surahTitle.textContent = `Surah ${surahName} (${json.data[0].numberOfAyahs} Verses)`;

        // --- Loop through each Ayah and build HTML ---
        arabicAyahs.forEach((arabicItem, index) => {
            const ayahCard = document.createElement("div");
            ayahCard.className = "ayah-card";

            ayahCard.innerHTML = `
                <span class="ayah-num">${arabicItem.numberInSurah}</span>
                <p class="arabic" dir="rtl">${arabicItem.text}</p>
                <p class="bengali">${bengaliAyahs[index].text}</p>
                <p class="english">${englishAyahs[index].text}</p>
            `;

            surahContainer.appendChild(ayahCard);
        });

        statusMsg.textContent = "";

    } catch (error) {
        statusMsg.textContent = "Failed to load Surah. Please try again.";
        statusMsg.classList.add("error");
        console.error("Error fetching Surah:", error.message);

    } finally {
        fetchBtn.disabled = false;
    }
}

// Attach Event Listeners
fetchBtn.addEventListener("click", getFullSurah);

// Automatically load default selected Surah on startup
getFullSurah();
