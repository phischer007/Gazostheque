import { useTheme } from '@mui/material/styles';

export const Logo = () => {
  const theme = useTheme();
  const fillColor = theme.palette.primary.main;
  // const logoUrl = process.env.NEXT_PUBLIC_ASSETS + 'images/app/liphy-logo.png';
  const logoUrl = process.env.NEXT_PUBLIC_ASSETS + 'images/app/logo-liphy-blanc.svg';

  return (
    <img
      alt="Logo"
      src={logoUrl}
      height="100%"
      width="100%"
      style={{ fill: fillColor}}
    />
  );
};
