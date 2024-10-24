import streamlit as st
from pomodoro import menu_bar

st.title("Menu bar example")

menu_state = menu_bar()


# Optionally, you can print the state if your component returns any state
if menu_state:
    st.write("Menu State:", menu_state)
    