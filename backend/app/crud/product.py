from models.product import Product
from sqlalchemy.orm import Session
from sqlalchemy import or_, func

def get_products(db:Session,skip:int=0,limit:int=2000,search:str=None):
    query=db.query(Product)
    if search:
        search_term=f"%{search}%"
        query = query.filter(
            or_(
                func.unaccent(Product.name).ilike(func.unaccent(search_term)),
                # Thay 'cat_1' bằng tên cột danh mục thực tế trong DB của bạn
                func.unaccent(Product.category).ilike(func.unaccent(search_term)), 
                # Nếu có cột thương hiệu (brandName) thì thêm vào đây cho càng thông minh
                func.unaccent(Product.brandName).ilike(func.unaccent(search_term))
            )
        )
    query = query.order_by(Product.itemSoldCntShow.desc())
    
    return query.offset(skip).limit(limit).all()