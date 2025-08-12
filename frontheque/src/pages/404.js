import Head from 'next/head';
import NextLink from 'next/link';
import ArrowLeftIcon from '@heroicons/react/24/solid/ArrowLeftIcon';
import { Box, Button, Container, SvgIcon, Typography } from '@mui/material';

const logoUrl = process.env.NEXT_PUBLIC_ASSETS + 'images/app/error.png';

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
          <img
            alt="En cours de développement"
            src={logoUrl}
            style={{
              display: 'inline-block',
              maxWidth: '100%',
              width: '100%'
            }}
          />
          
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