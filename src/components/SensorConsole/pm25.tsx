import React from 'react';
import locals from './pm25.scss';

enum PM25Level {
  Excellent = 'excellent',
  Good = 'good',
  LightlyPolluted = 'lightly-polluted',
  ModeratelyPolluted = 'moderately-polluted',
  HeavilyPolluted = 'heavily-polluted',
  SeverelyPolluted = 'severely-polluted',
}

export const FormattedPM25: React.FC<{ value?: number }> = ({ value }) => {
  if (value === undefined) {
    return <span>N/A</span>;
  }
  const level = getLevel(value);
  return (
    <span>
      <span>
        {value} &#x3BC;g/m<sup>3</sup>
      </span>
      <span className={locals[level]}> ({level.replace(/-/g, ' ')})</span>
    </span>
  );
};

const getLevel = (value: number) => {
  if (value <= 35) {
    return PM25Level.Excellent;
  } else if (value <= 75) {
    return PM25Level.Good;
  } else if (value <= 115) {
    return PM25Level.LightlyPolluted;
  } else if (value <= 150) {
    return PM25Level.ModeratelyPolluted;
  } else if (value <= 250) {
    return PM25Level.HeavilyPolluted;
  } else {
    return PM25Level.SeverelyPolluted;
  }
};
