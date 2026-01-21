'use client';

import React from 'react';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { useTheme, Box } from '@mui/material';

const rotate = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const StyledWrapper = styled(Box)`
  .loader,
  .loader::before,
  .loader::after {
    border-width: 2px;
    border-style: solid;
    border-radius: 10px;
    animation: ${rotate} 5s linear infinite;
  }

  .loader {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 50px;
    height: 50px;
    border-color: ${(props) => props.theme.palette.primary.main};
  }

  .loader::before,
  .loader::after {
    position: absolute;
    content: "";
  }

  .loader::before {
    border-color: ${(props) => props.theme.palette.secondary.main};
    width: 110%;
    height: 110%;
    animation-delay: 0.5s;
  }

  .loader::after {
    border-color: ${(props) =>
      props.theme.palette.mode === 'dark'
        ? props.theme.palette.info.dark
        : props.theme.palette.info.main};
    width: 120%;
    height: 120%;
    animation-delay: 0.1s;
  }
`;

const LoaderOverlay = styled(Box)`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    /* Glass effect */
    background-color: ${(props) =>
      props.theme.palette.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.5)'
        : 'rgba(255, 255, 255, 0.5)'};
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
`;


const GlobalLoader = () => {
  const theme = useTheme();
  return (
    <LoaderOverlay theme={theme}>
        <StyledWrapper theme={theme}>
          <div className="loader" />
        </StyledWrapper>
    </LoaderOverlay>
  );
};

export default GlobalLoader;