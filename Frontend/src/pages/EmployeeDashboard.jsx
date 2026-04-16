import React, { useState, useEffect } from "react";

function EmployeeDashboard() {

  const name = localStorage.getItem("name");
  const emp_id = localStorage.getItem("emp_id");

  const [activePanel, setActivePanel] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const [timer, setTimer] = useState(8 * 60 * 60);
  const [isRunning, setIsRunning] = useState(false);

  const [punchInTime, setPunchInTime] = useState(null);
  const [punchOutTime, setPunchOutTime] = useState(null);

  const [attendance, setAttendance] = useState("Not Marked");

  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [emi, setEmi] = useState(null);

  const API = "https://pmb.finance/api/attendance/";

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
    return `${h}:${m}:${s}`;
  };

  const now = () => new Date().toLocaleTimeString();

  // 🔥 API CALL
  const sendAttendance = async (action) => {
    try {
      await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emp_id: emp_id,
          action: action,
        }),
      });
    } catch (err) {
      console.log("API ERROR", err);
    }
  };

  const handlePunchIn = () => {
    setAttendance("Punched In ✅");
    setIsRunning(true);
    setPunchInTime(now());
    sendAttendance("punch_in");
  };

  const handlePunchOut = () => {
    setAttendance("Punched Out ❌");
    setIsRunning(false);
    setPunchOutTime(now());
    sendAttendance("punch_out");
  };

  const handleLunchStart = () => {
    sendAttendance("lunch_start");
  };

  const handleLunchEnd = () => {
    sendAttendance("lunch_end");
  };

  const calculateEMI = () => {
    if (!loanAmount || !interestRate || !tenure) return;

    const P = parseFloat(loanAmount);
    const R = parseFloat(interestRate) / 12 / 100;
    const N = parseFloat(tenure) * 12;

    const emiValue =
      (P * R * Math.pow(1 + R, N)) /
      (Math.pow(1 + R, N) - 1);

    setEmi(emiValue.toFixed(2));
  };

  return (
    <div style={{ padding: "20px" }}>

      <h2>Welcome {name}</h2>

      <button onClick={() => {
        localStorage.clear();
        window.location.href = "/";
      }}>
        Logout
      </button>

      {/* 🔥 CARDS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))",
        gap: "20px",
        marginTop: "30px"
      }}>

        <div style={card} onClick={() => setActivePanel("attendance")}>
          ⏱️ Attendance
        </div>

        <div style={card} onClick={() => setActivePanel("emi")}>
          💰 EMI
        </div>

        <div style={card} onClick={() => setShowPopup(true)}>
          📊 Add Lead
        </div>

        <div style={card} onClick={() => setShowPopup(true)}>
          📝 Leave
        </div>

      </div>

      {/* 🔥 ATTENDANCE PANEL */}
      {activePanel === "attendance" && (
        <div style={panel}>
          <h3>Attendance</h3>

          <p>{attendance}</p>
          <h2>{formatTime(timer)}</h2>

          <p>In: {punchInTime || "--"}</p>
          <p>Out: {punchOutTime || "--"}</p>

          <button onClick={handlePunchIn}>Punch In</button>
          <button onClick={handlePunchOut}>Punch Out</button>
          <button onClick={handleLunchStart}>Lunch Start</button>
          <button onClick={handleLunchEnd}>Lunch End</button>
        </div>
      )}

      {/* 🔥 EMI PANEL */}
      {activePanel === "emi" && (
        <div style={panel}>
          <h3>EMI Calculator</h3>

          <input type="number" placeholder="Loan Amount"
            onChange={(e)=>setLoanAmount(e.target.value)} />

          <input type="number" placeholder="Interest %"
            onChange={(e)=>setInterestRate(e.target.value)} />

          <input type="number" placeholder="Years"
            onChange={(e)=>setTenure(e.target.value)} />

          <button onClick={calculateEMI}>Calculate</button>

          {emi && <h3>₹ {emi}</h3>}
        </div>
      )}

      {/* 🔥 POPUP */}
      {showPopup && (
        <div style={overlay}>
          <div style={popup}>
            <h2>🚧 Under Working</h2>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}

    </div>
  );
}

/* 🔥 STYLES */
const card = {
  padding: "30px",
  background: "#2563eb",
  color: "#fff",
  borderRadius: "10px",
  textAlign: "center",
  cursor: "pointer"
};

const panel = {
  marginTop: "20px",
  padding: "20px",
  background: "#eee"
};

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const popup = {
  background: "#fff",
  padding: "30px",
  borderRadius: "10px"
};

export default EmployeeDashboard;