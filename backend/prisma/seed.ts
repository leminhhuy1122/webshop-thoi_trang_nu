import { PrismaClient, Role, VoucherType } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Bắt đầu seeding dữ liệu...');

  // 1. Tạo Tài khoản Admin
  const adminEmail = 'admin@aura.com';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('Admin@123', 10);
    await prisma.user.create({
      data: {
        name: 'Aura Admin',
        email: adminEmail,
        passwordHash,
        role: Role.ADMIN
      }
    });
    console.log('Tạo tài khoản admin@aura.com thành công (Mật khẩu: Admin@123).');
  } else {
    console.log('Tài khoản admin@aura.com đã tồn tại.');
  }

  // 2. Tạo các Danh mục
  const categoriesToSeed = [
    { name: 'Váy' },
    { name: 'Áo' },
    { name: 'Quần' },
    { name: 'Áo khoác' },
    { name: 'Phụ kiện' },
    { name: 'Giày' }
  ];

  const categoryMap: { [key: string]: string } = {};

  for (const cat of categoriesToSeed) {
    const createdCat = await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: { name: cat.name }
    });
    categoryMap[cat.name] = createdCat.id;
  }
  console.log('Seeding danh mục thành công.');

  // 3. Tạo các Sản phẩm
  const productsToSeed = [
    {
      name: 'Váy Lụa Midnight',
      price: 1450000,
      salePrice: 890000,
      image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=1974&auto=format&fit=crop',
      categoryName: 'Váy',
      isNew: false,
      stock: 8,
      sizes: ['S', 'M', 'L'],
      colors: ['Đen', 'Đỏ'],
      description: 'Đầm thiết kế dáng suông thanh lịch bằng chất liệu lụa satin cao cấp.'
    },
    {
      name: 'Blazer Linen Trắng',
      price: 1200000,
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=2000&auto=format&fit=crop',
      categoryName: 'Áo khoác',
      isNew: true,
      stock: 20,
      sizes: ['M', 'L', 'XL'],
      colors: ['Trắng', 'Be'],
      description: 'Áo khoác blazer Linen phom đứng trẻ trung, thấm hút mồ hôi tốt.'
    },
    {
      name: 'Áo Sơ Mi Lụa',
      price: 850000,
      image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=1974&auto=format&fit=crop',
      categoryName: 'Áo',
      isNew: true,
      stock: 12,
      sizes: ['S', 'M', 'L'],
      colors: ['Trắng', 'Be', 'Đen'],
      description: 'Sơ mi nữ kiểu lụa mềm mượt, phom dáng chuẩn công sở thanh lịch.'
    },
    {
      name: 'Quần Ống Rộng Thanh Lịch',
      price: 950000,
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1974&auto=format&fit=crop',
      categoryName: 'Quần',
      isNew: false,
      stock: 35,
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['Be', 'Đen'],
      description: 'Quần tây ống rộng cạp cao tôn dáng tôn chân, chất tuyết mưa đứng dáng.'
    },
    {
      name: 'Đầm Dạ Hội Cổ Điển',
      price: 2500000,
      image: 'https://images.unsplash.com/photo-1566160984624-9b2de2687f49?q=80&w=2070&auto=format&fit=crop',
      categoryName: 'Váy',
      isNew: true,
      stock: 5,
      sizes: ['S', 'M'],
      colors: ['Đen', 'Đỏ'],
      description: 'Thiết kế xẻ đùi đính đá sang trọng dành cho các sự kiện đặc biệt.'
    },
    {
      name: 'Túi Xách Da Minimalist',
      price: 1800000,
      salePrice: 1500000,
      image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=1915&auto=format&fit=crop',
      categoryName: 'Phụ kiện',
      isNew: false,
      stock: 10,
      sizes: ['Freesize'],
      colors: ['Be', 'Đen'],
      description: 'Chất liệu da bò thật mềm mại, phom dáng tối giản hiện đại sang trọng.'
    }
  ];

  for (const prod of productsToSeed) {
    const categoryId = categoryMap[prod.categoryName];
    if (categoryId) {
      await prisma.product.create({
        data: {
          name: prod.name,
          price: prod.price,
          salePrice: prod.salePrice,
          image: prod.image,
          images: [prod.image],
          categoryId: categoryId,
          sizes: prod.sizes,
          colors: prod.colors,
          stock: prod.stock,
          description: prod.description,
          isNew: prod.isNew
        }
      });
    }
  }
  console.log('Seeding sản phẩm thành công.');

  // 4. Tạo các Mã Giảm Giá (Vouchers)
  const vouchersToSeed = [
    {
      code: 'AURA100K',
      type: VoucherType.FIXED,
      value: 100000,
      minOrder: 500000,
      usageLimit: 100,
      expiresAt: new Date('2026-12-31')
    },
    {
      code: 'FREESHIP',
      type: VoucherType.FREESHIP,
      value: 30000,
      minOrder: 0,
      usageLimit: 500,
      expiresAt: new Date('2026-08-30')
    },
    {
      code: 'NEWBIE10',
      type: VoucherType.PERCENT,
      value: 10,
      minOrder: 300000,
      usageLimit: 1000,
      expiresAt: new Date('2026-12-31'),
      isWelcome: true
    }
  ];

  for (const v of vouchersToSeed) {
    await prisma.voucher.upsert({
      where: { code: v.code },
      update: {},
      create: {
        code: v.code,
        type: v.type,
        value: v.value,
        minOrder: v.minOrder,
        usageLimit: v.usageLimit,
        expiresAt: v.expiresAt,
        isWelcome: v.isWelcome
      }
    });
  }
  console.log('Seeding voucher thành công.');

  console.log('Seeding hoàn tất thành công!');
}

main()
  .catch((e) => {
    console.error('Lỗi seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
