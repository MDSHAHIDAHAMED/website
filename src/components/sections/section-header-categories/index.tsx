import { AtomButton } from "@/components/atoms/button";
import AtomTypography from "@/components/atoms/typography";
import { NavButton } from "@/components/organisms/table/pagination";
import { NAV_ARROWS_SX, SECTION_HEADER_SX } from "@/constants/token-explorer";
import { Box, Stack } from "@mui/material";
import { memo } from "react";

interface SectionHeaderProps {
    readonly title: string;
    readonly onViewAll?: () => void;
    readonly onPrevious: () => void;
    readonly onNext: () => void;
    readonly canScrollPrev: boolean;
    readonly canScrollNext: boolean;
    readonly isLoading: boolean;
    readonly isFetchingMore: boolean;
  }
  
  /**
   * Section Header with navigation buttons
   */
 function SectionHeader({
    title,
    onViewAll,
    onPrevious,
    onNext,
    canScrollPrev,
    canScrollNext,
    isLoading,
    isFetchingMore,
  }: SectionHeaderProps): React.JSX.Element {
    // Disable next when loading and not fetching more, or when can't scroll
    const isNextDisabled = (isLoading && !isFetchingMore) || !canScrollNext;
    const isPrevDisabled = !canScrollPrev || isLoading;
  
    return (
      <Box sx={SECTION_HEADER_SX}>
        <AtomTypography variant="h4" color="text.primary">
          {title}
        </AtomTypography>
        <Box sx={NAV_ARROWS_SX}>
          {onViewAll && (
            <AtomButton
              variant="contained"
              label="View All Categories"
              size="small"
              id="view-all-categories-button"
              onClick={onViewAll}
            />
          )}
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ mx: 2 }}>
              <NavButton direction="prev" disabled={isPrevDisabled} onClick={onPrevious} />
            </Box>
            <Box>
              <NavButton direction="next" disabled={isNextDisabled} onClick={onNext} />
            </Box>
          </Stack>
        </Box>
      </Box>
    );
  };

  export default memo(SectionHeader);
