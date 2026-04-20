import { Box } from '@mui/system';

const CustomIconWrapper = ({ children }: { children: React.ReactNode }) => {
  const bgPath = '/assets/icon-bg.svg';
  const dimensions = {
    lg: {
      width: 166.7,
      height: 166.7,
    },
    md: {
      width: 135.7,
      height: 135.7,
    },
  };
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        component="img"
        src={bgPath}
        alt="Icon Background"
        sx={{
          width: { md: dimensions.md.width, lg: dimensions.lg.width },
          height: { md: dimensions.md.height, lg: dimensions.lg.height },
          objectFit: 'contain',
        }}
      />
      {/* Nested icon placeholder - centered inside icon-bg */}
      {children}
    </Box>
  );
};

export default CustomIconWrapper;
