"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Badge } from "@/components/ui/badge";
import { Save, Trash2, Search, RefreshCw, Plus, Check, X, Edit, Eye, Package, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PackingRecord {
  id: number;
  packingName: string;
  aliasName: string;
  packingType: string;
  loadType: string;
  item: string;
  length: number;
  breadth: number;
  height: number;
  iataWeight: number;
  nonIataWeight: number;
  unitType: string;
  cft: number;
  manageEmptyBin: boolean;
  active: boolean;
  isEditing?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const packingTypeOptions = [
  { value: "Carton", label: "Carton" },
  { value: "Box", label: "Box" },
  { value: "Pallet", label: "Pallet" },
  { value: "Crate", label: "Crate" },
  { value: "Bag", label: "Bag" },
  { value: "Drum", label: "Drum" },
  { value: "Container", label: "Container" }
];

const loadTypeOptions = [
  { value: "FTL", label: "FTL" },
  { value: "LTL", label: "LTL" },
  { value: "Container", label: "Container" },
  { value: "Bulk", label: "Bulk" },
  { value: "Liquid", label: "Liquid" },
  { value: "Powder", label: "Powder" }
];

const unitTypeOptions = [
  { value: "CM", label: "CM" },
  { value: "INCH", label: "INCH" },
  { value: "MM", label: "MM" },
  { value: "METER", label: "METER" },
  { value: "FEET", label: "FEET" }
];

const itemOptions = [
  { value: "Electronics", label: "Electronics" },
  { value: "Furniture", label: "Furniture" },
  { value: "Clothing", label: "Clothing" },
  { value: "Food Items", label: "Food Items" },
  { value: "Pharmaceuticals", label: "Pharmaceuticals" },
  { value: "Chemicals", label: "Chemicals" },
  { value: "Machinery", label: "Machinery" },
  { value: "Auto Parts", label: "Auto Parts" },
  { value: "Books", label: "Books" },
  { value: "Fragile Items", label: "Fragile Items" }
];

export default function PackingMaster() {
  // Search state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 10;

  // Sample saved data
  const [savedRecords, setSavedRecords] = useState<PackingRecord[]>([
    { id: 1, packingName: "Standard Carton", aliasName: "Std Carton", packingType: "Carton", loadType: "FTL", item: "Electronics", length: 50, breadth: 40, height: 30, iataWeight: 5, nonIataWeight: 4.5, unitType: "CM", cft: 0.212, manageEmptyBin: false, active: true, isEditing: false, createdAt: new Date(), updatedAt: new Date() },
    { id: 2, packingName: "Heavy Duty Box", aliasName: "HD Box", packingType: "Box", loadType: "LTL", item: "Machinery", length: 100, breadth: 80, height: 60, iataWeight: 15, nonIataWeight: 14, unitType: "CM", cft: 1.696, manageEmptyBin: true, active: true, isEditing: false, createdAt: new Date(), updatedAt: new Date() },
    { id: 3, packingName: "Wooden Pallet", aliasName: "Pallet", packingType: "Pallet", loadType: "Container", item: "Furniture", length: 120, breadth: 100, height: 15, iataWeight: 20, nonIataWeight: 18, unitType: "CM", cft: 0.636, manageEmptyBin: false, active: true, isEditing: false, createdAt: new Date(), updatedAt: new Date() },
    { id: 4, packingName: "Plastic Crate", aliasName: "Crate", packingType: "Crate", loadType: "Bulk", item: "Food Items", length: 60, breadth: 40, height: 35, iataWeight: 8, nonIataWeight: 7.5, unitType: "CM", cft: 0.297, manageEmptyBin: true, active: false, isEditing: false, createdAt: new Date(), updatedAt: new Date() },
    { id: 5, packingName: "Jute Bag", aliasName: "Bag", packingType: "Bag", loadType: "Powder", item: "Chemicals", length: 0, breadth: 0, height: 0, iataWeight: 25, nonIataWeight: 23, unitType: "CM", cft: 0, manageEmptyBin: false, active: true, isEditing: false, createdAt: new Date(), updatedAt: new Date() },
  ]);

  const [searchResults, setSearchResults] = useState<PackingRecord[]>(savedRecords);

  // Load search results on mount
  useEffect(() => {
    setSearchResults(savedRecords);
  }, []);

  // Get search results
  const handleSearch = (): void => {
    let results = [...savedRecords];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      results = results.filter(r => 
        r.packingName.toLowerCase().includes(term) ||
        r.aliasName.toLowerCase().includes(term) ||
        r.packingType.toLowerCase().includes(term) ||
        r.item.toLowerCase().includes(term)
      );
    }
    setSearchResults(results);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchResults(savedRecords);
    setCurrentPage(1);
  };

  // Add new row
  const addNewRow = () => {
    const newRecord: PackingRecord = {
      id: Date.now(),
      packingName: "",
      aliasName: "",
      packingType: "",
      loadType: "",
      item: "",
      length: 0,
      breadth: 0,
      height: 0,
      iataWeight: 0,
      nonIataWeight: 0,
      unitType: "CM",
      cft: 0,
      manageEmptyBin: false,
      active: true,
      isEditing: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const updatedRecords = [newRecord, ...savedRecords];
    setSavedRecords(updatedRecords);
    setSearchResults(updatedRecords);
  };

  // Update record
  const updateRecord = (id: number, field: keyof PackingRecord, value: any) => {
    const updatedRecords = savedRecords.map(record => 
      record.id === id ? { ...record, [field]: value, updatedAt: new Date() } : record
    );
    setSavedRecords(updatedRecords);
    setSearchResults(updatedRecords);
  };

  // Save record
  const saveRecord = (id: number) => {
    const record = savedRecords.find(r => r.id === id);
    if (record) {
      if (!record.packingName) {
        alert("Please enter Packing Name");
        return;
      }
      if (!record.packingType) {
        alert("Please select Packing Type");
        return;
      }
      const updatedRecords = savedRecords.map(r => 
        r.id === id ? { ...r, isEditing: false } : r
      );
      setSavedRecords(updatedRecords);
      setSearchResults(updatedRecords);
      alert("Record saved successfully!");
    }
  };

  // Edit record
  const editRecord = (id: number) => {
    const updatedRecords = savedRecords.map(record => 
      record.id === id ? { ...record, isEditing: true } : record
    );
    setSavedRecords(updatedRecords);
    setSearchResults(updatedRecords);
  };

  // Remove record
  const removeRecord = (id: number) => {
    if (confirm("Are you sure you want to remove this packing?")) {
      const updatedRecords = savedRecords.filter(record => record.id !== id);
      setSavedRecords(updatedRecords);
      setSearchResults(updatedRecords);
      alert("Record removed successfully!");
    }
  };

  // Calculate CFT
  const calculateCFT = (length: number, breadth: number, height: number, unitType: string): number => {
    if (unitType === "CM") {
      return (length * breadth * height) / 283168.5;
    } else if (unitType === "INCH") {
      return (length * breadth * height) / 1728;
    } else if (unitType === "METER") {
      return length * breadth * height;
    } else if (unitType === "FEET") {
      return length * breadth * height;
    }
    return 0;
  };

  const handleDimensionChange = (id: number, field: "length" | "breadth" | "height", value: number) => {
    updateRecord(id, field, value);
    const record = savedRecords.find(r => r.id === id);
    if (record) {
      const length = field === "length" ? value : record.length;
      const breadth = field === "breadth" ? value : record.breadth;
      const height = field === "height" ? value : record.height;
      const cft = calculateCFT(length, breadth, height, record.unitType);
      updateRecord(id, "cft", cft);
    }
  };

  const handleUnitTypeChange = (id: number, value: string) => {
    updateRecord(id, "unitType", value);
    const record = savedRecords.find(r => r.id === id);
    if (record) {
      const cft = calculateCFT(record.length, record.breadth, record.height, value);
      updateRecord(id, "cft", cft);
    }
  };

  // Stats
  const stats = {
    total: searchResults.length,
    active: searchResults.filter(r => r.active).length,
    inactive: searchResults.filter(r => !r.active).length,
  };

  // Pagination
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);
  const paginatedResults = searchResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Get status badge
  const getStatusBadge = (active: boolean) => {
    return active ? (
      <Badge className="bg-green-500 hover:bg-green-600 text-[10px]">Active</Badge>
    ) : (
      <Badge variant="secondary" className="bg-gray-500 text-[10px]">Inactive</Badge>
    );
  };

  return (
    <div className="space-y-4 p-3 md:p-4 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-wrap justify-between items-start gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">PACKING MASTER</h1>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500">
              <span>🏢 Company: GOLDEN ROADWAYS & LOGISTICS PVT LTD</span>
              <span>👤 Login: MAYANK.GRLOGISTICS@GMAIL.COM</span>
              <span>📍 Branch: CORPORATE OFFICE</span>
              <span>📅 Financial Year: 2026-2027</span>
            </div>
          </div>
          <Button onClick={addNewRow} size="default" className="bg-green-600 hover:bg-green-700 shadow-md">
            <Plus className="mr-2 h-4 w-4" />
            Add New Packing
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">Total Packings</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Package className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">Active Packings</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
              <Check className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-gray-500 to-gray-600 text-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">Inactive Packings</p>
                <p className="text-2xl font-bold">{stats.inactive}</p>
              </div>
              <X className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-[11px] font-semibold flex items-center gap-2 text-gray-700">
            <Search className="h-3.5 w-3.5" />
            Search Packings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <Input
                placeholder="Search by Packing Name, Alias Name, Type or Item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-9 text-sm"
              />
            </div>
            <Button onClick={handleSearch} className="h-9 bg-blue-600 hover:bg-blue-700 text-xs">
              <Search className="mr-1 h-3.5 w-3.5" />
              Search
            </Button>
            <Button onClick={handleClearSearch} variant="outline" className="h-9 text-xs">
              <RefreshCw className="mr-1 h-3.5 w-3.5" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Table */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Table className="h-3.5 w-3.5 text-gray-500" />
              <h3 className="text-[11px] font-semibold text-gray-800">
                Packing List
              </h3>
            </div>
            <div className="text-[10px] text-gray-500">
              Total: {searchResults.length} records
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[1400px]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-[11px] font-semibold py-2 px-2 w-12 text-center">#</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[120px]">Packing Name</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Alias Name</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Type</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[80px]">Load Type</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Item</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[60px] text-center">L</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[60px] text-center">B</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[60px] text-center">H</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[80px] text-center">IATA Wt</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[80px] text-center">Non IATA</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[70px] text-center">Unit</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[60px] text-center">CFT</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 w-20 text-center">Status</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 w-20 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedResults.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={15} className="text-center py-8 text-gray-500">
                        <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        No records found. Click "Add New Packing" to create one.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedResults.map((record, index) => (
                      <TableRow key={record.id} className="hover:bg-gray-50">
                        <TableCell className="py-2 px-2 text-center text-xs">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </TableCell>
                        
                        {/* Packing Name */}
                        <TableCell className="py-2 px-2">
                          {record.isEditing ? (
                            <Input
                              value={record.packingName}
                              onChange={(e) => updateRecord(record.id, "packingName", e.target.value)}
                              placeholder="Enter Name"
                              className="h-7 text-xs"
                              autoFocus
                            />
                          ) : (
                            <span className="font-medium text-xs">{record.packingName || "-"}</span>
                          )}
                        </TableCell>
                        
                        {/* Alias Name */}
                        <TableCell className="py-2 px-2">
                          {record.isEditing ? (
                            <Input
                              value={record.aliasName}
                              onChange={(e) => updateRecord(record.id, "aliasName", e.target.value)}
                              placeholder="Alias Name"
                              className="h-7 text-xs"
                            />
                          ) : (
                            <span className="text-xs">{record.aliasName || "-"}</span>
                          )}
                        </TableCell>
                        
                        {/* Packing Type */}
                        <TableCell className="py-2 px-2">
                          {record.isEditing ? (
                            <Select
                              value={record.packingType || undefined}
                              onValueChange={(value) => updateRecord(record.id, "packingType", value)}
                            >
                              <SelectTrigger className="h-7 text-xs">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                {packingTypeOptions.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value} className="text-xs">
                                    {opt.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 text-[10px]">
                              {record.packingType || "-"}
                            </Badge>
                          )}
                        </TableCell>
                        
                        {/* Load Type */}
                        <TableCell className="py-2 px-2">
                          {record.isEditing ? (
                            <Select
                              value={record.loadType || undefined}
                              onValueChange={(value) => updateRecord(record.id, "loadType", value)}
                            >
                              <SelectTrigger className="h-7 text-xs">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                {loadTypeOptions.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value} className="text-xs">
                                    {opt.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Badge variant="outline" className="bg-green-50 text-green-700 text-[10px]">
                              {record.loadType || "-"}
                            </Badge>
                          )}
                        </TableCell>
                        
                        {/* Item */}
                        <TableCell className="py-2 px-2">
                          {record.isEditing ? (
                            <Select
                              value={record.item || undefined}
                              onValueChange={(value) => updateRecord(record.id, "item", value)}
                            >
                              <SelectTrigger className="h-7 text-xs">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                {itemOptions.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value} className="text-xs">
                                    {opt.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <span className="text-xs">{record.item || "-"}</span>
                          )}
                        </TableCell>
                        
                        {/* Length */}
                        <TableCell className="py-2 px-2 text-center">
                          {record.isEditing ? (
                            <Input
                              type="number"
                              value={record.length}
                              onChange={(e) => handleDimensionChange(record.id, "length", Number(e.target.value))}
                              className="h-7 w-20 text-xs text-center"
                            />
                          ) : (
                            <span className="text-xs">{record.length || 0}</span>
                          )}
                        </TableCell>
                        
                        {/* Breadth */}
                        <TableCell className="py-2 px-2 text-center">
                          {record.isEditing ? (
                            <Input
                              type="number"
                              value={record.breadth}
                              onChange={(e) => handleDimensionChange(record.id, "breadth", Number(e.target.value))}
                              className="h-7 w-20 text-xs text-center"
                            />
                          ) : (
                            <span className="text-xs">{record.breadth || 0}</span>
                          )}
                        </TableCell>
                        
                        {/* Height */}
                        <TableCell className="py-2 px-2 text-center">
                          {record.isEditing ? (
                            <Input
                              type="number"
                              value={record.height}
                              onChange={(e) => handleDimensionChange(record.id, "height", Number(e.target.value))}
                              className="h-7 w-20 text-xs text-center"
                            />
                          ) : (
                            <span className="text-xs">{record.height || 0}</span>
                          )}
                        </TableCell>
                        
                        {/* IATA Weight */}
                        <TableCell className="py-2 px-2 text-center">
                          {record.isEditing ? (
                            <Input
                              type="number"
                              value={record.iataWeight}
                              onChange={(e) => updateRecord(record.id, "iataWeight", Number(e.target.value))}
                              className="h-7 w-20 text-xs text-center"
                              step="0.01"
                            />
                          ) : (
                            <span className="text-xs">{record.iataWeight}</span>
                          )}
                        </TableCell>
                        
                        {/* Non IATA Weight */}
                        <TableCell className="py-2 px-2 text-center">
                          {record.isEditing ? (
                            <Input
                              type="number"
                              value={record.nonIataWeight}
                              onChange={(e) => updateRecord(record.id, "nonIataWeight", Number(e.target.value))}
                              className="h-7 w-20 text-xs text-center"
                              step="0.01"
                            />
                          ) : (
                            <span className="text-xs">{record.nonIataWeight}</span>
                          )}
                        </TableCell>
                        
                        {/* Unit Type */}
                        <TableCell className="py-2 px-2 text-center">
                          {record.isEditing ? (
                            <Select
                              value={record.unitType}
                              onValueChange={(value) => handleUnitTypeChange(record.id, value)}
                            >
                              <SelectTrigger className="h-7 w-20 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {unitTypeOptions.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value} className="text-xs">
                                    {opt.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <span className="text-xs">{record.unitType}</span>
                          )}
                        </TableCell>
                        
                        {/* CFT */}
                        <TableCell className="py-2 px-2 text-center font-mono text-blue-600 text-xs">
                          {record.cft.toFixed(4)}
                        </TableCell>
                        
                        {/* Status */}
                        <TableCell className="py-2 px-2 text-center">
                          {record.isEditing ? (
                            <input
                              type="checkbox"
                              checked={record.active}
                              onChange={(e) => updateRecord(record.id, "active", e.target.checked)}
                              className="h-3.5 w-3.5 rounded border-gray-300"
                            />
                          ) : (
                            getStatusBadge(record.active)
                          )}
                        </TableCell>
                        
                        {/* Actions */}
                        <TableCell className="py-2 px-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {record.isEditing ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => saveRecord(record.id)}
                                className="h-7 w-7 p-0 text-green-500 hover:text-green-700 hover:bg-green-50"
                                title="Save"
                              >
                                <Save className="h-3.5 w-3.5" />
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => editRecord(record.id)}
                                className="h-7 w-7 p-0 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                title="Edit"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeRecord(record.id)}
                              className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-[10px] text-gray-500">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, searchResults.length)} of {searchResults.length} entries
              </div>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-7 text-[10px]"
                >
                  <ChevronLeft className="h-3 w-3 mr-1" />
                  Previous
                </Button>
                <span className="px-3 py-1 text-[10px]">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="h-7 text-[10px]"
                >
                  Next
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bottom Note */}
      <div className="text-[10px] text-gray-500 text-center pt-2">
        <span className="bg-yellow-50 px-2 py-1 rounded">💡 Note: CFT is automatically calculated based on Length × Breadth × Height</span>
      </div>
    </div>
  );
}