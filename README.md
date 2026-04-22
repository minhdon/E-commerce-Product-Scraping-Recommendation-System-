# E-commerce Product Scraping & Recommendation System (Lazada)

## 1. Tổng quan dự án
Dự án này là một hệ thống dữ liệu toàn diện (End-to-End Data System) được thiết kế để tự động hóa việc thu thập, xử lý, trực quan hóa và khai thác dữ liệu từ nền tảng thương mại điện tử Lazada. Không chỉ dừng lại ở việc trích xuất thông tin, hệ thống còn tích hợp một công cụ gợi ý sản phẩm (Recommendation Engine) và một giao diện web trực quan để người dùng có thể tìm kiếm và nhận đề xuất sản phẩm theo thời gian thực.

## 2. Tính năng chính
* **ETL Pipeline tự động:** Thu thập hàng ngàn sản phẩm mỗi ngày, có khả năng vượt qua các cơ chế chống bot (anti-bot measures) của trang web.
* **Chuẩn hóa dữ liệu nâng cao:** Xử lý và làm sạch các chuỗi dữ liệu phức tạp đặc thù của thị trường Việt Nam (ví dụ: bóc tách chuỗi tiền tệ VNĐ, quy đổi chính xác các hậu tố định dạng số như "K" thành giá trị float trên toàn bộ dataset).
* **Trực quan hóa dữ liệu (BI):** Hệ thống Dashboard Power BI cung cấp cái nhìn sâu sắc về xu hướng giá cả, phân bổ danh mục và biến động thị trường.
* **Hệ thống gợi ý sản phẩm:** Ứng dụng thuật toán học máy (Content-based filtering) để đề xuất các mặt hàng liên quan dựa trên đặc trưng văn bản và phân cấp danh mục.
* **Giao diện Web thời gian thực:** Cổng tìm kiếm và hiển thị sản phẩm được đóng gói gọn gàng bằng React và FastAPI.

## 3. Công nghệ sử dụng
* **Thu thập & Xử lý dữ liệu (Data Engineering):** Python (Selenium), Pandas, n8n.
* **Lưu trữ (Database):** MySQL.
* **Học máy (Machine Learning):** Scikit-learn (Cosine Similarity).
* **Trực quan hóa (Data Visualization):** Power BI.
* **Phát triển Web (Full-stack):** FastAPI (Backend), React - TSX (Frontend).
* **Triển khai (Deployment):** Docker.

## 4. Kiến trúc hệ thống & Quy trình (Architecture & Workflow)

### 4.1. Data Acquisition & ETL (Thu thập và xử lý dữ liệu)
* **Web Scraping:** Kịch bản Selenium được tối ưu hóa để chạy nền, tự động điều hướng và thu thập thông tin sản phẩm (Tên, Giá, Đánh giá, Mô tả, Danh mục) mà không bị chặn.
* **Data Pipeline:** Sử dụng **n8n** để điều phối workflow. Dữ liệu thô sau đó được Pandas xử lý (loại bỏ giá trị null, ép kiểu dữ liệu định dạng tiền tệ) và nạp (Load) vào cơ sở dữ liệu MySQL một cách có hệ thống.

### 4.2. Trực quan hóa dữ liệu (Data Analytics)
* Kết nối trực tiếp từ MySQL vào Power BI để xây dựng các mô hình dữ liệu (Data Modeling).
* Cung cấp các biểu đồ động giúp theo dõi phân khúc giá, tỷ lệ sản phẩm theo ngành hàng và hiệu suất đánh giá của người dùng.

### 4.3. Mô hình gợi ý (Recommendation Engine)
* **Thuật toán:** Content-Based Filtering.
* **Phương pháp:** Chuyển đổi mô tả sản phẩm và danh mục thành các vector đặc trưng (Feature Vectors). Sử dụng **Cosine Similarity** để tính toán khoảng cách giữa các vector, từ đó tìm ra top các sản phẩm có độ tương đồng cao nhất với sản phẩm mà người dùng đang xem.

### 4.4. Web Application (Ứng dụng Web)
* Ứng dụng kiến trúc Microservices cơ bản. Backend **FastAPI** xử lý các truy vấn vào CSDL và gọi mô hình gợi ý, sau đó trả về kết quả qua RESTful API cho Frontend **React (TSX)** hiển thị giao diện người dùng thân thiện.
* Toàn bộ hệ thống được container hóa bằng **Docker** để đảm bảo tính đồng nhất trên mọi môi trường.

