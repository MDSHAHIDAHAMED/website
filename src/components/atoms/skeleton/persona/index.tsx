'use client';

import { Box, Stack } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import React, { memo } from 'react';

type AnimationType = 'wave' | 'pulse' | false;

interface PersonaSkeletonProps {
  id?: string;
  animation?: AnimationType;
  height?: number;
}

/**
 * AtomPersonaSkeleton
 * 
 * A reusable skeleton component for Persona KYC loading states.
 * Mimics the structure of the Persona verification form with title, description, and form area.
 * Follows SRP (Single Responsibility), DRY (Don't Repeat Yourself), and KISS (Keep It Simple) principles.
 */
const AtomPersonaSkeleton: React.FC<Readonly<PersonaSkeletonProps>> = ({
  id = 'persona-skeleton',
  animation = 'pulse',
  height = 600,
}) => {
  /**
   * Renders the header section with title and description skeletons
   */
  const renderHeader = (): React.JSX.Element => (
    <Stack spacing={2} alignItems="center">
      {/* Title skeleton */}
      <Skeleton
        animation={animation}
        variant="text"
        width="60%"
        height={40}
        data-testid={`qa-${id}-title`}
      />
      
      {/* Description skeleton */}
      <Skeleton
        animation={animation}
        variant="text"
        width="80%"
        height={24}
        data-testid={`qa-${id}-description`}
      />
    </Stack>
  );

  /**
   * Renders form field skeletons
   */
  const renderFormFields = (): React.JSX.Element => (
    <Stack spacing={3} sx={{ px: 4, py: 2 }}>
      {/* Form field 1 */}
      <Box>
        <Skeleton
          animation={animation}
          variant="text"
          width="30%"
          height={20}
          sx={{ mb: 1 }}
        />
        <Skeleton
          animation={animation}
          variant="rounded"
          width="100%"
          height={56}
        />
      </Box>

      {/* Form field 2 */}
      <Box>
        <Skeleton
          animation={animation}
          variant="text"
          width="40%"
          height={20}
          sx={{ mb: 1 }}
        />
        <Skeleton
          animation={animation}
          variant="rounded"
          width="100%"
          height={56}
        />
      </Box>

      {/* Form field 3 */}
      <Box>
        <Skeleton
          animation={animation}
          variant="text"
          width="35%"
          height={20}
          sx={{ mb: 1 }}
        />
        <Skeleton
          animation={animation}
          variant="rounded"
          width="100%"
          height={56}
        />
      </Box>

      {/* Action buttons skeleton */}
      <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
        <Skeleton
          animation={animation}
          variant="rounded"
          width={120}
          height={42}
        />
        <Skeleton
          animation={animation}
          variant="rounded"
          width={120}
          height={42}
        />
      </Stack>
    </Stack>
  );

  /**
   * Renders the main form container skeleton
   */
  const renderFormContainer = (): React.JSX.Element => (
    <Box
      sx={{
        width: '100%',
        height: `${height}px`,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '12px',
        overflow: 'hidden',
        p: 3,
      }}
      data-testid={`qa-${id}-container`}
    >
      {renderFormFields()}
    </Box>
  );

  return (
    <Box textAlign="center" sx={{ p: 4 }}>
      {renderHeader()}
      <Box sx={{ mt: 4 }}>
        {renderFormContainer()}
      </Box>
    </Box>
  );
};

export default memo(AtomPersonaSkeleton);

