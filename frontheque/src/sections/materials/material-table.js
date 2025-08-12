import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CircularProgress,
  InputAdornment,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  OutlinedInput,
  IconButton,
  SvgIcon,
  Stack, 
  Typography,
  Tooltip,
  Box,
  Grid,
  Button
} from '@mui/material';
import config from 'src/utils/config';
import PropTypes from 'prop-types';
import { InformationCircleIcon, MagnifyingGlassCircleIcon } from "@heroicons/react/24/outline";
import { TagSearch } from '../tags/tag-search';

export const MaterialTable = (props) => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [isCheckedInformation, setCheckedInformation] = useState(false);

  const handleInformationShow = useCallback(() => {
    setCheckedInformation(!isCheckedInformation);
  }, [isCheckedInformation]);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/materials/`);
        if (!response.ok) throw new Error('Failed to fetch materials');
        const data = await response.json();
        setMaterials(data);
        setFilteredMaterials(data);
        setTotalCount(data.length);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMaterials();
  }, []);

  useEffect(() => {
    let filtered = [...materials];
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((material) => {
        return (
          (material.material_title && material.material_title.toLowerCase().includes(searchLower)) ||
          (material.team && material.team.toLowerCase().includes(searchLower)) ||
          (material.owner_first_name && material.owner_first_name.toLowerCase().includes(searchLower)) || 
          (material.owner_last_name && material.owner_last_name.toLowerCase().includes(searchLower))
        );
      });
    }

    // Apply tag filter if tags are selected
    if (selectedTags.length > 0) {
      filtered = filtered.filter(material => {
        if (!material.tags) return false;
        return selectedTags.every(tag => material.tags.includes(tag));
      });
    }
    
    setFilteredMaterials(filtered);
    setTotalCount(filtered.length);
    setPage(0);
  }, [searchTerm, materials, selectedTags]);

  const handleServerSearch = (results) => {
    setFilteredMaterials(results);
    setTotalCount(results.length);
    setPage(0);
  };

  const handleTagSelection = (tags) => {
    setSelectedTags(tags);
  };

  const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString() : '-';

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const resetAllFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
    setFilteredMaterials(materials);
    setTotalCount(materials.length);
  };

  const currentPageMaterials = filteredMaterials.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) return <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />;
  if (error) return <Typography color="error" align="center">Error: {error}</Typography>;

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 2 }}>
            <Stack direction='row' spacing={2} alignItems='center'>
              <OutlinedInput
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
                placeholder='Nom de bouteille ou Equipe ou Nom du responsable'
                startAdornment={(
                  <InputAdornment position='start'>
                    <SvgIcon color='action' fontSize='small'>
                      <MagnifyingGlassCircleIcon />
                    </SvgIcon>
                  </InputAdornment>
                )}
                sx={{ 
                  flex: 1,
                  '& .MuiInputBase-input::placeholder': {
                    color: 'lightgray',
                    opacity: 1,
                  }
                }}
              />
              <IconButton onClick={handleInformationShow}>
                <SvgIcon fontSize='small'>
                  <InformationCircleIcon />
                </SvgIcon>
              </IconButton>
              {(searchTerm || selectedTags.length > 0) && (
                <Button onClick={resetAllFilters} variant="outlined">
                  Réinitialiser
                </Button>
              )}
            </Stack>
            {isCheckedInformation && (
              <Stack spacing={2} sx={{
                my: 1,
                p: 1,
                bgcolor: '#f5f5f5',
                border: '1px solid #ccc',
                borderRadius: 0,
                maxWidth: '100%',
                borderBottomRightRadius: 65
              }}>
                <Typography color="neutral.500" variant="caption">
                  Recherche par Nom de bouteille, Equipe ou Nom du responsable (ex. Marmottant, BIOP)
                </Typography>
              </Stack>
            )}
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, height: '100%' }}>
            <TagSearch 
              onMaterialsFound={handleServerSearch}
              onTagSelection={handleTagSelection}
              onReset={() => {
                setSelectedTags([]);
                setFilteredMaterials(materials);
                setTotalCount(materials.length);
              }}
            />
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              {['Composition du gaz', 'Equipe', 'Nom du responsable', 'Salle de stockage', 'Taille de la bouteille', 'Date d\'arrivée', 'Date de départ'].map((header) => (
                <TableCell
                  key={header}
                  style={{
                    backgroundColor: 'rgb(1, 50, 32)',
                    color: 'white'
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {currentPageMaterials.map((material) => {
              const hasDepartDate = Boolean(material.date_depart);
              const rowStyle = {
                backgroundColor: hasDepartDate ? 'rgb(229, 228, 226)' : 'inherit',
                opacity: hasDepartDate ? 0.6 : 1,
                cursor: 'pointer'
              };
              const tooltipTitle = hasDepartDate ? 'Archived - not editable' : 'Click to edit';

              return (
                <Tooltip title={tooltipTitle} key={material.material_id}>
                  <Link
                    underline="none"
                    color="inherit"
                    href={`/gazostheque/details/material-detail/${material.material_id}`}
                    style={{ display: 'contents' }}
                  >
                    <TableRow style={rowStyle}>
                      <TableCell>{material.material_title}</TableCell>
                      <TableCell>{material.team}</TableCell>
                      <TableCell>{material.owner_first_name} {material.owner_last_name}</TableCell>
                      <TableCell>{material.origin}</TableCell>
                      <TableCell>{material.size}</TableCell>
                      <TableCell>{formatDate(material.date_arrivee)}</TableCell>
                      <TableCell>{formatDate(material.date_depart)}</TableCell>
                    </TableRow>
                  </Link>
                </Tooltip>
              );
            })}
          </TableBody>
        </Table>

        <TablePagination 
          component="div"
          count={totalCount}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[25, 50, 100, 150, 200, 250]}
        />
      </TableContainer>
    </>
  );
};

MaterialTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};