import React, { useState, useEffect } from "react"
import {
  ComponentProps,
  Streamlit,
  withStreamlitConnection,
} from "streamlit-component-lib"
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';

const PomodoroTimer = (props: ComponentProps) => {
  const { work_duration, break_duration, workLabel = "Work", breakLabel = "Break", textColor = "skyblue", size = 250, strokeWidthInput = 1 } = props.args; // Default strokeWidthInput set to 5
  const strokeColor = props.args.strokeColor || "#593773"; // Default color
  const [isRunning, setIsRunning] = useState(false)
  const [isWorkTime, setIsWorkTime] = useState(true)
  const [timeLeft, setTimeLeft] = useState(work_duration * 60 * 10) // Store time in tenths of a second
  const [cycleCount, setCycleCount] = useState(0)
  const maxCycles = 4 // Set the maximum number of cycles

  useEffect(() => {
    Streamlit.setFrameHeight()
  })

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            if (isWorkTime) {
              setCycleCount((prevCount) => prevCount + 1)
            }
            setIsWorkTime((prev) => !prev)
            return isWorkTime ? break_duration * 60 * 10 : work_duration * 60 * 10
          }
          return prevTime - 1 // Decrement by 1 tenth of a second
        })
      }, 100) // Update every 100 milliseconds (0.1 seconds)
    } else if (interval) {
      clearInterval(interval)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, isWorkTime, work_duration, break_duration])

  useEffect(() => {
    if (cycleCount >= maxCycles) {
      setIsRunning(false) // Stop the timer after max cycles
      Streamlit.setComponentValue({ isRunning, isWorkTime, timeLeft, cycleCount })
    }
  }, [cycleCount])

  const toggleTimer = () => {
    setIsRunning((prev) => !prev)
    // Send the state to the server when the timer is toggled
    Streamlit.setComponentValue({ isRunning, isWorkTime, timeLeft, cycleCount })
  }

  const formatTime = (tenths: number) => {
    const totalSeconds = Math.floor(tenths / 10)
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    const tenthsDisplay = tenths % 10
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${tenthsDisplay.toString().padStart(1, "0")}`
  }

  const calculateProgress = () => {
    const totalTime = isWorkTime ? work_duration * 60 * 10 : break_duration * 60 * 10;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  // Send the state to the server when the timer ends
  useEffect(() => {
    if (timeLeft <= 0) {
      Streamlit.setComponentValue({ isRunning, isWorkTime, timeLeft, cycleCount });
    }
  }, [timeLeft]);

  const strokeWidth = Math.min(Math.max(strokeWidthInput, 1), 50) / 100 * size; // Cap strokeWidth at 50
  const radius = (size / 2) - (strokeWidth / 2); // Adjust radius based on strokeWidth
  const strokeDasharray = 2 * Math.PI * radius; // Calculate circumference for stroke
  const strokeDashoffset = strokeDasharray - (strokeDasharray * calculateProgress()) / 100; // Calculate stroke offset

  return (
    <div style={{ width: size, height: size, maxWidth: '100vw', position: "relative" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius} // Use adjusted radius
          fill="none"
          stroke="#e0e0e0"
          strokeWidth={strokeWidth} // Updated stroke width
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius} // Use adjusted radius
          fill="none"
          stroke={strokeColor} // Use the stroke color from props
          strokeWidth={strokeWidth} // Updated stroke width
          strokeDasharray={strokeDasharray} // Updated for new radius
          strokeDashoffset={strokeDashoffset} // Updated stroke offset
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          height: "100%", // Full height for alignment
          display: "flex",
          flexDirection: "column",
          justifyContent: "center", // Center countdown and label
        }}
      >
        <h2 style={{ margin: 0, color: textColor }}>{formatTime(timeLeft)}</h2>
        <div style={{ 
          whiteSpace: 'nowrap', // Prevents text from wrapping
          overflowX: 'auto',    // Enables horizontal scrolling
          overflowY: 'hidden',   // Hides vertical overflow
          width: '100vw',         // Set a fixed width or adjust as needed
          color: strokeColor,
          padding: '5px', // Optional padding
          border: '0px solid #ccc' // Optional border
        }}>
          {isWorkTime ? workLabel : breakLabel}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "10px", // Align to the bottom of the container
          left: "50%",
          transform: "translate(-50%, calc(-50%))", // Adjusted to lower the buttons
          display: "flex",
          justifyContent: "center",
          gap: "5px", // Space between buttons
        }}
      >
        <button
          onClick={toggleTimer}
          style={{
            backgroundColor: "white", // Make button transparent
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            padding: 0, // Remove padding
          }}
        >
          {isRunning ? <PauseIcon style={{ fontSize: "42px", color: "#593773" }} /> : <PlayArrowIcon style={{ fontSize: "42px", color: "#593773" }} />} {/* Material UI icons */}
        </button>
        <button
          onClick={() => {
            setIsRunning(false); // Stop functionality
            Streamlit.setComponentValue({ isRunning: false, isStopped: true, isWorkTime, timeLeft, cycleCount }); // Return all values including isStopped
          }}
          style={{
            backgroundColor: "white", // Make button transparent
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            padding: 0, // Remove padding
          }}
        >
          <StopIcon style={{ fontSize: "42px", color: "#d9534f" }} /> {/* Material UI Stop icon */}
        </button>
      </div>
    </div>
  );
}

export default withStreamlitConnection(PomodoroTimer)