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
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Save,
  RefreshCw,
  Search,
  Pencil,
  Trash2,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Product {
  id: number;
  productCode: string;
  active: boolean;
  name: string;
  displayName: string;
  aliasName: string;
  modeType: string;
  volFactor: number;
  sacCode: string;
  fromWeight: number;
  toWeight: number;
  cashSaleLedger: string;
  creditSaleLedger: string;
  toPaySaleLedger: string;
}

const modeTypeOptions = [
  "SURFACE",
  "AIR",
  "RAIL",
  "SEA",
  "COURIER",
  "EXPRESS",
];

export default function ProductMaster() {
  const [activeTab, setActiveTab] = useState<"entry" | "search">("entry");
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Form state
  const [productCode, setProductCode] = useState("");
  const [active, setActive] = useState(true);
  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [aliasName, setAliasName] = useState("");
  const [modeType, setModeType] = useState("");
  const [volFactor, setVolFactor] = useState(0);
  const [sacCode, setSacCode] = useState("");
  const [fromWeight, setFromWeight] = useState(0);
  const [toWeight, setToWeight] = useState(0);
  const [cashSaleLedger, setCashSaleLedger] = useState("");
  const [creditSaleLedger, setCreditSaleLedger] = useState("");
  const [toPaySaleLedger, setToPaySaleLedger] = useState("");

  // Sample data
  const [savedRecords, setSavedRecords] = useState<Product[]>([
    {
      id: 1,
      productCode: "S",
      active: true,
      name: "SURFACE",
      displayName: "SURFACE",
      aliasName: "SURFACE",
      modeType: "SURFACE",
      volFactor: 0,
      sacCode: "996511",
      fromWeight: 0,
      toWeight: 0,
      cashSaleLedger: "PAID SALE SURFACE",
      creditSaleLedger: "TBB SALE SURFACE",
      toPaySaleLedger: "TOPAY SALE SURFACE",
    },
  ]);

  const generateProductCode = (): string => {
    const lastCode = savedRecords[savedRecords.length - 1]?.productCode;
    if (lastCode && /^[A-Z0-9]+$/.test(lastCode)) {
      // simple increment logic; in real app, use proper sequence
      return String.fromCharCode(lastCode.charCodeAt(0) + 1);
    }
    return "P001";
  };

  const resetForm = () => {
    setProductCode(generateProductCode());
    setActive(true);
    setName("");
    setDisplayName("");
    setAliasName("");
    setModeType("");
    setVolFactor(0);
    setSacCode("");
    setFromWeight(0);
    setToWeight(0);
    setCashSaleLedger("");
    setCreditSaleLedger("");
    setToPaySaleLedger("");
    setEditId(null);
  };

  const handleSave = () => {
    if (!productCode) {
      alert("Product Code is required");
      return;
    }
    if (!name) {
      alert("Name is required");
      return;
    }
    if (!displayName) {
      alert("Display Name is required");
      return;
    }
    if (!modeType) {
      alert("Mode Type is required");
      return;
    }
    if (!sacCode) {
      alert("SAC Code is required");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const newRecord: Product = {
        id: editId || Date.now(),
        productCode,
        active,
        name,
        displayName,
        aliasName,
        modeType,
        volFactor,
        sacCode,
        fromWeight,
        toWeight,
        cashSaleLedger,
        creditSaleLedger,
        toPaySaleLedger,
      };

      if (editId) {
        setSavedRecords(
          savedRecords.map((record) => (record.id === editId ? newRecord : record))
        );
        alert("Record updated successfully!");
      } else {
        setSavedRecords([...savedRecords, newRecord]);
        alert("Record saved successfully!");
      }
      resetForm();
      setActiveTab("search");
      setLoading(false);
    }, 500);
  };

  const handleEdit = (record: Product) => {
    setEditId(record.id);
    setProductCode(record.productCode);
    setActive(record.active);
    setName(record.name);
    setDisplayName(record.displayName);
    setAliasName(record.aliasName);
    setModeType(record.modeType);
    setVolFactor(record.volFactor);
    setSacCode(record.sacCode);
    setFromWeight(record.fromWeight);
    setToWeight(record.toWeight);
    setCashSaleLedger(record.cashSaleLedger);
    setCreditSaleLedger(record.creditSaleLedger);
    setToPaySaleLedger(record.toPaySaleLedger);
    setActiveTab("entry");
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setSavedRecords(savedRecords.filter((record) => record.id !== id));
      alert("Product deleted successfully!");
    }
  };

  const filteredRecords = savedRecords.filter(
    (record) =>
      record.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.aliasName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedResults = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const goToPage = (page: number) =>
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">PRODUCT MASTER</h1>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[10px] md:text-xs text-muted-foreground">
          <span>Company : GOLDEN ROADWAYS & LOGISTICS PVT LTD</span>
          <span>Login By : MAYANK.GRLOGISTICS@GMAIL.COM</span>
          <span>Login Branch : CORPORATE OFFICE</span>
          <span>Financial Year : 2026-2027</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => {
            setActiveTab("entry");
            resetForm();
          }}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-all",
            activeTab === "entry"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Entry
        </button>
        <button
          onClick={() => {
            setActiveTab("search");
            setCurrentPage(1);
          }}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-all",
            activeTab === "search"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Search
        </button>
      </div>

      {/* Entry Tab */}
      {activeTab === "entry" && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Product Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">
                  Product Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={productCode}
                  onChange={(e) => setProductCode(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="flex items-center gap-2 mt-6">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="h-3.5 w-3.5"
                  id="active"
                />
                <Label htmlFor="active" className="text-xs cursor-pointer">
                  Active
                </Label>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">
                  Display Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Alias Name</Label>
                <Input
                  value={aliasName}
                  onChange={(e) => setAliasName(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">
                  Mode type <span className="text-red-500">*</span>
                </Label>
                <Select value={modeType} onValueChange={setModeType}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="SELECT" />
                  </SelectTrigger>
                  <SelectContent>
                    {modeTypeOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Vol. Factor</Label>
                <Input
                  type="number"
                  value={volFactor}
                  onChange={(e) => setVolFactor(Number(e.target.value))}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">
                  SAC Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={sacCode}
                  onChange={(e) => setSacCode(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">From Weight</Label>
                <Input
                  type="number"
                  value={fromWeight}
                  onChange={(e) => setFromWeight(Number(e.target.value))}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">To Weight</Label>
                <Input
                  type="number"
                  value={toWeight}
                  onChange={(e) => setToWeight(Number(e.target.value))}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Cash Sale Ledger</Label>
                <Input
                  value={cashSaleLedger}
                  onChange={(e) => setCashSaleLedger(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Credit Sale Ledger</Label>
                <Input
                  value={creditSaleLedger}
                  onChange={(e) => setCreditSaleLedger(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">ToPay Sale Ledger</Label>
                <Input
                  value={toPaySaleLedger}
                  onChange={(e) => setToPaySaleLedger(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                onClick={handleSave}
                size="sm"
                className="h-8 text-xs bg-green-600"
                disabled={loading}
              >
                <Save className="mr-1 h-3 w-3" />
                {editId ? "UPDATE" : "SAVE"}
              </Button>
              <Button
                onClick={resetForm}
                variant="outline"
                size="sm"
                className="h-8 text-xs"
              >
                <RefreshCw className="mr-1 h-3 w-3" />
                CLEAR
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Tab */}
      {activeTab === "search" && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5" />
              <Input
                placeholder="Search by Product Code, Name or Alias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-8 text-xs"
              />
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[800px]">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-12 text-center">S#</TableHead>
                    <TableHead>Product Code</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Alias Name</TableHead>
                    <TableHead>ModeType</TableHead>
                    <TableHead>Sac #</TableHead>
                    <TableHead>CashLedger</TableHead>
                    <TableHead>CreditLedger</TableHead>
                    <TableHead>ToPayLedger</TableHead>
                    <TableHead className="w-20 text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedResults.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8">
                        No records found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedResults.map((record, idx) => (
                      <TableRow key={record.id} className="hover:bg-muted/30">
                        <TableCell className="text-center">
                          {(currentPage - 1) * itemsPerPage + idx + 1}
                        </TableCell>
                        <TableCell className="font-mono font-medium">
                          {record.productCode}
                        </TableCell>
                        <TableCell>{record.name}</TableCell>
                        <TableCell>{record.aliasName || "-"}</TableCell>
                        <TableCell>{record.modeType}</TableCell>
                        <TableCell>{record.sacCode}</TableCell>
                        <TableCell>{record.cashSaleLedger || "-"}</TableCell>
                        <TableCell>{record.creditSaleLedger || "-"}</TableCell>
                        <TableCell>{record.toPaySaleLedger || "-"}</TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(record)}
                            className="h-6 w-6 p-0 text-blue-500"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-7 text-xs"
              >
                Previous
              </Button>
              <span className="px-3 py-1 text-xs bg-muted rounded-md">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-7 text-xs"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Info Note */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 rounded-md p-3">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
          <div className="text-xs text-blue-700 dark:text-blue-400">
            <p className="font-medium">Note:</p>
            <ul className="list-disc list-inside mt-1 space-y-0.5">
              <li>Product Code, Name, Display Name, Mode Type, and SAC Code are mandatory</li>
              <li>Vol. Factor, From Weight and To Weight are numeric fields</li>
              <li>Ledger fields are optional but can be linked for automatic accounting</li>
              <li>Active checkbox controls whether the product is available for use</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}