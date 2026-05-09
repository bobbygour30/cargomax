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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
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
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

// ==================== DATA MODELS ====================
interface Parameter {
  id: number;
  variableName: string;
  description: string;
  value: string;
  menuName: string;
  status: "Pending for Verification" | "Configured" | "Not Configured";
  // Additional fields for specific tabs
  yesNo?: string;
  ledgerName?: string;
  chargesName?: string;
  challanExpenseName?: string;
  accountGroupName?: string;
  invoiceName?: string;
  stationeryGroupName?: string;
  goodsGroupName?: string;
  vendorName?: string;
  costCenterName?: string;
  hrField?: string;
  stationeryItemName?: string;
  miscField?: string;
}

// ==================== MOCK DATA FOR EACH TAB ====================

// 1. Yes No Tab
const yesNoData: Parameter[] = [
  { id: 1, variableName: "GENABLECNGEONOPGATEPASS", description: "-ENABLE CONSIGNEE ON OP GATEPASS", value: "N", yesNo: "N", menuName: "Gatepass", status: "Pending for Verification" },
  { id: 2, variableName: "GSHOWCUSTLEDGERINTRIPEXPENSE", description: "-SHOW CUSTOMER LEDGER IN TRIP EXPENS", value: "N", yesNo: "N", menuName: "Trip Expense", status: "Pending for Verification" },
  { id: 3, variableName: "GAADHARMANDATORYINEMPLOYEEMAST", description: "AADHAR MANDATORY IN EMPLOYEE MASTER", value: "Y", yesNo: "Y", menuName: "Employee Master", status: "Pending for Verification" },
  { id: 4, variableName: "GACCDIVISIONAPPLICABLE", description: "ACCOUNT DIVISION APPLICABLE", value: "N", yesNo: "N", menuName: "Accounts", status: "Pending for Verification" },
  { id: 5, variableName: "GADADVANCETHROUGHUPIONOPENTRIP", description: "ADD ADVANCE THROUGH UPI ON OPEN TRIP", value: "N", yesNo: "N", menuName: "Open Trip", status: "Pending for Verification" },
  { id: 6, variableName: "GADDDOUMENTSHEETINGSTRONERPT", description: "ADD DOCUMENT SHEET IN GST R1 REPORT", value: "N", yesNo: "N", menuName: "GST Report", status: "Pending for Verification" },
  { id: 7, variableName: "GSHOWSEARCHLISTATUSINCUSTMAST", description: "ADD STATUS FILTER IN CUSTOMER MASTER SEACH LIST", value: "N", yesNo: "N", menuName: "Customer Master", status: "Pending for Verification" },
  { id: 8, variableName: "GALIASNAMEMANDATORY", description: "ALIAS NAME MANDATROY IN MODULES", value: "N", yesNo: "N", menuName: "Modules", status: "Pending for Verification" },
  { id: 9, variableName: "GALLOWARRIVALATSAMEASBRANCHLM", description: "ALLOW ARRIVAL AT SAME AS BRANCH IN LOCAL MF", value: "N", yesNo: "N", menuName: "Local Manifest", status: "Pending for Verification" },
];

// 2. Ledger Tab
const ledgerData: Parameter[] = [
  { id: 1, variableName: "GADVANCEPAYMENTH2HLEDCODE", description: "ADVANCE PAYMENT H2H LEDGER CODE", value: "XXXXXXXXXX", ledgerName: "", menuName: "Payment", status: "Not Configured" },
  { id: 2, variableName: "GBALANCEPAYMENTH2HLEDCODE", description: "BALANCE PAYMENT H2H LEDGER CODE", value: "XXXXXXXXXX", ledgerName: "", menuName: "Payment", status: "Not Configured" },
  { id: 3, variableName: "GCGSTOUTWARDLEDCODE", description: "CGST OUTWARD LEDGER CODE", value: "0000004848", ledgerName: "GST - CENTRAL GOODS AND SERVICE TAX - ( CGST)", menuName: "GST", status: "Pending for Verification" },
  { id: 4, variableName: "GCROSSINGFREIGHTLEDCODE", description: "CROSSING FREIGHT LEDGER CODE", value: "XXXXXXXXXX", ledgerName: "", menuName: "Crossing", status: "Not Configured" },
  { id: 5, variableName: "GCROSSINGKATLEDCODE", description: "CROSSING KAT LEDGER CODE", value: "XXXXXXXXXX", ledgerName: "", menuName: "Crossing", status: "Not Configured" },
];

// 3. Additional GR Charges Tab
const additionalGRData: Parameter[] = [
  { id: 1, variableName: "GADDITIONALGRCHARGES", description: "Additional GR Charges Code", value: "XXXXX", chargesName: "Extra Charge", menuName: "GR Booking", status: "Not Configured" },
  { id: 2, variableName: "GGREXTRAITEMCODE", description: "GR Extra Item Code", value: "A0105", chargesName: "Extra Item", menuName: "GR Booking", status: "Pending for Verification" },
];

// 4. Challan Expense Tab
const challanExpenseData: Parameter[] = [
  { id: 1, variableName: "GLHCRECOVEREXPENSECODE", description: "LHC RECOVERY EXPENSE CODE", value: "XXXXX", challanExpenseName: "Recovery Expense", menuName: "LHC", status: "Not Configured" },
];

// 5. Account Group Tab
const accountGroupData: Parameter[] = [
  { id: 1, variableName: "GBANKACCOUNTGROUPCODE", description: "BANK ACCOUNT GROUP CODE", value: "AS001", accountGroupName: "Bank Accounts", menuName: "Accounts", status: "Configured" },
  { id: 2, variableName: "GCASHBANKGROUPCODE", description: "CASH / BANK GROUP CODE", value: "AS002", accountGroupName: "Cash & Bank", menuName: "Accounts", status: "Configured" },
];

// 6. Invoice Setup Tab
const invoiceSetupData: Parameter[] = [
  { id: 1, variableName: "GCGSTINVOICECODE", description: "CGST INVOICE CODE", value: "14", invoiceName: "CGST", menuName: "Invoice", status: "Pending for Verification" },
  { id: 2, variableName: "GIGSTINVOICECODE", description: "IGST INVOICE CODE", value: "01", invoiceName: "IGST", menuName: "Invoice", status: "Pending for Verification" },
  { id: 3, variableName: "GSGSTINVOICECODE", description: "SGST INVOICE CODE", value: "04", invoiceName: "SGST", menuName: "Invoice", status: "Pending for Verification" },
];

// 7. Stationery Group Tab
const stationeryGroupData: Parameter[] = [
  { id: 1, variableName: "GSTATIONERYITEMGROUPCODE", description: "STATIONERY ITEM GROUPCODE IN MATERIALMAST", value: "4", stationeryGroupName: "Stationery Items", menuName: "Material Master", status: "Pending for Verification" },
];

// 8. Goods Group Tab
const goodsGroupData: Parameter[] = [
  { id: 1, variableName: "GDEFAULTGOODSCODEINBOOKING", description: "DEFAULT GOODS CODE IN BOOKING", value: "XXXXX", goodsGroupName: "General Goods", menuName: "Booking", status: "Pending for Verification" },
];

// 9. Vendor Group Tab
const vendorGroupData: Parameter[] = [
  { id: 1, variableName: "GATTACHEDLABOURVENDORGROUPCODE", description: "ATTACHED LABOUR VENDOR GROUP CODE", value: "XXXXX", vendorName: "Attached Labour", menuName: "Vendor", status: "Not Configured" },
  { id: 2, variableName: "GDIRECTLABOURVENDORGROUPCODE", description: "DIRECT LABOUR VENDOR GROUP CODE", value: "XXXXX", vendorName: "Direct Labour", menuName: "Vendor", status: "Not Configured" },
  { id: 3, variableName: "GFORWARDERVENDGROUPCODE", description: "FORWARDER VENDOR GROUP CODE", value: "XXXXX", vendorName: "Forwarder", menuName: "Vendor", status: "Not Configured" },
  { id: 4, variableName: "GMARKETLABOURVENDORGROUPCODE", description: "MARKET LABOUR VENDOR GROUP CODE", value: "XXXXX", vendorName: "Market Labour", menuName: "Vendor", status: "Not Configured" },
  { id: 5, variableName: "GOWNERVEHICLEVENDORGROUPCODE", description: "OWNER VEHICLE VENDOR GROUP CODE", value: "XXXXX", vendorName: "Owner Vehicle", menuName: "Vendor", status: "Not Configured" },
];

// 10. Cost Center Group Tab
const costCenterGroupData: Parameter[] = [
  { id: 1, variableName: "GDRIVERCOSTCENTREGROUPCODE", description: "DRIVER COST CENTRE GROUP MASTER CODE", value: "A0007", costCenterName: "Driver Cost", menuName: "Cost Center", status: "Configured" },
  { id: 2, variableName: "GVEHICLECOSTCENTREGROUPCODE", description: "VEHICLE COST CENTRE GROUP MASTER CODE", value: "A0001", costCenterName: "Vehicle Cost", menuName: "Cost Center", status: "Configured" },
];

// 11. HR Tab
const hrData: Parameter[] = [
  { id: 1, variableName: "GBRANCHMANAGERDESIGNATIONID", description: "BRANCH MANAGER DESIGNATION ID", value: "0", hrField: "Designation", menuName: "HR", status: "Not Configured" },
  { id: 2, variableName: "GMANAGERDESIGNATIONID", description: "MANAGER DESIGNATION ID", value: "0", hrField: "Designation", menuName: "HR", status: "Not Configured" },
  { id: 3, variableName: "GDRIVERDESIGNATIONIDSTR", description: "DRIVER EMPLOYEE DESIGNATION ID COMMA SEPERATE", value: "0", hrField: "Designation", menuName: "HR", status: "Not Configured" },
];

// 12. Stationery Item Tab
const stationeryItemData: Parameter[] = [
  { id: 1, variableName: "GGRITEMCODE", description: "GR ITEM CODE IN STATIONERY", value: "A0001", stationeryItemName: "GR BOOK", menuName: "Stationery", status: "Pending for Verification" },
  { id: 2, variableName: "ggritemgroupcode", description: "GR ITEM GROUP CODE", value: "A0001", stationeryItemName: "GR BOOK", menuName: "Stationery", status: "Pending for Verification" },
];

// 13. Miscellaneous Tab
const miscellaneousData: Parameter[] = [
  { id: 1, variableName: "GACCOUNTINGBALANCESETUP", description: "ACCOUNTING BALANCE SETUP", value: "EACH YEAR", miscField: "", menuName: "Accounts", status: "Pending for Verification" },
  { id: 2, variableName: "AGENCYCOMMISSIONDLVANDCOLLCODE", description: "AGENCY COMMISSION DELIVERY AND COLL ITEM CODE", value: "3", miscField: "", menuName: "Commission", status: "Configured" },
  { id: 3, variableName: "AGENCYCOMMISSIONLABOURCHGCODE", description: "AGENCY COMMISSION LABOUR CHARGE ITEM CODE", value: "6", miscField: "", menuName: "Commission", status: "Configured" },
  { id: 4, variableName: "AGENCYCOMMISSIONITEMCODE", description: "AGENCY COMMISSION MATERIAL ITEM CODE", value: "2", miscField: "", menuName: "Commission", status: "Configured" },
  { id: 5, variableName: "GCGSTCLIENTINVCODE", description: "CGST CLIENT INVOICE CODE", value: "XX", miscField: "", menuName: "Invoice", status: "Pending for Verification" },
  { id: 6, variableName: "GCREDITNOTEWRITEOFFREASONID", description: "CREDIT NOTE WRITEOFF REASON ID", value: "0", miscField: "", menuName: "Credit Note", status: "Pending for Verification" },
];

// 14. ALL Tab (merge all above)
const allData: Parameter[] = [
  ...yesNoData, ...ledgerData, ...additionalGRData, ...challanExpenseData,
  ...accountGroupData, ...invoiceSetupData, ...stationeryGroupData,
  ...goodsGroupData, ...vendorGroupData, ...costCenterGroupData,
  ...hrData, ...stationeryItemData, ...miscellaneousData
];

// Tab configuration
const tabsConfig = [
  { id: "yesno", label: "Yes No", data: yesNoData, specificField: "yesNo", header: "Yes/No" },
  { id: "ledger", label: "Ledger", data: ledgerData, specificField: "ledgerName", header: "Ledger Name" },
  { id: "additional-gr", label: "Additional GR Charges", data: additionalGRData, specificField: "chargesName", header: "Charges Name" },
  { id: "challan-expense", label: "Challan Expense", data: challanExpenseData, specificField: "challanExpenseName", header: "Challan Expense Name" },
  { id: "account-group", label: "Account Group", data: accountGroupData, specificField: "accountGroupName", header: "Account Group Name" },
  { id: "invoice-setup", label: "Invoice Setup", data: invoiceSetupData, specificField: "invoiceName", header: "Invoice Name" },
  { id: "stationery-group", label: "Stationery Group", data: stationeryGroupData, specificField: "stationeryGroupName", header: "Stationery Group Name" },
  { id: "goods-group", label: "Goods Group", data: goodsGroupData, specificField: "goodsGroupName", header: "Goods Group Name" },
  { id: "vendor-group", label: "Vendor Group", data: vendorGroupData, specificField: "vendorName", header: "Vendor Name" },
  { id: "cost-center-group", label: "Cost Center Group", data: costCenterGroupData, specificField: "costCenterName", header: "Cost Center Name" },
  { id: "hr", label: "HR", data: hrData, specificField: "hrField", header: "HR Field" },
  { id: "stationery-item", label: "Stationery Item", data: stationeryItemData, specificField: "stationeryItemName", header: "Stationery Item Name" },
  { id: "misc", label: "Miscellaneous", data: miscellaneousData, specificField: "miscField", header: "Field" },
  { id: "all", label: "ALL", data: allData, specificField: null, header: "Additional Info" },
];

export default function ParameterSetup() {
  const [activeTab, setActiveTab] = useState<string>("yesno");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredData, setFilteredData] = useState<Parameter[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState<boolean>(false);
  const [selectedParam, setSelectedParam] = useState<Parameter | null>(null);
  const [verifyValue, setVerifyValue] = useState<string>("");
  const itemsPerPage: number = 10;

  // Get current tab's data
  const getCurrentTabData = () => {
    const tab = tabsConfig.find(t => t.id === activeTab);
    return tab ? tab.data : [];
  };

  // Filter data based on search term
  useEffect(() => {
    let data = getCurrentTabData();
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      data = data.filter(item =>
        item.variableName.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        item.value.toLowerCase().includes(term)
      );
    }
    setFilteredData(data);
    setCurrentPage(1);
  }, [activeTab, searchTerm]);

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleVerify = (param: Parameter) => {
    setSelectedParam(param);
    setVerifyValue(param.value);
    setIsVerifyModalOpen(true);
  };

  const handleUpdateValue = () => {
    if (selectedParam) {
      alert(`Parameter ${selectedParam.variableName} updated to ${verifyValue}`);
      setIsVerifyModalOpen(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending for Verification":
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-[10px]"><AlertCircle className="h-2.5 w-2.5" /> Pending</span>;
      case "Configured":
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px]"><CheckCircle className="h-2.5 w-2.5" /> Configured</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px]"><XCircle className="h-2.5 w-2.5" /> Not Configured</span>;
    }
  };

  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  const currentTab = tabsConfig.find(t => t.id === activeTab);
  const specificHeader = currentTab?.header || "Additional Info";
  const specificField = currentTab?.specificField;

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">PARAMETER SETUP</h1>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[10px] md:text-xs text-muted-foreground">
          <span>Company : GOLDEN ROADWAYS & LOGISTICS PVT LTD</span>
          <span>Login By : MAYANK.GRLOGISTICS@GMAIL.COM</span>
          <span>Login Branch : CORPORATE OFFICE</span>
          <span>Financial Year : 2026-2027</span>
        </div>
      </div>

      {/* Search Card */}
      <Card>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Variable Name</Label>
              <Input
                placeholder="Search by Variable Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Description</Label>
              <Input
                placeholder="Search by Description"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Value</Label>
              <Input
                placeholder="Search by Value"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-3">
            <Button onClick={() => {}} size="sm" className="h-8 text-xs">
              <Search className="mr-1 h-3.5 w-3.5" />
              SEARCH
            </Button>
            <Button onClick={handleClearSearch} variant="outline" size="sm" className="h-8 text-xs">
              <RefreshCw className="mr-1 h-3.5 w-3.5" />
              CLEAR SEARCH
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex flex-wrap h-auto p-1 bg-muted/50 gap-1 mb-4">
          {tabsConfig.map(tab => (
            <TabsTrigger key={tab.id} value={tab.id} className="text-[10px] md:text-xs px-2 py-1">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabsConfig.map(tab => (
          <TabsContent key={tab.id} value={tab.id} className="mt-0">
            <div className="rounded-md border overflow-x-auto">
              <div className="min-w-[1000px]">
                <Table className="text-xs">
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-12 text-center">S#</TableHead>
                      <TableHead>Variable Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>{specificHeader}</TableHead>
                      <TableHead>Menu Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-24 text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          No records found
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedData.map((item, idx) => (
                        <TableRow key={item.id} className="hover:bg-muted/30">
                          <TableCell className="text-center">{(currentPage - 1) * itemsPerPage + idx + 1}</TableCell>
                          <TableCell className="font-mono font-medium">{item.variableName}</TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell>{item.value}</TableCell>
                          <TableCell>
                            {specificField ? (item as any)[specificField] || "-" : "-"}
                          </TableCell>
                          <TableCell>{item.menuName}</TableCell>
                          <TableCell>{getStatusBadge(item.status)}</TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleVerify(item)}
                              className="h-7 px-2 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Verify
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-1 mt-4">
                <Button variant="outline" size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="h-7 text-xs">Previous</Button>
                <span className="px-3 py-1 text-xs bg-muted rounded-md">Page {currentPage} of {totalPages}</span>
                <Button variant="outline" size="sm" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="h-7 text-xs">Next</Button>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Verify Modal */}
      <Dialog open={isVerifyModalOpen} onOpenChange={setIsVerifyModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Verify / Update Parameter</DialogTitle>
          </DialogHeader>
          {selectedParam && (
            <div className="space-y-4 py-2">
              <div className="space-y-1">
                <Label className="text-xs font-medium">Variable Name</Label>
                <p className="text-sm font-mono">{selectedParam.variableName}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-medium">Description</Label>
                <p className="text-sm">{selectedParam.description}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-medium">Value</Label>
                <Input
                  value={verifyValue}
                  onChange={(e) => setVerifyValue(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsVerifyModalOpen(false)}>CANCEL</Button>
            <Button size="sm" onClick={handleUpdateValue} className="bg-green-600">UPDATE VALUE</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Info Note */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 rounded-md p-3">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
          <div className="text-xs text-blue-700 dark:text-blue-400">
            <p className="font-medium">Note:</p>
            <ul className="list-disc list-inside mt-1 space-y-0.5">
              <li>Click any tab to view parameters for that category</li>
              <li>Use the search inputs to filter parameters</li>
              <li>Click "Verify" to view and update parameter values</li>
              <li>Status indicates whether the parameter has been properly configured</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}