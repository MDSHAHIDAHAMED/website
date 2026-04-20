import cryptochains from '@/lib/lottie-animation/crypto-chains.json';
import dynamic from 'next/dynamic';
import type { CSSProperties } from 'react';
import React, { memo } from 'react';

/**
 * Dynamically import Lottie component with SSR disabled
 * This ensures the animation only loads on the client side
 */
const Lottie = dynamic(() => import('lottie-react'), {
  ssr: true,
});

/**
 * Lottie Animation Component Props
 */
interface LottieAnimationProps {
  width?: number | string;
  height?: number | string;
  loop?: boolean;
  autoplay?: boolean;
  style?: CSSProperties;
}

/**
 * Default props for Lottie Animation Component
 */
const defaultProps = {
  width: 400,
  height: 400,
  loop: true,
  autoplay: true,
} as const;

/**
 * Lottie Animation Component
 *
 * Displays a Lottie animation using the crypto-chains animation data.
 * This component is client-side only to ensure proper rendering.
 *
 * @param width - Width of the animation (default: 400)
 * @param height - Height of the animation (default: 400)
 * @param loop - Whether to loop the animation (default: true)
 * @param autoplay - Whether to autoplay the animation (default: true)
 * @param style - Additional CSS styles to apply
 */
const LottieAnimation: React.FC<LottieAnimationProps> = memo(
  ({
    width = defaultProps.width,
    height = defaultProps.height,
    loop = defaultProps.loop,
    autoplay = defaultProps.autoplay,
    style,
  }) => {
    // Check if animation data is available
    if (!cryptochains) {
      return null;
    }
    return (
      <Lottie
        animationData={cryptochains}
        loop={loop}
        autoplay={autoplay}
        style={{
          width,
          height,
          maxWidth: '100%',
          maxHeight: '100%',
          ...style,
        }}
        rendererSettings={{
          preserveAspectRatio: 'xMidYMid slice',
          progressiveLoad: true,
        }}
      />
    );
  }
);

LottieAnimation.displayName = 'LottieAnimation';

export default LottieAnimation;
