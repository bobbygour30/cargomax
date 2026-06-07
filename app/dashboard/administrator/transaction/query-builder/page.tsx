"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Save, RefreshCw, Search, Pencil, Trash2, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface QueryMaster {
  id: number;
  reportId: string;
  reportTitle: string;
  menuCode: string;
  aliasName: string;
  createdBy: string;
  createDate: string;
  query: string;
  module: string;
}

export default function QueryBuilderMaster() {
  const [activeTab, setActiveTab] = useState<"entry" | "search">("entry");
  const [queries, setQueries] = useState<QueryMaster[]>([
    { id: 1, reportId: "RPT001", reportTitle: "Vehicle Wise Profit", menuCode: "VEH_PROFIT", aliasName: "veh_profit", createdBy: "Mayank", createDate: "2026-05-10", query: "SELECT * FROM ...", module: "Reports" },
  ]);

  const [form, setForm] = useState({
    reportId: "",
    reportTitle: "",
    query: "",
    groupBy: "",
    aliasName: "",
    orderBy: "",
    whereClause: "",
    dateColumnName: "",
    noOfDatasets: "",
    function: "",
    branchColumnName: "",
    destinationColumnName: "",
    module: "",
    menuCode: "",
  });

  const [editId, setEditId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showExecute, setShowExecute] = useState(false);

  const resetForm = () => {
    setForm({
      reportId: "", reportTitle: "", query: "", groupBy: "", aliasName: "", orderBy: "",
      whereClause: "", dateColumnName: "", noOfDatasets: "", function: "", branchColumnName: "",
      destinationColumnName: "", module: "", menuCode: "",
    });
    setEditId(null);
  };

  const handleSave = () => {
    if (!form.reportTitle.trim() || !form.query.trim() || !form.module || !form.menuCode) {
      alert("Report Title, Query, Module & Menu Code are required!");
      return;
    }

    if (editId) {
      setQueries(queries.map(q => q.id === editId ? { ...q, ...form, id: editId } : q));
      alert("Query updated successfully.");
    } else {
      const newId = Math.max(...queries.map(q => q.id), 0) + 1;
      const newQuery: QueryMaster = {
        id: newId,
        reportId: form.reportId || `RPT${String(newId).padStart(3, '0')}`,
        reportTitle: form.reportTitle,
        menuCode: form.menuCode,
        aliasName: form.aliasName,
        createdBy: "Mayank",
        createDate: new Date().toISOString().split('T')[0],
        query: form.query,
        module: form.module,
      };
      setQueries([...queries, newQuery]);
      alert("Query created successfully.");
    }
    resetForm();
    setActiveTab("search");
  };

  const handleEdit = (q: QueryMaster) => {
    setEditId(q.id);
    setForm({
      reportId: q.reportId,
      reportTitle: q.reportTitle,
      query: q.query,
      groupBy: "",
      aliasName: q.aliasName,
      orderBy: "",
      whereClause: "",
      dateColumnName: "",
      noOfDatasets: "",
      function: "",
      branchColumnName: "",
      destinationColumnName: "",
      module: q.module,
      menuCode: q.menuCode,
    });
    setActiveTab("entry");
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this query?")) {
      setQueries(queries.filter(q => q.id !== id));
    }
  };

  const filteredQueries = queries.filter(q =>
    q.reportTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.reportId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-lg font-bold text-primary">QUERY BUILDER MASTER</h1>
        <div className="text-xs text-muted-foreground mt-1">
          Company : GOLDEN ROADWAYS &amp; LOGISTICS PVT LTD | Login By : MAYANK.GRLOGISTICS@GMAIL.COM
          <br />
          Login Branch : CORPORATE OFFICE | Financial Year : 2026-2027
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button onClick={() => { setActiveTab("entry"); resetForm(); }} className={cn("px-5 py-2 font-medium", activeTab === "entry" ? "border-b-2 border-primary text-primary" : "text-muted-foreground")}>
          Entry
        </button>
        <button onClick={() => setActiveTab("search")} className={cn("px-5 py-2 font-medium", activeTab === "search" ? "border-b-2 border-primary text-primary" : "text-muted-foreground")}>
          Search
        </button>
      </div>

      {/* ===================== ENTRY TAB ===================== */}
      {activeTab === "entry" && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Create Query</CardTitle>
              <Button onClick={() => setShowExecute(true)} variant="default" className="bg-blue-600">
                <Play className="mr-2 h-4 w-4" /> Execute Query
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label>Report Id</Label>
              <Input value={form.reportId} onChange={(e) => setForm({ ...form, reportId: e.target.value })} placeholder="Auto Generated" />
            </div>

            <div>
              <Label>Report Title <span className="text-red-500">*</span></Label>
              <Input value={form.reportTitle} onChange={(e) => setForm({ ...form, reportTitle: e.target.value })} placeholder="Enter Report Title" />
            </div>

            <div>
              <Label>Module <span className="text-red-500">*</span></Label>
              <Select onValueChange={(v) => setForm({ ...form, module: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Module" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Reports">Reports</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Menu Code <span className="text-red-500">*</span></Label>
              <Input value={form.menuCode} onChange={(e) => setForm({ ...form, menuCode: e.target.value.toUpperCase() })} placeholder="e.g. VEH_PROFIT" />
            </div>

            <div>
              <Label>Alias Name</Label>
              <Input value={form.aliasName} onChange={(e) => setForm({ ...form, aliasName: e.target.value })} />
            </div>

            <div>
              <Label>No. Of Datasets <span className="text-red-500">*</span></Label>
              <Input type="number" value={form.noOfDatasets} onChange={(e) => setForm({ ...form, noOfDatasets: e.target.value })} />
            </div>

            <div className="lg:col-span-3">
              <Label>Query <span className="text-red-500">*</span></Label>
              <Textarea value={form.query} onChange={(e) => setForm({ ...form, query: e.target.value })} rows={6} placeholder="Write your SQL Query here..." />
            </div>

            <div>
              <Label>Group By</Label>
              <Input value={form.groupBy} onChange={(e) => setForm({ ...form, groupBy: e.target.value })} />
            </div>

            <div>
              <Label>Order By</Label>
              <Input value={form.orderBy} onChange={(e) => setForm({ ...form, orderBy: e.target.value })} />
            </div>

            <div>
              <Label>Where Clause</Label>
              <Input value={form.whereClause} onChange={(e) => setForm({ ...form, whereClause: e.target.value })} />
            </div>

            <div>
              <Label>Date Column Name</Label>
              <Input value={form.dateColumnName} onChange={(e) => setForm({ ...form, dateColumnName: e.target.value })} />
            </div>

            <div>
              <Label>Branch Column Name</Label>
              <Input value={form.branchColumnName} onChange={(e) => setForm({ ...form, branchColumnName: e.target.value })} />
            </div>

            <div>
              <Label>Destination Column Name</Label>
              <Input value={form.destinationColumnName} onChange={(e) => setForm({ ...form, destinationColumnName: e.target.value })} />
            </div>

            <div className="lg:col-span-3 flex gap-3 justify-end mt-4">
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <CardTitle>Query List</CardTitle>
              <div className="flex gap-2">
                <div className="relative w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by Report Title or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button>Proceed</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S#</TableHead>
                  <TableHead>Report Id</TableHead>
                  <TableHead>Report Title</TableHead>
                  <TableHead>Menu Code</TableHead>
                  <TableHead>Alias Name</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Create Date</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQueries.map((q, idx) => (
                  <TableRow key={q.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell className="font-medium">{q.reportId}</TableCell>
                    <TableCell>{q.reportTitle}</TableCell>
                    <TableCell>{q.menuCode}</TableCell>
                    <TableCell>{q.aliasName}</TableCell>
                    <TableCell>{q.createdBy}</TableCell>
                    <TableCell>{q.createDate}</TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(q)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(q.id)} className="text-red-500">
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

      {/* Execute Query Dialog */}
      <Dialog open={showExecute} onOpenChange={setShowExecute}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Execute Query</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea value={form.query} rows={10} readOnly className="font-mono text-sm" />
            <div className="flex gap-3">
              <Button>Run Query</Button>
              <Button variant="outline" onClick={() => setShowExecute(false)}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}