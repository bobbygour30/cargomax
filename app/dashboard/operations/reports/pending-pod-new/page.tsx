"use client";

import React, { useState } from "react";
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
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface PendingPODRecord {
  id: number;
  grNo: string;
  grDate: Date;
  origin: string;
  destination: string;
  consignor: string;
  consignee: string;
  pckgs: number;
  weight: number;
  freight: number;
  branch: string;
  zone: string;
  state: string;
  region: string;
  hub: string;
  agency: string;
  customer: string;
  status: string;
  daysDelayed: number;
}

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
const customerOptions = ["ABC Traders", "XYZ Enterprises", "PQR Ltd", "LMN Corp", "DEF Industries", "GHI Group", "JKL Solutions"];

const sampleData: PendingPODRecord[] = [
  { id: 1, grNo: "GR001", grDate: new Date("2026-04-20"), origin: "DELHI", destination: "MUMBAI", consignor: "ABC Traders", consignee: "XYZ Enterprises", pckgs: 50, weight: 2500, freight: 15000, branch: "DELHI", zone: "North Zone", state: "Delhi", region: "Delhi NCR", hub: "Delhi Hub", agency: "Agency A", customer: "ABC Traders", status: "Pending POD", daysDelayed: 5 },
  { id: 2, grNo: "GR002", grDate: new Date("2026-04-15"), origin: "MUMBAI", destination: "BANGALORE", consignor: "PQR Ltd", consignee: "LMN Corp", pckgs: 30, weight: 1800, freight: 12000, branch: "MUMBAI", zone: "West Zone", state: "Maharashtra", region: "Mumbai Region", hub: "Mumbai Hub", agency: "Agency B", customer: "PQR Ltd", status: "Pending POD", daysDelayed: 8 },
  { id: 3, grNo: "GR003", grDate: new Date("2026-04-10"), origin: "BANGALORE", destination: "CHENNAI", consignor: "DEF Industries", consignee: "GHI Group", pckgs: 25, weight: 1200, freight: 8000, branch: "BANGALORE", zone: "South Zone", state: "Karnataka", region: "Bangalore Region", hub: "Bangalore Hub", agency: "Agency C", customer: "DEF Industries", status: "Pending POD", daysDelayed: 12 },
  { id: 4, grNo: "GR004", grDate: new Date("2026-04-05"), origin: "CHENNAI", destination: "KOLKATA", consignor: "JKL Solutions", consignee: "MNO Corp", pckgs: 40, weight: 2000, freight: 10000, branch: "CHENNAI", zone: "South Zone", state: "Tamil Nadu", region: "Chennai Region", hub: "Chennai Hub", agency: "Agency D", customer: "JKL Solutions", status: "Pending POD", daysDelayed: 15 },
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
            Enter email details to send the pending POD report
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-sm font-medium">
              Subject <span className="text-red-500">*</span>
            </Label>
            <input
              id="subject"
              type="text"
              placeholder="Pending POD Report"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="body" className="text-sm font-medium">
              Body
            </Label>
            <Textarea
              id="body"
              placeholder="Please find attached the pending POD report..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
              className="resize-none text-sm"
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

export default function PendingPODReportNew() {
  const [loading, setLoading] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"grid" | "report">("report");
  const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);
  
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());
  const [branchType, setBranchType] = useState<string>("ALL");
  const [selectedZone, setSelectedZone] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedHub, setSelectedHub] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedAgency, setSelectedAgency] = useState<string>("");
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [selectedRecords, setSelectedRecords] = useState<number[]>([]);
  const [filteredData, setFilteredData] = useState<PendingPODRecord[]>([]);
  
  const handleBranchTypeChange = (value: string) => {
    setBranchType(value);
    setSelectedZone("");
    setSelectedState("");
    setSelectedRegion("");
    setSelectedHub("");
    setSelectedBranch("");
    setSelectedAgency("");
  };
  
  const renderBranchTypeDropdown = () => {
    switch (branchType) {
      case "ZONE":
        return (
          <Select value={selectedZone} onValueChange={setSelectedZone}>
            <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select Zone" /></SelectTrigger>
            <SelectContent>
              {zoneOptions.map((opt) => (
                <SelectItem key={opt} value={opt} className="text-sm">{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "STATE":
        return (
          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select State" /></SelectTrigger>
            <SelectContent>
              {stateOptions.map((opt) => (
                <SelectItem key={opt} value={opt} className="text-sm">{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "REGION":
        return (
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select Region" /></SelectTrigger>
            <SelectContent>
              {regionOptions.map((opt) => (
                <SelectItem key={opt} value={opt} className="text-sm">{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "HUB":
        return (
          <Select value={selectedHub} onValueChange={setSelectedHub}>
            <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select Hub" /></SelectTrigger>
            <SelectContent>
              {hubOptions.map((opt) => (
                <SelectItem key={opt} value={opt} className="text-sm">{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "BRANCH":
        return (
          <Select value={selectedBranch} onValueChange={setSelectedBranch}>
            <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select Branch" /></SelectTrigger>
            <SelectContent>
              {branchOptions.map((opt) => (
                <SelectItem key={opt} value={opt} className="text-sm">{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "AGENCY":
        return (
          <Select value={selectedAgency} onValueChange={setSelectedAgency}>
            <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select Agency" /></SelectTrigger>
            <SelectContent>
              {agencyOptions.map((opt) => (
                <SelectItem key={opt} value={opt} className="text-sm">{opt}</SelectItem>
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
      if (fromDate) data = data.filter(r => r.grDate >= fromDate);
      if (toDate) data = data.filter(r => r.grDate <= toDate);
      if (branchType === "ZONE" && selectedZone) data = data.filter(r => r.zone === selectedZone);
      if (branchType === "STATE" && selectedState) data = data.filter(r => r.state === selectedState);
      if (branchType === "REGION" && selectedRegion) data = data.filter(r => r.region === selectedRegion);
      if (branchType === "HUB" && selectedHub) data = data.filter(r => r.hub === selectedHub);
      if (branchType === "BRANCH" && selectedBranch) data = data.filter(r => r.branch === selectedBranch);
      if (branchType === "AGENCY" && selectedAgency) data = data.filter(r => r.agency === selectedAgency);
      if (selectedCustomer && selectedCustomer !== "all") data = data.filter(r => r.customer === selectedCustomer);
      setFilteredData(data);
      setSelectedRecords([]);
      setSelectAll(false);
      setLoading(false);
    }, 500);
  };
  
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRecords([]);
    } else {
      setSelectedRecords(filteredData.map(r => r.id));
    }
    setSelectAll(!selectAll);
  };
  
  const handleSelectRecord = (id: number) => {
    if (selectedRecords.includes(id)) {
      setSelectedRecords(selectedRecords.filter(rid => rid !== id));
    } else {
      setSelectedRecords([...selectedRecords, id]);
    }
  };
  
  const handleSendReport = () => {
    if (selectedRecords.length === 0 && filteredData.length === 0) {
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
    alert(`Report sent successfully to ${emailData.to} with ${selectedRecords.length || filteredData.length} records!`);
  };
  
  const handleClose = () => {
    setFromDate(new Date());
    setToDate(new Date());
    setBranchType("ALL");
    setSelectedZone("");
    setSelectedState("");
    setSelectedRegion("");
    setSelectedHub("");
    setSelectedBranch("");
    setSelectedAgency("");
    setSelectedCustomer("");
    setFilteredData([]);
    setSelectedRecords([]);
    setSelectAll(false);
  };
  
  const totalPendingGRs = filteredData.length;
  const totalPckgs = filteredData.reduce((sum, r) => sum + r.pckgs, 0);
  const totalWeight = filteredData.reduce((sum, r) => sum + r.weight, 0);
  const totalFreight = filteredData.reduce((sum, r) => sum + r.freight, 0);
  const avgDelay = filteredData.length > 0 ? (filteredData.reduce((sum, r) => sum + r.daysDelayed, 0) / filteredData.length).toFixed(1) : 0;
  
  return (
    <div className="space-y-4 p-3 md:p-4 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">PENDING POD REPORT</h1>
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
              <Filter className="h-4 w-4 text-gray-500" />
              <h3 className="text-sm font-semibold text-gray-800">Search Filters</h3>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Period */}
            <div className="space-y-1">
              <Label className="text-sm font-medium">Period</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-9 flex-1 text-sm justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(fromDate, "dd-MM-yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={fromDate} onSelect={(d) => d && setFromDate(d)} />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-9 flex-1 text-sm justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
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
              <Label className="text-sm font-medium">Select Branch Type</Label>
              <Select value={branchType} onValueChange={handleBranchTypeChange}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="ALL" />
                </SelectTrigger>
                <SelectContent>
                  {branchTypeOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-sm">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Dynamic Branch Type Dropdown */}
            {branchType !== "ALL" && (
              <div className="space-y-1">
                <Label className="text-sm font-medium">{branchType}</Label>
                {renderBranchTypeDropdown()}
              </div>
            )}

            {/* Select Branch */}
            <div className="space-y-1">
              <Label className="text-sm font-medium">Select Branch</Label>
              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger className="h-9 text-sm">
                  <Building2 className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ALL</SelectItem>
                  {branchOptions.map((opt) => (
                    <SelectItem key={opt} value={opt} className="text-sm">{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Second Row - Select Customer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Select Customer</Label>
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="ALL" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ALL</SelectItem>
                  {customerOptions.map((opt) => (
                    <SelectItem key={opt} value={opt} className="text-sm">{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Search Button */}
          <div className="flex justify-end">
            <Button onClick={handleSearch} className="h-9 bg-blue-600 hover:bg-blue-700 text-sm" disabled={loading}>
              <Search className="mr-2 h-4 w-4" />
              {loading ? "Searching..." : "Search"}
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
          className="h-8 text-sm"
        >
          <Grid3x3 className="mr-2 h-4 w-4" /> Grid View
        </Button>
        <Button
          onClick={() => setViewMode("report")}
          variant={viewMode === "report" ? "default" : "outline"}
          size="sm"
          className="h-8 text-sm"
        >
          <TableIcon className="mr-2 h-4 w-4" /> Report View
        </Button>
        <Button onClick={handleSendReport} variant="outline" size="sm" className="h-8 text-sm">
          <Send className="mr-2 h-4 w-4" /> Send Report
        </Button>
        <Button onClick={handleClose} variant="outline" size="sm" className="h-8 text-sm">
          <X className="mr-2 h-4 w-4" /> Close
        </Button>
      </div>

      {/* Summary Stats Cards */}
      {filteredData.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-3">
              <p className="text-[10px] opacity-90">Total Pending GRs</p>
              <p className="text-2xl font-bold">{totalPendingGRs}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-3">
              <p className="text-[10px] opacity-90">Total Packages</p>
              <p className="text-2xl font-bold">{totalPckgs}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-3">
              <p className="text-[10px] opacity-90">Total Weight (kg)</p>
              <p className="text-2xl font-bold">{totalWeight.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-3">
              <p className="text-[10px] opacity-90">Total Freight (₹)</p>
              <p className="text-2xl font-bold">₹{totalFreight.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-3">
              <p className="text-[10px] opacity-90">Avg. Delay (Days)</p>
              <p className="text-2xl font-bold">{avgDelay}</p>
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
                <TableIcon className="h-4 w-4 text-gray-500" />
                <h3 className="text-sm font-semibold text-gray-800">Pending POD Records</h3>
              </div>
              <div className="text-sm text-gray-500">
                Total: {filteredData.length} records
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <div className="min-w-[1000px]">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-8 text-center">
                        <input type="checkbox" checked={selectAll} onChange={handleSelectAll} className="h-4 w-4" />
                      </TableHead>
                      <TableHead className="text-sm font-semibold">#</TableHead>
                      <TableHead className="text-sm font-semibold">GR #</TableHead>
                      <TableHead className="text-sm font-semibold">GR Date</TableHead>
                      <TableHead className="text-sm font-semibold">Origin</TableHead>
                      <TableHead className="text-sm font-semibold">Destination</TableHead>
                      <TableHead className="text-sm font-semibold">Consignor</TableHead>
                      <TableHead className="text-sm font-semibold">Consignee</TableHead>
                      <TableHead className="text-sm font-semibold text-center">Pckgs</TableHead>
                      <TableHead className="text-sm font-semibold text-right">Weight</TableHead>
                      <TableHead className="text-sm font-semibold text-right">Freight</TableHead>
                      <TableHead className="text-sm font-semibold">Status</TableHead>
                      <TableHead className="text-sm font-semibold text-center">Delay</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((record, idx) => (
                      <TableRow key={record.id} className="hover:bg-gray-50">
                        <TableCell className="text-center">
                          <input type="checkbox" checked={selectedRecords.includes(record.id)} onChange={() => handleSelectRecord(record.id)} className="h-4 w-4" />
                        </TableCell>
                        <TableCell className="text-sm">{idx + 1}</TableCell>
                        <TableCell className="font-mono text-sm">{record.grNo}</TableCell>
                        <TableCell className="text-sm">{format(record.grDate, "dd-MM-yyyy")}</TableCell>
                        <TableCell className="text-sm">{record.origin}</TableCell>
                        <TableCell className="text-sm">{record.destination}</TableCell>
                        <TableCell className="text-sm">{record.consignor}</TableCell>
                        <TableCell className="text-sm">{record.consignee}</TableCell>
                        <TableCell className="text-center text-sm">{record.pckgs}</TableCell>
                        <TableCell className="text-right text-sm">{record.weight}</TableCell>
                        <TableCell className="text-right text-sm">₹{record.freight.toLocaleString()}</TableCell>
                        <TableCell className="text-sm">
                          <Badge className="bg-red-100 text-red-700 text-[11px]">
                            {record.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center text-sm text-red-600">{record.daysDelayed}</TableCell>
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
                    <p className="text-xs text-gray-500 mt-1">{format(record.grDate, "dd-MM-yyyy")}</p>
                  </div>
                  <Badge className="bg-red-100 text-red-700 text-[11px]">{record.status}</Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-gray-400" />
                    <span>{record.origin} → {record.destination}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-400" />
                    <span>Pckgs: {record.pckgs} | Weight: {record.weight} kg</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span>{record.consignor} → {record.consignee}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t mt-2">
                    <span className="font-semibold text-sm">Freight: ₹{record.freight.toLocaleString()}</span>
                    <span className="text-red-600 text-sm">Delay: {record.daysDelayed} days</span>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <input type="checkbox" checked={selectedRecords.includes(record.id)} onChange={() => handleSelectRecord(record.id)} className="h-4 w-4" id={`select-${record.id}`} />
                  <Label htmlFor={`select-${record.id}`} className="text-sm cursor-pointer">Select</Label>
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
            <p className="text-gray-500 text-sm">No pending POD records found</p>
            <p className="text-xs text-gray-400 mt-1">Please adjust your search criteria</p>
          </CardContent>
        </Card>
      )}

      {/* Footer */}
      {filteredData.length > 0 && (
        <div className="flex justify-between items-center pt-2 border-t text-sm text-gray-500">
          <span>Total Records: {filteredData.length}</span>
          <span>Selected: {selectedRecords.length}</span>
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