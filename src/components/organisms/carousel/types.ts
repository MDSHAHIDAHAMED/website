/**
 * Type Definitions for Carousel Organism Component
 * 
 * Centralized type definitions following Single Responsibility Principle
 * Makes it easy to maintain and extend type definitions
 */

import React from 'react';

/**
 * Single carousel item data structure
 * Follows Interface Segregation Principle - minimal required fields
 */
export interface ICarouselItem {
  /**
   * Unique identifier for the carousel item
   */
  id: string | number;
  
  /**
   * Content to be displayed in the carousel slot
   * Can be any React component (cards, images, videos, etc.)
   */
  content: React.ReactNode;
}

/**
 * Carousel component props
 * Follows Single Responsibility Principle - focused on carousel functionality
 * Follows Open/Closed Principle - extensible through props
 */
export interface ICarouselProps {
  /**
   * Title displayed at the top of the carousel
   * @optional
   */
  title?: string;
  
  /**
   * Array of items to display in the carousel
   * @required
   */
  items: ICarouselItem[];
  
  /**
   * Number of items to display per view
   * @default 4
   */
  itemsPerView?: number;
  
  /**
   * Gap between carousel items in pixels
   * @default 24
   */
  gap?: number;
  
  /**
   * Whether to show navigation buttons
   * @default true
   */
  showNavigation?: boolean;
  
  /**
   * Custom CSS class for the carousel container
   * @optional
   */
  className?: string;
  
  /**
   * Whether to enable auto-scroll
   * @default false
   */
  autoScroll?: boolean;
  
  /**
   * Auto-scroll interval in milliseconds (only if autoScroll is true)
   * @default 3000
   */
  autoScrollInterval?: number;
}

/**
 * Category Card Props
 * Follows Interface Segregation Principle
 */
export interface ICategoryCardProps {
  /**
   * Unique identifier for the card
   */
  id: string | number;
  
  /**
   * Icon to display (can be an image, SVG component, or icon component)
   */
  icon?: React.ReactNode;
  
  /**
   * Category title
   */
  title: string;
  
  /**
   * Category description/subtitle
   */
  description?: string;
  
  /**
   * Click handler for the card
   */
  onClick?: () => void;
  
  /**
   * Custom styles for the card
   */
  sx?: Record<string, any>;
}

/**
 * Navigation button states
 * Used internally by the carousel component
 */
export interface INavigationState {
  isAtStart: boolean;
  isAtEnd: boolean;
  currentIndex: number;
}

/**
 * Scroll configuration
 * Used internally for scroll calculations
 */
export interface IScrollConfig {
  itemWidth: number;
  scrollPosition: number;
  maxScroll: number;
}

