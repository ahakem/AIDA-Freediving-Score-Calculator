import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Container,
  FormControlLabel,
  Checkbox,
  Box,
  Tabs,
  Tab,
  AppBar,
  Toolbar,
  Link,
} from '@mui/material';

function App() {
  const [discipline, setDiscipline] = useState('Static');
  const [apMinutes, setApMinutes] = useState('');
  const [apSeconds, setApSeconds] = useState('');
  const [rpMinutes, setRpMinutes] = useState('');
  const [rpSeconds, setRpSeconds] = useState('');
  const [apDistance, setApDistance] = useState('');
  const [rpDistance, setRpDistance] = useState('');
  const [startDeviation, setStartDeviation] = useState(0);
  const [penalties, setPenalties] = useState({
    missingTag: false,
    noTouch: false,
    pulling: false,
    grabLine: false,
    removeLanyard: false,
  });
  const [score, setScore] = useState(null);

  const handleReset = () => {
    setDiscipline('Static');
    setApMinutes('');
    setApSeconds('');
    setRpMinutes('');
    setRpSeconds('');
    setApDistance('');
    setRpDistance('');
    setStartDeviation(0);
    setPenalties({
      missingTag: false,
      noTouch: false,
      pulling: false,
      grabLine: false,
      removeLanyard: false,
    });
    setScore(null);
  };

  const calculateStartPenalty = () => {
    let penalty = 0;
    const deviation = parseInt(startDeviation, 10);

    if (deviation < 0) {
      if (deviation >= -10 && deviation <= -6) {
        penalty = 2;
      } else if (deviation >= -5 && deviation <= -1) {
        penalty = 1;
      }
    } else if (deviation >= 0) {
      if (discipline !== 'Depth') {
        if (deviation >= 10 && deviation < 15) {
          penalty = 1;
        } else if (deviation >= 15 && deviation < 20) {
          penalty = 2;
        } else if (deviation >= 20 && deviation < 25) {
          penalty = 3;
        } else if (deviation >= 25 && deviation < 30) {
          penalty = 4;
        } else if (deviation >= 30) {
          return 'disqualified';
        }
      } else {
        if (deviation >= 30) {
          return 'disqualified';
        }
      }
    }

    return penalty;
  };

  const calculateScore = () => {
    const startPenalty = calculateStartPenalty();

    if (startPenalty === 'disqualified') {
      setScore(0);
      return;
    }

    let points = 0;
    let penalty = startPenalty;

    if (discipline === 'Static') {
      const apTime = parseInt(apMinutes, 10) * 60 + parseInt(apSeconds, 10);
      const rpTime = parseInt(rpMinutes, 10) * 60 + parseInt(rpSeconds, 10);
      const roundedRPTime = Math.floor(rpTime);
      points = Math.floor((roundedRPTime * 0.2) * 5) / 5;
      if (rpTime < apTime) {
        penalty += (apTime - rpTime) * 0.2;
      }
    } else if (discipline === 'Dynamic') {
      const apNumber = parseFloat(apDistance);
      const rpNumber = Math.floor(parseFloat(rpDistance));
      points = Math.floor((rpNumber * 0.5) * 2) / 2;
      if (rpNumber < apNumber) {
        penalty += (apNumber - rpNumber) * 0.5;
      }
      if (penalties.noTouch) penalty += 5;
      if (penalties.pulling) penalty += 5;
    } else if (discipline === 'Depth') {
      const apNumber = parseFloat(apDistance);
      const rpNumber = Math.floor(parseFloat(rpDistance));
      points = rpNumber;
      if (rpNumber < apNumber) {
        penalty += apNumber - rpNumber;
      }
      if (penalties.missingTag) penalty += 1;
      if (penalties.grabLine) penalty += 5;
      if (penalties.removeLanyard) penalty += 10;
    }

    const finalScore = Math.max(points - penalty, 0);
    setScore(finalScore);
  };

  const handlePenaltyChange = (event) => {
    setPenalties({ ...penalties, [event.target.name]: event.target.checked });
  };

  return (
    <Container maxWidth="md" style={{ padding: 0 }}>
      <Tabs
        value={discipline}
        onChange={(e, value) => setDiscipline(value)}
        indicatorColor="primary"
        textColor="primary"
        centered
        style={{ marginBottom: '16px', marginTop: '16px' }}
      >
        <Tab label="STA" value="Static" />
        <Tab label="Pool" value="Dynamic" />
        <Tab label="Depth" value="Depth" />
      </Tabs>

      {discipline === 'Static' && (
        <div style={{ padding: '0 16px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <TextField
              label="AP Min"
              type="number"
              inputMode="numeric"
              value={apMinutes}
              onChange={(e) => setApMinutes(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="AP Sec"
              type="number"
              inputMode="numeric"
              value={apSeconds}
              onChange={(e) => setApSeconds(e.target.value)}
              fullWidth
              margin="normal"
            />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <TextField
              label="RP Min"
              type="number"
              inputMode="numeric"
              value={rpMinutes}
              onChange={(e) => setRpMinutes(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="RP Sec"
              type="number"
              inputMode="numeric"
              value={rpSeconds}
              onChange={(e) => setRpSeconds(e.target.value)}
              fullWidth
              margin="normal"
            />
          </div>
        </div>
      )}

      {discipline !== 'Static' && (
        <div style={{ padding: '0 16px' }}>
          <TextField
            label="AP Dist (m)"
            type="number"
            inputMode="numeric"
            value={apDistance}
            onChange={(e) => setApDistance(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="RP Dist (m)"
            type="number"
            inputMode="numeric"
            value={rpDistance}
            onChange={(e) => setRpDistance(e.target.value)}
            fullWidth
            margin="normal"
          />
        </div>
      )}

      <div style={{ padding: '0 16px' }}>
        <TextField
          label="Deviation (s)"
          type="number"
          inputMode="numeric"
          value={startDeviation}
          onChange={(e) => setStartDeviation(e.target.value)}
          fullWidth
          margin="normal"
          helperText="Negative for early start, positive for late start"
        />
      </div>

      {(discipline === 'Dynamic' || discipline === 'Depth') && (
        <Box marginTop={2} style={{ padding: '0 16px' }}>
          <Typography variant="h6">Penalties:</Typography>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {discipline === 'Depth' && (
              <>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={penalties.missingTag}
                      onChange={handlePenaltyChange}
                      name="missingTag"
                    />
                  }
                  label="Missing Tag"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={penalties.removeLanyard}
                      onChange={handlePenaltyChange}
                      name="removeLanyard"
                    />
                  }
                  label="Remove Lanyard"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={penalties.grabLine}
                      onChange={handlePenaltyChange}
                      name="grabLine"
                    />
                  }
                  label="Grab Line"
                />
              </>
            )}
            {discipline === 'Dynamic' && (
              <>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={penalties.noTouch}
                      onChange={handlePenaltyChange}
                      name="noTouch"
                    />
                  }
                  label="No Touch Start/Turn"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={penalties.pulling}
                      onChange={handlePenaltyChange}
                      name="pulling"
                    />
                  }
                  label="Pulling"
                />
              </>
            )}
          </div>
        </Box>
      )}

      <Box display="flex" justifyContent="space-between" padding="0 16px" marginTop={3}>
        <Button
          variant="contained"
          style={{ backgroundColor: '#0075bc', color: '#fff' }}
          onClick={calculateScore}
        >
          Calculate Score
        </Button>
        <Button
          variant="outlined"
          style={{ color: '#0075bc', borderColor: '#0075bc' }}
          onClick={handleReset}
        >
          Reset
        </Button>
      </Box>

      {score !== null && (
        <Typography variant="h6" align="center" gutterBottom>
          Calculated Score: {score > 0 ? score.toFixed(2) : 'Disqualified'}
        </Typography>
      )}

      <Box marginTop={5} padding={2} textAlign="center" borderTop="1px solid #ccc">
        <Typography variant="body2" color="textSecondary">
          © {new Date().getFullYear()} Ahmed (Hakim) Elkholy |{' '}
          <Link
            href="https://www.instagram.com/hakim_elkholy/"
            target="_blank"
            rel="noopener noreferrer"
            color="inherit"
            style={{ textDecoration: 'none' }}
          >
            Instagram
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}

export default App;