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
  Save,
  RefreshCw,
  Search,
  Pencil,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ------------------------------
//  Types & Mock Data
// ------------------------------
interface SmsTemplate {
  id: number;
  smsTitle: string;
  smsBody: string;
  active: boolean;
}

const mockTemplates: SmsTemplate[] = [
  {
    id: 1,
    smsTitle: "ARRIVAL SMS",
    smsBody: "Your consignment [[GRNO]] has arrived at [[BRANCH]].",
    active: true,
  },
  {
    id: 2,
    smsTitle: "DELIVERY SMS",
    smsBody: "Your consignment [[GRNO]] is delivered on [[DATE]].",
    active: true,
  },
  {
    id: 3,
    smsTitle: "DISPATCH SMS",
    smsBody: "Your goods have been dispatched. Tracking: [[TRACKING]]",
    active: false,
  },
];

export default function SmsTemplateMaster() {
  const [activeTab, setActiveTab] = useState<"entry" | "search">("entry");
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Form state
  const [smsTitle, setSmsTitle] = useState("");
  const [smsBody, setSmsBody] = useState("");
  const [active, setActive] = useState(true);

  // Data state
  const [templates, setTemplates] = useState<SmsTemplate[]>(mockTemplates);

  // Generate a new ID (max + 1)
  const getNextId = () => {
    const maxId = templates.length > 0 ? Math.max(...templates.map((t) => t.id)) : 0;
    return maxId + 1;
  };

  const resetForm = () => {
    setSmsTitle("");
    setSmsBody("");
    setActive(true);
    setEditId(null);
  };

  const handleSave = () => {
    if (!smsTitle.trim()) {
      alert("SMS Title is required");
      return;
    }
    if (!smsBody.trim()) {
      alert("SMS Body is required");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      if (editId) {
        // Update existing record
        const updated = templates.map((t) =>
          t.id === editId
            ? { ...t, smsTitle, smsBody, active }
            : t
        );
        setTemplates(updated);
        alert("Template updated");
      } else {
        // Create new record
        const newId = getNextId();
        const newTemplate: SmsTemplate = {
          id: newId,
          smsTitle,
          smsBody,
          active,
        };
        setTemplates([...templates, newTemplate]);
        alert("Template saved");
      }
      resetForm();
      setActiveTab("search");
      setLoading(false);
    }, 500);
  };

  const handleEdit = (template: SmsTemplate) => {
    setEditId(template.id);
    setSmsTitle(template.smsTitle);
    setSmsBody(template.smsBody);
    setActive(template.active);
    setActiveTab("entry");
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this SMS template?")) {
      setTemplates(templates.filter((t) => t.id !== id));
      if (editId === id) resetForm();
      alert("Deleted");
    }
  };

  // Search filter
  const filtered = templates.filter(
    (t) =>
      t.smsTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.smsBody.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">SMS TEMPLATE MASTER</h1>
        <div className="mt-1 text-[10px] md:text-xs text-muted-foreground">
          Company : GOLDEN ROADWAYS & LOGISTICS PVT LTD | Login By : MAYANK.GRLOGISTICS@GMAIL.COM
          <br />
          Login Branch : CORPORATE OFFICE | Financial Year : 2026-2027
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => {
            setActiveTab("entry");
            resetForm();
          }}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-all",
            activeTab === "entry"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Entry
        </button>
        <button
          onClick={() => {
            setActiveTab("search");
            setCurrentPage(1);
          }}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-all",
            activeTab === "search"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Search
        </button>
      </div>

      {/* Entry Tab */}
      {activeTab === "entry" && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">SMS Template Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ID (read‑only, auto‑generated when creating new) */}
              <div className="space-y-1">
                <Label className="text-xs">ID</Label>
                <Input
                  value={editId ? editId.toString() : getNextId().toString()}
                  readOnly
                  className="h-8 text-xs bg-muted"
                />
              </div>
              {/* SMS Title */}
              <div className="space-y-1">
                <Label className="text-xs">
                  SMS Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={smsTitle}
                  onChange={(e) => setSmsTitle(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            {/* SMS Body */}
            <div className="space-y-1">
              <Label className="text-xs">
                SMS Body <span className="text-red-500">*</span>
              </Label>
              <Textarea
                value={smsBody}
                onChange={(e) => setSmsBody(e.target.value)}
                rows={4}
                className="text-xs"
                placeholder="Enter SMS content. Use placeholders like [[GRNO]]."
              />
            </div>

            {/* Active Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="h-3.5 w-3.5"
                id="active"
              />
              <Label htmlFor="active" className="text-xs cursor-pointer">
                Active
              </Label>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                onClick={handleSave}
                size="sm"
                className="h-8 text-xs bg-green-600"
                disabled={loading}
              >
                <Save className="mr-1 h-3 w-3" />
                {editId ? "UPDATE" : "SAVE"}
              </Button>
              <Button onClick={resetForm} variant="outline" size="sm" className="h-8 text-xs">
                <RefreshCw className="mr-1 h-3 w-3" />
                CLEAR
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Tab */}
      {activeTab === "search" && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5" />
              <Input
                placeholder="Search by SMS Title or Body..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-8 text-xs"
              />
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[700px]">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-12 text-center">S#</TableHead>
                    <TableHead>Id</TableHead>
                    <TableHead>SMS Title</TableHead>
                    <TableHead>SMS Body</TableHead>
                    <TableHead className="text-center w-20">Active</TableHead>
                    <TableHead className="w-24 text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.map((template, idx) => (
                    <TableRow key={template.id} className="hover:bg-muted/30">
                      <TableCell className="text-center">
                        {(currentPage - 1) * itemsPerPage + idx + 1}
                      </TableCell>
                      <TableCell>{template.id}</TableCell>
                      <TableCell className="font-medium">{template.smsTitle}</TableCell>
                      <TableCell className="max-w-md truncate">{template.smsBody}</TableCell>
                      <TableCell className="text-center">
                        {template.active ? (
                          <span className="text-green-600 text-xs">Yes</span>
                        ) : (
                          <span className="text-red-600 text-xs">No</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(template)}
                            className="h-6 w-6 p-0 text-blue-500"
                            title="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(template.id)}
                            className="h-6 w-6 p-0 text-red-500"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {paginated.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No SMS templates found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="px-3 py-1 text-xs bg-muted rounded-md">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Info Note */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 rounded-md p-3">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
          <div className="text-xs text-blue-700 dark:text-blue-400">
            <p className="font-medium">Note:</p>
            <ul className="list-disc list-inside mt-1 space-y-0.5">
              <li>SMS Title and Body are mandatory.</li>
              <li>Use dynamic placeholders like <code>[[GRNO]]</code>, <code>[[BRANCH]]</code> etc.</li>
              <li>Only active templates will be used for automated SMS sending.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}