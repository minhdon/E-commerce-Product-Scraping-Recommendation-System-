import os

import subprocess

from fastapi import APIRouter, FastAPI



from fastapi.responses import StreamingResponse

router=APIRouter()

@router.get("/crawl")

async def trigger_crawler(keyword: str = "dien thoai"):

    def generate():

        env = os.environ.copy()

        env["PYTHONIOENCODING"] = "utf-8"

        env["PYTHONUTF8"] = "1"

        env["SEARCH_KEYWORD"] = keyword  # Bạn có thể thay đổi từ khóa tìm kiếm tại đây

        CRAWLER_SCRIPT = r"../../crawler/scripts/cookie.py"

   

        process = subprocess.Popen(

            ["python", "-u", CRAWLER_SCRIPT], # "-u" để ép python in log ngay lập tức (unbuffered)

            stdout=subprocess.PIPE,

            stderr=subprocess.STDOUT,

            text=True,

            errors="replace",

            encoding="utf-8",

            env=env

        )



        # Đọc từng dòng log khi nó vừa xuất hiện

     # Đọc từng dòng log từ script cookie.py

        try:

            for line in iter(process.stdout.readline, ""):

                if line:

                    yield f"data: {line.strip()}\n\n"

        except Exception as e:

            yield f"data: Error reading log: {str(e)}\n\n"

        finally:

            process.stdout.close()

            process.wait()



    return StreamingResponse(generate(), media_type="text/event-stream")