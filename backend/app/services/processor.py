import re
from underthesea import word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from scipy.sparse import hstack
from sklearn.preprocessing import OneHotEncoder
import pandas as pd
def clean_data(df):
# Chuyển đổi các cột số sang định dạng đúng (đề phòng lỗi kiểu dữ liệu)
    numeric_cols = ['price', 'ratingScore', 'itemSoldCntShow', 'discount']
    df[numeric_cols] = df[numeric_cols].apply(pd.to_numeric, errors='coerce')

# Xử lý các cột ID danh mục thành dạng chuỗi để tránh tính toán sai lệch
    cat_cols = ['cat_1', 'cat_2', 'cat_3']
    df[cat_cols] = df[cat_cols].astype(str)
    return df
def clean_product_name(text):
    if not isinstance(text, str):
        return ""
    
    # 1. Loại bỏ nội dung trong ngoặc đơn và chính dấu ngoặc
    # \([^)]*\) khớp với dấu ( + bất kỳ ký tự nào không phải ) + dấu )
    text = re.sub(r'\([^)]*\)', '', text)
    
    # 2. Chuyển về chữ thường
    text = text.lower()
    
    # 3. Loại bỏ các ký tự đặc biệt còn lại (dấu : , . | - ...)
    # Để lại chữ cái, số và khoảng trắng
    text = re.sub(r'[^\w\s]', ' ', text)
    
    # 4. Loại bỏ khoảng trắng thừa
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text
def preprocess_vietnamese_text(text):
    # 1. Làm sạch (bỏ ngoặc, ký tự đặc biệt) như hàm bạn đã có
    cleaned = clean_product_name(text)
    
    # 2. Tách từ tiếng Việt
    tokenized = word_tokenize(cleaned, format="text")
    return tokenized
def calculate_cosine_sim(df):
    df['processed_name'] = df['name'].apply(preprocess_vietnamese_text)

# 3. Tính toán TF-IDF trên dữ liệu đã tách từ
    tfidf = TfidfVectorizer() 
    tfidf_matrix = tfidf.fit_transform(df['processed_name'])
    ohe = OneHotEncoder()
    cat_matrix = ohe.fit_transform(df[['cat_1', 'cat_2', 'cat_3']])


    combined_features = hstack([tfidf_matrix, cat_matrix])
    cosine_sim = cosine_similarity(combined_features,combined_features)
    return cosine_sim