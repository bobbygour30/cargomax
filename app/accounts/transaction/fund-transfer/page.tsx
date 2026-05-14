"use client";

import React, { useState } from "react";
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
import { Plus, Trash2, Send, RefreshCw, Eye, FileText, X } from "lucide-react";

// ==================== Types ====================
interface FundTransferRow {
  id: string;
  toBranch: string;
  amount: number;
  chequeRefNo: string;
  remarks: string;
  voucherNo: string;
  ackVno: string;
}

// Helper
const generateId = () => Math.random().toString(36).substr(2, 9);

// Mock branch data
const branches = [
  "Head Office - Mumbai",
  "North Branch - Delhi",
  "South Branch - Chennai",
  "East Branch - Kolkata",
  "West Branch - Ahmedabad",
  "Central Branch - Bhopal",
];

export default function FundTransfer() {
  // ========== Form State ==========
  const [branch, setBranch] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [ledger, setLedger] = useState("");
  const [balance, setBalance] = useState(1250000.00);

  // ========== Transfer Rows ==========
  const [transferRows, setTransferRows] = useState<FundTransferRow[]>([
    {
      id: generateId(),
      toBranch: "",
      amount: 0,
      chequeRefNo: "",
      remarks: "",
      voucherNo: "",
      ackVno: "",
    },
  ]);

  // Add new row
  const addRow = () => {
    setTransferRows([
      ...transferRows,
      {
        id: generateId(),
        toBranch: "",
        amount: 0,
        chequeRefNo: "",
        remarks: "",
        voucherNo: "",
        ackVno: "",
      },
    ]);
  };

  // Remove row
  const removeRow = (id: string) => {
    if (transferRows.length === 1) {
      alert("At least one row is required");
      return;
    }
    setTransferRows(transferRows.filter((row) => row.id !== id));
  };

  // Update row
  const updateRow = (id: string, field: keyof FundTransferRow, value: any) => {
    setTransferRows((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  // Calculate total amount
  const totalAmount = transferRows.reduce((sum, row) => sum + (Number(row.amount) || 0), 0);

  // ========== Actions ==========
  const handleShowDetails = () => {
    alert(`Branch: ${branch || "Not selected"}\nDate: ${date}\nLedger: ${ledger || "Not selected"}\nBalance: ₹${balance.toLocaleString()}\nTotal Transfer Amount: ₹${totalAmount.toLocaleString()}`);
  };

  const handleShowLedgerReport = () => {
    alert(`Ledger Report for: ${ledger || "All Ledgers"}\nPeriod: ${date}\nThis would open the ledger report in a new window/modal.`);
  };

  const handleClear = () => {
    if (confirm("Clear all form data?")) {
      setBranch("");
      setDate(new Date().toISOString().split("T")[0]);
      setLedger("");
      setBalance(1250000.00);
      setTransferRows([
        {
          id: generateId(),
          toBranch: "",
          amount: 0,
          chequeRefNo: "",
          remarks: "",
          voucherNo: "",
          ackVno: "",
        },
      ]);
    }
  };

  const handleTransfer = () => {
    // Validation
    if (!branch) {
      alert("Please select Branch");
      return;
    }
    if (!ledger) {
      alert("Please select Ledger");
      return;
    }
    if (totalAmount === 0) {
      alert("Please add at least one transfer with amount > 0");
      return;
    }
    if (totalAmount > balance) {
      alert(`Insufficient balance! Available: ₹${balance.toLocaleString()}, Required: ₹${totalAmount.toLocaleString()}`);
      return;
    }

    // Check each row has To Branch selected
    const invalidRows = transferRows.filter(row => !row.toBranch);
    if (invalidRows.length > 0) {
      alert("Please select 'To Branch' for all rows");
      return;
    }

    alert(`Fund Transfer Successful!\nTotal Amount: ₹${totalAmount.toLocaleString()}\nTransaction completed.`);
    // In real app, call API here
  };

  const handleCancel = () => {
    if (confirm("Cancel fund transfer? All data will be lost.")) {
      handleClear();
    }
  };

  return (
    <div className="space-y-6 p-3 sm:p-4 md:p-6 max-w-full overflow-x-hidden">
      <h1 className="text-xl sm:text-2xl font-bold text-primary">Fund Transfer</h1>

      {/* Main Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Transfer Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label>Branch <span className="text-red-500">*</span></Label>
              <Select value={branch} onValueChange={setBranch}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((b) => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Date <span className="text-red-500">*</span></Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <Label>Ledger <span className="text-red-500">*</span></Label>
              <Select value={ledger} onValueChange={setLedger}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Ledger" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SBI Current Account">SBI Current Account</SelectItem>
                  <SelectItem value="HDFC Bank">HDFC Bank</SelectItem>
                  <SelectItem value="ICICI Bank">ICICI Bank</SelectItem>
                  <SelectItem value="Axis Bank">Axis Bank</SelectItem>
                  <SelectItem value="Cash Ledger">Cash Ledger</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Balance</Label>
              <Input
                type="text"
                value={`₹ ${balance.toLocaleString('en-IN')}`}
                readOnly
                className="bg-muted font-semibold"
              />
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t">
            <Button variant="outline" onClick={handleShowDetails}>
              <Eye className="mr-2 h-4 w-4" /> Show Details
            </Button>
            <Button variant="outline" onClick={handleShowLedgerReport}>
              <FileText className="mr-2 h-4 w-4" /> Show Ledger Report
            </Button>
            <Button variant="secondary" onClick={handleClear}>
              <RefreshCw className="mr-2 h-4 w-4" /> Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Second Section: Same fields repeated (as per design) */}
      <Card>
        <CardHeader>
          <CardTitle>Transfer Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <Label>Branch <span className="text-red-500">*</span></Label>
              <Select value={branch} onValueChange={setBranch}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((b) => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Date <span className="text-red-500">*</span></Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <Label>Ledger <span className="text-red-500">*</span></Label>
              <Select value={ledger} onValueChange={setLedger}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Ledger" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SBI Current Account">SBI Current Account</SelectItem>
                  <SelectItem value="HDFC Bank">HDFC Bank</SelectItem>
                  <SelectItem value="ICICI Bank">ICICI Bank</SelectItem>
                  <SelectItem value="Axis Bank">Axis Bank</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Balance</Label>
              <Input
                type="text"
                value={`₹ ${balance.toLocaleString('en-IN')}`}
                readOnly
                className="bg-muted font-semibold"
              />
            </div>
          </div>

          {/* Transfer Table */}
          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">S#</TableHead>
                    <TableHead>To Branch</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Cheque/Ref #</TableHead>
                    <TableHead>Remarks</TableHead>
                    <TableHead>Voucher #</TableHead>
                    <TableHead>Ack Vno</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transferRows.map((row, idx) => (
                    <TableRow key={row.id}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>
                        <Select
                          value={row.toBranch}
                          onValueChange={(v) => updateRow(row.id, "toBranch", v)}
                        >
                          <SelectTrigger className="min-w-[180px]">
                            <SelectValue placeholder="Select Branch" />
                          </SelectTrigger>
                          <SelectContent>
                            {branches.map((b) => (
                              <SelectItem key={b} value={b}>{b}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={row.amount || ""}
                          onChange={(e) => updateRow(row.id, "amount", parseFloat(e.target.value) || 0)}
                          className="w-32 text-right"
                          placeholder="0.00"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={row.chequeRefNo}
                          onChange={(e) => updateRow(row.id, "chequeRefNo", e.target.value)}
                          placeholder="CHK/REF"
                          className="w-32"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={row.remarks}
                          onChange={(e) => updateRow(row.id, "remarks", e.target.value)}
                          placeholder="Remarks"
                          className="w-40"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={row.voucherNo}
                          onChange={(e) => updateRow(row.id, "voucherNo", e.target.value)}
                          placeholder="VCH No"
                          className="w-32"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={row.ackVno}
                          onChange={(e) => updateRow(row.id, "ackVno", e.target.value)}
                          placeholder="Ack No"
                          className="w-32"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeRow(row.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Add More Button & Total */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 pt-4 border-t">
            <Button onClick={addRow} variant="outline">
              <Plus className="mr-2 h-4 w-4" /> Add More
            </Button>
            <div className="text-lg font-bold">
              Total : <span className="text-blue-600">₹ {totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons: Transfer, Cancel, Remove (Remove is per row, but global remove all?) */}
      <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4 border-t">
        <Button onClick={handleTransfer} className="bg-green-600 hover:bg-green-700">
          <Send className="mr-2 h-4 w-4" /> Transfer
        </Button>
        <Button onClick={handleCancel} variant="destructive">
          <X className="mr-2 h-4 w-4" /> Cancel
        </Button>
      </div>

      {/* Info: Remove button is per row (already inside table) */}
      <div className="text-xs text-muted-foreground text-center">
        * Remove button appears in each row to delete individual entries
      </div>
    </div>
  );
}