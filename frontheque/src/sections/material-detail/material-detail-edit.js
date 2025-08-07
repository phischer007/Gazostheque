import { useCallback, useState, useEffect } from 'react';
import { useAuth } from 'src/hooks/use-auth';
import { toast } from 'react-toastify';
import config from 'src/utils/config';
import moment from 'moment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ArrowDownOnSquareStackIcon from '@heroicons/react/24/solid/ArrowDownOnSquareStackIcon';
import { 
    Box, 
    Button, 
    Card, 
    CardActions, 
    CardContent, 
    CardHeader,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider, 
    SvgIcon,
    TextField, 
    Unstable_Grid2 as Grid, 
} from '@mui/material';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import InputTags from 'src/sections/tags/input-tag';

// ------------------------------------------------------------------------ //

export const MaterialDetailEdit = (props) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({});
  const [materialID, setMaterialID] = useState(null);
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleDateChange = (date) => {
    setFormData((prevState) => ({
      ...prevState,
      date_depart: date,
    }));
  };

  const handleChange = useCallback(
    (event) => {
      setFormData((prevData) => ({
        ...prevData,
        [event.target.name]: event.target.value
      }));
    },
    []
  );

  useEffect(() => {
    // Check if user is admin
    const checkAdminStatus = () => {
      if (user && user.role === 'admin') {
        setIsAdmin(true);
        setIsFormDisabled(false);
      } else if (user && props.data && user.id !== props.data.owner) {
        // Disable form if current user is not the owner
        setIsFormDisabled(true);
      }
    };
  
    // Initialize form data when props.data is available
    const initializeFormData = () => {
      if (props.data) {
        setMaterialID(props.data.material_id);
        setFormData({
          material_title: props.data.material_title || '',
          team: props.data.team || '',
          origin: props.data.origin || '',
          codeCommande: props.data.codeCommande || '',
          codeBarres: props.data.codeBarres || '',
          size: props.data.size || '',
          levRisk: props.data.levRisk || '',
          // date_depart: null, // Initialize as null to force a new date input
          date_depart: props.data.date_depart ? new Date(props.data.date_depart) : null,
        });
      }
    };
  
    checkAdminStatus();
    initializeFormData();
  }, [user, props.data]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      
      // Validate that a new date is selected
      if (!formData.date_depart) {
        toast.error("Veuillez sélectionner une nouvelle date de départ");
        return;
      }
  
      // Format the date properly before submission
      const formattedDate = formData.date_depart ? moment(formData.date_depart).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]') : null;
  
      const dataToSend = {
        ...formData,
        date_depart: formattedDate, // Ensure new date is included
      };
  
      if (materialID) {
        const response = await fetch(`${config.apiUrl}/materials/${materialID}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend),
        });
  
        if (!response.ok) {
          const errorMessage = await response.text();
          let decodeResponse = JSON.parse(errorMessage);
          toast.error(decodeResponse.message, { autoClose: false });
        } else {
          toast.success("Les détails de la bouteille ont été mis à jour avec succès !");
          window.location.reload(); // Refresh to show the new date
        }
      }
    },
    [formData, materialID]
  );

  

  return props.data && user ? (
    <>
      <form
          autoComplete="off"
          noValidate
          onSubmit={handleSubmit}
      >
        <Card elevation={2} 
          sx={{ my: 3, py: 2 }}
        >
          <CardHeader 
            subheader={!isFormDisabled ? 
              "Les informations peuvent être modifiées" : 
              "Seul l'administrateur ou le propriétaire peut modifier ces informations"}
            title="Détails sur la bouteille"
          />
          <CardContent sx={{ pt: 0 }}>
            <Box sx={{ m: -1.5 }}>
              <Grid container 
                spacing={3}
              >
                <Grid xs={12} 
                  md={6}
                >
                  <TextField 
                    fullWidth
                    label="Composition du gaz"
                    disabled={isFormDisabled}
                    name='material_title'
                    onChange={handleChange}
                    value={formData.material_title || ''}
                  />
                </Grid>
                <Grid xs={12} 
                  md={6}
                >
                  <TextField
                    fullWidth
                    label="Nom du responsable"
                    name="owner"
                    disabled
                    value={props.data.owner_details ? 
                      `${props.data.owner_details.first_name} ${props.data.owner_details.last_name}` : 
                      'N/A'}
                  />
                </Grid>
                <Grid xs={12} 
                  md={6}
                >
                  <TextField 
                    fullWidth
                    label="Equipe"
                    name='team'
                    disabled={isFormDisabled}
                    onChange={handleChange}
                    value={formData.team || ''}
                  />
                </Grid>
                <Grid xs={12} 
                  md={6}
                >
                  <TextField 
                    fullWidth
                    label="Salle de stockage"
                    name='origin'
                    disabled={isFormDisabled}
                    onChange={handleChange}
                    value={formData.origin || ''}
                  />
                </Grid>
                {/* <Grid
                  xs={12}
                  md={6}
                >
                  <InputTags />
                </Grid> */}
                <Grid xs={12} 
                  md={6}
                >
                  <TextField 
                    fullWidth
                    label="Code barres Air Liquide"
                    name='codeCommande'
                    disabled={isFormDisabled}
                    onChange={handleChange}
                    value={formData.codeCommande || ''}
                  />
                </Grid>
                <Grid xs={12} 
                  md={6}
                >
                  <TextField 
                    fullWidth
                    label="Code commande Air Liquide"
                    name='codeBarres'
                    disabled={isFormDisabled}
                    onChange={handleChange}
                    value={formData.codeCommande || ''}
                  />
                </Grid>
                <Grid xs={12} 
                  md={6}
                >
                  <TextField 
                    fullWidth
                    label="Taille de la bouteille"
                    name='size'
                    disabled={isFormDisabled}
                    onChange={handleChange}
                    value={formData.size || ''}
                  />
                </Grid>
                <Grid xs={12} 
                  md={6}
                >
                  <TextField 
                    fullWidth
                    label="Risque associé à la bouteille"
                    name='levRisk'
                    disabled={isFormDisabled}
                    onChange={handleChange}
                    value={formData.levRisk || ''}
                  />
                </Grid>

                <Grid item 
                  xs={12} 
                  md={6}
                >
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Date départure"
                      format="dd/MM/yyyy"
                      value={formData.date_depart}
                      onChange={handleDateChange}
                      disabled={isFormDisabled}
                      slotProps={{
                        textField: {
                          helperText: 'DD/MM/YYYY',
                          fullWidth: true,
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
            
          <Divider />
          {!isFormDisabled && (
            <Grid
              xs={12}
            >
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button
                  fullWidth
                  // type='submit'
                  onClick={() => setOpenDialog(true)} // Open dialog on click
                  variant='contained'
                  startIcon={(
                    <SvgIcon fontSize='small'>
                      <ArrowDownOnSquareStackIcon />
                    </SvgIcon>
                  )}
                  sx={{
                    py: 1.1,
                    justifyContent: 'center',
                    textTransform: 'none',
                    backgroundColor: 'rgb(1, 50, 32)',
                    color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgb(1, 50, 32)',
                      },
                    gap: 1,
                    borderColor: 'rgb(1, 50, 32)'
                  }}
                >
                  Mise à jour des détails
                </Button>
              </CardActions>
            </Grid>
          )}
        </Card>           
      </form>

      {/* Dialog */}
      <Dialog open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirmer la mise à jour
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Êtes-vous sûr de vouloir mettre à jour les détails de cette bouteille?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} 
            color="primary"
          >
            Annuler
          </Button>
          <Button 
            onClick={(e) => {
              setOpenDialog(false);
              handleSubmit(e);
            }} 
            color="success" 
            autoFocus
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  ) : <p>Chargement en cours...</p>;
};