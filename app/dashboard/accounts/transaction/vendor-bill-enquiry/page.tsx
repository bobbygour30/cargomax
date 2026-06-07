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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, RefreshCw, Eye, FileText, X } from "lucide-react";

// ==================== Types ====================
interface BillDetail {
  id: string;
  itemName: string;
  unitType: string;
  quantity: number;
  rate: number;
  subTotal: number;
  cgstPercent: number;
  cgstAmount: number;
  sgstPercent: number;
  sgstAmount: number;
  igstPercent: number;
  igstAmount: number;
  amount: number;
  voucherNo: string;
  remarks: string;
}

interface PaymentDetail {
  id: string;
  paymentId: string;
  paymentDate: string;
  paymentMode: string;
  instrumentType: string;
  instrumentNo: string;
  instrumentDate: string;
  billAmount: number;
  paidAmount: number;
  tdsAmount: number;
  bankCharges: number;
  balance: number;
  voucherNo: string;
  remarks: string;
}

interface DebitNoteDetail {
  id: string;
  debitNoteNo: string;
  date: string;
  amount: number;
  voucherNo: string;
  remarks: string;
}

interface VendorBill {
  id: string;
  billNo: string;
  branchName: string;
  mrnId: number;
  receiveDate: string;
  storeName: string;
  invoiceCategory: string;
  invoiceNo: string;
  invoiceDate: string;
  invoicePeriodFrom: string;
  invoicePeriodTo: string;
  netAmount: number;
  additionalAmount: number;
  deductionAmount: number;
  tdsAmount: number;
  paidAmount: number;
  balance: number;
  attachmentUrl: string;
  billDetails: BillDetail[];
  paymentDetails: PaymentDetail[];
  debitNoteDetails: DebitNoteDetail[];
}

// Mock Data
const mockBillDetails: BillDetail[] = [
  {
    id: "1",
    itemName: "Freight Charges",
    unitType: "Ton",
    quantity: 10,
    rate: 5000,
    subTotal: 50000,
    cgstPercent: 2.5,
    cgstAmount: 1250,
    sgstPercent: 2.5,
    sgstAmount: 1250,
    igstPercent: 0,
    igstAmount: 0,
    amount: 52500,
    voucherNo: "VCH-001",
    remarks: "Delivered on time",
  },
  {
    id: "2",
    itemName: "Loading Charges",
    unitType: "Unit",
    quantity: 5,
    rate: 1000,
    subTotal: 5000,
    cgstPercent: 2.5,
    cgstAmount: 125,
    sgstPercent: 2.5,
    sgstAmount: 125,
    igstPercent: 0,
    igstAmount: 0,
    amount: 5250,
    voucherNo: "VCH-001",
    remarks: "",
  },
];

const mockPaymentDetails: PaymentDetail[] = [
  {
    id: "1",
    paymentId: "PAY-001",
    paymentDate: "2026-05-10",
    paymentMode: "Bank Transfer",
    instrumentType: "NEFT",
    instrumentNo: "NEFT-123456",
    instrumentDate: "2026-05-10",
    billAmount: 57750,
    paidAmount: 50000,
    tdsAmount: 2500,
    bankCharges: 100,
    balance: 7750,
    voucherNo: "VCH-101",
    remarks: "Partial payment",
  },
  {
    id: "2",
    paymentId: "PAY-002",
    paymentDate: "2026-05-20",
    paymentMode: "Cheque",
    instrumentType: "Cheque",
    instrumentNo: "CHK-789012",
    instrumentDate: "2026-05-20",
    billAmount: 57750,
    paidAmount: 7750,
    tdsAmount: 0,
    bankCharges: 0,
    balance: 0,
    voucherNo: "VCH-102",
    remarks: "Final payment",
  },
];

const mockDebitNoteDetails: DebitNoteDetail[] = [
  {
    id: "1",
    debitNoteNo: "DN-001",
    date: "2026-05-15",
    amount: 5000,
    voucherNo: "VCH-201",
    remarks: "Damage claim",
  },
];

const mockVendorBill: VendorBill = {
  id: "1",
  billNo: "BILL-001",
  branchName: "Mumbai HO",
  mrnId: 1001,
  receiveDate: "2026-05-14",
  storeName: "Main Store",
  invoiceCategory: "Purchase",
  invoiceNo: "INV-001",
  invoiceDate: "2026-05-10",
  invoicePeriodFrom: "2026-05-01",
  invoicePeriodTo: "2026-05-31",
  netAmount: 57750,
  additionalAmount: 0,
  deductionAmount: 0,
  tdsAmount: 2500,
  paidAmount: 57750,
  balance: 0,
  attachmentUrl: "/sample.pdf",
  billDetails: mockBillDetails,
  paymentDetails: mockPaymentDetails,
  debitNoteDetails: mockDebitNoteDetails,
};

// Mock Data for Dropdowns
const branchNames: string[] = ["Select Branch", "Mumbai HO", "Delhi Branch", "Chennai Branch", "Kolkata Branch", "Bangalore Branch"];
const storeNames: string[] = ["Select Store", "Main Store", "North Store", "South Store", "East Store", "West Store"];
const invoiceCategories: string[] = ["Select Category", "Purchase", "Service", "Expense", "Asset"];

export default function VendorBillEnquiry() {
  // ========== State ==========
  const [billNo, setBillNo] = useState<string>("");
  const [branchName, setBranchName] = useState<string>("");
  const [mrnId, setMrnId] = useState<number>(0);
  const [receiveDate, setReceiveDate] = useState<string>("");
  const [storeName, setStoreName] = useState<string>("");
  const [invoiceCategory, setInvoiceCategory] = useState<string>("");
  const [invoiceNo, setInvoiceNo] = useState<string>("");
  const [invoiceDate, setInvoiceDate] = useState<string>("");
  const [invoicePeriodFrom, setInvoicePeriodFrom] = useState<string>("");
  const [invoicePeriodTo, setInvoicePeriodTo] = useState<string>("");
  const [netAmount, setNetAmount] = useState<number>(0);
  const [additionalAmount, setAdditionalAmount] = useState<number>(0);
  const [deductionAmount, setDeductionAmount] = useState<number>(0);
  const [tdsAmount, setTdsAmount] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  const [billDetails, setBillDetails] = useState<BillDetail[]>([]);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetail[]>([]);
  const [debitNoteDetails, setDebitNoteDetails] = useState<DebitNoteDetail[]>([]);
  const [attachmentDialogOpen, setAttachmentDialogOpen] = useState<boolean>(false);
  const [attachmentUrl, setAttachmentUrl] = useState<string>("");

  // ========== Handlers ==========
  const handleShowDetails = (): void => {
    if (!billNo) {
      alert("Please enter Bill #");
      return;
    }

    // Mock API call - in real app, fetch data based on billNo
    if (billNo === "BILL-001") {
      setBranchName(mockVendorBill.branchName);
      setMrnId(mockVendorBill.mrnId);
      setReceiveDate(mockVendorBill.receiveDate);
      setStoreName(mockVendorBill.storeName);
      setInvoiceCategory(mockVendorBill.invoiceCategory);
      setInvoiceNo(mockVendorBill.invoiceNo);
      setInvoiceDate(mockVendorBill.invoiceDate);
      setInvoicePeriodFrom(mockVendorBill.invoicePeriodFrom);
      setInvoicePeriodTo(mockVendorBill.invoicePeriodTo);
      setNetAmount(mockVendorBill.netAmount);
      setAdditionalAmount(mockVendorBill.additionalAmount);
      setDeductionAmount(mockVendorBill.deductionAmount);
      setTdsAmount(mockVendorBill.tdsAmount);
      setPaidAmount(mockVendorBill.paidAmount);
      setBalance(mockVendorBill.balance);
      setBillDetails(mockVendorBill.billDetails);
      setPaymentDetails(mockVendorBill.paymentDetails);
      setDebitNoteDetails(mockVendorBill.debitNoteDetails);
      setAttachmentUrl(mockVendorBill.attachmentUrl);
      alert(`Bill details loaded for ${billNo}`);
    } else {
      alert("Bill not found. Please enter a valid Bill #");
    }
  };

  const handleClear = (): void => {
    setBillNo("");
    setBranchName("");
    setMrnId(0);
    setReceiveDate("");
    setStoreName("");
    setInvoiceCategory("");
    setInvoiceNo("");
    setInvoiceDate("");
    setInvoicePeriodFrom("");
    setInvoicePeriodTo("");
    setNetAmount(0);
    setAdditionalAmount(0);
    setDeductionAmount(0);
    setTdsAmount(0);
    setPaidAmount(0);
    setBalance(0);
    setBillDetails([]);
    setPaymentDetails([]);
    setDebitNoteDetails([]);
    setAttachmentUrl("");
  };

  const handleViewAttachment = (): void => {
    if (attachmentUrl) {
      setAttachmentDialogOpen(true);
    } else {
      alert("No attachment available for this bill");
    }
  };

  // Calculate balance whenever amounts change
  const calculateBalance = (): void => {
    const total = netAmount + additionalAmount - deductionAmount - tdsAmount - paidAmount;
    setBalance(total);
  };

  return (
    <div className="space-y-6 p-3 sm:p-4 md:p-6 max-w-full overflow-x-hidden">
      <h1 className="text-xl sm:text-2xl font-bold text-primary">Vendor Bill Enquiry</h1>

      {/* Bill Search Section */}
      <Card>
        <CardHeader>
          <CardTitle>Bill Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label>Bill #</Label>
              <div className="flex gap-2">
                <Input 
                  value={billNo} 
                  onChange={(e) => setBillNo(e.target.value)} 
                  placeholder="Enter Bill Number"
                />
                <Button onClick={handleShowDetails} className="bg-blue-600 hover:bg-blue-700">
                  <Search className="h-4 w-4" />
                </Button>
                <Button onClick={handleClear} variant="outline">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bill Information Section */}
      <Card>
        <CardHeader>
          <CardTitle>Bill Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label>Branch Name</Label>
              <Select value={branchName} onValueChange={setBranchName}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent>
                  {branchNames.map(b => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>MRN Id</Label>
              <Input type="number" value={mrnId} readOnly className="bg-muted" />
            </div>
            <div>
              <Label>Receive Date</Label>
              <Input type="date" value={receiveDate} onChange={(e) => setReceiveDate(e.target.value)} />
            </div>
            <div>
              <Label>Store Name</Label>
              <Select value={storeName} onValueChange={setStoreName}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Store" />
                </SelectTrigger>
                <SelectContent>
                  {storeNames.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Invoice Category</Label>
              <Select value={invoiceCategory} onValueChange={setInvoiceCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {invoiceCategories.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Invoice #</Label>
              <Input value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} />
            </div>
            <div>
              <Label>Invoice Date</Label>
              <div className="flex gap-2">
                <Input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} className="flex-1" />
                <Button variant="outline" onClick={handleViewAttachment}>
                  <FileText className="h-4 w-4 mr-1" /> View Attachment
                </Button>
              </div>
            </div>
            <div>
              <Label>Invoice Period</Label>
              <div className="flex gap-2">
                <Input type="date" value={invoicePeriodFrom} onChange={(e) => setInvoicePeriodFrom(e.target.value)} className="w-1/2" />
                <span className="self-center">To</span>
                <Input type="date" value={invoicePeriodTo} onChange={(e) => setInvoicePeriodTo(e.target.value)} className="w-1/2" />
              </div>
            </div>
          </div>

          {/* Amount Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-4 border-t">
            <div>
              <Label>Net Amount</Label>
              <Input 
                type="number" 
                value={netAmount} 
                onChange={(e) => {
                  setNetAmount(Number(e.target.value));
                  setTimeout(calculateBalance, 10);
                }} 
              />
            </div>
            <div>
              <Label>Additional Amount</Label>
              <Input 
                type="number" 
                value={additionalAmount} 
                onChange={(e) => {
                  setAdditionalAmount(Number(e.target.value));
                  setTimeout(calculateBalance, 10);
                }} 
              />
            </div>
            <div>
              <Label>Deduction Amount</Label>
              <Input 
                type="number" 
                value={deductionAmount} 
                onChange={(e) => {
                  setDeductionAmount(Number(e.target.value));
                  setTimeout(calculateBalance, 10);
                }} 
              />
            </div>
            <div>
              <Label>TDS Amount</Label>
              <Input 
                type="number" 
                value={tdsAmount} 
                onChange={(e) => {
                  setTdsAmount(Number(e.target.value));
                  setTimeout(calculateBalance, 10);
                }} 
              />
            </div>
            <div>
              <Label>Paid Amount</Label>
              <Input 
                type="number" 
                value={paidAmount} 
                onChange={(e) => {
                  setPaidAmount(Number(e.target.value));
                  setTimeout(calculateBalance, 10);
                }} 
              />
            </div>
            <div>
              <Label>Balance</Label>
              <Input type="number" value={balance} readOnly className="bg-muted font-semibold text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details Tabs */}
      <Tabs defaultValue="bill" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bill">Bill Details</TabsTrigger>
          <TabsTrigger value="payment">Payment Details</TabsTrigger>
          <TabsTrigger value="debit">Debit Note Details</TabsTrigger>
        </TabsList>

        {/* Bill Details Tab */}
        <TabsContent value="bill" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Bill Items</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <div className="min-w-[1200px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>S#</TableHead>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Unit Type</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Rate</TableHead>
                      <TableHead className="text-right">Sub Total</TableHead>
                      <TableHead className="text-right">CGST %</TableHead>
                      <TableHead className="text-right">CGST Amount</TableHead>
                      <TableHead className="text-right">SGST %</TableHead>
                      <TableHead className="text-right">SGST Amount</TableHead>
                      <TableHead className="text-right">IGST %</TableHead>
                      <TableHead className="text-right">IGST Amount</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Voucher #</TableHead>
                      <TableHead>Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {billDetails.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={15} className="text-center py-8 text-muted-foreground">
                          No bill details found
                        </TableCell>
                      </TableRow>
                    ) : (
                      billDetails.map((item, idx) => (
                        <TableRow key={item.id}>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell>{item.itemName}</TableCell>
                          <TableCell>{item.unitType}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">₹ {item.rate.toLocaleString()}</TableCell>
                          <TableCell className="text-right">₹ {item.subTotal.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{item.cgstPercent}%</TableCell>
                          <TableCell className="text-right">₹ {item.cgstAmount.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{item.sgstPercent}%</TableCell>
                          <TableCell className="text-right">₹ {item.sgstAmount.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{item.igstPercent}%</TableCell>
                          <TableCell className="text-right">₹ {item.igstAmount.toLocaleString()}</TableCell>
                          <TableCell className="text-right">₹ {item.amount.toLocaleString()}</TableCell>
                          <TableCell>{item.voucherNo}</TableCell>
                          <TableCell>{item.remarks}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Details Tab */}
        <TabsContent value="payment" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <div className="min-w-[1000px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>S#</TableHead>
                      <TableHead>Payment Id</TableHead>
                      <TableHead>Payment Date</TableHead>
                      <TableHead>Payment Mode</TableHead>
                      <TableHead>Instrument Type</TableHead>
                      <TableHead>Instrument #</TableHead>
                      <TableHead>Instrument Date</TableHead>
                      <TableHead className="text-right">Bill Amount</TableHead>
                      <TableHead className="text-right">Paid Amount</TableHead>
                      <TableHead className="text-right">TDS Amount</TableHead>
                      <TableHead className="text-right">Bank Charges</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                      <TableHead>Voucher #</TableHead>
                      <TableHead>Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentDetails.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={14} className="text-center py-8 text-muted-foreground">
                          No payment details found
                        </TableCell>
                      </TableRow>
                    ) : (
                      paymentDetails.map((payment, idx) => (
                        <TableRow key={payment.id}>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell>{payment.paymentId}</TableCell>
                          <TableCell>{payment.paymentDate}</TableCell>
                          <TableCell>{payment.paymentMode}</TableCell>
                          <TableCell>{payment.instrumentType}</TableCell>
                          <TableCell>{payment.instrumentNo}</TableCell>
                          <TableCell>{payment.instrumentDate}</TableCell>
                          <TableCell className="text-right">₹ {payment.billAmount.toLocaleString()}</TableCell>
                          <TableCell className="text-right">₹ {payment.paidAmount.toLocaleString()}</TableCell>
                          <TableCell className="text-right">₹ {payment.tdsAmount.toLocaleString()}</TableCell>
                          <TableCell className="text-right">₹ {payment.bankCharges.toLocaleString()}</TableCell>
                          <TableCell className="text-right">₹ {payment.balance.toLocaleString()}</TableCell>
                          <TableCell>{payment.voucherNo}</TableCell>
                          <TableCell>{payment.remarks}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Debit Note Details Tab */}
        <TabsContent value="debit" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Debit Notes</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <div className="min-w-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>S#</TableHead>
                      <TableHead>Debit Note #</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Voucher #</TableHead>
                      <TableHead>Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {debitNoteDetails.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No debit note details found
                        </TableCell>
                      </TableRow>
                    ) : (
                      debitNoteDetails.map((debit, idx) => (
                        <TableRow key={debit.id}>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell>{debit.debitNoteNo}</TableCell>
                          <TableCell>{debit.date}</TableCell>
                          <TableCell className="text-right">₹ {debit.amount.toLocaleString()}</TableCell>
                          <TableCell>{debit.voucherNo}</TableCell>
                          <TableCell>{debit.remarks}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Attachment View Dialog */}
      <Dialog open={attachmentDialogOpen} onOpenChange={setAttachmentDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Attachment Preview</DialogTitle>
          </DialogHeader>
          <div className="p-4 text-center">
            <FileText className="h-16 w-16 mx-auto text-blue-500 mb-4" />
            <p className="text-sm text-muted-foreground mb-4">Sample attachment file</p>
            <p className="text-xs text-muted-foreground">File: {attachmentUrl}</p>
            <Button variant="outline" className="mt-4" onClick={() => window.open(attachmentUrl, "_blank")}>
              Open Attachment
            </Button>
          </div>
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={() => setAttachmentDialogOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}