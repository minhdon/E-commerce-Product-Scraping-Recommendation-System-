import os
import subprocess
from fastapi import FastAPI
app = FastAPI()
from fastapi.responses import StreamingResponse
from app.api.v1 import crawler,transform,load,recommend,getProduct
from fastapi.middleware.cors import CORSMiddleware
origins = [
    "http://localhost:5173", 
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Cho phép tất cả GET, POST, PUT, DELETE...
    allow_headers=["*"], # Cho phép tất cả các Header
)
SCRIPT_PATH = r"/app/crawler/scripts/cookie.py"
@app.get("/")
def read_root():
    return {"message": "Hello, World!"}
app.include_router(
    crawler.router,
    prefix="/api/v1",
    tags=["crawler"]
)
app.include_router(
    transform.router,
    prefix="/api/v1",
    tags=["transform"]
)
app.include_router(
    load.router,
    prefix="/api/v1",
    tags=["load"]
)
app.include_router(
    recommend.router, 
    prefix="/api/v1/recommend", 
    tags=["recommendations"]
)
app.include_router(getProduct.router, prefix="/products", tags=["products"])