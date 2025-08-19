import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState, useEffect, useCallback } from 'react';
import config from 'src/utils/config';
import { toast } from 'react-toastify';
import { useAuth } from 'src/hooks/use-auth';
import { 
    Box, 
    Container, 
    Stack, 
    Typography, 
    Button, 
    CardActions, 
    CircularProgress,
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogContentText, 
    DialogTitle, 
    Unstable_Grid2 as Grid,
    SvgIcon,
    Alert
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { MaterialDetailEdit } from 'src/sections/material-detail/material-detail-edit';
import { MaterialDetailOverview } from 'src/sections/material-detail/material-detail-overview';
import DeleteIcon from '@heroicons/react/24/solid/TrashIcon';
import { quickNotifyOption } from 'src/utils/notification-config';

/**  */

const Page = () => {
  const router = useRouter();
  const auth = useAuth();
  const user = auth.user;
  const { materialId } = router.query;
  const [open, setOpen] = useState(false);
  const [materialData, setMaterialData] = useState(null);
  const [dialogSubject, setDialogSubject] = useState("");
  const [canDelete, setCanDelete] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isConsigned, setIsConsigned] = useState(false);

  const getDialogDetails = useCallback(() => {
    let title = '';
    let content = '';
    let buttonText = '';
    let action = null;

    switch (dialogSubject) {
      case 'delete':
        title = 'Supprimer la bouteille';
        content = 'Êtes-vous sûr de vouloir supprimer cette bouteille ?';
        buttonText = 'Supprimer';
        action = handleDelete;
        break;
      default:
        break;
    }
    return { title, content, buttonText, action };
  }, [dialogSubject]);

  const handleDelete = useCallback(async () => {
    try {
      const response = await fetch(`${config.apiUrl}/materials/${materialId}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
    
      if (!response.ok) {
        toast.error('Impossible de supprimer le matériel, réessayez plus tard!!!', { ...quickNotifyOption });
      } else {
        toast.success('La bouteille a été supprimée avec succès', { ...quickNotifyOption });
        setTimeout(() => {
          router.push('/');
        }, 1000);
      }
    } catch (error) {
      toast.error('Impossible de supprimer le matériel, réessayez plus tard!!!', { ...quickNotifyOption });
    }
    setOpen(false); 
  }, [materialId, router]);

  useEffect(() => {
    if (!materialId || !user) return;

    const fetchMaterialData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${config.apiUrl}/materials/${materialId}`);
        if (!response.ok) {
          throw new Error('Material not found');
        }
        const data = await response.json();
        setMaterialData(data);

        // Check if material is consigned (has date_depart)
        setIsConsigned(!!data.date_depart);

        // Check permissions
        const isOwner = data.owner_details?.user_id === user.user_id;
        const isAdmin = user.is_staff || user.role === 'admin';
        
        // Only admin can delete, but not if consigned
        setCanDelete(isAdmin && !data.date_depart);
        // For edit, check permissions but if consigned, it will be overridden to false in MaterialDetailEdit
        setCanEdit(isAdmin || isOwner);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMaterialData();
  }, [materialId, user]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Head>
        <title>Détails sur la bouteille</title>
      </Head>
      <Box component="main" 
        sx={{ flexGrow: 1, py: 8 }}
      >
        <Container maxWidth='lg'>
          <Stack spacing={3}>
            <Stack direction='row' 
              justifyContent='space-between' 
              spacing={4}
            >
              <Typography variant='h4'>
                Détails sur la bouteille
              </Typography>
            </Stack>
            
            {isConsigned && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Cette bouteille est consignée et ne peut pas être modifiée.
              </Alert>
            )}
            
            <div>
              <Grid container 
                spacing={3}
              >
                <Grid xs={12}>
                  <MaterialDetailOverview data={materialData} />
                </Grid>
                
                {/* Always show the detail section, but pass isConsigned to make it non-editable */}
                <Grid xs={12}>
                  <MaterialDetailEdit 
                    data={materialData}
                    canEdit={canEdit && !isConsigned} // Override canEdit if consigned
                    userRole={user?.role}
                    isConsigned={isConsigned} // Pass the consigned status
                  />
                </Grid>

                {/* Only show delete button if not consigned and user has permission */}
                {canDelete && !isConsigned && (
                  <Grid xs={12}>
                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                      <Button
                        fullWidth
                        variant='contained'
                        color='error'
                        onClick={() => {
                          setOpen(true);
                          setDialogSubject('delete');
                        }}
                        startIcon={(
                          <SvgIcon fontSize='small'>
                            <DeleteIcon />
                          </SvgIcon>
                        )}
                      >
                        Supprimer la bouteille
                      </Button>
                    </CardActions>

                    <Dialog open={open} 
                      onClose={() => setOpen(false)}
                    >
                      <DialogTitle>{getDialogDetails().title}</DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          {getDialogDetails().content}
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={() => setOpen(false)}>
                          Annuler
                        </Button>
                        <Button onClick={getDialogDetails().action} 
                          color="error"
                        >
                          {getDialogDetails().buttonText}
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </Grid>
                )}
              </Grid>
            </div>
          </Stack>
        </Container>
      </Box>
    </>
  );
}

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;