import { Box } from '@mui/material';
import React from 'react';

import AtomTooltip from '@/components/atoms/tooltip';
import AtomTypography from '@/components/atoms/typography';

interface TruncatedWithTooltipProps {
  text: string;
  maxLength?: number;
  typographyProps?: React.ComponentProps<typeof AtomTypography>;
  sx?: React.CSSProperties;
  maxWidth?: number;
}

function TruncatedWithTooltip({
  text,
  maxLength = 15,
  typographyProps = {},
  sx = {},
  maxWidth = 180,
}: TruncatedWithTooltipProps): React.JSX.Element {
  const isTruncated = text?.length > maxLength;

  const content = (
    <AtomTypography
      variant="subtitle1"
      sx={{
        maxWidth,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        textAlign: 'center',
        display: 'block', // important to apply ellipsis reliably
        ...sx,
      }}
      {...typographyProps}
    >
      {text}
    </AtomTypography>
  );

  return isTruncated ? (
    <AtomTooltip title={text}>
      <Box sx={{ maxWidth: 180 }}>{content}</Box>
    </AtomTooltip>
  ) : (
    content
  );
}

export default TruncatedWithTooltip;
