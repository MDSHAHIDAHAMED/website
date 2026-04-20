'use client';

import { Box} from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import AtomTypography from '@/components/atoms/typography';
import { yieldzPrimary } from '@/styles/theme/colors';

// =============================================================================
// Constants
// =============================================================================

const CONTAINER_SX: SxProps<Theme> = {
    width: '100%',
    maxWidth: '380px',
    position: 'relative',
};

const PHONE_FRAME_SX: SxProps<Theme> = {
    width: '100%',
    height: '600px',
    backgroundColor: '#0A0A0A',
    borderRadius: '40px',
    border: '8px solid #1A1A1A',
    overflow: 'hidden',
    position: 'relative',
    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
};

const APP_HEADER_SX: SxProps<Theme> = {
    p: 3,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
};

const KYC_CARD_SX: SxProps<Theme> = {
    m: 2,
    p: 2,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.05)',
};

const PROGRESS_BAR_BG_SX: SxProps<Theme> = {
    width: '100%',
    height: '4px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: '2px',
    mt: 2,
    mb: 1,
};

const PROGRESS_BAR_FILL_SX: SxProps<Theme> = {
    width: '60%',
    height: '100%',
    backgroundColor: yieldzPrimary[500],
    borderRadius: '2px',
};

// =============================================================================
// Main Component
// =============================================================================

export default function PlatformVisual(): React.JSX.Element {
    return (
        <Box sx={CONTAINER_SX}>
            <Box sx={PHONE_FRAME_SX}>
                {/* App Header */}
                <Box sx={APP_HEADER_SX}>
                    <AtomTypography variant="h6" fontType="tickerbit" color="primary.main">
                        YIELDZ
                    </AtomTypography>
                    <Box sx={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)' }} />
                </Box>



                {/* Balance Section */}
                <Box sx={{ p: 3, mt: 4, textAlign: 'center' }}>
                    <AtomTypography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                        My YIELDZ
                    </AtomTypography>
                    <AtomTypography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                        22.54%
                    </AtomTypography>
                    <AtomTypography variant="caption" color="primary.main">
                        APY
                    </AtomTypography>
                </Box>


            </Box>
        </Box>
    );
}
