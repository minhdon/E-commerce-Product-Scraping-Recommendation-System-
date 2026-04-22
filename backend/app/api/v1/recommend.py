from fastapi import APIRouter, HTTPException
from services.recommend import RecommenderSystem

# Khởi tạo router
router = APIRouter()

# Khởi tạo instance của Recommender (Nên dùng Dependency Injection hoặc global)
recommender = RecommenderSystem(r"../../crawler/data/merged_data.csv")

@router.get("/{item_id}")
async def get_recommendation(item_id: int):
    results = recommender.get_recommendations(item_id)
    if results is None:
        raise HTTPException(status_code=404, detail="Sản phẩm không tồn tại")
    results = results.fillna(0)
    return {"recommendations": results.to_dict(orient="records")}