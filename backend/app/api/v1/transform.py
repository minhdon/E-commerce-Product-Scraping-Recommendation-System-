import os
import subprocess
from fastapi import APIRouter
from fastapi.responses import StreamingResponse

router = APIRouter()

# Thêm tham số keyword vào hàm để lấy giá trị từ URL
@router.get("/transform")
async def trigger_transform(keyword: str = "dien thoai"):
    def generate():
        env = os.environ.copy()
        env["PYTHONIOENCODING"] = "utf-8"
        env["PYTHONUTF8"] = "1"
        # Gán keyword được truyền từ URL vào biến môi trường
        env["TRANSFORM_KEYWORD"] = keyword 
        
        # Đảm bảo đường dẫn này trỏ đúng vào file transform.py của bạn
        TRANSFORM_SCRIPT = r"../../crawler/scripts/transform.py"
    
        process = subprocess.Popen(
            ["python", "-u", TRANSFORM_SCRIPT],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            errors="replace",
            encoding="utf-8",
            env=env
        ) 
        
        # Đọc từng dòng log/output từ file transform.py đang chạy và đẩy lên trình duyệt
        for line in iter(process.stdout.readline, ''):
            yield line
            
        process.stdout.close()
        process.wait()

    # Trả về StreamingResponse để hiển thị dữ liệu liên tục ra màn hình thay vì null
    return StreamingResponse(generate(), media_type="text/plain")