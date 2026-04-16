import React, { useState, useEffect } from "react";

function EmployeeDashboard() {

  const name = localStorage.getItem("name");

  const [activePanel, setActivePanel] = useState(null);

  const [timer, setTimer] = useState(8 * 60 * 60);
  const [isRunning, setIsRunning] = useState(false);

  const [punchInTime, setPunchInTime] = useState(null);
  const [punchOutTime, setPunchOutTime] = useState(null);

  const [lunchStart, setLunchStart] = useState(null);
  const [lunchEnd, setLunchEnd] = useState(null);

  const [attendance, setAttendance] = useState("Not Marked");

  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [emi, setEmi] = useState(null);

  useEffect(() => {
    let interval;
    if (isRunning && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timer]);

  const formatTime = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`;
  };

  const now = () => new Date().toLocaleTimeString();

  const handlePunchIn = () => {
    setAttendance("Punched In ✅");
    setIsRunning(true);
    setTimer(8 * 60 * 60);
    setPunchInTime(now());
    setPunchOutTime(null);
  };

  const handlePunchOut = () => {
    setAttendance("Punched Out ❌");
    setIsRunning(false);
    setPunchOutTime(now());
  };

  const handleLunchStart = () => {
    setLunchStart(now());
    setIsRunning(false);
  };

  const handleLunchEnd = () => {
    setLunchEnd(now());
    setIsRunning(true);
  };

  const calculateEMI = () => {
    const P = loanAmount;
    const R = interestRate / 12 / 100;
    const N = tenure * 12;

    const emiValue =
      (P * R * Math.pow(1 + R, N)) /
      (Math.pow(1 + R, N) - 1);

    setEmi(emiValue.toFixed(2));
  };

  return (
    <div style={container}>

      <h1 style={heading}>
        <h3>WELCOME</h3>
        <h5>{name}</h5>
      </h1>

      <div style={cardGrid}>

        <div
          style={luxCard}
          onClick={() => setActivePanel("attendance")}
          onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-10px) scale(1.05)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          ⏱️ Attendance
        </div>

        <div
          style={luxCard}
          onClick={() => setActivePanel("emi")}
          onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-10px) scale(1.05)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          💰 EMI Calculator
        </div>

        <div
          style={luxCard}
          onClick={() => setActivePanel("lead")}
          onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-10px) scale(1.05)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          📊 Add Lead
        </div>

        <div
          style={luxCard}
          onClick={() => setActivePanel("leave")}
          onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-10px) scale(1.05)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          📝 Leave
        </div>

      </div>

      {activePanel && (
        <div style={overlay} onClick={() => setActivePanel(null)}></div>
      )}

      {activePanel && (
        <div style={panel}>

          <button onClick={() => setActivePanel(null)} style={closeBtn}>✖</button>

          {activePanel === "attendance" && (
            <>
              <h2 style={panelHeading}>⏱️ Attendance</h2>
              <p>{attendance}</p>
              <h2>{formatTime(timer)}</h2>

              <p>🟢 In: {punchInTime || "--"}</p>
              <p>🔴 Out: {punchOutTime || "--"}</p>
              <p>🍱 Lunch: {lunchStart || "--"} → {lunchEnd || "--"}</p>

              <button onClick={handlePunchIn} style={btnGreen}>Punch In</button>
              <button onClick={handlePunchOut} style={btnRed}>Punch Out</button>
              <button onClick={handleLunchStart} style={btnBlue}>Lunch Start</button>
              <button onClick={handleLunchEnd} style={btnBlue}>Lunch End</button>
            </>
          )}
          

          {activePanel === "emi" && (
            <>
              <h2 style={panelHeading}>💰 EMI Calculator</h2>

              <input placeholder="Loan Amount" onChange={(e)=>setLoanAmount(e.target.value)} style={input}/>
              <input placeholder="Interest %" onChange={(e)=>setInterestRate(e.target.value)} style={input}/>
              <input placeholder="Years" onChange={(e)=>setTenure(e.target.value)} style={input}/>

              <button onClick={calculateEMI} style={btnBlue}>Calculate</button>

              {emi && <h3>₹ {emi}</h3>}
            </>
          )}

          {activePanel === "lead" && (
            <>
              <h2 style={panelHeading}>📊 Add Lead</h2>
              <textarea style={input}></textarea>
              <button style={btnBlue}>Submit</button>
            </>
          )}

          {activePanel === "leave" && (
            <>
              <h2 style={panelHeading}>📝 Leave</h2>
              <textarea style={input}></textarea>
              <button style={btnBlue}>Apply</button>
            </>
          )}

        </div>
      )}

    </div>
  );
}

/* 🔥 STYLES */

const container = {
  padding: "30px",
  background: "#ffffff",
  minHeight: "100vh",
  color: "#000"
};

const heading = {
  fontSize: "28px",
  color: "#0ea5e9",
  fontWeight: "bold"
};

const cardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "25px",
  marginTop: "40px"
};

const luxCard = {
  height: "180px",
  borderRadius: "20px",
  background: "linear-gradient(135deg, #0f172a, #1e3a8a, #2563eb)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  transition: "all 0.4s ease",
  boxShadow: "0 15px 40px rgba(37,99,235,0.4)",
  color: "#fff",
  fontSize: "18px",
  fontWeight: "600"
};

const overlay = {
  position: "fixed",
  top: "70px",
  left: 0,
  width: "100%",
  height: "calc(100% - 70px)",
  background: "rgba(0,0,0,0.3)",
  backdropFilter: "blur(4px)",
  zIndex: 998
};

const panel = {
  position: "fixed",
  top: "70px",
  right: 0,
  width: "350px",
  height: "calc(100% - 70px)",
  background: "#ffffff",
  color: "#000",
  padding: "20px",
  zIndex: 999,
  overflowY: "auto",
  boxShadow: "-10px 0 40px rgba(0,0,0,0.2)",
  borderLeft: "2px solid #e5e7eb"
};

const panelHeading = {
  color: "#2563eb"
};

const closeBtn = {
  float: "right",
  background: "red",
  color: "#fff",
  border: "none",
  padding: "5px",
  cursor: "pointer"
};

const input = {
  width: "100%",
  marginTop: "10px",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc"
};

const btnGreen = { margin:"5px", padding:"8px", background:"#22c55e", color:"#fff", border:"none" };
const btnRed = { ...btnGreen, background:"#ef4444" };
const btnBlue = { ...btnGreen, background:"#3b82f6" };

export default EmployeeDashboard;







