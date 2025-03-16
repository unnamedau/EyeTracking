#!/usr/bin/env python
import os
import sys
import types
import tkinter as tk
from tkinter import filedialog, messagebox

# Create a dummy module for tensorflow_decision_forests if not installed.
if 'tensorflow_decision_forests' not in sys.modules:
    dummy = types.ModuleType('tensorflow_decision_forests')
    dummy.__version__ = "0.0.0"
    sys.modules['tensorflow_decision_forests'] = dummy

import tensorflow as tf
import tensorflowjs as tfjs

# --- Define conversion groups ---
# This structure makes it easy to add new groups and pairings.
# Each dictionary defines:
#   - "group_label": text shown for the group
#   - "output_folder": the name of the subfolder to create in the output folder
#   - "options": a list of tuples. Each tuple is (option_text, filename_to_convert)
#       * Use None as filename if you want an option for “None”
#   - "default": the default radio button value.
conversion_groups = [
    {
        "group_label": "Combined Openness",
        "output_folder": "combined_openness",
        "options": [
            ("None", None),
            ("Combined Openness", "combined_openness.h5"),
            ("Combined Openness Gen 2", "combined_openness_gen2.h5")
        ],
        "default": "None"
    },
    {
        "group_label": "Left Openness",
        "output_folder": "left_openness",
        "options": [
            ("None", None),
            ("Left Openness", "left_openness.h5"),
            ("Left Openness Gen 2", "left_openness_gen2.h5"),
            ("Left Openness Distilled", "left_openness_distilled.h5")
        ],
        "default": "None"
    },
    {
        "group_label": "Right Openness",
        "output_folder": "right_openness",
        "options": [
            ("None", None),
            ("Right Openness", "right_openness.h5"),
            ("Right Openness Gen 2", "right_openness_gen2.h5"),
            ("Right Openness Distilled", "right_openness_distilled.h5")
        ],
        "default": "None"
    },
    {
        "group_label": "Combined Gaze",
        "output_folder": "combined_pitchyaw",
        "options": [
            ("None", None),
            ("Combined Gaze", "combined_pitchyaw.h5")
        ],
        "default": "None"
    },
    {
        "group_label": "Left Gaze",
        "output_folder": "left_pitchyaw",
        "options": [
            ("None", None),
            ("Left Gaze", "left_pitchyaw.h5")
        ],
        "default": "None"
    },
    {
        "group_label": "Right Gaze",
        "output_folder": "right_pitchyaw",
        "options": [
            ("None", None),
            ("Right Gaze", "right_pitchyaw.h5")
        ],
        "default": "None"
    }
]

# --- Global variables for folder paths ---
input_folder = ""
output_folder = ""

# --- Folder selection functions ---
def select_input_folder():
    global input_folder
    folder_path = filedialog.askdirectory(title="Select Input Folder Containing .h5 Models")
    if folder_path:
        input_folder = folder_path
        input_folder_label.config(text=f"Selected: {input_folder}")

def select_output_folder():
    global output_folder
    folder_path = filedialog.askdirectory(title="Select Output Folder for Converted Models")
    if folder_path:
        output_folder = folder_path
        output_folder_label.config(text=f"Selected: {output_folder}")

# --- Conversion function ---
def convert_models():
    if not input_folder:
        messagebox.showerror("Error", "Please select an input folder.")
        return
    if not output_folder:
        messagebox.showerror("Error", "Please select an output folder.")
        return

    conversion_results = []

    # Iterate over each conversion group defined above.
    for group in conversion_groups:
        group_name = group["group_label"]
        selected_option = radio_vars[group_name].get()
        # Look up the corresponding .h5 filename
        file_to_convert = None
        for (option_text, file_name) in group["options"]:
            if option_text == selected_option:
                file_to_convert = file_name
                break

        if file_to_convert is None:
            conversion_results.append(f"Skipped {group_name}")
            continue

        model_path = os.path.join(input_folder, file_to_convert)
        if not os.path.isfile(model_path):
            conversion_results.append(f"Warning: {file_to_convert} not found for {group_name}")
            continue

        # Create output subfolder (if not already existing)
        output_subfolder = os.path.join(output_folder, group["output_folder"])
        if not os.path.exists(output_subfolder):
            os.makedirs(output_subfolder)

        # Load the Keras model
        try:
            model = tf.keras.models.load_model(model_path)
        except Exception as e:
            conversion_results.append(f"Error loading {file_to_convert} for {group_name}: {e}")
            continue

        # Convert and save using TensorFlow.js converter
        try:
            tfjs.converters.save_keras_model(model, output_subfolder)
            conversion_results.append(f"Converted {file_to_convert} for {group_name} successfully.")
        except Exception as e:
            conversion_results.append(f"Error converting {file_to_convert} for {group_name}: {e}")

    # Display results
    messagebox.showinfo("Conversion Results", "\n".join(conversion_results))

# --- Build the UI ---
root = tk.Tk()
root.title("TensorFlow.js Model Converter")

# Section 1: Folder Selection
folder_frame = tk.LabelFrame(root, text="Folder Selection", padx=10, pady=10)
folder_frame.pack(fill="both", expand=True, padx=10, pady=5)

# Input folder selection
input_btn = tk.Button(folder_frame, text="Select Input Folder (.h5 Models)", command=select_input_folder)
input_btn.grid(row=0, column=0, padx=5, pady=5, sticky="w")
input_folder_label = tk.Label(folder_frame, text="No folder selected")
input_folder_label.grid(row=0, column=1, padx=5, pady=5, sticky="w")

# Output folder selection
output_btn = tk.Button(folder_frame, text="Select Output Folder", command=select_output_folder)
output_btn.grid(row=1, column=0, padx=5, pady=5, sticky="w")
output_folder_label = tk.Label(folder_frame, text="No folder selected")
output_folder_label.grid(row=1, column=1, padx=5, pady=5, sticky="w")

# Section 2: Conversion Options
options_frame = tk.LabelFrame(root, text="Conversion Options", padx=10, pady=10)
options_frame.pack(fill="both", expand=True, padx=10, pady=5)

# Dictionary to hold the radio variables per group
radio_vars = {}

# For each conversion group, create a row with a label and radio buttons.
for group in conversion_groups:
    group_frame = tk.Frame(options_frame)
    group_frame.pack(anchor="w", pady=5, fill="x")
    
    label = tk.Label(group_frame, text=group["group_label"] + ":")
    label.pack(side="left")
    
    var = tk.StringVar(value=group["default"])
    radio_vars[group["group_label"]] = var
    
    # Create a radio button for each option defined in the group.
    for option_text, _ in group["options"]:
        rb = tk.Radiobutton(group_frame, text=option_text, variable=var, value=option_text)
        rb.pack(side="left", padx=5)

# Convert button at the bottom
convert_btn = tk.Button(root, text="Convert", command=convert_models, bg="lightgreen")
convert_btn.pack(pady=10)

root.mainloop()
