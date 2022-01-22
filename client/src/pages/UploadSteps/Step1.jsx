import * as React from 'react';
import { createWorker } from 'tesseract.js';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { SpinnerInfinity } from 'spinners-react';

import { useFormik } from 'formik';
import { useState, useEffect } from 'react';

// material
import { Container, Stack, Typography, Button, Grid, Paper } from '@mui/material';
// components
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Page from '../../components/Page';

// import {
//   ProductSort,
//   ProductList,
//   ProductCartWidget,
//   ProductFilterSidebar
// } from '../components/_dashboard/products';
// //
// import PRODUCTS from '../_mocks_/products';

// ----------------------------------------------------------------------

export default function Step1({ DocumentData, setDocumentData, loading, setLoading }) {
  const STATUSES = {
    IDLE: 'idle',
    FAILED: 'Failed to perform OCR',
    PENDING: 'Processing...',
    SUCCEEDED: 'OCR processing complete'
  };

  const [selectedImage, setSelectedImage] = useState(null);
  const [ocrState, setOcrState] = useState(STATUSES.IDLE);
  const [selectedDocumentType, setselectedDocumentType] = useState('Driving Licence');
  const [typeOfDocument, settypeOfDocument] = useState([
    'Driving Licence',
    'Aadhar Card',
    'PAN Card'
  ]);

  const worker = createWorker();

  function toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }
  // Process image with OCR'
  const setOCRData = (typeOfDocument, text) => {
    switch (typeOfDocument) {
      case 'Aadhar Card':
        let aadharNoFromText = '';
        let nameFromText = '';
        setDocumentData((prevState) => ({
          ...prevState,
          type: 'Aadhar Card',
          'Aadhar No': aadharNoFromText,
          Name: nameFromText,
          selectedImage: selectedImage
        }));
        break;
      case 'PAN Card':
        let panNoFromText = '';
        let nameFromTextP = '';

        setDocumentData((prevState) => ({
          ...prevState,
          type: 'PAN Card',

          'PAN No': panNoFromText,
          Name: nameFromTextP,
          selectedImage: selectedImage
        }));
        break;
      case 'Driving Licence':
        let start = text.indexOf('MH');
        let startName = text.indexOf('Name');
        let endName = text.indexOf('S/D/W');
        console.log(startName, endName);
        let dLNoFromText = '';
        dLNoFromText = text.substring(start, start + 16);

        let nameFromTextD = '';
        nameFromTextD = text.substring(startName + 6, endName - 1);
        setDocumentData((prevState) => ({
          ...prevState,
          type: 'Driving Licence',
          'Driving Licence No': dLNoFromText,
          Name: nameFromTextD,
          selectedImage: selectedImage
        }));
        break;

      default:
        break;
    }
  };
  const readImageText = async () => {
    setLoading(true);
    setOcrState(STATUSES.PENDING);
    try {
      await worker.load();
      // Set the language to recognize
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      const {
        data: { text }
      } = await worker.recognize(selectedImage);
      await worker.terminate();
      console.log(text);

      //   console.log(text);
      setOCRData(selectedDocumentType, text);

      toDataURL(URL.createObjectURL(selectedImage), function (dataUrl) {
        console.log('RESULT:', dataUrl);
        setSelectedImage(dataUrl);
      });
      setOcrState(STATUSES.SUCCEEDED);
      setLoading(false);
    } catch (err) {
      setOcrState(STATUSES.FAILED);
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(DocumentData);
  }, [DocumentData]);

  useEffect(() => {
    readImageText();
  }, [selectedImage]);

  // Executed when "Use another image" is selected
  const handleRemoveClicked = () => {
    setSelectedImage(null);

    setOcrState(STATUSES.IDLE);
  };
  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <>
      {loading ? (
        <div id="overlay">
          <div id="text">
            <Container>
              <SpinnerInfinity
                size="100"
                thickness="125"
                color="rgb(0,169,85)"
                secondaryColor="#D3D3D3"
                enabled={loading}
              />
            </Container>
          </div>
        </div>
      ) : (
        <Page title="Dashboard: Products | Minimal-UI">
          <Container sx={{ mb: 5 }}>
            {/* <Stack
          direction="row"
          flexWrap="wrap-reverse"
          alignItems="center"
          justifyContent="flex-end"
          sx={{ mb: 5 }}
        >
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <ProductFilterSidebar
              formik={formik}
              isOpenFilter={openFilter}
              onResetFilter={handleResetFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            />
            <ProductSort />
          </Stack>
        </Stack> */}

            {/* <ProductList products={PRODUCTS} /> */}
            {/* <ProductCartWidget /> */}

            <Grid container spacing={2}>
              <Grid lg={12} item>
                <FormControl sx={{ minWidth: 300 }}>
                  <InputLabel id="demo-simple-select-helper-label">Type of Document</InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={selectedDocumentType}
                    label="Type of Document"
                    onChange={(e) => setselectedDocumentType(e.target.value)}
                  >
                    {typeOfDocument.map((item) => (
                      <MenuItem value={item}>{item}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item>
                <label htmlFor="upload-photo">
                  <input
                    style={{ display: 'none' }}
                    id="upload-photo"
                    name="upload-photo"
                    type="file"
                    onChange={(event) => {
                      setSelectedImage(event.target.files[0]);
                    }}
                  />
                  <Button variant="contained" component="span" startIcon={<Icon icon={plusFill} />}>
                    Upload Document
                  </Button>
                </label>
              </Grid>
              <Grid item lg={12}>
                {selectedImage && (
                  <div>
                    <img src={selectedImage} alt="scanned file" />
                  </div>
                )}
              </Grid>
            </Grid>
          </Container>
        </Page>
      )}
    </>
  );
}
