import React from 'react';
import { TextField, Box } from '@mui/material';
import TimeInput from './TimeInput';

function ScoreInput({ 
  discipline, apMinutes, setApMinutes, apSeconds, setApSeconds, 
  rpMinutes, setRpMinutes, rpSeconds, setRpSeconds, 
  apDistance, setApDistance, rpDistance, setRpDistance, errors 
}) {
  return (
    <Box style={{ padding: '0 16px' }}>
      {discipline === 'Static' ? (
        <>
          <Box display="flex" gap="8px">
            <TimeInput
              label="AP Minutes"
              value={apMinutes}
              setValue={setApMinutes}
              max={13} // Limit minutes selection to 0-13
            />
            <TimeInput
              label="AP Seconds"
              value={apSeconds}
              setValue={setApSeconds}
              max={59} // Seconds limited to 0-59
            />
          </Box>
          <Box display="flex" gap="8px">
            <TimeInput
              label="RP Minutes"
              value={rpMinutes}
              setValue={setRpMinutes}
              max={13} // Limit minutes selection to 0-13
            />
            <TimeInput
              label="RP Seconds"
              value={rpSeconds}
              setValue={setRpSeconds}
              max={59}
            />
          </Box>
        </>
      ) : (
        <>
          <TextField
            label={`AP ${discipline === 'Depth' ? 'Depth' : 'Distance'} (m)`}
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
            label={`RP ${discipline === 'Depth' ? 'Depth' : 'Distance'} (m)`}
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
    </Box>
  );
}

export default ScoreInput;