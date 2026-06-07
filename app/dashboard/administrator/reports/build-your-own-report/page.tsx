"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, ArrowUp, ArrowDown, Play, RefreshCw, Pencil, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface SavedReport {
  id: number;
  queryName: string;
  createdBy: string;
  createdOn: string;
}

interface Condition {
  id: number;
  column: string;
  operator: string;
  value: string;
  logic: string;
}

export default function BuildYourOwnReports() {
  const [activeTab, setActiveTab] = useState<"entry" | "search">("entry");
  const [buildMode, setBuildMode] = useState<"wizard" | "query">("wizard");

  // Entry Form States
  const [reportTitle, setReportTitle] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [dataSource, setDataSource] = useState("");

  const [availableColumns] = useState([
    "Vehicle_No", "Trip_Id", "Consignor", "Consignee", "Freight_Amount",
    "Date", "Branch", "Destination", "Vehicle_Type", "Driver_Name"
  ]);

  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [groupingColumns, setGroupingColumns] = useState<string[]>([]);
  const [columnSequence, setColumnSequence] = useState<string[]>([]);
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [outputType, setOutputType] = useState<"grid" | "excel">("grid");
  const [orderByColumn, setOrderByColumn] = useState("");
  const [orderDirection, setOrderDirection] = useState<"ASC" | "DESC">("ASC");

  // Search Tab Data
  const [savedReports] = useState<SavedReport[]>([
    { id: 1, queryName: "GR EDITED BY USER", createdBy: "MAYANK.GRLOGISTICS@GMAIL.COM", createdOn: "22-10-2022" },
    { id: 2, queryName: "GRL MANIFEST REPORT", createdBy: "MAYANK.GRLOGISTICS@GMAIL.COM", createdOn: "04-01-2023" },
    { id: 3, queryName: "GRL LHC REPORT", createdBy: "MAYANK.GRLOGISTICS@GMAIL.COM", createdOn: "02-11-2023" },
    { id: 4, queryName: "MANIFEST", createdBy: "MAYANK.GRLOGISTICS@GMAIL.COM", createdOn: "29-09-2025" },
    { id: 5, queryName: "GRL LHC REPORT (LOCAL)", createdBy: "MAYANK.GRLOGISTICS@GMAIL.COM", createdOn: "09-05-2026" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  // Column Selection
  const toggleColumn = (col: string) => {
    if (selectedColumns.includes(col)) {
      setSelectedColumns(selectedColumns.filter(c => c !== col));
    } else {
      setSelectedColumns([...selectedColumns, col]);
      if (!columnSequence.includes(col)) setColumnSequence([...columnSequence, col]);
    }
  };

  const addCondition = () => {
    setConditions([...conditions, { id: Date.now(), column: "", operator: "=", value: "", logic: "AND" }]);
  };

  const updateCondition = (id: number, key: keyof Condition, value: string) => {
    setConditions(conditions.map(c => c.id === id ? { ...c, [key]: value } : c));
  };

  const removeCondition = (id: number) => {
    setConditions(conditions.filter(c => c.id !== id));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const arr = [...columnSequence];
    [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
    setColumnSequence(arr);
  };

  const moveDown = (index: number) => {
    if (index === columnSequence.length - 1) return;
    const arr = [...columnSequence];
    [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
    setColumnSequence(arr);
  };

  const handleRunReport = () => {
    if (!reportTitle.trim()) {
      alert("Report Title is required!");
      return;
    }
    alert(`Running Report: "${reportTitle}" in ${outputType.toUpperCase()} format`);
  };

  const handleClear = () => {
    setReportTitle("");
    setCategory(""); setSubCategory(""); setDataSource("");
    setSelectedColumns([]); setGroupingColumns([]); setColumnSequence([]);
    setConditions([]); setOrderByColumn(""); setOutputType("grid");
  };

  const filteredReports = savedReports.filter(r =>
    r.queryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-xl font-bold text-primary">BUILD YOUR OWN REPORTS</h1>
        <div className="text-xs text-muted-foreground mt-1">
          Company : GOLDEN ROADWAYS &amp; LOGISTICS PVT LTD | Login By : MAYANK.GRLOGISTICS@GMAIL.COM
          <br />
          Login Branch : CORPORATE OFFICE | Financial Year : 2026-2027
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex border-b">
        <button onClick={() => setActiveTab("entry")} className={cn("px-6 py-2 font-medium", activeTab === "entry" ? "border-b-2 border-primary text-primary" : "text-muted-foreground")}>Entry</button>
        <button onClick={() => setActiveTab("search")} className={cn("px-6 py-2 font-medium", activeTab === "search" ? "border-b-2 border-primary text-primary" : "text-muted-foreground")}>Search</button>
      </div>

      {/* ===================== ENTRY TAB ===================== */}
      {activeTab === "entry" && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center flex-wrap gap-3">
              <CardTitle>Build Report Through Wizard</CardTitle>
              <Tabs value={buildMode} onValueChange={(v: any) => setBuildMode(v)}>
                <TabsList>
                  <TabsTrigger value="wizard">Wizard Mode</TabsTrigger>
                  <TabsTrigger value="query">Own Query</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>

          <CardContent>
            <div className="mb-6">
              <Label>Report Title <span className="text-red-500">*</span></Label>
              <Input
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                placeholder="Enter Report Title"
                className="max-w-lg"
              />
            </div>

            {buildMode === "wizard" && (
              <Tabs defaultValue="datasource" className="w-full">
                <TabsList className="grid grid-cols-7 mb-6">
                  <TabsTrigger value="datasource">Data Source</TabsTrigger>
                  <TabsTrigger value="columns">Select Columns</TabsTrigger>
                  <TabsTrigger value="grouping">Grouping</TabsTrigger>
                  <TabsTrigger value="sequence">Column Sequence</TabsTrigger>
                  <TabsTrigger value="condition">Conditions</TabsTrigger>
                  <TabsTrigger value="orderby">Order By</TabsTrigger>
                  <TabsTrigger value="output">Output Type</TabsTrigger>
                </TabsList>

                {/* 1. Data Source */}
                <TabsContent value="datasource">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Select Category</Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Operations">Operations</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Transport">Transport</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Select Sub Category</Label>
                      <Select value={subCategory} onValueChange={setSubCategory}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Trips">Trips</SelectItem>
                          <SelectItem value="Billing">Billing</SelectItem>
                          <SelectItem value="Vehicle">Vehicle</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Data Source</Label>
                      <Select value={dataSource} onValueChange={setDataSource}>
                        <SelectTrigger><SelectValue placeholder="Select Table/View" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TripsMaster">Trips Master</SelectItem>
                          <SelectItem value="TransactionView">Transaction View</SelectItem>
                          <SelectItem value="VehicleMaster">Vehicle Master</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                {/* 2. Select Columns */}
                <TabsContent value="columns">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 border p-4 rounded-lg max-h-80 overflow-y-auto">
                    {availableColumns.map(col => (
                      <div key={col} className="flex items-center gap-2">
                        <Checkbox checked={selectedColumns.includes(col)} onCheckedChange={() => toggleColumn(col)} />
                        <span>{col}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* 3. Grouping Columns */}
                <TabsContent value="grouping">
                  <Select onValueChange={(v) => !groupingColumns.includes(v) && setGroupingColumns([...groupingColumns, v])}>
                    <SelectTrigger className="w-80">
                      <SelectValue placeholder="Add Grouping Column" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableColumns.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {groupingColumns.map((col, i) => (
                      <div key={i} className="bg-blue-100 text-blue-800 px-4 py-1.5 rounded-full flex items-center gap-2">
                        {col}
                        <Trash2 className="h-4 w-4 cursor-pointer" onClick={() => setGroupingColumns(groupingColumns.filter((_, idx) => idx !== i))} />
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* 4. Column Sequence */}
                <TabsContent value="sequence">
                  <div className="space-y-3">
                    {columnSequence.map((col, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border">
                        <span className="font-medium">{col}</span>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => moveUp(idx)}><ArrowUp className="h-4 w-4" /></Button>
                          <Button variant="outline" size="sm" onClick={() => moveDown(idx)}><ArrowDown className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* 5. Define Condition */}
                <TabsContent value="condition">
                  <Button onClick={addCondition} className="mb-4">
                    <Plus className="mr-2 h-4 w-4" /> Add Condition
                  </Button>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Column</TableHead>
                        <TableHead>Operator</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Logic</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {conditions.map(cond => (
                        <TableRow key={cond.id}>
                          <TableCell>
                            <Select value={cond.column} onValueChange={(v) => updateCondition(cond.id, "column", v)}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>{availableColumns.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select value={cond.operator} onValueChange={(v) => updateCondition(cond.id, "operator", v)}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="=">=</SelectItem>
                                <SelectItem value=">">&gt;</SelectItem>
                                <SelectItem value="<">&lt;</SelectItem>
                                <SelectItem value="LIKE">LIKE</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell><Input value={cond.value} onChange={(e) => updateCondition(cond.id, "value", e.target.value)} /></TableCell>
                          <TableCell>
                            <Select value={cond.logic} onValueChange={(v) => updateCondition(cond.id, "logic", v)}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="AND">AND</SelectItem>
                                <SelectItem value="OR">OR</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => removeCondition(cond.id)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                {/* 6. Order By */}
                <TabsContent value="orderby">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md">
                    <div>
                      <Label>Column Name</Label>
                      <Select value={orderByColumn} onValueChange={setOrderByColumn}>
                        <SelectTrigger><SelectValue placeholder="Select Column" /></SelectTrigger>
                        <SelectContent>
                          {availableColumns.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Direction</Label>
                      <Select value={orderDirection} onValueChange={(v: any) => setOrderDirection(v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ASC">Ascending</SelectItem>
                          <SelectItem value="DESC">Descending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                {/* 7. Output Type */}
                <TabsContent value="output">
                  <div className="flex gap-4">
                    <Button variant={outputType === "grid" ? "default" : "outline"} onClick={() => setOutputType("grid")}>Grid View</Button>
                    <Button variant={outputType === "excel" ? "default" : "outline"} onClick={() => setOutputType("excel")}>Excel View</Button>
                  </div>
                </TabsContent>
              </Tabs>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end mt-8 pt-6 border-t">
              <Button onClick={handleRunReport} className="bg-green-600 hover:bg-green-700">
                <Play className="mr-2 h-4 w-4" /> RUN REPORT
              </Button>
              <Button onClick={handleClear} variant="outline">
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
              <CardTitle>Saved Reports</CardTitle>
              <Input
                placeholder="Filter by Query Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S#</TableHead>
                  <TableHead>Query Name</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Created On</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report, idx) => (
                  <TableRow key={report.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell className="font-medium">{report.queryName}</TableCell>
                    <TableCell>{report.createdBy}</TableCell>
                    <TableCell>{report.createdOn}</TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Button variant="outline" size="sm" title="Edit">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" title="Run" className="text-green-600">
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" title="Delete" className="text-red-600">
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