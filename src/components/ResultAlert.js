import React from 'react';
import { Alert } from '@mui/material';

function ResultAlert({ score, penaltyCodes = [], detailedPenalties = [] }) { // Default to empty arrays
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

  return (
    <Alert severity={penaltyCodes.length > 0 ? "warning" : "success"}>
      Score: <strong style={{ fontWeight: 'bold' }}>{Math.max(score, 0).toFixed(2)}</strong>
      {penaltyCodes.length > 0 && (
        <>
          Penalties applied:
          <ul>
            {detailedPenalties.map((detail, index) => (
              <li key={index} style={{ fontWeight: 'bold' }}>{detail}</li>
            ))}
          </ul>
          Total Penalty Points: <strong style={{ fontWeight: 'bold' }}>{totalPenaltyPoints.toFixed(2)}</strong>
        </>
      )}
    </Alert>
  );
}

export default ResultAlert;