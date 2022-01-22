import { useState, useEffect } from 'react';
import axios from 'axios';
// material
import EmailIcon from '@iconify/icons-eva/email-outline';
import SmartPhoneIcon from '@iconify/icons-eva/smartphone-outline';

import {
  Card,
  Avatar,
  Container,
  Typography,
  CardHeader,
  Box,
  ListItem,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SliderMark
} from '@mui/material';
// components
import { styled } from '@mui/material/styles';
import Page from '../components/Page';

import account from '../_mocks_/account';
import { getUserData } from '../utils/helpers';
import {Icon} from "@iconify/react";
import androidFilled from "@iconify/icons-ant-design/cloud-upload-outlined";

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

  useEffect( () => {
    const data = getUserData();
    // try {
    //
    // } catch ( err ) {
    //   console.log(err);
    // }
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

              <List>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon> <Icon icon={EmailIcon} width={30} height={30} /> </ListItemIcon>
                    <ListItemText primary={userData.email} />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon> <Icon icon={SmartPhoneIcon} width={30} height={30} /> </ListItemIcon>
                    <ListItemText primary={userData.phoneNumber} />
                  </ListItemButton>
                </ListItem>
              </List>
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
