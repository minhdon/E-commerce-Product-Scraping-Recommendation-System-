import undetected_chromedriver as uc
import json
import time
import sys
import io
import os
import random

# Xử lý lỗi font tiếng Việt khi in ra Terminal
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

def setup_driver():
    print("🚀 Đang khởi động trình duyệt ngầm...")
    options = uc.ChromeOptions()
    
    # TRỌNG TÂM: Tạo thư mục lưu Profile (Cookie, Lịch sử...) để vượt Captcha
    profile_dir = os.path.join(os.getcwd(), "lazada_profile")
    options.user_data_dir = profile_dir 
    
    options.page_load_strategy = 'normal' 
    options.add_argument('--disable-gpu')
    
    # Tuyệt đối không bật headless khi đang nuôi profile/vượt captcha
    # options.add_argument('--headless') 
    
    driver = uc.Chrome(options=options, version_main=None) 
    driver.set_page_load_timeout(200)
    
    # Mở trang chủ làm nóng
    print("🌐 Đang mở trang chủ Lazada...")
    driver.get("https://www.lazada.vn/")
    print("⏳ Đang chờ 15 giây... NẾU HIỆN CAPTCHA, HÃY TỰ TAY KÉO THANH TRƯỢT NGAY BÂY GIỜ!")
    time.sleep(15) 
    
    return driver

def crawl_with_selenium(driver, keyword, max_pages=20):
    all_products = []
    
    for page in range(1, max_pages + 1):
        print(f"\n🔄 Đang lấy {keyword} - Trang {page}...")
        url = f"https://www.lazada.vn/catalog/?page={page}&q={keyword}"
        
        try:
            driver.get(url)
            
            # Nghỉ ngẫu nhiên từ 5 đến 8 giây để giống người thật
            sleep_time = random.uniform(5.0, 8.0)
            print(f"⏳ Đang lướt chậm {sleep_time:.2f}s để tránh bị block...")
            time.sleep(sleep_time)
            
            # Cuộn chuột xuống một chút để tạo tương tác giả
            driver.execute_script("window.scrollTo(0, 500);")
            time.sleep(1)
            
            # Móc dữ liệu thẳng từ biến JavaScript của Lazada
            page_data = driver.execute_script("return window.pageData;")
            
            if page_data and 'mods' in page_data and 'listItems' in page_data['mods']:
                items = page_data['mods']['listItems']
                
                if items:
                    all_products.extend(items)
                    print(f"  ↳ ✅ Lấy được {len(items)} sản phẩm.")
                else:
                    print("  ↳ ⚠️ Trang này không có sản phẩm nào, dừng cào.")
                    break
            else:
                print("  ↳ ❌ Không tìm thấy dữ liệu. Có thể bị dính Captcha, kiểm tra lại trình duyệt!")
                break
                
        except Exception as e:
            print(f"  ↳ ❌ Lỗi khi cào trang {page}: {e}")
            break
            
    return all_products

if __name__ == "__main__":
    keyword_to_search = os.getenv("SEARCH_KEYWORD", "dien thoai")
    keyword_to_search = keyword_to_search.replace('"', '').replace("'", "").strip()
    
    # 1. Khởi tạo trình duyệt (Có lưu Profile)
    driver = setup_driver()
    
    try:
        # 2. Dùng chính trình duyệt đó đi cào dữ liệu
        products = crawl_with_selenium(driver, keyword_to_search, max_pages=20)
        
        # 3. Lưu dữ liệu
        if products:
            # Đảm bảo thư mục tồn tại trước khi lưu
            os.makedirs("crawler/data/JSON", exist_ok=True)
            
            file_path = f"crawler/data/JSON/{keyword_to_search}.json"
            with open(file_path, "w", encoding="utf-8") as f:
                json.dump(products, f, ensure_ascii=False, indent=4)
                
            print(f"\n🎉 TỔNG KẾT: Đã cào {len(products)} sản phẩm và lưu tại {file_path}")
        else:
            print("\n😭 Không cào được sản phẩm nào.")
            
    finally:
        # 4. Tắt trình duyệt sau khi làm xong MỌI THỨ
        print("🛑 Đang đóng trình duyệt và dọn dẹp RAM...")
        driver.quit()