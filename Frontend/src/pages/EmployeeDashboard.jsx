import React, {
  useState,
  useEffect,
  Suspense
} from "react";

import {
  Box, Grid, Paper, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText,
  TextField, CssBaseline, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, IconButton, Button, Avatar, Menu, MenuItem, Divider, useMediaQuery,
  useTheme, ThemeProvider, createTheme, Dialog, DialogTitle, DialogContent,
  DialogActions, Tooltip
} from "@mui/material";

import {
  Dashboard as DashIcon, Assignment, AssignmentTurnedIn, Calculate, AddCircle,
  ListAlt, Edit as EditIcon, Logout as LogoutIcon, Menu as MenuIcon,
  MenuOpen as MenuOpenIcon, DarkMode, LightMode,
} from "@mui/icons-material";

import { useNavigate, useLocation } from "react-router-dom";
import jsPDF from "jspdf";

import Attendance from "./Attendance";
import api from "../api"; 

const EMI = React.lazy(() => import("./EMI"));

function EmployeeDashboard() {
  const [activePanel, setActivePanel] = useState("overview");
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  
  // FILTERS
  const [filterEmployee, setFilterEmployee] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [empMap, setEmpMap] = useState({});

  // PRODUCTIVITY STATE
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [productivityList, setProductivityList] = useState([]); 
  const [productivity, setProductivity] = useState({
    total_calls: '', 
    connected_calls: '', 
    interested_customers: '', 
    followup_customers: '', 
    remark: ''
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // USER ROLE & DATA STATE
  const [employeeData, setEmployeeData] = useState({
    name: "Loading...",
    id: "",
    designation: "",
    department: "",
    role: "employee" // NEW: Added role property
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
    const initializeDashboard = async () => {
      try {
        const profileRes = await api.get('profile/');
        const userData = profileRes.data;
        
        // MANAGER ROLE IDENTIFICATION LOGIC
        const superUsers = ["3800", "3801", "3802", "3803"];
        const userRole = superUsers.includes(String(userData.id)) ? "manager" : "employee";

        setEmployeeData({
          name: userData.name || "Employee",
          id: userData.id || "N/A",
          designation: userData.designation || "N/A",
          department: userData.department || "N/A",
          role: userRole // Setting role to state
        });

        const empRes = await api.get('employees/');
        const map = {};
        empRes.data.forEach((emp) => {
          map[emp.employee_id] = emp.first_name;
        });
        setEmpMap(map);

        fetchLeads(userData.id);
        fetchProductivity(userData.id, userRole); // Pass role for fetching productivity

      } catch (err) {
        console.error("Authentication Error:", err);
        navigate("/employee-login"); 
      }
    };

    initializeDashboard();
  }, [navigate]);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await api.post('logout/');
    } catch (e) {
      console.error("Logout Error:", e);
    }
    navigate("/");
  };

  const fetchLeads = async (empId = employeeData.id) => {
    if (!empId) return;

    const superUsers = ["3800", "3801", "3802", "3803"];
    let url = "";

    if (superUsers.includes(empId)) {
      url = "leads/?role=manager"; 
    } else {
      url = `leads/?owner=${encodeURIComponent(empId)}&role=employee`;
    }

    try {
      const res = await api.get(url);
      setLeads(res.data);
    } catch (err) {
      console.error("Failed To Fetch Leads:", err);
    }
  };

  // UPDATED: PRODUCTIVITY FETCH API FUNCTION (Accepts Role)
  const fetchProductivity = async (empId = employeeData.id, role = employeeData.role) => {
    if (!empId) return;
    try {
      const res = await api.get(`productivity/?employee_id=${encodeURIComponent(empId)}&role=${role}`);
      setProductivityList(res.data);
    } catch (err) {
      console.error("Failed To Fetch Productivity:", err);
    }
  };

  useEffect(() => {
    if (location.state?.refresh) {
      fetchLeads();
      fetchProductivity(); 
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
      const res = await api.put(`leads/${lead.id}/update/`, {
        progress: newStatus,
        updated_by: employeeData.name, 
        updated_at: new Date().toISOString()
      });

      if (res.status === 200 || res.status === 201) {
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

  // PRODUCTIVITY POST API HANDLER
  const handleProductivitySubmit = async () => {
    if (!productivity.total_calls) {
        alert("Please enter Total Calls.");
        return;
    }

    try {
      const payload = {
        employee_id: employeeData.id,
        total_calls: productivity.total_calls,
        connected_calls: productivity.connected_calls,
        interested_customers: productivity.interested_customers,
        followup_customers: productivity.followup_customers,
        remark: productivity.remark
      };

      const res = await api.post('productivity/', payload);

      if (res.status === 200 || res.status === 201) {
        alert("✅ Productivity Saved successfully!");
        
        fetchProductivity(); // List refresh
        
        // Form Reset
        setProductivity({
          total_calls: '', 
          connected_calls: '', 
          interested_customers: '', 
          followup_customers: '', 
          remark: ''
        });
        setOpenUpdateDialog(false);
      } else {
        alert("❌ Failed to save record.");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Server error while saving productivity.");
    }
  };

  const downloadCurrentPDFReport = () => {
    generatePDF(productivity, "Current_Draft");
  };

  const downloadRowPDF = (row) => {
    generatePDF(row, row.date);
  };

  const generatePDF = (data, dateLabel) => {
    const doc = new jsPDF();
    doc.text(`Daily Work Report - ${employeeData.name} (${dateLabel})`, 14, 15);
    doc.autoTable({
      head: [['Field', 'Details']],
      body: [
        ['Total Calls', data.total_calls || '0'],
        ['Connected Calls', data.connected_calls || '0'],
        ['Interested Customers', data.interested_customers || 'N/A'],
        ['Followup Customers', data.followup_customers || 'N/A'],
        ['Remark', data.remark || 'N/A'],
      ],
      startY: 20,
      styles: { cellWidth: 'wrap' },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 'auto' }
      }
    });
    doc.save(`Productivity_Report_${dateLabel}.pdf`);
  };

  // UPDATED: DOWNLOAD PRODUCTIVITY CSV (Includes SR & Dynamic Employee Name for Managers)
  const downloadProductivityCSV = () => {
    if (productivityList.length === 0) {
      alert("No productivity data available to download.");
      return;
    }

    // Header array setup
    const headers = ["SR"];
    if (employeeData.role === 'manager') {
      headers.push("Employee Name");
    }
    headers.push("Date", "Total Calls", "Connected Calls", "Interested Customers", "Followup Customers", "Remark");

    // Mapping rows with Auto Serial Number
    const rows = productivityList.map((p, index) => {
      const rowArray = [
        `"${index + 1}"` // SR Number Auto Generated
      ];
      
      if (employeeData.role === 'manager') {
        rowArray.push(`"${p.employee__first_name || employeeData.name}"`);
      }

      rowArray.push(
        `"${p.date}"`,
        `"${p.total_calls}"`,
        `"${p.connected_calls}"`,
        `"${(p.interested_customers || "").replace(/"/g, '""')}"`, 
        `"${(p.followup_customers || "").replace(/"/g, '""')}"`,
        `"${(p.remark || "").replace(/"/g, '""')}"`
      );

      return rowArray;
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `Daily_Productivity_${employeeData.name}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const filteredLeads = leads.filter((l) => {
    const matchesSearch = l.fullName?.toLowerCase().includes(search.toLowerCase()) || l.mobile?.includes(search);
    const matchesEmployee = filterEmployee ? l.owner === filterEmployee : true;
    const matchesStatus = filterStatus ? l.progress === filterStatus : true;
    
    return matchesSearch && matchesEmployee && matchesStatus;
  });

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
    { text: "Productivity", icon: <AssignmentTurnedIn />, id: "productivity" },
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
                  if (item.id === "productivity") fetchProductivity();
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

        {/* MAIN CONTAINER */}
        <Box sx={{ 
          flexGrow: 1, 
          width: `calc(100% - ${sidebarWidth}px)`, 
          transition: "width 0.3s ease",
          height: "100vh",
          overflowY: "auto",
          overflowX: "hidden"
        }}>
          
          {/* TOP HEADER */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: { xs: 1.5, md: 2 },
              bgcolor: "background.paper",
              boxShadow: 1,
              position: "sticky",
              top: 0,
              zIndex: 1100
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
              
              <Button 
                variant="contained" 
                size="small"
                onClick={() => setOpenUpdateDialog(true)}
                sx={{ 
                  background: "#8b5cf6", 
                  "&:hover": { background: "#7c3aed" },
                  display: { xs: "none", sm: "flex" },
                  fontWeight: "bold",
                  boxShadow: "0 4px 12px rgba(139, 92, 246, 0.3)"
                }}
              >
                + Update Productivity
              </Button>
              <IconButton 
                onClick={() => setOpenUpdateDialog(true)} 
                sx={{ display: { xs: "flex", sm: "none" }, color: "#8b5cf6" }}
              >
                <AssignmentTurnedIn />
              </IconButton>

              <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
                {darkMode ? <LightMode sx={{ color: "#fbbf24" }} /> : <DarkMode sx={{ color: "#3b82f6" }} />}
              </IconButton>

              <IconButton onClick={handleMenuClick} sx={{ p: 0 }}>
                <Avatar sx={{ bgcolor: "#38bdf8" }}>
                  {employeeData.name.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Box>

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

                {/* ACTION BUTTONS: Download Leads AND Download Productivity */}
                <Box sx={{ display: "flex", gap: 2, mb: 2, flexDirection: { xs: "column", sm: "row" } }}>
                  <Button variant="contained" onClick={downloadExcel} fullWidth={isMobile} sx={{ background: "#16a34a", "&:hover": { background: "#15803d" } }}>
                    Download Your Lead
                  </Button>
                  <Button variant="contained" onClick={downloadProductivityCSV} fullWidth={isMobile} sx={{ background: "#f59e0b", "&:hover": { background: "#d97706" } }}>
                    Download Productivity Report
                  </Button>
                </Box>

                {/* FILTERING SECTION */}
                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, mb: 2 }}>
                  <TextField label="Search by name or mobile" fullWidth value={search} onChange={(e) => setSearch(e.target.value)} />
                  <TextField select label="Filter by Employee" value={filterEmployee} onChange={(e) => setFilterEmployee(e.target.value)} sx={{ minWidth: { xs: '100%', md: '200px' } }}>
                    <MenuItem value="">All Employees</MenuItem>
                    {Object.entries(empMap).map(([id, name]) => (
                      <MenuItem key={id} value={id}>{name}</MenuItem>
                    ))}
                  </TextField>
                  <TextField select label="Filter by Status" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} sx={{ minWidth: { xs: '100%', md: '200px' } }}>
                    <MenuItem value="">All Status</MenuItem>
                    <MenuItem value="PIPELINE">PIPELINE</MenuItem><MenuItem value="DOCUMENT LIST SEND">DOCUMENT LIST SEND</MenuItem>
                    <MenuItem value="DOCUMENT RECIEVED">DOCUMENT RECIEVED</MenuItem><MenuItem value="QUERY">QUERY</MenuItem>
                    <MenuItem value="DEDUPE CHECK">DEDUPE CHECK</MenuItem><MenuItem value="DEDUPE DONE">DEDUPE DONE</MenuItem>
                    <MenuItem value="LOGIN">LOGIN</MenuItem><MenuItem value="IN PROGRESS">IN PROGRESS</MenuItem>
                    <MenuItem value="UNDER WRITING">UNDER WRITING</MenuItem><MenuItem value="PD INITIATE">PD INITIATE</MenuItem>
                    <MenuItem value="PD DONE">PD DONE</MenuItem><MenuItem value="TECHNICAL INITIATE">TECHNICAL INITIATE</MenuItem>
                    <MenuItem value="TECHNICAL DONE">TECHNICAL DONE</MenuItem><MenuItem value="VALUATION INITIATE">VALUATION INITIATE</MenuItem>
                    <MenuItem value="VALUATION DONE">VALUATION DONE</MenuItem><MenuItem value="UNDER SANCTION">UNDER SANCTION</MenuItem>
                    <MenuItem value="SANCTION">SANCTION</MenuItem><MenuItem value="DOC KIT ASIGN">DOC KIT ASIGN</MenuItem>
                    <MenuItem value="REJECT">REJECT</MenuItem><MenuItem value="DISBURSEMENT">DISBURSEMENT</MenuItem>
                  </TextField>
                </Box>

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

            {/* PRODUCTIVITY HISTORY TAB */}
            {activePanel === "productivity" && (
              <Paper sx={card}>
                <Typography variant="h5" sx={{ mb: 3, fontSize: { xs: "20px", md: "30px" }, color: "text.primary" }}>
                  Daily Productivity Logs
                </Typography>
                
                {productivityList.length === 0 ? (
                   <Typography sx={{ color: "text.secondary", textAlign: "center", py: 5 }}>
                     No productivity logs found. Click on 'Update Productivity' to add today's report.
                   </Typography>
                ) : (
                  <TableContainer sx={{ overflowX: "auto" }}>
                    <Table sx={{ minWidth: 1000 }}>
                      <TableHead sx={{ bgcolor: darkMode ? "#334155" : "#f1f5f9" }}>
                        <TableRow>
                          {/* UPDATED: SR NUMBER HEADER */}
                          <TableCell sx={{ fontWeight: "bold", width: "60px" }}>SR</TableCell>
                          
                          {/* UPDATED: MANAGER VIEW EMPLOYEE NAME */}
                          {employeeData.role === 'manager' && (
                            <TableCell sx={{ fontWeight: "bold" }}>Employee</TableCell>
                          )}

                          <TableCell sx={{ fontWeight: "bold", width: "100px" }}>Date</TableCell>
                          <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Total Calls</TableCell>
                          <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Connected</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Interested Customers</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Followup Customers</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Remark</TableCell>
                          <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {productivityList.map((row, index) => (
                          <TableRow key={row.id} hover>
                            {/* UPDATED: AUTO SERIAL NUMBER */}
                            <TableCell>{index + 1}</TableCell>
                            
                            {/* UPDATED: MANAGER VIEW EMPLOYEE NAME DATA */}
                            {employeeData.role === 'manager' && (
                               <TableCell>{row.employee__first_name || "Self"}</TableCell>
                            )}

                            <TableCell>{row.date}</TableCell>
                            <TableCell align="center">{row.total_calls}</TableCell>
                            <TableCell align="center">{row.connected_calls}</TableCell>
                            <TableCell sx={{ whiteSpace: "pre-line" }}>{row.interested_customers || "-"}</TableCell>
                            <TableCell sx={{ whiteSpace: "pre-line" }}>{row.followup_customers || "-"}</TableCell>
                            <TableCell>{row.remark || "-"}</TableCell>
                            <TableCell align="center">
                              <Tooltip title="Download PDF">
                                <IconButton onClick={() => downloadRowPDF(row)} sx={{ color: "#ef4444" }}>
                                  
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Paper>
            )}

            {/* ATTENDANCE */}
            {/* UPDATED: Passed employeeId as prop below */}
            {activePanel === "attendance" && <Attendance employeeId={employeeData.id} />}

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

        {/* PRODUCTIVITY DIALOG COMPONENT */}
        <Dialog open={openUpdateDialog} onClose={() => setOpenUpdateDialog(false)} fullWidth maxWidth="md">
          <DialogTitle sx={{ 
            bgcolor: darkMode ? "#1e293b" : "#f8fafc", 
            color: darkMode ? "#fff" : "#0f172a",
            fontWeight: "bold",
            borderBottom: darkMode ? "1px solid #334155" : "1px solid #e2e8f0"
          }}>
            Update Daily Productivity
          </DialogTitle>
          <DialogContent sx={{ bgcolor: darkMode ? "#1e293b" : "#fff", p: { xs: 2, md: 4 } }}>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              
              {/* Row 1: Numbers */}
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth 
                  label="Total Calls" 
                  type="number" 
                  variant="outlined"
                  value={productivity.total_calls}
                  onChange={(e) => setProductivity({...productivity, total_calls: e.target.value})} 
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth 
                  label="Connected Calls" 
                  type="number" 
                  variant="outlined"
                  value={productivity.connected_calls}
                  onChange={(e) => setProductivity({...productivity, connected_calls: e.target.value})} 
                />
              </Grid>

              {/* Row 2: Interested Customers */}
              <Grid item xs={12}>
                <TextField 
                  fullWidth 
                  label="Interested Customers (Names)" 
                  placeholder="Example:&#10;1) Name &#10;2) Name"
                  multiline 
                  rows={4} 
                  variant="outlined"
                  value={productivity.interested_customers}
                  onChange={(e) => setProductivity({...productivity, interested_customers: e.target.value})} 
                  helperText="Please list interested customer names with serial numbers (1, 2, ...)"
                />
              </Grid>

              {/* Row 3: Followup Customers */}
              <Grid item xs={12}>
                <TextField 
                  fullWidth 
                  label="Followup Customers (Names)" 
                  placeholder="Example:&#10;1) Name&#10;2) Name"
                  multiline 
                  rows={4} 
                  variant="outlined"
                  value={productivity.followup_customers}
                  onChange={(e) => setProductivity({...productivity, followup_customers: e.target.value})} 
                  helperText="Please list followup customer names with serial numbers (1, 2, ...)"
                />
              </Grid>

              {/* Row 4: Remarks */}
              <Grid item xs={12}>
                <TextField 
                  fullWidth 
                  label="Any Remark / Notes" 
                  multiline 
                  rows={2} 
                  variant="outlined"
                  value={productivity.remark}
                  onChange={(e) => setProductivity({...productivity, remark: e.target.value})} 
                />
              </Grid>
            </Grid>
          </DialogContent>
          
          <DialogActions sx={{ 
            bgcolor: darkMode ? "#1e293b" : "#f8fafc", 
            p: 2, 
            borderTop: darkMode ? "1px solid #334155" : "1px solid #e2e8f0" 
          }}>
            <Button onClick={() => setOpenUpdateDialog(false)} sx={{ color: darkMode ? "#cbd5e1" : "inherit" }}>
              Cancel
            </Button>
            
            <Button variant="contained" onClick={handleProductivitySubmit} sx={{ background: "#8b5cf6", "&:hover": { background: "#7c3aed" } }}>
              Submit Record
            </Button>
          </DialogActions>
        </Dialog>

      </Box>
    </ThemeProvider>
  );
}

export default EmployeeDashboard;