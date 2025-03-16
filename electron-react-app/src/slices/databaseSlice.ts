// src/slices/databaseSlice.ts

/**
 * Database Slice
 *
 * This Redux slice manages the state related to the application's database.
 * It handles the selected database file path, tracks whether the file exists,
 * controls the visibility of a dialog (e.g., for file selection), and maintains
 * the count of entries in the database.
 *
 * Additionally, an asynchronous thunk is provided to create a new SQLite database file
 * using the Electron API.
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface DatabaseState {
  selectedDb: string;
  fileExists: boolean;
  showDialog: boolean;
  entryCount: number | null;
}

// Initial state with default values.
export const initialState: DatabaseState = {
  selectedDb: "",
  fileExists: false,
  showDialog: false,
  entryCount: null,
};

/**
 * Asynchronous thunk to create a new SQLite database file.
 *
 * This thunk takes a full file path as an argument and uses the Electron API to
 * create the database file. Once completed, it returns the file path.
 */
export const createDatabaseAsync = createAsyncThunk<
  string, // Return type: file path string
  string, // Argument type: full file path
  {}
>(
  'database/createDatabase',
  async (filePath: string) => {
    await window.electronAPI.createDatabaseFile(filePath);
    return filePath;
  }
);

/**
 * The database slice defines reducers and actions to manage database-related state.
 *
 * It includes reducers for setting the selected database, toggling flags, and updating the entry count.
 * The extraReducers handle the fulfilled case of the createDatabaseAsync thunk.
 */
const databaseSlice = createSlice({
  name: 'database',
  initialState,
  reducers: {
    setSelectedDatabase(state, action: PayloadAction<string>) {
      state.selectedDb = action.payload;
    },
    deleteDatabase(state) {
      state.selectedDb = "";
    },
    setFileExists(state, action: PayloadAction<boolean>) {
      state.fileExists = action.payload;
    },
    setShowDialog(state, action: PayloadAction<boolean>) {
      state.showDialog = action.payload;
    },
    setEntryCount(state, action: PayloadAction<number | null>) {
      state.entryCount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createDatabaseAsync.fulfilled, (state, action) => {
      // On successful creation of the database, update the selectedDb state.
      state.selectedDb = action.payload;
    });
  },
});

// Export actions for use in components.
export const {
  setSelectedDatabase,
  deleteDatabase,
  setFileExists,
  setShowDialog,
  setEntryCount,
} = databaseSlice.actions;

export default databaseSlice.reducer;
