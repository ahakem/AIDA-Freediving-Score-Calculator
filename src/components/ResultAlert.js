import React from 'react';
import { Alert } from '@mui/material';

function ResultAlert({ score, penaltyCodes }) {
  if (penaltyCodes.length > 0) {
    return (
      <Alert severity="warning">
        Score: <strong>{Math.max(score, 0).toFixed(2)}</strong>. Penalties applied:{" "}
        {penaltyCodes.join(", ")} (Yellow Card)
      </Alert>
    );
  }

  if (score === 'DQ') {
    return <Alert severity="error">Disqualified (Red Card)</Alert>;
  }

  if (score !== null) {
    return (
      <Alert severity="success">
        Score: <strong>{Math.max(score, 0).toFixed(2)}</strong>. White Card
      </Alert>
    );
  }

  return null;
}

export default ResultAlert;