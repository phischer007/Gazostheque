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
    Card, 
    CardActions,
    Unstable_Grid2 as Grid 
} from '@mui/material';
import { PublicLayout } from 'src/layouts/public/public-layout';
import { MaterialDetailOverview } from 'src/sections/material-detail/material-detail-overview';
import React, { useState, useEffect, useCallback, use } from 'react';

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
          // Format date_arrivee for display if needed
          const formattedData = {
            ...data,
            date_arrivee: data.date_arrivee ? new Date(data.date_arrivee).toLocaleDateString() : null
          };
          setMaterialData(formattedData);
        })
        .catch(error => console.error('Error fetching data:', error));
    }
  }, [materialId]);

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
                  <Typography><strong>Code Commande:</strong> { materialData.codeCommande }</Typography>
                  <Typography><strong>Code Barres:</strong> { materialData.codeBarres } </Typography>
                  <Typography><strong>Date d&apos;arrivée:</strong> { materialData.date_arrivee } </Typography>
                </Stack>
              </Card>
            )}

            {/* <Stack spacing={1}>
              <Button

              >
                Départ
              </Button>
            </Stack> */}

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


// import Head from 'next/head';
// import config from 'src/utils/config';
// import { useRouter } from 'next/router';
// import { 
//     Box, 
//     Container, 
//     Stack, 
//     Typography, 
//     Button, 
//     Divider, 
//     Card, 
//     CardActions,
//     Unstable_Grid2 as Grid 
// } from '@mui/material';
// import { PublicLayout } from 'src/layouts/public/public-layout';
// import { MaterialDetailOverview } from 'src/sections/material-detail/material-detail-overview';
// import React, { useState, useEffect, useCallback } from 'react';

// const Page = () => {
//   const router = useRouter();
//   const { materialId } = router.query;
//   const [materialData, setMaterialData] = useState(null);
//   const [showDetails, setShowDetails] = useState(false); // State to control detail visibility
//   const [isLoading, setIsLoading] = useState(false); // Loading state

//   useEffect(() => {
//     if (materialId) {
//       fetchMaterialData();
//     }
//   }, [materialId]);

//   const fetchMaterialData = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch(`${config.apiUrl}/materials/${materialId}`);
//       const data = await response.json();
//       const formattedData = {
//         ...data,
//         date_arrivee: data.date_arrivee ? new Date(data.date_arrivee).toLocaleDateString() : null
//       };
//       setMaterialData(formattedData);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const toggleDetails = () => {
//     setShowDetails(!showDetails);
//   };

//   return (
//     <>
//       <Head>
//         <title>
//           Informations de base sur la bouteille
//         </title>
//       </Head>
//       <Box
//         component='main'
//         sx={{
//           flexGrow: 1,
//           py: 8
//         }}
//       >
//         <Container maxWidth='lg'>
//           <Stack spacing={3} gap={2}>
//             <Stack direction='row' justifyContent='space-between' spacing={4}>
//               <Typography variant='h5'>
//                 Informations de base sur la bouteille
//               </Typography>
//             </Stack>

//             <MaterialDetailOverview 
//               data={materialData}
//               mode={'public'}
//             />

//             <Stack spacing={1}>
//               <Button 
//                 variant="contained" 
//                 onClick={toggleDetails}
//                 disabled={isLoading}
//               >
//                 {showDetails ? 'Masquer les détails' : 'Afficher les détails'}
//               </Button>
//             </Stack>

//             {/* Additional details display - now conditional */}
//             {showDetails && materialData && (
//               <Card>
//                 <Stack spacing={2} sx={{ p: 3 }}>
//                   <Typography variant="h6">
//                     Détails sur la bouteille
//                   </Typography>
//                   <Divider />
//                   <Typography><strong>Salle de stockage:</strong> {materialData.origin}</Typography>
//                   <Typography><strong>Code Commande:</strong> {materialData.codeCommande}</Typography>
//                   <Typography><strong>Code Barres:</strong> {materialData.codeBarres}</Typography>
//                   <Typography><strong>Date d&apos;arrivée:</strong> {materialData.date_arrivee}</Typography>
//                 </Stack>
//               </Card>
//             )}

//           </Stack>
//         </Container>
//       </Box>
//     </>
//   );
// }

// Page.getLayout = (page) => (
//   <PublicLayout>
//     {page}
//   </PublicLayout>
// );

// export default Page;