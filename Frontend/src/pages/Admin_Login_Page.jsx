import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  IconButton, 
  InputAdornment,
  Container 
} from "@mui/material";


function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => setShowPassword(!showPassword);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f0f2f5" }}>

      <Box
        sx={{
          height: "90vh",
          display: "flex", 
          justifyContent: "center",
          alignItems: "center",
          // Blue-Indigo Gradient for Corporate feel
          background: "linear-gradient(135deg, #1b2485 0%, #0d47a1 100%)",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Decorative Background Circles */}
        <Box sx={{ 
          position: "absolute", top: -100, left: -100, width: 300, height: 300, 
          borderRadius: "50%", background: "rgba(255,255,255,0.1)" 
        }} />
        <Box sx={{ 
          position: "absolute", bottom: -50, right: -50, width: 200, height: 200, 
          borderRadius: "50%", background: "rgba(255,255,255,0.05)" 
        }} />

        <Container maxWidth="xs">
          <Paper 
            elevation={24} 
            sx={{
              padding: { xs: 4, md: 6 },
              borderRadius: 5,
              textAlign: "center",
              backdropFilter: "blur(10px)",
              bgcolor: "rgba(255, 255, 255, 0.95)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 25px 50px rgba(0,0,0,0.3)"
            }}
          >
            {/* Logo or Icon Placeholder */}
            <Box sx={{ 
              width: 70, height: 70, bgcolor: "#1a237e", borderRadius: "50%", 
              display: "flex", justifyContent: "center", alignItems: "center",
              margin: "0 auto", mb: 2, boxShadow: "0 10px 20px rgba(26,35,126,0.3)"
            }}>
              <Typography sx={{ fontSize: "2rem" }}>🔐</Typography>
            </Box>

            <Typography variant="h4" sx={{ fontWeight: 800, color: "#1a237e", mb: 1 }}>
              Admin Portal
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 4 }}>
              PMB Agri & Leasing Corporation Control Center
            </Typography>

            <Stack spacing={3}>
              <TextField
                label="Admin ID / Email"
                variant="outlined"
                fullWidth
                placeholder="admin@pmbagri.com"
                InputProps={{
                  sx: { borderRadius: 3 }
                }}
              />

              <TextField
                label="Secure Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                InputProps={{
                  sx: { borderRadius: 3 },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePassword} edge="end">
                        {showPassword ? "🔓" : "🔒"}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button 
                variant="contained" 
                fullWidth
                size="large"
                sx={{
                  mt: 2,
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  textTransform: "none",
                  bgcolor: "#1a237e",
                  boxShadow: "0 8px 15px rgba(26, 35, 126, 0.3)",
                  transition: "0.3s",
                  '&:hover': {
                    bgcolor: "#0d47a1",
                    transform: "scale(1.02)",
                    boxShadow: "0 12px 20px rgba(26, 35, 126, 0.4)"
                  }
                }}
              >
                Sign In
              </Button>
            </Stack>
         
            <Typography 
              variant="caption" 
              display="block" 
              sx={{ mt: 4, color: "text.disabled", fontWeight: 500 }}
            >
              Authorized Personnel Only • Secure 256-bit Encryption
            </Typography>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
// Helper component to replace Stack if not imported
function Stack({ children, spacing }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: spacing }}>
      {children}
    </Box>
  );
}

export default AdminLogin;










