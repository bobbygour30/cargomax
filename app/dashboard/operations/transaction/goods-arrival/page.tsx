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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Upload,
  Download,
  Truck,
  Package,
  MapPin,
  Building,
  Phone,
  User,
  Clock,
  AlertCircle,
  PlusCircle,
  Trash2,
  FileSpreadsheet,
  Filter,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Users,
  History,
  Plus,
  Edit,
  Grid3x3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Types
interface ArrivalRecord {
  id: number;
  manifestNo: string;
  arrivalDate: Date;
  despatchFrom: string;
  despatchTo: string;
  divisionName: string;
  modeName: string;
  category: string;
  arrivalStatus: string;
  arrivalNo: string;
  lhcNo: string;
  aWeight: number;
}

interface PendingArrivalRecord {
  id: number;
  manifestNo: string;
  date: Date;
  despatchFrom: string;
  despatchTo: string;
  divisionName: string;
  modeName: string;
  category: string;
  arrivalStatus: string;
  arrivalDate: Date;
  lhcNo: string;
  vehicleNo: string;
  driverName: string;
}

interface GRItem {
  id: number;
  grNo: string;
  grDate: Date;
  origin: string;
  destination: string;
  consignor: string;
  consignee: string;
  cargoType: string;
  despPckgs: number;
  despWt: number;
  receivePckgs: number;
  receiveWt: number;
  damagePcs: number;
  damageReason: string;
  short: number;
  excess: number;
  godown: string;
  remarks: string;
}

interface DamageClaim {
  id: number;
  grNo: string;
  despatchPckgs: number;
  despatchWeight: number;
  receivedPckgs: number;
  receivedWeight: number;
  damagePckgs: number;
  claimAmt: number;
  damageReason: string;
  uploadDocument: string;
  documentFile: string;
}

// Options
const branchOptions = ["ALL", "CORPORATE OFFICE", "DELHI", "MUMBAI", "BANGALORE", "CHENNAI", "KOLKATA"];
const despatchFromOptions = ["ALL", "U P BORDER A JH UP", "U P BORDER D BR GP", "DELHI", "MUMBAI"];
const manifestTypeOptions = ["OUT STATION", "LOCAL", "INCOMING"];
const modeTypeOptions = ["SURFACE", "AIR", "RAIL", "SEA"];
const categoryOptions = ["MARKET", "OWN", "CONTRACT"];
const godownOptions = ["Godown A", "Godown B", "Godown C", "Warehouse 1", "Warehouse 2"];
const cargoTypeOptions = ["General", "Fragile", "Hazardous", "Perishable", "Liquid"];
const damageReasonOptions = ["Transit Damage", "Handling Damage", "Water Damage", "Theft", "Shortage"];

export default function GoodsArrival() {
  // Main Tab state
  const [mainTab, setMainTab] = useState<"arrived" | "pending" | "entry">("arrived");
  const [activeEntryTab, setActiveEntryTab] = useState<"arrival" | "damage">("arrival");
  const [loading, setLoading] = useState<boolean>(false);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"grid" | "report">("report");

  // Sheet state for entry
  const [isEntrySheetOpen, setIsEntrySheetOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<number | null>(null);

  // Arrived Tab Filters
  const [arrivedBranch, setArrivedBranch] = useState<string>("ALL");
  const [arrivedDespatchFrom, setArrivedDespatchFrom] = useState<string>("ALL");
  const [arrivedManifestType, setArrivedManifestType] = useState<string>("OUT STATION");
  const [arrivedModeType, setArrivedModeType] = useState<string>("SURFACE");
  const [arrivedFromDate, setArrivedFromDate] = useState<Date>(new Date());
  const [arrivedToDate, setArrivedToDate] = useState<Date>(new Date());
  const [arrivedSearchTerm, setArrivedSearchTerm] = useState<string>("");
  const [arrivedResults, setArrivedResults] = useState<ArrivalRecord[]>([]);

  // Pending Arrival Tab Filters
  const [pendingBranch, setPendingBranch] = useState<string>("ALL");
  const [pendingDespatchFrom, setPendingDespatchFrom] = useState<string>("ALL");
  const [pendingManifestType, setPendingManifestType] = useState<string>("OUT STATION");
  const [pendingModeType, setPendingModeType] = useState<string>("SURFACE");
  const [pendingFromDate, setPendingFromDate] = useState<Date>(new Date());
  const [pendingToDate, setPendingToDate] = useState<Date>(new Date());
  const [pendingVehicleNo, setPendingVehicleNo] = useState<string>("ALL");
  const [pendingDriverName, setPendingDriverName] = useState<string>("ALL");
  const [pendingResults, setPendingResults] = useState<PendingArrivalRecord[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 10;

  // Entry Tab State
  const [branch, setBranch] = useState<string>("");
  const [selectGodown, setSelectGodown] = useState<string>("");
  const [manifestNo, setManifestNo] = useState<string>("");
  const [despatchOn, setDespatchOn] = useState<Date>(new Date());
  const [despatchTime, setDespatchTime] = useState<string>("");
  const [fromStation, setFromStation] = useState<string>("");
  const [modeType, setModeType] = useState<string>("");
  const [modeName, setModeName] = useState<string>("");
  const [driver, setDriver] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [unloadingPerson, setUnloadingPerson] = useState<string>("");
  const [serArrivalNo, setSerArrivalNo] = useState<string>("");
  const [autoArrival, setAutoArrival] = useState<boolean>(true);
  const [receiveDate, setReceiveDate] = useState<Date>(new Date());
  const [receiveTime, setReceiveTime] = useState<string>("");
  const [unloadingHours, setUnloadingHours] = useState<number>(0);
  const [unloadingMinutes, setUnloadingMinutes] = useState<number>(0);
  const [route, setRoute] = useState<string>("");
  const [tat, setTat] = useState<number>(0);
  const [scheduleArrivalDateTime, setScheduleArrivalDateTime] = useState<Date>(new Date());
  const [vehicleQueNo, setVehicleQueNo] = useState<string>("");
  const [vehicleArrivalDateTime, setVehicleArrivalDateTime] = useState<Date>(new Date());
  const [deviation, setDeviation] = useState<string>("");
  const [unloadingDateTime, setUnloadingDateTime] = useState<Date>(new Date());
  const [sealNo, setSealNo] = useState<string>("");
  const [sealOk, setSealOk] = useState<boolean>(true);
  const [dharamKantaWeight, setDharamKantaWeight] = useState<number>(0);
  const [remarks, setRemarks] = useState<string>("");
  const [excessReceiptWithoutGR, setExcessReceiptWithoutGR] = useState<boolean>(false);

  // GR Items
  const [grItems, setGrItems] = useState<GRItem[]>([
    { id: 1, grNo: "", grDate: new Date(), origin: "", destination: "", consignor: "", consignee: "", cargoType: "", despPckgs: 0, despWt: 0, receivePckgs: 0, receiveWt: 0, damagePcs: 0, damageReason: "", short: 0, excess: 0, godown: "", remarks: "" }
  ]);

  // Damage Claims
  const [damageClaims, setDamageClaims] = useState<DamageClaim[]>([
    { id: 1, grNo: "", despatchPckgs: 0, despatchWeight: 0, receivedPckgs: 0, receivedWeight: 0, damagePckgs: 0, claimAmt: 0, damageReason: "", uploadDocument: "", documentFile: "" }
  ]);

  // Totals
  const [manifestTotals, setManifestTotals] = useState({
    noOfGR: 0,
    totalPckgs: 0,
    totalWeight: 0
  });

  const [arrivalTotals, setArrivalTotals] = useState({
    noOfGR: 0,
    totalPckgs: 0,
    totalWeight: 0,
    damagePckgs: 0,
    totalShort: 0,
    totalExcess: 0
  });

  // Sample Data
  const sampleArrivedData: ArrivalRecord[] = [
    { id: 1, manifestNo: "M001", arrivalDate: new Date(), despatchFrom: "DELHI", despatchTo: "MUMBAI", divisionName: "North", modeName: "Road", category: "MARKET", arrivalStatus: "Arrived", arrivalNo: "AR001", lhcNo: "LHC001", aWeight: 2500 },
    { id: 2, manifestNo: "M002", arrivalDate: new Date(), despatchFrom: "MUMBAI", despatchTo: "DELHI", divisionName: "West", modeName: "Road", category: "OWN", arrivalStatus: "Arrived", arrivalNo: "AR002", lhcNo: "LHC002", aWeight: 3200 },
  ];

  const samplePendingData: PendingArrivalRecord[] = [
    { id: 1, manifestNo: "O302008874", date: new Date(), despatchFrom: "U P BORDER A JH UP", despatchTo: "JAUNPUR", divisionName: "", modeName: "", category: "MARKET", arrivalStatus: "PENDING", arrivalDate: new Date(), lhcNo: "", vehicleNo: "UP21CN8635", driverName: "Rajesh Kumar" },
    { id: 2, manifestNo: "O302008875", date: new Date(), despatchFrom: "U P BORDER A JH UP", despatchTo: "MACHHALISHAR", divisionName: "", modeName: "", category: "MARKET", arrivalStatus: "PENDING", arrivalDate: new Date(), lhcNo: "", vehicleNo: "UP21CN8635", driverName: "Suresh Singh" },
    { id: 3, manifestNo: "O302008872", date: new Date(), despatchFrom: "U P BORDER A JH UP", despatchTo: "VARANASI", divisionName: "", modeName: "", category: "MARKET", arrivalStatus: "PENDING", arrivalDate: new Date(), lhcNo: "", vehicleNo: "UP21CN8635", driverName: "Mahesh Sharma" },
    { id: 4, manifestNo: "O302008873", date: new Date(), despatchFrom: "U P BORDER A JH UP", despatchTo: "VARANASI", divisionName: "", modeName: "", category: "MARKET", arrivalStatus: "PENDING", arrivalDate: new Date(), lhcNo: "", vehicleNo: "UP21CN8635", driverName: "Ramesh Gupta" },
    { id: 5, manifestNo: "O330005537", date: new Date(), despatchFrom: "U P BORDER D BR GP", despatchTo: "DEHRI ON SON", divisionName: "", modeName: "", category: "MARKET", arrivalStatus: "PENDING", arrivalDate: new Date(), lhcNo: "", vehicleNo: "UP21CT6464", driverName: "Satish Verma" },
    { id: 6, manifestNo: "O330005536", date: new Date(), despatchFrom: "U P BORDER D BR GP", despatchTo: "PATNA", divisionName: "", modeName: "", category: "MARKET", arrivalStatus: "PENDING", arrivalDate: new Date(), lhcNo: "", vehicleNo: "UP21FT8408", driverName: "Vikash Singh" },
  ];

  // Handlers
  const handleArrivedSearch = () => {
    setLoading(true);
    setTimeout(() => {
      setArrivedResults(sampleArrivedData);
      setLoading(false);
    }, 500);
  };

  const handlePendingSearch = () => {
    setLoading(true);
    setTimeout(() => {
      setPendingResults(samplePendingData);
      setLoading(false);
    }, 500);
  };

  const handleSelectPending = (record: PendingArrivalRecord) => {
    setManifestNo(record.manifestNo);
    setFromStation(record.despatchFrom);
    setDriver(record.driverName);
    setIsEntrySheetOpen(true);
  };

  const handlePrintManifest = () => {
    alert("Print manifest initiated!");
  };

  const handleUploadSheet = () => {
    alert("Upload sheet dialog opened!");
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
  };

  const addGRItem = () => {
    const newItem: GRItem = {
      id: Date.now(),
      grNo: "", grDate: new Date(), origin: "", destination: "", consignor: "", consignee: "",
      cargoType: "", despPckgs: 0, despWt: 0, receivePckgs: 0, receiveWt: 0, damagePcs: 0,
      damageReason: "", short: 0, excess: 0, godown: "", remarks: ""
    };
    setGrItems([...grItems, newItem]);
  };

  const updateGRItem = (id: number, field: keyof GRItem, value: any) => {
    setGrItems(grItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeGRItem = (id: number) => {
    if (grItems.length > 1) {
      setGrItems(grItems.filter(item => item.id !== id));
    }
  };

  const addDamageClaim = () => {
    const newClaim: DamageClaim = {
      id: Date.now(),
      grNo: "", despatchPckgs: 0, despatchWeight: 0, receivedPckgs: 0, receivedWeight: 0,
      damagePckgs: 0, claimAmt: 0, damageReason: "", uploadDocument: "", documentFile: ""
    };
    setDamageClaims([...damageClaims, newClaim]);
  };

  const updateDamageClaim = (id: number, field: keyof DamageClaim, value: any) => {
    setDamageClaims(claims => claims.map(claim => claim.id === id ? { ...claim, [field]: value } : claim));
  };

  const removeDamageClaim = (id: number) => {
    if (damageClaims.length > 1) {
      setDamageClaims(damageClaims.filter(claim => claim.id !== id));
    }
  };

  const calculateTotals = () => {
    const manifestTotal = {
      noOfGR: grItems.length,
      totalPckgs: grItems.reduce((sum, item) => sum + item.despPckgs, 0),
      totalWeight: grItems.reduce((sum, item) => sum + item.despWt, 0)
    };
    setManifestTotals(manifestTotal);

    const arrivalTotal = {
      noOfGR: grItems.length,
      totalPckgs: grItems.reduce((sum, item) => sum + item.receivePckgs, 0),
      totalWeight: grItems.reduce((sum, item) => sum + item.receiveWt, 0),
      damagePckgs: grItems.reduce((sum, item) => sum + item.damagePcs, 0),
      totalShort: grItems.reduce((sum, item) => sum + item.short, 0),
      totalExcess: grItems.reduce((sum, item) => sum + item.excess, 0)
    };
    setArrivalTotals(arrivalTotal);
  };

  const handleSave = () => {
    calculateTotals();
    alert("Goods arrival saved successfully!");
    setIsEntrySheetOpen(false);
  };

  const resetForm = () => {
    setBranch("");
    setSelectGodown("");
    setManifestNo("");
    setFromStation("");
    setDriver("");
    setMobile("");
    setUnloadingPerson("");
    setSerArrivalNo("");
    setRemarks("");
    setGrItems([{ id: 1, grNo: "", grDate: new Date(), origin: "", destination: "", consignor: "", consignee: "", cargoType: "", despPckgs: 0, despWt: 0, receivePckgs: 0, receiveWt: 0, damagePcs: 0, damageReason: "", short: 0, excess: 0, godown: "", remarks: "" }]);
    setDamageClaims([{ id: 1, grNo: "", despatchPckgs: 0, despatchWeight: 0, receivedPckgs: 0, receivedWeight: 0, damagePckgs: 0, claimAmt: 0, damageReason: "", uploadDocument: "", documentFile: "" }]);
  };

  const openEntrySheet = () => {
    resetForm();
    setEditMode(false);
    setCurrentEditId(null);
    setIsEntrySheetOpen(true);
  };

  const paginatedResults = pendingResults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(pendingResults.length / itemsPerPage);
  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  // Stats
  const stats = {
    arrived: arrivedResults.length,
    pending: pendingResults.length,
  };

  return (
    <div className="space-y-4 p-3 md:p-4 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-wrap justify-between items-start gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-600" />
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">GOODS ARRIVAL</h1>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500">
              <span>🏢 Company: GOLDEN ROADWAYS & LOGISTICS PVT LTD</span>
              <span>👤 Login: MAYANK.GRLOGISTICS@GMAIL.COM</span>
              <span>📍 Branch: CORPORATE OFFICE</span>
              <span>📅 Financial Year: 2026-2027</span>
            </div>
          </div>
          <Button onClick={openEntrySheet} size="default" className="bg-blue-600 hover:bg-blue-700 shadow-md">
            <Plus className="mr-2 h-4 w-4" />
            New Goods Arrival
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex border-b bg-white rounded-t-lg">
        <button
          onClick={() => setMainTab("arrived")}
          className={cn(
            "px-6 py-2.5 text-sm font-medium transition-all rounded-t-lg",
            mainTab === "arrived"
              ? "bg-blue-600 text-white shadow-md"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          )}
        >
          Arrived
        </button>
        <button
          onClick={() => setMainTab("pending")}
          className={cn(
            "px-6 py-2.5 text-sm font-medium transition-all rounded-t-lg",
            mainTab === "pending"
              ? "bg-yellow-600 text-white shadow-md"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          )}
        >
          Pending Arrival
        </button>
      </div>

      {/* Arrived Tab */}
      {mainTab === "arrived" && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Total Arrived</p>
                    <p className="text-2xl font-bold">{stats.arrived}</p>
                  </div>
                  <Check className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Total Weight</p>
                    <p className="text-2xl font-bold">5,700 kg</p>
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
                <Filter className="h-3.5 w-3.5" />
                Search Arrived Goods
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">Branch</Label>
                  <Select value={arrivedBranch} onValueChange={setArrivedBranch}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger>
                    <SelectContent>{branchOptions.map(opt => (<SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">Despatched From</Label>
                  <Select value={arrivedDespatchFrom} onValueChange={setArrivedDespatchFrom}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">Manifest Type</Label>
                  <Select value={arrivedManifestType} onValueChange={setArrivedManifestType}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">Mode Type</Label>
                  <Select value={arrivedModeType} onValueChange={setArrivedModeType}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">Period</Label>
                  <div className="flex gap-2">
                    <Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 flex-1 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(arrivedFromDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={arrivedFromDate} onSelect={(d) => d && setArrivedFromDate(d)} /></PopoverContent></Popover>
                    <Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 flex-1 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(arrivedToDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={arrivedToDate} onSelect={(d) => d && setArrivedToDate(d)} /></PopoverContent></Popover>
                  </div>
                </div>
                <div className="flex items-end gap-2">
                  <Button onClick={handleArrivedSearch} size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700"><Search className="mr-1 h-3 w-3" />Search</Button>
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
                  <h3 className="text-[15px] font-semibold text-gray-800">Arrived Goods List</h3>
                </div>
                <div className="text-[10px] text-gray-500">Total: {arrivedResults.length} records</div>
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
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[80px]">Arrival Date</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">From</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">To</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[80px]">Mode</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 w-[80px] text-right">Weight</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 w-20 text-center">Status</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 w-20 text-center">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {arrivedResults.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                            <Truck className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            No arrived records found
                          </TableCell>
                        </TableRow>
                      ) : (
                        arrivedResults.map((record, idx) => (
                          <TableRow key={record.id} className="hover:bg-gray-50">
                            <TableCell className="py-2 px-2 text-center text-xs">{idx + 1}</TableCell>
                            <TableCell className="py-2 px-2 font-mono text-xs">{record.manifestNo}</TableCell>
                            <TableCell className="py-2 px-2 text-xs">{format(record.arrivalDate, "dd-MM-yyyy")}</TableCell>
                            <TableCell className="py-2 px-2 text-xs">{record.despatchFrom}</TableCell>
                            <TableCell className="py-2 px-2 text-xs">{record.despatchTo}</TableCell>
                            <TableCell className="py-2 px-2 text-xs">{record.modeName}</TableCell>
                            <TableCell className="py-2 px-2 text-right text-xs">{record.aWeight}</TableCell>
                            <TableCell className="py-2 px-2 text-center">
                              <Badge className="bg-green-100 text-green-700 text-[10px]">Arrived</Badge>
                            </TableCell>
                            <TableCell className="py-2 px-2 text-center">
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-blue-500">
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
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
        </>
      )}

      {/* Pending Arrival Tab */}
      {mainTab === "pending" && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Total Pending</p>
                    <p className="text-2xl font-bold">{stats.pending}</p>
                  </div>
                  <Clock className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Vehicles Enroute</p>
                    <p className="text-2xl font-bold">{stats.pending}</p>
                  </div>
                  <Truck className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search Filters */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-[11px] font-semibold flex items-center gap-2 text-gray-700">
                <Search className="h-3.5 w-3.5" />
                Search Pending Arrivals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">Branch</Label>
                  <Select value={pendingBranch} onValueChange={setPendingBranch}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger>
                    <SelectContent>{branchOptions.map(opt => (<SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">Despatched From</Label>
                  <Select value={pendingDespatchFrom} onValueChange={setPendingDespatchFrom}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">Manifest Type</Label>
                  <Select value={pendingManifestType} onValueChange={setPendingManifestType}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">Mode Type</Label>
                  <Select value={pendingModeType} onValueChange={setPendingModeType}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">Manifest Period</Label>
                  <div className="flex gap-2">
                    <Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 flex-1 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(pendingFromDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={pendingFromDate} onSelect={(d) => d && setPendingFromDate(d)} /></PopoverContent></Popover>
                    <Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 flex-1 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(pendingToDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={pendingToDate} onSelect={(d) => d && setPendingToDate(d)} /></PopoverContent></Popover>
                  </div>
                </div>
                <div className="flex items-end gap-2">
                  <Button onClick={handlePendingSearch} size="sm" className="h-8 text-xs bg-yellow-600 hover:bg-yellow-700"><Search className="mr-1 h-3 w-3" />Search</Button>
                  <Button onClick={handlePrintManifest} variant="outline" size="sm" className="h-8 text-xs"><Printer className="mr-1 h-3 w-3" />Print</Button>
                  <Button onClick={handleUploadSheet} variant="outline" size="sm" className="h-8 text-xs"><Upload className="mr-1 h-3 w-3" />Upload</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Results Table */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Table className="h-3.5 w-3.5 text-gray-500" />
                  <h3 className="text-[11px] font-semibold text-gray-800">Pending Arrivals List</h3>
                </div>
                <div className="text-[10px] text-gray-500">Total: {pendingResults.length} records</div>
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
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">From</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">To</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[80px]">Vehicle #</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Driver</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 w-20 text-center">Status</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 w-24 text-center">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedResults.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                            <Clock className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            No pending arrival records found
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedResults.map((record, idx) => (
                          <TableRow key={record.id} className="hover:bg-gray-50">
                            <TableCell className="py-2 px-2 text-center text-xs">
                              {(currentPage - 1) * itemsPerPage + idx + 1}
                            </TableCell>
                            <TableCell className="py-2 px-2 font-mono text-xs">{record.manifestNo}</TableCell>
                            <TableCell className="py-2 px-2 text-xs">{format(record.date, "dd-MM-yyyy")}</TableCell>
                            <TableCell className="py-2 px-2 text-xs">{record.despatchFrom}</TableCell>
                            <TableCell className="py-2 px-2 text-xs">{record.despatchTo}</TableCell>
                            <TableCell className="py-2 px-2 text-xs">{record.vehicleNo}</TableCell>
                            <TableCell className="py-2 px-2 text-xs">{record.driverName}</TableCell>
                            <TableCell className="py-2 px-2 text-center">
                              <Badge className="bg-yellow-100 text-yellow-700 text-[10px]">Pending</Badge>
                            </TableCell>
                            <TableCell className="py-2 px-2 text-center">
                              <Button onClick={() => handleSelectPending(record)} variant="ghost" size="sm" className="h-7 text-xs bg-green-100 text-green-700 px-2">
                                Select
                              </Button>
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
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, pendingResults.length)} of {pendingResults.length} entries
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

      {/* Entry Sheet */}
      <Sheet open={isEntrySheetOpen} onOpenChange={setIsEntrySheetOpen}>
        <SheetContent className="w-full sm:max-w-3xl overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle className="flex items-center gap-2 text-base">
              {editMode ? (
                <>
                  <Edit className="h-4 w-4 text-blue-600" />
                  Edit Goods Arrival
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 text-blue-600" />
                  New Goods Arrival
                </>
              )}
            </SheetTitle>
          </SheetHeader>

          <Tabs value={activeEntryTab} onValueChange={(v) => setActiveEntryTab(v as "arrival" | "damage")} className="w-full">
            <TabsList className="grid w-full max-w-[300px] grid-cols-2">
              <TabsTrigger value="arrival" className="text-xs">Arrival Details</TabsTrigger>
              <TabsTrigger value="damage" className="text-xs">Damage Claim</TabsTrigger>
            </TabsList>

            {/* Arrival Tab */}
            <TabsContent value="arrival" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-1"><Label className="text-xs">Branch</Label><Select value={branch} onValueChange={setBranch}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{branchOptions.filter(b => b !== "ALL").map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
                <div className="space-y-1"><Label className="text-xs">Select Godown *</Label><Select value={selectGodown} onValueChange={setSelectGodown}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{godownOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
                <div className="space-y-1"><Label className="text-xs">Manifest #</Label><Input value={manifestNo} onChange={(e) => setManifestNo(e.target.value)} className="h-8 text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">Despatch On</Label><div className="flex gap-2"><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 flex-1 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(despatchOn, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={despatchOn} onSelect={(d) => d && setDespatchOn(d)} /></PopoverContent></Popover><Input type="time" value={despatchTime} onChange={(e) => setDespatchTime(e.target.value)} className="h-8 w-24 text-xs" /></div></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-1"><Label className="text-xs">From Station</Label><Input value={fromStation} onChange={(e) => setFromStation(e.target.value)} className="h-8 text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">Mode Type</Label><Select value={modeType} onValueChange={setModeType}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{modeTypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
                <div className="space-y-1"><Label className="text-xs">Mode Name</Label><Input value={modeName} onChange={(e) => setModeName(e.target.value)} className="h-8 text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">Driver</Label><Input value={driver} onChange={(e) => setDriver(e.target.value)} className="h-8 text-xs" /></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-1"><Label className="text-xs">Mobile</Label><Input value={mobile} onChange={(e) => setMobile(e.target.value)} className="h-8 text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">Unloading Person *</Label><Input value={unloadingPerson} onChange={(e) => setUnloadingPerson(e.target.value)} className="h-8 text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">SER/Arrival #</Label><div className="flex gap-2"><Input value={serArrivalNo} onChange={(e) => setSerArrivalNo(e.target.value)} className="h-8 flex-1 text-xs" /><div className="flex items-center gap-1"><input type="checkbox" checked={autoArrival} onChange={(e) => setAutoArrival(e.target.checked)} className="h-3.5 w-3.5" /><Label className="text-[10px]">Auto</Label></div></div></div>
                <div className="space-y-1"><Label className="text-xs">Receive Date *</Label><div className="flex gap-2"><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 flex-1 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(receiveDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={receiveDate} onSelect={(d) => d && setReceiveDate(d)} /></PopoverContent></Popover><Input type="time" value={receiveTime} onChange={(e) => setReceiveTime(e.target.value)} className="h-8 w-24 text-xs" /></div></div>
              </div>

              {/* GR Items Table */}
              <div className="rounded-md border">
                <div className="bg-gray-50 px-3 py-2 border-b flex justify-between items-center"><h3 className="text-sm font-semibold">GR Details</h3><Button onClick={addGRItem} variant="ghost" size="sm" className="h-7 text-xs"><PlusCircle className="mr-1 h-3 w-3" />Add GR</Button></div>
                <div className="overflow-x-auto">
                  <div className="min-w-[1200px]">
                    <Table className="text-[10px]">
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead>GR #</TableHead><TableHead>GR Date</TableHead><TableHead>Origin</TableHead><TableHead>Destination</TableHead>
                          <TableHead>Consignor</TableHead><TableHead>Consignee</TableHead><TableHead>Desp Pckgs</TableHead><TableHead>Desp Wt</TableHead>
                          <TableHead>Receive Pckgs</TableHead><TableHead>Receive Wt</TableHead><TableHead>Damage</TableHead><TableHead className="w-8">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {grItems.map((item, idx) => (
                          <TableRow key={item.id}>
                            <TableCell><Input value={item.grNo} onChange={(e) => updateGRItem(item.id, "grNo", e.target.value)} className="h-7 w-24 text-[10px]" /></TableCell>
                            <TableCell><Popover><PopoverTrigger asChild><Button variant="outline" className="h-7 w-24 text-[10px]"><CalendarIcon className="mr-1 h-2 w-2" />{format(item.grDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={item.grDate} onSelect={(d) => d && updateGRItem(item.id, "grDate", d)} /></PopoverContent></Popover></TableCell>
                            <TableCell><Input value={item.origin} onChange={(e) => updateGRItem(item.id, "origin", e.target.value)} className="h-7 w-24 text-[10px]" /></TableCell>
                            <TableCell><Input value={item.destination} onChange={(e) => updateGRItem(item.id, "destination", e.target.value)} className="h-7 w-24 text-[10px]" /></TableCell>
                            <TableCell><Input value={item.consignor} onChange={(e) => updateGRItem(item.id, "consignor", e.target.value)} className="h-7 w-24 text-[10px]" /></TableCell>
                            <TableCell><Input value={item.consignee} onChange={(e) => updateGRItem(item.id, "consignee", e.target.value)} className="h-7 w-24 text-[10px]" /></TableCell>
                            <TableCell><Input type="number" value={item.despPckgs} onChange={(e) => updateGRItem(item.id, "despPckgs", Number(e.target.value))} className="h-7 w-20 text-[10px]" /></TableCell>
                            <TableCell><Input type="number" value={item.despWt} onChange={(e) => updateGRItem(item.id, "despWt", Number(e.target.value))} className="h-7 w-20 text-[10px]" /></TableCell>
                            <TableCell><Input type="number" value={item.receivePckgs} onChange={(e) => updateGRItem(item.id, "receivePckgs", Number(e.target.value))} className="h-7 w-20 text-[10px]" /></TableCell>
                            <TableCell><Input type="number" value={item.receiveWt} onChange={(e) => updateGRItem(item.id, "receiveWt", Number(e.target.value))} className="h-7 w-20 text-[10px]" /></TableCell>
                            <TableCell><Input type="number" value={item.damagePcs} onChange={(e) => updateGRItem(item.id, "damagePcs", Number(e.target.value))} className="h-7 w-20 text-[10px]" /></TableCell>
                            <TableCell><Button variant="ghost" size="sm" onClick={() => removeGRItem(item.id)} className="h-6 w-6 p-0 text-red-500"><Trash2 className="h-3 w-3" /></Button></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>

              {/* Totals Display */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-md p-3"><h4 className="text-sm font-semibold mb-2">As Per Manifest</h4><div className="grid grid-cols-3 gap-2 text-xs"><span>GR: {manifestTotals.noOfGR}</span><span>Pckgs: {manifestTotals.totalPckgs}</span><span>Wt: {manifestTotals.totalWeight.toFixed(3)}</span></div></div>
                <div className="border rounded-md p-3"><h4 className="text-sm font-semibold mb-2">As Per Arrival</h4><div className="grid grid-cols-3 gap-2 text-xs"><span>GR: {arrivalTotals.noOfGR}</span><span>Pckgs: {arrivalTotals.totalPckgs}</span><span>Wt: {arrivalTotals.totalWeight.toFixed(3)}</span><span>Damage: {arrivalTotals.damagePckgs}</span></div></div>
              </div>

              <div className="space-y-1"><Label className="text-xs">Remarks</Label><Textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={2} className="text-xs" /></div>

              <div className="flex flex-wrap justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsEntrySheetOpen(false)} className="h-8 text-xs"><X className="mr-1 h-3 w-3" />Cancel</Button>
                <Button onClick={handleSave} size="sm" className="h-8 text-xs bg-green-600 hover:bg-green-700"><Save className="mr-1 h-3 w-3" />Save</Button>
              </div>
            </TabsContent>

            {/* Damage Claim Tab */}
            <TabsContent value="damage" className="space-y-4 mt-4">
              <div className="rounded-md border">
                <div className="bg-gray-50 px-3 py-2 border-b flex justify-between items-center"><h3 className="text-sm font-semibold">Damage GR For Claim</h3><Button onClick={addDamageClaim} variant="ghost" size="sm" className="h-7 text-xs"><PlusCircle className="mr-1 h-3 w-3" />Add Claim</Button></div>
                <div className="overflow-x-auto">
                  <div className="min-w-[1000px]">
                    <Table className="text-[10px]">
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead>GR #</TableHead><TableHead>Despatch Pckgs</TableHead><TableHead>Received Pckgs</TableHead>
                          <TableHead>Damage Pckgs</TableHead><TableHead>Claim Amt</TableHead><TableHead>Damage Reason</TableHead><TableHead className="w-8">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {damageClaims.map((claim, idx) => (
                          <TableRow key={claim.id}>
                            <TableCell><Input value={claim.grNo} onChange={(e) => updateDamageClaim(claim.id, "grNo", e.target.value)} className="h-7 w-24 text-[10px]" /></TableCell>
                            <TableCell><Input type="number" value={claim.despatchPckgs} onChange={(e) => updateDamageClaim(claim.id, "despatchPckgs", Number(e.target.value))} className="h-7 w-24 text-[10px]" /></TableCell>
                            <TableCell><Input type="number" value={claim.receivedPckgs} onChange={(e) => updateDamageClaim(claim.id, "receivedPckgs", Number(e.target.value))} className="h-7 w-24 text-[10px]" /></TableCell>
                            <TableCell><Input type="number" value={claim.damagePckgs} onChange={(e) => updateDamageClaim(claim.id, "damagePckgs", Number(e.target.value))} className="h-7 w-24 text-[10px]" /></TableCell>
                            <TableCell><Input type="number" value={claim.claimAmt} onChange={(e) => updateDamageClaim(claim.id, "claimAmt", Number(e.target.value))} className="h-7 w-24 text-[10px]" /></TableCell>
                            <TableCell><Select value={claim.damageReason} onValueChange={(v) => updateDamageClaim(claim.id, "damageReason", v)}><SelectTrigger className="h-7 w-32 text-[10px]"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{damageReasonOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></TableCell>
                            <TableCell><Button variant="ghost" size="sm" onClick={() => removeDamageClaim(claim.id)} className="h-6 w-6 p-0 text-red-500"><Trash2 className="h-3 w-3" /></Button></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsEntrySheetOpen(false)} className="h-8 text-xs"><X className="mr-1 h-3 w-3" />Cancel</Button>
                <Button onClick={handleSave} size="sm" className="h-8 text-xs bg-green-600 hover:bg-green-700"><Save className="mr-1 h-3 w-3" />Save</Button>
              </div>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
    </div>
  );
}