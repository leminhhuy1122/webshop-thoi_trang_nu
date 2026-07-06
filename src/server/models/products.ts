export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  image: string;
  images: string | string[];
  category: string;
  materials?: string[];
  careInstructions?: string;
  tags?: string[];
  sizes?: any[];
  colors?: string[];
  stock: number;
  isNew?: boolean;
  createdAt: string;
  reviews?: any[];
  rating?: number;
}

export let products: Product[] = [
  {
    id: "prod-1",
    name: "Áo Hoodie Aura Mẫu A",
    description: "Một thiết kế áo khoác vượt thời gian, chiếc áo hoodie mang đậm phong cách trẻ trung năng động. Được làm từ chất liệu vải thun nỉ cao cấp, mềm mại và giữ ấm tốt.\n\nThích hợp cho những buổi dạo phố, đi học, hay đi chơi cùng bạn bè.",
    price: 650000,
    salePrice: 450000,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1887&auto=format&fit=crop",
    images: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1887&auto=format&fit=crop",
    category: "Áo Khoác",
    materials: ["100% Cotton Nỉ", "Dày dặn"],
    careInstructions: "Giặt máy ở chế độ nhẹ nhàng với nước lạnh.\nKhông sử dụng hóa chất tẩy rửa mạnh.\nPhơi trong bóng râm, tránh ánh nắng trực tiếp.\nỦi ở nhiệt độ thấp.",
    tags: ["Mùa đông", "Năng động", "Trẻ trung"],
    sizes: [{name: "S", stock: 10}, {name: "M", stock: 15}, {name: "L", stock: 5}],
    colors: ["Đen", "Xám"],
    stock: 30,
    createdAt: new Date().toISOString(),
    reviews: [
      { id: "rev-1", name: 'Nguyễn Thị A', rating: 5, date: '10/10/2023', content: 'Chất liệu vải rất đẹp, mềm mại và đứng form. Đường may tỉ mỉ, mặc lên tôn dáng.' },
      { id: "rev-2", name: 'Trần B', rating: 4, date: '05/10/2023', content: 'Màu sắc giống hình, tuy nhiên giao hàng hơi chậm một chút. Sản phẩm đáng tiền.' }
    ]
  },
  {
    id: "prod-2",
    name: "Quần Jogger Aura Mẫu B",
    description: "Quần jogger dáng suông ôm nhẹ vừa vặn, thiết kế tối giản dễ phối đồ. Lưng thun co giãn thoải mái mang đến trải nghiệm tuyệt vời cả ngày dài.",
    price: 550000,
    image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=1964&auto=format&fit=crop",
    images: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=1964&auto=format&fit=crop",
    category: "Quần",
    materials: ["Vải thun gân", "Co giãn 4 chiều"],
    careInstructions: "Giặt tay hoặc giặt máy.\nKhông ngâm quá lâu.\nPhơi khô tự nhiên.",
    tags: ["Thể thao", "Thoải mái"],
    sizes: [{name: "M", stock: 20}, {name: "L", stock: 10}],
    colors: ["Xám", "Be"],
    stock: 30,
    createdAt: new Date().toISOString(),
    reviews: []
  },
  {
    id: "prod-3",
    name: "Áo Sơ Mi Lụa C",
    description: "Sơ mi lụa tơ tằm mềm mại, thấm hút mồ hôi tốt. Kiểu dáng công sở hiện đại, thích hợp cho nhiều hoàn cảnh.",
    price: 850000,
    salePrice: 650000,
    image: "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?q=80&w=1888&auto=format&fit=crop",
    images: "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?q=80&w=1888&auto=format&fit=crop",
    category: "Áo Sơ Mi",
    materials: ["Lụa tơ tằm"],
    careInstructions: "Giặt khô hoặc giặt tay với nước lạnh.\nKhông vắt mạnh.",
    tags: ["Công sở", "Thanh lịch"],
    sizes: [{name: "S", stock: 15}, {name: "M", stock: 20}],
    colors: ["Trắng", "Xanh Nhạt"],
    stock: 35,
    isNew: true,
    createdAt: new Date().toISOString(),
    reviews: []
  },
  {
    id: "prod-4",
    name: "Đầm Dự Tiệc D",
    description: "Thiết kế đầm hai dây xẻ tà quyến rũ, tôn vóc dáng. Chất liệu vải lụa satin cao cấp.",
    price: 1200000,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1983&auto=format&fit=crop",
    images: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1983&auto=format&fit=crop",
    category: "Đầm",
    materials: ["Lụa Satin"],
    careInstructions: "Giặt khô.",
    tags: ["Dự tiệc", "Quyến rũ"],
    sizes: [{name: "S", stock: 5}, {name: "M", stock: 8}],
    colors: ["Đỏ", "Đen"],
    stock: 13,
    isNew: true,
    createdAt: new Date().toISOString(),
    reviews: []
  },
  {
    id: "prod-5",
    name: "Túi Xách Da Cao Cấp",
    description: "Túi xách da thật với đường may thủ công tỉ mỉ. Phụ kiện không thể thiếu cho các quý cô.",
    price: 2500000,
    salePrice: 1990000,
    image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=1915&auto=format&fit=crop",
    images: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=1915&auto=format&fit=crop",
    category: "Phụ kiện",
    materials: ["Da bò nguyên tấm"],
    careInstructions: "Lau chùi bằng khăn mềm.\nSử dụng kem dưỡng da chuyên dụng.",
    tags: ["Túi xách", "Sang trọng"],
    sizes: [{name: "One Size", stock: 10}],
    colors: ["Nâu", "Đen"],
    stock: 10,
    isNew: true,
    createdAt: new Date().toISOString(),
    reviews: []
  },
  {
    id: "prod-6",
    name: "Kính Mát Thời Trang",
    description: "Kính mát gọng kim loại chống tia UV400, thiết kế cổ điển phù hợp với mọi khuôn mặt.",
    price: 450000,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=2080&auto=format&fit=crop",
    images: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=2080&auto=format&fit=crop",
    category: "Phụ kiện",
    materials: ["Kim loại", "Polycarbonate"],
    careInstructions: "Lau kính bằng khăn chuyên dụng.",
    tags: ["Mùa hè", "Du lịch"],
    sizes: [{name: "One Size", stock: 50}],
    colors: ["Vàng", "Bạc"],
    stock: 50,
    isNew: true,
    createdAt: new Date().toISOString(),
    reviews: []
  }
];

export const setProducts = (newProducts: Product[]) => {
  products = newProducts;
};
