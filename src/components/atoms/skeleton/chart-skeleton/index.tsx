import { Box, Skeleton } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { memo } from "react";
import { yieldzNeutral } from 'yldzs-components';

/**
 * Chart Skeleton Component
 * Displays an animated skeleton that resembles a line/area chart
 */

// =============================================================================
// Constants
// =============================================================================

/** Chart dimensions */
const CHART_HEIGHT = 220;

/** Chart skeleton container styles */
const CHART_SKELETON_CONTAINER_SX: SxProps<Theme> = {
    width: '100%',
    height: CHART_HEIGHT,
    position: 'relative',
  };
  
  /** Chart skeleton label styles */
  const CHART_SKELETON_LABEL_SX: SxProps<Theme> = {
    bgcolor: yieldzNeutral[800],
    borderRadius: 0.5,
  };
  
export const ChartSkeleton = memo(function ChartSkeleton() {
    return (
      <Box sx={CHART_SKELETON_CONTAINER_SX}>
        {/* Y-axis labels skeleton */}
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '85%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            py: 1,
          }}
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton
              key={`y-axis-${i}`}
              variant="text"
              width={45}
              height={12}
              sx={CHART_SKELETON_LABEL_SX}
              animation="wave"
            />
          ))}
        </Box>
  
        {/* Line/Area Chart SVG Skeleton */}
        <Box
          sx={{
            position: 'absolute',
            left: 55,
            right: 10,
            top: 10,
            bottom: 30,
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 400 150"
            preserveAspectRatio="none"
            style={{ overflow: 'visible' }}
          >
            {/* Gradient definition for area fill */}
            <defs>
              <linearGradient id="skeletonGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={yieldzNeutral[700]} stopOpacity="0.4" />
                <stop offset="100%" stopColor={yieldzNeutral[800]} stopOpacity="0.05" />
              </linearGradient>
              {/* Animated shimmer gradient */}
              <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={yieldzNeutral[800]} />
                <stop offset="50%" stopColor={yieldzNeutral[700]} />
                <stop offset="100%" stopColor={yieldzNeutral[800]} />
                <animate
                  attributeName="x1"
                  from="-100%"
                  to="100%"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="x2"
                  from="0%"
                  to="200%"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              </linearGradient>
            </defs>
  
            {/* Area fill path */}
            <path
              d="M0,120 Q20,100 40,90 T80,70 T120,85 T160,50 T200,60 T240,40 T280,55 T320,35 T360,45 T400,30 L400,150 L0,150 Z"
              fill="url(#skeletonGradient)"
            />
  
            {/* Line path with shimmer animation */}
            <path
              d="M0,120 Q20,100 40,90 T80,70 T120,85 T160,50 T200,60 T240,40 T280,55 T320,35 T360,45 T400,30"
              fill="none"
              stroke="url(#shimmer)"
              strokeWidth="2"
              strokeLinecap="round"
            />
  
            {/* Data points */}
            {[
              { x: 0, y: 120, delay: 0 },
              { x: 50, y: 85, delay: 0.1 },
              { x: 100, y: 75, delay: 0.2 },
              { x: 150, y: 55, delay: 0.3 },
              { x: 200, y: 60, delay: 0.4 },
              { x: 250, y: 42, delay: 0.5 },
              { x: 300, y: 50, delay: 0.6 },
              { x: 350, y: 38, delay: 0.7 },
              { x: 400, y: 30, delay: 0.8 },
            ].map((point) => (
              <circle
                key={`point-${point.x}-${point.y}`}
                cx={point.x}
                cy={point.y}
                r="3"
                fill={yieldzNeutral[700]}
              >
                <animate
                  attributeName="opacity"
                  values="0.4;0.8;0.4"
                  dur="1.5s"
                  repeatCount="indefinite"
                  begin={`${point.delay}s`}
                />
              </circle>
            ))}
          </svg>
        </Box>
  
        {/* X-axis labels skeleton */}
        <Box
          sx={{
            position: 'absolute',
            left: 55,
            right: 10,
            bottom: 0,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL'].map((month) => (
            <Skeleton
              key={month}
              variant="text"
              width={28}
              height={12}
              sx={CHART_SKELETON_LABEL_SX}
              animation="wave"
            />
          ))}
        </Box>
      </Box>
    );
  });