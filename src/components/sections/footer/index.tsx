'use client';

import { Box, Stack, TextField } from '@mui/material';
import { type SxProps, type Theme } from '@mui/material/styles';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { AtomButton } from '@/components/atoms/button';
import CornerContainer from '@/components/atoms/corner-container';
import AtomTypography from '@/components/atoms/typography';
import { paths } from '@/paths';
import { yieldzNeutral, yieldzPrimary } from '@/styles/theme/colors';

// =============================================================================
// Constants & Styles
// =============================================================================

const FOOTER_CONTAINER_SX: SxProps<Theme> = {
  backgroundColor: '#000000',
  color: '#FFFFFF',
  p: { xs: 3, md: 5 },
  width: '100%',
};

const TOP_SECTION_WRAPPER_SX: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },

};

const LEFT_CONTENT_CONTAINER_SX: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
  height: '100%',
};

const LOGO_COLUMN_SX: SxProps<Theme> = {
  p: { xs: 3, md: 4 },
  border: 'none',
};

const NAV_COLUMN_SX: SxProps<Theme> = {
  p: { xs: 3, md: 3 },
};

const NAV_GRID_SX: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
  gap: 4,
};

const LOGO_SECTION_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100%',
  gap: 4,
};

const TAGLINE_SX: SxProps<Theme> = {
  fontWeight: 600,
  lineHeight: 1.1,
  fontSize: { xs: '24px', md: '32px', lg: '42px' },
};

const NAV_HEADER_SX: SxProps<Theme> = {
  fontWeight: 600,
  color: 'text.secondary',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  mb: 2,
};

const NAV_LINK_SX: SxProps<Theme> = {
  textDecoration: 'none',
  transition: 'color 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  gap: 1.5,
};

const NEWSLETTER_WRAPPER_SX: SxProps<Theme> = {
  height: '100%',
};

const NEWSLETTER_SECTION_SX: SxProps<Theme> = {
  p: { xs: 3, md: 5 },
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
};

const NEWSLETTER_TITLE_SX: SxProps<Theme> = {
  fontWeight: 600,
  mb: 4,
  display: 'block',
  textTransform: 'uppercase',
  lineHeight: 1.1,
};

const TEXT_FIELD_SX: SxProps<Theme> = {
  mb: 4,
  '& .MuiInput-root': {
    color: 'text.primary',
    '&:before': { borderBottomColor: 'rgba(255, 255, 255, 0.1)' },
  },
};

const NEWSLETTER_BUTTON_SX: SxProps<Theme> = {
  width: '100%',

};
// =============================================================================
// Main Component
// =============================================================================

const Footer = () => {
  const pathname = usePathname();

  return (
    <Box component="footer" sx={FOOTER_CONTAINER_SX}>
      {/* Top Section */}
      <Box sx={TOP_SECTION_WRAPPER_SX}>
        {/* Left Side: Main Content Box */}
        <CornerContainer
          height="100%"
          sx={{ p: 0, borderColor: yieldzNeutral[900] }}
        >
          <Box sx={LEFT_CONTENT_CONTAINER_SX}>
            {/* Logo & Tagline */}
            <Box sx={LOGO_COLUMN_SX}>
              <Box sx={LOGO_SECTION_SX}>
                <Image
                  src="/assets/icons/Union.svg"
                  alt="Yieldz Logo"
                  width={60}
                  height={60}
                />
                <AtomTypography variant="h3" sx={TAGLINE_SX}>
                  Bitcoin Yield.<br />Real World Assets.
                </AtomTypography>
              </Box>
            </Box>

            {/* Navigation Columns */}
            <Box sx={NAV_COLUMN_SX}>
              <Box sx={NAV_GRID_SX}>
                <Box>
                  <AtomTypography variant="caption" sx={NAV_HEADER_SX}>Explore</AtomTypography>
                  <Stack spacing={1.5}>
                    <Link href="/" style={{ textDecoration: 'none' }}>
                      <Box sx={{ ...NAV_LINK_SX, color: pathname === '/' ? 'text.primary' : 'rgba(255, 255, 255, 0.2)' }}>
                        {pathname === '/' && (
                          <Image
                            src="/assets/icons/left_arrow_footer.svg"
                            alt="Active"
                            width={20}
                            height={20}
                          />
                        )}
                        <AtomTypography variant="h4" sx={{ fontWeight: pathname === '/' ? 600 : 400 }}>Mission</AtomTypography>
                      </Box>
                    </Link>
                    <Link href="/products" style={{ textDecoration: 'none' }}>
                      <Box sx={{ ...NAV_LINK_SX, color: pathname === '/products' ? 'text.primary' : 'text.secondary' }}>
                        {pathname === '/products' && (
                          <Image
                            src="/assets/icons/left_arrow_footer.svg"
                            alt="Active"
                            width={20}
                            height={20}
                          />
                        )}
                        <AtomTypography variant="h4" sx={{ fontWeight: pathname === '/products' ? 600 : 400 }}>Products</AtomTypography>
                      </Box>
                    </Link>
                    <Link href={paths.dashboard.tokens} style={{ textDecoration: 'none' }}>
                      <Box sx={{ ...NAV_LINK_SX, color: pathname === paths.dashboard.tokens ? 'text.primary' : 'rgba(255, 255, 255, 0.2)' }}>
                        {pathname === paths.dashboard.tokens && (
                          <Image
                            src="/assets/icons/left_arrow_footer.svg"
                            alt="Active"
                            width={20}
                            height={20}
                          />
                        )}
                        <AtomTypography variant="h4" sx={{ fontWeight: pathname === paths.dashboard.tokens ? 600 : 400 }}>Tokens</AtomTypography>
                      </Box>
                    </Link>
                    <Link href={paths.auth.custom.signIn} style={{ textDecoration: 'none' }}>
                      <Box sx={{ ...NAV_LINK_SX, color: pathname === paths.auth.custom.signIn ? 'text.primary' : 'rgba(255, 255, 255, 0.2)' }}>
                        {pathname === paths.auth.custom.signIn && (
                          <Image
                            src="/assets/icons/left_arrow_footer.svg"
                            alt="Active"
                            width={20}
                            height={20}
                          />
                        )}
                        <AtomTypography variant="h4" sx={{ fontWeight: pathname === paths.auth.custom.signIn ? 600 : 400 }}>Log In</AtomTypography>
                      </Box>
                    </Link>
                  </Stack>
                </Box>
                <Box>
                  <AtomTypography variant="caption" sx={NAV_HEADER_SX}>Yieldz</AtomTypography>
                  <Stack spacing={1.5}>
                    <Link href={paths.dashboard.blog.list} style={{ textDecoration: 'none' }}>
                      <Box sx={{ ...NAV_LINK_SX, color: pathname === paths.dashboard.blog.list ? 'text.primary' : 'rgba(255, 255, 255, 0.2)' }}>
                        {pathname === paths.dashboard.blog.list && (
                          <Image
                            src="/assets/icons/left_arrow_footer.svg"
                            alt="Active"
                            width={20}
                            height={20}
                          />
                        )}
                        <AtomTypography variant="h4" sx={{ fontWeight: pathname === paths.dashboard.blog.list ? 600 : 400 }}>Blog</AtomTypography>
                      </Box>
                    </Link>
                    <Link href={paths.dashboard.settings.team} style={{ textDecoration: 'none' }}>
                      <Box sx={{ ...NAV_LINK_SX, color: pathname === paths.dashboard.settings.team ? 'text.primary' : 'rgba(255, 255, 255, 0.2)' }}>
                        {pathname === paths.dashboard.settings.team && (
                          <Image
                            src="/assets/icons/left_arrow_footer.svg"
                            alt="Active"
                            width={20}
                            height={20}
                          />
                        )}
                        <AtomTypography variant="h4" sx={{ fontWeight: pathname === paths.dashboard.settings.team ? 600 : 400 }}>Team</AtomTypography>
                      </Box>
                    </Link>
                    <Link href={paths.contact} style={{ textDecoration: 'none' }}>
                      <Box sx={{ ...NAV_LINK_SX, color: pathname === paths.contact ? 'text.primary' : 'rgba(255, 255, 255, 0.2)' }}>
                        {pathname === paths.contact && (
                          <Image
                            src="/assets/icons/left_arrow_footer.svg"
                            alt="Active"
                            width={20}
                            height={20}
                          />
                        )}
                        <AtomTypography variant="h4" sx={{ fontWeight: pathname === paths.contact ? 600 : 400 }}>Contact Us</AtomTypography>
                      </Box>
                    </Link>
                  </Stack>
                </Box>
              </Box>
            </Box>
          </Box>
        </CornerContainer>

        {/* Right Side: Newsletter */}
        <Box sx={NEWSLETTER_WRAPPER_SX}>
          <CornerContainer sx={{ borderColor: yieldzNeutral[900], height: '100%' }}>
            <Box sx={NEWSLETTER_SECTION_SX}>
              <AtomTypography variant="h3" sx={NEWSLETTER_TITLE_SX}>
                Stay ahead of the <br /> future of <span style={{ color: yieldzPrimary[500] }}>BTC</span> wealth
              </AtomTypography>

              <Box>
                <AtomTypography variant="caption" sx={NAV_HEADER_SX}>Email Address</AtomTypography>
                <TextField
                  fullWidth
                  variant="standard"
                  placeholder="matt@properly.studio"
                  sx={TEXT_FIELD_SX}
                />
              </Box>

              <AtomButton
                id="newsletter-signup"
                label="SIGN UP"
                variant='contained'
                sx={NEWSLETTER_BUTTON_SX}
              />
            </Box>
          </CornerContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;