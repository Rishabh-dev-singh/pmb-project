import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function AddLead() {
  const navigate = useNavigate();
  const location = useLocation();
  const existingLead = location.state?.lead;
  const isEditing = !!existingLead;

  const [bankList, setBankList] = useState([]);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    prospectType: "", loanType: "", salutation: "", fullName: "",
    mobile: "", requiredLoanAmount: "", location: "", source: "",
    subSource: "", bankName: "", rmName: "", owner: "",
    progress: "", nextDate: "", nextTime: "", dob: "", additional: ""
  });

  useEffect(() => {
    fetch("https://pmb.finance/api/banks/")
      .then((res) => res.json())
      .then((data) => setBankList(data))
      .catch((err) => console.error("Bank list fetch error:", err));

    if (isEditing) {
      setFormData(existingLead);
    } else {
      const empId = localStorage.getItem("employeeId") || "";
      setFormData(prev => ({ ...prev, owner: empId.toUpperCase() }));
    }
  }, [isEditing, existingLead]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value.toUpperCase() }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const required = ["prospectType", "loanType", "salutation", "fullName", "mobile", "requiredLoanAmount", "progress", "owner", "location", "dob"];
    let newErrors = {};
    required.forEach(field => {
      if (!formData[field]) newErrors[field] = "Required";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      alert("⚠️ Please fill all required fields!");
      return;
    }

    let payload = { ...formData };
    if (payload.dob && payload.dob.includes("/")) {
      const parts = payload.dob.split("/");
      if (parts.length === 3) payload.dob = `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
    }

    const url = isEditing ? `https://pmb.finance/api/leads/${existingLead.id}/update/` : "https://pmb.finance/api/leads/";
    
    try {
      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
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
    if (!formData.location) { setErrors(prev => ({ ...prev, location: "Required" })); return; }
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formData.location)}`, '_blank');
  };

  const inputStyle = { padding: "10px", border: "none", borderBottom: "1px solid #ccc", outline: "none", fontSize: "14px", background: "transparent", width: "100%", textTransform: "uppercase" };
  const labelStyle = { fontSize: "15px", fontWeight: "600", marginTop: "14px", color: "#16a34a" };

  return (
    <div style={{ background: "#f5f7fb", minHeight: "100vh", padding: "15px" }}>
      <div style={{ background: "#fff", padding: "20px", borderRadius: "8px", maxWidth: "1200px", margin: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2>{isEditing ? "Edit Lead" : "Add Lead Customer"}</h2>
          <span onClick={() => navigate("/employee-dashboard")} style={{ fontSize: "22px", cursor: "pointer", color: "#ef4444", fontWeight: "bold" }}>✕</span>
        </div>

        <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          
          {/* Left Column */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={labelStyle}>Prospect Type *</label>
            <select name="prospectType" value={formData.prospectType} onChange={handleChange} style={inputStyle}>
              <option value="">Select</option><option>COMPANY</option><option>INDIVIDUAL</option>
            </select>
            
            <label style={labelStyle}>Loan Type *</label>
            <select name="loanType" value={formData.loanType} onChange={handleChange} style={inputStyle}>
              <option value="">Select</option>
              <option>BUSINESS LOAN</option><option>TERM LOAN</option><option>PERSONAL LOAN</option>
              <option>HOME LOAN</option><option>LAP LOAN</option><option>OD LIMIT</option>
              <option>CC LIMIT</option><option>SOLAR LOAN</option><option>CV & CE</option>
            </select>

            <label style={labelStyle}>Full Name *</label>
            <input name="fullName" value={formData.fullName} onChange={handleChange} style={inputStyle} />

            <label style={labelStyle}>Mobile *</label>
            <input name="mobile" value={formData.mobile} onChange={handleChange} style={inputStyle} />
            
            <label style={labelStyle}>Required Loan Amount *</label>
            <input name="requiredLoanAmount" value={formData.requiredLoanAmount} onChange={handleChange} style={inputStyle} />

            <label style={labelStyle}>Location *</label>
            <div style={{ display: "flex", gap: "10px" }}>
              <input name="location" value={formData.location} onChange={handleChange} style={inputStyle} />
              <button onClick={openMap} style={{ background: "#16a34a", color: "#fff", border: "none", padding: "10px 18px", borderRadius: "8px", cursor: "pointer" }}>📍 Map</button>
            </div>
          </div>

          {/* Middle Column */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={labelStyle}>Firm Name</label>
            <input name="source" value={formData.source} onChange={handleChange} style={inputStyle} />
            
            <label style={labelStyle}>Bank Name</label>
            <input list="bank-list" name="bankName" value={formData.bankName} onChange={handleChange} style={inputStyle} />
            <datalist id="bank-list">{bankList.map((b, i) => <option key={i} value={b} />)}</datalist>

            <label style={labelStyle}>Lead Created *</label>
            <input name="owner" value={formData.owner} readOnly style={{...inputStyle, background: "#eee"}} />

            <label style={labelStyle}>Status *</label>
            <select name="progress" value={formData.progress} onChange={handleChange} style={inputStyle}>
              <option value="">Select</option>
              <option>PIPELINE</option><option>LOGIN</option><option>SANCTION</option><option>REJECT</option><option>DISBURSEMENT</option>
            </select>
          </div>

          {/* Right Column */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={labelStyle}>DOB *</label>
            <input name="dob" value={formData.dob} onChange={handleChange} style={inputStyle} placeholder="DD/MM/YYYY" />
            <label style={labelStyle}>Next Date</label>
            <input type="date" name="nextDate" value={formData.nextDate} onChange={handleChange} style={inputStyle} />
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