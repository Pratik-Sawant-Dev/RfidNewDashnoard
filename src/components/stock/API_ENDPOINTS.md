# Stock Management API Endpoints

This document outlines the three different API endpoints and their corresponding form structures for stock management.

## 1. Add Stock (Basic) - Tab 1

### API Endpoint
```
POST {{baseUrl}}/api/Product/create
```

### Form Data Structure
```json
{
  "itemCode": "JWL001",
  "categoryName": "Necklaces",
  "branchName": "Main Branch",
  "counterName": "Counter 1",
  "productName": "Gold Necklace",
  "designName": "Traditional",
  "purityName": "22K",
  "rfidCode": "RFID001",
  "grossWeight": 12.5,
  "netWeight": 11.2,
  "stoneWeight": 1.2,
  "diamondHeight": 3.0,
  "boxDetails": "Luxury wooden box",
  "size": 20,
  "stoneAmount": 25000,
  "diamondAmount": 35000,
  "hallmarkAmount": 800,
  "makingPerGram": 120,
  "makingPercentage": 18,
  "makingFixedAmount": 3000,
  "mrp": 95000,
  "status": "Active"
}
```

### Features
- ✅ React Hook Form validation
- ✅ Master data dropdowns (Category, Product, Branch, Counter, Design, Purity)
- ✅ RFID code update toggle for editing
- ✅ Real-time validation
- ✅ CRUD operations with list view
- ✅ Global search functionality
- ✅ Pagination

---

## 2. Add Stock with Images - Tab 2

### API Endpoint
```
POST {{baseUrl}}/api/Product/create-with-images
```

### Form Data Structure (Multipart FormData)
```
Content-Type: multipart/form-data

// Product fields
itemCode: "JWL002"
categoryName: "Necklaces"
branchName: "Main Branch"
counterName: "Counter 1"
productName: "Gold Necklace"
designName: "Traditional"
purityName: "22K"
rfidCode: "RFID002"
grossWeight: "12.5"
netWeight: "11.2"
stoneWeight: "1.2"
diamondHeight: "3.0"
boxDetails: "Luxury wooden box"
size: "20"
stoneAmount: "25000"
diamondAmount: "35000"
hallmarkAmount: "800"
makingPerGram: "120"
makingPercentage: "18"
makingFixedAmount: "3000"
mrp: "95000"
status: "Active"

// Image files and metadata
images: [File1, File2, File3, ...]
Images[0].ImageType: "Primary"
Images[0].DisplayOrder: "1"
Images[1].ImageType: "Secondary"
Images[1].DisplayOrder: "2"
Images[2].ImageType: "Secondary"
Images[2].DisplayOrder: "3"
```

### Features
- ✅ Complete product form with all fields
- ✅ Drag & drop image upload
- ✅ Multiple image selection
- ✅ Image preview grid (responsive 2-6 columns)
- ✅ Image metadata (Primary/Secondary, Display Order)
- ✅ File validation (PNG, JPG, JPEG, 10MB max)
- ✅ Individual image removal
- ✅ FormData multipart upload

---

## 3. Bulk Add Stock - Tab 3

### API Endpoint
```
POST {{baseUrl}}/api/Product/bulk-upload
```

### Form Data Structure (Multipart FormData)
```
Content-Type: multipart/form-data

file: [Excel/CSV File]
```

### Expected Excel/CSV Format
| Column | Required | Type | Description |
|--------|----------|------|-------------|
| itemCode | ✅ | Text | Unique item identifier |
| categoryName | ✅ | Text | Product category |
| branchName | ✅ | Text | Branch location |
| counterName | ✅ | Text | Counter location |
| productName | ✅ | Text | Product name |
| designName | ✅ | Text | Design type |
| purityName | ✅ | Text | Gold purity (22K, 18K, etc.) |
| rfidCode | ✅ | Text | Unique RFID identifier |
| grossWeight | ✅ | Number | Gross weight in grams |
| netWeight | ✅ | Number | Net weight in grams |
| stoneWeight | ❌ | Number | Stone weight in grams |
| diamondHeight | ❌ | Number | Diamond height in mm |
| boxDetails | ❌ | Text | Box description |
| size | ❌ | Number | Product size |
| stoneAmount | ❌ | Number | Stone cost in ₹ |
| diamondAmount | ❌ | Number | Diamond cost in ₹ |
| hallmarkAmount | ❌ | Number | Hallmark cost in ₹ |
| makingPerGram | ✅ | Number | Making charge per gram |
| makingPercentage | ❌ | Number | Making percentage |
| makingFixedAmount | ❌ | Number | Fixed making charge |
| mrp | ❌ | Number | Maximum retail price |
| status | ❌ | Text | Active/Inactive |

### Features
- ✅ Excel template download
- ✅ Drag & drop file upload (.xlsx, .xls, .csv)
- ✅ File type validation
- ✅ Upload progress tracking
- ✅ Success/failure summary
- ✅ Detailed error reporting with row numbers
- ✅ Bulk processing results

---

## Form Differences Summary

| Feature | Add Stock | Add Stock with Images | Bulk Add Stock |
|---------|-----------|----------------------|----------------|
| **API Endpoint** | `/api/Product/create` | `/api/Product/create-with-images` | `/api/Product/bulk-upload` |
| **Content Type** | `application/json` | `multipart/form-data` | `multipart/form-data` |
| **Form Type** | React Hook Form | Manual Form State | File Upload |
| **Validation** | Real-time | Manual | Server-side |
| **Master Data** | ✅ Dropdowns | ✅ Text Inputs | ❌ N/A |
| **Images** | ❌ | ✅ Multiple | ❌ |
| **Bulk Processing** | ❌ | ❌ | ✅ |
| **Template** | ❌ | ❌ | ✅ |
| **Error Handling** | Field-level | Field-level | Row-level |

---

## Implementation Notes

### 1. Add Stock (Tab 1)
- Uses React Hook Form for validation
- Integrates with master data APIs
- Supports edit mode with RFID toggle
- Includes list view with search and pagination

### 2. Add Stock with Images (Tab 2)
- Manual form state management
- FormData for multipart upload
- Image metadata structure: `Images[index].ImageType` and `Images[index].DisplayOrder`
- First image is always "Primary", others are "Secondary"

### 3. Bulk Add Stock (Tab 3)
- File upload only
- Server-side validation and processing
- Returns detailed success/failure summary
- Supports Excel (.xlsx, .xls) and CSV formats

---

## Error Handling

### Add Stock
- Field-level validation errors
- Toast notifications for API errors
- Form state preservation on errors

### Add Stock with Images
- Field validation before upload
- Image file validation
- Toast notifications for success/error
- Form reset on success

### Bulk Add Stock
- File type validation
- Upload progress indication
- Detailed error reporting with row numbers
- Success summary with counts

---

## Usage Examples

### Switching Between Tabs
```jsx
// In AddStockPage.jsx
const [activeTab, setActiveTab] = useState("add-stock");

// Tab switching
<button onClick={() => setActiveTab("add-stock")}>Add Stock</button>
<button onClick={() => setActiveTab("add-image")}>Add Stock Image</button>
<button onClick={() => setActiveTab("bulk-add")}>Bulk Add Stock</button>
```

### API Service Usage
```jsx
// Basic product creation
await apiService.createProduct(productData);

// Product with images
await apiService.createProductWithImages(formData);

// Bulk upload
await apiService.bulkUploadProducts(formData);
```

This structure ensures each tab has its own specific purpose and API integration while maintaining a consistent user experience across all three methods.
