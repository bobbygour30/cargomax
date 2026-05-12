"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Save,
  RefreshCw,
  Trash2,
  Search,
  Pencil,
  Settings,
  Plus,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MRNType {
  id: number;
  mrnType: string;
  description: string;
  section: string;
  allowSelect: boolean;
}

interface SetupRow {
  id: number;
  documentType: string;
  documentNo: string;
  costCenter: string;
  costCenterType: string;
  poQty: string;
  qty: string;
  freeQty: string;
  billedQty: string;
  rate: string;
  gst: string;
  amount: string;
  expenseSheet: string;
  startNo: string;
  endNo: string;
  qualityCheck: boolean;
  brand: string;
  discount: string;
  seriesOn: string;
  hsnNo: string;
  series: string;
  branchSeries: string;
  gstTripId: string;
}

export default function MRNTypeMaster() {
  const [activeTab, setActiveTab] = useState<"entry" | "search">("entry");
  const [mrnTypes, setMrnTypes] = useState<MRNType[]>([
    { id: 1, mrnType: "A", description: "AGENCY COMMISSION", section: "194H", allowSelect: true },
    { id: 2, mrnType: "B", description: "FREIGHT SERVICES", section: "194C", allowSelect: true },
    { id: 3, mrnType: "C", description: "VEHICLE PURCHASE", section: "", allowSelect: true },
    { id: 4, mrnType: "E", description: "SERVICES", section: "", allowSelect: true },
    { id: 5, mrnType: "F", description: "FIXED ASSET", section: "", allowSelect: true },
    { id: 6, mrnType: "I", description: "STATIONERY PURCHASE", section: "", allowSelect: true },
  ]);

  const [setupOpen, setSetupOpen] = useState(false);
  const [selectedMRN, setSelectedMRN] = useState<MRNType | null>(null);
  const [setupRows, setSetupRows] = useState<SetupRow[]>([]);

  // Entry Form State
  const [form, setForm] = useState({
    mrnType: "",
    description: "",
    itemGroup: "",
    section: "",
    allowSelect: true,
  });

  const [editId, setEditId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const resetForm = () => {
    setForm({
      mrnType: "",
      description: "",
      itemGroup: "",
      section: "",
      allowSelect: true,
    });
    setEditId(null);
  };

  const handleSave = () => {
    if (!form.mrnType.trim() || !form.description.trim()) {
      alert("MRN Type and Description are required!");
      return;
    }

    if (editId) {
      setMrnTypes(mrnTypes.map(item =>
        item.id === editId
          ? { ...item, mrnType: form.mrnType, description: form.description, section: form.section, allowSelect: form.allowSelect }
          : item
      ));
      alert("MRN Type updated successfully.");
    } else {
      const newId = Math.max(...mrnTypes.map(m => m.id), 0) + 1;
      setMrnTypes([...mrnTypes, {
        id: newId,
        mrnType: form.mrnType,
        description: form.description,
        section: form.section,
        allowSelect: form.allowSelect,
      }]);
      alert("MRN Type saved successfully.");
    }
    resetForm();
    setActiveTab("search");
  };

  const handleEdit = (item: MRNType) => {
    setEditId(item.id);
    setForm({
      mrnType: item.mrnType,
      description: item.description,
      itemGroup: "",
      section: item.section,
      allowSelect: item.allowSelect,
    });
    setActiveTab("entry");
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this MRN Type?")) {
      setMrnTypes(mrnTypes.filter(item => item.id !== id));
    }
  };

  const openSetup = (item: MRNType) => {
    setSelectedMRN(item);
    setSetupRows([{
      id: 1,
      documentType: "",
      documentNo: "",
      costCenter: "",
      costCenterType: "",
      poQty: "",
      qty: "",
      freeQty: "",
      billedQty: "",
      rate: "",
      gst: "",
      amount: "",
      expenseSheet: "",
      startNo: "",
      endNo: "",
      qualityCheck: false,
      brand: "",
      discount: "",
      seriesOn: "",
      hsnNo: "",
      series: "",
      branchSeries: "",
      gstTripId: "",
    }]);
    setSetupOpen(true);
  };

  const addSetupRow = () => {
    const newRow: SetupRow = {
      id: setupRows.length + 1,
      documentType: "",
      documentNo: "",
      costCenter: "",
      costCenterType: "",
      poQty: "",
      qty: "",
      freeQty: "",
      billedQty: "",
      rate: "",
      gst: "",
      amount: "",
      expenseSheet: "",
      startNo: "",
      endNo: "",
      qualityCheck: false,
      brand: "",
      discount: "",
      seriesOn: "",
      hsnNo: "",
      series: "",
      branchSeries: "",
      gstTripId: "",
    };
    setSetupRows([...setupRows, newRow]);
  };

  const filteredData = mrnTypes.filter(item =>
    item.mrnType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-lg font-bold text-primary">MRN TYPE MASTER</h1>
        <div className="text-xs text-muted-foreground mt-1">
          Company : GOLDEN ROADWAYS &amp; LOGISTICS PVT LTD | Login By : MAYANK.GRLOGISTICS@GMAIL.COM
          <br />
          Login Branch : CORPORATE OFFICE | Financial Year : 2026-2027
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => { setActiveTab("entry"); resetForm(); }}
          className={cn("px-5 py-2 font-medium", activeTab === "entry" ? "border-b-2 border-primary text-primary" : "text-muted-foreground")}
        >
          Entry
        </button>
        <button
          onClick={() => setActiveTab("search")}
          className={cn("px-5 py-2 font-medium", activeTab === "search" ? "border-b-2 border-primary text-primary" : "text-muted-foreground")}
        >
          Search
        </button>
      </div>

      {/* ===================== ENTRY TAB ===================== */}
      {activeTab === "entry" && (
        <Card>
          <CardHeader>
            <CardTitle>MRN Type Entry</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>MRN Type <span className="text-red-500">*</span></Label>
              <Input value={form.mrnType} onChange={(e) => setForm({ ...form, mrnType: e.target.value })} placeholder="A, B, C..." />
            </div>

            <div>
              <Label>Description <span className="text-red-500">*</span></Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Enter description" />
            </div>

            <div>
              <Label>Item Group</Label>
              <Input value={form.itemGroup} onChange={(e) => setForm({ ...form, itemGroup: e.target.value })} placeholder="Select Item Group" />
            </div>

            <div>
              <Label>Section</Label>
              <Input value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} placeholder="e.g. 194H" />
            </div>

            <div className="flex items-center gap-2 mt-6">
              <Checkbox checked={form.allowSelect} onCheckedChange={(checked) => setForm({ ...form, allowSelect: !!checked })} />
              <Label>Allow Select</Label>
            </div>

            <div className="md:col-span-2 flex gap-3 justify-end mt-4">
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

      {/* ===================== SEARCH TAB ===================== */}
      {activeTab === "search" && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>MRN Type List</CardTitle>
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search MRN Type or Description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">S#</TableHead>
                  <TableHead>MRN Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item, idx) => (
                  <TableRow key={item.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell className="font-semibold">{item.mrnType}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.section}</TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openSetup(item)}>
                          <Settings className="h-4 w-4" /> Setup
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* ===================== SETUP MODAL ===================== */}
      <Dialog open={setupOpen} onOpenChange={setSetupOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Setup for MRN Type : {selectedMRN?.mrnType} - {selectedMRN?.description}</DialogTitle>
          </DialogHeader>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>S#</TableHead>
                  <TableHead>Document Type</TableHead>
                  <TableHead>Document #</TableHead>
                  <TableHead>Cost Center</TableHead>
                  <TableHead>Cost Center Type</TableHead>
                  <TableHead>PO Qty</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Free Qty</TableHead>
                  <TableHead>Billed Qty</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>GST</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Expense Sheet</TableHead>
                  <TableHead>Start #</TableHead>
                  <TableHead>End #</TableHead>
                  <TableHead>Quality Check</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>SeriesOn</TableHead>
                  <TableHead>HSN #</TableHead>
                  <TableHead>Series</TableHead>
                  <TableHead>Branch Series</TableHead>
                  <TableHead>GST Trip Id</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {setupRows.map((row, idx) => (
                  <TableRow key={row.id}>
                    <TableCell>{idx + 1}</TableCell>
                    {/* Add more inputs as needed - shortened for brevity */}
                    <TableCell><Input value={row.documentType} onChange={(e) => {}} className="w-32" /></TableCell>
                    <TableCell><Input value={row.documentNo} onChange={(e) => {}} className="w-28" /></TableCell>
                    <TableCell><Input value={row.costCenter} onChange={(e) => {}} className="w-32" /></TableCell>
                    <TableCell><Input value={row.costCenterType} placeholder="(Blank = ALL)" onChange={(e) => {}} /></TableCell>
                    {/* Add remaining fields similarly... */}
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => setSetupRows(setupRows.filter((_, i) => i !== idx))}>
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-between mt-4">
            <Button onClick={addSetupRow} variant="outline">
              <Plus className="mr-2 h-4 w-4" /> Add More
            </Button>

            <div className="flex gap-3">
              <Button onClick={() => { alert("Setup Saved!"); setSetupOpen(false); }}>
                <Save className="mr-2 h-4 w-4" /> Save
              </Button>
              <Button variant="outline" onClick={() => setSetupOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}