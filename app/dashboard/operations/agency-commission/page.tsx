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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Plus, Trash2, X, Save, RefreshCw, Search, Edit, Pencil, Copy, Download, Printer, Eye, CheckCircle, AlertCircle, Building2, Package, Users, DollarSign, FileText, Settings, ChevronDown, ChevronUp, Filter, MoreVertical } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// ==================== TYPES ====================
interface CommissionRow {
  id: string;
  product: string;
  goods: string;
  category: string;
  applicable: string;
  applicableOn: string;
  fromSlab: string;
  toSlab: string;
  cashRate: string;
  cashMinimum: string;
  creditRate: string;
  creditMinimum: string;
  toPayRate: string;
  toPayMinimum: string;
  includeAdditional: boolean;
  excludeAdditional: boolean;
}

interface AdditionalCharge {
  id: number;
  name: string;
  type: string;
  rate: string;
  amount: string;
  perc: string;
}

interface AgencyCommissionRecord {
  id: string;
  agencyName: string;
  agencyCode: string;
  wefDate: Date;
  validUpto: Date | undefined;
  selectedProducts: string[];
  selectedGoods: string[];
  commissionCategory: string;
  commissionRows: CommissionRow[];
  additionalCharges: AdditionalCharge[];
  status: "active" | "inactive" | "expired";
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
}

// ==================== STATIC DATA ====================
const agencies = [
  { code: "AG001", name: "Mumbai Transport Services", city: "Mumbai", type: "Transport" },
  { code: "AG002", name: "Delhi Logistics Pvt Ltd", city: "Delhi", type: "Logistics" },
  { code: "AG003", name: "Bangalore Carriers", city: "Bangalore", type: "Carrier" },
  { code: "AG004", name: "Chennai Movers & Packers", city: "Chennai", type: "Movers" },
  { code: "AG005", name: "Kolkata Freight Forwarders", city: "Kolkata", type: "Freight" },
  { code: "AG006", name: "Hyderabad Express Cargo", city: "Hyderabad", type: "Cargo" },
  { code: "AG007", name: "Pune Transport Corporation", city: "Pune", type: "Transport" },
  { code: "AG008", name: "Ahmedabad Roadways", city: "Ahmedabad", type: "Roadways" },
  { code: "AG009", name: "Jaipur Logistics Hub", city: "Jaipur", type: "Logistics" },
  { code: "AG010", name: "Lucknow Carriers", city: "Lucknow", type: "Carrier" },
];

const commissionCategories = [
  { id: "CAT001", name: "Standard Commission", rate: "5%", description: "Basic commission for regular shipments" },
  { id: "CAT002", name: "Premium Commission", rate: "7.5%", description: "Higher commission for priority shipments" },
  { id: "CAT003", name: "Volume Discount", rate: "10%", description: "Special rate for bulk shipments" },
  { id: "CAT004", name: "Seasonal Offer", rate: "12%", description: "Festival season special commission" },
  { id: "CAT005", name: "Corporate Rate", rate: "8%", description: "Corporate client special rate" },
];

const productList = [
  "Surface Transport", "Express Cargo", "Temperature Controlled", "Oversized Cargo",
  "Household Moving", "Warehousing", "Supply Chain", "Freight Forwarding",
  "Courier Services", "International Shipping", "Cold Chain Logistics", "E-commerce Logistics"
];

const goodsList = [
  "Electronics & Appliances", "Furniture & Furnishings", "Clothing & Textiles",
  "Food & Beverages", "Pharmaceuticals", "Chemicals & Solvents", "Machinery & Equipment",
  "Auto Parts & Accessories", "Books & Stationery", "Fragile & Glass Items",
  "Construction Material", "Agricultural Products", "Petroleum Products",
  "Metal & Scrap", "Plastic & Rubber", "Healthcare Equipment", "Perishable Items"
];

const chargeTypes = ["Percentage", "Fixed", "Slab Based"];
const applicableOptions = ["All", "Domestic", "International", "Local"];
const applicableOnOptions = ["Basic Freight", "Total Invoice", "Net Amount", "Gross Amount"];

// ==================== SAMPLE DATA ====================
const sampleRecords: AgencyCommissionRecord[] = [
  {
    id: "1",
    agencyName: "Mumbai Transport Services",
    agencyCode: "AG001",
    wefDate: new Date("2025-04-01"),
    validUpto: new Date("2026-03-31"),
    selectedProducts: ["Surface Transport", "Express Cargo"],
    selectedGoods: ["Electronics & Appliances", "Machinery & Equipment"],
    commissionCategory: "Standard Commission",
    commissionRows: [],
    additionalCharges: [],
    status: "active",
    createdBy: "Admin",
    createdAt: new Date("2025-04-01"),
    updatedBy: "Admin",
    updatedAt: new Date("2025-04-01"),
  },
  {
    id: "2",
    agencyName: "Delhi Logistics Pvt Ltd",
    agencyCode: "AG002",
    wefDate: new Date("2025-04-01"),
    validUpto: new Date("2026-03-31"),
    selectedProducts: ["Warehousing", "Supply Chain"],
    selectedGoods: ["Food & Beverages", "Pharmaceuticals"],
    commissionCategory: "Premium Commission",
    commissionRows: [],
    additionalCharges: [],
    status: "active",
    createdBy: "Admin",
    createdAt: new Date("2025-04-01"),
    updatedBy: "Admin",
    updatedAt: new Date("2025-04-01"),
  },
  {
    id: "3",
    agencyName: "Bangalore Carriers",
    agencyCode: "AG003",
    wefDate: new Date("2025-04-01"),
    validUpto: new Date("2025-12-31"),
    selectedProducts: ["Temperature Controlled", "Cold Chain Logistics"],
    selectedGoods: ["Pharmaceuticals", "Food & Beverages"],
    commissionCategory: "Volume Discount",
    commissionRows: [],
    additionalCharges: [],
    status: "active",
    createdBy: "Admin",
    createdAt: new Date("2025-04-01"),
    updatedBy: "Admin",
    updatedAt: new Date("2025-04-01"),
  },
];

// ==================== MAIN COMPONENT ====================
export default function AgencyCommissionMaster() {
  // UI State
  const [isEntrySheetOpen, setIsEntrySheetOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "commission" | "charges">("details");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  
  // Form State
  const [rows, setRows] = useState<CommissionRow[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedGoods, setSelectedGoods] = useState<string[]>([]);
  const [wefDate, setWefDate] = useState<Date>(new Date());
  const [validUpto, setValidUpto] = useState<Date | undefined>();
  const [agencyName, setAgencyName] = useState<string>("");
  const [agencyCode, setAgencyCode] = useState<string>("");
  const [commissionCategory, setCommissionCategory] = useState<string>("");
  const [status, setStatus] = useState<"active" | "inactive" | "expired">("active");
  
  // Search State
  const [searchResults, setSearchResults] = useState<AgencyCommissionRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchStatus, setSearchStatus] = useState<string>("all");
  const [searchFromDate, setSearchFromDate] = useState<Date | undefined>();
  const [searchToDate, setSearchToDate] = useState<Date | undefined>();
  const [loading, setLoading] = useState(false);
  
  // Dialog State
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isGoodsDialogOpen, setIsGoodsDialogOpen] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [goodsSearch, setGoodsSearch] = useState("");
  
  // Local copies for dialog
  const [tempSelectedProducts, setTempSelectedProducts] = useState<string[]>([]);
  const [tempSelectedGoods, setTempSelectedGoods] = useState<string[]>([]);
  
  // Saved Records
  const [savedRecords, setSavedRecords] = useState<AgencyCommissionRecord[]>(sampleRecords);
  
  // Additional Charges
  const [additionalCharges, setAdditionalCharges] = useState<AdditionalCharge[]>([
    { id: 1, name: "DOCKET CHARGE", type: "Fixed", rate: "0", amount: "50", perc: "0" },
    { id: 2, name: "DOOR DELIVERY", type: "Fixed", rate: "0", amount: "100", perc: "0" },
    { id: 3, name: "GREEN TAX CHARGE", type: "Percentage", rate: "2", amount: "0", perc: "2" },
    { id: 4, name: "HAMALI CHARGE", type: "Fixed", rate: "0", amount: "75", perc: "0" },
    { id: 5, name: "FUEL SURCHARGE", type: "Percentage", rate: "3", amount: "0", perc: "3" },
    { id: 6, name: "OCTROI CHARGE", type: "Percentage", rate: "1.5", amount: "0", perc: "1.5" },
  ]);

  // Load search results on mount
  useEffect(() => {
    setSearchResults(savedRecords);
  }, []);

  // ==================== HELPER FUNCTIONS ====================
  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 6);
  };

  const addRow = () => {
    const newRow: CommissionRow = {
      id: generateId(),
      product: "",
      goods: "",
      category: "",
      applicable: "",
      applicableOn: "",
      fromSlab: "",
      toSlab: "",
      cashRate: "",
      cashMinimum: "",
      creditRate: "",
      creditMinimum: "",
      toPayRate: "",
      toPayMinimum: "",
      includeAdditional: false,
      excludeAdditional: false,
    };
    setRows([...rows, newRow]);
    setExpandedRows(prev => new Set(prev).add(newRow.id));
  };

  const removeRow = (id: string) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const updateRow = (id: string, field: keyof CommissionRow, value: any) => {
    setRows(rows.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const toggleRowExpand = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const updateAdditionalCharge = (id: number, field: keyof AdditionalCharge, value: any) => {
    setAdditionalCharges(additionalCharges.map((charge) => 
      charge.id === id ? { ...charge, [field]: value } : charge
    ));
  };

  // Reset Form
  const resetForm = () => {
    setRows([]);
    setSelectedProducts([]);
    setSelectedGoods([]);
    setAgencyName("");
    setAgencyCode("");
    setCommissionCategory("");
    setWefDate(new Date());
    setValidUpto(undefined);
    setStatus("active");
    setEditMode(false);
    setCurrentEditId(null);
    setActiveTab("details");
    setExpandedRows(new Set());
    setAdditionalCharges([
      { id: 1, name: "DOCKET CHARGE", type: "Fixed", rate: "0", amount: "50", perc: "0" },
      { id: 2, name: "DOOR DELIVERY", type: "Fixed", rate: "0", amount: "100", perc: "0" },
      { id: 3, name: "GREEN TAX CHARGE", type: "Percentage", rate: "2", amount: "0", perc: "2" },
      { id: 4, name: "HAMALI CHARGE", type: "Fixed", rate: "0", amount: "75", perc: "0" },
      { id: 5, name: "FUEL SURCHARGE", type: "Percentage", rate: "3", amount: "0", perc: "3" },
      { id: 6, name: "OCTROI CHARGE", type: "Percentage", rate: "1.5", amount: "0", perc: "1.5" },
    ]);
  };

  // Handle Agency Change
  const handleAgencyChange = (value: string) => {
    const selected = agencies.find(a => a.name === value);
    setAgencyName(value);
    setAgencyCode(selected?.code || "");
  };

  // Handle Save
  const handleSave = () => {
    if (!agencyName) {
      alert("Please select Agency Name");
      return;
    }
    if (!commissionCategory) {
      alert("Please select Commission Category");
      return;
    }

    const newRecord: AgencyCommissionRecord = {
      id: currentEditId || generateId(),
      agencyName,
      agencyCode,
      wefDate,
      validUpto,
      selectedProducts,
      selectedGoods,
      commissionCategory,
      commissionRows: rows,
      additionalCharges,
      status,
      createdBy: "Admin",
      createdAt: editMode && currentEditId ? 
        savedRecords.find(r => r.id === currentEditId)?.createdAt || new Date() : 
        new Date(),
      updatedBy: "Admin",
      updatedAt: new Date(),
    };

    if (editMode && currentEditId) {
      setSavedRecords(savedRecords.map(record => record.id === currentEditId ? newRecord : record));
      alert("Record updated successfully!");
    } else {
      setSavedRecords([...savedRecords, newRecord]);
      alert("Record saved successfully!");
    }
    
    resetForm();
    setIsEntrySheetOpen(false);
    handleSearch();
  };

  // Handle Search
  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      let results = [...savedRecords];
      
      if (searchQuery) {
        results = results.filter(r => 
          r.agencyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.agencyCode.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      if (searchStatus !== "all") {
        results = results.filter(r => r.status === searchStatus);
      }
      
      if (searchFromDate) {
        results = results.filter(r => r.wefDate >= searchFromDate);
      }
      
      if (searchToDate) {
        results = results.filter(r => r.validUpto && r.validUpto <= searchToDate);
      }
      
      setSearchResults(results);
      setLoading(false);
    }, 300);
  };

  // Handle Edit
  const handleEdit = (record: AgencyCommissionRecord) => {
    setEditMode(true);
    setCurrentEditId(record.id);
    setAgencyName(record.agencyName);
    setAgencyCode(record.agencyCode);
    setWefDate(record.wefDate);
    setValidUpto(record.validUpto);
    setSelectedProducts(record.selectedProducts);
    setSelectedGoods(record.selectedGoods);
    setCommissionCategory(record.commissionCategory);
    setRows(record.commissionRows);
    setAdditionalCharges(record.additionalCharges);
    setStatus(record.status);
    setIsEntrySheetOpen(true);
  };

  // Handle Delete
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this record?")) {
      setSavedRecords(savedRecords.filter(record => record.id !== id));
      setSearchResults(searchResults.filter(record => record.id !== id));
      alert("Record deleted successfully!");
    }
  };

  // Handle Duplicate
  const handleDuplicate = (record: AgencyCommissionRecord) => {
    const newRecord = {
      ...record,
      id: generateId(),
      agencyName: `${record.agencyName} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setSavedRecords([...savedRecords, newRecord]);
    setSearchResults([...searchResults, newRecord]);
    alert("Record duplicated successfully!");
  };

  // Clear Search
  const clearSearch = () => {
    setSearchQuery("");
    setSearchStatus("all");
    setSearchFromDate(undefined);
    setSearchToDate(undefined);
    setSearchResults(savedRecords);
  };

  // Open Add Sheet
  const openAddSheet = () => {
    resetForm();
    setEditMode(false);
    setCurrentEditId(null);
    setIsEntrySheetOpen(true);
  };

  // Product Dialog Handlers
  const handleProductConfirm = () => {
    setSelectedProducts([...tempSelectedProducts]);
    setIsProductDialogOpen(false);
  };

  const handleProductDialogOpen = () => {
    setTempSelectedProducts([...selectedProducts]);
    setIsProductDialogOpen(true);
  };

  const toggleProductSelection = (product: string) => {
    setTempSelectedProducts(prev =>
      prev.includes(product) ? prev.filter(p => p !== product) : [...prev, product]
    );
  };

  // Goods Dialog Handlers
  const handleGoodsConfirm = () => {
    setSelectedGoods([...tempSelectedGoods]);
    setIsGoodsDialogOpen(false);
  };

  const handleGoodsDialogOpen = () => {
    setTempSelectedGoods([...selectedGoods]);
    setIsGoodsDialogOpen(true);
  };

  const toggleGoodsSelection = (good: string) => {
    setTempSelectedGoods(prev =>
      prev.includes(good) ? prev.filter(g => g !== good) : [...prev, good]
    );
  };

  const filteredProductsList = productList.filter(p =>
    p.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredGoodsList = goodsList.filter(g =>
    g.toLowerCase().includes(goodsSearch.toLowerCase())
  );

  // Get Status Badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
      case "inactive":
        return <Badge variant="secondary" className="bg-gray-500">Inactive</Badge>;
      case "expired":
        return <Badge variant="destructive">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Stats
  const stats = {
    total: searchResults.length,
    active: searchResults.filter(r => r.status === "active").length,
    expired: searchResults.filter(r => r.status === "expired").length,
  };

  return (
    <div className="space-y-4 p-3 md:p-4 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-wrap justify-between items-start gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">Agency Commission Master</h1>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500">
              <span>🏢 Company: GOLDEN ROADWAYS & LOGISTICS PVT LTD</span>
              <span>👤 Login: MAYANK.GRLOGISTICS@GMAIL.COM</span>
              <span>📍 Branch: CORPORATE OFFICE</span>
              <span>📅 Financial Year: 2026-2027</span>
            </div>
          </div>
          <Button onClick={openAddSheet} size="default" className="bg-blue-600 hover:bg-blue-700 shadow-md">
            <Plus className="mr-2 h-4 w-4" />
            Add New Commission
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">Total Records</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">Active Commissions</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
              <CheckCircle className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">Expired/Inactive</p>
                <p className="text-2xl font-bold">{stats.expired}</p>
              </div>
              <AlertCircle className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Search Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-medium">Search</Label>
              <Input
                placeholder="Agency name or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium">Status</Label>
              <Select value={searchStatus} onValueChange={setSearchStatus}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium">From Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-9 w-full justify-start text-left text-sm font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {searchFromDate ? format(searchFromDate, "dd-MM-yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={searchFromDate} onSelect={setSearchFromDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium">To Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-9 w-full justify-start text-left text-sm font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {searchToDate ? format(searchToDate, "dd-MM-yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={searchToDate} onSelect={setSearchToDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={handleSearch} className="h-9 flex-1 bg-blue-600 hover:bg-blue-700">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
              <Button onClick={clearSearch} variant="outline" className="h-9">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base flex items-center gap-2">
              <Table className="h-4 w-4" />
              Commission Records
            </CardTitle>
            <div className="text-sm text-gray-500">
              Total: {searchResults.length} records
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[800px]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold py-3 w-12">#</TableHead>
                    <TableHead className="font-semibold py-3 min-w-[200px]">Agency Details</TableHead>
                    <TableHead className="font-semibold py-3 min-w-[120px]">Valid Period</TableHead>
                    <TableHead className="font-semibold py-3 min-w-[150px]">Commission Category</TableHead>
                    <TableHead className="font-semibold py-3 min-w-[80px]">Status</TableHead>
                    <TableHead className="font-semibold py-3 w-24 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex justify-center items-center gap-2">
                          <RefreshCw className="h-5 w-5 animate-spin" />
                          <span>Loading...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : searchResults.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        <Building2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        No records found. Click "Add New Commission" to create one.
                      </TableCell>
                    </TableRow>
                  ) : (
                    searchResults.map((record, index) => (
                      <TableRow key={record.id} className="hover:bg-gray-50">
                        <TableCell className="py-3 text-center">{index + 1}</TableCell>
                        <TableCell className="py-3">
                          <div>
                            <div className="font-semibold text-gray-800">{record.agencyName}</div>
                            <div className="text-xs text-gray-500">Code: {record.agencyCode}</div>
                            <div className="text-xs text-gray-400 mt-1">
                              Products: {record.selectedProducts.slice(0, 2).join(", ")}
                              {record.selectedProducts.length > 2 && ` +${record.selectedProducts.length - 2}`}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-3">
                          <div className="text-sm">{format(record.wefDate, "dd-MM-yyyy")}</div>
                          <div className="text-xs text-gray-500">to {record.validUpto ? format(record.validUpto, "dd-MM-yyyy") : "N/A"}</div>
                        </TableCell>
                        <TableCell className="py-3">
                          <span className="text-sm">{record.commissionCategory}</span>
                        </TableCell>
                        <TableCell className="py-3">{getStatusBadge(record.status)}</TableCell>
                        <TableCell className="py-3">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(record)}
                              className="h-8 w-8 p-0 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDuplicate(record)}
                              className="h-8 w-8 p-0 text-green-500 hover:text-green-700 hover:bg-green-50"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(record.id)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
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
        </CardContent>
      </Card>

      {/* Entry Sheet */}
      <Sheet open={isEntrySheetOpen} onOpenChange={setIsEntrySheetOpen}>
        <SheetContent className="w-full sm:max-w-5xl overflow-y-auto p-0">
          <SheetHeader className="sticky top-0 bg-white z-10 px-6 py-4 border-b">
            <SheetTitle className="flex items-center gap-2">
              {editMode ? (
                <>
                  <Edit className="h-5 w-5 text-blue-600" />
                  Edit Agency Commission
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5 text-blue-600" />
                  Add New Agency Commission
                </>
              )}
            </SheetTitle>
          </SheetHeader>

          <div className="px-6 py-4 space-y-6">
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details" className="text-sm">Basic Details</TabsTrigger>
                <TabsTrigger value="commission" className="text-sm">Commission Structure</TabsTrigger>
                <TabsTrigger value="charges" className="text-sm">Additional Charges</TabsTrigger>
              </TabsList>

              {/* Tab 1: Basic Details */}
              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Agency Name <span className="text-red-500">*</span>
                    </Label>
                    <Select value={agencyName} onValueChange={handleAgencyChange}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select Agency" />
                      </SelectTrigger>
                      <SelectContent>
                        {agencies.map((agency) => (
                          <SelectItem key={agency.code} value={agency.name}>
                            {agency.name} ({agency.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Agency Code</Label>
                    <Input value={agencyCode} readOnly className="h-10 bg-gray-50" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">W.E.F Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="h-10 w-full justify-start text-left">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {wefDate ? format(wefDate, "dd-MM-yyyy") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={wefDate} onSelect={(date) => date && setWefDate(date)} />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Valid Upto</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="h-10 w-full justify-start text-left">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {validUpto ? format(validUpto, "dd-MM-yyyy") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={validUpto} onSelect={setValidUpto} />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Commission Category</Label>
                    <Select value={commissionCategory} onValueChange={setCommissionCategory}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {commissionCategories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.name}>
                            {cat.name} ({cat.rate})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Status</Label>
                    <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                      <SelectTrigger className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Select Products</Label>
                    <div className="flex gap-2">
                      <Input
                        value={selectedProducts.length > 0 ? `${selectedProducts.length} products selected` : ""}
                        readOnly
                        placeholder="Select Products"
                        className="h-10 flex-1 cursor-pointer bg-white"
                        onClick={handleProductDialogOpen}
                      />
                      <Button variant="outline" size="sm" className="h-10 w-10 p-0" onClick={handleProductDialogOpen}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {selectedProducts.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {selectedProducts.slice(0, 3).map((product) => (
                          <Badge key={product} variant="secondary" className="text-xs">
                            {product.length > 20 ? product.substring(0, 20) + "..." : product}
                          </Badge>
                        ))}
                        {selectedProducts.length > 3 && (
                          <Badge variant="outline" className="text-xs">+{selectedProducts.length - 3}</Badge>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Select Goods</Label>
                    <div className="flex gap-2">
                      <Input
                        value={selectedGoods.length > 0 ? `${selectedGoods.length} goods selected` : ""}
                        readOnly
                        placeholder="Select Goods"
                        className="h-10 flex-1 cursor-pointer bg-white"
                        onClick={handleGoodsDialogOpen}
                      />
                      <Button variant="outline" size="sm" className="h-10 w-10 p-0" onClick={handleGoodsDialogOpen}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {selectedGoods.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {selectedGoods.slice(0, 3).map((goods) => (
                          <Badge key={goods} variant="secondary" className="text-xs">
                            {goods.length > 20 ? goods.substring(0, 20) + "..." : goods}
                          </Badge>
                        ))}
                        {selectedGoods.length > 3 && (
                          <Badge variant="outline" className="text-xs">+{selectedGoods.length - 3}</Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Tab 2: Commission Structure */}
              <TabsContent value="commission" className="space-y-4 mt-4">
                <div className="rounded-md border overflow-x-auto">
                  <div className="min-w-[1000px]">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="w-12 text-center">SNo</TableHead>
                          <TableHead className="min-w-[120px]">Product</TableHead>
                          <TableHead className="min-w-[120px]">Goods</TableHead>
                          <TableHead className="min-w-[100px]">Category</TableHead>
                          <TableHead className="min-w-[100px]">Applicable</TableHead>
                          <TableHead className="min-w-[100px]">Applicable On</TableHead>
                          <TableHead className="min-w-[80px]">From Slab</TableHead>
                          <TableHead className="min-w-[80px]">To Slab</TableHead>
                          <TableHead className="min-w-[80px]">Cash Rate</TableHead>
                          <TableHead className="min-w-[80px]">Cash Min</TableHead>
                          <TableHead className="min-w-[80px]">Credit Rate</TableHead>
                          <TableHead className="min-w-[80px]">Credit Min</TableHead>
                          <TableHead className="min-w-[80px]">To Pay Rate</TableHead>
                          <TableHead className="min-w-[80px]">To Pay Min</TableHead>
                          <TableHead className="w-12">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rows.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={15} className="text-center py-8 text-gray-500">
                              No commission rows added. Click "Add Row" to create commission structure.
                            </TableCell>
                          </TableRow>
                        ) : (
                          rows.map((row, index) => (
                            <React.Fragment key={row.id}>
                              <TableRow className={expandedRows.has(row.id) ? "bg-gray-50" : ""}>
                                <TableCell className="text-center">{index + 1}</TableCell>
                                <TableCell>
                                  <Input value={row.product} onChange={(e) => updateRow(row.id, "product", e.target.value)} className="h-8 text-sm" placeholder="Product" />
                                </TableCell>
                                <TableCell>
                                  <Input value={row.goods} onChange={(e) => updateRow(row.id, "goods", e.target.value)} className="h-8 text-sm" placeholder="Goods" />
                                </TableCell>
                                <TableCell>
                                  <Input value={row.category} onChange={(e) => updateRow(row.id, "category", e.target.value)} className="h-8 text-sm" placeholder="Category" />
                                </TableCell>
                                <TableCell>
                                  <Select value={row.applicable} onValueChange={(v) => updateRow(row.id, "applicable", v)}>
                                    <SelectTrigger className="h-8 text-sm">
                                      <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {applicableOptions.map((opt) => (
                                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                                <TableCell>
                                  <Select value={row.applicableOn} onValueChange={(v) => updateRow(row.id, "applicableOn", v)}>
                                    <SelectTrigger className="h-8 text-sm">
                                      <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {applicableOnOptions.map((opt) => (
                                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                                <TableCell>
                                  <Input value={row.fromSlab} onChange={(e) => updateRow(row.id, "fromSlab", e.target.value)} className="h-8 text-sm" placeholder="From" />
                                </TableCell>
                                <TableCell>
                                  <Input value={row.toSlab} onChange={(e) => updateRow(row.id, "toSlab", e.target.value)} className="h-8 text-sm" placeholder="To" />
                                </TableCell>
                                <TableCell>
                                  <Input value={row.cashRate} onChange={(e) => updateRow(row.id, "cashRate", e.target.value)} className="h-8 text-sm" placeholder="Rate" />
                                </TableCell>
                                <TableCell>
                                  <Input value={row.cashMinimum} onChange={(e) => updateRow(row.id, "cashMinimum", e.target.value)} className="h-8 text-sm" placeholder="Min" />
                                </TableCell>
                                <TableCell>
                                  <Input value={row.creditRate} onChange={(e) => updateRow(row.id, "creditRate", e.target.value)} className="h-8 text-sm" placeholder="Rate" />
                                </TableCell>
                                <TableCell>
                                  <Input value={row.creditMinimum} onChange={(e) => updateRow(row.id, "creditMinimum", e.target.value)} className="h-8 text-sm" placeholder="Min" />
                                </TableCell>
                                <TableCell>
                                  <Input value={row.toPayRate} onChange={(e) => updateRow(row.id, "toPayRate", e.target.value)} className="h-8 text-sm" placeholder="Rate" />
                                </TableCell>
                                <TableCell>
                                  <Input value={row.toPayMinimum} onChange={(e) => updateRow(row.id, "toPayMinimum", e.target.value)} className="h-8 text-sm" placeholder="Min" />
                                </TableCell>
                                <TableCell>
                                  <Button variant="ghost" size="sm" onClick={() => removeRow(row.id)} className="h-8 w-8 p-0 text-red-500">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            </React.Fragment>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={addRow} variant="outline" size="sm" className="gap-1">
                    <Plus className="h-4 w-4" /> Add Row
                  </Button>
                </div>
              </TabsContent>

              {/* Tab 3: Additional Charges */}
              <TabsContent value="charges" className="space-y-4 mt-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="w-12 text-center">#</TableHead>
                        <TableHead>Charge Name</TableHead>
                        <TableHead className="w-32">Type</TableHead>
                        <TableHead className="w-24">Rate (%)</TableHead>
                        <TableHead className="w-28">Amount (₹)</TableHead>
                        <TableHead className="w-24">Perc (%)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {additionalCharges.map((charge) => (
                        <TableRow key={charge.id}>
                          <TableCell className="text-center">{charge.id}</TableCell>
                          <TableCell className="font-medium">{charge.name}</TableCell>
                          <TableCell>
                            <Select value={charge.type} onValueChange={(v) => updateAdditionalCharge(charge.id, "type", v)}>
                              <SelectTrigger className="h-8 text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {chargeTypes.map((type) => (
                                  <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input type="number" value={charge.rate} onChange={(e) => updateAdditionalCharge(charge.id, "rate", e.target.value)} className="h-8 text-sm" step="0.01" />
                          </TableCell>
                          <TableCell>
                            <Input type="number" value={charge.amount} onChange={(e) => updateAdditionalCharge(charge.id, "amount", e.target.value)} className="h-8 text-sm" step="0.01" />
                          </TableCell>
                          <TableCell>
                            <Input type="number" value={charge.perc} onChange={(e) => updateAdditionalCharge(charge.id, "perc", e.target.value)} className="h-8 text-sm" step="0.01" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <SheetFooter className="sticky bottom-0 bg-white border-t px-6 py-4 mt-4">
            <Button variant="outline" onClick={() => setIsEntrySheetOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              <Save className="mr-2 h-4 w-4" />
              {editMode ? "Update Commission" : "Save Commission"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Products Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Select Products</DialogTitle>
          </DialogHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="border rounded-md flex-1 overflow-auto max-h-[50vh]">
            <div className="divide-y">
              {filteredProductsList.map((product) => (
                <label key={product} className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempSelectedProducts.includes(product)}
                    onChange={() => toggleProductSelection(product)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <span className="text-sm">{product}</span>
                </label>
              ))}
              {filteredProductsList.length === 0 && (
                <div className="p-8 text-center text-gray-500">No products found</div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProductDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleProductConfirm}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Goods Dialog */}
      <Dialog open={isGoodsDialogOpen} onOpenChange={setIsGoodsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Select Goods</DialogTitle>
          </DialogHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search goods..."
              value={goodsSearch}
              onChange={(e) => setGoodsSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="border rounded-md flex-1 overflow-auto max-h-[50vh]">
            <div className="divide-y">
              {filteredGoodsList.map((goods) => (
                <label key={goods} className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempSelectedGoods.includes(goods)}
                    onChange={() => toggleGoodsSelection(goods)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <span className="text-sm">{goods}</span>
                </label>
              ))}
              {filteredGoodsList.length === 0 && (
                <div className="p-8 text-center text-gray-500">No goods found</div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGoodsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleGoodsConfirm}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}