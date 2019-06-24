interface Window {
  productJSON: ProductJSON;

  BISPopover: {
    show: () => void;
  };
}

interface ProductJSON {
  id: number;
  title: string;
  handle: string;
  description: string;
  published_at: Date;
  created_at: Date;
  vendor: string;
  type: string;
  tags: string[];
  price: number;
  price_min: number;
  price_max: number;
  available: boolean;
  price_varies: boolean;
  compare_at_price: number | null;
  compare_at_price_min: number;
  compare_at_price_max: number;
  compare_at_price_varies: boolean;
  variants: Variant[];
  images: string[];
  featured_image: string;
  options: string[];
  content: string;
  rating: string;
}

interface Variant {
  id: number;
  title: string;
  option1: string;
  option2: string;
  option3: string;
  sku: string;
  requires_shipping: boolean;
  taxable: boolean;
  featured_image: FeaturedImage | null;
  available: boolean;
  name: string;
  public_title: string;
  options: string[];
  price: number;
  weight: number;
  compare_at_price: number | null;
  inventory_quantity: number;
  inventory_management: string;
  inventory_policy: string;
  barcode: string;
}

interface FeaturedImage {
  id: number;
  product_id: number;
  position: number;
  created_at: Date;
  updated_at: Date;
  alt: string | null;
  width: number;
  height: number;
  src: string;
  variant_ids: number[];
}
