"use client";

import { Bounce, ToastContainer } from 'react-toastify';
import { useTheme } from '@mui/material/styles';

const ThemedToastContainer = () => {
  const theme = useTheme();
  const toastTheme = theme.palette.mode === 'dark' ? 'dark' : 'light';

  return <ToastContainer theme={toastTheme} position='top-center' closeButton={false} transition={Bounce} />;
};

export default ThemedToastContainer;
