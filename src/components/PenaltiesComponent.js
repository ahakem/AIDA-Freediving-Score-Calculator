import React from 'react';
import { FormControlLabel, Checkbox, Typography, Box, Button } from '@mui/material';

function PenaltiesComponent({ discipline, penalties, setPenalties }) {
  const handlePenaltyChange = (penaltyKey, increment = 1) => {
    setPenalties((prev) => ({
      ...prev,
      [penaltyKey]: Math.max(0, (prev[penaltyKey] || 0) + increment),
    }));
  };

  return (
    <Box marginTop={2} style={{ padding: '0 16px' }}>
      <Typography variant="h6">Penalties:</Typography>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={penalties.earlyStart}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setPenalties((prev) => ({
                    ...prev,
                    earlyStart: checked,
                    lateStart: checked ? false : prev.lateStart,
                  }));
                }}
              />
            }
            label="Started Before OT (EARLY START)"
          />
        </div>
        {(discipline !== 'Depth') && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={penalties.lateStart}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setPenalties((prev) => ({
                      ...prev,
                      lateStart: checked,
                      earlyStart: checked ? false : prev.earlyStart,
                    }));
                  }}
                />
              }
              label="Started After 10s Window (LATE START)"
            />
          </div>
        )}
        {discipline === 'Dynamic' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center' }}>
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
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={penalties.pulling > 0}
                    onChange={(e) =>
                      handlePenaltyChange('pulling', e.target.checked ? 1 : -penalties.pulling)
                    }
                  />
                }
                label={`Illegal Propulsion Assistance${penalties.pulling ? ` x${penalties.pulling}` : ''}`}
              />
              {penalties.pulling > 0 && (
                <div style={{ display: 'flex', gap: '5px', marginLeft: '5px' }}>
                  <Button variant="outlined" size="small" onClick={() => handlePenaltyChange('pulling', 1)}>+</Button>
                  <Button variant="outlined" size="small" onClick={() => handlePenaltyChange('pulling', -1)}>-</Button>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={penalties.noTouchAtTurn > 0}
                    onChange={(e) =>
                      handlePenaltyChange('noTouchAtTurn', e.target.checked ? 1 : -penalties.noTouchAtTurn)
                    }
                  />
                }
                label={`No Touch at Turn${penalties.noTouchAtTurn ? ` x${penalties.noTouchAtTurn}` : ''}`}
              />
              {penalties.noTouchAtTurn > 0 && (
                <div style={{ display: 'flex', gap: '5px', marginLeft: '5px' }}>
                  <Button variant="outlined" size="small" onClick={() => handlePenaltyChange('noTouchAtTurn', 1)}>+</Button>
                  <Button variant="outlined" size="small" onClick={() => handlePenaltyChange('noTouchAtTurn', -1)}>-</Button>
                </div>
              )}
            </div>
          </>
        )}
        {discipline === 'Depth' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center' }}>
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
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={penalties.grabLine > 0}
                    onChange={(e) =>
                      handlePenaltyChange('grabLine', e.target.checked ? 1 : -penalties.grabLine)
                    }
                  />
                }
                label={`Grab of Line${penalties.grabLine ? ` x${penalties.grabLine}` : ''}`}
              />
              {penalties.grabLine > 0 && (
                <div style={{ display: 'flex', gap: '5px', marginLeft: '5px' }}>
                  <Button variant="outlined" size="small" onClick={() => handlePenaltyChange('grabLine', 1)}>+</Button>
                  <Button variant="outlined" size="small" onClick={() => handlePenaltyChange('grabLine', -1)}>-</Button>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
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
            </div>
          </>
        )}
      </div>
    </Box>
  );
}

export default PenaltiesComponent;