// src/App.tsx

/**
 * Main Application Component
 *
 * This component serves as the root of the application and sets up a tabbed user interface
 * for navigation between various pages.
 */
import React from "react";
import { useTranslation } from "react-i18next";
import Tabs from "./components/misc/Tabs";
import StatusPage from "./components/page/StatusPage";
import DatabasePage from "./components/page/DatabasePage";
import TrackingPage from "./components/page/TrackingPage";
import "./i18n";

const App: React.FC = () => {
  const { t } = useTranslation();

  // Define navigation tabs with labels and corresponding page components.
  const tabs = [
    {
      label: t("App.tabStatus"),
      content: <StatusPage />
    },
    {
      label: t("App.tabDatabase"),
      content: <DatabasePage />
    },
    {
      label: t("App.tabTracking"),
      content: <TrackingPage />
    }
  ];

  return (
    <div className="text-font-normal application-background-color">
      <Tabs tabs={tabs} />
    </div>
  );
};

export default App;
