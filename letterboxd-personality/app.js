// Main Application Logic
// All dependencies loaded via script tags in index.html

class LetterboxdPersonalityApp {
    constructor() {
        this.scraper = new LetterboxdScraper();
        this.currentResult = null;
        this.init();
    }

    init() {
        // DOM elements
        this.loadingSection = document.getElementById('loading');
        this.resultsSection = document.getElementById('results');
        this.errorSection = document.getElementById('error');
        this.demoUsersContainer = document.getElementById('demo-users');

        // Initialize advanced inputs
        this.advancedCsvInput = document.getElementById('advanced-csv-input');
        this.advancedUploadBtn = document.getElementById('advanced-upload-btn');

        if (this.advancedUploadBtn && this.advancedCsvInput) {
            this.advancedUploadBtn.addEventListener('click', () => this.advancedCsvInput.click());
            this.advancedCsvInput.addEventListener('change', (e) => this.handleAdvancedUpload(e));
        }

        // Show demo users on load
        this.displayDemoUsersList();
    }

    async handleFileUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        try {
            this.showLoading();
            this.hideError();
            this.hideResults();

            const text = await file.text();

            // Parse CSV
            const parser = new LetterboxdCSVParser();
            const films = parser.parseCSV(text);

            if (films.length === 0) {
                this.showError('No valid films found in the CSV file. Please check the format.');
                this.hideLoading();
                return;
            }

            // Create user data structure
            const userData = parser.getUserData('CSV Export');

            // Analyze directly
            this.processAnalysis(userData);

        } catch (error) {
            console.error('CSV processing error:', error);
            this.showError('Failed to process CSV file. Please ensure it is a valid Letterboxd export.');
            this.hideLoading();
        } finally {
            // Reset input
            this.csvInput.value = '';
        }
    }

    // Unified analysis processing for both scraped data and CSV data
    processAnalysis(userData) {
        try {
            if (!userData || !userData.films || userData.films.length === 0) {
                this.showError('No film data found.');
                this.hideLoading();
                return;
            }

            console.log(`Analyzing ${userData.films.length} films for ${userData.username}`);

            // Analyze genres
            const analysis = analyzeUserGenres(userData.films);

            if (!analysis || !analysis.topGenres || analysis.topGenres.length === 0) {
                this.showError('Unable to analyze genres. Not enough data.');
                this.hideLoading();
                return;
            }

            // Get personality type
            const personalityType = getPersonalityType(analysis.topGenres);

            // Store result
            this.currentResult = {
                username: userData.displayName || userData.username,
                personalityType,
                topGenres: analysis.topGenres,
                stats: analysis.stats,
                allGenres: analysis.allGenres
            };

            // Display results
            this.displayResults();

        } catch (error) {
            console.error('Processing error:', error);
            this.showError(error.message || 'Failed to analyze data.');
        } finally {
            this.hideLoading();
        }
    }

    async analyzeUser(username) {
        try {
            // Show loading state
            this.showLoading();
            this.hideError();
            this.hideResults();

            // Try fetching from local Python server API first
            console.log(`Fetching from local API for ${username}...`);
            try {
                const response = await fetch(`/api/user?username=${username}`);
                if (response.ok) {
                    const userData = await response.json();

                    // The server returns films without genres, so we need to infer them
                    // We can reuse the CSV parser's logic for this!
                    const parser = new LetterboxdCSVParser();

                    userData.films = userData.films.map(film => ({
                        ...film,
                        genres: parser.inferGenres(film.title)
                    }));

                    console.log('Successfully fetched from local API');
                    this.processAnalysis(userData);
                    return;
                }
            } catch (err) {
                console.warn('Local API failed or not running, falling back to client scraper', err);
            }

            // Fallback: Use client-side scraper (Demo mode, or CORS proxy if configured)
            // Fetch user data
            const userData = await this.scraper.fetchUserData(username);

            // Process the fetched data
            this.processAnalysis(userData);

        } catch (error) {
            console.error('Analysis error:', error);
            this.showError(error.message || 'Failed to analyze profile. Try demo mode!');
            this.hideLoading();
        }
    }

    displayResults() {
        const { username, personalityType, topGenres, stats, actualMBTI } = this.currentResult;

        // Update personality card
        document.getElementById('personality-icon').textContent = personalityType.icon;
        document.getElementById('personality-name').textContent = personalityType.name;
        document.getElementById('personality-mbti').textContent = `MBTI: ${personalityType.mbti}`;
        document.getElementById('personality-tagline').textContent = personalityType.tagline;
        document.getElementById('personality-description').textContent = personalityType.description;
        document.getElementById('personality-quote').textContent = `"${personalityType.famousCritics}"`;

        // Update traits
        const traitsContainer = document.getElementById('personality-traits');
        traitsContainer.innerHTML = personalityType.traits
            .map(trait => `<span class="trait-badge">${trait}</span>`)
            .join('');

        // MBTI Comparison Logic
        const compCard = document.getElementById('mbti-comparison-card');
        if (actualMBTI) {
            compCard.classList.remove('hidden');
            document.getElementById('real-mbti-display').textContent = actualMBTI;
            document.getElementById('movie-mbti-display').textContent = personalityType.mbti;

            const resultText = document.getElementById('comparison-result');
            if (actualMBTI === personalityType.mbti) {
                resultText.textContent = "✨ Incredible! Your film taste perfectly aligns with your personality.";
                resultText.style.color = "#4ade80"; // Green
            } else {
                resultText.textContent = `Interesting contrast! You are an ${actualMBTI}, but your film taste is ${personalityType.mbti}.`;
                resultText.style.color = "#e6e6e6"; // Gray
            }
        } else {
            compCard.classList.add('hidden');
        }

        // Update top genres (Limit to Top 5)
        const genresContainer = document.getElementById('top-genres');
        genresContainer.innerHTML = topGenres.slice(0, 5)
            .map((g, i) => `
        <div class="genre-item">
          <div class="genre-rank">#${i + 1}</div>
          <div class="genre-info">
            <div class="genre-name">${g.genre}</div>
            <div class="genre-bar">
              <div class="genre-bar-fill" style="width: ${g.percentage}%; background: ${this.getGenreColor(i)}"></div>
            </div>
          </div>
          <div class="genre-percentage">${g.percentage}%</div>
        </div>
      `)
            .join('');

        // --- NEW STATS LOGIC ---

        // 1. Top Genre Weights
        const weightList = document.getElementById('top-genre-weights');
        weightList.innerHTML = topGenres.slice(0, 3).map(g => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span style="color: #ddd;">${g.genre}</span>
                <span style="color: var(--primary-color); font-weight: bold;">${g.score.toFixed(1)}</span>
            </div>
        `).join('');

        // 2. Personality Match Scores
        const matches = this.calculatePersonalityMatches(topGenres);
        const scoreList = document.getElementById('top-personality-scores');
        scoreList.innerHTML = matches.slice(0, 3).map(m => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span style="color: #ddd;">${m.mbti}</span>
                <span style="color: var(--secondary-color); font-weight: bold;">${m.score.toFixed(1)}</span>
            </div>
        `).join('');

        // Update basic stats
        document.getElementById('stat-films').textContent = stats.totalFilms;
        document.getElementById('stat-genres').textContent = stats.uniqueGenres;

        // Update username display
        document.getElementById('result-username').textContent = username;

        // Apply personality color theme
        document.documentElement.style.setProperty('--personality-color', personalityType.color);

        this.showResults();
    }

    calculatePersonalityMatches(weightedGenres) {
        // Map MBTI types to scores based on user's genre weights
        const scores = {};

        // Initialize
        Object.values(personalityTypes).forEach(type => {
            scores[type.mbti] = 0;
        });

        // Calculate
        weightedGenres.forEach(g => {
            const genreName = g.genre;
            const genreScore = g.score;

            Object.values(personalityTypes).forEach(type => {
                if (type.primaryGenres.includes(genreName)) {
                    scores[type.mbti] += genreScore * 1.0;
                } else if (type.secondaryGenres.includes(genreName)) {
                    scores[type.mbti] += genreScore * 0.5;
                }
            });
        });

        // Convert to array and sort
        return Object.keys(scores)
            .map(mbti => ({ mbti, score: scores[mbti] }))
            .sort((a, b) => b.score - a.score);
    }

    getGenreColor(index) {
        const colors = ['#8B5CF6', '#EC4899', '#F59E0B'];
        return colors[index] || '#6366F1';
    }

    displayDemoUsersList() {
        const demoUsernames = Object.keys(demoUsers);
        this.demoUsersContainer.innerHTML = `
      <div class="demo-users-list">
        <p class="demo-intro">Try these demo profiles:</p>
        ${demoUsernames.map(username => `
          <button class="demo-user-btn" data-username="${username}">
            ${username}
          </button>
        `).join('')}
      </div>
    `;

        // Add click handlers to demo user buttons
        this.demoUsersContainer.querySelectorAll('.demo-user-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const username = btn.getAttribute('data-username');
                this.usernameInput.value = username;
                this.analyzeUser(username);
            });
        });
    }

    async handleAdvancedUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        try {
            this.showLoading();
            this.hideError();
            this.hideResults();

            // 1. Get Top 4 Inputs
            const top4 = [
                document.getElementById('top4-1').value,
                document.getElementById('top4-2').value,
                document.getElementById('top4-3').value,
                document.getElementById('top4-4').value
            ].filter(t => t.trim() !== '');

            const userMBTI = document.getElementById('user-mbti-select').value;

            // 2. Parse CSV
            const text = await file.text();
            const parser = new LetterboxdCSVParser();
            parser.parseCSV(text);

            if (parser.films.length === 0) {
                throw new Error('No valid films found in CSV');
            }

            // 3. Batch Scraping (Chunked process to avoid timeout)
            const allFilms = parser.films;
            const BATCH_SIZE = 5;
            let enrichedFilms = [];

            // Update loading text to show progress
            const loadingText = this.loadingSection.querySelector('p') || this.loadingSection;
            const originalText = loadingText.textContent;

            console.log(`Starting batch processing for ${allFilms.length} films...`);

            for (let i = 0; i < allFilms.length; i += BATCH_SIZE) {
                const chunk = allFilms.slice(i, i + BATCH_SIZE);

                // Update UI
                const current = Math.min(i + BATCH_SIZE, allFilms.length);
                const percent = Math.round((current / allFilms.length) * 100);
                loadingText.textContent = `Scraping deeply... ${percent}% (${current}/${allFilms.length})`;

                try {
                    const response = await fetch('/api/scrape-batch', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ films: chunk })
                    });

                    if (!response.ok) throw new Error(`Batch ${i} failed`);
                    const batchResult = await response.json();
                    enrichedFilms = enrichedFilms.concat(batchResult);

                } catch (err) {
                    console.error("Batch error", err);
                    // On error, just use original chunks without enrichment so we don't lose data
                    enrichedFilms = enrichedFilms.concat(chunk);
                }
            }

            loadingText.textContent = "Finalizing Scores...";

            // 4. Send to Backend for Final Scoring (Fast)
            console.log("Sending to Advanced API for scoring...");

            const response = await fetch('/api/advanced-analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    films: enrichedFilms,
                    top4: top4
                })
            });

            if (!response.ok) throw new Error("Analysis Scoring Failed");

            const enrichedData = await response.json();

            // 5. Map to Personality Type
            // Use weighted scoring algorithm to determine best fit
            const matches = this.calculatePersonalityMatches(enrichedData.topGenres);
            const bestMatchMBTI = matches[0].mbti;
            const personalityType = personalityTypes[bestMatchMBTI];

            console.log(`Best Personality Match: ${bestMatchMBTI} (Score: ${matches[0].score.toFixed(1)})`);

            this.currentResult = {
                username: "Advanced Analysis",
                personalityType,
                topGenres: enrichedData.topGenres,
                stats: enrichedData.stats,
                allGenres: enrichedData.raw,
                actualMBTI: userMBTI // Pass actual MBTI for comparison
            };

            // Reset text
            loadingText.textContent = originalText;
            this.displayResults();

        } catch (error) {
            console.error('Advanced Error:', error);
            this.showError('Advanced Analysis Failed: ' + error.message);
        } finally {
            this.hideLoading();
        }
    }

    showDemoUsers() {
        const demoUsernames = Object.keys(demoUsers);
        const randomUser = demoUsernames[Math.floor(Math.random() * demoUsernames.length)];
        this.usernameInput.value = randomUser;
        this.analyzeUser(randomUser);
    }

    showLoading() {
        this.loadingSection.classList.remove('hidden');
    }

    hideLoading() {
        this.loadingSection.classList.add('hidden');
    }

    showResults() {
        this.resultsSection.classList.remove('hidden');
        // Smooth scroll to results
        setTimeout(() => {
            this.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }

    hideResults() {
        this.resultsSection.classList.add('hidden');
    }

    showError(message) {
        this.errorSection.textContent = message;
        this.errorSection.classList.remove('hidden');
    }

    hideError() {
        this.errorSection.classList.add('hidden');
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LetterboxdPersonalityApp();
});
