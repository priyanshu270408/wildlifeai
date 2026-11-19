import os
import sys
import uvicorn

# Set current backend path
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(current_dir, "backend")
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("   WILDSHIELD AI — PREDICT. PROTECT. PREVENT.")
    print("   AI-Powered Wildlife Intelligence & Conservation Ecosystem")
    print("   Website Name: wildomang")
    print("=" * 60)
    print("\n[+] Initializing Database, Models, and Connected Services...")
    print("[+] Launching unified full-stack application on http://127.0.0.1:8000")
    print("[+] Interactive Swagger API Docs at http://127.0.0.1:8000/docs")
    print("[+] Evaluation Personas ready in top Hackathon Banner")
    print("=" * 60 + "\n")

    uvicorn.run(
        "app.main:app",
        host="127.0.0.1",
        port=8000,
        reload=False
    )
