import React, { useState } from "react";
import { 
  Box, 
  TextField, 
  MenuItem, 
  Button, 
  Typography, 
  Grid, 
  Paper, 
  Divider,
  InputAdornment 
} from "@mui/material";
import { 
  Business, 
  WorkOutline, 
  PeopleAlt, 
  Event, 
  Send,
  RestartAlt
} from "@mui/icons-material";

// Jaipur/RIICO specific industries
const industries = [
  "Garments & Textiles",
  "Gems & Jewellery",
  "Handicrafts & Wooden Furniture",
  "Stone Processing & Marble",
  "Auto Parts & Engineering",
  "Food Processing & Agro",
  "Packaging & Paper",
  "IT & Software Services",
  "Manufacturing (Other)"
];

const workerTypes = [
  "Helper / General Labour",
  "Machine Operator",
  "Tailor / Stitching Master",
  "Artisan / Craftsman",
  "Welder / Fitter",
  "Electrician / Plumber",
  "Store Keeper / Inventory Manager",
  "Supervisor / Shift Incharge",
  "Accountant / Cashier",
  "Sales & Marketing Executive",
  "Office Admin / Manager",
  "Security Guard",
  "Driver / Delivery Executive"
];

function RequirementForm() {
  const [formData, setFormData] = useState({
    industryType: "",
    workerType: "",
    workerCount: "",
    requiredDate: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Requirement Submitted Payload:", formData);
    alert("Requirement submitted successfully!");
  };

  const handleReset = () => {
    setFormData({ industryType: "", workerType: "", workerCount: "", requiredDate: "" });
  };

  const today = new Date().toISOString().split("T")[0];

  // Modern SaaS Input Style
  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      transition: "all 0.2s ease-in-out",
      "& fieldset": { borderColor: "#cbd5e1" },
      "&:hover fieldset": { borderColor: "#94a3b8" },
      "&.Mui-focused fieldset": { 
        borderColor: "#0f3c6e", 
        borderWidth: "2px",
        boxShadow: "0 0 0 4px rgba(15, 60, 110, 0.1)" 
      },
    }
  };

  const labelStyle = { 
    mb: 1, 
    fontWeight: 600, 
    color: "#334155",
    fontSize: "0.9rem",
    display: "flex",
    alignItems: "center",
    gap: "6px"
  };

  return (
    <Box 
      sx={{ 
        p: { xs: 2, md: 4 }, 
        minHeight: "calc(100vh - 80px)", 
        display: "flex", 
        alignItems: "flex-start", 
        justifyContent: "center",
        backgroundColor: "#f1f5f9", // Very soft corporate gray
        pt: { xs: 4, md: 8 }
      }}
    >
      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 3, md: 5 }, 
          borderRadius: "16px", 
          maxWidth: "850px", 
          width: "100%",
          boxShadow: "0 10px 40px -10px rgba(0,0,0,0.1)", 
          backgroundColor: "#ffffff",
          border: "1px solid #e2e8f0"
        }}
      >
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="800" sx={{ color: "#0f3c6e", mb: 1 }}>
            Submit Labour Requirement
          </Typography>
          <Typography variant="body1" sx={{ color: "#64748b" }}>
            Fill out the details below. Our team will process your request and connect you with the right workforce.
          </Typography>
        </Box>

        <Divider sx={{ mb: 5, borderColor: "#e2e8f0" }} />

        <Box component="form" onSubmit={handleSubmit}>
          {/* Main Grid: Strictly 2 Columns on Desktop */}
          <Grid container spacing={4}>
            
            {/* Industry Dropdown */}
            <Grid item xs={12} md={6}>
              <Typography sx={labelStyle}>
                <Business fontSize="small" sx={{ color: "#0f3c6e" }}/> Industry Sector *
              </Typography>
              <TextField 
                select 
                fullWidth 
                name="industryType" 
                value={formData.industryType} 
                onChange={handleChange} 
                required
                variant="outlined"
                placeholder="Select your industry"
                sx={inputStyle}
              >
                {industries.map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Worker Type Dropdown */}
            <Grid item xs={12} md={6}>
              <Typography sx={labelStyle}>
                <WorkOutline fontSize="small" sx={{ color: "#0f3c6e" }}/> Required Role *
              </Typography>
              <TextField 
                select 
                fullWidth 
                name="workerType" 
                value={formData.workerType} 
                onChange={handleChange} 
                required
                variant="outlined"
                sx={inputStyle}
              >
                {workerTypes.map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Worker Count */}
            <Grid item xs={12} md={6}>
              <Typography sx={labelStyle}>
                <PeopleAlt fontSize="small" sx={{ color: "#0f3c6e" }}/> Headcount Required *
              </Typography>
              <TextField 
                fullWidth 
                type="number" 
                name="workerCount" 
                placeholder="e.g. 5"
                value={formData.workerCount} 
                onChange={handleChange} 
                required 
                inputProps={{ min: "1" }}
                sx={inputStyle}
              />
            </Grid>

            {/* Date Selection */}
            <Grid item xs={12} md={6}>
              <Typography sx={labelStyle}>
                <Event fontSize="small" sx={{ color: "#0f3c6e" }}/> Deployment Date *
              </Typography>
              <TextField 
                fullWidth 
                type="date" 
                name="requiredDate" 
                value={formData.requiredDate} 
                onChange={handleChange} 
                required 
                inputProps={{ min: today }}
                sx={inputStyle}
              />
            </Grid>

          </Grid>

          <Divider sx={{ mt: 5, mb: 3, borderColor: "#e2e8f0" }} />

          {/* Form Actions */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button 
              variant="outlined" 
              onClick={handleReset}
              startIcon={<RestartAlt />}
              sx={{ 
                borderRadius: "8px", 
                px: 3, 
                py: 1.2,
                textTransform: "none", 
                fontWeight: 600,
                color: "#64748b",
                borderColor: "#cbd5e1",
                "&:hover": { borderColor: "#94a3b8", backgroundColor: "#f8fafc" }
              }}
            >
              Reset Details
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              endIcon={<Send />}
              sx={{ 
                py: 1.2, 
                px: 4,
                fontWeight: "bold", 
                borderRadius: "8px", 
                background: "#0f3c6e",
                textTransform: "none",
                boxShadow: "0 4px 12px rgba(15, 60, 110, 0.2)",
                "&:hover": {
                  background: "#1a5294",
                  boxShadow: "0 6px 16px rgba(15, 60, 110, 0.3)",
                }
              }}
            >
              Submit Request
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default RequirementForm;