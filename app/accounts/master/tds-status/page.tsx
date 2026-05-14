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
import { Pencil, Trash2, Save, RefreshCw, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface TDSStatus {
  id: number;
  tdsStatusCode: string;
  tdsStatusName: string;
  panStatus: string;
  gstTdsApplicable: boolean;
  active: boolean;
}

export default function TDSStatusMaster() {
  const [activeTab, setActiveTab] = useState<"entry" | "search">("entry");

  const [tdsStatuses, setTdsStatuses] = useState<TDSStatus[]>([
    { id: 1, tdsStatusCode: "A0005", tdsStatusName: "COMMISSION / BROKERAGE", panStatus: "Corporate", gstTdsApplicable: true, active: true },
    { id: 2, tdsStatusCode: "A0006", tdsStatusName: "CONTRACTOR / SUB CONTRACTOR", panStatus: "Individual", gstTdsApplicable: true, active: true },
    { id: 3, tdsStatusCode: "A0008", tdsStatusName: "FREIGHT AND TRANSPORTATION", panStatus: "Others", gstTdsApplicable: false, active: true },
    { id: 4, tdsStatusCode: "A0004", tdsStatusName: "INTEREST", panStatus: "Corporate", gstTdsApplicable: true, active: true },
  ]);

  const [form, setForm] = useState({
    tdsStatusCode: "",
    tdsStatusName: "",
    panStatus: "",
    gstTdsApplicable: false,
    active: true,
  });

  const [editId, setEditId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const resetForm = () => {
    setForm({
      tdsStatusCode: "",
      tdsStatusName: "",
      panStatus: "",
      gstTdsApplicable: false,
      active: true,
    });
    setEditId(null);
  };

  const handleSave = () => {
    if (!form.tdsStatusCode.trim() || !form.tdsStatusName.trim()) {
      alert("TDS Status Code and Status Name are required!");
      return;
    }

    if (editId) {
      setTdsStatuses(tdsStatuses.map(item =>
        item.id === editId ? { ...item, ...form } : item
      ));
      alert("TDS Status updated successfully.");
    } else {
      const newId = Math.max(...tdsStatuses.map(item => item.id), 0) + 1;
      const newStatus: TDSStatus = {
        id: newId,
        tdsStatusCode: form.tdsStatusCode.toUpperCase(),
        tdsStatusName: form.tdsStatusName,
        panStatus: form.panStatus,
        gstTdsApplicable: form.gstTdsApplicable,
        active: form.active,
      };
      setTdsStatuses([...tdsStatuses, newStatus]);
      alert("TDS Status saved successfully.");
    }
    resetForm();
    setActiveTab("search");
  };

  const handleEdit = (item: TDSStatus) => {
    setEditId(item.id);
    setForm({
      tdsStatusCode: item.tdsStatusCode,
      tdsStatusName: item.tdsStatusName,
      panStatus: item.panStatus,
      gstTdsApplicable: item.gstTdsApplicable,
      active: item.active,
    });
    setActiveTab("entry");
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this TDS Status?")) {
      setTdsStatuses(tdsStatuses.filter(item => item.id !== id));
    }
  };

  const filteredData = tdsStatuses.filter(item =>
    item.tdsStatusName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tdsStatusCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-xl font-bold text-primary">TDS STATUS MASTER</h1>
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
          className={cn("px-6 py-2 font-medium", activeTab === "entry" ? "border-b-2 border-primary text-primary" : "text-muted-foreground")}
        >
          Entry
        </button>
        <button
          onClick={() => setActiveTab("search")}
          className={cn("px-6 py-2 font-medium", activeTab === "search" ? "border-b-2 border-primary text-primary" : "text-muted-foreground")}
        >
          Search
        </button>
      </div>

      {/* ===================== ENTRY TAB ===================== */}
      {activeTab === "entry" && (
        <Card>
          <CardHeader>
            <CardTitle>TDS Status Entry</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl">
            <div>
              <Label>TDS Status Code <span className="text-red-500">*</span></Label>
              <Input
                value={form.tdsStatusCode}
                onChange={(e) => setForm({ ...form, tdsStatusCode: e.target.value.toUpperCase() })}
                placeholder="A0005"
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <Checkbox
                checked={form.active}
                onCheckedChange={(checked) => setForm({ ...form, active: !!checked })}
              />
              <Label>Active</Label>
            </div>

            <div>
              <Label>Status Name <span className="text-red-500">*</span></Label>
              <Input
                value={form.tdsStatusName}
                onChange={(e) => setForm({ ...form, tdsStatusName: e.target.value })}
                placeholder="COMMISSION / BROKERAGE"
              />
            </div>

            <div>
              <Label>Pan Status</Label>
              <Select value={form.panStatus} onValueChange={(value) => setForm({ ...form, panStatus: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Pan Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Corporate">Corporate</SelectItem>
                  <SelectItem value="Individual">Individual</SelectItem>
                  <SelectItem value="HUF">HUF</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                checked={form.gstTdsApplicable}
                onCheckedChange={(checked) => setForm({ ...form, gstTdsApplicable: !!checked })}
              />
              <Label>GST TDS Applicable</Label>
            </div>

            <div className="md:col-span-2 flex gap-4 justify-end mt-6">
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <Save className="mr-2 h-4 w-4" />
                {editId ? "UPDATE" : "SAVE"}
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
              <CardTitle>TDS Status List</CardTitle>
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Status Name or Code..."
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
                  <TableHead>S#</TableHead>
                  <TableHead>TDS Status Code</TableHead>
                  <TableHead>TDS Status Name</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item, idx) => (
                  <TableRow key={item.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell className="font-medium">{item.tdsStatusCode}</TableCell>
                    <TableCell>{item.tdsStatusName}</TableCell>
                    <TableCell>
                      {item.active ? (
                        <span className="text-green-600 font-medium">Yes</span>
                      ) : (
                        <span className="text-red-600 font-medium">No</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(item)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
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
    </div>
  );
}