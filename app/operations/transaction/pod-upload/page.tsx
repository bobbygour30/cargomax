"use client";

import React, { useState, useRef, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  FolderOpen,
  Upload,
  Search,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  FileImage,
  Image as ImageIcon,
  Loader2,
  RefreshCw,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  FileText,
  AlertCircle,
  Download,
  Grid3x3,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PODFile {
  id: number;
  name: string;
  imageUrl: string;
  size: number;
  type: string;
  uploaded: boolean;
  error?: string;
}

interface GRRecord {
  id: number;
  grNo: string;
  branch: string;
  date: Date;
  files: PODFile[];
  submitted: boolean;
  submittedAt?: Date;
}

// Sample GR data
const sampleGRs = [
  { id: 1, grNo: "GR001", branch: "DELHI", date: new Date("2026-05-28") },
  { id: 2, grNo: "GR002", branch: "MUMBAI", date: new Date("2026-05-29") },
  { id: 3, grNo: "GR003", branch: "BANGALORE", date: new Date("2026-05-30") },
  { id: 4, grNo: "GR004", branch: "CHENNAI", date: new Date("2026-05-31") },
  { id: 5, grNo: "GR005", branch: "KOLKATA", date: new Date("2026-06-01") },
  { id: 6, grNo: "GR006", branch: "DELHI", date: new Date("2026-06-02") },
  { id: 7, grNo: "GR007", branch: "MUMBAI", date: new Date("2026-06-03") },
  { id: 8, grNo: "GR008", branch: "AHMEDABAD", date: new Date("2026-06-04") },
];

export default function PODUpload() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [folderName, setFolderName] = useState<string>("");
  const [grRecords, setGrRecords] = useState<GRRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchBranch, setSearchBranch] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 5;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load GRs on mount
  useEffect(() => {
    loadGRs();
  }, []);

  const loadGRs = () => {
    const initialGRs: GRRecord[] = sampleGRs.map(gr => ({
      id: gr.id,
      grNo: gr.grNo,
      branch: gr.branch,
      date: gr.date,
      files: [],
      submitted: false,
    }));
    setGrRecords(initialGRs);
  };

  const handleFolderSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      
      // Group files by GR number
      const filesByGR = new Map<string, PODFile[]>();
      
      files.forEach((file, index) => {
        const grMatch = file.name.match(/(GR\d+)/i);
        const grNo = grMatch ? grMatch[1] : `GR${String(index + 1).padStart(3, "0")}`;
        
        const podFile: PODFile = {
          id: Date.now() + index,
          name: file.name,
          imageUrl: URL.createObjectURL(file),
          size: file.size,
          type: file.type,
          uploaded: false,
        };
        
        if (!filesByGR.has(grNo)) {
          filesByGR.set(grNo, []);
        }
        filesByGR.get(grNo)!.push(podFile);
      });
      
      // Update grRecords with new files
      setGrRecords(prevRecords => 
        prevRecords.map(record => {
          const newFiles = filesByGR.get(record.grNo);
          if (newFiles) {
            return {
              ...record,
              files: [...record.files, ...newFiles],
            };
          }
          return record;
        })
      );
      
      setFolderName(`${files.length} files selected`);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchTerm("");
    setSearchBranch("all");
    setCurrentPage(1);
  };

  const handleAddFilesToGR = (grNo: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = "image/*";
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        const newFiles: PODFile[] = Array.from(files).map((file, idx) => ({
          id: Date.now() + idx,
          name: file.name,
          imageUrl: URL.createObjectURL(file),
          size: file.size,
          type: file.type,
          uploaded: false,
        }));
        
        setGrRecords(grRecords.map(gr => 
          gr.grNo === grNo 
            ? { ...gr, files: [...gr.files, ...newFiles] }
            : gr
        ));
      }
    };
    input.click();
  };

  const handleRemoveFile = (grNo: string, fileId: number) => {
    setGrRecords(grRecords.map(gr =>
      gr.grNo === grNo
        ? { ...gr, files: gr.files.filter(f => f.id !== fileId) }
        : gr
    ));
  };

  const handleViewImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsImageModalOpen(true);
  };

  const handleSubmitGR = async (grNo: string) => {
    setUploading(true);
    setTimeout(() => {
      setGrRecords(grRecords.map(gr =>
        gr.grNo === grNo
          ? { ...gr, submitted: true, submittedAt: new Date(), files: gr.files.map(f => ({ ...f, uploaded: true })) }
          : gr
      ));
      setUploading(false);
      alert(`GR ${grNo} submitted successfully!`);
    }, 1500);
  };

  const handleSubmitAll = async () => {
    const pendingGRs = grRecords.filter(gr => !gr.submitted && gr.files.length > 0);
    if (pendingGRs.length === 0) {
      alert("No pending GRs to upload");
      return;
    }
    
    setUploading(true);
    setTimeout(() => {
      setGrRecords(grRecords.map(gr =>
        gr.files.length > 0 && !gr.submitted
          ? { ...gr, submitted: true, submittedAt: new Date(), files: gr.files.map(f => ({ ...f, uploaded: true })) }
          : gr
      ));
      setUploading(false);
      alert(`${pendingGRs.length} GR(s) submitted successfully!`);
    }, 2000);
  };

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all uploaded files?")) {
      loadGRs();
      setFolderName("");
      setSearchTerm("");
      setSearchBranch("all");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDownloadSample = () => {
    alert("Sample format downloaded!");
  };

  // Filter records
  const filteredGRs = grRecords.filter(gr => {
    const matchSearch = !searchTerm || gr.grNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchBranch = searchBranch === "all" || gr.branch === searchBranch;
    return matchSearch && matchBranch;
  });

  // Get unique branches for filter
  const uniqueBranches = ["all", ...new Set(grRecords.map(gr => gr.branch))];

  // Stats
  const stats = {
    totalGRs: grRecords.length,
    totalFiles: grRecords.reduce((sum, gr) => sum + gr.files.length, 0),
    submitted: grRecords.filter(g => g.submitted).length,
    pending: grRecords.filter(g => !g.submitted && g.files.length > 0).length,
    empty: grRecords.filter(g => g.files.length === 0).length,
  };

  // Pagination
  const totalPages = Math.ceil(filteredGRs.length / itemsPerPage);
  const paginatedResults = filteredGRs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  return (
    <div className="space-y-4 p-3 md:p-4 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-wrap justify-between items-start gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-blue-600" />
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">POD UPLOAD</h1>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500">
              <span>🏢 Company: GOLDEN ROADWAYS & LOGISTICS PVT LTD</span>
              <span>👤 Login: MAYANK.GRLOGISTICS@GMAIL.COM</span>
              <span>📍 Branch: CORPORATE OFFICE</span>
              <span>📅 Financial Year: 2026-2027</span>
            </div>
          </div>
          <Button onClick={handleDownloadSample} variant="outline" size="sm" className="h-8 text-xs">
            <Download className="mr-1 h-3.5 w-3.5" />
            Sample Format
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-3">
            <p className="text-[10px] opacity-90">Total GRs</p>
            <p className="text-xl font-bold">{stats.totalGRs}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-3">
            <p className="text-[10px] opacity-90">Total Files</p>
            <p className="text-xl font-bold">{stats.totalFiles}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-3">
            <p className="text-[10px] opacity-90">Submitted</p>
            <p className="text-xl font-bold">{stats.submitted}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <CardContent className="p-3">
            <p className="text-[10px] opacity-90">Pending</p>
            <p className="text-xl font-bold">{stats.pending}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-gray-500 to-gray-600 text-white">
          <CardContent className="p-3">
            <p className="text-[10px] opacity-90">Empty</p>
            <p className="text-xl font-bold">{stats.empty}</p>
          </CardContent>
        </Card>
      </div>

      {/* File Upload Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <FolderOpen className="h-4 w-4" />
            Select Folder / Files
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[200px]">
              <Label className="text-xs font-medium">Scan Folder Location</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={folderName}
                  readOnly
                  placeholder="No folder selected"
                  className="h-9 text-sm bg-gray-50"
                />
                <Button
                  onClick={handleFolderSelect}
                  variant="outline"
                  size="default"
                  className="h-9 text-sm"
                >
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Browse
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              <p className="text-[10px] text-gray-500 mt-1">
                Select folder containing POD images (JPG, PNG, PDF)
              </p>
            </div>
            <Button onClick={handleClearAll} variant="outline" className="h-9">
              <RefreshCw className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-[11px] font-semibold flex items-center gap-2 text-gray-700">
            <Search className="h-3.5 w-3.5" />
            Search GRs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-[10px] font-medium">GR Number</Label>
              <Input
                placeholder="Enter GR Number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] font-medium">Branch</Label>
              <select
                value={searchBranch}
                onChange={(e) => setSearchBranch(e.target.value)}
                className="h-9 w-full rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {uniqueBranches.map(branch => (
                  <option key={branch} value={branch}>
                    {branch === "all" ? "All Branches" : branch}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={handleSearch} size="default" className="h-9 bg-blue-600 hover:bg-blue-700">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
              <Button onClick={handleReset} variant="outline" className="h-9">
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Mode Toggle */}
      <div className="flex justify-end gap-2">
        <Button
          onClick={() => setViewMode("list")}
          variant={viewMode === "list" ? "default" : "outline"}
          size="sm"
          className="h-7 text-xs"
        >
          <Table className="h-3.5 w-3.5 mr-1" /> List View
        </Button>
        <Button
          onClick={() => setViewMode("grid")}
          variant={viewMode === "grid" ? "default" : "outline"}
          size="sm"
          className="h-7 text-xs"
        >
          <Grid3x3 className="h-3.5 w-3.5 mr-1" /> Grid View
        </Button>
      </div>

      {/* List View Table */}
      {viewMode === "list" && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Table className="h-3.5 w-3.5 text-gray-500" />
                <h3 className="text-[11px] font-semibold text-gray-800">GR Records List</h3>
              </div>
              <div className="text-[10px] text-gray-500">
                Total: {filteredGRs.length} records
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <div className="min-w-[800px]">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="text-[11px] font-semibold py-2 px-2 w-12 text-center">#</TableHead>
                      <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">GR #</TableHead>
                      <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Branch</TableHead>
                      <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[80px]">Date</TableHead>
                      <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[200px]">Images</TableHead>
                      <TableHead className="text-[11px] font-semibold py-2 px-2 w-24 text-center">Status</TableHead>
                      <TableHead className="text-[11px] font-semibold py-2 px-2 w-32 text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedResults.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          <FileImage className="h-12 w-12 mx-auto mb-3 opacity-30" />
                          No GR records found. Please upload files to continue.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedResults.map((record, idx) => (
                        <TableRow key={record.id} className="hover:bg-gray-50">
                          <TableCell className="py-2 px-2 text-center text-xs">
                            {(currentPage - 1) * itemsPerPage + idx + 1}
                          </TableCell>
                          <TableCell className="py-2 px-2 font-mono font-semibold text-xs">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 text-[11px]">
                              {record.grNo}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-2 px-2 text-xs">{record.branch}</TableCell>
                          <TableCell className="py-2 px-2 text-xs">{format(record.date, "dd-MM-yyyy")}</TableCell>
                          <TableCell className="py-2 px-2">
                            {record.files.length === 0 ? (
                              <span className="text-gray-400 text-[10px]">No images</span>
                            ) : (
                              <div className="flex flex-wrap gap-1">
                                {record.files.slice(0, 3).map((file) => (
                                  <div
                                    key={file.id}
                                    className="relative cursor-pointer"
                                    onClick={() => handleViewImage(file.imageUrl)}
                                  >
                                    <div className="w-10 h-10 rounded border overflow-hidden bg-gray-100">
                                      <img
                                        src={file.imageUrl}
                                        alt={file.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    {file.uploaded && (
                                      <CheckCircle className="absolute -top-1 -right-1 h-3 w-3 text-green-500 bg-white rounded-full" />
                                    )}
                                  </div>
                                ))}
                                {record.files.length > 3 && (
                                  <div className="w-10 h-10 rounded border bg-gray-100 flex items-center justify-center text-[10px] text-gray-500">
                                    +{record.files.length - 3}
                                  </div>
                                )}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="py-2 px-2 text-center">
                            {record.submitted ? (
                              <Badge className="bg-green-100 text-green-700 text-[10px]">Submitted</Badge>
                            ) : record.files.length > 0 ? (
                              <Badge className="bg-yellow-100 text-yellow-700 text-[10px]">Pending</Badge>
                            ) : (
                              <Badge className="bg-gray-100 text-gray-700 text-[10px]">Empty</Badge>
                            )}
                          </TableCell>
                          <TableCell className="py-2 px-2 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Button
                                onClick={() => handleAddFilesToGR(record.grNo)}
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-green-500 hover:text-green-700 hover:bg-green-50"
                                title="Add Files"
                              >
                                <Upload className="h-3.5 w-3.5" />
                              </Button>
                              {record.files.length > 0 && !record.submitted && (
                                <Button
                                  onClick={() => handleSubmitGR(record.grNo)}
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                  title="Submit"
                                  disabled={uploading}
                                >
                                  {uploading ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <CheckCircle className="h-3.5 w-3.5" />
                                  )}
                                </Button>
                              )}
                              {record.files.length > 0 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => record.files.forEach(f => handleViewImage(f.imageUrl))}
                                  className="h-7 w-7 p-0 text-purple-500 hover:text-purple-700 hover:bg-purple-50"
                                  title="View All"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                </Button>
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
              <div className="flex items-center justify-between mt-4">
                <div className="text-[10px] text-gray-500">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredGRs.length)} of {filteredGRs.length} entries
                </div>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="h-7 text-[10px]">
                    <ChevronLeft className="h-3 w-3 mr-1" /> Previous
                  </Button>
                  <span className="px-3 py-1 text-[10px]">Page {currentPage} of {totalPages}</span>
                  <Button variant="outline" size="sm" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="h-7 text-[10px]">
                    Next <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedResults.map((record) => (
            <Card key={record.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <h3 className="font-semibold text-sm">{record.grNo}</h3>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1">{record.branch}</p>
                  </div>
                  {record.submitted ? (
                    <Badge className="bg-green-100 text-green-700 text-[10px]">Submitted</Badge>
                  ) : record.files.length > 0 ? (
                    <Badge className="bg-yellow-100 text-yellow-700 text-[10px]">Pending</Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-700 text-[10px]">Empty</Badge>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {record.files.length === 0 ? (
                      <div className="w-full h-24 bg-gray-100 rounded-md flex items-center justify-center">
                        <FileImage className="h-8 w-8 text-gray-400" />
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-2 w-full">
                        {record.files.slice(0, 3).map((file) => (
                          <div
                            key={file.id}
                            className="relative cursor-pointer aspect-square rounded-md overflow-hidden border bg-gray-100"
                            onClick={() => handleViewImage(file.imageUrl)}
                          >
                            <img
                              src={file.imageUrl}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                            {file.uploaded && (
                              <CheckCircle className="absolute top-1 right-1 h-3 w-3 text-green-500 bg-white rounded-full" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[10px] text-gray-500">
                      {record.files.length} image(s)
                    </span>
                    <div className="flex gap-1">
                      <Button
                        onClick={() => handleAddFilesToGR(record.grNo)}
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-green-500"
                        title="Add Files"
                      >
                        <Upload className="h-3.5 w-3.5" />
                      </Button>
                      {record.files.length > 0 && !record.submitted && (
                        <Button
                          onClick={() => handleSubmitGR(record.grNo)}
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-blue-500"
                          title="Submit"
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Submit All Button */}
      <div className="flex justify-end gap-3 pt-2 border-t">
        <Button
          onClick={handleSubmitAll}
          size="default"
          className="h-9 bg-green-600 hover:bg-green-700"
          disabled={uploading || stats.pending === 0}
        >
          {uploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          SUBMIT & UPLOAD ALL ({stats.pending})
        </Button>
      </div>

      {/* Image Preview Modal */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-[90vw] md:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-base">POD Image Preview</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center py-4">
            {selectedImage && (
              <img
                src={selectedImage}
                alt="POD Preview"
                className="max-w-full max-h-[60vh] object-contain rounded-md"
              />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsImageModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper function for date formatting
function format(date: Date, formatStr: string): string {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}