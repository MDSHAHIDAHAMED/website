'use client';

import AtomBreadcrumbs, { type ItemProps } from '@/components/atoms/breadcrumb';
import TokenListingSection from '@/components/sections/token-listing-section';
import { TOKEN_PAGE_CONTAINER_SX } from '@/constants/token-explorer';
import { paths } from '@/paths';
import { Box } from '@mui/material';
import { useParams } from 'next/navigation';
import { memo, useMemo } from 'react';

/**
 * Token Explorer Page Component
 *
 * @returns Token Explorer page with featured tokens, categories, and listing
 */
function TokenListCategoryWise(): React.JSX.Element {
  const params = useParams();

  // Extract category name from dynamic route params
  const categoryName = useMemo(() => {
    const name = params?.categoryId;
    return typeof name === 'string' ? name : '';
  }, [params]);

  /**
   * Format category name for display (replace hyphens with spaces, capitalize)
   */
  const displayCategoryName = useMemo(() => {
    return categoryName
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }, [categoryName]);

  /**
   * Breadcrumb navigation items
   */
  const breadcrumbItems: ItemProps[] = useMemo(
    () => [
      {
        href: paths.dashboard.tokens,
        label: 'All tokens',
        variant: 'label1',
      },
      {
        href: paths.dashboard.tokenListCategories(categoryName),
        label: displayCategoryName,
        variant: 'label1',
      },
    ],
    [categoryName, displayCategoryName]
  );

  return (
    <Box sx={{...TOKEN_PAGE_CONTAINER_SX, gap : 1.5}}>
      {/* Breadcrumb Navigation */}
      <AtomBreadcrumbs id="category-breadcrumb" breadCrumbs={breadcrumbItems} />

      {/* Token Listing */}
      <TokenListingSection title={displayCategoryName} categoryName={categoryName} noButton={true} />
    </Box>
  );
}

export default memo(TokenListCategoryWise);
