from app.models.product import Product
from sqlalchemy.orm import Session
from sqlalchemy import or_, func

def get_products(db: Session, skip: int = 0, limit: int = 2000, search: str = None):
    query = db.query(Product)
    if search:
        # Thay vì f"%{search}%", ta dùng Regex Word Boundary (\y) của PostgreSQL
        # \y báo cho DB biết chữ này phải đứng độc lập (VD: "ao" chứ không phải "thao")
        regex_term = f"\\y{search}\\y"
        
        query = query.filter(
            or_(
                # op('~*') là lệnh chạy Regex không phân biệt hoa/thường trong SQLAlchemy
                func.unaccent(Product.name).op('~*')(func.unaccent(regex_term)),
                func.unaccent(Product.category).op('~*')(func.unaccent(regex_term)),
                func.unaccent(Product.brandName).op('~*')(func.unaccent(regex_term))
            )
        )
    query = query.order_by(Product.itemSoldCntShow.desc())
    
    return query.offset(skip).limit(limit).all()