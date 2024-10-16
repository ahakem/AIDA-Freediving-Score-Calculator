import React from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

function TimeInput({ label, value, setValue, max }) {
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <FormControl variant="outlined" fullWidth style={{ margin: '8px', minWidth: 100 }}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={handleChange}
        label={label} // Ensure the label prop is used in Select
      >
        {Array.from({ length: max + 1 }, (_, i) => (
          <MenuItem key={i} value={String(i).padStart(2, '0')}>
            {String(i).padStart(2, '0')}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default TimeInput;