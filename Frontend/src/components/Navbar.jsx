import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Menu,
  MenuItem,
  Collapse
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // Dropdown States
  const [servicesAnchor, setServicesAnchor] = useState(null);
  const [portalAnchor, setPortalAnchor] = useState(null);
  
  // Mobile Collapse States
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobilePortalOpen, setMobilePortalOpen] = useState(false);

  // Admin is removed from here as it's now inside the Portal Dropdown
  const navItems = [
    { text: "Home", path: "/" },
    { text: "Submit Inquiry", path: "/inquiry" },
    { text: "Careers", path: "/careers" },
    { text: "About Us", path: "/about" }
  ];

  // Navigation Handler for Dropdowns
  const handleNavigate = (path) => {
    navigate(path);
    setServicesAnchor(null);
    setPortalAnchor(null);
    setOpen(false); // Closes mobile drawer
  };

  const navButtonStyle = (path) => ({
    color: location.pathname === path ? "#0f3c6e" : "white",
    fontWeight: 600,
    textTransform: "none",
    fontSize: "15px",
    borderRadius: "30px",
    px: 2.5,
    py: 0.8,
    mx: 0.6,
    backgroundColor: location.pathname === path ? "white" : "transparent",
    boxShadow:
      location.pathname === path
        ? "0 4px 10px rgba(0,0,0,0.2)"
        : "none",
    transition: "all 0.25s ease",

    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.25)",
      transform: "translateY(-2px)"
    }
  });

  return (
    <>
      {/* Animation CSS */}
      <style>
        {`
          @keyframes logoFloat {
            0% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-6px) scale(1.05); }
            100% { transform: translateY(0px) scale(1); }
          }

          .logo {
            transition: all 0.4s ease;
          }

          .logo:hover {
            transform: scale(1.1) rotate(5deg);
          }
        `}
      </style>

      <AppBar
        position="sticky"
        sx={{
          background: "linear-gradient(90deg,#0f3c6e,#1f6ed4)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.25)"
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            px: { xs: 2, md: 4 }
          }}
        >

          {/* LOGO */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Link to="/">
              <img
                src={logo}
                alt="PMB Logo"
                className="logo"
                style={{
                  height: "80px",
                  width: "80px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "3px solid white",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
                  animation: "logoFloat 3s ease-in-out infinite"
                }}
              />
            </Link>
          </Box>

          {/* DESKTOP MAIN MENU */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center"
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item.text}
                component={Link}
                to={item.path}
                sx={navButtonStyle(item.path)}
              >
                {item.text}
              </Button>
            ))}
          </Box>

          {/* RIGHT SIDE DESKTOP BUTTONS */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>

            {/* 1. OUR SERVICES BUTTON */}
            <Button
              onClick={(e) => setServicesAnchor(e.currentTarget)}
              sx={{
                display: { xs: "none", md: "flex" },
                background: "linear-gradient(45deg,#ff9800,#ff6b00)",
                color: "white",
                borderRadius: "30px",
                px: 3,
                py: 1,
                fontWeight: 700,
                textTransform: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden",

                "&:hover": {
                  transform: "translateY(-3px) scale(1.04)",
                  boxShadow: "0 8px 24px rgba(255,140,0,0.45)",
                  background: "linear-gradient(45deg,#ffb300,#ff6b00)"
                },
              }}
            >
              PMB Services <KeyboardArrowDownIcon sx={{ ml: 0.5 }} />
            </Button>
            
            {/* Our Services Dropdown Menu */}
            <Menu
              anchorEl={servicesAnchor}
              open={Boolean(servicesAnchor)}
              onClose={() => setServicesAnchor(null)}
              sx={{ mt: 1 }}
              PaperProps={{
                sx: { borderRadius: "15px", p: 1, boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }
              }}
            >
              <MenuItem sx={{ p: 0.5, "&:hover": { background: "transparent" } }}>
                <Button
                  fullWidth
                  onClick={() => handleNavigate("/services")}
                  sx={{
                    background: "linear-gradient(45deg,#ff9800,#ff6b00)",
                    color: "white",
                    borderRadius: "20px",
                    px: 3,
                    py: 1,
                    fontWeight: 700,
                    textTransform: "none",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                    "&:hover": { transform: "translateY(-2px)", boxShadow: "0 6px 15px rgba(255,140,0,0.35)", background: "linear-gradient(45deg,#ffb300,#ff6b00)" }
                  }}
                >
                  Business Solutions
                </Button>
              </MenuItem>
              
              <MenuItem sx={{ p: 0.5, "&:hover": { background: "transparent" } }}>
                <Button
                  fullWidth
                  onClick={() => handleNavigate("/consultancy")}
                  sx={{
                    background: "linear-gradient(45deg,#6366f1,#4f46e5)",
                    color: "white",
                    borderRadius: "20px",
                    px: 3,
                    py: 1,
                    fontWeight: 700,
                    textTransform: "none",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                    "&:hover": { transform: "translateY(-2px)", boxShadow: "0 6px 15px rgba(79,70,229,0.35)", background: "linear-gradient(45deg,#818cf8,#4f46e5)" }
                  }}
                >
                  PMB Consultancy
                </Button>
              </MenuItem>
            </Menu>

            {/* 2. PORTAL BUTTON (Employee + Admin) */}
            <Button
              onClick={(e) => setPortalAnchor(e.currentTarget)}
              sx={{
                display: { xs: "none", md: "flex" },
                background: "linear-gradient(45deg,#22c55e,#16a34a)",
                color: "white",
                borderRadius: "30px",
                px: 3,
                py: 1,
                fontWeight: 700,
                textTransform: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                transition: "0.3s",

                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.35)"
                }
              }}
            >
             PMB Access <KeyboardArrowDownIcon sx={{ ml: 0.5 }} />
            </Button>

            {/* Portal Dropdown Menu */}
            <Menu
              anchorEl={portalAnchor}
              open={Boolean(portalAnchor)}
              onClose={() => setPortalAnchor(null)}
              sx={{ mt: 1 }}
              PaperProps={{
                sx: { borderRadius: "15px", p: 1, boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }
              }}
            >
              <MenuItem sx={{ p: 0.5, "&:hover": { background: "transparent" } }}>
                <Button
                  fullWidth
                  onClick={() => handleNavigate("/employee-login")}
                  sx={{
                    background: "linear-gradient(45deg,#22c55e,#16a34a)",
                    color: "white",
                    borderRadius: "20px",
                    px: 3,
                    py: 1,
                    fontWeight: 700,
                    textTransform: "none",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                    "&:hover": { transform: "translateY(-2px)", boxShadow: "0 6px 15px rgba(34,197,94,0.35)", background: "linear-gradient(45deg,#4ade80,#16a34a)" }
                  }}
                >
                  PMB CRM
                </Button>
              </MenuItem>
              
              <MenuItem sx={{ p: 0.5, "&:hover": { background: "transparent" } }}>
                <Button
                  fullWidth
                  onClick={() => handleNavigate("/admin-login")}
                  sx={{
                    background: "linear-gradient(45deg,#0f3c6e,#1f6ed4)",
                    color: "white",
                    borderRadius: "20px",
                    px: 3,
                    py: 1,
                    fontWeight: 700,
                    textTransform: "none",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                    "&:hover": { transform: "translateY(-2px)", boxShadow: "0 6px 15px rgba(15,60,110,0.35)", background: "linear-gradient(45deg,#1f6ed4,#2563eb)" }
                  }}
                >
                  Admin Login
                </Button>
              </MenuItem>
            </Menu>

            {/* MOBILE MENU ICON */}
            <IconButton
              sx={{
                display: { xs: "flex", md: "none" },
                color: "white"
              }}
              onClick={() => setOpen(true)}
            >
              <MenuIcon />
            </IconButton>

          </Box>

        </Toolbar>

        {/* MOBILE DRAWER */}
        <Drawer
          anchor="left"
          open={open}
          onClose={() => setOpen(false)}
        >
          <Box sx={{ width: 270, pt: 3 }}>

            <List>
              {/* Normal Links */}
              {navItems.map((item) => (
                <ListItemButton
                  key={item.text}
                  component={Link}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  sx={{ py: 1.5 }}
                >
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{ fontWeight: 600 }}
                  />
                </ListItemButton>
              ))}
              
              <Divider sx={{ my: 1 }} />

              {/* MOBILE COLLAPSIBLE: OUR SERVICES */}
              <ListItemButton onClick={() => setMobileServicesOpen(!mobileServicesOpen)} sx={{ py: 1.5 }}>
                <ListItemText 
                  primary="Our Services" 
                  primaryTypographyProps={{ fontWeight: 600 }} 
                />
                {mobileServicesOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              
              <Collapse in={mobileServicesOpen} timeout="auto" unmountOnExit>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, px: 3, py: 1 }}>
                  <Button
                    fullWidth
                    onClick={() => handleNavigate("/services")}
                    sx={{
                      background: "linear-gradient(45deg,#ff9800,#ff6b00)",
                      color: "white",
                      borderRadius: "20px",
                      py: 1,
                      fontWeight: 700,
                      textTransform: "none",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                    }}
                  >
                    Business Solutions
                  </Button>

                  <Button
                    fullWidth
                    onClick={() => handleNavigate("/consultancy")}
                    sx={{
                      background: "linear-gradient(45deg,#6366f1,#4f46e5)",
                      color: "white",
                      borderRadius: "20px",
                      py: 1,
                      fontWeight: 700,
                      textTransform: "none",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                    }}
                  >
                    PMB Consultancy
                  </Button>
                </Box>
              </Collapse>

              {/* MOBILE COLLAPSIBLE: PORTAL */}
              <ListItemButton onClick={() => setMobilePortalOpen(!mobilePortalOpen)} sx={{ py: 1.5 }}>
                <ListItemText 
                  primary="Portal" 
                  primaryTypographyProps={{ fontWeight: 600 }} 
                />
                {mobilePortalOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              
              <Collapse in={mobilePortalOpen} timeout="auto" unmountOnExit>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, px: 3, py: 1 }}>
                  <Button
                    fullWidth
                    onClick={() => handleNavigate("/employee-login")}
                    sx={{
                      background: "linear-gradient(45deg,#22c55e,#16a34a)",
                      color: "white",
                      borderRadius: "20px",
                      py: 1,
                      fontWeight: 700,
                      textTransform: "none",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                    }}
                  >
                    PMB CRM
                  </Button>

                  <Button
                    fullWidth
                    onClick={() => handleNavigate("/admin-login")}
                    sx={{
                      background: "linear-gradient(45deg,#0f3c6e,#1f6ed4)",
                      color: "white",
                      borderRadius: "20px",
                      py: 1,
                      fontWeight: 700,
                      textTransform: "none",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                    }}
                  >
                    Admin Login
                  </Button>
                </Box>
              </Collapse>

            </List>
          </Box>
        </Drawer>

      </AppBar>
    </>
  );
}

export default Navbar;