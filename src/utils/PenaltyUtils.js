export const calculateStartPenalty = (penalties, deviation, discipline) => {
  let penalty = 0;
  deviation = parseFloat(deviation) || 0;

  // Unified logic for both early and late starts across disciplines, with specific Depth rule
  if (penalties.earlyStart || penalties.lateStart) {
    if (discipline === 'Depth' && penalties.lateStart) {
      return deviation >= 30 ? 'disqualified' : Math.ceil(deviation / 5);  // Disqualify if 30s or more
    } else {
      const points = Math.ceil(deviation / 5);
      return points >= 5 ? 'disqualified' : points;  // Disqualify if 5 points (25s or more)
    }
  }

  return penalty;
};

export const getPenaltyCodes = (penalties, deviation, discipline, rpMinutes, rpSeconds, apMinutes, apSeconds, rpDistance, apDistance) => {
  const codes = [];

  if ((penalties.earlyStart || penalties.lateStart) && deviation > 0) {
    const deviationPoints = calculateStartPenalty(penalties, deviation, discipline);
    if (deviationPoints === 'disqualified') {
      codes.push('DQ LATE/EARLY START');
    } else {
      if(penalties.earlyStart) {codes.push(`EARLY START`)} else codes.push(`LATE START`);
    }
  }

  if (
    discipline === 'Static' &&
    parseInt(rpMinutes, 10) * 60 + parseInt(rpSeconds, 10) <
      parseInt(apMinutes, 10) * 60 + parseInt(apSeconds, 10)
  ) {
    codes.push('UNDER AP');
  }

  if (
    discipline !== 'Static' &&
    parseFloat(rpDistance) < parseFloat(apDistance)
  ) {
    codes.push('UNDER AP');
  }

  if (discipline === 'Dynamic') {
    if (penalties.noTouchAtStart) codes.push('START');
    if (penalties.pulling) codes.push('PULL');
    if (penalties.noTouchAtTurn) codes.push('TURN');
  }

  if (discipline === 'Depth') {
    if (penalties.missingTag) codes.push('TAG');
    if (penalties.grabLine) codes.push('GRAB');
    if (penalties.removeLanyard) codes.push('LANYARD');
  }

  return codes;
};