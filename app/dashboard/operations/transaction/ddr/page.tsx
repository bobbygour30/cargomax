"use client";

import React, { useState, useEffect } from "react";
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
  Printer,
  FileText,
  Eye,
  X,
  FileSpreadsheet,
  Filter,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Package,
  Truck,
  Users,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface DDRItem {
  id: number;
  gatepassNo: string;
  grNo: string;
  grDate: Date;
  pckgs: number;
  weight: number;
  rate: number;
  freight: number;
  deliveryCharge: number;
  otherCharge: number;
  gst: number;
  advance: number;
  totalAmount: number;
  rebate: number;
  recdAmount: number;
  dueAmount: number;
  billAmount: number;
  tds: number;
  wcn: number;
  partyName: string;
  arrivalDate: Date;
  voucherNo: string;
  refNo: string;
  cashRecd: number;
  chequeRecd: number;
  status: "pending" | "generated" | "cancelled";
}

const branchOptions = [
  "CORPORATE OFFICE",
  "DELHI",
  "MUMBAI",
  "BANGALORE",
  "CHENNAI",
  "KOLKATA",
  "AHMEDABAD",
  "PUNE",
  "HYDERABAD",
  "LUCKNOW",
  "KANPUR",
  "JAIPUR",
];

export default function DDRPage() {
  // Main state
  const [activeTab, setActiveTab] = useState<"generate" | "history">("generate");
  const [branch, setBranch] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [ddrNo, setDdrNo] = useState<string>("");
  const [auto, setAuto] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [historyCurrentPage, setHistoryCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 10;
  const [ddrItems, setDdrItems] = useState<DDRItem[]>([]);
  const [generatedDDRs, setGeneratedDDRs] = useState<DDRItem[][]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  const [totals, setTotals] = useState({
    noOfGR: 0,
    totalPckgs: 0,
    totalWeight: 0,
    totalFreight: 0,
    totalDeliveryCharge: 0,
    totalOtherCharge: 0,
    totalGST: 0,
    totalAdvance: 0,
    totalAmount: 0,
    totalRebate: 0,
    totalRecdAmount: 0,
    totalDueAmount: 0,
    totalBillAmount: 0,
    totalTDS: 0,
    totalWCN: 0,
    totalCashRecd: 0,
    totalChequeRecd: 0,
  });

  const deliveryTotals = {
    totalDelivery: 0,
    cashDelivery: 0,
    chequeDelivery: 0,
    journalDelivery: 0,
    markForBillDelivery: 0,
    dueGatePassDelivery: 0,
  };

  const generateDDRNo = (): string => {
    const count = generatedDDRs.length + 1;
    return `DDR${String(count).padStart(6, "0")}`;
  };

  const handleAutoChange = () => {
    setAuto(!auto);
    if (!auto) {
      setDdrNo(generateDDRNo());
    } else {
      setDdrNo("");
    }
  };

  const calculateTotals = (items: DDRItem[]) => {
    const newTotals = {
      noOfGR: items.length,
      totalPckgs: items.reduce((sum, item) => sum + item.pckgs, 0),
      totalWeight: items.reduce((sum, item) => sum + item.weight, 0),
      totalFreight: items.reduce((sum, item) => sum + item.freight, 0),
      totalDeliveryCharge: items.reduce((sum, item) => sum + item.deliveryCharge, 0),
      totalOtherCharge: items.reduce((sum, item) => sum + item.otherCharge, 0),
      totalGST: items.reduce((sum, item) => sum + item.gst, 0),
      totalAdvance: items.reduce((sum, item) => sum + item.advance, 0),
      totalAmount: items.reduce((sum, item) => sum + item.totalAmount, 0),
      totalRebate: items.reduce((sum, item) => sum + item.rebate, 0),
      totalRecdAmount: items.reduce((sum, item) => sum + item.recdAmount, 0),
      totalDueAmount: items.reduce((sum, item) => sum + item.dueAmount, 0),
      totalBillAmount: items.reduce((sum, item) => sum + item.billAmount, 0),
      totalTDS: items.reduce((sum, item) => sum + item.tds, 0),
      totalWCN: items.reduce((sum, item) => sum + item.wcn, 0),
      totalCashRecd: items.reduce((sum, item) => sum + item.cashRecd, 0),
      totalChequeRecd: items.reduce((sum, item) => sum + item.chequeRecd, 0),
    };
    setTotals(newTotals);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(ddrItems.map(item => item.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectItem = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(i => i !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      const sampleData: DDRItem[] = [
        {
          id: 1,
          gatepassNo: "GP001",
          grNo: "GR0001",
          grDate: new Date("2026-04-25"),
          pckgs: 10,
          weight: 500,
          rate: 25,
          freight: 12500,
          deliveryCharge: 500,
          otherCharge: 200,
          gst: 2250,
          advance: 5000,
          totalAmount: 15450,
          rebate: 0,
          recdAmount: 10000,
          dueAmount: 5450,
          billAmount: 15450,
          tds: 0,
          wcn: 0,
          partyName: "M/s ABC Traders",
          arrivalDate: new Date("2026-04-28"),
          voucherNo: "V001",
          refNo: "REF001",
          cashRecd: 5000,
          chequeRecd: 5000,
          status: "pending",
        },
        {
          id: 2,
          gatepassNo: "GP002",
          grNo: "GR0002",
          grDate: new Date("2026-04-26"),
          pckgs: 15,
          weight: 750,
          rate: 22,
          freight: 16500,
          deliveryCharge: 700,
          otherCharge: 300,
          gst: 2970,
          advance: 8000,
          totalAmount: 20470,
          rebate: 500,
          recdAmount: 15000,
          dueAmount: 4970,
          billAmount: 19970,
          tds: 200,
          wcn: 0,
          partyName: "M/s XYZ Enterprises",
          arrivalDate: new Date("2026-04-29"),
          voucherNo: "V002",
          refNo: "REF002",
          cashRecd: 8000,
          chequeRecd: 7000,
          status: "pending",
        },
        {
          id: 3,
          gatepassNo: "GP003",
          grNo: "GR0003",
          grDate: new Date("2026-04-27"),
          pckgs: 20,
          weight: 1000,
          rate: 20,
          freight: 20000,
          deliveryCharge: 1000,
          otherCharge: 500,
          gst: 3600,
          advance: 10000,
          totalAmount: 25100,
          rebate: 1000,
          recdAmount: 20000,
          dueAmount: 4100,
          billAmount: 24100,
          tds: 300,
          wcn: 0,
          partyName: "M/s PQR Limited",
          arrivalDate: new Date("2026-04-30"),
          voucherNo: "V003",
          refNo: "REF003",
          cashRecd: 10000,
          chequeRecd: 10000,
          status: "pending",
        },
      ];
      
      let filteredData = sampleData;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredData = sampleData.filter(item => 
          item.grNo.toLowerCase().includes(term) ||
          item.gatepassNo.toLowerCase().includes(term) ||
          item.partyName.toLowerCase().includes(term)
        );
      }
      
      setDdrItems(filteredData);
      calculateTotals(filteredData);
      setSelectedItems([]);
      setSelectAll(false);
      setLoading(false);
    }, 500);
  };

  const handleGenerate = () => {
    if (!branch) {
      alert("Please select Branch");
      return;
    }
    if (selectedItems.length === 0) {
      alert("Please select at least one item to generate DDR");
      return;
    }

    const selectedData = ddrItems.filter(item => selectedItems.includes(item.id));
    const ddrNumber = auto ? generateDDRNo() : ddrNo;
    
    const generatedData = selectedData.map(item => ({
      ...item,
      status: "generated" as const,
    }));
    
    setGeneratedDDRs([...generatedDDRs, generatedData]);
    
    // Remove generated items from current list
    const remainingItems = ddrItems.filter(item => !selectedItems.includes(item.id));
    setDdrItems(remainingItems);
    calculateTotals(remainingItems);
    setSelectedItems([]);
    setSelectAll(false);
    
    alert(`DDR ${ddrNumber} generated successfully with ${selectedItems.length} items!`);
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel the selected items?")) {
      const remainingItems = ddrItems.filter(item => !selectedItems.includes(item.id));
      setDdrItems(remainingItems);
      calculateTotals(remainingItems);
      setSelectedItems([]);
      setSelectAll(false);
      alert("Selected items cancelled successfully!");
    }
  };

  const handlePrint = () => {
    if (ddrItems.length === 0 && generatedDDRs.length === 0) {
      alert("No data to print");
      return;
    }
    window.print();
  };

  const handleClear = () => {
    setBranch("");
    setDate(new Date());
    setDdrNo("");
    setAuto(true);
    setDdrItems([]);
    setSearchTerm("");
    setSelectedItems([]);
    setSelectAll(false);
    setTotals({
      noOfGR: 0,
      totalPckgs: 0,
      totalWeight: 0,
      totalFreight: 0,
      totalDeliveryCharge: 0,
      totalOtherCharge: 0,
      totalGST: 0,
      totalAdvance: 0,
      totalAmount: 0,
      totalRebate: 0,
      totalRecdAmount: 0,
      totalDueAmount: 0,
      totalBillAmount: 0,
      totalTDS: 0,
      totalWCN: 0,
      totalCashRecd: 0,
      totalChequeRecd: 0,
    });
  };

  const handleVoucherPrint = () => {
    if (selectedItems.length === 0) {
      alert("Please select items to print voucher");
      return;
    }
    alert(`Voucher print initiated for ${selectedItems.length} items!`);
  };

  // Get filtered history items
  const allHistoryItems = generatedDDRs.flat();
  const filteredHistory = allHistoryItems.filter(item => 
    item.grNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.partyName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const historyTotalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const paginatedHistory = filteredHistory.slice((historyCurrentPage - 1) * itemsPerPage, historyCurrentPage * itemsPerPage);
  const goToHistoryPage = (page: number) => setHistoryCurrentPage(Math.max(1, Math.min(page, historyTotalPages)));

  const totalPages = Math.ceil(ddrItems.length / itemsPerPage);
  const paginatedResults = ddrItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  // Stats
  const stats = {
    totalPending: ddrItems.length,
    totalGenerated: allHistoryItems.length,
    totalFreight: ddrItems.reduce((sum, item) => sum + item.freight, 0),
    totalGeneratedFreight: allHistoryItems.reduce((sum, item) => sum + item.freight, 0),
  };

  return (
    <div className="space-y-4 p-3 md:p-4 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">DDR (Delivery Receipt)</h1>
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
          onClick={() => setActiveTab("generate")}
          className={cn(
            "px-6 py-2.5 text-sm font-medium transition-all rounded-t-lg flex items-center gap-2",
            activeTab === "generate"
              ? "bg-blue-600 text-white shadow-md"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          )}
        >
          <FileText className="h-4 w-4" />
          Generate DDR
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={cn(
            "px-6 py-2.5 text-sm font-medium transition-all rounded-t-lg flex items-center gap-2",
            activeTab === "history"
              ? "bg-green-600 text-white shadow-md"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          )}
        >
          <History className="h-4 w-4" />
          DDR History
        </button>
      </div>

      {/* Generate DDR Tab */}
      {activeTab === "generate" && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Pending Items</p>
                    <p className="text-2xl font-bold">{stats.totalPending}</p>
                  </div>
                  <Package className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Generated DDRs</p>
                    <p className="text-2xl font-bold">{stats.totalGenerated}</p>
                  </div>
                  <FileText className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Pending Freight</p>
                    <p className="text-2xl font-bold">₹{stats.totalFreight.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Generated Freight</p>
                    <p className="text-2xl font-bold">₹{stats.totalGeneratedFreight.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form Fields */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Filter className="h-4 w-4" />
                DDR Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Branch</Label>
                  <Select value={branch} onValueChange={setBranch}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="SELECT BRANCH" />
                    </SelectTrigger>
                    <SelectContent>
                      {branchOptions.map((opt) => (
                        <SelectItem key={opt} value={opt} className="text-sm">
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-9 w-full justify-start text-left text-sm">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(date, "dd-MM-yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">DDR #</Label>
                  <div className="flex gap-2">
                    <Input
                      value={ddrNo}
                      onChange={(e) => setDdrNo(e.target.value)}
                      readOnly={auto}
                      placeholder="DDR Number"
                      className={cn("h-9 text-sm flex-1", auto && "bg-gray-50")}
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={auto}
                        onChange={handleAutoChange}
                        className="h-4 w-4"
                        id="auto"
                      />
                      <Label htmlFor="auto" className="text-xs cursor-pointer">
                        Auto
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 items-end">
                  <Button onClick={() => {}} variant="outline" size="sm" className="h-9 text-xs">
                    <FileSpreadsheet className="mr-1 h-3.5 w-3.5" />
                    Pending DDR
                  </Button>
                  <Button onClick={() => {}} variant="outline" size="sm" className="h-9 text-xs">
                    <Eye className="mr-1 h-3.5 w-3.5" />
                    Show Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search Bar */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-[11px] font-semibold flex items-center gap-2 text-gray-700">
                <Search className="h-3.5 w-3.5" />
                Search GR / Gatepass
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <Input
                    placeholder="Search by GR #, Gatepass # or Party Name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 h-9 text-sm"
                  />
                </div>
                <Button onClick={handleSearch} size="sm" className="h-9 bg-blue-600 hover:bg-blue-700 text-xs" disabled={loading}>
                  <Search className="mr-1 h-3.5 w-3.5" />
                  Search
                </Button>
                <Button onClick={handleClear} variant="outline" size="sm" className="h-9 text-xs">
                  <RefreshCw className="mr-1 h-3.5 w-3.5" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Main Table */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Table className="h-3.5 w-3.5 text-gray-500" />
                  <h3 className="text-[11px] font-semibold text-gray-800">
                    Delivery Items List
                  </h3>
                </div>
                <div className="text-[10px] text-gray-500">
                  Total: {ddrItems.length} records
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <div className="min-w-[1600px]">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="py-2 px-1 w-8 text-center">
                          <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleSelectAll}
                            className="h-3.5 w-3.5"
                          />
                        </TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-1 w-12 text-center">#</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-1 min-w-[80px]">Gatepass #</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-1 min-w-[80px]">GR #</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-1 min-w-[80px]">GR Date</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-1 w-[50px] text-center">Pckgs</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-1 w-[60px] text-center">Weight</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-1 w-[70px] text-right">Freight</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-1 w-[80px] text-right">Delivery Chg</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-1 w-[70px] text-right">Total Amt</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-1 w-[70px] text-right">Due Amt</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-1 min-w-[120px]">Party Name</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-1 min-w-[80px]">Arrival Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedResults.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={13} className="text-center py-8 text-gray-500">
                            <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            No items to display. Click SEARCH to load data.
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedResults.map((item, idx) => (
                          <TableRow key={item.id} className="hover:bg-gray-50">
                            <TableCell className="py-1.5 px-1 text-center">
                              <input
                                type="checkbox"
                                checked={selectedItems.includes(item.id)}
                                onChange={() => handleSelectItem(item.id)}
                                className="h-3.5 w-3.5"
                              />
                            </TableCell>
                            <TableCell className="py-1.5 px-1 text-center text-xs">
                              {(currentPage - 1) * itemsPerPage + idx + 1}
                            </TableCell>
                            <TableCell className="py-1.5 px-1 font-mono text-xs">{item.gatepassNo}</TableCell>
                            <TableCell className="py-1.5 px-1 font-mono text-xs">{item.grNo}</TableCell>
                            <TableCell className="py-1.5 px-1 text-xs">{format(item.grDate, "dd-MM-yyyy")}</TableCell>
                            <TableCell className="py-1.5 px-1 text-center text-xs">{item.pckgs}</TableCell>
                            <TableCell className="py-1.5 px-1 text-center text-xs">{item.weight}</TableCell>
                            <TableCell className="py-1.5 px-1 text-right text-xs">₹{item.freight.toLocaleString()}</TableCell>
                            <TableCell className="py-1.5 px-1 text-right text-xs">₹{item.deliveryCharge.toLocaleString()}</TableCell>
                            <TableCell className="py-1.5 px-1 text-right font-medium text-xs">₹{item.totalAmount.toLocaleString()}</TableCell>
                            <TableCell className="py-1.5 px-1 text-right text-red-600 text-xs">₹{item.dueAmount.toLocaleString()}</TableCell>
                            <TableCell className="py-1.5 px-1 text-xs">{item.partyName}</TableCell>
                            <TableCell className="py-1.5 px-1 text-xs">{format(item.arrivalDate, "dd-MM-yyyy")}</TableCell>
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
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, ddrItems.length)} of {ddrItems.length} entries
                  </div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="h-7 text-[10px]">
                      <ChevronLeft className="h-3 w-3 mr-1" /> Previous
                    </Button>
                    <span className="px-3 py-1 text-[10px]">Page {currentPage} of {totalPages}</span>
                    <Button variant="outline" size="sm" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="h-7 text-[10px]">
                      Next <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Totals Row */}
          {ddrItems.length > 0 && (
            <Card className="bg-gray-50">
              <CardContent className="p-3">
                <div className="flex flex-wrap justify-between gap-2 text-[10px]">
                  <div className="flex gap-4 flex-wrap">
                    <span className="font-semibold">Total:</span>
                    <span>GR: {totals.noOfGR}</span>
                    <span>Pckgs: {totals.totalPckgs}</span>
                    <span>Weight: {totals.totalWeight}</span>
                    <span>Freight: ₹{totals.totalFreight.toLocaleString()}</span>
                    <span>Delivery: ₹{totals.totalDeliveryCharge.toLocaleString()}</span>
                    <span>Total Amt: ₹{totals.totalAmount.toLocaleString()}</span>
                    <span>Due Amt: ₹{totals.totalDueAmount.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons Footer */}
          <div className="flex flex-wrap justify-end gap-3 pt-2 border-t">
            <Button onClick={handleGenerate} size="sm" className="h-8 text-xs bg-green-600 hover:bg-green-700">
              <Save className="mr-1 h-3 w-3" />
              Generate DDR
            </Button>
            <Button onClick={handleCancel} variant="destructive" size="sm" className="h-8 text-xs">
              <X className="mr-1 h-3 w-3" />
              Cancel Selected
            </Button>
            <Button onClick={handlePrint} variant="outline" size="sm" className="h-8 text-xs">
              <Printer className="mr-1 h-3 w-3" />
              Print
            </Button>
            <Button onClick={handleVoucherPrint} variant="outline" size="sm" className="h-8 text-xs">
              <FileText className="mr-1 h-3 w-3" />
              Voucher Print
            </Button>
          </div>
        </>
      )}

      {/* DDR History Tab */}
      {activeTab === "history" && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Total Generated DDRs</p>
                    <p className="text-2xl font-bold">{allHistoryItems.length}</p>
                  </div>
                  <FileText className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Total Freight</p>
                    <p className="text-2xl font-bold">₹{stats.totalGeneratedFreight.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search Bar for History */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-[11px] font-semibold flex items-center gap-2 text-gray-700">
                <Search className="h-3.5 w-3.5" />
                Search DDR History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <Input
                    placeholder="Search by GR # or Party Name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 h-9 text-sm"
                  />
                </div>
                <Button onClick={() => setHistoryCurrentPage(1)} className="h-9 bg-blue-600 hover:bg-blue-700 text-xs">
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
                <div className="flex items-center gap-2">
                  <History className="h-3.5 w-3.5 text-gray-500" />
                  <h3 className="text-[11px] font-semibold text-gray-800">
                    Generated DDR History
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
                        <TableHead className="text-[11px] font-semibold py-2 px-1 w-12 text-center">#</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-1 min-w-[80px]">Gatepass #</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-1 min-w-[80px]">GR #</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-1 min-w-[80px]">GR Date</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-1 w-[50px] text-center">Pckgs</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-1 w-[70px] text-right">Freight</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-1 w-[70px] text-right">Total Amt</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-1 min-w-[120px]">Party Name</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-1 w-20 text-center">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedHistory.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                            <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            No DDR history found
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedHistory.map((item, idx) => (
                          <TableRow key={item.id} className="hover:bg-gray-50">
                            <TableCell className="py-1.5 px-1 text-center text-xs">
                              {(historyCurrentPage - 1) * itemsPerPage + idx + 1}
                            </TableCell>
                            <TableCell className="py-1.5 px-1 font-mono text-xs">{item.gatepassNo}</TableCell>
                            <TableCell className="py-1.5 px-1 font-mono text-xs">{item.grNo}</TableCell>
                            <TableCell className="py-1.5 px-1 text-xs">{format(item.grDate, "dd-MM-yyyy")}</TableCell>
                            <TableCell className="py-1.5 px-1 text-center text-xs">{item.pckgs}</TableCell>
                            <TableCell className="py-1.5 px-1 text-right text-xs">₹{item.freight.toLocaleString()}</TableCell>
                            <TableCell className="py-1.5 px-1 text-right text-xs">₹{item.totalAmount.toLocaleString()}</TableCell>
                            <TableCell className="py-1.5 px-1 text-xs">{item.partyName}</TableCell>
                            <TableCell className="py-1.5 px-1 text-center">
                              <Badge className="bg-green-100 text-green-700 text-[10px]">Generated</Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Pagination for History */}
              {historyTotalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-[10px] text-gray-500">
                    Showing {((historyCurrentPage - 1) * itemsPerPage) + 1} to {Math.min(historyCurrentPage * itemsPerPage, filteredHistory.length)} of {filteredHistory.length} entries
                  </div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" onClick={() => goToHistoryPage(historyCurrentPage - 1)} disabled={historyCurrentPage === 1} className="h-7 text-[10px]">
                      <ChevronLeft className="h-3 w-3 mr-1" /> Previous
                    </Button>
                    <span className="px-3 py-1 text-[10px]">Page {historyCurrentPage} of {historyTotalPages}</span>
                    <Button variant="outline" size="sm" onClick={() => goToHistoryPage(historyCurrentPage + 1)} disabled={historyCurrentPage === historyTotalPages} className="h-7 text-[10px]">
                      Next <ChevronRight className="h-3 w-3 ml-1" />
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

// Missing import
import { History } from "lucide-react";