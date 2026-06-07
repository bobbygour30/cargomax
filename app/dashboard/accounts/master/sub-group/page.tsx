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

interface SubGroup {
  id: number;
  systemId: string;
  referenceCode: string;
  groupName: string;
  aliasName: string;
  parentGroup: string;
  active: boolean;
}

export default function SubGroupMaster() {
  const [activeTab, setActiveTab] = useState<"entry" | "search">("entry");

  const [subGroups, setSubGroups] = useState<SubGroup[]>([
    { id: 1, systemId: "AS001", referenceCode: "REQUIRED", groupName: "BANK A/C", aliasName: "", parentGroup: "CURRENT ASSETS", active: true },
    { id: 2, systemId: "AS132", referenceCode: "REQUIRED", groupName: "BANK OVER DRAFT A/C", aliasName: "", parentGroup: "LOANS (LIABILITIES)", active: true },
    { id: 3, systemId: "AS002", referenceCode: "REQUIRED", groupName: "CASH-IN-HAND", aliasName: "", parentGroup: "CURRENT ASSETS", active: true },
    { id: 4, systemId: "AS102", referenceCode: "REQUIRED", groupName: "DEPOSITS (ASSETS)", aliasName: "", parentGroup: "CURRENT ASSETS", active: true },
  ]);

  const [form, setForm] = useState({
    systemId: "",
    referenceCode: "",
    groupName: "",
    aliasName: "",
    parentGroup: "",
    active: true,
  });

  const [editId, setEditId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const resetForm = () => {
    setForm({
      systemId: "",
      referenceCode: "",
      groupName: "",
      aliasName: "",
      parentGroup: "",
      active: true,
    });
    setEditId(null);
  };

  const handleSave = () => {
    if (!form.systemId.trim() || !form.groupName.trim() || !form.parentGroup) {
      alert("System ID, Group Name and Parent Group are required!");
      return;
    }

    if (editId) {
      setSubGroups(subGroups.map(item =>
        item.id === editId ? { ...item, ...form } : item
      ));
      alert("Sub Group updated successfully.");
    } else {
      const newId = Math.max(...subGroups.map(g => g.id), 0) + 1;
      const newGroup: SubGroup = {
        id: newId,
        systemId: form.systemId.toUpperCase(),
        referenceCode: form.referenceCode,
        groupName: form.groupName,
        aliasName: form.aliasName,
        parentGroup: form.parentGroup,
        active: form.active,
      };
      setSubGroups([...subGroups, newGroup]);
      alert("Sub Group saved successfully.");
    }
    resetForm();
    setActiveTab("search");
  };

  const handleEdit = (group: SubGroup) => {
    setEditId(group.id);
    setForm({
      systemId: group.systemId,
      referenceCode: group.referenceCode,
      groupName: group.groupName,
      aliasName: group.aliasName,
      parentGroup: group.parentGroup,
      active: group.active,
    });
    setActiveTab("entry");
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this Sub Group?")) {
      setSubGroups(subGroups.filter(item => item.id !== id));
    }
  };

  const filteredGroups = subGroups.filter(group =>
    group.groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.systemId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-xl font-bold text-primary">SUB GROUP MASTER</h1>
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
            <CardTitle>Sub Group Entry</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Label>System ID <span className="text-red-500">*</span></Label>
              <Input
                value={form.systemId}
                onChange={(e) => setForm({ ...form, systemId: e.target.value.toUpperCase() })}
                placeholder="AS001"
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
              <Label>Reference Code</Label>
              <Input
                value={form.referenceCode}
                onChange={(e) => setForm({ ...form, referenceCode: e.target.value })}
                placeholder="REQUIRED"
              />
            </div>

            <div>
              <Label>Group Name <span className="text-red-500">*</span></Label>
              <Input
                value={form.groupName}
                onChange={(e) => setForm({ ...form, groupName: e.target.value })}
                placeholder="Enter Group Name"
              />
            </div>

            <div>
              <Label>Alias Name</Label>
              <Input
                value={form.aliasName}
                onChange={(e) => setForm({ ...form, aliasName: e.target.value })}
                placeholder="Enter Alias Name"
              />
            </div>

            <div>
              <Label>Parent Group Name <span className="text-red-500">*</span></Label>
              <Select value={form.parentGroup} onValueChange={(value) => setForm({ ...form, parentGroup: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Parent Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CURRENT ASSETS">CURRENT ASSETS</SelectItem>
                  <SelectItem value="LOANS (LIABILITIES)">LOANS (LIABILITIES)</SelectItem>
                  <SelectItem value="CURRENT LIABLITIES">CURRENT LIABLITIES</SelectItem>
                  <SelectItem value="DIRECT EXPENSE">DIRECT EXPENSE</SelectItem>
                  <SelectItem value="INDIRECT EXPENSE">INDIRECT EXPENSE</SelectItem>
                  <SelectItem value="DIRECT INCOME">DIRECT INCOME</SelectItem>
                  <SelectItem value="INDIRECT INCOME">INDIRECT INCOME</SelectItem>
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
              <CardTitle>Sub Group List</CardTitle>
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Group Name or System ID..."
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
                  <TableHead>System ID</TableHead>
                  <TableHead>Group Name</TableHead>
                  <TableHead>Alias Name</TableHead>
                  <TableHead>Parent Group Name</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGroups.map((group, idx) => (
                  <TableRow key={group.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell className="font-medium">{group.systemId}</TableCell>
                    <TableCell>{group.groupName}</TableCell>
                    <TableCell>{group.aliasName}</TableCell>
                    <TableCell>{group.parentGroup}</TableCell>
                    <TableCell>
                      {group.active ? (
                        <span className="text-green-600 font-medium">Yes</span>
                      ) : (
                        <span className="text-red-600 font-medium">No</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(group)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(group.id)}
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