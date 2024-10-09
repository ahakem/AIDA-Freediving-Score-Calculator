export const calculateStartPenalty = (penalties, deviation, discipline) => {
    let penalty = 0;
    deviation = parseFloat(deviation) || 0;
  
    if (penalties.earlyStart && deviation > 0) {
      if (deviation <= 5) penalty = 1;
      else if (deviation <= 10) penalty = 2;
    } else if (penalties.lateStart) {
      if (discipline === 'Depth') {
        if (deviation <= 30) return 0;  // No penalty if within 30 seconds for depth
        else if (deviation > 30) penalty = 1;
      } else {
        if (deviation <= 10) return 0;  // No penalty if within 10 seconds for pool disciplines
        else if (deviation <= 15) penalty = 1;
        else if (deviation <= 20) penalty = 2;
        else if (deviation <= 25) penalty = 3;
        else if (deviation < 30) penalty = 4;
        else if (deviation >= 30) return 'disqualified';
      }
    }
  
    return penalty;
  };
  
  export const getPenaltyCodes = (penalties, deviation, discipline, rpMinutes, rpSeconds, apMinutes, apSeconds, rpDistance, apDistance) => {
    const codes = [];
  
    if (penalties.earlyStart && deviation > 0) codes.push('EARLY START');
    if (penalties.lateStart && ((discipline === 'Depth' && deviation > 30) || (discipline !== 'Depth' && deviation > 10))) codes.push('LATE START');
  
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