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
import { CalendarIcon, Eye, Settings, Search, RefreshCw, Package, Building2, ClipboardList } from "lucide-react";

// ==================== TYPE DEFINITIONS ====================

interface BranchStationeryStock {
  id: number;
  sNo: number;
  itemName: string;
  unitType: string;
  openingStock: number;
  received: number;
  transferred: number;
  blocked: number;
  consumed: number;
  balance: number;
  branchName: string;
  asOnDate: string;
}

// ==================== MOCK DATA ====================

const initialStockData: BranchStationeryStock[] = [
  { id: 1, sNo: 1, itemName: "A4 Printer Paper", unitType: "REAM", openingStock: 50, received: 100, transferred: 10, blocked: 5, consumed: 35, balance: 100, branchName: "DELHI BRANCH", asOnDate: "18-05-2026" },
  { id: 2, sNo: 2, itemName: "Ballpoint Pen (Blue)", unitType: "BOX", openingStock: 30, received: 50, transferred: 5, blocked: 2, consumed: 28, balance: 45, branchName: "DELHI BRANCH", asOnDate: "18-05-2026" },
  { id: 3, sNo: 3, itemName: "Stapler", unitType: "PCS", openingStock: 15, received: 10, transferred: 2, blocked: 1, consumed: 8, balance: 14, branchName: "DELHI BRANCH", asOnDate: "18-05-2026" },
  { id: 4, sNo: 4, itemName: "Notebook (200 Pages)", unitType: "PCS", openingStock: 80, received: 100, transferred: 15, blocked: 10, consumed: 55, balance: 100, branchName: "MUMBAI BRANCH", asOnDate: "18-05-2026" },
  { id: 5, sNo: 5, itemName: "File Folders", unitType: "PCS", openingStock: 40, received: 60, transferred: 8, blocked: 5, consumed: 27, balance: 60, branchName: "MUMBAI BRANCH", asOnDate: "18-05-2026" },
  { id: 6, sNo: 6, itemName: "Paper Clips", unitType: "BOX", openingStock: 20, received: 25, transferred: 3, blocked: 2, consumed: 15, balance: 25, branchName: "BANGALORE BRANCH", asOnDate: "18-05-2026" },
  { id: 7, sNo: 7, itemName: "Whiteboard Marker", unitType: "PCS", openingStock: 12, received: 20, transferred: 2, blocked: 1, consumed: 14, balance: 15, branchName: "BANGALORE BRANCH", asOnDate: "18-05-2026" },
  { id: 8, sNo: 8, itemName: "Correction Pen", unitType: "PCS", openingStock: 18, received: 12, transferred: 3, blocked: 1, consumed: 10, balance: 16, branchName: "CHENNAI BRANCH", asOnDate: "18-05-2026" },
  { id: 9, sNo: 9, itemName: "Envelope (A4 Size)", unitType: "PACK", openingStock: 30, received: 40, transferred: 5, blocked: 3, consumed: 22, balance: 40, branchName: "CHENNAI BRANCH", asOnDate: "18-05-2026" },
  { id: 10, sNo: 10, itemName: "Binding Covers", unitType: "PCS", openingStock: 25, received: 30, transferred: 4, blocked: 2, consumed: 19, balance: 30, branchName: "KOLKATA BRANCH", asOnDate: "18-05-2026" },
  { id: 11, sNo: 11, itemName: "A4 Printer Paper", unitType: "REAM", openingStock: 40, received: 80, transferred: 8, blocked: 4, consumed: 28, balance: 80, branchName: "MUMBAI BRANCH", asOnDate: "18-05-2026" },
  { id: 12, sNo: 12, itemName: "Ballpoint Pen (Blue)", unitType: "BOX", openingStock: 25, received: 40, transferred: 4, blocked: 2, consumed: 22, balance: 37, branchName: "BANGALORE BRANCH", asOnDate: "18-05-2026" },
];

// Dropdown options
const branchOptions = ["DELHI BRANCH", "MUMBAI BRANCH", "BANGALORE BRANCH", "CHENNAI BRANCH", "KOLKATA BRANCH", "PUNE BRANCH", "JAIPUR BRANCH"];
const itemOptions = ["A4 Printer Paper", "Ballpoint Pen (Blue)", "Stapler", "Notebook (200 Pages)", "File Folders", "Paper Clips", "Whiteboard Marker", "Correction Pen", "Envelope (A4 Size)", "Binding Covers"];
const unitTypeOptions = ["REAM", "BOX", "PCS", "PACK", "SET", "DOZEN"];

export default function BranchStationeryStock() {
  // ==================== STATE ====================
  
  // Filter states
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [asOnDate, setAsOnDate] = useState<Date>(new Date(2026, 4, 18));
  
  // Search term
  const [searchTerm, setSearchTerm] = useState("");
  
  // Data state
  const [stockData, setStockData] = useState<BranchStationeryStock[]>(initialStockData);
  const [filteredData, setFilteredData] = useState<BranchStationeryStock[]>([]);
  const [showResults, setShowResults] = useState(false);
  
  // Column visibility settings
  const [columnSettings, setColumnSettings] = useState({
    sNo: true,
    itemName: true,
    unitType: true,
    openingStock: true,
    received: true,
    transferred: true,
    blocked: true,
    consumed: true,
    balance: true,
  });

  // ==================== FUNCTIONS ====================

  // Handle Show button click
  const handleShow = () => {
    if (!selectedBranch) {
      alert("Please select Branch");
      return;
    }
    if (!selectedItem) {
      alert("Please select Item");
      return;
    }

    let filtered = [...stockData];
    
    // Filter by branch
    filtered = filtered.filter(stock => stock.branchName === selectedBranch);
    
    // Filter by item
    filtered = filtered.filter(stock => stock.itemName === selectedItem);
    
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
    const filtered = filteredData.filter(stock =>
      stock.itemName.toLowerCase().includes(searchLower) ||
      stock.unitType.toLowerCase().includes(searchLower) ||
      stock.branchName.toLowerCase().includes(searchLower)
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
    setSelectedItem("");
    setAsOnDate(new Date(2026, 4, 18));
    setSearchTerm("");
    setFilteredData([]);
    setShowResults(false);
  };

  // Handle View Details (Action)
  const handleViewDetails = (stock: BranchStationeryStock) => {
    alert(`Stock Details:\n\nBranch: ${stock.branchName}\nItem: ${stock.itemName}\nUnit Type: ${stock.unitType}\n\nOpening Stock: ${stock.openingStock}\nReceived: ${stock.received}\nTransferred: ${stock.transferred}\nBlocked: ${stock.blocked}\nConsumed: ${stock.consumed}\nBalance: ${stock.balance}\n\nAs On Date: ${stock.asOnDate}`);
  };

  // Calculate summary totals
  const totalOpeningStock = filteredData.reduce((sum, stock) => sum + stock.openingStock, 0);
  const totalReceived = filteredData.reduce((sum, stock) => sum + stock.received, 0);
  const totalTransferred = filteredData.reduce((sum, stock) => sum + stock.transferred, 0);
  const totalBlocked = filteredData.reduce((sum, stock) => sum + stock.blocked, 0);
  const totalConsumed = filteredData.reduce((sum, stock) => sum + stock.consumed, 0);
  const totalBalance = filteredData.reduce((sum, stock) => sum + stock.balance, 0);

  // Get unique items for dropdown based on selected branch
  const getAvailableItems = () => {
    if (!selectedBranch) return itemOptions;
    const itemsForBranch = [...new Set(stockData.filter(s => s.branchName === selectedBranch).map(s => s.itemName))];
    return itemsForBranch.length > 0 ? itemsForBranch : itemOptions;
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-primary">BRANCH STATIONERY STOCK</h1>
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
            <Building2 className="h-5 w-5 text-blue-600" />
            Branch Stationery Stock Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filter Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            
            {/* Branch Dropdown */}
            <div>
              <Label className="text-base font-medium">
                Branch <span className="text-red-500">*</span>
              </Label>
              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent>
                  {branchOptions.map((branch) => (
                    <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-400 mt-1">Select branch to view stock</p>
            </div>

            {/* Item Dropdown */}
            <div>
              <Label className="text-base font-medium">
                Item <span className="text-red-500">*</span>
              </Label>
              <Select value={selectedItem} onValueChange={setSelectedItem}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Item" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableItems().map((item) => (
                    <SelectItem key={item} value={item}>{item}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-400 mt-1">Select stationery item</p>
            </div>

            {/* As On Date */}
            <div>
              <Label className="text-base font-medium">
                As On Date <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal mt-1">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(asOnDate, "dd-MM-yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={asOnDate} onSelect={(d) => d && setAsOnDate(d)} />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-gray-400 mt-1">Stock position as on selected date</p>
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
                    placeholder="Search by Item Name, Unit Type..."
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
                        {key === "sNo" ? "S#" :
                         key === "itemName" ? "Item Name" :
                         key === "unitType" ? "Unit Type" :
                         key === "openingStock" ? "Opening Stock" :
                         key === "received" ? "Received" :
                         key === "transferred" ? "Transfered" :
                         key === "blocked" ? "Blocked" :
                         key === "consumed" ? "Consumed" :
                         key === "balance" ? "Balance" : key}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Branch and Item Info Bar */}
              <div className="mb-4 p-3 bg-blue-50 rounded-lg flex justify-between items-center">
                <div>
                  <span className="text-sm text-gray-700">
                    <strong>Branch:</strong> {selectedBranch}
                  </span>
                  <span className="text-sm text-gray-700 ml-4">
                    <strong>Item:</strong> {selectedItem}
                  </span>
                  <span className="text-sm text-gray-700 ml-4">
                    <strong>As On Date:</strong> {format(asOnDate, "dd-MM-yyyy")}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Total Records: {filteredData.length}
                </div>
              </div>

              {/* Results Table */}
              <div className="overflow-x-auto border rounded-lg">
                <Table>
                  <TableHeader className="bg-gray-100">
                    <TableRow>
                      {columnSettings.sNo && <TableHead className="w-16 text-center">S#</TableHead>}
                      {columnSettings.itemName && <TableHead>Item Name</TableHead>}
                      {columnSettings.unitType && <TableHead className="w-24">Unit Type</TableHead>}
                      {columnSettings.openingStock && <TableHead className="text-right w-28">Opening Stock</TableHead>}
                      {columnSettings.received && <TableHead className="text-right w-28">Received</TableHead>}
                      {columnSettings.transferred && <TableHead className="text-right w-28">Transfered</TableHead>}
                      {columnSettings.blocked && <TableHead className="text-right w-24">Blocked</TableHead>}
                      {columnSettings.consumed && <TableHead className="text-right w-28">Consumed</TableHead>}
                      {columnSettings.balance && <TableHead className="text-right w-28">Balance</TableHead>}
                      <TableHead className="text-center w-20">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.length === 0 ? (
                      <TableRow>
                        <TableCell 
                          colSpan={Object.values(columnSettings).filter(Boolean).length + 1} 
                          className="text-center py-12 text-gray-500"
                        >
                          <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                          No stock records found for the selected branch and item.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredData.map((stock, index) => (
                        <TableRow key={stock.id} className="hover:bg-gray-50">
                          {columnSettings.sNo && <TableCell className="text-center">{index + 1}</TableCell>}
                          {columnSettings.itemName && <TableCell className="font-medium">{stock.itemName}</TableCell>}
                          {columnSettings.unitType && <TableCell>
                            <span className="bg-gray-100 px-2 py-1 rounded text-xs">{stock.unitType}</span>
                          </TableCell>}
                          {columnSettings.openingStock && <TableCell className="text-right">{stock.openingStock.toLocaleString()}</TableCell>}
                          {columnSettings.received && <TableCell className="text-right text-green-600">+{stock.received.toLocaleString()}</TableCell>}
                          {columnSettings.transferred && <TableCell className="text-right text-orange-600">-{stock.transferred.toLocaleString()}</TableCell>}
                          {columnSettings.blocked && <TableCell className="text-right text-red-600">{stock.blocked.toLocaleString()}</TableCell>}
                          {columnSettings.consumed && <TableCell className="text-right text-purple-600">-{stock.consumed.toLocaleString()}</TableCell>}
                          {columnSettings.balance && <TableCell className="text-right font-bold text-blue-600">{stock.balance.toLocaleString()}</TableCell>}
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(stock)}
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
                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <ClipboardList className="h-4 w-4" />
                    Stock Summary for {selectedBranch} - {selectedItem}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    <div className="text-center p-2 bg-white rounded shadow-sm">
                      <div className="text-xs text-gray-500">Opening Stock</div>
                      <div className="text-lg font-bold text-gray-700">{totalOpeningStock.toLocaleString()}</div>
                    </div>
                    <div className="text-center p-2 bg-white rounded shadow-sm">
                      <div className="text-xs text-gray-500">Received</div>
                      <div className="text-lg font-bold text-green-600">+{totalReceived.toLocaleString()}</div>
                    </div>
                    <div className="text-center p-2 bg-white rounded shadow-sm">
                      <div className="text-xs text-gray-500">Transferred</div>
                      <div className="text-lg font-bold text-orange-600">-{totalTransferred.toLocaleString()}</div>
                    </div>
                    <div className="text-center p-2 bg-white rounded shadow-sm">
                      <div className="text-xs text-gray-500">Blocked</div>
                      <div className="text-lg font-bold text-red-600">{totalBlocked.toLocaleString()}</div>
                    </div>
                    <div className="text-center p-2 bg-white rounded shadow-sm">
                      <div className="text-xs text-gray-500">Consumed</div>
                      <div className="text-lg font-bold text-purple-600">-{totalConsumed.toLocaleString()}</div>
                    </div>
                    <div className="text-center p-2 bg-white rounded shadow-sm">
                      <div className="text-xs text-gray-500">Balance</div>
                      <div className="text-lg font-bold text-blue-600">{totalBalance.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-500 text-center">
                    Formula: Opening Stock + Received - Transferred - Blocked - Consumed = Balance
                  </div>
                </div>
              )}

              {/* Footer Note */}
              <div className="mt-4 text-xs text-gray-400 text-center border-t pt-3">
                <p>Branch Stationery Stock Report | As On: {format(asOnDate, "dd-MM-yyyy")}</p>
                <p>Branch: {selectedBranch} | Item: {selectedItem}</p>
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
              <Package className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-600">No Stock Data Displayed</h3>
            <p className="text-sm text-gray-400 mt-1">
              Select Branch, Item and click "Show" button to view branch stationery stock.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Note: Opening Stock + Received - Transferred - Blocked - Consumed = Balance
            </p>
          </CardContent>
        </Card>
      )}

      {/* Low Stock Alert - Only when balance is low */}
      {showResults && filteredData.length > 0 && totalBalance < 10 && (
        <Card className="border-yellow-300 bg-yellow-50">
          <CardContent className="py-3">
            <div className="flex items-center gap-2 text-yellow-800">
              <span className="text-lg">⚠️</span>
              <span className="text-sm font-medium">
                Low Stock Alert: The balance stock for {selectedItem} at {selectedBranch} is only {totalBalance} {filteredData[0]?.unitType || "units"}.
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}