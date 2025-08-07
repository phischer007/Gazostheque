import { useCallback } from 'react';
import { toast } from 'react-toastify';
import Tooltip from '@mui/material/Tooltip';
import { 
    Avatar, 
    Box, 
    Card, 
    CardContent, 
    Typography, 
    Grid, 
    Divider, 
    CardActions, 
    Button,
    Stack, 
} from '@mui/material';
import { SeverityPill } from 'src/components/severity-pill';


export const MaterialDetailOverview = (props) => {
  const data = props.data
  const material_number = `Gazotheque-${data?.material_id.toString().padStart(3, '0')}`;

  const printQRCodeAndMaterialNumber = useCallback(() => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; }
              img { margin-top: 10px; }
              h5 { margin-top: -50px; }
            </style>
          </head>
          <body>
            <img src="data:image/png;base64,${data.qrcode}" alt="QRCode" style="width: 250px; height: 250px; object-fit: cover;"/>
            <h5> ${material_number} </h5>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  }, [data, material_number]);
  
  return data ? (
    <Card>
      <CardContent>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
          }}
        >
          <Grid
            container
            xs={12}
            sx={{
                justifyContent: 'flex-end',
                position: 'absolute'
            }}
          >

          </Grid>

          {!props.mode && <Avatar
              variant="square"
              sx={{
                height: 250,
                width: 250,
              }}
            >
              <img
                src={`data:image/png;base64,${data.qrcode}`}
                alt="QRCode"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Avatar>
          }

          <Typography
            gutterBottom
            variant='h6'
          >
            {data.material_title}
          </Typography>
          <Typography
            gutterBottom
            variant='h6'
          >
            Owner : {data.owner_details.first_name} {data.owner_details.last_name}
          </Typography>
          <Typography
            color="text.secondary"
            variant="body2"
          >
            Contact : {data.owner_details.email}
          </Typography>
          <Typography
            color="text.secondary"
            variant="body2"
          >
            Numéro de la bouteille : {material_number}
          </Typography>
        </Box>
      </CardContent>
      {!props.mode && <>
        <Divider />
        <CardActions style={{ display: 'flex', justifyContent: 'center' }}>
          <Button variant="text" 
            onClick={printQRCodeAndMaterialNumber}
          >
            Imprimer le code QRCode et le numéro d&apos;article
          </Button>  
        </CardActions>
      </>}
    </Card>
  )
  : (
    <Card>
      <CardContent>
        <Typography
          gutterBottom
          variant="h5"
        >
          Erreur : Aucun enregistrement de bouteille de gaz n&apos;a été trouvé dans le système.!!
        </Typography>
      </CardContent>
    </Card>
  );
}