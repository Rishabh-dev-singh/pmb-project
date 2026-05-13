import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function AddLead() {
  const formRef = useRef({});
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  // EDIT LOGIC: Check if we are in Edit Mode
  const existingLead = location.state?.lead;
  const isEditing = !!existingLead;

  // Pre-fill form if we are in Edit Mode
  useEffect(() => {
    if (isEditing) {
      formRef.current = { ...existingLead };
      // DOM inputs ko update karo taaki user ko purana data dikhe
      const inputs = document.querySelectorAll("input, select, textarea");
      inputs.forEach((input) => {
        if (input.name && existingLead[input.name]) {
          input.value = existingLead[input.name];
        }
      });
    }
  }, [isEditing, existingLead]);

  const requiredFields = [
    "prospectType", "loanType", "salutation", "fullName", "mobile",
    "requiredLoanAmount", "progress", "owner", "location", "dob"
  ];

  const handleChange = (e) => {
    formRef.current[e.target.name] = e.target.value?.trim();
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
    if (requiredFields.includes(name) && !formRef.current[name]) {
      setErrors((prev) => ({ ...prev, [name]: "Required" }));
    }
  };

  const validate = () => {
    let newErrors = {};
    requiredFields.forEach((field) => {
      // Check current Ref value
      if (!formRef.current[field] || formRef.current[field] === "") {
        newErrors[field] = "Required";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatAmount = (value) => {
    const num = parseFloat(value?.replace(/,/g, ""));
    if (isNaN(num)) return "";
    if (num >= 10000000) return (num / 10000000).toFixed(2) + " Cr";
    if (num >= 100000) return (num / 100000).toFixed(2) + " Lakh";
    if (num >= 1000) return (num / 1000).toFixed(2) + " Thousand";
    return num;
  };

  const handleSubmit = async () => {
    // 1. Validation Check
    if (!validate()) {
      alert("⚠️ Please fill all required fields!");
      return;
    }

    let formData = { ...formRef.current };

    // Get latest input values from DOM (in case some weren't captured by handleChange)
    const inputs = document.querySelectorAll("input, select, textarea");
    inputs.forEach((input) => {
      if (input.name && input.name !== "dobPicker") {
        formData[input.name] = input.value;
      }
    });

    // 2. Date Format Fix (DD/MM/YYYY -> YYYY-MM-DD)
    if (formData.dob && formData.dob.includes("/")) {
      const parts = formData.dob.split("/");
      if (parts.length === 3) {
        formData.dob = `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
      }
    }

    delete formData.dobPicker;

    // URL and Method selection (Edit vs Add)
    const url = isEditing 
      ? `http://127.0.0.1:8000/api/leads/${existingLead.id}/update/` 
      : "http://127.0.0.1:8000/api/leads/";
      
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert(isEditing ? "✅ Lead Updated Successfully" : "✅ Lead Saved Successfully");
        navigate("/employee-dashboard", { state: { refresh: true } });
      } else {
        console.error("Server Error:", data);
        alert("❌ Error: " + JSON.stringify(data));
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      alert("Server error, please check connection.");
    }
  };

  const openMap = () => {
    const location = formRef.current.location;
    if (!location || location.trim() === "") {
      setErrors((prev) => ({ ...prev, location: "Required" }));
      return;
    }
    window.location.href = `https://www.google.com/maps/search/${encodeURIComponent(location)}`;
  };

  const inputStyle = { padding: "10px", border: "none", borderBottom: "1px solid #ccc", outline: "none", fontSize: "14px", background: "transparent", width: "100%" };
  const labelStyle = { fontSize: "15px", fontWeight: "600", marginTop: "14px", color: "#16a34a" };
  const fieldProps = (name) => ({ name, onChange: handleChange, onBlur: handleBlur, onFocus: handleFocus, style: inputStyle });

  return (
    <div style={{ background: "#f5f7fb", minHeight: "100vh", padding: "15px" }}>
      <div style={{ background: "#fff", padding: "20px", borderRadius: "8px", maxWidth: "1200px", margin: "auto" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ margin: 0 }}>{isEditing ? "Edit Lead" : "Add Lead Customer"}</h2>
          <span onClick={() => navigate("/employee-dashboard")} style={{ fontSize: "22px", cursor: "pointer", color: "#ef4444", fontWeight: "bold" }}>✕</span>
        </div>

        <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          {/* LEFT */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={labelStyle}>Prospect Type *</label>
            <select {...fieldProps("prospectType")}>
              <option value="">Select</option>
              <option>Company</option>
              <option>Individual</option>
            </select>
            {errors.prospectType && <span style={{ color: "red", fontSize: 12 }}>{errors.prospectType}</span>}

            <label style={labelStyle}>Loan Type *</label>
            <select {...fieldProps("loanType")}>
              <option value="">Select</option>
              <option>Business Loan</option>
              <option>Term Loan</option>
              <option>Personal Loan</option>
              <option>Home Loan</option>
              <option>LAP Loan</option>
              <option>OD Limit</option>
              <option>CC Limit</option>
              <option>Solar Loan</option>
              <option>CV && CE</option>
            </select>
            {errors.loanType && <span style={{ color: "red", fontSize: 12 }}>{errors.loanType}</span>}

            <label style={labelStyle}>Salutation *</label>
            <select {...fieldProps("salutation")}>
              <option value="">Select</option>
              <option>Mr.</option>
              <option>Ms.</option>
            </select>
            {errors.salutation && <span style={{ color: "red", fontSize: 12 }}>{errors.salutation}</span>}

            <label style={labelStyle}>Full Name *</label>
            <input {...fieldProps("fullName")} />
            {errors.fullName && <span style={{ color: "red", fontSize: 12 }}>{errors.fullName}</span>}

            <label style={labelStyle}>Mobile *</label>
            <input {...fieldProps("mobile")} />
            {errors.mobile && <span style={{ color: "red", fontSize: 12 }}>{errors.mobile}</span>}

            <label style={labelStyle}>Required Loan Amount *</label>
            <input {...fieldProps("requiredLoanAmount")} />
            {errors.requiredLoanAmount && <span style={{ color: "red", fontSize: 12 }}>{errors.requiredLoanAmount}</span>}
            <span style={{ fontSize: "12px", color: "#555" }}>{formRef.current.requiredLoanAmount && formatAmount(formRef.current.requiredLoanAmount)}</span>

            <label style={labelStyle}>Location *</label>
            <div style={{ display: "flex", gap: "10px" }}>
              <input {...fieldProps("location")} />
              <button onClick={openMap} style={{ background: "#16a34a", color: "#fff", border: "none", padding: "10px 18px", borderRadius: "8px", cursor: "pointer" }}>📍 Map</button>
            </div>
            {errors.location && <span style={{ color: "red", fontSize: 12 }}>{errors.location}</span>}
          </div>

          {/* MIDDLE */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={labelStyle}>Lead Source</label>
            <input name="source" onChange={handleChange} style={inputStyle} />
            <label style={labelStyle}>Sub Source</label>
            <input name="subSource" onChange={handleChange} style={inputStyle} />
            <label style={labelStyle}>Owner *</label>
            <input {...fieldProps("owner")} />
            {errors.owner && <span style={{ color: "red", fontSize: 12 }}>{errors.owner}</span>}
            <label style={labelStyle}>Progress *</label>
            <select {...fieldProps("progress")}>
              <option value="">Select</option>
              <option>PIPELINE</option>
              <option>DOCUMENT LIST SEND</option>
              <option>DOCUMENT RECIEVED</option>
              <option>DOCUMENTS COMPLETE</option>
              <option>QUERY</option>
              <option>LOGIN</option>
              <option>SUBMITTED TO BANK</option>
              <option>REJECTED</option>
              <option>DOCUMENT PENDING</option>
            </select>
            {errors.progress && <span style={{ color: "red", fontSize: 12 }}>{errors.progress}</span>}
            <label style={labelStyle}>Remarks</label>
            <textarea name="remarks" onChange={handleChange} style={{ ...inputStyle, height: 60 }} />
          </div>

          {/* RIGHT */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={labelStyle}>Next Date</label>
            <input type="date" name="nextDate" onChange={handleChange} style={inputStyle} />
            <label style={labelStyle}>Next Time</label>
            <input type="time" name="nextTime" onChange={handleChange} style={inputStyle} />
            <label style={labelStyle}>DOB *</label>
            <input type="text" name="dob" onChange={handleChange} style={inputStyle} placeholder="DD/MM/YYYY" />
            {errors.dob && <span style={{ color: "red", fontSize: 12 }}>{errors.dob}</span>}
            <label style={labelStyle}>Additional</label>
            <input name="additional" onChange={handleChange} style={inputStyle} />
          </div>
        </div>

        <div style={{ textAlign: "right", marginTop: "20px" }}>
          <button onClick={handleSubmit} style={{ background: "#16a34a", color: "#fff", padding: "10px 25px", border: "none", cursor: "pointer" }}>
            {isEditing ? "Update Lead" : "Add Lead"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddLead;