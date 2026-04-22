import styles from "./ProductCard.module.css";
import type { Product } from "../../data/products";
import { formatPrice, formatSold } from "../../lib/format";
import { useNavigate } from "react-router-dom";

type Props = {
  product: Product;
  compact?: boolean;
};

const ProductCard = ({ product, compact }: Props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Chuyển hướng sang trang chi tiết
    navigate(`/product/${product.itemId}`, {
      state: { product },
    });
  };

  return (
    <article
      className={`${styles.card} ${compact ? styles.compact : ""}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`${product.name}, ${formatPrice(product.price)}`}
    >
      <div className={styles.imageWrap}>
        <img
          className={styles.image}
          src={product.image}
          alt={product.name}
          loading="lazy"
        />
      </div>
      <div className={styles.body}>
        <h3 className={styles.name}>{product.name}</h3>

        <div className={styles.metaRow}>
          <span className={styles.star} aria-hidden>
            ★
          </span>
          <span>
            {product.ratingScore ? product.ratingScore.toFixed(1) : "0.0"}
          </span>
        </div>

        <div className={styles.footerRow}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          <span className={styles.sold}>
            {formatSold(product.itemSoldCntShow || 0)}
          </span>
        </div>

        {product.discount !== null && product.discount > 0 && (
          <div
            className={styles.discountBadge}
            aria-label={`Giảm giá ${Math.floor(product.discount * 100)}%`}
          >
            <span className={styles.discountMinus}>-</span>
            <span className={styles.discountPercent}>
              {Math.floor(product.discount * 100)}
            </span>
            <span className={styles.discountSymbol}>%</span>
          </div>
        )}
      </div>
    </article>
  );
};

export default ProductCard;
