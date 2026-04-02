import Navbar from "../components/Navbar"
import { Box, Typography, TextField, MenuItem, Button, Paper } from "@mui/material"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

function AgroProduct() {
  const navigate = useNavigate()
  const [product, setProduct] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const agriId = localStorage.getItem("agri_id")
    if (!agriId) {
      alert("Please fill inquiry form first")
      navigate("/inquiry")
    }
  }, [navigate])

  const handleSubmit = async () => {
    if (!product) {
      alert("Please select product")
      return
    }

    try {
      const agriId = localStorage.getItem("agri_id")
      const response = await fetch("http://srv1551351.hstgr.cloud/api/update-product/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: agriId,
          product_name: product
        })
      })

      if (response.ok) {
        setSuccess(true)
      } else {
        alert("Server error. Please try again.")
      }
    } catch (error) {
      console.error(error)
      alert("Something went wrong")
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
          background: "linear-gradient(135deg,#e8f5e9,#c8e6c9)"
        }}
      >
        {success ? (
          <Paper
            sx={{
              p: 6,
              width: 420,
              borderRadius: "16px",
              textAlign: "center",
              background: "linear-gradient(135deg,#2e7d32,#1b5e20)",
              color: "#fff"
            }}
          >
            <Typography variant="h4" sx={{ mb: 2 }}>
              🎉 Thank You
            </Typography>
            <Typography sx={{ fontSize: "18px" }}>
              Your Agro Inquiry has been submitted successfully.
            </Typography>
            <Typography sx={{ mt: 2 }}>
              Our team will contact you shortly.
            </Typography>
          </Paper>
        ) : (
          <Paper sx={{ p: 5, width: 420, borderRadius: "16px" }}>
            <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
              🌾 Select Agro Product
            </Typography>

            <TextField
              select
              label="Choose Product"
              fullWidth
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              sx={{ mb: 3 }}
            >
              <MenuItem value="Gehu">Wheat (गेहूँ)</MenuItem>
              <MenuItem value="Chana">Chickpeas (चना)</MenuItem>
              <MenuItem value="Mustard Oil">Mustard Oil (सरसों का तेल)</MenuItem>
              <MenuItem value="Dal">Pulses (दाल)</MenuItem>
              <MenuItem value="Jwar">Sorghum (ज्वार)</MenuItem>
              <MenuItem value="Bajra">Pearl Millet (बाजरा)</MenuItem>
              <MenuItem value="Makka">Maize (मक्का)</MenuItem>
              <MenuItem value="Diabetes Diet">Diabetic Diet (मधुमेह आहार)</MenuItem>
            </TextField>

            <Button
              variant="contained"
              color="success"
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

export default AgroProduct