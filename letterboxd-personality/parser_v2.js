// CSV Parser for Letterboxd Data Export
// Parses Letterboxd's exported CSV files (ratings.csv, diary.csv, etc.)

class LetterboxdCSVParser {
    constructor() {
        this.films = [];
    }

    // Parse CSV file content
    parseCSV(csvContent) {
        this.films = [];

        // Remove BOM
        let content = csvContent;
        if (content.charCodeAt(0) === 0xFEFF) {
            content = content.slice(1);
        }

        const lines = content.split(/\r?\n/);
        if (lines.length < 2) {
            throw new Error('File is empty');
        }

        // Attempt to detect headers
        const headers = this.parseCSVLine(lines[0]);
        console.log('Headers:', headers);

        const cleanHeaders = headers.map(h => h.toLowerCase().trim());

        // Try to find indices dynamically
        let nameIdx = cleanHeaders.findIndex(h => h.includes('name') || h.includes('title'));
        let yearIdx = cleanHeaders.findIndex(h => h.includes('year'));
        let ratingIdx = cleanHeaders.findIndex(h => h.includes('rating'));

        // FALLBACK: If explicit columns from user (Name, Year, URI, Rating) are not found
        // We assume the structure: Name (0), Year (1), URI (2), Rating (3)
        // The user explicitly stated this structure.
        if (nameIdx === -1) {
            console.warn('Headers not detected. Using default indices: Name=0, Year=1, Rating=3');
            nameIdx = 0;
            yearIdx = 1;
            ratingIdx = 3;

            // If file only has 3 columns (Name, Year, Rating), then Rating might be 2
            if (headers.length === 3) ratingIdx = 2;
        }

        console.log(`Using Indices - Name: ${nameIdx}, Year: ${yearIdx}, Rating: ${ratingIdx}`);

        let parsedCount = 0;

        // Parse rows
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const values = this.parseCSVLine(line);

            // Skip if line doesn't have enough columns for the Name
            if (values.length <= nameIdx) continue;

            const title = values[nameIdx];

            // Year
            let year = 2020;
            if (yearIdx !== -1 && values[yearIdx]) {
                const y = parseInt(values[yearIdx]);
                if (!isNaN(y)) year = y;
            }

            // Rating
            let rating = 0;
            if (ratingIdx !== -1 && values[ratingIdx]) {
                const r = parseFloat(values[ratingIdx]);
                if (!isNaN(r)) rating = r;
            }

            // Infer Genres (since not in file)
            const genres = this.inferGenres(title);

            if (title) {
                this.films.push({
                    title,
                    year,
                    rating,
                    genres: genres.length > 0 ? genres : ['Drama', 'Unknown']
                });
                parsedCount++;
            }
        }

        console.log(`Parsed ${parsedCount} films.`);

        if (parsedCount === 0) {
            console.error("Parsed 0 films. First line was:", lines[1]);
            throw new Error(`Parsed 0 films. Headers detected: ${headers.join(', ')}`);
        }

        return this.films;
    }

    // Robust line parser handling quotes
    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current.trim());
        return result;
    }

    // Genre inference (same as before)
    inferGenres(title) {
        if (!title) return [];
        const titleLower = title.toLowerCase();
        const genres = [];

        const patterns = {
            'Science Fiction': ['star wars', 'star trek', 'blade runner', 'matrix', 'alien', 'terminator', 'interstellar', 'arrival', 'dune', 'inception'],
            'Horror': ['horror', 'nightmare', 'halloween', 'scream', 'conjuring', 'exorcist', 'saw', 'shining', 'thing', 'witch'],
            'Romance': ['love', 'heart', 'wedding', 'valentine', 'notebook', 'romantic', 'pride', 'sunrise', 'lalaland', 'titanic'],
            'Comedy': ['funny', 'laugh', 'comedy', 'trip', 'hangover', 'superbad', 'mean girls', 'barbie'],
            'Action': ['die hard', 'mission', 'john wick', 'mad max', 'furious', 'avengers', 'batman', 'dark knight', 'gladiator', 'top gun'],
            'Animation': ['toy story', 'spirited away', 'nemo', 'frozen', 'moana', 'shrek', 'spider-verse', 'ghibli', 'totoro', 'coco', 'inside out'],
            'War': ['war', 'soldier', 'battle', 'platoon', 'saving private', 'apocalypse', 'dunkirk', '1917'],
            'Western': ['western', 'cowboy', 'unforgiven', 'django', 'good bad ugly', 'no country'],
            'Crime': ['godfather', 'goodfellas', 'scarface', 'departed', 'pulp fiction', 'irishman', 'heat', 'casino', 'seven'],
            'Thriller': ['gone girl', 'silence', 'seven', 'zodiac', 'parasite', 'joker', 'shutter island', 'prisoners']
        };

        for (const [genre, keywords] of Object.entries(patterns)) {
            if (keywords.some(keyword => titleLower.includes(keyword))) {
                genres.push(genre);
            }
        }

        // Add known films check (abbreviated here for logic)
        if (genres.length === 0) {
            if (titleLower.includes('fight club')) return ['Drama', 'Thriller'];
            if (titleLower.includes('shawshank')) return ['Drama'];
        }

        return genres;
    }

    getFilms() { return this.films; }
    getUserData(username = 'CSV Export') { return { username, displayName: username, films: this.films }; }
}
