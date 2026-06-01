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
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
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
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
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
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
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
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
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
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
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
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
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
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">ARRIVAL REGISTER REPORT</h1>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[10px] md:text-xs text-muted-foreground">
          <span>Company : GOLDEN ROADWAYS & LOGISTICS PVT LTD</span>
          <span>Login By : MAYANK.GRLOGISTICS@GMAIL.COM</span>
          <span>Login Branch : CORPORATE OFFICE</span>
          <span>Financial Year : 2026-2027</span>
        </div>
      </div>

      {/* Filter Section */}
      <div className="p-4 border rounded-md bg-muted/20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Period */}
          <div className="space-y-1">
            <Label className="text-xs">Period</Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-8 flex-1 text-xs">
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
                  <Button variant="outline" className="h-8 flex-1 text-xs">
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
            <Label className="text-xs">Select Branch Type</Label>
            <Select value={branchType} onValueChange={handleBranchTypeChange}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="ALL" />
              </SelectTrigger>
              <SelectContent>
                {branchTypeOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dynamic Branch Type Dropdown */}
          {branchType !== "ALL" && (
            <div className="space-y-1">
              <Label className="text-xs">{branchType}</Label>
              {renderBranchTypeDropdown()}
            </div>
          )}

          {/* Select Branch */}
          <div className="space-y-1">
            <Label className="text-xs">Select Branch</Label>
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger className="h-8 text-xs">
                <Building2 className="mr-1 h-3 w-3" />
                <SelectValue placeholder="Select Branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ALL</SelectItem>
                {branchOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Second Row - Select Origin with ALL Checkbox */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Select Origin</Label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectAllOrigin}
                  onChange={handleSelectAllOrigin}
                  className="h-3 w-3"
                  id="selectAllOrigin"
                />
                <Label htmlFor="selectAllOrigin" className="text-xs cursor-pointer">ALL</Label>
              </div>
            </div>
            <Select value={selectedOrigin} onValueChange={setSelectedOrigin}>
              <SelectTrigger className="h-8 text-xs">
                <MapPin className="mr-1 h-3 w-3" />
                <SelectValue placeholder="Select Origin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">ALL</SelectItem>
                {originOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Select Vehicle with ALL Checkbox */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Select Vehicle</Label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectAllVehicle}
                  onChange={handleSelectAllVehicle}
                  className="h-3 w-3"
                  id="selectAllVehicle"
                />
                <Label htmlFor="selectAllVehicle" className="text-xs cursor-pointer">ALL</Label>
              </div>
            </div>
            <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
              <SelectTrigger className="h-8 text-xs">
                <Truck className="mr-1 h-3 w-3" />
                <SelectValue placeholder="Select Vehicle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">ALL</SelectItem>
                {vehicleOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search and Clear Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={handleSearch} size="sm" className="h-8 text-xs" disabled={loading}>
            <Search className="mr-1 h-3.5 w-3.5" />
            {loading ? "Searching..." : "Search"}
          </Button>
          <Button onClick={handleClear} variant="outline" size="sm" className="h-8 text-xs">
            <X className="mr-1 h-3.5 w-3.5" />
            Clear
          </Button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-end gap-2">
        <Button
          onClick={() => setViewMode("grid")}
          variant={viewMode === "grid" ? "default" : "outline"}
          size="sm"
          className="h-8 text-xs"
        >
          <Grid3x3 className="mr-1 h-3.5 w-3.5" /> Grid View
        </Button>
        <Button
          onClick={() => setViewMode("report")}
          variant={viewMode === "report" ? "default" : "outline"}
          size="sm"
          className="h-8 text-xs"
        >
          <TableIcon className="mr-1 h-3.5 w-3.5" /> Report
        </Button>
        <Button onClick={handleSendReport} variant="outline" size="sm" className="h-8 text-xs">
          <Send className="mr-1 h-3.5 w-3.5" /> Send Report as Attachment on Mail
        </Button>
      </div>

      {/* Summary Stats */}
      {filteredData.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 text-center">
            <p className="text-[10px] text-muted-foreground">Total Arrivals</p>
            <p className="text-xl font-bold text-blue-600">{totalArrivals}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-3 text-center">
            <p className="text-[10px] text-muted-foreground">Total Packages</p>
            <p className="text-xl font-bold text-green-600">{totalPckgs}</p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-950/20 rounded-lg p-3 text-center">
            <p className="text-[10px] text-muted-foreground">Total Weight (kg)</p>
            <p className="text-xl font-bold text-orange-600">{totalWeight.toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Report View Table */}
      {viewMode === "report" && filteredData.length > 0 && (
        <div className="rounded-md border overflow-x-auto">
          <div className="min-w-[1200px]">
            <Table className="text-xs">
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>S#</TableHead>
                  <TableHead>GR #</TableHead>
                  <TableHead>GR Date</TableHead>
                  <TableHead>Origin</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Consignor</TableHead>
                  <TableHead>Consignee</TableHead>
                  <TableHead>Vehicle No</TableHead>
                  <TableHead>Driver Name</TableHead>
                  <TableHead className="text-center">Pckgs</TableHead>
                  <TableHead className="text-right">Weight</TableHead>
                  <TableHead>Arrival Date</TableHead>
                  <TableHead>Arrival Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((record, idx) => (
                  <TableRow key={record.id} className="hover:bg-muted/30">
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell className="font-mono">{record.grNo}</TableCell>
                    <TableCell>{format(record.grDate, "dd-MM-yyyy")}</TableCell>
                    <TableCell>{record.origin}</TableCell>
                    <TableCell>{record.destination}</TableCell>
                    <TableCell>{record.consignor}</TableCell>
                    <TableCell>{record.consignee}</TableCell>
                    <TableCell className="font-mono">{record.vehicleNo}</TableCell>
                    <TableCell>{record.driverName}</TableCell>
                    <TableCell className="text-center">{record.pckgs}</TableCell>
                    <TableCell className="text-right">{record.weight}</TableCell>
                    <TableCell>{format(record.arrivalDate, "dd-MM-yyyy")}</TableCell>
                    <TableCell>{record.arrivalTime}</TableCell>
                    <TableCell>
                      <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px]">
                        {record.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Grid View */}
      {viewMode === "grid" && filteredData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredData.map((record) => (
            <div key={record.id} className="border rounded-lg p-4 hover:shadow-md">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-sm">{record.grNo}</h3>
                  <p className="text-[10px] text-muted-foreground">{format(record.grDate, "dd-MM-yyyy")}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px]">Arrived</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3" />
                  <span>{record.origin} → {record.destination}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-3 w-3" />
                  <span>{record.vehicleNo}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-3 w-3" />
                  <span>{record.driverName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-3 w-3" />
                  <span>Pckgs: {record.pckgs} | Weight: {record.weight} kg</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span>Arrival: {format(record.arrivalDate, "dd-MM-yyyy")}</span>
                  <span>{record.arrivalTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Data Message */}
      {filteredData.length === 0 && !loading && (
        <div className="text-center py-12 border rounded-md">
          <AlertCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground">No arrival records found</p>
          <p className="text-xs text-muted-foreground mt-1">Please adjust your search criteria</p>
        </div>
      )}

      {/* Footer */}
      {filteredData.length > 0 && (
        <div className="flex justify-between items-center pt-2 border-t text-xs text-muted-foreground">
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