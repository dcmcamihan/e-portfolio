import React, { useId } from 'react';

export type LogoVariant = '12c' | '12a' | '11a' | '9c' | '8a';

export interface LogoProps extends React.SVGProps<SVGSVGElement> {
  variant?: LogoVariant;
  /**
   * For the primary '12c' variant: whether to include the 4-pointed compass star
   * cut out inside the 'D' shape (matching DCMA brand signature).
   * Defaults to true.
   */
  withStar?: boolean;
  /** Width and height in px (or CSS size string) */
  size?: number | string;
  /** Main mark color (defaults to currentColor for automatic light/dark theme adaptation) */
  color?: string;
  /** Accent mark color (defaults to var(--accent)) */
  accentColor?: string;
  /** Accessible title for screen readers / SVG title */
  title?: string;
}

/**
 * Pure code-built vector logo based on the "Logo Concepts.dc.html" design suite
 * for Dianna Claire Marie Amihan (DCMA).
 *
 * Defaults to Concept 12c "Four moons · Hidden Initials D C M A":
 * - Top-left: 'D' (with compass star cutout representing the Amihan wind / North star)
 * - Top-right: 'C' (crescent moon)
 * - Bottom-left: 'M' (two soft arches)
 * - Bottom-right: 'A' (accented silhouette with triangle counter and notch)
 *
 * Fully reactive to theme changes via currentColor and var(--accent), with zero
 * raster artifacts and zero network download overhead (< 2KB inlined).
 */
export const Logo: React.FC<LogoProps> = ({
  variant = '12c',
  withStar = true,
  size = 56,
  color = 'currentColor',
  accentColor = 'var(--accent, #5A8C99)',
  title = 'Dianna Claire Marie Amihan',
  className,
  style,
  ...svgProps
}) => {
  const uid = useId().replace(/:/g, '');

  // Mask IDs scoped to instance
  const maskC = `mask-c-${uid}`;
  const maskM = `mask-m-${uid}`;
  const maskA = `mask-a-${uid}`;
  const maskD = `mask-d-${uid}`;
  const mask12a = `mask-12a-${uid}`;
  const mask9c = `mask-9c-${uid}`;
  const clip11a = `clip-11a-${uid}`;

  // Compass star cutout path inside D (centered at 74, 74)
  const starPath =
    'M 74.0 47.5 C 74.0 47.5 76.7 62.8 81.7 67.2 C 86.7 71.6 103.8 74.0 103.8 74.0 C 103.8 74.0 86.7 76.4 81.7 80.8 C 76.7 85.2 74.0 100.5 74.0 100.5 C 74.0 100.5 71.3 85.2 66.3 80.8 C 61.3 76.4 44.2 74.0 44.2 74.0 C 44.2 74.0 61.3 71.6 66.3 67.2 C 71.3 62.8 74.0 47.5 74.0 47.5 Z';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width={size}
      height={size}
      className={className}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        flexShrink: 0,
        ...style,
      }}
      role="img"
      aria-label={title}
      {...svgProps}
    >
      <title>{title}</title>

      {variant === '12c' && (
        <>
          <defs>
            {withStar && (
              <mask id={maskD}>
                <rect width="256" height="256" fill="#fff" />
                <path d={starPath} fill="#000" />
              </mask>
            )}
            <mask id={maskC}>
              <rect width="256" height="256" fill="#fff" />
              <circle cx="198" cy="74" r="40" fill="#000" />
            </mask>
            <mask id={maskM}>
              <rect width="256" height="256" fill="#fff" />
              <circle cx="62" cy="182" r="15" fill="#000" />
              <circle cx="96" cy="182" r="15" fill="#000" />
              <rect x="47" y="182" width="64" height="60" fill="#000" />
            </mask>
            <mask id={maskA}>
              <rect width="256" height="256" fill="#fff" />
              <path
                d="M182 168L192 150L202 168Z"
                fill="#000"
                stroke="#000"
                strokeWidth="8"
                strokeLinejoin="round"
              />
              <path
                d="M168 240L182 206L196 240Z"
                fill="#000"
                stroke="#000"
                strokeWidth="8"
                strokeLinejoin="round"
              />
            </mask>
          </defs>

          {/* D - Top Left */}
          <path
            d="M40 22H74A52 52 0 0 1 74 126H40Z"
            fill={color}
            mask={withStar ? `url(#${maskD})` : undefined}
          />

          {/* C - Top Right */}
          <circle cx="182" cy="74" r="52" fill={color} mask={`url(#${maskC})`} />

          {/* M - Bottom Left */}
          <circle cx="74" cy="182" r="52" fill={color} mask={`url(#${maskM})`} />

          {/* A - Bottom Right (Accent) */}
          <circle cx="182" cy="182" r="52" fill={accentColor} mask={`url(#${maskA})`} />
        </>
      )}

      {variant === '12a' && (
        <>
          <defs>
            <mask id={mask12a}>
              <rect width="256" height="256" fill="#fff" />
              <rect x="118" y="0" width="24" height="256" fill="#000" />
              <circle cx="178" cy="128" r="70" fill="#000" />
            </mask>
          </defs>
          <circle cx="128" cy="128" r="116" fill={color} mask={`url(#${mask12a})`} />
          <path d="M148 12A116 116 0 0 1 148 244Z" fill={accentColor} />
        </>
      )}

      {variant === '11a' && (
        <>
          <defs>
            <clipPath id={clip11a}>
              <circle cx="128" cy="128" r="116" />
            </clipPath>
          </defs>
          <circle cx="128" cy="128" r="116" fill={accentColor} />
          <g clipPath={`url(#${clip11a})`}>
            <path
              d="M0 212L46 138L84 186L122 138L146 176L182 106L256 212V256H0Z"
              fill={color}
              stroke="var(--bg, #0B0D10)"
              strokeWidth="12"
              strokeLinejoin="round"
              paintOrder="stroke"
            />
            <path d="M182 150L164 186H200Z" fill={accentColor} />
          </g>
        </>
      )}

      {variant === '9c' && (
        <>
          <defs>
            <mask id={mask9c}>
              <rect width="256" height="256" fill="#fff" />
              <circle cx="128" cy="128" r="24" fill="#000" />
              <circle cx="138" cy="120" r="20" fill="#fff" />
              <path
                d="M152 104L170.5 99.7L228 28L156.3 85.5Z"
                fill="#000"
                stroke="#000"
                strokeWidth="14"
                strokeLinejoin="round"
              />
            </mask>
          </defs>
          <path
            mask={`url(#${mask9c})`}
            d="M128 12Q138 118 244 128Q138 138 128 244Q118 138 12 128Q118 118 128 12Z"
            fill={color}
          />
          <path
            d="M152 104L170.5 99.7L228 28L156.3 85.5Z"
            fill={accentColor}
          />
        </>
      )}

      {variant === '8a' && (
        <>
          <rect fill={color} height="168" rx="5" width="10" x="99" y="26" />
          <path
            d="M114 30A82 82 0 0 1 114 194A62 82 0 0 0 114 30Z"
            fill={accentColor}
          />
          <path d="M60 202H192L172 222H80Z" fill={color} />
          <path
            d="M28 240Q60 228 92 240T156 240T220 240"
            fill="none"
            stroke={color}
            strokeLinecap="round"
            strokeWidth="10"
          />
        </>
      )}
    </svg>
  );
};

export default Logo;
