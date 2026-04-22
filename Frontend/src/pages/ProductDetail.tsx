import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styles from "./ProductDetail.module.css";
import Header from "../components/Header/Header";
import ProductGrid from "../components/ProductGrid/ProductGrid";
import { type Product } from "../data/products";

const ProductDetail = () => {
  const { id } = useParams(); // Lấy ID từ URL: /product/123
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Khởi tạo dữ liệu lần đầu khi mới vào trang
  const [product, setProduct] = useState<Product | null>(
    location.state?.product || null,
  );

  // ==========================================
  // 🛠️ FIX LỖI Ở ĐÂY: Lắng nghe sự thay đổi của URL
  // Khi người dùng click vào SP gợi ý, location.state đổi -> Cập nhật lại product
  // ==========================================
  useEffect(() => {
    if (location.state?.product) {
      setProduct(location.state.product);
    }
  }, [location.state?.product]);

  // State cho phần Gợi ý
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Xử lý trường hợp người dùng F5 tải lại trang không có state
  useEffect(() => {
    if (!product && id) {
      // Trong thực tế bạn sẽ gọi fetch(`http://localhost:8000/products/${id}`) ở đây
      // Tạm thời đẩy về trang chủ nếu mất dữ liệu
      navigate("/");
    }
  }, [product, id, navigate]);

  // Gọi API Recommendations khi ID thay đổi (Kể cả khi bấm từ SP này sang SP khác)
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!id) return;
      setLoadingRecs(true);
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/recommend/${id}`,
        );
        const data = await response.json();
        setRecommendations(
          Array.isArray(data) ? data : data.recommendations || [],
        );
      } catch (error) {
        console.error("Lỗi fetch recommendations:", error);
      } finally {
        setLoadingRecs(false);
      }
    };

    fetchRecommendations();

    // Reset số lượng về 1 và cuộn lên đầu trang mỗi khi đổi sản phẩm
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (!product) return null;

  // Tính toán giá
  const hasDiscount = product.discount && product.discount > 0;
  const originalPrice = hasDiscount
    ? product.price / (1 - product.discount!)
    : product.price;

  return (
    <div className={styles.pageBackground}>
      <Header query="" onQueryChange={() => {}} />

      <main className={styles.container}>
        {/* ================= PHẦN 1: CHI TIẾT SẢN PHẨM ================= */}
        <div className={styles.productMainBlock}>
          {/* Cột trái: Hình ảnh */}
          <div className={styles.imageSection}>
            <img
              src={product.image}
              alt={product.name}
              className={styles.mainImage}
            />
          </div>

          {/* Cột phải: Thông tin */}
          <div className={styles.infoSection}>
            <h1 className={styles.productName}>
              {product.brandName && (
                <span className={styles.brandBadge}>Yêu thích</span>
              )}
              {product.name}
            </h1>

            <div className={styles.statsRow}>
              <div className={styles.rating}>
                <span className={styles.ratingNumber}>
                  {product.ratingScore || "5.0"}
                </span>
                <span className={styles.stars}>⭐⭐⭐⭐⭐</span>
              </div>
              <div className={styles.divider}></div>
              <div className={styles.sold}>
                <span className={styles.soldNumber}>
                  {product.itemSoldCntShow || 0}
                </span>{" "}
                Đã bán
              </div>
            </div>

            {/* Khối Giá Tiền */}
            <div className={styles.priceBlock}>
              {hasDiscount && (
                <span className={styles.originalPrice}>
                  ₫{originalPrice.toLocaleString("vi-VN")}
                </span>
              )}
              <span className={styles.currentPrice}>
                ₫{product.price.toLocaleString("vi-VN")}
              </span>
              {hasDiscount && (
                <span className={styles.discountBadge}>
                  {Math.round(product.discount! * 100)}% GIẢM
                </span>
              )}
            </div>

            {/* Chọn Số Lượng */}
            <div className={styles.quantitySection}>
              <span className={styles.sectionLabel}>Số Lượng</span>
              <div className={styles.quantityBox}>
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <input
                  type="text"
                  className={styles.qtyInput}
                  value={quantity}
                  readOnly
                />
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Nút Mua Hàng */}
            <div className={styles.actionButtons}>
              <button className={styles.addCartBtn}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                Thêm Vào Giỏ Hàng
              </button>
              <button className={styles.buyNowBtn}>Mua Ngay</button>
            </div>
          </div>
        </div>

        {/* ================= PHẦN 2: SẢN PHẨM GỢI Ý ================= */}
        <div className={styles.recommendationBlock}>
          <div className={styles.sectionHeader}>CÓ THỂ BẠN CŨNG THÍCH</div>

          {loadingRecs ? (
            <div className={styles.loading}>Đang tải gợi ý từ AI...</div>
          ) : recommendations.length > 0 ? (
            <ProductGrid products={recommendations} />
          ) : (
            <div className={styles.empty}>
              Chưa có dữ liệu gợi ý cho sản phẩm này.
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
