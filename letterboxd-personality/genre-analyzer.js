// Genre Analysis Module
// Analyzes user's film data and extracts top genres

class GenreAnalyzer {
    constructor(filmData) {
        this.filmData = filmData;
        this.genreMap = new Map();
    }

    // Normalize genre names to match our personality type mappings
    normalizeGenre(genre) {
        const genreMapping = {
            'sci-fi': 'Science Fiction',
            'scifi': 'Science Fiction',
            'science-fiction': 'Science Fiction',
            'rom-com': 'Romance',
            'historical': 'History',
            'documentary': 'Documentary',
            'docs': 'Documentary',
            'animation': 'Animation',
            'animated': 'Animation',
            'thriller': 'Thriller',
            'suspense': 'Thriller',
            'action': 'Action',
            'horror': 'Horror',
            'comedy': 'Comedy',
            'drama': 'Drama',
            'romance': 'Romance',
            'fantasy': 'Fantasy',
            'war': 'War',
            'western': 'Western',
            'crime': 'Crime',
            'mystery': 'Mystery',
            'biography': 'Biography',
            'biopic': 'Biography',
            'musical': 'Musical',
            'adventure': 'Adventure',
            'family': 'Family'
        };

        const normalized = genre.toLowerCase().trim();
        return genreMapping[normalized] || genre;
    }

    // Analyze films and count genres with weighted scoring
    analyzeGenres() {
        this.filmData.forEach(film => {
            const rating = film.rating || 0;
            const isRecent = film.year >= new Date().getFullYear() - 2;

            // Base weight = 1, increased by rating and recency
            let weight = 1;

            // Higher rated films get more weight (rating is 0-5 scale)
            if (rating >= 4.5) weight *= 2;
            else if (rating >= 4.0) weight *= 1.5;
            else if (rating >= 3.5) weight *= 1.2;

            // Recent films get slight boost
            if (isRecent) weight *= 1.1;

            // Process each genre for this film
            if (film.genres && Array.isArray(film.genres)) {
                film.genres.forEach(genre => {
                    const normalizedGenre = this.normalizeGenre(genre);
                    const currentCount = this.genreMap.get(normalizedGenre) || 0;
                    this.genreMap.set(normalizedGenre, currentCount + weight);
                });
            }
        });

        return this.getTopGenres(3);
    }

    // Get top N genres by weighted count
    getTopGenres(n = 3) {
        const sortedGenres = Array.from(this.genreMap.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, n)
            .map(([genre, weight]) => ({
                genre,
                weight: Math.round(weight * 10) / 10,
                percentage: 0 // Will be calculated below
            }));

        // Calculate percentages
        const totalWeight = sortedGenres.reduce((sum, g) => sum + g.weight, 0);
        sortedGenres.forEach(g => {
            g.percentage = Math.round((g.weight / totalWeight) * 100);
        });

        return sortedGenres;
    }

    // Get all genres for visualization
    getAllGenres() {
        return Array.from(this.genreMap.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([genre, weight]) => ({ genre, weight }));
    }

    // Get statistics about viewing habits
    getStatistics() {
        const totalFilms = this.filmData.length;
        const totalRatings = this.filmData.filter(f => f.rating > 0).length;
        const avgRating = totalRatings > 0
            ? this.filmData.reduce((sum, f) => sum + (f.rating || 0), 0) / totalRatings
            : 0;

        return {
            totalFilms,
            totalRatings,
            avgRating: Math.round(avgRating * 10) / 10,
            uniqueGenres: this.genreMap.size
        };
    }
}

// Helper function to create analyzer from film data
function analyzeUserGenres(filmData) {
    const analyzer = new GenreAnalyzer(filmData);
    const topGenres = analyzer.analyzeGenres();
    const stats = analyzer.getStatistics();

    return {
        topGenres,
        allGenres: analyzer.getAllGenres(),
        stats
    };
}
