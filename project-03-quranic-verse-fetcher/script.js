// 1. DOM Elements
const fetchBtn = document.getElementById("fetch-btn");
const surahSelect = document.getElementById("surah-select");
const statusMsg = document.getElementById("status-msg");
const surahContainer = document.getElementById("surah-container");
const surahTitle = document.getElementById("surah-title");

// 2. Step A: Populate all 114 Surahs into the dropdown menu
async function populateSurahList() {
    try {
        const response = await fetch("https://api.alquran.cloud/v1/surah");
        const json = await response.json();
        
        // Clear select element
        surahSelect.innerHTML = "";

        // Loop through all 114 Surahs and create <option> tags
        json.data.forEach((surah) => {
            const option = document.createElement("option");
            option.value = surah.number; // e.g., 1, 2, ..., 114
            option.textContent = `${surah.number}. ${surah.englishName} (${surah.name})`;
            surahSelect.appendChild(option);
        });

        // Load Surah #1 by default once dropdown is ready
        getFullSurah();

    } catch (error) {
        statusMsg.textContent = "Failed to load Surah list. Please refresh.";
        console.error("Error loading Surah list:", error);
    }
}

// 3. Step B: Fetch the selected Surah's verses
async function getFullSurah() {
    const surahNum = surahSelect.value;
    
    // Guard clause if dropdown isn't ready yet
    if (!surahNum) return;

    const API_URL = `https://api.alquran.cloud/v1/surah/${surahNum}/editions/quran-uthmani,en.asad,bn.bengali`;

    fetchBtn.disabled = true;
    statusMsg.textContent = "Loading verses...";
    statusMsg.classList.remove("error");
    surahContainer.innerHTML = ""; // Clear existing verses

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const json = await response.json();

        // Arrays for Arabic, English, Bengali
        const arabicAyahs = json.data[0].ayahs;
        const englishAyahs = json.data[1].ayahs;
        const bengaliAyahs = json.data[2].ayahs;

        // Update Header Title
        surahTitle.textContent = `Surah ${json.data[0].englishName} (${json.data[0].numberOfAyahs} Verses)`;

        // Render each Ayah
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
        statusMsg.textContent = "Unable to load verses. Check connection.";
        statusMsg.classList.add("error");
        console.error("Error fetching verses:", error.message);

    } finally {
        fetchBtn.disabled = false;
    }
}

// 4. Event Listeners
fetchBtn.addEventListener("click", getFullSurah);
surahSelect.addEventListener("change", getFullSurah); // Loads immediately on dropdown selection change!

// 5. Initialize
populateSurahList();
