'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

// Server locations with spherical coordinates (longitude, latitude)
const serverLocations = [
  { id: 1, name: 'New York', region: 'US East', lng: -74, lat: 40.7, latency: 12 },
  { id: 2, name: 'San Francisco', region: 'US West', lng: -122.4, lat: 37.8, latency: 18 },
  { id: 3, name: 'São Paulo', region: 'South America', lng: -46.6, lat: -23.5, latency: 45 },
  { id: 4, name: 'London', region: 'EU West', lng: -0.1, lat: 51.5, latency: 8 },
  { id: 5, name: 'Frankfurt', region: 'EU Central', lng: 8.7, lat: 50.1, latency: 10 },
  { id: 6, name: 'Dubai', region: 'Middle East', lng: 55.3, lat: 25.2, latency: 35 },
  { id: 7, name: 'Mumbai', region: 'India', lng: 72.9, lat: 19.1, latency: 42 },
  { id: 8, name: 'Singapore', region: 'Asia Pacific', lng: 103.8, lat: 1.3, latency: 28 },
  { id: 9, name: 'Tokyo', region: 'Japan', lng: 139.7, lat: 35.7, latency: 22 },
  { id: 10, name: 'Sydney', region: 'Australia', lng: 151.2, lat: -33.9, latency: 55 },
];

// Network connections
const networkConnections = [
  { from: 1, to: 4 }, { from: 1, to: 2 }, { from: 2, to: 9 },
  { from: 3, to: 1 }, { from: 4, to: 5 }, { from: 5, to: 6 },
  { from: 6, to: 7 }, { from: 7, to: 8 }, { from: 8, to: 9 },
  { from: 8, to: 10 }, { from: 4, to: 6 },
];

// City lights data (major population centers)
const cityLights = [
  // North America
  { lng: -74, lat: 40.7, intensity: 1 }, { lng: -118.2, lat: 34, intensity: 0.9 },
  { lng: -87.6, lat: 41.9, intensity: 0.8 }, { lng: -122.4, lat: 37.8, intensity: 0.7 },
  { lng: -79.4, lat: 43.7, intensity: 0.6 }, { lng: -95.4, lat: 29.8, intensity: 0.7 },
  // Europe
  { lng: -0.1, lat: 51.5, intensity: 1 }, { lng: 2.3, lat: 48.9, intensity: 0.95 },
  { lng: 13.4, lat: 52.5, intensity: 0.8 }, { lng: -3.7, lat: 40.4, intensity: 0.75 },
  { lng: 12.5, lat: 41.9, intensity: 0.7 }, { lng: 4.9, lat: 52.4, intensity: 0.65 },
  // Asia
  { lng: 139.7, lat: 35.7, intensity: 1 }, { lng: 121.5, lat: 31.2, intensity: 0.95 },
  { lng: 116.4, lat: 39.9, intensity: 0.9 }, { lng: 126.9, lat: 37.5, intensity: 0.85 },
  { lng: 103.8, lat: 1.3, intensity: 0.8 }, { lng: 72.9, lat: 19.1, intensity: 0.9 },
  { lng: 77.2, lat: 28.6, intensity: 0.85 }, { lng: 114.2, lat: 22.3, intensity: 0.8 },
  // South America
  { lng: -46.6, lat: -23.5, intensity: 0.85 }, { lng: -58.4, lat: -34.6, intensity: 0.7 },
  { lng: -43.2, lat: -22.9, intensity: 0.75 },
  // Africa & Middle East
  { lng: 31.2, lat: 30, intensity: 0.7 }, { lng: 55.3, lat: 25.2, intensity: 0.8 },
  { lng: 28, lat: -26.2, intensity: 0.6 },
  // Australia
  { lng: 151.2, lat: -33.9, intensity: 0.75 }, { lng: 145, lat: -37.8, intensity: 0.65 },
];

// Generate stars
const generateStars = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    opacity: Math.random() * 0.8 + 0.2,
    twinkleDuration: Math.random() * 3 + 2,
    twinkleDelay: Math.random() * 5,
  }));
};

// Convert spherical to 2D coordinates on globe
function sphericalTo2D(lng: number, lat: number, rotation: number, globeRadius: number, padding: number) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + rotation) * Math.PI) / 180;

  const x = globeRadius * Math.sin(phi) * Math.cos(theta);
  const y = globeRadius * Math.cos(phi);
  const z = globeRadius * Math.sin(phi) * Math.sin(theta);

  // Only show points on the front hemisphere
  const isVisible = z > -globeRadius * 0.1;

  return {
    x: x + globeRadius + padding,
    y: globeRadius - y + padding,
    z,
    isVisible,
    depth: (z + globeRadius) / (2 * globeRadius),
  };
}

// Animated arc between two points
function ConnectionArc({
  from,
  to,
  rotation,
  globeRadius,
  padding,
  index
}: {
  from: typeof serverLocations[0];
  to: typeof serverLocations[0];
  rotation: number;
  globeRadius: number;
  padding: number;
  index: number;
}) {
  const fromPos = sphericalTo2D(from.lng, from.lat, rotation, globeRadius, padding);
  const toPos = sphericalTo2D(to.lng, to.lat, rotation, globeRadius, padding);

  if (!fromPos.isVisible || !toPos.isVisible) return null;

  const midX = (fromPos.x + toPos.x) / 2;
  const midY = (fromPos.y + toPos.y) / 2;
  const dist = Math.sqrt(Math.pow(toPos.x - fromPos.x, 2) + Math.pow(toPos.y - fromPos.y, 2));
  const arcHeight = Math.min(dist * 0.4, globeRadius * 0.3);

  const path = `M ${fromPos.x} ${fromPos.y} Q ${midX} ${midY - arcHeight} ${toPos.x} ${toPos.y}`;
  const avgDepth = (fromPos.depth + toPos.depth) / 2;

  return (
    <g style={{ opacity: avgDepth * 0.8 + 0.2 }}>
      {/* Arc glow */}
      <path
        d={path}
        fill="none"
        stroke="url(#arcGlow)"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.4"
        filter="url(#blur)"
      />
      {/* Arc line */}
      <path
        d={path}
        fill="none"
        stroke="url(#arcGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.8"
        strokeDasharray="6 3"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="0"
          to="-36"
          dur={`${1.5 + index * 0.1}s`}
          repeatCount="indefinite"
        />
      </path>
      {/* Traveling pulse */}
      <circle r="4" fill="#FF9100" opacity="0">
        <animateMotion
          dur={`${2 + index * 0.2}s`}
          repeatCount="indefinite"
          path={path}
        />
        <animate
          attributeName="opacity"
          values="0;1;1;0"
          dur={`${2 + index * 0.2}s`}
          repeatCount="indefinite"
        />
        <animate
          attributeName="r"
          values="3;5;3"
          dur={`${2 + index * 0.2}s`}
          repeatCount="indefinite"
        />
      </circle>
    </g>
  );
}

// Data center node
function DataCenterNode({
  server,
  rotation,
  globeRadius,
  padding,
  isHovered,
  onHover,
}: {
  server: typeof serverLocations[0];
  rotation: number;
  globeRadius: number;
  padding: number;
  isHovered: boolean;
  onHover: (id: number | null) => void;
}) {
  const pos = sphericalTo2D(server.lng, server.lat, rotation, globeRadius, padding);

  if (!pos.isVisible) return null;

  const scale = pos.depth * 0.5 + 0.5;

  return (
    <g
      style={{
        opacity: pos.depth * 0.7 + 0.3,
        cursor: 'pointer',
      }}
      onMouseEnter={() => onHover(server.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Outer pulse rings */}
      <circle cx={pos.x} cy={pos.y} r={14 * scale} fill="none" stroke="#FF9100" strokeWidth="1.5" opacity="0">
        <animate attributeName="r" values={`${8 * scale};${22 * scale};${22 * scale}`} dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0;0" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx={pos.x} cy={pos.y} r={10 * scale} fill="none" stroke="#FF9100" strokeWidth="1" opacity="0">
        <animate attributeName="r" values={`${6 * scale};${18 * scale};${18 * scale}`} dur="2s" repeatCount="indefinite" begin="0.5s" />
        <animate attributeName="opacity" values="0.4;0;0" dur="2s" repeatCount="indefinite" begin="0.5s" />
      </circle>

      {/* Glow */}
      <circle
        cx={pos.x}
        cy={pos.y}
        r={12 * scale}
        fill="url(#nodeGlow)"
        opacity={isHovered ? 1 : 0.7}
      />

      {/* Core */}
      <circle
        cx={pos.x}
        cy={pos.y}
        r={6 * scale}
        fill="#FF9100"
        filter="url(#nodeBlur)"
      />

      {/* Highlight */}
      <circle
        cx={pos.x - 1.5 * scale}
        cy={pos.y - 1.5 * scale}
        r={2 * scale}
        fill="rgba(255,255,255,0.9)"
      />

      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <rect
              x={pos.x + 16}
              y={pos.y - 28}
              width="110"
              height="50"
              rx="10"
              fill="rgba(0,0,0,0.95)"
              stroke="rgba(255,145,0,0.4)"
              strokeWidth="1.5"
            />
            <text x={pos.x + 26} y={pos.y - 8} fill="white" fontSize="14" fontWeight="600" fontFamily="system-ui">
              {server.name}
            </text>
            <text x={pos.x + 26} y={pos.y + 10} fill="rgba(255,145,0,0.9)" fontSize="12" fontFamily="system-ui">
              {server.latency}ms latency
            </text>
          </motion.g>
        )}
      </AnimatePresence>
    </g>
  );
}

// City light dot
function CityLight({
  light,
  rotation,
  globeRadius,
  padding,
}: {
  light: typeof cityLights[0];
  rotation: number;
  globeRadius: number;
  padding: number;
}) {
  const pos = sphericalTo2D(light.lng, light.lat, rotation, globeRadius, padding);

  if (!pos.isVisible) return null;

  const size = light.intensity * 4 * (pos.depth * 0.5 + 0.5);

  return (
    <circle
      cx={pos.x}
      cy={pos.y}
      r={size}
      fill="#FFB84D"
      opacity={pos.depth * light.intensity * 0.9}
      filter="url(#cityGlow)"
    />
  );
}

// 3D Globe Component
function Globe3D({ isVisible }: { isVisible: boolean }) {
  const [rotation, setRotation] = useState(30);
  const [hoveredServer, setHoveredServer] = useState<number | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const globeRadius = 220;
  const padding = 40;
  const viewBoxSize = (globeRadius + padding) * 2;
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!isVisible) return;

    let lastTime = performance.now();
    const animate = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      if (!isHovering) {
        setRotation(prev => (prev + delta * 0.006) % 360);
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isVisible, isHovering]);

  const centerX = globeRadius + padding;
  const centerY = globeRadius + padding;

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <svg
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        className="w-full h-auto"
        style={{ display: 'block' }}
      >
        <defs>
          {/* Gradients - Updated to Rendrix orange theme */}
          <radialGradient id="globeGradient" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#2a1f14" />
            <stop offset="30%" stopColor="#1a1208" />
            <stop offset="60%" stopColor="#100c05" />
            <stop offset="100%" stopColor="#080602" />
          </radialGradient>

          <radialGradient id="atmosphereOuter" cx="50%" cy="50%" r="50%">
            <stop offset="80%" stopColor="transparent" />
            <stop offset="90%" stopColor="rgba(255,145,0,0.2)" />
            <stop offset="95%" stopColor="rgba(255,145,0,0.1)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          <radialGradient id="atmosphereInner" cx="30%" cy="30%" r="80%">
            <stop offset="0%" stopColor="rgba(255,184,77,0.08)" />
            <stop offset="50%" stopColor="rgba(255,145,0,0.03)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,145,0,0.3)" />
            <stop offset="50%" stopColor="#FF9100" />
            <stop offset="100%" stopColor="rgba(255,145,0,0.3)" />
          </linearGradient>

          <linearGradient id="arcGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="rgba(255,145,0,0.6)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>

          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,145,0,0.9)" />
            <stop offset="60%" stopColor="rgba(255,145,0,0.3)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          <radialGradient id="globeShadowGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="70%" stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(255,145,0,0.15)" />
          </radialGradient>

          {/* Filters */}
          <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" />
          </filter>

          <filter id="nodeBlur" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="cityGlow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="3" />
          </filter>

          <filter id="globeGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="15" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Clip path */}
          <clipPath id="globeClip">
            <circle cx={centerX} cy={centerY} r={globeRadius - 2} />
          </clipPath>
        </defs>

        {/* Outer glow ring */}
        <circle
          cx={centerX}
          cy={centerY}
          r={globeRadius + 25}
          fill="url(#atmosphereOuter)"
          filter="url(#blur)"
        />

        {/* Globe shadow/glow */}
        <circle
          cx={centerX}
          cy={centerY}
          r={globeRadius + 5}
          fill="url(#globeShadowGradient)"
          opacity="0.8"
        />

        {/* Globe base */}
        <circle
          cx={centerX}
          cy={centerY}
          r={globeRadius}
          fill="url(#globeGradient)"
          filter="url(#globeGlow)"
        />

        {/* Inner atmosphere highlight */}
        <circle
          cx={centerX}
          cy={centerY}
          r={globeRadius}
          fill="url(#atmosphereInner)"
        />

        {/* Grid lines - Updated to orange */}
        <g clipPath="url(#globeClip)" opacity="0.2">
          {/* Latitude lines */}
          {[-60, -30, 0, 30, 60].map((lat) => {
            const y = centerY - (lat / 90) * globeRadius * 0.9;
            const radiusAtLat = Math.cos((lat * Math.PI) / 180) * globeRadius;
            return (
              <ellipse
                key={`lat-${lat}`}
                cx={centerX}
                cy={y}
                rx={radiusAtLat}
                ry={radiusAtLat * 0.15}
                fill="none"
                stroke="rgba(255,145,0,0.5)"
                strokeWidth="1"
                strokeDasharray="8 6"
              />
            );
          })}
          {/* Longitude lines */}
          {[0, 30, 60, 90, 120, 150].map((lng) => {
            const adjustedLng = lng + rotation;
            const x = centerX + Math.sin((adjustedLng * Math.PI) / 180) * globeRadius * 0.9;
            return (
              <ellipse
                key={`lng-${lng}`}
                cx={x}
                cy={centerY}
                rx={Math.abs(Math.cos((adjustedLng * Math.PI) / 180)) * globeRadius * 0.12}
                ry={globeRadius * 0.9}
                fill="none"
                stroke="rgba(255,145,0,0.4)"
                strokeWidth="1"
                strokeDasharray="8 6"
              />
            );
          })}
        </g>

        {/* City lights layer */}
        <g clipPath="url(#globeClip)">
          {cityLights.map((light, i) => (
            <CityLight key={i} light={light} rotation={rotation} globeRadius={globeRadius} padding={padding} />
          ))}
        </g>

        {/* Connection arcs */}
        <g clipPath="url(#globeClip)">
          {networkConnections.map((conn, i) => {
            const from = serverLocations.find(s => s.id === conn.from)!;
            const to = serverLocations.find(s => s.id === conn.to)!;
            return (
              <ConnectionArc
                key={`${conn.from}-${conn.to}`}
                from={from}
                to={to}
                rotation={rotation}
                globeRadius={globeRadius}
                padding={padding}
                index={i}
              />
            );
          })}
        </g>

        {/* Data center nodes */}
        <g>
          {serverLocations.map((server) => (
            <DataCenterNode
              key={server.id}
              server={server}
              rotation={rotation}
              globeRadius={globeRadius}
              padding={padding}
              isHovered={hoveredServer === server.id}
              onHover={setHoveredServer}
            />
          ))}
        </g>

        {/* Rim highlight */}
        <circle
          cx={centerX}
          cy={centerY}
          r={globeRadius}
          fill="none"
          stroke="rgba(255,145,0,0.15)"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

// Floating stat card
function StatCard({
  value,
  label,
  sublabel,
  delay,
  position,
}: {
  value: string;
  label: string;
  sublabel: string;
  delay: number;
  position: 'left' | 'right';
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: position === 'left' ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className="group"
    >
      <div
        className="relative px-5 py-4 rounded-2xl backdrop-blur-xl border border-white/[0.08] overflow-hidden transition-all duration-500 hover:border-orange-500/30"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        {/* Hover glow - Updated to orange */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: 'radial-gradient(circle at 50% 0%, rgba(255,145,0,0.15) 0%, transparent 60%)',
          }}
        />

        {/* Icon indicator */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-medium">Live</span>
        </div>

        {/* Value - Updated gradient to orange */}
        <div
          className="text-2xl sm:text-3xl font-bold tracking-tight mb-1"
          style={{
            fontFamily: "'SF Pro Display', system-ui, sans-serif",
            background: 'linear-gradient(135deg, #FFFFFF 0%, #FF9100 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {value}
        </div>

        {/* Label */}
        <div className="text-sm text-white/70 font-medium">{label}</div>
        <div className="text-xs text-white/40 mt-0.5">{sublabel}</div>
      </div>
    </motion.div>
  );
}

// Floating info card (inside safe zone)
function FloatingInfoCard({
  children,
  className = '',
  delay,
}: {
  children: React.ReactNode;
  className?: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className={className}
    >
      <div
        className="px-4 py-3 rounded-xl backdrop-blur-md border border-white/[0.08]"
        style={{
          background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%)',
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}

// Star field background
function StarField() {
  const stars = useMemo(() => generateStars(80), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            animation: `twinkle ${star.twinkleDuration}s ease-in-out infinite ${star.twinkleDelay}s`,
          }}
        />
      ))}
    </div>
  );
}

// Main Component
export function GlobalInfrastructureSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      className="relative py-20 lg:py-28 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #000000 0%, #0a0705 20%, #0d0a06 50%, #0a0705 80%, #000000 100%)',
      }}
    >
      {/* Star field */}
      <StarField />

      {/* Ambient glow effects - Updated to orange */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/2 left-1/3 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2"
          style={{
            background: 'radial-gradient(circle, rgba(255,145,0,0.12) 0%, transparent 50%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-[500px] h-[500px]"
          style={{
            background: 'radial-gradient(circle, rgba(255,107,0,0.1) 0%, transparent 50%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Main grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Globe visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative order-2 lg:order-1"
          >
            {/* Globe container with proper padding */}
            <div className="relative max-w-[520px] mx-auto lg:mx-0">
              <Globe3D isVisible={isInView} />

              {/* Info cards positioned inside the container */}
              <FloatingInfoCard
                className="absolute bottom-4 left-4 z-10"
                delay={0.8}
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <div>
                    <div className="text-xs font-bold text-white tracking-wide">+7% CONVERSION BOOST</div>
                    <div className="text-[10px] text-orange-400 uppercase tracking-wider">
                      From faster page loads worldwide
                    </div>
                  </div>
                </div>
              </FloatingInfoCard>

              <FloatingInfoCard
                className="absolute top-8 right-4 z-10"
                delay={1}
              >
                <div className="text-right">
                  <div className="text-lg font-bold text-white">Zero Downtime</div>
                  <div className="text-[10px] text-white/50 uppercase tracking-wider">
                    Even during
                  </div>
                  <div className="text-[10px] text-orange-400 uppercase tracking-wider">
                    Black Friday traffic spikes
                  </div>
                </div>
              </FloatingInfoCard>
            </div>
          </motion.div>

          {/* Right: Content */}
          <div className="order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-white/50 font-medium uppercase tracking-wider">Global Infrastructure</span>
              </div>

              {/* Headline - Updated content */}
              <h2
                className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6"
                style={{
                  fontFamily: "'SF Pro Display', 'Inter', system-ui, sans-serif",
                }}
              >
                <span
                  className="block"
                  style={{
                    background: 'linear-gradient(135deg, #FFFFFF 0%, rgba(255,255,255,0.7) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Global reach,
                </span>
                <span
                  className="block"
                  style={{
                    background: 'linear-gradient(135deg, #FFFFFF 0%, #FF9100 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  local speed
                </span>
              </h2>

              {/* Description - Updated content */}
              <p className="text-lg text-white/50 leading-relaxed max-w-lg mb-8">
                Every millisecond counts at checkout. Rendrix delivers your store in under 50ms to shoppers
                worldwide—no abandoned carts from slow loading, just more completed purchases.
              </p>

              {/* Stats grid - Updated content */}
              <div className="grid grid-cols-2 gap-3">
                <StatCard
                  value="300+"
                  label="Edge Locations"
                  sublabel="Your store, everywhere"
                  delay={0.4}
                  position="left"
                />
                <StatCard
                  value="<50ms"
                  label="Lightning Checkout"
                  sublabel="Globally, every time"
                  delay={0.5}
                  position="right"
                />
                <StatCard
                  value="99.99%"
                  label="Never Miss a Sale"
                  sublabel="Enterprise uptime SLA"
                  delay={0.6}
                  position="left"
                />
                <StatCard
                  value="10M+"
                  label="Flash Sale Ready"
                  sublabel="Requests per second"
                  delay={0.7}
                  position="right"
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom trust line - Updated */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center mt-16"
        >
          <p className="text-sm text-white/30">
            Powering $2B+ in annual sales — Built on{' '}
            <span className="text-orange-400/70 font-medium">Rendrix Edge Network</span>
          </p>
        </motion.div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% {
            opacity: var(--star-opacity, 0.5);
            transform: scale(1);
          }
          50% {
            opacity: calc(var(--star-opacity, 0.5) * 0.3);
            transform: scale(0.8);
          }
        }
      `}</style>
    </section>
  );
}

export default GlobalInfrastructureSection;
