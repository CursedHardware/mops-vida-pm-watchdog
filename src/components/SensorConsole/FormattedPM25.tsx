import React from 'react';
import locals from './FormattedPM25.scss';

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

enum Level {
  Excellent = 'excellent',
  Good = 'good',
  LightlyPolluted = 'lightly-polluted',
  ModeratelyPolluted = 'moderately-polluted',
  HeavilyPolluted = 'heavily-polluted',
  SeverelyPolluted = 'severely-polluted',
}

const getLevel = (value: number) => {
  if (value <= 35) {
    return Level.Excellent;
  } else if (value <= 75) {
    return Level.Good;
  } else if (value <= 115) {
    return Level.LightlyPolluted;
  } else if (value <= 150) {
    return Level.ModeratelyPolluted;
  } else if (value <= 250) {
    return Level.HeavilyPolluted;
  } else {
    return Level.SeverelyPolluted;
  }
};
