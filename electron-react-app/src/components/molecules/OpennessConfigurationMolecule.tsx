// src/components/molecules/OpennessConfigurationMolecule.tsx

/**
 * This slider uses rc-slider so it has 4 handles on it. Also since it transforms into 2 sliders
 * when you switch to independent openness, it is sensitive to css changes.
 */
import React from 'react';
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../store';
import { setOpennessSliderHandles } from '../../slices/configSlice';

const defaultSliderValues: [number, number, number, number] = [0.25, 0.35, 0.65, 0.8];

const OpennessConfigurationMolecule: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const opennessSliderHandles = useSelector(
    (state: RootState) => state.config.opennessSliderHandles
  ) || defaultSliderValues;

  // Determine if we are in independent openness mode.
  const independentOpenness = useSelector(
    (state: RootState) => state.config.independentOpenness
  );

  // Tracking values from status slice.
  const trackingOpenness = useSelector(
    (state: RootState) => state.status.tracking.openness
  ) || 0;
  const trackingLeftOpenness = useSelector(
    (state: RootState) => state.status.tracking.leftOpenness
  ) || 0;
  const trackingRightOpenness = useSelector(
    (state: RootState) => state.status.tracking.rightOpenness
  ) || 0;

  // Retrieve the online status for both eyes from the status slice.
  const leftEyeStatus = useSelector(
    (state: RootState) => state.status.imageData.leftEye.status
  );
  const rightEyeStatus = useSelector(
    (state: RootState) => state.status.imageData.rightEye.status
  );

  // dualBar is true when independentOpenness is true and both eyes are online.
  const dualBar = independentOpenness && leftEyeStatus === 'online' && rightEyeStatus === 'online';

  // Compute singleBarValue based on conditions.
  let singleBarValue = 0;
  if (!independentOpenness) {
    if (leftEyeStatus === 'online' && rightEyeStatus === 'online') {
      singleBarValue = trackingOpenness;
    }
    if (leftEyeStatus === 'online' && rightEyeStatus !== 'online') {
      singleBarValue = trackingLeftOpenness;
    }
    if (leftEyeStatus !== 'online' && rightEyeStatus === 'online') {
      singleBarValue = trackingRightOpenness;      
    }
  } else if (leftEyeStatus === 'online' && rightEyeStatus !== 'online') {
    singleBarValue = trackingLeftOpenness;
  } else if (rightEyeStatus === 'online' && leftEyeStatus !== 'online') {
    singleBarValue = trackingRightOpenness;
  } else {
    singleBarValue = 0;
  }

  // These always reflect the left/right openness.
  const topBarValue = trackingLeftOpenness;
  const bottomBarValue = trackingRightOpenness;

  const sliderValues: [number, number, number, number] = opennessSliderHandles ?? defaultSliderValues;

  const handleSliderChange = (values: number[]) => {
    if (values.length === 4) {
      dispatch(setOpennessSliderHandles(values as [number, number, number, number]));
    }
  };

  return (
    <div className="openness-slider-wrapper">
      {/* Custom rail(s) */}
      {dualBar ? (
        <>
          {/* Top rail: tracks leftOpenness */}
          <div className="openness-custom-rail-top">
            <div
              className="slider-fill"
              style={{ width: `${topBarValue * 100}%` }}
            />
          </div>
          {/* Bottom rail: tracks rightOpenness */}
          <div className="openness-custom-rail-bottom">
            <div
              className="slider-fill"
              style={{ width: `${bottomBarValue * 100}%` }}
            />
          </div>
        </>
      ) : (
        // Single rail mode.
        <div className="openness-custom-rail">
          <div
            className="slider-fill"
            style={{ width: `${singleBarValue * 100}%` }}
          />
        </div>
      )}

      {/* Range slider with transparent built-in rail/track */}
      <Range
        min={0}
        max={1}
        step={0.01}
        value={sliderValues}
        allowCross={false}
        onChange={handleSliderChange}
        className="openness-range-slider mb-1"
      />

      {/* Labels */}
      <div className="openness-label-container text-small">
        <span>
          {t('OpennessConfigurationCard.fullyClosedLabel', { max: sliderValues[0].toFixed(2) })}
        </span>
        <span>
          {t('OpennessConfigurationCard.neutralLabel', {
            min: sliderValues[1].toFixed(2),
            max: sliderValues[2].toFixed(2),
          })}
        </span>
        <span>
          {t('OpennessConfigurationCard.wideLabel', { min: sliderValues[3].toFixed(2) })}
        </span>
      </div>
    </div>
  );
};

export default OpennessConfigurationMolecule;
