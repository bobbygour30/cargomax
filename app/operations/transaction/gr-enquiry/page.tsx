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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  CalendarIcon,
  Search,
  RefreshCw,
  FileText,
  Eye,
  Upload,
  Send,
  FolderOpen,
  AlertCircle,
  DollarSign,
  FileSpreadsheet,
  Truck,
  Package,
  Building,
  Phone,
  Mail,
  Users,
  Clock,
  Download,
  Printer,
} from "lucide-react";
import { format } from "date-fns";

// Types
interface GRFreightDetail {
  id: number;
  particular: string;
  percentage: number;
  amount: number;
}

interface MovementRecord {
  id: number;
  date: Date;
  activity: string;
  location: string;
  remarks: string;
}

interface FreightMemoDetail {
  id: number;
  lhcNo: string;
  date: Date;
  totalPckgs: number;
  totalWt: number;
  chargeWt: number;
  amount: number;
  balance: number;
}

interface DeliveryDetail {
  id: number;
  drNo: string;
  date: Date;
  ddrNo: string;
  totalAmount: number;
  pckgs: number;
  receivedAmount: number;
  due: number;
  mrStatus: string;
}

interface BillDetail {
  id: number;
  billNo: string;
  date: Date;
  submissionDate: Date;
  submissionAmount: number;
  voucherNo: string;
  voucherStatus: string;
  receivedAmount: number;
  balance: number;
}

interface MRDetail {
  id: number;
  mrNo: string;
  date: Date;
  against: string;
  grNo: string;
  drNo: string;
  mode: string;
  received: number;
  tdsAmount: number;
  rebate: number;
  claim: number;
  voucherStatus: string;
}

interface DirectDetail {
  id: number;
  branch: string;
  voucherNo: string;
  date: Date;
  ledger: string;
  amount: number;
}

interface FollowUpRecord {
  id: number;
  date: Date;
  category: string;
  status: string;
  followUpRemarks: string;
  callerName: string;
  callerMobileNo: string;
}

interface ContactDetail {
  id: number;
  branchType: string;
  branchName: string;
  address: string;
  contact: string;
  mobileNo: string;
  emailId: string;
}

interface OtherDetail {
  id: number;
  refNo: string;
  packageType: string;
  contents: string;
  packing: string;
  cft: number;
}

interface InvoiceDetail {
  id: number;
  invoiceNo: string;
  date: Date;
  invoiceValue: number;
  eWaybillNo: string;
  eWaybillDate: Date;
}

interface ViewBookingImage {
  id: number;
  grNo: string;
  documentName: string;
}

// Radio options
const searchOptions = [
  { value: "gr_no", label: "GR #" },
  { value: "dr_no", label: "DR#" },
  { value: "ref_no", label: "Ref#" },
  { value: "awb_no", label: "AWB#" },
  { value: "job_no", label: "JOB#" },
  { value: "other", label: "Other" },
  { value: "gr_without_code", label: "GR # Without Code" },
  { value: "ewb_no", label: "EWB No." },
  { value: "invoice_no", label: "Invoice #" },
];

// Sample Data
const sampleFreightDetails: GRFreightDetail[] = [
  { id: 1, particular: "Freight Charges", percentage: 100, amount: 15000 },
  { id: 2, particular: "Loading Charges", percentage: 0, amount: 500 },
  { id: 3, particular: "Unloading Charges", percentage: 0, amount: 500 },
  { id: 4, particular: "Door Delivery Charges", percentage: 0, amount: 1000 },
  { id: 5, particular: "Other Charges", percentage: 0, amount: 200 },
];

const sampleMovementRecords: MovementRecord[] = [
  { id: 1, date: new Date("2026-05-28"), activity: "Booking Created", location: "DELHI", remarks: "GR created successfully" },
  { id: 2, date: new Date("2026-05-29"), activity: "Goods Dispatched", location: "DELHI", remarks: "Vehicle assigned" },
  { id: 3, date: new Date("2026-05-30"), activity: "In Transit", location: "Enroute", remarks: "Crossed border" },
  { id: 4, date: new Date("2026-05-31"), activity: "Arrived at Hub", location: "MUMBAI", remarks: "Vehicle arrived" },
];

const sampleFreightMemoDetails: FreightMemoDetail[] = [
  { id: 1, lhcNo: "LHC001", date: new Date("2026-05-28"), totalPckgs: 50, totalWt: 2500, chargeWt: 2600, amount: 15000, balance: 10000 },
];

const sampleDeliveryDetails: DeliveryDetail[] = [
  { id: 1, drNo: "DR001", date: new Date("2026-05-31"), ddrNo: "DDR001", totalAmount: 15000, pckgs: 50, receivedAmount: 10000, due: 5000, mrStatus: "Pending" },
];

const sampleBillDetails: BillDetail[] = [
  { id: 1, billNo: "B001", date: new Date("2026-05-28"), submissionDate: new Date("2026-05-30"), submissionAmount: 15000, voucherNo: "V001", voucherStatus: "Pending", receivedAmount: 10000, balance: 5000 },
];

const sampleMRDetails: MRDetail[] = [
  { id: 1, mrNo: "MR001", date: new Date("2026-05-31"), against: "GR", grNo: "GR001", drNo: "DR001", mode: "Cash", received: 10000, tdsAmount: 0, rebate: 0, claim: 0, voucherStatus: "Approved" },
];

const sampleDirectDetails: DirectDetail[] = [
  { id: 1, branch: "DELHI", voucherNo: "V001", date: new Date("2026-05-28"), ledger: "Freight Ledger", amount: 15000 },
];

const sampleFollowUpRecords: FollowUpRecord[] = [
  { id: 1, date: new Date("2026-05-30"), category: "Booking", status: "In Progress", followUpRemarks: "Awaiting delivery confirmation", callerName: "Rajesh Kumar", callerMobileNo: "9876543210" },
];

const sampleContactDetails: ContactDetail[] = [
  { id: 1, branchType: "Origin", branchName: "DELHI", address: "Transport Nagar, Delhi", contact: "Mr. Sharma", mobileNo: "9876543210", emailId: "delhi@example.com" },
  { id: 2, branchType: "Destination", branchName: "MUMBAI", address: "MIDC Area, Mumbai", contact: "Mr. Patil", mobileNo: "9876543220", emailId: "mumbai@example.com" },
];

const sampleOtherDetails: OtherDetail[] = [
  { id: 1, refNo: "REF001", packageType: "Carton", contents: "Electronics Items", packing: "Box", cft: 2.5 },
];

const sampleInvoiceDetails: InvoiceDetail[] = [
  { id: 1, invoiceNo: "INV001", date: new Date("2026-05-28"), invoiceValue: 15000, eWaybillNo: "EWB001", eWaybillDate: new Date("2026-05-28") },
];

const sampleViewBookingImages: ViewBookingImage[] = [
  { id: 1, grNo: "GR001", documentName: "Booking_Image_1.jpg" },
  { id: 2, grNo: "GR001", documentName: "Booking_Image_2.jpg" },
];

export default function GREnquiry() {
  const [activeTab, setActiveTab] = useState<string>("freight");
  const [selectedSearchOption, setSelectedSearchOption] = useState<string>("gr_no");
  const [searchValue, setSearchValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);

  // Form State
  const [bookingDateTime, setBookingDateTime] = useState<Date>(new Date());
  const [edd, setEdd] = useState<Date>(new Date());
  const [grType, setGrType] = useState<string>("FTL");
  const [referenceNo, setReferenceNo] = useState<string>("GR123456");
  const [product, setProduct] = useState<string>("Electronics");
  const [deliveryType, setDeliveryType] = useState<string>("Door Delivery");
  const [pvtMark, setPvtMark] = useState<string>("PM001");
  const [alertStatus, setAlertStatus] = useState<string>("Normal");
  const [accDivision, setAccDivision] = useState<string>("North");
  const [ccReceived, setCcReceived] = useState<boolean>(true);
  const [billStatus, setBillStatus] = useState<string>("Pending");
  const [ccAttached, setCcAttached] = useState<boolean>(false);
  const [claimAmount, setClaimAmount] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number>(10000);
  const [stockRemarks, setStockRemarks] = useState<string>("Goods in transit");
  const [sanctionAmount, setSanctionAmount] = useState<number>(0);
  const [daccBankBilty, setDaccBankBilty] = useState<string>("");
  const [appointmentDelivery, setAppointmentDelivery] = useState<string>("");
  const [origin, setOrigin] = useState<string>("DELHI");
  const [destination, setDestination] = useState<string>("MUMBAI");
  const [billedAt, setBilledAt] = useState<string>("DELHI");

  // Totals
  const [totalReceivable, setTotalReceivable] = useState<number>(17200);
  const [bookingRebate, setBookingRebate] = useState<number>(0);
  const [deliveryRebate, setDeliveryRebate] = useState<number>(0);
  const [tds, setTds] = useState<number>(0);
  const [claim, setClaim] = useState<number>(0);
  const [rateDiff, setRateDiff] = useState<number>(0);
  const [drGst, setDrGst] = useState<number>(0);
  const [received, setReceived] = useState<number>(10000);
  const [due, setDue] = useState<number>(7200);
  const [subtotal, setSubtotal] = useState<number>(17200);
  const [serviceTax, setServiceTax] = useState<number>(0);
  const [total, setTotal] = useState<number>(17200);
  const [advance, setAdvance] = useState<number>(5000);
  const [balance, setBalance] = useState<number>(12200);

  const handleSearch = () => {
    if (!searchValue) {
      alert("Please enter search value");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setShowResults(true);
      setLoading(false);
    }, 500);
  };

  const handleClear = () => {
    setSearchValue("");
    setShowResults(false);
  };

  const handleOpenCaseList = () => alert("Open case list");
  const handleAttachDocument = () => alert("Attach document");
  const handleGeneratePDF = () => alert("PDF generated");
  const handleSendMessage = () => alert("Send SMS/WhatsApp/Mail");
  const handleAction = () => alert("Action performed");
  const handleFollowUp = () => alert("Follow up initiated");
  const handleViewClaim = () => alert("View claim details");

  return (
    <div className="space-y-4 p-3 md:p-4 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-wrap justify-between items-start gap-3">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">GR ENQUIRY</h1>
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

      {/* Top Action Buttons */}
      <div className="flex flex-wrap justify-between items-center gap-2">
        <Button onClick={handleOpenCaseList} variant="outline" size="sm" className="h-8 text-xs">
          <FolderOpen className="mr-1 h-3.5 w-3.5" />
          Open Case List
        </Button>
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleAttachDocument} variant="outline" size="sm" className="h-8 text-xs">
            <Upload className="mr-1 h-3.5 w-3.5" />
            Attach Document
          </Button>
          <Button onClick={handleGeneratePDF} variant="outline" size="sm" className="h-8 text-xs">
            <Printer className="mr-1 h-3.5 w-3.5" />
            Print
          </Button>
          <Button onClick={handleSendMessage} variant="outline" size="sm" className="h-8 text-xs">
            <Send className="mr-1 h-3.5 w-3.5" />
            Send Message
          </Button>
        </div>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search GR
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search Radio Group */}
          <div className="flex flex-wrap gap-3 p-3 border rounded-md bg-gray-50 mb-4">
            {searchOptions.map((opt) => (
              <label key={opt.value} className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="searchOption"
                  value={opt.value}
                  checked={selectedSearchOption === opt.value}
                  onChange={(e) => setSelectedSearchOption(e.target.value)}
                  className="h-3.5 w-3.5"
                />
                <span className="text-xs">{opt.label}</span>
              </label>
            ))}
          </div>

          {/* Search Input */}
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Enter search value..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
            <Button onClick={handleSearch} size="default" className="h-9 bg-blue-600 hover:bg-blue-700" disabled={loading}>
              <Search className="mr-2 h-4 w-4" />
              {loading ? "Searching..." : "ENQUIRY"}
            </Button>
            <Button onClick={handleClear} variant="outline" className="h-9">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button onClick={handleAction} variant="secondary" className="h-9">
              ACTION
            </Button>
            <Button onClick={handleFollowUp} variant="secondary" className="h-9">
              FOLLOW UP
            </Button>
            <Button onClick={handleViewClaim} variant="secondary" className="h-9">
              VIEW CLAIM
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {showResults && (
        <>
          {/* Current Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Current Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-xs font-medium">GR Number</Label>
                  <p className="text-sm font-mono font-semibold mt-1">{searchValue}</p>
                </div>
                <div>
                  <Label className="text-xs font-medium">Status</Label>
                  <Badge className="mt-1 bg-green-100 text-green-700">In Transit</Badge>
                </div>
                <div>
                  <Label className="text-xs font-medium">Current Location</Label>
                  <p className="text-sm mt-1">Enroute to Destination</p>
                </div>
                <div>
                  <Label className="text-xs font-medium">EDD</Label>
                  <p className="text-sm mt-1">{format(edd, "dd-MM-yyyy")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Details Grid */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Booking Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">Booking Date & Time</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-7 w-full text-xs">
                        <CalendarIcon className="mr-1 h-3 w-3" />
                        {format(bookingDateTime, "dd-MM-yyyy HH:mm")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={bookingDateTime} onSelect={(d) => d && setBookingDateTime(d)} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">EDD</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-7 w-full text-xs">
                        <CalendarIcon className="mr-1 h-3 w-3" />
                        {format(edd, "dd-MM-yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={edd} onSelect={(d) => d && setEdd(d)} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">GR Type</Label>
                  <Select value={grType} onValueChange={setGrType}>
                    <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FTL">FTL</SelectItem>
                      <SelectItem value="LTL">LTL</SelectItem>
                      <SelectItem value="Container">Container</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">Reference #</Label>
                  <Input value={referenceNo} onChange={(e) => setReferenceNo(e.target.value)} className="h-7 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">Product</Label>
                  <Input value={product} onChange={(e) => setProduct(e.target.value)} className="h-7 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">Delivery Type</Label>
                  <Select value={deliveryType} onValueChange={setDeliveryType}>
                    <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Door Delivery">Door Delivery</SelectItem>
                      <SelectItem value="Pickup">Pickup</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">Pvt Mark</Label>
                  <Input value={pvtMark} onChange={(e) => setPvtMark(e.target.value)} className="h-7 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">Alert Status</Label>
                  <Select value={alertStatus} onValueChange={setAlertStatus}>
                    <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="Urgent">Urgent</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">ACC Division</Label>
                  <Select value={accDivision} onValueChange={setAccDivision}>
                    <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="North">North</SelectItem>
                      <SelectItem value="South">South</SelectItem>
                      <SelectItem value="East">East</SelectItem>
                      <SelectItem value="West">West</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={ccReceived} onChange={(e) => setCcReceived(e.target.checked)} className="h-3.5 w-3.5" id="ccReceived" />
                  <Label htmlFor="ccReceived" className="text-[10px] cursor-pointer">CC Received</Label>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">Bill Status</Label>
                  <Select value={billStatus} onValueChange={setBillStatus}>
                    <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Processed">Processed</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={ccAttached} onChange={(e) => setCcAttached(e.target.checked)} className="h-3.5 w-3.5" id="ccAttached" />
                  <Label htmlFor="ccAttached" className="text-[10px] cursor-pointer">CC Attached</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amount Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Amount Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">Claim Amount</Label>
                  <Input type="number" value={claimAmount} onChange={(e) => setClaimAmount(Number(e.target.value))} className="h-7 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">Paid Amount</Label>
                  <Input type="number" value={paidAmount} onChange={(e) => setPaidAmount(Number(e.target.value))} className="h-7 text-xs" />
                </div>
                <div className="col-span-2 space-y-1">
                  <Label className="text-[10px] font-medium">Stock Remarks</Label>
                  <Input value={stockRemarks} onChange={(e) => setStockRemarks(e.target.value)} className="h-7 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">Sanction Amount</Label>
                  <Input type="number" value={sanctionAmount} onChange={(e) => setSanctionAmount(Number(e.target.value))} className="h-7 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">DACC/Bank Bilty</Label>
                  <Input value={daccBankBilty} onChange={(e) => setDaccBankBilty(e.target.value)} className="h-7 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">Appointment Delivery</Label>
                  <Input value={appointmentDelivery} onChange={(e) => setAppointmentDelivery(e.target.value)} className="h-7 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">Origin</Label>
                  <Input value={origin} readOnly className="h-7 text-xs bg-gray-50" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">Destination</Label>
                  <Input value={destination} readOnly className="h-7 text-xs bg-gray-50" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-medium">Billed At</Label>
                  <Input value={billedAt} readOnly className="h-7 text-xs bg-gray-50" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Financial Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                <div className="bg-blue-50 p-2 rounded text-center"><p className="text-[10px]">Total Receivable</p><p className="text-sm font-bold">₹{totalReceivable.toLocaleString()}</p></div>
                <div className="bg-green-50 p-2 rounded text-center"><p className="text-[10px]">Received</p><p className="text-sm font-bold">₹{received.toLocaleString()}</p></div>
                <div className="bg-red-50 p-2 rounded text-center"><p className="text-[10px]">Due</p><p className="text-sm font-bold text-red-600">₹{due.toLocaleString()}</p></div>
                <div className="bg-yellow-50 p-2 rounded text-center"><p className="text-[10px]">Advance</p><p className="text-sm font-bold">₹{advance.toLocaleString()}</p></div>
                <div className="bg-purple-50 p-2 rounded text-center"><p className="text-[10px]">Balance</p><p className="text-sm font-bold">₹{balance.toLocaleString()}</p></div>
                <div className="bg-orange-50 p-2 rounded text-center"><p className="text-[10px]">TDS</p><p className="text-sm font-bold">₹{tds.toLocaleString()}</p></div>
                <div className="bg-pink-50 p-2 rounded text-center"><p className="text-[10px]">Claim</p><p className="text-sm font-bold">₹{claim.toLocaleString()}</p></div>
                <div className="bg-indigo-50 p-2 rounded text-center"><p className="text-[10px]">Rebate</p><p className="text-sm font-bold">₹{(bookingRebate + deliveryRebate).toLocaleString()}</p></div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Information Tabs */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Detailed Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="flex flex-wrap h-auto p-1 bg-gray-100 gap-1 mb-4">
                  <TabsTrigger value="freight" className="text-[10px] md:text-xs px-2 py-1">GR Freight</TabsTrigger>
                  <TabsTrigger value="movement" className="text-[10px] md:text-xs px-2 py-1">Movement</TabsTrigger>
                  <TabsTrigger value="freightMemo" className="text-[10px] md:text-xs px-2 py-1">Freight Memo</TabsTrigger>
                  <TabsTrigger value="delivery" className="text-[10px] md:text-xs px-2 py-1">Delivery</TabsTrigger>
                  <TabsTrigger value="bill" className="text-[10px] md:text-xs px-2 py-1">Bill</TabsTrigger>
                  <TabsTrigger value="mr" className="text-[10px] md:text-xs px-2 py-1">MR</TabsTrigger>
                  <TabsTrigger value="direct" className="text-[10px] md:text-xs px-2 py-1">Direct</TabsTrigger>
                  <TabsTrigger value="followup" className="text-[10px] md:text-xs px-2 py-1">Follow Up</TabsTrigger>
                  <TabsTrigger value="contact" className="text-[10px] md:text-xs px-2 py-1">Contact</TabsTrigger>
                  <TabsTrigger value="others" className="text-[10px] md:text-xs px-2 py-1">Others</TabsTrigger>
                  <TabsTrigger value="invoice" className="text-[10px] md:text-xs px-2 py-1">Invoice</TabsTrigger>
                  <TabsTrigger value="image" className="text-[10px] md:text-xs px-2 py-1">Images</TabsTrigger>
                </TabsList>

                {/* GR Freight Details Tab */}
                <TabsContent value="freight" className="mt-0">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="text-[11px] w-12">#</TableHead>
                          <TableHead className="text-[11px]">Particular</TableHead>
                          <TableHead className="text-[11px] w-16">%</TableHead>
                          <TableHead className="text-[11px] text-right w-24">Amount (₹)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sampleFreightDetails.map((item, idx) => (
                          <TableRow key={item.id}>
                            <TableCell className="text-xs">{idx+1}</TableCell>
                            <TableCell className="text-xs">{item.particular}</TableCell>
                            <TableCell className="text-xs">{item.percentage}%</TableCell>
                            <TableCell className="text-xs text-right">₹{item.amount.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="bg-gray-50 font-semibold">
                          <TableCell colSpan={3} className="text-xs">Total</TableCell>
                          <TableCell className="text-xs text-right">₹{sampleFreightDetails.reduce((s, i) => s + i.amount, 0).toLocaleString()}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                {/* Movement Tab */}
                <TabsContent value="movement" className="mt-0">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="text-[11px] w-12">#</TableHead>
                          <TableHead className="text-[11px] w-24">Date</TableHead>
                          <TableHead className="text-[11px]">Activity</TableHead>
                          <TableHead className="text-[11px]">Location</TableHead>
                          <TableHead className="text-[11px]">Remarks</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sampleMovementRecords.map((item, idx) => (
                          <TableRow key={item.id}>
                            <TableCell className="text-xs">{idx+1}</TableCell>
                            <TableCell className="text-xs">{format(item.date, "dd-MM-yyyy")}</TableCell>
                            <TableCell className="text-xs">{item.activity}</TableCell>
                            <TableCell className="text-xs">{item.location}</TableCell>
                            <TableCell className="text-xs">{item.remarks}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                {/* Freight Memo Tab */}
                <TabsContent value="freightMemo" className="mt-0">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="text-[11px] w-12">#</TableHead>
                          <TableHead className="text-[11px]">LHC #</TableHead>
                          <TableHead className="text-[11px] w-24">Date</TableHead>
                          <TableHead className="text-[11px] text-right">Pckgs</TableHead>
                          <TableHead className="text-[11px] text-right">Weight</TableHead>
                          <TableHead className="text-[11px] text-right">Charge Wt</TableHead>
                          <TableHead className="text-[11px] text-right">Amount</TableHead>
                          <TableHead className="text-[11px] text-right">Balance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sampleFreightMemoDetails.map((item, idx) => (
                          <TableRow key={item.id}>
                            <TableCell className="text-xs">{idx+1}</TableCell>
                            <TableCell className="text-xs">{item.lhcNo}</TableCell>
                            <TableCell className="text-xs">{format(item.date, "dd-MM-yyyy")}</TableCell>
                            <TableCell className="text-xs text-right">{item.totalPckgs}</TableCell>
                            <TableCell className="text-xs text-right">{item.totalWt}</TableCell>
                            <TableCell className="text-xs text-right">{item.chargeWt}</TableCell>
                            <TableCell className="text-xs text-right">₹{item.amount.toLocaleString()}</TableCell>
                            <TableCell className="text-xs text-right">₹{item.balance.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                {/* Delivery Tab */}
                <TabsContent value="delivery" className="mt-0">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="text-[11px] w-12">#</TableHead>
                          <TableHead className="text-[11px]">DR #</TableHead>
                          <TableHead className="text-[11px] w-24">Date</TableHead>
                          <TableHead className="text-[11px]">DDR #</TableHead>
                          <TableHead className="text-[11px] text-right">Pckgs</TableHead>
                          <TableHead className="text-[11px] text-right">Amount</TableHead>
                          <TableHead className="text-[11px] text-right">Received</TableHead>
                          <TableHead className="text-[11px] text-right">Due</TableHead>
                          <TableHead className="text-[11px]">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sampleDeliveryDetails.map((item, idx) => (
                          <TableRow key={item.id}>
                            <TableCell className="text-xs">{idx+1}</TableCell>
                            <TableCell className="text-xs">{item.drNo}</TableCell>
                            <TableCell className="text-xs">{format(item.date, "dd-MM-yyyy")}</TableCell>
                            <TableCell className="text-xs">{item.ddrNo}</TableCell>
                            <TableCell className="text-xs text-right">{item.pckgs}</TableCell>
                            <TableCell className="text-xs text-right">₹{item.totalAmount.toLocaleString()}</TableCell>
                            <TableCell className="text-xs text-right">₹{item.receivedAmount.toLocaleString()}</TableCell>
                            <TableCell className="text-xs text-right text-red-600">₹{item.due.toLocaleString()}</TableCell>
                            <TableCell><Badge className="bg-yellow-100 text-yellow-700 text-[10px]">{item.mrStatus}</Badge></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                {/* Bill Tab */}
                <TabsContent value="bill" className="mt-0">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="text-[11px] w-12">#</TableHead>
                          <TableHead className="text-[11px]">Bill #</TableHead>
                          <TableHead className="text-[11px] w-24">Date</TableHead>
                          <TableHead className="text-[11px] w-24">Submission Date</TableHead>
                          <TableHead className="text-[11px] text-right">Amount</TableHead>
                          <TableHead className="text-[11px]">Voucher #</TableHead>
                          <TableHead className="text-[11px] text-right">Received</TableHead>
                          <TableHead className="text-[11px] text-right">Balance</TableHead>
                          <TableHead className="text-[11px]">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sampleBillDetails.map((item, idx) => (
                          <TableRow key={item.id}>
                            <TableCell className="text-xs">{idx+1}</TableCell>
                            <TableCell className="text-xs">{item.billNo}</TableCell>
                            <TableCell className="text-xs">{format(item.date, "dd-MM-yyyy")}</TableCell>
                            <TableCell className="text-xs">{format(item.submissionDate, "dd-MM-yyyy")}</TableCell>
                            <TableCell className="text-xs text-right">₹{item.submissionAmount.toLocaleString()}</TableCell>
                            <TableCell className="text-xs">{item.voucherNo}</TableCell>
                            <TableCell className="text-xs text-right">₹{item.receivedAmount.toLocaleString()}</TableCell>
                            <TableCell className="text-xs text-right">₹{item.balance.toLocaleString()}</TableCell>
                            <TableCell><Badge className="bg-yellow-100 text-yellow-700 text-[10px]">{item.voucherStatus}</Badge></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                {/* MR Tab */}
                <TabsContent value="mr" className="mt-0">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="text-[11px] w-12">#</TableHead>
                          <TableHead className="text-[11px]">MR #</TableHead>
                          <TableHead className="text-[11px] w-24">Date</TableHead>
                          <TableHead className="text-[11px]">Against</TableHead>
                          <TableHead className="text-[11px]">GR #</TableHead>
                          <TableHead className="text-[11px]">DR #</TableHead>
                          <TableHead className="text-[11px]">Mode</TableHead>
                          <TableHead className="text-[11px] text-right">Received</TableHead>
                          <TableHead className="text-[11px] text-right">TDS</TableHead>
                          <TableHead className="text-[11px]">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sampleMRDetails.map((item, idx) => (
                          <TableRow key={item.id}>
                            <TableCell className="text-xs">{idx+1}</TableCell>
                            <TableCell className="text-xs">{item.mrNo}</TableCell>
                            <TableCell className="text-xs">{format(item.date, "dd-MM-yyyy")}</TableCell>
                            <TableCell className="text-xs">{item.against}</TableCell>
                            <TableCell className="text-xs">{item.grNo}</TableCell>
                            <TableCell className="text-xs">{item.drNo}</TableCell>
                            <TableCell className="text-xs">{item.mode}</TableCell>
                            <TableCell className="text-xs text-right">₹{item.received.toLocaleString()}</TableCell>
                            <TableCell className="text-xs text-right">₹{item.tdsAmount.toLocaleString()}</TableCell>
                            <TableCell><Badge className="bg-green-100 text-green-700 text-[10px]">{item.voucherStatus}</Badge></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                {/* Direct Tab */}
                <TabsContent value="direct" className="mt-0">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="text-[11px] w-12">#</TableHead>
                          <TableHead className="text-[11px]">Branch</TableHead>
                          <TableHead className="text-[11px]">Voucher #</TableHead>
                          <TableHead className="text-[11px] w-24">Date</TableHead>
                          <TableHead className="text-[11px]">Ledger</TableHead>
                          <TableHead className="text-[11px] text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sampleDirectDetails.map((item, idx) => (
                          <TableRow key={item.id}>
                            <TableCell className="text-xs">{idx+1}</TableCell>
                            <TableCell className="text-xs">{item.branch}</TableCell>
                            <TableCell className="text-xs">{item.voucherNo}</TableCell>
                            <TableCell className="text-xs">{format(item.date, "dd-MM-yyyy")}</TableCell>
                            <TableCell className="text-xs">{item.ledger}</TableCell>
                            <TableCell className="text-xs text-right">₹{item.amount.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                {/* Follow Up Tab */}
                <TabsContent value="followup" className="mt-0">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="text-[11px] w-12">#</TableHead>
                          <TableHead className="text-[11px] w-24">Date</TableHead>
                          <TableHead className="text-[11px]">Category</TableHead>
                          <TableHead className="text-[11px]">Status</TableHead>
                          <TableHead className="text-[11px]">Follow Up Remarks</TableHead>
                          <TableHead className="text-[11px]">Caller Name</TableHead>
                          <TableHead className="text-[11px]">Mobile No</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sampleFollowUpRecords.map((item, idx) => (
                          <TableRow key={item.id}>
                            <TableCell className="text-xs">{idx+1}</TableCell>
                            <TableCell className="text-xs">{format(item.date, "dd-MM-yyyy")}</TableCell>
                            <TableCell className="text-xs">{item.category}</TableCell>
                            <TableCell><Badge className="bg-blue-100 text-blue-700 text-[10px]">{item.status}</Badge></TableCell>
                            <TableCell className="text-xs">{item.followUpRemarks}</TableCell>
                            <TableCell className="text-xs">{item.callerName}</TableCell>
                            <TableCell className="text-xs">{item.callerMobileNo}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                {/* Contact Tab */}
                <TabsContent value="contact" className="mt-0">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="text-[11px] w-12">#</TableHead>
                          <TableHead className="text-[11px]">Branch Type</TableHead>
                          <TableHead className="text-[11px]">Branch Name</TableHead>
                          <TableHead className="text-[11px]">Address</TableHead>
                          <TableHead className="text-[11px]">Contact Person</TableHead>
                          <TableHead className="text-[11px]">Mobile</TableHead>
                          <TableHead className="text-[11px]">Email</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sampleContactDetails.map((item, idx) => (
                          <TableRow key={item.id}>
                            <TableCell className="text-xs">{idx+1}</TableCell>
                            <TableCell className="text-xs">{item.branchType}</TableCell>
                            <TableCell className="text-xs">{item.branchName}</TableCell>
                            <TableCell className="text-xs">{item.address}</TableCell>
                            <TableCell className="text-xs">{item.contact}</TableCell>
                            <TableCell className="text-xs">{item.mobileNo}</TableCell>
                            <TableCell className="text-xs">{item.emailId}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                {/* Others Tab */}
                <TabsContent value="others" className="mt-0">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="text-[11px] w-12">#</TableHead>
                          <TableHead className="text-[11px]">Ref #</TableHead>
                          <TableHead className="text-[11px]">Package Type</TableHead>
                          <TableHead className="text-[11px]">Contents</TableHead>
                          <TableHead className="text-[11px]">Packing</TableHead>
                          <TableHead className="text-[11px] text-right">CFT</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sampleOtherDetails.map((item, idx) => (
                          <TableRow key={item.id}>
                            <TableCell className="text-xs">{idx+1}</TableCell>
                            <TableCell className="text-xs">{item.refNo}</TableCell>
                            <TableCell className="text-xs">{item.packageType}</TableCell>
                            <TableCell className="text-xs">{item.contents}</TableCell>
                            <TableCell className="text-xs">{item.packing}</TableCell>
                            <TableCell className="text-xs text-right">{item.cft}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                {/* Invoice Tab */}
                <TabsContent value="invoice" className="mt-0">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="text-[11px] w-12">#</TableHead>
                          <TableHead className="text-[11px]">Invoice #</TableHead>
                          <TableHead className="text-[11px] w-24">Date</TableHead>
                          <TableHead className="text-[11px] text-right">Value</TableHead>
                          <TableHead className="text-[11px]">E-Waybill #</TableHead>
                          <TableHead className="text-[11px] w-24">E-Waybill Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sampleInvoiceDetails.map((item, idx) => (
                          <TableRow key={item.id}>
                            <TableCell className="text-xs">{idx+1}</TableCell>
                            <TableCell className="text-xs">{item.invoiceNo}</TableCell>
                            <TableCell className="text-xs">{format(item.date, "dd-MM-yyyy")}</TableCell>
                            <TableCell className="text-xs text-right">₹{item.invoiceValue.toLocaleString()}</TableCell>
                            <TableCell className="text-xs">{item.eWaybillNo}</TableCell>
                            <TableCell className="text-xs">{format(item.eWaybillDate, "dd-MM-yyyy")}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                {/* Images Tab */}
                <TabsContent value="image" className="mt-0">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="text-[11px] w-12">#</TableHead>
                          <TableHead className="text-[11px]">GR NO</TableHead>
                          <TableHead className="text-[11px]">Document Name</TableHead>
                          <TableHead className="text-[11px] w-24">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sampleViewBookingImages.map((item, idx) => (
                          <TableRow key={item.id}>
                            <TableCell className="text-xs">{idx+1}</TableCell>
                            <TableCell className="text-xs">{item.grNo}</TableCell>
                            <TableCell className="text-xs">{item.documentName}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" className="h-6 text-xs text-blue-500">
                                <Eye className="h-3 w-3 mr-1" />View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </>
      )}

      {/* No Results Message */}
      {!showResults && (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-500 text-sm">Enter search criteria and click ENQUIRY to view results</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}