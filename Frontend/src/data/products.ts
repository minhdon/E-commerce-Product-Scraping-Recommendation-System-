export interface Product {
  itemId: number;
  name: string;
  price: number;
  image: string;
  ratingScore?: number | null;
  itemSoldCntShow?: number | null;
  discount?: number | null;
  brandName?: string | null;
  sellerName?: string | null;
  location?: string | null;
  category?: string | null;
}
