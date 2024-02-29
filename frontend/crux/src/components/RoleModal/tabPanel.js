import * as React from 'react';
import { Divider } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

export default function LabTabs(profile, college, projects, experiences) {
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const bold = {
    fontWeight: 'bold',
  };
  const scroll = {
    marginBottom: '24px',
    height: '40vh',
    maxHeight: '40vh',
    overflowY: 'auto',
    overflowX: 'auto',
  }

  const widthauto = {
    width : 'auto'
  }
  const flexContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  };
  var collegeRows,projectRows,experienceRows;

  console.log(profile.college);
  if (profile.college) {
    collegeRows = Object.entries(profile.college).map(([key, value]) => (
      <div className='Tab-Form-Row' sx={flexContainerStyle}>
        <div className='Tab-Form-Row-Label' style={bold}>{key}:</div>
        <div className='Tab-Form-Row-Body'>{value}</div>
      </div>
    ));
  } else{
    collegeRows = <div>No Data</div>
  }
  if (profile.projects) {
    projectRows = profile.projects.map((project, index) => (
      <div className='Row-Division'  key={index}>
      <div className='Tab-Form-Row' style={flexContainerStyle}>
        <div className='Tab-Form-Row-Label' style={{...bold,...widthauto}}>Project Title:</div>
        <div className='Tab-Form-Row-Body'>{project.project_title}</div>
      </div>
      <div className='Tab-Form-Row' sx={flexContainerStyle}>
        <div className='Tab-Form-Row-Label ' style={bold}>Short Description:</div>
        <div className='Tab-Form-Row-Body'>{project.short_description}</div>
      </div>
      <div className='Tab-Form-Row' sx={flexContainerStyle}>
        <div className='Tab-Form-Row-Label ' style={bold}>Tech Stack:</div>
        <div className='Tab-Form-Row-Body'>{project.tech_stack}</div>
      </div>
      <Divider sx={{ backgroundColor: 'rgba(0, 0, 0, 0.87)'}} />
    </div>
    
    ));
    
  } else{
    projectRows = <div>No Data</div>
  }
  if (profile.experiences) {
    experienceRows = profile.experiences.map((experience, index) => (
      <div className='Row-Division' key={index}>
        <div className='Tab-Form-Row' style={flexContainerStyle}>
          <div className='Tab-Form-Row-Label ' style={bold}>Role:</div>
          <div className='Tab-Form-Row-Body'>{experience.role}</div>
        </div>
        <div className='Tab-Form-Row' style={flexContainerStyle}>
          <div className='Tab-Form-Row-Label ' style={bold}>Organization:</div>
          <div className='Tab-Form-Row-Body'>{experience.organization}</div>
        </div>
        <div className='Tab-Form-Row' style={flexContainerStyle}>
          <div className='Tab-Form-Row-Label ' style={bold}>Description:</div>
          <div className='Tab-Form-Row-Body'>{experience.short_description}</div>
        </div>
        <div className='Tab-Form-Row' style={flexContainerStyle}>
          <div className='Tab-Form-Row-Label ' style={bold}>Tech Stack:</div>
          <div className='Tab-Form-Row-Body'>{experience.tech_stack}</div>
        </div>
        <Divider sx={{ backgroundColor: 'rgba(0, 0, 0, 0.87)'}} />
      </div>
    ));
    
  } else{
    experienceRows = <div>No Data</div>
  }



  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="College" value="1" />
            <Tab label="Projecs" value="2" />
            <Tab label="Professional Experience" value="3" />
          </TabList>
        </Box>
        <TabPanel  sx={scroll} value="1">
          {collegeRows}
        </TabPanel>
        <TabPanel  sx={scroll} value="2">
          {projectRows}
        </TabPanel>
        <TabPanel  sx={scroll} value="3">
          {experienceRows}
        </TabPanel>
      </TabContext>
    </Box>
  );
}