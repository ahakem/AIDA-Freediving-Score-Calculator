import React from 'react';
import { Alert } from '@mui/material';

function ResultAlert({ score, penaltyCodes, detailedPenalties }) {
  // Safely calculate total penalty points with error handling
  const totalPenaltyPoints = detailedPenalties.reduce((total, detail) => {
    const match = detail.match(/:\s(-?\d+(\.\d+)?)\spoints/);

    if (match && match[1]) {
      const points = parseFloat(match[1]);
      return total + points;
    }
    return total;
  }, 0);

  if (penaltyCodes.includes('DQ LATE START') || penaltyCodes.some(code => code.startsWith('DQ'))) {
    return (
      <Alert severity="error">
        Disqualified (Red Card): {penaltyCodes.join(", ")}
      </Alert>
    );
  }

  if (penaltyCodes.length > 0) {
    return (
      <Alert severity="warning">
        Score: <strong style={{ fontWeight: 'bold' }}>{Math.max(score, 0).toFixed(2)}</strong>. Penalties applied:{" "}
        {penaltyCodes.join(", ")} (Yellow Card). 
        <ul>
          {detailedPenalties.map((detail, index) => (
            <li key={index} style={{ fontWeight: 'bold' }}>{detail}</li>
          ))}
        </ul>
        Total Penalty Points: <strong style={{ fontWeight: 'bold' }}>{totalPenaltyPoints.toFixed(2)}</strong>
      </Alert>
    );
  }

  if (score !== null) {
    return (
      <Alert severity="success">
        Score: <strong style={{ fontWeight: 'bold' }}>{Math.max(score, 0).toFixed(2)}</strong>. White Card
      </Alert>
    );
  }

  return null;
}

export default ResultAlert;