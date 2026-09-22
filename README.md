# E-Commerce Platform

منصة تجارة إلكترونية كاملة تتكوّن من واجهة أمامية مبنية باستخدام Angular وواجهة خلفية REST API مبنية باستخدام ASP.NET Core 9.0. يتيح المشروع للمستخدمين استعراض المنتجات والتصنيفات، إنشاء حساب وتسجيل الدخول، إدارة سلة التسوق، إنشاء الطلبات، تنفيذ الدفع، وكتابة تقييمات للمنتجات، مع لوحة تحكم للإدارة.

> **حالة المشروع:** يحتوي المستودع على تطبيق متكامل للتجربة والتطوير، مع طبقات المصادقة والمنتجات والسلة والطلبات والدفع والتقييمات ولوحة الإدارة.

## المزايا الرئيسية

### للمستخدم

- إنشاء حساب وتسجيل الدخول باستخدام JWT.
- استعراض المنتجات والتصنيفات.
- عرض تفاصيل المنتج وصوره ومراجعاته.
- إضافة المنتجات إلى السلة وتعديل الكميات وحذف العناصر.
- التحقق من توفر المخزون عند التعامل مع السلة والطلب.
- إنشاء طلب من محتويات السلة.
- الدفع وتحديث حالة الطلب إلى `Paid`.
- عرض الطلبات وتفاصيل كل طلب.
- إضافة تقييم للمنتج وحذفه من قبل صاحبه.

### للإدارة

- لوحة تحكم محمية بصلاحيات المسؤول.
- إدارة المنتجات.
- إدارة التصنيفات.
- إدارة الطلبات.
- إدارة المستخدمين.

## سير العمل التجاري

1. يسجّل المستخدم الدخول ويحصل على JWT token.
2. يتصفح المنتجات ويضيف ما يريد إلى السلة.
3. لا يتم تخفيض المخزون عند إضافة المنتج إلى السلة؛ لأن السلة لا تمثل عملية شراء مكتملة.
4. عند تنفيذ checkout يتم تحويل `CartItems` إلى `OrderItems`، حساب إجمالي الطلب، تفريغ عناصر السلة، وإنشاء الطلب بحالة `Pending`.
5. عند الدفع يتم التحقق من الطلب والمستخدم والمخزون، ثم تخفيض المخزون وإنشاء سجل الدفع وتغيير حالة الطلب إلى `Paid`.

```text
User
 ├── Cart
 │    └── CartItems
 └── Orders
      └── OrderItems

Product
 ├── CartItems
 ├── OrderItems
 ├── ProductImages
 └── Reviews

Order
 └── Payment
```

## التقنية المستخدمة

- **Backend:** C#، ASP.NET Core 9.0 Web API.
- **Frontend:** Angular 20، TypeScript، RxJS.
- **Database:** Microsoft SQL Server.
- **ORM:** Entity Framework Core 9 مع `Microsoft.EntityFrameworkCore.SqlServer`.
- **Authentication:** JWT Bearer Authentication.
- **Password hashing:** BCrypt.Net-Next.
- **API documentation:** ASP.NET Core OpenAPI.
- **Containerization:** Docker باستخدام صور .NET SDK وASP.NET Runtime 9.0.
- **Testing frontend:** Jasmine وKarma.

## بنية المشروع

```text
.
├── ECommrece.sln                 # Visual Studio solution
├── Dockerfile                    # بناء وتشغيل Backend داخل Docker
├── SQLQuery1.sql                 # استعلامات وتجارب SQL
├── ECommrece/                    # ASP.NET Core Web API
│   ├── Controllers/
│   │   └── FControllers/         # Auth, Users, Products, Categories,
│   │                              # Cart, Orders, Payments, Reviews, Images
│   ├── Data/
│   │   ├── AppDbContext.cs        # DbContext و DbSet لكل كيانات النظام
│   │   └── DbSeeder.cs            # تهيئة البيانات الأولية
│   ├── DTOs/                      # نماذج الطلب والاستجابة لكل feature
│   ├── Migrations/                # Entity Framework Core migrations
│   ├── Models/                    # User, Product, Category, Cart, Order,
│   │                              # Payment, Review وغيرها
│   ├── Program.cs                 # تسجيل الخدمات وMiddleware وتشغيل API
│   ├── appsettings.json           # إعدادات قاعدة البيانات وJWT
│   └── ECommerce.csproj           # حزم وإعدادات مشروع .NET
├── ecommerce-frontend/            # Angular application
│   ├── src/app/
│   │   ├── components/            # Navbar وFooter
│   │   ├── guards/                # authGuard وadminGuard
│   │   ├── interceptors/          # إضافة JWT للطلبات
│   │   ├── models/                # نماذج TypeScript
│   │   ├── pages/                 # صفحات المستخدم والإدارة
│   │   ├── services/              # خدمات Auth, Products, Cart, Orders,
│   │   │                            # Payments, Reviews وغيرها
│   │   ├── app.routes.ts          # مسارات التطبيق والحماية
│   │   └── app.ts                 # Root component
│   ├── angular.json
│   ├── package.json
│   └── README.md                  # تعليمات Angular الافتراضية
└── info/
    ├── E-Commrce.txt              # توثيق business flow وقواعد النظام
    └── ER-Digrame.png             # مخطط علاقات قاعدة البيانات
```

## المسارات الأساسية في الواجهة

| المسار | الاستخدام | الحماية |
|---|---|---|
| `/` | الصفحة الرئيسية واستعراض المنتجات | عامة |
| `/login` | تسجيل الدخول | عامة |
| `/signup` | إنشاء حساب | عامة |
| `/products/:id` | تفاصيل المنتج | عامة |
| `/cart` | سلة المستخدم | مستخدم مسجل |
| `/checkout` | إنشاء الطلب | مستخدم مسجل |
| `/orders` | قائمة الطلبات | مستخدم مسجل |
| `/orders/:id` | تفاصيل الطلب | مستخدم مسجل |
| `/payment/:orderId` | الدفع | مستخدم مسجل |
| `/admin` | لوحة الإدارة | مستخدم مسجل + Admin |
| `/admin/products` | إدارة المنتجات | Admin |
| `/admin/categories` | إدارة التصنيفات | Admin |
| `/admin/orders` | إدارة الطلبات | Admin |
| `/admin/users` | إدارة المستخدمين | Admin |

## تشغيل المشروع محلياً

### المتطلبات

- .NET SDK 9.0 أو أحدث.
- Node.js وnpm.
- SQL Server محلي أو SQL Server متاح عبر الشبكة.
- Angular CLI 20 (اختياري، يمكن استخدام `npm` scripts).

### تشغيل الـ Backend

1. عدّل connection string في `ECommrece/appsettings.json` بما يناسب إعداد SQL Server لديك.
2. من مجلد المشروع الخلفي شغّل:

```bash
cd ECommrece
dotnet restore
dotnet ef database update
dotnet run
```

سيقوم التطبيق بتسجيل الخدمات، الاتصال بقاعدة البيانات، وتشغيل `DbSeeder` عند بدء التشغيل. تتوفر أيضاً ملفات HTTP وOpenAPI لاختبار الـ API أثناء التطوير.

### تشغيل الـ Frontend

في طرفية أخرى:

```bash
cd ecommerce-frontend
npm install
npm start
```

ثم افتح:

```text
http://localhost:4200
```

أو استخدم مباشرة:

```bash
ng serve
```

### بناء واختبار الواجهة

```bash
cd ecommerce-frontend
npm run build
npm test
```

أمر الاختبارات يستخدم Jasmine وKarma. أما اختبارات end-to-end فتحتاج إلى إضافة framework مناسب لأن Angular CLI لا يضم إطار E2E افتراضياً.

## تشغيل Backend باستخدام Docker

يبني Dockerfile تطبيق ASP.NET Core باستخدام .NET 9 ويشغله على المنفذ `10000`:

```bash
docker build -t ecommerce-api .
docker run --rm -p 10000:10000 ecommerce-api
```

يمكن الوصول إلى التطبيق عبر:

```text
http://localhost:10000
```

تأكد من توفير اتصال SQL Server مناسب للحاوية، وعدم الاعتماد على `Server=.` إذا كانت قاعدة البيانات تعمل خارج الحاوية إلا بعد تعديل إعداد الاتصال.

## إعدادات البيئة والأمان

الإعدادات الحالية موجودة في `ECommrece/appsettings.json` وتشمل:

- `ConnectionStrings:DefaultConnection`
- `Jwt:Key`
- `Jwt:Issuer`
- `Jwt:Audience`

**تنبيه أمني:** لا تضع مفاتيح JWT أو كلمات مرور قاعدة البيانات الحقي��ية داخل Git. يجب نقلها إلى User Secrets أو متغيرات بيئية أو Secret Manager قبل النشر، وتغيير أي secret سبق رفعه إلى المستودع.

مثال عام لتشغيل المشروع مع إعدادات خارجية:

```bash
dotnet user-secrets init
dotnet user-secrets set "Jwt:Key" "replace-with-a-long-random-secret"
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "your-connection-string"
```

## ملاحظات معمارية

- `Program.cs` يفعّل CORS للواجهة، JWT authentication، SQL Server عبر `AppDbContext`، وتجاهل دورات المراجع في JSON.
- `AppDbContext` يعرّف جداول المستخدمين والمنتجات والتصنيفات والسلال والطلبات والمدفوعات والتقييمات والصور.
- الـ DTOs تفصل نماذج الـ API عن كيانات قاعدة البيانات.
- `authGuard` يحمي الصفحات التي تتطلب تسجيل الدخول، بينما `adminGuard` يحمي لوحة الإدارة.
- `jwt.interceptor.ts` يضيف التوكن إلى الطلبات الصادرة من Angular.
- الواجهة تستخدم نظام تصميم داكن يعتمد على CSS variables وGlassmorphism، مع حالات للأزرار والتنبيهات والجداول وloading skeletons.

## ملفات التوثيق

- [Business Flow والتفاصيل التشغيلية](info/E-Commrce.txt)
- [ER Diagram](info/ER-Digrame.png)
- [تعليمات تشغيل Angular](ecommerce-frontend/README.md)

## تحسينات مقترحة قبل الإنتاج

- فصل أسرار JWT واتصال قاعدة البيانات عن ملفات الإعدادات المرفوعة للمستودع.
- إضافة ملف إعدادات للبيئات المختلفة، مثل development وproduction.
- إضافة اختبارات Backend للـ controllers وقواعد المخزون والدفع.
- إضافة اختبارات تكامل لمسار `Cart → Order → Payment`.
- توثيق endpoints وطلبات/استجابات الـ API بشكل كامل في OpenAPI.
- إضافة CI لتشغيل `dotnet build` و`npm run build` والاختبارات تلقائياً.
- إضافة معالجة مركزية للأخطاء وlogging مناسب للإنتاج.

## الترخيص

لم يتم تحديد ترخيص للمشروع حتى الآن.
