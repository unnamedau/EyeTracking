// src/components/misc/Tabs.tsx

/**
 * Tabs Component
 *
 * This component renders a tabbed interface where each tab displays its corresponding content.
 * The active tab index is managed via Redux, allowing for centralized state management across the application.
 * A settings button is included in the tab header to open a settings dialog.
 *
 * Structure:
 * - Tab Header: Renders a button for each tab along with a settings button.
 * - Tab Content: Displays the content corresponding to the currently active tab.
 * - Settings Dialog: A modal dialog that opens to display application settings.
 *
 * Props:
 * @param {Tab[]} tabs - An array of tab objects, each containing a label and content.
 */

import React, { useState, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store";
import { setActiveTabIndex } from "../../slices/configSlice";
import SettingsDialogWithContent from "./SettingsDialogWithContent";

interface Tab {
  /** The text label for the tab. */
  label: string;
  /** The content to display when the tab is active. */
  content: ReactNode;
}

interface TabsProps {
  /** An array of tab objects containing labels and content. */
  tabs: Tab[];
}

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // Retrieve the active tab index from the Redux store.
  const activeTabIndex = useSelector((state: RootState) => state.config.activeTabIndex);

  // Local state to control the visibility of the settings dialog.
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Update the active tab index in the Redux store when a tab is clicked.
  const handleTabClick = (index: number): void => {
    dispatch(setActiveTabIndex(index));
  };

  return (
    <div className="flex-col" style={{ height: "100%" }}>
      <div className="tab-header">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={
              activeTabIndex === index
                ? "active text-header text-header-color"
                : "text-header text-header-color"
            }
            onClick={() => handleTabClick(index)}
          >
            {tab.label}
          </button>
        ))}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="text-superbig text-header-color text-bold"
          style={{
            marginLeft: "auto",
            width: "70px",
            flex: "none",
            padding: "0px"
          }}
        >
          {t("Tabs.settings")}
        </button>
      </div>
      <div className="tab-content">
        {tabs[activeTabIndex]?.content}
      </div>
      <SettingsDialogWithContent
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

export default Tabs;
