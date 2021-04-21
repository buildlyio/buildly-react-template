import {
  useTheme,
  useMediaQuery,
} from '@material-ui/core';

export const isMobile = () => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down('sm'));
}
