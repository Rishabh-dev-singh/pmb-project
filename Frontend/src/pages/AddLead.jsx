import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api"; // NAYA: Secure API connection

function AddLead() {
  const initialFormState = {
    prospectType: "", loanType: "", salutation: "", fullName: "", mobile: "",
    requiredLoanAmount: "", location: "", source: "", subSource: "",
    bankName: "", rmName: "", owner: "", progress: "", nextDate: "",
    nextTime: "", dob: "", additional: ""
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [bankList, setBankList] = useState([]); 
  const [empMap, setEmpMap] = useState({}); 
  const [empList, setEmpList] = useState([]); 
  const [currentEmpId, setCurrentEmpId] = useState(""); // NAYA: State for current employee ID
  
  const navigate = useNavigate();
  const location = useLocation();

  const existingLead = location.state?.lead;
  const isEditing = !!existingLead;

  // SUPER USER CHECK (3814 Added Here)
  const isSuperUser = ["3800", "3801", "3802", "3803", "3814"].includes(currentEmpId);

  useEffect(() => {
    // 1. Fetch Current Logged-in User Profile (Replaces localStorage)
    const fetchProfile = async () => {
      try {
        const res = await api.get('profile/');
        setCurrentEmpId(res.data.id);
      } catch (err) {
        console.error("Failed to fetch profile. Session might be expired.");
        navigate("/employee-login"); // Redirect to login if cookie is missing
      }
    };
    
    // 2. Fetch Bank List (using secure api instance)
    const fetchBanks = async () => {
      try {
        const res = await api.get('banks/');
        setBankList(res.data);
      } catch (err) {
        console.error("Bank list fetch error:", err);
      }
    };

    // 3. Fetch Employee List (using secure api instance)
    const fetchEmployees = async () => {
      try {
        const res = await api.get('employees/');
        const data = res.data;

        // FILTER: Admin wali IDs ko dropdown se hatane ke liye logic
        const onlyEmployees = data.filter(emp => {
          const empId = emp.employee_id ? emp.employee_id.toLowerCase() : "";
          const fName = emp.first_name ? emp.first_name.toLowerCase() : "";
          return !empId.includes("admin") && !fName.includes("admin");
        });

        setEmpList(onlyEmployees); 
        
        const map = {};
        data.forEach((emp) => {
          map[emp.employee_id] = emp.first_name;
        });
        setEmpMap(map);
      } catch (err) {
        console.error("Error fetching employees map:", err);
      }
    };

    fetchProfile();
    fetchBanks();
    fetchEmployees();
  }, [navigate]);

  useEffect(() => {
    if (isEditing) {
      setFormData({ ...initialFormState, ...existingLead });
    } else if (currentEmpId) {
      // Jab currentEmpId mil jaye, toh formData mein update kar dein
      setFormData({ ...initialFormState, owner: currentEmpId.toUpperCase() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, existingLead, currentEmpId]);

  const requiredFields = [
    "prospectType", "loanType", "salutation", "fullName", "mobile",
    "requiredLoanAmount", "progress", "owner", "location", "dob"
  ];

  const handleChange = (e) => {
    const val = e.target.value?.trimStart(); 
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: val ? val.toUpperCase() : ""
    }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (requiredFields.includes(name) && !value) {
      setErrors((prev) => ({ ...prev, [name]: "Required" }));
    }
  };

  const handleFocus = (e) => {
    const name = e.target.name;
    if (requiredFields.includes(name) && !formData[name]) {
      setErrors((prev) => ({ ...prev, [name]: "Required" }));
    }
  };

  const validate = () => {
    let newErrors = {};
    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field] === "") {
        newErrors[field] = "Required";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatAmount = (value) => {
    if (!value) return "";
    const num = parseFloat(value.toString().replace(/,/g, ""));
    if (isNaN(num)) return "";
    if (num >= 10000000) return (num / 10000000).toFixed(2) + " Cr";
    if (num >= 100000) return (num / 100000).toFixed(2) + " Lakh";
    if (num >= 1000) return (num / 1000).toFixed(2) + " Thousand";
    return num;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      alert("⚠️ Please fill all required fields!");
      return;
    }
    
    let payload = { ...formData };

    if (payload.dob && payload.dob.includes("/")) {
      const parts = payload.dob.split("/");
      if (parts.length === 3) {
        payload.dob = `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
      }
    }

    // NAYA: Secure API URL routing via Axios instance
    const url = isEditing ? `leads/${existingLead.id}/update/` : "leads/";
    const method = isEditing ? "put" : "post";

    try {
      
      const res = await api[method](url, payload);
      if (res.status === 200 || res.status === 201) {
        alert(isEditing ? "✅ Lead Updated Successfully" : "✅ Lead Saved Successfully");
        navigate("/employee-dashboard", { state: { refresh: true } });
      } else {
        alert("❌ Error saving lead");
      }
    } catch (error) {
      alert("Server error, please check connection or verify the form data.");
    }
  };

  const openMap = () => {
    const loc = formData.location;
    if (!loc) { setErrors((prev) => ({ ...prev, location: "Required" })); return; }
    window.location.href = `http://googleusercontent.com/maps.google.com/${encodeURIComponent(loc)}`;
  };

  const inputStyle = { padding: "10px", border: "none", borderBottom: "1px solid #ccc", outline: "none", fontSize: "14px", background: "transparent", width: "100%", textTransform: "uppercase" };
  const labelStyle = { fontSize: "15px", fontWeight: "600", marginTop: "14px", color: "#16a34a" };
  
  const fieldProps = (name) => ({ 
    name, 
    value: formData[name] || "", 
    onChange: handleChange, 
    onBlur: handleBlur, 
    onFocus: handleFocus, 
    style: inputStyle 
  });

  return (
    <div style={{ background: "#f5f7fb", minHeight: "100vh", padding: "15px" }}>
      <div style={{ background: "#fff", padding: "20px", borderRadius: "8px", maxWidth: "1200px", margin: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ margin: 0 }}>{isEditing ? "Edit Lead" : "Add Lead Customer"}</h2>
          <span onClick={() => navigate("/employee-dashboard")} style={{ fontSize: "22px", cursor: "pointer", color: "#ef4444", fontWeight: "bold" }}>✕</span>
        </div>

        <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          {/* LEFT COLUMN */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={labelStyle}>Prospect Type *</label>
            <select {...fieldProps("prospectType")}>
              <option value="">Select</option>
              <option value="COMPANY">Company</option>
              <option value="INDIVIDUAL">Individual</option>
            </select>
            {errors.prospectType && <span style={{ color: "red", fontSize: 12 }}>{errors.prospectType}</span>}

            <label style={labelStyle}>Loan Type *</label>
            <select {...fieldProps("loanType")}>
              <option value="">Select</option>
              <option value="BUSINESS LOAN">Business Loan</option>
              <option value="TERM LOAN">Term Loan</option>
              <option value="PERSONAL LOAN">Personal Loan</option>
              <option value="HOME LOAN">Home Loan</option>
              <option value="LAP LOAN">LAP Loan</option>
              <option value="OD LIMIT">OD Limit</option>
              <option value="CC LIMIT">CC Limit</option>
              <option value="SOLAR LOAN">Solar Loan</option>
              <option value="CV && CE">CV & CE</option>
            </select>

            <label style={labelStyle}>Salutation *</label>
            <select {...fieldProps("salutation")}>
              <option value="">Select</option>
              <option value="MR.">Mr.</option>
              <option value="MS.">Ms.</option>
            </select>

            <label style={labelStyle}>Full Name *</label>
            <input {...fieldProps("fullName")} />

            <label style={labelStyle}>Mobile *</label>
            <input {...fieldProps("mobile")} />

            <label style={labelStyle}>Required Loan Amount *</label>
            <input {...fieldProps("requiredLoanAmount")} />
            <span style={{ fontSize: "12px", color: "#555" }}>
              {formData.requiredLoanAmount && formatAmount(formData.requiredLoanAmount)}
            </span>

            <label style={labelStyle}>Location *</label>
            <div style={{ display: "flex", gap: "10px" }}>
              <input {...fieldProps("location")} />
              <button onClick={openMap} style={{ background: "#16a34a", color: "#fff", border: "none", padding: "10px 18px", borderRadius: "8px", cursor: "pointer", whiteSpace: "nowrap" }}>📍 Map</button>
            </div>
          </div>
          {/* MIDDLE COLUMN */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={labelStyle}>Firm Name</label>
            <input name="source" value={formData.source || ""} onChange={handleChange} style={inputStyle} />

            <label style={labelStyle}>Sub Source</label>
            <input name="subSource" value={formData.subSource || ""} onChange={handleChange} style={inputStyle} />
  
            <label style={labelStyle}>Bank Name</label>
            <input list="bank-list" name="bankName" value={formData.bankName || ""} onChange={handleChange} style={inputStyle} placeholder="Type or Select Bank" />
            <datalist id="bank-list">
              {bankList.map((b, i) => <option key={i} value={b} />)}
            </datalist>

            <label style={labelStyle}>RM Name</label>
            <input name="rmName" value={formData.rmName || ""} onChange={handleChange} style={inputStyle} placeholder="Enter RM Name" />

            {/* ASSIGN TO OTHERS (SUPER USER DROPDOWN LOGIC) */}
            <label style={labelStyle}>Lead Created (Owner ID) *</label>
            {isSuperUser ? (
              <select 
                name="owner" 
                value={formData.owner || ""} 
                onChange={handleChange} 
                style={{
                  ...inputStyle, 
                  background: "#e0f2fe",
                  borderBottom: "2px solid #0284c7",
                  cursor: "pointer"
                }}
              >
                <option value="">Select Employee to Assign</option>
                {empList.map((emp) => (
                  <option key={emp.employee_id} value={emp.employee_id.toUpperCase()}>
                    {emp.employee_id} - {emp.first_name}
                  </option>
                ))}
              </select>
            ) : (
              <input 
                name="owner" 
                value={formData.owner || ""} 
                readOnly 
                style={{
                  ...inputStyle, 
                  background: "#eee",
                  borderBottom: "1px solid #ccc",
                  cursor: "not-allowed"
                }} 
              />
            )}
           
            {isSuperUser && formData.owner && (
              <span style={{ 
                fontSize: "13px", 
                marginTop: "6px", 
                fontWeight: "600",
                color: empMap[formData.owner] ? "#16a34a" : "#ef4444" 
              }}>
                {empMap[formData.owner] 
                  ? `👤 Assigned To: ${empMap[formData.owner]}` 
                  : "⚠️ Please Select Valid ID"}
              </span>
            )}
             
            <label style={labelStyle}>Status *</label>
            <select {...fieldProps("progress")}>
               <option value="">Select</option>
               <option value="PIPELINE">PIPELINE</option>
               <option value="DOCUMENT LIST SEND">DOCUMENT LIST SEND</option>
               <option value="DOCUMENT RECIEVED">DOCUMENT RECIEVED</option>
               <option value="QUERY">QUERY</option>
               <option value="DEDUPE CHECK">DEDUPE CHECK</option>
               <option value="DEDUPE DONE">DEDUPE DONE</option>
               <option value="LOGIN">LOGIN</option>
               <option value="IN PROGRESS">IN PROGRESS</option>
               <option value="UNDER WRITING">UNDER WRITING</option>
               <option value="PD INITIATE">PD INITIATE</option>
               <option value="PD DONE">PD DONE</option>
               <option value="TECHNICAL INITIATE">TECHNICAL INITIATE</option>
               <option value="TECHNICAL DONE">TECHNICAL DONE</option>
               <option value="VALUATION INITIATE">VALUATION INITIATE</option>
               <option value="VALUATION DONE">VALUATION DONE</option>
               <option value="UNDER SANCTION">UNDER SANCTION</option>
               <option value="SANCTION">SANCTION</option>
               <option value="DOC KIT ASIGN">DOC KIT ASIGN</option>
               <option value="REJECT">REJECT</option>
               <option value="DISBURSEMENT">DISBURSEMENT</option>
            </select>
          </div>

          {/* RIGHT COLUMN */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={labelStyle}>Next Date</label>
            <input type="date" name="nextDate" value={formData.nextDate || ""} onChange={handleChange} style={inputStyle} />
            
            <label style={labelStyle}>Next Time</label>
            <input type="time" name="nextTime" value={formData.nextTime || ""} onChange={handleChange} style={inputStyle} />
            
            <label style={labelStyle}>DOB *</label>
            <input type="text" name="dob" value={formData.dob || ""} onChange={handleChange} style={inputStyle} placeholder="DD/MM/YYYY" />
            
            <label style={labelStyle}>Additional</label>
            <input name="additional" value={formData.additional || ""} onChange={handleChange} style={inputStyle} />
          </div>
        </div>

        <button onClick={handleSubmit} style={{ background: "#16a34a", color: "#fff", padding: "12px 30px", marginTop: "20px", border: "none", cursor: "pointer", borderRadius: "5px" }}>
          {isEditing ? "Update Lead" : "Add Lead"}
        </button>
      </div>
    </div>
  );
}

export default AddLead;



