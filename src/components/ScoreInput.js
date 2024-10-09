import React from 'react';
import { TextField } from '@mui/material';

function ScoreInput({ 
  discipline, apMinutes, setApMinutes, apSeconds, setApSeconds, 
  rpMinutes, setRpMinutes, rpSeconds, setRpSeconds, 
  apDistance, setApDistance, rpDistance, setRpDistance, errors 
}) {
  return (
    <div style={{ padding: '0 16px' }}>
      {discipline === 'Static' ? (
        <>
          <div style={{ display: 'flex', gap: '8px' }}>
            <TextField
              label="AP Min"
              type="tel"
              inputMode="numeric"
              value={apMinutes}
              onChange={(e) => setApMinutes(e.target.value)}
              fullWidth
              margin="normal"
              error={!!errors.apMinutes}
              helperText={errors.apMinutes}
            />
            <TextField
              label="AP Sec"
              type="tel"
              inputMode="numeric"
              value={apSeconds}
              onChange={(e) => setApSeconds(e.target.value)}
              fullWidth
              margin="normal"
              error={!!errors.apSeconds}
              helperText={errors.apSeconds}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <TextField
              label="RP Min"
              type="tel"
              inputMode="numeric"
              value={rpMinutes}
              onChange={(e) => setRpMinutes(e.target.value)}
              fullWidth
              margin="normal"
              error={!!errors.rpMinutes}
              helperText={errors.rpMinutes}
            />
            <TextField
              label="RP Sec"
              type="tel"
              inputMode="numeric"
              value={rpSeconds}
              onChange={(e) => setRpSeconds(e.target.value)}
              fullWidth
              margin="normal"
              error={!!errors.rpSeconds}
              helperText={errors.rpSeconds}
            />
          </div>
        </>
      ) : (
        <>
          <TextField
            label="AP Dist (m)"
            type="tel"
            inputMode="numeric"
            value={apDistance}
            onChange={(e) => setApDistance(e.target.value)}
            fullWidth
            margin="normal"
            error={!!errors.apDistance}
            helperText={errors.apDistance}
          />
          <TextField
            label="RP Dist (m)"
            type="tel"
            inputMode="numeric"
            value={rpDistance}
            onChange={(e) => setRpDistance(e.target.value)}
            fullWidth
            margin="normal"
            error={!!errors.rpDistance}
            helperText={errors.rpDistance}
          />
        </>
      )}
    </div>
  );
}

export default ScoreInput;