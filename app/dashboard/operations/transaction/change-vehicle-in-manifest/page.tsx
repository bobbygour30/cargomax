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
  Pencil,
  Trash2,
  Plus,
  Eye,
  Check,
  X,
  Truck,
  MapPin,
  FileText,
  AlertCircle,
  Filter,
  ChevronLeft,
  ChevronRight,
  History,
  Users,
  Car,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ManifestRecord {
  id: number;
  manifestNo: string;
  date: Date;
  fromLocation: string;
  toLocation: string;
  driver: string;
  newDriver: string;
  vehicleNo: string;
  newVehicleNo: string;
  totalGR: number;
  totalPckgs: number;
  totalDR: number;
  reason: string;
  type: "internal" | "outstation";
  changedBy: string;
  changedAt: Date;
  status: "active" | "reverted";
}

interface DriverOption {
  value: string;
  label: string;
}

interface VehicleOption {
  value: string;
  label: string;
}

interface LocationOption {
  value: string;
  label: string;
}

const driverOptions: DriverOption[] = [
  { value: "Rajesh Kumar - DL01AB1234", label: "Rajesh Kumar - DL01AB1234" },
  { value: "Suresh Singh - DL02CD5678", label: "Suresh Singh - DL02CD5678" },
  { value: "Mahesh Sharma - DL03EF9012", label: "Mahesh Sharma - DL03EF9012" },
  { value: "Ramesh Gupta - DL04GH3456", label: "Ramesh Gupta - DL04GH3456" },
  { value: "Satish Verma - DL05IJ7890", label: "Satish Verma - DL05IJ7890" },
];

const vehicleOptions: VehicleOption[] = [
  { value: "UP14AB1234 - TATA 407", label: "UP14AB1234 - TATA 407" },
  { value: "UP15CD5678 - ASHOK LEYLAND", label: "UP15CD5678 - ASHOK LEYLAND" },
  { value: "UP16EF9012 - MAHINDRA PICKUP", label: "UP16EF9012 - MAHINDRA PICKUP" },
  { value: "UP17GH3456 - EICHER", label: "UP17GH3456 - EICHER" },
  { value: "UP18IJ7890 - BHARAT BENZ", label: "UP18IJ7890 - BHARAT BENZ" },
];

const locationOptions: LocationOption[] = [
  { value: "DELHI", label: "DELHI" },
  { value: "MUMBAI", label: "MUMBAI" },
  { value: "BANGALORE", label: "BANGALORE" },
  { value: "CHENNAI", label: "CHENNAI" },
  { value: "KOLKATA", label: "KOLKATA" },
  { value: "AHMEDABAD", label: "AHMEDABAD" },
  { value: "PUNE", label: "PUNE" },
  { value: "HYDERABAD", label: "HYDERABAD" },
  { value: "JAIPUR", label: "JAIPUR" },
  { value: "LUCKNOW", label: "LUCKNOW" },
];

export default function ChangeVehicleInManifest() {
  // Main Tab state
  const [mainTab, setMainTab] = useState<"change" | "history">("change");
  const [activeType, setActiveType] = useState<"internal" | "outstation">("internal");

  // Form state
  const [manifestNo, setManifestNo] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [fromLocation, setFromLocation] = useState<string>("");
  const [toLocation, setToLocation] = useState<string>("");
  const [driver, setDriver] = useState<string>("");
  const [newDriver, setNewDriver] = useState<string>("");
  const [vehicleNo, setVehicleNo] = useState<string>("");
  const [newVehicleNo, setNewVehicleNo] = useState<string>("");
  const [totalGR, setTotalGR] = useState<number>(0);
  const [totalPckgs, setTotalPckgs] = useState<number>(0);
  const [totalDR, setTotalDR] = useState<number>(0);
  const [reason, setReason] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  // History state
  const [historyRecords, setHistoryRecords] = useState<ManifestRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 10;

  // Sample saved records
  const [savedRecords, setSavedRecords] = useState<ManifestRecord[]>([]);

  // Load history on mount
  useEffect(() => {
    setHistoryRecords(savedRecords);
  }, [savedRecords]);

  const generateManifestNo = (): string => {
    const count = savedRecords.length + 1;
    const prefix = activeType === "internal" ? "INT" : "OUT";
    return `${prefix}${String(count).padStart(6, "0")}`;
  };

  const resetForm = (): void => {
    setManifestNo(generateManifestNo());
    setDate(new Date());
    setFromLocation("");
    setToLocation("");
    setDriver("");
    setNewDriver("");
    setVehicleNo("");
    setNewVehicleNo("");
    setTotalGR(0);
    setTotalPckgs(0);
    setTotalDR(0);
    setReason("");
  };

  const handleFetchManifest = (): void => {
    if (!manifestNo) {
      alert("Please enter Manifest #");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      // Sample data fetch
      if (manifestNo.includes("INT")) {
        setFromLocation("DELHI");
        setToLocation("MUMBAI");
        setDriver("Rajesh Kumar - DL01AB1234");
        setVehicleNo("UP14AB1234 - TATA 407");
        setTotalGR(5);
        setTotalPckgs(120);
        setTotalDR(3);
      } else {
        setFromLocation("DELHI");
        setToLocation("BANGALORE");
        setDriver("Suresh Singh - DL02CD5678");
        setVehicleNo("UP15CD5678 - ASHOK LEYLAND");
        setTotalGR(8);
        setTotalPckgs(250);
        setTotalDR(5);
      }
      setLoading(false);
      setSuccessMessage(`Manifest ${manifestNo} details loaded successfully!`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 500);
  };

  const handleUpdate = (): void => {
    if (!manifestNo) {
      alert("Please enter Manifest #");
      return;
    }
    if (!newVehicleNo) {
      alert("Please select New Vehicle #");
      return;
    }
    if (!reason.trim()) {
      alert("Please enter Reason");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const newRecord: ManifestRecord = {
        id: Date.now(),
        manifestNo: manifestNo,
        date: date,
        fromLocation: fromLocation,
        toLocation: toLocation,
        driver: driver,
        newDriver: newDriver,
        vehicleNo: vehicleNo,
        newVehicleNo: newVehicleNo,
        totalGR: totalGR,
        totalPckgs: totalPckgs,
        totalDR: totalDR,
        reason: reason,
        type: activeType,
        changedBy: "MAYANK.GRLOGISTICS@GMAIL.COM",
        changedAt: new Date(),
        status: "active",
      };
      const updatedRecords = [newRecord, ...savedRecords];
      setSavedRecords(updatedRecords);
      setHistoryRecords(updatedRecords);
      setSuccessMessage(`Vehicle changed successfully for Manifest ${manifestNo}!`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      resetForm();
      setLoading(false);
    }, 500);
  };

  const handleRevert = (record: ManifestRecord): void => {
    if (confirm(`Are you sure you want to revert the vehicle change for Manifest ${record.manifestNo}?`)) {
      const updatedRecords = savedRecords.map(r =>
        r.id === record.id ? { ...r, status: "reverted" as const } : r
      );
      setSavedRecords(updatedRecords);
      setHistoryRecords(updatedRecords);
      alert(`Vehicle change reverted successfully for Manifest ${record.manifestNo}!`);
    }
  };

  const handleClear = (): void => {
    resetForm();
  };

  // Filter history records
  const getFilteredHistory = () => {
    let results = [...savedRecords];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(r =>
        r.manifestNo.toLowerCase().includes(term) ||
        r.vehicleNo.toLowerCase().includes(term) ||
        r.newVehicleNo.toLowerCase().includes(term)
      );
    }
    return results;
  };

  const filteredHistory = getFilteredHistory();
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const paginatedHistory = filteredHistory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  // Stats
  const stats = {
    total: savedRecords.length,
    active: savedRecords.filter(r => r.status === "active").length,
    reverted: savedRecords.filter(r => r.status === "reverted").length,
  };

  return (
    <div className="space-y-4 p-3 md:p-4 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-600" />
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">CHANGE VEHICLE IN MANIFEST</h1>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500">
              <span>🏢 Company: GOLDEN ROADWAYS & LOGISTICS PVT LTD</span>
              <span>👤 Login: MAYANK.GRLOGISTICS@GMAIL.COM</span>
              <span>📍 Branch: CORPORATE OFFICE</span>
              <span>📅 Financial Year: 2026-2027</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex border-b bg-white rounded-t-lg">
        <button
          onClick={() => setMainTab("change")}
          className={cn(
            "px-6 py-2.5 text-sm font-medium transition-all rounded-t-lg flex items-center gap-2",
            mainTab === "change"
              ? "bg-blue-600 text-white shadow-md"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          )}
        >
          <Truck className="h-4 w-4" />
          Change Vehicle
        </button>
        <button
          onClick={() => setMainTab("history")}
          className={cn(
            "px-6 py-2.5 text-sm font-medium transition-all rounded-t-lg flex items-center gap-2",
            mainTab === "history"
              ? "bg-green-600 text-white shadow-md"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          )}
        >
          <History className="h-4 w-4" />
          Change History
        </button>
      </div>

      {/* Change Vehicle Tab */}
      {mainTab === "change" && (
        <>
          {/* Internal / Outstation Toggle */}
          <div className="flex gap-2 border-b pb-2">
            <button
              onClick={() => {
                setActiveType("internal");
                resetForm();
              }}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-all rounded-t-lg",
                activeType === "internal"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              <Truck className="inline h-4 w-4 mr-2" />
              Internal
            </button>
            <button
              onClick={() => {
                setActiveType("outstation");
                resetForm();
              }}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-all rounded-t-lg",
                activeType === "outstation"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              <MapPin className="inline h-4 w-4 mr-2" />
              Outstation
            </button>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
          )}

          {/* Form Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Vehicle Change Form
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Manifest # */}
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">
                      Manifest # <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={manifestNo}
                        onChange={(e) => setManifestNo(e.target.value)}
                        placeholder="Enter Manifest Number"
                        className="h-9 text-sm flex-1"
                      />
                      <Button
                        onClick={handleFetchManifest}
                        variant="outline"
                        size="sm"
                        className="h-9 text-xs"
                        disabled={loading}
                      >
                        <FileText className="mr-1 h-3.5 w-3.5" />
                        Fetch
                      </Button>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="h-9 w-full justify-start text-left text-sm"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(date, "dd-MM-yyyy")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(d) => d && setDate(d)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* From */}
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">From</Label>
                    <Select value={fromLocation} onValueChange={setFromLocation}>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="Select Origin" />
                      </SelectTrigger>
                      <SelectContent>
                        {locationOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value} className="text-sm">
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* To */}
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">To</Label>
                    <Select value={toLocation} onValueChange={setToLocation}>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="Select Destination" />
                      </SelectTrigger>
                      <SelectContent>
                        {locationOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value} className="text-sm">
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Driver */}
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Current Driver</Label>
                    <Select value={driver} onValueChange={setDriver}>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="Select Driver" />
                      </SelectTrigger>
                      <SelectContent>
                        {driverOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value} className="text-sm">
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* New Driver */}
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">New Driver</Label>
                    <Select value={newDriver} onValueChange={setNewDriver}>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="Select New Driver" />
                      </SelectTrigger>
                      <SelectContent>
                        {driverOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value} className="text-sm">
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Vehicle # */}
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Current Vehicle</Label>
                    <Select value={vehicleNo} onValueChange={setVehicleNo}>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="Select Vehicle" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicleOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value} className="text-sm">
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* New Vehicle # */}
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">
                      New Vehicle <span className="text-red-500">*</span>
                    </Label>
                    <Select value={newVehicleNo} onValueChange={setNewVehicleNo}>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="Select New Vehicle" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicleOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value} className="text-sm">
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-3 text-center">
                        <p className="text-[10px] text-blue-600">Total GR</p>
                        <p className="text-xl font-bold text-blue-700">{totalGR}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-green-50 border-green-200">
                      <CardContent className="p-3 text-center">
                        <p className="text-[10px] text-green-600">Total Pckgs</p>
                        <p className="text-xl font-bold text-green-700">{totalPckgs}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-orange-50 border-orange-200">
                      <CardContent className="p-3 text-center">
                        <p className="text-[10px] text-orange-600">Total DR</p>
                        <p className="text-xl font-bold text-orange-700">{totalDR}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Reason */}
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">
                      Reason for Change <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Enter reason for vehicle change..."
                      rows={4}
                      className="text-sm resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-6 mt-4 border-t">
                <Button
                  onClick={handleClear}
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                >
                  <RefreshCw className="mr-1 h-3 w-3" />
                  Clear
                </Button>
                <Button
                  onClick={handleUpdate}
                  size="sm"
                  className="h-8 text-xs bg-green-600 hover:bg-green-700"
                  disabled={loading}
                >
                  {loading ? (
                    <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                  ) : (
                    <Save className="mr-1 h-3 w-3" />
                  )}
                  Update Vehicle
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Info Note */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div className="text-xs text-yellow-700">
                <p className="font-medium">Note:</p>
                <p>Changing vehicle will update all associated GRs and DRs. Please ensure the new vehicle is available and has valid documents.</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Change History Tab */}
      {mainTab === "history" && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Total Changes</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <History className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Active Changes</p>
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
                    <p className="text-sm opacity-90">Reverted Changes</p>
                    <p className="text-2xl font-bold">{stats.reverted}</p>
                  </div>
                  <RefreshCw className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search Bar */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-[11px] font-semibold flex items-center gap-2 text-gray-700">
                <Search className="h-3.5 w-3.5" />
                Search Change History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <Input
                    placeholder="Search by Manifest No, Old Vehicle, New Vehicle..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 h-9 text-sm"
                  />
                </div>
                <Button onClick={() => setCurrentPage(1)} className="h-9 bg-blue-600 hover:bg-blue-700 text-xs">
                  <Search className="mr-1 h-3.5 w-3.5" />
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* History Table */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="gap-2 w-full">
                  <Table className="text-gray-500" />
                  <h3 className="text-[15px] font-semibold text-gray-800">
                    Vehicle Change History
                  </h3>
                </div>
                <div className="text-[10px] text-gray-500">
                  Total: {filteredHistory.length} records
                </div>
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
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">From/To</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[120px]">Old Vehicle</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[120px]">New Vehicle</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Old Driver</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">New Driver</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 w-20 text-center">Status</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-2 w-24 text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedHistory.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                            <History className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            No change history found
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedHistory.map((record, index) => (
                          <TableRow key={record.id} className="hover:bg-gray-50">
                            <TableCell className="py-2 px-2 text-center text-xs">
                              {(currentPage - 1) * itemsPerPage + index + 1}
                            </TableCell>
                            <TableCell className="py-2 px-2 font-mono font-semibold text-xs">
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 text-[11px]">
                                {record.manifestNo}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-2 px-2 text-xs">{format(record.date, "dd-MM-yyyy")}</TableCell>
                            <TableCell className="py-2 px-2 text-xs">
                              {record.fromLocation} → {record.toLocation}
                            </TableCell>
                            <TableCell className="py-2 px-2 text-xs">{record.vehicleNo?.split(" - ")[0] || "-"}</TableCell>
                            <TableCell className="py-2 px-2 text-xs font-medium text-green-600">
                              {record.newVehicleNo?.split(" - ")[0] || "-"}
                            </TableCell>
                            <TableCell className="py-2 px-2 text-xs">{record.driver?.split(" - ")[0] || "-"}</TableCell>
                            <TableCell className="py-2 px-2 text-xs">{record.newDriver?.split(" - ")[0] || "-"}</TableCell>
                            <TableCell className="py-2 px-2 text-center">
                              {record.status === "active" ? (
                                <Badge className="bg-green-500 text-white text-[10px]">Active</Badge>
                              ) : (
                                <Badge variant="secondary" className="bg-gray-500 text-white text-[10px]">Reverted</Badge>
                              )}
                            </TableCell>
                            <TableCell className="py-2 px-2 text-center">
                              {record.status === "active" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRevert(record)}
                                  className="h-7 w-7 p-0 text-orange-500 hover:text-orange-700 hover:bg-orange-50"
                                  title="Revert Change"
                                >
                                  <RefreshCw className="h-3.5 w-3.5" />
                                </Button>
                              )}
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
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredHistory.length)} of {filteredHistory.length} entries
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
        </>
      )}
    </div>
  );
}