import React, { useState, useEffect } from 'react';
import { Container, Box, Button, Typography, Alert } from '@mui/material';
import TabsComponent from './TabsComponent';
import ScoreInput from './ScoreInput';
import PenaltiesComponent from './PenaltiesComponent';
import DeviationInput from './DeviationInput';
import ResultAlert from './ResultAlert';
import { getPenaltyCodes } from '../utils/PenaltyUtils';

function PointsCalculator() {
  const [discipline, setDiscipline] = useState('Static');
  const [apMinutes, setApMinutes] = useState('00');
  const [apSeconds, setApSeconds] = useState('00');
  const [rpMinutes, setRpMinutes] = useState('00');
  const [rpSeconds, setRpSeconds] = useState('00');
  const [apDistance, setApDistance] = useState('');
  const [rpDistance, setRpDistance] = useState('');
  const [startDeviation, setStartDeviation] = useState('');
  const [penalties, setPenalties] = useState({
    earlyStart: false,
    lateStart: false,
    noTouchAtStart: false,
    pulling: 0,
    noTouchAtTurn: 0,
    missingTag: false,
    grabLine: 0,
    removeLanyard: false,
  });
  const [score, setScore] = useState(null);
  const [errors, setErrors] = useState({});
  const [detailedPenalties, setDetailedPenalties] = useState([]);
  const [showReminder, setShowReminder] = useState(false);

  const handleReset = () => {
    setApMinutes('00');
    setApSeconds('00');
    setRpMinutes('00');
    setRpSeconds('00');
    setApDistance('');
    setRpDistance('');
    setStartDeviation('');
    setPenalties({
      earlyStart: false,
      lateStart: false,
      noTouchAtStart: false,
      pulling: 0,
      noTouchAtTurn: 0,
      missingTag: false,
      grabLine: 0,
      removeLanyard: false,
    });
    setScore(null);
    setErrors({});
    setDetailedPenalties([]);
    setShowReminder(false);
  };

  const validateInputs = () => {
    const newErrors = {};
    if (discipline === 'Static') {
      if (!apMinutes) newErrors.apMinutes = 'AP minutes required';
      if (!apSeconds) newErrors.apSeconds = 'AP seconds required';
      if (!rpMinutes) newErrors.rpMinutes = 'RP minutes required';
      if (!rpSeconds) newErrors.rpSeconds = 'RP seconds required';
    } else if (discipline === 'Depth') {
      if (!apDistance) newErrors.apDistance = 'AP distance required';
      if (!rpDistance) newErrors.rpDistance = 'RP distance required';
      if (parseFloat(rpDistance) > parseFloat(apDistance)) {
        newErrors.rpDistance = 'RP cannot exceed AP';
      }
      if (parseFloat(rpDistance) < parseFloat(apDistance) && !penalties.missingTag) {
        setShowReminder(true);
      } else {
        setShowReminder(false);
      }
    } else {
      if (!apDistance) newErrors.apDistance = 'AP distance required';
      if (!rpDistance) newErrors.rpDistance = 'RP distance required';
    }

    if ((penalties.earlyStart || penalties.lateStart) && !startDeviation && discipline !== 'Depth') {
      const deviationLabel = penalties.earlyStart ? 'early start time' : 'late start time';
      newErrors.startDeviation = `${deviationLabel} is required`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateScore = () => {
    if (!validateInputs()) {
      setScore(null);
      return;
    }

    let totalPenalty = 0;
    const newDetailedPenalties = [];

    const calculateStartPenalty = (deviation) => Math.ceil(deviation / 5);

    if ((penalties.earlyStart || penalties.lateStart) && startDeviation) {
      const penaltyPoints = calculateStartPenalty(parseFloat(startDeviation));
      const startDescription = penalties.earlyStart ? 'Early Start Deviation' : 'Late Start Deviation';
      newDetailedPenalties.push(`${startDescription}: ${penaltyPoints} points`);
      totalPenalty += penaltyPoints;
    }

    let points = 0;

    // Logic for Static discipline
    if (discipline === 'Static') {
      const apTime = parseInt(apMinutes, 10) * 60 + parseInt(apSeconds, 10);
      const rpTime = parseInt(rpMinutes, 10) * 60 + parseInt(rpSeconds, 10);
      points = Math.floor((Math.floor(rpTime) * 0.2) * 5) / 5;

      if (rpTime < apTime) {
        const underAPPenalty = (apTime - rpTime) * 0.2;
        if (underAPPenalty > 0) {
          newDetailedPenalties.push(`UNDER AP: ${underAPPenalty.toFixed(1)} points`);
          totalPenalty += underAPPenalty;
        }
      }
    } else if (discipline === 'Dynamic') {
      const apNumber = parseFloat(apDistance);
      const rpNumber = Math.floor(parseFloat(rpDistance));
      points = Math.floor((rpNumber * 0.5) * 2) / 2;

      if (rpNumber < apNumber) {
        const underAPPenalty = (apNumber - rpNumber) * 0.5;
        if (underAPPenalty > 0) {
          newDetailedPenalties.push(`UNDER AP: ${underAPPenalty.toFixed(1)} points`);
          totalPenalty += underAPPenalty;
        }
      }
      if (penalties.noTouchAtStart) {
        newDetailedPenalties.push('No Body Part Touch at Start: 5 points');
        totalPenalty += 5;
      }
      if (penalties.pulling > 0) {
        newDetailedPenalties.push(`Illegal Propulsion Assistance x${penalties.pulling}: ${(penalties.pulling * 5).toFixed(1)} points`);
        totalPenalty += penalties.pulling * 5;
      }
      if (penalties.noTouchAtTurn > 0) {
        newDetailedPenalties.push(`No Touch at Turn x${penalties.noTouchAtTurn}: ${(penalties.noTouchAtTurn * 5).toFixed(1)} points`);
        totalPenalty += penalties.noTouchAtTurn * 5;
      }
    } else if (discipline === 'Depth') {
      const apNumber = parseFloat(apDistance);
      const rpNumber = Math.floor(parseFloat(rpDistance));
      points = rpNumber;

      if (penalties.missingTag) {
        newDetailedPenalties.push('Missing Tag: 1 point');
        totalPenalty += 1;
      }
      if (penalties.grabLine > 0) {
        newDetailedPenalties.push(`Grab of Line x${penalties.grabLine}: ${(penalties.grabLine * 5).toFixed(1)} points`);
        totalPenalty += penalties.grabLine * 5;
      }
      if (penalties.removeLanyard) {
        newDetailedPenalties.push('Removed Lanyard: 10 points');
        totalPenalty += 10;
      }
    }

    setDetailedPenalties(newDetailedPenalties);
    const finalScore = Math.max(points - totalPenalty, 0);
    setScore(finalScore);
  };

  useEffect(() => {
    calculateScore();
  }, [
    discipline, apMinutes, apSeconds, rpMinutes, rpSeconds,
    apDistance, rpDistance, startDeviation, penalties
  ]);

  return (
    <Container maxWidth="md" style={{ padding: 0 }}>
      <TabsComponent discipline={discipline} handleReset={handleReset} setDiscipline={setDiscipline} />

      {Object.keys(errors).length > 0 && (
        <Box marginTop={2} padding="0 16px">
          {Object.values(errors).map((error, index) =>
            <Alert key={index} severity="error" sx={{ m: 1 }}>{error}</Alert>
          )}
        </Box>
      )}

      {showReminder && (
        <Box marginTop={2} padding="0 16px">
          <Alert severity="warning" sx={{ m: 1 }}>
            Reminder: RP is less than AP. Consider selecting "No Tag".
          </Alert>
        </Box>
      )}

      {score !== null && Object.keys(errors).length === 0 && (
        <Box marginTop={3} padding="0 16px">
          <ResultAlert
            score={score}
            detailedPenalties={detailedPenalties}
            penaltyCodes={[
              ...getPenaltyCodes(
                penalties,
                startDeviation,
                discipline,
                rpMinutes,
                rpSeconds,
                apMinutes,
                apSeconds,
                rpDistance,
                apDistance
              )
            ]}
          />
        </Box>
      )}

      <ScoreInput
        discipline={discipline}
        apMinutes={apMinutes}
        apSeconds={apSeconds}
        rpMinutes={rpMinutes}
        rpSeconds={rpSeconds}
        apDistance={apDistance}
        rpDistance={rpDistance}
        setApMinutes={setApMinutes}
        setApSeconds={setApSeconds}
        setRpMinutes={setRpMinutes}
        setRpSeconds={setRpSeconds}
        setApDistance={setApDistance}
        setRpDistance={setRpDistance}
        errors={errors}
      />

      {(discipline !== 'Depth' || penalties.earlyStart) && (
        <DeviationInput
          penalties={penalties}
          startDeviation={startDeviation}
          setStartDeviation={setStartDeviation}
          errors={errors}
        />
      )}

      <PenaltiesComponent
        discipline={discipline}
        penalties={penalties}
        setPenalties={setPenalties}
      />

      <Box
        display="flex"
        justifyContent="space-between"
        padding="0 16px"
        marginTop={3}
      >
        <Button
          variant="contained"
          style={{ backgroundColor: '#0075bc', color: '#fff' }}
          onClick={handleReset}
        >
          Reset
        </Button>
      </Box>
    </Container>
  );
}

export default PointsCalculator;