"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Trash2, Save, RefreshCw, Search, Eye } from "lucide-react";

// ==================== Types ====================
interface TDSRate {
  id: string;
  tdsRateId: string;
  fromDate: string;
  toDate: string;
  tdsCategory: string;
  payeeStatus: string;
  tdsPercent: number;
  surchargePercent: number;
  cessPercent: number;
  applicableLimit: number;
  invoiceItem: string;
  tdsLedger: string;
}

// Helper
const generateId = (): string => Math.random().toString(36).substr(2, 9);

// Mock Data for Dropdowns
const tdsCategories: string[] = ["SELECT", "194C - Contract", "194H - Commission", "194J - Professional Fees", "194I - Rent", "194A - Interest", "194B - Lottery"];
const payeeStatuses: string[] = ["SELECT", "Individual", "Company", "Firm", "HUF", "Trust", "Cooperative Society"];
const invoiceItems: string[] = ["SELECT", "Freight", "Service Charges", "Commission", "Rent", "Professional Fees", "Interest"];
const tdsLedgers: string[] = ["SELECT", "TDS Payable - 194C", "TDS Payable - 194H", "TDS Payable - 194J", "TDS Payable - 194I", "TDS Payable - 194A"];

// Mock TDS Rate Data for Search Tab
const mockTDSRates: TDSRate[] = [
  {
    id: "1",
    tdsRateId: "TDS-001",
    fromDate: "2026-04-01",
    toDate: "2026-03-31",
    tdsCategory: "194C - Contract",
    payeeStatus: "Individual",
    tdsPercent: 1.0,
    surchargePercent: 0,
    cessPercent: 4.0,
    applicableLimit: 30000,
    invoiceItem: "Freight",
    tdsLedger: "TDS Payable - 194C",
  },
  {
    id: "2",
    tdsRateId: "TDS-002",
    fromDate: "2026-04-01",
    toDate: "2026-03-31",
    tdsCategory: "194H - Commission",
    payeeStatus: "Company",
    tdsPercent: 5.0,
    surchargePercent: 0,
    cessPercent: 4.0,
    applicableLimit: 15000,
    invoiceItem: "Commission",
    tdsLedger: "TDS Payable - 194H",
  },
  {
    id: "3",
    tdsRateId: "TDS-003",
    fromDate: "2026-04-01",
    toDate: "2026-03-31",
    tdsCategory: "194J - Professional Fees",
    payeeStatus: "Firm",
    tdsPercent: 10.0,
    surchargePercent: 0,
    cessPercent: 4.0,
    applicableLimit: 30000,
    invoiceItem: "Professional Fees",
    tdsLedger: "TDS Payable - 194J",
  },
];

export default function TDSRateMaster() {
  // ========== Entry Tab State ==========
  const [fromDate, setFromDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [toDate, setToDate] = useState<string>("");
  const [tdsRates, setTdsRates] = useState<TDSRate[]>([
    {
      id: generateId(),
      tdsRateId: "",
      fromDate: "",
      toDate: "",
      tdsCategory: "",
      payeeStatus: "",
      tdsPercent: 0,
      surchargePercent: 0,
      cessPercent: 0,
      applicableLimit: 0,
      invoiceItem: "",
      tdsLedger: "",
    },
  ]);
  const [savedTDSRates, setSavedTDSRates] = useState<TDSRate[]>(mockTDSRates);

  // ========== Search Tab State ==========
  const [searchFromDate, setSearchFromDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [searchToDate, setSearchToDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [viewDialogOpen, setViewDialogOpen] = useState<boolean>(false);
  const [selectedTDSRate, setSelectedTDSRate] = useState<TDSRate | null>(null);

  // ========== Entry Tab Handlers ==========
  const addTDSRateRow = (): void => {
    const newRow: TDSRate = {
      id: generateId(),
      tdsRateId: "",
      fromDate: "",
      toDate: "",
      tdsCategory: "",
      payeeStatus: "",
      tdsPercent: 0,
      surchargePercent: 0,
      cessPercent: 0,
      applicableLimit: 0,
      invoiceItem: "",
      tdsLedger: "",
    };
    setTdsRates([...tdsRates, newRow]);
  };

  const updateTDSRateRow = (id: string, field: keyof TDSRate, value: string | number): void => {
    setTdsRates(prev =>
      prev.map(row =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  const deleteTDSRateRow = (id: string): void => {
    if (tdsRates.length === 1) {
      alert("At least one row is required");
      return;
    }
    setTdsRates(prev => prev.filter(row => row.id !== id));
  };

  const handleSave = (): void => {
    // Validate all rows
    for (const row of tdsRates) {
      if (!row.tdsCategory || row.tdsCategory === "SELECT") {
        alert("TDS Category is required for all rows");
        return;
      }
      if (!row.payeeStatus || row.payeeStatus === "SELECT") {
        alert("Payee Status is required for all rows");
        return;
      }
      if (!row.invoiceItem || row.invoiceItem === "SELECT") {
        alert("Invoice Item is required for all rows");
        return;
      }
      if (!row.tdsLedger || row.tdsLedger === "SELECT") {
        alert("TDS Ledger is required for all rows");
        return;
      }
      if (row.tdsPercent <= 0) {
        alert("TDS % must be greater than 0");
        return;
      }
    }

    // Create new TDS rates with IDs
    const newRates: TDSRate[] = tdsRates.map((row, index) => ({
      ...row,
      tdsRateId: `TDS-${String(savedTDSRates.length + index + 1).padStart(3, "0")}`,
      fromDate: fromDate,
      toDate: toDate,
    }));

    setSavedTDSRates([...savedTDSRates, ...newRates]);
    alert(`${newRates.length} TDS Rate(s) saved successfully`);
    handleClear();
  };

  const handleClear = (): void => {
    setFromDate(new Date().toISOString().split("T")[0]);
    setToDate("");
    setTdsRates([
      {
        id: generateId(),
        tdsRateId: "",
        fromDate: "",
        toDate: "",
        tdsCategory: "",
        payeeStatus: "",
        tdsPercent: 0,
        surchargePercent: 0,
        cessPercent: 0,
        applicableLimit: 0,
        invoiceItem: "",
        tdsLedger: "",
      },
    ]);
  };

  // ========== Search Tab Handlers ==========
  const filteredTDSRates = useMemo((): TDSRate[] => {
    let filtered = savedTDSRates;

    if (searchFromDate) {
      filtered = filtered.filter(r => r.fromDate >= searchFromDate);
    }
    if (searchToDate) {
      filtered = filtered.filter(r => r.fromDate <= searchToDate);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(r =>
        r.tdsCategory.toLowerCase().includes(term) ||
        r.payeeStatus.toLowerCase().includes(term) ||
        r.tdsRateId.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [savedTDSRates, searchFromDate, searchToDate, searchTerm]);

  const handleSearch = (): void => {
    alert(`Found ${filteredTDSRates.length} TDS rate(s)`);
  };

  const handleClearSearch = (): void => {
    setSearchFromDate(new Date().toISOString().split("T")[0]);
    setSearchToDate(new Date().toISOString().split("T")[0]);
    setSearchTerm("");
  };

  const handleViewDetails = (rate: TDSRate): void => {
    setSelectedTDSRate(rate);
    setViewDialogOpen(true);
  };

  // Calculate totals for entry tab
  const totalRows = tdsRates.length;

  return (
    <div className="space-y-6 p-3 sm:p-4 md:p-6 max-w-full overflow-x-hidden">
      <h1 className="text-xl sm:text-2xl font-bold text-primary">TDS Rate Master</h1>

      <Tabs defaultValue="entry" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="entry">Entry</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
        </TabsList>

        {/* ==================== ENTRY TAB ==================== */}
        <TabsContent value="entry" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>TDS Rate Entry</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <Label>From Date <span className="text-red-500">*</span></Label>
                  <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                </div>
                <div>
                  <Label>To Date</Label>
                  <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                </div>
              </div>

              {/* TDS Rate Table */}
              <div className="overflow-x-auto">
                <div className="min-w-[1000px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>S#</TableHead>
                        <TableHead>TDS Category</TableHead>
                        <TableHead>Payee Status</TableHead>
                        <TableHead className="text-right">TDS %</TableHead>
                        <TableHead className="text-right">Surcharge %</TableHead>
                        <TableHead className="text-right">Cess %</TableHead>
                        <TableHead className="text-right">Applicable Limit</TableHead>
                        <TableHead>Invoice Item</TableHead>
                        <TableHead>TDS Ledger</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tdsRates.map((row, idx) => (
                        <TableRow key={row.id}>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell>
                            <Select
                              value={row.tdsCategory}
                              onValueChange={(v) => updateTDSRateRow(row.id, "tdsCategory", v)}
                            >
                              <SelectTrigger className="w-40">
                                <SelectValue placeholder="SELECT" />
                              </SelectTrigger>
                              <SelectContent>
                                {tdsCategories.map(cat => (
                                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={row.payeeStatus}
                              onValueChange={(v) => updateTDSRateRow(row.id, "payeeStatus", v)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue placeholder="SELECT" />
                              </SelectTrigger>
                              <SelectContent>
                                {payeeStatuses.map(status => (
                                  <SelectItem key={status} value={status}>{status}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              step="0.01"
                              value={row.tdsPercent}
                              onChange={(e) => updateTDSRateRow(row.id, "tdsPercent", Number(e.target.value))}
                              className="w-20 text-right"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              step="0.01"
                              value={row.surchargePercent}
                              onChange={(e) => updateTDSRateRow(row.id, "surchargePercent", Number(e.target.value))}
                              className="w-20 text-right"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              step="0.01"
                              value={row.cessPercent}
                              onChange={(e) => updateTDSRateRow(row.id, "cessPercent", Number(e.target.value))}
                              className="w-20 text-right"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={row.applicableLimit}
                              onChange={(e) => updateTDSRateRow(row.id, "applicableLimit", Number(e.target.value))}
                              className="w-28 text-right"
                            />
                          </TableCell>
                          <TableCell>
                            <Select
                              value={row.invoiceItem}
                              onValueChange={(v) => updateTDSRateRow(row.id, "invoiceItem", v)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue placeholder="SELECT" />
                              </SelectTrigger>
                              <SelectContent>
                                {invoiceItems.map(item => (
                                  <SelectItem key={item} value={item}>{item}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={row.tdsLedger}
                              onValueChange={(v) => updateTDSRateRow(row.id, "tdsLedger", v)}
                            >
                              <SelectTrigger className="w-40">
                                <SelectValue placeholder="SELECT" />
                              </SelectTrigger>
                              <SelectContent>
                                {tdsLedgers.map(ledger => (
                                  <SelectItem key={ledger} value={ledger}>{ledger}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteTDSRateRow(row.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Add More Button */}
              <div className="flex justify-end mt-4">
                <Button onClick={addTDSRateRow} variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" /> Add More
                </Button>
              </div>

              {/* Row Count */}
              <div className="mt-4 text-sm text-muted-foreground">
                Total Rows: {totalRows}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t mt-6">
                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                  <Save className="mr-2 h-4 w-4" /> Save
                </Button>
                <Button onClick={handleClear} variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" /> Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== SEARCH TAB ==================== */}
        <TabsContent value="search" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Search TDS Rates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label>From Date</Label>
                  <Input type="date" value={searchFromDate} onChange={(e) => setSearchFromDate(e.target.value)} />
                </div>
                <div>
                  <Label>To Date</Label>
                  <Input type="date" value={searchToDate} onChange={(e) => setSearchToDate(e.target.value)} />
                </div>
                <div>
                  <Label>Search</Label>
                  <div className="flex gap-2">
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by Category, Status, ID..."
                      className="flex-1"
                    />
                    <Button onClick={handleSearch}>
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-6">
                <Button onClick={handleClearSearch} variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" /> Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Search Results Table */}
          <Card>
            <CardHeader>
              <CardTitle>TDS Rate List</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <div className="min-w-[800px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>S#</TableHead>
                      <TableHead>TDS Rate ID</TableHead>
                      <TableHead>TDS Category</TableHead>
                      <TableHead>Payee Status</TableHead>
                      <TableHead className="text-right">Rate %</TableHead>
                      <TableHead className="text-right">Surcharge %</TableHead>
                      <TableHead className="text-right">Cess %</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTDSRates.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          No TDS rates found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTDSRates.map((rate, idx) => (
                        <TableRow key={rate.id}>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell className="font-medium">{rate.tdsRateId}</TableCell>
                          <TableCell>{rate.tdsCategory}</TableCell>
                          <TableCell>{rate.payeeStatus}</TableCell>
                          <TableCell className="text-right">{rate.tdsPercent}%</TableCell>
                          <TableCell className="text-right">{rate.surchargePercent}%</TableCell>
                          <TableCell className="text-right">{rate.cessPercent}%</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => handleViewDetails(rate)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Summary Footer */}
          {filteredTDSRates.length > 0 && (
            <div className="text-sm text-muted-foreground border-t pt-3 flex justify-between">
              <span>Total Records: {filteredTDSRates.length}</span>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* View Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>TDS Rate Details</DialogTitle>
          </DialogHeader>
          {selectedTDSRate && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>TDS Rate ID</Label><p className="font-medium">{selectedTDSRate.tdsRateId}</p></div>
                <div><Label>From Date</Label><p className="font-medium">{selectedTDSRate.fromDate}</p></div>
                <div><Label>To Date</Label><p className="font-medium">{selectedTDSRate.toDate || "-"}</p></div>
                <div><Label>TDS Category</Label><p className="font-medium">{selectedTDSRate.tdsCategory}</p></div>
                <div><Label>Payee Status</Label><p className="font-medium">{selectedTDSRate.payeeStatus}</p></div>
                <div><Label>TDS %</Label><p className="font-medium">{selectedTDSRate.tdsPercent}%</p></div>
                <div><Label>Surcharge %</Label><p className="font-medium">{selectedTDSRate.surchargePercent}%</p></div>
                <div><Label>Cess %</Label><p className="font-medium">{selectedTDSRate.cessPercent}%</p></div>
                <div><Label>Applicable Limit</Label><p className="font-medium">₹ {selectedTDSRate.applicableLimit.toLocaleString()}</p></div>
                <div><Label>Invoice Item</Label><p className="font-medium">{selectedTDSRate.invoiceItem}</p></div>
                <div className="col-span-2"><Label>TDS Ledger</Label><p className="font-medium">{selectedTDSRate.tdsLedger}</p></div>
              </div>
            </div>
          )}
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}