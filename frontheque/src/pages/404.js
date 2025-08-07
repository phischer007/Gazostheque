import Head from 'next/head';
import NextLink from 'next/link';
import ArrowLeftIcon from '@heroicons/react/24/solid/ArrowLeftIcon';
import { Box, Button, Container, SvgIcon, Typography } from '@mui/material';


const Page = () => (
  <>
    <Head>
      <title>
        404 | Gazotheque
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexGrow: 1,
        minHeight: '100%'
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Typography
            align="center"
            sx={{ mb: 3 }}
            variant="h3"
          >
            Oops !
          </Typography>
          <Typography>
            404 : La page n&apos;a pas été trouvée
          </Typography>
          
          <Button
            component={NextLink}
            href="/"
            startIcon={(
              <SvgIcon fontSize="small">
                <ArrowLeftIcon />
              </SvgIcon>
            )}
            sx={{ mt: 3 }}
            variant="contained"
          >
            Retourner à Tableau au bord
          </Button>
        </Box>
      </Container>
    </Box>
  </>
);

export default Page;