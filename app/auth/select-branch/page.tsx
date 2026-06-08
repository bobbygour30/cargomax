"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Building2, ChevronRight, Store } from "lucide-react";
import toast from "react-hot-toast";
import { selectBranch, getCurrentUser } from "@/services/api";

const locations = [
  { value: "286", text: "AGARTALA" },
  { value: "125", text: "AGRA (YOGESH SHARMA)" },
  { value: "356", text: "AHMEDABAD CITY" },
  { value: "355", text: "AHMEDABAD-ASALAI (HUB)" },
  { value: "333", text: "AKBERPUR/AMBEDKAR NAGAR" },
  { value: "127", text: "ALIGARH (MUKESH SINGH)" },
  { value: "126", text: "ALIGARH (RAVI)" },
  { value: "265", text: "ALIPURDUAR" },
  { value: "191", text: "ALLAHABAD" },
  { value: "157", text: "ALZALGARH" },
  { value: "139", text: "AMRITSAR" },
  { value: "379", text: "ANANTAPUR" },
  { value: "163", text: "ANOOPSHER" },
  { value: "197", text: "ARARIA COURT" },
  { value: "196", text: "ARRAH" },
  { value: "261", text: "ASANSOL" },
  { value: "198", text: "AURANGABAD B.R" },
  { value: "172", text: "AURANGABAD U.P" },
  { value: "173", text: "AZAMGARH" },
  { value: "159", text: "BABRALA" },
  { value: "140", text: "BADDI" },
  { value: "351", text: "BAHERI" },
  { value: "166", text: "BAHJOI" },
  { value: "370", text: "BAKROL" },
  { value: "174", text: "BALLIA" },
  { value: "262", text: "BANKURA" },
  { value: "353", text: "BARAUT" },
  { value: "347", text: "BAREILLY" },
  { value: "182", text: "BARHALGANJ" },
  { value: "242", text: "BARHI" },
  { value: "280", text: "BARPETA ROAD" },
  { value: "290", text: "BARWALA" },
  { value: "175", text: "BASTI" },
  { value: "106", text: "BAWANA" },
  { value: "203", text: "BEGUSARAI" },
  { value: "178", text: "BELTHARA ROAD" },
  { value: "339", text: "BERHAMPORE W.B" },
  { value: "199", text: "BETTIAH" },
  { value: "205", text: "BHABHUA" },
  { value: "316", text: "BHADOHI" },
  { value: "201", text: "BHAGALPUR" },
  { value: "358", text: "BHAVNAGAR" },
  { value: "135", text: "BHIWANI" },
  { value: "169", text: "BHULANDSHAHAR" },
  { value: "210", text: "BIHARIGANJ" },
  { value: "207", text: "BIHARSHARIF" },
  { value: "208", text: "BIHIYA" },
  { value: "200", text: "BIHTA" },
  { value: "149", text: "BIJNOR" },
  { value: "278", text: "BILASIPARA" },
  { value: "279", text: "BONGAIGOAN" },
  { value: "202", text: "BRAHMAPUR" },
  { value: "263", text: "BURDWAN" },
  { value: "206", text: "BUXAR" },
  { value: "341", text: "CHANCHAL" },
  { value: "165", text: "CHANDAUSI" },
  { value: "141", text: "CHANDIGARH (GANESH)" },
  { value: "308", text: "CHANDIGARH (HARGUN)" },
  { value: "337", text: "CHANDPUR" },
  { value: "243", text: "CHAS" },
  { value: "211", text: "CHHAPRA" },
  { value: "270", text: "COOCHBEHAR" },
  { value: "00000", text: "CORPORATE OFFICE" },
  { value: "275", text: "DALKOLA" },
  { value: "245", text: "DALTONGANJ" },
  { value: "212", text: "DARBHANGA" },
  { value: "213", text: "DAUDNAGAR" },
  { value: "107", text: "DAYA BASTI" },
  { value: "214", text: "DEHRI ON SON" },
  { value: "246", text: "DEOGHAR" },
  { value: "180", text: "DEORIA" },
  { value: "155", text: "DHAMPUR" },
  { value: "305", text: "DHANAURA" },
  { value: "247", text: "DHANBAD" },
  { value: "362", text: "DHORA JI" },
  { value: "282", text: "DHUBRI" },
  { value: "266", text: "DHUPGURI" },
  { value: "167", text: "DIBAI" },
  { value: "271", text: "DINHATA" },
  { value: "294", text: "DIRECT PARTY" },
  { value: "307", text: "DUMKA" },
  { value: "215", text: "DUMROAN" },
  { value: "264", text: "DURGAPUR" },
  { value: "179", text: "FAIZABAD" },
  { value: "267", text: "FALAKATA" },
  { value: "136", text: "FARIDABAD" },
  { value: "216", text: "FORBISGANJ" },
  { value: "109", text: "GANDHI NAGAR (AJAY ANAND)" },
  { value: "108", text: "GANDHI NAGAR (ASHOK)" },
  { value: "300", text: "GANDHI NAGAR GRL" },
  { value: "343", text: "GANGARAMPUR" },
  { value: "248", text: "GARWA" },
  { value: "217", text: "GAYA" },
  { value: "128", text: "GHAZIABAD" },
  { value: "101", text: "GHAZIABAD R.O" },
  { value: "184", text: "GHAZIPUR" },
  { value: "185", text: "GHOSI" },
  { value: "249", text: "GIRIDIH" },
  { value: "283", text: "GOALPARA" },
  { value: "251", text: "GODDA" },
  { value: "218", text: "GOPALGANJ" },
  { value: "183", text: "GORAKHPUR" },
  { value: "336", text: "GOSAINGANJ" },
  { value: "232", text: "GULABBAGH" },
  { value: "168", text: "GULAOTHI" },
  { value: "250", text: "GUMLA" },
  { value: "219", text: "HAJIPUR" },
  { value: "364", text: "HALOL" },
  { value: "317", text: "HARRAIYA" },
  { value: "315", text: "HATA" },
  { value: "129", text: "HATHRAS" },
  { value: "252", text: "HAZARIBAGH" },
  { value: "102", text: "HEAD OFFICE" },
  { value: "385", text: "HINDUPUR" },
  { value: "374", text: "HYDERABAD" },
  { value: "276", text: "ISLAMPUR" },
  { value: "137", text: "JAGADARI" },
  { value: "377", text: "JAGITAL" },
  { value: "164", text: "JAHANGIRABAD" },
  { value: "220", text: "JAINAGAR" },
  { value: "334", text: "JALALPUR" },
  { value: "142", text: "JALANDAR" },
  { value: "268", text: "JALPAIGURI" },
  { value: "110", text: "JAMNA BAZAR" },
  { value: "253", text: "JAMSHEDPUR" },
  { value: "221", text: "JAMUI" },
  { value: "186", text: "JAUNPUR" },
  { value: "363", text: "JETPUR" },
  { value: "345", text: "JHANJHARPUR" },
  { value: "254", text: "JHARIYA" },
  { value: "111", text: "JHILMIL" },
  { value: "255", text: "JHUMRITALIYA" },
  { value: "386", text: "KADAPA" },
  { value: "293", text: "KALA AMB" },
  { value: "297", text: "KALIACHAK" },
  { value: "296", text: "KALIYAGANJ" },
  { value: "112", text: "KAMLA MARKET (RAMAN RAI)" },
  { value: "113", text: "KAMLA MARKET (RAVINDER PANDEY)" },
  { value: "187", text: "KANPUR" },
  { value: "324", text: "KAPTANGANJ" },
  { value: "376", text: "KARIM NAGAR" },
  { value: "298", text: "KARNAL" },
  { value: "115", text: "KAROL BAGH (NITISH)" },
  { value: "114", text: "KAROL BAGH (S.K.OBERI)" },
  { value: "116", text: "KASHMERE GATE (RAM GOPAL)" },
  { value: "117", text: "KASHMERE GATE (VIVEK)" },
  { value: "321", text: "KASIA" },
  { value: "223", text: "KATIHAR" },
  { value: "204", text: "KHAGARIA" },
  { value: "320", text: "KHALILABAD" },
  { value: "103", text: "KHANNA MARKET" },
  { value: "304", text: "KHANNA MARKET GRL" },
  { value: "104", text: "KHERA KALAN (HUB)" },
  { value: "306", text: "KIRATPUR" },
  { value: "222", text: "KISHANGANJ" },
  { value: "224", text: "KOCHAS" },
  { value: "285", text: "KOKRAJHAR" },
  { value: "284", text: "KRISHNAI" },
  { value: "346", text: "KUNDA" },
  { value: "387", text: "KURNOOL" },
  { value: "319", text: "KUSHINAGAR" },
  { value: "329", text: "LAKHISARAI" },
  { value: "318", text: "LALGANJ" },
  { value: "366", text: "LIBASPUR" },
  { value: "244", text: "LOHARDGA" },
  { value: "188", text: "LUCKNOW" },
  { value: "143", text: "LUDHIANA" },
  { value: "332", text: "LUDHIANA (BOBBY)" },
  { value: "331", text: "LUDHIANA (GOSALA)" },
  { value: "144", text: "LUDHIANA CITY" },
  { value: "145", text: "LUDHIANA GILL ROAD" },
  { value: "190", text: "MACHHALISHAR" },
  { value: "227", text: "MADHEPURA" },
  { value: "225", text: "MADHUBANI" },
  { value: "256", text: "MADHUPUR" },
  { value: "322", text: "MAHARAJGANJ" },
  { value: "369", text: "MAIRWA" },
  { value: "274", text: "MALDA" },
  { value: "146", text: "MALERKOTLA" },
  { value: "118", text: "MANGOLPURI" },
  { value: "272", text: "MATHABHANGA" },
  { value: "189", text: "MAU" },
  { value: "368", text: "MAYAPURI" },
  { value: "269", text: "MAYNAGURI" },
  { value: "373", text: "MEERUT ( B.N MALHOTRA)" },
  { value: "130", text: "MEERUT (KAMAL DHINGRA)" },
  { value: "312", text: "MIRZAPUR" },
  { value: "292", text: "MOHALI" },
  { value: "176", text: "MOHAMMDABAD GOHNA" },
  { value: "226", text: "MOHANIYA" },
  { value: "170", text: "MORADABAD" },
  { value: "299", text: "MORI GATE GRL" },
  { value: "326", text: "MOTIHARI" },
  { value: "177", text: "MUBARAKPUR" },
  { value: "311", text: "MUGHALSARAI" },
  { value: "367", text: "MUNGRA BADSHAHPUR" },
  { value: "131", text: "MURAD NAGAR" },
  { value: "229", text: "MURLIGANJ" },
  { value: "340", text: "MURSHIDABAD" },
  { value: "148", text: "MUZAFFARNAGAR" },
  { value: "228", text: "MUZAFFARPUR" },
  { value: "154", text: "NAGINA" },
  { value: "281", text: "NALBARI" },
  { value: "382", text: "NANDYAL" },
  { value: "119", text: "NARELA" },
  { value: "230", text: "NARKATIYA GANJ" },
  { value: "357", text: "NAROL" },
  { value: "350", text: "NAWABGANJ" },
  { value: "209", text: "NAWADA" },
  { value: "150", text: "NETHAUR" },
  { value: "120", text: "NEW LAJPAT RAI MARKET" },
  { value: "132", text: "NOIDA" },
  { value: "152", text: "NOJIBABAD" },
  { value: "151", text: "NOORPUR" },
  { value: "313", text: "PADRAUNA" },
  { value: "289", text: "PANCHKULA" },
  { value: "138", text: "PANIPAT" },
  { value: "288", text: "PARWANOO" },
  { value: "231", text: "PATNA" },
  { value: "147", text: "PHAGWARA" },
  { value: "257", text: "PHUSRO" },
  { value: "348", text: "PILIBHIT" },
  { value: "384", text: "PODDATUR" },
  { value: "310", text: "PRATAPGARH" },
  { value: "349", text: "PURANPUR" },
  { value: "233", text: "PURNIA" },
  { value: "327", text: "PURULIA" },
  { value: "371", text: "RAFIGANJ" },
  { value: "344", text: "RAGHUNATHGANJ" },
  { value: "295", text: "RAIGANJ" },
  { value: "383", text: "RAJAHMUNDRY" },
  { value: "361", text: "RAJKOT (METODA)" },
  { value: "360", text: "RAJKOT (SHAPAR)" },
  { value: "359", text: "RAJKOT - A" },
  { value: "258", text: "RAMGARH" },
  { value: "259", text: "RANCHI" },
  { value: "354", text: "RANGIA" },
  { value: "328", text: "RANIGANJ" },
  { value: "192", text: "RASARA" },
  { value: "352", text: "RAXAUL" },
  { value: "105", text: "SADAR BAZAR" },
  { value: "133", text: "SAHARANPUR" },
  { value: "239", text: "SAHARSA" },
  { value: "158", text: "SAHASWAN" },
  { value: "181", text: "SALEMPUR" },
  { value: "234", text: "SAMASTIPUR" },
  { value: "171", text: "SAMBAL" },
  { value: "342", text: "SAMSI" },
  { value: "301", text: "SANJAY GANDHI GRL" },
  { value: "121", text: "SANJAY GANDHI TPT" },
  { value: "235", text: "SASARAM" },
  { value: "162", text: "SECUNDERABAD" },
  { value: "153", text: "SEOHARA" },
  { value: "122", text: "SHAHDARA" },
  { value: "325", text: "SHAHGANJ" },
  { value: "236", text: "SHERGHATI" },
  { value: "160", text: "SHIKARPUR" },
  { value: "338", text: "SIDDHARTHNAGAR" },
  { value: "375", text: "SIDDIPET" },
  { value: "277", text: "SILLIGURI" },
  { value: "260", text: "SIMDEGA" },
  { value: "314", text: "SISWABAZAR" },
  { value: "237", text: "SITAMARHI" },
  { value: "238", text: "SIWAN" },
  { value: "161", text: "SIYANA" },
  { value: "287", text: "SOLAN" },
  { value: "381", text: "SRIKAKULAM" },
  { value: "193", text: "SULTANPUR" },
  { value: "240", text: "SUPAUL" },
  { value: "372", text: "SURAT" },
  { value: "323", text: "TAMKUHI" },
  { value: "335", text: "TANDA" },
  { value: "156", text: "THAKURDWARA" },
  { value: "134", text: "TRONICA CITY" },
  { value: "273", text: "TUFANGANJ" },
  { value: "302", text: "U P BORDER A JH UP" },
  { value: "303", text: "U P BORDER B BR" },
  { value: "309", text: "U P BORDER C ASM WB" },
  { value: "330", text: "U P BORDER D BR GP" },
  { value: "365", text: "VAPI" },
  { value: "194", text: "VARANASI" },
  { value: "378", text: "VIJAYWADA" },
  { value: "241", text: "VIKRAMGANJ" },
  { value: "388", text: "VISAKHAPATNAM" },
  { value: "380", text: "VIZIANAGARAM" },
  { value: "123", text: "WAZIRPUR" },
  { value: "195", text: "YUSUFPUR" },
  { value: "124", text: "ZAKHIRA" },
  { value: "291", text: "ZIRAKPUR" },
];

export default function SelectBranchPage() {
  const router = useRouter();
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedBranchText, setSelectedBranchText] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Check if user is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (!isLoggedIn || !userData || !token) {
      router.push("/auth/login");
    } else {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  // Filter locations based on search
  const filteredLocations = locations.filter((location) =>
    location.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBranchSelect = (value: string, text: string) => {
    setSelectedBranch(value);
    setSelectedBranchText(text);
  };

  const handleProceed = async () => {
    if (!selectedBranch) {
      toast.error("Please select a branch");
      return;
    }

    setLoading(true);
    
    try {
      // Call API to save branch selection
      const response = await selectBranch(selectedBranchText, selectedBranch);
      
      if (response.success) {
        localStorage.setItem("selectedBranch", selectedBranchText);
        localStorage.setItem("branchCode", selectedBranch);
        
        toast.success(`Welcome to ${selectedBranchText} branch!`);
        
        // Redirect to dashboard
        setTimeout(() => {
          router.push("/dashboard/overview");
        }, 500);
      } else {
        toast.error(response.message || "Failed to select branch");
      }
    } catch (error: any) {
      console.error("Branch selection error:", error);
      toast.error(error.response?.data?.message || "Failed to select branch");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-600 p-3 rounded-full">
              <Store className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Select Your Branch</CardTitle>
          <CardDescription>Welcome, {user?.name || 'User'}! Choose the branch you want to work with</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search Input */}
          <div className="flex-1">
            <Label className="text-sm">Search Branch</Label>
            <input
              type="text"
              placeholder="Search by branch name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Branch Dropdown */}
          <div className="flex-1">
            <Label className="text-sm">Select Branch</Label>
            <select
              value={selectedBranch}
              onChange={(e) => {
                const selectedOption = locations.find(loc => loc.value === e.target.value);
                if (selectedOption) {
                  handleBranchSelect(selectedOption.value, selectedOption.text);
                }
              }}
              className="w-full h-10 px-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">-- Select a branch --</option>
              {filteredLocations.map((location) => (
                <option key={location.value} value={location.value}>
                  {location.text}
                </option>
              ))}
            </select>
          </div>

          {filteredLocations.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Building2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No branches found</p>
            </div>
          )}

          {/* Selected Branch Info */}
          {selectedBranch && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Selected Branch</p>
                  <p className="font-semibold text-lg text-blue-700">{selectedBranchText}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Branch Code</p>
                  <p className="font-mono text-sm">{selectedBranch}</p>
                </div>
              </div>
            </div>
          )}

          {/* Proceed Button */}
          <Button
            onClick={handleProceed}
            className="w-full h-11 bg-green-600 hover:bg-green-700"
            disabled={!selectedBranch || loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Processing...
              </div>
            ) : (
              <>
                Proceed to Dashboard
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}