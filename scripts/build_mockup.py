"""Rebuild all static mockup pages with shared chrome and tactile styling."""
from pathlib import Path
import subprocess
import sys

root = Path(__file__).resolve().parents[1]
for script in ('build_reference_site.py', 'generate_articles.py', 'tactile_design.py'):
    subprocess.run([sys.executable, str(root / 'scripts' / script)], cwd=root, check=True)
