'use client';

import { Box, Link as MuiLink } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

import AtomTypography from '@/components/atoms/typography';
import { config } from '@/config';
import { dayjs } from '@/lib/dayjs';
import { paths } from '@/paths';

/**
 * Footer Component
 *
 * A responsive footer component with social links and legal information
 * Follows SOLID principles:
 * - Single Responsibility: Handles only footer functionality
 * - Open/Closed: Extensible through props without modification
 * - Liskov Substitution: Can be used anywhere a footer is needed
 * - Interface Segregation: Clean, focused interface
 * - Dependency Inversion: Depends on abstractions (theme)
 *
 * Follows KISS principle: Simple, focused functionality
 * Follows DRY principle: Reusable across the application
 */
const DashboardFooter = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const currentYear = dayjs().year();

  return (
    // Main footer container with theme-based styling
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.secondary,
        px: { xs: 3, md: 8 },
        py: { xs: 3, lg: 2 },
        marginTop: 'auto',
        width: '100%',
      }}
    >
      {/* Content container with responsive layout */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'center', md: 'center' },
          justifyContent: { xs: 'center', md: 'space-between' },
          gap: { xs: 2, md: 0 },
          textAlign: { xs: 'center', md: 'left' },
        }}
      >
        {/* Left Section - Copyright */}
        <Box
          sx={{
            order: { xs: 1, md: 1 },
            fontSize: { xs: '0.875rem', sm: '0.9rem' },
            fontWeight: 400,
          }}
        >
          <AtomTypography
            variant="body4"
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: 'inherit',
            }}
          >
            {t('footer:copyright')} {currentYear}
          </AtomTypography>
        </Box>

        {/* Center Section - Social Links */}
        {/* Responsive social media links with hover effects */}
        <Box
          sx={{
            order: { xs: 2, md: 2 },
            display: 'flex',
            gap: { xs: 3, sm: 4 },
            alignItems: 'center',
          }}
        >
          {config.social.twitter && (
            <MuiLink
              href={config.social.twitter}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: theme.palette.text.secondary,
                textDecoration: 'none',
                fontSize: { xs: '0.875rem', sm: '0.9rem' },
                fontWeight: 400,
                transition: 'color 0.2s ease',
                '&:hover': {
                  color: theme.palette.primary.main,
                  textDecoration: 'none',
                },
              }}
            >
              {t('footer:twitter')}
            </MuiLink>
          )}
          {config.social.discord && (
            <MuiLink
              href={config.social.discord}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: theme.palette.text.secondary,
                textDecoration: 'none',
                fontSize: { xs: '0.875rem', sm: '0.9rem' },
                fontWeight: 400,
                transition: 'color 0.2s ease',
                '&:hover': {
                  color: theme.palette.primary.main,
                  textDecoration: 'none',
                },
              }}
            >
              {t('footer:discord')}
            </MuiLink>
          )}
          {config.social.telegram && (
            <MuiLink
              href={config.social.telegram}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: theme.palette.text.secondary,
                textDecoration: 'none',
                fontSize: { xs: '0.875rem', sm: '0.9rem' },
                fontWeight: 400,
                transition: 'color 0.2s ease',
                '&:hover': {
                  color: theme.palette.primary.main,
                  textDecoration: 'none',
                },
              }}
            >
              {t('footer:telegram')}
            </MuiLink>
          )}
        </Box>

        {/* Right Section - Legal Links */}
        {/* Privacy policy and terms of service links */}
        <Box
          sx={{
            order: { xs: 3, md: 3 },
            display: 'flex',
            gap: { xs: 3, sm: 4 },
            alignItems: 'center',
          }}
        >
          <Link href={paths.privacyPolicy} target="_blank" style={{ textDecoration: 'none' }}>
            <AtomTypography
              sx={{
                color: theme.palette.text.secondary,
                fontSize: { xs: '0.875rem', sm: '0.9rem' },
                fontWeight: 400,
                transition: 'color 0.2s ease',
                '&:hover': {
                  color: theme.palette.primary.main,
                },
              }}
            >
              {t('footer:privacyPolicy')}
            </AtomTypography>
          </Link>
          <Link href={paths.termsOfService} target="_blank" style={{ textDecoration: 'none' }}>
            <AtomTypography
              sx={{
                color: theme.palette.text.secondary,
                fontSize: { xs: '0.875rem', sm: '0.9rem' },
                fontWeight: 400,
                transition: 'color 0.2s ease',
                '&:hover': {
                  color: theme.palette.primary.main,
                },
              }}
            >
              {t('footer:termsOfService')}
            </AtomTypography>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardFooter;
