// src/components/page/TrackingPage.tsx

/**
 * The tracking page is the control panel for using loaded and
 * trained models in VRC. It contains cards controlling where your tracking
 * data is sent as well as various options for smoothing or tuning the output.
 */
import React from 'react';
import LeftEyeStatusCard from '../card/LeftEyeStatusCard';
import RightEyeStatusCard from '../card/RightEyeStatusCard';
import EyeTrackingStatusCard from '../card/EyeTrackingStatusCard';
import KalmanFilterConfigCard from '../card/AdaptiveKalmanFilterConfigurationCard';
import TrackingDataCard from '../card/GazeDataCard';
import GazeConfigurationCard from '../card/GazeConfigurationCard';
import StartTrackingCard from '../card/StartTrackingCard';
import OpennessConfigurationCard from '../card/OpennessConfigurationCard';

const TrackingPage: React.FC = () => {

  return (
    <div className="page-container">
      <div className="grid grid-auto-fill-280 mb-1">
        <LeftEyeStatusCard />
        <RightEyeStatusCard />
        <EyeTrackingStatusCard />
      </div>

      <div className="mb-1">
        <OpennessConfigurationCard />
      </div>

      <div className="grid grid-auto-fit-280 mb-1">
        <GazeConfigurationCard />
        <TrackingDataCard />
      </div>

      <div className="grid grid-auto-fit-280 mb-1">
        <StartTrackingCard />
        <KalmanFilterConfigCard />
      </div>
    </div>
  );
};

export default TrackingPage;
