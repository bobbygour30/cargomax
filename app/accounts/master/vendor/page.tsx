"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { Pencil, Trash2, Save, RefreshCw, Search, Settings, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Vendor {
  id: string;
  vendorCode: string;
  active: boolean;
  openDate: string;
  groupName: string;
  accountingGroupCode: string;
  vendorName: string;
  printName: string;
  legalName: string;
  serviceType: string;
  address: string;
  aliasAddress: string;
  crNo: string;
  email: string;
  city: string;
  zipCode: string;
  telephone: string;
  zone: string;
  state: string;
  dueDays: string;
  country: string;
  pan: string;
  gstNotApplicable: boolean;
  gstin: string;
  defaultCurrency: string;
  gstIssueDate: string;
  vendorCategory: string;
  supplyType: string;
  contactPerson: string;
  designation: string;
  contactNo: string;
  controlledBy: string;
  branch: string;
  ledgerOption: "create" | "link";
  bankBranch: string;
  accountHolderName: string;
  bankName: string;
  accountNo: string;
  accountType: string;
  ifscCode: string;
  vatNo: string;
  msmeCategory: string;
  msmeRegister: boolean;
  certificateNo: string;
  certificateDate: string;
  rating: string;
  referenceCode: string;
  showInJournalMR: boolean;
  paymentThroughVendorBill: boolean;
  blacklisted: boolean;
  tdsApplicable: boolean;
  chequeImage: string;
}

const emptyVendor = (): Vendor => ({
  id: "",
  vendorCode: "",
  active: true,
  openDate: "",
  groupName: "",
  accountingGroupCode: "",
  vendorName: "",
  printName: "",
  legalName: "",
  serviceType: "",
  address: "",
  aliasAddress: "",
  crNo: "",
  email: "",
  city: "",
  zipCode: "",
  telephone: "",
  zone: "",
  state: "",
  dueDays: "",
  country: "INDIA",
  pan: "",
  gstNotApplicable: false,
  gstin: "",
  defaultCurrency: "INR",
  gstIssueDate: "",
  vendorCategory: "",
  supplyType: "",
  contactPerson: "",
  designation: "",
  contactNo: "",
  controlledBy: "",
  branch: "",
  ledgerOption: "create",
  bankBranch: "",
  accountHolderName: "",
  bankName: "",
  accountNo: "",
  accountType: "",
  ifscCode: "",
  vatNo: "",
  msmeCategory: "",
  msmeRegister: false,
  certificateNo: "",
  certificateDate: "",
  rating: "",
  referenceCode: "",
  showInJournalMR: false,
  paymentThroughVendorBill: false,
  blacklisted: false,
  tdsApplicable: true,
  chequeImage: "",
});

export default function VendorMaster() {
  const [activeTab, setActiveTab] = useState<"entry" | "search">("entry");
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [form, setForm] = useState<Vendor>(emptyVendor());
  const [editId, setEditId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [columnSettingsOpen, setColumnSettingsOpen] = useState(false);

  const [visibleColumns, setVisibleColumns] = useState({
    vendor: true,
    vendorGroupName: true,
    branch: true,
    city: true,
    pan: true,
    gstin: true,
    contactPerson: true,
    contactNo: true,
    active: true,
  });

  const resetForm = () => {
    setForm(emptyVendor());
    setEditId(null);
  };

  const handleSave = () => {
    if (!form.vendorCode.trim() || !form.vendorName.trim() || !form.groupName) {
      alert("Vendor Code, Vendor Name and Group Name are required!");
      return;
    }

    if (editId) {
      setVendors(prev => prev.map(v => v.id === editId ? { ...form, id: editId } : v));
      alert("Vendor updated successfully.");
    } else {
      const newVendor = { ...form, id: Date.now().toString() };
      setVendors(prev => [...prev, newVendor]);
      alert("Vendor saved successfully.");
    }
    resetForm();
    setActiveTab("search");
  };

  const handleEdit = (vendor: Vendor) => {
    setForm(vendor);
    setEditId(vendor.id);
    setActiveTab("entry");
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this vendor?")) {
      setVendors(prev => prev.filter(v => v.id !== id));
    }
  };

  const filteredVendors = vendors.filter(v =>
    v.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.vendorCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleColumn = (key: keyof typeof visibleColumns) => {
    setVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-4 p-4">
      <div className="border-b pb-3">
        <h1 className="text-xl font-bold text-primary">VENDOR MASTER</h1>
        <div className="text-xs text-muted-foreground mt-1">
          Company : GOLDEN ROADWAYS &amp; LOGISTICS PVT LTD | Login By : MAYANK.GRLOGISTICS@GMAIL.COM
          <br />
          Login Branch : CORPORATE OFFICE | Financial Year : 2026-2027
        </div>
      </div>

      <div className="flex border-b">
        <button onClick={() => { setActiveTab("entry"); resetForm(); }} className={cn("px-6 py-2 font-medium", activeTab === "entry" ? "border-b-2 border-primary text-primary" : "text-muted-foreground")}>Entry</button>
        <button onClick={() => setActiveTab("search")} className={cn("px-6 py-2 font-medium", activeTab === "search" ? "border-b-2 border-primary text-primary" : "text-muted-foreground")}>Search</button>
      </div>

      {/* ==================== ENTRY TAB ==================== */}
      {activeTab === "entry" && (
        <Card>
          <CardHeader>
            <CardTitle>Vendor Entry</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">

            {/* Basic Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div><Label>Vendor Code <span className="text-red-500">*</span></Label><Input value={form.vendorCode} onChange={(e) => setForm({ ...form, vendorCode: e.target.value.toUpperCase() })} placeholder="V001" /></div>
              <div className="flex items-center gap-2 pt-6"><Checkbox checked={form.active} onCheckedChange={(c) => setForm({ ...form, active: !!c })} /><Label>Active</Label></div>
              <div><Label>Open Date</Label><Input type="date" value={form.openDate} onChange={(e) => setForm({ ...form, openDate: e.target.value })} /></div>
              <div><Label>Group Name <span className="text-red-500">*</span></Label>
                <Select value={form.groupName} onValueChange={(v) => setForm({ ...form, groupName: v })}>
                  <SelectTrigger><SelectValue placeholder="Select Group" /></SelectTrigger>
                  <SelectContent>
                    {["AGENCY COMMISSION","FREIGHT SERVICES","VEHICLE PURCHASE","SERVICES","FIXED ASSET","STATIONERY PURCHASE","GENERAL PURCHASE","OTHER STATIONERY","TOUR EXPENSE","VEHICLE PARTS PURCHASE"].map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div><Label>Accounting Group Code</Label><Input value={form.accountingGroupCode} onChange={(e) => setForm({ ...form, accountingGroupCode: e.target.value })} /></div>
              <div><Label>Vendor Name <span className="text-red-500">*</span></Label><Input value={form.vendorName} onChange={(e) => setForm({ ...form, vendorName: e.target.value })} /></div>
              <div><Label>Print/Display Name</Label><Input value={form.printName} onChange={(e) => setForm({ ...form, printName: e.target.value })} /></div>
            </div>

            <div><Label>Legal Name</Label><Input value={form.legalName} onChange={(e) => setForm({ ...form, legalName: e.target.value })} /></div>

            <div>
              <Label>Service Type <span className="text-red-500">*</span></Label>
              <Select value={form.serviceType} onValueChange={(v) => setForm({ ...form, serviceType: v })}>
                <SelectTrigger><SelectValue placeholder="Select Service Type" /></SelectTrigger>
                <SelectContent>
                  {["AGENCY COMMISSION","FREIGHT SERVICES","VEHICLE PURCHASE","SERVICES","FIXED ASSET","STATIONERY PURCHASE","GENERAL PURCHASE","OTHER STATIONERY","TOUR EXPENSE","VEHICLE PARTS PURCHASE"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* All Fields in Tabs */}
            <Tabs defaultValue="address" className="w-full">
              <TabsList className="grid grid-cols-2 sm:grid-cols-5 gap-1">
                <TabsTrigger value="address">Address</TabsTrigger>
                <TabsTrigger value="tax">Tax Info</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="bank">Bank</TabsTrigger>
                <TabsTrigger value="other">Other</TabsTrigger>
              </TabsList>

              <TabsContent value="address" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><Label>Address <span className="text-red-500">*</span></Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
                  <div><Label>Alias Address</Label><Input value={form.aliasAddress} onChange={(e) => setForm({ ...form, aliasAddress: e.target.value })} /></div>
                  <div><Label>City <span className="text-red-500">*</span></Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
                  <div><Label>State <span className="text-red-500">*</span></Label><Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} /></div>
                  <div><Label>Zip Code</Label><Input value={form.zipCode} onChange={(e) => setForm({ ...form, zipCode: e.target.value })} /></div>
                  <div><Label>Telephone #</Label><Input value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} /></div>
                </div>
              </TabsContent>

              <TabsContent value="tax" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><Label>PAN # <span className="text-red-500">*</span></Label><Input value={form.pan} onChange={(e) => setForm({ ...form, pan: e.target.value.toUpperCase() })} /></div>
                  <div><Label>GST #</Label><Input value={form.gstin} onChange={(e) => setForm({ ...form, gstin: e.target.value.toUpperCase() })} /></div>
                  <div className="flex items-center gap-2"><Checkbox checked={form.gstNotApplicable} onCheckedChange={(c) => setForm({ ...form, gstNotApplicable: !!c })} /><Label>GST Not Applicable</Label></div>
                  <div><Label>Default Currency</Label>
                    <Select value={form.defaultCurrency} onValueChange={(v) => setForm({ ...form, defaultCurrency: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INR">INR</SelectItem>
                        <SelectItem value="NEPALESE RUPEE">NEPALESE RUPEE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="contact" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><Label>Contact Person</Label><Input value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} /></div>
                  <div><Label>Designation</Label><Input value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} /></div>
                  <div><Label>Contact No</Label><Input value={form.contactNo} onChange={(e) => setForm({ ...form, contactNo: e.target.value })} /></div>
                  <div><Label>Email Id</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                </div>
              </TabsContent>

              <TabsContent value="bank" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><Label>Bank Name</Label><Input value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })} /></div>
                  <div><Label>Account Holder Name</Label><Input value={form.accountHolderName} onChange={(e) => setForm({ ...form, accountHolderName: e.target.value })} /></div>
                  <div><Label>Account No</Label><Input value={form.accountNo} onChange={(e) => setForm({ ...form, accountNo: e.target.value })} /></div>
                  <div><Label>IFSC Code</Label><Input value={form.ifscCode} onChange={(e) => setForm({ ...form, ifscCode: e.target.value.toUpperCase() })} /></div>
                </div>
              </TabsContent>

              <TabsContent value="other" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><Label>Controlled By <span className="text-red-500">*</span></Label>
                    <Select value={form.controlledBy} onValueChange={(v) => setForm({ ...form, controlledBy: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CORPORATE OFFICE">CORPORATE OFFICE</SelectItem>
                        <SelectItem value="REGIONAL OFFICE">REGIONAL OFFICE</SelectItem>
                        <SelectItem value="HUB">HUB</SelectItem>
                        <SelectItem value="BRANCH / AGENCY">BRANCH / AGENCY</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Branch <span className="text-red-500">*</span></Label><Input value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })} /></div>
                </div>

                <div className="flex flex-wrap gap-x-8 gap-y-3">
                  {[
                    { label: "Show In Journal MR", key: "showInJournalMR" as const },
                    { label: "Payment Through Vendor Bill", key: "paymentThroughVendorBill" as const },
                    { label: "Blacklisted", key: "blacklisted" as const },
                    { label: "TDS Applicable", key: "tdsApplicable" as const },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center gap-2">
                      <Checkbox checked={form[item.key]} onCheckedChange={(c) => setForm({ ...form, [item.key]: !!c })} />
                      <Label>{item.label}</Label>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-4 justify-end pt-6 border-t">
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <Save className="mr-2 h-4 w-4" /> SAVE
              </Button>
              <Button onClick={resetForm} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" /> CLEAR
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* SEARCH TAB */}
      {activeTab === "search" && (
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between gap-3">
              <CardTitle>Vendor List</CardTitle>
              <div className="flex gap-2">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
                  <Input placeholder="Search Vendor..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S#</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Group Name</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>PAN</TableHead>
                  <TableHead>GST</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Contact No</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVendors.map((v, i) => (
                  <TableRow key={v.id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell className="font-medium">{v.vendorName}</TableCell>
                    <TableCell>{v.groupName}</TableCell>
                    <TableCell>{v.branch}</TableCell>
                    <TableCell>{v.city}</TableCell>
                    <TableCell>{v.pan}</TableCell>
                    <TableCell>{v.gstin}</TableCell>
                    <TableCell>{v.contactPerson}</TableCell>
                    <TableCell>{v.contactNo}</TableCell>
                    <TableCell>{v.active ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(v)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(v.id)} className="text-red-600"><Trash2 className="h-4 w-4" /></Button>
                      </div>
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