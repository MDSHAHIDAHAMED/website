import Tooltip, { type TooltipProps } from '@mui/material/Tooltip';
import { type SxProps, type Theme } from '@mui/system';
import React, { type ReactNode } from 'react';

interface AtomTooltipProps extends TooltipProps {
  children: React.ReactElement;
  title: string | ReactNode;
  placement?: TooltipProps['placement'];
  arrow?: boolean;
  disableHoverListener?: boolean;
  disableFocusListener?: boolean;
  disableTouchListener?: boolean;
  open?: boolean;
  followCursor?: boolean;
  enterDelay?: number;
  leaveDelay?: number;
  sx?: SxProps<Theme>;
}

type ReadonlyAtomTooltipProps = Readonly<AtomTooltipProps>;

function AtomTooltip({
  children,
  title,
  placement = 'bottom',
  arrow = false,
  disableHoverListener = false,
  disableFocusListener = false,
  disableTouchListener = false,
  open,
  followCursor = true,
  enterDelay = 0,
  leaveDelay = 0,
  sx,
  ...tooltipProps
}: ReadonlyAtomTooltipProps): React.JSX.Element {
  return (
    <Tooltip
      title={title}
      placement={placement}
      arrow={arrow}
      disableHoverListener={disableHoverListener}
      disableFocusListener={disableFocusListener}
      disableTouchListener={disableTouchListener}
      open={open}
      followCursor={followCursor}
      enterDelay={enterDelay}
      leaveDelay={leaveDelay}
      sx={sx}
      {...tooltipProps}
    >
      {children}
    </Tooltip>
  );
}

export default AtomTooltip;
