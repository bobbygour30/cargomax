"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Printer, RefreshCw, Eye, Plus } from "lucide-react";

// ==================== Types ====================
interface PaymentDetail {
  id: string;
  sNo: number;
  mrNo: string;
  mrDate: string;
  crNoteNo: string;
  recdAmount: number;
  rebate: number;
  excess: number;
  tdsAmount: number;
  tdsCGST: number;
  tdsSGST: number;
  tdsIGST: number;
  claim: string;
}

interface GrDetail {
  id: string;
  sNo: number;
  grNo: string;
  bookingDate: string;
  drNo: string;
  drDate: string;
  origin: string;
  destination: string;
  packages: number;
  weight: number;
  freight: number;
  oAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalAmount: number;
}

// ==================== Mock Data ====================
const mockPaymentDetails: PaymentDetail[] = [
  {
    id: "p1",
    sNo: 1,
    mrNo: "MR-001",
    mrDate: "2026-05-10",
    crNoteNo: "CN-001",
    recdAmount: 5000,
    rebate: 0,
    excess: 0,
    tdsAmount: 500,
    tdsCGST: 250,
    tdsSGST: 250,
    tdsIGST: 0,
    claim: "Pending",
  },
  {
    id: "p2",
    sNo: 2,
    mrNo: "MR-002",
    mrDate: "2026-05-12",
    crNoteNo: "CN-002",
    recdAmount: 7500,
    rebate: 100,
    excess: 0,
    tdsAmount: 750,
    tdsCGST: 375,
    tdsSGST: 375,
    tdsIGST: 0,
    claim: "Settled",
  },
];

const mockGrDetails: GrDetail[] = [
  {
    id: "g1",
    sNo: 1,
    grNo: "GR-101",
    bookingDate: "2026-05-01",
    drNo: "DR-101",
    drDate: "2026-05-02",
    origin: "Mumbai",
    destination: "Delhi",
    packages: 10,
    weight: 500,
    freight: 2000,
    oAmount: 2500,
    cgst: 180,
    sgst: 180,
    igst: 0,
    totalAmount: 2860,
  },
  {
    id: "g2",
    sNo: 2,
    grNo: "GR-102",
    bookingDate: "2026-05-05",
    drNo: "DR-102",
    drDate: "2026-05-06",
    origin: "Chennai",
    destination: "Bangalore",
    packages: 5,
    weight: 250,
    freight: 1200,
    oAmount: 1500,
    cgst: 108,
    sgst: 108,
    igst: 0,
    totalAmount: 1716,
  },
];

// ==================== Main Component ====================
export default function BillEnquiry() {
  // Form State
  const [billNo, setBillNo] = useState("");
  const [customer, setCustomer] = useState("ABC Corp");
  const [customerDept, setCustomerDept] = useState("Logistics");
  const [billDate, setBillDate] = useState("2026-05-13");
  const [billingBranch, setBillingBranch] = useState("Mumbai HO");
  const [collectionAt, setCollectionAt] = useState("Delhi - Peera Garhi");
  const [debitTo, setDebitTo] = useState("Ledger: ABC Corp");
  const [packageQty, setPackageQty] = useState(10);
  const [weight, setWeight] = useState(500);
  const [freight, setFreight] = useState(2000);
  const [otherCharges, setOtherCharges] = useState(500);
  const [gst, setGst] = useState(450);
  const [gstType, setGstType] = useState("CGST+SGST");
  const [billTotal, setBillTotal] = useState(2950);
  const [totalReceived, setTotalReceived] = useState(2500);
  const [balance, setBalance] = useState(450);
  const [voucherNo, setVoucherNo] = useState("VCH-12345");
  const [billCreatedOn, setBillCreatedOn] = useState("2026-05-13 10:30");
  const [billCreatedBy, setBillCreatedBy] = useState("Admin");
  const [billEditedBy, setBillEditedBy] = useState("");
  const [billEditedOn, setBillEditedOn] = useState("");
  const [billSubmissionDate, setBillSubmissionDate] = useState("2026-05-15");
  const [submittedBy, setSubmittedBy] = useState("Ramesh");
  const [division, setDivision] = useState("Freight Division");

  // Table Data State (would be fetched based on Bill# in real app)
  const [paymentDetails] = useState<PaymentDetail[]>(mockPaymentDetails);
  const [grDetails] = useState<GrDetail[]>(mockGrDetails);

  // Handlers
  const handleSearchBill = () => {
    if (!billNo) {
      alert("Please enter Bill #");
      return;
    }
    alert(`Searching for Bill #: ${billNo} - In real app, data would load.`);
    // In a real app, you would fetch and update all states here.
  };

  const handleSearchOtherCharges = () => {
    alert("Search other charges - open modal/integrate with API");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleUpdateCollectionAt = () => {
    alert(`Update Collection At to: ${collectionAt}`);
  };

  const handleShowCosting = () => {
    alert("Showing costing details (can open a modal)");
  };

  // Helper to recalc balance (optional demo)
  React.useEffect(() => {
    const total = freight + otherCharges + gst;
    setBillTotal(total);
    setBalance(total - totalReceived);
  }, [freight, otherCharges, gst, totalReceived]);

  return (
    <div className="space-y-4 p-3 sm:p-4 md:p-6 max-w-full overflow-x-hidden">
      <h1 className="text-xl sm:text-2xl font-bold text-primary">Bill Enquiry</h1>

      {/* Bill # Row with search and other charges button */}
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex-1">
          <Label>
            Bill # <span className="text-red-500">*</span>
          </Label>
          <div className="flex gap-2 mt-1">
            <Input
              value={billNo}
              onChange={(e) => setBillNo(e.target.value)}
              placeholder="Enter Bill Number"
              className="flex-1"
            />
            <Button onClick={handleSearchBill}>
              <Search className="h-4 w-4 mr-2" /> Search
            </Button>
          </div>
        </div>
        <Button variant="outline" onClick={handleSearchOtherCharges}>
          <Plus className="h-4 w-4 mr-2" /> Search Other Charges
        </Button>
      </div>

      {/* Main Information Grid */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Bill Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label>Customer</Label>
              <Input value={customer} onChange={(e) => setCustomer(e.target.value)} />
            </div>
            <div>
              <Label>Customer Department</Label>
              <Input value={customerDept} onChange={(e) => setCustomerDept(e.target.value)} />
            </div>
            <div>
              <Label>Bill Date</Label>
              <div className="flex gap-2">
                <Input type="date" value={billDate} onChange={(e) => setBillDate(e.target.value)} />
                <Button variant="outline" onClick={handlePrint}>
                  <Printer className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <Label>Billing Branch</Label>
              <Input value={billingBranch} onChange={(e) => setBillingBranch(e.target.value)} />
            </div>
            <div>
              <Label>Collection At</Label>
              <div className="flex gap-2">
                <Input value={collectionAt} onChange={(e) => setCollectionAt(e.target.value)} />
                <Button variant="outline" onClick={handleUpdateCollectionAt}>
                  <RefreshCw className="h-4 w-4" /> Update
                </Button>
              </div>
            </div>
            <div>
              <Label>Debit To</Label>
              <Input value={debitTo} onChange={(e) => setDebitTo(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Details */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Financial Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <Label>Package</Label>
              <Input type="number" value={packageQty} onChange={(e) => setPackageQty(Number(e.target.value))} />
            </div>
            <div>
              <Label>Weight</Label>
              <Input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} />
            </div>
            <div>
              <Label>Freight</Label>
              <Input type="number" value={freight} onChange={(e) => setFreight(Number(e.target.value))} />
            </div>
            <div>
              <Label>Other Charges</Label>
              <Input type="number" value={otherCharges} onChange={(e) => setOtherCharges(Number(e.target.value))} />
            </div>
            <div>
              <Label>GST</Label>
              <Input type="number" value={gst} onChange={(e) => setGst(Number(e.target.value))} />
            </div>
            <div>
              <Label>GST Type</Label>
              <Input value={gstType} onChange={(e) => setGstType(e.target.value)} />
            </div>
            <div>
              <Label>Bill Total</Label>
              <Input type="number" value={billTotal} readOnly className="bg-muted" />
            </div>
            <div>
              <Label>Total Received Amount</Label>
              <Input type="number" value={totalReceived} onChange={(e) => setTotalReceived(Number(e.target.value))} />
            </div>
            <div>
              <Label>Balance</Label>
              <Input type="number" value={balance} readOnly className="bg-muted text-red-600 font-semibold" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Voucher & Meta Info */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label>Voucher #</Label>
              <Input value={voucherNo} onChange={(e) => setVoucherNo(e.target.value)} />
            </div>
            <div>
              <Label>Bill Created On</Label>
              <Input value={billCreatedOn} onChange={(e) => setBillCreatedOn(e.target.value)} />
            </div>
            <div>
              <Label>Bill Created By</Label>
              <Input value={billCreatedBy} onChange={(e) => setBillCreatedBy(e.target.value)} />
            </div>
            <div>
              <Label>Bill Edited By</Label>
              <Input value={billEditedBy} onChange={(e) => setBillEditedBy(e.target.value)} />
            </div>
            <div>
              <Label>Bill Edited On</Label>
              <Input value={billEditedOn} onChange={(e) => setBillEditedOn(e.target.value)} />
            </div>
            <div>
              <Label>Bill Submission Date</Label>
              <Input type="date" value={billSubmissionDate} onChange={(e) => setBillSubmissionDate(e.target.value)} />
            </div>
            <div>
              <Label>Submitted By</Label>
              <Input value={submittedBy} onChange={(e) => setSubmittedBy(e.target.value)} />
            </div>
            <div>
              <Label>Division</Label>
              <Input value={division} onChange={(e) => setDivision(e.target.value)} />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={handleShowCosting}>
              <Eye className="h-4 w-4 mr-2" /> Show Costing
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tables Section using Tabs */}
      <Tabs defaultValue="payment" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="payment">Payment Details</TabsTrigger>
          <TabsTrigger value="gr">GR Details</TabsTrigger>
        </TabsList>

        {/* Payment Details Table */}
        <TabsContent value="payment" className="mt-4">
          <Card>
            <CardContent className="overflow-x-auto p-0 sm:p-4">
              <div className="min-w-[800px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>S#</TableHead>
                      <TableHead>MR #</TableHead>
                      <TableHead>MR Date</TableHead>
                      <TableHead>CR Note #</TableHead>
                      <TableHead>Recd Amount</TableHead>
                      <TableHead>Rebate</TableHead>
                      <TableHead>Excess</TableHead>
                      <TableHead>TDS Amount</TableHead>
                      <TableHead>TDS CGST</TableHead>
                      <TableHead>TDS SGST</TableHead>
                      <TableHead>TDS IGST</TableHead>
                      <TableHead>Claim</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentDetails.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.sNo}</TableCell>
                        <TableCell>{item.mrNo}</TableCell>
                        <TableCell>{item.mrDate}</TableCell>
                        <TableCell>{item.crNoteNo}</TableCell>
                        <TableCell className="text-right">{item.recdAmount.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{item.rebate.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{item.excess.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{item.tdsAmount.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{item.tdsCGST.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{item.tdsSGST.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{item.tdsIGST.toLocaleString()}</TableCell>
                        <TableCell>{item.claim}</TableCell>
                      </TableRow>
                    ))}
                    {paymentDetails.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={12} className="text-center">
                          No payment details found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* GR Details Table */}
        <TabsContent value="gr" className="mt-4">
          <Card>
            <CardContent className="overflow-x-auto p-0 sm:p-4">
              <div className="min-w-[1000px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>S#</TableHead>
                      <TableHead>GR #</TableHead>
                      <TableHead>Booking Date</TableHead>
                      <TableHead>DR #</TableHead>
                      <TableHead>DR Date</TableHead>
                      <TableHead>Origin</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Pckgs</TableHead>
                      <TableHead>Weight</TableHead>
                      <TableHead>Freight</TableHead>
                      <TableHead>O. Amount</TableHead>
                      <TableHead>CGST</TableHead>
                      <TableHead>SGST</TableHead>
                      <TableHead>IGST</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Options</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {grDetails.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.sNo}</TableCell>
                        <TableCell>{item.grNo}</TableCell>
                        <TableCell>{item.bookingDate}</TableCell>
                        <TableCell>{item.drNo}</TableCell>
                        <TableCell>{item.drDate}</TableCell>
                        <TableCell>{item.origin}</TableCell>
                        <TableCell>{item.destination}</TableCell>
                        <TableCell>{item.packages}</TableCell>
                        <TableCell>{item.weight}</TableCell>
                        <TableCell className="text-right">{item.freight.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{item.oAmount.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{item.cgst.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{item.sgst.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{item.igst.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{item.totalAmount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => alert(`View details for ${item.grNo}`)}>
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {grDetails.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={16} className="text-center">
                          No GR details found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}