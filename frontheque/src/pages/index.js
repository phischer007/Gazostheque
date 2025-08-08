import Head from 'next/head';
import config from 'src/utils/config';
import { toast } from 'react-toastify';
import { useAuth } from 'src/hooks/use-auth';
import { useEffect, useState, useCallback } from 'react';
import { Box, 
  Container, 
  Unstable_Grid2 as Grid, 
  Typography, 
  Button, 
  Avatar, 
  Stack, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions, 
  Divider
} from '@mui/material';
import { UserIcon } from '@heroicons/react/24/outline';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';

import { OverviewTotalMaterialsByLab } from 'src/sections/overview/overview-total';
import { OverviewBarChart } from 'src/sections/overview/overview-barchart-year';
import { OverviewTotalMaterials } from 'src/sections/overview/overview-total-material';

// -------------------------------------------------------------------------- //

const Page = () => {
  const auth = useAuth();
  const user = auth.user;
  const [open, setOpen] = useState(false);
  const [accountChoice, setAccountChoice] = useState("user")

  const onConfirmAccountType = useCallback(async () => {
    try {
      const response = await fetch(`${config.apiUrl}/users/${user.user_id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({role: accountChoice}),
      });

      if (!response.ok) {
        toast.error("An error occurred. Please try again later.", { autoClose: false });
      } else {
        const updatedUserData = await response.json();
        await auth.updateUser(updatedUserData.user_id);
        toast.success("Your account was successfully updated!");
        window.location.reload();
      }
      window.sessionStorage.setItem('isNew', false);
      setOpen(false);

    } catch (error) {
      // Handle unexpected errors
      console.error("An unexpected error occurred:", error);
      toast.error("An unexpected error occurred. Please try again later.", { autoClose: false });
    }

  }, [accountChoice, auth, user.user_id]);

  const selectedStyle = {
    bgcolor: 'primary.main',
    cursor: 'pointer'
  };

  return (
    <>
      <Head>
        <title>
          Tableau au bord | Gazotheque
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
        <Grid
          container
          spacing={3}
        >
          <Grid
            xs={12}
            sm={6}
            lg={6}
          >
            <OverviewTotalMaterials sx={{ height: '100%' }}/>
          </Grid>

          <Grid
            xs={12}
            sm={6}
            lg={6}
          >
            <OverviewTotalMaterialsByLab sx={{ height: '100%' }}/>
          </Grid>

          <Grid
            xs={12}
            lg={12}
          >
            <OverviewBarChart sx={{ height: '100%' }}/>
          </Grid>

        </Grid>
        
        {
          open &&
          <Dialog
            open={open}
            onClose={() => setOpen(false)}
            disableBackdropClick
            disableEscapeKeyDown
          >
            <DialogTitle>
              Bienvenue à Gazotheque
            </DialogTitle>

            <DialogContent>
              <DialogContentText>
                Veuillez choisir le type de compte que vous souhaitez
              </DialogContentText>
              <Grid container 
                spacing={2} 
                xs={12} 
                sx={{ my: 2 }} 
                justifyContent="center" 
                alignItems="flex-start"
              >
                <Grid item 
                  xs={5}
                >
                  <Stack
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    spacing={1}  // Adjust spacing as needed
                    sx={{ height: '100%' }}  // Ensures the content is centered vertically
                  >
                    <Avatar
                      variant="rounded"
                      onClick={() => {
                        setAccountChoice('user');
                        console.log('USER');
                      }}
                      sx={accountChoice === 'user' ? { ...selectedStyle } : { cursor: 'pointer' }}
                    >
                      <UserIcon style={{ fontSize: 100 }} />
                    </Avatar>
                    <Typography align="center">User</Typography>
                    <Typography align="center" 
                      variant="caption"
                    >
                      Un simple utilisateur peut voir l&apos;inventaire.
                    </Typography>
                  </Stack>
                </Grid>

                <Grid item 
                  xs={5}
                >
                  <Stack
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    spacing={1}  // Adjust spacing as needed
                    sx={{ height: '100%' }}  // Ensures the content is centered vertically
                  >
                    <Avatar
                      variant="rounded"
                      onClick={() => {
                        setAccountChoice('owner');
                        console.log('OWNER');
                      }}
                        sx={accountChoice === 'owner' ? { ...selectedStyle } : { cursor: 'pointer' }}
                    >
                      <UserIcon style={{ fontSize: 100 }} />
                    </Avatar>
                    <Typography align="center">owner</Typography>
                    <Typography align="center" 
                      variant="caption"
                    >
                      Les chefs d&apos;équipe peuvent consulter et modifier l&apos;inventaire des bouteilles de gaz.
                    </Typography>
                  </Stack>
                </Grid>

                <Grid item 
                  xs={5}
                >
                  <Stack
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    spacing={1}  // Adjust spacing as needed
                    sx={{ height: '100%' }}  // Ensures the content is centered vertically
                  >
                    <Avatar
                      variant="rounded"
                      onClick={() => {
                        setAccountChoice('admin');
                        console.log('ADMIN');
                      }}
                        sx={accountChoice === 'admin' ? { ...selectedStyle } : { cursor: 'pointer' }}
                    >
                      <UserIcon style={{ fontSize: 100 }} />
                    </Avatar>
                    <Typography 
                      align="center"
                    >
                      Administrateur
                    </Typography>

                    <Typography align="center" 
                      variant="caption"
                    >
                      Un administrateur peut modifier le matériel, définir l&apos;emplacement et générer un code QR.
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={onConfirmAccountType} 
                color="error"
              >
                Vérifier
              </Button>
            </DialogActions>
          </Dialog>
        }

      </Container>
      </Box>
    </>
  )
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
