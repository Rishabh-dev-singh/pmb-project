import { Box, Typography } from "@mui/material";

function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: "#0f3c6e",
        color: "white",
        textAlign: "center",
        py: 2,
        mt: 4
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} PMB Agri & Leasing Corporation. All Rights Reserved.
      </Typography>
    </Box>
  );
}

export default Footer;