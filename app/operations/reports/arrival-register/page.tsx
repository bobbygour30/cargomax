// app/operations/reports/arrival-register/page.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import {
  CalendarIcon,
  Search,
  Grid3x3,
  Table as TableIcon,
  Send,
  X,
  AlertCircle,
  Truck,
  Package,
  MapPin,
  Users,
  Building2,
  Mail,
  Filter,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  RefreshCw ,
} from "lucide-react";
import { format } from "date-fns";

// Types
interface ArrivalRecord {
  id: number;
  grNo: string;
  grDate: Date;
  origin: string;
  destination: string;
  consignor: string;
  consignee: string;
  vehicleNo: string;
  driverName: string;
  pckgs: number;
  weight: number;
  arrivalDate: Date;
  arrivalTime: string;
  status: string;
  branch: string;
  zone: string;
  state: string;
  region: string;
  hub: string;
  agency: string;
}

// Options
const branchTypeOptions = [
  { value: "ALL", label: "ALL" },
  { value: "ZONE", label: "Zone" },
  { value: "STATE", label: "State" },
  { value: "REGION", label: "Region" },
  { value: "HUB", label: "Hub" },
  { value: "BRANCH", label: "Branch" },
  { value: "AGENCY", label: "Agency" },
];

const zoneOptions = ["North Zone", "South Zone", "East Zone", "West Zone", "Central Zone"];
const stateOptions = ["Delhi", "Maharashtra", "Karnataka", "Tamil Nadu", "West Bengal", "Uttar Pradesh", "Gujarat", "Rajasthan"];
const regionOptions = ["Delhi NCR", "Mumbai Region", "Bangalore Region", "Chennai Region", "Kolkata Region"];
const hubOptions = ["Delhi Hub", "Mumbai Hub", "Bangalore Hub", "Chennai Hub", "Kolkata Hub"];
const branchOptions = ["CORPORATE OFFICE", "DELHI", "MUMBAI", "BANGALORE", "CHENNAI", "KOLKATA", "AHMEDABAD", "PUNE", "HYDERABAD"];
const agencyOptions = ["Agency A", "Agency B", "Agency C", "Agency D", "Agency E"];
const originOptions = ["DELHI", "MUMBAI", "BANGALORE", "CHENNAI", "KOLKATA", "AHMEDABAD", "PUNE", "HYDERABAD", "LUCKNOW", "PATNA"];
const vehicleOptions = ["UP 32 AB 1234", "MH 01 CD 5678", "KA 03 EF 9012", "TN 04 GH 3456", "WB 05 IJ 7890", "HR 26 KL 1234", "GJ 01 MN 5678"];

// Sample Data
const sampleData: ArrivalRecord[] = [
  { id: 1, grNo: "GR001", grDate: new Date("2026-05-28"), origin: "DELHI", destination: "MUMBAI", consignor: "ABC Traders", consignee: "XYZ Enterprises", vehicleNo: "UP 32 AB 1234", driverName: "Rajesh Kumar", pckgs: 50, weight: 2500, arrivalDate: new Date("2026-06-01"), arrivalTime: "10:30 AM", status: "Arrived", branch: "DELHI", zone: "North Zone", state: "Delhi", region: "Delhi NCR", hub: "Delhi Hub", agency: "Agency A" },
  { id: 2, grNo: "GR002", grDate: new Date("2026-05-25"), origin: "MUMBAI", destination: "BANGALORE", consignor: "PQR Ltd", consignee: "LMN Corp", vehicleNo: "MH 01 CD 5678", driverName: "Suresh Patil", pckgs: 30, weight: 1800, arrivalDate: new Date("2026-06-01"), arrivalTime: "02:15 PM", status: "Arrived", branch: "MUMBAI", zone: "West Zone", state: "Maharashtra", region: "Mumbai Region", hub: "Mumbai Hub", agency: "Agency B" },
  { id: 3, grNo: "GR003", grDate: new Date("2026-05-20"), origin: "BANGALORE", destination: "CHENNAI", consignor: "DEF Industries", consignee: "GHI Group", vehicleNo: "KA 03 EF 9012", driverName: "Venkatesh", pckgs: 25, weight: 1200, arrivalDate: new Date("2026-06-01"), arrivalTime: "09:00 AM", status: "Arrived", branch: "BANGALORE", zone: "South Zone", state: "Karnataka", region: "Bangalore Region", hub: "Bangalore Hub", agency: "Agency C" },
  { id: 4, grNo: "GR004", grDate: new Date("2026-05-18"), origin: "CHENNAI", destination: "KOLKATA", consignor: "JKL Solutions", consignee: "MNO Corp", vehicleNo: "TN 04 GH 3456", driverName: "Murugan", pckgs: 40, weight: 2000, arrivalDate: new Date("2026-06-01"), arrivalTime: "11:45 AM", status: "Arrived", branch: "CHENNAI", zone: "South Zone", state: "Tamil Nadu", region: "Chennai Region", hub: "Chennai Hub", agency: "Agency D" },
  { id: 5, grNo: "GR005", grDate: new Date("2026-05-22"), origin: "KOLKATA", destination: "DELHI", consignor: "RST Group", consignee: "UVW Enterprises", vehicleNo: "WB 05 IJ 7890", driverName: "Sourav Das", pckgs: 35, weight: 1700, arrivalDate: new Date("2026-06-01"), arrivalTime: "04:20 PM", status: "Arrived", branch: "KOLKATA", zone: "East Zone", state: "West Bengal", region: "Kolkata Region", hub: "Kolkata Hub", agency: "Agency E" },
];

// Email Modal Component
function EmailModal({ isOpen, onClose, onSend }: { isOpen: boolean; onClose: () => void; onSend: (data: { to: string; subject: string; body: string }) => void }) {
  const [emailTo, setEmailTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const handleSend = () => {
    if (!emailTo) {
      alert("Please enter email address");
      return;
    }
    if (!subject) {
      alert("Please enter subject");
      return;
    }
    onSend({ to: emailTo, subject, body });
    setEmailTo("");
    setSubject("");
    setBody("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Send Report via Email
          </DialogTitle>
          <DialogDescription>
            Enter email details to send the arrival register report
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="emailTo" className="text-sm font-medium">
              Email To <span className="text-red-500">*</span>
            </Label>
            <input
              id="emailTo"
              type="email"
              placeholder="recipient@example.com"
              value={emailTo}
              onChange={(e) => setEmailTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-sm font-medium">
              Subject <span className="text-red-500">*</span>
            </Label>
            <input
              id="subject"
              type="text"
              placeholder="Arrival Register Report"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="body" className="text-sm font-medium">
              Body
            </Label>
            <Textarea
              id="body"
              placeholder="Please find attached the arrival register report..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
              className="resize-none"
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} className="h-9">
            Discard
          </Button>
          <Button onClick={handleSend} className="h-9 bg-blue-600 hover:bg-blue-700">
            <Send className="mr-2 h-4 w-4" />
            Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function ArrivalRegisterPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"grid" | "report">("report");
  const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);
  
  // Date states
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());
  
  // Filter states
  const [branchType, setBranchType] = useState<string>("ALL");
  const [selectedZone, setSelectedZone] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedHub, setSelectedHub] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedAgency, setSelectedAgency] = useState<string>("");
  const [selectedOrigin, setSelectedOrigin] = useState<string>("");
  const [selectedVehicle, setSelectedVehicle] = useState<string>("");
  const [selectAllOrigin, setSelectAllOrigin] = useState<boolean>(false);
  const [selectAllVehicle, setSelectAllVehicle] = useState<boolean>(false);
  
  const [filteredData, setFilteredData] = useState<ArrivalRecord[]>([]);

  const handleBranchTypeChange = (value: string) => {
    setBranchType(value);
    setSelectedZone("");
    setSelectedState("");
    setSelectedRegion("");
    setSelectedHub("");
    setSelectedBranch("");
    setSelectedAgency("");
  };

  const handleSelectAllOrigin = () => {
    setSelectAllOrigin(!selectAllOrigin);
    if (!selectAllOrigin) {
      setSelectedOrigin("ALL");
    } else {
      setSelectedOrigin("");
    }
  };

  const handleSelectAllVehicle = () => {
    setSelectAllVehicle(!selectAllVehicle);
    if (!selectAllVehicle) {
      setSelectedVehicle("ALL");
    } else {
      setSelectedVehicle("");
    }
  };

  const renderBranchTypeDropdown = () => {
    switch (branchType) {
      case "ZONE":
        return (
          <Select value={selectedZone} onValueChange={setSelectedZone}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select Zone" />
            </SelectTrigger>
            <SelectContent>
              {zoneOptions.map((opt) => (
                <SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "STATE":
        return (
          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent>
              {stateOptions.map((opt) => (
                <SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "REGION":
        return (
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select Region" />
            </SelectTrigger>
            <SelectContent>
              {regionOptions.map((opt) => (
                <SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "HUB":
        return (
          <Select value={selectedHub} onValueChange={setSelectedHub}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select Hub" />
            </SelectTrigger>
            <SelectContent>
              {hubOptions.map((opt) => (
                <SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "BRANCH":
        return (
          <Select value={selectedBranch} onValueChange={setSelectedBranch}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select Branch" />
            </SelectTrigger>
            <SelectContent>
              {branchOptions.map((opt) => (
                <SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "AGENCY":
        return (
          <Select value={selectedAgency} onValueChange={setSelectedAgency}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select Agency" />
            </SelectTrigger>
            <SelectContent>
              {agencyOptions.map((opt) => (
                <SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return null;
    }
  };

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      let data = [...sampleData];
      
      // Date filters
      if (fromDate) {
        data = data.filter(r => r.arrivalDate >= fromDate);
      }
      if (toDate) {
        data = data.filter(r => r.arrivalDate <= toDate);
      }
      
      // Branch type filters
      if (branchType === "ZONE" && selectedZone) data = data.filter(r => r.zone === selectedZone);
      if (branchType === "STATE" && selectedState) data = data.filter(r => r.state === selectedState);
      if (branchType === "REGION" && selectedRegion) data = data.filter(r => r.region === selectedRegion);
      if (branchType === "HUB" && selectedHub) data = data.filter(r => r.hub === selectedHub);
      if (branchType === "BRANCH" && selectedBranch) data = data.filter(r => r.branch === selectedBranch);
      if (branchType === "AGENCY" && selectedAgency) data = data.filter(r => r.agency === selectedAgency);
      
      // Origin filter
      if (selectedOrigin && selectedOrigin !== "ALL") {
        data = data.filter(r => r.origin === selectedOrigin);
      }
      
      // Vehicle filter
      if (selectedVehicle && selectedVehicle !== "ALL") {
        data = data.filter(r => r.vehicleNo === selectedVehicle);
      }
      
      setFilteredData(data);
      setLoading(false);
    }, 500);
  };

  const handleClear = () => {
    setFromDate(new Date());
    setToDate(new Date());
    setBranchType("ALL");
    setSelectedZone("");
    setSelectedState("");
    setSelectedRegion("");
    setSelectedHub("");
    setSelectedBranch("");
    setSelectedAgency("");
    setSelectedOrigin("");
    setSelectedVehicle("");
    setSelectAllOrigin(false);
    setSelectAllVehicle(false);
    setFilteredData([]);
  };

  const handleSendReport = () => {
    if (filteredData.length === 0) {
      alert("No records to send. Please search for data first.");
      return;
    }
    setIsEmailModalOpen(true);
  };

  const handleEmailSend = (emailData: { to: string; subject: string; body: string }) => {
    console.log("Sending email to:", emailData.to);
    console.log("Subject:", emailData.subject);
    console.log("Body:", emailData.body);
    console.log("Data:", filteredData);
    alert(`Report sent successfully to ${emailData.to} with ${filteredData.length} records!`);
  };

  // Summary Stats
  const totalArrivals = filteredData.length;
  const totalPckgs = filteredData.reduce((sum, r) => sum + r.pckgs, 0);
  const totalWeight = filteredData.reduce((sum, r) => sum + r.weight, 0);

  return (
    <div className="space-y-4 p-3 md:p-4 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">ARRIVAL REGISTER REPORT</h1>
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

      {/* Filter Section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-3.5 w-3.5 text-gray-500" />
              <h3 className="text-[11px] font-semibold text-gray-800">Search Filters</h3>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Period */}
            <div className="space-y-1">
              <Label className="text-[10px] font-medium">Period</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-7 flex-1 text-[10px]">
                      <CalendarIcon className="mr-1 h-3 w-3" />
                      {format(fromDate, "dd-MM-yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={fromDate} onSelect={(d) => d && setFromDate(d)} />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-7 flex-1 text-[10px]">
                      <CalendarIcon className="mr-1 h-3 w-3" />
                      {format(toDate, "dd-MM-yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={toDate} onSelect={(d) => d && setToDate(d)} />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Select Branch Type */}
            <div className="space-y-1">
              <Label className="text-[10px] font-medium">Select Branch Type</Label>
              <Select value={branchType} onValueChange={handleBranchTypeChange}>
                <SelectTrigger className="h-7 text-[10px]">
                  <SelectValue placeholder="ALL" />
                </SelectTrigger>
                <SelectContent>
                  {branchTypeOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-xs">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Dynamic Branch Type Dropdown */}
            {branchType !== "ALL" && (
              <div className="space-y-1">
                <Label className="text-[10px] font-medium">{branchType}</Label>
                {renderBranchTypeDropdown()}
              </div>
            )}

            {/* Select Branch */}
            <div className="space-y-1">
              <Label className="text-[10px] font-medium">Select Branch</Label>
              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger className="h-7 text-[10px]">
                  <Building2 className="mr-1 h-3 w-3" />
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ALL</SelectItem>
                  {branchOptions.map((opt) => (
                    <SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Second Row - Select Origin with ALL Checkbox */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] font-medium">Select Origin</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectAllOrigin}
                    onChange={handleSelectAllOrigin}
                    className="h-3 w-3"
                    id="selectAllOrigin"
                  />
                  <Label htmlFor="selectAllOrigin" className="text-[10px] cursor-pointer">ALL</Label>
                </div>
              </div>
              <Select value={selectedOrigin} onValueChange={setSelectedOrigin}>
                <SelectTrigger className="h-7 text-[10px]">
                  <MapPin className="mr-1 h-3 w-3" />
                  <SelectValue placeholder="Select Origin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">ALL</SelectItem>
                  {originOptions.map((opt) => (
                    <SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Select Vehicle with ALL Checkbox */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] font-medium">Select Vehicle</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectAllVehicle}
                    onChange={handleSelectAllVehicle}
                    className="h-3 w-3"
                    id="selectAllVehicle"
                  />
                  <Label htmlFor="selectAllVehicle" className="text-[10px] cursor-pointer">ALL</Label>
                </div>
              </div>
              <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                <SelectTrigger className="h-7 text-[10px]">
                  <Truck className="mr-1 h-3 w-3" />
                  <SelectValue placeholder="Select Vehicle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">ALL</SelectItem>
                  {vehicleOptions.map((opt) => (
                    <SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Search and Clear Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <Button onClick={handleSearch} size="sm" className="h-7 text-[10px] bg-blue-600 hover:bg-blue-700" disabled={loading}>
              <Search className="mr-1 h-3 w-3" />
              {loading ? "Searching..." : "Search"}
            </Button>
            <Button onClick={handleClear} variant="outline" size="sm" className="h-7 text-[10px]">
              <RefreshCw className="mr-1 h-3 w-3" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-end gap-2">
        <Button
          onClick={() => setViewMode("grid")}
          variant={viewMode === "grid" ? "default" : "outline"}
          size="sm"
          className="h-7 text-[10px]"
        >
          <Grid3x3 className="mr-1 h-3 w-3" /> Grid View
        </Button>
        <Button
          onClick={() => setViewMode("report")}
          variant={viewMode === "report" ? "default" : "outline"}
          size="sm"
          className="h-7 text-[10px]"
        >
          <TableIcon className="mr-1 h-3 w-3" /> Report View
        </Button>
        <Button onClick={handleSendReport} variant="outline" size="sm" className="h-7 text-[10px]">
          <Send className="mr-1 h-3 w-3" /> Send Report
        </Button>
      </div>

      {/* Summary Stats Cards */}
      {filteredData.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] opacity-90">Total Arrivals</p>
                  <p className="text-2xl font-bold">{totalArrivals}</p>
                </div>
                <Truck className="h-6 w-6 opacity-80" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] opacity-90">Total Packages</p>
                  <p className="text-2xl font-bold">{totalPckgs}</p>
                </div>
                <Package className="h-6 w-6 opacity-80" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] opacity-90">Total Weight (kg)</p>
                  <p className="text-2xl font-bold">{totalWeight.toLocaleString()}</p>
                </div>
                <Clock className="h-6 w-6 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Report View Table */}
      {viewMode === "report" && filteredData.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <TableIcon className="h-3.5 w-3.5 text-gray-500" />
                <h3 className="text-[11px] font-semibold text-gray-800">
                  Arrival Records
                </h3>
              </div>
              <div className="text-[10px] text-gray-500">
                Total: {filteredData.length} records
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <div className="min-w-[1200px]">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="text-[11px] font-semibold py-2 px-2 w-12 text-center">#</TableHead>
                      <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[80px]">GR #</TableHead>
                      <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[80px]">GR Date</TableHead>
                      <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[80px]">Origin</TableHead>
                      <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[80px]">Destination</TableHead>
                      <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Consignor</TableHead>
                      <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Consignee</TableHead>
                      <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Vehicle No</TableHead>
                      <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Driver</TableHead>
                      <TableHead className="text-[11px] font-semibold py-2 px-2 w-16 text-center">Pckgs</TableHead>
                      <TableHead className="text-[11px] font-semibold py-2 px-2 w-20 text-right">Weight</TableHead>
                      <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[80px]">Arrival Date</TableHead>
                      <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[80px]">Arrival Time</TableHead>
                      <TableHead className="text-[11px] font-semibold py-2 px-2 w-20 text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((record, idx) => (
                      <TableRow key={record.id} className="hover:bg-gray-50">
                        <TableCell className="py-2 px-2 text-center text-xs">{idx + 1}</TableCell>
                        <TableCell className="py-2 px-2 font-mono text-xs">{record.grNo}</TableCell>
                        <TableCell className="py-2 px-2 text-xs">{format(record.grDate, "dd-MM-yyyy")}</TableCell>
                        <TableCell className="py-2 px-2 text-xs">{record.origin}</TableCell>
                        <TableCell className="py-2 px-2 text-xs">{record.destination}</TableCell>
                        <TableCell className="py-2 px-2 text-xs">{record.consignor}</TableCell>
                        <TableCell className="py-2 px-2 text-xs">{record.consignee}</TableCell>
                        <TableCell className="py-2 px-2 font-mono text-xs">{record.vehicleNo}</TableCell>
                        <TableCell className="py-2 px-2 text-xs">{record.driverName}</TableCell>
                        <TableCell className="py-2 px-2 text-center text-xs">{record.pckgs}</TableCell>
                        <TableCell className="py-2 px-2 text-right text-xs">{record.weight}</TableCell>
                        <TableCell className="py-2 px-2 text-xs">{format(record.arrivalDate, "dd-MM-yyyy")}</TableCell>
                        <TableCell className="py-2 px-2 text-xs">{record.arrivalTime}</TableCell>
                        <TableCell className="py-2 px-2 text-center">
                          <Badge className="bg-green-100 text-green-700 text-[10px] hover:bg-green-100">
                            {record.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grid View */}
      {viewMode === "grid" && filteredData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredData.map((record) => (
            <Card key={record.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <h3 className="font-semibold text-sm">{record.grNo}</h3>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1">{format(record.grDate, "dd-MM-yyyy")}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-700 text-[10px]">Arrived</Badge>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-gray-400" />
                    <span>{record.origin} → {record.destination}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-3 w-3 text-gray-400" />
                    <span className="font-mono">{record.vehicleNo}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-3 w-3 text-gray-400" />
                    <span>{record.driverName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-3 w-3 text-gray-400" />
                    <span>Pckgs: {record.pckgs} | Weight: {record.weight} kg</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t mt-2">
                    <span className="text-[10px] text-gray-500">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {format(record.arrivalDate, "dd-MM-yyyy")}
                    </span>
                    <span className="text-[10px] text-gray-500">{record.arrivalTime}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No Data Message */}
      {filteredData.length === 0 && !loading && (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-500 text-sm">No arrival records found</p>
            <p className="text-xs text-gray-400 mt-1">Please adjust your search criteria</p>
          </CardContent>
        </Card>
      )}

      {/* Footer */}
      {filteredData.length > 0 && (
        <div className="flex justify-between items-center pt-2 border-t text-[10px] text-gray-500">
          <span>Total Records: {filteredData.length}</span>
          <span>Last Updated: {format(new Date(), "dd-MM-yyyy HH:mm:ss")}</span>
        </div>
      )}

      {/* Email Modal */}
      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        onSend={handleEmailSend}
      />
    </div>
  );
}