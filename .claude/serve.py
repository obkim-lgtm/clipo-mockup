"""Static file server pinned to clipo_mockup directory.

Reliable across Korean paths because we use os.chdir before binding.
Used by .claude/launch.json `clipo-mockup` config.
"""
import os
import sys
import http.server
import socketserver

PORT = 3457

# Anchor to the project root (parent of .claude/)
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, os.pardir))
os.chdir(ROOT)

print(f"[clipo-mockup] serving {ROOT} on http://localhost:{PORT}", flush=True)

Handler = http.server.SimpleHTTPRequestHandler
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    httpd.serve_forever()
