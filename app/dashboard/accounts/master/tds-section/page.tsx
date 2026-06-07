"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface TDSection {
  id: number;
  sectionId: string;
  sectionName: string;
}

export default function TDSSectionMaster() {
  const [activeTab, setActiveTab] = useState<"entry" | "search">("entry");

  const [sections, setSections] = useState<TDSection[]>([
    { id: 1, sectionId: "192", sectionName: "TDS on Salary" },
    { id: 2, sectionId: "194A", sectionName: "TDS on Interest other than Interest on Securities" },
    { id: 3, sectionId: "194B", sectionName: "TDS on Winnings from Lottery or Crossword Puzzle" },
    { id: 4, sectionId: "194C", sectionName: "TDS on Payment to Contractors" },
    { id: 5, sectionId: "194D", sectionName: "TDS on Insurance Commission" },
    { id: 6, sectionId: "194DA", sectionName: "TDS on Payment in respect of Life Insurance Policy" },
    { id: 7, sectionId: "194H", sectionName: "TDS on Commission or Brokerage" },
    { id: 8, sectionId: "194I", sectionName: "TDS on Rent" },
    { id: 9, sectionId: "194J", sectionName: "TDS on Professional or Technical Fees" },
  ]);

  const [form, setForm] = useState({
    sectionId: "",
    sectionName: "",
  });

  const [editId, setEditId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const resetForm = () => {
    setForm({ sectionId: "", sectionName: "" });
    setEditId(null);
  };

  const handleSave = () => {
    if (!form.sectionId.trim() || !form.sectionName.trim()) {
      alert("Section ID and Section Name are required!");
      return;
    }

    if (editId) {
      setSections(sections.map(item =>
        item.id === editId ? { ...item, sectionId: form.sectionId, sectionName: form.sectionName } : item
      ));
      alert("TDS Section updated successfully.");
    } else {
      const newId = Math.max(...sections.map(s => s.id), 0) + 1;
      const newSection: TDSection = {
        id: newId,
        sectionId: form.sectionId.toUpperCase(),
        sectionName: form.sectionName,
      };
      setSections([...sections, newSection]);
      alert("TDS Section saved successfully.");
    }
    resetForm();
    setActiveTab("search");
  };

  const handleEdit = (section: TDSection) => {
    setEditId(section.id);
    setForm({
      sectionId: section.sectionId,
      sectionName: section.sectionName,
    });
    setActiveTab("entry");
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this TDS Section?")) {
      setSections(sections.filter(item => item.id !== id));
    }
  };

  const filteredSections = sections.filter(section =>
    section.sectionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.sectionName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-xl font-bold text-primary">TDS SECTION MASTER</h1>
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
            <CardTitle>TDS Section Entry</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl">
            <div>
              <Label>Section Id <span className="text-red-500">*</span></Label>
              <Input
                value={form.sectionId}
                onChange={(e) => setForm({ ...form, sectionId: e.target.value.toUpperCase() })}
                placeholder="194C"
              />
            </div>

            <div>
              <Label>Section Name <span className="text-red-500">*</span></Label>
              <Input
                value={form.sectionName}
                onChange={(e) => setForm({ ...form, sectionName: e.target.value })}
                placeholder="TDS on Payment to Contractors"
              />
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
              <CardTitle>TDS Section List</CardTitle>
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Section ID or Name..."
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
                  <TableHead>Section Id</TableHead>
                  <TableHead>Section Name</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSections.map((section, idx) => (
                  <TableRow key={section.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell className="font-medium">{section.sectionId}</TableCell>
                    <TableCell>{section.sectionName}</TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(section)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(section.id)}
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