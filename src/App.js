import React, { useState, useEffect } from 'react';
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
  Link,
  RadioGroup,
  Radio,
  FormControl,
  Alert
} from '@mui/material';

function App() {
  const [discipline, setDiscipline] = useState('Static');
  const [apMinutes, setApMinutes] = useState('');
  const [apSeconds, setApSeconds] = useState('');
  const [rpMinutes, setRpMinutes] = useState('');
  const [rpSeconds, setRpSeconds] = useState('');
  const [apDistance, setApDistance] = useState('');
  const [rpDistance, setRpDistance] = useState('');
  const [startDeviation, setStartDeviation] = useState('');
  const [startDeviationType, setStartDeviationType] = useState('none');
  const [poolPenalties, setPoolPenalties] = useState({
    noTouch: false,
    pulling: false,
  });
  const [depthPenalties, setDepthPenalties] = useState({
    missingTag: false,
    grabLine: false,
    removeLanyard: false,
  });
  const [score, setScore] = useState(null);
  const [errors, setErrors] = useState({});

  const handleReset = () => {
    setApMinutes('');
    setApSeconds('');
    setRpMinutes('');
    setRpSeconds('');
    setApDistance('');
    setRpDistance('');
    setStartDeviation('');
    setStartDeviationType('none');
    setPoolPenalties({
      noTouch: false,
      pulling: false,
    });
    setDepthPenalties({
      missingTag: false,
      grabLine: false,
      removeLanyard: false,
    });
    setScore(null);
    setErrors({});
  };

  const validateInputs = () => {
    const newErrors = {};

    if (discipline === 'Static') {
      if (!apMinutes) newErrors.apMinutes = 'AP minutes required';
      if (!apSeconds) newErrors.apSeconds = 'AP seconds required';
      if (!rpMinutes) newErrors.rpMinutes = 'RP minutes required';
      if (!rpSeconds) newErrors.rpSeconds = 'RP seconds required';
    } else {
      if (!apDistance) newErrors.apDistance = 'AP distance required';
      if (!rpDistance) newErrors.rpDistance = 'RP distance required';
    }

    if (startDeviationType !== 'none' && !startDeviation) newErrors.startDeviation = 'Deviation is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateStartPenalty = () => {
    let penalty = 0;
    let deviation = parseFloat(startDeviation) || 0;

    if (startDeviationType === 'early') {
      if (deviation > 0 && deviation <= 5) {
        penalty = 1;
      } else if (deviation > 5 && deviation <= 10) {
        penalty = 2;
      }
    } else if (startDeviationType === 'late') {
      if (discipline !== 'Depth') {
        if (deviation > 10 && deviation <= 15) {
          penalty = 1;
        } else if (deviation > 15 && deviation <= 20) {
          penalty = 2;
        } else if (deviation > 20 && deviation <= 25) {
          penalty = 3;
        } else if (deviation > 25 && deviation < 30) {
          penalty = 4;
        } else if (deviation >= 30) {
          return 'disqualified';
        }
      } else {
        if (deviation > 30) {
          penalty = 1;
        }
      }
    }
    return penalty;
  };

  const calculateScore = () => {
    if (!validateInputs()) return;

    const startPenalty = calculateStartPenalty();

    if (startPenalty === 'disqualified') {
      setScore('DQ');
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
      if (poolPenalties.noTouch) penalty += 5;
      if (poolPenalties.pulling) penalty += 5;
    } else if (discipline === 'Depth') {
      const apNumber = parseFloat(apDistance);
      const rpNumber = Math.floor(parseFloat(rpDistance));
      points = rpNumber;
      if (rpNumber < apNumber) {
        penalty += apNumber - rpNumber;
      }
      if (depthPenalties.missingTag) penalty += 1;
      if (depthPenalties.grabLine) penalty += 5;
      if (depthPenalties.removeLanyard) penalty += 10;
    }

    const finalScore = Math.max(points - penalty, 0);
    setScore(finalScore);
  };

  // Recalculate score on input change
  useEffect(() => {
    calculateScore();
  }, [
    discipline,
    apMinutes,
    apSeconds,
    rpMinutes,
    rpSeconds,
    apDistance,
    rpDistance,
    startDeviation,
    startDeviationType,
    poolPenalties,
    depthPenalties,
  ]);

  // Clear penalties when discipline changes
  useEffect(() => {
    handleReset();
  }, [discipline]);

  const handlePenaltyChange = (update, type) => {
    if(type === 'pool') {
      setPoolPenalties({ ...poolPenalties, ...update });
    } else if(type === 'depth') {
      setDepthPenalties({ ...depthPenalties, ...update });
    }
  };

  const getResultAlert = () => {
    if (score === 'DQ') {
      return <Alert severity="error">Disqualified (Red Card)</Alert>;
    }

    if (score !== null) {
      const hasPenalties = 
          poolPenalties.noTouch || 
          poolPenalties.pulling || 
          depthPenalties.missingTag || 
          depthPenalties.grabLine || 
          depthPenalties.removeLanyard || 
          startDeviationType === 'early' || 
          startDeviationType === 'late';

      if (score === 0 || score === 'DQ') {
        return <Alert severity="error">Disqualified (Red Card)</Alert>;
      } else if (hasPenalties) {
        return <Alert severity="warning">Score: {score.toFixed(2)}. Penalties applied (Yellow Card)</Alert>;
      } else {
        return <Alert severity="success">Score: {score.toFixed(2)}. White Card</Alert>;
      }
    }
    return null;
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
        </div>
      )}

      {discipline !== 'Static' && (
        <div style={{ padding: '0 16px' }}>
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
        </div>
      )}

      <div style={{ padding: '0 16px' }}>
        <FormControl component="fieldset">
          <RadioGroup
            row
            value={startDeviationType}
            onChange={(e) => {
              setStartDeviationType(e.target.value);
              setStartDeviation('');
            }}
          >
            <FormControlLabel value="none" control={<Radio />} label="Dove in the Correct Window" />
            <FormControlLabel value="early" control={<Radio />} label="Early Start" />
            <FormControlLabel value="late" control={<Radio />} label="Late Start" />
          </RadioGroup>
        </FormControl>

        {startDeviationType !== 'none' && (
          <TextField
            label="Deviation (s)"
            type="tel"
            inputMode="numeric"
            value={startDeviation}
            onChange={(e) => setStartDeviation(e.target.value)}
            fullWidth
            margin="normal"
            error={!!errors.startDeviation}
            helperText={errors.startDeviation}
          />
        )}
      </div>

      {discipline === 'Dynamic' && (
        <Box marginTop={2} style={{ padding: '0 16px' }}>
          <Typography variant="h6">Penalties:</Typography>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={poolPenalties.noTouch}
                  onChange={(e) => handlePenaltyChange({noTouch: e.target.checked}, 'pool')}
                  name="noTouch"
                />
              }
              label="No Touch Start/Turn"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={poolPenalties.pulling}
                  onChange={(e) => handlePenaltyChange({pulling: e.target.checked}, 'pool')}
                  name="pulling"
                />
              }
              label="Pulling"
            />
          </div>
        </Box>
      )}

      {discipline === 'Depth' && (
        <Box marginTop={2} style={{ padding: '0 16px' }}>
          <Typography variant="h6">Penalties:</Typography>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={depthPenalties.missingTag}
                  onChange={(e) => handlePenaltyChange({missingTag: e.target.checked}, 'depth')}
                  name="missingTag"
                />
              }
              label="Missing Tag"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={depthPenalties.grabLine}
                  onChange={(e) => handlePenaltyChange({grabLine: e.target.checked}, 'depth')}
                  name="grabLine"
                />
              }
              label="Grab Line"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={depthPenalties.removeLanyard}
                  onChange={(e) => handlePenaltyChange({removeLanyard: e.target.checked}, 'depth')}
                  name="removeLanyard"
                />
              }
              label="Remove Lanyard"
            />
          </div>
        </Box>
      )}

      <Box display="flex" justifyContent="space-between" padding="0 16px" marginTop={3}>
        <Button
          variant="contained"
          style={{ backgroundColor: '#0075bc', color: '#fff' }}
          onClick={handleReset}
        >
          Reset
        </Button>
      </Box>

      <Box marginTop={3} padding="0 16px">
        {getResultAlert()}
      </Box>

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