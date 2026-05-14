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
import { Plus, Trash2, Save, X, RefreshCw } from "lucide-react";

// ==================== Types ====================
interface FreightMemo {
  id: string;
  memoNo: string;
  date: string;
  creditLedger: string;
  freightAmount: number;
  advance: number;
  tds: number;
  balance: number;
  netPayable: number;
  paid: boolean;
}

interface ExpenseRow {
  id: string;
  particulars: string;
  sign: "+" | "-";
  percent: number;
  applicable: string;
  amount: number;
  roundOff: number;
  remarks: string;
}

// Helper
const generateId = () => Math.random().toString(36).substr(2, 9);

// Mock freight memos (to be selected via "Select Freight Memo" button)
const mockFreightMemos: FreightMemo[] = [
  {
    id: "fm1",
    memoNo: "FM-001",
    date: "2026-05-10",
    creditLedger: "ABC Transport",
    freightAmount: 50000,
    advance: 10000,
    tds: 2500,
    balance: 37500,
    netPayable: 37500,
    paid: false,
  },
  {
    id: "fm2",
    memoNo: "FM-002",
    date: "2026-05-12",
    creditLedger: "XYZ Logistics",
    freightAmount: 35000,
    advance: 5000,
    tds: 1750,
    balance: 28250,
    netPayable: 28250,
    paid: false,
  },
];

export default function FreightMemoPayment() {
  // ========== Payment Type ==========
  const [advancePayment, setAdvancePayment] = useState(false);
  const [balancePayment, setBalancePayment] = useState(false);

  // ========== Entry Form Fields ==========
  const [branch, setBranch] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [modeType, setModeType] = useState("SURFACE");
  const [paymentOn, setPaymentOn] = useState("Vehicle Wise");
  const [vehicle, setVehicle] = useState("");
  const [owner, setOwner] = useState("");
  const [broker, setBroker] = useState("");
  const [pan, setPan] = useState("");

  // ========== Freight Memos Table ==========
  const [freightMemos, setFreightMemos] = useState<FreightMemo[]>(mockFreightMemos);

  // Totals
  const totals = freightMemos.reduce(
    (acc, fm) => ({
      freightAmount: acc.freightAmount + fm.freightAmount,
      advance: acc.advance + fm.advance,
      tds: acc.tds + fm.tds,
      balance: acc.balance + fm.balance,
      netPayable: acc.netPayable + fm.netPayable,
      paid: acc.paid + (fm.paid ? fm.netPayable : 0),
    }),
    { freightAmount: 0, advance: 0, tds: 0, balance: 0, netPayable: 0, paid: 0 }
  );

  const handleSelectFreightMemo = () => {
    // In real app, open modal and select memos. Here we just add a mock new one.
    const newMemo: FreightMemo = {
      id: generateId(),
      memoNo: `FM-${Math.floor(Math.random() * 1000)}`,
      date: new Date().toISOString().split("T")[0],
      creditLedger: "New Ledger",
      freightAmount: 22000,
      advance: 2000,
      tds: 1100,
      balance: 18900,
      netPayable: 18900,
      paid: false,
    };
    setFreightMemos([...freightMemos, newMemo]);
    alert("Freight memo added (demo). In production, open a selection modal.");
  };

  const togglePaid = (id: string) => {
    setFreightMemos((prev) =>
      prev.map((fm) =>
        fm.id === id ? { ...fm, paid: !fm.paid, netPayable: fm.netPayable } : fm
      )
    );
  };

  // ========== Left Side: Expense Details ==========
  const [expenses, setExpenses] = useState<ExpenseRow[]>([
    {
      id: generateId(),
      particulars: "Loading",
      sign: "+",
      percent: 0,
      applicable: "Full",
      amount: 500,
      roundOff: 0,
      remarks: "",
    },
  ]);

  const addExpenseRow = () => {
    setExpenses([
      ...expenses,
      {
        id: generateId(),
        particulars: "",
        sign: "+",
        percent: 0,
        applicable: "",
        amount: 0,
        roundOff: 0,
        remarks: "",
      },
    ]);
  };

  const updateExpenseRow = (id: string, field: keyof ExpenseRow, value: any) => {
    setExpenses((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const deleteExpenseRow = (id: string) => {
    setExpenses((prev) => prev.filter((row) => row.id !== id));
  };

  const subtotal = expenses.reduce((sum, row) => {
    const amount = row.sign === "+" ? row.amount : -row.amount;
    return sum + amount;
  }, 0);

  // ========== Right Side: Payment Advice ==========
  const [debitLedger, setDebitLedger] = useState("");
  const [mode, setMode] = useState("CASH");
  const [amount, setAmount] = useState(0);
  const [instrumentNo, setInstrumentNo] = useState("");
  const [instrumentDate, setInstrumentDate] = useState(new Date().toISOString().split("T")[0]);
  const [creditLedger, setCreditLedger] = useState("");
  const [creditNoteNo, setCreditNoteNo] = useState("");
  const [voucherNo, setVoucherNo] = useState("");
  const [remarks, setRemarks] = useState("");

  // ========== Actions ==========
  const handleSave = () => {
    if (!branch) alert("Branch is required");
    else if (!vehicle) alert("Vehicle is required");
    else {
      alert("Payment saved successfully (demo)");
      // Reset or navigate
    }
  };

  const handleClear = () => {
    setBranch("");
    setVehicle("");
    setOwner("");
    setBroker("");
    setPan("");
    setAdvancePayment(false);
    setBalancePayment(false);
    setExpenses([
      {
        id: generateId(),
        particulars: "Loading",
        sign: "+",
        percent: 0,
        applicable: "Full",
        amount: 500,
        roundOff: 0,
        remarks: "",
      },
    ]);
    setDebitLedger("");
    setMode("CASH");
    setAmount(0);
    setInstrumentNo("");
    setCreditLedger("");
    setCreditNoteNo("");
    setVoucherNo("");
    setRemarks("");
    // Optionally reset freight memos
    setFreightMemos(mockFreightMemos);
    alert("Form cleared");
  };

  const handleCancel = () => {
    if (confirm("Discard changes?")) {
      handleClear();
    }
  };

  return (
    <div className="space-y-6 p-3 sm:p-4 md:p-6 max-w-full overflow-x-hidden">
      <h1 className="text-xl sm:text-2xl font-bold text-primary">Freight Memo Payment</h1>

      {/* Payment Type Checkboxes */}
      <div className="flex gap-6 border-b pb-4">
        <div className="flex items-center gap-2">
          <Checkbox
            id="advance"
            checked={advancePayment}
            onCheckedChange={(c) => setAdvancePayment(!!c)}
          />
          <Label htmlFor="advance">Advance Payment</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="balance"
            checked={balancePayment}
            onCheckedChange={(c) => setBalancePayment(!!c)}
          />
          <Label htmlFor="balance">Balance Payment</Label>
        </div>
      </div>

      {/* Entry Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label>Branch <span className="text-red-500">*</span></Label>
              <Select value={branch} onValueChange={setBranch}>
                <SelectTrigger><SelectValue placeholder="Select Branch" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mumbai">Mumbai</SelectItem>
                  <SelectItem value="Delhi">Delhi</SelectItem>
                  <SelectItem value="Chennai">Chennai</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Date <span className="text-red-500">*</span></Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <Label>Mode Type <span className="text-red-500">*</span></Label>
              <Select value={modeType} onValueChange={setModeType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="SURFACE">SURFACE</SelectItem>
                  <SelectItem value="AIR">AIR</SelectItem>
                  <SelectItem value="RAIL">RAIL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Payment On <span className="text-red-500">*</span></Label>
              <Select value={paymentOn} onValueChange={setPaymentOn}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vehicle Wise">Vehicle Wise</SelectItem>
                  <SelectItem value="LR Wise">LR Wise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Vehicle <span className="text-red-500">*</span></Label>
              <Input value={vehicle} onChange={(e) => setVehicle(e.target.value)} />
            </div>
            <div>
              <Label>Owner</Label>
              <Input value={owner} onChange={(e) => setOwner(e.target.value)} />
            </div>
            <div>
              <Label>Broker</Label>
              <Input value={broker} onChange={(e) => setBroker(e.target.value)} />
            </div>
            <div>
              <Label>PAN</Label>
              <Input value={pan} onChange={(e) => setPan(e.target.value.toUpperCase())} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Select Freight Memo Button + Table */}
      <div className="flex justify-end">
        <Button onClick={handleSelectFreightMemo} className="bg-blue-600 hover:bg-blue-700">
          Select Freight Memo
        </Button>
      </div>

      <Card>
        <CardContent className="overflow-x-auto p-0 sm:p-4">
          <div className="min-w-[800px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S#</TableHead>
                  <TableHead>Freight Memo #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Credit Ledger</TableHead>
                  <TableHead>Freight Memo Amount</TableHead>
                  <TableHead>Advance</TableHead>
                  <TableHead>TDS</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Net Payable</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {freightMemos.map((fm, idx) => (
                  <TableRow key={fm.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{fm.memoNo}</TableCell>
                    <TableCell>{fm.date}</TableCell>
                    <TableCell>{fm.creditLedger}</TableCell>
                    <TableCell className="text-right">{fm.freightAmount.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{fm.advance.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{fm.tds.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{fm.balance.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{fm.netPayable.toLocaleString()}</TableCell>
                    <TableCell>
                      <Checkbox checked={fm.paid} onCheckedChange={() => togglePaid(fm.id)} />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => alert(`Edit ${fm.memoNo}`)}>
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Total Row */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-sm font-semibold">
            <div>Freight Memo Amount: <span className="text-blue-600">{totals.freightAmount.toLocaleString()}</span></div>
            <div>Advance: <span className="text-orange-600">{totals.advance.toLocaleString()}</span></div>
            <div>TDS: <span className="text-red-600">{totals.tds.toLocaleString()}</span></div>
            <div>Balance: <span className="text-purple-600">{totals.balance.toLocaleString()}</span></div>
            <div>Net Payable: <span className="text-green-600">{totals.netPayable.toLocaleString()}</span></div>
            <div>Paid: <span className="text-emerald-600">{totals.paid.toLocaleString()}</span></div>
          </div>
        </CardContent>
      </Card>

      {/* Two column layout: Left (Expenses) + Right (Payment Advice) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Add/Less Expense Details */}
        <Card>
          <CardHeader className="pb-2 flex flex-row justify-between items-center">
            <CardTitle>Add/Less Expense Details</CardTitle>
            <Button variant="outline" size="sm" onClick={addExpenseRow}>
              <Plus className="h-4 w-4 mr-1" /> Add More
            </Button>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0 sm:p-2">
            <div className="min-w-[600px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Particulars</TableHead>
                    <TableHead>+/-</TableHead>
                    <TableHead>%</TableHead>
                    <TableHead>Applicable</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>RoundOff</TableHead>
                    <TableHead>Remarks</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell><Input value={row.particulars} onChange={(e) => updateExpenseRow(row.id, "particulars", e.target.value)} className="min-w-[120px]" /></TableCell>
                      <TableCell>
                        <Select value={row.sign} onValueChange={(v: "+" | "-") => updateExpenseRow(row.id, "sign", v)}>
                          <SelectTrigger className="w-16"><SelectValue /></SelectTrigger>
                          <SelectContent><SelectItem value="+">+</SelectItem><SelectItem value="-">-</SelectItem></SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell><Input type="number" value={row.percent} onChange={(e) => updateExpenseRow(row.id, "percent", Number(e.target.value))} className="w-20" /></TableCell>
                      <TableCell><Input value={row.applicable} onChange={(e) => updateExpenseRow(row.id, "applicable", e.target.value)} className="w-24" /></TableCell>
                      <TableCell><Input type="number" value={row.amount} onChange={(e) => updateExpenseRow(row.id, "amount", Number(e.target.value))} className="w-28" /></TableCell>
                      <TableCell><Input type="number" value={row.roundOff} onChange={(e) => updateExpenseRow(row.id, "roundOff", Number(e.target.value))} className="w-24" /></TableCell>
                      <TableCell><Input value={row.remarks} onChange={(e) => updateExpenseRow(row.id, "remarks", e.target.value)} /></TableCell>
                      <TableCell><Button variant="ghost" size="sm" onClick={() => deleteExpenseRow(row.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-end p-4 font-bold text-lg">
              SUBTOTAL: <span className="ml-2 text-blue-600">{subtotal.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* RIGHT: Payment Advice */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Advice</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Debit Ledger <span className="text-red-500">*</span></Label>
                <Input value={debitLedger} onChange={(e) => setDebitLedger(e.target.value)} />
              </div>
              <div>
                <Label>Mode <span className="text-red-500">*</span></Label>
                <Select value={mode} onValueChange={setMode}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CASH">CASH</SelectItem>
                    <SelectItem value="CHEQUE">CHEQUE</SelectItem>
                    <SelectItem value="BANK TRANSFER">BANK TRANSFER</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Amount <span className="text-red-500">*</span></Label>
                <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
              </div>
              <div>
                <Label>Instrument #</Label>
                <Input value={instrumentNo} onChange={(e) => setInstrumentNo(e.target.value)} />
              </div>
              <div>
                <Label>Date</Label>
                <Input type="date" value={instrumentDate} onChange={(e) => setInstrumentDate(e.target.value)} />
              </div>
              <div>
                <Label>Credit Ledger <span className="text-red-500">*</span></Label>
                <Input value={creditLedger} onChange={(e) => setCreditLedger(e.target.value)} />
              </div>
              <div>
                <Label>Credit Note #</Label>
                <Input value={creditNoteNo} onChange={(e) => setCreditNoteNo(e.target.value)} />
              </div>
              <div>
                <Label>Voucher #</Label>
                <Input value={voucherNo} onChange={(e) => setVoucherNo(e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <Label>Remarks</Label>
                <Input value={remarks} onChange={(e) => setRemarks(e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4 border-t">
        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
          <Save className="mr-2 h-4 w-4" /> Save
        </Button>
        <Button onClick={handleClear} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" /> Clear
        </Button>
        <Button onClick={handleCancel} variant="destructive">
          <X className="mr-2 h-4 w-4" /> Cancel
        </Button>
      </div>
    </div>
  );
}