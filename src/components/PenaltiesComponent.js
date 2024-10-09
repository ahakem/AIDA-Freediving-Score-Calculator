import React from 'react';
import { FormControlLabel, Checkbox, Typography, Box } from '@mui/material';

function PenaltiesComponent({ discipline, penalties, setPenalties }) {
  return (
    <Box marginTop={2} style={{ padding: '0 16px' }}>
      <Typography variant="h6">Penalties:</Typography>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={penalties.earlyStart}
              onChange={(e) => {
                const checked = e.target.checked;
                setPenalties((prev) => ({
                  ...prev,
                  earlyStart: checked,
                  lateStart: checked ? false : prev.lateStart, // Uncheck late start if early start is selected
                }));
              }}
            />
          }
          label="Started Before OT (EARLY START)"
        />
        {(discipline !== 'Depth') && (
          <FormControlLabel
            control={
              <Checkbox
                checked={penalties.lateStart}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setPenalties((prev) => ({
                    ...prev,
                    lateStart: checked,
                    earlyStart: checked ? false : prev.earlyStart, // Uncheck early start if late start is selected
                  }));
                }}
              />
            }
            label="Started After 10s Window (LATE START)"
          />
        )}
        {discipline === 'Dynamic' && (
          <>
            <FormControlLabel
              control={
                <Checkbox
                  checked={penalties.noTouchAtStart}
                  onChange={(e) =>
                    setPenalties((prev) => ({
                      ...prev,
                      noTouchAtStart: e.target.checked,
                    }))
                  }
                />
              }
              label="No Body Part Touch at Start (START)"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={penalties.pulling}
                  onChange={(e) =>
                    setPenalties((prev) => ({
                      ...prev,
                      pulling: e.target.checked,
                    }))
                  }
                />
              }
              label="Illegal Propulsion Assistance (PULL)"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={penalties.noTouchAtTurn}
                  onChange={(e) =>
                    setPenalties((prev) => ({
                      ...prev,
                      noTouchAtTurn: e.target.checked,
                    }))
                  }
                />
              }
              label="No Touch at Turn (TURN)"
            />
          </>
        )}
        {discipline === 'Depth' && (
          <>
            <FormControlLabel
              control={
                <Checkbox
                  checked={penalties.missingTag}
                  onChange={(e) =>
                    setPenalties((prev) => ({
                      ...prev,
                      missingTag: e.target.checked,
                    }))
                  }
                />
              }
              label="No Tag Delivered to Judges (TAG)"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={penalties.grabLine}
                  onChange={(e) =>
                    setPenalties((prev) => ({
                      ...prev,
                      grabLine: e.target.checked,
                    }))
                  }
                />
              }
              label="Grab of Line (GRAB)"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={penalties.removeLanyard}
                  onChange={(e) =>
                    setPenalties((prev) => ({
                      ...prev,
                      removeLanyard: e.target.checked,
                    }))
                  }
                />
              }
              label="Removed Lanyard (LANYARD)"
            />
          </>
        )}
      </div>
    </Box>
  );
}

export default PenaltiesComponent;