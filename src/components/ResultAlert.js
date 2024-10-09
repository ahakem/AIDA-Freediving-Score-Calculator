import React from 'react';
import { Alert } from '@mui/material';

function ResultAlert({ score, penaltyCodes }) {
  if (penaltyCodes.includes('DQ LATE START') || penaltyCodes.some(code => code.startsWith('DQ'))) {
    // If disqualified, ensure red card regardless of score
    return (
      <Alert severity="error">
        Disqualified (Red Card): {penaltyCodes.join(", ")}
      </Alert>
    );
  }

  if (penaltyCodes.length > 0) {
    return (
      <Alert severity="warning">
        Score: <strong>{Math.max(score, 0).toFixed(2)}</strong>. Penalties applied:{" "}
        {penaltyCodes.join(", ")} (Yellow Card)
      </Alert>
    );
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