import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./SearchResult.module.css";
import Header from "../components/Header/Header";
import ProductGrid from "../components/ProductGrid/ProductGrid";
import { type Product } from "../data/products";
import { formatCategoryName } from "@/utils/format";
const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";

  const [query, setQuery] = useState(q);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // 1. STATE LƯU TRỮ BỘ LỌC
  // ==========================================
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number | null>(null);

  // State cho khoảng giá
  const [priceInput, setPriceInput] = useState({ min: "", max: "" });
  const [appliedPrice, setAppliedPrice] = useState<{
    min: number | null;
    max: number | null;
  }>({ min: null, max: null });

  // ==========================================
  // 2. FETCH DỮ LIỆU TỪ BACKEND
  // ==========================================
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8000/products/?skip=0&limit=100&search=${encodeURIComponent(q)}`,
        );
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : data.products || []);
      } catch (error) {
        console.error("Lỗi fetch search:", error);
      } finally {
        setLoading(false);
      }
    };
    if (q) fetchResults();
  }, [q]);

  // ==========================================
  // 3. TỰ ĐỘNG TẠO DANH SÁCH BỘ LỌC TỪ DỮ LIỆU THỰC TẾ
  // ==========================================
  const availableLocations = Array.from(
    new Set(products.map((p) => p.location).filter(Boolean)),
  ) as string[];
  const availableCategories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean)),
  ) as string[];
  const availableBrands = Array.from(
    new Set(products.map((p) => p.brandName).filter(Boolean)),
  ) as string[];

  // ==========================================
  // 4. LOGIC LỌC DỮ LIỆU (Chạy tự động khi state thay đổi)
  // ==========================================
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Lọc theo Nơi bán
      if (
        selectedLocations.length > 0 &&
        (!p.location || !selectedLocations.includes(p.location))
      )
        return false;

      // Lọc theo Danh mục
      if (
        selectedCategories.length > 0 &&
        (!p.category || !selectedCategories.includes(p.category))
      )
        return false;

      // Lọc theo Thương hiệu
      if (
        selectedBrands.length > 0 &&
        (!p.brandName || !selectedBrands.includes(p.brandName))
      )
        return false;

      // Lọc theo Đánh giá (Số sao)
      if (minRating !== null && (!p.ratingScore || p.ratingScore < minRating))
        return false;

      // Lọc theo Khoảng giá
      if (appliedPrice.min !== null && p.price < appliedPrice.min) return false;
      if (appliedPrice.max !== null && p.price > appliedPrice.max) return false;

      return true; // Nếu qua được hết các trạm kiểm tra trên thì cho phép hiển thị
    });
  }, [
    products,
    selectedLocations,
    selectedCategories,
    selectedBrands,
    minRating,
    appliedPrice,
  ]);

  // Hàm hỗ trợ Tick/Bỏ tick Checkbox
  const toggleCheckbox = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    value: string,
  ) => {
    setter((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  // Hàm xử lý khi bấm nút "ÁP DỤNG" giá
  const handleApplyPrice = () => {
    setAppliedPrice({
      min: priceInput.min ? Number(priceInput.min) : null,
      max: priceInput.max ? Number(priceInput.max) : null,
    });
  };

  return (
    <div className={styles.pageBackground}>
      <Header query={query} onQueryChange={setQuery} />

      <main className={styles.searchContainer}>
        {/* ================= CỘT TRÁI: BỘ LỌC ================= */}
        <aside className={styles.filterSidebar}>
          <h2 className={styles.filterTitle}>
            <svg viewBox="0 0 15 15" x="0" y="0" className={styles.filterIcon}>
              <path
                d="m15 5.1-6.1 6.1v3.4c0 .3-.2.5-.5.5h-2c-.3 0-.5-.2-.5-.5v-3.4l-5.9-6v-5.1h15z"
                fill="currentColor"
              ></path>
            </svg>
            BỘ LỌC TÌM KIẾM
          </h2>

          {/* LỌC THEO DANH MỤC */}
          {availableCategories.length > 0 && (
            <div className={styles.filterGroup}>
              <h3>Theo Danh Mục</h3>
              {availableCategories.slice(0, 5).map((cat) => (
                <label key={cat}>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCheckbox(setSelectedCategories, cat)}
                  />
                  {formatCategoryName(cat)}
                </label>
              ))}
            </div>
          )}

          {/* LỌC THEO NƠI BÁN */}
          {availableLocations.length > 0 && (
            <div className={styles.filterGroup}>
              <h3>Nơi Bán</h3>
              {availableLocations.slice(0, 5).map((loc) => (
                <label key={loc}>
                  <input
                    type="checkbox"
                    checked={selectedLocations.includes(loc)}
                    onChange={() => toggleCheckbox(setSelectedLocations, loc)}
                  />
                  {loc}
                </label>
              ))}
            </div>
          )}

          {/* LỌC THEO THƯƠNG HIỆU */}
          {availableBrands.length > 0 && (
            <div className={styles.filterGroup}>
              <h3>Thương Hiệu</h3>
              {availableBrands.slice(0, 5).map((brand) => (
                <label key={brand}>
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleCheckbox(setSelectedBrands, brand)}
                  />
                  {brand}
                </label>
              ))}
            </div>
          )}

          {/* LỌC THEO KHOẢNG GIÁ */}
          <div className={styles.filterGroup}>
            <h3>Khoảng Giá</h3>
            <div className={styles.priceRangeInputs}>
              <input
                type="number"
                placeholder="₫ TỪ"
                value={priceInput.min}
                onChange={(e) =>
                  setPriceInput((prev) => ({ ...prev, min: e.target.value }))
                }
              />
              <span> - </span>
              <input
                type="number"
                placeholder="₫ ĐẾN"
                value={priceInput.max}
                onChange={(e) =>
                  setPriceInput((prev) => ({ ...prev, max: e.target.value }))
                }
              />
            </div>
            <button className={styles.applyBtn} onClick={handleApplyPrice}>
              ÁP DỤNG
            </button>
          </div>

          {/* LỌC THEO ĐÁNH GIÁ */}
          <div className={styles.filterGroup}>
            <h3>Đánh Giá</h3>
            <label>
              <input
                type="radio"
                name="rating"
                checked={minRating === 5}
                onChange={() => setMinRating(5)}
              />{" "}
              ⭐⭐⭐⭐⭐
            </label>
            <label>
              <input
                type="radio"
                name="rating"
                checked={minRating === 4}
                onChange={() => setMinRating(4)}
              />{" "}
              ⭐⭐⭐⭐ trở lên
            </label>
            <label>
              <input
                type="radio"
                name="rating"
                checked={minRating === 3}
                onChange={() => setMinRating(3)}
              />{" "}
              ⭐⭐⭐ trở lên
            </label>
            <button
              className={styles.showMoreBtn}
              onClick={() => setMinRating(null)}
              style={{ marginTop: 10 }}
            >
              Xóa lọc đánh giá
            </button>
          </div>
        </aside>

        {/* ================= CỘT PHẢI: KẾT QUẢ ================= */}
        <section className={styles.mainContent}>
          <div className={styles.searchHeaderArea}>
            <div className={styles.searchTitle}>
              <span className={styles.bulbIcon}>💡</span>
              Kết quả tìm kiếm cho từ khoá '<span>{q}</span>'
            </div>
          </div>

          {/* Thanh Sắp Xếp (Giao diện) */}
          <div className={styles.sortBar}>
            <span className={styles.sortLabel}>Sắp xếp theo</span>
            <button className={`${styles.sortBtn} ${styles.active}`}>
              Liên Quan
            </button>
            <button className={styles.sortBtn}>Mới Nhất</button>
            <button className={styles.sortBtn}>Bán Chạy</button>
          </div>

          {/* Lưới Sản Phẩm - Đã truyền mảng `filteredProducts` thay vì `products` */}
          <div className={styles.productGridWrapper}>
            {loading ? (
              <div style={{ padding: 40, textAlign: "center" }}>
                Đang tìm kiếm...
              </div>
            ) : filteredProducts.length > 0 ? (
              <ProductGrid products={filteredProducts} onSelect={() => {}} />
            ) : (
              <div
                style={{
                  padding: 40,
                  textAlign: "center",
                  backgroundColor: "#fff",
                }}
              >
                Không tìm thấy sản phẩm nào phù hợp với bộ lọc.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default SearchResults;
