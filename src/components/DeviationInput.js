import React from 'react';
import { TextField } from '@mui/material';

function DeviationInput({ penalties, startDeviation, setStartDeviation, errors }) {
  if (!penalties.earlyStart && !penalties.lateStart) return null;

  const label = penalties.earlyStart 
    ? "Early Start Time (s)"
    : "Late Start Time (s)";

  return (
    <div style={{ padding: '0 16px' }}>
      <TextField
        label={label}
        type="tel"
        inputMode="numeric"
        value={startDeviation}
        onChange={(e) => setStartDeviation(e.target.value)}
        fullWidth
        margin="normal"
        error={!!errors.startDeviation}
        helperText={errors.startDeviation}
      />
    </div>
  );
}

export default DeviationInput;