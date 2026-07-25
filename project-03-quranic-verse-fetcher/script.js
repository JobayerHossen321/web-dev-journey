// 1. Select DOM elements
const fetchBtn = document.getElementById("fetch-btn");
const surahSelect = document.getElementById("surah-select");
const statusMsg = document.getElementById("status-msg");
const surahContainer = document.getElementById("surah-container");
const surahTitle = document.getElementById("surah-title");

// 2. Populate Dropdown with all 114 Surahs
async function populateSurahList() {
    try {
        const response = await fetch("https://api.alquran.cloud/v1/surah");
        const json = await response.json();
        
        // Clear hardcoded static options
        surahSelect.innerHTML = "";

        // Add options 1 through 114 dynamically
        json.data.forEach((surah) => {
            const option = document.createElement("option");
            option.value = surah.number;
            option.textContent = `${surah.number}. ${surah.englishName} (${surah.name})`;
            surahSelect.appendChild(option);
        });

        // Load the first Surah once dropdown is populated
        getFullSurah();

    } catch (error) {
        console.error("Could not load Surah list:", error);
    }
}

// 3. Fetch Selected Surah
async function getFullSurah() {
    const surahNum = surahSelect.value;
    
    // Safety check in case the list hasn't loaded yet
    if (!surahNum) return;

    const API_URL = `https://api.alquran.cloud/v1/surah/${surahNum}/editions/quran-uthmani,en.asad,bn.bengali`;

    fetchBtn.disabled = true;
    statusMsg.textContent = "Loading full Surah...";
    statusMsg.classList.remove("error");
    surahContainer.innerHTML = "";

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const json = await response.json();

        const arabicAyahs = json.data[0].ayahs;
        const englishAyahs = json.data[1].ayahs;
        const bengaliAyahs = json.data[2].ayahs;

        surahTitle.textContent = `Surah ${json.data[0].englishName} (${json.data[0].numberOfAyahs} Verses)`;

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

// 4. Event Listeners
fetchBtn.addEventListener("click", getFullSurah);
surahSelect.addEventListener("change", getFullSurah); // Auto-load on dropdown selection change!

// 5. Initialize Page
populateSurahList();
