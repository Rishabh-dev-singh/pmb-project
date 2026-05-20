import Navbar from "../components/Navbar";
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
} from "@mui/material";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import EmailIcon from "@mui/icons-material/Email";

function Career() {
  return (
    <Box>
    

      <Box
        sx={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f766e 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          py: 6,
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={10}
            sx={{
              borderRadius: "30px",
              p: { xs: 4, md: 8 },
              textAlign: "center",
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Box
              sx={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                background: "#0f766e",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
                mb: 4,
                boxShadow: "0 10px 30px rgba(15,118,110,0.3)",
              }}
            >
              <WorkOutlineIcon
                sx={{
                  fontSize: 45,
                  color: "#fff",
                }}
              />
            </Box>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                color: "#0f172a",
                mb: 3,
                fontSize: { xs: "2.2rem", md: "3rem" },
              }}
            >
              We Are Looking For Talented People
            </Typography>

            <Typography
              sx={{
                fontSize: "1.1rem",
                color: "#475569",
                lineHeight: 1.9,
                mb: 5,
                maxWidth: "700px",
                margin: "0 auto",
              }}
            >
              Join PMB Finance and become part of a growing financial company
              where your talent, dedication, and ideas truly matter. We are
              always looking for passionate, hardworking, and creative people
              who want to build a successful future with us.
            </Typography>

            <Box
              sx={{
                background: "#f8fafc",
                borderRadius: "20px",
                p: 4,
                mb: 5,
                border: "1px solid #e2e8f0",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: "#0f766e",
                  mb: 2,
                }}
              >
                Why Join Us?
              </Typography>

              <Typography
                sx={{
                  color: "#475569",
                  lineHeight: 2,
                  fontSize: "1rem",
                }}
              >
                • Professional Growth Opportunities
                <br />
                • Friendly & Supportive Work Environment
                <br />
                • Career Development & Learning
                <br />
                • Competitive Salary & Benefits
                <br />• Opportunity To Work With Industry Experts
              </Typography>
            </Box>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: "#0f172a",
                mb: 2,
              }}
            >
              Send Your Resume
            </Typography>

            <Typography
              sx={{
                color: "#64748b",
                mb: 4,
                fontSize: "1.05rem",
              }}
            >
              Interested candidates can send their resume and details to our
              official email address.
            </Typography>

            <Button
              variant="contained"
              startIcon={<EmailIcon />}
              href="mailto:info@pmb.finance"
              sx={{
                background: "#0f766e",
                px: 5,
                py: 1.8,
                borderRadius: "14px",
                fontSize: "1rem",
                fontWeight: 700,
                textTransform: "none",
                boxShadow: "0 10px 25px rgba(15,118,110,0.3)",
                "&:hover": {
                  background: "#115e59",
                  transform: "translateY(-3px)",
                },
                transition: "0.3s",
              }}
            >
              info@pmb.finance
            </Button>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}

export default Career;
