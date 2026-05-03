import torch
from pathlib import Path
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from sentence_transformers import SentenceTransformer

# 1. Xác định đường dẫn tới thư mục models
BASE_DIR = Path(__file__).resolve().parent.parent
SPAM_MODEL_PATH = BASE_DIR / "models" / "spam_classifier"
SBERT_MODEL_PATH = BASE_DIR / "models" / "vietnamese_sbert"

class CommentAnalyzer:
    def __init__(self):
        # --- 2. Tải model Spam Classifier (Hugging Face) ---
        self.spam_tokenizer = None
        self.spam_model = None
        
        if SPAM_MODEL_PATH.exists():
            try:
                print("⏳ Đang nạp model spam_classifier...")
                self.spam_tokenizer = AutoTokenizer.from_pretrained(str(SBERT_MODEL_PATH))
                self.spam_model = AutoModelForSequenceClassification.from_pretrained(str(SPAM_MODEL_PATH))
                print("✅ Đã nạp xong model spam_classifier")
            except Exception as e:
                print(f"⚠️ Lỗi nạp model spam_classifier: {e}")

        # --- 3. Tải model Vietnamese SBERT ---
        self.sbert_model = None
        if SBERT_MODEL_PATH.exists():
            try:
                print("⏳ Đang nạp model Vietnamese SBERT...")
                self.sbert_model = SentenceTransformer(str(SBERT_MODEL_PATH))
                print("✅ Đã nạp xong model Vietnamese SBERT")
            except Exception as e:
                print(f"⚠️ Lỗi nạp Vietnamese SBERT: {e}")

    def analyze(self, comment_text: str):
        result = {
            "text": comment_text,
            "is_spam": False,
            "embedding": []
        }

        # --- DỰ ĐOÁN SPAM ---
        if self.spam_model and self.spam_tokenizer:
            try:
                # Tokenize dữ liệu đầu vào
                inputs = self.spam_tokenizer(
                    comment_text, 
                    return_tensors="pt", 
                    truncation=True, 
                    max_length=256
                )
                
                # Dự đoán không tính gradient để tiết kiệm RAM
                with torch.no_grad():
                    outputs = self.spam_model(**inputs)
                
                # Lấy class có điểm cao nhất
                logits = outputs.logits
                predicted_class_id = torch.argmax(logits, dim=-1).item()
                
                # Thường class 1 là Spam, class 0 là bình thường (tùy thuộc lúc bạn train)
                result["is_spam"] = bool(predicted_class_id == 1)
            except Exception as e:
                print(f"⚠️ Lỗi khi dự đoán spam: {e}")

        # --- TRÍCH XUẤT VECTOR (EMBEDDING) ---
        if self.sbert_model:
            try:
                embedding = self.sbert_model.encode(comment_text)
                result["embedding"] = embedding.tolist()
            except Exception as e:
                print(f"⚠️ Lỗi khi trích xuất vector: {e}")

        return result

# Khởi tạo một instance duy nhất để dùng chung
analyzer = CommentAnalyzer()
# =====================================================================
# ĐOẠN CODE NÀY CHỈ CHẠY KHI BẠN TEST TRỰC TIẾP FILE NÀY TRÊN TERMINAL
# Khi chạy qua FastAPI (Docker), đoạn này sẽ tự động bị bỏ qua.
# =====================================================================
if __name__ == "__main__":
    print("\n" + "="*50)
    print("🚀 BẮT ĐẦU TEST MODEL TRỰC TIẾP TRÊN MAC")
    print("="*50 + "\n")

    # Danh sách các bình luận bạn muốn test
    test_comments = [
        # 1. Bình luận bình thường (Khen)
        "Sản phẩm quá tuyệt vời, đóng gói cẩn thận, shipper giao hàng rất nhanh. Sẽ ủng hộ shop dài dài!",
        
        # 2. Bình luận bình thường (Chê nhưng không phải rác)
        "Áo chất liệu nilon mặc rất nóng, đường chỉ may bị bục mấy chỗ. Hơi thất vọng về sản phẩm.",
        
        # 3. Bình luận Spam (Quảng cáo)
        "Nhận ngay voucher 500k khi truy cập vào nhóm Zalo 093xxx, việc nhẹ lương cao, làm tại nhà!!!",
        
        # 4. Bình luận Spam (Chửi bới/Phản cảm - Tùy thuộc data bạn train)
        "Đm shop làm ăn lừa đảo à, gửi hàng rác rưởi cho bố mày."
    ]

    for i, text in enumerate(test_comments, 1):
        print(f"\n[{i}] Đang phân tích: '{text}'")
        
        # Gọi hàm analyze của model
        result = analyzer.analyze(text)
        
        # In kết quả thật đẹp ra màn hình
        is_spam_text = "🚫 SPAM (Rác)" if result["is_spam"] else "✅ BÌNH THƯỜNG"
        print(f"   -> Kết luận: {is_spam_text}")
        
        # Chỉ in 5 số đầu tiên của vector để màn hình đỡ bị rối
        if result["embedding"]:
            vector_preview = [round(num, 4) for num in result["embedding"][:5]]
            print(f"   -> Vector (SBERT): {vector_preview} ... (chiều dài: {len(result['embedding'])})")
        else:
            print("   -> Vector: Không trích xuất được")

    print("\n" + "="*50)
    print("✅ TEST HOÀN TẤT!")
    print("="*50 + "\n")