import React, { useState, useEffect } from 'react';
import {
  Box,
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
  TextField,
  Typography
} from '@mui/material';
import config from 'src/utils/config';
import PropTypes from 'prop-types';
import { Search as SearchIcon } from '@mui/icons-material';

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
      const filtered = materials.filter((materials) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          (materials.material_title && materials.material_title.toLowerCase().includes(searchLower))
          (materials.team  && materials.team .toLowerCase().includes(searchLower))
        ) 
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

  // Calculate the current page's materials
  // const currentPageMaterials = materials.slice(
  //   page * rowsPerPage,
  //   page * rowsPerPage + rowsPerPage
  // );
  const currentPageMaterials = filteredMaterials.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Rechercher un matériel..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                style={{
                  backgroundColor: 'rgb(1, 50, 32)',
                  color: 'white'
                }}
              >
                Composition du gaz
              </TableCell>
              <TableCell
                style={{
                  backgroundColor: 'rgb(1, 50, 32)',
                  color: 'white'
                }}
              >
                Equipe
              </TableCell>
              <TableCell
                style={{
                  backgroundColor: 'rgb(1, 50, 32)',
                  color: 'white'
                }}
              >
                Nom du responsable
              </TableCell>
              <TableCell
                style={{
                  backgroundColor: 'rgb(1, 50, 32)',
                  color: 'white'
                }}
              >
                Salle de stockage
              </TableCell>
              <TableCell
                style={{
                  backgroundColor: 'rgb(1, 50, 32)',
                  color: 'white'
                }}
              >
                Taille de la bouteille
              </TableCell>
              <TableCell
                style={{
                  backgroundColor: 'rgb(1, 50, 32)',
                  color: 'white'
                }}
              >
                Date d&apos;arrivée
              </TableCell>
              <TableCell
                style={{
                  backgroundColor: 'rgb(1, 50, 32)',
                  color: 'white'
                }}
              >
                Date de départ
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentPageMaterials.map((material) => {
              const hasDepartDate = material.date_depart !== null && material.date_depart !== undefined && material.date_depart !== '';
              const rowStyle = hasDepartDate ? { backgroundColor: 'rgb(229, 228, 226' } : {};
              
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

              return hasDepartDate ? (
                <React.Fragment key={material.material_id}>
                  {rowContent}
                </React.Fragment>
              ) : (
                <Link
                  key={material.material_id}
                  underline='none'
                  color="inherit"
                  href={`/gazostheque/details/material-detail/${material.material_id}`}
                  style={{ display: 'contents' }}
                >
                  {rowContent}
                </Link>
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