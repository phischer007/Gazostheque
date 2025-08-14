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
  Chip,
  Box, 
  Button
} from '@mui/material';
import config from 'src/utils/config';
import PropTypes from 'prop-types';

import { InformationCircleIcon, MagnifyingGlassCircleIcon } from "@heroicons/react/24/outline";

// ---------------------------------------------------------- //

export const MaterialTable = (props) => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [allTags, setAllTags] = useState([]); // State to store all available tags

  const [tags, setTags] = useState([]);

  const [selectedTags, setSelectedTags] = useState([]); // State to store selected tags
  const [isCheckedInformation, setCheckedInformation] = useState(false);


  // Fetch all materials
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/materials/`);
        if (!response.ok) {
          throw new Error('Failed to fetch materials');
        }
        const data = await response.json();
        setMaterials(data);
        setFilteredMaterials(data); // Initialize filtered materials with all materials
        setTotalCount(data.length);

        const allTags = data.flatMap(material => material.tags || []);
        const uniqueTags = [...new Set(allTags)];
        
        setTags(uniqueTags);
        setLoading(false);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);


  // useEffect(() => {
  //   if (selectedTags.length === 0) return;

  //   const fetchMaterialsByTags = async () => {
  //     try {
  //       const tagsQuery = selectedTags.join(',');
  //       const response = await fetch(`${config.apiUrl}/materials/tags/?tags=${encodeURIComponent(tagsQuery)}`);
        
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch materials by tags');
  //       }
        
  //       const data = await response.json();
  //       setMaterials(data.results);
  //     } catch (err) {
  //       setError(err.message);
  //     }
  //   };

  //   fetchMaterialsByTags();
  // }, [selectedTags]);


  const handleTagClick = (tag) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setMaterials([]);
  };

  useEffect(() => {
    let filtered = materials;
    
    // Apply search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((material) => {
        return (
          (material.material_title && material.material_title.toLowerCase().includes(searchLower)) ||
          (material.team && material.team.toLowerCase().includes(searchLower)) ||
          (material.owner_first_name && material.owner_first_name.toLowerCase().includes(searchLower)) || 
          (material.owner_last_name && material.owner_last_name.toLowerCase().includes(searchLower)) ||
          (material.codeBarres && material.codeBarres.toLowerCase().includes(searchLower))
        );
      });
    }
        
    setFilteredMaterials(filtered);
    setTotalCount(filtered.length);
    setPage(0);
  }, [searchTerm, selectedTags, materials]);

  const handleInformationShow = useCallback(() => {
    setCheckedInformation(!isCheckedInformation);
  }, [isCheckedInformation]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Typography color="error" 
        align="center"
      >
        Error: {error}
      </Typography>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString(); 
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const currentPageMaterials = filteredMaterials.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <Card sx={{ p: 2, maxWidth: 800 }}>
        <Stack
          direction='row'
          spacing={2}
          alignItems='center'
        >
          <OutlinedInput
            value={searchTerm}
            onChange={handleSearchChange}
            fullWidth
            placeholder='Nom de bouteille ou Equipe ou Nom du responsable ou Code Barres'
            startAdornment={(
              <InputAdornment position='start'>
                <SvgIcon
                  color='action'
                  fontSize='small'
                >
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
        </Stack>
        {isCheckedInformation && (
          <Stack spacing={2}
            sx={{
              my: 1,
              p: 1,
              bgcolor: '#f5f5f5',
              border: '1px solid #ccc',
              borderRadius: 0,
              maxWidth: 715,
              borderBottomRightRadius: 65
            }}>
            <Typography
              color="neutral.500"
              variant="caption"
            >
              Recherche par Nom de bouteille, Equipe ou Nom du responsable ou Code Barres (ex. Marmottant, BIOP, 0000468286)
            </Typography>
          </Stack>
        )}
      </Card>

      {/* Tags filter section */}
      {/* <Box sx={{ mt: 2, mb: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
        <Typography variant="subtitle2" 
          sx={{ mb: 1 }}
        >
          Filtrer par mots-clés :  
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1}}>
          {tags.map(tag => (
            <Button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`tag ${selectedTags.includes(tag) ? 'active' : ''}`}
              sx={{
                backgroundColor: 'rgb(1, 50, 32)', 
                color: 'white',
                '&:hover': {
                  backgroundColor: '#004d00', // darker green on hover
                },
                '&.active': {
                  backgroundColor: '#003300', 
                  border: '2px solid #001a00'
                }
              }}
            >
              {tag}
            </Button>
          ))}
        </Box>
        {selectedTags.length > 0 && (
          <div className="selected-tags">
            <p>Selected tags: {selectedTags.join(', ')}</p>
            <Button onClick={clearFilters}>
              Clear filters
            </Button>
          </div>
        )}

        {(selectedTags.length > 0 || searchTerm) && (
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2">
              {selectedTags.length > 0 && `Tags sélectionnés: ${selectedTags.join(', ')}`}
              {selectedTags.length > 0 && searchTerm && ' • '}
              {searchTerm && `Recherche: "${searchTerm}"`}
            </Typography>
            <Button 
              onClick={clearFilters}
              size="small"
              variant="outlined"
              sx={{ ml: 1 }}
            >
              Réinitialiser les filtres
            </Button>
          </Box>
        )}
      </Box> */}

      <TableContainer component={Paper} 
        sx={{ mt: 2 }}
      >
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
              const tooltipTitle = hasDepartDate ? 'Consignée – non modifiable' : 'Cliquer pour modifier';

              return (
                <Tooltip title={tooltipTitle} 
                  key={material.material_id}
                >
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