#!/usr/bin/env python3
import subprocess
import sys
import os

os.chdir('/vercel/share/v0-project')

try:
    print("[v0] Pushing Prisma schema to database...")
    result = subprocess.run(
        ["npx", "prisma", "db", "push", "--skip-generate"],
        capture_output=True,
        text=True
    )
    
    print(result.stdout)
    
    if result.returncode != 0:
        print("Error:", result.stderr)
        sys.exit(1)
    
    print("[v0] Database schema pushed successfully!")
except Exception as e:
    print(f"[v0] Error: {str(e)}")
    sys.exit(1)
