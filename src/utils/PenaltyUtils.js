export const calculateStartPenalty = (penalties, deviation, discipline) => {
    let penalty = 0;
    deviation = parseFloat(deviation) || 0;
  
    if (penalties.earlyStart) {
      if (deviation > 0 && deviation <= 5) penalty = 1;
      else if (deviation > 5 && deviation <= 10) penalty = 2;
    } else if (penalties.lateStart) {
      if (discipline === 'Depth') {
        return 'disqualified';  // Automatically disqualify for late start in Depth after 30s
      } else {
        if (deviation > 10 && deviation <= 15) penalty = 1;
        else if (deviation > 15 && deviation <= 20) penalty = 2;
        else if (deviation > 20 && deviation <= 25) penalty = 3;
        else if (deviation > 25 && deviation < 30) penalty = 4;
        else if (deviation >= 30) return 'disqualified';
      }
    }
  
    return penalty;
  };
  
  export const getPenaltyCodes = (penalties, deviation, discipline, rpMinutes, rpSeconds, apMinutes, apSeconds, rpDistance, apDistance) => {
    const codes = [];
  
    if (penalties.earlyStart && deviation > 0) codes.push('EARLY START');
    if (penalties.lateStart) {
      if (discipline === 'Depth') {
        codes.push('DQ LATE START');
      } else if (deviation > 10) {
        codes.push('LATE START');
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