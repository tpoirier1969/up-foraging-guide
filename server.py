import http.server
import socketserver
import webbrowser
import os

PORT = 8765

class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        ".js": "application/javascript",
        ".json": "application/json",
    }

if __name__ == "__main__":
    os.chdir(os.path.dirname(__file__) or ".")
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        url = f"http://127.0.0.1:{PORT}/index.html#/home"
        try:
            webbrowser.open(url)
        except Exception:
            pass
        print(f"Serving at {url}")
        httpd.serve_forever()
