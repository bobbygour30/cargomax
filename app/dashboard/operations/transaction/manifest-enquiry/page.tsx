"use client";

import React, { useState, useEffect } from "react";
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
  Eye,
  Send,
  Info,
  Truck,
  Package,
  MapPin,
  User,
  Phone,
  Building,
  Clock,
  FileText,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";

// Types
interface GRDetail {
  id: number;
  branch: string;
  grNo: string;
  origin: string;
  destination: string;
  bookedPckgs: number;
  dispatchPckgs: number;
  rcvdPckgs: number;
  shortExcess: number;
  dispatchWeight: number;
  consignorName: string;
  consigneeName: string;
  cngrGST: string;
  cngeGST: string;
  eWayBillNo: string;
}

interface MRDetail {
  id: number;
  mrNo: string;
  mrDate: Date;
  receivedAmount: number;
  rebate: number;
  paymentMode: string;
  chequeNo: string;
  chequeDate: Date;
  remarks: string;
  reverStatus: string;
  voucherNo: string;
  voucherStatus: string;
  tds: number;
}

// Options
const manifestTypeOptions = ["OUTSTATION", "LOCAL", "INCOMING", "LONG ROUTE"];
const branchOptions = ["CORPORATE OFFICE", "DELHI", "MUMBAI", "BANGALORE", "CHENNAI", "KOLKATA"];
const modeTypeOptions = ["Surface", "Air", "Rail", "Sea"];
const modeNameOptions = ["DL01LA0837", "DL01LAD6175", "DL01LAJ4226", "DL01LAQ0859"];
const driverOptions = ["Rajesh Kumar", "Suresh Singh", "Mahesh Sharma", "Ramesh Gupta"];
const statusOptions = ["Active", "In Transit", "Arrived", "Delivered", "Cancelled"];

// Sample Data
const sampleGRDetails: GRDetail[] = [
  { id: 1, branch: "DELHI", grNo: "GR001", origin: "DELHI", destination: "MUMBAI", bookedPckgs: 50, dispatchPckgs: 50, rcvdPckgs: 48, shortExcess: -2, dispatchWeight: 2500, consignorName: "M/s ABC Traders", consigneeName: "M/s XYZ Enterprises", cngrGST: "07ABCDE1234F1Z5", cngeGST: "09FGHIJ5678K1Z6", eWayBillNo: "EWB001" },
  { id: 2, branch: "DELHI", grNo: "GR002", origin: "DELHI", destination: "BANGALORE", bookedPckgs: 30, dispatchPckgs: 30, rcvdPckgs: 30, shortExcess: 0, dispatchWeight: 1800, consignorName: "M/s PQR Ltd", consigneeName: "M/s LMN Corp", cngrGST: "07ABCDE1234F1Z5", cngeGST: "09FGHIJ5678K1Z6", eWayBillNo: "EWB002" },
  { id: 3, branch: "MUMBAI", grNo: "GR003", origin: "MUMBAI", destination: "CHENNAI", bookedPckgs: 40, dispatchPckgs: 40, rcvdPckgs: 40, shortExcess: 0, dispatchWeight: 2200, consignorName: "M/s DEF Industries", consigneeName: "M/s GHI Group", cngrGST: "07ABCDE1234F1Z5", cngeGST: "09FGHIJ5678K1Z6", eWayBillNo: "EWB003" },
];

const sampleMRDetails: MRDetail[] = [
  { id: 1, mrNo: "MR001", mrDate: new Date(), receivedAmount: 15000, rebate: 500, paymentMode: "Cheque", chequeNo: "CHQ001", chequeDate: new Date(), remarks: "Payment received", reverStatus: "Completed", voucherNo: "V001", voucherStatus: "Approved", tds: 1500 },
  { id: 2, mrNo: "MR002", mrDate: new Date(), receivedAmount: 10000, rebate: 0, paymentMode: "Cash", chequeNo: "", chequeDate: new Date(), remarks: "Partial payment", reverStatus: "Pending", voucherNo: "V002", voucherStatus: "Pending", tds: 1000 },
];

export default function ManifestEnquiry() {
  const [activeTab, setActiveTab] = useState<"gr" | "mr">("gr");
  const [loading, setLoading] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [pickupManifest, setPickupManifest] = useState<boolean>(false);

  // Form State
  const [manifestType, setManifestType] = useState<string>("OUTSTATION");
  const [manifestNo, setManifestNo] = useState<string>("");
  const [branch, setBranch] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [manifestDate, setManifestDate] = useState<Date>(new Date());
  const [consolidatedEWayBillNo, setConsolidatedEWayBillNo] = useState<string>("");
  const [arrivedOn, setArrivedOn] = useState<Date>(new Date());
  const [arrivalNo, setArrivalNo] = useState<string>("");
  const [modeType, setModeType] = useState<string>("");
  const [modeName, setModeName] = useState<string>("");
  const [driverName, setDriverName] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [loadedBy, setLoadedBy] = useState<string>("");
  const [freightMemoNo, setFreightMemoNo] = useState<string>("");
  const [freightDate, setFreightDate] = useState<Date>(new Date());
  const [totalFreightAmount, setTotalFreightAmount] = useState<number>(0);
  const [division, setDivision] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [unloadedBy, setUnloadedBy] = useState<string>("");
  const [arrivalStatus, setArrivalStatus] = useState<string>("");

  // Table Data
  const [grDetails] = useState<GRDetail[]>(sampleGRDetails);
  const [mrDetails] = useState<MRDetail[]>(sampleMRDetails);

  const handleShowDetails = () => {
    if (!manifestNo) {
      alert("Please enter Manifest #");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setBranch("DELHI");
      setTo("MUMBAI");
      setManifestDate(new Date());
      setConsolidatedEWayBillNo("EWB001");
      setArrivedOn(new Date());
      setArrivalNo("AR001");
      setModeType("Surface");
      setModeName("DL01LA0837");
      setDriverName("Rajesh Kumar");
      setMobile("9876543210");
      setLoadedBy("Mohan Singh");
      setFreightMemoNo("FM001");
      setFreightDate(new Date());
      setTotalFreightAmount(25000);
      setDivision("North");
      setStatus("Arrived");
      setUnloadedBy("Ravi Kumar");
      setArrivalStatus("Completed");
      setShowResults(true);
      setLoading(false);
      alert(`Manifest ${manifestNo} details loaded successfully!`);
    }, 500);
  };

  const handleClear = () => {
    setManifestNo("");
    setShowResults(false);
    setBranch("");
    setTo("");
    setConsolidatedEWayBillNo("");
    setArrivalNo("");
    setModeType("");
    setModeName("");
    setDriverName("");
    setMobile("");
    setLoadedBy("");
    setFreightMemoNo("");
    setTotalFreightAmount(0);
    setDivision("");
    setStatus("");
    setUnloadedBy("");
    setArrivalStatus("");
  };

  const handleSendSMS = () => {
    alert("SMS sent successfully!");
  };

  const handleRefreshEwaybills = () => {
    alert("E-Waybills refreshed successfully!");
  };

  const handlePickupManifestChange = () => {
    setPickupManifest(!pickupManifest);
    alert(`Pickup Manifest ${!pickupManifest ? "enabled" : "disabled"}`);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
      case "Approved":
        return <Badge className="bg-green-100 text-green-700 text-[10px]">{status}</Badge>;
      case "Pending":
        return <Badge className="bg-yellow-100 text-yellow-700 text-[10px]">{status}</Badge>;
      case "Arrived":
        return <Badge className="bg-blue-100 text-blue-700 text-[10px]">{status}</Badge>;
      case "Cancelled":
        return <Badge className="bg-red-100 text-red-700 text-[10px]">{status}</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px]">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4 p-3 md:p-4 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-wrap justify-between items-start gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-600" />
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">MANIFEST ENQUIRY</h1>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500">
              <span>🏢 Company: GOLDEN ROADWAYS & LOGISTICS PVT LTD</span>
              <span>👤 Login: MAYANK.GRLOGISTICS@GMAIL.COM</span>
              <span>📍 Branch: CORPORATE OFFICE</span>
              <span>📅 Financial Year: 2026-2027</span>
            </div>
          </div>
          <Button onClick={handleSendSMS} size="default" className="bg-green-600 hover:bg-green-700 shadow-md">
            <Send className="mr-2 h-4 w-4" />
            SEND SMS
          </Button>
        </div>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search Manifest
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-medium">Manifest Type</Label>
              <Select value={manifestType} onValueChange={setManifestType}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="SELECT" />
                </SelectTrigger>
                <SelectContent>
                  {manifestTypeOptions.map(opt => (
                    <SelectItem key={opt} value={opt} className="text-sm">{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium">Manifest # <span className="text-red-500">*</span></Label>
              <div className="flex gap-2">
                <Input
                  value={manifestNo}
                  onChange={(e) => setManifestNo(e.target.value)}
                  placeholder="Enter Manifest Number"
                  className="h-9 text-sm flex-1"
                />
                <Button onClick={handleShowDetails} size="default" className="h-9 bg-blue-600 hover:bg-blue-700" disabled={loading}>
                  <Eye className="mr-2 h-4 w-4" />
                  {loading ? "Loading..." : "Show Details"}
                </Button>
              </div>
            </div>
            <div className="flex items-end">
              <Button onClick={handleClear} variant="outline" className="h-9">
                <RefreshCw className="mr-2 h-4 w-4" />
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {showResults && (
        <>
          {/* Manifest Details Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Manifest Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-[10px] font-medium">Branch</Label>
                      <p className="text-sm font-semibold mt-1">{branch || "-"}</p>
                    </div>
                    <div>
                      <Label className="text-[10px] font-medium">To</Label>
                      <p className="text-sm font-semibold mt-1">{to || "-"}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-[10px] font-medium">Manifest Date</Label>
                      <p className="text-sm mt-1">{format(manifestDate, "dd-MM-yyyy")}</p>
                    </div>
                    <div>
                      <Label className="text-[10px] font-medium">Consolidated e-Way Bill</Label>
                      <p className="text-sm font-mono mt-1">{consolidatedEWayBillNo || "-"}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-[10px] font-medium">Arrived On</Label>
                      <p className="text-sm mt-1">{format(arrivedOn, "dd-MM-yyyy")}</p>
                    </div>
                    <div>
                      <Label className="text-[10px] font-medium">Arrival #</Label>
                      <p className="text-sm mt-1">{arrivalNo || "-"}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-[10px] font-medium">Mode Type</Label>
                      <p className="text-sm mt-1">{modeType || "-"}</p>
                    </div>
                    <div>
                      <Label className="text-[10px] font-medium">Mode Name</Label>
                      <p className="text-sm mt-1">{modeName || "-"}</p>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-[10px] font-medium">Driver Name</Label>
                      <p className="text-sm mt-1">{driverName || "-"}</p>
                    </div>
                    <div>
                      <Label className="text-[10px] font-medium">Mobile</Label>
                      <p className="text-sm mt-1">{mobile || "-"}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-[10px] font-medium">Loaded By</Label>
                      <p className="text-sm mt-1">{loadedBy || "-"}</p>
                    </div>
                    <div>
                      <Label className="text-[10px] font-medium">Freight Memo #</Label>
                      <p className="text-sm mt-1">{freightMemoNo || "-"}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-[10px] font-medium">Freight Date</Label>
                      <p className="text-sm mt-1">{format(freightDate, "dd-MM-yyyy")}</p>
                    </div>
                    <div>
                      <Label className="text-[10px] font-medium">Total Freight Amount</Label>
                      <p className="text-lg font-bold text-green-600 mt-1">₹{totalFreightAmount.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-[10px] font-medium">Division</Label>
                      <p className="text-sm mt-1">{division || "-"}</p>
                    </div>
                    <div>
                      <Label className="text-[10px] font-medium">Status</Label>
                      <div className="mt-1">{getStatusBadge(status)}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-[10px] font-medium">Unloaded By</Label>
                      <p className="text-sm mt-1">{unloadedBy || "-"}</p>
                    </div>
                    <div>
                      <Label className="text-[10px] font-medium">Arrival Status</Label>
                      <div className="mt-1">{getStatusBadge(arrivalStatus)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pickup Manifest and Refresh Ewaybills */}
          <div className="flex flex-wrap justify-between items-center">
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={pickupManifest} onChange={handlePickupManifestChange} className="h-4 w-4 rounded border-gray-300" id="pickupManifest" />
              <Label htmlFor="pickupManifest" className="text-sm cursor-pointer">Pickup Manifest</Label>
            </div>
            <Button onClick={handleRefreshEwaybills} variant="outline" size="sm" className="h-8 text-xs">
              <RefreshCw className="mr-1 h-3.5 w-3.5" />
              REFRESH E-WAYBILLS
            </Button>
          </div>

          {/* Tabs for GR Details and MR Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Transaction Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex border-b mb-4">
                <button
                  onClick={() => setActiveTab("gr")}
                  className={`px-4 py-2 text-sm font-medium transition-all ${activeTab === "mr"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  GR Details
                </button>
                <button
                  onClick={() => setActiveTab("mr")}
                  className={`px-4 py-2 text-sm font-medium transition-all ${activeTab === "mr"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  MR Details
                </button>
              </div>

              {/* GR Details Tab */}
              {activeTab === "gr" && (
                <div className="rounded-md border overflow-x-auto">
                  <div className="min-w-[1200px]">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="text-[11px] font-semibold py-2 px-2 w-12 text-center">#</TableHead>
                          <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[80px]">GR #</TableHead>
                          <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[80px]">Origin</TableHead>
                          <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[80px]">Destination</TableHead>
                          <TableHead className="text-[11px] font-semibold py-2 px-2 text-center w-[60px]">Pckgs</TableHead>
                          <TableHead className="text-[11px] font-semibold py-2 px-2 text-right w-[80px]">Weight</TableHead>
                          <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[150px]">Consignor</TableHead>
                          <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[150px]">Consignee</TableHead>
                          <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">e-Way Bill</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {grDetails.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                              <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
                              No GR details found
                            </TableCell>
                          </TableRow>
                        ) : (
                          grDetails.map((item, idx) => (
                            <TableRow key={item.id} className="hover:bg-gray-50">
                              <TableCell className="py-2 px-2 text-center text-xs">{idx + 1}</TableCell>
                              <TableCell className="py-2 px-2 font-mono text-xs">{item.grNo}</TableCell>
                              <TableCell className="py-2 px-2 text-xs">{item.origin}</TableCell>
                              <TableCell className="py-2 px-2 text-xs">{item.destination}</TableCell>
                              <TableCell className="py-2 px-2 text-center text-xs">{item.bookedPckgs}</TableCell>
                              <TableCell className="py-2 px-2 text-right text-xs">{item.dispatchWeight}</TableCell>
                              <TableCell className="py-2 px-2 text-xs truncate max-w-[150px]">{item.consignorName}</TableCell>
                              <TableCell className="py-2 px-2 text-xs truncate max-w-[150px]">{item.consigneeName}</TableCell>
                              <TableCell className="py-2 px-2 font-mono text-xs">{item.eWayBillNo}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              {/* MR Details Tab */}
              {activeTab === "mr" && (
                <div className="rounded-md border overflow-x-auto">
                  <div className="min-w-[1000px]">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="text-[11px] font-semibold py-2 px-2 w-12 text-center">#</TableHead>
                          <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[80px]">MR #</TableHead>
                          <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[80px]">MR Date</TableHead>
                          <TableHead className="text-[11px] font-semibold py-2 px-2 text-right w-[100px]">Amount</TableHead>
                          <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Payment Mode</TableHead>
                          <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[80px]">Voucher #</TableHead>
                          <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Status</TableHead>
                          <TableHead className="text-[11px] font-semibold py-2 px-2 text-right w-[80px]">TDS</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mrDetails.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                              <DollarSign className="h-12 w-12 mx-auto mb-3 opacity-30" />
                              No MR details found
                            </TableCell>
                          </TableRow>
                        ) : (
                          mrDetails.map((item, idx) => (
                            <TableRow key={item.id} className="hover:bg-gray-50">
                              <TableCell className="py-2 px-2 text-center text-xs">{idx + 1}</TableCell>
                              <TableCell className="py-2 px-2 font-mono text-xs">{item.mrNo}</TableCell>
                              <TableCell className="py-2 px-2 text-xs">{format(item.mrDate, "dd-MM-yyyy")}</TableCell>
                              <TableCell className="py-2 px-2 text-right text-xs">₹{item.receivedAmount.toLocaleString()}</TableCell>
                              <TableCell className="py-2 px-2 text-xs">{item.paymentMode}</TableCell>
                              <TableCell className="py-2 px-2 text-xs">{item.voucherNo}</TableCell>
                              <TableCell className="py-2 px-2 text-center">{getStatusBadge(item.voucherStatus)}</TableCell>
                              <TableCell className="py-2 px-2 text-right text-xs">₹{item.tds.toLocaleString()}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* No Results Message */}
      {!showResults && (
        <Card>
          <CardContent className="py-12 text-center">
            <Truck className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-500 text-sm">Enter Manifest # and click "Show Details" to view information</p>
          </CardContent>
        </Card>
      )}

      {/* Info Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
        <div className="flex items-start gap-2">
          <Info className="h-4 w-4 text-blue-600 mt-0.5" />
          <div className="text-xs text-blue-700">
            <p className="font-medium">Note:</p>
            <p>Click on "Show Details" button to load manifest information. GR and MR details will be displayed in the respective tabs.</p>
          </div>
        </div>
      </div>
    </div>
  );
}