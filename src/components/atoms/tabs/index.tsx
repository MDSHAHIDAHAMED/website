'use client';

import { Box, styled, Tab, Tabs } from '@mui/material';
import { kebabCase } from 'change-case';
import * as React from 'react';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  showSection: boolean;
}

type Variant = 'fullWidth' | 'scrollable' | 'standard';

export interface CustomTabOptionProps {
  label: React.ReactNode | string;
  value: string | number;
  wrapped?: boolean;
  tabContentData?: React.ReactNode;
}

interface CustomTabsProps {
  id?: string;
  value?: number;
  centered?: boolean;
  variant?: Variant;
  color?: 'primary' | 'secondary';
  tabsData: CustomTabOptionProps[];
  onTabChange?: (event: React.SyntheticEvent, newValue: CustomTabOptionProps) => void;
  width?: string;
  showSection?: boolean;
}

// -----------------------------------------------------------------------------
// Helper: Accessibility props
// -----------------------------------------------------------------------------

const a11yProps = (index: number) => ({
  id: `aithentic-tab-${index}`,
  'aria-controls': `aithentic-tabpanel-${index}`,
  'data-testid': `qa-${kebabCase(index.toString())}`,
});

// -----------------------------------------------------------------------------
// Component: Tab Panel
// -----------------------------------------------------------------------------

const CustomTabPanel: React.FC<TabPanelProps> = ({ children, value, index, showSection }) => {
  if (value !== index) return null; // Early return: simpler, faster

  return (
    showSection && (<Box
      role="tabpanel"
      id={`aithentic-tabpanel-${index}`}
      aria-labelledby={`aithentic-tab-${index}`}
      sx={{ pt: '40px' }} // consistent spacing unit
    >
      {children}
    </Box>)
  );
};

// -----------------------------------------------------------------------------
// Component: Tabs
// -----------------------------------------------------------------------------

const AtomTabs: React.FC<CustomTabsProps> = ({
  id = 'tab-item',
  value = 0,
  centered = false,
  variant = 'fullWidth',
  color = 'secondary',
  tabsData,
  width = '100%',
  onTabChange,
  showSection = true,
}) => {
  const [tabValue, setTabValue] = React.useState(value);

  // Keep internal and external sync in check
  React.useEffect(() => {
    setTabValue(value);
  }, [value]);

  const handleChange = (event: React.SyntheticEvent, newValue: number): void => {
    setTabValue(newValue);
    onTabChange?.(event, tabsData[newValue]);
  };

  return (
    <Box sx={{ width: width }}>
      {/* Header Tabs */}
      <StyledContainer>
        <Tabs
          value={tabValue}
          onChange={handleChange}
          aria-label={`${id}-tabs`}
          id={id}
          data-testid={`qa-${kebabCase(id)}`}
          variant={variant}
          textColor="inherit"
          indicatorColor={color}
          centered={centered}
          allowScrollButtonsMobile
          scrollButtons="auto"
          sx={{ width: width }}
        >
          {tabsData.map((item, index) => (
            <Tab
              key={item.value ?? index}
              label={item.label}
              wrapped={item.wrapped}
              disableRipple
              {...a11yProps(index)}
              sx={{
                py: 0,
              }}
            />
          ))}
        </Tabs>
      </StyledContainer>

      {/* Panels */}
      {tabsData.map((item, index) => (
        <CustomTabPanel key={item.value ?? index} value={tabValue} index={index} showSection={showSection}>
          {item.tabContentData}
        </CustomTabPanel>
      ))}
    </Box>
  );
};

export default AtomTabs;

// -----------------------------------------------------------------------------
// Styles
// -----------------------------------------------------------------------------

const StyledContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingInline: theme.spacing(0),
  width: '100%',
}));
