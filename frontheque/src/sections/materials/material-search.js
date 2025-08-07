import { useState, useCallback } from "react";
import { 
    Card,
    InputAdornment,
    OutlinedInput,
    IconButton,
    SvgIcon,
    Stack, 
    Typography
} from '@mui/material';
import { 
    InformationCircleIcon,
    MagnifyingGlassCircleIcon
} from "@heroicons/react/24/outline";

// --------------------------------------------------------------- //

export const MaterialSearch = ({ searchTerm, onSearchChange }) => {
  const [isCheckedInformation, setCheckedInformation] = useState(false);
  const handleInformationShow = useCallback(() => {
    setCheckedInformation(!isCheckedInformation);
  }, [isCheckedInformation]);

  return (
    <Card sx={{ p: 2, maxWidth: 800 }}>
      <Stack
        direction='row'
        spacing={2}
        alignItems='center'
      >
        <OutlinedInput
          value={searchTerm}
          onChange={onSearchChange}
          fullWidth
          placeholder='Nom de bouteille ou Nom du responsable ou Code commande ou Code barres ou QRCode'
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
            Recherche par Nom de bouteille, Nom du responsable, Code commande, Code barres, QRCode (ex. Gazostheque-001, type 001)
          </Typography>
        </Stack>
      )}
    </Card>
  )
};