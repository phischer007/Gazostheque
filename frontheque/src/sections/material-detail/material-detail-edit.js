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
  Typography, 
  MenuItem,
  Select,
  Unstable_Grid2 as Grid, 
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

/* ------------------------------------------------------------------------------ */

export const MaterialDetailEdit = (props) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    material_title: '',
    team: '',
    origin: '',
    codeCommande: '',
    codeBarres: '',
    size: '',
    levRisk: '',
    date_arrivee: null,
    date_depart: null,
  });
  const [materialID, setMaterialID] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  
  // Permission checks
  const isAdmin = props.userRole === 'admin' || props.userRole === 'Admin';
  const isOwner = props.data && user && props.data.owner_details?.user_id === user.user_id;

  // Field-level permission check -  if consigned, no fields can be edited
  const canEditField = (fieldName) => {
    if (props.isConsigned) return false; // Override all permissions if consigned
    if (isAdmin) return true;
    if (isOwner && fieldName === 'origin') return true;
    return false;
  };

  const equipe = [ 
    { value: 'BIOP', label: 'BIOP' }, 
    { value: 'ECCEL', label: 'ECCEL' }, 
    { value: 'LAME', label: 'LAME' }, 
    { value: 'MICROTISS', label: 'MICROTISS' }, 
    { value: 'MOVE', label: 'MOVE' }, 
    { value: 'MC2', label: 'MC2' }, 
    { value: 'PSM', label: 'PSM' }, 
    { value: 'MODI', label: 'MODI' }, 
    { value: 'OPTIMA', label: 'OPTIMA' }, 
    { value: 'Atelier', label: 'Atelier' }, 
    { value: 'M2Bio', label: 'M2Bio' }, 
    { value: 'MicroFab', label: 'MicroFab' } 
  ];

  const taille = [ 
    { value: 'S02', label: 'S02' }, 
    { value: 'S05', label : 'S05'}, 
    { value: 'S11', label: 'S11' },
    { value: 'M20', label: 'M20' }, 
    { value: 'L50', label: 'L50' }, 
    { value: 'Cartouche', label: 'Cartouche' },
  ];
    
  const risque = [ 
    { value: 'Gaz neutre', label: 'Gaz neutre'},
    { value: 'Inflammable', label: 'Inflammable'}, 
    { value: 'Comburant', label: 'Comburant'} 
  ];

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
        date_arrivee: props.data.date_arrivee ? new Date(props.data.date_arrivee) : null,
        date_depart: props.data.date_depart ? new Date(props.data.date_depart) : null,
      });
    }
  }, [props.data]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      
      try {
        const formattedDateArrivee = formData.date_arrivee ? moment(formData.date_arrivee).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]') : null;
        const formattedDateDepart = formData.date_depart ? moment(formData.date_depart).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]') : null;
    
        const dataToSend = {
          ...formData,
          date_arrivee: formattedDateArrivee,
          date_depart: formattedDateDepart,
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
            window.location.reload();
          }
        }
      } catch (error) {
        console.error("Update error:", error);
      }
    },
    [formData, materialID]
  );

  return props.data && user ? (
    <>
      <form autoComplete="off" 
        noValidate 
        onSubmit={handleSubmit}
      >
        <Card elevation={2} 
          sx={{ my: 3, py: 2 }}
        >
          <CardHeader 
            subheader={props.isConsigned ? 
              "Cette bouteille est consignée et ne peut pas être modifiée" :
              isAdmin ? 
                "Tous les champs peuvent être modifiés" : 
                isOwner ? "Seul le champ 'Salle de stockage' peut être modifié" :
                "Aucun champ ne peut être modifié"}
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
                    disabled={!canEditField('material_title')}
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
                  <Select
                    fullWidth
                    label="Equipe"
                    name="team"
                    disabled={!canEditField('team')}
                    onChange={handleChange}
                    value={formData.team || ''}
                    displayEmpty
                    renderValue={(selected) => (
                      <Typography
                        variant="subtitle2"
                        style={{
                          fontFamily: 'inherit',
                          color: selected ? 'inherit' : 'rgba(0, 0, 0, 0.6)'
                        }}
                      >
                        {selected || 'Choisir une équipe'}
                      </Typography>
                    )}
                  >
                    <MenuItem value=""> <em>Réinitialiser</em> </MenuItem>
                    {equipe.map((team, index) => (
                      <MenuItem key={index} 
                        value={team.value}
                      >
                        {team.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid xs={12} 
                  md={6}
                >
                  <TextField 
                    fullWidth
                    label="Salle de stockage"
                    name='origin'
                    disabled={!canEditField('origin')}
                    onChange={handleChange}
                    value={formData.origin || ''}
                  />
                </Grid>
                <Grid xs={12} 
                  md={6}
                >
                  <TextField 
                    fullWidth
                    label="Code barres Air Liquide"
                    name='codeCommande'
                    disabled={!canEditField('codeCommande')}
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
                    disabled={!canEditField('codeBarres')}
                    onChange={handleChange}
                    value={formData.codeBarres || ''}
                  />
                </Grid>
                <Grid xs={12} 
                  md={6}
                >
                  <Select
                    fullWidth
                    label="Taille de la bouteille"
                    name="size"
                    disabled={!canEditField('size')}
                    onChange={handleChange}
                    value={formData.size || ''}
                    displayEmpty
                    renderValue={(selected) => (
                      <Typography
                        variant="subtitle2"
                        style={{
                          fontFamily: 'inherit',
                          color: selected ? 'inherit' : 'rgba(0, 0, 0, 0.6)'
                        }}
                      >
                        {selected || 'Choisir la taille'}
                      </Typography>
                    )}
                  >
                    <MenuItem value=""> <em>Réinitialiser</em> </MenuItem>
                    {taille.map((size, index) => (
                      <MenuItem key={index} 
                        value={size.value}
                      >
                        {size.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid xs={12} 
                  md={6}
                >
                  <Select
                    fullWidth
                    label="Risque associé à la bouteille"
                    name="levRisk"
                    disabled={!canEditField('levRisk')}
                    onChange={handleChange}
                    value={formData.levRisk || ''}
                    displayEmpty
                    renderValue={(selected) => (
                      <Typography
                        variant="subtitle2"
                        style={{
                          fontFamily: 'inherit',
                          color: selected ? 'inherit' : 'rgba(0, 0, 0, 0.6)'
                        }}
                      >
                        {selected || 'Choisir le risque'}
                      </Typography>
                    )}
                  >
                    <MenuItem value=""> <em>Réinitialiser</em> </MenuItem>
                    {risque.map((risk, index) => (
                      <MenuItem key={index} 
                        value={risk.value}
                      >
                        {risk.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>

                <Grid item 
                  xs={12} 
                  sm={6}
                >
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker 
                      label="Date d'arrivée"
                      format="dd/MM/yyyy"
                      disabled={!canEditField('date_arrivee')}
                      value={formData.date_arrivee}
                      onChange={(date) => {
                        setFormData((prevState) => ({
                          ...prevState,
                          date_arrivee: date,
                        }));
                      }}
                      slotProps={{
                        textField: {
                          helperText: 'DD/MM/YYYY',
                          fullWidth: true
                        }
                      }}
                    />
                  </LocalizationProvider>
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
                      disabled={!canEditField('date_depart')}
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

          {/* Only show update button if not consigned and user has edit permissions */}
          {(isAdmin || isOwner) && !props.isConsigned && (
            <Grid xs={12}>
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button
                  fullWidth
                  type='button'
                  onClick={() => setOpenDialog(true)}
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

      {/* Dialog for update confirmation - only show if not consigned */}
      {!props.isConsigned && (
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
      )}

    </>
  ) : <p>Chargement en cours...</p>;
};