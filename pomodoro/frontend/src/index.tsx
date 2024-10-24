import React from "react"
import ReactDOM from "react-dom"
import PomodoroTimer from "./PomodoroTimer"

const rootElement = document.getElementById("root");

if (rootElement) {
  // Apply inline styles to the root element
  rootElement.style.display = "flex";
  rootElement.style.justifyContent = "center"; // Center horizontally
  rootElement.style.alignItems = "center"; // Center vertically
  rootElement.style.height = "100vh"; // Full viewport height
  rootElement.style.backgroundColor = "transparent"; // Optional: background color

  ReactDOM.render(
    <React.StrictMode>
      <PomodoroTimer />
    </React.StrictMode>,
    rootElement
  );
}
