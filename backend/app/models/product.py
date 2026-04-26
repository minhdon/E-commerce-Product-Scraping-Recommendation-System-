from app.database.session import Base
from sqlalchemy import Column,Integer,String,Float,Text,Double
class Product(Base):
    __tablename__="products"

    itemId=Column(Integer,primary_key=True,index=True)
    name=Column(Text)
    price=Column(Integer)
    ratingScore=Column(Double)
    image=Column(Text)
    itemSoldCntShow=Column(Double)
    discount=Column(Double)
    brandName=Column(Text)
    sellerName=Column(Text)
    category=Column(Text)
    location=Column(Text)