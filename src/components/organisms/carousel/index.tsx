'use client';

import { config } from '@/config';
import { yieldzBase } from '@/styles/theme/colors';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Box, Stack, Typography } from '@mui/material';
import React, { useCallback, useRef, useState } from 'react';
import type { ICarouselProps } from './types';

// Re-export types for convenience
export type { ICarouselItem, ICarouselProps, ICategoryCardProps } from './types';

/**
 * OrganismCarousel Component
 * 
 * A reusable, responsive carousel component with navigation controls
 * 
 * SOLID Principles:
 * - Single Responsibility: Handles only carousel display and navigation logic
 * - Open/Closed: Extensible through props without modifying the component
 * - Liskov Substitution: Can be used anywhere a carousel is needed
 * - Interface Segregation: Clean, focused prop interface with sensible defaults
 * - Dependency Inversion: Depends on abstractions (theme colors, AtomButton)
 * 
 * KISS Principle: Simple, straightforward implementation with clear logic
 * DRY Principle: Reusable across the application with any content
 * 
 * @example
 * ```tsx
 * const items = [
 *   { id: 1, content: <MyCard title="Item 1" /> },
 *   { id: 2, content: <MyCard title="Item 2" /> },
 * ];
 * 
 * <OrganismCarousel 
 *   title="Token Categories" 
 *   items={items}
 *   itemsPerView={5}
 * />
 * ```
 */
const OrganismCarousel: React.FC<ICarouselProps> = ({
  title,
  items,
  itemsPerView = 4,
  gap = 24,
  showNavigation = true,
  className,
  autoScroll = false,
  autoScrollInterval = 3000,
}) => {
  // State for tracking current scroll position
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Calculate if navigation buttons should be disabled
  const isAtStart = currentIndex === 0;
  const isAtEnd = currentIndex >= items.length - itemsPerView;

  /**
   * Handles smooth scrolling to a specific index
   * Follows Single Responsibility Principle - handles only scroll logic
   */
  const scrollToIndex = useCallback((index: number) => {
    if (!scrollContainerRef.current || isScrolling) return;

    const container = scrollContainerRef.current;
    const itemWidth = container.scrollWidth / items.length;
    const scrollPosition = itemWidth * index;

    setIsScrolling(true);
    container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth',
    });

    // Reset scrolling flag after animation completes
    setTimeout(() => setIsScrolling(false), 500);
  }, [items.length, isScrolling]);

  /**
   * Navigate to previous items
   * Follows KISS principle - simple, clear navigation logic
   */
  const handlePrevious = useCallback(() => {
    const newIndex = Math.max(0, currentIndex - 1);
    setCurrentIndex(newIndex);
    scrollToIndex(newIndex);
  }, [currentIndex, scrollToIndex]);

  /**
   * Navigate to next items
   * Follows KISS principle - simple, clear navigation logic
   */
  const handleNext = useCallback(() => {
    const maxIndex = items.length - itemsPerView;
    const newIndex = Math.min(maxIndex, currentIndex + 1);
    setCurrentIndex(newIndex);
    scrollToIndex(newIndex);
  }, [currentIndex, items.length, itemsPerView, scrollToIndex]);

  /**
   * Auto-scroll effect
   * Follows Single Responsibility Principle - handles only auto-scroll logic
   */
  React.useEffect(() => {
    if (!autoScroll || items.length <= itemsPerView) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const maxIndex = items.length - itemsPerView;
        const newIndex = prevIndex >= maxIndex ? 0 : prevIndex + 1;
        scrollToIndex(newIndex);
        return newIndex;
      });
    }, autoScrollInterval);

    return () => clearInterval(interval);
  }, [autoScroll, autoScrollInterval, items.length, itemsPerView, scrollToIndex]);

  // Don't render if no items
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <Box
      className={className}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        padding: { xs: '24px', sm: '32px', md: '40px' },
        borderRadius: '16px',
      }}
    >
      {/* Background Video */}
      <Box
        component="video"
        autoPlay
        loop
        muted
        playsInline
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -1,
          opacity: 0.3,
        }}
      >
        <source src={config.backgroundVids.boxexBg} type="video/mp4" />
      </Box>

      {/* Overlay for better content visibility */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: -1,
        }}
      />

      {/* Header with title and navigation buttons */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        {/* Title */}
        {title && (
          <Typography
            variant="h6"
            sx={{
              color: yieldzBase.white,
              fontSize: '24px',
              fontWeight: 600,
              letterSpacing: '-0.5px',
            }}
          >
            {title}
          </Typography>
        )}

        {/* Navigation Buttons with Square Bracket Design */}
        {showNavigation && items.length > itemsPerView && (
          <Stack direction="row" spacing={1.5}>
            {/* Previous Button - [ < ] */}
            <Box
              onClick={isAtStart ? undefined : handlePrevious}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                cursor: isAtStart ? 'not-allowed' : 'pointer',
                opacity: isAtStart ? 0.4 : 1,
                transition: 'all 0.2s ease-in-out',
                ...(!isAtStart && {
                  '&:hover': {
                    opacity: 0.8,
                  },
                }),
              }}
            >
              {/* Left Bracket */}
              <Box
                component="span"
                sx={{
                  color: yieldzBase.white,
                  fontSize: '28px',
                  fontWeight: 400,
                  lineHeight: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                [
              </Box>
              
              {/* Chevron Icon */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '28px',
                }}
              >
                <ChevronLeft
                  sx={{
                    color: yieldzBase.white,
                    fontSize: '20px',
                  }}
                />
              </Box>
              
              {/* Right Bracket */}
              <Box
                component="span"
                sx={{
                  color: yieldzBase.white,
                  fontSize: '28px',
                  fontWeight: 400,
                  lineHeight: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ]
              </Box>
            </Box>

            {/* Next Button - [ > ] */}
            <Box
              onClick={isAtEnd ? undefined : handleNext}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                cursor: isAtEnd ? 'not-allowed' : 'pointer',
                opacity: isAtEnd ? 0.4 : 1,
                transition: 'all 0.2s ease-in-out',
                ...(!isAtEnd && {
                  '&:hover': {
                    opacity: 0.8,
                  },
                }),
              }}
            >
              {/* Left Bracket */}
              <Box
                component="span"
                sx={{
                  color: yieldzBase.white,
                  fontSize: '28px',
                  fontWeight: 400,
                  lineHeight: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                [
              </Box>
              
              {/* Chevron Icon */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '28px',
                }}
              >
                <ChevronRight
                  sx={{
                    color: yieldzBase.white,
                    fontSize: '20px',
                  }}
                />
              </Box>
              
              {/* Right Bracket */}
              <Box
                component="span"
                sx={{
                  color: yieldzBase.white,
                  fontSize: '28px',
                  fontWeight: 400,
                  lineHeight: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ]
              </Box>
            </Box>
          </Stack>
        )}
      </Stack>

      {/* Carousel Container */}
      <Box
        ref={scrollContainerRef}
        sx={{
          display: 'flex',
          gap: 0,
          overflowX: 'hidden',
          overflowY: 'visible',
          scrollBehavior: 'smooth',
          width: '100%',
          // Hide scrollbar
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        {items.map((item, index) => (
          <Box
            key={item.id}
            sx={{
              flex: `0 0 calc(100% / ${itemsPerView})`,
              minWidth: 0,
              // Remove left border for all items except the first to avoid double borders
              '& > div': {
                borderLeft: index === 0 ? undefined : 'none',
              },
            }}
          >
            {item.content}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default OrganismCarousel;

