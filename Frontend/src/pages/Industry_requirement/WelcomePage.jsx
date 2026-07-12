import React from "react";
import { Box, Button, Typography, Container } from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from "react-router-dom";

function WelcomePage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0a",
        backgroundImage: `
          radial-gradient(at 80% 20%, rgba(59, 130, 246, 0.15) 0px, transparent 50%), 
          radial-gradient(at 20% 80%, rgba(139, 92, 246, 0.15) 0px, transparent 50%)
        `,
        color: "#ffffff",
        p: 2,
        fontFamily: "'Inter', sans-serif"
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ maxWidth: "800px", mx: "auto", textAlign: "center" }}>
          
          {/* Badge */}
          <Box sx={{ 
            display: 'inline-block', 
            px: 2, py: 0.5, mb: 3, 
            borderRadius: '20px', 
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.05)',
            fontSize: '0.8rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#a1a1aa'
          }}>
            Workforce Management Solutions
          </Box>

          {/* Bold Brand Name */}
          <Typography variant="h1" sx={{ 
            fontWeight: 800, 
            fontSize: { xs: "3rem", md: "5rem" }, 
            lineHeight: 1, 
            mb: 3,
            letterSpacing: "-0.04em"
          }}>
            PMB <Box component="span" sx={{ color: "#3b82f6" }}>CONSULTANCY</Box>
          </Typography>

          {/* Value Prop */}
          <Typography variant="h5" sx={{ 
            color: "#a1a1aa", 
            fontWeight: 400, 
            mb: 6, 
            lineHeight: 1.5,
            maxWidth: "600px",
            mx: "auto"
          }}>
            Scaling your workforce with precision. Submit your labour requirements and let us power your industrial operations.
          </Typography>

          {/* Call to Action */}
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/submit-requirement')}
            sx={{
              px: 4, py: 2,
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: 600,
              textTransform: "none",
              backgroundColor: "#ffffff",
              color: "#000000",
              transition: "0.3s",
              "&:hover": {
                backgroundColor: "#e5e5e5",
                transform: "translateY(-2px)",
                boxShadow: "0 10px 30px rgba(255, 255, 255, 0.15)"
              }
            }}
          >
            Submit Labour Request
          </Button>

          {/* Footer Link */}
          <Typography sx={{ mt: 8, color: "#52525b", fontSize: "0.9rem" }}>
            Need support? Visit <Box component="a" href="https://www.pmb.finance" target="_blank" sx={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 600 }}>www.pmb.finance</Box>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default WelcomePage;