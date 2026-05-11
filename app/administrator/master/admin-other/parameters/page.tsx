"use client";

import React, { useState, useEffect } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Check,
  X,
  AlertCircle,
  Eye,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Parameter {
  id: number;
  variableName: string;
  description: string;
  value: string;
  category: string;
  module: string;
  isEditing?: boolean;
}

// Module Options
const moduleOptions = [
  { value: "ACCOUNTS", label: "ACCOUNTS" },
  { value: "ADMINISTRATOR", label: "ADMINISTRATOR" },
  { value: "INVENTORY", label: "INVENTORY" },
  { value: "OPERATIONS", label: "OPERATIONS" },
];

// Category Options based on Module
const categoryOptions: Record<string, string[]> = {
  ACCOUNTS: [
    "Billing Configuration",
    "CUSTOMER MASTER",
    "DAY CLOSE",
    "General Configurations",
    "GROUPING",
    "GST",
    "LEDGER",
    "Ledger Configurations",
    "LHC CONFIGURATION",
    "MONEY RECEIPT",
    "SUB LEDGER",
    "SUB LEDGER CONFIGURATION",
    "Vendor Bill Configuration",
    "VENDOR MASTER",
    "VENDORGROUP",
    "VOUCHER PRINTING CONFIGURATION",
    "YESNO",
  ],
  ADMINISTRATOR: [
    "BILLING CONFIGURATION",
    "Booking configuration",
    "eWaybill Configuration",
    "General Configurations",
    "GR PRINTING Configuration",
    "Mail Configuration",
    "SETTINGS",
    "Vendor Bill Configuration",
    "YESNO",
  ],
  INVENTORY: [], // Empty as per requirement
  OPERATIONS: [
    "Arrival configuration",
    "Booking configuration",
    "CONSIGNOR CONSIGNEE MASTER",
    "CUSTOMER MASTER",
    "DELIVERY Configuration",
    "DELIVERY RUN SHEET",
    "GENERAL CONFIGURATION",
    "GR PRINTING Configuration",
    "Lorry Hire Challan Configuration",
    "MANIFEST",
    "SUB LEDGER CONFIGURATION",
    "VENDOR",
    "VENDOR GROUP",
  ],
};

// Sample Parameters Data
const sampleParameters: Parameter[] = [
  { id: 1, variableName: "GST_RATE_CGST", description: "CGST Rate (%)", value: "2.5", category: "GST", module: "ACCOUNTS" },
  { id: 2, variableName: "GST_RATE_SGST", description: "SGST Rate (%)", value: "2.5", category: "GST", module: "ACCOUNTS" },
  { id: 3, variableName: "GST_RATE_IGST", description: "IGST Rate (%)", value: "5", category: "GST", module: "ACCOUNTS" },
  { id: 4, variableName: "TDS_RATE", description: "TDS Rate (%)", value: "10", category: "General Configurations", module: "ACCOUNTS" },
  { id: 5, variableName: "EMAIL_HOST", description: "SMTP Server Host", value: "smtp.gmail.com", category: "Mail Configuration", module: "ADMINISTRATOR" },
  { id: 6, variableName: "EMAIL_PORT", description: "SMTP Port", value: "587", category: "Mail Configuration", module: "ADMINISTRATOR" },
  { id: 7, variableName: "EWAYBILL_API", description: "E-Way Bill API URL", value: "https://ewaybill.gst.gov.in", category: "eWaybill Configuration", module: "ADMINISTRATOR" },
  { id: 8, variableName: "GR_PRINT_TEMPLATE", description: "GR Print Template Name", value: "Standard", category: "GR PRINTING Configuration", module: "OPERATIONS" },
  { id: 9, variableName: "MANIFEST_GENERATION", description: "Auto Generate Manifest", value: "Yes", category: "MANIFEST", module: "OPERATIONS" },
  { id: 10, variableName: "LHC_FREIGHT_RATE", description: "LHC Freight Rate per Km", value: "45", category: "Lorry Hire Challan Configuration", module: "OPERATIONS" },
];

export default function ParameterConfiguration() {
  const [selectedModule, setSelectedModule] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [filteredParameters, setFilteredParameters] = useState<Parameter[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmConfigured, setConfirmConfigured] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 10;

  const handleModuleChange = (value: string) => {
    setSelectedModule(value);
    setSelectedCategory("");
    setParameters([]);
    setFilteredParameters([]);
  };

  const handleShowParameters = () => {
    if (!selectedModule) {
      alert("Please select Module");
      return;
    }
    if (!selectedCategory && categoryOptions[selectedModule]?.length > 0) {
      alert("Please select Category");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      let filtered = sampleParameters.filter(p => p.module === selectedModule);
      if (selectedCategory) {
        filtered = filtered.filter(p => p.category === selectedCategory);
      }
      setParameters(filtered);
      setFilteredParameters(filtered);
      setCurrentPage(1);
      setLoading(false);
    }, 300);
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredParameters(parameters);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = parameters.filter(p =>
        p.variableName.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.value.toLowerCase().includes(term)
      );
      setFilteredParameters(filtered);
    }
    setCurrentPage(1);
  };

  const handleUpdateValue = (id: number, newValue: string) => {
    setParameters(parameters.map(p => p.id === id ? { ...p, value: newValue, isEditing: false } : p));
    setFilteredParameters(filteredParameters.map(p => p.id === id ? { ...p, value: newValue, isEditing: false } : p));
  };

  const handleEdit = (id: number) => {
    setParameters(parameters.map(p => p.id === id ? { ...p, isEditing: true } : p));
    setFilteredParameters(filteredParameters.map(p => p.id === id ? { ...p, isEditing: true } : p));
  };

  const handleCancelEdit = (id: number) => {
    setParameters(parameters.map(p => p.id === id ? { ...p, isEditing: false } : p));
    setFilteredParameters(filteredParameters.map(p => p.id === id ? { ...p, isEditing: false } : p));
  };

  const handleSaveParameter = (id: number, currentValue: string) => {
    // In real app, save to backend
    handleUpdateValue(id, currentValue);
    alert("Parameter updated successfully!");
  };

  const getCategoryOptions = () => {
    if (!selectedModule) return [];
    return categoryOptions[selectedModule] || [];
  };

  const paginatedParameters = filteredParameters.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredParameters.length / itemsPerPage);
  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  const handleClear = () => {
    setSelectedModule("");
    setSelectedCategory("");
    setParameters([]);
    setFilteredParameters([]);
    setSearchTerm("");
    setConfirmConfigured(false);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">PARAMETER CONFIGURATION</h1>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[10px] md:text-xs text-muted-foreground">
          <span>Company : GOLDEN ROADWAYS & LOGISTICS PVT LTD</span>
          <span>Login By : MAYANK.GRLOGISTICS@GMAIL.COM</span>
          <span>Login Branch : CORPORATE OFFICE</span>
          <span>Financial Year : 2026-2027</span>
        </div>
      </div>

      {/* Filter Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Parameter Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label className="text-xs">Select Module</Label>
              <Select value={selectedModule} onValueChange={handleModuleChange}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select Module" />
                </SelectTrigger>
                <SelectContent>
                  {moduleOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Select Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory} disabled={!selectedModule}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder={selectedModule ? "Select Category" : "Select Module First"} />
                </SelectTrigger>
                <SelectContent>
                  {getCategoryOptions().map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleShowParameters} size="sm" className="h-8 text-xs w-full" disabled={loading}>
                {loading ? <RefreshCw className="mr-1 h-3.5 w-3.5 animate-spin" /> : <Eye className="mr-1 h-3.5 w-3.5" />}
                SHOW PARAMETERS
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Table Section */}
      {parameters.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Parameters List</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-2">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5" />
                <Input
                  placeholder="Search by Variable Name, Description or Value..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 h-8 text-xs"
                />
              </div>
              <Button onClick={handleSearch} size="sm" className="h-8 text-xs">
                <Search className="mr-1 h-3.5 w-3.5" />
                SEARCH
              </Button>
            </div>

            {/* Parameters Table */}
            <div className="rounded-md border overflow-x-auto">
              <div className="min-w-[600px]">
                <Table className="text-xs">
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-12 text-center">S#</TableHead>
                      <TableHead>Variable Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead className="w-24 text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedParameters.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No parameters found for the selected module and category.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedParameters.map((param, idx) => (
                        <TableRow key={param.id} className="hover:bg-muted/30">
                          <TableCell className="text-center">{(currentPage - 1) * itemsPerPage + idx + 1}</TableCell>
                          <TableCell className="font-mono font-medium">{param.variableName}</TableCell>
                          <TableCell>{param.description}</TableCell>
                          <TableCell>
                            {param.isEditing ? (
                              <div className="flex gap-2">
                                <Input
                                  value={param.value}
                                  onChange={(e) => {
                                    const newParams = parameters.map(p =>
                                      p.id === param.id ? { ...p, value: e.target.value } : p
                                    );
                                    setParameters(newParams);
                                    setFilteredParameters(newParams.filter(p => 
                                      p.variableName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                      p.value.toLowerCase().includes(searchTerm.toLowerCase())
                                    ));
                                  }}
                                  className="h-7 w-32 text-xs"
                                  autoFocus
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleSaveParameter(param.id, param.value)}
                                  className="h-7 w-7 p-0 text-green-500"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCancelEdit(param.id)}
                                  className="h-7 w-7 p-0 text-red-500"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between gap-2">
                                <span className="px-2 py-1 bg-muted/30 rounded font-mono">
                                  {param.value}
                                </span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {!param.isEditing && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(param.id)}
                                className="h-6 w-6 p-0 text-blue-500"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                            )}
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
              <div className="flex justify-center gap-1">
                <Button variant="outline" size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="h-7 text-xs">Previous</Button>
                <span className="px-3 py-1 text-xs bg-muted rounded-md">Page {currentPage} of {totalPages}</span>
                <Button variant="outline" size="sm" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="h-7 text-xs">Next</Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Confirmation Checkbox and Clear Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border rounded-md bg-muted/20">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={confirmConfigured}
            onChange={(e) => setConfirmConfigured(e.target.checked)}
            className="h-4 w-4"
            id="confirmConfig"
          />
          <Label htmlFor="confirmConfig" className="text-sm cursor-pointer font-medium">
            I Confirm All Parameter Configured
          </Label>
        </div>
        <Button onClick={handleClear} variant="outline" size="sm" className="h-8 text-xs">
          <RefreshCw className="mr-1 h-3.5 w-3.5" />
          CLEAR
        </Button>
      </div>

      {/* Info Note */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 rounded-md p-3">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
          <div className="text-xs text-blue-700 dark:text-blue-400">
            <p className="font-medium">Note:</p>
            <ul className="list-disc list-inside mt-1 space-y-0.5">
              <li>Select Module and Category to view parameters</li>
              <li>Click on the edit icon to modify parameter values</li>
              <li>Changed parameters will take effect after saving</li>
              <li>Confirm the configuration checkbox before proceeding</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}