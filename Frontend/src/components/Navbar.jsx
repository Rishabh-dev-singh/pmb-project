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
  Divider
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.jpeg";

function Navbar() {

  const location = useLocation();
  const [open, setOpen] = useState(false);

  const navItems = [
    { text: "Home", path: "/" },
    { text: "Submit Inquiry", path: "/inquiry" },
    { text: "Careers", path: "/careers" },
    { text: "About Us", path: "/about" },
    { text: "Admin", path: "/admin-login" }
  ];

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
    boxShadow: location.pathname === path ? "0 4px 10px rgba(0,0,0,0.2)" : "none",
    transition: "all 0.25s ease",

    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.25)",
      transform: "translateY(-2px)"
    }
  });

  return (
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
              style={{
                height: "58px",
                objectFit: "contain"
              }}
            />
          </Link>
        </Box>


        {/* DESKTOP MENU */}
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


        {/* RIGHT SIDE */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>

          {/* EMPLOYEE BUTTON */}
          <Button
            component={Link}
            to="/employee-login"
            sx={{
              display: { xs: "none", md: "flex" },
              background: "linear-gradient(45deg,#22c55e,#16a34a)",
              color: "white",
              borderRadius: "30px",
              px: 3,
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
              transition: "0.3s",

              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 6px 18px rgba(0,0,0,0.35)"
              }
            }}
          >
            Employee Portal
          </Button>


          {/* MOBILE MENU ICON */}
          <IconButton
            sx={{ display: { xs: "flex", md: "none" }, color: "white" }}
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

        <Box
          sx={{
            width: 260,
            pt: 3
          }}
        >

          <List>

            {navItems.map((item) => (
              <ListItemButton
                key={item.text}
                component={Link}
                to={item.path}
                onClick={() => setOpen(false)}
                sx={{
                  py: 1.5
                }}
              >
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: 600
                  }}
                />
              </ListItemButton>
            ))}

          </List>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ px: 2 }}>

            <Button
              component={Link}
              to="/employee-login"
              fullWidth
              onClick={() => setOpen(false)}
              sx={{
                background: "linear-gradient(45deg,#22c55e,#16a34a)",
                color: "white",
                borderRadius: "30px",
                py: 1.2,
                fontWeight: 600,
                textTransform: "none"
              }}
            >
              Employee Portal
            </Button>

          </Box>

        </Box>

      </Drawer>

    </AppBar>
  );
}

export default Navbar;