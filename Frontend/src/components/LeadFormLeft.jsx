import React from "react";
import { TextField, MenuItem, Box, Button, InputAdornment } from "@mui/material";

const LeadFormLeft = React.memo(({ form, handleChange, inputStyle }) => {
  return (
    <>
      <TextField select fullWidth label="Prospect Type *" name="prospectType" value={form.prospectType} onChange={handleChange} sx={inputStyle} margin="normal">
        <MenuItem value="Company">Company</MenuItem>
        <MenuItem value="Individual">Individual</MenuItem>
      </TextField>

      <TextField fullWidth label="Company Name" name="companyName" value={form.companyName} onChange={handleChange} sx={inputStyle} margin="normal" />

      <TextField select fullWidth label="Salutation *" name="salutation" value={form.salutation} onChange={handleChange} sx={inputStyle} margin="normal">
        <MenuItem value="Mr.">Mr.</MenuItem>
        <MenuItem value="Ms.">Ms.</MenuItem>
      </TextField>

      <TextField fullWidth label="Full Name *" name="fullName" value={form.fullName} onChange={handleChange} sx={inputStyle} margin="normal" />

      <TextField
        fullWidth
        label="Mobile number *"
        name="mobile"
        value={form.mobile}
        onChange={handleChange}
        sx={inputStyle}
        margin="normal"
        InputProps={{
          startAdornment: <InputAdornment position="start">+91</InputAdornment>
        }}
      />

      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField fullWidth label="Location" name="location" value={form.location} onChange={handleChange} sx={inputStyle} margin="normal" />
        <Button variant="contained" sx={{ mt: 2 }}>Map</Button>
      </Box>

      <TextField select fullWidth label="Gender *" name="gender" value={form.gender} onChange={handleChange} sx={inputStyle} margin="normal">
        <MenuItem value="Male">Male</MenuItem>
        <MenuItem value="Female">Female</MenuItem>
      </TextField>

      <TextField fullWidth label="Email" name="email" value={form.email} onChange={handleChange} sx={inputStyle} margin="normal" />

      <TextField fullWidth label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} sx={inputStyle} margin="normal" />
    </>
  );
});

export default LeadFormLeft;