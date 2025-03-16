// src/components/page/StatusPage.tsx

/**
 * The status page contains cards for configuring and validating
 * the connection between the client and the physical hardware.
 * 
 * It allows you to set ports and ips, as well as view camera
 * feeds and the feed from the VRTA application if running.
 */

import React from "react";
import LeftEyeStatusCard from "../card/LeftEyeStatusCard";
import RightEyeStatusCard from "../card/RightEyeStatusCard";
import ThetaStatusCard from "../card/VRHeadsetTrackingCard";
import ConfigurationSection from "../card/ConfigurationCard";
import HeadsetTrackingCard from "../card/HeadsetTrackingCard";
import LeftEyeCameraCard from "../card/LeftEyeCameraCard";
import RightEyeCameraCard from "../card/RightEyeCameraCard";

const StatusPage: React.FC = () => {
  return (
    <div className="page-container">
      <div className="grid grid-auto-fill-280 mb-1">
        <LeftEyeStatusCard />
        <RightEyeStatusCard />
        <ThetaStatusCard />
      </div>
      <div className="grid grid-auto-fill-280 mb-1">
        <LeftEyeCameraCard />
        <RightEyeCameraCard />
        <HeadsetTrackingCard />
      </div>
      <div className="text-normal text-standard-color">
        <ConfigurationSection />
      </div>
    </div>
  );
};

export default StatusPage;
