import React from "react";
import { TextField } from "@mui/material";

const LeadFormMiddle = React.memo(({ form, handleChange, inputStyle }) => {
  return (
    <>
      <TextField fullWidth label="Lead Source *" name="source" value={form.source} onChange={handleChange} sx={inputStyle} margin="normal" />
      <TextField fullWidth label="Sub Source" name="subSource" value={form.subSource} onChange={handleChange} sx={inputStyle} margin="normal" />
      <TextField fullWidth label="Owner *" name="owner" value={form.owner} onChange={handleChange} sx={inputStyle} margin="normal" />
      <TextField fullWidth label="Progress *" name="progress" value={form.progress} onChange={handleChange} sx={inputStyle} margin="normal" />
      <TextField fullWidth label="DSA Code" name="dsaCode" value={form.dsaCode} onChange={handleChange} sx={inputStyle} margin="normal" />
      <TextField fullWidth label="Remarks" name="remarks" value={form.remarks} multiline rows={4} onChange={handleChange} sx={inputStyle} margin="normal" />
    </>
  );
});

export default LeadFormMiddle;