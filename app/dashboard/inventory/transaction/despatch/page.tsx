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
import { CalendarIcon, Eye, Settings, Printer, Download, Plus, X, Save, Trash2, RefreshCw, Truck, FileText, Package,Search } from "lucide-react";

// ==================== TYPE DEFINITIONS ====================

interface DispatchItem {
  id: number;
  sNo: number;
  itemName: string;
  unitType: string;
  qty: number;
  issueId: string;
  issueDate: string;
  startNo: string;
  endNo: string;
  itemSerialNo: string;
  remarks: string;
}

interface DispatchRecord {
  id: number;
  sNo: number;
  dispatchDate: string;
  branchName: string;
  dispatchedTo: string;
  dispatchThrough: string;
  vendorGrNo: string;
  vendorGrDate: string;
  dispatchId: string;
  noOfItems: number;
  status: string;
  items: DispatchItem[];
  remarks: string;
}

// ==================== MOCK DATA ====================

const mockDispatchRecords: DispatchRecord[] = [
  {
    id: 1,
    sNo: 1,
    dispatchDate: "18-05-2026",
    branchName: "HEAD OFFICE",
    dispatchedTo: "DELHI BRANCH",
    dispatchThrough: "ROAD TRANSPORT",
    vendorGrNo: "GR/2026-27/001",
    vendorGrDate: "18-05-2026",
    dispatchId: "DISP/2026-27/001",
    noOfItems: 3,
    status: "Dispatched",
    items: [
      { id: 1, sNo: 1, itemName: "A4 Printer Paper", unitType: "REAM", qty: 10, issueId: "ISS/001", issueDate: "18-05-2026", startNo: "A001", endNo: "A010", itemSerialNo: "", remarks: "For Delhi office" }
    ],
    remarks: "Stationery items dispatched"
  },
  {
    id: 2,
    sNo: 2,
    dispatchDate: "17-05-2026",
    branchName: "HEAD OFFICE",
    dispatchedTo: "MUMBAI BRANCH",
    dispatchThrough: "AIR CARGO",
    vendorGrNo: "GR/2026-27/002",
    vendorGrDate: "17-05-2026",
    dispatchId: "DISP/2026-27/002",
    noOfItems: 5,
    status: "Dispatched",
    items: [
      { id: 1, sNo: 1, itemName: "Laptop", unitType: "PCS", qty: 2, issueId: "ISS/002", issueDate: "17-05-2026", startNo: "L001", endNo: "L002", itemSerialNo: "SN001, SN002", remarks: "For IT team" }
    ],
    remarks: "Electronic items dispatched"
  },
  {
    id: 3,
    sNo: 3,
    dispatchDate: "16-05-2026",
    branchName: "HEAD OFFICE",
    dispatchedTo: "BANGALORE BRANCH",
    dispatchThrough: "ROAD TRANSPORT",
    vendorGrNo: "GR/2026-27/003",
    vendorGrDate: "16-05-2026",
    dispatchId: "DISP/2026-27/003",
    noOfItems: 2,
    status: "In Transit",
    items: [
      { id: 1, sNo: 1, itemName: "Furniture", unitType: "PCS", qty: 5, issueId: "ISS/003", issueDate: "16-05-2026", startNo: "F001", endNo: "F005", itemSerialNo: "", remarks: "Office furniture" }
    ],
    remarks: "Furniture dispatched"
  },
];

// Dropdown options
const branchOptions = ["HEAD OFFICE", "DELHI BRANCH", "MUMBAI BRANCH", "BANGALORE BRANCH", "CHENNAI BRANCH", "KOLKATA BRANCH"];
const dispatchedToOptions = ["DELHI BRANCH", "MUMBAI BRANCH", "BANGALORE BRANCH", "CHENNAI BRANCH", "KOLKATA BRANCH", "PUNE BRANCH", "External Vendor"];
const dispatchThroughOptions = ["ROAD TRANSPORT", "AIR CARGO", "RAILWAY", "COURIER", "HAND DELIVERY"];
const itemOptions = ["A4 Printer Paper", "Ballpoint Pen", "Laptop", "Mouse", "Keyboard", "Furniture", "Stapler", "Notebook", "File Folders", "Whiteboard Marker"];
const unitTypeOptions = ["PCS", "BOX", "REAM", "SET", "DOZEN", "KG", "LTR", "ROLL"];
const statusOptions = ["Dispatched", "In Transit", "Delivered", "Cancelled"];

export default function ItemDespatch() {
  // ==================== ENTRY TAB STATE ====================
  const [branchName, setBranchName] = useState("HEAD OFFICE");
  const [dispatchDate, setDispatchDate] = useState<Date>(new Date(2026, 4, 18));
  const [dispatchId, setDispatchId] = useState("");
  const [dispatchedTo, setDispatchedTo] = useState("");
  const [dispatchThrough, setDispatchThrough] = useState("");
  const [vendorGrNo, setVendorGrNo] = useState("");
  const [vendorGrDate, setVendorGrDate] = useState<Date>(new Date(2026, 4, 18));
  const [remarks, setRemarks] = useState("");

  // Dispatch Items
  const [dispatchItems, setDispatchItems] = useState<DispatchItem[]>([
    { id: 1, sNo: 1, itemName: "", unitType: "", qty: 0, issueId: "", issueDate: format(new Date(), "dd-MM-yyyy"), startNo: "", endNo: "", itemSerialNo: "", remarks: "" }
  ]);

  // Search Tab State
  const [searchBranch, setSearchBranch] = useState("");
  const [searchDispatchedTo, setSearchDispatchedTo] = useState("");
  const [asOnDate, setAsOnDate] = useState<Date>(new Date(2026, 4, 18));
  const [searchResults, setSearchResults] = useState<DispatchRecord[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Column visibility settings for search tab
  const [columnSettings, setColumnSettings] = useState({
    sNo: true,
    dispatchDate: true,
    branchName: true,
    dispatchedTo: true,
    dispatchThrough: true,
    grNo: true,
    grDate: true,
    noOfItems: true,
    status: true,
  });

  // Active tab
  const [activeTab, setActiveTab] = useState("entry");

  // Generate next Dispatch ID
  const generateDispatchId = () => {
    const lastDispatch = mockDispatchRecords[mockDispatchRecords.length - 1];
    if (lastDispatch) {
      const match = lastDispatch.dispatchId.match(/DISP\/\d{4}-\d{2}\/(\d+)/);
      if (match) {
        const nextNum = parseInt(match[1]) + 1;
        return `DISP/2026-27/${nextNum.toString().padStart(3, "0")}`;
      }
    }
    return "DISP/2026-27/001";
  };

  // Add new dispatch item row
  const addDispatchItem = () => {
    const newId = Math.max(...dispatchItems.map(i => i.id), 0) + 1;
    const newSNo = dispatchItems.length + 1;
    setDispatchItems([...dispatchItems, {
      id: newId, sNo: newSNo, itemName: "", unitType: "", qty: 0,
      issueId: "", issueDate: format(new Date(), "dd-MM-yyyy"),
      startNo: "", endNo: "", itemSerialNo: "", remarks: ""
    }]);
  };

  const removeDispatchItem = (id: number) => {
    if (dispatchItems.length > 1) {
      const filtered = dispatchItems.filter(i => i.id !== id);
      const reindexed = filtered.map((item, idx) => ({ ...item, sNo: idx + 1 }));
      setDispatchItems(reindexed);
    } else {
      alert("At least one item is required!");
    }
  };

  const updateDispatchItem = (id: number, field: keyof DispatchItem, value: any) => {
    setDispatchItems(dispatchItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  // Calculate total quantity
  const totalQty = dispatchItems.reduce((sum, item) => sum + item.qty, 0);
  const totalItems = dispatchItems.length;

  // Handle Save
  const handleSave = () => {
    if (!branchName) { alert("Branch Name is required!"); return; }
    if (!dispatchedTo) { alert("Dispatched To is required!"); return; }
    if (dispatchItems.some(item => !item.itemName)) { alert("Please select item name for all rows!"); return; }

    const newDispatchId = dispatchId || generateDispatchId();
    const newDispatch: DispatchRecord = {
      id: Date.now(),
      sNo: mockDispatchRecords.length + 1,
      dispatchDate: format(dispatchDate, "dd-MM-yyyy"),
      branchName,
      dispatchedTo,
      dispatchThrough,
      vendorGrNo,
      vendorGrDate: format(vendorGrDate, "dd-MM-yyyy"),
      dispatchId: newDispatchId,
      noOfItems: totalItems,
      status: "Dispatched",
      items: dispatchItems,
      remarks,
    };

    mockDispatchRecords.unshift(newDispatch);
    alert(`Dispatch saved successfully!\nDispatch ID: ${newDispatchId}`);
    handleClear();
  };

  // Handle Clear
  const handleClear = () => {
    setBranchName("HEAD OFFICE");
    setDispatchDate(new Date(2026, 4, 18));
    setDispatchId("");
    setDispatchedTo("");
    setDispatchThrough("");
    setVendorGrNo("");
    setVendorGrDate(new Date(2026, 4, 18));
    setRemarks("");
    setDispatchItems([
      { id: 1, sNo: 1, itemName: "", unitType: "", qty: 0, issueId: "", issueDate: format(new Date(), "dd-MM-yyyy"), startNo: "", endNo: "", itemSerialNo: "", remarks: "" }
    ]);
  };

  // Handle Cancel - switch to search tab
  const handleCancel = () => {
    setActiveTab("search");
  };

  // Handle Print
  const handlePrint = () => {
    window.print();
  };

  // Handle Show in Search Tab
  const handleShow = () => {
    let filtered = [...mockDispatchRecords];
    
    if (searchBranch) {
      filtered = filtered.filter(record => record.branchName === searchBranch);
    }
    if (searchDispatchedTo) {
      filtered = filtered.filter(record => record.dispatchedTo === searchDispatchedTo);
    }
    
    // Filter by as on date
    filtered = filtered.filter(record => {
      const recordDate = new Date(record.dispatchDate.split("-").reverse().join("-"));
      return recordDate <= asOnDate;
    });
    
    setSearchResults(filtered);
    setShowSearchResults(true);
  };

  // Handle Clear Search
  const handleClearSearch = () => {
    setSearchBranch("");
    setSearchDispatchedTo("");
    setAsOnDate(new Date(2026, 4, 18));
    setSearchResults([]);
    setShowSearchResults(false);
  };

  // Handle View Details (Action)
  const handleViewDetails = (record: DispatchRecord) => {
    setBranchName(record.branchName);
    setDispatchDate(new Date(record.dispatchDate.split("-").reverse().join("-")));
    setDispatchId(record.dispatchId);
    setDispatchedTo(record.dispatchedTo);
    setDispatchThrough(record.dispatchThrough);
    setVendorGrNo(record.vendorGrNo);
    setVendorGrDate(new Date(record.vendorGrDate.split("-").reverse().join("-")));
    setRemarks(record.remarks);
    setDispatchItems(record.items);
    setActiveTab("entry");
    alert(`Loading dispatch: ${record.dispatchId} for editing`);
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-primary">3. ITEM DESPATCH</h1>
        <div className="text-xs text-muted-foreground mt-1">
          Company : GOLDEN ROADWAYS &amp; LOGISTICS PVT LTD | Login By : ADMIN@GMAIL.COM
          <br />
          Login Branch : HEAD OFFICE | Financial Year : 2026-2027
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="entry">Entry</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
        </TabsList>

        {/* ==================== ENTRY TAB ==================== */}
        <TabsContent value="entry" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Item Dispatch Entry
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div>
                  <Label>Branch Name <span className="text-red-500">*</span></Label>
                  <Select value={branchName} onValueChange={setBranchName}>
                    <SelectTrigger><SelectValue placeholder="Select Branch" /></SelectTrigger>
                    <SelectContent>{branchOptions.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Dispatch Date <span className="text-red-500">*</span></Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(dispatchDate, "dd-MM-yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent><Calendar mode="single" selected={dispatchDate} onSelect={(d) => d && setDispatchDate(d)} /></PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>Dispatch ID <span className="text-red-500">*</span></Label>
                  <Input value={dispatchId} onChange={(e) => setDispatchId(e.target.value)} placeholder="Auto generated" className="bg-gray-50" readOnly />
                </div>

                <div>
                  <Label>Dispatched To <span className="text-red-500">*</span></Label>
                  <Select value={dispatchedTo} onValueChange={setDispatchedTo}>
                    <SelectTrigger><SelectValue placeholder="Select Destination" /></SelectTrigger>
                    <SelectContent>{dispatchedToOptions.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Dispatch Through</Label>
                  <Select value={dispatchThrough} onValueChange={setDispatchThrough}>
                    <SelectTrigger><SelectValue placeholder="Select Mode" /></SelectTrigger>
                    <SelectContent>{dispatchThroughOptions.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Vendor GR #</Label>
                  <Input value={vendorGrNo} onChange={(e) => setVendorGrNo(e.target.value)} placeholder="Enter GR Number" />
                </div>

                <div>
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(vendorGrDate, "dd-MM-yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent><Calendar mode="single" selected={vendorGrDate} onSelect={(d) => d && setVendorGrDate(d)} /></PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Action Buttons for Add Items */}
              <div className="flex flex-wrap gap-3 mb-4">
                <Button variant="outline" onClick={addDispatchItem} className="bg-blue-50">
                  <Plus className="mr-2 h-4 w-4" /> Add Item
                </Button>
                <Button variant="outline" className="bg-green-50">
                  <Package className="mr-2 h-4 w-4" /> Select Issue Stationary
                </Button>
                <Button variant="outline" className="bg-purple-50">
                  <FileText className="mr-2 h-4 w-4" /> Select Issued/Transferred Fixed Asset
                </Button>
              </div>

              {/* Dispatch Items Table */}
              <div className="overflow-x-auto border rounded-lg">
                <Table>
                  <TableHeader className="bg-gray-100">
                    <TableRow>
                      <TableHead>S #</TableHead>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Unit Type</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead>Issue ID</TableHead>
                      <TableHead>Issue Date</TableHead>
                      <TableHead>Start #</TableHead>
                      <TableHead>End #</TableHead>
                      <TableHead>Item Serial #</TableHead>
                      <TableHead>Remarks</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dispatchItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.sNo}</TableCell>
                        <TableCell>
                          <Select value={item.itemName} onValueChange={(v) => updateDispatchItem(item.id, 'itemName', v)}>
                            <SelectTrigger className="min-w-[150px]"><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>{itemOptions.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select value={item.unitType} onValueChange={(v) => updateDispatchItem(item.id, 'unitType', v)}>
                            <SelectTrigger className="w-24"><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>{unitTypeOptions.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell><Input type="number" value={item.qty} onChange={(e) => updateDispatchItem(item.id, 'qty', parseFloat(e.target.value) || 0)} className="w-20 text-right" /></TableCell>
                        <TableCell><Input value={item.issueId} onChange={(e) => updateDispatchItem(item.id, 'issueId', e.target.value)} placeholder="Issue ID" className="w-28" /></TableCell>
                        <TableCell><Input value={item.issueDate} onChange={(e) => updateDispatchItem(item.id, 'issueDate', e.target.value)} placeholder="Date" className="w-28" /></TableCell>
                        <TableCell><Input value={item.startNo} onChange={(e) => updateDispatchItem(item.id, 'startNo', e.target.value)} placeholder="Start" className="w-20" /></TableCell>
                        <TableCell><Input value={item.endNo} onChange={(e) => updateDispatchItem(item.id, 'endNo', e.target.value)} placeholder="End" className="w-20" /></TableCell>
                        <TableCell><Input value={item.itemSerialNo} onChange={(e) => updateDispatchItem(item.id, 'itemSerialNo', e.target.value)} placeholder="Serial #" className="w-28" /></TableCell>
                        <TableCell><Input value={item.remarks} onChange={(e) => updateDispatchItem(item.id, 'remarks', e.target.value)} placeholder="Remarks" className="w-32" /></TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => removeDispatchItem(item.id)} className="text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Summary */}
              <div className="mt-3 text-sm text-gray-600">
                Total Items: {totalItems} | Total Quantity: {totalQty}
              </div>

              {/* Remarks */}
              <div className="mt-4">
                <Label>Remarks</Label>
                <Input value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Enter remarks here" />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-6 border-t mt-6">
                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                  <Save className="mr-2 h-4 w-4" /> Save
                </Button>
                <Button variant="outline" onClick={handleClear}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Clear
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
                <Button variant="outline" onClick={handlePrint}>
                  <Printer className="mr-2 h-4 w-4" /> Print
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== SEARCH TAB ==================== */}
        <TabsContent value="search" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search Dispatch Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Search Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <Label>Branch <span className="text-red-500">*</span></Label>
                  <Select value={searchBranch} onValueChange={setSearchBranch}>
                    <SelectTrigger><SelectValue placeholder="Select Branch" /></SelectTrigger>
                    <SelectContent>{branchOptions.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Despatch To</Label>
                  <Select value={searchDispatchedTo} onValueChange={setSearchDispatchedTo}>
                    <SelectTrigger><SelectValue placeholder="Select Destination" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">ALL</SelectItem>
                      {dispatchedToOptions.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>AsOn Date <span className="text-red-500">*</span></Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(asOnDate, "dd-MM-yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent><Calendar mode="single" selected={asOnDate} onSelect={(d) => d && setAsOnDate(d)} /></PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleShow} className="bg-blue-600">
                  <Eye className="mr-2 h-4 w-4" /> Show
                </Button>
                <Button variant="outline" onClick={handleClearSearch}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Clear
                </Button>
              </div>

              {/* Column Settings */}
              {showSearchResults && (
                <div className="mt-6">
                  <div className="mb-4 p-3 bg-gray-100 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Settings className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium">Column Settings</span>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {Object.keys(columnSettings).map((key) => (
                        <div key={key} className="flex items-center gap-2">
                          <Checkbox
                            checked={columnSettings[key as keyof typeof columnSettings]}
                            onCheckedChange={(c) => setColumnSettings({ ...columnSettings, [key]: !!c })}
                          />
                          <Label className="text-sm cursor-pointer">
                            {key === "grNo" ? "GR #" : key === "grDate" ? "GR Date" : key.replace(/([A-Z])/g, ' $1').trim()}
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
                          {columnSettings.sNo && <TableHead>S#</TableHead>}
                          {columnSettings.dispatchDate && <TableHead>Dispatch Date</TableHead>}
                          {columnSettings.branchName && <TableHead>Branch Name</TableHead>}
                          {columnSettings.dispatchedTo && <TableHead>Dispatched To</TableHead>}
                          {columnSettings.dispatchThrough && <TableHead>Dispatch Through</TableHead>}
                          {columnSettings.grNo && <TableHead>GR #</TableHead>}
                          {columnSettings.grDate && <TableHead>GR Date</TableHead>}
                          {columnSettings.noOfItems && <TableHead>No of Items</TableHead>}
                          {columnSettings.status && <TableHead>Status</TableHead>}
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {searchResults.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                              No dispatch records found for the selected criteria.
                            </TableCell>
                          </TableRow>
                        ) : (
                          searchResults.map((record) => (
                            <TableRow key={record.id} className="hover:bg-gray-50">
                              {columnSettings.sNo && <TableCell>{record.sNo}</TableCell>}
                              {columnSettings.dispatchDate && <TableCell>{record.dispatchDate}</TableCell>}
                              {columnSettings.branchName && <TableCell>{record.branchName}</TableCell>}
                              {columnSettings.dispatchedTo && <TableCell>{record.dispatchedTo}</TableCell>}
                              {columnSettings.dispatchThrough && <TableCell>{record.dispatchThrough || "-"}</TableCell>}
                              {columnSettings.grNo && <TableCell>{record.vendorGrNo || "-"}</TableCell>}
                              {columnSettings.grDate && <TableCell>{record.vendorGrDate || "-"}</TableCell>}
                              {columnSettings.noOfItems && <TableCell>{record.noOfItems}</TableCell>}
                              {columnSettings.status && (
                                <TableCell>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    record.status === "Dispatched" ? "bg-green-100 text-green-800" :
                                    record.status === "In Transit" ? "bg-yellow-100 text-yellow-800" :
                                    "bg-gray-100 text-gray-800"
                                  }`}>
                                    {record.status}
                                  </span>
                                </TableCell>
                              )}
                              <TableCell>
                                <Button variant="ghost" size="sm" onClick={() => handleViewDetails(record)} className="text-blue-600">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Summary */}
                  <div className="mt-4 text-sm text-gray-600">
                    Total Records: {searchResults.length} | Total Items Dispatched: {searchResults.reduce((sum, r) => sum + r.noOfItems, 0)}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}