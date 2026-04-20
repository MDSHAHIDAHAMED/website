import Box from '@mui/material/Box';
import * as React from 'react';

export interface SplitLayoutProps {
  children: React.ReactNode;
  backgroundVideoSrc?: string;
}

export function SplitLayout({ children, backgroundVideoSrc }: Readonly<SplitLayoutProps>): React.JSX.Element {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 50%' }, height:'100vh' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'var(--mui-palette-background-level1)',
          flexDirection: 'column',
          height: '100%',
          p: 3,
        }}
      >
        <Box sx={{ width: { xs: '100%', sm: '70%' }, mx: 'auto' }}>{children}</Box>
      </Box>
      <Box sx={{ boxShadow: 'var(--mui-shadows-8)',display: { xs: 'none', lg: 'flex' }, flexDirection: 'column', width: '100%', height: '100%', overflow: 'hidden' }} >
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            justifyContent: 'center',
            height: '100%',
            bgcolor:'background.default',
            position: 'relative',
            overflow: 'hidden',
            rotate: '90deg'
          }}
        >
        </Box>
      </Box>
    </Box>
  );
}
