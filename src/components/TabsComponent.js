import React from 'react';
import { Tabs, Tab } from '@mui/material';

function TabsComponent({ discipline, setDiscipline }) {
  return (
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
  );
}

export default TabsComponent;