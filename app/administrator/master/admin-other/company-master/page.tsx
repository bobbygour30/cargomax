"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Building2,
  Save,
  RefreshCw,
  Upload,
  Eye,
  X,
  Check,
  Phone,
  Mail,
  MapPin,
  Globe,
  CreditCard,
  Banknote,
  User,
  Briefcase,
  Shield,
  FileText,
  Users,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface PartnerDirector {
  id: number;
  name: string;
  designation: string;
  panNo: string;
  mobileNo: string;
  email: string;
}

// Options
const companyTypeOptions = ["Private Limited", "Public Limited", "LLP", "Partnership", "Sole Proprietorship"];
const stateOptions = ["DELHI", "MAHARASHTRA", "KARNATAKA", "TAMIL NADU", "WEST BENGAL", "UTTAR PRADESH", "GUJARAT", "RAJASTHAN"];
const countryOptions = ["INDIA", "USA", "UK", "UAE", "SINGAPORE"];
const underRCMOptions = ["YES", "NO"];
const designationOptions = ["OWNER", "DIRECTOR", "PARTNER", "MANAGER", "CEO", "CFO", "COO"];

export default function CompanyMaster() {
  const [activeTab, setActiveTab] = useState<"company" | "partner">("company");
  const [loading, setLoading] = useState<boolean>(false);
  const [logoFile, setLogoFile] = useState<string>("");

  // Company Details State
  const [companyName, setCompanyName] = useState<string>("GOLDEN ROADWAYS & LOGISTICS PVT LTD");
  const [displayName, setDisplayName] = useState<string>("GOLDEN ROADWAYS & LOGISTICS PVT LTD");
  const [aliasName, setAliasName] = useState<string>("");
  const [companyId, setCompanyId] = useState<string>("22608181");
  const [address, setAddress] = useState<string>("32, 2ND FLOOR,KHANNA MARKET,OPP TIS HAZARI DELHI-110054");
  const [telNo, setTelNo] = useState<string>("");
  const [faxNo, setFaxNo] = useState<string>("");
  const [emailId, setEmailId] = useState<string>("MAYANK.GRLOGISTICS@GMAIL.COM");
  const [city, setCity] = useState<string>("NEW DELHI");
  const [zipCode, setZipCode] = useState<string>("110054");
  const [url, setUrl] = useState<string>("");
  const [state, setState] = useState<string>("DELHI");
  const [country, setCountry] = useState<string>("INDIA");
  const [companyType, setCompanyType] = useState<string>("");
  const [pfAccountNo, setPfAccountNo] = useState<string>("");
  const [esiAccountNo, setEsiAccountNo] = useState<string>("");
  const [panNo, setPanNo] = useState<string>("AAGCG5997B");
  const [gstNo, setGstNo] = useState<string>("07AAGCG5997B1ZE");
  const [transporterId, setTransporterId] = useState<string>("");
  const [cinNo, setCinNo] = useState<string>("U74999DL2016PTC308683");
  const [accountName, setAccountName] = useState<string>("GOLDEN ROADWAYS AND");
  const [accountNumber, setAccountNumber] = useState<string>("50200023179179");
  const [bankName, setBankName] = useState<string>("HDFC BANK");
  const [bankBranch, setBankBranch] = useState<string>("MORI GATE , KHANNA M");
  const [ifscCode, setIfscCode] = useState<string>("HDFC0000330");
  const [micrCode, setMicrCode] = useState<string>("");
  const [tanNo, setTanNo] = useState<string>("");
  const [underRCM, setUnderRCM] = useState<string>("NO");
  const [enableSSL, setEnableSSL] = useState<boolean>(false);
  const [enableEway, setEnableEway] = useState<boolean>(false);

  // Contact Person State
  const [contactPersonName, setContactPersonName] = useState<string>("MAYANK PRATAP SINGH");
  const [contactPersonDesignation, setContactPersonDesignation] = useState<string>("OWN");
  const [contactPersonAddress, setContactPersonAddress] = useState<string>("KHANNA MARKET NEAR TIS HAZARI COURT METRO STATION");
  const [contactPersonMobileNo, setContactPersonMobileNo] = useState<string>("");
  const [contactPersonFaxNo, setContactPersonFaxNo] = useState<string>("");
  const [contactPersonEmailId, setContactPersonEmailId] = useState<string>("MAYANK.GRLOGISTICS@GMAIL.COM");
  const [contactPersonCity, setContactPersonCity] = useState<string>("NEW DELHI");
  const [contactPersonZipCode, setContactPersonZipCode] = useState<string>("110053");
  const [contactPersonState, setContactPersonState] = useState<string>("DELHI");
  const [contactPersonCountry, setContactPersonCountry] = useState<string>("INDIA");

  // Partner/Director State
  const [partnersDirectors, setPartnersDirectors] = useState<PartnerDirector[]>([
    { id: 1, name: "MAYANK PRATAP SINGH", designation: "OWNER", panNo: "", mobileNo: "", email: "MAYANK.GRLOGISTICS@GMAIL.COM" },
  ]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file.name);
    }
  };

  const handleAddPartnerDirector = () => {
    const newPartner: PartnerDirector = {
      id: Date.now(),
      name: "",
      designation: "",
      panNo: "",
      mobileNo: "",
      email: "",
    };
    setPartnersDirectors([...partnersDirectors, newPartner]);
  };

  const handleUpdatePartnerDirector = (id: number, field: keyof PartnerDirector, value: string) => {
    setPartnersDirectors(partnersDirectors.map(pd => 
      pd.id === id ? { ...pd, [field]: value } : pd
    ));
  };

  const handleRemovePartnerDirector = (id: number) => {
    if (partnersDirectors.length > 1) {
      setPartnersDirectors(partnersDirectors.filter(pd => pd.id !== id));
    }
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      alert("Company details saved successfully!");
      setLoading(false);
    }, 500);
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all fields?")) {
      setCompanyName("GOLDEN ROADWAYS & LOGISTICS PVT LTD");
      setDisplayName("GOLDEN ROADWAYS & LOGISTICS PVT LTD");
      setAliasName("");
      setCompanyId("22608181");
      setAddress("32, 2ND FLOOR,KHANNA MARKET,OPP TIS HAZARI DELHI-110054");
      setTelNo("");
      setFaxNo("");
      setEmailId("MAYANK.GRLOGISTICS@GMAIL.COM");
      setCity("NEW DELHI");
      setZipCode("110054");
      setUrl("");
      setState("DELHI");
      setCountry("INDIA");
      setCompanyType("");
      setPfAccountNo("");
      setEsiAccountNo("");
      setPanNo("AAGCG5997B");
      setGstNo("07AAGCG5997B1ZE");
      setTransporterId("");
      setCinNo("U74999DL2016PTC308683");
      setAccountName("GOLDEN ROADWAYS AND");
      setAccountNumber("50200023179179");
      setBankName("HDFC BANK");
      setBankBranch("MORI GATE , KHANNA M");
      setIfscCode("HDFC0000330");
      setMicrCode("");
      setTanNo("");
      setUnderRCM("NO");
      setEnableSSL(false);
      setEnableEway(false);
      setContactPersonName("MAYANK PRATAP SINGH");
      setContactPersonDesignation("OWN");
      setContactPersonAddress("KHANNA MARKET NEAR TIS HAZARI COURT METRO STATION");
      setContactPersonMobileNo("");
      setContactPersonFaxNo("");
      setContactPersonEmailId("MAYANK.GRLOGISTICS@GMAIL.COM");
      setContactPersonCity("NEW DELHI");
      setContactPersonZipCode("110053");
      setContactPersonState("DELHI");
      setContactPersonCountry("INDIA");
      setPartnersDirectors([{ id: 1, name: "MAYANK PRATAP SINGH", designation: "OWNER", panNo: "", mobileNo: "", email: "MAYANK.GRLOGISTICS@GMAIL.COM" }]);
      setLogoFile("");
      alert("Form reset successfully!");
    }
  };

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">COMPANY MASTER</h1>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[10px] md:text-xs text-muted-foreground">
          <span>Company : GOLDEN ROADWAYS & LOGISTICS PVT LTD</span>
          <span>Login By : MAYANK.GRLOGISTICS@GMAIL.COM</span>
          <span>Login Branch : CORPORATE OFFICE</span>
          <span>Financial Year : 2026-2027</span>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "company" | "partner")} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="company" className="text-xs">Company Details</TabsTrigger>
          <TabsTrigger value="partner" className="text-xs">Partner/Director</TabsTrigger>
        </TabsList>

        {/* Company Details Tab */}
        <TabsContent value="company" className="space-y-4 mt-4">
          {/* Basic Information */}
          <div className="border rounded-md p-4">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Building2 className="h-4 w-4" /> Basic Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1"><Label className="text-xs">Company Name <span className="text-red-500">*</span></Label><Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Display Name</Label><Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Alias Name</Label><Input value={aliasName} onChange={(e) => setAliasName(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Company ID</Label><Input value={companyId} onChange={(e) => setCompanyId(e.target.value)} className="h-8 text-xs" /></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div className="space-y-1"><Label className="text-xs">Address <span className="text-red-500">*</span></Label><Textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2} className="text-xs" /></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
              <div className="space-y-1"><Label className="text-xs">Tel #</Label><Input value={telNo} onChange={(e) => setTelNo(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Fax #</Label><Input value={faxNo} onChange={(e) => setFaxNo(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">E-mail ID</Label><Input value={emailId} onChange={(e) => setEmailId(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">City <span className="text-red-500">*</span></Label><Input value={city} onChange={(e) => setCity(e.target.value)} className="h-8 text-xs" /></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
              <div className="space-y-1"><Label className="text-xs">Zip Code</Label><Input value={zipCode} onChange={(e) => setZipCode(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">URL</Label><Input value={url} onChange={(e) => setUrl(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">State</Label><Select value={state} onValueChange={setState}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{stateOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
              <div className="space-y-1"><Label className="text-xs">Country</Label><Select value={country} onValueChange={setCountry}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{countryOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
            </div>
          </div>

          {/* Tax & Registration Information */}
          <div className="border rounded-md p-4">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4" /> Tax & Registration Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1"><Label className="text-xs">Company Type</Label><Select value={companyType} onValueChange={setCompanyType}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="--Select--" /></SelectTrigger><SelectContent>{companyTypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
              <div className="space-y-1"><Label className="text-xs">PF Account #</Label><Input value={pfAccountNo} onChange={(e) => setPfAccountNo(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">ESI Account #</Label><Input value={esiAccountNo} onChange={(e) => setEsiAccountNo(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">PAN #</Label><Input value={panNo} onChange={(e) => setPanNo(e.target.value)} className="h-8 text-xs uppercase" /></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
              <div className="space-y-1"><Label className="text-xs">GST #</Label><Input value={gstNo} onChange={(e) => setGstNo(e.target.value)} className="h-8 text-xs uppercase" /></div>
              <div className="space-y-1"><Label className="text-xs">Transporter Id</Label><Input value={transporterId} onChange={(e) => setTransporterId(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">CIN #</Label><Input value={cinNo} onChange={(e) => setCinNo(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">TAN #</Label><Input value={tanNo} onChange={(e) => setTanNo(e.target.value)} className="h-8 text-xs" /></div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="border rounded-md p-4">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Banknote className="h-4 w-4" /> Bank Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1"><Label className="text-xs">Account Name</Label><Input value={accountName} onChange={(e) => setAccountName(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Account Number</Label><Input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Bank Name</Label><Input value={bankName} onChange={(e) => setBankName(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Bank Branch</Label><Input value={bankBranch} onChange={(e) => setBankBranch(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">IFSC Code</Label><Input value={ifscCode} onChange={(e) => setIfscCode(e.target.value)} className="h-8 text-xs uppercase" /></div>
              <div className="space-y-1"><Label className="text-xs">MICR Code</Label><Input value={micrCode} onChange={(e) => setMicrCode(e.target.value)} className="h-8 text-xs" /></div>
            </div>
          </div>

          {/* Logo Upload */}
          <div className="border rounded-md p-4">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Upload className="h-4 w-4" /> Company Logo
            </h3>
            <div className="flex flex-wrap items-end gap-3">
              <div className="flex-1">
                <Label className="text-xs">Select Logo</Label>
                <Input type="file" accept="image/*" onChange={handleLogoUpload} className="h-8 text-xs file:h-7 file:text-xs" />
                <p className="text-[10px] text-muted-foreground mt-1">{logoFile || "No file chosen"}</p>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="border rounded-md p-4">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4" /> Settings
            </h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2"><input type="checkbox" checked={enableSSL} onChange={(e) => setEnableSSL(e.target.checked)} className="h-3.5 w-3.5" id="enableSSL" /><Label htmlFor="enableSSL" className="text-xs cursor-pointer">Enable SSL</Label></div>
              <div className="flex items-center gap-2"><input type="checkbox" checked={enableEway} onChange={(e) => setEnableEway(e.target.checked)} className="h-3.5 w-3.5" id="enableEway" /><Label htmlFor="enableEway" className="text-xs cursor-pointer">Enable Eway</Label></div>
              <div className="flex items-center gap-2"><Label className="text-xs">Under RCM <span className="text-red-500">*</span></Label><Select value={underRCM} onValueChange={setUnderRCM}><SelectTrigger className="h-8 w-24 text-xs"><SelectValue /></SelectTrigger><SelectContent>{underRCMOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
            </div>
          </div>

          {/* Contact Person */}
          <div className="border rounded-md p-4">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <User className="h-4 w-4" /> Contact Person
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1"><Label className="text-xs">Contact Person <span className="text-red-500">*</span></Label><Input value={contactPersonName} onChange={(e) => setContactPersonName(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Designation <span className="text-red-500">*</span></Label><Select value={contactPersonDesignation} onValueChange={setContactPersonDesignation}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{designationOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
              <div className="space-y-1"><Label className="text-xs">Address</Label><Input value={contactPersonAddress} onChange={(e) => setContactPersonAddress(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Mobile No.</Label><Input value={contactPersonMobileNo} onChange={(e) => setContactPersonMobileNo(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Fax #</Label><Input value={contactPersonFaxNo} onChange={(e) => setContactPersonFaxNo(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">E-mail ID</Label><Input value={contactPersonEmailId} onChange={(e) => setContactPersonEmailId(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">City</Label><Input value={contactPersonCity} onChange={(e) => setContactPersonCity(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Zip Code</Label><Input value={contactPersonZipCode} onChange={(e) => setContactPersonZipCode(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">State</Label><Select value={contactPersonState} onValueChange={setContactPersonState}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{stateOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
              <div className="space-y-1"><Label className="text-xs">Country</Label><Select value={contactPersonCountry} onValueChange={setContactPersonCountry}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{countryOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
            </div>
          </div>
        </TabsContent>

        {/* Partner/Director Tab */}
        <TabsContent value="partner" className="space-y-4 mt-4">
          <div className="border rounded-md p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold flex items-center gap-2"><Users className="h-4 w-4" /> Partners / Directors</h3>
              <Button onClick={handleAddPartnerDirector} variant="outline" size="sm" className="h-7 text-xs"><PlusCircle className="mr-1 h-3 w-3" />Add New</Button>
            </div>
            <div className="overflow-x-auto">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>S#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Designation</TableHead>
                    <TableHead>PAN No.</TableHead>
                    <TableHead>Mobile No.</TableHead>
                    <TableHead>Email ID</TableHead>
                    <TableHead className="w-20 text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partnersDirectors.map((pd, idx) => (
                    <TableRow key={pd.id}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell><Input value={pd.name} onChange={(e) => handleUpdatePartnerDirector(pd.id, "name", e.target.value)} className="h-7 w-36 text-xs" /></TableCell>
                      <TableCell><Input value={pd.designation} onChange={(e) => handleUpdatePartnerDirector(pd.id, "designation", e.target.value)} className="h-7 w-28 text-xs" /></TableCell>
                      <TableCell><Input value={pd.panNo} onChange={(e) => handleUpdatePartnerDirector(pd.id, "panNo", e.target.value)} className="h-7 w-32 text-xs uppercase" /></TableCell>
                      <TableCell><Input value={pd.mobileNo} onChange={(e) => handleUpdatePartnerDirector(pd.id, "mobileNo", e.target.value)} className="h-7 w-28 text-xs" /></TableCell>
                      <TableCell><Input value={pd.email} onChange={(e) => handleUpdatePartnerDirector(pd.id, "email", e.target.value)} className="h-7 w-40 text-xs" /></TableCell>
                      <TableCell className="text-center"><Button variant="ghost" size="sm" onClick={() => handleRemovePartnerDirector(pd.id)} className="h-6 w-6 p-0 text-red-500"><Trash2 className="h-3.5 w-3.5" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button onClick={handleSave} size="sm" className="h-8 text-xs bg-green-600" disabled={loading}>
          <Save className="mr-1 h-3 w-3" /> SAVE
        </Button>
        <Button onClick={handleReset} variant="outline" size="sm" className="h-8 text-xs">
          <RefreshCw className="mr-1 h-3 w-3" /> RESET
        </Button>
      </div>
    </div>
  );
}

// Table components for Partner/Director tab
import { Table as UITable, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";