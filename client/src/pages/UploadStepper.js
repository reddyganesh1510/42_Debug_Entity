import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Step1 from './UploadSteps/Step1';
import Step2 from './UploadSteps/Step2';
import Step3 from './UploadSteps/Step3';
import axios from 'axios';
import { baseurl } from '../config';

const steps = ['Upload Document', 'Fill Details', 'Live Photo'];

export default function UploadStepper() {
  const date = new Date();
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [DisabledNext, setDisabledNext] = useState(true);
  const [message, setmessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [DocumentData, setDocumentData] = useState({ liveImage: '', type: '' });

  const getStep = (activeStep) => {
    // console.log(activeStep);
    if (activeStep == 0) {
      return (
        <Step1
          loading={loading}
          setLoading={setLoading}
          DocumentData={DocumentData}
          setDocumentData={setDocumentData}
        />
      );
    }
    if (activeStep == 1) {
      return (
        <Step2
          loading={loading}
          setLoading={setLoading}
          DocumentData={DocumentData}
          setDocumentData={setDocumentData}
        />
      );
    }
    if (activeStep == 2) {
      return (
        <Step3
          loading={loading}
          setLoading={setLoading}
          DocumentData={DocumentData}
          setDocumentData={setDocumentData}
        />
      );
    }
  };

  useEffect(() => {
    console.log(DocumentData);
    setDisabled();
  }, [DocumentData, loading]);
  const setDisabled = () => {
    if (activeStep == 0) {
      if (DocumentData.type == '' || loading == true) {
        setDisabledNext(true);
      } else {
        setDisabledNext(false);
      }
    }
    if (activeStep == 1) {
      if (DocumentData.Name == '' || loading == true) {
        setDisabledNext(true);
      } else {
        setDisabledNext(false);
      }
    }
    if (activeStep == 2) {
      if (DocumentData.liveImage == '' || loading == true) {
        setDisabledNext(true);
      } else {
        setDisabledNext(false);
      }
    }
  };

  const handleNext = () => {
    let newSkipped = skipped;

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
    if (activeStep == 2) {
      let fd = new FormData();
      let data = DocumentData;

      fd.append('document', JSON.stringify(DocumentData));
      fd.append('label', DocumentData.type);
      // fd.append('liveImage ', DocumentData.liveImage);
      // delete data.selectedImage;
      // delete data.liveImage;
      // fd.append('data ', JSON.stringify(data));
      axios
        .post(baseurl + `api/user/upload`, fd, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-auth-token':
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoiYWJjQGdtYWlsLmNvbSIsImlkIjoiNjFlYmY2Mjc5NjU2MjUxNWE0ZWVhNDBiIn0sImlhdCI6MTY0Mjg1MzkyNywiZXhwIjoxNjQzMTEzMTI3fQ.sSIWuzSYGG9Yh8hOX-_8fEYXwGziQxZJeOIalRGZMwI'
          }
        })
        .then((res) => {
          setmessage(res.data.message);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    // if (activeStep == 2) {
    //   setData((prevState) => ({
    //     ...prevState,
    //     selectedVehicleType: "",
    //   }));
    // }
    // if (activeStep == 3) {
    //   setData((prevState) => ({
    //     ...prevState,
    //     selectedVehicleName: "",
    //   }));
    // }
  };

  const handleReset = () => {
    setActiveStep(0);
    setDocumentData({ liveImage: '', type: '' });
    setmessage('');
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Upload
      </Typography>
      <Box sx={{ width: '100%' }}>
        <Stepper sx={{ paddingBottom: '30px' }} activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};

            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === steps.length ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>{message}</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {getStep(activeStep)}
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />

              <Button disabled={DisabledNext} onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </Box>
          </React.Fragment>
        )}
      </Box>
    </Container>
  );
}
