import { Container, Grid, TextField } from '@mui/material';
import React from 'react';
import { useState, useEffect } from 'react';

function Step2({ DocumentData, setDocumentData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDocumentData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };
  const [inputs, setinputs] = useState([]);
  const [values, setvalues] = useState([]);
  useEffect(() => {
    let keys = Object.keys(DocumentData);
    let valuesT = Object.values(DocumentData);

    setinputs(keys.splice(2, 2));
    setvalues(valuesT.splice(2, 2));
  }, []);

  return (
    <Container spacing={3}>
      <Grid container>
        {inputs.map((item, index) => (
          <Grid item lg={12}>
            <TextField
              style={{ width: '550px' }}
              sx={{ my: 1 }}
              id="outlined-basic"
              name={item}
              label={item}
              value={values[index]}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Step2;
