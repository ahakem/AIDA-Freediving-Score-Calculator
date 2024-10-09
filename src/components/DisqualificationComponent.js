import React from 'react';
import { Box, Typography, Autocomplete, TextField } from '@mui/material';

function DisqualificationComponent({ discipline, disqualification, setDisqualification }) {
  const poolDisqualifications = [
    { label: 'Wearing Illegal Devices (Oximeter, etc)', code: 'DOOTHER' },
    { label: 'Blackout Detected', code: '0800' },
    { label: 'Supportive Touch', code: 'DQTOUCH' },
    { label: 'Illegal Flotation Device', code: 'DQOTHER' },
    { label: 'Performance Started > 30s After OT', code: 'DQ LATE START' },
    { label: 'Wrongly Executed Surface Protocol', code: 'DQSP' },
    { label: 'Airway Dip', code: 'DAIRWAYS' },
    { label: 'Coach Dived During Performance', code: 'DQOTHER' },
    { label: 'Monofin Style in Bi-fin Competition', code: 'DQOTHER' },
    { label: 'Airway >1.5m Submerged DYN-DNF', code: 'DQOTHER' },
    { label: 'Turned >1m from End Pool DYN-DNF', code: 'DOTHER' },
    { label: 'Surfacing in Wrong Zone', code: 'DQOTHER' },
    { label: 'Arm Recovery Above Water DYN-DNF', code: 'DQOTHER' },
  ];

  const depthDisqualifications = [
    { label: 'Wearing Illegal Devices (Oximeter, etc)', code: 'DQOTHER' },
    { label: 'Blackout Detected', code: 'DQBO' },
    { label: 'Supportive Touch', code: 'DOTOUCH' },
    { label: 'Illegal Flotation Device', code: 'DOTHER' },
    { label: 'Performance Started > 30s After OT', code: 'DQ LATE START' },
    { label: 'Wrongly Executed Surface Protocol', code: 'DQSP' },
    { label: 'Airway Dip', code: 'DQAIRWAYS' },
    { label: 'Coach Dived During Performance', code: 'DQOTHER' },
    { label: 'Event Disturbance', code: 'DQOTHER' },
    { label: 'Monofin Style in Bi-fin Competition', code: 'DQOTHER' },
    { label: 'Weight Under Suit Depth', code: 'DQOTHER' },
    { label: 'Removal of Weight CWT-CNF-FIM', code: 'DQOTHER' },
    { label: 'Recommencing Descent', code: 'DQOTHER' },
    { label: 'PULL Line CWT-CNF', code: 'DQPULL' },
  ];

  const disqualificationReasons = discipline === 'Depth' ? depthDisqualifications : poolDisqualifications;

  return (
    <Box marginTop={3} style={{ padding: '0 16px' }}>
      <Typography variant="h6" gutterBottom> {/* `gutterBottom` adds margin beneath */}
        Disqualification Reasons:
      </Typography>
      <Autocomplete
        value={disqualification ? disqualificationReasons.find(option => option.code === disqualification) : null}
        onChange={(event, newValue) => setDisqualification(newValue ? newValue.code : '')}
        options={disqualificationReasons}
        getOptionLabel={(option) => `${option.label} (${option.code})`}
        renderInput={(params) => <TextField {...params} label="Select a Reason" variant="outlined" />}
        isOptionEqualToValue={(option, value) => option.code === value.code}
        clearOnEscape
      />
    </Box>
  );
}

export default DisqualificationComponent;