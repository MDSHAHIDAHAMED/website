'use client';

import { Box, Card, Chip, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';

/**
 * Interface for token data structure
 * Follows Interface Segregation Principle - focused interface
 */
interface TokenData {
  id: string;
  name: string;
  abbreviation?: string;
  description: string;
  availability: string;
  lockup: string;
  underlyingAsset: string;
  currentAPY: string;
}

/**
 * FeaturedTokens Component Props
 */
interface FeaturedTokensProps {
  tokens: TokenData[];
}

/**
 * FeaturedTokens Component
 * 
 * A responsive component displaying featured investment tokens
 * Follows SOLID principles:
 * - Single Responsibility: Handles only token display functionality
 * - Open/Closed: Extensible through data props without modification
 * - Liskov Substitution: Can be used anywhere token display is needed
 * - Interface Segregation: Clean, focused data interface
 * - Dependency Inversion: Depends on abstractions (theme, motion)
 * 
 * Follows KISS principle: Simple, focused functionality
 * Follows DRY principle: Reusable across the application
 */
const FeaturedTokens = ({ tokens }: FeaturedTokensProps) => {
  const theme = useTheme();

  return (
    // Main container with theme-based background and responsive padding
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        padding: { xs: '24px 16px', sm: '32px 24px', md: '48px 32px' },
        width: '100%',
      }}
    >
      {/* Cards container with responsive layout */}
      <Box
        sx={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 3, md: 4 },
          alignItems: 'stretch',
        }}
      >
        {/* Render token cards with staggered animations */}
        {tokens.map((token, index) => {
          // Extract abbreviation from name if not provided
          const abbreviation = token.abbreviation ?? token.name.split(' ')[0];
          
          return (
          <motion.div
            key={token.id}
            // Entrance animation with staggered delay
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: index * 0.1,
              ease: "easeOut"
            }}
            // Hover animation for interactive feel
            whileHover={{ 
              y: -8,
              transition: { duration: 0.1 }
            }}
            style={{ flex: 1 }}
          >
            {/* Token card with hover effects */}
            <Card
              sx={{
                padding: '24px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                height: '500px', // Fixed height for uniform appearance
                '&:hover': {
                  boxShadow: theme.shadows[8],
                },
              }}
            >
            {/* Token Header */}
            <Box
              sx={{
                alignItems: 'center',
                gap: 2,
                marginBottom: 3,
              }}
            >
              {/* Token Icon */}
              <Box
                sx={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: theme.palette.text.primary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Typography
                  sx={{
                    color: theme.palette.background.paper,
                  }}
                >
                  Y
                </Typography>
              </Box>

              {/* Token Name and Abbreviation */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 6 }}>
                <Typography
                  variant="h4"
                  sx={{
                    color: theme.palette.text.primary,
                  }}
                >
                  {token.name}
                </Typography>
                <Chip
                  label={abbreviation}
                  size="small"
                  sx={{
                    backgroundColor: theme.palette.grey[100],
                    color: theme.palette.text.secondary,
                    height: '24px',
                  }}
                />
              </Box>
            </Box>

            {/* Description */}
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.secondary,
                marginBottom: 3,
                flex: 1,
              }}
            >
              {token.description}
            </Typography>

            {/* Investment Details */}
            <Box
              sx={{
                borderTop: `1px solid ${theme.palette.divider}`,
                paddingTop: 2,
                marginBottom: 2,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 2,
                }}
              >
                {/* Availability */}
                <Box sx={{ textAlign: 'center', minWidth: '80px', height: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.text.secondary,

                      display: 'block',
                      marginBottom: 0.5,
                    }}
                  >
                    Availability
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: theme.palette.text.primary,
                    }}
                  >
                    {token.availability}
                  </Typography>
                </Box>

                {/* Lockup */}
                <Box sx={{ textAlign: 'center', minWidth: '80px', height: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.text.secondary,

                      display: 'block',
                      marginBottom: 0.5,
                    }}
                  >
                    Lockup
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: theme.palette.text.primary,
                    }}
                  >
                    {token.lockup}
                  </Typography>
                </Box>

                {/* Underlying Asset */}
                <Box sx={{ textAlign: 'center', minWidth: '80px', height: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography
                    variant="label3"
                    sx={{
                      color: theme.palette.text.secondary,
                      display: 'block',
                      marginBottom: 0.5,
                    }}
                  >
                    Underlying asset
                  </Typography>
                  <Typography
                    variant="body4"
                    sx={{
                      color: theme.palette.text.primary,
                    }}
                  >
                    {token.underlyingAsset}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Current APY */}
            <Box
              sx={{
                borderTop: `1px solid ${theme.palette.divider}`,
                paddingTop: 2,
                textAlign: 'left',
              }}
            >
              <Typography
                variant="label2"
                sx={{
                  color: theme.palette.text.secondary,
                  display: 'block',
                  marginBottom: 1,
                }}
              >
                Current
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                <Typography
                  variant="h4"
                  sx={{
                    color: theme.palette.text.primary,
                    
                  }}
                >
                  {token.currentAPY}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                   
                  }}
                >
                  APY
                </Typography>
              </Box>
            </Box>
            </Card>
          </motion.div>
          );
        })}
      </Box>
    </Box>
  );
};

export default FeaturedTokens;
