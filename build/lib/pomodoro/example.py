import streamlit as st
from pomodoro import my_component, pomodoro_timer

# Add some test code to play with the component while it's in development.
# During development, we can run this just as we would any other Streamlit
# app: `$ streamlit run my_component/example.py`

st.subheader("Component with constant args")

# Create an instance of our component with a constant `name` arg, and
# print its output value.
num_clicks = my_component("World")
print("PRINTING CLICKS-1")
print(num_clicks)
st.markdown("You've clicked %s times!" % int(num_clicks))

st.markdown("---")
st.subheader("Component with variable args")

# Create a second instance of our component whose `name` arg will vary
# based on a text_input widget.
#
# We use the special "key" argument to assign a fixed identity to this
# component instance. By default, when a component's arguments change,
# it is considered a new instance and will be re-mounted on the frontend
# and lose its current state. In this case, we want to vary the component's
# "name" argument without having it get recreated.
name_input = st.text_input("Enter a name", value="Streamlit")
num_clicks = my_component(name_input, key="foo")
print("PRINTING CLICKS-2")
print(num_clicks)
st.markdown("You've clicked %s times!" % int(num_clicks))


# From Pomodoro-cursor
st.title("Pomodoro Timer App")

work_duration = st.slider("Work duration (minutes)", 1, 60, 25)
break_duration = st.slider("Break duration (minutes)", 1, 30, 5)

timer_state = pomodoro_timer(work_duration, break_duration)

if timer_state:
    st.write(f"Timer running: {timer_state['isRunning']}")
    st.write(f"Current phase: {'Work' if timer_state['isWorkTime'] else 'Break'}")
    st.write(f"Time left: {timer_state['timeLeft']} seconds")
