"use client";

import React, { useState, useRef, useEffect } from "react";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, FileSpreadsheet, Search, RefreshCw, Save, X, Check, AlertCircle, Eye, Download, Trash2, Filter, ChevronLeft, ChevronRight, DollarSign, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import * as XLSX from "xlsx";

interface DRRecord {
  id: number;
  grNo: string;
  grDate: Date;
  branch: string;
  origin: string;
  drNo: string;
  drDate: Date;
  pckgs: number;
  chargeWeight: number;
  freight: number;
  serviceTax: number;
  otherAmt: number;
  total: number;
  rebate: number;
  recdAmt: number;
  cartage: number;
  codCharges: number;
  delhiSTax: number;
  deliveryCharge: number;
  demurrage: number;
  enrouteCharge: number;
  entryTax: number;
  hamali: number;
  insuranceCharge: number;
  miscCharge: number;
  newMiscCharge: number;
  octroiCharge: number;
  octroiServiceCh: number;
  octroiServiceCharge: number;
  osc: number;
  oscCharges: number;
  otherCharge: number;
  otherChargeBooking: number;
  otherExpense: number;
  pfCharges: number;
  staticalCharge: number;
  surcharge: number;
  status: "pending" | "updated";
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

const actionOptions = [
  "Update Charges",
  "Recalculate",
  "Reset to Zero",
  "Apply to All",
];

export default function DRChargeUpdate() {
  // Main state
  const [activeTab, setActiveTab] = useState<"update" | "history">("update");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [drRecords, setDrRecords] = useState<DRRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [historyCurrentPage, setHistoryCurrentPage] = useState<number>(1);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [selectedRecords, setSelectedRecords] = useState<number[]>([]);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [updatedRecords, setUpdatedRecords] = useState<DRRecord[]>([]);
  const itemsPerPage: number = 10;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample data for demonstration
  const [sampleData] = useState<DRRecord[]>([
    {
      id: 1, grNo: "GR001", grDate: new Date("2026-04-25"), branch: "DELHI", origin: "DELHI",
      drNo: "DR001", drDate: new Date("2026-04-26"), pckgs: 10, chargeWeight: 500,
      freight: 12500, serviceTax: 2250, otherAmt: 500, total: 15250, rebate: 0, recdAmt: 10000,
      cartage: 0, codCharges: 0, delhiSTax: 0, deliveryCharge: 0, demurrage: 0, enrouteCharge: 0,
      entryTax: 0, hamali: 0, insuranceCharge: 0, miscCharge: 0, newMiscCharge: 0, octroiCharge: 0,
      octroiServiceCh: 0, octroiServiceCharge: 0, osc: 0, oscCharges: 0, otherCharge: 0,
      otherChargeBooking: 0, otherExpense: 0, pfCharges: 0, staticalCharge: 0, surcharge: 0,
      status: "pending",
    },
    {
      id: 2, grNo: "GR002", grDate: new Date("2026-04-26"), branch: "MUMBAI", origin: "MUMBAI",
      drNo: "DR002", drDate: new Date("2026-04-27"), pckgs: 15, chargeWeight: 750,
      freight: 16500, serviceTax: 2970, otherAmt: 700, total: 20170, rebate: 500, recdAmt: 15000,
      cartage: 0, codCharges: 0, delhiSTax: 0, deliveryCharge: 0, demurrage: 0, enrouteCharge: 0,
      entryTax: 0, hamali: 0, insuranceCharge: 0, miscCharge: 0, newMiscCharge: 0, octroiCharge: 0,
      octroiServiceCh: 0, octroiServiceCharge: 0, osc: 0, oscCharges: 0, otherCharge: 0,
      otherChargeBooking: 0, otherExpense: 0, pfCharges: 0, staticalCharge: 0, surcharge: 0,
      status: "pending",
    },
    {
      id: 3, grNo: "GR003", grDate: new Date("2026-04-27"), branch: "BANGALORE", origin: "BANGALORE",
      drNo: "DR003", drDate: new Date("2026-04-28"), pckgs: 8, chargeWeight: 400,
      freight: 10800, serviceTax: 1944, otherAmt: 300, total: 13044, rebate: 0, recdAmt: 13044,
      cartage: 0, codCharges: 0, delhiSTax: 0, deliveryCharge: 0, demurrage: 0, enrouteCharge: 0,
      entryTax: 0, hamali: 0, insuranceCharge: 0, miscCharge: 0, newMiscCharge: 0, octroiCharge: 0,
      octroiServiceCh: 0, octroiServiceCharge: 0, osc: 0, oscCharges: 0, otherCharge: 0,
      otherChargeBooking: 0, otherExpense: 0, pfCharges: 0, staticalCharge: 0, surcharge: 0,
      status: "pending",
    },
    {
      id: 4, grNo: "GR004", grDate: new Date("2026-04-28"), branch: "CHENNAI", origin: "CHENNAI",
      drNo: "DR004", drDate: new Date("2026-04-29"), pckgs: 12, chargeWeight: 600,
      freight: 14400, serviceTax: 2592, otherAmt: 400, total: 17392, rebate: 200, recdAmt: 15000,
      cartage: 0, codCharges: 0, delhiSTax: 0, deliveryCharge: 0, demurrage: 0, enrouteCharge: 0,
      entryTax: 0, hamali: 0, insuranceCharge: 0, miscCharge: 0, newMiscCharge: 0, octroiCharge: 0,
      octroiServiceCh: 0, octroiServiceCharge: 0, osc: 0, oscCharges: 0, otherCharge: 0,
      otherChargeBooking: 0, otherExpense: 0, pfCharges: 0, staticalCharge: 0, surcharge: 0,
      status: "pending",
    },
  ]);

  const [historyRecords, setHistoryRecords] = useState<DRRecord[]>([]);

  // Load data on mount
  useEffect(() => {
    setHistoryRecords([]);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleImport = () => {
    if (!selectedFile) {
      alert("Please select an XLS file first");
      return;
    }

    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const drNumbers: string[] = [];
      const startRow = 0;
      for (let i = startRow; i < jsonData.length; i++) {
        const row = jsonData[i] as any[];
        if (row && row[0] && row[0].toString().trim()) {
          drNumbers.push(row[0].toString().trim());
        }
      }

      if (drNumbers.length === 0) {
        alert("No DR numbers found in the file. Please ensure column A contains DR numbers.");
        setLoading(false);
        return;
      }

      const filteredRecords = sampleData.filter(record =>
        drNumbers.includes(record.drNo)
      );

      setDrRecords(filteredRecords);
      setSelectedRecords([]);
      setSelectAll(false);
      setSuccessMessage(`Imported ${filteredRecords.length} DR records successfully!`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setLoading(false);
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  const handleSearch = () => {
    if (!searchTerm) {
      setDrRecords(sampleData);
    } else {
      const filtered = sampleData.filter(record =>
        record.grNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.drNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.branch.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setDrRecords(filtered);
    }
    setCurrentPage(1);
    setSelectedRecords([]);
    setSelectAll(false);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRecords([]);
    } else {
      setSelectedRecords(drRecords.map(record => record.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectRecord = (id: number) => {
    if (selectedRecords.includes(id)) {
      setSelectedRecords(selectedRecords.filter(i => i !== id));
    } else {
      setSelectedRecords([...selectedRecords, id]);
    }
  };

  const handleUpdateField = (id: number, field: keyof DRRecord, value: number) => {
    setDrRecords(drRecords.map(record =>
      record.id === id ? { ...record, [field]: value } : record
    ));
  };

  const handleApplyAction = () => {
    if (!selectedAction) {
      alert("Please select an action");
      return;
    }
    if (selectedRecords.length === 0) {
      alert("Please select at least one record to update");
      return;
    }

    let updatedCount = 0;

    if (selectedAction === "Reset to Zero") {
      const updated = drRecords.map(record => {
        if (selectedRecords.includes(record.id)) {
          updatedCount++;
          return {
            ...record,
            cartage: 0, codCharges: 0, delhiSTax: 0, deliveryCharge: 0,
            demurrage: 0, enrouteCharge: 0, entryTax: 0, hamali: 0,
            insuranceCharge: 0, miscCharge: 0, newMiscCharge: 0, octroiCharge: 0,
            octroiServiceCh: 0, octroiServiceCharge: 0, osc: 0, oscCharges: 0,
            otherCharge: 0, otherChargeBooking: 0, otherExpense: 0, pfCharges: 0,
            staticalCharge: 0, surcharge: 0,
            status: "updated" as const,
          };
        }
        return record;
      });
      setDrRecords(updated);
    } else {
      const updated = drRecords.map(record => {
        if (selectedRecords.includes(record.id)) {
          updatedCount++;
          return { ...record, status: "updated" as const };
        }
        return record;
      });
      setDrRecords(updated);
    }

    setSuccessMessage(`Action "${selectedAction}" applied to ${updatedCount} records!`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleSaveCharges = () => {
    if (selectedRecords.length === 0) {
      alert("Please select at least one record to save");
      return;
    }

    const savedRecords = drRecords.filter(record => selectedRecords.includes(record.id));
    setHistoryRecords([...savedRecords, ...historyRecords]);

    const remainingRecords = drRecords.filter(record => !selectedRecords.includes(record.id));
    setDrRecords(remainingRecords);
    setSelectedRecords([]);
    setSelectAll(false);

    setSuccessMessage(`Saved ${savedRecords.length} records to history!`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setFileName("");
    setSelectedAction("");
    setDrRecords([]);
    setSearchTerm("");
    setSelectAll(false);
    setSelectedRecords([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleReset = () => {
    setDrRecords([]);
    setSelectedRecords([]);
    setSelectAll(false);
    setSearchTerm("");
  };

  // Filter records for history
  const filteredHistory = historyRecords.filter(record =>
    record.grNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.drNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedResults = drRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(drRecords.length / itemsPerPage);
  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  const historyTotalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const paginatedHistory = filteredHistory.slice((historyCurrentPage - 1) * itemsPerPage, historyCurrentPage * itemsPerPage);
  const goToHistoryPage = (page: number) => setHistoryCurrentPage(Math.max(1, Math.min(page, historyTotalPages)));

  // Calculate totals
  const totals = {
    totalFreight: drRecords.reduce((sum, r) => sum + r.freight, 0),
    totalServiceTax: drRecords.reduce((sum, r) => sum + r.serviceTax, 0),
    totalOtherAmt: drRecords.reduce((sum, r) => sum + r.otherAmt, 0),
    totalAmount: drRecords.reduce((sum, r) => sum + r.total, 0),
    totalRebate: drRecords.reduce((sum, r) => sum + r.rebate, 0),
    totalRecdAmt: drRecords.reduce((sum, r) => sum + r.recdAmt, 0),
  };

  const stats = {
    totalRecords: drRecords.length,
    selectedRecords: selectedRecords.length,
    totalHistory: historyRecords.length,
  };

  const headerColumns = [
    "S #", "GR #", "GR Date", "Branch", "Origin", "DR #", "DR Date", "Pckgs",
    "Charge Wt", "Freight", "Service Tax", "Other Amt", "Total", "Rebate",
    "Recd Amt", "Cartage", "COD", "Delhi Tax", "Delivery", "Demurrage",
    "Enroute", "Entry Tax", "Hamali", "Insurance", "Misc", "New Misc",
  ];

  return (
    <div className="space-y-4 p-3 md:p-4 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">DR CHARGE UPDATE</h1>
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
          onClick={() => {
            setActiveTab("update");
            setHistoryCurrentPage(1);
          }}
          className={cn(
            "px-6 py-2.5 text-sm font-medium transition-all rounded-t-lg flex items-center gap-2",
            activeTab === "update"
              ? "bg-blue-600 text-white shadow-md"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          )}
        >
          <DollarSign className="h-4 w-4" />
          Update Charges
        </button>
        <button
          onClick={() => {
            setActiveTab("history");
            setCurrentPage(1);
          }}
          className={cn(
            "px-6 py-2.5 text-sm font-medium transition-all rounded-t-lg flex items-center gap-2",
            activeTab === "history"
              ? "bg-green-600 text-white shadow-md"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          )}
        >
          <History className="h-4 w-4" />
          Update History
        </button>
      </div>

      {/* Update Charges Tab */}
      {activeTab === "update" && (
        <>
          {/* Success Message */}
          {showSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Total Records</p>
                    <p className="text-2xl font-bold">{stats.totalRecords}</p>
                  </div>
                  <FileSpreadsheet className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Selected Records</p>
                    <p className="text-2xl font-bold">{stats.selectedRecords}</p>
                  </div>
                  <Check className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Total Freight</p>
                    <p className="text-2xl font-bold">₹{totals.totalFreight.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">History Records</p>
                    <p className="text-2xl font-bold">{stats.totalHistory}</p>
                  </div>
                  <History className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* File Import Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Import DR Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Select Excel File</Label>
                  <div className="flex gap-2">
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept=".xlsx, .xls, .csv"
                      onChange={handleFileChange}
                      className="h-9 text-sm flex-1 file:h-8 file:text-xs"
                    />
                  </div>
                  {fileName && (
                    <p className="text-[10px] text-green-600">Selected: {fileName}</p>
                  )}
                  <p className="text-[10px] text-gray-400">
                    Excel file should have DR numbers in column 'A'
                  </p>
                </div>

                <div className="flex items-end">
                  <Button
                    onClick={handleImport}
                    size="sm"
                    className="h-9 text-xs bg-blue-600 hover:bg-blue-700"
                    disabled={loading}
                  >
                    <Upload className="mr-1 h-3.5 w-3.5" />
                    {loading ? "Importing..." : "Import"}
                  </Button>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">Select Action</Label>
                  <div className="flex gap-2">
                    <Select value={selectedAction} onValueChange={setSelectedAction}>
                      <SelectTrigger className="h-9 text-sm flex-1">
                        <SelectValue placeholder="Select Action" />
                      </SelectTrigger>
                      <SelectContent>
                        {actionOptions.map((opt) => (
                          <SelectItem key={opt} value={opt} className="text-sm">
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={handleApplyAction} size="sm" className="h-9 text-xs bg-green-600 hover:bg-green-700">
                      <Save className="mr-1 h-3.5 w-3.5" />
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search Bar */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-[11px] font-semibold flex items-center gap-2 text-gray-700">
                <Search className="h-3.5 w-3.5" />
                Search Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <Input
                    placeholder="Search by GR #, DR # or Branch..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 h-9 text-sm"
                  />
                </div>
                <Button onClick={handleSearch} size="sm" className="h-9 bg-blue-600 hover:bg-blue-700 text-xs">
                  <Search className="mr-1 h-3.5 w-3.5" />
                  Search
                </Button>
                <Button onClick={handleReset} variant="outline" size="sm" className="h-9 text-xs">
                  <RefreshCw className="mr-1 h-3.5 w-3.5" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Main Table */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="gap-2 w-full">
                  <Table className="text-gray-500" />
                  <h3 className="text-[15px] font-semibold text-gray-800">
                    DR Records List
                  </h3>
                </div>
                <div className="text-[10px] text-gray-500">
                  Total: {drRecords.length} records
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <div className="min-w-[1200px]">
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
                        <TableHead className="text-[11px] font-semibold py-2 px-1 min-w-[80px]">GR #</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-1 min-w-[80px]">GR Date</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-1 min-w-[80px]">Branch</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-1 min-w-[80px]">DR #</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-1 w-[60px] text-center">Pckgs</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-1 w-[60px] text-center">Charge Wt</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-1 w-[80px] text-right">Freight</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-1 w-[80px] text-right">Service Tax</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-1 w-[80px] text-right">Total</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-1 w-[70px] text-right">Due Amt</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-1 min-w-[80px]">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedResults.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={13} className="text-center py-8 text-gray-500">
                            <DollarSign className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            No records to display. Please import XLS file to load data.
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedResults.map((record, idx) => (
                          <TableRow key={record.id} className="hover:bg-gray-50">
                            <TableCell className="py-1.5 px-1 text-center">
                              <input
                                type="checkbox"
                                checked={selectedRecords.includes(record.id)}
                                onChange={() => handleSelectRecord(record.id)}
                                className="h-3.5 w-3.5"
                              />
                            </TableCell>
                            <TableCell className="py-1.5 px-1 text-center text-xs">
                              {(currentPage - 1) * itemsPerPage + idx + 1}
                            </TableCell>
                            <TableCell className="py-1.5 px-1 font-mono text-xs">{record.grNo}</TableCell>
                            <TableCell className="py-1.5 px-1 text-xs">{format(record.grDate, "dd-MM-yyyy")}</TableCell>
                            <TableCell className="py-1.5 px-1 text-xs">{record.branch}</TableCell>
                            <TableCell className="py-1.5 px-1 font-mono text-xs">{record.drNo}</TableCell>
                            <TableCell className="py-1.5 px-1 text-center text-xs">{record.pckgs}</TableCell>
                            <TableCell className="py-1.5 px-1 text-center text-xs">{record.chargeWeight}</TableCell>
                            <TableCell className="py-1.5 px-1 text-right text-xs">₹{record.freight.toLocaleString()}</TableCell>
                            <TableCell className="py-1.5 px-1 text-right text-xs">₹{record.serviceTax.toLocaleString()}</TableCell>
                            <TableCell className="py-1.5 px-1 text-right text-xs">₹{record.total.toLocaleString()}</TableCell>
                            <TableCell className="py-1.5 px-1 text-right text-red-600 text-xs">₹{(record.total - record.recdAmt).toLocaleString()}</TableCell>
                            <TableCell className="py-1.5 px-1 text-center">
                              {record.status === "updated" ? (
                                <Badge className="bg-green-100 text-green-700 text-[10px]">Updated</Badge>
                              ) : (
                                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 text-[10px]">Pending</Badge>
                              )}
                            </TableCell>
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
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, drRecords.length)} of {drRecords.length} entries
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
          {drRecords.length > 0 && (
            <Card className="bg-gray-50">
              <CardContent className="p-3">
                <div className="flex flex-wrap justify-between gap-2 text-[10px]">
                  <div className="flex gap-4 flex-wrap">
                    <span className="font-semibold">Totals:</span>
                    <span>Records: {drRecords.length}</span>
                    <span>Selected: {selectedRecords.length}</span>
                    <span>Freight: ₹{totals.totalFreight.toLocaleString()}</span>
                    <span>Service Tax: ₹{totals.totalServiceTax.toLocaleString()}</span>
                    <span>Total Amt: ₹{totals.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons Footer */}
          <div className="flex flex-wrap justify-end gap-3 pt-2 border-t">
            <Button onClick={handleSaveCharges} size="sm" className="h-8 text-xs bg-green-600 hover:bg-green-700">
              <Save className="mr-1 h-3 w-3" />
              Save Charges
            </Button>
            <Button onClick={handleClear} variant="outline" size="sm" className="h-8 text-xs">
              <RefreshCw className="mr-1 h-3 w-3" />
              Clear All
            </Button>
          </div>
        </>
      )}

      {/* Update History Tab */}
      {activeTab === "history" && (
        <>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <History className="h-3.5 w-3.5 text-gray-500" />
                  <h3 className="text-[11px] font-semibold text-gray-800">
                    Saved Update History
                  </h3>
                </div>
                <div className="text-[10px] text-gray-500">
                  Total: {filteredHistory.length} records
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <div className="min-w-[800px]">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="text-[11px] font-semibold py-2 px-1 w-12 text-center">#</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-1 min-w-[80px]">GR #</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-1 min-w-[80px]">GR Date</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-1 min-w-[80px]">Branch</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-1 min-w-[80px]">DR #</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-1 w-[60px] text-center">Pckgs</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-1 w-[80px] text-right">Freight</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-1 w-[80px] text-right">Total</TableHead>
                        <TableHead className="text-[11px] font-semibold py-2 px-1 w-20 text-center">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedHistory.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                            <History className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            No update history found
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedHistory.map((record, idx) => (
                          <TableRow key={record.id} className="hover:bg-gray-50">
                            <TableCell className="py-1.5 px-1 text-center text-xs">
                              {(historyCurrentPage - 1) * itemsPerPage + idx + 1}
                            </TableCell>
                            <TableCell className="py-1.5 px-1 font-mono text-xs">{record.grNo}</TableCell>
                            <TableCell className="py-1.5 px-1 text-xs">{format(record.grDate, "dd-MM-yyyy")}</TableCell>
                            <TableCell className="py-1.5 px-1 text-xs">{record.branch}</TableCell>
                            <TableCell className="py-1.5 px-1 font-mono text-xs">{record.drNo}</TableCell>
                            <TableCell className="py-1.5 px-1 text-center text-xs">{record.pckgs}</TableCell>
                            <TableCell className="py-1.5 px-1 text-right text-xs">₹{record.freight.toLocaleString()}</TableCell>
                            <TableCell className="py-1.5 px-1 text-right text-xs">₹{record.total.toLocaleString()}</TableCell>
                            <TableCell className="py-1.5 px-1 text-center">
                              <Badge className="bg-blue-100 text-blue-700 text-[10px]">Saved</Badge>
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