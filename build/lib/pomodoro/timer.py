import streamlit as st
from pomodoro import pomodoro_timer

work_duration = st.slider("Work duration (minutes)", 1, 60, 25)
break_duration = st.slider("Break duration (minutes)", 1, 30, 5)


# Define the inputs for the PomodoroTimer
work_duration = 25  # Work duration in minutes
break_duration = 5  # Break duration in minutes
work_label = "Work"  # Label for work session
break_label = "Break"  # Label for break session
text_color = "skyblue"  # Text color
size = 250  # Size of the timer
stroke_width_input = 5  # Stroke width for the timer
stroke_color = "#593773"  # Stroke color

# Call the PomodoroTimer component with the defined inputs
timer_state = pomodoro_timer(
    work_duration,
    break_duration,
    work_label,
    break_label,
    text_color,
    size,
    stroke_width_input,
    stroke_color
)

print("TIMER STATE")
print(timer_state)

if timer_state:

    st.write(f"Timer running: {timer_state['isRunning']}")
    st.write(f"Current phase: {'Work' if timer_state['isWorkTime'] else 'Break'}")
    st.write(f"Time left: {timer_state['timeLeft']} seconds")