/* eslint-disable react-hooks/rules-of-hooks */
import { useTheme, useMediaQuery } from '@mui/material';

export function isMobile() {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down('md'));
}
