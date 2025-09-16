# RFID Jewelry Management System

A comprehensive React-based web application for managing jewelry inventory using RFID technology. Built with Vite, Tailwind CSS, and modern React patterns.

## Features

### 🏠 Landing Page
- Elegant and attractive design suitable for jewelry business
- Responsive layout with gradient backgrounds
- Feature highlights and testimonials
- Call-to-action sections

### 🔐 Authentication
- **Login Page**: Secure authentication with form validation
- **Onboarding Page**: Multi-step business setup process
- Dark mode support throughout

### 📊 Dashboard
- Real-time business metrics
- Sales overview charts
- Recent activities feed
- Top-selling products
- Low stock alerts

### 📦 Inventory Management
- **Add Stock**: Add new jewelry items with RFID tags
- **Purchase Entry**: Record supplier purchases
- **Stock Management**: Track inventory levels
- **RFID Integration**: Automatic tag generation and tracking

### 💰 Sales & Invoicing
- **Invoice Creation**: Professional invoice generation
- **Customer Management**: Track customer information
- **Payment Tracking**: Monitor payment status
- **Sales History**: Complete transaction records

### 📈 Reports & Analytics
- **Stock Reports**: Inventory levels and status
- **Sales Reports**: Performance metrics and trends
- **Purchase Reports**: Supplier analysis and spending
- **Financial Reports**: Comprehensive business insights

### 🎨 UI/UX Features
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works on all screen sizes
- **Modern UI**: Clean, professional interface
- **Reusable Components**: Consistent design system
- **Sidebar Navigation**: Organized menu structure with sub-menus

## Technology Stack

- **Frontend**: React 18 with JSX syntax
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **State Management**: React Context API
- **Form Handling**: Controlled components with validation

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rfid-jewelry-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

## Project Structure

```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Card.jsx
│   │   ├── Modal.jsx
│   │   └── ThemeToggle.jsx
│   └── layout/             # Layout components
│       ├── Sidebar.jsx
│       └── Header.jsx
├── contexts/
│   └── ThemeContext.jsx    # Dark mode context
├── pages/
│   ├── LandingPage.jsx
│   ├── LoginPage.jsx
│   ├── OnboardingPage.jsx
│   ├── DashboardPage.jsx
│   ├── PurchaseEntryPage.jsx
│   ├── AddStockPage.jsx
│   ├── InvoicePage.jsx
│   └── reports/
│       ├── StockReportsPage.jsx
│       ├── SalesReportsPage.jsx
│       └── PurchaseReportsPage.jsx
├── App.jsx                 # Main app component
├── main.jsx               # Entry point
└── index.css              # Global styles
```

## Key Features Implementation

### Dark Mode
- Context-based theme management
- Persistent theme preference
- Smooth transitions between themes
- Custom CSS variables for theming

### Responsive Design
- Mobile-first approach
- Breakpoint-based layouts
- Touch-friendly interfaces
- Optimized for all devices

### Component Architecture
- Reusable UI components
- Consistent design patterns
- Props-based customization
- Accessibility considerations

### Navigation Structure
- Hierarchical sidebar menu
- Sub-menu support
- Active state indicators
- Breadcrumb navigation

## Customization

### Colors
The application uses a custom color palette suitable for jewelry business:
- **Primary**: Orange/Gold tones
- **Gold**: Metallic gold variations
- **Silver**: Metallic silver variations

### Typography
- **Elegant**: Playfair Display (for headings)
- **Modern**: Inter (for body text)

### Animations
- Smooth transitions
- Hover effects
- Loading states
- Gentle bounce animations

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- ESLint configuration included
- Consistent formatting
- Component-based architecture
- Modern React patterns

## Future Enhancements

- [ ] RFID scanner integration
- [ ] Real-time inventory updates
- [ ] Advanced analytics dashboard
- [ ] Multi-location support
- [ ] API integration
- [ ] User role management
- [ ] Backup and restore
- [ ] Mobile app development

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Built with ❤️ for the jewelry industry**
