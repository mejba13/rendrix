'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { Globe, Zap, Shield, Activity, Server, Signal } from 'lucide-react';

// Real world server locations with approximate SVG map coordinates
const serverLocations = [
  { id: 1, name: 'New York', region: 'US East', x: 23.5, y: 38, status: 'active', latency: 12 },
  { id: 2, name: 'San Francisco', region: 'US West', x: 12, y: 40, status: 'active', latency: 18 },
  { id: 3, name: 'São Paulo', region: 'South America', x: 30, y: 68, status: 'active', latency: 45 },
  { id: 4, name: 'London', region: 'EU West', x: 47.5, y: 32, status: 'active', latency: 8 },
  { id: 5, name: 'Frankfurt', region: 'EU Central', x: 51, y: 33, status: 'active', latency: 10 },
  { id: 6, name: 'Dubai', region: 'Middle East', x: 60, y: 44, status: 'active', latency: 35 },
  { id: 7, name: 'Mumbai', region: 'India', x: 66, y: 48, status: 'active', latency: 42 },
  { id: 8, name: 'Singapore', region: 'Asia Pacific', x: 74, y: 56, status: 'active', latency: 28 },
  { id: 9, name: 'Tokyo', region: 'Japan', x: 84, y: 38, status: 'active', latency: 22 },
  { id: 10, name: 'Sydney', region: 'Australia', x: 86, y: 72, status: 'active', latency: 55 },
  { id: 11, name: 'Toronto', region: 'Canada', x: 21, y: 34, status: 'active', latency: 15 },
  { id: 12, name: 'Amsterdam', region: 'Netherlands', x: 49, y: 30, status: 'active', latency: 9 },
];

// Network connections between data centers
const networkConnections = [
  { from: 1, to: 4, active: true },
  { from: 1, to: 2, active: true },
  { from: 1, to: 11, active: true },
  { from: 2, to: 9, active: true },
  { from: 3, to: 1, active: true },
  { from: 4, to: 5, active: true },
  { from: 4, to: 12, active: true },
  { from: 5, to: 6, active: true },
  { from: 6, to: 7, active: true },
  { from: 7, to: 8, active: true },
  { from: 8, to: 9, active: true },
  { from: 8, to: 10, active: true },
  { from: 9, to: 10, active: true },
  { from: 12, to: 5, active: true },
];

// Generate floating particles
const generateParticles = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 10,
    opacity: Math.random() * 0.5 + 0.1,
  }));
};

// Stats data - simplified 4 core metrics
const statsData = [
  {
    id: 'pop',
    icon: Globe,
    value: '250+',
    label: 'Edge Locations',
    sublabel: 'Global Points of Presence',
    color: '#FF9100',
  },
  {
    id: 'latency',
    icon: Zap,
    value: '<50ms',
    label: 'Response Time',
    sublabel: 'P99 Global Latency',
    color: '#FF9100',
  },
  {
    id: 'uptime',
    icon: Shield,
    value: '99.99%',
    label: 'Uptime SLA',
    sublabel: 'Enterprise Guarantee',
    color: '#FF9100',
  },
  {
    id: 'throughput',
    icon: Activity,
    value: '10M+',
    label: 'Req/Second',
    sublabel: 'Peak Throughput',
    color: '#FF9100',
  },
];

// Real-time activity indicators
const liveMetrics = [
  { label: 'Active Connections', value: '2.4M', trend: '+12%' },
  { label: 'Data Transferred', value: '847 TB', trend: '+8%' },
  { label: 'Cache Hit Rate', value: '99.2%', trend: '+0.3%' },
];

// Animated connection line component
function ConnectionLine({
  from,
  to,
  index,
  isVisible,
}: {
  from: typeof serverLocations[0];
  to: typeof serverLocations[0];
  index: number;
  isVisible: boolean;
}) {
  const pathRef = useRef<SVGPathElement>(null);

  // Calculate curved path between two points
  const path = useMemo(() => {
    const startX = from.x;
    const startY = from.y;
    const endX = to.x;
    const endY = to.y;

    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;
    const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    const curveIntensity = Math.min(distance * 0.15, 8);

    const controlY = midY - curveIntensity;

    return `M ${startX} ${startY} Q ${midX} ${controlY} ${endX} ${endY}`;
  }, [from, to]);

  return (
    <g className={`connection-group ${isVisible ? 'visible' : ''}`}>
      {/* Base line with gradient */}
      <path
        ref={pathRef}
        d={path}
        fill="none"
        stroke="url(#connectionGradient)"
        strokeWidth="0.3"
        strokeLinecap="round"
        opacity={isVisible ? 0.4 : 0}
        style={{
          transition: 'opacity 0.5s ease',
          transitionDelay: `${index * 0.1}s`,
        }}
      />

      {/* Animated pulse along the path */}
      <circle r="0.8" fill="#FF9100" opacity="0">
        <animateMotion dur={`${2 + index * 0.2}s`} repeatCount="indefinite" begin={`${index * 0.3}s`}>
          <mpath href={`#path-${from.id}-${to.id}`} />
        </animateMotion>
        <animate
          attributeName="opacity"
          values="0;0.8;0.8;0"
          dur={`${2 + index * 0.2}s`}
          repeatCount="indefinite"
          begin={`${index * 0.3}s`}
        />
        <animate
          attributeName="r"
          values="0.5;1;0.5"
          dur={`${2 + index * 0.2}s`}
          repeatCount="indefinite"
          begin={`${index * 0.3}s`}
        />
      </circle>

      {/* Hidden path for animation reference */}
      <path id={`path-${from.id}-${to.id}`} d={path} fill="none" stroke="none" />
    </g>
  );
}

// Server node component with pulse animation
function ServerNode({
  server,
  isVisible,
  index,
  onHover,
  isHovered,
}: {
  server: typeof serverLocations[0];
  isVisible: boolean;
  index: number;
  onHover: (id: number | null) => void;
  isHovered: boolean;
}) {
  return (
    <g
      className="server-node cursor-pointer"
      onMouseEnter={() => onHover(server.id)}
      onMouseLeave={() => onHover(null)}
      style={{
        opacity: isVisible ? 1 : 0,
        transition: `opacity 0.5s ease ${index * 0.08}s, transform 0.3s ease`,
        transform: isHovered ? 'scale(1.2)' : 'scale(1)',
        transformOrigin: `${server.x}% ${server.y}%`,
      }}
    >
      {/* Outer pulse rings */}
      <circle cx={server.x} cy={server.y} r="3" fill="none" stroke="#FF9100" strokeWidth="0.3" opacity="0">
        <animate attributeName="r" values="1;4;4" dur="2s" repeatCount="indefinite" begin={`${index * 0.2}s`} />
        <animate attributeName="opacity" values="0.6;0;0" dur="2s" repeatCount="indefinite" begin={`${index * 0.2}s`} />
      </circle>

      <circle cx={server.x} cy={server.y} r="2" fill="none" stroke="#FF9100" strokeWidth="0.2" opacity="0">
        <animate attributeName="r" values="0.8;3;3" dur="2s" repeatCount="indefinite" begin={`${index * 0.2 + 0.5}s`} />
        <animate attributeName="opacity" values="0.4;0;0" dur="2s" repeatCount="indefinite" begin={`${index * 0.2 + 0.5}s`} />
      </circle>

      {/* Glow effect */}
      <circle cx={server.x} cy={server.y} r="1.5" fill="url(#nodeGlow)" opacity={isHovered ? 1 : 0.6} />

      {/* Core node */}
      <circle
        cx={server.x}
        cy={server.y}
        r="0.8"
        fill="#FF9100"
        filter="url(#nodeFilter)"
      />

      {/* Inner highlight */}
      <circle cx={server.x - 0.2} cy={server.y - 0.2} r="0.3" fill="rgba(255,255,255,0.6)" />

      {/* Tooltip on hover */}
      {isHovered && (
        <g className="tooltip-group">
          <rect
            x={server.x + 2}
            y={server.y - 4}
            width="14"
            height="6"
            rx="0.8"
            fill="rgba(0,0,0,0.9)"
            stroke="rgba(255,145,0,0.3)"
            strokeWidth="0.15"
          />
          <text x={server.x + 3} y={server.y - 1.5} fill="white" fontSize="1.5" fontWeight="600">
            {server.name}
          </text>
          <text x={server.x + 3} y={server.y + 0.5} fill="rgba(255,145,0,0.8)" fontSize="1" fontWeight="500">
            {server.latency}ms latency
          </text>
        </g>
      )}
    </g>
  );
}

// Simplified stat card component
function StatCard({
  stat,
  isVisible,
  index,
}: {
  stat: typeof statsData[0];
  isVisible: boolean;
  index: number;
}) {
  const Icon = stat.icon;

  return (
    <div
      className="stat-card group relative overflow-hidden rounded-xl border transition-all duration-700"
      style={{
        background: 'linear-gradient(145deg, rgba(20,20,25,0.9) 0%, rgba(10,10,15,0.95) 100%)',
        borderColor: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transitionDelay: `${index * 0.1}s`,
        boxShadow: '0 0 0 1px rgba(255,255,255,0.03) inset, 0 10px 30px rgba(0,0,0,0.3)',
      }}
    >
      {/* Gradient overlay on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${stat.color}12 0%, transparent 60%)`,
        }}
      />

      {/* Content */}
      <div className="relative p-5 flex items-start gap-4">
        {/* Icon */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
          style={{
            background: `linear-gradient(135deg, ${stat.color}20 0%, ${stat.color}08 100%)`,
            boxShadow: `0 0 20px ${stat.color}15`,
          }}
        >
          <Icon className="w-5 h-5" style={{ color: stat.color }} />
        </div>

        {/* Stats */}
        <div className="min-w-0">
          <div
            className="text-2xl font-bold tracking-tight"
            style={{
              fontFamily: "'SF Pro Display', 'Inter', system-ui, sans-serif",
              background: `linear-gradient(135deg, #FFFFFF 0%, ${stat.color}90 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {stat.value}
          </div>
          <div className="text-sm text-white/80 font-medium mt-0.5">
            {stat.label}
          </div>
          <div className="text-xs text-white/40 mt-0.5">
            {stat.sublabel}
          </div>
        </div>
      </div>
    </div>
  );
}

// Live metrics ticker
function LiveMetricsTicker({ isVisible }: { isVisible: boolean }) {
  return (
    <div
      className={`flex items-center justify-center gap-8 py-4 px-6 rounded-2xl transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{
        background: 'linear-gradient(135deg, rgba(255,145,0,0.08) 0%, rgba(255,145,0,0.02) 100%)',
        border: '1px solid rgba(255,145,0,0.15)',
        transitionDelay: '0.8s',
      }}
    >
      <div className="flex items-center gap-2">
        <Signal className="w-4 h-4 text-green-400 animate-pulse" />
        <span className="text-xs text-white/60 font-medium uppercase tracking-wider">Live</span>
      </div>
      <div className="w-px h-6 bg-white/10" />
      {liveMetrics.map((metric, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-white/50 text-xs">{metric.label}</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-white font-semibold text-sm tabular-nums">{metric.value}</span>
              <span className="text-green-400 text-xs font-medium">{metric.trend}</span>
            </div>
          </div>
          {i < liveMetrics.length - 1 && <div className="w-px h-8 bg-white/10" />}
        </div>
      ))}
    </div>
  );
}

// Main World Map Component
function WorldMapVisualization({ isVisible }: { isVisible: boolean }) {
  const [hoveredServer, setHoveredServer] = useState<number | null>(null);
  const particles = useMemo(() => generateParticles(30), []);

  return (
    <div className="relative w-full aspect-[2/1] max-w-5xl mx-auto">
      {/* Atmospheric glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% 50%, rgba(255,145,0,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 30% 40%, rgba(0,200,255,0.05) 0%, transparent 50%),
            radial-gradient(ellipse 50% 30% at 70% 60%, rgba(255,100,0,0.06) 0%, transparent 50%)
          `,
          filter: 'blur(40px)',
        }}
      />

      {/* Floating particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-white/20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
            animation: `floatParticle ${particle.duration}s ease-in-out infinite ${particle.delay}s`,
          }}
        />
      ))}

      {/* SVG Map Container */}
      <svg
        viewBox="0 0 100 80"
        className="w-full h-full"
        style={{
          filter: 'drop-shadow(0 0 60px rgba(255,145,0,0.15))',
        }}
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,145,0,0.15)" />
            <stop offset="50%" stopColor="rgba(255,200,100,0.08)" />
            <stop offset="100%" stopColor="rgba(255,145,0,0.12)" />
          </linearGradient>

          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,145,0,0.1)" />
            <stop offset="50%" stopColor="rgba(255,145,0,0.5)" />
            <stop offset="100%" stopColor="rgba(255,145,0,0.1)" />
          </linearGradient>

          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,145,0,0.8)" />
            <stop offset="100%" stopColor="rgba(255,145,0,0)" />
          </radialGradient>

          {/* Filters */}
          <filter id="mapGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="nodeFilter" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="0.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Grid pattern */}
          <pattern id="gridPattern" width="5" height="5" patternUnits="userSpaceOnUse">
            <path d="M 5 0 L 0 0 0 5" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.1" />
          </pattern>

          {/* Dot pattern for continents */}
          <pattern id="dotPattern" width="2" height="2" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.15" fill="rgba(255,145,0,0.3)" />
          </pattern>
        </defs>

        {/* Background grid */}
        <rect x="0" y="0" width="100" height="80" fill="url(#gridPattern)" opacity="0.5" />

        {/* Latitude/Longitude lines */}
        <g opacity="0.15">
          {[16, 32, 48, 64].map((y) => (
            <line key={`lat-${y}`} x1="0" y1={y} x2="100" y2={y} stroke="rgba(255,145,0,0.3)" strokeWidth="0.1" strokeDasharray="1,2" />
          ))}
          {[20, 40, 60, 80].map((x) => (
            <line key={`lng-${x}`} x1={x} y1="0" x2={x} y2="80" stroke="rgba(255,145,0,0.3)" strokeWidth="0.1" strokeDasharray="1,2" />
          ))}
        </g>

        {/* World map continents */}
        <g filter="url(#mapGlow)">
          {/* North America */}
          <path
            d="M 8,25 Q 12,20 18,22 L 24,20 Q 28,22 30,26 L 28,32 Q 24,36 22,40 L 18,45 Q 14,48 12,44 L 10,38 Q 8,32 8,25 Z"
            fill="url(#mapGradient)"
            stroke="rgba(255,145,0,0.3)"
            strokeWidth="0.2"
            opacity={isVisible ? 1 : 0}
            style={{ transition: 'opacity 1s ease 0.2s' }}
          />

          {/* South America */}
          <path
            d="M 22,52 Q 26,50 32,52 L 36,58 Q 38,66 34,74 L 28,76 Q 22,72 24,64 L 22,56 Q 21,53 22,52 Z"
            fill="url(#mapGradient)"
            stroke="rgba(255,145,0,0.3)"
            strokeWidth="0.2"
            opacity={isVisible ? 1 : 0}
            style={{ transition: 'opacity 1s ease 0.3s' }}
          />

          {/* Europe */}
          <path
            d="M 44,22 Q 48,18 54,20 L 58,24 Q 56,28 52,30 L 48,34 Q 44,36 42,34 L 40,30 Q 42,26 44,22 Z"
            fill="url(#mapGradient)"
            stroke="rgba(255,145,0,0.3)"
            strokeWidth="0.2"
            opacity={isVisible ? 1 : 0}
            style={{ transition: 'opacity 1s ease 0.4s' }}
          />

          {/* Africa */}
          <path
            d="M 46,38 Q 50,36 56,38 L 62,44 Q 64,52 62,60 L 56,66 Q 48,64 46,56 L 44,48 Q 44,42 46,38 Z"
            fill="url(#mapGradient)"
            stroke="rgba(255,145,0,0.3)"
            strokeWidth="0.2"
            opacity={isVisible ? 1 : 0}
            style={{ transition: 'opacity 1s ease 0.5s' }}
          />

          {/* Asia */}
          <path
            d="M 58,20 Q 65,18 75,22 L 88,28 Q 92,34 90,40 L 84,44 Q 76,48 70,46 L 64,42 Q 58,36 58,28 L 58,20 Z"
            fill="url(#mapGradient)"
            stroke="rgba(255,145,0,0.3)"
            strokeWidth="0.2"
            opacity={isVisible ? 1 : 0}
            style={{ transition: 'opacity 1s ease 0.6s' }}
          />

          {/* India subcontinent */}
          <path
            d="M 64,44 Q 68,42 72,44 L 74,50 Q 72,56 68,56 L 64,52 Q 62,48 64,44 Z"
            fill="url(#mapGradient)"
            stroke="rgba(255,145,0,0.3)"
            strokeWidth="0.2"
            opacity={isVisible ? 1 : 0}
            style={{ transition: 'opacity 1s ease 0.65s' }}
          />

          {/* Southeast Asia */}
          <path
            d="M 72,50 Q 76,48 80,52 L 78,58 Q 74,60 72,56 L 72,50 Z"
            fill="url(#mapGradient)"
            stroke="rgba(255,145,0,0.3)"
            strokeWidth="0.2"
            opacity={isVisible ? 1 : 0}
            style={{ transition: 'opacity 1s ease 0.7s' }}
          />

          {/* Australia */}
          <path
            d="M 78,62 Q 84,58 92,62 L 94,70 Q 92,76 86,76 L 80,74 Q 76,70 78,62 Z"
            fill="url(#mapGradient)"
            stroke="rgba(255,145,0,0.3)"
            strokeWidth="0.2"
            opacity={isVisible ? 1 : 0}
            style={{ transition: 'opacity 1s ease 0.8s' }}
          />

          {/* Japan */}
          <path
            d="M 84,32 Q 86,30 88,32 L 88,38 Q 86,40 84,38 L 84,32 Z"
            fill="url(#mapGradient)"
            stroke="rgba(255,145,0,0.3)"
            strokeWidth="0.2"
            opacity={isVisible ? 1 : 0}
            style={{ transition: 'opacity 1s ease 0.75s' }}
          />
        </g>

        {/* Network connections */}
        <g className="connections-layer">
          {networkConnections.map((conn, i) => {
            const from = serverLocations.find((s) => s.id === conn.from)!;
            const to = serverLocations.find((s) => s.id === conn.to)!;
            return <ConnectionLine key={`${conn.from}-${conn.to}`} from={from} to={to} index={i} isVisible={isVisible} />;
          })}
        </g>

        {/* Server nodes */}
        <g className="servers-layer">
          {serverLocations.map((server, index) => (
            <ServerNode
              key={server.id}
              server={server}
              isVisible={isVisible}
              index={index}
              onHover={setHoveredServer}
              isHovered={hoveredServer === server.id}
            />
          ))}
        </g>
      </svg>

      {/* Legend */}
      <div
        className={`absolute bottom-4 left-4 flex items-center gap-4 px-4 py-2 rounded-xl transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
        style={{
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.08)',
          transitionDelay: '1s',
        }}
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
          <span className="text-xs text-white/60">Active Node</span>
        </div>
        <div className="w-px h-4 bg-white/10" />
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20 rounded-full" />
          <span className="text-xs text-white/60">Data Route</span>
        </div>
      </div>
    </div>
  );
}

// Main Component
export function GlobalInfrastructureSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 lg:py-24 overflow-hidden"
      style={{
        background: `
          linear-gradient(180deg, #000000 0%, #030305 20%, #050508 50%, #030305 80%, #000000 100%)
        `,
      }}
    >
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Gradient orbs */}
        <div
          className="absolute top-1/4 left-1/4 w-[800px] h-[800px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,145,0,0.06) 0%, transparent 50%)',
            filter: 'blur(100px)',
            transform: 'translate(-50%, -50%)',
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0,150,255,0.04) 0%, transparent 50%)',
            filter: 'blur(80px)',
            transform: 'translate(50%, 50%)',
          }}
        />
      </div>

      {/* Content container */}
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div
          className={`text-center mb-10 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full mb-5 group">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(135deg, rgba(255,145,0,0.15) 0%, rgba(255,145,0,0.05) 100%)',
                border: '1px solid rgba(255,145,0,0.2)',
              }}
            />
            <div className="relative flex items-center gap-3">
              <div className="relative">
                <Server className="w-4 h-4 text-primary" />
                <div className="absolute inset-0 animate-ping">
                  <Server className="w-4 h-4 text-primary opacity-40" />
                </div>
              </div>
              <span className="text-sm text-white/70 font-medium tracking-wide">Global Infrastructure</span>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
          </div>

          {/* Main headline */}
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-5"
            style={{ fontFamily: "'SF Pro Display', 'Inter', system-ui, sans-serif" }}
          >
            <span className="text-white">Enterprise-grade </span>
            <span
              className="relative inline-block"
              style={{
                background: 'linear-gradient(135deg, #FF9100 0%, #FFB84D 40%, #FF6B00 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              global network
            </span>
          </h2>

          {/* Subtitle */}
          <p className="max-w-xl mx-auto text-base sm:text-lg text-white/50 leading-relaxed">
            Your stores load in milliseconds from anywhere on the planet. Built on redundant infrastructure
            with automatic failover and real-time traffic optimization.
          </p>
        </div>

        {/* Stats Grid - Above map */}
        <div
          className={`grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '0.15s' }}
        >
          {statsData.map((stat, index) => (
            <StatCard key={stat.id} stat={stat} isVisible={isVisible} index={index} />
          ))}
        </div>

        {/* World Map */}
        <div
          className={`transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
          style={{ transitionDelay: '0.3s' }}
        >
          <div
            className="relative rounded-2xl overflow-hidden p-[1px]"
            style={{
              background: 'linear-gradient(135deg, rgba(255,145,0,0.2) 0%, rgba(255,145,0,0.05) 50%, rgba(255,145,0,0.1) 100%)',
            }}
          >
            <div
              className="relative rounded-[15px] overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, rgba(10,10,15,0.98) 0%, rgba(5,5,10,0.99) 100%)',
              }}
            >
              <WorldMapVisualization isVisible={isVisible} />
            </div>
          </div>

          {/* Live metrics under map */}
          <div className="mt-5 flex justify-center">
            <LiveMetricsTicker isVisible={isVisible} />
          </div>
        </div>

        {/* Bottom CTA */}
        <div
          className={`text-center mt-10 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: '0.8s' }}
        >
          <p className="text-sm text-white/40">
            Trusted by 10,000+ businesses worldwide — Powered by{' '}
            <span className="text-primary font-medium">Rendrix Edge Network</span>
          </p>
        </div>
      </div>

      {/* Inline styles for complex animations */}
      <style jsx>{`
        @keyframes floatParticle {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: var(--particle-opacity, 0.3);
          }
          25% {
            transform: translate(10px, -15px) scale(1.1);
          }
          50% {
            transform: translate(-5px, -25px) scale(0.9);
            opacity: calc(var(--particle-opacity, 0.3) * 0.5);
          }
          75% {
            transform: translate(-15px, -10px) scale(1.05);
          }
        }

        .stat-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease, opacity 0.7s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.08) inset,
            0 15px 40px rgba(0,0,0,0.4),
            0 0 40px rgba(255,145,0,0.1);
        }

        .server-node {
          transition: opacity 0.5s ease;
        }

        .tooltip-group {
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(2px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}

export default GlobalInfrastructureSection;
