from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.comment_service import CommentAnalyzer

router = APIRouter()
analyzer = CommentAnalyzer()

# Schema dữ liệu gửi lên từ frontend
class CommentRequest(BaseModel):
    content: str

@router.post("/analyze")
def analyze_comment(payload: CommentRequest):
    if not payload.content:
        raise HTTPException(status_code=400, detail="Nội dung bình luận không được để trống")
    
    # Gọi service AI đã tạo ở Bước 1
    analysis_result = analyzer.analyze(payload.content)
    
    return {
        "status": "success",
        "data": analysis_result
    }