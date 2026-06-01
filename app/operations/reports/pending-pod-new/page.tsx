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
import { Calendar } from "@/components/ui/calendar";
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

export default function PendingPODReportNew() {
  const [loading, setLoading] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"grid" | "report">("report");
  
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
            <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select Zone" /></SelectTrigger>
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
            <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select State" /></SelectTrigger>
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
            <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select Region" /></SelectTrigger>
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
            <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select Hub" /></SelectTrigger>
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
            <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select Branch" /></SelectTrigger>
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
            <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select Agency" /></SelectTrigger>
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
      if (fromDate) data = data.filter(r => r.grDate >= fromDate);
      if (toDate) data = data.filter(r => r.grDate <= toDate);
      if (branchType === "ZONE" && selectedZone) data = data.filter(r => r.zone === selectedZone);
      if (branchType === "STATE" && selectedState) data = data.filter(r => r.state === selectedState);
      if (branchType === "REGION" && selectedRegion) data = data.filter(r => r.region === selectedRegion);
      if (branchType === "HUB" && selectedHub) data = data.filter(r => r.hub === selectedHub);
      if (branchType === "BRANCH" && selectedBranch) data = data.filter(r => r.branch === selectedBranch);
      if (branchType === "AGENCY" && selectedAgency) data = data.filter(r => r.agency === selectedAgency);
      if (selectedCustomer) data = data.filter(r => r.customer === selectedCustomer);
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
    alert(`Report sent via email with ${selectedRecords.length || filteredData.length} records!`);
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
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">PENDING POD REPORT NEW</h1>
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
              <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="ALL" /></SelectTrigger>
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
          
          {/* Select Branch - Always Visible */}
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
        
        {/* Second Row - Select Customer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
          <div className="space-y-1">
            <Label className="text-xs">Select Customer</Label>
            <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
              <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="ALL" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ALL</SelectItem>
                {customerOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* ALL Checkbox and Search Button */}
        <div className="flex flex-wrap justify-between items-center mt-4">
          <div className="flex items-center gap-2">
            <input type="checkbox" className="h-3.5 w-3.5" id="selectAllBranch" />
            <Label htmlFor="selectAllBranch" className="text-xs cursor-pointer">ALL</Label>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSearch} size="sm" className="h-8 text-xs" disabled={loading}>
              <Search className="mr-1 h-3.5 w-3.5" />
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-wrap justify-end gap-2">
        <Button onClick={() => setViewMode("grid")} variant={viewMode === "grid" ? "default" : "outline"} size="sm" className="h-8 text-xs">
          <Grid3x3 className="mr-1 h-3.5 w-3.5" /> Grid View
        </Button>
        <Button onClick={() => setViewMode("report")} variant={viewMode === "report" ? "default" : "outline"} size="sm" className="h-8 text-xs">
          <TableIcon className="mr-1 h-3.5 w-3.5" /> Report
        </Button>
        <Button onClick={handleSendReport} variant="outline" size="sm" className="h-8 text-xs">
          <Send className="mr-1 h-3.5 w-3.5" /> Send Report as Attachment on Mail
        </Button>
        <Button onClick={handleClose} variant="outline" size="sm" className="h-8 text-xs">
          <X className="mr-1 h-3.5 w-3.5" /> Close
        </Button>
      </div>
      
      {/* Summary Stats */}
      {filteredData.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 text-center">
            <p className="text-[10px] text-muted-foreground">Total Pending GRs</p>
            <p className="text-xl font-bold text-blue-600">{totalPendingGRs}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-3 text-center">
            <p className="text-[10px] text-muted-foreground">Total Packages</p>
            <p className="text-xl font-bold text-green-600">{totalPckgs}</p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-950/20 rounded-lg p-3 text-center">
            <p className="text-[10px] text-muted-foreground">Total Weight (kg)</p>
            <p className="text-xl font-bold text-orange-600">{totalWeight.toLocaleString()}</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-950/20 rounded-lg p-3 text-center">
            <p className="text-[10px] text-muted-foreground">Total Freight (₹)</p>
            <p className="text-xl font-bold text-purple-600">₹{totalFreight.toLocaleString()}</p>
          </div>
          <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-3 text-center">
            <p className="text-[10px] text-muted-foreground">Avg. Delay (Days)</p>
            <p className="text-xl font-bold text-red-600">{avgDelay}</p>
          </div>
        </div>
      )}
      
      {/* Report View Table */}
      {viewMode === "report" && filteredData.length > 0 && (
        <div className="rounded-md border overflow-x-auto">
          <div className="min-w-[1000px]">
            <Table className="text-xs">
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-8 text-center">
                    <input type="checkbox" checked={selectAll} onChange={handleSelectAll} className="h-3 w-3" />
                  </TableHead>
                  <TableHead>S#</TableHead>
                  <TableHead>GR #</TableHead>
                  <TableHead>GR Date</TableHead>
                  <TableHead>Origin</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Consignor</TableHead>
                  <TableHead>Consignee</TableHead>
                  <TableHead className="text-center">Pckgs</TableHead>
                  <TableHead className="text-right">Weight</TableHead>
                  <TableHead className="text-right">Freight</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Delay</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((record, idx) => (
                  <TableRow key={record.id} className="hover:bg-muted/30">
                    <TableCell className="text-center">
                      <input type="checkbox" checked={selectedRecords.includes(record.id)} onChange={() => handleSelectRecord(record.id)} className="h-3 w-3" />
                    </TableCell>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell className="font-mono">{record.grNo}</TableCell>
                    <TableCell>{format(record.grDate, "dd-MM-yyyy")}</TableCell>
                    <TableCell>{record.origin}</TableCell>
                    <TableCell>{record.destination}</TableCell>
                    <TableCell>{record.consignor}</TableCell>
                    <TableCell>{record.consignee}</TableCell>
                    <TableCell className="text-center">{record.pckgs}</TableCell>
                    <TableCell className="text-right">{record.weight}</TableCell>
                    <TableCell className="text-right">₹{record.freight.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px]">
                        {record.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-center text-red-600">{record.daysDelayed}</TableCell>
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
                <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px]">{record.status}</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <Truck className="h-3 w-3" />
                  <span>{record.origin} → {record.destination}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-3 w-3" />
                  <span>Pckgs: {record.pckgs} | Weight: {record.weight} kg</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-3 w-3" />
                  <span>{record.consignor} → {record.consignee}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-semibold">Freight: ₹{record.freight.toLocaleString()}</span>
                  <span className="text-red-600">Delay: {record.daysDelayed} days</span>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <input type="checkbox" checked={selectedRecords.includes(record.id)} onChange={() => handleSelectRecord(record.id)} className="h-3.5 w-3.5" id={`select-${record.id}`} />
                <Label htmlFor={`select-${record.id}`} className="text-xs cursor-pointer">Select</Label>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* No Data Message */}
      {filteredData.length === 0 && !loading && (
        <div className="text-center py-12 border rounded-md">
          <AlertCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground">No pending POD records found</p>
        </div>
      )}
      
      {/* Footer */}
      {filteredData.length > 0 && (
        <div className="flex justify-between items-center pt-2 border-t text-xs text-muted-foreground">
          <span>Total Records: {filteredData.length}</span>
          <span>Selected: {selectedRecords.length}</span>
        </div>
      )}
    </div>
  );
}