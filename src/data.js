
export const initialItems = [
  {
    id: 1,
    code: "BRG-001",
    name: "Laptop Lenovo ThinkPad",
    category: "Elektronik",
    stock: 18,
    buyPrice: 7500000,
    sellPrice: 8900000,
    location: "Rak A1"
  },
  {
    id: 2,
    code: "BRG-002",
    name: "Mouse Wireless Logitech",
    category: "Aksesoris",
    stock: 7,
    buyPrice: 85000,
    sellPrice: 125000,
    location: "Rak B2"
  },
  {
    id: 3,
    code: "BRG-003",
    name: "Keyboard Mechanical",
    category: "Aksesoris",
    stock: 0,
    buyPrice: 320000,
    sellPrice: 450000,
    location: "Rak B1"
  },
  {
    id: 4,
    code: "BRG-004",
    name: "Monitor LED 24 Inch",
    category: "Elektronik",
    stock: 14,
    buyPrice: 1250000,
    sellPrice: 1590000,
    location: "Rak A2"
  },
  {
    id: 5,
    code: "BRG-005",
    name: "Kertas A4 80 GSM",
    category: "ATK",
    stock: 5,
    buyPrice: 42000,
    sellPrice: 55000,
    location: "Rak C1"
  },
  {
    id: 6,
    code: "BRG-006",
    name: "Flashdisk 32GB",
    category: "Elektronik",
    stock: 32,
    buyPrice: 48000,
    sellPrice: 75000,
    location: "Rak A3"
  }
];

export function getStockStatus(stock) {
  if (stock === 0) return "Habis";
  if (stock <= 10) return "Menipis";
  return "Aman";
}

export function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(value);
}
