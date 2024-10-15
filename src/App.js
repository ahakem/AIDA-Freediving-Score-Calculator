import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, Link } from '@mui/material';
import TabsComponent from './components/TabsComponent';
import ScoreInput from './components/ScoreInput';
import PenaltiesComponent from './components/PenaltiesComponent';
import DeviationInput from './components/DeviationInput';
import ResultAlert from './components/ResultAlert';
import { calculateStartPenalty, getPenaltyCodes } from './utils/PenaltyUtils';

function App() {
  const [discipline, setDiscipline] = useState('Static');
  const [apMinutes, setApMinutes] = useState('');
  const [apSeconds, setApSeconds] = useState('');
  const [rpMinutes, setRpMinutes] = useState('');
  const [rpSeconds, setRpSeconds] = useState('');
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
  const [disqualification, setDisqualification] = useState(null);
  const [score, setScore] = useState(null);
  const [errors, setErrors] = useState({});
  const [detailedPenalties, setDetailedPenalties] = useState([]);
  const [showReminder, setShowReminder] = useState(false);

  // Ensure to reset everything when changing disciplines
  const handleReset = () => {
    setApMinutes('');
    setApSeconds('');
    setRpMinutes('');
    setRpSeconds('');
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
    setDisqualification(null);
    setScore(null); // Clear the score to reset the display
    setErrors({});
    setDetailedPenalties([]);
    setShowReminder(false);
  };

  // Use effect to reset state on discipline change
  useEffect(() => {
    handleReset(); 
  }, [discipline]); // Depend on discipline changes for reset
  
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

    if ((penalties.earlyStart || penalties.lateStart) && !startDeviation && discipline !== 'Depth') {
      const deviationLabel = penalties.earlyStart ? "early start time" : "late start time";
      newErrors.startDeviation = `${deviationLabel} is required`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateScore = () => {
    if (disqualification) {
      setScore(0);
      return;
    }

    if (!validateInputs()) return;

    const startPenalty = calculateStartPenalty(penalties, startDeviation, discipline);

    if (startPenalty === 'disqualified') {
      setScore(0);
      return;
    }

    let points = 0;
    let penalty = startPenalty;
    const newDetailedPenalties = [];

    const addPenaltyDetail = (description, points) => {
      penalty += points;
      newDetailedPenalties.push(`${description}: ${points} points`);
    };

    if (discipline === 'Static') {
      const apTime = parseInt(apMinutes, 10) * 60 + parseInt(apSeconds, 10);
      const rpTime = parseInt(rpMinutes, 10) * 60 + parseInt(rpSeconds, 10);
      points = Math.floor((Math.floor(rpTime) * 0.2) * 5) / 5;

      if (rpTime < apTime) {
        const underAPPenalty = (apTime - rpTime) * 0.2;
        addPenaltyDetail('UNDER AP', underAPPenalty);
      }
    } else if (discipline === 'Dynamic') {
      const apNumber = parseFloat(apDistance);
      const rpNumber = Math.floor(parseFloat(rpDistance));
      points = Math.floor((rpNumber * 0.5) * 2) / 2;

      if (rpNumber < apNumber) {
        const underAPPenalty = (apNumber - rpNumber) * 0.5;
        addPenaltyDetail('UNDER AP', underAPPenalty);
      }
      if (penalties.noTouchAtStart) {
        addPenaltyDetail('No Body Part Touch at Start', 5);
      }
      if (penalties.pulling > 0) {
        addPenaltyDetail(`Illegal Propulsion Assistance x${penalties.pulling}`, penalties.pulling * 5);
      }
      if (penalties.noTouchAtTurn > 0) {
        addPenaltyDetail(`No Touch at Turn x${penalties.noTouchAtTurn}`, penalties.noTouchAtTurn * 5);
      }
    } else if (discipline === 'Depth') {
      const apNumber = parseFloat(apDistance);
      const rpNumber = Math.floor(parseFloat(rpDistance));
      points = rpNumber;

      if (rpNumber < apNumber && !penalties.missingTag) {
        setShowReminder(true);
      } else {
        setShowReminder(false);
      }

      if (penalties.missingTag) {
        addPenaltyDetail('Missing Tag', 1);
      }
      if (penalties.grabLine > 0) {
        addPenaltyDetail(`Grab of Line x${penalties.grabLine}`, penalties.grabLine * 5);
      }
      if (penalties.removeLanyard) {
        addPenaltyDetail('Removed Lanyard', 10);
      }
    }

    if (penalties.earlyStart) {
      addPenaltyDetail('Early Start Penalty', startPenalty);
    }

    if (penalties.lateStart) {
      addPenaltyDetail('Late Start Penalty', startPenalty);
    }

    setDetailedPenalties(newDetailedPenalties);
    const finalScore = Math.max(points - penalty, 0);
    setScore(finalScore);
  };

  useEffect(() => {
    calculateScore();
  }, [
    discipline, apMinutes, apSeconds, rpMinutes, rpSeconds,
    apDistance, rpDistance, startDeviation, penalties, disqualification
  ]);

  return (
    <Container maxWidth="md" style={{ padding: 0 }}>
      <TabsComponent discipline={discipline} handleReset={handleReset} setDiscipline={setDiscipline} />

      {showReminder && (
        <Box marginTop={2} padding="0 16px" color="red">
          <Typography variant="body1">
            Reminder: RP is less than AP. Consider selecting "No Tag".
          </Typography>
        </Box>
      )}

      {score !== null && (
        <Box marginTop={3} padding="0 16px">
          <ResultAlert
            score={score}
            detailedPenalties={detailedPenalties}
            penaltyCodes={disqualification ? [disqualification] : [
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

      {(discipline !== 'Depth' || penalties.earlyStart) && !disqualification && (
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