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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Search,
  RefreshCw,
  Save,
  Pencil,
  Eye,
  X,
  Check,
  AlertCircle,
  Settings,
  Key,
  FileText,
  Globe,
  Calendar,
  MapPin,
  Clock,
  HardDrive,
  Fuel,
  CreditCard,
  Lock,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Parameter {
  id: number;
  keyNo: string;
  description: string;
  value: string;
  category?: string;
  isEditing?: boolean;
}

const parameterCategories = [
  { name: "Application Settings", icon: Settings, color: "bg-blue-100 text-blue-600" },
  { name: "Security & Integration", icon: Lock, color: "bg-purple-100 text-purple-600" },
  { name: "Fuel Management", icon: Fuel, color: "bg-green-100 text-green-600" },
  { name: "Backup & Storage", icon: HardDrive, color: "bg-orange-100 text-orange-600" },
];

export default function AccParaSetupMaster() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedParam, setSelectedParam] = useState<Parameter | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const itemsPerPage: number = 10;

  // Sample Data
  const [savedRecords, setSavedRecords] = useState<Parameter[]>([
    { id: 1, keyNo: "04", description: "ALERT MANAGEMENT ENABLED", value: "YES", category: "Application Settings" },
    { id: 2, keyNo: "60", description: "ALLOW ACCESS TO WEB MODULES", value: "Y", category: "Application Settings" },
    { id: 3, keyNo: "61", description: "ALLOW AUTHORIZE GST INTEGRATION", value: "N", category: "Security & Integration" },
    { id: 4, keyNo: "79", description: "APP PAGES MAIN URL", value: "https://pwaapp-f2c2e.web.app/", category: "Application Settings" },
    { id: 5, keyNo: "08", description: "APPLICATION ACTIVATION DATE", value: "2025-04-01", category: "Application Settings" },
    { id: 6, keyNo: "10", description: "APPLICATION LOCATION CODE", value: "001", category: "Application Settings" },
    { id: 7, keyNo: "76", description: "APPLICATION LOGOUT HOUR", value: "24", category: "Application Settings" },
    { id: 8, keyNo: "75", description: "BACKUP DESTINATION PATH", value: "D:\\databasebackup\\", category: "Backup & Storage" },
    { id: 9, keyNo: "99", description: "BPCL Fuel accountId", value: "", category: "Fuel Management" },
    { id: 10, keyNo: "95", description: "BPCL Fuel client_id", value: "", category: "Fuel Management" },
    { id: 11, keyNo: "96", description: "BPCL Fuel client_secret", value: "", category: "Fuel Management" },
    { id: 12, keyNo: "98", description: "BPCL Fuel password", value: "", category: "Fuel Management" },
    { id: 13, keyNo: "97", description: "BPCL Fuel username", value: "", category: "Fuel Management" },
  ]);

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleSave = (id: number, newValue: string) => {
    setSavedRecords(savedRecords.map(record => 
      record.id === id ? { ...record, value: newValue, isEditing: false } : record
    ));
    alert(`Parameter updated successfully!`);
  };

  const handleEdit = (id: number) => {
    setSavedRecords(savedRecords.map(record => 
      record.id === id ? { ...record, isEditing: true } : record
    ));
  };

  const handleCancelEdit = (id: number) => {
    setSavedRecords(savedRecords.map(record => 
      record.id === id ? { ...record, isEditing: false } : record
    ));
  };

  const handleViewDetails = (param: Parameter) => {
    setSelectedParam(param);
    setIsViewModalOpen(true);
  };

  const handleUpdateValue = (id: number, value: string) => {
    setSavedRecords(savedRecords.map(record => 
      record.id === id ? { ...record, value } : record
    ));
  };

  const getCategoryIcon = (category?: string) => {
    if (category?.includes("Fuel")) return <Fuel className="h-3.5 w-3.5" />;
    if (category?.includes("Backup")) return <HardDrive className="h-3.5 w-3.5" />;
    if (category?.includes("Security")) return <Lock className="h-3.5 w-3.5" />;
    return <Settings className="h-3.5 w-3.5" />;
  };

  const getCategoryColor = (category?: string) => {
    if (category?.includes("Fuel")) return "bg-green-100 text-green-700";
    if (category?.includes("Backup")) return "bg-orange-100 text-orange-700";
    if (category?.includes("Security")) return "bg-purple-100 text-purple-700";
    return "bg-blue-100 text-blue-700";
  };

  const filteredRecords = savedRecords.filter(record =>
    record.keyNo.includes(searchTerm) ||
    record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedResults = filteredRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">ACC PARA SETUP MASTER</h1>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[10px] md:text-xs text-muted-foreground">
          <span>Company : GOLDEN ROADWAYS & LOGISTICS PVT LTD</span>
          <span>Login By : MAYANK.GRLOGISTICS@GMAIL.COM</span>
          <span>Login Branch : CORPORATE OFFICE</span>
          <span>Financial Year : 2026-2027</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search by Key No, Description or Value..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-8 h-8 text-xs"
          />
        </div>
        <Button onClick={handleSearch} size="sm" className="h-8 text-xs">
          <Search className="mr-1 h-3.5 w-3.5" />
          SEARCH
        </Button>
        <Button onClick={handleClearSearch} variant="outline" size="sm" className="h-8 text-xs">
          <RefreshCw className="mr-1 h-3.5 w-3.5" />
          CLEAR
        </Button>
      </div>

      {/* Parameters Table */}
      <div className="rounded-md border overflow-x-auto">
        <div className="min-w-[700px]">
          <Table className="text-xs">
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-12 text-center">S#</TableHead>
                <TableHead className="w-20 text-center">Key No</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="min-w-[200px]">Value</TableHead>
                <TableHead className="w-32 text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedResults.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                    No parameters found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedResults.map((record, idx) => (
                  <TableRow key={record.id} className="hover:bg-muted/30">
                    <TableCell className="text-center">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </TableCell>
                    <TableCell className="text-center font-mono font-medium">
                      {record.keyNo}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={cn("p-1 rounded", getCategoryColor(record.category))}>
                          {getCategoryIcon(record.category)}
                        </span>
                        <span>{record.description}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {record.isEditing ? (
                        <div className="flex gap-2">
                          <Input
                            value={record.value}
                            onChange={(e) => handleUpdateValue(record.id, e.target.value)}
                            className="h-7 text-xs flex-1"
                            autoFocus
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSave(record.id, record.value)}
                            className="h-7 w-7 p-0 text-green-500"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancelEdit(record.id)}
                            className="h-7 w-7 p-0 text-red-500"
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-2">
                          <span className={cn(
                            "px-2 py-1 rounded font-mono",
                            record.value && "bg-muted/30"
                          )}>
                            {record.value || "-"}
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        {!record.isEditing ? (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(record.id)}
                              className="h-7 w-7 p-0 text-blue-500"
                              title="Edit"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(record)}
                              className="h-7 w-7 p-0 text-green-500"
                              title="View Details"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        ) : (
                          <span className="text-xs text-muted-foreground">Editing...</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="text-xs text-muted-foreground">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredRecords.length)} of {filteredRecords.length} entries
          </div>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-7 text-xs"
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
              className="h-7 text-xs"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg">Parameter Details</DialogTitle>
          </DialogHeader>
          {selectedParam && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Key No</Label>
                  <p className="text-sm font-mono font-medium">{selectedParam.keyNo}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Category</Label>
                  <p className="text-sm">{selectedParam.category || "General"}</p>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Description</Label>
                <p className="text-sm">{selectedParam.description}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Value</Label>
                <p className="text-sm font-mono bg-muted/30 p-2 rounded">{selectedParam.value || "Not set"}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsViewModalOpen(false)}>
              CLOSE
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Info Note */}
      <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 rounded-md p-3">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
          <div className="text-xs text-yellow-700 dark:text-yellow-400">
            <p className="font-medium">Note:</p>
            <p>Click on the Edit icon to modify parameter values. Changes will take effect after saving.</p>
          </div>
        </div>
      </div>
    </div>
  );
}