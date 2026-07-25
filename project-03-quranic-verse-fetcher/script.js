// 1. DOM Elements
const fetchBtn = document.getElementById("fetch-btn");
const surahSelect = document.getElementById("surah-select");
const statusMsg = document.getElementById("status-msg");
const surahContainer = document.getElementById("surah-container");
const surahTitle = document.getElementById("surah-title");

// Standard Bismillah string used by Uthmani text
const BISMILLAH = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ";

// 2. Step A: Populate all 114 Surahs into dropdown
async function populateSurahList() {
    try {
        const response = await fetch("https://api.alquran.cloud/v1/surah");
        const json = await response.json();
        
        surahSelect.innerHTML = "";

        json.data.forEach((surah) => {
            const option = document.createElement("option");
            option.value = surah.number;
            option.textContent = `${surah.number}. ${surah.englishName} (${surah.name})`;
            surahSelect.appendChild(option);
        });

        // Load Surah #1 on initial startup
        getFullSurah();

    } catch (error) {
        statusMsg.textContent = "Failed to load Surah list. Please refresh.";
        console.error("Error loading Surah list:", error);
    }
}

// 3. Step B: Fetch and display the chosen Surah
async function getFullSurah() {
    const surahNum = surahSelect.value;
    
    if (!surahNum) return;

    const API_URL = `https://api.alquran.cloud/v1/surah/${surahNum}/editions/quran-uthmani,en.asad,bn.bengali`;

    fetchBtn.disabled = true;
    statusMsg.textContent = "Loading verses...";
    statusMsg.classList.remove("error");
    surahContainer.innerHTML = "";

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const json = await response.json();

        // Extract raw arrays from API response
        const arabicAyahs = json.data[0].ayahs;
        const englishAyahs = json.data[1].ayahs;
        const bengaliAyahs = json.data[2].ayahs;

        // --- SAFE DATA MATCHING ---
        // Create lookup maps indexed by verse number instead of relying on array index
        const englishMap = {};
        englishAyahs.forEach(item => {
            englishMap[item.numberInSurah] = item.text;
        });

        const bengaliMap = {};
        bengaliAyahs.forEach(item => {
            bengaliMap[item.numberInSurah] = item.text;
        });

        // Update Title Header
        surahTitle.textContent = `Surah ${json.data[0].englishName} (${json.data[0].numberOfAyahs} Verses)`;

        // Show standalone Bismillah header for all Surahs except Surah 9 (At-Tawbah) and Surah 1
        if (surahNum !== "1" && surahNum !== "9") {
            const bismillahHeader = document.createElement("div");
            bismillahHeader.style.textAlign = "center";
            bismillahHeader.style.margin = "1rem 0 1.5rem 0";
            bismillahHeader.innerHTML = `<p class="arabic" dir="rtl" style="text-align: center; font-size: 2rem;">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>`;
            surahContainer.appendChild(bismillahHeader);
        }

        // Loop through the Arabic verses
        arabicAyahs.forEach((arabicItem) => {
            const verseNum = arabicItem.numberInSurah;
            let verseText = arabicItem.text;

            // Strip prepended Bismillah from Ayah 1 text for Surahs 2..114 (excluding 9)
            if (verseNum === 1 && surahNum !== "1" && surahNum !== "9") {
                if (verseText.startsWith(BISMILLAH)) {
                    verseText = verseText.replace(BISMILLAH, "");
                }
            }

            // Look up translations by explicit verse ID key with fallbacks
            const bengaliText = bengaliMap[verseNum] || "[বাংলা অনুবাদ পাওয়া যায়নি]";
            const englishText = englishMap[verseNum] || "[English Translation Missing]";

            const ayahCard = document.createElement("div");
            ayahCard.className = "ayah-card";

            ayahCard.innerHTML = `
                <span class="ayah-num">${verseNum}</span>
                <p class="arabic" dir="rtl">${verseText}</p>
                <p class="bengali">${bengaliText}</p>
                <p class="english">${englishText}</p>
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
surahSelect.addEventListener("change", getFullSurah);

// 5. Start App
populateSurahList();
