"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Save, X, Search, Trash2, Plus, Upload, Image as ImageIcon, Settings, Eye } from "lucide-react";

// ==================== TYPE DEFINITIONS ====================
interface MaterialMaster {
  id: number;
  sNo: number;
  itemCode: string;
  refCodeSkuId: string;
  category: string;
  brand: string;
  itemGroup: string;
  itemSubGroup: string;
  itemColour: string;
  itemSize: string;
  itemName: string;
  aliasName: string;
  printName: string;
  hsnSac: string;
  assetGroup: string;
  compositeItem: string;
  inventoryType: string;
  primaryUom: string;
  perUnitQuantity: number;
  secondaryUom: string;
  unitRate: number;
  averageLifeKm: number;
  averageLifeDays: number;
  usageType: string;
  // Checkboxes
  stockItem: boolean;
  poRequired: boolean;
  returnable: boolean;
  stationeryItem: boolean;
  serialedItem: boolean;
  lengthRequired: boolean;
  widthRequired: boolean;
  heightRequired: boolean;
  measurementRequired: boolean;
  qtyRequired: boolean;
  colorRequired: boolean;
  nameDesignRequired: boolean;
  inventoryControl: boolean;
  preventiveItem: boolean;
  repairCategory: string;
  isVirtualSeries: boolean;
  isInputSeries: boolean;
  ledger: string;
  provisionalLedger: string;
  defaultGstType: string;
  itemDescription: string;
  active: boolean;
  imageUploaded: boolean;
  imageUrl: string;
}

// ==================== MOCK INITIAL DATA ====================
const initialMaterialData: MaterialMaster[] = [
  { id: 1, sNo: 1, itemCode: "M0001", refCodeSkuId: "SKU001", category: "FINISHED ITEM", brand: "Samsung", itemGroup: "ELECTRONICS", itemSubGroup: "Mobile Phones", itemColour: "Black", itemSize: "6.1 inch", itemName: "Samsung Galaxy S24", aliasName: "Galaxy S24", printName: "Samsung S24", hsnSac: "85171300", assetGroup: "ELECTRONICS", compositeItem: "No", inventoryType: "Stock", primaryUom: "PCS", perUnitQuantity: 1, secondaryUom: "BOX", unitRate: 65000, averageLifeKm: 0, averageLifeDays: 730, usageType: "Consumable", stockItem: true, poRequired: true, returnable: false, stationeryItem: false, serialedItem: true, lengthRequired: false, widthRequired: false, heightRequired: false, measurementRequired: false, qtyRequired: true, colorRequired: true, nameDesignRequired: false, inventoryControl: true, preventiveItem: false, repairCategory: "Electronics", isVirtualSeries: false, isInputSeries: false, ledger: "Stock Account", provisionalLedger: "Purchase Account", defaultGstType: "GST 18%", itemDescription: "Samsung Galaxy S24 mobile phone", active: true, imageUploaded: false, imageUrl: "" },
  { id: 2, sNo: 2, itemCode: "M0002", refCodeSkuId: "SKU002", category: "FINISHED ITEM", brand: "Apple", itemGroup: "ELECTRONICS", itemSubGroup: "Laptops", itemColour: "Silver", itemSize: "13 inch", itemName: "MacBook Air M2", aliasName: "MBA M2", printName: "Apple MacBook Air", hsnSac: "84713000", assetGroup: "ELECTRONICS", compositeItem: "No", inventoryType: "Stock", primaryUom: "PCS", perUnitQuantity: 1, secondaryUom: "BOX", unitRate: 119000, averageLifeKm: 0, averageLifeDays: 1095, usageType: "Capital Goods", stockItem: true, poRequired: true, returnable: false, stationeryItem: false, serialedItem: true, lengthRequired: false, widthRequired: false, heightRequired: false, measurementRequired: false, qtyRequired: true, colorRequired: true, nameDesignRequired: false, inventoryControl: true, preventiveItem: false, repairCategory: "Electronics", isVirtualSeries: false, isInputSeries: false, ledger: "Stock Account", provisionalLedger: "Purchase Account", defaultGstType: "GST 18%", itemDescription: "Apple MacBook Air M2 laptop", active: true, imageUploaded: false, imageUrl: "" },
  { id: 3, sNo: 3, itemCode: "M0003", refCodeSkuId: "SKU003", category: "RAW MATERIAL", brand: "HP", itemGroup: "STATIONERY", itemSubGroup: "Printer Paper", itemColour: "White", itemSize: "A4", itemName: "A4 Printer Paper", aliasName: "A4 Paper", printName: "HP A4 Paper", hsnSac: "48025690", assetGroup: "STATIONERY", compositeItem: "No", inventoryType: "Stock", primaryUom: "REAM", perUnitQuantity: 500, secondaryUom: "BOX", unitRate: 350, averageLifeKm: 0, averageLifeDays: 365, usageType: "Consumable", stockItem: true, poRequired: true, returnable: false, stationeryItem: true, serialedItem: false, lengthRequired: false, widthRequired: false, heightRequired: false, measurementRequired: false, qtyRequired: true, colorRequired: false, nameDesignRequired: false, inventoryControl: true, preventiveItem: false, repairCategory: "", isVirtualSeries: false, isInputSeries: false, ledger: "Stock Account", provisionalLedger: "Purchase Account", defaultGstType: "GST 12%", itemDescription: "A4 size printer paper 500 sheets", active: true, imageUploaded: false, imageUrl: "" },
];

// Dropdown options
const categoryOptions = ["FINISHED ITEM", "RAW MATERIAL", "SEMI FINISHED", "CONSUMABLE", "SERVICE", "ASSET"];
const brandOptions = ["Samsung", "Apple", "HP", "Dell", "Lenovo", "LG", "Sony", "Boat", "Nike", "Adidas", "Generic"];
const itemGroupOptions = ["ELECTRONICS", "STATIONERY", "FURNITURE", "VEHICLE", "CLOTHING", "FOOD", "CHEMICALS", "PACKAGING"];
const itemSubGroupOptions = ["Mobile Phones", "Laptops", "Printers", "Desktops", "Paper Products", "Pens", "Desks", "Chairs"];
const compositeItemOptions = ["Yes", "No"];
const inventoryTypeOptions = ["Stock", "Non-Stock", "Service", "Asset"];
const uomOptions = ["PCS", "BOX", "REAM", "KG", "LTR", "METER", "ROLL", "SET", "DOZEN", "GRAM", "ML", "CM"];
const usageTypeOptions = ["Consumable", "Capital Goods", "Trading", "Manufacturing", "Service"];
const ledgerOptions = ["Stock Account", "Purchase Account", "Sales Account", "Expense Account", "Asset Account"];
const provisionalLedgerOptions = ["Purchase Account", "Expense Account", "CGS Account"];
const gstTypeOptions = ["GST 5%", "GST 12%", "GST 18%", "GST 28%", "GST 0%", "Exempted", "Nil Rated"];
const repairCategoryOptions = ["Electronics", "Mechanical", "Vehicle", "Furniture", "None"];

export default function MaterialMaster() {
  // Form state for Entry Tab
  const [formId, setFormId] = useState<number | null>(null);
  const [itemCode, setItemCode] = useState("");
  const [refCodeSkuId, setRefCodeSkuId] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [itemGroup, setItemGroup] = useState("");
  const [itemSubGroup, setItemSubGroup] = useState("");
  const [itemColour, setItemColour] = useState("");
  const [itemSize, setItemSize] = useState("");
  const [itemName, setItemName] = useState("");
  const [aliasName, setAliasName] = useState("");
  const [printName, setPrintName] = useState("");
  const [hsnSac, setHsnSac] = useState("");
  const [assetGroup, setAssetGroup] = useState("");
  const [compositeItem, setCompositeItem] = useState("");
  const [inventoryType, setInventoryType] = useState("");
  const [primaryUom, setPrimaryUom] = useState("PCS");
  const [perUnitQuantity, setPerUnitQuantity] = useState<number>(0);
  const [secondaryUom, setSecondaryUom] = useState("PCS");
  const [unitRate, setUnitRate] = useState<number>(0);
  const [averageLifeKm, setAverageLifeKm] = useState<number>(0);
  const [averageLifeDays, setAverageLifeDays] = useState<number>(0);
  const [usageType, setUsageType] = useState("");

  // Checkbox states
  const [stockItem, setStockItem] = useState(false);
  const [poRequired, setPoRequired] = useState(false);
  const [returnable, setReturnable] = useState(false);
  const [stationeryItem, setStationeryItem] = useState(false);
  const [serialedItem, setSerialedItem] = useState(false);
  const [lengthRequired, setLengthRequired] = useState(false);
  const [widthRequired, setWidthRequired] = useState(false);
  const [heightRequired, setHeightRequired] = useState(false);
  const [measurementRequired, setMeasurementRequired] = useState(false);
  const [qtyRequired, setQtyRequired] = useState(false);
  const [colorRequired, setColorRequired] = useState(false);
  const [nameDesignRequired, setNameDesignRequired] = useState(false);
  const [inventoryControl, setInventoryControl] = useState(false);
  const [preventiveItem, setPreventiveItem] = useState(false);
  const [repairCategory, setRepairCategory] = useState("");
  const [isVirtualSeries, setIsVirtualSeries] = useState(false);
  const [isInputSeries, setIsInputSeries] = useState(false);

  // Other fields
  const [ledger, setLedger] = useState("");
  const [provisionalLedger, setProvisionalLedger] = useState("");
  const [defaultGstType, setDefaultGstType] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [active, setActive] = useState(true);

  // Image state
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Data state
  const [items, setItems] = useState<MaterialMaster[]>(initialMaterialData);

  // Search state
  const [searchItemName, setSearchItemName] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [filteredItems, setFilteredItems] = useState<MaterialMaster[]>(initialMaterialData);

  // Edit mode flag
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<number | null>(null);

  // Active tab
  const [activeTab, setActiveTab] = useState("entry");

  // Column visibility settings
  const [columnSettings, setColumnSettings] = useState({
    sNo: true,
    itemCode: true,
    itemName: true,
    aliasName: true,
    itemCategoryName: true,
    skuId: true,
    status: true,
    itemGroup: true,
    itemSubGroup: true,
    unitType: true,
    ledgerName: true,
    imgUploaded: true,
    brand: true,
  });

  // Generate next Item Code
  const generateNextItemCode = (): string => {
    const lastItem = items[items.length - 1];
    if (!lastItem) return "M0001";
    const lastCode = lastItem.itemCode;
    const match = lastCode.match(/M(\d+)/);
    if (match) {
      const nextNum = parseInt(match[1]) + 1;
      return `M${nextNum.toString().padStart(4, "0")}`;
    }
    return "M0001";
  };

  // Reset form
  const resetForm = () => {
    setFormId(null);
    setItemCode(generateNextItemCode());
    setRefCodeSkuId("");
    setCategory("");
    setBrand("");
    setItemGroup("");
    setItemSubGroup("");
    setItemColour("");
    setItemSize("");
    setItemName("");
    setAliasName("");
    setPrintName("");
    setHsnSac("");
    setAssetGroup("");
    setCompositeItem("");
    setInventoryType("");
    setPrimaryUom("PCS");
    setPerUnitQuantity(0);
    setSecondaryUom("PCS");
    setUnitRate(0);
    setAverageLifeKm(0);
    setAverageLifeDays(0);
    setUsageType("");
    setStockItem(false);
    setPoRequired(false);
    setReturnable(false);
    setStationeryItem(false);
    setSerialedItem(false);
    setLengthRequired(false);
    setWidthRequired(false);
    setHeightRequired(false);
    setMeasurementRequired(false);
    setQtyRequired(false);
    setColorRequired(false);
    setNameDesignRequired(false);
    setInventoryControl(false);
    setPreventiveItem(false);
    setRepairCategory("");
    setIsVirtualSeries(false);
    setIsInputSeries(false);
    setLedger("");
    setProvisionalLedger("");
    setDefaultGstType("");
    setItemDescription("");
    setActive(true);
    setSelectedImage(null);
    setImagePreview("");
    setIsEditMode(false);
    setCurrentEditId(null);
  };

  // Load data into form for editing
  const loadItemToForm = (item: MaterialMaster) => {
    setFormId(item.id);
    setItemCode(item.itemCode);
    setRefCodeSkuId(item.refCodeSkuId);
    setCategory(item.category);
    setBrand(item.brand);
    setItemGroup(item.itemGroup);
    setItemSubGroup(item.itemSubGroup);
    setItemColour(item.itemColour);
    setItemSize(item.itemSize);
    setItemName(item.itemName);
    setAliasName(item.aliasName);
    setPrintName(item.printName);
    setHsnSac(item.hsnSac);
    setAssetGroup(item.assetGroup);
    setCompositeItem(item.compositeItem);
    setInventoryType(item.inventoryType);
    setPrimaryUom(item.primaryUom);
    setPerUnitQuantity(item.perUnitQuantity);
    setSecondaryUom(item.secondaryUom);
    setUnitRate(item.unitRate);
    setAverageLifeKm(item.averageLifeKm);
    setAverageLifeDays(item.averageLifeDays);
    setUsageType(item.usageType);
    setStockItem(item.stockItem);
    setPoRequired(item.poRequired);
    setReturnable(item.returnable);
    setStationeryItem(item.stationeryItem);
    setSerialedItem(item.serialedItem);
    setLengthRequired(item.lengthRequired);
    setWidthRequired(item.widthRequired);
    setHeightRequired(item.heightRequired);
    setMeasurementRequired(item.measurementRequired);
    setQtyRequired(item.qtyRequired);
    setColorRequired(item.colorRequired);
    setNameDesignRequired(item.nameDesignRequired);
    setInventoryControl(item.inventoryControl);
    setPreventiveItem(item.preventiveItem);
    setRepairCategory(item.repairCategory);
    setIsVirtualSeries(item.isVirtualSeries);
    setIsInputSeries(item.isInputSeries);
    setLedger(item.ledger);
    setProvisionalLedger(item.provisionalLedger);
    setDefaultGstType(item.defaultGstType);
    setItemDescription(item.itemDescription);
    setActive(item.active);
    setImagePreview(item.imageUrl);
    setIsEditMode(true);
    setCurrentEditId(item.id);
    setActiveTab("entry");
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === "image/jpeg" || file.type === "image/jpg") {
        setSelectedImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        alert("Image selected successfully!");
      } else {
        alert("Only JPG files are allowed!");
      }
    }
  };

  // Save item (Create or Update)
  const handleSave = () => {
    if (!itemName.trim()) {
      alert("Item Name is required!");
      return;
    }
    if (!itemGroup) {
      alert("Item Group is required!");
      return;
    }

    if (isEditMode && currentEditId) {
      const updatedItems = items.map((item) =>
        item.id === currentEditId
          ? {
              ...item,
              itemCode,
              refCodeSkuId,
              category,
              brand,
              itemGroup,
              itemSubGroup,
              itemColour,
              itemSize,
              itemName,
              aliasName,
              printName,
              hsnSac,
              assetGroup,
              compositeItem,
              inventoryType,
              primaryUom,
              perUnitQuantity,
              secondaryUom,
              unitRate,
              averageLifeKm,
              averageLifeDays,
              usageType,
              stockItem,
              poRequired,
              returnable,
              stationeryItem,
              serialedItem,
              lengthRequired,
              widthRequired,
              heightRequired,
              measurementRequired,
              qtyRequired,
              colorRequired,
              nameDesignRequired,
              inventoryControl,
              preventiveItem,
              repairCategory,
              isVirtualSeries,
              isInputSeries,
              ledger,
              provisionalLedger,
              defaultGstType,
              itemDescription,
              active,
              imageUploaded: !!imagePreview,
              imageUrl: imagePreview,
            }
          : item
      );
      setItems(updatedItems);
      alert("Item updated successfully!");
    } else {
      const newId = Math.max(...items.map((i) => i.id), 0) + 1;
      const newSNo = items.length + 1;
      const newItem: MaterialMaster = {
        id: newId,
        sNo: newSNo,
        itemCode: itemCode || generateNextItemCode(),
        refCodeSkuId,
        category,
        brand,
        itemGroup,
        itemSubGroup,
        itemColour,
        itemSize,
        itemName,
        aliasName,
        printName,
        hsnSac,
        assetGroup,
        compositeItem,
        inventoryType,
        primaryUom,
        perUnitQuantity,
        secondaryUom,
        unitRate,
        averageLifeKm,
        averageLifeDays,
        usageType,
        stockItem,
        poRequired,
        returnable,
        stationeryItem,
        serialedItem,
        lengthRequired,
        widthRequired,
        heightRequired,
        measurementRequired,
        qtyRequired,
        colorRequired,
        nameDesignRequired,
        inventoryControl,
        preventiveItem,
        repairCategory,
        isVirtualSeries,
        isInputSeries,
        ledger,
        provisionalLedger,
        defaultGstType,
        itemDescription,
        active,
        imageUploaded: !!imagePreview,
        imageUrl: imagePreview,
      };
      setItems([...items, newItem]);
      alert("Item saved successfully!");
    }

    resetForm();
    updateFilteredData(searchItemName, searchStatus);
  };

  // Handle Clear button
  const handleClear = () => {
    resetForm();
  };

  // Handle Edit button
  const handleEdit = (item: MaterialMaster) => {
    loadItemToForm(item);
  };

  // Handle Delete
  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this item?")) {
      const updatedItems = items.filter((item) => item.id !== id);
      const reindexedItems = updatedItems.map((item, index) => ({
        ...item,
        sNo: index + 1,
      }));
      setItems(reindexedItems);
      updateFilteredData(searchItemName, searchStatus);
      alert("Item deleted successfully!");
    }
  };

  // Search functionality
  const handleSearch = () => {
    updateFilteredData(searchItemName, searchStatus);
  };

  const updateFilteredData = (itemName: string, status: string) => {
    let filtered = [...items];

    if (itemName.trim()) {
      const lowerName = itemName.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.itemName.toLowerCase().includes(lowerName) ||
          (item.aliasName && item.aliasName.toLowerCase().includes(lowerName))
      );
    }

    if (status) {
      filtered = filtered.filter((item) =>
        status === "Active" ? item.active : !item.active
      );
    }

    setFilteredItems(filtered);
  };

  const clearSearch = () => {
    setSearchItemName("");
    setSearchStatus("");
    setFilteredItems(items);
  };

  // Update filtered items when items change
  useEffect(() => {
    updateFilteredData(searchItemName, searchStatus);
  }, [items]);

  // Initialize form with new item code on mount
  useEffect(() => {
    setItemCode(generateNextItemCode());
  }, []);

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-primary">MATERIAL MASTER</h1>
        <div className="text-xs text-muted-foreground mt-1">
          Company : GOLDEN ROADWAYS &amp; LOGISTICS PVT LTD | Login By : ADMIN@GMAIL.COM
          <br />
          Login Branch : CORPORATE OFFICE | Financial Year : 2026-2027
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="entry">Entry</TabsTrigger>
          <TabsTrigger value="image">Image</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
        </TabsList>

        {/* Entry Tab */}
        <TabsContent value="entry" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isEditMode ? "✏️ Edit Material" : "📝 Add New Material"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Item Code */}
                <div>
                  <Label>Item Code</Label>
                  <Input value={itemCode} onChange={(e) => setItemCode(e.target.value)} className="bg-gray-50" readOnly />
                </div>

                {/* Ref Code / SKU Id */}
                <div>
                  <Label>Ref Code / SKU Id</Label>
                  <Input value={refCodeSkuId} onChange={(e) => setRefCodeSkuId(e.target.value)} placeholder="Enter SKU ID" />
                </div>

                {/* Category */}
                <div>
                  <Label>Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                    <SelectContent>{categoryOptions.map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                  </Select>
                </div>

                {/* Brand */}
                <div>
                  <Label>Brand</Label>
                  <Select value={brand} onValueChange={setBrand}>
                    <SelectTrigger><SelectValue placeholder="Select Brand" /></SelectTrigger>
                    <SelectContent>{brandOptions.map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                  </Select>
                </div>

                {/* Item Group */}
                <div>
                  <Label>Item Group <span className="text-red-500">*</span></Label>
                  <Select value={itemGroup} onValueChange={setItemGroup}>
                    <SelectTrigger><SelectValue placeholder="Select Item Group" /></SelectTrigger>
                    <SelectContent>{itemGroupOptions.map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                  </Select>
                </div>

                {/* Item Sub Group */}
                <div>
                  <Label>Item Sub Group</Label>
                  <Select value={itemSubGroup} onValueChange={setItemSubGroup}>
                    <SelectTrigger><SelectValue placeholder="Select Sub Group" /></SelectTrigger>
                    <SelectContent>{itemSubGroupOptions.map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                  </Select>
                </div>

                {/* Item Colour */}
                <div>
                  <Label>Item Colour</Label>
                  <Input value={itemColour} onChange={(e) => setItemColour(e.target.value)} placeholder="Enter colour" />
                </div>

                {/* Item Size */}
                <div>
                  <Label>Item Size</Label>
                  <Input value={itemSize} onChange={(e) => setItemSize(e.target.value)} placeholder="Enter size" />
                </div>

                {/* Item Name */}
                <div>
                  <Label>Item Name <span className="text-red-500">*</span></Label>
                  <Input value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="Enter item name" />
                </div>

                {/* Alias Name */}
                <div>
                  <Label>Alias Name</Label>
                  <Input value={aliasName} onChange={(e) => setAliasName(e.target.value)} placeholder="Enter alias name" />
                </div>

                {/* Print Name */}
                <div>
                  <Label>Print Name</Label>
                  <Input value={printName} onChange={(e) => setPrintName(e.target.value)} placeholder="Enter print name" />
                </div>

                {/* HSN/SAC */}
                <div>
                  <Label>HSN/SAC</Label>
                  <Input value={hsnSac} onChange={(e) => setHsnSac(e.target.value)} placeholder="Enter HSN/SAC code" />
                </div>

                {/* Asset Group */}
                <div>
                  <Label>Asset Group</Label>
                  <Input value={assetGroup} onChange={(e) => setAssetGroup(e.target.value)} placeholder="Enter asset group" />
                </div>

                {/* Composite Item */}
                <div>
                  <Label>Composite Item</Label>
                  <Select value={compositeItem} onValueChange={setCompositeItem}>
                    <SelectTrigger><SelectValue placeholder="---Select---" /></SelectTrigger>
                    <SelectContent>{compositeItemOptions.map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                  </Select>
                </div>

                {/* Inventory Type */}
                <div>
                  <Label>Inventory Type</Label>
                  <Select value={inventoryType} onValueChange={setInventoryType}>
                    <SelectTrigger><SelectValue placeholder="Select Inventory Type" /></SelectTrigger>
                    <SelectContent>{inventoryTypeOptions.map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                  </Select>
                </div>

                {/* Primary U.O.M. */}
                <div>
                  <Label>Primary U.O.M.</Label>
                  <Select value={primaryUom} onValueChange={setPrimaryUom}>
                    <SelectTrigger><SelectValue placeholder="Select UOM" /></SelectTrigger>
                    <SelectContent>{uomOptions.map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                  </Select>
                </div>

                {/* Per Unit Quantity */}
                <div>
                  <Label>Per Unit Quantity</Label>
                  <Input type="number" value={perUnitQuantity} onChange={(e) => setPerUnitQuantity(parseInt(e.target.value) || 0)} />
                </div>

                {/* Secondary U.O.M. */}
                <div>
                  <Label>Secondary U.O.M.</Label>
                  <Select value={secondaryUom} onValueChange={setSecondaryUom}>
                    <SelectTrigger><SelectValue placeholder="Select UOM" /></SelectTrigger>
                    <SelectContent>{uomOptions.map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                  </Select>
                </div>

                {/* Unit Rate */}
                <div>
                  <Label>Unit Rate</Label>
                  <Input type="number" value={unitRate} onChange={(e) => setUnitRate(parseInt(e.target.value) || 0)} />
                </div>

                {/* Average Life (km) */}
                <div>
                  <Label>Average Life (km)</Label>
                  <Input type="number" value={averageLifeKm} onChange={(e) => setAverageLifeKm(parseInt(e.target.value) || 0)} />
                </div>

                {/* Average Life (days) */}
                <div>
                  <Label>Average Life (days)</Label>
                  <Input type="number" value={averageLifeDays} onChange={(e) => setAverageLifeDays(parseInt(e.target.value) || 0)} />
                </div>

                {/* Usage Type */}
                <div>
                  <Label>Usage Type</Label>
                  <Select value={usageType} onValueChange={setUsageType}>
                    <SelectTrigger><SelectValue placeholder="Select Usage Type" /></SelectTrigger>
                    <SelectContent>{usageTypeOptions.map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>

              {/* Checkboxes Section */}
              <div className="mt-6 pt-4 border-t">
                <Label className="text-base font-medium mb-3 block">Options</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  <div className="flex items-center gap-2"><Checkbox checked={stockItem} onCheckedChange={(c) => setStockItem(!!c)} /><Label className="cursor-pointer">Stock Item</Label></div>
                  <div className="flex items-center gap-2"><Checkbox checked={poRequired} onCheckedChange={(c) => setPoRequired(!!c)} /><Label className="cursor-pointer">P.O. Required</Label></div>
                  <div className="flex items-center gap-2"><Checkbox checked={returnable} onCheckedChange={(c) => setReturnable(!!c)} /><Label className="cursor-pointer">Returnable</Label></div>
                  <div className="flex items-center gap-2"><Checkbox checked={stationeryItem} onCheckedChange={(c) => setStationeryItem(!!c)} /><Label className="cursor-pointer">Stationery Item</Label></div>
                  <div className="flex items-center gap-2"><Checkbox checked={serialedItem} onCheckedChange={(c) => setSerialedItem(!!c)} /><Label className="cursor-pointer">Serialed Item</Label></div>
                  <div className="flex items-center gap-2"><Checkbox checked={lengthRequired} onCheckedChange={(c) => setLengthRequired(!!c)} /><Label className="cursor-pointer">Length Required</Label></div>
                  <div className="flex items-center gap-2"><Checkbox checked={widthRequired} onCheckedChange={(c) => setWidthRequired(!!c)} /><Label className="cursor-pointer">Width Required</Label></div>
                  <div className="flex items-center gap-2"><Checkbox checked={heightRequired} onCheckedChange={(c) => setHeightRequired(!!c)} /><Label className="cursor-pointer">Height Required</Label></div>
                  <div className="flex items-center gap-2"><Checkbox checked={measurementRequired} onCheckedChange={(c) => setMeasurementRequired(!!c)} /><Label className="cursor-pointer">Measurement Required</Label></div>
                  <div className="flex items-center gap-2"><Checkbox checked={qtyRequired} onCheckedChange={(c) => setQtyRequired(!!c)} /><Label className="cursor-pointer">Qty Required</Label></div>
                  <div className="flex items-center gap-2"><Checkbox checked={colorRequired} onCheckedChange={(c) => setColorRequired(!!c)} /><Label className="cursor-pointer">Color Required</Label></div>
                  <div className="flex items-center gap-2"><Checkbox checked={nameDesignRequired} onCheckedChange={(c) => setNameDesignRequired(!!c)} /><Label className="cursor-pointer">Name/Design Required</Label></div>
                  <div className="flex items-center gap-2"><Checkbox checked={inventoryControl} onCheckedChange={(c) => setInventoryControl(!!c)} /><Label className="cursor-pointer">Inventory Control</Label></div>
                  <div className="flex items-center gap-2"><Checkbox checked={preventiveItem} onCheckedChange={(c) => setPreventiveItem(!!c)} /><Label className="cursor-pointer">Preventive Item</Label></div>
                  <div className="flex items-center gap-2"><Checkbox checked={isVirtualSeries} onCheckedChange={(c) => setIsVirtualSeries(!!c)} /><Label className="cursor-pointer">Is Virtual Series</Label></div>
                  <div className="flex items-center gap-2"><Checkbox checked={isInputSeries} onCheckedChange={(c) => setIsInputSeries(!!c)} /><Label className="cursor-pointer">Is Input Series</Label></div>
                </div>
              </div>

              {/* Repair Category */}
              <div className="mt-4">
                <Label>Repair Category</Label>
                <Select value={repairCategory} onValueChange={setRepairCategory}>
                  <SelectTrigger><SelectValue placeholder="Select Repair Category" /></SelectTrigger>
                  <SelectContent>{repairCategoryOptions.map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              {/* Ledger & GST Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 pt-4 border-t">
                <div><Label>Ledger</Label><Select value={ledger} onValueChange={setLedger}><SelectTrigger><SelectValue placeholder="Select Ledger" /></SelectTrigger><SelectContent>{ledgerOptions.map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></div>
                <div><Label>Provisional Ledger</Label><Select value={provisionalLedger} onValueChange={setProvisionalLedger}><SelectTrigger><SelectValue placeholder="Select Ledger" /></SelectTrigger><SelectContent>{provisionalLedgerOptions.map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></div>
                <div><Label>Default GST Type</Label><Select value={defaultGstType} onValueChange={setDefaultGstType}><SelectTrigger><SelectValue placeholder="--Select--" /></SelectTrigger><SelectContent>{gstTypeOptions.map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></div>
              </div>

              {/* Item Description */}
              <div className="mt-4">
                <Label>Item Description</Label>
                <textarea className="w-full min-h-[80px] p-3 border rounded-md" value={itemDescription} onChange={(e) => setItemDescription(e.target.value)} placeholder="Enter item description" />
              </div>

              {/* Active Checkbox */}
              <div className="flex items-center gap-3 mt-4">
                <Checkbox checked={active} onCheckedChange={(c) => setActive(!!c)} />
                <Label className="cursor-pointer">Active</Label>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-8 border-t mt-6">
                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700"><Save className="mr-2 h-4 w-4" /> Save</Button>
                <Button variant="outline" onClick={handleClear}><X className="mr-2 h-4 w-4" /> Clear</Button>
                {isEditMode && <Button variant="ghost" onClick={resetForm}>Cancel Edit</Button>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Image Tab */}
        <TabsContent value="image" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ImageIcon className="h-5 w-5" /> Item Image Upload</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8 border-2 border-dashed rounded-lg">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-sm text-gray-500 mb-2">You can only upload JPG Files.</p>
                <input type="file" accept=".jpg,.jpeg" onChange={handleImageUpload} className="hidden" id="imageUpload" />
                <Button onClick={() => document.getElementById("imageUpload")?.click()} variant="outline"><Upload className="mr-2 h-4 w-4" /> Select Files</Button>
                {imagePreview && <div className="mt-4"><img src={imagePreview} alt="Preview" className="max-w-[200px] max-h-[200px] mx-auto border rounded" /></div>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Search Tab */}
        <TabsContent value="search" className="mt-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Search className="h-5 w-5" /> Search Materials</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div><Label>Item Name</Label><Input placeholder="Search by item name..." value={searchItemName} onChange={(e) => setSearchItemName(e.target.value)} /></div>
                <div><Label>Status</Label><Select value={searchStatus} onValueChange={setSearchStatus}><SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger><SelectContent><SelectItem value="Active">Active</SelectItem><SelectItem value="Inactive">Inactive</SelectItem></SelectContent></Select></div>
              </div>
              <div className="flex gap-3 mb-6"><Button onClick={handleSearch} className="bg-blue-600"><Search className="mr-2 h-4 w-4" /> Search</Button><Button variant="outline" onClick={clearSearch}><X className="mr-2 h-4 w-4" /> Clear</Button></div>

              {/* Column Settings */}
              <div className="mb-4 p-3 bg-gray-50 rounded flex flex-wrap gap-3">
                <Settings className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium">Column Settings:</span>
                {Object.keys(columnSettings).map((key) => (<div key={key} className="flex items-center gap-1"><Checkbox checked={columnSettings[key as keyof typeof columnSettings]} onCheckedChange={(c) => setColumnSettings({ ...columnSettings, [key]: !!c })} /><Label className="text-xs cursor-pointer">{key.replace(/([A-Z])/g, ' $1').trim()}</Label></div>))}
              </div>

              {/* Table */}
              <div className="overflow-x-auto border rounded-lg">
                <Table>
                  <TableHeader className="bg-gray-100">
                    <TableRow>
                      {columnSettings.sNo && <TableHead>S#</TableHead>}
                      {columnSettings.itemCode && <TableHead>Item Code</TableHead>}
                      {columnSettings.itemName && <TableHead>Item Name</TableHead>}
                      {columnSettings.aliasName && <TableHead>Alias Name</TableHead>}
                      {columnSettings.itemCategoryName && <TableHead>Item Category Name</TableHead>}
                      {columnSettings.skuId && <TableHead>Sku ID.</TableHead>}
                      {columnSettings.status && <TableHead>Status</TableHead>}
                      {columnSettings.itemGroup && <TableHead>Item Group</TableHead>}
                      {columnSettings.itemSubGroup && <TableHead>Item Sub Group</TableHead>}
                      {columnSettings.unitType && <TableHead>Unit Type</TableHead>}
                      {columnSettings.ledgerName && <TableHead>Ledger Name</TableHead>}
                      {columnSettings.imgUploaded && <TableHead>Img Uploaded</TableHead>}
                      {columnSettings.brand && <TableHead>Brand</TableHead>}
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.length === 0 ? (<TableRow><TableCell colSpan={14} className="text-center py-8">No records found</TableCell></TableRow>) : (
                      filteredItems.map((item) => (<TableRow key={item.id}>
                        {columnSettings.sNo && <TableCell>{item.sNo}</TableCell>}
                        {columnSettings.itemCode && <TableCell className="font-medium text-blue-600">{item.itemCode}</TableCell>}
                        {columnSettings.itemName && <TableCell>{item.itemName}</TableCell>}
                        {columnSettings.aliasName && <TableCell>{item.aliasName || "-"}</TableCell>}
                        {columnSettings.itemCategoryName && <TableCell>{item.category}</TableCell>}
                        {columnSettings.skuId && <TableCell>{item.refCodeSkuId || "-"}</TableCell>}
                        {columnSettings.status && <TableCell>{item.active ? <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Active</span> : <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">Inactive</span>}</TableCell>}
                        {columnSettings.itemGroup && <TableCell>{item.itemGroup}</TableCell>}
                        {columnSettings.itemSubGroup && <TableCell>{item.itemSubGroup || "-"}</TableCell>}
                        {columnSettings.unitType && <TableCell>{item.primaryUom}</TableCell>}
                        {columnSettings.ledgerName && <TableCell>{item.ledger || "-"}</TableCell>}
                        {columnSettings.imgUploaded && <TableCell>{item.imageUploaded ? "Yes" : "No"}</TableCell>}
                        {columnSettings.brand && <TableCell>{item.brand || "-"}</TableCell>}
                        <TableCell><Button variant="ghost" size="sm" onClick={() => handleEdit(item)} className="text-blue-600"><Edit className="h-4 w-4" /></Button><Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)} className="text-red-600"><Trash2 className="h-4 w-4" /></Button></TableCell>
                      </TableRow>))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}