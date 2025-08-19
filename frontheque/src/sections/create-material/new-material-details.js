import { useState } from 'react';
import { withRouter } from 'next/router';
import { useTheme } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
    Alert,
    Autocomplete,
    Box,
    Card,
    CardContent,
    CardHeader,
    Chip,
    Select,
    SvgIcon,
    TextField,
    Typography,
    Unstable_Grid2 as Grid,
    MenuItem,
    Button,
    CardActions,
} from '@mui/material';

import { Loading } from 'src/sections/loader/loader-card';
import ArrowDownOnSquareStackIcon from '@heroicons/react/24/solid/ArrowDownOnSquareStackIcon';
import { useNewMaterialHandlers } from 'src/hooks/new-material-handlers';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// ------------------------------------------------------------------------------------- //

const NewMaterialDetails = (props) => {
  const theme = useTheme();
  const ownersArray = props.ownersList ? Object.values(props.ownersList) : [];
  const [tagInput, setTagInput] = useState('');

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

  const lab_choices = [
    { value: 'LIPhy', label: 'LIPhy'},
    { value: 'IGE', label: 'IGE'},
  ];

  const {
    formData,
    message,
    formErrors,
    isUploading,
    selectedOwner,
    onSelectChange,
    handleChange,
    handleSubmit,
    handleDateChange,
    tags,
    handleAddTag,
    handleDeleteTag,
  } = useNewMaterialHandlers(ownersArray);

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      handleAddTag(tagInput.trim());
      setTagInput('');
    }
  };

  return (
    <form
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit}
    >
      <Card
        sx={{
          border: 1.5,
          borderColor: 'divider'
        }}
      >
        <CardHeader subheader="Completez les informations" />
        <CardContent sx={{ pt: 2}}>
          <Box
            sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
          >
            <Typography variant='overline'>
                Informations générales
            </Typography>
          </Box>
          <Grid
            container
            spacing={3}
          >
            <Grid item
              xs={12}
              sm={6}
            >
              <TextField 
                fullWidth
                label="Composition du gaz"
                name="material_title"
                onChange={handleChange}
                type='text'
                required
                error={formErrors.title}
              />
            </Grid>
            <Grid item
              xs={12}
              sm={6}
            >
              {
                ownersArray && (
                  <Autocomplete 
                    required
                    options={ownersArray}
                    getOptionLabel={option => option.owner_name}
                    value={selectedOwner}
                    onChange={onSelectChange}
                    renderInput={params => (
                      <TextField 
                        {...params}  
                        variant='standard'
                        label='Nom du responsable'
                        margin='normal'
                        error={formErrors.owner}
                        sx={{ marginTop: 0 }}
                        fullWidth
                      />
                    )}
                  />
                )
              }
            </Grid>
            <Grid item
             xs={12}
             sm={6}
            >
              <Select
                fullWidth
                labelId='equipe-select'
                name='team'
                value={formData.team}
                onChange={handleChange}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: '200px',
                      overflowY: 'auto',
                    },
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: formErrors.team ? 'red' : null,
                  },
                  '&:hover': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'transparent',
                      },
                    },
                }}
                displayEmpty
                renderValue={(selected) => (
                  <Typography
                    variant="subtitle2"
                    style={{
                      fontFamily: 'inherit',
                      color: selected ? 'inherit' : theme.palette.text.secondary
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
            <Grid item
              xs={12}
              sm={6}
            >
              <TextField 
                fullWidth
                label='Salle de stockage'
                name='origin'
                error={formErrors.origin}
                onChange={handleChange}
                type='text'
                required
              />
            </Grid>
          </Grid>
        </CardContent>

        {/* <CardContent>
          <Box>
            <Grid item 
              xs={12}
              sm={12}
              lg={6} 
              md={12}
            >
              <InputTags />
            </Grid>
          </Box>
        </CardContent> */}

        {/* Tags Section */}
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="overline">Tags</Typography>
          </Box>
          <Grid container 
            spacing={3}
          >
            <Grid item 
              xs={12}
            >
              <TextField
                fullWidth
                label="Ajouter des tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                helperText="Appuyez sur Entrée pour ajouter un tag"
              />
              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => handleDeleteTag(tag)}
                    sx={{ 
                      backgroundColor: theme.palette.primary.light, 
                      color: 'white',
                      '& .MuiChip-deleteIcon': {
                        color: 'white',
                      }
                    }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
        {/* End of Tags Section */}

        <CardContent>
          <Box
            sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
          >
            <Typography variant="overline">Caractéristiques de la bouteille</Typography>
          </Box>
          <Grid
            container
            spacing={3}
          >
            <Grid item
              xs={12}
              sm={6}
            >
              <TextField 
                fullWidth
                label='Code commande Air Liquide'
                name='codeCommande'
                value={formData.codeCommande}
                onChange={handleChange}
                type='text'
                required
              />
            </Grid>
            <Grid item
              xs={12}
              sm={6}
            >
              <TextField 
                fullWidth
                label='Code barres Air Liquide'
                name='codeBarres'
                value={formData.codeBarres}
                onChange={handleChange}
                type='text'
                required
              />
            </Grid>
            <Grid item
              xs={12}
              sm={6}
            >
              <Select
                fullWidth
                labelId='taille-select'
                name='size'
                value={formData.size}
                onChange={handleChange}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: '200px',
                      overflowY: 'auto',
                    },
                  },
                }}
                displayEmpty
                renderValue={(selected) => (
                  <Typography
                    variant="subtitle2"
                    style={{
                      fontFamily: 'inherit',
                      color: selected ? 'inherit' : theme.palette.text.secondary
                    }}
                  >
                    {selected || 'Choisir la taille de la bouteille'}
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
            <Grid item
              xs={12}
              sm={6}
            >
              <Select
                fullWidth
                labelId='risque-select'
                name='levRisk'
                value={formData.levRisk}
                onChange={handleChange}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: '200px',
                      overflowY: 'auto',
                    },
                  },
                }}
                displayEmpty
                renderValue={(selected) => (
                  <Typography
                    variant="subtitle2"
                    style={{
                      fontFamily: 'inherit',
                      color: selected ? 'inherit' : theme.palette.text.secondary
                    }}
                  >
                    {selected || 'Risque associé à la bouteille'}
                  </Typography>
                )}
              >
                <MenuItem value=""> <em>Réinitialiser</em> </MenuItem>
                {risque.map((levRisk, index) => (
                  <MenuItem key={index} 
                    value={levRisk.value}
                  >
                    {levRisk.label}
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
                  value={formData.date_arrivee}
                  onChange={handleDateChange}
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
              sm={6}
            >
              <Select
                fullWidth
                labelId='lab-destination-select'
                name='lab_destination'
                value={formData.lab_destination}
                onChange={handleChange}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: '200px',
                      overflowY: 'auto',
                    },
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: formErrors.lab_destination ? 'red' : null,
                  },
                  '&:hover': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'transparent',
                      },
                    },
                }}
                displayEmpty
                renderValue={(selected) => (
                  <Typography
                    variant="subtitle2"
                    style={{
                      fontFamily: 'inherit',
                      color: selected ? 'inherit' : theme.palette.text.secondary
                    }}
                  >
                    {selected || 'Associer la bouteille à un laboratoire'}
                  </Typography>
                )}
              >
                <MenuItem value=""> <em>Réinitialiser</em> </MenuItem>
                {lab_choices.map((lab_destination, index) => (
                  <MenuItem key={index} 
                    value={lab_destination.value}
                  >
                    {lab_destination.label}
                  </MenuItem> 
                ))}
              </Select>
            </Grid>
          </Grid>
        </CardContent>

        {message && message.status && (
          <Grid item 
            xs={12} 
            sm={6}
          >
            <Alert severity={message.status}> {message.value}</Alert>
          </Grid>)
        }
      </Card>

      {/* Function for saving information related to bottle */}
      <Card
        sx={{
          border: 1.5,
          borderColor: 'divider',
        }}
      >
        <CardActions
          sx={{ justifyContent: 'flex-end' }}
        >
          <Button
            fullWidth
            variant="contained"
            type="submit"
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
                  backgroundColor: '#004d00',
                },
              gap: 1,
              borderColor: 'rgb(1, 50, 32)'
            }}
          >
            Enregistrer
          </Button>
          {isUploading && (
            <Loading message={'Enregistrement...'} />
          )}
        </CardActions>
      </Card>
    </form>
  );
};

export default withRouter(NewMaterialDetails);