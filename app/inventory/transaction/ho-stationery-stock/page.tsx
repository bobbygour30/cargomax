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
import { CalendarIcon, Eye, Settings, Printer, Download, RefreshCw } from "lucide-react";

// ==================== TYPE DEFINITIONS ====================

interface StockItem {
  id: number;
  sNo: number;
  itemName: string;
  unitType: string;
  openingStock: number;
  purchased: number;
  issued: number;
  blocked: number;
  stockInHand: number;
}

// ==================== MOCK DATA ====================
const mockStockData: StockItem[] = [
  { id: 1, sNo: 1, itemName: "A4 Printer Paper", unitType: "REAM", openingStock: 50, purchased: 100, issued: 45, blocked: 5, stockInHand: 100 },
  { id: 2, sNo: 2, itemName: "Ballpoint Pen (Blue)", unitType: "BOX", openingStock: 30, purchased: 50, issued: 35, blocked: 2, stockInHand: 43 },
  { id: 3, sNo: 3, itemName: "Stapler", unitType: "PCS", openingStock: 15, purchased: 10, issued: 8, blocked: 1, stockInHand: 16 },
  { id: 4, sNo: 4, itemName: "Staples Pin", unitType: "BOX", openingStock: 25, purchased: 30, issued: 20, blocked: 2, stockInHand: 33 },
  { id: 5, sNo: 5, itemName: "Highlighters (Assorted)", unitType: "SET", openingStock: 10, purchased: 15, issued: 12, blocked: 1, stockInHand: 12 },
  { id: 6, sNo: 6, itemName: "File Folders", unitType: "PCS", openingStock: 40, purchased: 60, issued: 35, blocked: 5, stockInHand: 60 },
  { id: 7, sNo: 7, itemName: "Notebook (200 Pages)", unitType: "PCS", openingStock: 80, purchased: 100, issued: 70, blocked: 10, stockInHand: 100 },
  { id: 8, sNo: 8, itemName: "Paper Clips", unitType: "BOX", openingStock: 20, purchased: 25, issued: 15, blocked: 2, stockInHand: 28 },
  { id: 9, sNo: 9, itemName: "Whiteboard Marker", unitType: "PCS", openingStock: 12, purchased: 20, issued: 14, blocked: 1, stockInHand: 17 },
  { id: 10, sNo: 10, itemName: "Correction Pen", unitType: "PCS", openingStock: 18, purchased: 12, issued: 10, blocked: 1, stockInHand: 19 },
  { id: 11, sNo: 11, itemName: "Envelope (A4 Size)", unitType: "PACK", openingStock: 30, purchased: 40, issued: 25, blocked: 3, stockInHand: 42 },
  { id: 12, sNo: 12, itemName: "Binding Covers", unitType: "PCS", openingStock: 25, purchased: 30, issued: 18, blocked: 2, stockInHand: 35 },
];

// Item options for dropdown
const itemOptions = [
  "A4 Printer Paper",
  "Ballpoint Pen (Blue)",
  "Stapler",
  "Staples Pin",
  "Highlighters (Assorted)",
  "File Folders",
  "Notebook (200 Pages)",
  "Paper Clips",
  "Whiteboard Marker",
  "Correction Pen",
  "Envelope (A4 Size)",
  "Binding Covers"
];

// Unit type options
const unitTypeOptions = ["REAM", "BOX", "PCS", "SET", "PACK", "DOZEN", "ROLL", "KG"];

export default function HOStationeryStockRegister() {
  // ==================== STATE ====================
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [asOnDate, setAsOnDate] = useState<Date>(new Date(2026, 4, 18));
  const [showStock, setShowStock] = useState<boolean>(false);
  const [stockData, setStockData] = useState<StockItem[]>(mockStockData);
  const [filteredStockData, setFilteredStockData] = useState<StockItem[]>([]);

  // Column visibility settings
  const [columnSettings, setColumnSettings] = useState({
    sNo: true,
    itemName: true,
    unitType: true,
    openingStock: true,
    purchased: true,
    issued: true,
    blocked: true,
    stockInHand: true,
  });

  // ==================== FUNCTIONS ====================

  // Handle Show Stock button click
  const handleShowStock = () => {
    let filtered = [...stockData];
    
    if (selectedItem && selectedItem !== "ALL") {
      filtered = filtered.filter(item => item.itemName === selectedItem);
    }
    
    setFilteredStockData(filtered);
    setShowStock(true);
  };

  // Handle Clear button
  const handleClear = () => {
    setSelectedItem("");
    setAsOnDate(new Date(2026, 4, 18));
    setFilteredStockData([]);
    setShowStock(false);
  };

  // Calculate totals for summary
  const getTotalOpeningStock = () => {
    return filteredStockData.reduce((sum, item) => sum + item.openingStock, 0);
  };

  const getTotalPurchased = () => {
    return filteredStockData.reduce((sum, item) => sum + item.purchased, 0);
  };

  const getTotalIssued = () => {
    return filteredStockData.reduce((sum, item) => sum + item.issued, 0);
  };

  const getTotalBlocked = () => {
    return filteredStockData.reduce((sum, item) => sum + item.blocked, 0);
  };

  const getTotalStockInHand = () => {
    return filteredStockData.reduce((sum, item) => sum + item.stockInHand, 0);
  };

  // Handle Print
  const handlePrint = () => {
    window.print();
  };

  // Handle Export (simulate)
  const handleExport = () => {
    alert("Export to Excel functionality would be implemented here.");
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-primary">2. HO STATIONERY STOCK REGISTER</h1>
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
            📊 Stationery Stock Register
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filter Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Items Dropdown */}
            <div>
              <Label className="text-base font-medium">
                Items <span className="text-red-500">*</span>
              </Label>
              <Select value={selectedItem} onValueChange={setSelectedItem}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Item" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">ALL - Show All Items</SelectItem>
                  {itemOptions.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-400 mt-1">Select specific item or ALL to view all stationery items</p>
            </div>

            {/* As On Date */}
            <div>
              <Label className="text-base font-medium">
                As On <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal mt-1">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(asOnDate, "dd-MM-yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={asOnDate}
                    onSelect={(d) => d && setAsOnDate(d)}
                  />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-gray-400 mt-1">Stock position as on selected date</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t">
            <Button onClick={handleShowStock} className="bg-blue-600 hover:bg-blue-700">
              <Eye className="mr-2 h-4 w-4" /> Show Stock
            </Button>
            <Button variant="outline" onClick={handleClear}>
              <RefreshCw className="mr-2 h-4 w-4" /> Clear
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
          </div>

          {/* Stock Register Table - Only shown after Show Stock click */}
          {showStock && (
            <div className="mt-8">
              {/* Info Bar */}
              <div className="bg-gray-50 p-3 rounded-lg mb-4 flex justify-between items-center">
                <div>
                  <span className="text-sm text-gray-600">
                    <strong>As On Date:</strong> {format(asOnDate, "dd-MM-yyyy")}
                  </span>
                  <span className="text-sm text-gray-600 ml-4">
                    <strong>Selected Item:</strong> {selectedItem === "ALL" || !selectedItem ? "All Items" : selectedItem}
                  </span>
                  <span className="text-sm text-gray-600 ml-4">
                    <strong>Total Records:</strong> {filteredStockData.length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-gray-500" />
                  <span className="text-xs text-gray-500">Column Settings below</span>
                </div>
              </div>

              {/* Column Settings */}
              <div className="mb-4 p-3 bg-gray-100 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium">Column Settings</span>
                </div>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={columnSettings.sNo}
                      onCheckedChange={(c) => setColumnSettings({ ...columnSettings, sNo: !!c })}
                    />
                    <Label className="text-sm cursor-pointer">S#</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={columnSettings.itemName}
                      onCheckedChange={(c) => setColumnSettings({ ...columnSettings, itemName: !!c })}
                    />
                    <Label className="text-sm cursor-pointer">Item Name</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={columnSettings.unitType}
                      onCheckedChange={(c) => setColumnSettings({ ...columnSettings, unitType: !!c })}
                    />
                    <Label className="text-sm cursor-pointer">Unit Type</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={columnSettings.openingStock}
                      onCheckedChange={(c) => setColumnSettings({ ...columnSettings, openingStock: !!c })}
                    />
                    <Label className="text-sm cursor-pointer">Opening Stock</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={columnSettings.purchased}
                      onCheckedChange={(c) => setColumnSettings({ ...columnSettings, purchased: !!c })}
                    />
                    <Label className="text-sm cursor-pointer">Purchased</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={columnSettings.issued}
                      onCheckedChange={(c) => setColumnSettings({ ...columnSettings, issued: !!c })}
                    />
                    <Label className="text-sm cursor-pointer">Issued</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={columnSettings.blocked}
                      onCheckedChange={(c) => setColumnSettings({ ...columnSettings, blocked: !!c })}
                    />
                    <Label className="text-sm cursor-pointer">Blocked</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={columnSettings.stockInHand}
                      onCheckedChange={(c) => setColumnSettings({ ...columnSettings, stockInHand: !!c })}
                    />
                    <Label className="text-sm cursor-pointer">Stock In Hand</Label>
                  </div>
                </div>
              </div>

              {/* Stock Register Table */}
              <div className="overflow-x-auto border rounded-lg">
                <Table>
                  <TableHeader className="bg-gray-100">
                    <TableRow>
                      {columnSettings.sNo && (
                        <TableHead className="w-16 text-center">S#</TableHead>
                      )}
                      {columnSettings.itemName && (
                        <TableHead>Item Name</TableHead>
                      )}
                      {columnSettings.unitType && (
                        <TableHead className="w-24">Unit Type</TableHead>
                      )}
                      {columnSettings.openingStock && (
                        <TableHead className="text-right w-28">Opening Stock</TableHead>
                      )}
                      {columnSettings.purchased && (
                        <TableHead className="text-right w-28">Purchased</TableHead>
                      )}
                      {columnSettings.issued && (
                        <TableHead className="text-right w-24">Issued</TableHead>
                      )}
                      {columnSettings.blocked && (
                        <TableHead className="text-right w-24">Blocked</TableHead>
                      )}
                      {columnSettings.stockInHand && (
                        <TableHead className="text-right w-32">Stock In Hand</TableHead>
                      )}
                      {columnSettings.stockInHand && (
                        <TableHead className="w-16 text-center">Action</TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStockData.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={Object.values(columnSettings).filter(Boolean).length + 1}
                          className="text-center py-8 text-gray-500"
                        >
                          No stock data found. Please select an item and click "Show Stock".
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStockData.map((item) => (
                        <TableRow key={item.id} className="hover:bg-gray-50">
                          {columnSettings.sNo && (
                            <TableCell className="text-center">{item.sNo}</TableCell>
                          )}
                          {columnSettings.itemName && (
                            <TableCell className="font-medium">{item.itemName}</TableCell>
                          )}
                          {columnSettings.unitType && (
                            <TableCell>
                              <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                                {item.unitType}
                              </span>
                            </TableCell>
                          )}
                          {columnSettings.openingStock && (
                            <TableCell className="text-right">{item.openingStock.toLocaleString()}</TableCell>
                          )}
                          {columnSettings.purchased && (
                            <TableCell className="text-right text-green-600">
                              +{item.purchased.toLocaleString()}
                            </TableCell>
                          )}
                          {columnSettings.issued && (
                            <TableCell className="text-right text-red-600">
                              -{item.issued.toLocaleString()}
                            </TableCell>
                          )}
                          {columnSettings.blocked && (
                            <TableCell className="text-right text-orange-600">
                              {item.blocked.toLocaleString()}
                            </TableCell>
                          )}
                          {columnSettings.stockInHand && (
                            <TableCell className="text-right font-bold text-blue-600">
                              {item.stockInHand.toLocaleString()}
                            </TableCell>
                          )}
                          {columnSettings.stockInHand && (
                            <TableCell className="text-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-600 hover:text-blue-800"
                                onClick={() => alert(`Details for ${item.itemName}\nOpening: ${item.openingStock}\nPurchased: ${item.purchased}\nIssued: ${item.issued}\nBlocked: ${item.blocked}\nStock In Hand: ${item.stockInHand}`)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          )}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Summary Section */}
              {filteredStockData.length > 0 && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-3">Summary</h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center p-3 bg-white rounded shadow-sm">
                      <div className="text-xs text-gray-500">Total Opening Stock</div>
                      <div className="text-xl font-bold text-gray-700">{getTotalOpeningStock().toLocaleString()}</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded shadow-sm">
                      <div className="text-xs text-gray-500">Total Purchased</div>
                      <div className="text-xl font-bold text-green-600">+{getTotalPurchased().toLocaleString()}</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded shadow-sm">
                      <div className="text-xs text-gray-500">Total Issued</div>
                      <div className="text-xl font-bold text-red-600">-{getTotalIssued().toLocaleString()}</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded shadow-sm">
                      <div className="text-xs text-gray-500">Total Blocked</div>
                      <div className="text-xl font-bold text-orange-600">{getTotalBlocked().toLocaleString()}</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded shadow-sm">
                      <div className="text-xs text-gray-500">Total Stock In Hand</div>
                      <div className="text-xl font-bold text-blue-600">{getTotalStockInHand().toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Note */}
              <div className="mt-4 text-xs text-gray-400 text-center border-t pt-3">
                <p>Stock Register as on {format(asOnDate, "dd-MM-yyyy")} | HO Stationery Department</p>
                <p>Note: Opening Stock + Purchased - Issued - Blocked = Stock In Hand</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card - When no report is shown */}
      {!showStock && (
        <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
          <CardContent className="py-12 text-center">
            <div className="text-gray-400 mb-2">
              <Eye className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-600">No Stock Data Displayed</h3>
            <p className="text-sm text-gray-400 mt-1">
              Select an item and click "Show Stock" button to view stationery stock register.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Low Stock Alert Card - Optional Feature */}
      {showStock && filteredStockData.some(item => item.stockInHand < 10) && (
        <Card className="border-yellow-300 bg-yellow-50">
          <CardContent className="py-3">
            <div className="flex items-center gap-2 text-yellow-800">
              <span className="text-lg">⚠️</span>
              <span className="text-sm font-medium">
                Low Stock Alert: Following items have stock less than 10 units:
              </span>
              <span className="text-sm">
                {filteredStockData.filter(item => item.stockInHand < 10).map(item => item.itemName).join(", ")}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}