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
  Tooltip
} from '@mui/material';
import config from 'src/utils/config';
import PropTypes from 'prop-types';

import { 
  InformationCircleIcon,
  MagnifyingGlassCircleIcon
} from "@heroicons/react/24/outline";

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

  const [isCheckedInformation, setCheckedInformation] = useState(false);

  // useCallback must also be at the top
  const handleInformationShow = useCallback(() => {
    setCheckedInformation(!isCheckedInformation);
  }, [isCheckedInformation]);


  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/materials/`);
        if (!response.ok) {
          throw new Error('Failed to fetch materials');
        }
        const data = await response.json();
        setMaterials(data);
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
    if (searchTerm === '') {
      setFilteredMaterials(materials);
      setTotalCount(materials.length);
      setPage(0);
    } else {
      const filtered = materials.filter((material) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          (material.material_title && material.material_title.toLowerCase().includes(searchLower)) ||
          (material.team && material.team.toLowerCase().includes(searchLower)) ||
          (material.owner_first_name&& material.owner_first_name.toLowerCase().includes(searchLower)) || 
          (material.owner_last_name&& material.owner_last_name.toLowerCase().includes(searchLower))
        );
      });
      setFilteredMaterials(filtered);
      setTotalCount(filtered.length);
      setPage(0);
    }
  }, [searchTerm, materials]);
  

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
    return date.toLocaleDateString(); // Adjust format as needed
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when rows per page changes
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
            placeholder='Nom de bouteille ou Equipe ou Nom du responsable'
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
              Recherche par Nom de bouteille, Equipe ou Nom du responsable (ex. Marmottant, BIOP)
            </Typography>
          </Stack>
        )}
      </Card>

      <TableContainer component={Paper}>
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
              const hasDepartDate = material.date_depart !== null && material.date_depart !== undefined && material.date_depart !== '';
              // const rowStyle = hasDepartDate ? { backgroundColor: 'rgb(229, 228, 226' } : {};

              const rowStyle = {
                backgroundColor: hasDepartDate ? 'rgb(229, 228, 226)' : 'inherit',
                opacity: hasDepartDate ? 0.6 : 1,
                cursor: 'pointer'
              };

              const tooltipTitle = hasDepartDate ? 'Consignée – non modifiable' : 'Cliquer pour modifier';

              const rowContent = (
                <TableRow key={material.material_id}
                  style={rowStyle}
                >
                  <TableCell>{material.material_title}</TableCell>
                  <TableCell>{material.team}</TableCell>
                  <TableCell>
                    {material.owner_first_name} {material.owner_last_name}
                  </TableCell>
                  <TableCell>{material.origin}</TableCell>
                  <TableCell>{material.size}</TableCell>
                  <TableCell>{formatDate(material.date_arrivee)}</TableCell>
                  <TableCell>{formatDate(material.date_depart)}</TableCell>
                </TableRow>
              );

              // return hasDepartDate ? (
              //   <React.Fragment key={material.material_id}>
              //     {rowContent}
              //   </React.Fragment>
              // ) : (
              //   <Link
              //     key={material.material_id}
              //     underline='none'
              //     color="inherit"
              //     href={`/gazostheque/details/material-detail/${material.material_id}`}
              //     style={{ display: 'contents' }}
              //   >
              //     {rowContent}
              //   </Link>
              // );

              return (
                <Tooltip title={tooltipTitle} key={material.material_id}>
                  <Link
                    underline="none"
                    color="inherit"
                    href={`/gazostheque/details/material-detail/${material.material_id}`}
                    style={{ display: 'contents' }}
                  >
                    {rowContent}
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