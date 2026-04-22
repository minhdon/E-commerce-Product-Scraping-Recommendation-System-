import os
import subprocess
from fastapi import APIRouter
from fastapi.responses import StreamingResponse

router = APIRouter()
@router.get("/load")
async def trigger_load():
    def generate():
        env = os.environ.copy()
        env["PYTHONIOENCODING"] = "utf-8"
        env["PYTHONUTF8"] = "1"
        LOAD_SCRIPT = r"../../crawler/scripts/load.py"
    
        process = subprocess.Popen(
            ["python", "-u", LOAD_SCRIPT],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            errors="replace",
            encoding="utf-8",
            env=env
        ) 
        
        for line in iter(process.stdout.readline, ''):
            yield line
            
        process.stdout.close()
        process.wait()

    return StreamingResponse(generate(), media_type="text/plain")