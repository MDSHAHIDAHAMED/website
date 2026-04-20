'use client';

/**
 * ReturnCapitalDistributionSection Component
 * ===========================================
 * Displays information about return capital distribution.
 *
 * Layout:
 * - Full width section with content area
 * - Responsive padding and spacing
 */
import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { memo } from 'react';
import AtomTypography from '@/components/atoms/typography';
import AtomTooltip from '@/components/atoms/tooltip';
import StatCard, { STAT_CARD_STANDARD_SX, STAT_CARD_WITH_BG_SX } from '@/components/atoms/stat-card';

// =============================================================================
// Constants
// =============================================================================

/** Section container styles */
const SECTION_SX: SxProps<Theme> = {
  width: '100%',
  height: '100%',
  backgroundImage: 'url(/assets/images/bg.png)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  flexDirection: 'column',

};

/** Content container styles */
const CONTENT_SX: SxProps<Theme> = {
  display: 'flex',
  textAlign: 'center',
  flexDirection: 'column',
  gap: 0,
  width: '100%',
  padding: { xs: '20px 30px', lg: '80px 15%' },
};


/** Stat cards grid container */
const STAT_CARDS_GRID_SX: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
  mt: 0,
  gap: 2,
};

/** Stat cards column container */
const STAT_CARDS_COLUMN_SX: SxProps<Theme> = {
  mt: 0,
  backgroundColor: 'transparent',
  display: 'flex',
  flexDirection: 'column',
};

/** Tooltip container styles */
const TOOLTIP_CONTAINER_SX: SxProps<Theme> = {
  backgroundImage: 'url(/assets/backgrounds/tooltip_bg.svg)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  p: 2.5,
  borderRadius: '10px',
};

/** Tooltip first paragraph styles */
const TOOLTIP_FIRST_PARAGRAPH_SX: SxProps<Theme> = {
  mb: 2,
  color: '#A7A7A7',
  '&:last-child': {
    mb: 0,
  },
};

/** Content headline styles */
const CONTENT_HEADLINE_SX: SxProps<Theme> = {
  textAlign: 'center',
  mb: 2,
};

/** Content subheadline styles */
const CONTENT_SUBHEADLINE_SX: SxProps<Theme> = {
  textAlign: 'center',
  fontWeight: 500,
  marginBottom: 5,
};

/** Tooltip trigger styles */
const TOOLTIP_TRIGGER_SX: SxProps<Theme> = {
  fontWeight: 500,
  textDecoration: 'underline',
  cursor: 'pointer',
};

/** Tooltip popup styles */
const TOOLTIP_POPUP_SX: SxProps<Theme> = {
  padding: 0,
  maxWidth: 480,
  width: 480,
};

// =============================================================================
// Data
// =============================================================================

/** Tooltip content explaining ROC tax-deferred treatment */
const TOOLTIP_CONTENT = (
  <Box sx={TOOLTIP_CONTAINER_SX}>
    <AtomTypography variant="caption" component="p" fontType="ppMori" sx={TOOLTIP_FIRST_PARAGRAPH_SX}>
      Represents Yieldz Holding's views. Provided for illustrative purposes only; does not constitute investment or tax advice and should not form the basis for an investment in YLDZ Tokens or any other security.
    </AtomTypography>
    <AtomTypography variant="caption" component="p" fontType="ppMori" sx={TOOLTIP_FIRST_PARAGRAPH_SX}>
      Tax treatment of distributions is subject to change base on the financials of Yieldz Holdings Inc and applicable tax rules. This does not address consequences for non-US investors, who may be subject to withholding on distributions regardless of E&P. E&P may arise in the future in which case distributions would be treated as qualified dividends (assuming holding period and other requirements are met).
    </AtomTypography>
    <AtomTypography variant="caption" component="p" fontType="ppMori" sx={TOOLTIP_FIRST_PARAGRAPH_SX}>
      Distributions on that are classified as "non-taxable return of capital" would result in a decrease in the holder's tax basis. Such decrease in tax basis would then translate into increased taxation for the holder once the holder's tax basis is entirely depleted or the holder sells the tokens. Such increase is not reflected in the above comparison. It is important to consult your tax advisor on all aspects of taxation of the product.
    </AtomTypography>
    <AtomTypography variant="caption" component="p" fontType="ppMori" sx={TOOLTIP_FIRST_PARAGRAPH_SX}>
      Actual results may vary materially from these illustrative results. Based on information available as of December 15th 2025. (1) Applies to the extent treated as qualified dividend income (2) Includes federal and potential state and local taxes.
    </AtomTypography>
  </Box>
);

/** Stat cards data */


/**
 * Content Panel
 */
const ContentPanel = memo(function ContentPanel() {
  return (
    <Box sx={CONTENT_SX}>
      <AtomTypography variant="h2" sx={CONTENT_HEADLINE_SX}>
        Return of Capital “ROC” Distribution Guidance
      </AtomTypography>
      <AtomTypography variant="h6" sx={CONTENT_SUBHEADLINE_SX}>
        Yieldz Holdings Inc. Expects ROC Treatment for 10 Years or More, Resulting in {' '}
        <AtomTooltip
          title={TOOLTIP_CONTENT}
          placement="bottom"
          slotProps={{
            tooltip: {
              sx: TOOLTIP_POPUP_SX,
            },
          }}
        >
          <Box component="span" sx={TOOLTIP_TRIGGER_SX}>
            <AtomTypography variant="h6" component="span" color="primary">
              Tax-Deferred
            </AtomTypography>
          </Box>
        </AtomTooltip>{' '}
        Digital Asset Distributions
      </AtomTypography>

      <Box sx={STAT_CARDS_GRID_SX}>
        {/* Column 1 */}
        <Box sx={STAT_CARDS_COLUMN_SX}>
          <StatCard
            label="Dividend / Income Type"
            value="Return of Capital"
            fontSize={{ xs: '28px', md: '36px' }}
            backgroundImage="/assets/backgrounds/noise_bg.svg"
            sx={STAT_CARD_WITH_BG_SX}
          />
          <StatCard
            label="Tax Characterization"
            value="Reduction of cost basis, tax deferred"
            fontSize={{ xs: '14px', md: '18px' }}
            sx={STAT_CARD_STANDARD_SX}
          />
          <StatCard
            label="Distribution Tax Rate"
            value="0%"
            fontSize={{ xs: '28px', md: '36px' }}
            color="primary"
            fontType="tickerbit"
            backgroundImage="/assets/backgrounds/low_noise_bg.svg"
            sx={STAT_CARD_WITH_BG_SX}
          />
          <StatCard
            label="Typical Instruments"
            value="YLDZ Token"
            fontSize={{ xs: '20px', md: '24px' }}
            icon="/assets/icons/Yicon2.svg"
            sx={STAT_CARD_STANDARD_SX}
          />
        </Box>

        {/* Column 2 */}
        <Box sx={STAT_CARDS_COLUMN_SX}>
          <StatCard
            label="Dividend / Income Type"
            value="Qualified Dividends"
            fontSize={{ xs: '24px', md: '30px' }}
            backgroundImage="/assets/backgrounds/noise_bg.svg"
            sx={STAT_CARD_WITH_BG_SX}
          />
          <StatCard
            label="Tax Characterization"
            value="Dividend Income, taxed at preferential tax rate"
            fontSize={{ xs: '14px', md: '18px' }}
            sx={STAT_CARD_STANDARD_SX}
          />
          <StatCard
            label="Distribution Tax Rate"
            value="20%-35%"
            fontSize={{ xs: '28px', md: '36px' }}
            fontType="tickerbit"
            backgroundImage="/assets/backgrounds/low_noise_bg.svg"
            sx={STAT_CARD_WITH_BG_SX}
          />
          <StatCard
            label="Typical Instruments"
            value="Common stocks, Preferred stocks"
            fontSize={{ xs: '14px', md: '18px' }}
            sx={STAT_CARD_STANDARD_SX}
          />
        </Box>

        {/* Column 3 */}
        <Box sx={STAT_CARDS_COLUMN_SX}>
          <StatCard
            label="Dividend / Income Type"
            value="Non-Qualified Dividends"
            fontSize={{ xs: '24px', md: '30px' }}
            backgroundImage="/assets/backgrounds/noise_bg.svg"
            sx={STAT_CARD_WITH_BG_SX}
          />
          <StatCard
            label="Tax Characterization"
            value="Ordinary Income, taxed at ordinary income"
            fontSize={{ xs: '14px', md: '18px' }}
            sx={STAT_CARD_STANDARD_SX}
          />
          <StatCard
            label="Distribution Tax Rate"
            value="37%-55%"
            fontSize={{ xs: '28px', md: '36px' }}
            fontType="tickerbit"
            backgroundImage="/assets/backgrounds/low_noise_bg.svg"
            sx={STAT_CARD_WITH_BG_SX}
          />
          <StatCard
            label="Typical Instruments"
            value="Bonds, Money markets, Bank Accounts"
            fontSize={{ xs: '14px', md: '18px' }}
            sx={STAT_CARD_STANDARD_SX}
          />
        </Box>
      </Box>
    </Box>
  );
});

// =============================================================================
// Main Component
// =============================================================================

function ReturnCapitalDistributionSection(): React.JSX.Element {
  return (
    <Box sx={SECTION_SX}>
      <ContentPanel />
    </Box>
  );
}

export default memo(ReturnCapitalDistributionSection);
