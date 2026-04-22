import { ChangeEvent, FormEvent } from "react";
import styles from "./Header.module.css";
import { useNavigate } from "react-router-dom";
type Props = {
  query: string;
  onQueryChange: (q: string) => void;
  onSubmit?: () => void;
};

const Header = ({ query, onQueryChange, onSubmit }: Props) => {
  const navigate = useNavigate(); // <-- Khởi tạo hook

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    onQueryChange(e.target.value);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Chuyển hướng sang trang search kèm query parameter
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Hàng 1: Thanh điều hướng phụ phía trên (Top Nav) */}
        <nav className={styles.topNav}>
          <div className={styles.topNavLeft}>
            <a href="#">Kênh Người Bán</a>
            <span className={styles.divider}></span>
            <a href="#">Trở thành Người bán Shopee</a>
            <span className={styles.divider}></span>
            <a href="#">Tải ứng dụng</a>
            <span className={styles.divider}></span>
            <a href="#">Kết nối</a>
          </div>
          <div className={styles.topNavRight}>
            <a href="#">Thông Báo</a>
            <a href="#">Hỗ Trợ</a>
            <a href="#">Tiếng Việt</a>
            <span className={styles.divider}></span>
            <a href="#" className={styles.authLink}>
              Đăng Ký
            </a>
            <span className={styles.divider}></span>
            <a href="#" className={styles.authLink}>
              Đăng Nhập
            </a>
          </div>
        </nav>

        {/* Hàng 2: Phần tìm kiếm và Logo chính (Main Nav) */}
        <div className={styles.mainNav}>
          {/* Logo */}
          <a className={styles.logo} href="/" aria-label="Shoply home">
            <svg
              viewBox="0 0 30 30"
              className={styles.logoIcon}
              fill="currentColor"
            >
              <path d="M10 3.5h10l3.5 7v14a2 2 0 01-2 2H8.5a2 2 0 01-2-2v-14l3.5-7zm.8 7a4 4 0 008.4 0H10.8zM9.5 5l-2.5 5h16l-2.5-5h-11z" />
            </svg>
            <span className={styles.logoText}>Shoply</span>
          </a>

          {/* Ô Tìm Kiếm */}
          <div className={styles.searchSection}>
            <form
              className={styles.searchWrap}
              onSubmit={handleSubmit}
              role="search"
            >
              <div className={styles.searchBox}>
                <input
                  className={styles.searchInput}
                  type="search"
                  placeholder="Shopee bao ship 0Đ - Đăng ký ngay!"
                  value={query}
                  onChange={handleChange}
                  aria-label="Search products"
                />
                <button
                  className={styles.searchBtn}
                  type="submit"
                  aria-label="Tìm kiếm"
                >
                  <svg
                    height="15"
                    viewBox="0 0 19 19"
                    width="15"
                    fill="#ffffff"
                  >
                    <path d="M17.965 17.07l-4.576-4.576A7.447 7.447 0 0015 7.5 7.5 7.5 0 107.5 15a7.447 7.447 0 004.994-1.935l4.576 4.576.895-.895zM3 7.5a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z" />
                  </svg>
                </button>
              </div>
            </form>
            {/* Gợi ý dưới ô tìm kiếm */}
            <div className={styles.searchSuggestions}>
              <a href="#">Kính Gương</a>
              <a href="#">Áo Kiểu Babydoll</a>
              <a href="#">Dép Sục Crocs</a>
              <a href="#">Máy Quạt Cầm Tay</a>
              <a href="#">Bộ Quần Áo Ngủ Nữ Mùa Hè</a>
            </div>
          </div>

          {/* Giỏ Hàng */}
          <a href="#" className={styles.cartAction} aria-label="Cart">
            <svg
              viewBox="0 0 26.6 25.6"
              className={styles.cartIcon}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 1.7h3.8l3.6 15.8c.2 1.1 1.2 1.9 2.4 1.9h10c1.2 0 2.2-.8 2.4-1.9l2-9.7H7" />
              <circle cx="11.4" cy="23.4" r="1.5" />
              <circle cx="21.4" cy="23.4" r="1.5" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
