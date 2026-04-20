import {
    BOTTOM_SECTION_SX,
    MARQUEE_CONTENT_SX,
    MARQUEE_SET_IDS,
    METRIC_ITEM_SX,
    METRIC_LABEL_SX,
    METRIC_SET_SX,
    METRIC_VALUE_SX,
    MetricItem,
} from '@/constants/dashboard-card';
import { Box } from '@mui/material';
import { memo, useMemo } from 'react';

import CornerContainer from '@/components/atoms/corner-container';
import AtomTypography from '@/components/atoms/typography';

/**
 * Metrics Marquee Component
 * Renders the scrolling metrics section
 */
interface MetricsMarqueeProps {
  metrics?: MetricItem[];
}

/**
 * Metric Item Component
 * Renders a single metric in the marquee
 */
interface MetricItemDisplayProps {
  metric: MetricItem;
  setId: string;
}

const MetricItemDisplay = memo(function MetricItemDisplay({ metric, setId }: Readonly<MetricItemDisplayProps>) {
  return (
    <Box key={`${metric.id}-${setId}`} sx={METRIC_ITEM_SX}>
      <AtomTypography variant="label3" color="text.secondary" sx={METRIC_LABEL_SX}>
        {metric.label}
      </AtomTypography>
      <AtomTypography variant="subtitle4" color="text.primary" sx={METRIC_VALUE_SX}>
        {metric.value}
      </AtomTypography>
    </Box>
  );
});

export const MetricsMarquee = memo(function MetricsMarquee({ metrics }: Readonly<MetricsMarqueeProps>) {
  // Memoize the marquee content to prevent unnecessary re-renders
  const marqueeContent = useMemo(() => {
    if (!metrics?.length) return null;

    return (
      <Box sx={MARQUEE_CONTENT_SX}>
        {MARQUEE_SET_IDS.map((setId) => (
          <Box key={setId} sx={METRIC_SET_SX}>
            {metrics.map((metric) => (
              <MetricItemDisplay key={`${metric.id}-${setId}`} metric={metric} setId={setId} />
            ))}
          </Box>
        ))}
      </Box>
    );
  }, [metrics]);

  return (
    <CornerContainer height="auto" showBorder={false} sx={BOTTOM_SECTION_SX}>
      {/* @ts-expect-error - marquee is deprecated but required for continuous scroll */}
      <marquee direction="left">{marqueeContent}</marquee>
    </CornerContainer>
  );
});
