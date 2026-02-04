import http.server
import socketserver
import urllib.request
import urllib.parse
import json
import re
import os

from genre_enricher import GenreEnricher

PORT = 8001
enricher = GenreEnricher()

class LetterboxdHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == '/api/user':
            self.api(urllib.parse.parse_qs(parsed.query))
        else:
            super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == '/api/advanced-analyze':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data)
                films = data.get('films', [])
                top4 = data.get('top4', [])
                
                print(f"--- Advanced Analysis ---")
                print(f"Films: {len(films)}")
                print(f"Top 4: {top4}")
                
                result = enricher.analyze(films, top4)
                self.json(result)
                
            except Exception as e:
                print(f"Error processing advanced: {e}")
                self.err(str(e))
        elif parsed.path == '/api/scrape-batch':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data)
                films = data.get('films', [])
                
                print(f"--- Batch Scrape: {len(films)} films ---")
                results = enricher.get_genres_for_batch(films)
                self.json(results)
            except Exception as e:
                print(f"Error processing batch: {e}")
                self.err(str(e))
        else:
            self.send_error(404)

    def api(self, query):
        username = query.get('username', [None])[0]
        if not username: return self.err("Username required")

        print(f"Scraping: {username}")
        
        # Mimic a standard browser request exactly
        url = f"https://letterboxd.com/{username}/films/"
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
        })

        try:
            with urllib.request.urlopen(req) as res:
                html = res.read().decode('utf-8')
                
                # regex for <div class="film-poster" ... data-film-name="...">
                matches = re.findall(r'data-film-name="([^"]*)"[^>]*?data-film-release-year="([^"]*)"', html)
                
                print(f"Found matches: {len(matches)}")
                
                films = [{"title": n, "year": int(y) if y.isdigit() else 2020, "rating": 0, "genres": []} for n, y in matches]
                
                if not films: return self.err("No films found (Private/Blocked)")
                
                self.json({"username": username, "displayName": username, "films": films})

        except Exception as e:
            print(f"Error: {e}")
            self.err(str(e))

    def json(self, data):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def err(self, msg, code=400):
        self.send_response(code)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps({"error": msg}).encode('utf-8'))

if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    try:
        with socketserver.TCPServer(("", PORT), LetterboxdHandler) as httpd:
            print(f"Running on http://localhost:{PORT}")
            httpd.serve_forever()
    except: pass
