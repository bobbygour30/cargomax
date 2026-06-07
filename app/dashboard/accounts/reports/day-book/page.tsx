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
import { CalendarIcon, Send, X, Download, Mail, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DayBookReport() {
  const [fromDate, setFromDate] = useState<Date>(new Date(2026, 4, 18)); // 18-05-2026
  const [toDate, setToDate] = useState<Date>(new Date(2026, 4, 18));

  const [branchTypeAll, setBranchTypeAll] = useState(true);
  const [customerAll, setCustomerAll] = useState(true); // Not used but kept for consistency

  const [zone, setZone] = useState("");
  const [state, setState] = useState("");
  const [region, setRegion] = useState("");
  const [hub, setHub] = useState("");
  const [branch, setBranch] = useState("");
  const [agency, setAgency] = useState("");

  const [mailModalOpen, setMailModalOpen] = useState(false);
  const [mailTo, setMailTo] = useState("");
  const [mailSubject, setMailSubject] = useState("Day Book Report");
  const [mailBody, setMailBody] = useState("Dear Sir/Madam,\n\nPlease find attached the Day Book Report for the selected period.\n\nRegards,\nGolden Roadways");

  const handleGenerateReport = () => {
    alert("Day Book Report Generated Successfully in Grid View!");
  };

  const handleSendMail = () => {
    if (!mailTo.trim()) {
      alert("Please enter Mail To address");
      return;
    }
    alert(`Day Book Report sent successfully to: ${mailTo}`);
    setMailModalOpen(false);
    setMailTo("");
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-primary">DAY BOOK REPORT</h1>
        <div className="text-xs text-muted-foreground mt-1">
          Company : GOLDEN ROADWAYS &amp; LOGISTICS PVT LTD | Login By : MAYANK.GRLOGISTICS@GMAIL.COM
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

          {/* Branch Type */}
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

          {/* Filters */}
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
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Agency</Label>
              <Select value={agency} onValueChange={setAgency}>
                <SelectTrigger><SelectValue placeholder="Select Agency" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="AGENCY1">AGENCY1</SelectItem>
                  <SelectItem value="AGENCY2">AGENCY2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-6 border-t">
            <Button variant="outline">Close</Button>
            <Button onClick={handleGenerateReport} className="bg-blue-600 hover:bg-blue-700">
              <Eye className="mr-2 h-4 w-4" /> Grid View
            </Button>
            <Button onClick={() => setMailModalOpen(true)} className="bg-green-600 hover:bg-green-700">
              <Mail className="mr-2 h-4 w-4" /> Send Report as Attachment
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ===================== SEND EMAIL MODAL ===================== */}
      <Dialog open={mailModalOpen} onOpenChange={setMailModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Report as Attachment</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Mail To <span className="text-red-500">*</span></Label>
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
              <Label>Message</Label>
              <textarea
                className="w-full min-h-[100px] p-3 border rounded-md resize-y"
                value={mailBody}
                onChange={(e) => setMailBody(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setMailModalOpen(false)}>
              <X className="mr-2 h-4 w-4" /> Discard
            </Button>
            <Button onClick={handleSendMail} className="bg-green-600 hover:bg-green-700">
              <Send className="mr-2 h-4 w-4" /> Send Mail
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}