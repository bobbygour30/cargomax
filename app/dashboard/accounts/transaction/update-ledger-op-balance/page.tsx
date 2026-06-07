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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Trash2, Save, RefreshCw, Search, Eye } from "lucide-react";

// ==================== Types ====================
interface LedgerBalance {
  id: string;
  ledgerName: string;
  drBalance: number;
  crBalance: number;
}

interface SavedLedgerBalance {
  id: string;
  financialYear: string;
  branchName: string;
  mainGroup: string;
  ledgers: LedgerBalance[];
  updatedAt: string;
}

// Helper
const generateId = (): string => Math.random().toString(36).substr(2, 9);

// Mock Data for Dropdowns
const financialYears: string[] = ["2024-2025", "2025-2026", "2026-2027", "2027-2028", "2028-2029"];
const branchNames: string[] = ["Select Branch", "Mumbai HO", "Delhi Branch", "Chennai Branch", "Kolkata Branch", "Bangalore Branch"];
const mainGroups: string[] = ["Select Group", "Current Assets", "Fixed Assets", "Current Liabilities", "Capital Account", "Revenue Account", "Expenses"];

// Mock Ledger Data
const mockLedgers: string[] = [
  "SBI Current Account",
  "HDFC Bank",
  "ICICI Bank",
  "Cash in Hand",
  "Sundry Debtors",
  "Sundry Creditors",
  "Sales Account",
  "Purchase Account",
  "Salary Account",
  "Rent Account",
  "TDS Payable",
  "GST Payable",
];

// Mock Saved Data
const mockSavedBalances: SavedLedgerBalance[] = [
  {
    id: "1",
    financialYear: "2026-2027",
    branchName: "Mumbai HO",
    mainGroup: "Current Assets",
    ledgers: [
      { id: "l1", ledgerName: "SBI Current Account", drBalance: 500000, crBalance: 0 },
      { id: "l2", ledgerName: "Cash in Hand", drBalance: 100000, crBalance: 0 },
    ],
    updatedAt: new Date().toISOString(),
  },
];

export default function UpdateLedgerOpBalance() {
  // ========== State ==========
  const [financialYear, setFinancialYear] = useState<string>("2026-2027");
  const [branchName, setBranchName] = useState<string>("");
  const [mainGroup, setMainGroup] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [ledgers, setLedgers] = useState<LedgerBalance[]>([]);
  const [savedBalances, setSavedBalances] = useState<SavedLedgerBalance[]>(mockSavedBalances);
  const [viewDialogOpen, setViewDialogOpen] = useState<boolean>(false);
  const [selectedLedgerData, setSelectedLedgerData] = useState<SavedLedgerBalance | null>(null);

  // Available ledgers based on search
  const availableLedgers = useMemo(() => {
    if (!searchTerm) return mockLedgers;
    return mockLedgers.filter(ledger =>
      ledger.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // ========== Handlers ==========
  const handleShow = (): void => {
    if (!branchName) {
      alert("Please select Branch Name");
      return;
    }
    if (!mainGroup) {
      alert("Please select Main Group");
      return;
    }

    // Check if data already exists for this combination
    const existing = savedBalances.find(
      s => s.financialYear === financialYear && s.branchName === branchName && s.mainGroup === mainGroup
    );

    if (existing) {
      setLedgers(existing.ledgers);
      alert(`Loaded existing ledger balances for ${branchName} - ${mainGroup}`);
    } else {
      setLedgers([]);
      alert(`No existing data found. You can add new ledger balances.`);
    }
  };

  const handleSearchLedger = (): void => {
    if (!searchTerm) {
      alert("Please enter search term");
      return;
    }
    alert(`Found ${availableLedgers.length} matching ledgers`);
  };

  const addNewRow = (): void => {
    const newLedger: LedgerBalance = {
      id: generateId(),
      ledgerName: "",
      drBalance: 0,
      crBalance: 0,
    };
    setLedgers([...ledgers, newLedger]);
  };

  const updateLedger = (id: string, field: keyof LedgerBalance, value: string | number): void => {
    setLedgers(prev =>
      prev.map(ledger =>
        ledger.id === id ? { ...ledger, [field]: value } : ledger
      )
    );
  };

  const removeLedger = (id: string): void => {
    if (ledgers.length === 0) {
      alert("No rows to remove");
      return;
    }
    setLedgers(prev => prev.filter(ledger => ledger.id !== id));
  };

  const handleSave = (): void => {
    if (!branchName) {
      alert("Please select Branch Name");
      return;
    }
    if (!mainGroup) {
      alert("Please select Main Group");
      return;
    }
    if (ledgers.length === 0) {
      alert("Please add at least one ledger balance");
      return;
    }

    // Validate all ledgers
    for (const ledger of ledgers) {
      if (!ledger.ledgerName) {
        alert("Please select Ledger Name for all rows");
        return;
      }
    }

    // Check if updating existing or creating new
    const existingIndex = savedBalances.findIndex(
      s => s.financialYear === financialYear && s.branchName === branchName && s.mainGroup === mainGroup
    );

    const newSavedData: SavedLedgerBalance = {
      id: existingIndex !== -1 ? savedBalances[existingIndex].id : generateId(),
      financialYear,
      branchName,
      mainGroup,
      ledgers: ledgers,
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex !== -1) {
      const updated = [...savedBalances];
      updated[existingIndex] = newSavedData;
      setSavedBalances(updated);
      alert(`Ledger balances updated successfully for ${branchName} - ${mainGroup}`);
    } else {
      setSavedBalances([...savedBalances, newSavedData]);
      alert(`Ledger balances saved successfully for ${branchName} - ${mainGroup}`);
    }
  };

  const handleClear = (): void => {
    setFinancialYear("2026-2027");
    setBranchName("");
    setMainGroup("");
    setSearchTerm("");
    setLedgers([]);
  };

  const handleViewDetails = (data: SavedLedgerBalance): void => {
    setSelectedLedgerData(data);
    setViewDialogOpen(true);
  };

  // Calculate totals
  const totalDrBalance = ledgers.reduce((sum, l) => sum + (l.drBalance || 0), 0);
  const totalCrBalance = ledgers.reduce((sum, l) => sum + (l.crBalance || 0), 0);

  return (
    <div className="space-y-6 p-3 sm:p-4 md:p-6 max-w-full overflow-x-hidden">
      <h1 className="text-xl sm:text-2xl font-bold text-primary">Update Ledger Opening Balance</h1>

      <Card>
        <CardHeader>
          <CardTitle>Opening Balance Entry</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filter Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label>Financial Year <span className="text-red-500">*</span></Label>
              <Select value={financialYear} onValueChange={setFinancialYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Financial Year" />
                </SelectTrigger>
                <SelectContent>
                  {financialYears.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Branch Name <span className="text-red-500">*</span></Label>
              <Select value={branchName} onValueChange={setBranchName}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent>
                  {branchNames.map(branch => (
                    <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Main Group <span className="text-red-500">*</span></Label>
              <Select value={mainGroup} onValueChange={setMainGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Group" />
                </SelectTrigger>
                <SelectContent>
                  {mainGroups.map(group => (
                    <SelectItem key={group} value={group}>{group}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            <Button onClick={handleShow} className="bg-blue-600 hover:bg-blue-700">
              <Eye className="mr-2 h-4 w-4" /> Show
            </Button>
          </div>

          {/* Ledger Search Section */}
          <div className="mt-6 pt-4 border-t">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search Ledger Name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button onClick={handleSearchLedger} variant="secondary">
                <Search className="mr-2 h-4 w-4" /> Search...
              </Button>
            </div>
            {searchTerm && availableLedgers.length > 0 && (
              <div className="mt-2 p-2 border rounded-md bg-muted/30 max-h-40 overflow-y-auto">
                <p className="text-xs text-muted-foreground mb-1">Matching ledgers:</p>
                <div className="flex flex-wrap gap-2">
                  {availableLedgers.slice(0, 10).map(ledger => (
                    <Button
                      key={ledger}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchTerm(ledger);
                      }}
                      className="text-xs"
                    >
                      {ledger}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Add New Row Button */}
          <div className="flex justify-end mt-6">
            <Button onClick={addNewRow} variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" /> Add New Row
            </Button>
          </div>

          {/* Ledger Table */}
          <div className="overflow-x-auto mt-4">
            <div className="min-w-[600px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>S #</TableHead>
                    <TableHead>Ledger Name</TableHead>
                    <TableHead className="text-right">Dr Balance</TableHead>
                    <TableHead className="text-right">Cr Balance</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ledgers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No ledger entries. Click "Add New Row" to add ledger balances.
                      </TableCell>
                    </TableRow>
                  ) : (
                    ledgers.map((ledger, idx) => (
                      <TableRow key={ledger.id}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>
                          <Select
                            value={ledger.ledgerName}
                            onValueChange={(v) => updateLedger(ledger.id, "ledgerName", v)}
                          >
                            <SelectTrigger className="w-48">
                              <SelectValue placeholder="Select Ledger" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockLedgers.map(led => (
                                <SelectItem key={led} value={led}>{led}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={ledger.drBalance}
                            onChange={(e) => updateLedger(ledger.id, "drBalance", Number(e.target.value))}
                            className="w-32 text-right"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={ledger.crBalance}
                            onChange={(e) => updateLedger(ledger.id, "crBalance", Number(e.target.value))}
                            className="w-32 text-right"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLedger(ledger.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Totals Row */}
          {ledgers.length > 0 && (
            <div className="mt-4 p-3 bg-muted/20 rounded-md">
              <div className="flex justify-end gap-6 text-sm font-semibold">
                <div>
                  Total Dr Balance: <span className="text-blue-600">₹ {totalDrBalance.toLocaleString()}</span>
                </div>
                <div>
                  Total Cr Balance: <span className="text-green-600">₹ {totalCrBalance.toLocaleString()}</span>
                </div>
                <div>
                  Difference: <span className={totalDrBalance !== totalCrBalance ? "text-red-600" : "text-green-600"}>
                    ₹ {Math.abs(totalDrBalance - totalCrBalance).toLocaleString()} {totalDrBalance > totalCrBalance ? "Dr" : totalCrBalance > totalDrBalance ? "Cr" : "Equal"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Save and Clear Buttons */}
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

      {/* Previously Saved Balances Section */}
      {savedBalances.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Previously Saved Ledger Balances</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <div className="min-w-[800px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>S#</TableHead>
                    <TableHead>Financial Year</TableHead>
                    <TableHead>Branch Name</TableHead>
                    <TableHead>Main Group</TableHead>
                    <TableHead>No. of Ledgers</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {savedBalances.map((data, idx) => (
                    <TableRow key={data.id}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{data.financialYear}</TableCell>
                      <TableCell>{data.branchName}</TableCell>
                      <TableCell>{data.mainGroup}</TableCell>
                      <TableCell>{data.ledgers.length}</TableCell>
                      <TableCell>{new Date(data.updatedAt).toLocaleString()}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => handleViewDetails(data)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* View Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ledger Balance Details</DialogTitle>
          </DialogHeader>
          {selectedLedgerData && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Financial Year</Label><p className="font-medium">{selectedLedgerData.financialYear}</p></div>
                <div><Label>Branch Name</Label><p className="font-medium">{selectedLedgerData.branchName}</p></div>
                <div className="col-span-2"><Label>Main Group</Label><p className="font-medium">{selectedLedgerData.mainGroup}</p></div>
                <div><Label>Last Updated</Label><p className="font-medium">{new Date(selectedLedgerData.updatedAt).toLocaleString()}</p></div>
              </div>
              <div className="font-semibold">Ledger Balances:</div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>S#</TableHead>
                    <TableHead>Ledger Name</TableHead>
                    <TableHead className="text-right">Dr Balance</TableHead>
                    <TableHead className="text-right">Cr Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedLedgerData.ledgers.map((ledger, idx) => (
                    <TableRow key={ledger.id}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{ledger.ledgerName}</TableCell>
                      <TableCell className="text-right">₹ {ledger.drBalance.toLocaleString()}</TableCell>
                      <TableCell className="text-right">₹ {ledger.crBalance.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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