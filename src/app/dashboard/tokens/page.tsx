'use client';

/**
 * Token Explorer Page
 * ===================
 * Displays featured tokens, token categories, and a searchable token listing.
 *
 * Sections:
 * - Featured Tokens: Grid of highlighted tokens with key metrics
 * - Token Categories: Horizontal scroll of category cards
 * - Tokens Table: Sortable, paginated token listing with tabs (fetched from CoinGecko via Redux)
 */
import {
  FEATURED_GRID_SX,
  FEATURED_TOKENS_DATA,
  SECTION_HEADER_SX,
  TOKEN_PAGE_CONTAINER_SX
} from '@/constants/token-explorer';
import { Box } from '@mui/material';
import React, { memo } from 'react';

import AtomTypography from '@/components/atoms/typography';
import FeaturedTokenCard from '@/components/molecules/featured-token-card';
import CategoryCarouselSection from '@/components/sections/category-carousel-section';
import TokenListingSection from '@/components/sections/token-listing-section';

// =============================================================================
// Sub-Components
// =============================================================================

/**
 * Section Header Component
 * Displays section title with optional navigation arrows
 */
interface SectionHeaderProps {
  title: string;
  children?: React.ReactNode;
}

const SectionHeader = memo(function SectionHeader({ title, children }: Readonly<SectionHeaderProps>) {
  return (
    <Box sx={SECTION_HEADER_SX}>
      <AtomTypography variant="h4" color="text.primary">
        {title}
      </AtomTypography>
      {children}
    </Box>
  );
});

/**
 * Featured Tokens Section
 * Displays grid of featured token cards
 */
const FeaturedTokensSection = memo(function FeaturedTokensSection() {
  return (
    <Box>
      <SectionHeader title="Featured Tokens" />
      <Box sx={FEATURED_GRID_SX}>
        {FEATURED_TOKENS_DATA.map((token) => (
          <FeaturedTokenCard key={token.id} token={token} />
        ))}
      </Box>
    </Box>
  );
});

// =============================================================================
// Main Component
// =============================================================================

/**
 * Token Explorer Page Component
 *
 * @returns Token Explorer page with featured tokens, categories, and listing
 */
function TokenPage(): React.JSX.Element {
  return (
    <Box sx={TOKEN_PAGE_CONTAINER_SX}>
      {/* Featured Tokens Section */}
      <FeaturedTokensSection />

      {/* Token Categories Carousel - Fetches from API with pagination */}
      <CategoryCarouselSection title="Token Categories" showViewAll />

      {/* Tokens Listing Section */}
      <TokenListingSection />
    </Box>
  );
}

export default memo(TokenPage);
