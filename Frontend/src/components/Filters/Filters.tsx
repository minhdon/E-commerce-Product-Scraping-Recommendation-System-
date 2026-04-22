import { ChangeEvent, useState } from "react";
import styles from "./Filters.module.css";

export type FilterState = {
  category: string | null;
  subCategory: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  minRating: number | null;
};

type Props = {
  value: FilterState;
  onChange: (next: FilterState) => void;
};

const Stars = ({ count }: { count: number }) => (
  <>
    {Array.from({ length: 5 }).map((_, i) => (
      <span
        key={i}
        className={`${styles.star} ${i >= count ? styles.starMuted : ""}`}
        aria-hidden
      >
        ★
      </span>
    ))}
  </>
);

const Filters = ({ value, onChange }: Props) => {
  const [minStr, setMinStr] = useState(
    value.minPrice !== null ? String(value.minPrice) : "",
  );
  const [maxStr, setMaxStr] = useState(
    value.maxPrice !== null ? String(value.maxPrice) : "",
  );

  const setCategory = (cat: string | null) =>
    onChange({ ...value, category: cat, subCategory: null });

  const setSub = (sub: string | null) =>
    onChange({ ...value, subCategory: sub });

  const setRating = (r: number | null) => onChange({ ...value, minRating: r });

  const applyPrice = () => {
    const min = minStr.trim() === "" ? null : Number(minStr);
    const max = maxStr.trim() === "" ? null : Number(maxStr);
    onChange({
      ...value,
      minPrice: Number.isFinite(min as number) ? (min as number) : null,
      maxPrice: Number.isFinite(max as number) ? (max as number) : null,
    });
  };

  const reset = () => {
    setMinStr("");
    setMaxStr("");
    onChange({
      category: null,
      subCategory: null,
      minPrice: null,
      maxPrice: null,
      minRating: null,
    });
  };

  const onlyDigits = (e: ChangeEvent<HTMLInputElement>) =>
    e.target.value.replace(/[^0-9.]/g, "");

  return (
    <aside className={styles.sidebar} aria-label="Product filters">
      <h2 className={styles.title}>Filters</h2>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Category</span>
        <ul className={styles.categoryList}>
          <li>
            <button
              type="button"
              className={`${styles.categoryItem} ${
                value.category === null ? styles.categoryActive : ""
              }`}
              onClick={() => setCategory(null)}
            >
              All categories
            </button>
          </li>
        </ul>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Price range</span>
        <div className={styles.priceRow}>
          <input
            className={styles.priceInput}
            inputMode="decimal"
            placeholder="Min"
            value={minStr}
            onChange={(e) => setMinStr(onlyDigits(e))}
            aria-label="Minimum price"
          />
          <span className={styles.priceDash}>—</span>
          <input
            className={styles.priceInput}
            inputMode="decimal"
            placeholder="Max"
            value={maxStr}
            onChange={(e) => setMaxStr(onlyDigits(e))}
            aria-label="Maximum price"
          />
        </div>
        <button type="button" className={styles.applyBtn} onClick={applyPrice}>
          Apply
        </button>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Rating</span>
        <div className={styles.ratingRow}>
          {[5, 4, 3, 2, 1].map((r) => (
            <button
              key={r}
              type="button"
              className={`${styles.ratingBtn} ${
                value.minRating === r ? styles.ratingActive : ""
              }`}
              onClick={() => setRating(value.minRating === r ? null : r)}
              aria-pressed={value.minRating === r}
            >
              <Stars count={r} />
              {r < 5 && <span className={styles.upText}>& up</span>}
            </button>
          ))}
        </div>
      </div>

      <button type="button" className={styles.resetBtn} onClick={reset}>
        Reset filters
      </button>
    </aside>
  );
};

export default Filters;
