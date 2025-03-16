// src/components/molecules/HeadsetTrackingMolecule.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';

interface ThetaData {
  status: string;
  theta1?: number;
  theta2?: number;
}

interface HeadsetTrackingMoleculeProps {
  theta: ThetaData;
}

/**
 * HeadsetTrackingMolecule component
 *
 * Displays the gauge with pitch and yaw values if tracking is online.
 * If tracking is offline, displays a "no data" message.
 *
 * @param {HeadsetTrackingMoleculeProps} props - The theta data from Redux.
 * @returns {JSX.Element} The rendered gauge or error message.
 */
const HeadsetTrackingMolecule: React.FC<HeadsetTrackingMoleculeProps> = ({ theta }) => {
  const { t } = useTranslation();

  // When tracking is offline, show error message.
  if (theta.status === 'offline') {
    return (
      <div className="text-huge text-standard-color text-mono text-center flex camera-sized flex-center">
        {t('HeadsetTrackingCard.noData')}
      </div>
    );
  }

  // Use provided theta values (fallback to 0 if undefined)
  const pitch = theta.theta1 ?? 0;
  const yaw = theta.theta2 ?? 0;

  const maxAngle = 45;
  const svgSize = 240;
  const center = svgSize / 2;
  const gaugeRadius = 100;

  // Compute dot position within the gauge
  const dotX = center + (yaw / maxAngle) * gaugeRadius;
  const dotY = center + (pitch / maxAngle) * gaugeRadius;

  return (
    <div className="text-normal text-standard-color camera-sized flex-center">
      <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
        {/* Outer circular gauge */}
        <circle
          cx={center}
          cy={center}
          r={gaugeRadius}
          stroke="#ccc"
          fill="none"
          strokeWidth="2"
        />
        {/* Crosshair lines */}
        <line
          x1={center}
          y1={center - gaugeRadius}
          x2={center}
          y2={center + gaugeRadius}
          stroke="#eee"
          strokeWidth="1"
        />
        <line
          x1={center - gaugeRadius}
          y1={center}
          x2={center + gaugeRadius}
          y2={center}
          stroke="#eee"
          strokeWidth="1"
        />
        {/* Dot indicating current pitch and yaw */}
        <circle cx={dotX} cy={dotY} r="6" fill="#00ff88" />
      </svg>
      <div className="text-mono text-normal text-center text-standard-color">
        <div>
          {t('HeadsetTrackingCard.pitchLabel')} {pitch.toFixed(2)}°
        </div>
        <div>
          {t('HeadsetTrackingCard.yawLabel')} {yaw.toFixed(2)}°
        </div>
      </div>
    </div>
  );
};

export default HeadsetTrackingMolecule;
