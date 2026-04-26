import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# 1. Tự động tìm và nạp file .env (nếu có)
load_dotenv()

# 2. Lấy URL từ biến môi trường (Ưu tiên biến từ Docker Compose truyền vào)
DATABASE_URL = os.getenv("DATABASE_URL")

# Dự phòng nếu không tìm thấy biến môi trường


# 3. Cấu hình Engine thông minh
connect_args = {}

# Nếu là Neon Tech, bắt buộc phải có SSL
if "neon.tech" in DATABASE_URL:
    print("🚀 Kết nối: NEON CLOUD DATABASE (SSL Enabled)")
    connect_args["sslmode"] = "require"
else:
    print("💻 Kết nối: POSTGRESQL LOCAL")

# Tạo engine
engine = create_engine(
    DATABASE_URL, 
    connect_args=connect_args,
    pool_pre_ping=True  # Giúp tự động kết nối lại nếu bị rớt mạng
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Hàm tiện ích để lấy session database
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()