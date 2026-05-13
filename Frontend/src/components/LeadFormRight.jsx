import React from "react";
import { TextField } from "@mui/material";

const LeadFormRight = React.memo(({ form, handleChange, inputStyle }) => {
  return (
    <>
      <TextField fullWidth label="Country *" name="country" value={form.country} onChange={handleChange} sx={inputStyle} margin="normal" />

      <TextField type="date" fullWidth label="Next Date" InputLabelProps={{ shrink: true }} name="nextDate" value={form.nextDate} onChange={handleChange} sx={inputStyle} margin="normal" />

      <TextField type="time" fullWidth label="Next Time" InputLabelProps={{ shrink: true }} name="nextTime" value={form.nextTime} onChange={handleChange} sx={inputStyle} margin="normal" />

      <TextField type="date" fullWidth label="DOB *" InputLabelProps={{ shrink: true }} name="dob" value={form.dob} onChange={handleChange} sx={inputStyle} margin="normal" />

      <TextField fullWidth label="Additional" name="additional" value={form.additional} onChange={handleChange} sx={inputStyle} margin="normal" />
    </>
  );
});

export default LeadFormRight;