from crud import product as crud_product
from fastapi import APIRouter,Depends,Query
from sqlalchemy.orm import Session
from api import deps
from typing import List,Optional
from schemas.product import ProductBase 
router=APIRouter()
@router.get("/",response_model=List[ProductBase])
def read_products(db:Session=Depends(deps.get_db),skip:int=0,limit:int=20,search: Optional[str] = Query(None, description="Từ khóa tìm kiếm sản phẩm")):
    products = crud_product.get_products(db, skip=skip, limit=limit,search=search)
    return products
    