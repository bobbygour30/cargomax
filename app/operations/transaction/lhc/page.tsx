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
  Calculator,
  AlertCircle,
  Filter,
  ChevronLeft,
  ChevronRight,
  Plus,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Types
interface LorryChallanItem {
  id: number;
  challanNo: string;
  challanDate: Date;
  from: string;
  to: string;
  pckgs: number;
  actualWeight: number;
  chargeableWeight: number;
  ftl: string;
  perKgPckgs: string;
  rate: number;
  calcAmount: number;
  amount: number;
  remarks: string;
}

interface LorryHireChallan {
  id: number;
  branchName: string;
  despatchType: string;
  lhcNo: string;
  date: Date;
  modeType: string;
  modeName: string;
  owner: string;
  vendor: string;
  vehicleType: string;
  broker: string;
  route: string;
  pan: string;
  emptyLorryWeight: number;
  dharamKantaWeight: number;
  remarks: string;
  hireFreight: number;
  items: LorryChallanItem[];
  status: "active" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

interface PendingManifest {
  id: number;
  manifestNo: string;
  manifestDate: Date;
  modeName: string;
  destination: string;
  driverName: string;
  driverTelNo: string;
  noOfGR: number;
  noOfPckgs: number;
  actualWeight: number;
  chargeWeight: number;
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

const despatchTypeOptions = ["Outstation Challan", "Local Challan", "Intercity"];
const modeTypeOptions = ["Surface", "Air", "Rail", "Sea"];
const modeNameOptions = ["DL01LA0837", "DL01LAD6175", "DL01LAJ4226", "DL01LAQ0859", "SURFACE"];
const ownerOptions = ["Rajesh Kumar", "Suresh Singh", "Mahesh Sharma"];
const vendorOptions = ["TATA MOTORS", "ASHOK LEYLAND", "MAHINDRA", "EICHER"];
const vehicleTypeOptions = ["MARKET", "OWN", "CONTRACT", "HIRE"];
const brokerOptions = ["Mohan Broker", "Ravi Broker", "Amit Broker"];
const routeOptions = ["DELHI-MUMBAI", "MUMBAI-BANGALORE", "DELHI-CHENNAI", "DELHI-KOLKATA"];
const ftlOptions = ["Yes", "No"];
const perKgPckgsOptions = ["Per Kg", "Per Pckgs", "Per Ton"];
const cancelledReasonOptions = [
  "Customer Request", "Vehicle Issue", "Payment Issue", "Route Cancelled", "Other"
];

// Sample Pending Manifests
const samplePendingManifests: PendingManifest[] = [
  { id: 1, manifestNo: "M001", manifestDate: new Date(), modeName: "DL01LA0837", destination: "MUMBAI", driverName: "Rajesh Kumar", driverTelNo: "9876543210", noOfGR: 5, noOfPckgs: 50, actualWeight: 2500, chargeWeight: 2600, selected: false },
  { id: 2, manifestNo: "M002", manifestDate: new Date(), modeName: "DL01LAD6175", destination: "BANGALORE", driverName: "Suresh Singh", driverTelNo: "9876543211", noOfGR: 8, noOfPckgs: 75, actualWeight: 3800, chargeWeight: 4000, selected: false },
  { id: 3, manifestNo: "M003", manifestDate: new Date(), modeName: "DL01LAJ4226", destination: "CHENNAI", driverName: "Mahesh Sharma", driverTelNo: "9876543212", noOfGR: 3, noOfPckgs: 30, actualWeight: 1500, chargeWeight: 1600, selected: false },
];

export default function LorryHireChallan() {
  // Main Tab state
  const [mainTab, setMainTab] = useState<"active" | "pending" | "cancelled">("active");
  
  // Sheet state
  const [isEntrySheetOpen, setIsEntrySheetOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<number | null>(null);
  
  // Cancel Dialog state
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [cancellingLHC, setCancellingLHC] = useState<LorryHireChallan | null>(null);
  const [cancelledReason, setCancelledReason] = useState<string>("");

  // Form state
  const [autoLHC, setAutoLHC] = useState<boolean>(true);
  const [branchName, setBranchName] = useState<string>("");
  const [despatchType, setDespatchType] = useState<string>("");
  const [lhcNo, setLhcNo] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [modeType, setModeType] = useState<string>("");
  const [modeName, setModeName] = useState<string>("");
  const [owner, setOwner] = useState<string>("");
  const [vendor, setVendor] = useState<string>("");
  const [vehicleType, setVehicleType] = useState<string>("");
  const [broker, setBroker] = useState<string>("");
  const [route, setRoute] = useState<string>("");
  const [pan, setPan] = useState<string>("");
  const [emptyLorryWeight, setEmptyLorryWeight] = useState<number>(0);
  const [dharamKantaWeight, setDharamKantaWeight] = useState<number>(0);
  const [remarks, setRemarks] = useState<string>("");
  const [hireFreight, setHireFreight] = useState<number>(0);
  const [items, setItems] = useState<LorryChallanItem[]>([
    { id: 1, challanNo: "", challanDate: new Date(), from: "", to: "", pckgs: 0, actualWeight: 0, chargeableWeight: 0, ftl: "", perKgPckgs: "", rate: 0, calcAmount: 0, amount: 0, remarks: "" }
  ]);

  // Pending Manifest State
  const [pendingBranch, setPendingBranch] = useState<string>("");
  const [pendingToDate, setPendingToDate] = useState<Date>(new Date());
  const [pendingModeType, setPendingModeType] = useState<string>("Surface");
  const [pendingDespatchType, setPendingDespatchType] = useState<string>("Outstation Challan");
  const [pendingManifestFor, setPendingManifestFor] = useState<number>(90);
  const [pendingManifests, setPendingManifests] = useState<PendingManifest[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [pendingCurrentPage, setPendingCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 10;

  // Search State
  const [searchFromDate, setSearchFromDate] = useState<Date>(new Date());
  const [searchToDate, setSearchToDate] = useState<Date>(new Date());
  const [searchBranch, setSearchBranch] = useState<string>("all");
  const [searchResults, setSearchResults] = useState<LorryHireChallan[]>([]);
  const [cancelledResults, setCancelledResults] = useState<LorryHireChallan[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [cancelledPage, setCancelledPage] = useState<number>(1);

  // Sample Data
  const sampleData: LorryHireChallan[] = [
    { id: 1, branchName: "DELHI", despatchType: "Outstation Challan", lhcNo: "LHC001", date: new Date("2026-05-28"), modeType: "Surface", modeName: "DL01LA0837", owner: "Rajesh Kumar", vendor: "TATA MOTORS", vehicleType: "MARKET", broker: "Mohan Broker", route: "DELHI-MUMBAI", pan: "ABCDE1234F", emptyLorryWeight: 5000, dharamKantaWeight: 5200, remarks: "", hireFreight: 15000, items: [], status: "active", createdAt: new Date(), updatedAt: new Date() },
    { id: 2, branchName: "MUMBAI", despatchType: "Local Challan", lhcNo: "LHC002", date: new Date("2026-05-29"), modeType: "Surface", modeName: "DL01LAD6175", owner: "Suresh Singh", vendor: "ASHOK LEYLAND", vehicleType: "OWN", broker: "Ravi Broker", route: "MUMBAI-BANGALORE", pan: "FGHIJ5678K", emptyLorryWeight: 6000, dharamKantaWeight: 6300, remarks: "", hireFreight: 18000, items: [], status: "cancelled", createdAt: new Date(), updatedAt: new Date() },
    { id: 3, branchName: "BANGALORE", despatchType: "Intercity", lhcNo: "LHC003", date: new Date("2026-05-30"), modeType: "Surface", modeName: "DL01LAJ4226", owner: "Mahesh Sharma", vendor: "MAHINDRA", vehicleType: "CONTRACT", broker: "Amit Broker", route: "DELHI-CHENNAI", pan: "KLMNO9012P", emptyLorryWeight: 5500, dharamKantaWeight: 5800, remarks: "", hireFreight: 16500, items: [], status: "active", createdAt: new Date(), updatedAt: new Date() },
  ];

  const [savedRecords, setSavedRecords] = useState<LorryHireChallan[]>(sampleData);

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

  const generateLHCNo = (): string => {
    const count = savedRecords.filter(r => r.status === "active").length + 1;
    return `LHC${String(count).padStart(6, "0")}`;
  };

  const calculateAmount = (rate: number, chargeableWeight: number, perKgPckgs: string): number => {
    if (perKgPckgs === "Per Kg") return rate * chargeableWeight;
    if (perKgPckgs === "Per Ton") return rate * (chargeableWeight / 1000);
    return rate;
  };

  const updateItem = (id: number, field: keyof LorryChallanItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === "rate" || field === "chargeableWeight" || field === "perKgPckgs") {
          updated.calcAmount = calculateAmount(
            field === "rate" ? value : item.rate,
            field === "chargeableWeight" ? value : item.chargeableWeight,
            field === "perKgPckgs" ? value : item.perKgPckgs
          );
        }
        return updated;
      }
      return item;
    }));
  };

  const addItemRow = () => {
    const newItem: LorryChallanItem = {
      id: Date.now(),
      challanNo: "",
      challanDate: new Date(),
      from: "",
      to: "",
      pckgs: 0,
      actualWeight: 0,
      chargeableWeight: 0,
      ftl: "",
      perKgPckgs: "",
      rate: 0,
      calcAmount: 0,
      amount: 0,
      remarks: "",
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateHireFreight = () => {
    const total = items.reduce((sum, item) => sum + (item.amount || item.calcAmount), 0);
    setHireFreight(total);
  };

  const resetForm = () => {
    setBranchName("");
    setDespatchType("");
    setLhcNo(generateLHCNo());
    setDate(new Date());
    setModeType("");
    setModeName("");
    setOwner("");
    setVendor("");
    setVehicleType("");
    setBroker("");
    setRoute("");
    setPan("");
    setEmptyLorryWeight(0);
    setDharamKantaWeight(0);
    setRemarks("");
    setHireFreight(0);
    setItems([{ id: 1, challanNo: "", challanDate: new Date(), from: "", to: "", pckgs: 0, actualWeight: 0, chargeableWeight: 0, ftl: "", perKgPckgs: "", rate: 0, calcAmount: 0, amount: 0, remarks: "" }]);
    setEditMode(false);
    setCurrentEditId(null);
  };

  const handleSave = () => {
    if (!branchName) { alert("Please select Branch Name"); return; }
    if (!date) { alert("Please select Date"); return; }

    setLoading(true);
    setTimeout(() => {
      updateHireFreight();
      const newRecord: LorryHireChallan = {
        id: currentEditId || Date.now(),
        branchName,
        despatchType,
        lhcNo,
        date,
        modeType,
        modeName,
        owner,
        vendor,
        vehicleType,
        broker,
        route,
        pan,
        emptyLorryWeight,
        dharamKantaWeight,
        remarks,
        hireFreight,
        items,
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
    if (searchFromDate) results = results.filter(r => r.date >= searchFromDate);
    if (searchToDate) results = results.filter(r => r.date <= searchToDate);
    if (searchBranch !== "all") results = results.filter(r => r.branchName === searchBranch);
    setSearchResults(results);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchFromDate(new Date());
    setSearchToDate(new Date());
    setSearchBranch("all");
    filterActiveRecords();
    filterCancelledRecords();
    setCurrentPage(1);
    setCancelledPage(1);
  };

  const handlePendingSearch = () => {
    setPendingManifests(samplePendingManifests);
    setSelectAll(false);
    setPendingCurrentPage(1);
  };

  const handleClearPendingSearch = () => {
    setPendingBranch("");
    setPendingToDate(new Date());
    setPendingModeType("Surface");
    setPendingDespatchType("Outstation Challan");
    setPendingManifestFor(90);
    setPendingManifests([]);
    setSelectAll(false);
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setPendingManifests(pendingManifests.map(item => ({ ...item, selected: !selectAll })));
  };

  const handleSelectItem = (id: number) => {
    setPendingManifests(pendingManifests.map(item => 
      item.id === id ? { ...item, selected: !item.selected } : item
    ));
  };

  const handleCancelSearch = () => {
    let results = savedRecords.filter(r => r.status === "cancelled");
    if (searchFromDate) results = results.filter(r => r.date >= searchFromDate);
    if (searchToDate) results = results.filter(r => r.date <= searchToDate);
    if (searchBranch !== "all") results = results.filter(r => r.branchName === searchBranch);
    setCancelledResults(results);
    setCancelledPage(1);
  };

  const handleEdit = (record: LorryHireChallan) => {
    setEditMode(true);
    setCurrentEditId(record.id);
    setBranchName(record.branchName);
    setDespatchType(record.despatchType);
    setLhcNo(record.lhcNo);
    setDate(record.date);
    setModeType(record.modeType);
    setModeName(record.modeName);
    setOwner(record.owner);
    setVendor(record.vendor);
    setVehicleType(record.vehicleType);
    setBroker(record.broker);
    setRoute(record.route);
    setPan(record.pan);
    setEmptyLorryWeight(record.emptyLorryWeight);
    setDharamKantaWeight(record.dharamKantaWeight);
    setRemarks(record.remarks);
    setHireFreight(record.hireFreight);
    setItems(record.items.length ? record.items : [{ id: 1, challanNo: "", challanDate: new Date(), from: "", to: "", pckgs: 0, actualWeight: 0, chargeableWeight: 0, ftl: "", perKgPckgs: "", rate: 0, calcAmount: 0, amount: 0, remarks: "" }]);
    setIsEntrySheetOpen(true);
  };

  const handleCancelLHC = () => {
    if (!cancelledReason) { alert("Please select cancellation reason"); return; }
    if (cancellingLHC) {
      const updatedRecords = savedRecords.map(r => 
        r.id === cancellingLHC.id ? { ...r, status: "cancelled" as const, updatedAt: new Date() } : r
      );
      setSavedRecords(updatedRecords);
      filterActiveRecords();
      filterCancelledRecords();
      alert(`LHC ${cancellingLHC.lhcNo} cancelled successfully!`);
    }
    setIsCancelDialogOpen(false);
    setCancellingLHC(null);
    setCancelledReason("");
  };

  const openCancelDialog = (record: LorryHireChallan) => {
    setCancellingLHC(record);
    setCancelledReason("");
    setIsCancelDialogOpen(true);
  };

  const openAddSheet = () => {
    resetForm();
    setEditMode(false);
    setCurrentEditId(null);
    setLhcNo(generateLHCNo());
    setIsEntrySheetOpen(true);
  };

  // Stats
  const activeStats = {
    total: searchResults.length,
    totalFreight: searchResults.reduce((sum, r) => sum + r.hireFreight, 0),
  };

  const pendingStats = {
    total: pendingManifests.length,
    selected: pendingManifests.filter(i => i.selected).length,
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

  const totalPendingPages = Math.ceil(pendingManifests.length / itemsPerPage);
  const paginatedPending = pendingManifests.slice((pendingCurrentPage - 1) * itemsPerPage, pendingCurrentPage * itemsPerPage);
  const goToPendingPage = (page: number) => setPendingCurrentPage(Math.max(1, Math.min(page, totalPendingPages)));

  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-4 p-3 md:p-4 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-wrap justify-between items-start gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-600" />
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">LORRY HIRE CHALLAN</h1>
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
            New LHC
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
          Active LHC
        </button>
        <button
          onClick={() => {
            setMainTab("pending");
            handlePendingSearch();
          }}
          className={cn(
            "px-6 py-2.5 text-sm font-medium transition-all rounded-t-lg",
            mainTab === "pending"
              ? "bg-yellow-600 text-white shadow-md"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          )}
        >
          Pending Manifest
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
          Cancelled LHC
        </button>
      </div>

      {/* Active LHC Tab */}
      {mainTab === "active" && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Total Active LHC</p>
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
                    <p className="text-sm opacity-90">Total Hire Freight</p>
                    <p className="text-2xl font-bold">₹{activeStats.totalFreight.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search Filters */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-[11px] font-semibold flex items-center gap-2 text-gray-700">
                <Search className="h-3.5 w-3.5" />
                Search LHC
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
                <div className="flex items-center gap-2">
                  <Table className="h-3.5 w-3.5 text-gray-500" />
                  <h3 className="text-[11px] font-semibold text-gray-800">LHC List</h3>
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
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">LHC #</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[80px]">Date</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Branch</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Route</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Vehicle Type</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 w-[80px] text-right">Hire Freight</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 w-32 text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedResults.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                            <Truck className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            No LHC records found. Click "New LHC" to create one.
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
                                {record.lhcNo}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-2 px-2 text-xs">{format(record.date, "dd-MM-yyyy")}</TableCell>
                            <TableCell className="py-2 px-2 text-xs">{record.branchName}</TableCell>
                            <TableCell className="py-2 px-2 text-xs">{record.route}</TableCell>
                            <TableCell className="py-2 px-2 text-xs">{record.vehicleType}</TableCell>
                            <TableCell className="py-2 px-2 text-right text-xs">₹{record.hireFreight.toLocaleString()}</TableCell>
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

      {/* Pending Manifest Tab */}
      {mainTab === "pending" && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Total Pending</p>
                    <p className="text-2xl font-bold">{pendingStats.total}</p>
                  </div>
                  <Clock className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Selected Items</p>
                    <p className="text-2xl font-bold">{pendingStats.selected}</p>
                  </div>
                  <Check className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search Filters */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-[11px] font-semibold flex items-center gap-2 text-gray-700">
                <Search className="h-3.5 w-3.5" />
                Search Pending Manifests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">Branch</Label>
                  <Select value={pendingBranch} onValueChange={setPendingBranch}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="SELECT" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="select">Select</SelectItem>
                      {branchOptions.map(opt => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">To Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-8 w-full text-xs">
                        <CalendarIcon className="mr-2 h-3 w-3" />
                        {format(pendingToDate, "dd-MM-yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={pendingToDate} onSelect={(d) => d && setPendingToDate(d)} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">Mode Type</Label>
                  <Select value={pendingModeType} onValueChange={setPendingModeType}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>{modeTypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">Despatch Type</Label>
                  <Select value={pendingDespatchType} onValueChange={setPendingDespatchType}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>{despatchTypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">Manifest For (Days)</Label>
                  <Input type="number" value={pendingManifestFor} onChange={(e) => setPendingManifestFor(Number(e.target.value))} className="h-8 text-xs" />
                </div>
                <div className="flex items-end gap-2">
                  <Button onClick={handlePendingSearch} size="sm" className="h-8 text-xs bg-yellow-600 hover:bg-yellow-700">
                    <Search className="mr-1 h-3 w-3" /> Show
                  </Button>
                  <Button onClick={handleClearPendingSearch} variant="outline" size="sm" className="h-8 text-xs">
                    <RefreshCw className="mr-1 h-3 w-3" /> Clear
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Manifests Table */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="gap-2 w-full">
                              <Table className="text-gray-500" />
                              <h3 className="text-[15px] font-semibold text-gray-800">Pending Manifests List</h3>
                </div>
                <div className="text-[10px] text-gray-500">Total: {pendingManifests.length} records</div>
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
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Manifest #</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[80px]">Date</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Mode Name</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Destination</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[120px]">Driver Name</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[80px]">Pckgs</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 text-right w-[80px]">Weight</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedPending.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                            <Clock className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            No pending manifests found
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedPending.map((item, idx) => (
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
                              {(pendingCurrentPage - 1) * itemsPerPage + idx + 1}
                            </TableCell>
                            <TableCell className="py-2 px-2 font-mono text-xs">{item.manifestNo}</TableCell>
                            <TableCell className="py-2 px-2 text-xs">{format(item.manifestDate, "dd-MM-yyyy")}</TableCell>
                            <TableCell className="py-2 px-2 text-xs">{item.modeName}</TableCell>
                            <TableCell className="py-2 px-2 text-xs">{item.destination}</TableCell>
                            <TableCell className="py-2 px-2 text-xs">{item.driverName}</TableCell>
                            <TableCell className="py-2 px-2 text-center text-xs">{item.noOfPckgs}</TableCell>
                            <TableCell className="py-2 px-2 text-right text-xs">{item.chargeWeight}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Pagination for Pending */}
              {totalPendingPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-[10px] text-gray-500">
                    Showing {((pendingCurrentPage - 1) * itemsPerPage) + 1} to {Math.min(pendingCurrentPage * itemsPerPage, pendingManifests.length)} of {pendingManifests.length} entries
                  </div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" onClick={() => goToPendingPage(pendingCurrentPage - 1)} disabled={pendingCurrentPage === 1} className="h-7 text-[10px]">
                      <ChevronLeft className="h-3 w-3 mr-1" /> Previous
                    </Button>
                    <span className="px-3 py-1 text-[10px]">Page {pendingCurrentPage} of {totalPendingPages}</span>
                    <Button variant="outline" size="sm" onClick={() => goToPendingPage(pendingCurrentPage + 1)} disabled={pendingCurrentPage === totalPendingPages} className="h-7 text-[10px]">
                      Next <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Cancelled LHC Tab */}
      {mainTab === "cancelled" && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Total Cancelled LHC</p>
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
                Search Cancelled LHC
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
                              <h3 className="text-[15px] font-semibold text-gray-800">Cancelled LHC List</h3>
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
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">LHC #</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[80px]">Date</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Branch</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Route</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 w-24 text-center">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedCancelledResults.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                            <X className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            No cancelled LHC records found
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
                                {record.lhcNo}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-2 px-2 text-xs">{format(record.date, "dd-MM-yyyy")}</TableCell>
                            <TableCell className="py-2 px-2 text-xs">{record.branchName}</TableCell>
                            <TableCell className="py-2 px-2 text-xs">{record.route}</TableCell>
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

      {/* Cancel LHC Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <X className="h-5 w-5" />
              Cancel Lorry Hire Challan
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel LHC <strong>{cancellingLHC?.lhcNo}</strong>?
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
              No, Keep LHC
            </Button>
            <Button variant="destructive" onClick={handleCancelLHC}>
              Yes, Cancel LHC
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
                  Edit LHC
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 text-blue-600" />
                  New Lorry Hire Challan
                </>
              )}
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Branch Name <span className="text-red-500">*</span></Label>
                <Select value={branchName} onValueChange={setBranchName}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger>
                  <SelectContent>{branchOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Despatch Type</Label>
                <Select value={despatchType} onValueChange={setDespatchType}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger>
                  <SelectContent>{despatchTypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">LHC #</Label>
                <div className="flex gap-2">
                  <Input value={lhcNo} onChange={(e) => setLhcNo(e.target.value)} readOnly={autoLHC} className={cn("h-8 text-xs flex-1", autoLHC && "bg-gray-50")} />
                  <div className="flex items-center gap-1">
                    <input type="checkbox" checked={autoLHC} onChange={(e) => setAutoLHC(e.target.checked)} className="h-3.5 w-3.5" id="auto" />
                    <Label htmlFor="auto" className="text-xs">Auto</Label>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Date <span className="text-red-500">*</span></Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-8 w-full text-xs">
                      <CalendarIcon className="mr-1 h-3 w-3" />
                      {format(date, "dd-MM-yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent><Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} /></PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Mode Type</Label>
                <Select value={modeType} onValueChange={setModeType}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger>
                  <SelectContent>{modeTypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Mode Name</Label>
                <Select value={modeName} onValueChange={setModeName}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger>
                  <SelectContent>{modeNameOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Owner</Label>
                <Select value={owner} onValueChange={setOwner}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger>
                  <SelectContent>{ownerOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Vendor</Label>
                <Select value={vendor} onValueChange={setVendor}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger>
                  <SelectContent>{vendorOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Vehicle Type</Label>
                <Select value={vehicleType} onValueChange={setVehicleType}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger>
                  <SelectContent>{vehicleTypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Broker</Label>
                <Select value={broker} onValueChange={setBroker}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger>
                  <SelectContent>{brokerOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Route</Label>
                <Select value={route} onValueChange={setRoute}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger>
                  <SelectContent>{routeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">PAN</Label>
                <Input value={pan} onChange={(e) => setPan(e.target.value)} placeholder="Enter PAN" className="h-8 text-xs uppercase" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Empty Lorry Weight</Label>
                <Input type="number" value={emptyLorryWeight} onChange={(e) => setEmptyLorryWeight(Number(e.target.value))} className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Dharam Kanta Weight</Label>
                <Input type="number" value={dharamKantaWeight} onChange={(e) => setDharamKantaWeight(Number(e.target.value))} className="h-8 text-xs" />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Remarks</Label>
              <Textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={2} className="text-xs" placeholder="Enter remarks..." />
            </div>

            {/* Items Table */}
            <div className="rounded-md border">
              <div className="bg-gray-50 px-3 py-2 border-b flex justify-between items-center">
                <h3 className="text-sm font-semibold">Challan Details</h3>
                <Button onClick={addItemRow} variant="ghost" size="sm" className="h-7 text-xs">
                  <PlusCircle className="mr-1 h-3 w-3" /> Add Row
                </Button>
              </div>
              <div className="overflow-x-auto">
                <div className="min-w-[1200px]">
                  <Table className="text-[10px]">
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="w-12">#</TableHead>
                        <TableHead>Challan#</TableHead>
                        <TableHead>Challan Date</TableHead>
                        <TableHead>From</TableHead>
                        <TableHead>To</TableHead>
                        <TableHead>Pckgs</TableHead>
                        <TableHead>Chargeable Wt</TableHead>
                        <TableHead>Rate</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="w-8">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item, idx) => (
                        <TableRow key={item.id}>
                          <TableCell className="text-xs">{idx+1}</TableCell>
                          <TableCell><Input value={item.challanNo} onChange={(e) => updateItem(item.id, "challanNo", e.target.value)} className="h-7 w-28 text-xs" /></TableCell>
                          <TableCell><Popover><PopoverTrigger asChild><Button variant="outline" className="h-7 w-28 text-xs"><CalendarIcon className="mr-1 h-2 w-2" />{format(item.challanDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={item.challanDate} onSelect={(d) => d && updateItem(item.id, "challanDate", d)} /></PopoverContent></Popover></TableCell>
                          <TableCell><Input value={item.from} onChange={(e) => updateItem(item.id, "from", e.target.value)} className="h-7 w-24 text-xs" /></TableCell>
                          <TableCell><Input value={item.to} onChange={(e) => updateItem(item.id, "to", e.target.value)} className="h-7 w-24 text-xs" /></TableCell>
                          <TableCell><Input type="number" value={item.pckgs} onChange={(e) => updateItem(item.id, "pckgs", Number(e.target.value))} className="h-7 w-20 text-xs" /></TableCell>
                          <TableCell><Input type="number" value={item.chargeableWeight} onChange={(e) => updateItem(item.id, "chargeableWeight", Number(e.target.value))} className="h-7 w-24 text-xs" step="0.01" /></TableCell>
                          <TableCell><Input type="number" value={item.rate} onChange={(e) => updateItem(item.id, "rate", Number(e.target.value))} className="h-7 w-20 text-xs" /></TableCell>
                          <TableCell className="font-mono">₹{item.calcAmount.toFixed(2)}</TableCell>
                          <TableCell><Button variant="ghost" size="sm" onClick={() => removeItem(item.id)} className="h-6 w-6 p-0 text-red-500"><Trash2 className="h-3 w-3" /></Button></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            {/* Hire Freight */}
            <div className="flex justify-end items-center gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Hire Freight</Label>
                <Input type="number" value={hireFreight} onChange={(e) => setHireFreight(Number(e.target.value))} className="h-8 w-48 text-xs text-right font-bold" />
              </div>
              <Button onClick={updateHireFreight} variant="outline" size="sm" className="h-8 text-xs">
                <Calculator className="mr-1 h-3 w-3" /> Recalculate
              </Button>
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

// Missing imports
import { DollarSign } from "lucide-react";