import styles from "./ProductGrid.module.css";
import ProductCard from "../ProductCard/ProductCard";
import type { Product } from "../../data/products";

type Props = {
  products: Product[];
};

const ProductGrid = ({ products }: Props) => {
  if (products.length === 0) {
    return (
      <div className={styles.grid}>
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>No products match your filters</p>
          <p>Try clearing some filters or adjusting your search.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {products.map((p) => (
        <ProductCard key={p.itemId} product={p} />
      ))}
    </div>
  );
};

export default ProductGrid;
