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
import { Pencil, Save, RefreshCw, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface TDSCategory {
  id: number;
  groupCode: string;
  tdsCategoryCode: string;
  tdsCategoryName: string;
  group: string;
  active: boolean;
}

export default function TDSCategoryMaster() {
  const [activeTab, setActiveTab] = useState<"entry" | "search">("entry");

  const [tdsCategories, setTdsCategories] = useState<TDSCategory[]>([
    { id: 1, groupCode: "A", tdsCategoryCode: "A0001", tdsCategoryName: "CORPORATES", group: "Corporate", active: true },
    { id: 2, groupCode: "AA", tdsCategoryCode: "AA0005", tdsCategoryName: "INDIVIDUAL & HUF", group: "Individual", active: true },
    { id: 3, groupCode: "AA", tdsCategoryCode: "AA0003", tdsCategoryName: "NON CORPORATES", group: "Others", active: true },
    { id: 4, groupCode: "CA", tdsCategoryCode: "CA0006", tdsCategoryName: "TDS ON CONTRACTOR", group: "Contract", active: true },
    { id: 5, groupCode: "BA", tdsCategoryCode: "BA0007", tdsCategoryName: "TDS ON PROFESSIONAL", group: "Professional", active: true },
  ]);

  const [form, setForm] = useState({
    tdsCategoryCode: "",
    tdsCategoryName: "",
    groupCode: "",
    group: "",
    active: true,
  });

  const [editId, setEditId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const resetForm = () => {
    setForm({
      tdsCategoryCode: "",
      tdsCategoryName: "",
      groupCode: "",
      group: "",
      active: true,
    });
    setEditId(null);
  };

  const handleSave = () => {
    if (!form.tdsCategoryCode.trim() || !form.tdsCategoryName.trim()) {
      alert("TDS Category Code and Category Name are required!");
      return;
    }

    if (editId) {
      setTdsCategories(tdsCategories.map(item =>
        item.id === editId ? { ...item, ...form } : item
      ));
      alert("TDS Category updated successfully.");
    } else {
      const newId = Math.max(...tdsCategories.map(item => item.id), 0) + 1;
      const newEntry: TDSCategory = {
        id: newId,
        groupCode: form.groupCode,
        tdsCategoryCode: form.tdsCategoryCode.toUpperCase(),
        tdsCategoryName: form.tdsCategoryName,
        group: form.group,
        active: form.active,
      };
      setTdsCategories([...tdsCategories, newEntry]);
      alert("TDS Category saved successfully.");
    }
    resetForm();
    setActiveTab("search");
  };

  const handleEdit = (item: TDSCategory) => {
    setEditId(item.id);
    setForm({
      tdsCategoryCode: item.tdsCategoryCode,
      tdsCategoryName: item.tdsCategoryName,
      groupCode: item.groupCode,
      group: item.group,
      active: item.active,
    });
    setActiveTab("entry");
  };

  const filteredData = tdsCategories.filter(item =>
    item.tdsCategoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tdsCategoryCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-xl font-bold text-primary">TDS CATEGORY MASTER</h1>
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
            <CardTitle>TDS Category Entry</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Label>TDS Category Code <span className="text-red-500">*</span></Label>
              <Input
                value={form.tdsCategoryCode}
                onChange={(e) => setForm({ ...form, tdsCategoryCode: e.target.value.toUpperCase() })}
                placeholder="A0001"
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
              <Label>Category Name <span className="text-red-500">*</span></Label>
              <Input
                value={form.tdsCategoryName}
                onChange={(e) => setForm({ ...form, tdsCategoryName: e.target.value })}
                placeholder="Enter TDS Category Name"
              />
            </div>

            <div>
              <Label>Group Code</Label>
              <Input
                value={form.groupCode}
                onChange={(e) => setForm({ ...form, groupCode: e.target.value.toUpperCase() })}
                placeholder="A / AA / BA"
              />
            </div>

            <div>
              <Label>Group</Label>
              <Select value={form.group} onValueChange={(value) => setForm({ ...form, group: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Corporate">Corporate</SelectItem>
                  <SelectItem value="Individual">Individual</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Professional">Professional</SelectItem>
                </SelectContent>
              </Select>
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
              <CardTitle>TDS Category List</CardTitle>
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Category Name or Code..."
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
                  <TableHead>Group Code</TableHead>
                  <TableHead>TDS Category Code</TableHead>
                  <TableHead>TDS Category Name</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item, idx) => (
                  <TableRow key={item.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{item.groupCode}</TableCell>
                    <TableCell className="font-medium">{item.tdsCategoryCode}</TableCell>
                    <TableCell>{item.tdsCategoryName}</TableCell>
                    <TableCell>
                      {item.active ? (
                        <span className="text-green-600 font-medium">Yes</span>
                      ) : (
                        <span className="text-red-600 font-medium">No</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(item)}
                      >
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