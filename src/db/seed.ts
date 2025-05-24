import { faker } from '@faker-js/faker';
import { brands, categories, products, productVariants, images } from './schema.js';
import { db } from './db.js';

// Cấu hình locale cho tiếng Việt (tùy chọn)

async function seedDatabase() {
  try {
    console.log('🌱 Bắt đầu seed database...');

    // Tạo brands
    console.log('📦 Tạo brands...');
    const brandNames = [
      'Chanel',
      'Dior',
      'Tom Ford',
      'Creed',
      'Versace',
      'Giorgio Armani',
      'Yves Saint Laurent',
      'Gucci',
      'Hermès',
      'Burberry',
      'Calvin Klein',
      'Hugo Boss',
    ];

    const createdBrands = [];
    for (const brandName of brandNames) {
      const brand = {
        name: brandName,
        slug: faker.helpers.slugify(brandName).toLowerCase(),
        description: faker.company.catchPhrase(),
        logo_url: faker.image.avatar(),
      };
      const [insertedBrand] = await db.insert(brands).values(brand).returning();
      createdBrands.push(insertedBrand);
    }

    // Tạo categories
    console.log('🏷️ Tạo categories...');
    const categoryNames = [
      'Woody',
      'Floral',
      'Fresh',
      'Oriental',
      'Citrus',
      'Spicy',
      'Aquatic',
      'Gourmand',
    ];

    const createdCategories = [];
    for (const categoryName of categoryNames) {
      const category = {
        name: categoryName,
        slug: faker.helpers.slugify(categoryName).toLowerCase(),
      };
      const [insertedCategory] = await db.insert(categories).values(category).returning();
      createdCategories.push(insertedCategory);
    }

    // Danh sách note hương thơm cho từng loại
    const fragranceNotes = {
      top: [
        'Bergamot',
        'Lemon',
        'Orange',
        'Grapefruit',
        'Lime',
        'Pink Pepper',
        'Black Pepper',
        'Cardamom',
        'Lavender',
        'Mint',
        'Apple',
        'Pear',
        'Pineapple',
        'Mandarin',
        'Neroli',
        'Petitgrain',
      ],
      middle: [
        'Rose',
        'Jasmine',
        'Lily of the Valley',
        'Peony',
        'Iris',
        'Violet',
        'Geranium',
        'Cedar',
        'Pine',
        'Cinnamon',
        'Nutmeg',
        'Clove',
        'Black Tea',
        'Green Tea',
        'Magnolia',
        'Tuberose',
      ],
      base: [
        'Sandalwood',
        'Cedarwood',
        'Vetiver',
        'Patchouli',
        'Oakmoss',
        'Vanilla',
        'Amber',
        'Musk',
        'Tonka Bean',
        'Benzoin',
        'Labdanum',
        'Oud',
        'Leather',
        'Tobacco',
        'Chocolate',
        'Caramel',
      ],
    };

    const genders = ['male', 'female', 'unisex'];

    // Tạo 30 products
    console.log('🧴 Tạo 30 sản phẩm nước hoa...');
    const createdProducts = [];

    for (let i = 0; i < 30; i++) {
      const brand = faker.helpers.arrayElement(createdBrands);
      const category = faker.helpers.arrayElement(createdCategories);
      const gender = faker.helpers.arrayElement(genders);

      // Tạo tên sản phẩm độc đáo
      const productNames = [
        `${brand.name} ${faker.word.adjective()} ${faker.word.noun()}`,
        `${brand.name} ${faker.color.human()} ${faker.word.noun()}`,
        `${brand.name} ${faker.word.adjective()} ${category.name}`,
        `${faker.word.adjective()} ${brand.name}`,
        `${brand.name} ${faker.number.int({ min: 1, max: 100 })}`,
      ];

      const productName = faker.helpers.arrayElement(productNames);
      const slug =
        faker.helpers.slugify(productName).toLowerCase() + '-' + faker.string.alphanumeric(4);

      const product = {
        name: productName,
        slug: slug,
        brand_id: brand.id,
        category_id: category.id,
        price: faker.commerce.price({ min: 50, max: 500, dec: 2 }),
        discount: faker.number.int({ min: 0, max: 30 }),
        short_description: faker.commerce.productDescription().substring(0, 100),
        description: {
          content: faker.lorem.paragraphs(2),
          features: faker.helpers.arrayElements(
            [
              'Long-lasting fragrance',
              'Premium ingredients',
              'Luxury packaging',
              'Cruelty-free',
              'Eau de Parfum concentration',
              'Unisex appeal',
              'Limited edition',
              'Natural extracts',
            ],
            { min: 2, max: 4 },
          ),
        },
        gender: gender,
        top_notes: faker.helpers.arrayElements(fragranceNotes.top, { min: 2, max: 4 }).join(', '),
        middle_notes: faker.helpers
          .arrayElements(fragranceNotes.middle, { min: 2, max: 4 })
          .join(', '),
        base_notes: faker.helpers.arrayElements(fragranceNotes.base, { min: 2, max: 4 }).join(', '),
        status: faker.datatype.boolean(0.9), // 90% active products
      };

      const [insertedProduct] = await db.insert(products).values(product).returning();
      createdProducts.push(insertedProduct);

      // Tạo variants cho mỗi sản phẩm
      const volumes = [30, 50, 75, 100, 125];
      const numVariants = faker.number.int({ min: 1, max: 3 });
      const selectedVolumes = faker.helpers.arrayElements(volumes, numVariants);

      for (const volume of selectedVolumes) {
        const basePrice = parseFloat(product.price);
        const volumeMultiplier = volume / 50; // 50ml làm chuẩn
        const variantPrice = (
          basePrice *
          volumeMultiplier *
          faker.number.float({ min: 0.8, max: 1.2 })
        ).toFixed(2);

        const variant = {
          product_id: insertedProduct.id,
          volume_ml: volume,
          sku: `${brand.name.substring(0, 2).toUpperCase()}-${faker.string.alphanumeric(6).toUpperCase()}`,
          price: variantPrice,
          stock: faker.number.int({ min: 0, max: 50 }),
        };

        await db.insert(productVariants).values(variant);
      }

      // Tạo hình ảnh cho sản phẩm
      const numImages = faker.number.int({ min: 1, max: 4 });
      for (let j = 0; j < numImages; j++) {
        const image = {
          product_id: insertedProduct.id,
          url: faker.image.urlLoremFlickr({
            category: 'perfume',
            width: 400,
            height: 400,
          }),
          alt_text: `${productName} - Hình ${j + 1}`,
          is_primary: j === 0, // Hình đầu tiên là primary
        };

        await db.insert(images).values(image);
      }

      console.log(`✅ Đã tạo sản phẩm ${i + 1}/30: ${productName}`);
    }

    console.log('🎉 Seed database hoàn thành!');
    console.log(`📊 Thống kê:`);
    console.log(`   - ${createdBrands.length} brands`);
    console.log(`   - ${createdCategories.length} categories`);
    console.log(`   - ${createdProducts.length} products`);
    console.log(`   - Khoảng ${createdProducts.length * 2} product variants`);
    console.log(`   - Khoảng ${createdProducts.length * 2.5} images`);
  } catch (error) {
    console.error('❌ Lỗi khi seed database:', error);
    throw error;
  }
}

// Chạy seed function
seedDatabase()
  .then(() => {
    console.log('✅ Seed script hoàn thành thành công!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seed script thất bại:', error);
    process.exit(1);
  });

// Export để có thể sử dụng trong các file khác
export { seedDatabase };
