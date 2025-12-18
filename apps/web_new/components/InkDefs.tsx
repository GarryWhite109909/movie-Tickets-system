export default function InkDefs() {
  return (
    <svg className="fixed w-0 h-0 pointer-events-none" aria-hidden="true">
      <defs>
        {/* Ink Bleed Filter */}
        <filter id="ink-bleed">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="4" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" />
          <feGaussianBlur stdDeviation="0.5" />
        </filter>

        {/* Rough Edge Filter */}
        <filter id="rough-edge">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" />
        </filter>
        
        {/* Paper Texture Filter */}
        <filter id="paper-texture">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
          <feDiffuseLighting in="noise" lightingColor="#fff" surfaceScale="1">
            <feDistantLight azimuth="45" elevation="60" />
          </feDiffuseLighting>
          <feComposite operator="in" in2="SourceGraphic" />
        </filter>
      </defs>
    </svg>
  );
}
