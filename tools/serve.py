#!/usr/bin/env python3
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from functools import partial
print('Preview: http://localhost:4173/  | Ctrl+C to stop')
ThreadingHTTPServer(('127.0.0.1',4173),partial(SimpleHTTPRequestHandler,directory=str(Path(__file__).resolve().parents[1]/'web'))).serve_forever()
