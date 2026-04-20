// TabAtom.tsx
import { Box, Tab, Tabs } from '@mui/material';
import React from 'react';
export interface TabOption<T = string> {
  label: string;
  value: T;
}

interface TabAtomProps<T = string> {
  tabs: TabOption<T>[];
  activeTab: T;
  onChange: (value: T) => void;
  variant?: 'standard' | 'scrollable' | 'fullWidth';
  centered?: boolean;
  sx?: object;
}

export default function TabAtom<T = string>({
  tabs,
  activeTab,
  onChange,
  variant = 'fullWidth',
  centered = false,
  sx = {},
}: Readonly<TabAtomProps<T>>): React.ReactElement {
  const handleChange = (_: React.SyntheticEvent, newValue: T) => {
    onChange(newValue);
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', ...sx }}>
      <Tabs
        value={activeTab}
        onChange={handleChange}
        variant={variant}
        centered={centered}
        textColor="primary"
        indicatorColor="primary"
      >
        {tabs.map((tab) => (
          <Tab
            key={String(tab.value)}
            label={tab.label}
            value={tab.value}
            sx={{
              textTransform: 'none',
              fontWeight: activeTab === tab.value ? 600 : 400,
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
}
