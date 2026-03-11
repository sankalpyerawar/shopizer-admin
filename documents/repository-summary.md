# Shopizer Admin - Repository Summary

## Overview
Shopizer Admin is an Angular-based web application for managing e-commerce operations. It provides a comprehensive administration interface for the Shopizer e-commerce platform.

## Technology Stack

### Core Framework
- **Angular**: v11.2.14
- **Angular CLI**: v11.2.17
- **TypeScript**: 4.0.8
- **Node.js**: Tested with v12.22.7

### UI Framework & Components
- **Nebular**: v5.0.0 / v6.2.0 (Theme, Auth, Security, Eva Icons)
- **Bootstrap**: 4.3.1
- **ng-bootstrap**: v6.1.0
- **PrimeNG**: v8.0.3
- **ng2-smart-table**: v1.5.0

### Key Libraries
- **RxJS**: v6.5.5
- **Chart.js**: v2.9.3
- **Leaflet**: 1.2.0 (Maps)
- **ngx-translate**: v12.1.2 (Internationalization)
- **ngx-toastr**: v12.1.0 (Notifications)
- **Summernote**: v0.8.20 (Rich text editor)
- **date-fns**: v2.25.0

## Application Structure

### Main Modules

#### 1. **Authentication** (`/auth`)
- Login
- Registration
- Password reset
- Forgot password

#### 2. **Store Management** (`/store-management`)
- Store details and configuration
- Store branding
- Store creation
- Retailer management
- Multi-store support
- Landing page configuration

#### 3. **Catalogue Management** (`/catalogue`)
- Products management
- Categories
- Product groups
- Brands
- Product types
- Product options
- Catalogues

#### 4. **Customer Management** (`/customers`)
- Customer profiles
- Customer options
- Manage customer options
- Option values
- Set credentials

#### 5. **Order Management** (`/orders`)
- Order list
- Order details
- Order history
- Order transactions
- Invoice generation

#### 6. **Content Management** (`/content`)
- Pages
- Boxes
- Promotions
- Images
- File uploads

#### 7. **Shipping** (`/shipping`)
- Shipping methods
- Shipping configuration
- Shipping packages
- Shipping rules
- Origin settings

#### 8. **Payment** (`/payment`)
- Payment methods
- Payment configuration

#### 9. **Tax Management** (`/tax-management`)
- Tax classes
- Tax rates

#### 10. **User Management** (`/user-management`)
- User list
- User profiles
- User creation
- User details
- Change password

#### 11. **Home Dashboard** (`/home`)
- Main dashboard with overview

### Shared Components
Located in `/shared`:
- Interceptors (HTTP)
- Guards (Route protection)
- Services (API communication)
- Models (Data structures)
- Validation utilities
- Reusable UI components

## Configuration

### Environment Modes
The application supports three operational modes:
- **STANDARD**: Default mode
- **MARKETPLACE**: Global categories and options
- **BTB**: Business-to-business mode

### API Configuration
- **Backend API**: `http://localhost:8080/api`
- **Shipping API**: `http://localhost:9090/shipping/api/v1`
- **Default Language**: English (en)
- **Supported Languages**: English, French

### Default Credentials
- **Username**: admin@shopizer.com
- **Password**: password

## Development

### Installation
```bash
npm install --legacy-peer-deps
```

### Local Development
```bash
ng serve -o
# Runs on http://localhost:4200
```

### Build
```bash
ng build
```

### Testing
```bash
npm run test
npm run test:coverage
```

### Linting
```bash
npm run lint
npm run lint:fix
npm run lint:styles
```

## Docker Support

### Docker Run
```bash
docker run \
  -e "APP_BASE_URL=http://localhost:9090/api" \
  -it --rm -p 4200:80 shopizerecomm/shopizer-admin
```

### Docker Configuration
- Dockerfile included
- Nginx configuration for production
- Environment variable support for API URL

## Key Features

### File Management
- File upload support (ngx-awesome-uploader, ngx-dropzone)
- Image gallery (ngx-lightbox)
- File manager (ng6-file-man)

### Data Visualization
- Charts (angular2-chartjs, ngx-charts, echarts)
- Maps integration (Leaflet, Google Maps)

### Form Components
- Rich text editor (Summernote)
- Query builder (angular2-query-builder)
- Multi-select dropdowns
- Phone number validation (libphonenumber-js)
- Tree components (angular-tree-component)

### UI/UX Features
- Custom scrollbars (ngx-malihu-scrollbar)
- Smart modals (ngx-smart-modal)
- Toast notifications (ngx-toastr)
- Icons (Eva Icons, Ionicons, Nebular Icons, PrimeIcons)

## Build & CI/CD
- CircleCI configuration included
- Conventional changelog support
- Compodoc for documentation generation
- ESLint and Stylelint for code quality

## Project Structure
```
shopizer-admin/
├── src/
│   ├── app/
│   │   ├── @core/          # Core services and utilities
│   │   ├── @theme/         # Theme configuration
│   │   └── pages/          # Feature modules
│   ├── assets/             # Static assets
│   ├── environments/       # Environment configs
│   └── index.html
├── docker/                 # Docker configurations
├── conf/                   # Nginx configurations
├── e2e/                    # End-to-end tests
└── documents/              # Documentation
```

## License
Licensed under Apache License (see LICENSE file)

## Notes
- Uses legacy peer dependencies for compatibility
- Requires Angular CLI v13.3.x globally installed
- Ivy compilation enabled with ngcc postinstall script
- Production build uses increased memory allocation (8GB)
