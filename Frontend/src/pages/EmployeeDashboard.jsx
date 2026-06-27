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
  DialogActions, Tooltip, Fab
} from "@mui/material";

import {
  Dashboard as DashIcon, Assignment, AssignmentTurnedIn, Calculate, AddCircle,
  ListAlt, Edit as EditIcon, Logout as LogoutIcon, Menu as MenuIcon,
  MenuOpen as MenuOpenIcon, DarkMode, LightMode, Download as DownloadIcon, PostAdd as PostAddIcon
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
    role: "employee"
  });

  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Ultra-Luxury Custom Theme Configuration
  const appTheme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: "#6366f1",
      },
      secondary: {
        main: "#38bdf8",
      },
      background: {
        default: darkMode ? "#030712" : "#f8fafc",
        paper: darkMode ? "#0b0f19" : "#ffffff",
      },
      text: {
        primary: darkMode ? "#f3f4f6" : "#0f172a",
        secondary: darkMode ? "#9ca3af" : "#475569",
      }
    },
    typography: {
      fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
    }
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
          role: userRole
        });

        const empRes = await api.get('employees/');
        const map = {};
        empRes.data.forEach((emp) => {
          map[emp.employee_id] = emp.first_name;
        });
        setEmpMap(map);

        fetchLeads(userData.id);
        fetchProductivity(userData.id, userRole);

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
        fetchProductivity();
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

  const downloadProductivityCSV = () => {
    if (productivityList.length === 0) {
      alert("No productivity data available to download.");
      return;
    }

    const headers = ["SR"];
    if (employeeData.role === 'manager') {
      headers.push("Employee Name");
    }
    headers.push("Date", "Total Calls", "Connected Calls", "Interested Customers", "Followup Customers", "Remark");

    const rows = productivityList.map((p, index) => {
      const rowArray = [ `"${index + 1}"` ];
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

  // Ultra Luxury Layout Card Styles
  const cardStyle = {
    p: { xs: 2.5, md: 4 },
    borderRadius: "24px",
    background: darkMode ? "rgba(11, 15, 25, 0.75)" : "rgba(255, 255, 255, 0.85)",
    backdropFilter: "blur(16px)",
    boxShadow: darkMode ? "0 8px 32px 0 rgba(0, 0, 0, 0.37)" : "0 8px 32px 0 rgba(31, 38, 135, 0.05)",
    border: "1px solid",
    borderColor: darkMode ? "rgba(255, 255, 255, 0.06)" : "rgba(255, 255, 255, 0.4)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease"
  };

  const menuItems = [
    { text: "Overview", icon: <DashIcon />, id: "overview" },
    { text: "Leads", icon: <ListAlt />, id: "leads" },
    { text: "Productivity", icon: <AssignmentTurnedIn />, id: "productivity" },
    { text: "Attendance", icon: <Assignment />, id: "attendance" },
    { text: "EMI", icon: <Calculate />, id: "emi" }
  ];

  const sidebarWidth = sidebarOpen ? 260 : 80;

  return (
    <ThemeProvider theme={appTheme}>
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default", color: "text.primary" }}>
        <CssBaseline />

        {/* PREMIUM OBSIDIAN SIDEBAR */}
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : true}
          onClose={() => setMobileOpen(false)}
          sx={{
            width: isMobile ? 260 : sidebarWidth,
            flexShrink: 0,
            transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "& .MuiDrawer-paper": {
              width: isMobile ? 260 : sidebarWidth,
              boxSizing: "border-box",
              bgcolor: "#030712",
              color: "#f3f4f6",
              borderRight: "1px solid rgba(255,255,255,0.05)",
              transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              overflowX: "hidden"
            }
          }}
        >
          {/* SIDEBAR LOGO */}
          <Box sx={{ p: 3, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "80px" }}>
            {sidebarOpen ? (
              <Typography sx={{ background: "linear-gradient(135deg, #38bdf8, #6366f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: "800", fontSize: { xs: "14px", md: "18px" }, letterSpacing: '1px' }}>
                PMB CRM PLATFORM
              </Typography>
            ) : (
              <Typography sx={{ color: "#38bdf8", fontWeight: "900", fontSize: "22px" }}>
                PMB
              </Typography>
            )}
          </Box>

          <Divider sx={{ bgcolor: "rgba(255,255,255,0.06)" }} />

          {/* SIDEBAR LIST ITEMS */}
          <List sx={{ mt: 2, px: 1.5 }}>
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
                  mb: 1,
                  borderRadius: "16px",
                  p: 1.5,
                  transition: "all 0.25s ease",
                  justifyContent: sidebarOpen ? "flex-start" : "center",
                  bgcolor: activePanel === item.id ? "rgba(99, 102, 241, 0.15)" : "transparent",
                  border: "1px solid",
                  borderColor: activePanel === item.id ? "rgba(99, 102, 241, 0.25)" : "transparent",
                  "&:hover": { 
                    bgcolor: "rgba(255, 255, 255, 0.04)",
                    transform: "translateX(4px)"
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    color: activePanel === item.id ? "#38bdf8" : "#9ca3af",
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
                      fontSize: "14px",
                      fontWeight: activePanel === item.id ? "700" : "500",
                      color: activePanel === item.id ? "#ffffff" : "#9ca3af"
                    }}
                  />
                )}
              </ListItem>
            ))}
          </List>
        </Drawer>

        {/* MAIN CONTAINER CONTENT VIEWPORT */}
        <Box sx={{ 
          flexGrow: 1, 
          width: `calc(100% - ${sidebarWidth}px)`, 
          transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          height: "100vh",
          overflowY: "auto",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column"
        }}>
          
          {/* ULTRA GLOSSY STICKY NAVBAR TOP HEADER */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: { xs: 2, md: 3 },
              bgcolor: darkMode ? "rgba(3, 7, 18, 0.7)" : "rgba(255, 255, 255, 0.7)",
              backdropFilter: "blur(20px)",
              borderBottom: "1px solid",
              borderColor: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
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
                <IconButton onClick={() => setSidebarOpen(!sidebarOpen)} color="inherit" sx={{ border: "1px solid rgba(128,128,128,0.2)", p: 1 }}>
                  {sidebarOpen ? <MenuOpenIcon /> : <MenuIcon />}
                </IconButton>
              )}
              {!isMobile && (
                <Typography sx={{ ml: 2, fontWeight: "700", fontSize: "16px", color: "text.primary" }}>
                  Welcome back, <span style={{ color: '#6366f1' }}>{employeeData.name}</span>
                </Typography>
              )}
            </Box>

            <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 2 }}>
              
              <Button 
                variant="contained" 
                size="medium"
                startIcon={<PostAddIcon />}
                onClick={() => setOpenUpdateDialog(true)}
                sx={{ 
                  background: "linear-gradient(135deg, #8b5cf6, #6366f1)", 
                  "&:hover": { background: "linear-gradient(135deg, #7c3aed, #4f46e5)", transform: "translateY(-1px)" },
                  display: { xs: "none", sm: "flex" },
                  fontWeight: "700",
                  textTransform: "none",
                  borderRadius: "12px",
                  px: 2.5,
                  boxShadow: "0 4px 14px rgba(99, 102, 241, 0.4)"
                }}
              >
                Update Productivity
              </Button>

              <IconButton onClick={() => setDarkMode(!darkMode)} sx={{ border: "1px solid rgba(128,128,128,0.2)", p: 1 }}>
                {darkMode ? <LightMode sx={{ color: "#fbbf24" }} /> : <DarkMode sx={{ color: "#3b82f6" }} />}
              </IconButton>

              <IconButton onClick={handleMenuClick} sx={{ p: 0, border: "2px solid #6366f1", p: "2px" }}>
                <Avatar sx={{ bgcolor: "#6366f1", fontWeight: "700", width: 36, height: 36 }}>
                  {employeeData.name.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Box>

            <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose} PaperProps={{ sx: { borderRadius: "16px", p: 1, minWidth: "240px", boxShadow: "0 10px 30px rgba(0,0,0,0.15)" } }}>
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography fontWeight="800" variant="subtitle1" sx={{ color: "text.primary" }}>{employeeData.name}</Typography>
                <Typography variant="caption" sx={{ color: "text.secondary", display: 'block', mb: 1 }}>ID: #{employeeData.id}</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" sx={{ fontSize: '13px', mt: 0.5 }}><strong>Department:</strong> {employeeData.department}</Typography>
                <Typography variant="body2" sx={{ fontSize: '13px', mt: 0.5 }}><strong>Designation:</strong> {employeeData.designation}</Typography>
              </Box>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ color: "#ef4444", borderRadius: "12px", mt: 1, fontWeight: "600" }}>
                <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Logout Account
              </MenuItem>
            </Menu>
          </Box>

          {/* APPLICATION MAIN ROUTER WRAPPER VIEWPORT */}
          <Box sx={{ p: { xs: 2, md: 4 }, flexGrow: 1 }}>
            
            {/* FIXED AND CENTERED GLASSMORPHISM MOBILE & DESKTOP OVERVIEW */}
            {activePanel === "overview" && (
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: { xs: 'calc(100vh - 200px)', md: 'calc(100vh - 240px)' }, 
                p: { xs: 1, md: 0 }
              }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 4, md: 6 },
                    borderRadius: "32px",
                    background: darkMode
                      ? "linear-gradient(145deg, rgba(15, 23, 42, 0.65), rgba(30, 41, 59, 0.85))"
                      : "linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(243, 244, 246, 0.9))",
                    backdropFilter: "blur(24px)",
                    boxShadow: darkMode
                      ? "0 25px 50px -12px rgba(0,0,0,0.7)"
                      : "0 25px 50px -12px rgba(99, 102, 241, 0.12)",
                    border: "1px solid",
                    borderColor: darkMode ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.8)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    textAlign: "center",
                    width: { xs: "100%", sm: "400px" },
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: darkMode
                        ? "0 30px 60px rgba(0,0,0,0.9)"
                        : "0 30px 60px rgba(99, 102, 241, 0.25)"
                    }
                  }}
                  onClick={() => navigate("/add-lead")}
                >
                  <Box sx={{
                    background: "linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(99, 102, 241, 0.2))",
                    borderRadius: "24px",
                    p: 3,
                    display: "flex",
                    boxShadow: "inset 0 0 20px rgba(255,255,255,0.1)"
                  }}>
                    <AddCircle sx={{ fontSize: 64, color: "#38bdf8" }} />
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight="800" sx={{ mb: 1, letterSpacing: '-0.5px' }}>
                      Add New Lead
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
                      Create a verified instant high-end consumer enterprise lead entry database record.
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            )}

            {/* LEADS PANEL DYNAMIC TRACKER */}
            {activePanel === "leads" && (
              <Paper sx={cardStyle}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                  <Typography variant="h5" sx={{ fontWeight: "800", letterSpacing: "-0.5px" }}>
                    Lead Tracking Matrix
                  </Typography>
                  {/* EXPORT ACTION MATRIX ACCESS BUTTONS */}
                  <Box sx={{ display: "flex", gap: 2, width: { xs: "100%", sm: "auto" }, flexDirection: { xs: "column", sm: "row" } }}>
                    <Button variant="contained" startIcon={<DownloadIcon />} onClick={downloadExcel} fullWidth={isMobile} sx={{ background: "#10b981", "&:hover": { background: "#059669" }, borderRadius: '12px', textTransform: 'none', fontWeight: '700' }}>
                      Download Leads Report
                    </Button>
                    <Button variant="contained" startIcon={<DownloadIcon />} onClick={downloadProductivityCSV} fullWidth={isMobile} sx={{ background: "#f59e0b", "&:hover": { background: "#d97706" }, borderRadius: '12px', textTransform: 'none', fontWeight: '700' }}>
                      Download Productivity
                    </Button>
                  </Box>
                </Box>

                {/* ADVANCED MULTI-AXIS FILTERING INTERFACE */}
                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, mb: 4 }}>
                  <TextField label="Search inside matrix by customer name or mobile" fullWidth value={search} onChange={(e) => setSearch(e.target.value)} InputProps={{ sx: { borderRadius: '12px' } }} />
                  <TextField select label="Filter by Employee Allocation" value={filterEmployee} onChange={(e) => setFilterEmployee(e.target.value)} sx={{ minWidth: { xs: '100%', md: '240px' } }} InputProps={{ sx: { borderRadius: '12px' } }}>
                    <MenuItem value="">All Employees</MenuItem>
                    {Object.entries(empMap).map(([id, name]) => (
                      <MenuItem key={id} value={id}>{name}</MenuItem>
                    ))}
                  </TextField>
                  <TextField select label="Filter by Lifecycle Status" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} sx={{ minWidth: { xs: '100%', md: '240px' } }} InputProps={{ sx: { borderRadius: '12px' } }}>
                    <MenuItem value="">All System Statuses</MenuItem>
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

                {/* LUXURY DATA TABLES SYSTEM */}
                <TableContainer sx={{ borderRadius: "16px", border: darkMode ? "1px solid #1e293b" : "1px solid #e2e8f0" }}>
                  <Table sx={{ minWidth: 1200 }}>
                    <TableHead sx={{ bgcolor: darkMode ? "#0f172a" : "#f1f5f9" }}>
                      <TableRow>
                        <TableCell sx={{ color: "text.primary", fontWeight: "800" }}>SR</TableCell>
                        <TableCell sx={{ color: "text.primary", fontWeight: "800" }}>Customer Name</TableCell>
                        <TableCell sx={{ color: "text.primary", fontWeight: "800" }}>Contact</TableCell>
                        <TableCell sx={{ color: "text.primary", fontWeight: "800" }}>Loan Amount</TableCell>
                        <TableCell sx={{ color: "text.primary", fontWeight: "800" }}>Created By</TableCell>
                        <TableCell sx={{ color: "text.primary", fontWeight: "800" }}>Bank Name</TableCell>
                        <TableCell sx={{ color: "text.primary", fontWeight: "800" }}>RM Name</TableCell>
                        <TableCell sx={{ color: "text.primary", fontWeight: "800" }}>Status Workflow</TableCell>
                        <TableCell sx={{ color: "text.primary", fontWeight: "800" }}>Lead Date</TableCell>
                        <TableCell sx={{ color: "text.primary", fontWeight: "800", textAlign: 'center' }}>Edit</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredLeads.map((l, i) => (
                        <TableRow key={l.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell sx={{ fontWeight: '600' }}>{i + 1}</TableCell>
                          <TableCell sx={{ fontWeight: '700', color: '#6366f1' }}>{l.fullName}</TableCell>
                          <TableCell>{l.mobile}</TableCell>
                          <TableCell sx={{ fontWeight: '700' }}>{formatAmount(l.requiredLoanAmount)}</TableCell>
                          <TableCell>
                            {l.owner} {empMap[l.owner] ? <span style={{ color: "#10b981", fontWeight: "700" }}>({empMap[l.owner]})</span> : ""}
                          </TableCell>
                          <TableCell>{l.bankName || "-"}</TableCell>
                          <TableCell>{l.rmName || "-"}</TableCell>
                          <TableCell>
                            <select
                              value={l.progress || ""}
                              onChange={(e) => updateStatus(l, e.target.value)}
                              style={{ 
                                padding: "10px", 
                                borderRadius: "10px", 
                                minWidth: "170px",
                                background: darkMode ? "#111827" : "#fff",
                                color: darkMode ? "#fff" : "#000",
                                border: darkMode ? "1px solid #374151" : "1px solid #cbd5e1",
                                fontWeight: '600',
                                fontSize: '13px'
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
                          <TableCell>{formatDate(l.created_at)}</TableCell>
                          <TableCell align="center">
                            <IconButton onClick={() => handleEdit(l)} sx={{ bgcolor: darkMode ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.05)', '&:hover': { bgcolor: '#6366f1', '& .MuiSvgIcon-root': { color: '#fff' } } }}>
                              <EditIcon sx={{ color: "#6366f1", fontSize: '18px', transition: 'color 0.2s' }} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            )}

            {/* PRODUCTIVITY PANEL TAB HISTORY VIEW */}
            {activePanel === "productivity" && (
              <Paper sx={cardStyle}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: "800", letterSpacing: "-0.5px" }}>
                  Daily Performance Logistics Matrix
                </Typography>
                
                {productivityList.length === 0 ? (
                   <Typography sx={{ color: "text.secondary", textAlign: "center", py: 8, fontSize: '15px' }}>
                     No enterprise execution logs found in system database architecture. Hit 'Update Productivity' button to instantiate entry.
                   </Typography>
                ) : (
                  <TableContainer sx={{ borderRadius: "16px", border: darkMode ? "1px solid #1e293b" : "1px solid #e2e8f0" }}>
                    <Table sx={{ minWidth: 1000 }}>
                      <TableHead sx={{ bgcolor: darkMode ? "#0f172a" : "#f1f5f9" }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "800", width: "70px" }}>SR</TableCell>
                          {employeeData.role === 'manager' && (
                            <TableCell sx={{ fontWeight: "800" }}>Corporate Employee</TableCell>
                          )}
                          <TableCell sx={{ fontWeight: "800", width: "120px" }}>Log Date</TableCell>
                          <TableCell sx={{ fontWeight: "800", textAlign: "center" }}>Total Dialed</TableCell>
                          <TableCell sx={{ fontWeight: "800", textAlign: "center" }}>Connected Matrix</TableCell>
                          <TableCell sx={{ fontWeight: "800" }}>Interested Base</TableCell>
                          <TableCell sx={{ fontWeight: "800" }}>Followup Pipeline</TableCell>
                          <TableCell sx={{ fontWeight: "800" }}>System Remarks</TableCell>
                          <TableCell sx={{ fontWeight: "800", textAlign: "center" }}>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {productivityList.map((row, index) => (
                          <TableRow key={row.id} hover>
                            <TableCell sx={{ fontWeight: '600' }}>{index + 1}</TableCell>
                            {employeeData.role === 'manager' && (
                               <TableCell sx={{ fontWeight: '700', color: '#38bdf8' }}>{row.employee__first_name || "Self"}</TableCell>
                            )}
                            <TableCell>{row.date}</TableCell>
                            <TableCell align="center" sx={{ fontWeight: '700' }}>{row.total_calls}</TableCell>
                            <TableCell align="center" sx={{ fontWeight: '700', color: '#10b981' }}>{row.connected_calls}</TableCell>
                            <TableCell sx={{ whiteSpace: "pre-line", fontSize: '13px' }}>{row.interested_customers || "-"}</TableCell>
                            <TableCell sx={{ whiteSpace: "pre-line", fontSize: '13px' }}>{row.followup_customers || "-"}</TableCell>
                            <TableCell sx={{ color: 'text.secondary', fontSize: '13px' }}>{row.remark || "-"}</TableCell>
                            <TableCell align="center">
                              <Tooltip title="Compile Secure PDF Document">
                                <IconButton onClick={() => downloadRowPDF(row)} sx={{ color: "#ef4444", bgcolor: 'rgba(239,68,68,0.08)', '&:hover': { bgcolor: '#ef4444', color: '#fff' } }}>
                                  <DownloadIcon sx={{ fontSize: '18px' }} />
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

            {/* ATTENDANCE PANEL ROUTE ARCHITECTURE */}
            {activePanel === "attendance" && <Attendance />}

            {/* INTERACTIVE MORTGAGE LAZY EMI FRAMEWORK */}
            {activePanel === "emi" && (
              <Suspense
                fallback={
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
                    <Typography sx={{ color: "#6366f1", fontSize: "20px", fontWeight: "800", letterSpacing: '0.5px' }}>
                      Assembling Encrypted EMI Calculator Framework...
                    </Typography>
                  </Box>
                }
              >
                <EMI />
              </Suspense>
            )}

          </Box>
        </Box>

        {/* SECURE POPUP MODAL DIALOG COMPONENT */}
        <Dialog open={openUpdateDialog} onClose={() => setOpenUpdateDialog(false)} fullWidth maxWidth="md" PaperProps={{ sx: { borderRadius: '28px', p: 1 } }}>
          <DialogTitle sx={{ 
            bgcolor: darkMode ? "#0b0f19" : "#f8fafc", 
            color: darkMode ? "#fff" : "#0f172a",
            fontWeight: "800",
            fontSize: '20px',
            borderBottom: darkMode ? "1px solid #1e293b" : "1px solid #e2e8f0"
          }}>
            Update Corporate Execution Productivity
          </DialogTitle>
          <DialogContent sx={{ bgcolor: darkMode ? "#0b0f19" : "#fff", p: { xs: 3, md: 4 } }}>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Total Calls Initiated" type="number" variant="outlined" value={productivity.total_calls} onChange={(e) => setProductivity({...productivity, total_calls: e.target.value})} InputProps={{ sx: { borderRadius: '12px' } }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Connected Conversational Nodes" type="number" variant="outlined" value={productivity.connected_calls} onChange={(e) => setProductivity({...productivity, connected_calls: e.target.value})} InputProps={{ sx: { borderRadius: '12px' } }} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Interested Client Base Profiles" placeholder="Example:&#10;1) Customer Name &#10;2) Customer Name" multiline rows={3} variant="outlined" value={productivity.interested_customers} onChange={(e) => setProductivity({...productivity, interested_customers: e.target.value})} helperText="Delineate names utilizing index markers (1, 2, ...)" InputProps={{ sx: { borderRadius: '12px' } }} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Pipeline Followup Consumer Directory" placeholder="Example:&#10;1) Customer Name&#10;2) Customer Name" multiline rows={3} variant="outlined" value={productivity.followup_customers} onChange={(e) => setProductivity({...productivity, followup_customers: e.target.value})} helperText="Delineate names utilizing index markers (1, 2, ...)" InputProps={{ sx: { borderRadius: '12px' } }} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="System Log Core Remarks / Audit Notes" multiline rows={2} variant="outlined" value={productivity.remark} onChange={(e) => setProductivity({...productivity, remark: e.target.value})} InputProps={{ sx: { borderRadius: '12px' } }} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ bgcolor: darkMode ? "#0b0f19" : "#f8fafc", p: 2.5, borderTop: darkMode ? "1px solid #1e293b" : "1px solid #e2e8f0" }}>
            <Button onClick={() => setOpenUpdateDialog(false)} sx={{ color: darkMode ? "#cbd5e1" : "inherit", textTransform: 'none', fontWeight: '700' }}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleProductivitySubmit} sx={{ background: "linear-gradient(135deg, #8b5cf6, #6366f1)", "&:hover": { background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }, borderRadius: '12px', textTransform: 'none', px: 3, fontWeight: '700' }}>
              Submit Architecture Record
            </Button>
          </DialogActions>
        </Dialog>

        {/* ULTRA WORLD-CLASS PERMANENT FAB FOR MOBILE COMPACT DEVICES */}
        {isMobile && (
          <Fab
            color="primary"
            aria-label="add lead floating node"
            onClick={() => navigate("/add-lead")}
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              background: "linear-gradient(135deg, #38bdf8, #6366f1)",
              color: "#fff",
              boxShadow: "0 12px 24px rgba(99, 102, 241, 0.4)",
              transition: 'transform 0.2s ease',
              "&:hover": { 
                background: "linear-gradient(135deg, #0284c7, #4f46e5)",
                transform: 'scale(1.05)'
              },
              zIndex: 1200
            }}
          >
            <AddCircle sx={{ fontSize: '28px' }} />
          </Fab>
        )}

      </Box>
    </ThemeProvider>
  );
}

export default EmployeeDashboard;