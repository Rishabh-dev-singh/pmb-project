// EMI.jsx

import React, { useState } from "react";

import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";

import CalculateIcon from "@mui/icons-material/Calculate";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function EMI() {

  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [duration, setDuration] = useState("");

  const [emi, setEmi] = useState(null);
  const [schedule, setSchedule] = useState([]);

  // EMI CALCULATION
  const calculateEMI = () => {

    const P = parseFloat(amount);
    const annualRate = parseFloat(rate);
    const N = parseInt(duration);

    if (!P || !annualRate || !N) {
      alert("Fill all fields");
      return;
    }

    const R = annualRate / 12 / 100;

    const emiValue =
      (P * R * Math.pow(1 + R, N)) /
      (Math.pow(1 + R, N) - 1);

    setEmi(emiValue.toFixed(2));

    let balance = P;

    const data = [];

    for (let month = 1; month <= N; month++) {

      const interest = balance * R;

      const principal =
        emiValue - interest;

      balance -= principal;

      data.push({
        month,
        emi: emiValue.toFixed(2),
        principal: principal.toFixed(2),
        interest: interest.toFixed(2),
        balance:
          balance > 0
            ? balance.toFixed(2)
            : "0.00"
      });
    }

    setSchedule(data);
  };

  // PDF DOWNLOAD
  const downloadPDF = () => {

    const doc = new jsPDF();

    // TITLE
    doc.setFontSize(24);
    doc.setTextColor(37, 99, 235);
    doc.text("EMI Report", 14, 20);

    // INFO
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    doc.text(`Loan Amount : Rs. ${amount}`, 14, 40);
    doc.text(`Interest Rate : ${rate}%`, 14, 50);
    doc.text(`Duration : ${duration} Months`, 14, 60);
    doc.text(`Monthly EMI : Rs. ${emi}`, 14, 70);

    // TABLE
    autoTable(doc, {

      startY: 85,

      head: [[
        "Month",
        "EMI",
        "Principal",
        "Interest",
        "Balance"
      ]],

      body: schedule.map((row) => [

        row.month,

        `Rs. ${row.emi}`,

        `Rs. ${row.principal}`,

        `Rs. ${row.interest}`,

        `Rs. ${row.balance}`

      ]),

      theme: "grid",

      headStyles: {
        fillColor: [37, 99, 235],
        textColor: 255,
        fontStyle: "bold"
      },

      styles: {
        fontSize: 10,
        cellPadding: 3
      },

      alternateRowStyles: {
        fillColor: [245, 247, 250]
      }
    });

    doc.save("EMI_Report.pdf");
  };

  return (

    <Box
      sx={{
        p: 3,
        borderRadius: "25px",
        background:
          "linear-gradient(135deg,#f8fafc,#e0f2fe)"
      }}
    >

      {/* TOP CARD */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: "25px",
          background: "#ffffff"
        }}
      >

        <Grid container spacing={3}>

          <Grid item xs={12} md={8}>

            <Typography
              variant="h3"
              fontWeight="bold"
              sx={{
                mb: 1,
                color: "#0f172a"
              }}
            >
              EMI Calculator
            </Typography>

            <Typography
              sx={{
                color: "#64748b",
                fontSize: "16px"
              }}
            >
              Calculate EMI with full repayment schedule
            </Typography>

          </Grid>

          <Grid item xs={12} md={4}>

            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "20px",
                background:
                  "linear-gradient(135deg,#06b6d4,#2563eb)",

                display: "flex",
                justifyContent: "center",
                alignItems: "center",

                ml: "auto",

                boxShadow:
                  "0 10px 25px rgba(37,99,235,0.3)"
              }}
            >

              <CalculateIcon
                sx={{
                  color: "#fff",
                  fontSize: 40
                }}
              />

            </Box>

          </Grid>

        </Grid>

        {/* INPUTS */}
        <Grid container spacing={3} sx={{ mt: 2 }}>

          <Grid item xs={12} md={4}>

            <TextField
              fullWidth
              label="Loan Amount"

              value={amount}

              onChange={(e) =>
                setAmount(e.target.value)
              }

              sx={{
                background: "#fff",
                borderRadius: "14px"
              }}
            />

          </Grid>

          <Grid item xs={12} md={4}>

            <TextField
              fullWidth
              label="Interest Rate (%)"

              value={rate}

              onChange={(e) =>
                setRate(e.target.value)
              }

              sx={{
                background: "#fff",
                borderRadius: "14px"
              }}
            />

          </Grid>

          <Grid item xs={12} md={4}>

            <TextField
              fullWidth
              label="Duration (Months)"

              value={duration}

              onChange={(e) =>
                setDuration(e.target.value)
              }

              sx={{
                background: "#fff",
                borderRadius: "14px"
              }}
            />

          </Grid>

        </Grid>

        {/* BUTTONS */}
        <Box sx={{ mt: 4 }}>

          <Button
            variant="contained"
            onClick={calculateEMI}

            sx={{
              px: 5,
              py: 1.5,
              borderRadius: "14px",
              fontWeight: "bold",

              background:
                "linear-gradient(90deg,#06b6d4,#2563eb)",

              "&:hover": {
                background:
                  "linear-gradient(90deg,#0891b2,#1d4ed8)"
              }
            }}
          >
            Calculate EMI
          </Button>

          {emi && (

            <Button
              variant="outlined"
              onClick={downloadPDF}

              sx={{
                ml: 2,
                px: 4,
                py: 1.5,
                borderRadius: "14px",
                fontWeight: "bold",

                color: "#2563eb",
                borderColor: "#2563eb",

                "&:hover": {
                  background:
                    "rgba(37,99,235,0.08)",
                  borderColor: "#1d4ed8"
                }
              }}
            >
              Download PDF
            </Button>
          )}

        </Box>

      </Paper>

      {/* EMI RESULT */}
      {emi && (

        <Paper
          elevation={3}
          sx={{
            mt: 3,
            p: 3,
            borderRadius: "20px",
            background: "#ffffff"
          }}
        >

          <Typography
            sx={{
              color: "#64748b",
              mb: 1
            }}
          >
            Monthly EMI
          </Typography>

          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{
              color: "#2563eb"
            }}
          >
            Rs. {emi}
          </Typography>

        </Paper>
      )}

      {/* TABLE */}
      {schedule.length > 0 && (

        <Paper
          elevation={3}
          sx={{
            mt: 3,
            borderRadius: "20px",
            overflow: "hidden",
            background: "#ffffff"
          }}
        >

          <TableContainer
            sx={{
              maxHeight: 450
            }}
          >

            <Table stickyHeader>

              <TableHead>

                <TableRow>

                  {[
                    "Month",
                    "EMI",
                    "Principal",
                    "Interest",
                    "Balance"
                  ].map((head) => (

                    <TableCell
                      key={head}

                      sx={{
                        background: "#2563eb",
                        color: "#fff",
                        fontWeight: "bold"
                      }}
                    >
                      {head}
                    </TableCell>

                  ))}

                </TableRow>

              </TableHead>

              <TableBody>

                {schedule.map((row) => (

                  <TableRow key={row.month} hover>

                    <TableCell>
                      {row.month}
                    </TableCell>

                    <TableCell
                      sx={{
                        color: "#2563eb",
                        fontWeight: "600"
                      }}
                    >
                      Rs. {row.emi}
                    </TableCell>

                    <TableCell>
                      Rs. {row.principal}
                    </TableCell>

                    <TableCell
                      sx={{
                        color: "#d97706"
                      }}
                    >
                      Rs. {row.interest}
                    </TableCell>

                    <TableCell
                      sx={{
                        color: "#16a34a",
                        fontWeight: "600"
                      }}
                    >
                      Rs. {row.balance}
                    </TableCell>

                  </TableRow>

                ))}

              </TableBody>

            </Table>

          </TableContainer>

        </Paper>
      )}

    </Box>
  );
}

export default EMI;