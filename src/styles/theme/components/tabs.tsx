import type { Components } from '@mui/material/styles';
import { tabClasses } from '@mui/material/Tab';
import { tabsClasses } from '@mui/material/Tabs';
 
import type { Theme } from '@/styles/theme/types';
 
export const MuiTabs = {
  styleOverrides: {
    flexContainer: {
      [`&:not(.${tabsClasses.flexContainerVertical})`]: {
        gap: '0px',
        display: 'flex',
        alignItems: 'stretch'
      }
    },
    indicator: { display: 'none' }, // Hide the default indicator since we're using custom borders
    vertical: {
      [`& .${tabsClasses.indicator}`]: {
        borderBottomRightRadius: '4px',
        borderTopRightRadius: '4px',
        left: 0,
        right: 'auto',
        width: '4px',
      },
      [`& .${tabClasses.root}`]: { justifyContent: 'flex-start', paddingInline: '24px' },
    },
  },
} satisfies Components<Theme>['MuiTabs'];