import React, { useState } from "react";
import { 
  Box, TextField, MenuItem, Button, Typography, Grid, Paper, Divider, CircularProgress 
} from "@mui/material";
import { 
  Business, WorkOutline, PeopleAlt, Event, Send, RestartAlt, 
  Person, Phone, Email, ArrowBack, LocationCity, HomeWork 
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const industries = [
  "Garments & Textiles", "Gems & Jewellery", "Handicrafts & Wooden Furniture", 
  "Stone Processing & Marble", "Auto Parts & Engineering", "Food Processing & Agro", 
  "Packaging & Paper", "IT & Software Services", "Manufacturing (Other)"
];

const workerTypes = [
  "Helper / General Labour", "Machine Operator", "Tailor / Stitching Master", 
  "Artisan / Craftsman", "Welder / Fitter", "Electrician / Plumber", 
  "Store Keeper / Inventory Manager", "Supervisor / Shift Incharge", 
  "Accountant / Cashier", "Sales & Marketing Executive", "Office Admin / Manager", 
  "Security Guard", "Driver / Delivery Executive"
];

function RequirementForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "", mobile: "", email: "", companyName: "", 
    companyAddress: "", industryType: "", workerType: "", 
    workerCount: "", requiredDate: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Backend API call
      const response = await api.post('/industry/submit-requirement/', formData);
      
      if (response.status === 201 || response.status === 200) {
        alert("Requirement submitted successfully!");
        handleReset();
      }
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Failed to submit. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({ 
      name: "", mobile: "", email: "", companyName: "", 
      companyAddress: "", industryType: "", workerType: "", 
      workerCount: "", requiredDate: "" 
    });
  };

  const today = new Date().toISOString().split("T")[0];

  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#ffffff", borderRadius: "8px", transition: "all 0.2s ease-in-out",
      "& fieldset": { borderColor: "#cbd5e1" },
      "&:hover fieldset": { borderColor: "#94a3b8" },
      "&.Mui-focused fieldset": { borderColor: "#0f3c6e", borderWidth: "2px" }
    }
  };

  const labelStyle = { 
    mb: 1, fontWeight: 600, color: "#334155", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "6px" 
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, minHeight: "100vh", backgroundColor: "#f1f5f9", pt: { xs: 4, md: 8 } }}>
      <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: "16px", maxWidth: "850px", width: "100%", mx: "auto", boxShadow: "0 10px 40px -10px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0" }}>
        
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/consultancy')} sx={{ mb: 3, color: "#64748b", textTransform: 'none' }}>
          Back to Home
        </Button>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="800" sx={{ color: "#0f3c6e", mb: 1 }}>Submit Worker Requirement</Typography>
          <Typography variant="body1" sx={{ color: "#64748b" }}>Enter your company and contact details to proceed.</Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <Typography variant="h6" sx={{ color: "#0f3c6e", mb: 2, fontWeight: 700 }}>Organization Details</Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Typography sx={labelStyle}><Person fontSize="small" sx={{ color: "#0f3c6e" }}/> Full Name *</Typography>
              <TextField fullWidth name="name" value={formData.name} onChange={handleChange} required placeholder="Enter full name" sx={inputStyle} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={labelStyle}><Phone fontSize="small" sx={{ color: "#0f3c6e" }}/> Mobile Number *</Typography>
              <TextField fullWidth type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required placeholder="Enter mobile" sx={inputStyle} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={labelStyle}><Email fontSize="small" sx={{ color: "#0f3c6e" }}/> Email Address</Typography>
              <TextField fullWidth type="email" name="email" value={formData.email} onChange={handleChange} placeholder="email@company.com" sx={inputStyle} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={labelStyle}><LocationCity fontSize="small" sx={{ color: "#0f3c6e" }}/> Company Name *</Typography>
              <TextField fullWidth name="companyName" value={formData.companyName} onChange={handleChange} required placeholder="Enter company name" sx={inputStyle} />
            </Grid>
            <Grid item xs={12}>
              <Typography sx={labelStyle}><HomeWork fontSize="small" sx={{ color: "#0f3c6e" }}/> Company Full Address *</Typography>
              <TextField fullWidth multiline rows={2} name="companyAddress" value={formData.companyAddress} onChange={handleChange} required placeholder="Enter full address" sx={inputStyle} />
            </Grid>
          </Grid>

          <Divider sx={{ mb: 4, borderColor: "#e2e8f0" }} />

          <Typography variant="h6" sx={{ color: "#0f3c6e", mb: 2, fontWeight: 700 }}>Work Requirements</Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography sx={labelStyle}><Business fontSize="small" sx={{ color: "#0f3c6e" }}/> Industry Sector *</Typography>
              <TextField select fullWidth name="industryType" value={formData.industryType} onChange={handleChange} required sx={inputStyle}>
                {industries.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={labelStyle}><WorkOutline fontSize="small" sx={{ color: "#0f3c6e" }}/> Required Role *</Typography>
              <TextField select fullWidth name="workerType" value={formData.workerType} onChange={handleChange} required sx={inputStyle}>
                {workerTypes.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={labelStyle}><PeopleAlt fontSize="small" sx={{ color: "#0f3c6e" }}/> Headcount *</Typography>
              <TextField fullWidth type="number" name="workerCount" value={formData.workerCount} onChange={handleChange} required inputProps={{ min: "1" }} sx={inputStyle} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={labelStyle}><Event fontSize="small" sx={{ color: "#0f3c6e" }}/> Deployment Date *</Typography>
              <TextField fullWidth type="date" name="requiredDate" value={formData.requiredDate} onChange={handleChange} required inputProps={{ min: today }} sx={inputStyle} />
            </Grid>
          </Grid>

          <Divider sx={{ mt: 5, mb: 3, borderColor: "#e2e8f0" }} />

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button variant="outlined" onClick={handleReset} startIcon={<RestartAlt />} sx={{ borderRadius: "8px", px: 3, py: 1.2, textTransform: "none", color: "#64748b", borderColor: "#cbd5e1" }}>Reset</Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={loading}
              endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />} 
              sx={{ py: 1.2, px: 4, fontWeight: "bold", borderRadius: "8px", background: "#0f3c6e", textTransform: "none" }}
            >
              {loading ? "Submitting..." : "Submit Request"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default RequirementForm;