import React, { useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import Button from '@mui/material/Button';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';

const WebcamComponent = () => <Webcam />;

const videoConstraints = {
  width: 220,
  height: 200,
  facingMode: 'user'
};
function Step3({ Document, setDocumentData }) {
  const [image, setImage] = useState('');
  const webcamRef = React.useRef(null);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
    setDocumentData((prevState) => ({
      ...prevState,
      liveImage: imageSrc
    }));
  });
  return (
    <div className="webcam-container">
      <div className="webcam-img">
        {image == '' ? (
          <Webcam
            audio={false}
            height={300}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={300}
            videoConstraints={videoConstraints}
          />
        ) : (
          <img src={image} />
        )}
      </div>
      <div className="ImageCam">
        {image != '' ? (
          <Button
            variant="contained"
            component="span"
            startIcon={<Icon icon={plusFill} />}
            onClick={(e) => {
              e.preventDefault();
              setImage('');
            }}
            sx={{ marginTop: '25px' }}
          >
            Retake Image
          </Button>
        ) : (
          <Button
            variant="contained"
            component="span"
            startIcon={<Icon icon={plusFill} />}
            onClick={(e) => {
              e.preventDefault();
              capture();
            }}
            className="webcam-btn"
          >
            Capture
          </Button>
        )}
      </div>
    </div>
  );
}

export default Step3;
