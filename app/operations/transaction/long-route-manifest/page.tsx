"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  CalendarIcon,
  Save,
  RefreshCw,
  Search,
  Printer,
  FileText,
  Eye,
  X,
  Check,
  Truck,
  MapPin,
  User,
  Phone,
  Building,
  Clock,
  Edit,
  PlusCircle,
  Trash2,
  Package,
  Weight,
  FileSpreadsheet,
  Filter,
  ChevronLeft,
  ChevronRight,
  Plus,
  History,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Types
interface LongRouteManifest {
  id: number;
  manifestNo: string;
  manifestDateTime: Date;
  manifestTime: string;
  branch: string;
  toStation: string;
  deliveryLocation: string;
  vehicleType: string;
  vendor: string;
  vehicleNo: string;
  capacity: string;
  driver: string;
  mobileNo: string;
  consolidatedEwaybillNo: string;
  ewaybillDate: Date;
  loadedBy: string;
  estimateArrivalAtDestination: string;
  remarks: string;
  type: string;
  fromStation: string;
  arrivalAt: string;
  category: string;
  dispatchedPckgs: number;
  dispatchedWt: number;
  lhcNo: string;
  status: "active" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

interface StockItem {
  id: number;
  grNo: string;
  grDate: Date;
  origin: string;
  destination: string;
  consignor: string;
  consignee: string;
  toPay: string;
  paid: string;
  tbb: string;
  stockPckgs: number;
  selected: boolean;
}

// Options
const branchOptions = [
  "CORPORATE OFFICE",
  "DELHI",
  "MUMBAI",
  "BANGALORE",
  "CHENNAI",
  "KOLKATA",
  "AHMEDABAD",
  "PUNE",
  "HYDERABAD",
];

const toStationOptions = [
  "U P BORDER A JH UP",
  "U P BORDER D BR GP",
  "U P BORDER B BR",
  "DELHI",
  "MUMBAI",
  "BANGALORE",
  "CHENNAI",
  "KOLKATA",
];

const vehicleTypeOptions = ["MARKET", "OWN", "CONTRACT", "HIRE"];
const vendorOptions = ["TATA MOTORS", "ASHOK LEYLAND", "MAHINDRA", "EICHER", "BHARAT BENZ"];
const driverOptions = ["Rajesh Kumar", "Suresh Singh", "Mahesh Sharma", "Ramesh Gupta", "Satish Verma"];
const loadedByOptions = ["Mohan Singh", "Ravi Kumar", "Amit Sharma", "Pradeep Verma"];
const cancelledReasonOptions = [
  "Customer Request", "Vehicle Issue", "Weather Condition", "Route Issue", "Other"
];

// Sample Stock Items
const sampleStockItems: StockItem[] = [
  { id: 1, grNo: "GR001", grDate: new Date(), origin: "DELHI", destination: "MUMBAI", consignor: "M/s ABC Traders", consignee: "M/s XYZ Enterprises", toPay: "Yes", paid: "No", tbb: "TBB001", stockPckgs: 50, selected: false },
  { id: 2, grNo: "GR002", grDate: new Date(), origin: "DELHI", destination: "BANGALORE", consignor: "M/s PQR Ltd", consignee: "M/s LMN Corp", toPay: "No", paid: "Yes", tbb: "TBB002", stockPckgs: 30, selected: false },
  { id: 3, grNo: "GR003", grDate: new Date(), origin: "MUMBAI", destination: "CHENNAI", consignor: "M/s DEF Industries", consignee: "M/s GHI Enterprises", toPay: "Yes", paid: "No", tbb: "TBB003", stockPckgs: 25, selected: false },
  { id: 4, grNo: "GR004", grDate: new Date(), origin: "BANGALORE", destination: "DELHI", consignor: "M/s JKL Solutions", consignee: "M/s MNO Corp", toPay: "No", paid: "Yes", tbb: "TBB004", stockPckgs: 40, selected: false },
  { id: 5, grNo: "GR005", grDate: new Date(), origin: "CHENNAI", destination: "KOLKATA", consignor: "M/s RST Group", consignee: "M/s UVW Enterprises", toPay: "Yes", paid: "No", tbb: "TBB005", stockPckgs: 35, selected: false },
];

export default function LongRouteManifestGRL() {
  // Main Tab state
  const [mainTab, setMainTab] = useState<"active" | "stock" | "cancelled">("active");

  // Sheet state
  const [isEntrySheetOpen, setIsEntrySheetOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<number | null>(null);

  // Cancel Dialog state
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [cancellingManifest, setCancellingManifest] = useState<LongRouteManifest | null>(null);
  const [cancelledReason, setCancelledReason] = useState<string>("");

  // Form state
  const [autoManifest, setAutoManifest] = useState<boolean>(true);
  const [manifestNo, setManifestNo] = useState<string>("");
  const [manifestDateTime, setManifestDateTime] = useState<Date>(new Date());
  const [manifestTime, setManifestTime] = useState<string>("14:34");
  const [branch, setBranch] = useState<string>("");
  const [toStation, setToStation] = useState<string>("");
  const [deliveryLocation, setDeliveryLocation] = useState<string>("");
  const [vehicleType, setVehicleType] = useState<string>("");
  const [vendor, setVendor] = useState<string>("");
  const [vehicleNo, setVehicleNo] = useState<string>("");
  const [capacity, setCapacity] = useState<string>("");
  const [driver, setDriver] = useState<string>("");
  const [mobileNo, setMobileNo] = useState<string>("");
  const [consolidatedEwaybillNo, setConsolidatedEwaybillNo] = useState<string>("");
  const [ewaybillDate, setEwaybillDate] = useState<Date>(new Date());
  const [loadedBy, setLoadedBy] = useState<string>("");
  const [estimateArrivalAtDestination, setEstimateArrivalAtDestination] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");

  // Stock of Despatch State
  const [stockBranch, setStockBranch] = useState<string>("");
  const [asOnDate, setAsOnDate] = useState<Date>(new Date());
  const [destination, setDestination] = useState<string>("");
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [selectAllBranch, setSelectAllBranch] = useState<boolean>(false);
  const [selectAllDestination, setSelectAllDestination] = useState<boolean>(false);
  const [stockCurrentPage, setStockCurrentPage] = useState<number>(1);
  const stockItemsPerPage: number = 10;

  // Search State
  const [searchBranch, setSearchBranch] = useState<string>("");
  const [searchFromDate, setSearchFromDate] = useState<Date>(new Date());
  const [searchToDate, setSearchToDate] = useState<Date>(new Date());
  const [searchResults, setSearchResults] = useState<LongRouteManifest[]>([]);
  const [cancelledResults, setCancelledResults] = useState<LongRouteManifest[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [cancelledPage, setCancelledPage] = useState<number>(1);
  const itemsPerPage: number = 10;

  // Sample Data
  const sampleData: LongRouteManifest[] = [
    { id: 1, manifestNo: "LR001", manifestDateTime: new Date("2026-05-28"), manifestTime: "10:30", branch: "DELHI", toStation: "MUMBAI", deliveryLocation: "MUMBAI GODOWN", vehicleType: "MARKET", vendor: "TATA MOTORS", vehicleNo: "UP14AB1234", capacity: "15 Ton", driver: "Rajesh Kumar", mobileNo: "9876543210", consolidatedEwaybillNo: "EWB001", ewaybillDate: new Date("2026-05-28"), loadedBy: "Mohan Singh", estimateArrivalAtDestination: "05-06-2026", remarks: "", type: "LONG ROUTE", fromStation: "DELHI", arrivalAt: "MUMBAI", category: "MARKET", dispatchedPckgs: 50, dispatchedWt: 2500, lhcNo: "LHC001", status: "active", createdAt: new Date(), updatedAt: new Date() },
    { id: 2, manifestNo: "LR002", manifestDateTime: new Date("2026-05-29"), manifestTime: "11:30", branch: "MUMBAI", toStation: "BANGALORE", deliveryLocation: "BANGALORE GODOWN", vehicleType: "OWN", vendor: "ASHOK LEYLAND", vehicleNo: "MH12AB5678", capacity: "20 Ton", driver: "Suresh Singh", mobileNo: "9876543211", consolidatedEwaybillNo: "EWB002", ewaybillDate: new Date("2026-05-29"), loadedBy: "Ravi Kumar", estimateArrivalAtDestination: "06-06-2026", remarks: "", type: "LONG ROUTE", fromStation: "MUMBAI", arrivalAt: "BANGALORE", category: "OWN", dispatchedPckgs: 75, dispatchedWt: 3800, lhcNo: "LHC002", status: "cancelled", createdAt: new Date(), updatedAt: new Date() },
    { id: 3, manifestNo: "LR003", manifestDateTime: new Date("2026-05-30"), manifestTime: "09:30", branch: "BANGALORE", toStation: "CHENNAI", deliveryLocation: "CHENNAI GODOWN", vehicleType: "CONTRACT", vendor: "MAHINDRA", vehicleNo: "KA34CD9012", capacity: "12 Ton", driver: "Mahesh Sharma", mobileNo: "9876543212", consolidatedEwaybillNo: "EWB003", ewaybillDate: new Date("2026-05-30"), loadedBy: "Amit Sharma", estimateArrivalAtDestination: "07-06-2026", remarks: "", type: "LONG ROUTE", fromStation: "BANGALORE", arrivalAt: "CHENNAI", category: "CONTRACT", dispatchedPckgs: 40, dispatchedWt: 1800, lhcNo: "LHC003", status: "active", createdAt: new Date(), updatedAt: new Date() },
    { id: 4, manifestNo: "LR004", manifestDateTime: new Date("2026-05-31"), manifestTime: "08:30", branch: "CHENNAI", toStation: "KOLKATA", deliveryLocation: "KOLKATA GODOWN", vehicleType: "HIRE", vendor: "EICHER", vehicleNo: "TN45EF6789", capacity: "18 Ton", driver: "Ramesh Gupta", mobileNo: "9876543213", consolidatedEwaybillNo: "EWB004", ewaybillDate: new Date("2026-05-31"), loadedBy: "Pradeep Verma", estimateArrivalAtDestination: "08-06-2026", remarks: "", type: "LONG ROUTE", fromStation: "CHENNAI", arrivalAt: "KOLKATA", category: "HIRE", dispatchedPckgs: 60, dispatchedWt: 3000, lhcNo: "LHC004", status: "active", createdAt: new Date(), updatedAt: new Date() },
  ];

  const [savedRecords, setSavedRecords] = useState<LongRouteManifest[]>(sampleData);

  // Load search results on mount
  useEffect(() => {
    filterActiveRecords();
    filterCancelledRecords();
    setStockItems(sampleStockItems);
  }, []);

  const filterActiveRecords = () => {
    const activeRecords = savedRecords.filter(r => r.status === "active");
    setSearchResults(activeRecords);
  };

  const filterCancelledRecords = () => {
    const cancelledRecords = savedRecords.filter(r => r.status === "cancelled");
    setCancelledResults(cancelledRecords);
  };

  const generateManifestNo = (): string => {
    const count = savedRecords.filter(r => r.status === "active").length + 1;
    return `LR${String(count).padStart(6, "0")}`;
  };

  const resetForm = () => {
    setManifestNo(generateManifestNo());
    setManifestDateTime(new Date());
    setManifestTime("14:34");
    setBranch("");
    setToStation("");
    setDeliveryLocation("");
    setVehicleType("");
    setVendor("");
    setVehicleNo("");
    setCapacity("");
    setDriver("");
    setMobileNo("");
    setConsolidatedEwaybillNo("");
    setEwaybillDate(new Date());
    setLoadedBy("");
    setEstimateArrivalAtDestination("");
    setRemarks("");
    setEditMode(false);
    setCurrentEditId(null);
  };

  const handleSave = () => {
    if (!branch) { alert("Please select Branch"); return; }
    if (!toStation) { alert("Please select To Station"); return; }
    if (!vehicleNo) { alert("Please enter Vehicle #"); return; }
    if (!driver) { alert("Please enter Driver"); return; }
    if (!loadedBy) { alert("Please enter Loaded By"); return; }

    setLoading(true);
    setTimeout(() => {
      const newRecord: LongRouteManifest = {
        id: currentEditId || Date.now(),
        manifestNo: manifestNo,
        manifestDateTime: manifestDateTime,
        manifestTime: manifestTime,
        branch,
        toStation,
        deliveryLocation,
        vehicleType,
        vendor,
        vehicleNo,
        capacity,
        driver,
        mobileNo,
        consolidatedEwaybillNo,
        ewaybillDate,
        loadedBy,
        estimateArrivalAtDestination,
        remarks,
        type: "LONG ROUTE",
        fromStation: branch,
        arrivalAt: toStation,
        category: vehicleType,
        dispatchedPckgs: 0,
        dispatchedWt: 0,
        lhcNo: "",
        status: "active",
        createdAt: editMode && currentEditId ?
          savedRecords.find(r => r.id === currentEditId)?.createdAt || new Date() :
          new Date(),
        updatedAt: new Date(),
      };

      let updatedRecords;
      if (editMode && currentEditId) {
        updatedRecords = savedRecords.map(record => record.id === currentEditId ? newRecord : record);
      } else {
        updatedRecords = [...savedRecords, newRecord];
      }
      setSavedRecords(updatedRecords);
      filterActiveRecords();
      filterCancelledRecords();
      alert(editMode ? "Record updated successfully!" : "Record saved successfully!");
      resetForm();
      setIsEntrySheetOpen(false);
      setLoading(false);
    }, 500);
  };

  const handleSearch = () => {
    let results = savedRecords.filter(r => r.status === "active");
    if (searchBranch && searchBranch !== "ALL") results = results.filter(r => r.branch === searchBranch);
    if (searchFromDate) results = results.filter(r => r.manifestDateTime >= searchFromDate);
    if (searchToDate) results = results.filter(r => r.manifestDateTime <= searchToDate);
    setSearchResults(results);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchBranch("");
    setSearchFromDate(new Date());
    setSearchToDate(new Date());
    filterActiveRecords();
    filterCancelledRecords();
    setCurrentPage(1);
    setCancelledPage(1);
  };

  const handleCancelSearch = () => {
    let results = savedRecords.filter(r => r.status === "cancelled");
    if (searchBranch && searchBranch !== "ALL") results = results.filter(r => r.branch === searchBranch);
    if (searchFromDate) results = results.filter(r => r.manifestDateTime >= searchFromDate);
    if (searchToDate) results = results.filter(r => r.manifestDateTime <= searchToDate);
    setCancelledResults(results);
    setCancelledPage(1);
  };

  const handleStockSearch = () => {
    let results = [...sampleStockItems];
    if (stockBranch && stockBranch !== "ALL" && !selectAllBranch) {
      results = results.filter(r => r.origin === stockBranch);
    }
    if (destination && destination !== "ALL" && !selectAllDestination) {
      results = results.filter(r => r.destination === destination);
    }
    setStockItems(results);
    setSelectAll(false);
    setStockCurrentPage(1);
  };

  const handleClearStockSearch = () => {
    setStockBranch("");
    setDestination("");
    setSelectAllBranch(false);
    setSelectAllDestination(false);
    setStockItems(sampleStockItems);
    setSelectAll(false);
    setStockCurrentPage(1);
  };

  const handleEdit = (record: LongRouteManifest) => {
    setEditMode(true);
    setCurrentEditId(record.id);
    setManifestNo(record.manifestNo);
    setManifestDateTime(record.manifestDateTime);
    setManifestTime(record.manifestTime);
    setBranch(record.branch);
    setToStation(record.toStation);
    setDeliveryLocation(record.deliveryLocation);
    setVehicleType(record.vehicleType);
    setVendor(record.vendor);
    setVehicleNo(record.vehicleNo);
    setCapacity(record.capacity);
    setDriver(record.driver);
    setMobileNo(record.mobileNo);
    setConsolidatedEwaybillNo(record.consolidatedEwaybillNo);
    setEwaybillDate(record.ewaybillDate);
    setLoadedBy(record.loadedBy);
    setEstimateArrivalAtDestination(record.estimateArrivalAtDestination);
    setRemarks(record.remarks);
    setIsEntrySheetOpen(true);
  };

  const handleCancelManifest = () => {
    if (!cancelledReason) { alert("Please select cancellation reason"); return; }
    if (cancellingManifest) {
      const updatedRecords = savedRecords.map(r =>
        r.id === cancellingManifest.id ? { ...r, status: "cancelled" as const, updatedAt: new Date() } : r
      );
      setSavedRecords(updatedRecords);
      filterActiveRecords();
      filterCancelledRecords();
      alert(`Manifest ${cancellingManifest.manifestNo} cancelled successfully!`);
    }
    setIsCancelDialogOpen(false);
    setCancellingManifest(null);
    setCancelledReason("");
  };

  const openCancelDialog = (record: LongRouteManifest) => {
    setCancellingManifest(record);
    setCancelledReason("");
    setIsCancelDialogOpen(true);
  };

  const handlePrintLoadingTally = () => {
    if (stockItems.filter(i => i.selected).length === 0) {
      alert("Please select at least one item to print");
      return;
    }
    alert(`Loading tally printed for ${stockItems.filter(i => i.selected).length} items!`);
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setStockItems(stockItems.map(item => ({ ...item, selected: !selectAll })));
  };

  const handleSelectItem = (id: number) => {
    setStockItems(stockItems.map(item =>
      item.id === id ? { ...item, selected: !item.selected } : item
    ));
  };

  const handleSelectAllBranch = () => {
    setSelectAllBranch(!selectAllBranch);
    if (!selectAllBranch) setStockBranch("ALL");
    else setStockBranch("");
  };

  const handleSelectAllDestination = () => {
    setSelectAllDestination(!selectAllDestination);
    if (!selectAllDestination) setDestination("ALL");
    else setDestination("");
  };

  const openAddSheet = () => {
    resetForm();
    setEditMode(false);
    setCurrentEditId(null);
    setManifestNo(generateManifestNo());
    setIsEntrySheetOpen(true);
  };

  // Stats
  const activeStats = {
    total: searchResults.length,
    totalPckgs: searchResults.reduce((sum, r) => sum + r.dispatchedPckgs, 0),
    totalWeight: searchResults.reduce((sum, r) => sum + r.dispatchedWt, 0),
  };

  const cancelledStats = {
    total: cancelledResults.length,
  };

  const stockStats = {
    total: stockItems.length,
    selected: stockItems.filter(i => i.selected).length,
    totalPckgs: stockItems.reduce((sum, i) => sum + i.stockPckgs, 0),
  };

  // Pagination
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);
  const paginatedResults = searchResults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  const totalCancelledPages = Math.ceil(cancelledResults.length / itemsPerPage);
  const paginatedCancelledResults = cancelledResults.slice((cancelledPage - 1) * itemsPerPage, cancelledPage * itemsPerPage);
  const goToCancelledPage = (page: number) => setCancelledPage(Math.max(1, Math.min(page, totalCancelledPages)));

  const totalStockPages = Math.ceil(stockItems.length / stockItemsPerPage);
  const paginatedStockItems = stockItems.slice((stockCurrentPage - 1) * stockItemsPerPage, stockCurrentPage * stockItemsPerPage);
  const goToStockPage = (page: number) => setStockCurrentPage(Math.max(1, Math.min(page, totalStockPages)));

  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-4 p-3 md:p-4 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-wrap justify-between items-start gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-600" />
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">LONG ROUTE MANIFEST GRL</h1>
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
            New Manifest
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex border-b bg-white rounded-t-lg">
        <button
          onClick={() => {
            setMainTab("active");
            filterActiveRecords();
          }}
          className={cn(
            "px-6 py-2.5 text-sm font-medium transition-all rounded-t-lg",
            mainTab === "active"
              ? "bg-blue-600 text-white shadow-md"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          )}
        >
          Active Manifests
        </button>
        <button
          onClick={() => {
            setMainTab("stock");
            handleStockSearch();
          }}
          className={cn(
            "px-6 py-2.5 text-sm font-medium transition-all rounded-t-lg",
            mainTab === "stock"
              ? "bg-green-600 text-white shadow-md"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          )}
        >
          Stock of Despatch
        </button>
        <button
          onClick={() => {
            setMainTab("cancelled");
            filterCancelledRecords();
          }}
          className={cn(
            "px-6 py-2.5 text-sm font-medium transition-all rounded-t-lg",
            mainTab === "cancelled"
              ? "bg-red-600 text-white shadow-md"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          )}
        >
          Cancelled Manifests
        </button>
      </div>

      {/* Active Manifests Tab */}
      {mainTab === "active" && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Total Manifests</p>
                    <p className="text-2xl font-bold">{activeStats.total}</p>
                  </div>
                  <Truck className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Total Packages</p>
                    <p className="text-2xl font-bold">{activeStats.totalPckgs}</p>
                  </div>
                  <Package className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Total Weight (kg)</p>
                    <p className="text-2xl font-bold">{activeStats.totalWeight.toLocaleString()}</p>
                  </div>
                  <Weight className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search Filters */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-[11px] font-semibold flex items-center gap-2 text-gray-700">
                <Search className="h-3.5 w-3.5" />
                Search Manifests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">Branch</Label>
                  <Input value={searchBranch} onChange={(e) => setSearchBranch(e.target.value)} placeholder="Enter Branch" className="h-8 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">From Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-8 w-full text-xs">
                        <CalendarIcon className="mr-2 h-3 w-3" />
                        {format(searchFromDate, "dd-MM-yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={searchFromDate} onSelect={(d) => d && setSearchFromDate(d)} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">To Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-8 w-full text-xs">
                        <CalendarIcon className="mr-2 h-3 w-3" />
                        {format(searchToDate, "dd-MM-yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={searchToDate} onSelect={(d) => d && setSearchToDate(d)} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex items-end gap-2">
                  <Button onClick={handleSearch} size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700">
                    <Search className="mr-1 h-3 w-3" /> Search
                  </Button>
                  <Button onClick={handleClearSearch} variant="outline" size="sm" className="h-8 text-xs">
                    <RefreshCw className="mr-1 h-3 w-3" /> Clear
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Table */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="gap-2 w-full">
                  <Table className="text-gray-500" />
                  <h3 className="text-[15px] font-semibold text-gray-800">Manifests List</h3>
                </div>
                <div className="text-[10px] text-gray-500">Total: {searchResults.length} records</div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <div className="min-w-[1000px]">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="text-[11px] font-semibold py-2 px-2 w-12 text-center">#</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Manifest #</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[80px]">Date</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Branch</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">To Station</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Vehicle #</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Driver</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 w-[60px] text-center">Pckgs</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 w-[80px] text-right">Weight</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 w-32 text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedResults.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                            <Truck className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            No manifests found. Click "New Manifest" to create one.
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedResults.map((record, idx) => (
                          <TableRow key={record.id} className="hover:bg-gray-50">
                            <TableCell className="py-2 px-2 text-center text-xs">
                              {(currentPage - 1) * itemsPerPage + idx + 1}
                            </TableCell>
                            <TableCell className="py-2 px-2 font-mono font-semibold text-xs">
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 text-[11px]">
                                {record.manifestNo}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-2 px-2 text-xs">{format(record.manifestDateTime, "dd-MM-yyyy")}</TableCell>
                            <TableCell className="py-2 px-2 text-xs">{record.branch}</TableCell>
                            <TableCell className="py-2 px-2 text-xs">{record.toStation}</TableCell>
                            <TableCell className="py-2 px-2 text-xs">{record.vehicleNo}</TableCell>
                            <TableCell className="py-2 px-2 text-xs">{record.driver}</TableCell>
                            <TableCell className="py-2 px-2 text-center text-xs">{record.dispatchedPckgs}</TableCell>
                            <TableCell className="py-2 px-2 text-right text-xs">{record.dispatchedWt}</TableCell>
                            <TableCell className="py-2 px-2 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit(record)}
                                  className="h-7 w-7 p-0 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                  title="Edit"
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openCancelDialog(record)}
                                  className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  title="Cancel"
                                >
                                  <X className="h-3.5 w-3.5" />
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
                    <Button variant="outline" size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="h-7 text-[10px]">
                      <ChevronLeft className="h-3 w-3 mr-1" /> Previous
                    </Button>
                    <span className="px-3 py-1 text-[10px]">Page {currentPage} of {totalPages}</span>
                    <Button variant="outline" size="sm" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="h-7 text-[10px]">
                      Next <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Stock of Despatch Tab */}
      {mainTab === "stock" && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Total GRs</p>
                    <p className="text-2xl font-bold">{stockStats.total}</p>
                  </div>
                  <FileText className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Selected Items</p>
                    <p className="text-2xl font-bold">{stockStats.selected}</p>
                  </div>
                  <Check className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Total Packages</p>
                    <p className="text-2xl font-bold">{stockStats.totalPckgs}</p>
                  </div>
                  <Package className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search Filters */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-[11px] font-semibold flex items-center gap-2 text-gray-700">
                <Search className="h-3.5 w-3.5" />
                Search Stock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={selectAllBranch} onChange={handleSelectAllBranch} className="h-3.5 w-3.5" id="allBranch" />
                    <Label htmlFor="allBranch" className="text-[10px] cursor-pointer">ALL</Label>
                  </div>
                  <Label className="text-[10px] font-medium">Branch</Label>
                  <Input value={stockBranch} onChange={(e) => setStockBranch(e.target.value)} placeholder="Enter Branch" className="h-8 text-xs" disabled={selectAllBranch} />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">As On Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-8 w-full text-xs">
                        <CalendarIcon className="mr-2 h-3 w-3" />
                        {format(asOnDate, "dd-MM-yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={asOnDate} onSelect={(d) => d && setAsOnDate(d)} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={selectAllDestination} onChange={handleSelectAllDestination} className="h-3.5 w-3.5" id="allDestination" />
                    <Label htmlFor="allDestination" className="text-[10px] cursor-pointer">ALL</Label>
                  </div>
                  <Label className="text-[10px] font-medium">Destination</Label>
                  <Input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Enter Destination" className="h-8 text-xs" disabled={selectAllDestination} />
                </div>
                <div className="flex items-end gap-2">
                  <Button onClick={handleStockSearch} size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700">
                    <Search className="mr-1 h-3 w-3" /> Show Stock
                  </Button>
                  <Button onClick={handleClearStockSearch} variant="outline" size="sm" className="h-8 text-xs">
                    <RefreshCw className="mr-1 h-3 w-3" /> Clear
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stock Table */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Table className="h-3.5 w-3.5 text-gray-500" />
                  <h3 className="text-[11px] font-semibold text-gray-800">Stock Items List</h3>
                </div>
                <div className="text-[10px] text-gray-500">Total: {stockItems.length} records</div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <div className="min-w-[1000px]">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="w-8 text-center">
                          <input type="checkbox" checked={selectAll} onChange={handleSelectAll} className="h-3.5 w-3.5" />
                        </TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 w-12 text-center">#</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[80px]">GR #</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[80px]">GR Date</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[80px]">Origin</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Destination</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[120px]">Consignor</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[120px]">Consignee</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 w-[60px] text-center">Pckgs</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedStockItems.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                            <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            No stock records found
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedStockItems.map((item, idx) => (
                          <TableRow key={item.id} className="hover:bg-gray-50">
                            <TableCell className="text-center">
                              <input
                                type="checkbox"
                                checked={item.selected}
                                onChange={() => handleSelectItem(item.id)}
                                className="h-3.5 w-3.5"
                              />
                            </TableCell>
                            <TableCell className="py-2 px-2 text-center text-xs">
                              {(stockCurrentPage - 1) * stockItemsPerPage + idx + 1}
                            </TableCell>
                            <TableCell className="py-2 px-2 font-mono text-xs">{item.grNo}</TableCell>
                            <TableCell className="py-2 px-2 text-xs">{format(item.grDate, "dd-MM-yyyy")}</TableCell>
                            <TableCell className="py-2 px-2 text-xs">{item.origin}</TableCell>
                            <TableCell className="py-2 px-2 text-xs">{item.destination}</TableCell>
                            <TableCell className="py-2 px-2 text-xs truncate max-w-[150px]">{item.consignor}</TableCell>
                            <TableCell className="py-2 px-2 text-xs truncate max-w-[150px]">{item.consignee}</TableCell>
                            <TableCell className="py-2 px-2 text-center text-xs">{item.stockPckgs}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Pagination for Stock */}
              {totalStockPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-[10px] text-gray-500">
                    Showing {((stockCurrentPage - 1) * stockItemsPerPage) + 1} to {Math.min(stockCurrentPage * stockItemsPerPage, stockItems.length)} of {stockItems.length} entries
                  </div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" onClick={() => goToStockPage(stockCurrentPage - 1)} disabled={stockCurrentPage === 1} className="h-7 text-[10px]">
                      <ChevronLeft className="h-3 w-3 mr-1" /> Previous
                    </Button>
                    <span className="px-3 py-1 text-[10px]">Page {stockCurrentPage} of {totalStockPages}</span>
                    <Button variant="outline" size="sm" onClick={() => goToStockPage(stockCurrentPage + 1)} disabled={stockCurrentPage === totalStockPages} className="h-7 text-[10px]">
                      Next <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Print Button */}
              <div className="flex justify-end mt-4">
                <Button onClick={handlePrintLoadingTally} size="sm" className="h-8 text-xs bg-green-600 hover:bg-green-700">
                  <Printer className="mr-1 h-3 w-3" /> PRINT LOADING TALLY
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Cancelled Manifests Tab */}
      {mainTab === "cancelled" && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Total Cancelled</p>
                    <p className="text-2xl font-bold">{cancelledStats.total}</p>
                  </div>
                  <X className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search Filters for Cancelled */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-[11px] font-semibold flex items-center gap-2 text-gray-700">
                <Search className="h-3.5 w-3.5" />
                Search Cancelled Manifests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">Branch</Label>
                  <Input value={searchBranch} onChange={(e) => setSearchBranch(e.target.value)} placeholder="Enter Branch" className="h-8 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">From Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-8 w-full text-xs">
                        <CalendarIcon className="mr-2 h-3 w-3" />
                        {format(searchFromDate, "dd-MM-yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={searchFromDate} onSelect={(d) => d && setSearchFromDate(d)} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">To Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-8 w-full text-xs">
                        <CalendarIcon className="mr-2 h-3 w-3" />
                        {format(searchToDate, "dd-MM-yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={searchToDate} onSelect={(d) => d && setSearchToDate(d)} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex items-end gap-2">
                  <Button onClick={handleCancelSearch} size="sm" className="h-8 text-xs bg-red-600 hover:bg-red-700">
                    <Search className="mr-1 h-3 w-3" /> Search
                  </Button>
                  <Button onClick={handleClearSearch} variant="outline" size="sm" className="h-8 text-xs">
                    <RefreshCw className="mr-1 h-3 w-3" /> Clear
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cancelled Results Table */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Table className="h-3.5 w-3.5 text-gray-500" />
                  <h3 className="text-[11px] font-semibold text-gray-800">Cancelled Manifests List</h3>
                </div>
                <div className="text-[10px] text-gray-500">Total: {cancelledResults.length} records</div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <div className="min-w-[800px]">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="text-[11px] font-semibold py-2 px-2 w-12 text-center">#</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Manifest #</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[80px]">Date</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Branch</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">To Station</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 w-24 text-center">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedCancelledResults.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                            <X className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            No cancelled manifests found
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedCancelledResults.map((record, idx) => (
                          <TableRow key={record.id} className="hover:bg-gray-50 bg-red-50/30">
                            <TableCell className="py-2 px-2 text-center text-xs">
                              {(cancelledPage - 1) * itemsPerPage + idx + 1}
                            </TableCell>
                            <TableCell className="py-2 px-2 font-mono font-semibold text-xs">
                              <Badge variant="outline" className="bg-red-50 text-red-700 text-[11px]">
                                {record.manifestNo}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-2 px-2 text-xs">{format(record.manifestDateTime, "dd-MM-yyyy")}</TableCell>
                            <TableCell className="py-2 px-2 text-xs">{record.branch}</TableCell>
                            <TableCell className="py-2 px-2 text-xs">{record.toStation}</TableCell>
                            <TableCell className="py-2 px-2 text-center">
                              <Badge className="bg-red-100 text-red-700 text-[10px]">Cancelled</Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Pagination for Cancelled */}
              {totalCancelledPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-[10px] text-gray-500">
                    Showing {((cancelledPage - 1) * itemsPerPage) + 1} to {Math.min(cancelledPage * itemsPerPage, cancelledResults.length)} of {cancelledResults.length} entries
                  </div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" onClick={() => goToCancelledPage(cancelledPage - 1)} disabled={cancelledPage === 1} className="h-7 text-[10px]">
                      <ChevronLeft className="h-3 w-3 mr-1" /> Previous
                    </Button>
                    <span className="px-3 py-1 text-[10px]">Page {cancelledPage} of {totalCancelledPages}</span>
                    <Button variant="outline" size="sm" onClick={() => goToCancelledPage(cancelledPage + 1)} disabled={cancelledPage === totalCancelledPages} className="h-7 text-[10px]">
                      Next <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Cancel Manifest Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <X className="h-5 w-5" />
              Cancel Manifest
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel manifest <strong>{cancellingManifest?.manifestNo}</strong>?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Cancellation Reason <span className="text-red-500">*</span>
              </Label>
              <Select value={cancelledReason} onValueChange={setCancelledReason}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select cancellation reason" />
                </SelectTrigger>
                <SelectContent>
                  {cancelledReasonOptions.map(opt => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
              No, Keep Manifest
            </Button>
            <Button variant="destructive" onClick={handleCancelManifest}>
              Yes, Cancel Manifest
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Entry Sheet */}
      <Sheet open={isEntrySheetOpen} onOpenChange={setIsEntrySheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle className="flex items-center gap-2 text-base">
              {editMode ? (
                <>
                  <Edit className="h-4 w-4 text-blue-600" />
                  Edit Manifest
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 text-blue-600" />
                  New Manifest
                </>
              )}
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Manifest #</Label>
                <div className="flex gap-2">
                  <Input value={manifestNo} onChange={(e) => setManifestNo(e.target.value)} readOnly={autoManifest} className={cn("h-8 text-xs flex-1", autoManifest && "bg-gray-50")} />
                  <div className="flex items-center gap-1">
                    <input type="checkbox" checked={autoManifest} onChange={(e) => setAutoManifest(e.target.checked)} className="h-3.5 w-3.5" id="auto" />
                    <Label htmlFor="auto" className="text-xs">Auto</Label>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Manifest Date & Time <span className="text-red-500">*</span></Label>
                <div className="flex gap-2">
                  <Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 flex-1 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(manifestDateTime, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={manifestDateTime} onSelect={(d) => d && setManifestDateTime(d)} /></PopoverContent></Popover>
                  <Input type="time" value={manifestTime} onChange={(e) => setManifestTime(e.target.value)} className="h-8 w-24 text-xs" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Branch <span className="text-red-500">*</span></Label>
                <Input value={branch} onChange={(e) => setBranch(e.target.value)} placeholder="Enter Branch" className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">To Station <span className="text-red-500">*</span></Label>
                <Input value={toStation} onChange={(e) => setToStation(e.target.value)} placeholder="Enter To Station" className="h-8 text-xs" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Vehicle # <span className="text-red-500">*</span></Label>
                <Input value={vehicleNo} onChange={(e) => setVehicleNo(e.target.value)} placeholder="Enter Vehicle Number" className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Driver <span className="text-red-500">*</span></Label>
                <Input value={driver} onChange={(e) => setDriver(e.target.value)} placeholder="Enter Driver Name" className="h-8 text-xs" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Vehicle Type</Label>
                <Input value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} placeholder="Enter Vehicle Type" className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Vendor</Label>
                <Input value={vendor} onChange={(e) => setVendor(e.target.value)} placeholder="Enter Vendor" className="h-8 text-xs" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Capacity</Label>
                <Input value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="Enter Capacity" className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Mobile #</Label>
                <Input value={mobileNo} onChange={(e) => setMobileNo(e.target.value)} placeholder="Enter Mobile Number" className="h-8 text-xs" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Loaded By <span className="text-red-500">*</span></Label>
                <Input value={loadedBy} onChange={(e) => setLoadedBy(e.target.value)} placeholder="Enter Loaded By" className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Delivery Location</Label>
                <Input value={deliveryLocation} onChange={(e) => setDeliveryLocation(e.target.value)} placeholder="Enter Delivery Location" className="h-8 text-xs" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Estimate Arrival</Label>
                <Input value={estimateArrivalAtDestination} onChange={(e) => setEstimateArrivalAtDestination(e.target.value)} placeholder="Enter Estimate Arrival" className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Consolidated Ewaybill #</Label>
                <Input value={consolidatedEwaybillNo} onChange={(e) => setConsolidatedEwaybillNo(e.target.value)} placeholder="Enter Ewaybill Number" className="h-8 text-xs" />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Remarks</Label>
              <Textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={2} className="text-xs" placeholder="Enter remarks..." />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsEntrySheetOpen(false)} className="h-8 text-xs">
                <X className="mr-1 h-3 w-3" /> Cancel
              </Button>
              <Button onClick={handleSave} size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700">
                <Save className="mr-1 h-3 w-3" />
                {editMode ? "Update" : "Save"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}