import Head from 'next/head';
import config from 'src/utils/config';
import React, { useEffect, useState } from 'react';

import {
    Box,
    Container,
    Stack,
    Typography,
    Unstable_Grid2 as Grid
} from '@mui/material';

import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import NewMaterialDetails from 'src/sections/create-material/new-material-details';

// ----------------------------------------------------------------------------------- //

const Page = () => {
  const [ownersList, setOwnersList] = useState(null);

  useEffect(() => {
    fetch(`${config.apiUrl}/active_owners/lite/`)
      .then(response => response.json())
      .then(data => {
        setOwnersList(data);
      })
        .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <>
      <Head>
        <title>
          Inventaire | Gazotheque
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <div>
                <Typography variant="h4">
                  Ajouter d&apos;une bouteille
                </Typography>
            </div>

            {/* Navigate to the page for creating a new bottle. */}
            <div>
              <Grid
                container
                width={'100%'}
              >
                <Grid
                  xs={12}
                  md={6}
                  lg={10}
                >
                  <NewMaterialDetails ownersList={ownersList}/>
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