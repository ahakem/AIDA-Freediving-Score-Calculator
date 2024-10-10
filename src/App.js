import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, Link } from '@mui/material';
import TabsComponent from './components/TabsComponent';
import ScoreInput from './components/ScoreInput';
import PenaltiesComponent from './components/PenaltiesComponent';
import DeviationInput from './components/DeviationInput';
import ResultAlert from './components/ResultAlert';
import DisqualificationComponent from './components/DisqualificationComponent';
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
    pulling: false,
    noTouchAtTurn: false,
    missingTag: false,
    grabLine: false,
    removeLanyard: false,
  });
  const [disqualification, setDisqualification] = useState(null);
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
    setPenalties({
      earlyStart: false,
      lateStart: false,
      noTouchAtStart: false,
      pulling: false,
      noTouchAtTurn: false,
      missingTag: false,
      grabLine: false,
      removeLanyard: false,
    });
    setDisqualification(null);
    setScore(null);
    setErrors({});
  };
useEffect(() => {
  console.log("setDisqualification", disqualification);
})
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
      // If disqualified, set score to 0 and show red card
      setScore(0);
      return;
    }

    if (!validateInputs()) return;

    const startPenalty = calculateStartPenalty(penalties, startDeviation, discipline);

    if (startPenalty === 'disqualified') {
      setScore(0);  // Assign score to 0 for disqualification
      return;
    }

    let points = 0;
    let penalty = startPenalty;

    if (discipline === 'Static') {
      const apTime = parseInt(apMinutes, 10) * 60 + parseInt(apSeconds, 10);
      const rpTime = parseInt(rpMinutes, 10) * 60 + parseInt(rpSeconds, 10);
      const roundedRPTime = Math.floor(rpTime);
      points = Math.floor((roundedRPTime * 0.2) * 5) / 5;
      if (rpTime < apTime) penalty += (apTime - rpTime) * 0.2;
    } else if (discipline === 'Dynamic') {
      const apNumber = parseFloat(apDistance);
      const rpNumber = Math.floor(parseFloat(rpDistance));
      points = Math.floor((rpNumber * 0.5) * 2) / 2;
      if (rpNumber < apNumber) penalty += (apNumber - rpNumber) * 0.5;
      if (penalties.noTouchAtStart) penalty += 5;
      if (penalties.pulling) penalty += 5;
      if (penalties.noTouchAtTurn) penalty += 5;
    } else if (discipline === 'Depth') {
      const apNumber = parseFloat(apDistance);
      const rpNumber = Math.floor(parseFloat(rpDistance));
      points = rpNumber;
      if (rpNumber < apNumber) penalty += apNumber - rpNumber;
      if (penalties.missingTag) penalty += 1;
      if (penalties.grabLine) penalty += 5;
      if (penalties.removeLanyard) penalty += 10;
    }

    const finalScore = Math.max(points - penalty, 0);
    setScore(finalScore);
  };
  useEffect(() => {
    calculateScore();
  }, [
    discipline, apMinutes, apSeconds, rpMinutes, rpSeconds,
    apDistance, rpDistance, startDeviation, penalties, disqualification
  ]);

  useEffect(() => {
    handleReset();
  }, [discipline]);

  return (
    <Container maxWidth="md" style={{ padding: 0 }}>
      <TabsComponent discipline={discipline} setDiscipline={setDiscipline} />
      
      <Box marginTop={3} padding="0 16px">
        <ResultAlert
          score={score}
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

      {/* <DisqualificationComponent
        discipline={discipline}
        disqualification={disqualification}
        setDisqualification={setDisqualification}
      /> */}

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