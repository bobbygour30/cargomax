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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Copy,
  ClipboardPaste,
  Search,
  RefreshCw,
  Check,
  X,
  AlertCircle,
  Database,
  FileText,
  Menu,
  FileSpreadsheet,
  Eye,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuItem {
  id: number;
  moduleName: string;
  menuName: string;
  menuCode: string;
  menuType: string;
  parentMenu?: string;
  url?: string;
  icon?: string;
  sequence?: number;
  selected?: boolean;
}

interface DatabaseOption {
  id: string;
  name: string;
  type: string;
}

const databaseOptions: DatabaseOption[] = [
  { id: "db1", name: "Production Database", type: "PROD" },
  { id: "db2", name: "Development Database", type: "DEV" },
  { id: "db3", name: "Testing Database", type: "TEST" },
  { id: "db4", name: "Backup Database", type: "BACKUP" },
];

const pasteDatabaseOptions: DatabaseOption[] = [
  { id: "db1", name: "Production Database", type: "PROD" },
  { id: "db2", name: "Development Database", type: "DEV" },
  { id: "db3", name: "Testing Database", type: "TEST" },
  { id: "db4", name: "Backup Database", type: "BACKUP" },
];

const menuTypeOptions = [
  { value: "FORM", label: "FORM", icon: FileText },
  { value: "MENU", label: "MENU", icon: Menu },
  { value: "REPORT", label: "REPORT", icon: FileSpreadsheet },
];

// Sample Menu Data
const sampleMenuData: MenuItem[] = [
  { id: 1, moduleName: "Operations", menuName: "Agency Commission Master", menuCode: "OP001", menuType: "FORM" },
  { id: 2, moduleName: "Operations", menuName: "Commission Category Master", menuCode: "OP002", menuType: "FORM" },
  { id: 3, moduleName: "Operations", menuName: "Consignment Charges Master", menuCode: "OP003", menuType: "FORM" },
  { id: 4, moduleName: "Operations", menuName: "Consignor Consignee Master", menuCode: "OP004", menuType: "FORM" },
  { id: 5, moduleName: "Operations", menuName: "Freight On Master", menuCode: "OP005", menuType: "FORM" },
  { id: 6, moduleName: "Operations", menuName: "Godown Master", menuCode: "OP006", menuType: "FORM" },
  { id: 7, moduleName: "Operations", menuName: "Packing Master", menuCode: "OP007", menuType: "FORM" },
  { id: 8, moduleName: "Operations", menuName: "Vehicle Master", menuCode: "OP008", menuType: "FORM" },
  { id: 9, moduleName: "Accounts", menuName: "Customer Master", menuCode: "ACC001", menuType: "FORM" },
  { id: 10, moduleName: "Accounts", menuName: "Vendor Master", menuCode: "ACC002", menuType: "FORM" },
  { id: 11, moduleName: "Accounts", menuName: "Chart of Accounts", menuCode: "ACC003", menuType: "MENU" },
  { id: 12, moduleName: "Reports", menuName: "Daily Sales Report", menuCode: "RPT001", menuType: "REPORT" },
  { id: 13, moduleName: "Reports", menuName: "Pending POD Report", menuCode: "RPT002", menuType: "REPORT" },
  { id: 14, moduleName: "Administrator", menuName: "User Master", menuCode: "ADM001", menuType: "FORM" },
  { id: 15, moduleName: "Administrator", menuName: "Role Master", menuCode: "ADM002", menuType: "FORM" },
];

export default function CopyPasteMenu() {
  const [copyFromDatabase, setCopyFromDatabase] = useState<string>("");
  const [menuType, setMenuType] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [pasteToDatabase, setPasteToDatabase] = useState<string>("");
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const itemsPerPage: number = 10;

  const handleShowMenuList = () => {
    if (!copyFromDatabase) {
      alert("Please select Copy From Database");
      return;
    }
    if (!menuType) {
      alert("Please select Menu Type");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      let filteredData = [...sampleMenuData];
      if (menuType !== "ALL") {
        filteredData = filteredData.filter(item => item.menuType === menuType);
      }
      if (searchTerm) {
        filteredData = filteredData.filter(item =>
          item.menuName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.moduleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.menuCode.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      setMenuItems(filteredData);
      setSelectedItems(new Set());
      setSelectAll(false);
      setLoading(false);
      setCurrentPage(1);
    }, 500);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems(new Set());
    } else {
      const allIds = new Set(paginatedItems.map(item => item.id));
      setSelectedItems(allIds);
    }
    setSelectAll(!selectAll);
  };

  const handleSelectItem = (id: number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
    setSelectAll(newSelected.size === paginatedItems.length && paginatedItems.length > 0);
  };

  const handlePaste = () => {
    if (!pasteToDatabase) {
      alert("Please select Paste To Database");
      return;
    }
    if (selectedItems.size === 0) {
      alert("Please select at least one menu item to paste");
      return;
    }

    const selectedMenuNames = menuItems.filter(item => selectedItems.has(item.id)).map(item => item.menuName);
    if (confirm(`Are you sure you want to paste ${selectedItems.size} menu item(s) to ${pasteToDatabase}?`)) {
      alert(`${selectedItems.size} menu item(s) pasted successfully to ${pasteToDatabase}!`);
    }
  };

  const handleClear = () => {
    setCopyFromDatabase("");
    setMenuType("");
    setSearchTerm("");
    setMenuItems([]);
    setPasteToDatabase("");
    setSelectedItems(new Set());
    setSelectAll(false);
    setCurrentPage(1);
  };

  const handlePreview = () => {
    if (selectedItems.size === 0) {
      alert("Please select at least one menu item to preview");
      return;
    }
    setShowPreviewModal(true);
  };

  const toggleModuleExpand = (moduleName: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleName)) {
      newExpanded.delete(moduleName);
    } else {
      newExpanded.add(moduleName);
    }
    setExpandedModules(newExpanded);
  };

  const filteredItems = menuItems;
  const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  const getMenuTypeIcon = (type: string) => {
    const option = menuTypeOptions.find(opt => opt.value === type);
    if (option) {
      const Icon = option.icon;
      return <Icon className="h-3.5 w-3.5" />;
    }
    return <FileText className="h-3.5 w-3.5" />;
  };

  const getMenuTypeColor = (type: string) => {
    switch (type) {
      case "FORM": return "bg-blue-100 text-blue-700";
      case "MENU": return "bg-purple-100 text-purple-700";
      case "REPORT": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  // Group items by module for preview
  const groupedByModule = selectedItems.size > 0
    ? menuItems.filter(item => selectedItems.has(item.id)).reduce((acc, item) => {
        if (!acc[item.moduleName]) acc[item.moduleName] = [];
        acc[item.moduleName].push(item);
        return acc;
      }, {} as Record<string, MenuItem[]>)
    : {};

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">COPY PASTE MENU</h1>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[10px] md:text-xs text-muted-foreground">
          <span>Company : GOLDEN ROADWAYS & LOGISTICS PVT LTD</span>
          <span>Login By : MAYANK.GRLOGISTICS@GMAIL.COM</span>
          <span>Login Branch : CORPORATE OFFICE</span>
          <span>Financial Year : 2026-2027</span>
        </div>
      </div>

      {/* Copy From Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 border rounded-md bg-muted/20">
        <div className="space-y-1">
          <Label className="text-xs">Copy From Database <span className="text-red-500">*</span></Label>
          <Select value={copyFromDatabase} onValueChange={setCopyFromDatabase}>
            <SelectTrigger className="h-8 text-xs">
              <Database className="mr-1 h-3 w-3" />
              <SelectValue placeholder="SELECT DATABASE" />
            </SelectTrigger>
            <SelectContent>
              {databaseOptions.map(opt => (
                <SelectItem key={opt.id} value={opt.id} className="text-xs">
                  {opt.name} ({opt.type})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-xs">Menu Type <span className="text-red-500">*</span></Label>
          <Select value={menuType} onValueChange={setMenuType}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="SELECT MENU TYPE" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL" className="text-xs">ALL</SelectItem>
              {menuTypeOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <Button onClick={handleShowMenuList} size="sm" className="h-8 text-xs w-full" disabled={loading}>
            {loading ? <RefreshCw className="mr-1 h-3.5 w-3.5 animate-spin" /> : <Search className="mr-1 h-3.5 w-3.5" />}
            SHOW MENU LIST
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search by Module Name, Menu Name or Menu Code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>
        <Button onClick={handleShowMenuList} variant="outline" size="sm" className="h-8 text-xs">
          <Search className="mr-1 h-3.5 w-3.5" />
          SEARCH
        </Button>
      </div>

      {/* Menu List Table */}
      <div className="rounded-md border overflow-x-auto">
        <div className="min-w-[700px]">
          <Table className="text-xs">
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-12 text-center">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="h-3.5 w-3.5"
                    disabled={menuItems.length === 0}
                  />
                </TableHead>
                <TableHead className="w-12 text-center">S#</TableHead>
                <TableHead>Module Name</TableHead>
                <TableHead>Menu Name</TableHead>
                <TableHead>Menu Code</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {menuItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                    No menu items found. Click SHOW MENU LIST to load data.
                  </TableCell>
                </TableRow>
              ) : paginatedItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No matching records found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedItems.map((item, idx) => (
                  <TableRow key={item.id} className="hover:bg-muted/30">
                    <TableCell className="text-center">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                        className="h-3.5 w-3.5"
                      />
                    </TableCell>
                    <TableCell className="text-center">{(currentPage - 1) * itemsPerPage + idx + 1}</TableCell>
                    <TableCell className="font-medium">{item.moduleName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={cn("p-0.5 rounded", getMenuTypeColor(item.menuType))}>
                          {getMenuTypeIcon(item.menuType)}
                        </span>
                        <span>{item.menuName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">{item.menuCode}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {menuItems.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="text-xs text-muted-foreground">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, menuItems.length)} of {menuItems.length} entries
          </div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="h-7 text-xs">Previous</Button>
            <span className="px-3 py-1 text-xs bg-muted rounded-md">Page {currentPage} of {totalPages}</span>
            <Button variant="outline" size="sm" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="h-7 text-xs">Next</Button>
          </div>
        </div>
      )}

      {/* Items Per Page */}
      {menuItems.length > 0 && (
        <div className="text-right text-xs text-muted-foreground">
          items per page: {itemsPerPage}
        </div>
      )}

      {/* Paste To Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 border rounded-md bg-muted/20 mt-4">
        <div className="space-y-1">
          <Label className="text-xs">Paste To Database <span className="text-red-500">*</span></Label>
          <Select value={pasteToDatabase} onValueChange={setPasteToDatabase}>
            <SelectTrigger className="h-8 text-xs">
              <Database className="mr-1 h-3 w-3" />
              <SelectValue placeholder="SELECT DATABASE" />
            </SelectTrigger>
            <SelectContent>
              {pasteDatabaseOptions.map(opt => (
                <SelectItem key={opt.id} value={opt.id} className="text-xs">
                  {opt.name} ({opt.type})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end gap-2">
          <Button onClick={handlePreview} variant="outline" size="sm" className="h-8 text-xs" disabled={selectedItems.size === 0}>
            <Eye className="mr-1 h-3.5 w-3.5" />
            PREVIEW
          </Button>
          <Button onClick={handlePaste} size="sm" className="h-8 text-xs bg-green-600 hover:bg-green-700" disabled={selectedItems.size === 0}>
            <ClipboardPaste className="mr-1 h-3.5 w-3.5" />
            PASTE
          </Button>
          <Button onClick={handleClear} variant="outline" size="sm" className="h-8 text-xs">
            <RefreshCw className="mr-1 h-3.5 w-3.5" />
            CLEAR
          </Button>
        </div>
      </div>

      {/* Selection Summary */}
      {selectedItems.size > 0 && (
        <div className="bg-blue-50 dark:bg-blue-950/20 rounded-md p-2 text-center">
          <p className="text-xs text-blue-700 dark:text-blue-400">
            <Check className="inline h-3.5 w-3.5 mr-1" />
            {selectedItems.size} menu item(s) selected for paste operation
          </p>
        </div>
      )}

      {/* Preview Modal */}
      <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
        <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col p-0">
          <DialogHeader className="px-4 pt-4 pb-2 border-b">
            <DialogTitle className="text-lg flex items-center gap-2">
              <ClipboardPaste className="h-5 w-5" />
              Preview Selected Menus
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto px-4 py-3">
            <div className="mb-3 p-2 bg-muted/30 rounded-md">
              <p className="text-xs">
                <strong>Total Selected:</strong> {selectedItems.size} menu(s)
              </p>
              <p className="text-xs">
                <strong>Target Database:</strong> {pasteToDatabase ? pasteDatabaseOptions.find(opt => opt.id === pasteToDatabase)?.name : "Not selected"}
              </p>
            </div>
            <div className="space-y-3">
              {Object.entries(groupedByModule).map(([moduleName, items]) => (
                <div key={moduleName} className="border rounded-md">
                  <button
                    onClick={() => toggleModuleExpand(moduleName)}
                    className="w-full flex items-center justify-between p-2 bg-muted/30 hover:bg-muted/50 rounded-t-md"
                  >
                    <div className="flex items-center gap-2">
                      {expandedModules.has(moduleName) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      <span className="font-semibold text-sm">{moduleName}</span>
                      <span className="text-xs text-muted-foreground">({items.length} menus)</span>
                    </div>
                  </button>
                  {expandedModules.has(moduleName) && (
                    <div className="p-2">
                      <Table className="text-xs">
                        <TableHeader>
                          <TableRow>
                            <TableHead>S#</TableHead>
                            <TableHead>Menu Name</TableHead>
                            <TableHead>Menu Code</TableHead>
                            <TableHead>Type</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {items.map((item, idx) => (
                            <TableRow key={item.id}>
                              <TableCell>{idx + 1}</TableCell>
                              <TableCell>{item.menuName}</TableCell>
                              <TableCell className="font-mono">{item.menuCode}</TableCell>
                              <TableCell>
                                <span className={cn("px-2 py-0.5 rounded-full text-[10px]", getMenuTypeColor(item.menuType))}>
                                  {item.menuType}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <DialogFooter className="px-4 py-3 border-t">
            <Button variant="outline" size="sm" onClick={() => setShowPreviewModal(false)}>CLOSE</Button>
            <Button onClick={handlePaste} size="sm" className="bg-green-600">PASTE NOW</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}