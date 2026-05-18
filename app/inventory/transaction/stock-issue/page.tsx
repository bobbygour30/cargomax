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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Eye, Settings, Search, RefreshCw, Filter, ChevronRight, Package, Truck } from "lucide-react";

// ==================== TYPE DEFINITIONS ====================

interface StockIssue {
  id: number;
  sNo: number;
  issueId: string;
  issueTo: string;
  issueDate: string;
  itemCode: string;
  itemName: string;
  unitType: string;
  startNo: string;
  endNo: string;
  quantity: number;
  status: string;
  remarks: string;
}

// ==================== MOCK DATA ====================

const initialStockIssueData: StockIssue[] = [
  { id: 1, sNo: 1, issueId: "ISS/2026-27/001", issueTo: "DELHI BRANCH", issueDate: "15-05-2026", itemCode: "A0001", itemName: "A4 Printer Paper", unitType: "REAM", startNo: "R001", endNo: "R050", quantity: 50, status: "Issued", remarks: "Monthly supply" },
  { id: 2, sNo: 2, issueId: "ISS/2026-27/002", issueTo: "MUMBAI BRANCH", issueDate: "16-05-2026", itemCode: "A0002", itemName: "Ballpoint Pen (Blue)", unitType: "BOX", startNo: "P001", endNo: "P020", quantity: 20, status: "Issued", remarks: "Stationery requirement" },
  { id: 3, sNo: 3, issueId: "ISS/2026-27/003", issueTo: "BANGALORE BRANCH", issueDate: "17-05-2026", itemCode: "A0003", itemName: "Stapler", unitType: "PCS", startNo: "S001", endNo: "S010", quantity: 10, status: "Issued", remarks: "Office supplies" },
  { id: 4, sNo: 4, issueId: "ISS/2026-27/004", issueTo: "DELHI BRANCH", issueDate: "18-05-2026", itemCode: "A0004", itemName: "Notebook (200 Pages)", unitType: "PCS", startNo: "N001", endNo: "N100", quantity: 100, status: "Issued", remarks: "Training material" },
  { id: 5, sNo: 5, issueId: "ISS/2026-27/005", issueTo: "CHENNAI BRANCH", issueDate: "18-05-2026", itemCode: "A0005", itemName: "File Folders", unitType: "PCS", startNo: "F001", endNo: "F030", quantity: 30, status: "Issued", remarks: "Filing system" },
  { id: 6, sNo: 6, issueId: "ISS/2026-27/006", issueTo: "KOLKATA BRANCH", issueDate: "14-05-2026", itemCode: "A0006", itemName: "Paper Clips", unitType: "BOX", startNo: "C001", endNo: "C015", quantity: 15, status: "Issued", remarks: "Stationery" },
  { id: 7, sNo: 7, issueId: "ISS/2026-27/007", issueTo: "DELHI BRANCH", issueDate: "12-05-2026", itemCode: "A0007", itemName: "Whiteboard Marker", unitType: "PCS", startNo: "M001", endNo: "M025", quantity: 25, status: "Issued", remarks: "Meeting room" },
  { id: 8, sNo: 8, issueId: "ISS/2026-27/008", issueTo: "MUMBAI BRANCH", issueDate: "10-05-2026", itemCode: "A0008", itemName: "Correction Pen", unitType: "PCS", startNo: "CP001", endNo: "CP020", quantity: 20, status: "Issued", remarks: "Office use" },
  { id: 9, sNo: 9, issueId: "ISS/2026-27/009", issueTo: "PUNE BRANCH", issueDate: "18-05-2026", itemCode: "A0009", itemName: "Envelope (A4 Size)", unitType: "PACK", startNo: "E001", endNo: "E040", quantity: 40, status: "Issued", remarks: "Courier supplies" },
  { id: 10, sNo: 10, issueId: "ISS/2026-27/010", issueTo: "DELHI BRANCH", issueDate: "08-05-2026", itemCode: "A0010", itemName: "Binding Covers", unitType: "PCS", startNo: "BC001", endNo: "BC050", quantity: 50, status: "Issued", remarks: "Document binding" },
];

// Dropdown options
const branchOptions = ["DELHI BRANCH", "MUMBAI BRANCH", "BANGALORE BRANCH", "CHENNAI BRANCH", "KOLKATA BRANCH", "PUNE BRANCH", "JAIPUR BRANCH", "LUCKNOW BRANCH"];
const itemOptions = [
  { code: "A0001", name: "A4 Printer Paper" },
  { code: "A0002", name: "Ballpoint Pen (Blue)" },
  { code: "A0003", name: "Stapler" },
  { code: "A0004", name: "Notebook (200 Pages)" },
  { code: "A0005", name: "File Folders" },
  { code: "A0006", name: "Paper Clips" },
  { code: "A0007", name: "Whiteboard Marker" },
  { code: "A0008", name: "Correction Pen" },
  { code: "A0009", name: "Envelope (A4 Size)" },
  { code: "A0010", name: "Binding Covers" },
];

export default function StockIssueToBranch() {
  // ==================== STATE ====================
  
  // Branch filter
  const [selectedBranch, setSelectedBranch] = useState("");
  const [branchAll, setBranchAll] = useState(true);
  
  // Item filter
  const [selectedItem, setSelectedItem] = useState("");
  const [itemAll, setItemAll] = useState(true);
  
  // Period filter
  const [fromDate, setFromDate] = useState<Date>(new Date(2026, 4, 18));
  const [toDate, setToDate] = useState<Date>(new Date(2026, 4, 18));
  
  // Search term
  const [searchTerm, setSearchTerm] = useState("");
  
  // Data state
  const [stockIssues, setStockIssues] = useState<StockIssue[]>(initialStockIssueData);
  const [filteredData, setFilteredData] = useState<StockIssue[]>([]);
  const [showResults, setShowResults] = useState(false);
  
  // Column visibility settings
  const [columnSettings, setColumnSettings] = useState({
    sNo: true,
    issueId: true,
    issueTo: true,
    issueDate: true,
    itemCode: true,
    itemName: true,
    unitType: true,
    startNo: true,
    endNo: true,
  });

  // ==================== FUNCTIONS ====================

  // Handle Show button click
  const handleShow = () => {
    let filtered = [...stockIssues];
    
    // Filter by branch
    if (!branchAll && selectedBranch) {
      filtered = filtered.filter(issue => issue.issueTo === selectedBranch);
    }
    
    // Filter by item
    if (!itemAll && selectedItem) {
      filtered = filtered.filter(issue => issue.itemName === selectedItem);
    }
    
    // Filter by date range
    filtered = filtered.filter(issue => {
      const issueDate = new Date(issue.issueDate.split("-").reverse().join("-"));
      return issueDate >= fromDate && issueDate <= toDate;
    });
    
    setFilteredData(filtered);
    setShowResults(true);
  };

  // Handle Search button click
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      handleShow();
      return;
    }
    
    const searchLower = searchTerm.toLowerCase();
    const filtered = filteredData.filter(issue =>
      issue.issueId.toLowerCase().includes(searchLower) ||
      issue.issueTo.toLowerCase().includes(searchLower) ||
      issue.itemCode.toLowerCase().includes(searchLower) ||
      issue.itemName.toLowerCase().includes(searchLower) ||
      issue.unitType.toLowerCase().includes(searchLower) ||
      issue.startNo.toLowerCase().includes(searchLower) ||
      issue.endNo.toLowerCase().includes(searchLower)
    );
    
    setFilteredData(filtered);
  };

  // Handle Clear Search
  const handleClearSearch = () => {
    setSearchTerm("");
    handleShow();
  };

  // Handle Clear All Filters
  const handleClearAll = () => {
    setSelectedBranch("");
    setBranchAll(true);
    setSelectedItem("");
    setItemAll(true);
    setFromDate(new Date(2026, 4, 18));
    setToDate(new Date(2026, 4, 18));
    setSearchTerm("");
    setFilteredData([]);
    setShowResults(false);
  };

  // Handle View Details (Action)
  const handleViewDetails = (issue: StockIssue) => {
    alert(`Issue Details:\n\nIssue ID: ${issue.issueId}\nIssue To: ${issue.issueTo}\nIssue Date: ${issue.issueDate}\nItem: ${issue.itemName}\nQuantity: ${issue.quantity}\nStart No: ${issue.startNo}\nEnd No: ${issue.endNo}\nRemarks: ${issue.remarks || "N/A"}`);
  };

  // Calculate summary
  const totalIssues = filteredData.length;
  const totalQuantity = filteredData.reduce((sum, issue) => sum + issue.quantity, 0);

  // Get unique branches and items for filters
  const uniqueBranches = [...new Set(stockIssues.map(issue => issue.issueTo))];
  const uniqueItems = [...new Map(stockIssues.map(issue => [issue.itemName, { code: issue.itemCode, name: issue.itemName }])).values()];

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-primary">STOCK ISSUE TO BRANCH</h1>
        <div className="text-xs text-muted-foreground mt-1">
          Company : GOLDEN ROADWAYS &amp; LOGISTICS PVT LTD | Login By : ADMIN@GMAIL.COM
          <br />
          Login Branch : HEAD OFFICE | Financial Year : 2026-2027
        </div>
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            Stock Issue Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filter Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            
            {/* Branch Filter with ALL checkbox */}
            <div>
              <Label className="text-base font-medium">Branch <span className="text-red-500">*</span></Label>
              <div className="flex items-center gap-3 mt-2 mb-2">
                <Checkbox
                  checked={branchAll}
                  onCheckedChange={(checked) => {
                    setBranchAll(!!checked);
                    if (!!checked) setSelectedBranch("");
                  }}
                />
                <Label className="cursor-pointer font-normal">ALL</Label>
              </div>
              {!branchAll && (
                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueBranches.map((branch) => (
                      <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Item Filter with ALL checkbox */}
            <div>
              <Label className="text-base font-medium">Item <span className="text-red-500">*</span></Label>
              <div className="flex items-center gap-3 mt-2 mb-2">
                <Checkbox
                  checked={itemAll}
                  onCheckedChange={(checked) => {
                    setItemAll(!!checked);
                    if (!!checked) setSelectedItem("");
                  }}
                />
                <Label className="cursor-pointer font-normal">ALL</Label>
              </div>
              {!itemAll && (
                <Select value={selectedItem} onValueChange={setSelectedItem}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Item" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueItems.map((item) => (
                      <SelectItem key={item.name} value={item.name}>{item.name} ({item.code})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Period From */}
            <div>
              <Label>Period From <span className="text-red-500">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal mt-1">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(fromDate, "dd-MM-yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={fromDate} onSelect={(d) => d && setFromDate(d)} />
                </PopoverContent>
              </Popover>
            </div>

            {/* Period To */}
            <div>
              <Label>Period To <span className="text-red-500">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal mt-1">
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

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t">
            <Button onClick={handleShow} className="bg-blue-600 hover:bg-blue-700">
              <Eye className="mr-2 h-4 w-4" /> Show
            </Button>
            <Button variant="outline" onClick={handleClearAll}>
              <RefreshCw className="mr-2 h-4 w-4" /> Clear
            </Button>
          </div>

          {/* Search Bar - Only shown after Show button click */}
          {showResults && (
            <>
              <div className="flex gap-3 mt-6 pt-4 border-t">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Search by Issue ID, Issue To, Item Code, Item Name, Unit Type, Start/End No..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <Button onClick={handleSearch} className="bg-green-600 hover:bg-green-700">
                  <Search className="mr-2 h-4 w-4" /> Search
                </Button>
                <Button variant="outline" onClick={handleClearSearch}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Clear
                </Button>
              </div>

              {/* Column Settings */}
              <div className="mt-4 mb-4 p-3 bg-gray-100 rounded-lg">
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
                        {key === "issueId" ? "issueid #" :
                         key === "issueTo" ? "Issue To" :
                         key === "issueDate" ? "Issue Date" :
                         key === "itemCode" ? "Item Code" :
                         key === "itemName" ? "Item Name" :
                         key === "unitType" ? "Unit Type" :
                         key === "startNo" ? "Start No" :
                         key === "endNo" ? "End No" :
                         key === "sNo" ? "S#" : key}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Results Table */}
              <div className="overflow-x-auto border rounded-lg">
                <Table>
                  <TableHeader className="bg-gray-100">
                    <TableRow>
                      {columnSettings.sNo && <TableHead className="w-16 text-center">S#</TableHead>}
                      {columnSettings.issueId && <TableHead>issueid #</TableHead>}
                      {columnSettings.issueTo && <TableHead>Issue To</TableHead>}
                      {columnSettings.issueDate && <TableHead>Issue Date</TableHead>}
                      {columnSettings.itemCode && <TableHead>Item Code</TableHead>}
                      {columnSettings.itemName && <TableHead>Item Name</TableHead>}
                      {columnSettings.unitType && <TableHead>Unit Type</TableHead>}
                      {columnSettings.startNo && <TableHead>Start No</TableHead>}
                      {columnSettings.endNo && <TableHead>End No</TableHead>}
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.length === 0 ? (
                      <TableRow>
                        <TableCell 
                          colSpan={Object.values(columnSettings).filter(Boolean).length + 1} 
                          className="text-center py-8 text-gray-500"
                        >
                          <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                          No stock issue records found for the selected criteria.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredData.map((issue) => (
                        <TableRow key={issue.id} className="hover:bg-gray-50">
                          {columnSettings.sNo && <TableCell className="text-center">{issue.sNo}</TableCell>}
                          {columnSettings.issueId && <TableCell className="font-medium text-blue-600">{issue.issueId}</TableCell>}
                          {columnSettings.issueTo && <TableCell>{issue.issueTo}</TableCell>}
                          {columnSettings.issueDate && <TableCell>{issue.issueDate}</TableCell>}
                          {columnSettings.itemCode && <TableCell>{issue.itemCode}</TableCell>}
                          {columnSettings.itemName && <TableCell>{issue.itemName}</TableCell>}
                          {columnSettings.unitType && <TableCell>
                            <span className="bg-gray-100 px-2 py-1 rounded text-xs">{issue.unitType}</span>
                          </TableCell>}
                          {columnSettings.startNo && <TableCell>{issue.startNo}</TableCell>}
                          {columnSettings.endNo && <TableCell>{issue.endNo}</TableCell>}
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(issue)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Summary Section */}
              {filteredData.length > 0 && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Total Issues</div>
                      <div className="text-xl font-bold text-blue-600">{totalIssues}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Total Quantity</div>
                      <div className="text-xl font-bold text-green-600">{totalQuantity}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Unique Branches</div>
                      <div className="text-xl font-bold text-purple-600">{new Set(filteredData.map(i => i.issueTo)).size}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Unique Items</div>
                      <div className="text-xl font-bold text-orange-600">{new Set(filteredData.map(i => i.itemName)).size}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Note */}
              <div className="mt-4 text-xs text-gray-400 text-center border-t pt-3">
                <p>Stock Issue Report | Period: {format(fromDate, "dd-MM-yyyy")} to {format(toDate, "dd-MM-yyyy")}</p>
                <p>Branch: {branchAll ? "ALL" : selectedBranch} | Item: {itemAll ? "ALL" : selectedItem}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Info Card - When no report is shown */}
      {!showResults && (
        <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
          <CardContent className="py-12 text-center">
            <div className="text-gray-400 mb-2">
              <Truck className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-600">No Stock Issue Data Displayed</h3>
            <p className="text-sm text-gray-400 mt-1">
              Select Branch, Item, Period and click "Show" button to view stock issue records.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}