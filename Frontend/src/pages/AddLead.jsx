import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function AddLead() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [bankList, setBankList] = useState([]); 
  const navigate = useNavigate();
  const location = useLocation();

  const existingLead = location.state?.lead;
  const isEditing = !!existingLead;

  useEffect(() => {
    fetch("https://pmb.finance/api/banks/")
      .then((res) => res.json())
      .then((data) => setBankList(data))
      .catch((err) => console.error("Bank list fetch error:", err));
  }, []);

  // Set initial form data for Edit or New Lead
  useEffect(() => {
    if (isEditing) {
      // API se aaya hua data state me set kar rahe hain
      setFormData({ ...existingLead });
    } else {
      const empId = localStorage.getItem("employeeId") || "";
      setFormData({ owner: empId.toUpperCase() });
    }
  }, [isEditing, existingLead]);

  const requiredFields = [
    "prospectType", "loanType", "salutation", "fullName", "mobile",
    "requiredLoanAmount", "progress", "owner", "location", "dob"
  ];

  const handleChange = (e) => {
    const val = e.target.value?.trimStart(); // trim() ki jagah trimStart() taki space type kar sakein
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
    
    // Copy the form data for submission
    let payload = { ...formData };

    if (payload.dob && payload.dob.includes("/")) {
      const parts = payload.dob.split("/");
      if (parts.length === 3) {
        payload.dob = `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
      }
    }

    const url = isEditing ? `https://pmb.finance/api/leads/${existingLead.id}/update/` : "https://pmb.finance/api/leads/";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        alert(isEditing ? "✅ Lead Updated Successfully" : "✅ Lead Saved Successfully");
        navigate("/employee-dashboard", { state: { refresh: true } });
      } else {
        alert("❌ Error: " + JSON.stringify(await res.json()));
      }
    } catch (error) {
      alert("Server error, please check connection.");
    }
  };

  const openMap = () => {
    const loc = formData.location;
    if (!loc) { setErrors((prev) => ({ ...prev, location: "Required" })); return; }
    // Fixed string interpolation syntax error from 0{...} to ${...}
    window.location.href = `http://googleusercontent.com/maps.google.com/${encodeURIComponent(loc)}`;
  };

  const inputStyle = { padding: "10px", border: "none", borderBottom: "1px solid #ccc", outline: "none", fontSize: "14px", background: "transparent", width: "100%", textTransform: "uppercase" };
  const labelStyle = { fontSize: "15px", fontWeight: "600", marginTop: "14px", color: "#16a34a" };
  
  // Notice we added `value: formData[name] || ""` to make the inputs controlled
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
              <option>Company</option><option>Individual</option>
            </select>
            {errors.prospectType && <span style={{ color: "red", fontSize: 12 }}>{errors.prospectType}</span>}

            <label style={labelStyle}>Loan Type *</label>
            <select {...fieldProps("loanType")}>
              <option value="">Select</option>
              <option>Business Loan</option><option>Term Loan</option><option>Personal Loan</option>
              <option>Home Loan</option><option>LAP Loan</option><option>OD Limit</option>
              <option>CC Limit</option><option>Solar Loan</option><option>CV && CE</option>
            </select>

            <label style={labelStyle}>Salutation *</label>
            <select {...fieldProps("salutation")}>
              <option value="">Select</option><option>Mr.</option><option>Ms.</option>
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
              <button onClick={openMap} style={{ background: "#16a34a", color: "#fff", border: "none", padding: "10px 18px", borderRadius: "8px", cursor: "pointer" }}>📍 Map</button>
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

            <label style={labelStyle}>Lead Created *</label>
            <input name="owner" value={formData.owner || ""} readOnly style={inputStyle} />
            
            <label style={labelStyle}>Status *</label>
            <select {...fieldProps("progress")}>
               <option value="">Select</option>
               <option>PIPELINE</option><option>DOCUMENT LIST SEND</option><option>DOCUMENT RECIEVED</option>
               <option>QUERY</option><option>DEDUPE CHECK</option><option>DEDUPE DONE</option><option>LOGIN</option>
               <option>IN PROGRESS</option><option>UNDER WRITING</option><option>PD INITIATE</option>
               <option>PD DONE</option><option>TECHNICAL INITIATE</option><option>TECHNICAL DONE</option>
               <option>VALUATION INITIATE</option><option>VALUATION DONE</option><option>UNDER SANCTION</option>
               <option>SANCTION</option><option>DOC KIT ASIGN</option><option>REJECT</option><option>DISBURSEMENT</option>
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