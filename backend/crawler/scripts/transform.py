import json
import ast
import os
import ast
import pandas as pd

# Giữ nguyên hàm process_cats của bạn
def process_cats(cat_str):
    try:
        cat_list = ast.literal_eval(cat_str)
        cat_list.reverse() 
        return cat_list
    except:
        return []
def preprocessing(df):
    df_null=df[df["itemSoldCntShow"].isnull() & df["discount"].isnull() & df["ratingScore"].isnull() & df["review"].isnull()]
    df = df.drop(df_null.index)
    df["review"].fillna(0, inplace=True)
    df["itemSoldCntShow"] = df["itemSoldCntShow"].fillna(0)
    df["discount"] = df["discount"].fillna(0)
    df["ratingScore"] = pd.to_numeric(df["ratingScore"], errors='coerce')
    df["itemSoldCntShow"] = df["itemSoldCntShow"].astype(str).apply(lambda x: float(x.replace('Đã bán', '').replace('sold', '').replace('K', '').strip()) * 1000 if 'K' in x else float(x.replace('Đã bán', '').replace('sold', '').strip() or 0))
    df["discount"] = df["discount"].str.replace("%", "").str.replace("Off","").astype(float)/100
    df["discount"] = df["discount"].fillna(0)
    df["ratingScore"] = df["ratingScore"].fillna(df["ratingScore"].mean())
    df["ratingScore"] = df["ratingScore"].round(1)
    df['cat_list'] = df['categories'].apply(process_cats)
    df['categories'] = df['categories'].apply(lambda x: ast.literal_eval(x) if isinstance(x, str) else x)

# 2. Bây giờ mới tách thành DataFrame mới
    split_data = pd.DataFrame(df['categories'].tolist(), index=df.index)

# 3. Chỉ lấy tối đa 3 cột đầu và đặt tên (phòng trường hợp list có nhiều hơn 3 phần tử)
    split_data = split_data.iloc[:, :3]
    split_data.columns = ['cat_1', 'cat_2', 'cat_3']

# 4. Ghi đè vào DataFrame chính, điền 0 vào chỗ trống và ép kiểu int
    df[['cat_1', 'cat_2', 'cat_3']] = split_data.fillna(0).astype(int)

# 4. Xóa cột trung gian và lưu lại
    df = df.drop(columns=['cat_list'])
    df["cat_2"]=df["cat_2"].fillna(0)
    df["cat_3"]=df["cat_3"].fillna(0)
    return df
def convert_json_to_csv(keyword):
    # Sửa lại đường dẫn dùng abspath để chạy được cả trên terminal lẫn jupyter
    base_dir = os.path.dirname(os.path.abspath(__file__))
    json_path = os.path.join(base_dir, "..", "data", "JSON", f"{keyword}.json")
    csv_path = os.path.join(base_dir, "..", "data", "CSV", f"{keyword}.csv")

    if not os.path.exists(json_path):
        print(f"❌ Không tìm thấy file: {json_path}")
        return
 
    # 1. Đọc JSON
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # 2. Đưa vào DataFrame để Preprocessing
    df_raw = pd.DataFrame(data)
    
    # Chỉ lấy các cột "vàng" bạn đã định nghĩa
    headers = [
        'itemId', 'name', 'price', 'ratingScore', 
        'review', 'location', 'brandName', 'sellerName', 'image', "categories", 'itemSoldCntShow', "discount"
    ]
    # Đảm bảo df chỉ chứa các cột này (tránh lỗi thừa cột)
    df_raw = df_raw[headers]

    # 3. CHÈN BƯỚC PREPROCESSING VÀO ĐÂY
    df_clean = preprocessing(df_raw)
    df_clean['category'] = keyword

    # 4. Xuất ra CSV (Dùng pandas xuất luôn cho nhanh và chuẩn)
    # Lưu ý: preprocessing của bạn tạo thêm cat_1, cat_2, cat_3 nên dùng df_clean.to_csv
    df_clean.to_csv(csv_path, index=False, encoding='utf-8-sig')

    print(f"✅ Đã tiền xử lý và chuyển đổi thành công! Check file tại: {csv_path}")

if __name__ == "__main__":
    keyword = os.getenv("TRANSFORM_KEYWORD", "dien thoai")
    convert_json_to_csv(keyword)