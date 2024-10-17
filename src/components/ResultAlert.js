import React from 'react';
import { Alert } from '@mui/material';

function ResultAlert({ score, penaltyCodes = [], detailedPenalties = [] }) {
  // Calculate total penalty points
  const totalPenaltyPoints = detailedPenalties.reduce((total, detail) => {
    const match = detail.match(/:\s(-?\d+(\.\d+)?)\spoints/);
    if (match && match[1]) {
      const points = parseFloat(match[1]);
      return total + points;
    }
    return total;
  }, 0);

  const isDisqualified = penaltyCodes.includes('DQ LATE START') || penaltyCodes.some(code => code.startsWith('DQ'));

  // Modify penalty code labels for clarity
  const formattedPenaltyCodes = penaltyCodes.map(code => {
    if (code === 'EARLY START') return 'early start';
    if (code === 'LATE START') return 'late start';
    return code;
  }).filter(code => !code.startsWith('DQ'));

  return (
    <Alert severity={isDisqualified ? "error" : (penaltyCodes.length > 0 ? "warning" : "success")}>
      {isDisqualified ? (
        <>
          Disqualified (Red Card): {penaltyCodes.join(", ")}
        </>
      ) : (
        <>
          Score: <strong style={{ fontWeight: 'bold' }}>{Math.max(score, 0).toFixed(2)}</strong>.
          {formattedPenaltyCodes.length > 0 && (
            <div>
              {" Penalty Codes: "}
              <span>[{formattedPenaltyCodes.join(", ")}]</span>
            </div>
          )}
          {detailedPenalties.length > 0 && (
            <>
              {" Penalties applied: "}
              <ul>
                {detailedPenalties.map((detail, index) => (
                  <li key={index} style={{ fontWeight: 'bold' }}>{detail}</li>
                ))}
              </ul>
              Total Penalty Points: <strong style={{ fontWeight: 'bold' }}>{totalPenaltyPoints.toFixed(1)}</strong>
            </>
          )}
        </>
      )}
    </Alert>
  );
}

export default ResultAlert;