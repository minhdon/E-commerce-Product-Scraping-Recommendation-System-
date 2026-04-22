import { useEffect } from "react";
import styles from "./ProductModal.module.css";
// Nhớ trỏ đúng đường dẫn tới file chứa Interface mới của bạn nhé
import type { Product } from "../../data/products";
import { formatPrice, formatSold } from "../../lib/format";
import ProductCard from "../ProductCard/ProductCard";
import { useRecommendations } from "../../hooks/useRecommendations";

type Props = {
  product: Product | null;
  onClose: () => void;
  onSelectProduct: (p: Product) => void;
};

const ProductModal = ({ product, onClose, onSelectProduct }: Props) => {
  // 1. Đổi product?.id thành product?.itemId cho khớp API
  const recs = useRecommendations(product?.itemId ?? null);

  useEffect(() => {
    if (!product) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [product, onClose]);

  if (!product) return null;

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
    >
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <div className={styles.top}>
          <div className={styles.imageCol}>
            <img src={product.image} alt={product.name} />
          </div>
          <div className={styles.detailsCol}>
            {/* Đã xóa phần hiển thị Category theo yêu cầu */}

            <h2 id="product-modal-title" className={styles.title}>
              {product.name}
            </h2>

            {/* Thêm thông tin Cửa hàng / Thương hiệu (Nếu có) */}
            {(product.brandName || product.sellerName) && (
              <div
                style={{
                  fontSize: "13px",
                  color: "#666",
                  marginBottom: "10px",
                }}
              >
                {product.brandName && (
                  <span>
                    Thương hiệu: <strong>{product.brandName}</strong>{" "}
                  </span>
                )}
                {product.sellerName && (
                  <span>
                    | Cung cấp bởi: <strong>{product.sellerName}</strong>
                  </span>
                )}
              </div>
            )}

            <div className={styles.metaRow}>
              <span className={styles.ratingPill}>
                <span className={styles.star} aria-hidden>
                  ★
                </span>
                {/* 2. Đổi rating thành ratingScore và xử lý null */}
                {product.ratingScore ? product.ratingScore.toFixed(1) : "0.0"}
              </span>
              {/* 3. Đổi sold thành itemSoldCntShow */}
              <span>{formatSold(product.itemSoldCntShow || 0)}</span>
            </div>

            <div className={styles.priceBlock}>
              <div className={styles.priceLabel}>Price</div>
              <div className={styles.price}>
                {formatPrice(product.price)}
                {/* Hiển thị thêm badge giảm giá nếu có */}
                {product.discount !== null && product.discount > 0 && (
                  <span
                    style={{
                      color: "#ff4747",
                      fontSize: "16px",
                      marginLeft: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    -{Math.floor(product.discount * 100)}%
                  </span>
                )}
              </div>
            </div>

            {/* Đã xóa thẻ description vì API hiện tại chưa có trường này */}

            <div className={styles.actions}>
              <button type="button" className={styles.btnGhost}>
                Add to Cart
              </button>
              <button type="button" className={styles.btnPrimary}>
                Buy Now
              </button>
            </div>
          </div>
        </div>

        <section
          className={styles.recommendSection}
          aria-label="Recommended items"
        >
          <header className={styles.recommendHeader}>
            <h3 className={styles.recommendTitle}>You May Also Like</h3>
            {recs.loading && (
              <span className={styles.recommendStatus}>Loading…</span>
            )}
            {recs.error && (
              <span className={styles.recommendError}>
                Couldn't reach recommendation service ({recs.error})
              </span>
            )}
          </header>

          {recs.loading && (
            <div className={styles.scroller}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className={styles.skeletonCard} />
              ))}
            </div>
          )}

          {!recs.loading && recs.data && recs.data.length > 0 && (
            <div className={styles.scroller}>
              {recs.data.map((p) => (
                // 4. Đổi key p.id thành p.itemId
                <div key={p.itemId} className={styles.scrollerItem}>
                  <ProductCard product={p} compact onClick={onSelectProduct} />
                </div>
              ))}
            </div>
          )}

          {!recs.loading &&
            (!recs.data || recs.data.length === 0) &&
            !recs.error && (
              <div className={styles.emptyRec}>
                No recommendations available for this item yet.
              </div>
            )}
        </section>
      </div>
    </div>
  );
};

export default ProductModal;
