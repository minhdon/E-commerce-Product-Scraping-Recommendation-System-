// src/hooks/useRecommendations.ts
import { useEffect, useState } from "react";
import type { Product } from "../data/products"; // Đảm bảo đúng đường dẫn

export const useRecommendations = (itemId: number | null) => {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!itemId) {
      setData([]);
      return;
    }

    const fetchRecs = async () => {
      setLoading(true);
      try {
        // Chỉ gọi 1 lần duy nhất, nhận về dữ liệu đã "chín"
        const res = await fetch(
          `http://127.0.0.1:8000/api/v1/recommend/${itemId}`,
        );
        if (!res.ok) throw new Error("Lỗi mạng khi gọi API");

        const result = await res.json();

        // Trích xuất mảng sản phẩm (tùy vào BE trả về 'recommendations' hay mảng trực tiếp)
        const products = Array.isArray(result)
          ? result
          : result.recommendations || [];

        setData(products);
      } catch (err: any) {
        setError(err.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecs();
  }, [itemId]);

  return { data, loading, error };
};
