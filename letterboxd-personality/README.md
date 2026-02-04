# 🎬 Letterboxd Cinephile Personality Analyzer

Discover your unique film-watching personality! This web application analyzes Letterboxd profiles and assigns cinephile personality types based on the MBTI framework, using your top 3 watched/rated genres.

## ✨ Features

- **16 Unique Cinephile Personalities**: Each MBTI type mapped to a film-lover archetype
- **Genre Analysis**: Weighted scoring based on ratings and viewing recency
- **Beautiful UI**: Premium dark theme with glassmorphism and smooth animations
- **Demo Mode**: Try it instantly with pre-loaded sample profiles
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

## 🎭 Personality Types

### Analyst Types (NT)
- **INTJ** - The Film Architect
- **INTP** - The Cinema Theorist
- **ENTJ** - The Genre Commander
- **ENTP** - The Avant-Garde Debater

### Diplomat Types (NF)
- **INFJ** - The Cinematic Visionary
- **INFP** - The Dreamer Cinephile
- **ENFJ** - The Cultural Curator
- **ENFP** - The Genre Explorer

### Sentinel Types (SJ)
- **ISTJ** - The Classic Film Archivist
- **ISFJ** - The Comfort Viewer
- **ESTJ** - The Blockbuster Strategist
- **ESFJ** - The Social Cinephile

### Explorer Types (SP)
- **ISTP** - The Craft Appreciator
- **ISFP** - The Visual Aesthete
- **ESTP** - The Thrill Seeker
- **ESFP** - The Entertainment Enthusiast

## 🚀 Getting Started

### Quick Start

1. **Open the application**:
   - Simply open `index.html` in your web browser
   - No installation or build process required!

2. **Try Demo Mode**:
   - Click "Try Random Demo" or select a demo user
   - Instantly see how the analyzer works

3. **Analyze Your Profile** (with limitations):
   - Enter a Letterboxd username
   - Note: Due to CORS restrictions, real profile fetching requires additional setup (see below)

### Demo Users

Try these pre-loaded profiles:
- **cinephile123**: Loves sci-fi thrillers and mysteries (INTJ - The Film Architect)
- **dreamweaver**: Enjoys romance, animation, and fantasy (INFP - The Dreamer Cinephile)
- **actionjunkie**: Action and thriller enthusiast (ESTP - The Thrill Seeker)

## 📋 Technical Details

### Project Structure

```
letterboxd-personality/
├── index.html              # Main HTML structure
├── style.css               # Premium styling with glassmorphism
├── app.js                  # Main application logic
├── personality-types.js    # 16 MBTI-to-cinephile mappings
├── genre-analyzer.js       # Genre analysis algorithm
└── letterboxd-scraper.js   # Data fetching (with demo data)
```

### How It Works

1. **Data Collection**: Fetches user's film data (demo mode or via scraping)
2. **Genre Analysis**: Counts genres with weighted scoring:
   - Higher ratings = more weight
   - Recent films get slight boost
   - Top 3 genres identified
3. **Personality Matching**: Matches genre combinations to MBTI types using a scoring algorithm
4. **Results Display**: Shows personality type, traits, top genres, and stats

### Genre Weighting System

The analyzer uses a sophisticated scoring system:
- **Position multiplier**: 1st genre gets 3x weight, 2nd gets 2x, 3rd gets 1x
- **Rating multiplier**: 4.5+ stars get 2x, 4+ stars get 1.5x, 3.5+ stars get 1.2x
- **Recency boost**: Films from last 2 years get 1.1x multiplier

## ⚠️ Limitations & Notes

### CORS Restrictions

Direct browser-based scraping of Letterboxd is blocked by CORS policies. Current solutions:

1. **Demo Mode** (Recommended): Use the built-in demo profiles
2. **CORS Extension**: Install a browser extension like "CORS Unblock" for testing
3. **Backend Proxy**: For production, set up a backend server to proxy requests

### Future Enhancements

- Backend API for real Letterboxd data fetching
- Official Letterboxd API integration (requires approval)
- More detailed analysis (directors, decades, countries)
- Social sharing features
- Comparison mode (compare two profiles)
- Export results as image

## 🎨 Design Philosophy

- **Premium Aesthetics**: Rich gradients, glassmorphism, and smooth animations
- **Dark Mode First**: Optimized for comfortable viewing
- **Responsive**: Mobile-first design that scales beautifully
- **Accessible**: Semantic HTML and clear visual hierarchy

## 🛠️ Technologies Used

- **HTML5**: Semantic structure
- **CSS3**: Modern features (Grid, Flexbox, Custom Properties, Animations)
- **Vanilla JavaScript**: ES6+ modules, no frameworks required
- **Google Fonts**: Inter (body) and Playfair Display (headings)

## 📖 Usage Tips

1. **Best Results**: The more films in your data, the more accurate the personality type
2. **Genre Diversity**: The analyzer works best with varied viewing habits
3. **Demo First**: Try demo mode to understand what results look like
4. **Mobile Friendly**: Works great on phones and tablets

## 📄 License

This is a personal/educational project. Letterboxd is a trademark of Letterboxd Limited.

## 🤝 Contributing

This is an open-ended project! Potential improvements:
- Add more personality type descriptions
- Refine genre-to-personality mappings
- Improve scraping reliability
- Add more statistics and insights
- Create visualization charts

---

**Enjoy discovering your cinephile personality! 🎬✨**
