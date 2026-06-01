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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { CalendarIcon, Search, Eye, RefreshCw,Users,Building, MapPin,DollarSign, Clock, CheckCircle, XCircle, FileText, CreditCard, Truck, Package, Image, AlertCircle, Table as TableIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ManifestDetail {
  id: number;
  manifestNo: string;
  manifestDate: string;
  manifestType: string;
  from: string;
  to: string;
  arrivalNo: string;
  arrivalDateTime: string;
  arrivalAt: string;
  pckgs: number;
  actualWeight: number;
  chargeWeight: number;
  receivedPckgs: number;
  totalFreight: number;
  actualLoadingPoint: string;
  actualDeliveryPoint: string;
  arrivalRemarks: string;
}

interface Charge {
  id: number;
  charges: string;
  amount: number;
}

interface BalancePayableAt {
  id: number;
  balancePayableAt: string;
  payableAmount: number;
  paidAmount: number;
  pending: number;
}

interface PaymentDetail {
  id: number;
  adviceNo: string;
  paymentDate: string;
  paymentType: string;
  branch: string;
  mode: string;
  incentivePaid: number;
  detentionPaid: number;
  penalty: number;
  damageRecoverable: number;
  paidAmount: number;
  voucherNo: string;
  hoPaymentVoucherNo: string;
  paidToInformation: string;
}

interface GRDetail {
  id: number;
  grNo: string;
  bookingDate: string;
  origin: string;
  destination: string;
  manifestNo: string;
  manifestDate: string;
  content: string;
  bookedPckgs: number;
  despatchedPckgs: number;
  actualWeight: number;
  chargeWeight: number;
  basicFreight: number;
  totalFreight: number;
  receivedPckgs: number;
  damagePckgs: number;
  loadType: string;
}

interface AdditionalCharge {
  id: number;
  voucherNo: string;
  voucherDate: string;
  charges: string;
  amount: number;
}

interface ViewDocument {
  id: number;
  lhcNo: string;
  documentName: string;
  documentImage: string;
}

export default function LHCEnquiry() {
  // Form state
  const [lhcNo, setLhcNo] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<string>("");
  const [voucherNo, setVoucherNo] = useState<string>("");
  const [branch, setBranch] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [tripId, setTripId] = useState<string>("");
  const [pan, setPan] = useState<string>("");
  const [division, setDivision] = useState<string>("");
  const [bidId, setBidId] = useState<string>("");
  const [notForPayment, setNotForPayment] = useState<boolean>(false);
  
  // LHC Details
  const [vehicleNo, setVehicleNo] = useState<string>("");
  const [engineNo, setEngineNo] = useState<string>("");
  const [chasisNo, setChasisNo] = useState<string>("");
  const [owner, setOwner] = useState<string>("");
  const [ownerAddress, setOwnerAddress] = useState<string>("");
  const [ownerMobileNo, setOwnerMobileNo] = useState<string>("");
  const [totalPckgs, setTotalPckgs] = useState<number>(0);
  const [actualWeight, setActualWeight] = useState<number>(0);
  const [weightLoss, setWeightLoss] = useState<number>(0);
  const [dharamKantaWeight, setDharamKantaWeight] = useState<number>(0);
  const [cWeight, setCWeight] = useState<number>(0);
  const [accountType, setAccountType] = useState<string>("");
  const [ownerBankName, setOwnerBankName] = useState<string>("");
  const [ownerAccountNo, setOwnerAccountNo] = useState<string>("");
  const [ownerIfsc, setOwnerIfsc] = useState<string>("");
  
  // Driver Details
  const [driver, setDriver] = useState<string>("");
  const [driverMobileNo, setDriverMobileNo] = useState<string>("");
  const [licenseNo, setLicenseNo] = useState<string>("");
  const [licenseValidUpto, setLicenseValidUpto] = useState<Date>();
  
  // Vendor Details
  const [vendor, setVendor] = useState<string>("");
  const [vendorMobileNo, setVendorMobileNo] = useState<string>("");
  const [paidTo, setPaidTo] = useState<string>("");
  
  // Amount Details
  const [lhcAmount, setLhcAmount] = useState<number>(0);
  const [additionalPayable, setAdditionalPayable] = useState<number>(0);
  const [lessTds, setLessTds] = useState<number>(0);
  const [netAmount, setNetAmount] = useState<number>(0);
  const [advance, setAdvance] = useState<number>(0);
  const [tsExp, setTsExp] = useState<number>(0);
  const [paid, setPaid] = useState<number>(0);
  const [pending, setPending] = useState<number>(0);
  const [balancePayable, setBalancePayable] = useState<number>(0);
  const [damageRecoverable, setDamageRecoverable] = useState<number>(0);
  const [penalty, setPenalty] = useState<number>(0);
  
  // Arrival Summary
  const [arrivalDate, setArrivalDate] = useState<Date>();
  const [arrivalMobNo, setArrivalMobNo] = useState<string>("");
  const [estdArrivalDate, setEstdArrivalDate] = useState<Date>();
  
  // Tab state
  const [activeTab, setActiveTab] = useState<string>("manifest");
  
  // Table data
  const [manifestDetails, setManifestDetails] = useState<ManifestDetail[]>([
    { id: 1, manifestNo: "M001", manifestDate: "22-04-2026", manifestType: "Local", from: "DELHI", to: "MUMBAI", arrivalNo: "AR001", arrivalDateTime: "22-04-2026 10:30", arrivalAt: "MUMBAI GODOWN", pckgs: 50, actualWeight: 2500, chargeWeight: 2600, receivedPckgs: 50, totalFreight: 15000, actualLoadingPoint: "DELHI WAREHOUSE", actualDeliveryPoint: "MUMBAI GODOWN", arrivalRemarks: "All OK" }
  ]);
  
  const [charges, setCharges] = useState<Charge[]>([
    { id: 1, charges: "Freight Charges", amount: 15000 },
    { id: 2, charges: "Loading Charges", amount: 500 },
    { id: 3, charges: "Unloading Charges", amount: 500 }
  ]);
  
  const [balancePayableAt, setBalancePayableAt] = useState<BalancePayableAt[]>([
    { id: 1, balancePayableAt: "MUMBAI", payableAmount: 15000, paidAmount: 5000, pending: 10000 }
  ]);
  
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetail[]>([
    { id: 1, adviceNo: "ADV001", paymentDate: "22-04-2026", paymentType: "Online", branch: "MUMBAI", mode: "NEFT", incentivePaid: 0, detentionPaid: 0, penalty: 0, damageRecoverable: 0, paidAmount: 5000, voucherNo: "V001", hoPaymentVoucherNo: "HOV001", paidToInformation: "Owner Account" }
  ]);
  
  const [grDetails, setGrDetails] = useState<GRDetail[]>([
    { id: 1, grNo: "GR001", bookingDate: "20-04-2026", origin: "DELHI", destination: "MUMBAI", manifestNo: "M001", manifestDate: "22-04-2026", content: "Electronics", bookedPckgs: 50, despatchedPckgs: 50, actualWeight: 2500, chargeWeight: 2600, basicFreight: 14000, totalFreight: 15000, receivedPckgs: 50, damagePckgs: 0, loadType: "FTL" }
  ]);
  
  const [additionalCharges, setAdditionalCharges] = useState<AdditionalCharge[]>([
    { id: 1, voucherNo: "VC001", voucherDate: "22-04-2026", charges: "Hamali Charges", amount: 200 }
  ]);
  
  const [viewDocuments, setViewDocuments] = useState<ViewDocument[]>([
    { id: 1, lhcNo: "LHC001", documentName: "Lorry Receipt", documentImage: "lr_image.jpg" }
  ]);

  const handleShowDetail = () => {
    if (!lhcNo) {
      alert("Please enter LHC Number");
      return;
    }
    alert(`Showing details for LHC #: ${lhcNo}`);
  };

  const handleClear = () => {
    setLhcNo("");
    setDate(new Date());
    setTime("");
    setVoucherNo("");
    setBranch("");
    setTo("");
    setTripId("");
    setPan("");
    setDivision("");
    setBidId("");
    setNotForPayment(false);
    setVehicleNo("");
    setEngineNo("");
    setChasisNo("");
    setOwner("");
    setOwnerAddress("");
    setOwnerMobileNo("");
    setTotalPckgs(0);
    setActualWeight(0);
    setWeightLoss(0);
    setDharamKantaWeight(0);
    setCWeight(0);
    setAccountType("");
    setOwnerBankName("");
    setOwnerAccountNo("");
    setOwnerIfsc("");
    setDriver("");
    setDriverMobileNo("");
    setLicenseNo("");
    setLicenseValidUpto(undefined);
    setVendor("");
    setVendorMobileNo("");
    setPaidTo("");
    setLhcAmount(0);
    setAdditionalPayable(0);
    setLessTds(0);
    setNetAmount(0);
    setAdvance(0);
    setTsExp(0);
    setPaid(0);
    setPending(0);
    setBalancePayable(0);
    setDamageRecoverable(0);
    setPenalty(0);
    setArrivalDate(undefined);
    setArrivalMobNo("");
    setEstdArrivalDate(undefined);
  };

  const handleUpdateConcentStatus = () => {
    alert("Concent status updated successfully!");
  };

  const handleResetLHCWeight = () => {
    setTotalPckgs(0);
    setActualWeight(0);
    setWeightLoss(0);
    setDharamKantaWeight(0);
    setCWeight(0);
    alert("LHC weight reset successfully!");
  };

  // Reusable Card Header Component
  const CardHeader = ({ icon: Icon, title, count }: { icon: any; title: string; count?: number }) => (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-gray-500" />
        <h3 className="text-[11px] font-semibold text-gray-800">{title}</h3>
      </div>
      {count !== undefined && (
        <div className="text-[10px] text-gray-500">
          Total: {count} records
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4 p-3 md:p-4 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-wrap justify-between items-start gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-600" />
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">LHC ENQUIRY</h1>
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

      {/* Main Form */}
      <div className="space-y-4">
        {/* Row 1 - LHC # and Buttons */}
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[200px]">
            <Label className="text-xs font-medium">
              LHC # <span className="text-red-500">*</span>
            </Label>
            <Input
              value={lhcNo}
              onChange={(e) => setLhcNo(e.target.value)}
              placeholder="Enter LHC Number"
              className="h-8 text-xs"
            />
          </div>
          <Button onClick={handleShowDetail} size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700">
            <Search className="mr-1 h-3.5 w-3.5" />
            SHOW DETAIL
          </Button>
          <Button onClick={handleClear} variant="outline" size="sm" className="h-8 text-xs">
            <RefreshCw className="mr-1 h-3.5 w-3.5" />
            CLEAR
          </Button>
          <Button onClick={handleUpdateConcentStatus} variant="secondary" size="sm" className="h-8 text-xs">
            <CheckCircle className="mr-1 h-3.5 w-3.5" />
            UPDATE CONCENT STATUS
          </Button>
        </div>

        {/* Row 2 - Date, Time, Voucher #, Branch, To */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="space-y-1">
            <Label className="text-xs font-medium">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-8 w-full justify-start text-left text-xs">
                  <CalendarIcon className="mr-2 h-3 w-3" />
                  {date ? format(date, "dd-MM-yyyy") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-medium">Time</Label>
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="h-8 text-xs" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-medium">Voucher #</Label>
            <Input value={voucherNo} onChange={(e) => setVoucherNo(e.target.value)} className="h-8 text-xs" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-medium">Branch</Label>
            <Input value={branch} onChange={(e) => setBranch(e.target.value)} className="h-8 text-xs" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-medium">To</Label>
            <Input value={to} onChange={(e) => setTo(e.target.value)} className="h-8 text-xs" />
          </div>
        </div>

        {/* Row 3 - Trip ID, PAN, Division, BID ID, Not For Payment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="space-y-1">
            <Label className="text-xs font-medium">Trip ID</Label>
            <Input value={tripId} onChange={(e) => setTripId(e.target.value)} className="h-8 text-xs" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-medium">PAN</Label>
            <Input value={pan} onChange={(e) => setPan(e.target.value)} className="h-8 text-xs" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-medium">Division</Label>
            <Input value={division} onChange={(e) => setDivision(e.target.value)} className="h-8 text-xs" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-medium">BID ID</Label>
            <Input value={bidId} onChange={(e) => setBidId(e.target.value)} className="h-8 text-xs" />
          </div>
          <div className="flex items-end">
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={notForPayment} onChange={(e) => setNotForPayment(e.target.checked)} className="h-3.5 w-3.5" />
              <Label className="text-xs cursor-pointer">Not For Payment</Label>
            </div>
          </div>
        </div>

        {/* LHC Details Section */}
        <div className="border rounded-md bg-white">
          <div className="bg-gray-50 px-3 py-2 border-b">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Truck className="h-3.5 w-3.5 text-gray-500" />
                <h3 className="text-[11px] font-semibold text-gray-800">LHC Details</h3>
              </div>
            </div>
          </div>
          <div className="p-3 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1"><Label className="text-xs">Vehicle #</Label><Input value={vehicleNo} onChange={(e) => setVehicleNo(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Engine #</Label><Input value={engineNo} onChange={(e) => setEngineNo(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Chasis #</Label><Input value={chasisNo} onChange={(e) => setChasisNo(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Owner</Label><Input value={owner} onChange={(e) => setOwner(e.target.value)} className="h-8 text-xs" /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1"><Label className="text-xs">Address</Label><Input value={ownerAddress} onChange={(e) => setOwnerAddress(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Mobile No</Label><Input value={ownerMobileNo} onChange={(e) => setOwnerMobileNo(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Total Pckgs</Label><Input type="number" value={totalPckgs} onChange={(e) => setTotalPckgs(Number(e.target.value))} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Actual Weight</Label><Input type="number" value={actualWeight} onChange={(e) => setActualWeight(Number(e.target.value))} className="h-8 text-xs" /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1"><Label className="text-xs">Weight Loss</Label><Input type="number" value={weightLoss} onChange={(e) => setWeightLoss(Number(e.target.value))} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Dharam Kanta Weight</Label><Input type="number" value={dharamKantaWeight} onChange={(e) => setDharamKantaWeight(Number(e.target.value))} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">C Weight</Label><Input type="number" value={cWeight} onChange={(e) => setCWeight(Number(e.target.value))} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Account Type</Label><Select value={accountType} onValueChange={setAccountType}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent><SelectItem value="Savings">Savings</SelectItem><SelectItem value="Current">Current</SelectItem></SelectContent></Select></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1"><Label className="text-xs">Owner Bank Name</Label><Input value={ownerBankName} onChange={(e) => setOwnerBankName(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Owner Account #</Label><Input value={ownerAccountNo} onChange={(e) => setOwnerAccountNo(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Owner IFSC</Label><Input value={ownerIfsc} onChange={(e) => setOwnerIfsc(e.target.value)} className="h-8 text-xs" /></div>
            </div>
          </div>
        </div>

        {/* Driver Details Section */}
        <div className="border rounded-md bg-white">
          <div className="bg-gray-50 px-3 py-2 border-b">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Users className="h-3.5 w-3.5 text-gray-500" />
                <h3 className="text-[11px] font-semibold text-gray-800">Driver Details</h3>
              </div>
            </div>
          </div>
          <div className="p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1"><Label className="text-xs">Driver</Label><Input value={driver} onChange={(e) => setDriver(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Mobile #</Label><Input value={driverMobileNo} onChange={(e) => setDriverMobileNo(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Liscense No</Label><Input value={licenseNo} onChange={(e) => setLicenseNo(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Valid Upto</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full justify-start text-left text-xs"><CalendarIcon className="mr-2 h-3 w-3" />{licenseValidUpto ? format(licenseValidUpto, "dd-MM-yyyy") : "Select date"}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><CalendarComponent mode="single" selected={licenseValidUpto} onSelect={setLicenseValidUpto} initialFocus /></PopoverContent></Popover></div>
          </div>
        </div>

        {/* Vendor Details Section */}
        <div className="border rounded-md bg-white">
          <div className="bg-gray-50 px-3 py-2 border-b">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Building className="h-3.5 w-3.5 text-gray-500" />
                <h3 className="text-[11px] font-semibold text-gray-800">Vendor Details</h3>
              </div>
            </div>
          </div>
          <div className="p-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1"><Label className="text-xs">Vendor</Label><Input value={vendor} onChange={(e) => setVendor(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Mobile No</Label><Input value={vendorMobileNo} onChange={(e) => setVendorMobileNo(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Paid To</Label><Input value={paidTo} onChange={(e) => setPaidTo(e.target.value)} className="h-8 text-xs" /></div>
          </div>
        </div>

        {/* Advance, Balance and Damage Recoverable Section */}
        <div className="border rounded-md bg-white">
          <div className="bg-gray-50 px-3 py-2 border-b">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <DollarSign className="h-3.5 w-3.5 text-gray-500" />
                <h3 className="text-[11px] font-semibold text-gray-800">Advance, Balance and Damage Recoverable</h3>
              </div>
            </div>
          </div>
          <div className="p-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="space-y-1"><Label className="text-xs">LHC Amount</Label><Input type="number" value={lhcAmount} onChange={(e) => setLhcAmount(Number(e.target.value))} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Additional Payable</Label><Input type="number" value={additionalPayable} onChange={(e) => setAdditionalPayable(Number(e.target.value))} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Less TDS @ 0.00</Label><Input type="number" value={lessTds} onChange={(e) => setLessTds(Number(e.target.value))} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Net Amount</Label><Input type="number" value={netAmount} onChange={(e) => setNetAmount(Number(e.target.value))} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Advance</Label><Input type="number" value={advance} onChange={(e) => setAdvance(Number(e.target.value))} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">TS Exp</Label><Input type="number" value={tsExp} onChange={(e) => setTsExp(Number(e.target.value))} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Paid</Label><Input type="number" value={paid} onChange={(e) => setPaid(Number(e.target.value))} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Pending</Label><Input type="number" value={pending} onChange={(e) => setPending(Number(e.target.value))} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Balance Payable</Label><Input type="number" value={balancePayable} onChange={(e) => setBalancePayable(Number(e.target.value))} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Damage Recoverable</Label><Input type="number" value={damageRecoverable} onChange={(e) => setDamageRecoverable(Number(e.target.value))} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Penalty</Label><Input type="number" value={penalty} onChange={(e) => setPenalty(Number(e.target.value))} className="h-8 text-xs" /></div>
          </div>
        </div>

        {/* Arrival Summary Section */}
        <div className="border rounded-md bg-white">
          <div className="bg-gray-50 px-3 py-2 border-b">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-gray-500" />
                <h3 className="text-[11px] font-semibold text-gray-800">Arrival Summary</h3>
              </div>
            </div>
          </div>
          <div className="p-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1"><Label className="text-xs">Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full justify-start text-left text-xs"><CalendarIcon className="mr-2 h-3 w-3" />{arrivalDate ? format(arrivalDate, "dd-MM-yyyy") : "Select date"}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><CalendarComponent mode="single" selected={arrivalDate} onSelect={setArrivalDate} initialFocus /></PopoverContent></Popover></div>
            <div className="space-y-1"><Label className="text-xs">Mob. No.</Label><Input value={arrivalMobNo} onChange={(e) => setArrivalMobNo(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Estd Arrival Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full justify-start text-left text-xs"><CalendarIcon className="mr-2 h-3 w-3" />{estdArrivalDate ? format(estdArrivalDate, "dd-MM-yyyy") : "Select date"}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><CalendarComponent mode="single" selected={estdArrivalDate} onSelect={setEstdArrivalDate} initialFocus /></PopoverContent></Popover></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" size="sm" className="h-8 text-xs">PAYMENT APPROVER DETAILS</Button>
          <Button onClick={handleResetLHCWeight} variant="destructive" size="sm" className="h-8 text-xs">RESET LHC WEIGHT</Button>
        </div>

        {/* Tabs Section */}
        <div className="border rounded-md bg-white">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="flex flex-wrap h-auto p-1 bg-gray-50">
              <TabsTrigger value="manifest" className="text-[11px]">Manifest Details</TabsTrigger>
              <TabsTrigger value="charges" className="text-[11px]">Charges</TabsTrigger>
              <TabsTrigger value="balance" className="text-[11px]">Balance Payable At</TabsTrigger>
              <TabsTrigger value="payment" className="text-[11px]">Payment Details</TabsTrigger>
              <TabsTrigger value="gr" className="text-[11px]">GR Details</TabsTrigger>
              <TabsTrigger value="additional" className="text-[11px]">Additional Charges</TabsTrigger>
              <TabsTrigger value="document" className="text-[11px]">View Document Image</TabsTrigger>
            </TabsList>

            {/* Manifest Details Tab */}
            <TabsContent value="manifest" className="p-3">
              <div className="rounded-md border overflow-x-auto">
                <Table className="text-xs">
                  <TableHeader><TableRow className="bg-gray-50"><TableHead className="text-[11px]">#</TableHead><TableHead className="text-[11px]">Manifest #</TableHead><TableHead className="text-[11px]">Date</TableHead><TableHead className="text-[11px]">Type</TableHead><TableHead className="text-[11px]">From</TableHead><TableHead className="text-[11px]">To</TableHead><TableHead className="text-[11px]">Pckgs</TableHead><TableHead className="text-[11px]">Freight</TableHead></TableRow></TableHeader>
                  <TableBody>{manifestDetails.map((item, idx) => (<TableRow key={item.id}><TableCell>{idx+1}</TableCell><TableCell>{item.manifestNo}</TableCell><TableCell>{item.manifestDate}</TableCell><TableCell>{item.manifestType}</TableCell><TableCell>{item.from}</TableCell><TableCell>{item.to}</TableCell><TableCell>{item.pckgs}</TableCell><TableCell>₹{item.totalFreight}</TableCell></TableRow>))}</TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Charges Tab */}
            <TabsContent value="charges" className="p-3">
              <div className="rounded-md border overflow-x-auto">
                <Table className="text-xs">
                  <TableHeader><TableRow className="bg-gray-50"><TableHead className="text-[11px]">#</TableHead><TableHead className="text-[11px]">Charges</TableHead><TableHead className="text-[11px]">Amount</TableHead></TableRow></TableHeader>
                  <TableBody>{charges.map((item, idx) => (<TableRow key={item.id}><TableCell>{idx+1}</TableCell><TableCell>{item.charges}</TableCell><TableCell>₹{item.amount.toLocaleString()}</TableCell></TableRow>))}</TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Balance Payable At Tab */}
            <TabsContent value="balance" className="p-3">
              <div className="rounded-md border overflow-x-auto">
                <Table className="text-xs">
                  <TableHeader><TableRow className="bg-gray-50"><TableHead className="text-[11px]">#</TableHead><TableHead className="text-[11px]">Branch</TableHead><TableHead className="text-[11px]">Payable</TableHead><TableHead className="text-[11px]">Paid</TableHead><TableHead className="text-[11px]">Pending</TableHead></TableRow></TableHeader>
                  <TableBody>{balancePayableAt.map((item, idx) => (<TableRow key={item.id}><TableCell>{idx+1}</TableCell><TableCell>{item.balancePayableAt}</TableCell><TableCell>₹{item.payableAmount}</TableCell><TableCell>₹{item.paidAmount}</TableCell><TableCell>₹{item.pending}</TableCell></TableRow>))}</TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Payment Details Tab */}
            <TabsContent value="payment" className="p-3">
              <div className="rounded-md border overflow-x-auto">
                <Table className="text-xs">
                  <TableHeader><TableRow className="bg-gray-50"><TableHead className="text-[11px]">#</TableHead><TableHead className="text-[11px]">Advice #</TableHead><TableHead className="text-[11px]">Date</TableHead><TableHead className="text-[11px]">Amount</TableHead><TableHead className="text-[11px]">Voucher #</TableHead></TableRow></TableHeader>
                  <TableBody>{paymentDetails.map((item, idx) => (<TableRow key={item.id}><TableCell>{idx+1}</TableCell><TableCell>{item.adviceNo}</TableCell><TableCell>{item.paymentDate}</TableCell><TableCell>₹{item.paidAmount}</TableCell><TableCell>{item.voucherNo}</TableCell></TableRow>))}</TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* GR Details Tab */}
            <TabsContent value="gr" className="p-3">
              <div className="rounded-md border overflow-x-auto">
                <Table className="text-xs">
                  <TableHeader><TableRow className="bg-gray-50"><TableHead className="text-[11px]">#</TableHead><TableHead className="text-[11px]">GR #</TableHead><TableHead className="text-[11px]">Origin</TableHead><TableHead className="text-[11px]">Destination</TableHead><TableHead className="text-[11px]">Pckgs</TableHead><TableHead className="text-[11px]">Freight</TableHead></TableRow></TableHeader>
                  <TableBody>{grDetails.map((item, idx) => (<TableRow key={item.id}><TableCell>{idx+1}</TableCell><TableCell>{item.grNo}</TableCell><TableCell>{item.origin}</TableCell><TableCell>{item.destination}</TableCell><TableCell>{item.bookedPckgs}</TableCell><TableCell>₹{item.totalFreight}</TableCell></TableRow>))}</TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Additional Charges Tab */}
            <TabsContent value="additional" className="p-3">
              <div className="rounded-md border overflow-x-auto">
                <Table className="text-xs">
                  <TableHeader><TableRow className="bg-gray-50"><TableHead className="text-[11px]">#</TableHead><TableHead className="text-[11px]">Voucher #</TableHead><TableHead className="text-[11px]">Charges</TableHead><TableHead className="text-[11px]">Amount</TableHead></TableRow></TableHeader>
                  <TableBody>{additionalCharges.map((item, idx) => (<TableRow key={item.id}><TableCell>{idx+1}</TableCell><TableCell>{item.voucherNo}</TableCell><TableCell>{item.charges}</TableCell><TableCell>₹{item.amount}</TableCell></TableRow>))}</TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* View Document Image Tab */}
            <TabsContent value="document" className="p-3">
              <div className="rounded-md border overflow-x-auto">
                <Table className="text-xs">
                  <TableHeader><TableRow className="bg-gray-50"><TableHead className="text-[11px]">#</TableHead><TableHead className="text-[11px]">LHC #</TableHead><TableHead className="text-[11px]">Document Name</TableHead><TableHead className="text-[11px]">Action</TableHead></TableRow></TableHeader>
                  <TableBody>{viewDocuments.map((item, idx) => (<TableRow key={item.id}><TableCell>{idx+1}</TableCell><TableCell>{item.lhcNo}</TableCell><TableCell>{item.documentName}</TableCell><TableCell><Button variant="ghost" size="sm" className="h-7 text-blue-500 text-[11px]"><Eye className="h-3 w-3" /> View</Button></TableCell></TableRow>))}</TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}