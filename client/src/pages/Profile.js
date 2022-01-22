import { useState, useEffect } from 'react';
// material
import { Card, Avatar, Container, Typography, CardHeader, Box } from '@mui/material';
// components
import { styled } from '@mui/material/styles';
import Page from '../components/Page';

import account from '../_mocks_/account';
import { getUserData } from '../utils/helpers';

// ----------------------------------------------------------------------

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: theme.shape.borderRadiusSm,
  backgroundColor: theme.palette.grey[200]
}));

export default function Profile() {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const data = getUserData();

    if (data) {
      setUserData(data);
    }
  }, []);

  return (
    <Page title="Profile">
      <Container>
        <Card sx={{ my: 2 }}>
          <CardHeader title="Profile" />
          <AccountStyle>
            <Avatar sx={{ width: 125, height: 125 }} src={account.photoURL} alt="photoURL" />
            <Box sx={{ m: 10 }}>
              <Typography variant="h3" sx={{ color: 'text.primary' }}>
                {userData?.firstName
                  ? `${userData.firstName}  ${userData.lastName}`
                  : account.displayName}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {account.role}
              </Typography>
            </Box>
          </AccountStyle>
        </Card>
      </Container>
    </Page>
  );
}
