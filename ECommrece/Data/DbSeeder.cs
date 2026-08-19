using ECommerce.Models;
using ECommrece.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ECommrece.Data
{
    public static class DbSeeder
    {
        public static async Task SeedAsync(AppDbContext context)
        {
            // Apply migrations automatically if they haven't been applied
            await context.Database.MigrateAsync();

            // Clear existing data to replace it with clean, realistic products
            if (await context.Categories.AnyAsync())
            {
                // Clear related items first to avoid foreign key constraints
                context.CartItems.RemoveRange(context.CartItems);
                context.OrderItems.RemoveRange(context.OrderItems);
                context.Reviews.RemoveRange(context.Reviews);
                context.Products.RemoveRange(context.Products);
                context.Categories.RemoveRange(context.Categories);
                await context.SaveChangesAsync();
            }

            // Create Categories
            var electronics = new Category 
            { 
                Name = "Electronics & Gadgets", 
                Description = "Premium gadgets, high-fidelity audio, and modern productivity tools." 
            };
            var home = new Category 
            { 
                Name = "Smart Home & Living", 
                Description = "Ambient lighting, air purifiers, and home essentials to upgrade your space." 
            };
            var fashion = new Category 
            { 
                Name = "Fashion & Accessories", 
                Description = "Minimalist backpacks, chronograph watches, and premium sunglasses." 
            };
            var fitness = new Category 
            { 
                Name = "Fitness & Outdoors", 
                Description = "Professional yoga mats, smart jump ropes, and hydration packs." 
            };
            var beauty = new Category 
            { 
                Name = "Beauty & Skincare", 
                Description = "Sonic face cleansers, tourmaline hair straighteners, and hydration serums." 
            };

            await context.Categories.AddRangeAsync(electronics, home, fashion, fitness, beauty);
            await context.SaveChangesAsync();

            // Create Products with real Unsplash images and descriptions
            var products = new List<Product>
            {
                // Electronics
                new Product
                {
                    Name = "AeroPro Wireless Headphones",
                    Description = "Experience immersive sound with active noise-canceling technology, plush memory foam earcups, and up to 40 hours of battery life.",
                    Price = 299.99m,
                    StockQuantity = 150,
                    ImageUrl = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600",
                    IsActive = true,
                    CategoryID = electronics.Id,
                    CreatedAt = DateTime.UtcNow
                },
                new Product
                {
                    Name = "Veloce RGB Mechanical Keyboard",
                    Description = "Hot-swappable tactile mechanical switches, premium aluminum top frame, and fully customizable per-key dynamic RGB backlighting.",
                    Price = 129.99m,
                    StockQuantity = 120,
                    ImageUrl = "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=600",
                    IsActive = true,
                    CategoryID = electronics.Id,
                    CreatedAt = DateTime.UtcNow
                },
                new Product
                {
                    Name = "Apex Ultra Smartwatch",
                    Description = "Stay connected with a high-resolution AMOLED display, built-in GPS, heart rate monitor, sleep analysis, and water resistance up to 50m.",
                    Price = 249.99m,
                    StockQuantity = 80,
                    ImageUrl = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600",
                    IsActive = true,
                    CategoryID = electronics.Id,
                    CreatedAt = DateTime.UtcNow
                },

                // Smart Home
                new Product
                {
                    Name = "Lumina Smart Ambient Lamp",
                    Description = "Dimmable smart lamp with 16 million colors, app control, scheduling, and smart assistant integration for the perfect ambient lighting.",
                    Price = 79.99m,
                    StockQuantity = 200,
                    ImageUrl = "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600",
                    IsActive = true,
                    CategoryID = home.Id,
                    CreatedAt = DateTime.UtcNow
                },
                new Product
                {
                    Name = "HydroPure True HEPA Air Purifier",
                    Description = "Advanced 3-stage filtration capturing 99.97% of airborne particles. Quiet operation with real-time air quality index indicator.",
                    Price = 189.99m,
                    StockQuantity = 90,
                    ImageUrl = "https://images.unsplash.com/photo-1585338107529-13afc5f02586?q=80&w=600",
                    IsActive = true,
                    CategoryID = home.Id,
                    CreatedAt = DateTime.UtcNow
                },
                new Product
                {
                    Name = "Aura Ultrasonic Humidifier",
                    Description = "Cool mist humidifier featuring a 4L water tank, essential oil diffuser tray, and auto-shutoff security. Perfect for bedrooms.",
                    Price = 45.99m,
                    StockQuantity = 110,
                    ImageUrl = "https://images.unsplash.com/photo-1602928321679-560bb453f190?q=80&w=600",
                    IsActive = true,
                    CategoryID = home.Id,
                    CreatedAt = DateTime.UtcNow
                },

                // Fashion
                new Product
                {
                    Name = "Urban Nomad Waterproof Backpack",
                    Description = "Heavy-duty waxed canvas backpack with padded 15.6-inch laptop pocket, anti-theft hidden pockets, and built-in USB charging port.",
                    Price = 89.99m,
                    StockQuantity = 140,
                    ImageUrl = "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600",
                    IsActive = true,
                    CategoryID = fashion.Id,
                    CreatedAt = DateTime.UtcNow
                },
                new Product
                {
                    Name = "Spectra Polarized Sunglasses",
                    Description = "Classic design with lightweight polycarbonate frames and HD polarized UV400 lenses that block 100% of UVA and UVB rays.",
                    Price = 59.99m,
                    StockQuantity = 300,
                    ImageUrl = "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=600",
                    IsActive = true,
                    CategoryID = fashion.Id,
                    CreatedAt = DateTime.UtcNow
                },
                new Product
                {
                    Name = "Classic Chronograph Watch",
                    Description = "Elegant design featuring a polished stainless steel bezel, Japanese quartz movement, sapphire crystal glass, and a genuine leather strap.",
                    Price = 199.99m,
                    StockQuantity = 75,
                    ImageUrl = "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=600",
                    IsActive = true,
                    CategoryID = fashion.Id,
                    CreatedAt = DateTime.UtcNow
                },

                // Fitness
                new Product
                {
                    Name = "Summit Trail Hydration Pack",
                    Description = "Ergonomic hydration vest including a leak-proof 2-liter reservoir bladder, expandable storage pockets, and reflective strips.",
                    Price = 69.99m,
                    StockQuantity = 130,
                    ImageUrl = "https://images.unsplash.com/photo-1527719327859-c6ce80353573?q=80&w=600",
                    IsActive = true,
                    CategoryID = fitness.Id,
                    CreatedAt = DateTime.UtcNow
                },
                new Product
                {
                    Name = "VoltGrip Smart Jump Rope",
                    Description = "Count jumps, speed, and calories with this smart rope. Syncs with mobile apps and features comfortable non-slip handles.",
                    Price = 34.99m,
                    StockQuantity = 250,
                    ImageUrl = "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600",
                    IsActive = true,
                    CategoryID = fitness.Id,
                    CreatedAt = DateTime.UtcNow
                },
                new Product
                {
                    Name = "Terra Grip Alignment Yoga Mat",
                    Description = "High-density, eco-friendly TPE yoga mat with laser-etched alignment guides to help perfect your posture. Includes carrier strap.",
                    Price = 49.99m,
                    StockQuantity = 160,
                    ImageUrl = "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?q=80&w=600",
                    IsActive = true,
                    CategoryID = fitness.Id,
                    CreatedAt = DateTime.UtcNow
                },

                // Beauty
                new Product
                {
                    Name = "GlowUp Sonic Facial Brush",
                    Description = "Soft medical-grade silicone bristles with 8 speed settings. Uses sonic pulsations to deep-clean pores and massage facial skin.",
                    Price = 74.99m,
                    StockQuantity = 100,
                    ImageUrl = "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600",
                    IsActive = true,
                    CategoryID = beauty.Id,
                    CreatedAt = DateTime.UtcNow
                },
                new Product
                {
                    Name = "SilkCare Tourmaline Hair Styler",
                    Description = "Professional 2-in-1 flat iron and curler with floating ceramic plates, negative ion technology, and 5 temperature modes.",
                    Price = 119.99m,
                    StockQuantity = 85,
                    ImageUrl = "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600",
                    IsActive = true,
                    CategoryID = beauty.Id,
                    CreatedAt = DateTime.UtcNow
                },
                new Product
                {
                    Name = "Natura Hyaluronic Acid Serum",
                    Description = "Premium hydrating face serum with 2% pure hyaluronic acid, organic green tea extract, and vitamin C for smooth, glowing skin.",
                    Price = 29.99m,
                    StockQuantity = 300,
                    ImageUrl = "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=600",
                    IsActive = true,
                    CategoryID = beauty.Id,
                    CreatedAt = DateTime.UtcNow
                }
            };

            await context.Products.AddRangeAsync(products);
            await context.SaveChangesAsync();

            // Clear existing ProductImages
            context.ProductImages.RemoveRange(context.ProductImages);
            await context.SaveChangesAsync();

            // Seed alternative images for products
            var alternativeImages = new List<ProductImage>();

            foreach (var prod in products)
            {
                if (prod.Name == "AeroPro Wireless Headphones")
                {
                    alternativeImages.Add(new ProductImage { ProductID = prod.Id, ImageUrl = "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=600" });
                    alternativeImages.Add(new ProductImage { ProductID = prod.Id, ImageUrl = "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?q=80&w=600" });
                }
                else if (prod.Name == "Veloce RGB Mechanical Keyboard")
                {
                    alternativeImages.Add(new ProductImage { ProductID = prod.Id, ImageUrl = "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=600" });
                    alternativeImages.Add(new ProductImage { ProductID = prod.Id, ImageUrl = "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=600" });
                }
                else if (prod.Name == "Apex Ultra Smartwatch")
                {
                    alternativeImages.Add(new ProductImage { ProductID = prod.Id, ImageUrl = "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=600" });
                    alternativeImages.Add(new ProductImage { ProductID = prod.Id, ImageUrl = "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=600" });
                }
                else if (prod.Name == "Lumina Smart Ambient Lamp")
                {
                    alternativeImages.Add(new ProductImage { ProductID = prod.Id, ImageUrl = "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=600" });
                    alternativeImages.Add(new ProductImage { ProductID = prod.Id, ImageUrl = "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=600" });
                }
                else if (prod.Name == "HydroPure True HEPA Air Purifier")
                {
                    alternativeImages.Add(new ProductImage { ProductID = prod.Id, ImageUrl = "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600" });
                    alternativeImages.Add(new ProductImage { ProductID = prod.Id, ImageUrl = "https://images.unsplash.com/photo-1602928321679-560bb453f190?q=80&w=600" });
                }
                else if (prod.Name == "Aura Ultrasonic Humidifier")
                {
                    alternativeImages.Add(new ProductImage { ProductID = prod.Id, ImageUrl = "https://images.unsplash.com/photo-1585338107529-13afc5f02586?q=80&w=600" });
                    alternativeImages.Add(new ProductImage { ProductID = prod.Id, ImageUrl = "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600" });
                }
                else if (prod.Name == "Urban Nomad Waterproof Backpack")
                {
                    alternativeImages.Add(new ProductImage { ProductID = prod.Id, ImageUrl = "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=600" });
                    alternativeImages.Add(new ProductImage { ProductID = prod.Id, ImageUrl = "https://images.unsplash.com/photo-1577733966973-d680bffd2e80?q=80&w=600" });
                }
                else if (prod.Name == "Spectra Polarized Sunglasses")
                {
                    alternativeImages.Add(new ProductImage { ProductID = prod.Id, ImageUrl = "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=600" });
                    alternativeImages.Add(new ProductImage { ProductID = prod.Id, ImageUrl = "https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=600" });
                }
                else if (prod.Name == "Classic Chronograph Watch")
                {
                    alternativeImages.Add(new ProductImage { ProductID = prod.Id, ImageUrl = "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=600" });
                    alternativeImages.Add(new ProductImage { ProductID = prod.Id, ImageUrl = "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=600" });
                }
                else if (prod.Name == "Summit Trail Hydration Pack")
                {
                    alternativeImages.Add(new ProductImage { ProductID = prod.Id, ImageUrl = "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600" });
                    alternativeImages.Add(new ProductImage { ProductID = prod.Id, ImageUrl = "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600" });
                }
                else if (prod.Name == "VoltGrip Smart Jump Rope")
                {
                    alternativeImages.Add(new ProductImage { ProductID = prod.Id, ImageUrl = "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?q=80&w=600" });
                    alternativeImages.Add(new ProductImage { ProductID = prod.Id, ImageUrl = "https://images.unsplash.com/photo-1527719327859-c6ce80353573?q=80&w=600" });
                }
                else if (prod.Name == "Terra Grip Alignment Yoga Mat")
                {
                    alternativeImages.Add(new ProductImage { ProductID = prod.Id, ImageUrl = "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600" });
                    alternativeImages.Add(new ProductImage { ProductID = prod.Id, ImageUrl = "https://images.unsplash.com/photo-1527719327859-c6ce80353573?q=80&w=600" });
                }
                else if (prod.Name == "GlowUp Sonic Facial Brush")
                {
                    alternativeImages.Add(new ProductImage { ProductID = prod.Id, ImageUrl = "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=600" });
                    alternativeImages.Add(new ProductImage { ProductID = prod.Id, ImageUrl = "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600" });
                }
                else if (prod.Name == "SilkCare Tourmaline Hair Styler")
                {
                    alternativeImages.Add(new ProductImage { ProductID = prod.Id, ImageUrl = "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600" });
                    alternativeImages.Add(new ProductImage { ProductID = prod.Id, ImageUrl = "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=600" });
                }
                else if (prod.Name == "Natura Hyaluronic Acid Serum")
                {
                    alternativeImages.Add(new ProductImage { ProductID = prod.Id, ImageUrl = "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600" });
                    alternativeImages.Add(new ProductImage { ProductID = prod.Id, ImageUrl = "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600" });
                }
            }

            await context.ProductImages.AddRangeAsync(alternativeImages);
            await context.SaveChangesAsync();
        }
    }
}
