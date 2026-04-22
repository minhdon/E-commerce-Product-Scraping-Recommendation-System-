import os

# Danh sách thư mục cốt lõi
folders = [
    "app/api/v1/endpoints",
    "app/crud",
    "app/schemas",
    "app/models",
    "app/core"
]

# Tạo thư mục
for folder in folders:
    os.makedirs(folder, exist_ok=True)
    # Tạo file __init__.py để Python nhận diện là package
    with open(os.path.join(folder, "__init__.py"), "w") as f:
        pass

# Tạo các file quan trọng
files = {
    "app/main.py": "from fastapi import FastAPI\napp = FastAPI()",
    "app/api/v1/api.py": "from fastapi import APIRouter\napi_router = APIRouter()",
    "requirements.txt": "fastapi\nuvicorn\npydantic\nrequests",
    ".env": "DATABASE_URL=sqlite:///./test.db\nSECRET_KEY=your_secret_key"
}

for path, content in files.items():
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

print("🚀 Đã tạo cấu trúc Backend rút gọn thành công!")