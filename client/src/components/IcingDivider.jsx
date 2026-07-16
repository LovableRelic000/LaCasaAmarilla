// client/src/components/IcingDivider.jsx
import { useId } from 'react';

const TILE_WIDTH = 46;
const BAND_HEIGHT = 6;
const DRIP_RADIUS = 30;
const TOTAL_HEIGHT = BAND_HEIGHT + DRIP_RADIUS;

export default function IcingDivider({ className = '', flip = false }) {
  const patternId = `icing-${useId()}`;

  return (
    <svg
      width="100%"
      height={TOTAL_HEIGHT}
      aria-hidden="true"
      className={`block w-full ${flip ? 'rotate-180' : ''} ${className}`}
      style={{ color: 'var(--bg)' }}
    >
      <defs>
        <pattern id={patternId} width={TILE_WIDTH} height={TOTAL_HEIGHT} patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width={TILE_WIDTH} height={BAND_HEIGHT} fill="currentColor" />
          <circle cx={TILE_WIDTH / 2} cy={BAND_HEIGHT} r={DRIP_RADIUS} fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height={TOTAL_HEIGHT} fill={`url(#${patternId})`} />
    </svg>
  );
}