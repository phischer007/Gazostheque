import Head from 'next/head';
import config from 'src/utils/config';
import { useRouter } from 'next/router';
import { 
    Box, 
    Container, 
    Stack, 
    Typography, 
    Button, 
    Divider, 
    Card 
} from '@mui/material';
import { PublicLayout } from 'src/layouts/public/public-layout';
import { MaterialDetailOverview } from 'src/sections/material-detail/material-detail-overview';
import React, { useState, useEffect } from 'react';

// -------------------------------------------------------------------------------------------------- //


const Page = () => {
  const router = useRouter();
  const { materialId } = router.query;
  const [materialData, setMaterialData] = useState(null);

  useEffect(() => {
    if (materialId) {
      fetch(`${config.apiUrl}/materials/${materialId}`)
        .then(response => response.json())
        .then(data => {
          // Format date_arrivee and date_depart for display if needed
          const formattedData = {
            ...data,
            date_arrivee: data.date_arrivee ? new Date(data.date_arrivee).toLocaleDateString() : null,
            date_depart: data.date_depart ? new Date(data.date_depart).toLocaleDateString() : null
          };
          setMaterialData(formattedData);
        })
        .catch(error => console.error('Error fetching data:', error));
    }
  }, [materialId]);

  const handleEditClick = () => {
    if (materialId) {
      router.push(`/details/material-detail/${materialId}`);
    }
  };

  

  return (
    <>
      <Head>
        <title>
          Informations de base sur la bouteille
        </title>
      </Head>
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth='lg'>
          <Stack spacing={3}
            gap={2}
          >
            <Stack
              direction='row'
              justifyContent='space-between'
              spacing={4}
            >
              <Typography variant='h5'>
                Informations de base sur la bouteille
              </Typography>

            </Stack>

            <MaterialDetailOverview 
              data={materialData}
              mode={'public'}
            />

            {/* Additional details display */}
            {materialData && (
              <Card>
                <Stack spacing={2} 
                  sx={{ p: 3 }}
                >
                  <Typography variant="h6">
                    Détails sur la bouteille
                  </Typography>
                  <Divider />
                  <Typography><strong>Salle de stockage:</strong> { materialData.origin } </Typography>
                  <Typography><strong>Code Commande:</strong> { materialData.codeCommande } </Typography>
                  <Typography><strong>Code Barres:</strong> { materialData.codeBarres } </Typography>
                  <Typography><strong>Date d&apos;arrivée:</strong> { materialData.date_arrivee } </Typography>
                  <Typography><strong>Date départ:</strong> { materialData.date_depart } </Typography>
                </Stack>
              </Card>
            )}

            <Button
              variant="contained"
              onClick={handleEditClick}
              sx={{
                backgroundColor: 'rgb(1, 50, 32)',
                '&:hover': {
                  backgroundColor: 'rgb(1, 70, 42)',
                },
              }}
              >
                Modifier
              </Button>


          </Stack>
        </Container>
      </Box>
    </>
  );
}

Page.getLayout = (page) => (
  <PublicLayout>
    {page}
  </PublicLayout>
);

export default Page;