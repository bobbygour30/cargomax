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
  Filter,
  ChevronLeft,
  ChevronRight,
  Plus,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Types
interface ManifestRecord {
  id: number;
  manifestNo: string;
  date: Date;
  time: string;
  branch: string;
  toStation: string;
  modeName: string;
  driverName: string;
  driverMobile: string;
  vehicleVendor: string;
  loadingPerson: string;
  vendorCDNo: string;
  vendorCDDate: Date;
  remarks: string;
  lhcNo: string;
  modeCategory: string;
  noOfPckgs: number;
  grossWeight: number;
  vehicleNo: string;
  status: "active" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

// Options
const branchOptions = [
  "JAMNA BAZAR",
  "WAZIRPUR",
  "MANGOLPURI",
  "ZAKHIRA",
  "NEW LAJPAT RAI MARKET",
  "CORPORATE OFFICE",
  "DELHI",
  "MUMBAI",
];

const toStationOptions = [
  "U P BORDER A JH UP",
  "U P BORDER D BR GP",
  "U P BORDER B BR",
  "DELHI",
  "MUMBAI",
  "BANGALORE",
];

const modeNameOptions = [
  "DL01LA0837",
  "DL01LAD6175",
  "DL01LAJ4226",
  "DL01LAQ0859",
  "DL1AJ8908",
  "SURFACE",
  "AIR",
  "RAIL",
];

const driverNameOptions = [
  "Rajesh Kumar",
  "Suresh Singh",
  "Mahesh Sharma",
  "Ramesh Gupta",
  "Satish Verma",
];

const vehicleVendorOptions = [
  "TATA MOTORS",
  "ASHOK LEYLAND",
  "MAHINDRA",
  "EICHER",
  "BHARAT BENZ",
];

const loadingPersonOptions = [
  "Mohan Singh",
  "Ravi Kumar",
  "Amit Sharma",
  "Pradeep Verma",
];

const cancelledReasonOptions = [
  "Customer Request",
  "Vehicle Issue",
  "Weather Condition",
  "Route Issue",
  "Other",
];

export default function LocalManifest() {
  // Main Tab state
  const [mainTab, setMainTab] = useState<"active" | "cancelled">("active");
  
  // Sheet state
  const [isEntrySheetOpen, setIsEntrySheetOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<number | null>(null);
  
  // Update Destination Modal state
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedManifest, setSelectedManifest] = useState<ManifestRecord | null>(null);
  const [newDestination, setNewDestination] = useState<string>("");
  const [newVehicleNo, setNewVehicleNo] = useState<string>("");
  const [newDriver1, setNewDriver1] = useState<string>("");
  const [newDriver2, setNewDriver2] = useState<string>("");
  const [newVendor, setNewVendor] = useState<string>("");

  // Cancel Dialog state
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [cancellingManifest, setCancellingManifest] = useState<ManifestRecord | null>(null);
  const [cancelledReason, setCancelledReason] = useState<string>("");

  // Entry Form State
  const [branch, setBranch] = useState<string>("");
  const [toStation, setToStation] = useState<string>("");
  const [manifestNo, setManifestNo] = useState<string>("");
  const [autoManifest, setAutoManifest] = useState<boolean>(true);
  const [despatchDate, setDespatchDate] = useState<Date>(new Date());
  const [despatchTime, setDespatchTime] = useState<string>("13:22");
  const [modeName, setModeName] = useState<string>("");
  const [driverName, setDriverName] = useState<string>("");
  const [driverMobile, setDriverMobile] = useState<string>("");
  const [vehicleVendor, setVehicleVendor] = useState<string>("");
  const [loadingPerson, setLoadingPerson] = useState<string>("");
  const [vendorCDNo, setVendorCDNo] = useState<string>("");
  const [vendorCDDate, setVendorCDDate] = useState<Date>(new Date());
  const [remarks, setRemarks] = useState<string>("");

  // Search State
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());
  const [searchBranch, setSearchBranch] = useState<string>("all");
  const [searchResults, setSearchResults] = useState<ManifestRecord[]>([]);
  const [cancelledResults, setCancelledResults] = useState<ManifestRecord[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [cancelledPage, setCancelledPage] = useState<number>(1);
  const itemsPerPage: number = 10;

  // Sample Data
  const sampleData: ManifestRecord[] = [
    { id: 1, manifestNo: "I110001263", date: new Date("2026-05-28"), time: "10:30", branch: "JAMNA BAZAR", toStation: "U P BORDER A JH UP", modeName: "DL01LA0837", driverName: "Rajesh Kumar", driverMobile: "9876543210", vehicleVendor: "TATA MOTORS", loadingPerson: "Mohan Singh", vendorCDNo: "CD001", vendorCDDate: new Date("2026-05-28"), remarks: "", lhcNo: "", modeCategory: "SURFACE", noOfPckgs: 60, grossWeight: 3090, vehicleNo: "DL01LA0837", status: "active", createdAt: new Date(), updatedAt: new Date() },
    { id: 2, manifestNo: "I123000851", date: new Date("2026-05-29"), time: "10:30", branch: "WAZIRPUR", toStation: "U P BORDER A JH UP", modeName: "DL01LA0837", driverName: "Suresh Singh", driverMobile: "9876543211", vehicleVendor: "ASHOK LEYLAND", loadingPerson: "Ravi Kumar", vendorCDNo: "CD002", vendorCDDate: new Date("2026-05-29"), remarks: "", lhcNo: "", modeCategory: "SURFACE", noOfPckgs: 34, grossWeight: 1175, vehicleNo: "DL01LA0837", status: "active", createdAt: new Date(), updatedAt: new Date() },
    { id: 3, manifestNo: "I118002466", date: new Date("2026-05-27"), time: "10:30", branch: "MANGOLPURI", toStation: "U P BORDER D BR GP", modeName: "DL01LAD6175", driverName: "Mahesh Sharma", driverMobile: "9876543212", vehicleVendor: "MAHINDRA", loadingPerson: "Amit Sharma", vendorCDNo: "CD003", vendorCDDate: new Date("2026-05-27"), remarks: "", lhcNo: "", modeCategory: "SURFACE", noOfPckgs: 148, grossWeight: 4065, vehicleNo: "DL01LAD6175", status: "cancelled", createdAt: new Date(), updatedAt: new Date() },
    { id: 4, manifestNo: "I118002470", date: new Date("2026-05-30"), time: "10:30", branch: "MANGOLPURI", toStation: "U P BORDER A JH UP", modeName: "DL01LAJ4226", driverName: "Ramesh Gupta", driverMobile: "9876543213", vehicleVendor: "EICHER", loadingPerson: "Pradeep Verma", vendorCDNo: "CD004", vendorCDDate: new Date("2026-05-30"), remarks: "", lhcNo: "", modeCategory: "SURFACE", noOfPckgs: 123, grossWeight: 4220, vehicleNo: "DL01LAJ4226", status: "active", createdAt: new Date(), updatedAt: new Date() },
    { id: 5, manifestNo: "I124001896", date: new Date("2026-05-26"), time: "10:30", branch: "ZAKHIRA", toStation: "U P BORDER A JH UP", modeName: "DL01LAJ4226", driverName: "Satish Verma", driverMobile: "9876543214", vehicleVendor: "BHARAT BENZ", loadingPerson: "Mohan Singh", vendorCDNo: "CD005", vendorCDDate: new Date("2026-05-26"), remarks: "", lhcNo: "", modeCategory: "SURFACE", noOfPckgs: 105, grossWeight: 3430, vehicleNo: "DL01LAJ4226", status: "cancelled", createdAt: new Date(), updatedAt: new Date() },
    { id: 6, manifestNo: "I118002469", date: new Date("2026-05-31"), time: "10:30", branch: "MANGOLPURI", toStation: "U P BORDER A JH UP", modeName: "DL01LAQ0859", driverName: "Vikash Singh", driverMobile: "9876543215", vehicleVendor: "TATA MOTORS", loadingPerson: "Ravi Kumar", vendorCDNo: "CD006", vendorCDDate: new Date("2026-05-31"), remarks: "", lhcNo: "", modeCategory: "SURFACE", noOfPckgs: 130, grossWeight: 3600, vehicleNo: "DL01LAQ0859", status: "active", createdAt: new Date(), updatedAt: new Date() },
    { id: 7, manifestNo: "I124001897", date: new Date("2026-05-25"), time: "10:30", branch: "ZAKHIRA", toStation: "U P BORDER A JH UP", modeName: "DL01LAQ0859", driverName: "Rajesh Kumar", driverMobile: "9876543216", vehicleVendor: "ASHOK LEYLAND", loadingPerson: "Amit Sharma", vendorCDNo: "CD007", vendorCDDate: new Date("2026-05-25"), remarks: "", lhcNo: "", modeCategory: "SURFACE", noOfPckgs: 89, grossWeight: 3010, vehicleNo: "DL01LAQ0859", status: "active", createdAt: new Date(), updatedAt: new Date() },
    { id: 8, manifestNo: "I120000765", date: new Date("2026-05-24"), time: "10:30", branch: "NEW LAJPAT RAI MARKET", toStation: "U P BORDER B BR", modeName: "DL1AJ8908", driverName: "Suresh Singh", driverMobile: "9876543217", vehicleVendor: "MAHINDRA", loadingPerson: "Pradeep Verma", vendorCDNo: "CD008", vendorCDDate: new Date("2026-05-24"), remarks: "", lhcNo: "", modeCategory: "SURFACE", noOfPckgs: 13, grossWeight: 700, vehicleNo: "DL1AJ8908", status: "cancelled", createdAt: new Date(), updatedAt: new Date() },
  ];

  const [savedRecords, setSavedRecords] = useState<ManifestRecord[]>(sampleData);

  // Load search results on mount
  useEffect(() => {
    filterActiveRecords();
    filterCancelledRecords();
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
    return `I${String(count).padStart(9, "0")}`;
  };

  const resetForm = () => {
    setBranch("");
    setToStation("");
    setManifestNo(generateManifestNo());
    setDespatchDate(new Date());
    setDespatchTime("13:22");
    setModeName("");
    setDriverName("");
    setDriverMobile("");
    setVehicleVendor("");
    setLoadingPerson("");
    setVendorCDNo("");
    setVendorCDDate(new Date());
    setRemarks("");
    setEditMode(false);
    setCurrentEditId(null);
  };

  const handleSave = () => {
    if (!branch) { alert("Please select Branch"); return; }
    if (!toStation) { alert("Please select To Station"); return; }
    if (!modeName) { alert("Please enter Mode Name"); return; }
    if (!driverName) { alert("Please enter Driver Name"); return; }
    if (!loadingPerson) { alert("Please enter Loading Person"); return; }

    setLoading(true);
    setTimeout(() => {
      const newRecord: ManifestRecord = {
        id: currentEditId || Date.now(),
        manifestNo: manifestNo,
        date: despatchDate,
        time: despatchTime,
        branch,
        toStation,
        modeName,
        driverName,
        driverMobile,
        vehicleVendor,
        loadingPerson,
        vendorCDNo,
        vendorCDDate,
        remarks,
        lhcNo: "",
        modeCategory: "SURFACE",
        noOfPckgs: 0,
        grossWeight: 0,
        vehicleNo: "",
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
    if (fromDate) results = results.filter(r => r.date >= fromDate);
    if (toDate) results = results.filter(r => r.date <= toDate);
    if (searchBranch !== "all") results = results.filter(r => r.branch === searchBranch);
    setSearchResults(results);
    setCurrentPage(1);
  };

  const handleCancelledSearch = () => {
    let results = savedRecords.filter(r => r.status === "cancelled");
    if (fromDate) results = results.filter(r => r.date >= fromDate);
    if (toDate) results = results.filter(r => r.date <= toDate);
    if (searchBranch !== "all") results = results.filter(r => r.branch === searchBranch);
    setCancelledResults(results);
    setCancelledPage(1);
  };

  const handleClearSearch = () => {
    setFromDate(new Date());
    setToDate(new Date());
    setSearchBranch("all");
    filterActiveRecords();
    filterCancelledRecords();
    setCurrentPage(1);
    setCancelledPage(1);
  };

  const handleEdit = (record: ManifestRecord) => {
    setEditMode(true);
    setCurrentEditId(record.id);
    setBranch(record.branch);
    setToStation(record.toStation);
    setManifestNo(record.manifestNo);
    setDespatchDate(record.date);
    setDespatchTime(record.time);
    setModeName(record.modeName);
    setDriverName(record.driverName);
    setDriverMobile(record.driverMobile);
    setVehicleVendor(record.vehicleVendor);
    setLoadingPerson(record.loadingPerson);
    setVendorCDNo(record.vendorCDNo);
    setVendorCDDate(record.vendorCDDate);
    setRemarks(record.remarks);
    setIsEntrySheetOpen(true);
  };

  const handlePrint = (record: ManifestRecord) => {
    alert(`Printing manifest: ${record.manifestNo}`);
  };

  const handleUpdateDestination = (record: ManifestRecord) => {
    setSelectedManifest(record);
    setNewDestination(record.toStation);
    setNewVehicleNo(record.vehicleNo || "");
    setNewDriver1(record.driverName);
    setNewDriver2("");
    setNewVendor(record.vehicleVendor);
    setIsUpdateModalOpen(true);
  };

  const handleSaveUpdateDestination = () => {
    if (!newDestination) { alert("Please enter New Destination"); return; }
    if (selectedManifest) {
      const updatedRecords = savedRecords.map(r => 
        r.id === selectedManifest.id 
          ? { ...r, toStation: newDestination, vehicleNo: newVehicleNo, driverName: newDriver1, vehicleVendor: newVendor, updatedAt: new Date() }
          : r
      );
      setSavedRecords(updatedRecords);
      filterActiveRecords();
      filterCancelledRecords();
      alert(`Manifest ${selectedManifest.manifestNo} updated successfully!`);
    }
    setIsUpdateModalOpen(false);
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

  const openCancelDialog = (record: ManifestRecord) => {
    setCancellingManifest(record);
    setCancelledReason("");
    setIsCancelDialogOpen(true);
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
    totalPckgs: searchResults.reduce((sum, r) => sum + r.noOfPckgs, 0),
    totalWeight: searchResults.reduce((sum, r) => sum + r.grossWeight, 0),
  };

  const cancelledStats = {
    total: cancelledResults.length,
  };

  // Pagination
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);
  const paginatedResults = searchResults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  const totalCancelledPages = Math.ceil(cancelledResults.length / itemsPerPage);
  const paginatedCancelledResults = cancelledResults.slice((cancelledPage - 1) * itemsPerPage, cancelledPage * itemsPerPage);
  const goToCancelledPage = (page: number) => setCancelledPage(Math.max(1, Math.min(page, totalCancelledPages)));

  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-4 p-3 md:p-4 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-wrap justify-between items-start gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-600" />
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">LOCAL MANIFEST</h1>
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
                  <Clock className="h-8 w-8 opacity-80" />
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
                  <Label className="text-[10px] font-medium">From Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-8 w-full text-xs">
                        <CalendarIcon className="mr-2 h-3 w-3" />
                        {format(fromDate, "dd-MM-yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={fromDate} onSelect={(d) => d && setFromDate(d)} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">To Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-8 w-full text-xs">
                        <CalendarIcon className="mr-2 h-3 w-3" />
                        {format(toDate, "dd-MM-yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={toDate} onSelect={(d) => d && setToDate(d)} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">Branch</Label>
                  <Select value={searchBranch} onValueChange={setSearchBranch}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="All Branches" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Branches</SelectItem>
                      {branchOptions.map(opt => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[120px]">To Station</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Driver</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 w-[60px] text-center">Pckgs</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 w-[80px] text-right">Weight</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 w-32 text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedResults.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8 text-gray-500">
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
                            <TableCell className="py-2 px-2 text-xs">{format(record.date, "dd-MM-yyyy")}</TableCell>
                            <TableCell className="py-2 px-2 text-xs">{record.branch}</TableCell>
                            <TableCell className="py-2 px-2 text-xs">{record.toStation}</TableCell>
                            <TableCell className="py-2 px-2 text-xs">{record.driverName}</TableCell>
                            <TableCell className="py-2 px-2 text-center text-xs">{record.noOfPckgs}</TableCell>
                            <TableCell className="py-2 px-2 text-right text-xs">{record.grossWeight}</TableCell>
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
                                  onClick={() => handlePrint(record)}
                                  className="h-7 w-7 p-0 text-green-500 hover:text-green-700 hover:bg-green-50"
                                  title="Print"
                                >
                                  <Printer className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleUpdateDestination(record)}
                                  className="h-7 w-7 p-0 text-purple-500 hover:text-purple-700 hover:bg-purple-50"
                                  title="Update Destination"
                                >
                                  <MapPin className="h-3.5 w-3.5" />
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

      {/* Cancelled Manifests Tab */}
      {mainTab === "cancelled" && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Total Cancelled Manifests</p>
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
                  <Label className="text-[10px] font-medium">From Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-8 w-full text-xs">
                        <CalendarIcon className="mr-2 h-3 w-3" />
                        {format(fromDate, "dd-MM-yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={fromDate} onSelect={(d) => d && setFromDate(d)} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">To Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-8 w-full text-xs">
                        <CalendarIcon className="mr-2 h-3 w-3" />
                        {format(toDate, "dd-MM-yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={toDate} onSelect={(d) => d && setToDate(d)} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">Branch</Label>
                  <Select value={searchBranch} onValueChange={setSearchBranch}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="All Branches" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Branches</SelectItem>
                      {branchOptions.map(opt => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end gap-2">
                  <Button onClick={handleCancelledSearch} size="sm" className="h-8 text-xs bg-red-600 hover:bg-red-700">
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
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[120px]">To Station</TableHead>
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
                            <TableCell className="py-2 px-2 text-xs">{format(record.date, "dd-MM-yyyy")}</TableCell>
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

      {/* Update Destination Modal */}
      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Update Destination - Manifest #: {selectedManifest?.manifestNo}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 py-3">
            <div className="space-y-1">
              <Label className="text-xs">Current Destination</Label>
              <Input value={selectedManifest?.toStation || ""} readOnly className="h-8 text-xs bg-gray-50" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">New Destination <span className="text-red-500">*</span></Label>
              <Input value={newDestination} onChange={(e) => setNewDestination(e.target.value)} placeholder="Enter New Destination" className="h-8 text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Current Vehicle #</Label>
              <Input value={selectedManifest?.vehicleNo || "-"} readOnly className="h-8 text-xs bg-gray-50" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">New Vehicle #</Label>
              <Input value={newVehicleNo} onChange={(e) => setNewVehicleNo(e.target.value)} placeholder="Enter New Vehicle #" className="h-8 text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Current Driver</Label>
              <Input value={selectedManifest?.driverName || ""} readOnly className="h-8 text-xs bg-gray-50" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">New Driver</Label>
              <Input value={newDriver1} onChange={(e) => setNewDriver1(e.target.value)} placeholder="Enter New Driver" className="h-8 text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Current Vendor</Label>
              <Input value={selectedManifest?.vehicleVendor || ""} readOnly className="h-8 text-xs bg-gray-50" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">New Vendor</Label>
              <Input value={newVendor} onChange={(e) => setNewVendor(e.target.value)} placeholder="Enter New Vendor" className="h-8 text-xs" />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsUpdateModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveUpdateDestination} size="sm" className="bg-green-600 hover:bg-green-700">Save Changes</Button>
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
                <Label className="text-xs">Branch <span className="text-red-500">*</span></Label>
                <Select value={branch} onValueChange={setBranch}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger>
                  <SelectContent>{branchOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">To Station <span className="text-red-500">*</span></Label>
                <Select value={toStation} onValueChange={setToStation}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger>
                  <SelectContent>{toStationOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
                </Select>
              </div>
            </div>

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
                <Label className="text-xs">Despatch Date/Time</Label>
                <div className="flex gap-2">
                  <Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 flex-1 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(despatchDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={despatchDate} onSelect={(d) => d && setDespatchDate(d)} /></PopoverContent></Popover>
                  <Input type="time" value={despatchTime} onChange={(e) => setDespatchTime(e.target.value)} className="h-8 w-24 text-xs" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Mode Name <span className="text-red-500">*</span></Label>
                <Input value={modeName} onChange={(e) => setModeName(e.target.value)} placeholder="Enter Mode Name" className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Driver Name <span className="text-red-500">*</span></Label>
                <Input value={driverName} onChange={(e) => setDriverName(e.target.value)} placeholder="Enter Driver Name" className="h-8 text-xs" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Driver Mobile</Label>
                <Input value={driverMobile} onChange={(e) => setDriverMobile(e.target.value)} placeholder="Enter Mobile Number" className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Vehicle Vendor</Label>
                <Input value={vehicleVendor} onChange={(e) => setVehicleVendor(e.target.value)} placeholder="Enter Vehicle Vendor" className="h-8 text-xs" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Loading Person <span className="text-red-500">*</span></Label>
                <Input value={loadingPerson} onChange={(e) => setLoadingPerson(e.target.value)} placeholder="Enter Loading Person" className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Vendor CD #</Label>
                <Input value={vendorCDNo} onChange={(e) => setVendorCDNo(e.target.value)} placeholder="Enter Vendor CD #" className="h-8 text-xs" />
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

// Missing import
import { Package } from "lucide-react";