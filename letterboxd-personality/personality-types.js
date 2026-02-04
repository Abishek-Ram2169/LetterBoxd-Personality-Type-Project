// MBTI to Cinephile Personality Type Mappings
// Each personality type has associated genres and characteristics

const personalityTypes = {
  // ANALYST TYPES (NT)
  INTJ: {
    name: "The Film Architect",
    mbti: "INTJ",
    tagline: "Analytical viewers who appreciate complex narratives",
    description: "You're drawn to films with intricate world-building, complex plot structures, and layers of meaning. You appreciate auteur cinema and films that reward careful analysis. Directors like Christopher Nolan, Denis Villeneuve, and the Wachowskis speak to your love of ambitious, thought-provoking cinema.",
    primaryGenres: ["Science Fiction", "Thriller", "Mystery"],
    secondaryGenres: ["Drama", "Crime", "Fantasy"],
    traits: ["Analytical", "Strategic", "Visionary", "Perfectionist"],
    famousCritics: "You watch films like a chess master plays chess",
    icon: "🏛️",
    color: "#6B46C1"
  },

  INTP: {
    name: "The Cinema Theorist",
    mbti: "INTP",
    tagline: "Philosophical viewers drawn to experimental works",
    description: "You're fascinated by films that challenge conventions and explore abstract concepts. Meta-cinema, philosophical sci-fi, and intellectually challenging documentaries captivate you. Directors like Charlie Kaufman, Terrence Malick, and Shane Carruth align with your love of complex, unconventional storytelling.",
    primaryGenres: ["Drama", "Science Fiction", "Documentary"],
    secondaryGenres: ["Mystery", "Thriller", "Fantasy"],
    traits: ["Philosophical", "Curious", "Analytical", "Innovative"],
    famousCritics: "You seek films that make you question reality itself",
    icon: "🧠",
    color: "#805AD5"
  },

  ENTJ: {
    name: "The Genre Commander",
    mbti: "ENTJ",
    tagline: "Strategic viewers with strong opinions",
    description: "You gravitate toward ambitious epics, films about power dynamics, and stories of strategic brilliance. You appreciate well-executed productions and commanding performances. Directors like Francis Ford Coppola, David Fincher, and Ridley Scott match your taste for powerful, ambitious cinema.",
    primaryGenres: ["Action", "War", "History"],
    secondaryGenres: ["Thriller", "Crime", "Biography"],
    traits: ["Decisive", "Ambitious", "Strategic", "Confident"],
    famousCritics: "You watch films like a general studies battles",
    icon: "👑",
    color: "#553C9A"
  },

  ENTP: {
    name: "The Avant-Garde Debater",
    mbti: "ENTP",
    tagline: "Innovative viewers who love unconventional storytelling",
    description: "You thrive on films that break boundaries and challenge expectations. Clever dialogue, unreliable narrators, and genre-bending works excite you. Directors like Quentin Tarantino, Edgar Wright, and Wes Anderson appeal to your love of creative, unconventional cinema.",
    primaryGenres: ["Comedy", "Science Fiction", "Crime"],
    secondaryGenres: ["Thriller", "Mystery", "Adventure"],
    traits: ["Inventive", "Witty", "Bold", "Unconventional"],
    famousCritics: "You love films that zigged when you expected them to zag",
    icon: "💡",
    color: "#9F7AEA"
  },

  // DIPLOMAT TYPES (NF)
  INFJ: {
    name: "The Cinematic Visionary",
    mbti: "INFJ",
    tagline: "Empathetic viewers drawn to transformative stories",
    description: "You seek films with deep emotional resonance and meaningful themes. Stories about personal transformation, spiritual journeys, and the human condition move you. Directors like Hayao Miyazaki, Guillermo del Toro, and Bong Joon-ho create the kind of profound, layered cinema you cherish.",
    primaryGenres: ["Drama", "Fantasy", "Romance"],
    secondaryGenres: ["Science Fiction", "Animation", "Mystery"],
    traits: ["Empathetic", "Idealistic", "Insightful", "Passionate"],
    famousCritics: "You feel films in your soul",
    icon: "✨",
    color: "#ED64A6"
  },

  INFP: {
    name: "The Dreamer Cinephile",
    mbti: "INFP",
    tagline: "Idealistic viewers who love poetic cinema",
    description: "You're drawn to emotionally rich, poetic films that explore the beauty and pain of existence. Coming-of-age stories, romantic dramas, and visually stunning animation resonate deeply with you. Directors like Studio Ghibli's filmmakers, Richard Linklater, and Greta Gerwig speak to your sensitive, artistic soul.",
    primaryGenres: ["Romance", "Fantasy", "Animation"],
    secondaryGenres: ["Drama", "Adventure", "Musical"],
    traits: ["Idealistic", "Creative", "Sensitive", "Authentic"],
    famousCritics: "You find magic in the quietest moments",
    icon: "🌙",
    color: "#F687B3"
  },

  ENFJ: {
    name: "The Cultural Curator",
    mbti: "ENFJ",
    tagline: "Charismatic viewers who champion diverse voices",
    description: "You're passionate about films that inspire, uplift, and represent diverse perspectives. Biopics of inspiring figures, socially conscious dramas, and uplifting musicals energize you. Directors like Ava DuVernay, Damien Chazelle, and Barry Jenkins create the kind of meaningful, impactful cinema you advocate for.",
    primaryGenres: ["Drama", "Biography", "Musical"],
    secondaryGenres: ["Romance", "History", "Documentary"],
    traits: ["Charismatic", "Inspiring", "Empathetic", "Organized"],
    famousCritics: "You believe in cinema's power to change the world",
    icon: "🌟",
    color: "#FC8181"
  },

  ENFP: {
    name: "The Genre Explorer",
    mbti: "ENFP",
    tagline: "Enthusiastic viewers with eclectic tastes",
    description: "Your film taste is wonderfully unpredictable. You love discovering hidden gems, exploring new genres, and sharing your latest cinematic obsession. From whimsical adventures to quirky comedies to heartfelt dramas, filmmakers like Taika Waititi, Michel Gondry, and the Daniels capture your playful, adventurous spirit.",
    primaryGenres: ["Adventure", "Comedy", "Fantasy"],
    secondaryGenres: ["Drama", "Romance", "Science Fiction"],
    traits: ["Enthusiastic", "Creative", "Spontaneous", "Open-minded"],
    famousCritics: "Your watchlist is an adventure waiting to happen",
    icon: "🎨",
    color: "#F6AD55"
  },

  // SENTINEL TYPES (SJ)
  ISTJ: {
    name: "The Classic Film Archivist",
    mbti: "ISTJ",
    tagline: "Traditional viewers with appreciation for film history",
    description: "You have deep respect for the classics and the craft of filmmaking. Well-structured narratives, historical accuracy, and timeless stories appeal to you. Directors like Clint Eastwood, Steven Spielberg (his historical works), and the masters of classic cinema align with your appreciation for tradition and quality.",
    primaryGenres: ["History", "War", "Western"],
    secondaryGenres: ["Drama", "Crime", "Biography"],
    traits: ["Reliable", "Detail-oriented", "Traditional", "Principled"],
    famousCritics: "You honor cinema's rich heritage",
    icon: "📚",
    color: "#4A5568"
  },

  ISFJ: {
    name: "The Comfort Viewer",
    mbti: "ISFJ",
    tagline: "Loyal viewers who cherish heartwarming stories",
    description: "You love films that make you feel at home. Heartwarming family stories, gentle romances, and comforting dramas are your sanctuary. Directors like Nancy Meyers, Nora Ephron, and Studio Ghibli create the warm, nurturing cinema that speaks to your caring nature.",
    primaryGenres: ["Romance", "Family", "Drama"],
    secondaryGenres: ["Comedy", "Animation", "Fantasy"],
    traits: ["Caring", "Loyal", "Practical", "Supportive"],
    famousCritics: "You find comfort in the familiar embrace of good storytelling",
    icon: "🏡",
    color: "#718096"
  },

  ESTJ: {
    name: "The Blockbuster Strategist",
    mbti: "ESTJ",
    tagline: "Practical viewers who enjoy well-crafted entertainment",
    description: "You appreciate films that deliver exactly what they promise. Well-executed action, tight thrillers, and smart crime dramas satisfy your taste for efficiency and quality. Directors like Michael Mann, Tony Scott, and Tom Cruise's recent collaborators create the polished, professional cinema you respect.",
    primaryGenres: ["Action", "Thriller", "Crime"],
    secondaryGenres: ["War", "History", "Adventure"],
    traits: ["Organized", "Practical", "Direct", "Traditional"],
    famousCritics: "You value execution over experimentation",
    icon: "🎯",
    color: "#2D3748"
  },

  ESFJ: {
    name: "The Social Cinephile",
    mbti: "ESFJ",
    tagline: "Community-oriented viewers drawn to crowd-pleasers",
    description: "You love films that bring people together. Feel-good comedies, romantic dramedies, and emotionally satisfying dramas are perfect for your movie nights. Directors like Jon M. Chu, rom-com specialists, and ensemble comedy masters create the communal, heartfelt cinema you adore.",
    primaryGenres: ["Comedy", "Romance", "Drama"],
    secondaryGenres: ["Musical", "Family", "Adventure"],
    traits: ["Sociable", "Caring", "Organized", "Cooperative"],
    famousCritics: "Cinema is better when shared with others",
    icon: "🎭",
    color: "#4299E1"
  },

  // EXPLORER TYPES (SP)
  ISTP: {
    name: "The Craft Appreciator",
    mbti: "ISTP",
    tagline: "Technical viewers fascinated by filmmaking techniques",
    description: "You're captivated by the mechanics of cinema. Practical effects, impressive stunts, and technical mastery draw you in. Action choreography, clever editing, and visual innovation excite you. Directors like George Miller, the Russo Brothers, and John Wick's Chad Stahelski showcase the craftsmanship you admire.",
    primaryGenres: ["Action", "Thriller", "Science Fiction"],
    secondaryGenres: ["Crime", "War", "Adventure"],
    traits: ["Practical", "Observant", "Independent", "Logical"],
    famousCritics: "You appreciate the how as much as the what",
    icon: "🔧",
    color: "#38B2AC"
  },

  ISFP: {
    name: "The Visual Aesthete",
    mbti: "ISFP",
    tagline: "Artistic viewers drawn to beautiful cinematography",
    description: "You experience cinema through its visual and emotional beauty. Stunning cinematography, artistic animation, and aesthetically rich fantasies transport you. Directors like Wes Anderson, Wong Kar-wai, and Pixar's best create the sensory masterpieces that speak to your artistic soul.",
    primaryGenres: ["Animation", "Fantasy", "Romance"],
    secondaryGenres: ["Drama", "Adventure", "Musical"],
    traits: ["Artistic", "Sensitive", "Flexible", "Spontaneous"],
    famousCritics: "Every frame is a painting for you",
    icon: "🎨",
    color: "#48BB78"
  },

  ESTP: {
    name: "The Thrill Seeker",
    mbti: "ESTP",
    tagline: "Bold viewers who love high-octane entertainment",
    description: "You want cinema that gets your adrenaline pumping. Intense action, edge-of-your-seat thrillers, and visceral horror excite you. You're here for the experience, the spectacle, the rush. Directors like James Cameron, Sam Raimi, and modern action maestros deliver the thrills you crave.",
    primaryGenres: ["Action", "Horror", "Thriller"],
    secondaryGenres: ["Adventure", "Crime", "Science Fiction"],
    traits: ["Bold", "Energetic", "Action-oriented", "Spontaneous"],
    famousCritics: "You live for the rush",
    icon: "⚡",
    color: "#F56565"
  },

  ESFP: {
    name: "The Entertainment Enthusiast",
    mbti: "ESFP",
    tagline: "Fun-loving viewers who enjoy feel-good movies",
    description: "You watch films to have a great time! Laugh-out-loud comedies, spectacular musicals, and fun adventures are your jam. You appreciate spectacle, joy, and entertainment value. Directors like Jon Favreau, musical specialists, and comedy masters create the pure fun cinema you celebrate.",
    primaryGenres: ["Comedy", "Musical", "Adventure"],
    secondaryGenres: ["Action", "Romance", "Fantasy"],
    traits: ["Enthusiastic", "Spontaneous", "Playful", "Optimistic"],
    famousCritics: "Cinema is meant to be enjoyed!",
    icon: "🎉",
    color: "#ED8936"
  }
};

// Genre to personality type scoring weights
const genreWeights = {
  "Science Fiction": {
    INTJ: 10, INTP: 10, ENTP: 8, ISTP: 7, INFJ: 6, ENFP: 5
  },
  "Thriller": {
    INTJ: 9, ESTJ: 9, INTP: 8, ISTP: 8, ENTJ: 7, ESTP: 7, ENTP: 6
  },
  "Mystery": {
    INTJ: 10, INTP: 8, INFJ: 6, ENTP: 6, ISTP: 5
  },
  "Drama": {
    INFJ: 10, INFP: 10, INTP: 8, ENFJ: 8, ISFJ: 7, ESFJ: 7, ISFP: 6
  },
  "Romance": {
    INFP: 10, INFJ: 8, ISFJ: 9, ESFJ: 8, ISFP: 7, ENFP: 6
  },
  "Fantasy": {
    INFJ: 9, INFP: 9, ENFP: 9, ISFP: 8, INTJ: 5
  },
  "Action": {
    ESTP: 10, ESTJ: 9, ISTP: 10, ENTJ: 8, ENTP: 5
  },
  "Comedy": {
    ENTP: 9, ENFP: 9, ESFP: 10, ESFJ: 9, ESTP: 6
  },
  "Horror": {
    ESTP: 9, ISTP: 6, INTP: 5
  },
  "War": {
    ENTJ: 10, ISTJ: 9, ESTJ: 8, ISTP: 6
  },
  "History": {
    ENTJ: 8, ISTJ: 10, ENFJ: 7, ESTJ: 8
  },
  "Biography": {
    ENFJ: 9, ISTJ: 7, ENTJ: 6, INFJ: 6
  },
  "Documentary": {
    INTP: 9, INFJ: 7, ISTJ: 6, ENFJ: 6
  },
  "Crime": {
    ENTJ: 8, ESTJ: 9, ENTP: 8, ISTJ: 7, ISTP: 7
  },
  "Animation": {
    INFP: 10, INFJ: 8, ISFP: 10, ENFP: 8, ESFP: 7
  },
  "Musical": {
    ENFJ: 9, ESFP: 10, ESFJ: 8, ENFP: 7, ISFP: 6
  },
  "Adventure": {
    ENFP: 10, ESFP: 9, ESTP: 8, ISTP: 7, ENTP: 6
  },
  "Western": {
    ISTJ: 10, ISTP: 7, ESTJ: 6
  },
  "Family": {
    ISFJ: 10, ESFJ: 9, ENFJ: 6
  }
};

// Get personality type based on top genres
function getPersonalityType(topGenres) {
  const scores = {};

  // Initialize all personality types with 0 score
  Object.keys(personalityTypes).forEach(type => {
    scores[type] = 0;
  });

  // Calculate scores based on genres
  topGenres.forEach((genreData, index) => {
    const genre = genreData.genre;
    const weight = genreData.weight || 1;

    // Higher weight for top genres (3x for 1st, 2x for 2nd, 1x for 3rd)
    const positionMultiplier = 3 - index;

    if (genreWeights[genre]) {
      Object.entries(genreWeights[genre]).forEach(([type, score]) => {
        scores[type] += score * positionMultiplier * weight;
      });
    }
  });

  // Find the personality type with highest score
  let maxScore = 0;
  let bestType = 'INFJ'; // Default

  Object.entries(scores).forEach(([type, score]) => {
    if (score > maxScore) {
      maxScore = score;
      bestType = type;
    }
  });

  return personalityTypes[bestType];
}
