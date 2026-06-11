import React, {
  useState,
  useEffect,
  Suspense
} from "react";

import {
  Box,
  Grid,
  Paper,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  CssBaseline,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useMediaQuery,
  useTheme,
  ThemeProvider,
  createTheme
} from "@mui/material";

import {
  Dashboard as DashIcon,
  Assignment,
  Calculate,
  AddCircle,
  ListAlt,
  Edit as EditIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  MenuOpen as MenuOpenIcon,
  DarkMode,
  LightMode
} from "@mui/icons-material";

import { useNavigate, useLocation } from "react-router-dom";

import Attendance from "./Attendance";

const EMI = React.lazy(() => import("./EMI"));

function EmployeeDashboard() {
  const [activePanel, setActivePanel] = useState("overview");
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [empMap, setEmpMap] = useState({});

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [employeeData, setEmployeeData] = useState({
    name: "",
    id: "",
    designation: "",
    department: ""
  });

  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const appTheme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      background: {
        default: darkMode ? "#0f172a" : "#eef2ff",
        paper: darkMode ? "#1e293b" : "#fff",
      },
      text: {
        primary: darkMode ? "#f8fafc" : "#0f172a",
      }
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/employee-login");
      return;
    }
  }, [navigate]);

  useEffect(() => {
    setEmployeeData({
      name: localStorage.getItem("employeeName") || "Employee",
      id: localStorage.getItem("employeeId") || "N/A",
      designation: localStorage.getItem("designation") || "N/A",
      department: localStorage.getItem("department") || "N/A",
    });

    fetch("https://pmb.finance/api/employees/")
      .then((res) => res.json())
      .then((data) => {
        const map = {};
        data.forEach((emp) => {
          map[emp.employee_id] = emp.first_name;
        });
        setEmpMap(map);
      })
      .catch((err) => console.error("Error fetching employees map:", err));

    fetchLeads();
  }, []);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const fetchLeads = () => {
    const employeeId = localStorage.getItem("employeeId");
    const superUsers = ["3800", "3801", "3802", "3803"];
    let url = "";

    if (superUsers.includes(employeeId)) {
      url = "https://pmb.finance/api/leads/?role=manager";
    } else {
      url = `https://pmb.finance/api/leads/?owner=${encodeURIComponent(employeeId)}&role=employee`;
    }

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed To Fetch Leads");
        return res.json();
      })
      .then((data) => setLeads(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (location.state?.refresh) {
      fetchLeads();
    }
  }, [location]);

  const formatAmount = (value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    if (num >= 10000000) return (num / 10000000).toFixed(2) + " Cr";
    if (num >= 100000) return (num / 100000).toFixed(2) + " Lakh";
    if (num >= 1000) return (num / 1000).toFixed(2) + " Thousand";
    return num;
  };

  // NAYA FUNCTION: Date ko strictly DD/MM/YYYY format me convert karne ke liye
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "-";
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const updateStatus = async (lead, newStatus) => {
    if (!newStatus) return;

    const confirmChange = window.confirm(
      `Progress change kare?\n\nFrom: ${lead.progress}\nTo: ${newStatus}`
    );

    if (!confirmChange) return;

    try {
      const res = await fetch(
        `https://pmb.finance/api/leads/${lead.id}/update/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            progress: newStatus,
            updated_by: "Rishabh",
            updated_at: new Date().toISOString()
          })
        }
      );

      if (res.ok) {
        alert("✅ Progress updated");
        setLeads((prev) =>
          prev.map((l) => (l.id === lead.id ? { ...l, progress: newStatus } : l))
        );
      } else {
        alert("❌ Update failed");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Server error");
    }
  };

  const handleEdit = (lead) => {
    navigate("/add-lead", { state: { lead } });
  };

  const filteredLeads = leads.filter(
    (l) =>
      l.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      l.mobile?.includes(search)
  );

  const downloadExcel = () => {
    const headers = [
      "SR", "Customer Name", "Contact", "Loan Amount", "Created By",
      "Bank Name", "RM Name", "Status", "Lead Date"
    ];

    const rows = filteredLeads.map((l, i) => {
      const creatorName = empMap[l.owner] ? ` (${empMap[l.owner]})` : "";
      const createdByField = `"${l.owner || ""}${creatorName}"`;
      
      return [
        i + 1,
        `"${l.fullName || ""}"`, 
        `"${l.mobile || ""}"`,
        `"${formatAmount(l.requiredLoanAmount) || ""}"`,
        createdByField,
        `"${l.bankName || "-"}"`,
        `"${l.rmName || "-"}"`,
        `"${l.progress || ""}"`,
        // Yaha par formatDate function lagaya hai
        `"${formatDate(l.created_at)}"`
      ];
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "leads_report.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const card = {
    p: { xs: 2, md: 3 },
    borderRadius: "20px",
    background: darkMode ? "rgba(30,41,59,0.8)" : "rgba(255,255,255,0.7)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 10px 40px rgba(0,0,0,0.08)"
  };

  const menuItems = [
    { text: "Overview", icon: <DashIcon />, id: "overview" },
    { text: "Leads", icon: <ListAlt />, id: "leads" },
    { text: "Attendance", icon: <Assignment />, id: "attendance" },
    { text: "EMI", icon: <Calculate />, id: "emi" }
  ];

  const sidebarWidth = sidebarOpen ? 240 : 70;

  return (
    <ThemeProvider theme={appTheme}>
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default", color: "text.primary" }}>
        <CssBaseline />

        {/* SIDEBAR */}
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : true}
          onClose={() => setMobileOpen(false)}
          sx={{
            width: isMobile ? 240 : sidebarWidth,
            flexShrink: 0,
            transition: "width 0.3s ease",
            "& .MuiDrawer-paper": {
              width: isMobile ? 240 : sidebarWidth,
              boxSizing: "border-box",
              bgcolor: "#020617",
              color: "#fff",
              borderRight: "1px solid rgba(255,255,255,0.05)",
              transition: "width 0.3s ease",
              overflowX: "hidden"
            }
          }}
        >
          {/* LOGO */}
          <Box sx={{ p: 2, textAlign: "center", display: "flex", alignItems: "center", justifyContent: sidebarOpen ? "center" : "center", minHeight: "64px" }}>
            {sidebarOpen ? (
              <Typography sx={{ color: "#38bdf8", fontWeight: "bold", fontSize: { xs: "11px", md: "20px" }, lineHeight: 1.3 }}>
                PMB CRM SOFTWARE
              </Typography>
            ) : (
              <Typography sx={{ color: "#38bdf8", fontWeight: "bold", fontSize: "20px" }}>
                PMB
              </Typography>
            )}
          </Box>

          <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />

          {/* MENU */}
          <List sx={{ mt: 2 }}>
            {menuItems.map((item) => (
              <ListItem
                key={item.id}
                onClick={() => {
                  setActivePanel(item.id);
                  if (item.id === "leads") fetchLeads();
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{
                  cursor: "pointer",
                  mx: 1,
                  mb: 1,
                  borderRadius: "14px",
                  transition: "0.25s ease",
                  justifyContent: sidebarOpen ? "flex-start" : "center",
                  bgcolor: activePanel === item.id ? "rgba(56,189,248,0.15)" : "transparent",
                  "&:hover": { bgcolor: "rgba(56,189,248,0.10)" }
                }}
              >
                <ListItemIcon
                  sx={{
                    color: activePanel === item.id ? "#38bdf8" : "#94a3b8",
                    minWidth: sidebarOpen ? "42px" : "auto",
                    justifyContent: "center"
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {sidebarOpen && (
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: "15px",
                      fontWeight: activePanel === item.id ? "600" : "400"
                    }}
                  />
                )}
              </ListItem>
            ))}
          </List>
        </Drawer>

        {/* MAIN CONTAINER: Scrollable banaya gaya hai */}
        <Box sx={{ 
          flexGrow: 1, 
          width: `calc(100% - ${sidebarWidth}px)`, 
          transition: "width 0.3s ease",
          height: "100vh",       // FIX: Set height to 100 viewport height
          overflowY: "auto",     // FIX: Enable vertical scroll for content
          overflowX: "hidden"
        }}>
          
          {/* TOP HEADER: Sticky banaya gaya hai */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: { xs: 1.5, md: 2 },
              bgcolor: "background.paper",
              boxShadow: 1,
              position: "sticky", // FIX: Header fix ho jayega
              top: 0,             // FIX: Top edge par
              zIndex: 1100        // FIX: Scroll hone wale content ke upar dikhega
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {isMobile ? (
                <IconButton onClick={() => setMobileOpen(true)} color="inherit">
                  <MenuIcon />
                </IconButton>
              ) : (
                <IconButton onClick={() => setSidebarOpen(!sidebarOpen)} color="inherit">
                  {sidebarOpen ? <MenuOpenIcon /> : <MenuIcon />}
                </IconButton>
              )}
            </Box>

            <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 2 }}>
              {/* DARK MODE TOGGLE */}
              <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
                {darkMode ? <LightMode sx={{ color: "#fbbf24" }} /> : <DarkMode sx={{ color: "#3b82f6" }} />}
              </IconButton>

              <IconButton onClick={handleMenuClick} sx={{ p: 0 }}>
                <Avatar sx={{ bgcolor: "#38bdf8" }}>
                  {employeeData.name.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Box>

            {/* PROFILE MENU */}
            <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
              <Box sx={{ px: 2, py: 1, minWidth: "220px" }}>
                <Typography fontWeight="bold" sx={{ mb: 1 }}>{employeeData.name}</Typography>
                <Divider sx={{ mb: 1 }} />
                <Typography variant="body2"><strong>ID:</strong> {employeeData.id}</Typography>
                <Typography variant="body2"><strong>DEPARTMENT:</strong> {employeeData.department}</Typography>
                <Typography variant="body2"><strong>DESIGNATION:</strong> {employeeData.designation}</Typography>
              </Box>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ color: "red" }}>
                <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Logout
              </MenuItem>
            </Menu>
          </Box>

          {/* CONTENT */}
          <Box sx={{ p: { xs: 1.5, md: 4 } }}>
            
            {/* OVERVIEW */}
            {activePanel === "overview" && (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <Paper
                    sx={{
                      ...card,
                      minHeight: "120px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                      textAlign: "center"
                    }}
                    onClick={() => navigate("/add-lead")}
                  >
                    <AddCircle sx={{ fontSize: 50, color: darkMode ? "#38bdf8" : "inherit" }} />
                    <Typography>Add New Lead</Typography>
                  </Paper>
                </Grid>
              </Grid>
            )}

            {/* LEADS */}
            {activePanel === "leads" && (
              <Paper sx={card}>
                <Typography variant="h5" sx={{ mb: 2, fontSize: { xs: "20px", md: "30px" }, color: "text.primary" }}>
                  Lead Tracker
                </Typography>

                <Button variant="contained" onClick={downloadExcel} fullWidth={isMobile} sx={{ mb: 2, background: "#16a34a", "&:hover": { background: "#15803d" } }}>
                  Download Your Lead
                </Button>

                <TextField
                  label="Search by name or mobile"
                  fullWidth
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  sx={{ mb: 2 }}
                />

                <TableContainer sx={{ overflowX: "auto" }}>
                  <Table sx={{ minWidth: 1200 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: "text.primary", fontWeight: "bold" }}>SR</TableCell>
                        <TableCell sx={{ color: "text.primary", fontWeight: "bold" }}>Customer Name</TableCell>
                        <TableCell sx={{ color: "text.primary", fontWeight: "bold" }}>Contact</TableCell>
                        <TableCell sx={{ color: "text.primary", fontWeight: "bold" }}>Loan Amount</TableCell>
                        <TableCell sx={{ color: "text.primary", fontWeight: "bold" }}>Created By</TableCell>
                        <TableCell sx={{ color: "text.primary", fontWeight: "bold" }}>Bank Name</TableCell>
                        <TableCell sx={{ color: "text.primary", fontWeight: "bold" }}>RM Name</TableCell>
                        <TableCell sx={{ color: "text.primary", fontWeight: "bold" }}>Status</TableCell>
                        <TableCell sx={{ color: "text.primary", fontWeight: "bold" }}>Lead Date</TableCell>
                        <TableCell sx={{ color: "text.primary", fontWeight: "bold" }}>Edit</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredLeads.map((l, i) => (
                        <TableRow key={l.id}>
                          <TableCell sx={{ color: "text.primary" }}>{i + 1}</TableCell>
                          <TableCell sx={{ color: "text.primary" }}>{l.fullName}</TableCell>
                          <TableCell sx={{ color: "text.primary" }}>{l.mobile}</TableCell>
                          <TableCell sx={{ color: "text.primary" }}>{formatAmount(l.requiredLoanAmount)}</TableCell>
                          
                          <TableCell sx={{ color: "text.primary" }}>
                            {l.owner} {empMap[l.owner] ? <span style={{ color: "#16a34a", fontWeight: "600" }}>({empMap[l.owner]})</span> : ""}
                          </TableCell>

                          <TableCell sx={{ color: "text.primary" }}>{l.bankName || "-"}</TableCell>
                          <TableCell sx={{ color: "text.primary" }}>{l.rmName || "-"}</TableCell>

                          <TableCell>
                            <select
                              value={l.progress || ""}
                              onChange={(e) => updateStatus(l, e.target.value)}
                              style={{ 
                                padding: "8px", 
                                borderRadius: "8px", 
                                minWidth: "150px",
                                background: darkMode ? "#1e293b" : "#fff",
                                color: darkMode ? "#fff" : "#000",
                                border: darkMode ? "1px solid #475569" : "1px solid #ccc"
                              }}
                            >
                              <option value="">Select</option>
                              <option>PIPELINE</option><option>DOCUMENT LIST SEND</option><option>DOCUMENT RECIEVED</option>
                              <option>QUERY</option><option>DEDUPE CHECK</option><option>DEDUPE DONE</option><option>LOGIN</option>
                              <option>IN PROGRESS</option><option>UNDER WRITING</option><option>PD INITIATE</option>
                              <option>PD DONE</option><option>TECHNICAL INITIATE</option><option>TECHNICAL DONE</option>
                              <option>VALUATION INITIATE</option><option>VALUATION DONE</option><option>UNDER SANCTION</option>
                              <option>SANCTION</option><option>DOC KIT ASIGN</option><option>REJECT</option><option>DISBURSEMENT</option>
                            </select>
                          </TableCell>

                          {/* Yaha bhi UI par sahi format dikhane ke liye update kar diya */}
                          <TableCell sx={{ color: "text.primary" }}>{formatDate(l.created_at)}</TableCell>

                          <TableCell>
                            <IconButton onClick={() => handleEdit(l)}>
                              <EditIcon sx={{ color: darkMode ? "#38bdf8" : "#1976d2" }} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            )}

            {/* ATTENDANCE */}
            {activePanel === "attendance" && <Attendance />}

            {/* EMI */}
            {activePanel === "emi" && (
              <Suspense
                fallback={
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
                    <Typography sx={{ color: "#38bdf8", fontSize: "22px", fontWeight: "bold" }}>
                      Loading EMI Calculator...
                    </Typography>
                  </Box>
                }
              >
                <EMI />
              </Suspense>
            )}

          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default EmployeeDashboard;