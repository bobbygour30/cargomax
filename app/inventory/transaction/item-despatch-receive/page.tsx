"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Eye, Settings, Search, RefreshCw, Truck, CheckCircle, XCircle, Clock, Filter, ChevronRight } from "lucide-react";

// ==================== TYPE DEFINITIONS ====================

interface DespatchRecord {
  id: number;
  sNo: number;
  despatchId: string;
  despatchFrom: string;
  despatchedTo: string;
  despatchOn: string;
  courierVendor: string;
  wayBillNo: string;
  date: string;
  noOfItems: number;
  status: "Pending" | "Received" | "In Transit" | "Delayed";
  receivedOn: string;
  receivedBy: string;
}

// ==================== MOCK DATA ====================

const initialDespatchData: DespatchRecord[] = [
  { id: 1, sNo: 1, despatchId: "DISP/2026-27/001", despatchFrom: "HEAD OFFICE", despatchedTo: "JAGADARI", despatchOn: "25-05-2026", courierVendor: "DTDC", wayBillNo: "WB123456", date: "25-05-2026", noOfItems: 5, status: "Pending", receivedOn: "", receivedBy: "" },
  { id: 2, sNo: 2, despatchId: "DISP/2026-27/002", despatchFrom: "HEAD OFFICE", despatchedTo: "CHANDIGARH (GANESH)", despatchOn: "26-05-2026", courierVendor: "BLUEDART", wayBillNo: "WB789012", date: "26-05-2026", noOfItems: 3, status: "In Transit", receivedOn: "", receivedBy: "" },
  { id: 3, sNo: 3, despatchId: "DISP/2026-27/003", despatchFrom: "HEAD OFFICE", despatchedTo: "LUDHIANA", despatchOn: "27-05-2026", courierVendor: "DELHIVERY", wayBillNo: "WB345678", date: "27-05-2026", noOfItems: 8, status: "Pending", receivedOn: "", receivedBy: "" },
  { id: 4, sNo: 4, despatchId: "DISP/2026-27/004", despatchFrom: "HEAD OFFICE", despatchedTo: "JAGADARI", despatchOn: "27-05-2025", courierVendor: "", wayBillNo: "", date: "27-05-2025", noOfItems: 1, status: "Received", receivedOn: "27-05-2025", receivedBy: "MAYANK.GRLOGISTICS@GMAIL.COM" },
  { id: 5, sNo: 5, despatchId: "DISP/2026-27/005", despatchFrom: "HEAD OFFICE", despatchedTo: "CHANDIGARH (GANESH)", despatchOn: "27-05-2025", courierVendor: "", wayBillNo: "", date: "27-05-2025", noOfItems: 1, status: "Received", receivedOn: "27-05-2025", receivedBy: "MAYANK.GRLOGISTICS@GMAIL.COM" },
  { id: 6, sNo: 6, despatchId: "DISP/2026-27/006", despatchFrom: "HEAD OFFICE", despatchedTo: "PANIPAT", despatchOn: "28-05-2026", courierVendor: "PROFESSIONAL COURIER", wayBillNo: "WB901234", date: "28-05-2026", noOfItems: 4, status: "Pending", receivedOn: "", receivedBy: "" },
];

// Dropdown options
const branchOptions = ["HEAD OFFICE", "DELHI BRANCH", "MUMBAI BRANCH", "BANGALORE BRANCH", "CHANDIGARH BRANCH"];
const courierVendorOptions = ["DTDC", "BLUEDART", "DELHIVERY", "PROFESSIONAL COURIER", "FEDEX", "DHL", "XPRESSBEES"];

export default function ItemDespatchReceive() {
  // ==================== PENDING TAB STATE ====================
  const [pendingBranchName, setPendingBranchName] = useState("");
  const [asOnDate, setAsOnDate] = useState<Date>(new Date(2026, 4, 18));
  const [pendingRecords, setPendingRecords] = useState<DespatchRecord[]>([]);
  const [showPendingGrid, setShowPendingGrid] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // ==================== SEARCH TAB STATE ====================
  const [searchRecords, setSearchRecords] = useState<DespatchRecord[]>(initialDespatchData);
  const [filteredSearchRecords, setFilteredSearchRecords] = useState<DespatchRecord[]>(initialDespatchData);
  const [searchInput, setSearchInput] = useState("");

  // Active tab
  const [activeTab, setActiveTab] = useState("pending");

  // Column visibility settings for both tabs
  const [pendingColumnSettings, setPendingColumnSettings] = useState({
    sNo: true,
    despatchId: true,
    despatchFrom: true,
    despatchedTo: true,
    despatchOn: true,
    courierVendor: true,
    wayBillNo: true,
    date: true,
    noOfItems: true,
    status: true,
    receivedOn: true,
    received: true,
  });

  const [searchColumnSettings, setSearchColumnSettings] = useState({
    sNo: true,
    despatchId: true,
    despatchFrom: true,
    despatchedTo: true,
    despatchOn: true,
    courierVendor: true,
    wayBillNo: true,
    date: true,
    noOfItems: true,
    status: true,
    receivedOn: true,
    receivedBy: true,
  });

  // ==================== FUNCTIONS ====================

  // Handle Proceed button in Pending Tab
  const handleProceed = () => {
    if (!pendingBranchName) {
      alert("Please select Branch Name");
      return;
    }

    // Filter records that are not received and match the branch
    const filtered = initialDespatchData.filter(record => 
      record.status !== "Received" && 
      record.despatchFrom === pendingBranchName
    );
    
    setPendingRecords(filtered);
    setShowPendingGrid(true);
  };

  // Handle Receive action
  const handleReceive = (record: DespatchRecord) => {
    const confirmed = confirm(`Are you sure you want to mark despatch ${record.despatchId} as received?`);
    if (confirmed) {
      // Update the record status
      const updatedRecord = {
        ...record,
        status: "Received" as const,
        receivedOn: format(new Date(), "dd-MM-yyyy"),
        receivedBy: "CURRENT_USER@GMAIL.COM"
      };
      
      // Update in pending records
      setPendingRecords(prevRecords => 
        prevRecords.map(r => r.id === record.id ? updatedRecord : r)
      );
      
      // Update in master data
      const index = initialDespatchData.findIndex(r => r.id === record.id);
      if (index !== -1) {
        initialDespatchData[index] = updatedRecord;
      }
      
      // Also update search records
      setSearchRecords([...initialDespatchData]);
      setFilteredSearchRecords([...initialDespatchData]);
      
      alert(`Despatch ${record.despatchId} has been marked as received successfully!`);
    }
  };

  // Handle Search in Pending Tab
  const handlePendingSearch = () => {
    if (!searchTerm.trim()) {
      setPendingRecords(initialDespatchData.filter(r => r.status !== "Received" && r.despatchFrom === pendingBranchName));
    } else {
      const filtered = pendingRecords.filter(record =>
        record.despatchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.despatchedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.wayBillNo.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setPendingRecords(filtered);
    }
  };

  const clearPendingSearch = () => {
    setSearchTerm("");
    handleProceed();
  };

  // Handle Search in Search Tab
  const handleSearchTabSearch = () => {
    if (!searchInput.trim()) {
      setFilteredSearchRecords(searchRecords);
    } else {
      const filtered = searchRecords.filter(record =>
        record.despatchId.toLowerCase().includes(searchInput.toLowerCase()) ||
        record.despatchFrom.toLowerCase().includes(searchInput.toLowerCase()) ||
        record.despatchedTo.toLowerCase().includes(searchInput.toLowerCase()) ||
        record.wayBillNo.toLowerCase().includes(searchInput.toLowerCase()) ||
        record.courierVendor.toLowerCase().includes(searchInput.toLowerCase())
      );
      setFilteredSearchRecords(filtered);
    }
  };

  const clearSearchTabSearch = () => {
    setSearchInput("");
    setFilteredSearchRecords(searchRecords);
  };

  // Handle Cancel in Search Tab
  const handleCancel = (record: DespatchRecord) => {
    const confirmed = confirm(`Are you sure you want to cancel despatch ${record.despatchId}? This action cannot be undone.`);
    if (confirmed) {
      // Update status to cancelled or remove
      alert(`Despatch ${record.despatchId} has been cancelled.`);
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Received":
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Received</span>;
      case "Pending":
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"><Clock className="h-3 w-3" /> Pending</span>;
      case "In Transit":
        return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"><Truck className="h-3 w-3" /> In Transit</span>;
      case "Delayed":
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"><XCircle className="h-3 w-3" /> Delayed</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-primary">ITEM DESPATCH RECEIVE</h1>
        <div className="text-xs text-muted-foreground mt-1">
          Company : GOLDEN ROADWAYS &amp; LOGISTICS PVT LTD | Login By : ADMIN@GMAIL.COM
          <br />
          Login Branch : HEAD OFFICE | Financial Year : 2026-2027
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
        </TabsList>

        {/* ==================== PENDING TAB ==================== */}
        <TabsContent value="pending" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                Pending Despatch Receive
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Filter Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label>Branch Name <span className="text-red-500">*</span></Label>
                  <Select value={pendingBranchName} onValueChange={setPendingBranchName}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branchOptions.map((branch) => (
                        <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>As On Date <span className="text-red-500">*</span></Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(asOnDate, "dd-MM-yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={asOnDate} onSelect={(d) => d && setAsOnDate(d)} />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex gap-3 mb-6">
                <Button onClick={handleProceed} className="bg-blue-600 hover:bg-blue-700">
                  <ChevronRight className="mr-2 h-4 w-4" /> Proceed
                </Button>
              </div>

              {/* Search Bar - Only shown after proceed */}
              {showPendingGrid && (
                <>
                  <div className="flex gap-3 mb-4">
                    <div className="flex-1">
                      <Input
                        type="text"
                        placeholder="Search by Despatch ID, Despatched To, WayBill #..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handlePendingSearch()}
                      />
                    </div>
                    <Button onClick={handlePendingSearch} className="bg-green-600 hover:bg-green-700">
                      <Search className="mr-2 h-4 w-4" /> Search
                    </Button>
                    <Button variant="outline" onClick={clearPendingSearch}>
                      <RefreshCw className="mr-2 h-4 w-4" /> Clear
                    </Button>
                  </div>

                  {/* Column Settings */}
                  <div className="mb-4 p-3 bg-gray-100 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Settings className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium">Column Settings</span>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {Object.keys(pendingColumnSettings).map((key) => (
                        <div key={key} className="flex items-center gap-2">
                          <Checkbox
                            checked={pendingColumnSettings[key as keyof typeof pendingColumnSettings]}
                            onCheckedChange={(c) => setPendingColumnSettings({ ...pendingColumnSettings, [key]: !!c })}
                          />
                          <Label className="text-sm cursor-pointer">
                            {key === "despatchId" ? "Despatch ID" :
                             key === "despatchFrom" ? "Despatch From" :
                             key === "despatchedTo" ? "Despatched To" :
                             key === "despatchOn" ? "Despatch on" :
                             key === "courierVendor" ? "Courier Vendor" :
                             key === "wayBillNo" ? "WayBill #" :
                             key === "noOfItems" ? "No of Items" :
                             key === "receivedOn" ? "Received On" :
                             key === "received" ? "Received" :
                             key.replace(/([A-Z])/g, ' $1').trim()}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pending Despatch Table */}
                  <div className="overflow-x-auto border rounded-lg">
                    <Table>
                      <TableHeader className="bg-gray-100">
                        <TableRow>
                          {pendingColumnSettings.sNo && <TableHead className="w-16">S#</TableHead>}
                          {pendingColumnSettings.despatchId && <TableHead>Despatch ID</TableHead>}
                          {pendingColumnSettings.despatchFrom && <TableHead>Despatch From</TableHead>}
                          {pendingColumnSettings.despatchedTo && <TableHead>Despatched To</TableHead>}
                          {pendingColumnSettings.despatchOn && <TableHead>Despatch on</TableHead>}
                          {pendingColumnSettings.courierVendor && <TableHead>Courier Vendor</TableHead>}
                          {pendingColumnSettings.wayBillNo && <TableHead>WayBill #</TableHead>}
                          {pendingColumnSettings.date && <TableHead>Date</TableHead>}
                          {pendingColumnSettings.noOfItems && <TableHead>No of Items</TableHead>}
                          {pendingColumnSettings.status && <TableHead>Status</TableHead>}
                          {pendingColumnSettings.receivedOn && <TableHead>Received On</TableHead>}
                          {pendingColumnSettings.received && <TableHead>Received</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingRecords.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={12} className="text-center py-8 text-gray-500">
                              No pending despatch records found for the selected branch.
                            </TableCell>
                          </TableRow>
                        ) : (
                          pendingRecords.map((record) => (
                            <TableRow key={record.id} className="hover:bg-gray-50">
                              {pendingColumnSettings.sNo && <TableCell>{record.sNo}</TableCell>}
                              {pendingColumnSettings.despatchId && <TableCell className="font-medium text-blue-600">{record.despatchId}</TableCell>}
                              {pendingColumnSettings.despatchFrom && <TableCell>{record.despatchFrom}</TableCell>}
                              {pendingColumnSettings.despatchedTo && <TableCell>{record.despatchedTo}</TableCell>}
                              {pendingColumnSettings.despatchOn && <TableCell>{record.despatchOn}</TableCell>}
                              {pendingColumnSettings.courierVendor && <TableCell>{record.courierVendor || "-"}</TableCell>}
                              {pendingColumnSettings.wayBillNo && <TableCell>{record.wayBillNo || "-"}</TableCell>}
                              {pendingColumnSettings.date && <TableCell>{record.date}</TableCell>}
                              {pendingColumnSettings.noOfItems && <TableCell>{record.noOfItems}</TableCell>}
                              {pendingColumnSettings.status && <TableCell>{getStatusBadge(record.status)}</TableCell>}
                              {pendingColumnSettings.receivedOn && <TableCell>{record.receivedOn || "-"}</TableCell>}
                              {pendingColumnSettings.received && (
                                <TableCell>
                                  {record.status !== "Received" ? (
                                    <Button
                                      size="sm"
                                      onClick={() => handleReceive(record)}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <CheckCircle className="mr-1 h-3 w-3" /> Receive
                                    </Button>
                                  ) : (
                                    <span className="text-green-600 text-sm">✓ Received</span>
                                  )}
                                </TableCell>
                              )}
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Summary */}
                  <div className="mt-4 text-sm text-gray-600">
                    Total Pending Records: {pendingRecords.length}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== SEARCH TAB ==================== */}
        <TabsContent value="search" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search Despatch Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Search Bar */}
              <div className="flex gap-3 mb-6">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Search by Despatch ID, Despatch From, Despatched To, WayBill #, Courier Vendor..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearchTabSearch()}
                  />
                </div>
                <Button onClick={handleSearchTabSearch} className="bg-blue-600 hover:bg-blue-700">
                  <Search className="mr-2 h-4 w-4" /> Search
                </Button>
                <Button variant="outline" onClick={clearSearchTabSearch}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Clear
                </Button>
              </div>

              {/* Column Settings */}
              <div className="mb-4 p-3 bg-gray-100 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium">Column Settings</span>
                </div>
                <div className="flex flex-wrap gap-4">
                  {Object.keys(searchColumnSettings).map((key) => (
                    <div key={key} className="flex items-center gap-2">
                      <Checkbox
                        checked={searchColumnSettings[key as keyof typeof searchColumnSettings]}
                        onCheckedChange={(c) => setSearchColumnSettings({ ...searchColumnSettings, [key]: !!c })}
                      />
                      <Label className="text-sm cursor-pointer">
                        {key === "despatchId" ? "Despatch ID" :
                         key === "despatchFrom" ? "Despatch From" :
                         key === "despatchedTo" ? "Despatched To" :
                         key === "despatchOn" ? "Despatch on" :
                         key === "courierVendor" ? "Courier Vendor" :
                         key === "wayBillNo" ? "WayBill #" :
                         key === "noOfItems" ? "No of Items" :
                         key === "receivedOn" ? "Received On" :
                         key === "receivedBy" ? "Received By" :
                         key.replace(/([A-Z])/g, ' $1').trim()}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Search Results Table */}
              <div className="overflow-x-auto border rounded-lg">
                <Table>
                  <TableHeader className="bg-gray-100">
                    <TableRow>
                      {searchColumnSettings.sNo && <TableHead className="w-16">S#</TableHead>}
                      {searchColumnSettings.despatchId && <TableHead>Despatch ID</TableHead>}
                      {searchColumnSettings.despatchFrom && <TableHead>Despatch From</TableHead>}
                      {searchColumnSettings.despatchedTo && <TableHead>Despatched To</TableHead>}
                      {searchColumnSettings.despatchOn && <TableHead>Despatch on</TableHead>}
                      {searchColumnSettings.courierVendor && <TableHead>Courier Vendor</TableHead>}
                      {searchColumnSettings.wayBillNo && <TableHead>WayBill #</TableHead>}
                      {searchColumnSettings.date && <TableHead>Date</TableHead>}
                      {searchColumnSettings.noOfItems && <TableHead>No of Items</TableHead>}
                      {searchColumnSettings.status && <TableHead>Status</TableHead>}
                      {searchColumnSettings.receivedOn && <TableHead>Received On</TableHead>}
                      {searchColumnSettings.receivedBy && <TableHead>Received By</TableHead>}
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSearchRecords.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={13} className="text-center py-8 text-gray-500">
                          No despatch records found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSearchRecords.map((record) => (
                        <TableRow key={record.id} className="hover:bg-gray-50">
                          {searchColumnSettings.sNo && <TableCell>{record.sNo}</TableCell>}
                          {searchColumnSettings.despatchId && <TableCell className="font-medium text-blue-600">{record.despatchId}</TableCell>}
                          {searchColumnSettings.despatchFrom && <TableCell>{record.despatchFrom}</TableCell>}
                          {searchColumnSettings.despatchedTo && <TableCell>{record.despatchedTo}</TableCell>}
                          {searchColumnSettings.despatchOn && <TableCell>{record.despatchOn}</TableCell>}
                          {searchColumnSettings.courierVendor && <TableCell>{record.courierVendor || "-"}</TableCell>}
                          {searchColumnSettings.wayBillNo && <TableCell>{record.wayBillNo || "-"}</TableCell>}
                          {searchColumnSettings.date && <TableCell>{record.date}</TableCell>}
                          {searchColumnSettings.noOfItems && <TableCell>{record.noOfItems}</TableCell>}
                          {searchColumnSettings.status && <TableCell>{getStatusBadge(record.status)}</TableCell>}
                          {searchColumnSettings.receivedOn && <TableCell>{record.receivedOn || "-"}</TableCell>}
                          {searchColumnSettings.receivedBy && <TableCell>{record.receivedBy || "-"}</TableCell>}
                          <TableCell>
                            {record.status !== "Received" ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCancel(record)}
                                className="text-red-600 border-red-300 hover:bg-red-50"
                              >
                                <XCircle className="mr-1 h-3 w-3" /> Cancel
                              </Button>
                            ) : (
                              <span className="text-green-600 text-sm">Completed</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Summary */}
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Total Records: {filteredSearchRecords.length}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="inline-flex items-center gap-2 mr-3">
                    <CheckCircle className="h-3 w-3 text-green-600" /> Received: {filteredSearchRecords.filter(r => r.status === "Received").length}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Clock className="h-3 w-3 text-yellow-600" /> Pending: {filteredSearchRecords.filter(r => r.status === "Pending").length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}