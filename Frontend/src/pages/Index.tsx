import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Index.module.css";
import Header from "../components/Header/Header";
import ProductGrid from "../components/ProductGrid/ProductGrid";
import { type Product } from "../data/products";
import { formatSold } from "../lib/format";

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  // Lấy 10 sản phẩm bán chạy nhất
  const topProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    return [...products]
      .sort((a, b) => {
        const soldA = a.itemSoldCntShow || 0;
        const soldB = b.itemSoldCntShow || 0;
        return soldB - soldA;
      })
      .slice(0, 10);
  }, [products]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        let url = `http://localhost:8000/products/?skip=0&limit=100`;
        if (query.trim()) {
          url += `&search=${encodeURIComponent(query.trim())}`;
        }
        const response = await fetch(url);
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : data.products || []);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, [query]);

  return (
    <div className={styles.pageBackground}>
      <Header query={query} onQueryChange={setQuery} />

      <main className={styles.mainContainer}>
        {/* TÌM KIẾM HÀNG ĐẦU */}
        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeaderWrapper}>
            <div className={styles.sectionHeaderOrange}>TÌM KIẾM HÀNG ĐẦU</div>
            <a href="#" className={styles.seeAll}>
              Xem Tất Cả {">"}
            </a>
          </div>

          <div className={styles.topSearchScroller}>
            {topProducts.map((product) => (
              <div
                key={product.itemId}
                className={styles.topSearchCard}
                // CHUYỂN TRANG KHI CLICK VÀO CARD TOP SEARCH
                onClick={() =>
                  navigate(`/product/${product.itemId}`, {
                    state: { product },
                  })
                }
              >
                <div className={styles.topBadge}>TOP</div>
                <div className={styles.topImageWrap}>
                  <img src={product.image} alt={product.name} />
                  <div className={styles.salesBar}>
                    Bán {formatSold(product.itemSoldCntShow) || 0} / tháng
                  </div>
                </div>
                <div className={styles.topSearchName}>{product.name}</div>
              </div>
            ))}
          </div>
        </section>

        {/* GỢI Ý HÔM NAY */}
        <section className={styles.dailyDiscoverBlock}>
          <div className={styles.stickySectionHeader}>
            <h2 className={styles.dailyDiscoverTitle}>GỢI Ý HÔM NAY</h2>
          </div>

          {loading ? (
            <div className={styles.loader}>Đang tải dữ liệu...</div>
          ) : (
            <ProductGrid products={products} />
          )}
        </section>
      </main>
    </div>
  );
};

export default Index;
