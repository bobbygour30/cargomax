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
  DialogFooter,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Send, X, Download, Mail, Eye, Grid3x3, FileText, Printer } from "lucide-react";

export default function LedgerReportNew() {
  // Date state
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());

  // Checkbox states
  const [branchTypeAll, setBranchTypeAll] = useState(true);
  const [ledgerAll, setLedgerAll] = useState(true);

  // Filter states
  const [zone, setZone] = useState("");
  const [state, setState] = useState("");
  const [region, setRegion] = useState("");
  const [hub, setHub] = useState("");
  const [branch, setBranch] = useState("");
  const [agency, setAgency] = useState("");
  const [selectedLedger, setSelectedLedger] = useState("");

  // Email modal state (only UI, no functionality)
  const [mailModalOpen, setMailModalOpen] = useState(false);
  const [mailTo, setMailTo] = useState("");
  const [mailSubject, setMailSubject] = useState("Ledger Report");
  const [mailBody, setMailBody] = useState(
    "Dear Sir/Madam,\n\nPlease find attached the Ledger Report.\n\nRegards,\nFinance Team"
  );

  // All buttons are static with no functionality - just UI placeholders
  const handleClose = () => {
    // Static button - no functionality
  };

  const handleGridView = () => {
    // Static button - no functionality
  };

  const handleSendReport = () => {
    // Static button - no functionality
  };

  const handleDownload = () => {
    // Static button - no functionality
  };

  const handleSendMail = () => {
    // Static button - no functionality
    setMailModalOpen(false);
  };

  const handleDiscardMail = () => {
    setMailModalOpen(false);
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-primary">LEDGER REPORT (NEW)</h1>
        <div className="text-xs text-muted-foreground mt-1">
          Company : GOLDEN ROADWAYS &amp; LOGISTICS PVT LTD | Login By : ADMIN@GMAIL.COM
          <br />
          Login Branch : CORPORATE OFFICE | Financial Year : 2026-2027
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Criteria</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Period */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>From Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(fromDate, "dd-MM-yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={fromDate} onSelect={(d) => d && setFromDate(d)} />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>To Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(toDate, "dd-MM-yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={toDate} onSelect={(d) => d && setToDate(d)} />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Select Branch Type */}
          <div>
            <Label className="text-base font-medium">Select Branch Type</Label>
            <div className="flex items-center gap-3 mt-2">
              <Checkbox 
                checked={branchTypeAll} 
                onCheckedChange={(checked) => setBranchTypeAll(!!checked)} 
              />
              <Label>ALL</Label>
            </div>
          </div>

          {/* Zone, State, Region, Hub, Branch, Agency */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label>Zone</Label>
              <Select value={zone} onValueChange={setZone}>
                <SelectTrigger><SelectValue placeholder="Select Zone" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="NORTH">NORTH ZONE</SelectItem>
                  <SelectItem value="SOUTH">SOUTH ZONE</SelectItem>
                  <SelectItem value="EAST">EAST ZONE</SelectItem>
                  <SelectItem value="WEST">WEST ZONE</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>State</Label>
              <Select value={state} onValueChange={setState}>
                <SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="DELHI">DELHI</SelectItem>
                  <SelectItem value="UTTAR PRADESH">UTTAR PRADESH</SelectItem>
                  <SelectItem value="MAHARASHTRA">MAHARASHTRA</SelectItem>
                  <SelectItem value="GUJARAT">GUJARAT</SelectItem>
                  <SelectItem value="RAJASTHAN">RAJASTHAN</SelectItem>
                  <SelectItem value="PUNJAB">PUNJAB</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Region</Label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger><SelectValue placeholder="Select Region" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="NORTH">NORTH</SelectItem>
                  <SelectItem value="SOUTH">SOUTH</SelectItem>
                  <SelectItem value="EAST">EAST</SelectItem>
                  <SelectItem value="WEST">WEST</SelectItem>
                  <SelectItem value="CENTRAL">CENTRAL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Hub</Label>
              <Select value={hub} onValueChange={setHub}>
                <SelectTrigger><SelectValue placeholder="Select Hub" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="DELHI HUB">DELHI HUB</SelectItem>
                  <SelectItem value="MUMBAI HUB">MUMBAI HUB</SelectItem>
                  <SelectItem value="BANGALORE HUB">BANGALORE HUB</SelectItem>
                  <SelectItem value="KOLKATA HUB">KOLKATA HUB</SelectItem>
                  <SelectItem value="CHENNAI HUB">CHENNAI HUB</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Branch</Label>
              <Select value={branch} onValueChange={setBranch}>
                <SelectTrigger><SelectValue placeholder="Select Branch" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="DELHI">DELHI</SelectItem>
                  <SelectItem value="MUMBAI">MUMBAI</SelectItem>
                  <SelectItem value="BANGALORE">BANGALORE</SelectItem>
                  <SelectItem value="CHENNAI">CHENNAI</SelectItem>
                  <SelectItem value="KOLKATA">KOLKATA</SelectItem>
                  <SelectItem value="PUNE">PUNE</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Agency</Label>
              <Select value={agency} onValueChange={setAgency}>
                <SelectTrigger><SelectValue placeholder="Select Agency" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="AGENCY1">AGENCY A</SelectItem>
                  <SelectItem value="AGENCY2">AGENCY B</SelectItem>
                  <SelectItem value="AGENCY3">AGENCY C</SelectItem>
                  <SelectItem value="AGENCY4">AGENCY D</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Select Ledger */}
          <div>
            <Label className="text-base font-medium">Select Ledger</Label>
            <div className="flex items-center gap-3 mt-2">
              <Checkbox 
                checked={ledgerAll} 
                onCheckedChange={(checked) => setLedgerAll(!!checked)} 
              />
              <Label>ALL</Label>
            </div>

            {!ledgerAll && (
              <div className="mt-3">
                <Select value={selectedLedger} onValueChange={setSelectedLedger}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Specific Ledger" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CASH LEDGER">Cash Ledger</SelectItem>
                    <SelectItem value="BANK LEDGER">Bank Ledger</SelectItem>
                    <SelectItem value="SALES LEDGER">Sales Ledger</SelectItem>
                    <SelectItem value="PURCHASE LEDGER">Purchase Ledger</SelectItem>
                    <SelectItem value="EXPENSE LEDGER">Expense Ledger</SelectItem>
                    <SelectItem value="ASSET LEDGER">Asset Ledger</SelectItem>
                    <SelectItem value="LIABILITY LEDGER">Liability Ledger</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Action Buttons - Static / No Functionality */}
          <div className="flex flex-wrap gap-3 pt-6 border-t">
            <Button variant="outline" onClick={handleClose}>
              <X className="mr-2 h-4 w-4" /> Close
            </Button>
            <Button onClick={handleGridView} className="bg-blue-600 hover:bg-blue-700">
              <Grid3x3 className="mr-2 h-4 w-4" /> Grid View
            </Button>
            <Button onClick={() => setMailModalOpen(true)} className="bg-green-600 hover:bg-green-700">
              <Mail className="mr-2 h-4 w-4" /> Send Report at Attachment
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Grid View Section - Static Display */}
      <Card>
        <CardHeader className="bg-gray-50">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Ledger Report Grid View
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left font-semibold border-b">Date</th>
                <th className="p-3 text-left font-semibold border-b">Voucher No.</th>
                <th className="p-3 text-left font-semibold border-b">Narration / Particulars</th>
                <th className="p-3 text-right font-semibold border-b">Debit (₹)</th>
                <th className="p-3 text-right font-semibold border-b">Credit (₹)</th>
                <th className="p-3 text-right font-semibold border-b">Balance (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3">01-05-2026</td>
                <td className="p-3">JV-001</td>
                <td className="p-3">Opening Balance</td>
                <td className="p-3 text-right">0.00</td>
                <td className="p-3 text-right">0.00</td>
                <td className="p-3 text-right font-medium">50,000.00</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3">02-05-2026</td>
                <td className="p-3">PV-101</td>
                <td className="p-3">Purchase - Office Supplies</td>
                <td className="p-3 text-right">15,000.00</td>
                <td className="p-3 text-right">0.00</td>
                <td className="p-3 text-right font-medium">65,000.00</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3">05-05-2026</td>
                <td className="p-3">RV-202</td>
                <td className="p-3">Sales Revenue</td>
                <td className="p-3 text-right">0.00</td>
                <td className="p-3 text-right">25,000.00</td>
                <td className="p-3 text-right font-medium">40,000.00</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3">07-05-2026</td>
                <td className="p-3">PV-102</td>
                <td className="p-3">Rent Payment</td>
                <td className="p-3 text-right">12,000.00</td>
                <td className="p-3 text-right">0.00</td>
                <td className="p-3 text-right font-medium">52,000.00</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3">10-05-2026</td>
                <td className="p-3">RV-203</td>
                <td className="p-3">Consultation Fees</td>
                <td className="p-3 text-right">0.00</td>
                <td className="p-3 text-right">10,000.00</td>
                <td className="p-3 text-right font-medium">42,000.00</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3">12-05-2026</td>
                <td className="p-3">PV-103</td>
                <td className="p-3">Electricity Bill</td>
                <td className="p-3 text-right">3,500.00</td>
                <td className="p-3 text-right">0.00</td>
                <td className="p-3 text-right font-medium">45,500.00</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3">15-05-2026</td>
                <td className="p-3">JV-002</td>
                <td className="p-3">Depreciation Adjustment</td>
                <td className="p-3 text-right">2,000.00</td>
                <td className="p-3 text-right">0.00</td>
                <td className="p-3 text-right font-medium">47,500.00</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3">18-05-2026</td>
                <td className="p-3">RV-204</td>
                <td className="p-3">Client Payment Received</td>
                <td className="p-3 text-right">0.00</td>
                <td className="p-3 text-right">18,000.00</td>
                <td className="p-3 text-right font-medium">29,500.00</td>
              </tr>
              <tr className="bg-gray-100 font-semibold">
                <td colSpan={3} className="p-3 text-right">TOTAL / CLOSING BALANCE</td>
                <td className="p-3 text-right">32,500.00</td>
                <td className="p-3 text-right">53,000.00</td>
                <td className="p-3 text-right text-blue-600">29,500.00</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Email Modal - Static / No Functionality */}
      <Dialog open={mailModalOpen} onOpenChange={setMailModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Report as Attachment</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Email To <span className="text-red-500">*</span></Label>
              <Input
                type="email"
                placeholder="example@company.com"
                value={mailTo}
                onChange={(e) => setMailTo(e.target.value)}
              />
            </div>

            <div>
              <Label>Subject</Label>
              <Input value={mailSubject} onChange={(e) => setMailSubject(e.target.value)} />
            </div>

            <div>
              <Label>Body</Label>
              <textarea
                className="w-full min-h-[100px] p-3 border rounded-md resize-none"
                value={mailBody}
                onChange={(e) => setMailBody(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleDiscardMail}>
              <X className="mr-2 h-4 w-4" /> Discard
            </Button>
            <Button onClick={handleSendMail} className="bg-green-600 hover:bg-green-700">
              <Send className="mr-2 h-4 w-4" /> Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}