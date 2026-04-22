// src/utils/formatters.ts

// 1. Tạo một từ điển (Dictionary) chứa các cặp Key - Value
export const CATEGORY_MAP: Record<string, string> = {
  thuc_pham: "Thực phẩm",
  thoi_trang_nu: "Thời trang nữ",
  thoi_trang_nam: "Thời trang nam",
  my_pham: "Mỹ phẩm",
  dien_tu: "Điện tử",
  do_gia_dung: "Đồ gia dụng",
  me_va_be: "Mẹ & bé",
  phu_kien_thoi_trang: "Phụ kiện thời trang",
  cham_soc_suc_khoe: "Chăm sóc sức khỏe",
  the_thao: "Thể thao",
};

// 2. Tạo hàm chuyển đổi an toàn
export const formatCategoryName = (
  rawCategory: string | null | undefined,
): string => {
  if (!rawCategory) return "Khác";

  // Nếu tìm thấy trong từ điển thì trả về tên tiếng Việt,
  // nếu không thấy thì trả về chữ gốc tạm thời
  return CATEGORY_MAP[rawCategory] || rawCategory;
};
