/**
 * Custom theme configuration for Strong Admin
 */

import { defaultTheme } from 'react-admin';
import { deepmerge } from '@mui/utils';

/**
 * Brand colors - Оранжевый и Черный
 */
const brandColors = {
  primary: {
    main: '#FF6B00', // Оранжевый - основной цвет бренда
    light: '#FF8C33', // Светлый оранжевый
    dark: '#E55D00', // Темный оранжевый
    contrastText: '#fff',
  },
  secondary: {
    main: '#1a1a1a', // Черный - дополнительный цвет
    light: '#2d2d2d', // Темно-серый
    dark: '#000000', // Чистый черный
    contrastText: '#fff',
  },
  background: {
    default: '#f8f8f8', // Очень светлый серый фон
    paper: '#ffffff', // Белые карточки
  },
  text: {
    primary: '#1a1a1a', // Черный текст
    secondary: '#666666', // Серый текст
  },
  error: {
    main: '#d32f2f',
  },
  warning: {
    main: '#FF6B00', // Используем оранжевый для предупреждений
  },
  info: {
    main: '#FF8C33', // Светлый оранжевый для информации
  },
  success: {
    main: '#2e7d32',
  },
};

/**
 * Custom theme
 */
export const customTheme = deepmerge(defaultTheme, {
  palette: {
    ...brandColors,
    mode: 'light',
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1a1a', // Черный AppBar
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          borderRadius: 0, // Убираем border-radius
          // Адаптивная высота для мобильных
          '@media (max-width: 600px)': {
            minHeight: '56px',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(255, 107, 0, 0.3)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #FF6B00 0%, #FF8C33 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #E55D00 0%, #FF6B00 100%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.05)',
          // Адаптивная верстка для мобильных
          '@media (max-width: 600px)': {
            borderRadius: 8,
            margin: '8px 0',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          // Адаптивная верстка для мобильных
          '@media (max-width: 600px)': {
            padding: '8px 4px',
            fontSize: '0.875rem',
          },
        },
        head: {
          fontWeight: 600,
          backgroundColor: '#fafafa',
          borderBottom: '2px solid #FF6B00',
          '@media (max-width: 600px)': {
            fontSize: '0.8125rem',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(255, 107, 0, 0.04)',
          },
        },
      },
    },
    RaMenuItemLink: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 8px',
          transition: 'all 0.2s ease',
          '&.RaMenuItemLink-active': {
            backgroundColor: 'rgba(255, 107, 0, 0.15)',
            color: '#FF6B00',
            fontWeight: 600,
            borderLeft: '3px solid #FF6B00',
          },
          '&:hover': {
            backgroundColor: 'rgba(255, 107, 0, 0.08)',
          },
          // Когда сайдбар закрыт, убираем borderLeft и делаем одинаковые border-radius
          '.RaSidebar-closed &.RaMenuItemLink-active': {
            borderLeft: 'none',
            borderRadius: 8,
          },
        },
      },
    },
    RaLayout: {
      styleOverrides: {
        root: {
          '& .RaLayout-appFrame': {
            marginTop: 0,
          },
          '& .RaLayout-content': {
            backgroundColor: '#f8f8f8',
            marginTop: '64px', // Отступ для контента
            padding: '16px',
            // Адаптивная верстка для мобильных
            '@media (max-width: 600px)': {
              marginTop: '56px', // Меньший отступ на мобильных
              padding: '8px',
            },
          },
        },
      },
    },
    RaSidebar: {
      styleOverrides: {
        root: {
          borderRight: '1px solid rgba(0,0,0,0.08)',
          marginTop: '64px', // Отступ сверху для сайдбара
          height: 'calc(100vh - 64px)', // Высота с учетом AppBar
          // Адаптивная верстка для мобильных
          '@media (max-width: 600px)': {
            marginTop: '56px',
            height: 'calc(100vh - 56px)',
          },
        },
        docked: {
          marginTop: '64px',
          height: 'calc(100vh - 64px)',
          '@media (max-width: 600px)': {
            marginTop: '56px',
            height: 'calc(100vh - 56px)',
          },
        },
        closed: {
          minWidth: '60px', // Минимальная ширина для закрытого сайдбара
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        docked: {
          '&.RaSidebar-closed': {
            minWidth: '60px',
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        primary: {
          background: 'linear-gradient(135deg, #FF6B00 0%, #FF8C33 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #E55D00 0%, #FF6B00 100%)',
          },
        },
      },
    },
    RaDatagrid: {
      styleOverrides: {
        root: {
          // Адаптивная верстка для мобильных
          '@media (max-width: 900px)': {
            '& .RaDatagrid-headerCell': {
              padding: '8px 4px',
            },
            '& .MuiTableCell-root': {
              padding: '8px 4px',
            },
          },
          // Убираем некоторые колонки на маленьких экранах через скрытие
          '@media (max-width: 600px)': {
            '& .column-id': {
              display: 'none',
            },
          },
        },
        table: {
          '@media (max-width: 600px)': {
            minWidth: '100%',
          },
        },
      },
    },
    RaList: {
      styleOverrides: {
        root: {
          '@media (max-width: 600px)': {
            '& .RaList-main': {
              padding: '8px',
            },
          },
        },
      },
    },
    RaFilterForm: {
      styleOverrides: {
        root: {
          // Адаптивная верстка для фильтров
          '@media (max-width: 600px)': {
            flexDirection: 'column',
            '& > *': {
              marginBottom: '8px',
              width: '100%',
            },
          },
        },
      },
    },
  },
});

/**
 * Dark theme variant
 */
export const darkTheme = deepmerge(customTheme, {
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#aaaaaa',
    },
  },
});
