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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, Save, RefreshCw, Trash2, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Customer {
  id: number;
  customerCode: string;
  customerName: string;
  tradeName: string;
  branch: string;
  controlledBy: string;
  customerType: string;
  status: string;
  pan: string;
  gstin: string;
  ledgerCode: string;
  accountGroup: string;
  createdOn: string;
}

export default function CustomerMaster() {
  const [activeTab, setActiveTab] = useState<"entry" | "search">("entry");

  const [customers, setCustomers] = useState<Customer[]>([
    { id: 1, customerCode: "CUST001", customerName: "ABC Logistics", tradeName: "ABC Logistics", branch: "DELHI", controlledBy: "CORPORATE OFFICE", customerType: "CONSIGNOR", status: "Active", pan: "AAAPL1234C", gstin: "29AAAPL1234C1Z5", ledgerCode: "LD001", accountGroup: "Sundry Debtors", createdOn: "10-05-2026" },
  ]);

  const [form, setForm] = useState({
    customerCode: "",
    active: true,
    topayTbbCredit: "BOTH",
    openDate: "",
    accountingGroup: "",
    defaultAs: "BOTH",
    customerName: "",
    tradeName: "",
    legalName: "",
    aliasName: "",
    address: "",
    aliasAddress: "",
    city: "",
    zipCode: "",
    state: "",
    country: "INDIA",
    tel: "",
    pan: "",
    gstin: "",
    gstRegistrationDate: "",
    contactPerson: "",
    designation: "",
    contactNo: "",
    email: "",
    controlledBy: "",
    branch: "",
    billingBranch: "",
    creditDays: "",
    creditLimit: "",
    companyType: "",
    billingCycle: "",
    // Add more fields as needed
  });

  const [editId, setEditId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const resetForm = () => {
    setForm({
      customerCode: "", active: true, topayTbbCredit: "BOTH", openDate: "", accountingGroup: "",
      defaultAs: "BOTH", customerName: "", tradeName: "", legalName: "", aliasName: "",
      address: "", aliasAddress: "", city: "", zipCode: "", state: "", country: "INDIA",
      tel: "", pan: "", gstin: "", gstRegistrationDate: "", contactPerson: "",
      designation: "", contactNo: "", email: "", controlledBy: "", branch: "",
      billingBranch: "", creditDays: "", creditLimit: "", companyType: "", billingCycle: "",
    });
    setEditId(null);
  };

  const handleSave = () => {
    if (!form.customerCode || !form.customerName) {
      alert("Customer Code and Customer Name are required!");
      return;
    }

    if (editId) {
      alert("Customer updated successfully.");
    } else {
      alert("Customer saved successfully.");
    }
    resetForm();
    setActiveTab("search");
  };

  const handleEdit = (cust: Customer) => {
    setEditId(cust.id);
    // In real app, you would load full data
    setActiveTab("entry");
  };

  const filteredCustomers = customers.filter(c =>
    c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.customerCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-xl font-bold text-primary">CUSTOMER MASTER</h1>
        <div className="text-xs text-muted-foreground mt-1">
          Company : GOLDEN ROADWAYS &amp; LOGISTICS PVT LTD | Login By : MAYANK.GRLOGISTICS@GMAIL.COM
          <br />
          Login Branch : CORPORATE OFFICE | Financial Year : 2026-2027
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex border-b">
        <button onClick={() => { setActiveTab("entry"); resetForm(); }} className={cn("px-6 py-2 font-medium", activeTab === "entry" ? "border-b-2 border-primary text-primary" : "text-muted-foreground")}>Entry</button>
        <button onClick={() => setActiveTab("search")} className={cn("px-6 py-2 font-medium", activeTab === "search" ? "border-b-2 border-primary text-primary" : "text-muted-foreground")}>Search</button>
      </div>

      {/* ===================== ENTRY TAB ===================== */}
      {activeTab === "entry" && (
        <Card>
          <CardHeader>
            <CardTitle>Customer Entry</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label>Customer Code <span className="text-red-500">*</span></Label>
                <Input value={form.customerCode} onChange={(e) => setForm({ ...form, customerCode: e.target.value.toUpperCase() })} placeholder="CUST001" />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Checkbox checked={form.active} onCheckedChange={(c) => setForm({ ...form, active: !!c })} />
                <Label>Active</Label>
              </div>
              <div>
                <Label>Topay/TBB Credit</Label>
                <Select value={form.topayTbbCredit} onValueChange={(v) => setForm({ ...form, topayTbbCredit: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TBB">TBB</SelectItem>
                    <SelectItem value="CREDIT">CREDIT</SelectItem>
                    <SelectItem value="TOPAY">TOPAY</SelectItem>
                    <SelectItem value="BOTH">BOTH</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Set Default As</Label>
                <Select value={form.defaultAs} onValueChange={(v) => setForm({ ...form, defaultAs: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CONSIGNOR">CONSIGNOR</SelectItem>
                    <SelectItem value="CONSIGNEE">CONSIGNEE</SelectItem>
                    <SelectItem value="BOTH">BOTH</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Name Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Customer Name <span className="text-red-500">*</span></Label>
                <Input value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
              </div>
              <div>
                <Label>Trade/Print Name</Label>
                <Input value={form.tradeName} onChange={(e) => setForm({ ...form, tradeName: e.target.value })} />
              </div>
              <div>
                <Label>Legal Name</Label>
                <Input value={form.legalName} onChange={(e) => setForm({ ...form, legalName: e.target.value })} />
              </div>
              <div>
                <Label>Alias/Display Name</Label>
                <Input value={form.aliasName} onChange={(e) => setForm({ ...form, aliasName: e.target.value })} />
              </div>
            </div>

            {/* Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Address <span className="text-red-500">*</span></Label>
                <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>
              <div>
                <Label>Alias Address</Label>
                <Input value={form.aliasAddress} onChange={(e) => setForm({ ...form, aliasAddress: e.target.value })} />
              </div>
              <div>
                <Label>City <span className="text-red-500">*</span></Label>
                <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </div>
              <div>
                <Label>State</Label>
                <Select value={form.state} onValueChange={(v) => setForm({ ...form, state: v })}>
                  <SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTTAR PRADESH">UTTAR PRADESH</SelectItem>
                    <SelectItem value="DELHI">DELHI</SelectItem>
                    <SelectItem value="MAHARASHTRA">MAHARASHTRA</SelectItem>
                    <SelectItem value="GUJARAT">GUJARAT</SelectItem>
                    <SelectItem value="RAJASTHAN">RAJASTHAN</SelectItem>
                    <SelectItem value="PUNJAB">PUNJAB</SelectItem>
                    {/* Add more as needed */}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* GST & Contact */}
            <Tabs defaultValue="gst" className="w-full">
              <TabsList>
                <TabsTrigger value="gst">GST Details</TabsTrigger>
                <TabsTrigger value="contact">Contact Info</TabsTrigger>
                <TabsTrigger value="billing">Billing Settings</TabsTrigger>
                <TabsTrigger value="other">Other Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="gst" className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div><Label>PAN</Label><Input value={form.pan} onChange={(e) => setForm({ ...form, pan: e.target.value })} /></div>
                <div><Label>GSTIN</Label><Input value={form.gstin} onChange={(e) => setForm({ ...form, gstin: e.target.value })} /></div>
                <div><Label>GST Registration Date</Label><Input type="date" value={form.gstRegistrationDate} onChange={(e) => setForm({ ...form, gstRegistrationDate: e.target.value })} /></div>
              </TabsContent>

              <TabsContent value="contact" className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div><Label>Contact Person</Label><Input value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} /></div>
                <div><Label>Email Id</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                <div><Label>Contact No</Label><Input value={form.contactNo} onChange={(e) => setForm({ ...form, contactNo: e.target.value })} /></div>
              </TabsContent>

              <TabsContent value="billing" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><Label>Controlled By</Label><Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="CORPORATE OFFICE">CORPORATE OFFICE</SelectItem></SelectContent></Select></div>
                  <div><Label>Branch</Label><Input value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })} /></div>
                  <div><Label>Credit Days</Label><Input type="number" value={form.creditDays} onChange={(e) => setForm({ ...form, creditDays: e.target.value })} /></div>
                </div>
              </TabsContent>

              <TabsContent value="other" className="mt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    "Disable Manual Rates In Booking", "Job Compulsory", "Dimension Compulsory",
                    "Document Compulsory In Booking", "POD Mandatory In Billing", "Web Enabled",
                    "Allow Web Login", "POD Image Compulsory", "Allow Multiple Invoice in Booking",
                    "Allow Live Tracking On Portal", "Round Off Weight Not Required"
                  ].map((label, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Checkbox />
                      <Label className="text-sm">{label}</Label>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end pt-6 border-t">
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <Save className="mr-2 h-4 w-4" /> SAVE
              </Button>
              <Button onClick={resetForm} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" /> CLEAR
              </Button>
              <Button variant="destructive" disabled={!editId}>
                <Trash2 className="mr-2 h-4 w-4" /> DELETE
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ===================== SEARCH TAB ===================== */}
      {activeTab === "search" && (
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-3 justify-between">
              <CardTitle>Customer List</CardTitle>
              <div className="flex gap-2">
                <div className="relative w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
                  <Input placeholder="Search Customer Name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
                </div>
                <Button>Search</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S#</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Customer Code</TableHead>
                  <TableHead>Branch Name</TableHead>
                  <TableHead>Controlled By</TableHead>
                  <TableHead>Customer Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>PAN</TableHead>
                  <TableHead>GST NO</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((cust, idx) => (
                  <TableRow key={cust.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell className="font-medium">{cust.customerName}</TableCell>
                    <TableCell>{cust.customerCode}</TableCell>
                    <TableCell>{cust.branch}</TableCell>
                    <TableCell>{cust.controlledBy}</TableCell>
                    <TableCell>{cust.customerType}</TableCell>
                    <TableCell className="text-green-600">Active</TableCell>
                    <TableCell>{cust.pan}</TableCell>
                    <TableCell>{cust.gstin}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(cust)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}