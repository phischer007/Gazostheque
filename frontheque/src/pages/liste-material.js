import Head from 'next/head';
import NextLink from 'next/link';
import config from 'src/utils/config';
import React, { useEffect, useState } from 'react';
import { useAuth } from 'src/hooks/use-auth';

import {
  Box,
  Container,
  Stack,
  Typography,
  Unstable_Grid2 as Grid
} from '@mui/material';

import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { MaterialTable } from 'src/sections/materials/material-table.js'

// ----------------------------------------------------------------------------- //

const Page = () => {
  const user = useAuth().user;
  const [materialList, setMaterialList] = useState(null);

  useEffect(() => {
    let materialAPIURL = `${config.apiUrl}/materials/owner/${user.owner_id}/`;

    fetch(materialAPIURL)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setMaterialList(data);
      })
      .catch(error => {
        console.error('Error fectching data:', error);
      });
  }, [user.owner_id]);

  return (
    <>
      <Head>
        <title>
          Listes de bouteille | Gazotheque
        </title>
      </Head>
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          py:8
        }}
      >
        <Container maxWidth='xl'>
          <Stack spacing={3}>
            <div>
              <Typography variant='h4'>
                Liste des bouteilles de gaz
              </Typography>
            </div>

            <div>
              <Grid
                container
                width={'100%'}
              >
                <Grid
                  xs={12}
                  md={6}
                  lg={16}
                >
                  <MaterialTable data={materialList}/>
                </Grid>
              </Grid>
            </div>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;