// Enhanced Letterboxd Data Fetcher with Real Profile Support
// Uses CORS proxy to fetch actual Letterboxd profiles

// Demo user data for testing
const demoUsers = {
    'cinephile123': {
        username: 'cinephile123',
        displayName: 'Alex Chen',
        films: [
            { title: 'Blade Runner 2049', year: 2017, rating: 5, genres: ['Science Fiction', 'Thriller'] },
            { title: 'Arrival', year: 2016, rating: 5, genres: ['Science Fiction', 'Drama'] },
            { title: 'Dune', year: 2021, rating: 4.5, genres: ['Science Fiction', 'Adventure'] },
            { title: 'Interstellar', year: 2014, rating: 5, genres: ['Science Fiction', 'Drama'] },
            { title: 'The Dark Knight', year: 2008, rating: 5, genres: ['Action', 'Crime', 'Thriller'] },
            { title: 'Inception', year: 2010, rating: 5, genres: ['Science Fiction', 'Thriller'] },
            { title: 'Prisoners', year: 2013, rating: 4.5, genres: ['Thriller', 'Crime', 'Mystery'] },
            { title: 'Sicario', year: 2015, rating: 4.5, genres: ['Thriller', 'Crime', 'Drama'] },
            { title: 'Memento', year: 2000, rating: 4.5, genres: ['Thriller', 'Mystery'] },
            { title: 'The Prestige', year: 2006, rating: 4.5, genres: ['Mystery', 'Thriller', 'Drama'] },
            { title: 'Shutter Island', year: 2010, rating: 4, genres: ['Thriller', 'Mystery'] },
            { title: 'Gone Girl', year: 2014, rating: 4.5, genres: ['Thriller', 'Mystery', 'Drama'] },
            { title: 'Zodiac', year: 2007, rating: 4, genres: ['Crime', 'Mystery', 'Thriller'] },
            { title: 'The Matrix', year: 1999, rating: 5, genres: ['Science Fiction', 'Action'] },
            { title: 'Ex Machina', year: 2014, rating: 4, genres: ['Science Fiction', 'Thriller'] }
        ]
    },
    'dreamweaver': {
        username: 'dreamweaver',
        displayName: 'Luna Martinez',
        films: [
            { title: 'Spirited Away', year: 2001, rating: 5, genres: ['Animation', 'Fantasy', 'Adventure'] },
            { title: 'Your Name', year: 2016, rating: 5, genres: ['Animation', 'Romance', 'Fantasy'] },
            { title: 'The Grand Budapest Hotel', year: 2014, rating: 4.5, genres: ['Comedy', 'Drama'] },
            { title: 'Amélie', year: 2001, rating: 5, genres: ['Romance', 'Comedy', 'Drama'] },
            { title: 'Eternal Sunshine', year: 2004, rating: 5, genres: ['Romance', 'Drama', 'Science Fiction'] },
            { title: 'La La Land', year: 2016, rating: 4, genres: ['Romance', 'Musical', 'Drama'] },
            { title: 'Call Me By Your Name', year: 2017, rating: 5, genres: ['Romance', 'Drama'] },
            { title: 'Portrait of a Lady on Fire', year: 2019, rating: 5, genres: ['Romance', 'Drama'] },
            { title: 'Moonrise Kingdom', year: 2012, rating: 4.5, genres: ['Adventure', 'Comedy', 'Romance'] },
            { title: 'The Shape of Water', year: 2017, rating: 4, genres: ['Fantasy', 'Romance', 'Drama'] },
            { title: 'Pan\'s Labyrinth', year: 2006, rating: 5, genres: ['Fantasy', 'Drama'] },
            { title: 'Howl\'s Moving Castle', year: 2004, rating: 5, genres: ['Animation', 'Fantasy', 'Adventure'] },
            { title: 'Coco', year: 2017, rating: 4.5, genres: ['Animation', 'Fantasy', 'Family'] },
            { title: 'Before Sunrise', year: 1995, rating: 4.5, genres: ['Romance', 'Drama'] },
            { title: 'Little Women', year: 2019, rating: 4.5, genres: ['Drama', 'Romance'] }
        ]
    },
    'actionjunkie': {
        username: 'actionjunkie',
        displayName: 'Marcus Steel',
        films: [
            { title: 'Mad Max: Fury Road', year: 2015, rating: 5, genres: ['Action', 'Adventure', 'Science Fiction'] },
            { title: 'John Wick', year: 2014, rating: 5, genres: ['Action', 'Thriller'] },
            { title: 'The Raid', year: 2011, rating: 5, genres: ['Action', 'Thriller'] },
            { title: 'Mission Impossible: Fallout', year: 2018, rating: 4.5, genres: ['Action', 'Thriller', 'Adventure'] },
            { title: 'Top Gun: Maverick', year: 2022, rating: 4.5, genres: ['Action', 'Drama'] },
            { title: 'Casino Royale', year: 2006, rating: 4.5, genres: ['Action', 'Thriller', 'Adventure'] },
            { title: 'Heat', year: 1995, rating: 5, genres: ['Crime', 'Action', 'Thriller'] },
            { title: 'Die Hard', year: 1988, rating: 4.5, genres: ['Action', 'Thriller'] },
            { title: 'The Dark Knight', year: 2008, rating: 5, genres: ['Action', 'Crime', 'Thriller'] },
            { title: 'Terminator 2', year: 1991, rating: 5, genres: ['Action', 'Science Fiction'] },
            { title: 'Edge of Tomorrow', year: 2014, rating: 4, genres: ['Action', 'Science Fiction'] },
            { title: 'The Matrix', year: 1999, rating: 5, genres: ['Science Fiction', 'Action'] },
            { title: 'Kill Bill', year: 2003, rating: 4.5, genres: ['Action', 'Thriller'] },
            { title: 'Skyfall', year: 2012, rating: 4, genres: ['Action', 'Thriller', 'Adventure'] },
            { title: 'Baby Driver', year: 2017, rating: 4.5, genres: ['Action', 'Crime', 'Thriller'] }
        ]
    }
};

// Common genre mappings from TMDb/Letterboxd genre names
const genreMapping = {
    'action': 'Action',
    'adventure': 'Adventure',
    'animation': 'Animation',
    'comedy': 'Comedy',
    'crime': 'Crime',
    'documentary': 'Documentary',
    'drama': 'Drama',
    'family': 'Family',
    'fantasy': 'Fantasy',
    'history': 'History',
    'horror': 'Horror',
    'music': 'Musical',
    'musical': 'Musical',
    'mystery': 'Mystery',
    'romance': 'Romance',
    'science-fiction': 'Science Fiction',
    'scifi': 'Science Fiction',
    'sci-fi': 'Science Fiction',
    'thriller': 'Thriller',
    'war': 'War',
    'western': 'Western',
    'biography': 'Biography',
    'biopic': 'Biography'
};

class LetterboxdScraper {
    constructor() {
        this.baseUrl = 'https://letterboxd.com';
        this.corsProxies = [
            'https://api.allorigins.win/raw?url=',
            'https://corsproxy.io/?',
            'https://api.codetabs.com/v1/proxy?quest='
        ];
        this.currentProxyIndex = 0;
    }

    // Main function to fetch user data
    async fetchUserData(username) {
        // Check if it's a demo user first
        if (demoUsers[username.toLowerCase()]) {
            return this.getDemoData(username.toLowerCase());
        }

        // Try to fetch real Letterboxd data
        try {
            console.log(`Fetching data for real user: ${username}`);
            const userData = await this.scrapeUserProfile(username);
            return userData;
        } catch (error) {
            console.error('Failed to fetch real data:', error);
            throw new Error(
                `Unable to fetch data for "${username}". This could be due to:\n` +
                `• Username doesn't exist\n` +
                `• CORS restrictions (try using a CORS browser extension)\n` +
                `• Network issues\n\n` +
                `Try one of the demo users: cinephile123, dreamweaver, actionjunkie`
            );
        }
    }

    // Get demo data
    getDemoData(username) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(demoUsers[username]);
            }, 1500);
        });
    }

    // Scrape user profile with CORS proxy
    async scrapeUserProfile(username) {
        // Try multiple endpoints to get film data
        const filmData = await this.fetchFilmsData(username);

        if (!filmData || filmData.length === 0) {
            throw new Error('No films found for this user');
        }

        // Enhance film data with genres
        const enhancedFilms = await this.enhanceFilmsWithGenres(filmData);

        return {
            username,
            displayName: username,
            films: enhancedFilms
        };
    }

    // Fetch films data from user's diary/films page
    async fetchFilmsData(username) {
        const films = [];

        // Try to fetch from the user's films page (rated films)
        try {
            const url = `${this.baseUrl}/${username}/films/by/member-rating/`;
            const html = await this.fetchWithProxy(url);

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Find film posters - Letterboxd uses poster-container class
            const filmElements = doc.querySelectorAll('li.poster-container');

            console.log(`Found ${filmElements.length} films`);

            filmElements.forEach((el, index) => {
                if (index >= 30) return; // Limit to 30 films for performance

                const filmData = el.querySelector('.film-poster');
                if (!filmData) return;

                const title = filmData.getAttribute('data-film-name') ||
                    filmData.getAttribute('alt') ||
                    el.querySelector('img')?.getAttribute('alt');
                const slug = filmData.getAttribute('data-film-slug');

                // Try to get rating from the element
                const ratingElement = el.querySelector('.rating');
                let rating = 0;
                if (ratingElement) {
                    const ratingClass = ratingElement.className;
                    // Letterboxd uses rated-X classes (rated-1 to rated-10 for 0.5 to 5 stars)
                    const match = ratingClass.match(/rated-(\d+)/);
                    if (match) {
                        rating = parseInt(match[1]) / 2; // Convert to 0-5 scale
                    }
                }

                if (title) {
                    films.push({
                        title,
                        slug,
                        rating,
                        year: 2020, // Will try to extract later
                        genres: [] // Will be populated
                    });
                }
            });

            return films;
        } catch (error) {
            console.error('Error fetching films:', error);
            throw error;
        }
    }

    // Fetch HTML via CORS proxy
    async fetchWithProxy(url) {
        const proxy = this.corsProxies[this.currentProxyIndex];
        const proxyUrl = proxy + encodeURIComponent(url);

        try {
            const response = await fetch(proxyUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'text/html'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            return await response.text();
        } catch (error) {
            // Try next proxy
            this.currentProxyIndex = (this.currentProxyIndex + 1) % this.corsProxies.length;
            if (this.currentProxyIndex === 0) {
                throw error; // Tried all proxies
            }
            return this.fetchWithProxy(url); // Retry with next proxy
        }
    }

    // Enhance films with genre information
    async enhanceFilmsWithGenres(films) {
        // Use TMDb API to get genre information (free, no key needed for search)
        // For simplicity, we'll assign common genres based on film patterns
        // In production, you'd fetch from TMDb or parse Letterboxd film pages

        return films.map(film => {
            // Assign default genres based on common patterns
            const genres = this.guessGenres(film.title);
            return {
                ...film,
                genres: genres.length > 0 ? genres : ['Drama'] // Default to Drama if unknown
            };
        });
    }

    // Simple genre guessing based on common film titles (fallback)
    guessGenres(title) {
        const titleLower = title.toLowerCase();
        const genres = [];

        // This is a simplified heuristic - in production, use proper API
        if (titleLower.includes('star wars') || titleLower.includes('trek') ||
            titleLower.includes('blade runner') || titleLower.includes('matrix')) {
            genres.push('Science Fiction', 'Action');
        } else if (titleLower.includes('love') || titleLower.includes('wedding')) {
            genres.push('Romance', 'Comedy');
        } else if (titleLower.includes('war') || titleLower.includes('soldier')) {
            genres.push('War', 'Action');
        } else if (titleLower.includes('horror') || titleLower.includes('night')) {
            genres.push('Horror', 'Thriller');
        } else {
            // Try to get from a small database of popular films
            const knownGenres = this.getKnownFilmGenres(title);
            if (knownGenres.length > 0) {
                genres.push(...knownGenres);
            }
        }

        return genres;
    }

    // Small database of popular films and their genres
    getKnownFilmGenres(title) {
        const knownFilms = {
            'The Godfather': ['Crime', 'Drama'],
            'Pulp Fiction': ['Crime', 'Drama'],
            'The Dark Knight': ['Action', 'Crime', 'Thriller'],
            'Inception': ['Science Fiction', 'Thriller'],
            'Forrest Gump': ['Drama', 'Romance'],
            'The Matrix': ['Science Fiction', 'Action'],
            'Goodfellas': ['Crime', 'Drama'],
            'Fight Club': ['Drama', 'Thriller'],
            'Parasite': ['Drama', 'Thriller'],
            'Interstellar': ['Science Fiction', 'Drama'],
            'Spirited Away': ['Animation', 'Fantasy'],
            'Whiplash': ['Drama', 'Musical'],
            'The Prestige': ['Mystery', 'Thriller', 'Drama'],
            'Memento': ['Thriller', 'Mystery'],
            'Mad Max: Fury Road': ['Action', 'Adventure', 'Science Fiction'],
            'John Wick': ['Action', 'Thriller'],
            'Arrival': ['Science Fiction', 'Drama'],
            'Dune': ['Science Fiction', 'Adventure']
        };

        return knownFilms[title] || [];
    }

    // Get available demo users
    static getDemoUsers() {
        return Object.keys(demoUsers);
    }

    // Check if username is a demo user
    static isDemoUser(username) {
        return demoUsers.hasOwnProperty(username.toLowerCase());
    }
}
