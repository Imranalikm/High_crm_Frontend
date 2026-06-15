import React from 'react';
import MagicRings from './MagicRings';

export default function AuthBackground({ mode }) {
  const isLogin = mode === 'login';
  const color = isLogin ? '#adc6ff' : '#a78bfa';
  const colorTwo = isLogin ? '#22d3ee' : '#ffb3ad';

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <MagicRings
        color={color}
        colorTwo={colorTwo}
        ringCount={6}
        speed={0.8}
        attenuation={10}
        lineThickness={2}
        baseRadius={0.35}
        radiusStep={0.1}
        scaleRate={0.1}
        opacity={0.8}
        blur={0}
        noiseAmount={0.06}
        rotation={0}
        ringGap={1.5}
        fadeIn={0.7}
        fadeOut={0.5}
        followMouse={true}
        mouseInfluence={0.15}
        hoverScale={1.15}
        parallax={0.03}
        clickBurst={true}
      />
    </div>
  );
}
