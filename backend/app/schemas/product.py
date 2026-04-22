from pydantic import BaseModel
from typing import Optional
class ProductBase(BaseModel):

    itemId:int
    name:str
    price:int
    ratingScore:Optional[float]=None
    image:str
    itemSoldCntShow:Optional[int]=None
    discount:Optional[float]=None
    brandName:Optional[str]=None
    sellerName:Optional[str]=None
    category:Optional[str]=None
    location:Optional[str]=None
    class Config:
        from_attributes = True
        coerce_numbers_to_str = False