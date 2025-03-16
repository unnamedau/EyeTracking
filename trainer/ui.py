#!/usr/bin/env python
import tkinter as tk
from tkinter import filedialog, messagebox
import sys
import os
import gc
import queue
import threading
import tensorflow as tf

# Import training modules
import train_combined_openness
import train_combined_pitchyaw
import train_left_openness
import train_left_pitchyaw
import train_right_openness
import train_right_pitchyaw
import train_combined_openness_gen_2
import train_combined_openness_gen_2_scalable
import train_left_openness_combined_distillation
import train_right_openness_combined_distillation
import train_left_openness_gen_2
import train_right_openness_gen_2

# Global task queue
task_queue = queue.Queue()

# Global variables for input and output paths
input_dataset = None
output_folder = None

def run_training(python_file, module, output_file, input_model=None):
    """
    Abstracted training call that:
      1. Sets system arguments (--db_path, --output_dir, and optionally --input_model_path)
      2. Calls the module's main() function
      3. Clears the TensorFlow session and collects garbage.
      
    :param python_file: Name of the training python file.
    :param module: The imported module that contains a main() function.
    :param output_file: Expected output file name (for logging purposes).
    :param input_model: Optional; if provided, a command line argument "--input_model_path"
                        will be added with this value.
    """
    print(f"\nRunning {python_file} to generate {output_file}...")
    # Backup the current sys.argv
    old_argv = sys.argv[:]
    
    # Base arguments
    sys.argv = [
        python_file,
        "--db_path", input_dataset,
        "--output_dir", output_folder
    ]
    
    # Optionally add the input_model argument
    if input_model is not None:
        sys.argv += ["--input_model_path", os.path.join(output_folder, input_model)]
    
    try:
        module.main()
    except SystemExit as e:
        # Catch sys.exit calls in the training module
        print(f"{python_file} exited with code: {e.code}")
    finally:
        # Clear TensorFlow session and force garbage collection
        tf.keras.backend.clear_session()
        gc.collect()
        print(f"Cleaned up resources after running {python_file}.")
        
    sys.argv = old_argv

def task_handler(task_name):
    print(f"Task '{task_name}' started.")
    # Map the task name to a (python_file, module, output_file) tuple
    if task_name == "Combined Gaze":
        run_training("train_combined_pitchyaw.py", train_combined_pitchyaw, "combined_pitchyaw.h5")
    elif task_name == "Left Gaze":
        run_training("train_left_pitchyaw.py", train_left_pitchyaw, "left_pitchyaw.h5")
    elif task_name == "Right Gaze":
        run_training("train_right_pitchyaw.py", train_right_pitchyaw, "right_pitchyaw.h5")
    elif task_name == "Combined Openness":
        run_training("train_combined_openness.py", train_combined_openness, "combined_openness.h5")
    elif task_name == "Left Openness":
        run_training("train_left_openness.py", train_left_openness, "left_openness.h5")
    elif task_name == "Right Openness":
        run_training("train_right_openness.py", train_right_openness, "right_openness.h5")
    elif task_name == "Combined Openness Gen 2":
        run_training("train_combined_openness_gen_2.py", train_combined_openness_gen_2, "combined_openness_gen2.h5", "combined_openness.h5")
    elif task_name == "Scalable Combined Openness Gen 2":
        run_training("train_combined_openness_gen_2_scalable.py", train_combined_openness_gen_2_scalable, "combined_openness_gen2.h5", "combined_openness.h5")
    elif task_name == "Left Openness Gen 2":
        run_training("train_left_openness_gen_2.py", train_left_openness_gen_2, "left_openness_gen_2.h5", "left_openness.h5")
    elif task_name == "Right Openness Gen 2":
        run_training("train_right_openness_gen_2.py", train_right_openness_gen_2, "right_openness_gen_2.h5", "right_openness.h5")
    elif task_name == "Left Openness / Combined Gen 2 Distillation":
        run_training("train_left_openness_combined_distillation.py", train_left_openness_combined_distillation, "left_openness_distilled.h5", "combined_openness.h5")
    elif task_name == "Right Openness / Combined Gen 2 Distillation":
        run_training("train_right_openness_combined_distillation.py", train_right_openness_combined_distillation, "right_openness_distilled.h5", "combined_openness.h5")
    else:
        print(f"No training function defined for '{task_name}'.")
    print(f"Task '{task_name}' finished.")

def process_tasks():
    """Process tasks from the global task queue in a background thread."""
    while not task_queue.empty():
        task = task_queue.get()
        task_handler(task)
    # Once done, re-enable the Start button on the main thread and notify the user.
    root.after(0, on_tasks_complete)

def on_tasks_complete():
    """Callback to be called when all tasks have been processed."""
    start_btn.config(state=tk.NORMAL)
    messagebox.showinfo("Task Queue", "All selected tasks have been queued and processed. See terminal output for details")

# Function to select the training database (.db file)
def select_input_file():
    global input_dataset
    file_path = filedialog.askopenfilename(
        title="Select Training Database (.db)",
        filetypes=[("SQLite DB Files", "*.db"), ("All files", "*.*")]
    )
    if file_path:
        input_dataset = file_path
        input_file_label.config(text=f"Selected: {file_path}")

# Function to select the output folder for trained models
def select_output_folder():
    global output_folder
    folder_path = filedialog.askdirectory(title="Select Output Folder")
    if folder_path:
        output_folder = folder_path
        output_folder_label.config(text=f"Selected: {folder_path}")

# Function called on clicking the Start button
def start_processing():
    # Disable the Start button to prevent multiple clicks.
    start_btn.config(state=tk.DISABLED)
    
    # Queue tasks for first generation models (Section 2)
    for key, var in section2_vars.items():
        if var.get():
            task_queue.put(key)
    # Queue tasks for second generation models (Section 3)
    for key, var in section3_vars.items():
        if var.get():
            task_queue.put(key)
    
    # Print selected configuration to console
    print("Input Database:", input_dataset)
    print("Output Folder:", output_folder)
    
    # Start processing tasks in a new thread
    threading.Thread(target=process_tasks, daemon=True).start()

# Create the main window
root = tk.Tk()
root.title("Machine Learning Training Options")

# -------------------
# Section 1: IO
# -------------------
io_frame = tk.LabelFrame(root, text="Section 1: IO", padx=10, pady=10)
io_frame.pack(fill="both", expand="yes", padx=10, pady=5)

# Input training database selection (.db file)
input_btn = tk.Button(io_frame, text="Select Training Database (.db)", command=select_input_file)
input_btn.grid(row=0, column=0, padx=5, pady=5, sticky="w")

input_file_label = tk.Label(io_frame, text="No file selected")
input_file_label.grid(row=0, column=1, padx=5, pady=5, sticky="w")

# Output folder selection
output_btn = tk.Button(io_frame, text="Select Output Folder", command=select_output_folder)
output_btn.grid(row=1, column=0, padx=5, pady=5, sticky="w")

output_folder_label = tk.Label(io_frame, text="No folder selected")
output_folder_label.grid(row=1, column=1, padx=5, pady=5, sticky="w")

# -------------------
# Section 2: First Generation Models
# -------------------
section2_frame = tk.LabelFrame(root, text="Section 2: Model Options", padx=10, pady=10)
section2_frame.pack(fill="both", expand="yes", padx=10, pady=5)

desc_label = tk.Label(section2_frame, text="Selecting options below corresponds to training a new machine learning model for each input checked:")
desc_label.pack(anchor="w")

# Checkboxes for Section 2 (defaulting to unchecked)
section2_options = [
    "Combined Gaze",
    "Combined Openness",
    "Left Gaze",
    "Left Openness",
    "Right Gaze",
    "Right Openness"
]

section2_vars = {}
for option in section2_options:
    var = tk.BooleanVar(value=False)
    cb = tk.Checkbutton(section2_frame, text=option, variable=var)
    cb.pack(anchor="w")
    section2_vars[option] = var

# -------------------
# Section 3: Second Generation Models
# -------------------
section3_frame = tk.LabelFrame(root, text="Section 3: Second Generation Models", padx=10, pady=10)
section3_frame.pack(fill="both", expand="yes", padx=10, pady=5)

desc2_label = tk.Label(section3_frame, text="These options train new models off the output of Section 2 models:")
desc2_label.pack(anchor="w")

# List of tuples: (Option Name, Description)
section3_options = [
    ("Combined Openness Gen 2", "Trains a second version of the combined openness model using the output of the first openness model to potentially improve the training dataset. Req Combined Openness selected or trained."),
    ("Scalable Combined Openness Gen 2", "Trains similarly to Combined Openness Gen 2 but is optimized for larger datasets at the cost of significantly slower performance. Req Combined Openness selected or trained. Proof of concept."),
    ("Left Openness / Combined Gen 2 Distillation", "Trains a second version of the left openness model using the output of the combined openness model to improve the training dataset. Req Combined Openness selected or trained. Best for winking."),
    ("Right Openness / Combined Gen 2 Distillation", "Trains a second version of the right openness model using the output of the combined openness model to improve the training dataset. Req Combined Openness selected or trained. Best for winking."),
    ("Left Openness Gen 2", "Trains a second version of the left openness model using the output of the first openness model to potentially improve the training dataset. Req Combined Openness selected or trained. Best for single eye tracking."),
    ("Right Openness Gen 2", "Trains a second version of the right openness model using the output of the first openness model to potentially improve the training dataset. Req Combined Openness selected or trained. Best for single eye tracking.")
]

section3_vars = {}
for option, desc in section3_options:
    frame = tk.Frame(section3_frame)
    frame.pack(fill="both", anchor="w", pady=2)
    var = tk.BooleanVar(value=False)
    cb = tk.Checkbutton(frame, text=option, variable=var)
    cb.pack(side="left")
    lbl = tk.Label(frame, text=desc, wraplength=400, justify="left")
    lbl.pack(side="left", padx=5)
    section3_vars[option] = var

# -------------------
# Section 4: Start Button
# -------------------
start_btn = tk.Button(root, text="Start", command=start_processing, bg="lightgreen")
start_btn.pack(pady=10)

root.mainloop()
