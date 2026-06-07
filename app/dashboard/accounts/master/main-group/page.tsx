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
import { Pencil, Save, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface GroupMaster {
  id: number;
  systemId: string;
  referenceCode: string;
  groupName: string;
  aliasName: string;
  groupType: string;
  active: boolean;
}

export default function MainMaster() {
  const [activeTab, setActiveTab] = useState<"entry" | "search">("entry");

  const [groups, setGroups] = useState<GroupMaster[]>([
    { id: 1, systemId: "AM004", referenceCode: "", groupName: "CURRENT ASSETS", aliasName: "", groupType: "Asset", active: true },
    { id: 2, systemId: "AM013", referenceCode: "", groupName: "CURRENT LIABLITIES", aliasName: "", groupType: "Liabilities", active: true },
    { id: 3, systemId: "AM035", referenceCode: "", groupName: "BRANCH & DIVISIONS", aliasName: "", groupType: "Asset", active: true },
    { id: 4, systemId: "AM047", referenceCode: "", groupName: "LOANS (LIABILITIES)", aliasName: "", groupType: "Liabilities", active: true },
    { id: 5, systemId: "AM048", referenceCode: "", groupName: "DIRECT EXPENSE", aliasName: "", groupType: "Expenditure", active: true },
    { id: 6, systemId: "AM049", referenceCode: "", groupName: "INDIRECT EXPENSE", aliasName: "", groupType: "Expenditure", active: true },
    { id: 7, systemId: "AM050", referenceCode: "", groupName: "DIRECT INCOME", aliasName: "", groupType: "Income", active: true },
    { id: 8, systemId: "AM051", referenceCode: "", groupName: "INDIRECT INCOME", aliasName: "", groupType: "Income", active: true },
  ]);

  const [form, setForm] = useState({
    systemId: "",
    referenceCode: "",
    groupName: "",
    aliasName: "",
    groupType: "",
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
      groupType: "",
      active: true,
    });
    setEditId(null);
  };

  const handleSave = () => {
    if (!form.systemId.trim() || !form.groupName.trim() || !form.groupType) {
      alert("System ID, Group Name and Group Type are required!");
      return;
    }

    if (editId) {
      setGroups(groups.map(item =>
        item.id === editId
          ? { ...item, ...form }
          : item
      ));
      alert("Record updated successfully.");
    } else {
      const newId = Math.max(...groups.map(g => g.id), 0) + 1;
      const newGroup: GroupMaster = {
        id: newId,
        systemId: form.systemId,
        referenceCode: form.referenceCode,
        groupName: form.groupName,
        aliasName: form.aliasName,
        groupType: form.groupType,
        active: form.active,
      };
      setGroups([...groups, newGroup]);
      alert("Record saved successfully.");
    }
    resetForm();
    setActiveTab("search");
  };

  const handleEdit = (group: GroupMaster) => {
    setEditId(group.id);
    setForm({
      systemId: group.systemId,
      referenceCode: group.referenceCode,
      groupName: group.groupName,
      aliasName: group.aliasName,
      groupType: group.groupType,
      active: group.active,
    });
    setActiveTab("entry");
  };

  const filteredGroups = groups.filter(group =>
    group.groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.systemId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-xl font-bold text-primary">MAIN MASTER</h1>
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
            <CardTitle>Main Master Entry</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Label>System ID <span className="text-red-500">*</span></Label>
              <Input
                value={form.systemId}
                onChange={(e) => setForm({ ...form, systemId: e.target.value.toUpperCase() })}
                placeholder="AM001"
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
                placeholder="Enter Reference Code"
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
              <Label>Group Type <span className="text-red-500">*</span></Label>
              <Select value={form.groupType} onValueChange={(value) => setForm({ ...form, groupType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Group Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asset">Asset</SelectItem>
                  <SelectItem value="Liabilities">Liabilities</SelectItem>
                  <SelectItem value="Income">Income</SelectItem>
                  <SelectItem value="Expenditure">Expenditure</SelectItem>
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
              <CardTitle>Group List</CardTitle>
              <Input
                placeholder="Search by System ID or Group Name..."
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
                  <TableHead>System ID</TableHead>
                  <TableHead>Group Name</TableHead>
                  <TableHead>Group Type</TableHead>
                  <TableHead>Alias Name</TableHead>
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
                    <TableCell>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium
                        ${group.groupType === 'Asset' ? 'bg-green-100 text-green-700' : ''}
                        ${group.groupType === 'Liabilities' ? 'bg-red-100 text-red-700' : ''}
                        ${group.groupType === 'Income' ? 'bg-blue-100 text-blue-700' : ''}
                        ${group.groupType === 'Expenditure' ? 'bg-orange-100 text-orange-700' : ''}`}>
                        {group.groupType}
                      </span>
                    </TableCell>
                    <TableCell>{group.aliasName}</TableCell>
                    <TableCell>
                      {group.active ? (
                        <span className="text-green-600 font-medium">Yes</span>
                      ) : (
                        <span className="text-red-600 font-medium">No</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(group)}
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