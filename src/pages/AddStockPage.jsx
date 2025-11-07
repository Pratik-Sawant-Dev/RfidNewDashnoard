import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Package,
  Tag,
  CheckCircle,
  Loader2,
  Edit,
  Trash2,
  List,
  Image,
  Upload,
  Search,
  X,
  Plus,
  Settings,
} from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Card from "../components/ui/Card";
import Pagination from "../components/ui/Pagination";
import { ToastContainer } from "../components/ui/Toast";
import AddStockImageForm from "../components/stock/AddStockImageForm";
import BulkAddStockForm from "../components/stock/BulkAddStockForm";
import apiService from "../services/apiService";
import useToast from "../hooks/useToast";

const AddStockPage = () => {
  const [stockItems, setStockItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showList, setShowList] = useState(false);
  const [allowRfidUpdate, setAllowRfidUpdate] = useState(false);
  const [activeTab, setActiveTab] = useState("add-stock");
  const [searchQuery, setSearchQuery] = useState("");
  const [customFields, setCustomFields] = useState([]);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  
  const { success, error, toasts, removeToast } = useToast();

  // React Hook Form setup
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    setValue,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      itemCode: "",
      categoryName: "",
      branchName: "",
      counterName: "",
      productName: "",
      designName: "",
      purityName: "",
      rfidCode: "",
      grossWeight: "",
      netWeight: "",
      stoneWeight: "",
      diamondHeight: "",
      boxDetails: "",
      size: "",
      stoneAmount: "",
      diamondAmount: "",
      hallmarkAmount: "",
      makingPerGram: "",
      makingPercentage: "",
      makingFixedAmount: "",
      mrp: "",
      status: "Active",
    },
  });

  // Master data states
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [counters, setCounters] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [purities, setPurities] = useState([]);
  const [boxes, setBoxes] = useState([]);

  // Load all products and master data on component mount
  useEffect(() => {
    loadProducts();
    loadMasterData();
  }, []);

  // Load master data from APIs
  const loadMasterData = async () => {
    try {
      const [
        categoriesRes,
        productsRes,
        branchesRes,
        countersRes,
        designsRes,
        puritiesRes,
        boxesRes,
      ] = await Promise.all([
        apiService.getCategories(),
        apiService.getProducts(),
        apiService.getBranches(),
        apiService.getCounters(),
        apiService.getDesigns(),
        apiService.getPurities(),
        apiService.getBoxes(),
      ]);

      setCategories(categoriesRes.data || categoriesRes || []);
      setProducts(productsRes.data || productsRes || []);
      setBranches(branchesRes.data || branchesRes || []);
      setCounters(countersRes.data || countersRes || []);
      setDesigns(designsRes.data || designsRes || []);
      setPurities(puritiesRes.data || puritiesRes || []);
      setBoxes(boxesRes.data || boxesRes || []);
    } catch (error) {
      console.error("Error loading master data:", error);
      error("Failed to load master data");
    }
  };

  console.log(categories);
  console.log(products);
  console.log(branches);
  console.log(counters);
  console.log(designs);
  console.log(purities);
  console.log(boxes);

  // Load products from API
  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllProducts();
      setStockItems(response.data || response || []);
    } catch (error) {
      console.error("Error loading products:", error);
      error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    reset({
      itemCode: "",
      categoryName: "",
      branchName: "",
      counterName: "",
      productName: "",
      designName: "",
      purityName: "",
      rfidCode: "",
      grossWeight: "",
      netWeight: "",
      stoneWeight: "",
      diamondHeight: "",
      boxDetails: "",
      size: "",
      stoneAmount: "",
      diamondAmount: "",
      hallmarkAmount: "",
      makingPerGram: "",
      makingPercentage: "",
      makingFixedAmount: "",
      mrp: "",
      status: "Active",
    });
    setEditingItem(null);
    setAllowRfidUpdate(false);
    setCustomFields([]);
  };

  // Custom Fields Functions
  const addCustomField = () => {
    setCustomFields([...customFields, { key: "", value: "", id: Date.now() }]);
  };

  const removeCustomField = (id) => {
    setCustomFields(customFields.filter((field) => field.id !== id));
  };

  const updateCustomField = (id, field, value) => {
    setCustomFields(
      customFields.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleAddItem = async (data) => {
    try {
      setLoading(true);
      
      // Convert custom fields array to object format
      const customFieldsObj = {};
      customFields.forEach((field) => {
        if (field.key && field.value) {
          customFieldsObj[field.key] = field.value;
        }
      });

      const productData = {
        itemCode: data.itemCode,
        categoryName: data.categoryName,
        branchName: data.branchName,
        counterName: data.counterName,
        productName: data.productName,
        designName: data.designName,
        purityName: data.purityName,
        rfidCode: data.rfidCode,
        grossWeight: parseFloat(data.grossWeight),
        netWeight: parseFloat(data.netWeight),
        stoneWeight: parseFloat(data.stoneWeight) || 0,
        diamondHeight: parseFloat(data.diamondHeight) || 0,
        boxDetails: data.boxDetails || "",
        size: parseFloat(data.size) || 0,
        stoneAmount: parseFloat(data.stoneAmount) || 0,
        diamondAmount: parseFloat(data.diamondAmount) || 0,
        hallmarkAmount: parseFloat(data.hallmarkAmount) || 0,
        makingPerGram: parseFloat(data.makingPerGram),
        makingPercentage: parseFloat(data.makingPercentage) || 0,
        makingFixedAmount: parseFloat(data.makingFixedAmount) || 0,
        mrp: parseFloat(data.mrp) || 0,
        status: data.status || "Active",
        customFields: Object.keys(customFieldsObj).length > 0 ? customFieldsObj : undefined,
      };

             const result = await apiService.createProduct(productData);
       if (result) {
         success("Product added successfully");
         resetForm();
         await loadProducts();
       } else {
         error(result.message);
       }
    } catch (err) {
      console.error("Error adding product:", err);
      error(err.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const handleEditItem = async (item) => {
    try {
      setLoading(true);
      // Fetch fresh product data from API
      const response = await apiService.getProductById(item.id);
      const productData = response.data || response;
      
      setEditingItem(productData);
      
      // Use setValue to populate form fields with fresh data
      Object.keys(productData).forEach((key) => {
        if (key !== 'id' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'customFields') {
          setValue(key, productData[key] || "");
        }
      });

      // Load custom fields if they exist
      if (productData.customFields && typeof productData.customFields === 'object') {
        const fieldsArray = Object.entries(productData.customFields).map(([key, value]) => ({
          id: Date.now() + Math.random(),
          key: key,
          value: String(value),
        }));
        setCustomFields(fieldsArray);
      } else {
        setCustomFields([]);
      }
      
             // Switch to form view and scroll to top
       window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Error fetching product details:", err);
      error("Failed to load product details");
      
      // Fallback to using item data if API call fails
      setEditingItem(item);
      Object.keys(item).forEach((key) => {
        if (key !== 'id' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'customFields') {
          setValue(key, item[key] || "");
        }
      });

      // Load custom fields from item if available
      if (item.customFields && typeof item.customFields === 'object') {
        const fieldsArray = Object.entries(item.customFields).map(([key, value]) => ({
          id: Date.now() + Math.random(),
          key: key,
          value: String(value),
        }));
        setCustomFields(fieldsArray);
      } else {
        setCustomFields([]);
      }

             window.scrollTo({ top: 0, behavior: "smooth" });
     } finally {
       setLoading(false);
     }
   };

  const handleUpdateItem = async (data) => {
    if (!editingItem) return;
    
    try {
      setLoading(true);

      // Convert custom fields array to object format
      const customFieldsObj = {};
      customFields.forEach((field) => {
        if (field.key && field.value) {
          customFieldsObj[field.key] = field.value;
        }
      });

      const productData = {
        itemCode: data.itemCode,
        categoryName: data.categoryName,
        branchName: data.branchName,
        counterName: data.counterName,
        productName: data.productName,
        designName: data.designName,
        purityName: data.purityName,
        grossWeight: parseFloat(data.grossWeight),
        netWeight: parseFloat(data.netWeight),
        stoneWeight: parseFloat(data.stoneWeight) || 0,
        diamondHeight: parseFloat(data.diamondHeight) || 0,
        boxDetails: data.boxDetails || "",
        size: parseFloat(data.size) || 0,
        stoneAmount: parseFloat(data.stoneAmount) || 0,
        diamondAmount: parseFloat(data.diamondAmount) || 0,
        hallmarkAmount: parseFloat(data.hallmarkAmount) || 0,
        makingPerGram: parseFloat(data.makingPerGram),
        makingPercentage: parseFloat(data.makingPercentage) || 0,
        makingFixedAmount: parseFloat(data.makingFixedAmount) || 0,
        mrp: parseFloat(data.mrp) || 0,
        status: data.status || "Active",
        customFields: Object.keys(customFieldsObj).length > 0 ? customFieldsObj : undefined,
      };

      // Only include RFID code in update if toggle is enabled
      if (allowRfidUpdate) {
        productData.rfidCode = data.rfidCode;
      }

             await apiService.updateProduct(editingItem.id, productData);
       success("Product updated successfully");
       resetForm();
       await loadProducts();
    } catch (err) {
      console.error("Error updating product:", err);
      error(err.response?.data?.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        setLoading(true);
        await apiService.deleteProduct(itemId);
        success("Product deleted successfully");
        loadProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        error("Failed to delete product");
      } finally {
        setLoading(false);
      }
    }
  };

  const onSubmit = (data) => {
    if (editingItem) {
      handleUpdateItem(data);
    } else {
      handleAddItem(data);
    }
  };

  // Search and filter
  const filteredItems = stockItems.filter((item) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.itemCode?.toLowerCase().includes(query) ||
      item.productName?.toLowerCase().includes(query) ||
      item.categoryName?.toLowerCase().includes(query) ||
      item.branchName?.toLowerCase().includes(query) ||
      item.rfidCode?.toLowerCase().includes(query) ||
      item.designName?.toLowerCase().includes(query) ||
      item.purityName?.toLowerCase().includes(query)
    );
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
          Stock Management
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Manage your jewelry inventory with RFID tracking
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-1 p-1" aria-label="Tabs">
                         <button
               onClick={() => {
                 setActiveTab("add-stock");
               }}
              className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === "add-stock"
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Add Stock</span>
            </button>
                         <button
               onClick={() => {
                 setActiveTab("add-image");
               }}
              className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === "add-image"
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <Image className="w-4 h-4" />
              <span>Add Stock Image</span>
            </button>
                         <button
               onClick={() => {
                 setActiveTab("bulk-add");
               }}
              className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === "bulk-add"
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Bulk Add Stock</span>
            </button>
          </nav>
        </div>
      </div>

             {/* Tab Content */}
       {activeTab === "add-stock" && (
         <Card>
           {loading && editingItem ? (
             <div className="text-center py-12">
               <Loader2 className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
               <p className="text-gray-500 dark:text-gray-400">
                 Loading product details...
               </p>
             </div>
           ) : (
           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Section 1: Item Code & RFID Code */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Item Code"
                  {...register("itemCode", {
                    required: "Item Code is required",
                  })}
                  placeholder="Enter item code"
                  error={errors.itemCode?.message}
                  required
                />
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      RFID Code <span className="text-red-500 ml-1">*</span>
                    </label>
                    {editingItem && (
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {allowRfidUpdate ? "Editable" : "Locked"}
                        </span>
                        <button
                          type="button"
                          onClick={() => setAllowRfidUpdate(!allowRfidUpdate)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            allowRfidUpdate
                              ? "bg-blue-600"
                              : "bg-gray-300 dark:bg-gray-600"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              allowRfidUpdate ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    )}
                  </div>
                  <Input
                    {...register("rfidCode", {
                      required:
                        !editingItem || allowRfidUpdate
                          ? "RFID Code is required"
                          : false,
                    })}
                    placeholder="Enter RFID code"
                    error={errors.rfidCode?.message}
                    disabled={editingItem && !allowRfidUpdate}
                    className={
                      editingItem && !allowRfidUpdate
                        ? "bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                        : ""
                    }
                  />
                  {editingItem && allowRfidUpdate && (
                    <p className="mt-1 text-xs text-amber-600 dark:text-amber-400 flex items-center">
                      <Tag className="w-3 h-3 mr-1" />
                      RFID code will be updated in the system
                    </p>
                  )}
                  {editingItem && !allowRfidUpdate && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <Tag className="w-3 h-3 mr-1" />
                      RFID code will not be changed
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Product Details */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <Package className="w-4 h-4 mr-2" />
                Product Details
              </h3>

              {/* Row 1: Category, Product, Branch, Counter */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                <Controller
                  name="categoryName"
                  control={control}
                  rules={{ required: "Category is required" }}
                  render={({ field }) => (
                    <Select
                      label="Category"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select or type..."
                      searchable={true}
                      required
                      error={errors.categoryName?.message}
                      options={categories
                        .filter((category) => category)
                        .map((category) => {
                          const name =
                            typeof category === "object"
                              ? category.categoryName
                              : category;
                          return { value: name || "", label: name || "" };
                        })}
                    />
                  )}
                />
                <Controller
                  name="productName"
                  control={control}
                  rules={{ required: "Product is required" }}
                  render={({ field }) => (
                    <Select
                      label="Product"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select or type..."
                      searchable={true}
                      required
                      error={errors.productName?.message}
                      options={products
                        .filter((product) => product)
                        .map((product) => {
                          const name =
                            typeof product === "object"
                              ? product.productName
                              : product;
                          return { value: name || "", label: name || "" };
                        })}
                    />
                  )}
                />
                <Controller
                  name="branchName"
                  control={control}
                  rules={{ required: "Branch is required" }}
                  render={({ field }) => (
                    <Select
                      label="Branch"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select or type..."
                      searchable={true}
                      required
                      error={errors.branchName?.message}
                      options={branches
                        .filter((branch) => branch)
                        .map((branch) => {
                          const name =
                            typeof branch === "object" ? branch.branchName : branch;
                          return { value: name || "", label: name || "" };
                        })}
                    />
                  )}
                />
                <Controller
                  name="counterName"
                  control={control}
                  rules={{ required: "Counter is required" }}
                  render={({ field }) => (
                    <Select
                      label="Counter"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select or type..."
                      searchable={true}
                      required
                      error={errors.counterName?.message}
                      options={counters
                        .filter((counter) => counter)
                        .map((counter) => {
                          const name =
                            typeof counter === "object"
                              ? counter.counterName
                              : counter;
                          return { value: name || "", label: name || "" };
                        })}
                    />
                  )}
                />
              </div>

              {/* Row 2: Design, Purity & Weights */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-3">
                <Controller
                  name="designName"
                  control={control}
                  rules={{ required: "Design is required" }}
                  render={({ field }) => (
                    <Select
                      label="Design"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select or type..."
                      searchable={true}
                      required
                      error={errors.designName?.message}
                      options={designs
                        .filter((design) => design)
                        .map((design) => {
                          const name =
                            typeof design === "object" ? design.designName : design;
                          return { value: name || "", label: name || "" };
                        })}
                    />
                  )}
                />
                <Controller
                  name="purityName"
                  control={control}
                  rules={{ required: "Purity is required" }}
                  render={({ field }) => (
                    <Select
                      label="Purity"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select or type..."
                      searchable={true}
                      required
                      error={errors.purityName?.message}
                      options={purities
                        .filter((purity) => purity)
                        .map((purity) => {
                          const name =
                            typeof purity === "object" ? purity.purityName : purity;
                          return { value: name || "", label: name || "" };
                        })}
                    />
                  )}
                />
                <Input
                  label="Gross Wt (g)"
                  type="number"
                  step="0.01"
                  {...register("grossWeight", {
                    required: "Gross Weight is required",
                    min: { value: 0, message: "Must be positive" },
                  })}
                  placeholder="0.00"
                  error={errors.grossWeight?.message}
                  required
                />
                <Input
                  label="Net Wt (g)"
                  type="number"
                  step="0.01"
                  {...register("netWeight", {
                    required: "Net Weight is required",
                    min: { value: 0, message: "Must be positive" },
                  })}
                  placeholder="0.00"
                  error={errors.netWeight?.message}
                  required
                />
                <Input
                  label="Stone Wt (g)"
                  type="number"
                  step="0.01"
                  {...register("stoneWeight")}
                  placeholder="0.00"
                  error={errors.stoneWeight?.message}
                />
                <Input
                  label="Diamond H (mm)"
                  type="number"
                  step="0.01"
                  {...register("diamondHeight")}
                  placeholder="0.00"
                  error={errors.diamondHeight?.message}
                />
              </div>

              {/* Row 3: Size, Box, Amounts */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-3">
                <Input
                  label="Size"
                  type="number"
                  step="0.1"
                  {...register("size")}
                  placeholder="0.0"
                  error={errors.size?.message}
                />
                <Input
                  label="Box Details"
                  {...register("boxDetails")}
                  placeholder="Box"
                  error={errors.boxDetails?.message}
                />
                <Input
                  label="Stone Amt (₹)"
                  type="number"
                  step="0.01"
                  {...register("stoneAmount")}
                  placeholder="0.00"
                  error={errors.stoneAmount?.message}
                />
                <Input
                  label="Diamond Amt (₹)"
                  type="number"
                  step="0.01"
                  {...register("diamondAmount")}
                  placeholder="0.00"
                  error={errors.diamondAmount?.message}
                />
                <Input
                  label="Hallmark (₹)"
                  type="number"
                  step="0.01"
                  {...register("hallmarkAmount")}
                  placeholder="0.00"
                  error={errors.hallmarkAmount?.message}
                />
                <Input
                  label="Making/g (₹)"
                  type="number"
                  step="0.01"
                  {...register("makingPerGram", {
                    required: "Making per gram is required",
                    min: { value: 0, message: "Must be positive" },
                  })}
                  placeholder="0.00"
                  error={errors.makingPerGram?.message}
                  required
                />
              </div>

              {/* Row 4: Making, MRP, Status */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Input
                  label="Making % (%)"
                  type="number"
                  step="0.01"
                  {...register("makingPercentage")}
                  placeholder="0.00"
                  error={errors.makingPercentage?.message}
                />
                <Input
                  label="Making Fixed (₹)"
                  type="number"
                  step="0.01"
                  {...register("makingFixedAmount")}
                  placeholder="0.00"
                  error={errors.makingFixedAmount?.message}
                />
                <Input
                  label="MRP (₹)"
                  type="number"
                  step="0.01"
                  {...register("mrp")}
                  placeholder="0.00"
                  error={errors.mrp?.message}
                />
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="Status"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select"
                      error={errors.status?.message}
                      options={[
                        { value: "Active", label: "Active" },
                        { value: "Inactive", label: "Inactive" },
                      ]}
                    />
                  )}
                />
              </div>
            </div>

            {/* Section 3: Custom Fields */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  Custom Fields
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCustomField}
                  className="flex items-center space-x-1.5 h-8 px-3 text-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Field</span>
                </Button>
              </div>

              {customFields.length === 0 ? (
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                  <Settings className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    No custom fields added. Click "Add Field" to create custom fields for this product.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {customFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 p-2.5 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex-1 min-w-0">
                        <input
                          type="text"
                          value={field.key}
                          onChange={(e) =>
                            updateCustomField(field.id, "key", e.target.value)
                          }
                          placeholder="Field Name (e.g., Ring Size)"
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <input
                          type="text"
                          value={field.value}
                          onChange={(e) =>
                            updateCustomField(field.id, "value", e.target.value)
                          }
                          placeholder="Field Value"
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCustomField(field.id)}
                        className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 transition-colors border border-red-200 dark:border-red-800"
                        title="Remove field"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

                         {/* Form Actions */}
             <div className="flex justify-end items-center pt-4 border-t border-gray-200 dark:border-gray-700">
               <div className="flex space-x-2">
                 {editingItem && (
                   <Button variant="outline" size="sm" type="button" onClick={resetForm}>
                     Cancel
                   </Button>
                 )}
                 <Button
                   variant="accent"
                   size="sm"
                   type="submit"
                   disabled={!isValid || loading}
                 >
                   {loading ? (
                     <>
                       <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                       {editingItem ? "Updating..." : "Adding..."}
                     </>
                   ) : (
                     <>{editingItem ? "Update" : "Add Stock"}</>
                   )}
                 </Button>
               </div>
             </div>
           </form>
           )}
         </Card>
       )}

      {/* Add Stock Image Tab */}
      {activeTab === "add-image" && <AddStockImageForm />}

      {/* Bulk Add Stock Tab */}
      {activeTab === "bulk-add" && <BulkAddStockForm />}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default AddStockPage;
