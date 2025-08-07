import { TagIcon } from "@heroicons/react/24/solid";
import { Stack, Typography, Chip } from "@mui/material";
import { Box } from "@mui/system";

const Tags = ({ text }) => {
  return (
    <Chip
      label={text}
      sx={{ 
        margin: '0.2rem',
        backgroundColor: 'success.lightest' 
      }}   
    />
  );
};

export default Tags;