// utils/toast.ts
import { TOST_DURATION } from '@/constants';
import { toast } from 'sonner';

import { yieldzNeutral, yieldzSecondary } from '@/styles/theme/colors';

export const showSuccessToast = (id: string, message: string, duration: number = TOST_DURATION.FAST): void => {
  toast.dismiss();
  toast.success(message, {
    style: { background: yieldzSecondary.green[100], color: yieldzNeutral[25], border: 'none' }, // light green bg, dark green text
    duration,
    id,
    closeButton: true,
    classNames: {
      closeButton: 'close-button',
    },
  });
};

export const showErrorToast = (id: string, message: string, duration: number = TOST_DURATION.FAST): void => {
  toast.dismiss();
  toast.error(message, {
    style: { background: yieldzSecondary.red[100], color: yieldzNeutral[25], border: 'none' }, // light red bg, dark red text
    duration,
    id,
    closeButton: true,
    classNames: {
      closeButton: 'close-button',
    },
  });
};
