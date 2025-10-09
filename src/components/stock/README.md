# Stock Management Modules

This directory contains the stock management components for the RFID Advance application.

## Components

### 1. AddStockPage (Main Component)
Located in `src/pages/AddStockPage.jsx`

**Features:**
- Three tabbed interface for different stock operations
- Global search functionality across all stock items
- Pagination with customizable rows per page (25, 50, 100)
- Full CRUD operations for stock items
- RFID code update toggle for secure editing
- Responsive design for all screen sizes

**Tabs:**
1. **Add Stock** - Main stock entry form
2. **Add Stock Image** - Upload images for stock items
3. **Bulk Add Stock** - Import multiple items via Excel/CSV

---

### 2. Add Stock Form (Default Tab)
The main stock entry form with all product details.

**Features:**
- React Hook Form validation
- Dynamic dropdown fields populated from master data
- RFID code update toggle (for editing mode)
- Real-time form validation
- Item Code, RFID Code (required)
- Category, Product, Branch, Counter (required)
- Design, Purity (required)
- Weight measurements (Gross, Net, Stone, Diamond)
- Pricing details (Stone Amount, Diamond Amount, Hallmark, Making charges, MRP)
- Status management (Active/Inactive)

**List View Features:**
- Global search across all fields
- Pagination controls
- Edit/Delete actions
- Responsive table design
- Filter counter display

---

### 3. AddStockImageForm Component
Located in `src/components/stock/AddStockImageForm.jsx`

**Purpose:** Upload product images linked to stock items

**Features:**
- Drag and drop file upload
- Multiple image selection
- Image preview grid
- Individual image removal
- Item code association
- File type validation (PNG, JPG, JPEG)
- File size limit (10MB per image)
- Responsive grid layout (2-6 columns based on screen size)

**Usage:**
```jsx
import AddStockImageForm from '../components/stock/AddStockImageForm';

<AddStockImageForm />
```

**Workflow:**
1. Enter item code
2. Drag & drop or click to upload images
3. Preview uploaded images
4. Remove unwanted images
5. Submit to associate images with product

---

### 4. BulkAddStockForm Component
Located in `src/components/stock/BulkAddStockForm.jsx`

**Purpose:** Import multiple stock items from Excel or CSV files

**Features:**
- Excel template download
- Drag and drop file upload
- File type validation (.xlsx, .xls, .csv)
- Upload progress tracking
- Success/failure summary
- Detailed error reporting
- Row-level error messages

**Usage:**
```jsx
import BulkAddStockForm from '../components/stock/BulkAddStockForm';

<BulkAddStockForm />
```

**Workflow:**
1. Download Excel template
2. Fill in product data following the template format
3. Upload completed file
4. Review upload summary
5. Check errors and fix failed rows
6. Re-upload corrected data if needed

**Upload Summary Includes:**
- Total items processed
- Successfully added count
- Failed items count
- Detailed error list with row numbers

---

## Global Search Functionality

The search feature allows filtering across multiple fields:
- Item Code
- Product Name
- Category Name
- Branch Name
- RFID Code
- Design Name
- Purity Name

**Features:**
- Real-time search filtering
- Search term highlighting in results
- Clear search button (X icon)
- Filtered count display
- Pagination resets to page 1 on search

---

## Integration Example

```jsx
import AddStockPage from './pages/AddStockPage';

// In your routing
<Route path="/stock" element={<AddStockPage />} />
```

---

## API Endpoints Used

- `GET /api/Product/all` - Fetch all products
- `GET /api/Product/{id}` - Fetch product by ID
- `POST /api/Product/create` - Create new product
- `PUT /api/Product/{id}` - Update product
- `DELETE /api/Product/{id}` - Delete product
- `GET /api/Category/all` - Fetch categories
- `GET /api/Product/all` - Fetch products (master)
- `GET /api/Branch/all` - Fetch branches
- `GET /api/Counter/all` - Fetch counters
- `GET /api/Design/all` - Fetch designs
- `GET /api/Purity/all` - Fetch purities
- `GET /api/Box/all` - Fetch boxes

---

## State Management

### Add Stock Form States
- `stockItems` - Array of all stock items
- `loading` - Loading indicator
- `editingItem` - Currently editing item
- `showList` - Toggle between form and list view
- `allowRfidUpdate` - RFID code edit permission
- `activeTab` - Current active tab
- `searchQuery` - Global search term
- `currentPage` - Pagination current page
- `itemsPerPage` - Items per page (25/50/100)

---

## Responsive Design

### Mobile (< 640px)
- Stacked layout
- Compact form fields
- Single column grids
- Simplified pagination

### Tablet (640px - 1024px)
- 2-column grids
- Adaptive layouts
- Medium pagination

### Desktop (> 1024px)
- Full multi-column grids
- Expanded tables
- Complete pagination controls

---

## Best Practices

1. **Always validate** required fields before submission
2. **Use unique RFID codes** for each product
3. **Enable RFID toggle** only when intentionally updating
4. **Download template** before bulk upload
5. **Review errors** after bulk upload
6. **Search before adding** to avoid duplicates
7. **Use pagination** for large datasets

---

## Future Enhancements

- [ ] Image compression before upload
- [ ] Bulk edit functionality
- [ ] Export to Excel
- [ ] Advanced filters
- [ ] Barcode scanning integration
- [ ] Duplicate detection
- [ ] Audit trail
- [ ] Print labels

---

## Support

For issues or questions, contact the development team.

