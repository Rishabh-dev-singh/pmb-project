import Navbar from "../components/Navbar"
import { Box, Typography, TextField, MenuItem, Button, Paper } from "@mui/material"
import { useState } from "react"

// ==========================================
// 💡 CONFIGURATION (Localhost connection fix)
// ==========================================
const API_BASE_URL = "https://pmb.finance"; 

function LoanType() {
  const [loan, setLoan] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async () => {
    if (!loan) {
      alert("Please select loan type")
      return
    }

    try {
      const leadId = localStorage.getItem("lead_id")
      
      // ✅ URL updated to use API_BASE_URL (Localhost)
      const response = await fetch(`${API_BASE_URL}/api/update-loan-type/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: leadId,
          loan_type: loan
        })
      })

      if (response.ok) {
        setSuccess(true)
      } else {
        alert("Server error. Please try again.")
      }
    } catch (error) {
      console.error(error)
      alert("Connection failed. Make sure your local Django server is running.")
    }
  }

  return (
    <Box>
    
      <Box
        sx={{
          minHeight: "90vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f4f7fb"
        }}
      >
        {success ? (
          <Paper
            sx={{
              p: 6,
              width: 450,
              borderRadius: "20px",
              textAlign: "center",
              background: "linear-gradient(135deg,#1a237e,#0d47a1)",
              color: "#fff"
            }}
          >
            <Typography variant="h3" sx={{ mb: 2 }}>
              🎉 Thank You
            </Typography>
            <Typography sx={{ fontSize: "18px", mb: 2 }}>
              Your query has been submitted successfully.
            </Typography>
            <Typography sx={{ fontSize: "16px" }}>
              Our team will contact you shortly.
            </Typography>
            <Typography sx={{ mt: 3, fontWeight: "bold" }}>
              PMB Financial Services
            </Typography>
          </Paper>
        ) : (
          <Paper sx={{ p: 5, width: 420, borderRadius: "12px" }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
              Select Loan Type
            </Typography>

            <TextField
              select
              label="Loan Type"
              fullWidth
              sx={{ mb: 3 }}
              value={loan}
              onChange={(e) => setLoan(e.target.value)}
            >
              <MenuItem value="Business Loan">Business Loan</MenuItem>
              <MenuItem value="Term Loan">Term Loan</MenuItem>
              <MenuItem value="Personal Loan">Personal Loan</MenuItem>
              <MenuItem value="Home Loan">Home Loan</MenuItem>
              <MenuItem value="LAP Loan">LAP Loan</MenuItem>
              <MenuItem value="OD Limit">OD (Overdraft Limit)</MenuItem>
              <MenuItem value="CC Limit">CC Limit</MenuItem>
              <MenuItem value="Solar Loan">Solar Loan</MenuItem>
              <MenuItem value="CV && CE">CV / CE</MenuItem>
            </TextField>

            <Button
              variant="contained"
              fullWidth
              onClick={handleSubmit}
              sx={{ py: 1.5, fontWeight: "bold" }}
            >
              Submit
            </Button>
          </Paper>
        )}
      </Box>
    </Box>
  )
}

export default LoanType