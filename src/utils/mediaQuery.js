import {
  useTheme,
  useMediaQuery,
} from '@material-ui/core';

export const isMobile = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const theme = useTheme();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useMediaQuery(theme.breakpoints.down('sm'));
};
