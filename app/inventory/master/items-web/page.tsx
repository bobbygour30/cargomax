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
import { Edit, Save, X, Search, Trash2, Plus } from "lucide-react";

// ==================== TYPE DEFINITIONS ====================
interface ItemMaster {
  id: number;
  sNo: number;
  itemCode: string;
  itemName: string;
  aliasName: string;
  itemGroupName: string;
  unitType: string;
  reOrderLevel: number;
  lotUnitType: string;
  lotQty: number;
  active: boolean;
}

// ==================== MOCK INITIAL DATA ====================
const initialItemData: ItemMaster[] = [
  { id: 1, sNo: 1, itemCode: "A0001", itemName: "GR BOOK", aliasName: "", itemGroupName: "STATIONERY ITEMS", unitType: "BOOK", reOrderLevel: 10, lotUnitType: "BOOK", lotQty: 50, active: true },
  { id: 2, sNo: 2, itemCode: "A0002", itemName: "LOCAL CHALLAN", aliasName: "", itemGroupName: "STATIONERY ITEMS", unitType: "BOOK", reOrderLevel: 5, lotUnitType: "BOOK", lotQty: 50, active: true },
  { id: 3, sNo: 3, itemCode: "A0003", itemName: "PRINTER PAPER", aliasName: "A4 Sheet", itemGroupName: "OFFICE SUPPLIES", unitType: "REAM", reOrderLevel: 20, lotUnitType: "BOX", lotQty: 500, active: true },
  { id: 4, sNo: 4, itemCode: "A0004", itemName: "PEN", aliasName: "Ballpoint", itemGroupName: "STATIONERY ITEMS", unitType: "PCS", reOrderLevel: 100, lotUnitType: "BOX", lotQty: 1000, active: true },
];

// Dropdown options
const itemGroupOptions = ["STATIONERY ITEMS", "OFFICE SUPPLIES", "ELECTRONICS", "FURNITURE", "VEHICLE PARTS", "PACKAGING MATERIALS"];
const unitTypeOptions = ["BOOK", "PCS", "REAM", "BOX", "KG", "LTR", "METER", "ROLL", "SET", "DOZEN"];
const lotUnitTypeOptions = ["BOOK", "PCS", "REAM", "BOX", "KG", "LTR", "METER", "ROLL", "SET", "DOZEN", "PALLET", "CARTON"];

export default function ItemMasterWeb() {
  // Form state for Entry Tab
  const [formId, setFormId] = useState<number | null>(null);
  const [itemCode, setItemCode] = useState("");
  const [itemName, setItemName] = useState("");
  const [aliasName, setAliasName] = useState("");
  const [itemGroupName, setItemGroupName] = useState("");
  const [unitType, setUnitType] = useState("");
  const [reOrderLevel, setReOrderLevel] = useState<number>(0);
  const [lotUnitType, setLotUnitType] = useState("");
  const [lotQty, setLotQty] = useState<number>(0);
  const [active, setActive] = useState<boolean>(true);

  // Data state
  const [items, setItems] = useState<ItemMaster[]>(initialItemData);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState<ItemMaster[]>(initialItemData);

  // Edit mode flag
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<number | null>(null);

  // Active tab
  const [activeTab, setActiveTab] = useState("entry");

  // Generate next Item Code
  const generateNextItemCode = (): string => {
    const lastItem = items[items.length - 1];
    if (!lastItem) return "A0001";
    const lastCode = lastItem.itemCode;
    const match = lastCode.match(/A(\d+)/);
    if (match) {
      const nextNum = parseInt(match[1]) + 1;
      return `A${nextNum.toString().padStart(4, "0")}`;
    }
    return "A0001";
  };

  // Reset form
  const resetForm = () => {
    setFormId(null);
    setItemCode(generateNextItemCode());
    setItemName("");
    setAliasName("");
    setItemGroupName("");
    setUnitType("");
    setReOrderLevel(0);
    setLotUnitType("");
    setLotQty(0);
    setActive(true);
    setIsEditMode(false);
    setCurrentEditId(null);
  };

  // Load data into form for editing
  const loadItemToForm = (item: ItemMaster) => {
    setFormId(item.id);
    setItemCode(item.itemCode);
    setItemName(item.itemName);
    setAliasName(item.aliasName);
    setItemGroupName(item.itemGroupName);
    setUnitType(item.unitType);
    setReOrderLevel(item.reOrderLevel);
    setLotUnitType(item.lotUnitType);
    setLotQty(item.lotQty);
    setActive(item.active);
    setIsEditMode(true);
    setCurrentEditId(item.id);
    setActiveTab("entry");
  };

  // Save item (Create or Update)
  const handleSave = () => {
    // Validation
    if (!itemName.trim()) {
      alert("Item Name is required!");
      return;
    }
    if (!itemGroupName) {
      alert("Item Group Name is required!");
      return;
    }
    if (!unitType) {
      alert("Unit Type is required!");
      return;
    }
    if (!lotUnitType) {
      alert("Lot Unit Type is required!");
      return;
    }

    if (isEditMode && currentEditId) {
      // Update existing item
      const updatedItems = items.map((item) =>
        item.id === currentEditId
          ? {
              ...item,
              itemCode,
              itemName,
              aliasName,
              itemGroupName,
              unitType,
              reOrderLevel,
              lotUnitType,
              lotQty,
              active,
            }
          : item
      );
      setItems(updatedItems);
      alert("Item updated successfully!");
    } else {
      // Create new item
      const newId = Math.max(...items.map((i) => i.id), 0) + 1;
      const newSNo = items.length + 1;
      const newItem: ItemMaster = {
        id: newId,
        sNo: newSNo,
        itemCode: itemCode || generateNextItemCode(),
        itemName,
        aliasName,
        itemGroupName,
        unitType,
        reOrderLevel,
        lotUnitType,
        lotQty,
        active,
      };
      setItems([...items, newItem]);
      alert("Item saved successfully!");
    }

    resetForm();
    updateFilteredData(searchTerm);
  };

  // Handle Clear button
  const handleClear = () => {
    resetForm();
  };

  // Handle Edit button
  const handleEdit = (item: ItemMaster) => {
    loadItemToForm(item);
  };

  // Handle Delete
  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this item?")) {
      const updatedItems = items.filter((item) => item.id !== id);
      // Re-index SNo
      const reindexedItems = updatedItems.map((item, index) => ({
        ...item,
        sNo: index + 1,
      }));
      setItems(reindexedItems);
      updateFilteredData(searchTerm);
      alert("Item deleted successfully!");
    }
  };

  // Search functionality
  const handleSearch = () => {
    updateFilteredData(searchTerm);
  };

  const updateFilteredData = (term: string) => {
    if (!term.trim()) {
      setFilteredItems(items);
    } else {
      const lowerTerm = term.toLowerCase();
      const filtered = items.filter(
        (item) =>
          item.itemCode.toLowerCase().includes(lowerTerm) ||
          item.itemName.toLowerCase().includes(lowerTerm) ||
          item.aliasName.toLowerCase().includes(lowerTerm) ||
          item.itemGroupName.toLowerCase().includes(lowerTerm) ||
          item.unitType.toLowerCase().includes(lowerTerm)
      );
      setFilteredItems(filtered);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
    setFilteredItems(items);
  };

  // Update filtered items when items change
  useEffect(() => {
    updateFilteredData(searchTerm);
  }, [items]);

  // Initialize form with new item code on mount
  useEffect(() => {
    setItemCode(generateNextItemCode());
  }, []);

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-primary">ITEM MASTER WEB</h1>
        <div className="text-xs text-muted-foreground mt-1">
          Company : GOLDEN ROADWAYS &amp; LOGISTICS PVT LTD | Login By : ADMIN@GMAIL.COM
          <br />
          Login Branch : CORPORATE OFFICE | Financial Year : 2026-2027
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="entry" className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Entry
          </TabsTrigger>
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="h-4 w-4" /> Search
          </TabsTrigger>
        </TabsList>

        {/* Entry Tab */}
        <TabsContent value="entry" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isEditMode ? "✏️ Edit Item" : "📝 Add New Item"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Item Code */}
                <div>
                  <Label>Item Code</Label>
                  <Input
                    type="text"
                    value={itemCode}
                    onChange={(e) => setItemCode(e.target.value)}
                    placeholder="Auto generated"
                    className="bg-gray-50"
                    readOnly
                  />
                  <p className="text-xs text-gray-400 mt-1">Auto-generated code</p>
                </div>

                {/* Item Name - Required */}
                <div>
                  <Label>
                    Item Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="Enter item name"
                  />
                </div>

                {/* Alias Name */}
                <div>
                  <Label>Alias Name</Label>
                  <Input
                    type="text"
                    value={aliasName}
                    onChange={(e) => setAliasName(e.target.value)}
                    placeholder="Enter alias name"
                  />
                </div>

                {/* Item Group Name - Required */}
                <div>
                  <Label>
                    Item Group Name <span className="text-red-500">*</span>
                  </Label>
                  <Select value={itemGroupName} onValueChange={setItemGroupName}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Item Group" />
                    </SelectTrigger>
                    <SelectContent>
                      {itemGroupOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Unit Type - Required */}
                <div>
                  <Label>
                    Unit Type <span className="text-red-500">*</span>
                  </Label>
                  <Select value={unitType} onValueChange={setUnitType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Unit Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {unitTypeOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Re-Order Level */}
                <div>
                  <Label>Re-Order Level</Label>
                  <Input
                    type="number"
                    value={reOrderLevel}
                    onChange={(e) => setReOrderLevel(parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>

                {/* Lot Unit Type - Required */}
                <div>
                  <Label>
                    Lot Unit Type <span className="text-red-500">*</span>
                  </Label>
                  <Select value={lotUnitType} onValueChange={setLotUnitType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Lot Unit Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {lotUnitTypeOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Lot Qty */}
                <div>
                  <Label>Lot Qty.</Label>
                  <Input
                    type="number"
                    value={lotQty}
                    onChange={(e) => setLotQty(parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>

                {/* Active Checkbox */}
                <div className="flex items-center gap-3 pt-6">
                  <Checkbox
                    checked={active}
                    onCheckedChange={(checked) => setActive(!!checked)}
                  />
                  <Label className="cursor-pointer">Active</Label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-8 border-t mt-6">
                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                  <Save className="mr-2 h-4 w-4" /> Save
                </Button>
                <Button variant="outline" onClick={handleClear}>
                  <X className="mr-2 h-4 w-4" /> Clear
                </Button>
                {isEditMode && (
                  <Button
                    variant="ghost"
                    onClick={resetForm}
                    className="text-gray-500"
                  >
                    Cancel Edit
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Search Tab */}
        <TabsContent value="search" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Search Bar */}
              <div className="flex gap-3 mb-6">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Search by Item Code, Item Name, Alias Name, Group Name, Unit Type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    className="w-full"
                  />
                </div>
                <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
                  <Search className="mr-2 h-4 w-4" /> Search
                </Button>
                <Button variant="outline" onClick={clearSearch}>
                  <X className="mr-2 h-4 w-4" /> Clear
                </Button>
              </div>

              {/* Items Table */}
              <div className="overflow-x-auto border rounded-lg">
                <Table>
                  <TableHeader className="bg-gray-100">
                  <TableRow>
                      <TableHead className="w-12">S#</TableHead>
                      <TableHead>Item Code</TableHead>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Alias Name</TableHead>
                      <TableHead>Item Group Name</TableHead>
                      <TableHead>Unit Type</TableHead>
                      <TableHead>Lot Unit Type</TableHead>
                      <TableHead className="text-right">Lot Qty.</TableHead>
                      <TableHead className="text-center">Active</TableHead>
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                          No items found. Add items from the Entry tab.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredItems.map((item) => (
                        <TableRow key={item.id} className="hover:bg-gray-50">
                          <TableCell>{item.sNo}</TableCell>
                          <TableCell className="font-medium text-blue-600">{item.itemCode}</TableCell>
                          <TableCell>{item.itemName}</TableCell>
                          <TableCell>{item.aliasName || "-"}</TableCell>
                          <TableCell>{item.itemGroupName}</TableCell>
                          <TableCell>{item.unitType}</TableCell>
                          <TableCell>{item.lotUnitType}</TableCell>
                          <TableCell className="text-right">{item.lotQty}</TableCell>
                          <TableCell className="text-center">
                            {item.active ? (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Active</span>
                            ) : (
                              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">Inactive</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(item)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(item.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Record Count */}
              <div className="mt-4 text-sm text-gray-500">
                Total Records: {filteredItems.length}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Mode Indicator */}
      {isEditMode && activeTab === "entry" && (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
          Editing: {items.find((i) => i.id === currentEditId)?.itemName}
        </div>
      )}
    </div>
  );
}