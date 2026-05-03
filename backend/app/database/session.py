import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv

# 1. Tự động nạp file .env
load_dotenv()

# 2. Lấy URL từ biến môi trường
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    DATABASE_URL = "postgresql://neondb_owner:npg_hLYef9pVu8dj@ep-round-fire-aoslwbbu-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

# 3. Cấu hình SSL nếu dùng Neon Tech
connect_args = {}
if DATABASE_URL and "neon.tech" in DATABASE_URL:
    print("🚀 Kết nối: NEON CLOUD DATABASE (SSL Enabled)")
    connect_args["sslmode"] = "require"
else:
    print("🔌 Kết nối: POSTGRESQL LOCAL")

# --- ĐOẠN CẦN THIẾU GIÚP HẾT LỖI ---

# 4. Tạo engine để kết nối tới database
engine = create_engine(DATABASE_URL, connect_args=connect_args)

# 5. Tạo SessionLocal (Cái mà file deps.py đang tìm kiếm)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 6. Tạo Base cho các models kế thừa
Base = declarative_base()