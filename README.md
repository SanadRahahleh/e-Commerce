# E-Commerce Platform

A full-stack e-commerce platform composed of an Angular frontend and an ASP.NET Core 9.0 REST API backend. The project allows users to browse products and categories, register and log in, manage a shopping cart, create orders, process payments, and submit product reviews, while also offering an admin dashboard for management tasks.

> Project status: this repository contains a working full-stack e-commerce application with authentication, catalog, cart, order management, payments, product reviews, and admin features.

## Key Features

### For Users

- User registration and login using JWT authentication.
- Browse products and categories.
- View product details, images, and reviews.
- Add products to the cart, update quantities, and remove items.
- Validate inventory when adding items or checking out.
- Create an order from cart contents.
- Process payment and mark the order as `Paid`.
- View order history and order details.
- Add and delete product reviews owned by the authenticated user.

### For Admins

- Protected admin dashboard.
- Manage products.
- Manage categories.
- Manage orders.
- Manage users.

## Business Flow

1. The user logs in and receives a JWT token.
2. The user browses products and adds desired items to the cart.
3. Stock is not reduced when items are added to the cart, because the cart does not represent a completed purchase.
4. During checkout, `CartItems` are converted into `OrderItems`, the total is calculated, cart items are cleared, and an order is created in `Pending` status.
5. During payment, the system validates the user, order, and stock, reduces product stock, creates a payment record, and updates order status to `Paid`.

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

## Tech Stack

- **Backend:** C#, ASP.NET Core 9.0 Web API
- **Frontend:** Angular 20, TypeScript, RxJS
- **Database:** Microsoft SQL Server
- **ORM:** Entity Framework Core 9 with `Microsoft.EntityFrameworkCore.SqlServer`
- **Authentication:** JWT Bearer authentication
- **Password hashing:** BCrypt.Net-Next
- **API documentation:** ASP.NET Core OpenAPI
- **Containerization:** Docker using .NET SDK and ASP.NET runtime images
- **Frontend testing:** Jasmine and Karma

## Project Structure

```text
.
├── ECommrece.sln                 # Visual Studio solution
├── Dockerfile                    # Backend Docker build and run setup
├── SQLQuery1.sql                 # SQL query samples and testing scripts
├── ECommrece/                    # ASP.NET Core Web API
│   ├── Controllers/
│   │   └── FControllers/         # Auth, Users, Products, Categories,
│   │                              # Cart, Orders, Payments, Reviews, Images
│   ├── Data/
│   │   ├── AppDbContext.cs        # EF Core DbContext and DbSets
│   │   └── DbSeeder.cs            # Initial database seed logic
│   ├── DTOs/                      # Request/response models per feature
│   ├── Migrations/                # EF Core migrations
│   ├── Models/                    # User, Product, Category, Cart, Order,
│   │                              # Payment, Review, and related entities
│   ├── Program.cs                 # Service registration, middleware, app startup
│   ├── appsettings.json           # Database and JWT configuration
│   └── ECommerce.csproj           # .NET project configuration
├── ecommerce-frontend/            # Angular application
│   ├── src/app/
│   │   ├── components/            # Navbar and Footer
│   │   ├── guards/                # authGuard and adminGuard
│   │   ├── interceptors/          # JWT request injection
│   │   ├── models/                # TypeScript models
│   │   ├── pages/                 # User and admin pages
│   │   ├── services/              # Auth, Products, Cart, Orders,
│   │   │                            # Payments, Reviews, and more
│   │   ├── app.routes.ts          # Application routing and route protection
│   │   └── app.ts                 # Root application component
│   ├── angular.json
│   ├── package.json
│   └── README.md                  # Angular default setup guide
├── info/
│   ├── E-Commrce.txt              # Business flow and system rules
│   └── ER-Digrame.png             # Database ER diagram
└── README.md                     # Project documentation
```

## Main Routes

| Route | Purpose | Access |
|---|---|---|
| `/` | Home page / product listing | Public |
| `/login` | Sign in | Public |
| `/signup` | Create account | Public |
| `/products/:id` | Product details | Public |
| `/cart` | User cart | Authenticated user |
| `/checkout` | Checkout | Authenticated user |
| `/orders` | Orders list | Authenticated user |
| `/orders/:id` | Order details | Authenticated user |
| `/payment/:orderId` | Payment page | Authenticated user |
| `/admin` | Admin dashboard | Authenticated + Admin |
| `/admin/products` | Product management | Admin |
| `/admin/categories` | Category management | Admin |
| `/admin/orders` | Order management | Admin |
| `/admin/users` | User management | Admin |

## Run the Project Locally

### Requirements

- .NET SDK 9.0+
- Node.js and npm
- SQL Server instance
- Angular CLI (optional, available via npm scripts)

### Backend Setup

1. Update the connection string in `ECommrece/appsettings.json` to match your SQL Server setup.
2. Run:

```bash
cd ECommrece
dotnet restore
dotnet ef database update
dotnet run
```

The app will register services, connect to SQL Server, and run `DbSeeder` on startup. OpenAPI and HTTP files are also included for API exploration during development.

### Frontend Setup

In a separate terminal:

```bash
cd ecommerce-frontend
npm install
npm start
```

Then open:

```text
http://localhost:4200
```

Or run:

```bash
ng serve
```

### Build and Test Frontend

```bash
cd ecommerce-frontend
npm run build
npm test
```

The frontend testing setup uses Jasmine and Karma. End-to-end tests are not configured by default, so additional tooling would be required if you want E2E coverage.

## Docker Setup

The repository includes a Dockerfile for the backend ASP.NET Core app:

```bash
docker build -t ecommerce-api .
docker run --rm -p 10000:10000 ecommerce-api
```

The application will be available at:

```text
http://localhost:10000
```

Note: if the database runs outside the container, update the connection string accordingly.

## Security and Configuration

Configuration values are defined in `ECommrece/appsettings.json`, including:

- `ConnectionStrings:DefaultConnection`
- `Jwt:Key`
- `Jwt:Issuer`
- `Jwt:Audience`

> Important: do not commit real production secrets. Store them in user secrets, environment variables, or a secure secret manager before deployment.

Example:

```bash
dotnet user-secrets init
dotnet user-secrets set "Jwt:Key" "replace-with-a-long-random-secret"
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "your-connection-string"
```

## Architectural Notes

- `Program.cs` enables CORS, JWT authentication, SQL Server integration via `AppDbContext`, and JSON reference-cycle handling.
- `AppDbContext` defines the main database sets for users, products, categories, carts, orders, payments, reviews, and images.
- DTOs separate API request/response models from database entities.
- `authGuard` protects authenticated routes, while `adminGuard` protects the admin area.
- `jwt.interceptor.ts` automatically attaches the JWT token to outgoing requests.
- The frontend uses a dark-themed design system based on CSS variables and glassmorphism styling.

## Documentation Files

- [Business Flow and System Rules](info/E-Commrce.txt)
- [ER Diagram](info/ER-Digrame.png)
- [Angular Setup Guide](ecommerce-frontend/README.md)

## Suggested Improvements Before Production

- Move JWT and DB secrets out of version-controlled config files.
- Add environment-specific configuration for development and production.
- Add backend tests for controllers and order/payment workflows.
- Add integration tests for the `Cart → Order → Payment` flow.
- Improve API documentation and request/response examples in OpenAPI.
- Add CI to run `dotnet build`, `npm run build`, and tests automatically.
- Add centralized error handling and production logging.

## License

No explicit license has been defined for this project yet.
