import * as React from 'react';
import { SpinnerInfinity } from 'spinners-react';

import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  CardHeader,
  Box,
  Grid,
  Modal
} from '@mui/material';
// components
import { styled } from '@mui/material/styles';
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../components/_dashboard/user';
//
import USERLIST from '../_mocks_/user';
import account from '../_mocks_/account';
import { getUserData } from '../utils/helpers';
import axios from 'axios';
import { baseurl } from 'config';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'firstName', label: 'First Name', alignRight: false },
  { id: 'lastName', label: 'Last Name', alignRight: false },
  { id: 'isVerified', label: 'Verified', alignRight: false },
  { id: 'view', label: 'View', alignRight: false },
  { id: '' }
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: theme.shape.borderRadiusSm,
  backgroundColor: theme.palette.grey[200]
}));

const modalstyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1000,

  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

export default function Requests() {
  const [loading, setloading] = useState(false);

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [userData, setUserData] = useState({});
  const [documentData, setdocumentData] = useState([]);
  const [modalData, setmodalData] = useState({
    documentId: '',
    email: '',
    data: { selectedImage: '' }
  });

  useEffect(() => {
    const data = getUserData();
    axios
      .get(baseurl + 'documents/api/admin/getAllUnverified', {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token':
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6eyJlbWFpbCI6ImFkbWluQGRpZ2libG9jay5jb20iLCJpZCI6IjYxZWM4NzNjNjE3OTY1MzQwNDA5YzVmZSJ9LCJpYXQiOjE2NDI4OTEwNjgsImV4cCI6MTY0MzE1MDI2OH0.aRyL63cCajSHgUl21yBqjnj2tTUvLA7kXMHBYMzg6Zk'
        }
      })
      .then((res) => {
        console.log(res);
        let totalData = [];
        let users = res.data.content.docs;

        setdocumentData(res.data.content.docs);
      })
      .catch((err) => {
        console.log(err);
      });

    if (data) {
      setUserData(data);
    }
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;
  const handleViewDocument = (ipfsHashT, email, documentId) => {
    handleOpen();
    setmodalData((prevState) => ({
      ...prevState,
      email: email,
      documentId: documentId
    }));

    let data = { ipfsHash: ipfsHashT, email: email };
    console.log(data);
    setloading(true);
    axios
      .post(baseurl + 'documents/api/admin/getFile', JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token':
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6eyJlbWFpbCI6ImFkbWluQGRpZ2libG9jay5jb20iLCJpZCI6IjYxZWM4NzNjNjE3OTY1MzQwNDA5YzVmZSJ9LCJpYXQiOjE2NDI4OTEwNjgsImV4cCI6MTY0MzE1MDI2OH0.aRyL63cCajSHgUl21yBqjnj2tTUvLA7kXMHBYMzg6Zk'
        }
      })
      .then((res) => {
        setloading(false);
        console.log(res);
        let data = JSON.parse(res.data.content.decryptedData);
        setmodalData((prevState) => ({
          ...prevState,
          data: data
        }));
      })
      .catch((err) => {
        setloading(false);
        console.log(err);
      });
  };
  const handleDocVerification = (email, documentId, isValid) => {
    let data = { email: email, documentId: documentId, isValid: isValid };
    axios
      .post(baseurl + 'documents/api/admin/verify', JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token':
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6eyJlbWFpbCI6ImFkbWluQGRpZ2libG9jay5jb20iLCJpZCI6IjYxZWM4NzNjNjE3OTY1MzQwNDA5YzVmZSJ9LCJpYXQiOjE2NDI4OTEwNjgsImV4cCI6MTY0MzE1MDI2OH0.aRyL63cCajSHgUl21yBqjnj2tTUvLA7kXMHBYMzg6Zk'
        }
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  useEffect(() => {
    console.log(modalData);
  }, [modalData]);

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalstyle}>
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
            <Grid container>
              <Grid item lg={12}>
                {modalData.data.selectedImage && (
                  <div>
                    <img src={modalData.data.selectedImage} alt="scanned file" />
                  </div>
                )}
              </Grid>

              <Grid sx={{ m: 2, my: 1 }} item>
                <h4>Name: {modalData.data.Name}</h4>
              </Grid>

              <Grid item={12}>
                <Button
                  sx={{ m: 2, my: 5 }}
                  onClick={() => handleDocVerification(modalData.email, modalData.documentId, true)}
                  variant="contained"
                  component="span"
                >
                  Accept
                </Button>
              </Grid>
              <Grid item={12}>
                <Button
                  sx={{ my: 5 }}
                  onClick={() =>
                    handleDocVerification(modalData.email, modalData.documentId, false)
                  }
                  variant="contained"
                  component="span"
                >
                  Reject
                </Button>
              </Grid>
            </Grid>
          )}
        </Box>
      </Modal>
      <Page title="Requests | Minimal-UI">
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              Requests
            </Typography>
            <Button
              variant="contained"
              component={RouterLink}
              to="#"
              startIcon={<Icon icon={plusFill} />}
            >
              New Requests
            </Button>
          </Stack>

          <Card />

          <Card>
            <UserListToolbar
              numSelected={selected.length}
              filterName={filterName}
              onFilterName={handleFilterByName}
            />

            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <UserListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={USERLIST.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {documentData
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => {
                        const { firstName, lastName, email, ipfsHash, _id } = row;

                        return (
                          <TableRow
                            hover
                            key={email}
                            tabIndex={-1}

                            // selected={isItemSelected}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                // checked={isItemSelected}
                                onChange={(event) => handleClick(event, firstName)}
                              />
                            </TableCell>
                            {/* <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Avatar alt={name} src={avatarUrl} />
                              <Typography variant="subtitle2" noWrap>
                                {name}
                              </Typography>
                            </Stack>
                          </TableCell> */}
                            <TableCell align="left">{email}</TableCell>
                            <TableCell align="left">{firstName}</TableCell>
                            <TableCell align="left">{lastName}</TableCell>

                            <TableCell align="left">{row.doc.isVerified ? 'Yes' : 'No'}</TableCell>
                            <TableCell align="left">
                              <Button
                                variant="contained"
                                component="span"
                                onClick={() =>
                                  handleViewDocument(row.doc.ipfsHash, email, row.doc._id)
                                }
                              >
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                  {isUserNotFound && (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                          <SearchNotFound searchQuery={filterName} />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
            </Scrollbar>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={USERLIST.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Container>
      </Page>
    </>
  );
}
