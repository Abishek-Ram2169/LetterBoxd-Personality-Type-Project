import csv
import json
import os
import requests
from bs4 import BeautifulSoup
import time
import random
import re

CACHE_FILE = "genre_cache.json"

class GenreEnricher:
    def __init__(self):
        self.cache = self.load_cache()
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        })

    def load_cache(self):
        if os.path.exists(CACHE_FILE):
            try:
                with open(CACHE_FILE, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except:
                return {}
        return {}

    def save_cache(self):
        with open(CACHE_FILE, 'w', encoding='utf-8') as f:
            json.dump(self.cache, f, indent=2)

    def get_slug(self, title, year):
        # Convert title+year to Letterboxd slug format
        # e.g. "The Matrix", 1999 -> "film/the-matrix/"
        # Ideally we stick to what works most of the time
        slug = title.lower()
        slug = re.sub(r'[\':,.]', '', slug) # Remove punctuation
        slug = slug.replace('&', 'and')
        slug = slug.replace(' ', '-')
        slug = re.sub(r'-+', '-', slug) # Duplicate dashes
        # Note: Letterboxd URLs sometimes include year, sometimes not.
        # We will try /film/slug/ first.
        return slug

    def scrape_genres(self, title, year):
        cache_key = f"{title}_{year}"
        if cache_key in self.cache:
            return self.cache[cache_key]

        slug = self.get_slug(title, year)
        url = f"https://letterboxd.com/film/{slug}/"
        
        print(f"Scraping genres for: {title} ({url})")
        
        try:
            response = self.session.get(url, timeout=5)
            if response.status_code == 404:
                # Try with year appended? letterboxd.com/film/slug-year/
                url_year = f"https://letterboxd.com/film/{slug}-{year}/"
                print(f"  404, trying: {url_year}")
                response = self.session.get(url_year, timeout=5)

            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # Genres are in the header metadata or links
                # Usually: <div class="text-sluglist capitalized"> ... <a href="/films/genre/horror/">Horror</a>
                # Look for links that start with /films/genre/
                genre_links = soup.select('a[href^="/films/genre/"]')
                genres = [a.text.strip() for a in genre_links if "All" not in a.text]
                
                # Themes used to be exposed, sometimes they are distinct
                
                # Save to cache
                self.cache[cache_key] = genres
                self.save_cache() # Save periodically
                
                # Be nice to server
                time.sleep(random.uniform(0.1, 0.3)) 
                
                return genres
            else:
                print(f"  Failed: {response.status_code}")
                # Cache failure so we don't retry endlessly? Maybe not.
                return []
        except Exception as e:
            print(f"  Error: {e}")
            return []

    def get_genres_for_batch(self, films):
        enriched_batch = []
        for film in films:
            title = film['title']
            year = film.get('year', 2020)
            genres = self.scrape_genres(title, year)
            
            # Add genres to film object
            film['genres'] = genres
            enriched_batch.append(film)
        
        self.save_cache()
        return enriched_batch

    def analyze(self, films, top4_titles):
        genre_stats = {} # { "Horror": { "count": 10, "rating_sum": 45, "rated_count": 10 } }
        total_films = 0

        # 1. Scrape & Count
        for film in films:
            title = film['title']
            year = film.get('year', 2020)
            rating = float(film.get('rating', 0))
            
            genres = self.scrape_genres(title, year)
            
            if genres:
                total_films += 1
                for g in genres:
                    if g not in genre_stats:
                        genre_stats[g] = { "count": 0, "rating_sum": 0, "rated_count": 0 }
                    
                    genre_stats[g]["count"] += 1
                    if rating > 0:
                        genre_stats[g]["rating_sum"] += rating
                        genre_stats[g]["rated_count"] += 1
        
        self.save_cache()

        # 2. Advanced Scoring
        # Formula: AvgRating * (1 + (Count/1000) + Top4Bonus)
        
        weighted_scores = {}
        
        # Determine Top 4 Genres
        top4_genres = set()
        for t4_title in top4_titles:
            name = t4_title.strip()
            if not name: continue
            # Check cache or scrape
            t_genres = self.scrape_genres(name, 2020) 
            for g in t_genres:
                top4_genres.add(g)
                
        print(f"Top 4 Genres Bonus Targets: {top4_genres}")

        for g, stats in genre_stats.items():
            count = stats["count"]
            rated_count = stats["rated_count"]
            avg_rating = 0
            
            if rated_count > 0:
                avg_rating = stats["rating_sum"] / rated_count
            else:
                # If no films in this genre have ratings, it shouldn't be top rank.
                # But we give it a small baseline if big volume?
                avg_rating = 0.5 

            # Volume Bonus: 0.1x per 100 films => count / 1000
            volume_bonus = count / 1000.0
            
            # Top 4 Bonus: +0.25 if genre is in Top 4 favorites
            top4_bonus = 0.25 if g in top4_genres else 0.0
            
            # Multiplier
            multiplier = 1.0 + volume_bonus + top4_bonus
            
            final_score = avg_rating * multiplier
            
            weighted_scores[g] = {
                "count": count,
                "avg_rating": avg_rating,
                "score": final_score,
                "multipliers": {
                    "volume": volume_bonus,
                    "top4": top4_bonus,
                    "total": multiplier
                }
            }

        # Format compatible with current frontend
        sorted_genres = sorted(weighted_scores.items(), key=lambda x: x[1]['score'], reverse=True)
        
        # Normalize percentages based on SCORES so they sum to 100 for the UI bar
        total_score = sum(item[1]['score'] for item in sorted_genres)
        
        result_genres = []
        for g, data in sorted_genres:
            result_genres.append({
                "genre": g,
                "count": data['count'],
                "score": round(data['score'], 2),
                "percentage": round((data['score'] / total_score) * 100, 1) if total_score > 0 else 0,
                "details": data
            })

        return {
            "topGenres": result_genres,
            "stats": {
                "totalFilms": total_films,
                "processed": len(films),
                "totalRatings": sum(s["rated_count"] for s in genre_stats.values()), 
                # Approx avg rating (sum of genre avg? No, need raw sum)
                # Let's recalculate accurately from the films list
                "avgRating": self.calculate_total_average(films),
                "uniqueGenres": len(genre_stats)
            },
            "raw": weighted_scores
        }

    def calculate_total_average(self, films):
        total_rating = 0
        count = 0
        for f in films:
            r = float(f.get('rating', 0))
            if r > 0:
                total_rating += r
                count += 1
        return total_rating / count if count > 0 else 0
