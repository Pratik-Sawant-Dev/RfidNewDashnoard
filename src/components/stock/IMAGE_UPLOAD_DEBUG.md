# Image Upload Debugging Guide

## Issue: Images not being sent to backend

### Current Implementation

The `AddStockImageForm` component now sends images using the following FormData structure:

```javascript
FormData structure:
- itemCode: "QAS123"
- categoryName: "Bracelets"
- branchName: "Main Branch"
- counterName: "Counter 1"
- productName: "Diamond Earrings"
- designName: "Classic"
- purityName: "22K"
- rfidCode: "RFI7865"
- grossWeight: "10000"
- netWeight: "10"
- boxDetails: "Updated premium velvet box"
- makingPerGram: "10"
- status: "Active"
- Images[0].File: [File object]
- Images[0].ImageType: "Primary"
- Images[0].DisplayOrder: "1"
- Images[1].File: [File object]
- Images[1].ImageType: "Secondary"
- Images[1].DisplayOrder: "2"
```

### Possible Backend Expectations

The backend might expect one of these formats:

#### Option 1: Simple file array (current attempt)
```javascript
Images[0].File: File
Images[0].ImageType: "Primary"
Images[0].DisplayOrder: "1"
```

#### Option 2: Flat files with metadata
```javascript
files: File
files: File
ImageTypes: ["Primary", "Secondary"]
DisplayOrders: [1, 2]
```

#### Option 3: Named file parameters
```javascript
ImageFile0: File
ImageType0: "Primary"
DisplayOrder0: "1"
ImageFile1: File
ImageType1: "Secondary"
DisplayOrder1: "2"
```

#### Option 4: Simple images array
```javascript
images: File
images: File
```

### Testing Steps

1. **Check Console Logs**: Open browser DevTools and look for:
   - "=== FormData contents ==="
   - File names, sizes, and types
   - API Response

2. **Check Network Tab**:
   - Find the POST request to `/api/Product/create-with-images`
   - Check the Request Payload tab
   - Verify files are present in the Form Data section

3. **Backend Requirements**:
   - Check backend API documentation
   - Verify the expected FormData structure
   - Check if files should be sent with a specific parameter name

### Alternative Implementations

If images still don't upload, try modifying the FormData construction in `handleSubmit`:

#### Alternative 1: Simple images array
```javascript
images.forEach((image) => {
  submitData.append('images', image.file, image.file.name);
});
```

#### Alternative 2: IFormFile[] in .NET
```javascript
images.forEach((image, index) => {
  submitData.append('ImageFiles', image.file, image.file.name);
  submitData.append(`ImageTypes[${index}]`, index === 0 ? 'Primary' : 'Secondary');
  submitData.append(`DisplayOrders[${index}]`, (index + 1).toString());
});
```

#### Alternative 3: Complex object structure
```javascript
images.forEach((image, index) => {
  submitData.append(`Images[${index}][File]`, image.file, image.file.name);
  submitData.append(`Images[${index}][ImageType]`, index === 0 ? 'Primary' : 'Secondary');
  submitData.append(`Images[${index}][DisplayOrder]`, (index + 1).toString());
});
```

### Backend Model Expected (C# Example)

If your backend is .NET, it might expect:

```csharp
public class CreateProductWithImagesRequest
{
    // Product fields
    public string ItemCode { get; set; }
    public string CategoryName { get; set; }
    // ... other fields
    
    // Image files
    public List<IFormFile> Images { get; set; }
    
    // Or structured images:
    public List<ProductImage> Images { get; set; }
}

public class ProductImage
{
    public IFormFile File { get; set; }
    public string ImageType { get; set; }
    public int DisplayOrder { get; set; }
}
```

### Quick Fix Options

1. **Ask backend team** for exact FormData structure expected
2. **Use Postman/Insomnia** to test the API endpoint directly
3. **Check Swagger/API docs** if available
4. **Enable backend logging** to see what's received

### Current Debug Output

The form now logs:
- Total number of images
- Each field name and value
- File names, sizes, and types
- API response

Check browser console for this information when submitting.

