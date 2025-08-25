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
  const [allTags, setAllTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isCheckedInformation, setCheckedInformation] = useState(false);

  // Fetch all materials and tags
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch materials
        const materialsResponse = await fetch(`${config.apiUrl}/materials/`);
        if (!materialsResponse.ok) {
          throw new Error('Failed to fetch materials');
        }
        const materialsData = await materialsResponse.json();
        setMaterials(materialsData);
        setFilteredMaterials(materialsData);
        setTotalCount(materialsData.length);
        
        // Try to fetch tags from dedicated endpoint
        try {
          const tagsResponse = await fetch(`${config.apiUrl}/materials/tags/`);
          if (tagsResponse.ok) {
            const tagsData = await tagsResponse.json();
            setAllTags(tagsData.tags || []);
          } else {
            // Fallback: extract tags from materials
            const tagsFromMaterials = materialsData.flatMap(material => material.tags || []);
            const uniqueTags = [...new Set(tagsFromMaterials)];
            setAllTags(uniqueTags);
          }
        } catch (tagsErr) {
          console.error('Error fetching tags:', tagsErr);
          // Fallback: extract tags from materials
          const tagsFromMaterials = materialsData.flatMap(material => material.tags || []);
          const uniqueTags = [...new Set(tagsFromMaterials)];
          setAllTags(uniqueTags);
        }
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle tag selection
  const handleTagClick = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedTags([]);
    setSearchTerm('');
  };

  // Apply filters when search term or selected tags change
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
    
    // Apply tag filter - must match ALL selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(material => 
        selectedTags.every(tag => material.tags && material.tags.includes(tag))
      );
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

  // Function to get tag color
  const getTagColor = (tag) => {
    const tagColors = {
      fragile: 'error',
      electronic: 'primary',
      chemical: 'warning',
      heavy: 'secondary',
      urgent: 'error',
      storage: 'info',
      equipment: 'success',
      tool: 'success',
    };
    
    return tagColors[tag.toLowerCase()] || 'default';
  };

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
            placeholder='Composition du gaz ou Equipe ou Nom du responsable ou Code Barres'
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
              Recherche par Composition du Gaz, Equipe ou Nom du responsable ou Code Barres (ex. Marmottant, BIOP, 0000468286)
            </Typography>
          </Stack>
        )}
      </Card>

      {/* Tags filter section */}
      <Box sx={{ mt: 2, mb: 2, p: 2, backgroundColor: '#f9f9f9', borderRadius: 1, border: '1px solid #e0e0e0' }}>
        <Typography variant="subtitle1" 
          sx={{ mb: 1, fontWeight: 'bold' }}
        >
          Filtrer par mots-clés :  
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {allTags.map(tag => (
            <Chip
              key={tag}
              label={tag}
              onClick={() => handleTagClick(tag)}
              color={getTagColor(tag)}
              variant={selectedTags.includes(tag) ? "filled" : "outlined"}
              clickable
              sx={{ 
                fontWeight: selectedTags.includes(tag) ? 'bold' : 'normal',
                borderWidth: selectedTags.includes(tag) ? 2 : 1
              }}
            />
          ))}
          {allTags.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              Aucun mot-clé disponible
            </Typography>
          )}
        </Box>
        
        {(selectedTags.length > 0 || searchTerm) && (
          <Box sx={{ 
            mt: 2, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1, 
            flexWrap: 'wrap' 
            }}
          >
            {selectedTags.length > 0 && (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 0.5, 
                flexWrap: 'wrap' 
                }}
              >
                <Typography variant="body2">
                  Mots-clés:
                </Typography>
                {selectedTags.map(tag => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    color={getTagColor(tag)}
                    onDelete={() => handleTagClick(tag)}
                    sx={{ ml: 0.5 }}
                  />
                ))}
              </Box>
            )}
            
            <Button 
              onClick={clearFilters}
              size="small"
              variant="outlined"
              sx={{ ml: 1 }}
            >
              Réinitialiser tous les filtres
            </Button>
          </Box>
        )}
      </Box>

      {/* Results summary */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {filteredMaterials.length} bouteille(s) trouvé(s) sur {materials.length}
          {selectedTags.length > 0 && ` avec le(s) mot(s)-clé(s): ${selectedTags.join(', ')}`}
        </Typography>
      </Box>

      <TableContainer component={Paper} 
        // sx={{ mt: 2 }}
        sx={{
          mt: 2,
          border: 1.5,
          borderColor: 'divider',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)'
        }}
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
          labelRowsPerPage="Lignes par page:"
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} sur ${count !== -1 ? count : `plus que ${to}`}`
          }
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