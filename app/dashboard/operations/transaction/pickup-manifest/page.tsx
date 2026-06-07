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
  Filter,
  ChevronLeft,
  ChevronRight,
  Plus,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Types
interface PickupManifest {
  id: number;
  branch: string;
  pickupArea: string;
  manifestNo: string;
  pickupDateTime: Date;
  pickupTime: string;
  vehicleNo: string;
  driverName: string;
  driverMobileNo: string;
  vehicleVendor: string;
  loadedBy: string;
  gateInDate: Date;
  gateInTime: string;
  gateOutDate: Date;
  gateOutTime: string;
  vendorCDNo: string;
  vendorCDDate: Date;
  remarks: string;
  toStation: string;
  mode: string;
  modeCategory: string;
  noOfPckgs: number;
  grossWeight: number;
  status: "active" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
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

const pickupAreaOptions = [
  "DELHI NCR",
  "SOUTH DELHI",
  "NORTH DELHI",
  "EAST DELHI",
  "WEST DELHI",
  "NOIDA",
  "GURUGRAM",
  "FARIDABAD",
  "GHAZIABAD",
];

const vehicleNoOptions = [
  "UP14AB1234",
  "UP15CD5678",
  "UP16EF9012",
  "UP17GH3456",
  "UP18IJ7890",
  "DL01AB1234",
  "DL02CD5678",
];

const driverOptions = [
  "Rajesh Kumar",
  "Suresh Singh",
  "Mahesh Sharma",
  "Ramesh Gupta",
  "Satish Verma",
  "Vikash Singh",
];

const vehicleVendorOptions = [
  "TATA MOTORS",
  "ASHOK LEYLAND",
  "MAHINDRA",
  "EICHER",
  "BHARAT BENZ",
  "FORCE MOTORS",
];

const loadedByOptions = [
  "Mohan Singh",
  "Ravi Kumar",
  "Amit Sharma",
  "Pradeep Verma",
  "Sunil Kumar",
];

const cancelledReasonOptions = [
  "Customer Request",
  "Vehicle Issue",
  "Driver Not Available",
  "Route Cancelled",
  "Other",
];

export default function PickupManifest() {
  // Main Tab state
  const [mainTab, setMainTab] = useState<"active" | "cancelled">("active");

  // Sheet state
  const [isEntrySheetOpen, setIsEntrySheetOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<number | null>(null);

  // Cancel Dialog state
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [cancellingManifest, setCancellingManifest] = useState<PickupManifest | null>(null);
  const [cancelledReason, setCancelledReason] = useState<string>("");

  // Form state
  const [autoManifest, setAutoManifest] = useState<boolean>(true);
  const [branch, setBranch] = useState<string>("");
  const [pickupArea, setPickupArea] = useState<string>("");
  const [manifestNo, setManifestNo] = useState<string>("");
  const [pickupDateTime, setPickupDateTime] = useState<Date>(new Date());
  const [pickupTime, setPickupTime] = useState<string>("16:14");
  const [vehicleNo, setVehicleNo] = useState<string>("");
  const [driverName, setDriverName] = useState<string>("");
  const [driverMobileNo, setDriverMobileNo] = useState<string>("");
  const [vehicleVendor, setVehicleVendor] = useState<string>("");
  const [loadedBy, setLoadedBy] = useState<string>("");
  const [gateInDate, setGateInDate] = useState<Date>(new Date());
  const [gateInTime, setGateInTime] = useState<string>("");
  const [gateOutDate, setGateOutDate] = useState<Date>(new Date());
  const [gateOutTime, setGateOutTime] = useState<string>("");
  const [vendorCDNo, setVendorCDNo] = useState<string>("");
  const [vendorCDDate, setVendorCDDate] = useState<Date>(new Date());
  const [remarks, setRemarks] = useState<string>("");

  // Search State
  const [searchBranch, setSearchBranch] = useState<string>("all");
  const [searchFromDate, setSearchFromDate] = useState<Date>(new Date());
  const [searchToDate, setSearchToDate] = useState<Date>(new Date());
  const [searchResults, setSearchResults] = useState<PickupManifest[]>([]);
  const [cancelledResults, setCancelledResults] = useState<PickupManifest[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [cancelledPage, setCancelledPage] = useState<number>(1);
  const itemsPerPage: number = 10;

  // Sample Data
  const sampleData: PickupManifest[] = [
    { id: 1, branch: "DELHI", pickupArea: "DELHI NCR", manifestNo: "PM001", pickupDateTime: new Date("2026-05-28"), pickupTime: "10:30", vehicleNo: "UP14AB1234", driverName: "Rajesh Kumar", driverMobileNo: "9876543210", vehicleVendor: "TATA MOTORS", loadedBy: "Mohan Singh", gateInDate: new Date("2026-05-28"), gateInTime: "09:00", gateOutDate: new Date("2026-05-28"), gateOutTime: "18:00", vendorCDNo: "CD001", vendorCDDate: new Date("2026-05-28"), remarks: "", toStation: "MUMBAI", mode: "DL01LA0837", modeCategory: "SURFACE", noOfPckgs: 50, grossWeight: 2500, status: "active", createdAt: new Date(), updatedAt: new Date() },
    { id: 2, branch: "MUMBAI", pickupArea: "SOUTH DELHI", manifestNo: "PM002", pickupDateTime: new Date("2026-05-29"), pickupTime: "11:30", vehicleNo: "UP15CD5678", driverName: "Suresh Singh", driverMobileNo: "9876543211", vehicleVendor: "ASHOK LEYLAND", loadedBy: "Ravi Kumar", gateInDate: new Date("2026-05-29"), gateInTime: "10:00", gateOutDate: new Date("2026-05-29"), gateOutTime: "19:00", vendorCDNo: "CD002", vendorCDDate: new Date("2026-05-29"), remarks: "", toStation: "BANGALORE", mode: "DL01LAD6175", modeCategory: "SURFACE", noOfPckgs: 75, grossWeight: 3800, status: "active", createdAt: new Date(), updatedAt: new Date() },
    { id: 3, branch: "BANGALORE", pickupArea: "NORTH DELHI", manifestNo: "PM003", pickupDateTime: new Date("2026-05-27"), pickupTime: "09:30", vehicleNo: "UP16EF9012", driverName: "Mahesh Sharma", driverMobileNo: "9876543212", vehicleVendor: "MAHINDRA", loadedBy: "Amit Sharma", gateInDate: new Date("2026-05-27"), gateInTime: "08:00", gateOutDate: new Date("2026-05-27"), gateOutTime: "17:00", vendorCDNo: "CD003", vendorCDDate: new Date("2026-05-27"), remarks: "", toStation: "CHENNAI", mode: "DL01LAJ4226", modeCategory: "SURFACE", noOfPckgs: 30, grossWeight: 1800, status: "cancelled", createdAt: new Date(), updatedAt: new Date() },
    { id: 4, branch: "DELHI", pickupArea: "NOIDA", manifestNo: "PM004", pickupDateTime: new Date("2026-05-30"), pickupTime: "14:00", vehicleNo: "DL01AB1234", driverName: "Ramesh Gupta", driverMobileNo: "9876543213", vehicleVendor: "EICHER", loadedBy: "Pradeep Verma", gateInDate: new Date("2026-05-30"), gateInTime: "13:00", gateOutDate: new Date("2026-05-30"), gateOutTime: "20:00", vendorCDNo: "CD004", vendorCDDate: new Date("2026-05-30"), remarks: "", toStation: "KOLKATA", mode: "DL1AJ8908", modeCategory: "SURFACE", noOfPckgs: 45, grossWeight: 2200, status: "active", createdAt: new Date(), updatedAt: new Date() },
  ];

  const [savedRecords, setSavedRecords] = useState<PickupManifest[]>(sampleData);

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
    return `PM${String(count).padStart(6, "0")}`;
  };

  const resetForm = () => {
    setBranch("");
    setPickupArea("");
    setManifestNo(generateManifestNo());
    setPickupDateTime(new Date());
    setPickupTime("16:14");
    setVehicleNo("");
    setDriverName("");
    setDriverMobileNo("");
    setVehicleVendor("");
    setLoadedBy("");
    setGateInDate(new Date());
    setGateInTime("");
    setGateOutDate(new Date());
    setGateOutTime("");
    setVendorCDNo("");
    setVendorCDDate(new Date());
    setRemarks("");
    setEditMode(false);
    setCurrentEditId(null);
  };

  const handleSave = () => {
    if (!branch) { alert("Please select Branch"); return; }
    if (!vehicleNo) { alert("Please select Vehicle #"); return; }
    if (!driverName) { alert("Please select Driver Name"); return; }

    setLoading(true);
    setTimeout(() => {
      const newRecord: PickupManifest = {
        id: currentEditId || Date.now(),
        branch,
        pickupArea,
        manifestNo,
        pickupDateTime,
        pickupTime,
        vehicleNo,
        driverName,
        driverMobileNo,
        vehicleVendor,
        loadedBy,
        gateInDate,
        gateInTime,
        gateOutDate,
        gateOutTime,
        vendorCDNo,
        vendorCDDate,
        remarks,
        toStation: "",
        mode: "",
        modeCategory: "",
        noOfPckgs: 0,
        grossWeight: 0,
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
    if (searchBranch !== "all") results = results.filter(r => r.branch === searchBranch);
    if (searchFromDate) results = results.filter(r => r.pickupDateTime >= searchFromDate);
    if (searchToDate) results = results.filter(r => r.pickupDateTime <= searchToDate);
    setSearchResults(results);
    setCurrentPage(1);
  };

  const handleCancelSearch = () => {
    let results = savedRecords.filter(r => r.status === "cancelled");
    if (searchBranch !== "all") results = results.filter(r => r.branch === searchBranch);
    if (searchFromDate) results = results.filter(r => r.pickupDateTime >= searchFromDate);
    if (searchToDate) results = results.filter(r => r.pickupDateTime <= searchToDate);
    setCancelledResults(results);
    setCancelledPage(1);
  };

  const handleClearSearch = () => {
    setSearchBranch("all");
    setSearchFromDate(new Date());
    setSearchToDate(new Date());
    filterActiveRecords();
    filterCancelledRecords();
    setCurrentPage(1);
    setCancelledPage(1);
  };

  const handleEdit = (record: PickupManifest) => {
    setEditMode(true);
    setCurrentEditId(record.id);
    setBranch(record.branch);
    setPickupArea(record.pickupArea);
    setManifestNo(record.manifestNo);
    setPickupDateTime(record.pickupDateTime);
    setPickupTime(record.pickupTime);
    setVehicleNo(record.vehicleNo);
    setDriverName(record.driverName);
    setDriverMobileNo(record.driverMobileNo);
    setVehicleVendor(record.vehicleVendor);
    setLoadedBy(record.loadedBy);
    setGateInDate(record.gateInDate);
    setGateInTime(record.gateInTime);
    setGateOutDate(record.gateOutDate);
    setGateOutTime(record.gateOutTime);
    setVendorCDNo(record.vendorCDNo);
    setVendorCDDate(record.vendorCDDate);
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

  const openCancelDialog = (record: PickupManifest) => {
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
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">PICKUP MANIFEST</h1>
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
            New Pickup Manifest
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
                Search Pickup Manifests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
                  <h3 className="text-[15px] font-semibold text-gray-800">Pickup Manifests List</h3>
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
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Pickup Area</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Vehicle #</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[120px]">Driver</TableHead>
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
                            No pickup manifests found. Click "New Pickup Manifest" to create one.
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
                            <TableCell className="py-2 px-2 text-xs">{format(record.pickupDateTime, "dd-MM-yyyy")}</TableCell>
                            <TableCell className="py-2 px-2 text-xs">{record.branch}</TableCell>
                            <TableCell className="py-2 px-2 text-xs">{record.pickupArea}</TableCell>
                            <TableCell className="py-2 px-2 text-xs">{record.vehicleNo}</TableCell>
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
                <div className="gap-2 w-full">
                  <Table className="text-gray-500" />
                  <h3 className="text-[15px] font-semibold text-gray-800">Cancelled Manifests List</h3>
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
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Pickup Area</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 w-24 text-center">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedCancelledResults.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                            <X className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            No cancelled pickup manifests found
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
                            <TableCell className="py-2 px-2 text-xs">{format(record.pickupDateTime, "dd-MM-yyyy")}</TableCell>
                            <TableCell className="py-2 px-2 text-xs">{record.branch}</TableCell>
                            <TableCell className="py-2 px-2 text-xs">{record.pickupArea}</TableCell>
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
              Cancel Pickup Manifest
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
                  Edit Pickup Manifest
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 text-blue-600" />
                  New Pickup Manifest
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
                <Label className="text-xs">Pickup Area</Label>
                <Select value={pickupArea} onValueChange={setPickupArea}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger>
                  <SelectContent>{pickupAreaOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
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
                <Label className="text-xs">Pickup Date/Time</Label>
                <div className="flex gap-2">
                  <Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 flex-1 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(pickupDateTime, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={pickupDateTime} onSelect={(d) => d && setPickupDateTime(d)} /></PopoverContent></Popover>
                  <Input type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className="h-8 w-24 text-xs" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Vehicle # <span className="text-red-500">*</span></Label>
                <Select value={vehicleNo} onValueChange={setVehicleNo}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger>
                  <SelectContent>{vehicleNoOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Driver Name <span className="text-red-500">*</span></Label>
                <Select value={driverName} onValueChange={setDriverName}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger>
                  <SelectContent>{driverOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Driver Mobile #</Label>
                <Input value={driverMobileNo} onChange={(e) => setDriverMobileNo(e.target.value)} placeholder="Enter Mobile Number" className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Vehicle Vendor</Label>
                <Select value={vehicleVendor} onValueChange={setVehicleVendor}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger>
                  <SelectContent>{vehicleVendorOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Loaded By</Label>
                <Select value={loadedBy} onValueChange={setLoadedBy}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger>
                  <SelectContent>{loadedByOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Gate In Date/Time</Label>
                <div className="flex gap-2">
                  <Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 flex-1 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(gateInDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={gateInDate} onSelect={(d) => d && setGateInDate(d)} /></PopoverContent></Popover>
                  <Input type="time" value={gateInTime} onChange={(e) => setGateInTime(e.target.value)} className="h-8 w-24 text-xs" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Gate Out Date/Time</Label>
                <div className="flex gap-2">
                  <Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 flex-1 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(gateOutDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={gateOutDate} onSelect={(d) => d && setGateOutDate(d)} /></PopoverContent></Popover>
                  <Input type="time" value={gateOutTime} onChange={(e) => setGateOutTime(e.target.value)} className="h-8 w-24 text-xs" />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Vendor CD #</Label>
                <Input value={vendorCDNo} onChange={(e) => setVendorCDNo(e.target.value)} placeholder="Enter Vendor CD #" className="h-8 text-xs" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Vendor CD Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-8 w-full text-xs">
                      <CalendarIcon className="mr-1 h-3 w-3" />
                      {format(vendorCDDate, "dd-MM-yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent><Calendar mode="single" selected={vendorCDDate} onSelect={(d) => d && setVendorCDDate(d)} /></PopoverContent>
                </Popover>
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