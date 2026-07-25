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

        // Variables declared INSIDE function scope
        const arabicAyahs = json.data[0].ayahs;
        const englishAyahs = json.data[1].ayahs;
        const bengaliAyahs = json.data[2].ayahs;

        surahTitle.textContent = `Surah ${json.data[0].englishName} (${json.data[0].numberOfAyahs} Verses)`;

        // Show a standalone Bismillah header for all Surahs except Surah 9 (At-Tawbah) and Surah 1 (where Bismillah IS Ayah 1)
        if (surahNum !== "1" && surahNum !== "9") {
            const bismillahHeader = document.createElement("div");
            bismillahHeader.style.textAlign = "center";
            bismillahHeader.style.margin = "1rem 0 1.5rem 0";
            bismillahHeader.innerHTML = `<p class="arabic" dir="rtl" style="text-align: center; font-size: 2rem;">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>`;
            surahContainer.appendChild(bismillahHeader);
        }

        // Loop through the ayahs
        arabicAyahs.forEach((arabicItem, index) => {
            let verseText = arabicItem.text;

            // Strip prepended Bismillah from Ayah 1 text for Surahs 2..114 (excluding 9)
            if (arabicItem.numberInSurah === 1 && surahNum !== "1" && surahNum !== "9") {
                if (verseText.startsWith(BISMILLAH)) {
                    verseText = verseText.replace(BISMILLAH, "");
                }
            }

            const ayahCard = document.createElement("div");
            ayahCard.className = "ayah-card";

            ayahCard.innerHTML = `
                <span class="ayah-num">${arabicItem.numberInSurah}</span>
                <p class="arabic" dir="rtl">${verseText}</p>
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
surahSelect.addEventListener("change", getFullSurah);

// 5. Start App
populateSurahList();
