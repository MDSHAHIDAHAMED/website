'use client';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion as MUIAccordion,
  AccordionDetails as MUIAccordionDetails,
  AccordionProps as MUIAccordionProps,
  AccordionSummary as MUIAccordionSummary,
} from '@mui/material';
import React from 'react';

/**
 * Interface for individual accordion item
 * Follows Interface Segregation Principle - focused interface for accordion items
 */
export interface AccordionItem {
  id: string | number;
  title: string | React.ReactNode;
  content: React.ReactNode;
}

/**
 * Props interface for the AccordionGroup component
 * Follows Single Responsibility Principle - handles only accordion functionality
 * Extends MUI AccordionProps while omitting children to use items instead
 */
export interface AccordionGroupProps extends Omit<MUIAccordionProps, 'children'> {
  items: AccordionItem[];
  /**
   * Optional: allow only one accordion to be open at a time
   * Follows DRY principle - centralized expansion behavior
   */
  singleExpand?: boolean;
}

/**
 * AccordionGroup Component
 * 
 * A reusable accordion component that can render multiple accordion items
 * Follows SOLID principles:
 * - Single Responsibility: Handles only accordion functionality
 * - Open/Closed: Extensible through props without modification
 * - Liskov Substitution: Can be used anywhere accordion display is needed
 * - Interface Segregation: Clean, focused prop interface
 * - Dependency Inversion: Depends on abstractions (MUI components)
 * 
 * Follows KISS principle: Simple, focused functionality
 * Follows DRY principle: Reusable across the application
 */
const AccordionGroup: React.FC<AccordionGroupProps> = ({ items, singleExpand = false, ...props }) => {
  // State management for expanded accordion (only used when singleExpand is true)
  const [expanded, setExpanded] = React.useState<string | false>(false);

  /**
   * Handler function for accordion expansion changes
   * Follows Single Responsibility Principle - handles only expansion logic
   * Follows DRY principle - reusable expansion handler
   */
  const handleChange =
    (panel: string) =>
    (_event: React.SyntheticEvent, isExpanded: boolean) => {
      if (singleExpand) {
        setExpanded(isExpanded ? panel : false);
      }
    };

  return (
    <>
      {/* Render accordion items with proper key and expansion logic */}
      {items.map((item) => (
        <MUIAccordion
          key={`Accordion-${item.id}`}
          expanded={singleExpand ? expanded === String(item.id) : undefined}
          onChange={singleExpand ? handleChange(String(item.id)) : undefined}
          {...props}
        >
          {/* Accordion header with expand icon */}
          <MUIAccordionSummary expandIcon={<ExpandMoreIcon />}>
            {item.title}
          </MUIAccordionSummary>
          {/* Accordion content */}
          <MUIAccordionDetails>{item.content}</MUIAccordionDetails>
        </MUIAccordion>
      ))}
    </>
  );
};

export default AccordionGroup;
