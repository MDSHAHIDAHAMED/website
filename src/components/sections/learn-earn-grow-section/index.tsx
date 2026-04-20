'use client';

/**
 * LearnEarnGrowSection Component
 * =============================
 * Displays a scrollable carousel of content cards with "LEARN EARN GROW WITH YLDZ" header.
 * Features progress bar navigation and cards with hover effects.
 * Each card has a background image (grow-bg.png) with decorative blue images (bg-blue1.png and bg-blue2.png).
 *
 * Follows SOLID principles:
 * - Single Responsibility: Handles only the learn/earn/grow section display
 * - Open/Closed: Extensible through data props without modification
 * - Liskov Substitution: Can be used anywhere content carousel is needed
 * - Interface Segregation: Clean, focused data interface
 * - Dependency Inversion: Depends on abstractions (theme, components)
 *
 * Follows KISS principle: Simple, focused functionality
 * Follows DRY principle: Reusable across the application
 */
import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import Image from 'next/image';
import { memo, useCallback, useEffect, useRef, useState } from 'react';

import CornerContainer from '@/components/atoms/corner-container';
import AtomTypography from '@/components/atoms/typography';
import CarouselNavigation from '@/components/molecules/carousel-navigation';
import { yieldzBase, yieldzNeutral, yieldzPrimary } from '@/styles/theme/colors';

// =============================================================================
// Types
// =============================================================================

export interface LearnEarnGrowCard {
  id: string;
  type: 'content' | 'event';
  title: string;
  subtitle?: string;
  description?: string;
  // For content cards
  mainText?: string;
  subText?: string;
  // For event cards
  date?: string;
  time?: string;
  location?: string;
  eventName?: string;
  eventLogo?: string;
  // Footer info
  footerTitle: string;
  footerDate: string;
  footerAuthor: string;
}

interface LearnEarnGrowSectionProps {
  cards: LearnEarnGrowCard[];
  itemsPerView?: number;
}

// =============================================================================
// Constants
// =============================================================================

/** Section container styles */
const SECTION_SX: SxProps<Theme> = {
  width: '100%',
  position: 'relative',
  backgroundColor: 'background.default',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  p: { xs: 3, md: 5 },
};

/** Content wrapper with max width */
const CONTENT_WRAPPER_SX: SxProps<Theme> = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: { xs: 3, md: 4 },
};

/** Heading styles - split into two parts */
const HEADING_CONTAINER_SX: SxProps<Theme> = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 1,
  textAlign: 'center',
};

const HEADING_WHITE_SX: SxProps<Theme> = {
  fontSize: { xs: '32px', sm: '48px', md: '64px' },
  fontWeight: 700,
  color: yieldzBase.white,
  textTransform: 'uppercase',
  letterSpacing: '0.02em',
};

const HEADING_CYAN_SX: SxProps<Theme> = {
  fontSize: { xs: '32px', sm: '48px', md: '64px' },
  fontWeight: 700,
  color: yieldzPrimary[500], // #6DF2FE
  textTransform: 'uppercase',
  letterSpacing: '0.02em',
};

/** Carousel container styles */
const CAROUSEL_CONTAINER_SX: SxProps<Theme> = {
  display: 'flex',
  gap: 2,
  overflowX: 'auto',
  scrollBehavior: 'smooth',
  width: '100%',
  pb: 2,
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
};

/** Card container - fixed width for consistent scrolling */
const CARD_CONTAINER_SX: SxProps<Theme> = {
  flex: `0 0 calc((100% - ${3 * 16}px) / 3.2)`, // Show 3.1 cards (3 full + 10% peek)
  minWidth: { xs: '280px', md: '350px' }, // Slightly reduced minWidth to allow peek on smaller screens
  display: 'flex',
  flexDirection: 'column',
  height: '450px', // 350px content + 100px footer
  position: 'relative',
};

// =============================================================================
// Sub-Components
// =============================================================================

/**
 * Content Card Component
 * Displays content card with normal and hover states
 */
interface ContentCardProps {
  card: LearnEarnGrowCard;
}

const ContentCard = memo(function ContentCard({ card }: Readonly<ContentCardProps>) {
  const [isHovered, setIsHovered] = useState(false);

  // Normal state styles - dark background with grow-bg.png image
  const NORMAL_CARD_SX: SxProps<Theme> = {
    width: '100%',
    height: '100%',
    position: 'relative',
    backgroundColor: yieldzNeutral[900], // #111111
    border: `1px solid ${yieldzNeutral[800]}`, // #222222
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };

  // Hover state styles - event card style with lighter/whiter background
  const HOVER_CARD_SX: SxProps<Theme> = {
    ...NORMAL_CARD_SX,
    backgroundColor: yieldzNeutral[700], // #343434 - lighter grey for hover
    border: `1px solid ${yieldzPrimary[500]}40`, // Cyan border with opacity
  };

  // Logo container for Yieldz Y logo - using union.svg
  const LOGO_CONTAINER_SX: SxProps<Theme> = {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 56,
    height: 56,
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  // Main content area - with background image and blue decorative elements
  const CONTENT_AREA_SX: SxProps<Theme> = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center', // Center content vertically
    p: 3,
    gap: 2,
    position: 'relative',
    height: '350px',
    zIndex: 1,
    // Background image from grow-bg.png - only in content area
    backgroundImage: 'url(/assets/backgrounds/grow-bg.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    overflow: 'hidden', // Ensure blue images don't overflow
    textAlign: 'center', // Center text
    backgroundColor: 'transparent', // Ensure background image shows through
  };

  // Main text styles - pixelated font style, centered
  const MAIN_TEXT_SX: SxProps<Theme> = {
    fontSize: { xs: '18px', md: '22px' },
    fontWeight: 700,
    color: yieldzPrimary[500], // #6DF2FE
    textTransform: 'uppercase',
    lineHeight: 1.3,
    letterSpacing: '0.05em',
    textAlign: 'center', // Center the text
    // Pixelated text effect
    textShadow: `1px 1px 0px ${yieldzBase.black}, -1px -1px 0px ${yieldzBase.black}, 1px -1px 0px ${yieldzBase.black}, -1px 1px 0px ${yieldzBase.black}`,
  };

  // Sub text styles - pixelated font style, centered
  const SUB_TEXT_SX: SxProps<Theme> = {
    fontSize: { xs: '12px', md: '14px' },
    fontWeight: 400,
    color: yieldzBase.white,
    lineHeight: 1.6,
    letterSpacing: '0.02em',
    textAlign: 'center', // Center the text
    // Subtle pixelated text effect
    textShadow: `0.5px 0.5px 0px ${yieldzBase.black}`,
  };

  // Hover content - event style with background image and white overlay
  const HOVER_CONTENT_SX: SxProps<Theme> = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    p: 3,
    gap: 3,
    position: 'relative',
    height: '350px', // Fixed height to match normal state
    // Background image from grow-bg.png - only in content area
    backgroundImage: 'url(/assets/backgrounds/grow-bg.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    overflow: 'hidden', // Ensure blue images don't overflow
    backgroundColor: 'transparent', // Ensure background image shows through
    // High opacity white overlay to make card look white on hover
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.85)', // High opacity white overlay
      zIndex: 0,
      pointerEvents: 'none',
    },
  };

  // Event text container
  const EVENT_TEXT_CONTAINER_SX: SxProps<Theme> = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 1.5,
  };

  // Event date/time styles - pixelated font style, black on hover, tickerbit font
  const EVENT_DATE_SX: SxProps<Theme> = {
    fontSize: { xs: '28px', md: '36px' },
    fontWeight: 700,
    color: yieldzBase.black, // Black on hover
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const EVENT_TIME_SX: SxProps<Theme> = {
    fontSize: { xs: '28px', md: '36px' }, // Same size as date
    fontWeight: 700, // Same weight as date
    color: yieldzBase.black, // Black on hover
    letterSpacing: '0.05em', // Same spacing as date
  };

  const EVENT_LOCATION_SX: SxProps<Theme> = {
    fontSize: { xs: '12px', md: '14px' },
    fontWeight: 400,
    color: yieldzBase.black, // Black on hover
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const EVENT_CALL_SX: SxProps<Theme> = {
    fontSize: { xs: '22px', md: '28px' },
    fontWeight: 700,
    color: yieldzBase.black, // Black on hover
    textTransform: 'uppercase',
    mt: 2,
    letterSpacing: '0.05em',
  };

  const EVENT_NAME_SX: SxProps<Theme> = {
    fontSize: { xs: '16px', md: '20px' },
    fontWeight: 600,
    color: yieldzBase.black, // Black on hover
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    letterSpacing: '0.05em',
  };

  // Icon background container for hover state
  const ICON_BG_CONTAINER_SX: SxProps<Theme> = {
    position: 'relative',
    width: { xs: 120, md: 150 },
    height: { xs: 120, md: 150 },
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  // Footer styles - pure black background
  const FOOTER_SX: SxProps<Theme> = {
    width: '100%',
    backgroundColor: yieldzBase.black, // Pure black background
    borderTop: `1px solid ${yieldzNeutral[800]}`, // #222222
    p: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: 0.5,
    position: 'relative',
    height: '100px', // Fixed height
    zIndex: 1, // Ensure footer is above blue images
  };

  const FOOTER_TITLE_SX: SxProps<Theme> = {
    fontSize: { xs: '12px', md: '14px' },
    fontWeight: 500,
    color: yieldzBase.white,
    // fontType will be added via AtomTypography prop
  };

  const FOOTER_INFO_SX: SxProps<Theme> = {
    fontSize: { xs: '11px', md: '12px' },
    fontWeight: 400,
    color: yieldzNeutral[400], // #898989
  };

  return (
    <Box sx={CARD_CONTAINER_SX} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <Box sx={isHovered ? HOVER_CARD_SX : NORMAL_CARD_SX}>
        {/* Yieldz Y Logo - using union.svg (hidden on hover) */}
        {!isHovered && (
          <Box sx={LOGO_CONTAINER_SX}>
            <Image
              src="/assets/icons/Union.svg"
              alt="Yieldz Logo"
              width={56}
              height={56}
              style={{ objectFit: 'contain' }}
            />
          </Box>
        )}

        {/* Main Content Area - wrapped in CornerContainer */}
        {isHovered ? (
          // Hover state - event card
          <CornerContainer sx={HOVER_CONTENT_SX} showBorder={false} outerSx={{ bgcolor: 'transparent' }}>
            {/* Blue background images - decorative elements (only in content area) */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                zIndex: 1, // Above white overlay
                width: { xs: '120px', md: '150px' },
                height: { xs: '120px', md: '150px' },
                pointerEvents: 'none',
              }}
            >
              <Image
                src="/assets/backgrounds/bg-blue1.png"
                alt="Blue decorative element"
                width={150}
                height={150}
                style={{ objectFit: 'contain', width: '100%', height: '100%' }}
              />
            </Box>
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                zIndex: 1, // Above white overlay
                width: { xs: '120px', md: '150px' },
                height: { xs: '120px', md: '150px' },
                pointerEvents: 'none',
              }}
            >
              <Image
                src="/assets/backgrounds/bg-blue2.png"
                alt="Blue decorative element"
                width={150}
                height={150}
                style={{ objectFit: 'contain', width: '100%', height: '100%' }}
              />
            </Box>

            <Box sx={{ ...EVENT_TEXT_CONTAINER_SX, position: 'relative', zIndex: 2 }}>
              {card.date && (
                <AtomTypography sx={EVENT_DATE_SX} fontType="tickerbit">
                  {card.date}
                </AtomTypography>
              )}
              {card.time && (
                <AtomTypography sx={EVENT_TIME_SX} fontType="tickerbit">
                  {card.time}
                </AtomTypography>
              )}
              {card.location && <AtomTypography sx={EVENT_LOCATION_SX}>{card.location}</AtomTypography>}
              <AtomTypography sx={EVENT_CALL_SX}>JOIN US</AtomTypography>
              {card.eventName && <AtomTypography sx={EVENT_NAME_SX}>ON CRYPTO SUMMIT</AtomTypography>}
            </Box>
            {/* Icon background on right */}
            <Box sx={{ ...ICON_BG_CONTAINER_SX, position: 'relative', zIndex: 2 }}>
              <Image
                src="/assets/icon-bg.svg"
                alt="Event Icon"
                width={150}
                height={150}
                style={{ objectFit: 'contain' }}
              />
              {card.eventLogo && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: { xs: '14px', md: '16px' },
                    fontWeight: 600,
                    color: yieldzBase.black, // Black on hover
                  }}
                >
                  {card.eventLogo}
                </Box>
              )}
            </Box>
          </CornerContainer>
        ) : (
          // Normal state - content card
          <CornerContainer sx={CONTENT_AREA_SX} showBorder={false}>
            {/* Blue background images - decorative elements (only in content area) */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                zIndex: 0,
                width: { xs: '120px', md: '150px' },
                height: { xs: '120px', md: '150px' },
                pointerEvents: 'none',
              }}
            >
              <Image
                src="/assets/backgrounds/bg-blue1.png"
                alt="Blue decorative element"
                width={150}
                height={150}
                style={{ objectFit: 'contain', width: '100%', height: '100%' }}
              />
            </Box>
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                zIndex: 0,
                width: { xs: '120px', md: '150px' },
                height: { xs: '120px', md: '150px' },
                pointerEvents: 'none',
              }}
            >
              <Image
                src="/assets/backgrounds/bg-blue2.png"
                alt="Blue decorative element"
                width={150}
                height={150}
                style={{ objectFit: 'contain', width: '100%', height: '100%' }}
              />
            </Box>

            {/* Main text with color variations - centered */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
                position: 'relative',
                zIndex: 1,
                alignItems: 'center',
                width: '100%',
              }}
            >
              {card.mainText ? (
                <Box sx={{ textAlign: 'center' }}>
                  {/* Split text to match design: "YOUR OWN" (white) + "BITCOIN" (cyan) */}
                  {card.mainText.includes('YOUR OWN BITCOIN') ? (
                    <>
                      <AtomTypography
                        component="span"
                        sx={{
                          ...MAIN_TEXT_SX,
                          color: yieldzBase.white,
                        }}
                      >
                        YOUR OWN{' '}
                      </AtomTypography>
                      <AtomTypography component="span" sx={MAIN_TEXT_SX}>
                        BITCOIN
                      </AtomTypography>
                    </>
                  ) : (
                    <AtomTypography sx={MAIN_TEXT_SX}>{card.mainText}</AtomTypography>
                  )}
                </Box>
              ) : (
                <AtomTypography sx={MAIN_TEXT_SX}>{card.title}</AtomTypography>
              )}
              {/* Second line: "REFINERY" (cyan) + "AT YLDZ" (white) */}
              {card.mainText && card.mainText.includes('REFINERY AT YLDZ') && (
                <Box sx={{ textAlign: 'center' }}>
                  <AtomTypography component="span" sx={MAIN_TEXT_SX}>
                    REFINERY{' '}
                  </AtomTypography>
                  <AtomTypography
                    component="span"
                    sx={{
                      ...MAIN_TEXT_SX,
                      color: yieldzBase.white,
                    }}
                  >
                    AT YLDZ
                  </AtomTypography>
                </Box>
              )}
            </Box>
            {/* Subheading - centered */}
            {card.subText && (
              <Box sx={{ position: 'relative', zIndex: 1, width: '100%', textAlign: 'center' }}>
                <AtomTypography sx={SUB_TEXT_SX}>{card.subText}</AtomTypography>
              </Box>
            )}
          </CornerContainer>
        )}

        {/* Footer - wrapped in CornerContainer */}
        <CornerContainer sx={FOOTER_SX} showBorder={false}>
          <AtomTypography sx={FOOTER_TITLE_SX} fontType="tickerbit">
            {card.footerTitle}
          </AtomTypography>
          <AtomTypography sx={FOOTER_INFO_SX}>
            {card.footerDate} / {card.footerAuthor}
          </AtomTypography>
        </CornerContainer>
      </Box>
    </Box>
  );
});

// =============================================================================
// Main Component
// =============================================================================

function LearnEarnGrowSection({ cards, itemsPerView = 3 }: Readonly<LearnEarnGrowSectionProps>): React.JSX.Element {
  const [currentPage, setCurrentPage] = useState(1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Calculate total pages
  const totalPages = Math.ceil(cards.length / itemsPerView);

  // Calculate if navigation buttons should be disabled
  const isAtStart = currentPage === 1;
  const isAtEnd = currentPage >= totalPages || cards.length <= itemsPerView;

  /**
   * Calculate the starting index for a given page
   * Page 1: index 0 (items 0-2), Page 2: index 3 (items 3-5), etc.
   */
  const getIndexForPage = useCallback(
    (page: number): number => {
      if (page <= 1) return 0;
      if (page >= totalPages) {
        return (totalPages - 1) * itemsPerView;
      }
      return (page - 1) * itemsPerView;
    },
    [itemsPerView, totalPages]
  );

  /**
   * Scroll to specific page
   */
  const scrollToPage = useCallback(
    (page: number) => {
      if (!scrollContainerRef.current) return;

      const container = scrollContainerRef.current;
      const index = getIndexForPage(page);

      const firstCard = container.firstElementChild as HTMLElement;
      if (!firstCard) return;

      const cardWidth = firstCard.offsetWidth;
      const gap = 16; // gap between cards (from CAROUSEL_CONTAINER_SX gap: 2 = 16px)
      const cardWidthWithGap = cardWidth + gap;

      let scrollPosition = index * cardWidthWithGap;

      // For the last page, ensure all remaining items are fully visible
      if (page === totalPages) {
        const itemsOnLastPage = cards.length - index;
        if (itemsOnLastPage < itemsPerView) {
          const lastCard = container.children[cards.length - 1] as HTMLElement;
          if (lastCard) {
            const containerWidth = container.offsetWidth;
            const lastCardRight = lastCard.offsetLeft + lastCard.offsetWidth;
            scrollPosition = Math.max(0, lastCardRight - containerWidth);
          }
        }
      }

      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth',
      });
    },
    [getIndexForPage, itemsPerView, totalPages, cards.length]
  );

  /**
   * Calculate current page from scroll position
   */
  const getPageFromScroll = useCallback((): number => {
    if (!scrollContainerRef.current) return 1;

    const container = scrollContainerRef.current;
    const firstCard = container.firstElementChild as HTMLElement;
    if (!firstCard) return 1;

    const cardWidth = firstCard.offsetWidth;
    const gap = 16;
    const cardWidthWithGap = cardWidth + gap;

    const scrollLeft = container.scrollLeft;
    const scrollRight = scrollLeft + container.offsetWidth;
    const maxScroll = container.scrollWidth - container.offsetWidth;

    if (scrollLeft >= maxScroll - 10 || scrollRight >= container.scrollWidth - 10) {
      return totalPages;
    }

    const approximateIndex = Math.round(scrollLeft / cardWidthWithGap);
    let page = Math.floor(approximateIndex / itemsPerView) + 1;

    page = Math.max(1, Math.min(page, totalPages));

    const lastPageStartIndex = (totalPages - 1) * itemsPerView;
    if (approximateIndex >= lastPageStartIndex - 0.5) {
      page = totalPages;
    }

    return page;
  }, [itemsPerView, totalPages]);

  /**
   * Navigate to previous page
   */
  const handlePrevious = useCallback(() => {
    if (isAtStart) return;
    const newPage = currentPage - 1;
    setCurrentPage(newPage);
    scrollToPage(newPage);
  }, [currentPage, isAtStart, scrollToPage]);

  /**
   * Navigate to next page
   */
  const handleNext = useCallback(() => {
    if (isAtEnd) return;
    const newPage = currentPage + 1;
    setCurrentPage(newPage);
    scrollToPage(newPage);
  }, [currentPage, isAtEnd, scrollToPage, totalPages]);

  /**
   * Handle scroll event to update current page
   */
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const newPage = getPageFromScroll();
      setCurrentPage(newPage);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [getPageFromScroll]);

  return (
    <Box sx={SECTION_SX}>
      {/* Content */}
      <Box sx={CONTENT_WRAPPER_SX}>


        {/* Carousel */}
        <Box ref={scrollContainerRef} sx={CAROUSEL_CONTAINER_SX}>
          {cards.map((card) => (
            <ContentCard key={card.id} card={card} />
          ))}
        </Box>

        {/* Navigation with Progress Bar - positioned at bottom right */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            width: '100%',
            mt: 2,
          }}
        >
          <CarouselNavigation
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevious={handlePrevious}
            onNext={handleNext}
            isAtStart={isAtStart}
            isAtEnd={isAtEnd}
            id="learn-earn-grow"
            sx={{
              width: 'auto',
              justifyContent: 'flex-end',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default memo(LearnEarnGrowSection);
