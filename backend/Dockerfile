FROM python:3.11

WORKDIR /app

# 1. Cài pip trước
RUN pip install --no-cache-dir --upgrade pip

# 2. Cài các thư viện dễ tính trước (FastAPI, uvicorn, etc.)
COPY requirements.txt .
RUN pip install --no-cache-dir -v -r requirements.txt

# 3. NẾU lỗi ở underthesea, ta cài riêng nó bằng cách ép dùng binary
# Gỡ bỏ underthesea khỏi requirements.txt nếu cần thiết
RUN pip install --no-cache-dir --only-binary=:all: underthesea==9.4.0

COPY . .

ENV PYTHONPATH=/app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]