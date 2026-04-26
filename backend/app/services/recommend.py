import pandas as pd
from scipy.sparse import hstack
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import OneHotEncoder
# ... (các hàm clean_data, clean_product_name, preprocess_vietnamese_text bạn giữ nguyên)
from app.services.processor import clean_data,calculate_cosine_sim,clean_product_name,preprocess_vietnamese_text
class RecommenderSystem:
    def __init__(self, data_path):
        self.df = pd.read_csv(data_path)
        self.df = clean_data(self.df)
        self.tfidf = TfidfVectorizer()
        self.ohe = OneHotEncoder()
        self.cosine_sim = None
        self._fit_model()

    def _fit_model(self):
        # 1. Tiền xử lý văn bản
        self.df['processed_name'] = self.df['name'].apply(preprocess_vietnamese_text)
        
        # 2. Xây dựng ma trận đặc trưng
        tfidf_matrix = self.tfidf.fit_transform(self.df['processed_name'])
        cat_matrix = self.ohe.fit_transform(self.df[['cat_1', 'cat_2', 'cat_3']])
        
        # Kết hợp và tính ma trận tương đồng
        combined_features = hstack([tfidf_matrix, cat_matrix])
        self.cosine_sim = cosine_similarity(combined_features, combined_features)

    def get_recommendations(self, item_id, top_n=8):
        # Tìm chỉ số dựa trên itemId
        idx_list = self.df.index[self.df['itemId'] == item_id].tolist()
        if not idx_list: return None
        idx = idx_list[0]
        
        # Lấy điểm số
        sim_scores = list(enumerate(self.cosine_sim[idx]))
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)[1:top_n+1]
        
        indices = [i[0] for i in sim_scores]
        return self.df.iloc[indices]