import {
  useTheme,
  useMediaQuery,
} from '@mui/material';

export const isMobile = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const theme = useTheme();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useMediaQuery(theme.breakpoints.down('sm'));
};

export const isTablet = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const theme = useTheme();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useMediaQuery(theme.breakpoints.down('md'));
};

export const isDesktop = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const theme = useTheme();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useMediaQuery(theme.breakpoints.up('sm'));
};

export const isDesktop2 = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const theme = useTheme();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useMediaQuery(theme.breakpoints.up('md'));
};
