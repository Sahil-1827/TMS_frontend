import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) => createTheme({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: {
            main: '#4f46e5',
            light: '#e0e7ff',
            dark: '#4338ca',
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#10b981',
            light: '#d1fae5',
            dark: '#059669',
            contrastText: '#ffffff',
          },
          info: {
            main: '#3b82f6',
            light: '#eff6ff',
            dark: '#1d4ed8',
          },
          background: {
            default: '#ffffff',
            paper: '#ffffff',
          },
          text: {
            primary: '#1e293b',
            secondary: '#475569',
          },
          divider: '#e2e8f0',
        }
      : {
          primary: {
            main: '#818cf8',
            light: '#a5b4fc',
            dark: '#4f46e5',
            contrastText: '#1e293b',
          },
          secondary: {
            main: '#34d399',
            light: '#a7f3d0',
            dark: '#059669',
            contrastText: '#1e293b',
          },
          info: {
            main: '#1e40af',
            light: '#2d3748',
            dark: '#60a5fa',
          },
          background: {
            default: '#0f172a',
            paper: '#1e293b',
          },
          text: {
            primary: '#f1f5f9',
            secondary: '#94a3b8',
          },
          divider: '#334155',
        }),
  },
  typography: {
    fontFamily: '"Averia Libre", "Sour Gummy", "Manrope", "Noto Sans", sans-serif',
    h2: {
      fontWeight: 900,
      fontSize: 'clamp(2rem, 5vw, 3rem)',
    },
    h3: {
      fontWeight: 700,
      fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
    },
    h4: {
      fontWeight: 700,
      fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
    },
    h6: {
      fontWeight: 700,
      fontSize: '1.125rem',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: (theme) => ({
        '*::-webkit-scrollbar': {
          width: '6px',
        },
        '*::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '*::-webkit-scrollbar-thumb': {
          background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          borderRadius: '3px',
        },
        '*::-webkit-scrollbar-thumb:hover': {
          background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
        },
      }),
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: '12px',
          boxShadow: 'none',
          border: `1px solid ${theme.palette.divider}`,
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.default,
          boxShadow: 'none',
        }),
      },
    },
    MuiTableContainer: {
        styleOverrides: {
            root: {
                borderRadius: '12px',
            }
        }
    },
    MuiTableCell: {
      styleOverrides: {
        head: ({ theme }) => ({
          backgroundColor: theme.palette.mode === 'light' ? '#f8fafc' : '#334155',
          fontWeight: 'bold',
        }),
      },
    },
  },
});

export default getTheme('light');