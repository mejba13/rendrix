'use client';

import { useEffect, useState, useRef } from 'react';
import { Globe, Zap, Shield, Activity, Server } from 'lucide-react';

// Data center locations (approximate lat/lng converted to globe positions)
const datacenters = [
  { id: 1, name: 'US East', x: 28, y: 35, delay: 0 },
  { id: 2, name: 'US West', x: 15, y: 38, delay: 0.2 },
  { id: 3, name: 'EU West', x: 48, y: 32, delay: 0.4 },
  { id: 4, name: 'EU Central', x: 52, y: 33, delay: 0.6 },
  { id: 5, name: 'Asia Pacific', x: 78, y: 42, delay: 0.8 },
  { id: 6, name: 'Japan', x: 85, y: 35, delay: 1.0 },
  { id: 7, name: 'Australia', x: 82, y: 62, delay: 1.2 },
  { id: 8, name: 'South America', x: 32, y: 58, delay: 1.4 },
  { id: 9, name: 'India', x: 68, y: 45, delay: 1.6 },
  { id: 10, name: 'Middle East', x: 58, y: 40, delay: 1.8 },
];

// Connection arcs between data centers
const connections = [
  { from: 1, to: 3 },
  { from: 1, to: 2 },
  { from: 3, to: 4 },
  { from: 4, to: 5 },
  { from: 5, to: 6 },
  { from: 5, to: 7 },
  { from: 1, to: 8 },
  { from: 4, to: 9 },
  { from: 9, to: 10 },
  { from: 2, to: 6 },
];

// Generate stars for the background
const generateStars = (count: number, layer: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `star-${layer}-${i}`,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: layer === 0 ? Math.random() * 2 + 1 : Math.random() * 1.5 + 0.5,
    opacity: layer === 0 ? Math.random() * 0.5 + 0.3 : Math.random() * 0.3 + 0.1,
    twinkle: Math.random() > 0.7,
    delay: Math.random() * 3,
  }));
};

const starLayers = [
  generateStars(30, 0), // Bright foreground stars
  generateStars(60, 1), // Medium stars
  generateStars(100, 2), // Dim background stars
];

// Stat card data
const stats = [
  {
    icon: Globe,
    value: '250+',
    label: 'Points of Presence',
    sublabel: 'Global edge network',
    delay: 0,
    position: 'left-top',
  },
  {
    icon: Zap,
    value: '<50ms',
    label: 'Response Time',
    sublabel: 'Average latency worldwide',
    delay: 0.15,
    position: 'left-bottom',
  },
  {
    icon: Shield,
    value: '99.99%',
    label: 'Uptime SLA',
    sublabel: 'Enterprise guarantee',
    delay: 0.3,
    position: 'right-top',
  },
  {
    icon: Activity,
    value: '10M+',
    label: 'Requests/Second',
    sublabel: 'Peak throughput capacity',
    delay: 0.45,
    position: 'right-bottom',
  },
];

// Generate arc path between two points with curve
function generateArcPath(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  globeSize: number
): string {
  const startX = (fromX / 100) * globeSize;
  const startY = (fromY / 100) * globeSize;
  const endX = (toX / 100) * globeSize;
  const endY = (toY / 100) * globeSize;

  // Calculate control point for the curve (arc upward)
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;
  const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
  const curveHeight = Math.min(distance * 0.4, 80);

  const controlX = midX;
  const controlY = midY - curveHeight;

  return `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`;
}

// Animated data packet component
function DataPacket({ path, delay }: { path: string; delay: number }) {
  return (
    <circle r="3" fill="#FF9100" className="data-packet">
      <animateMotion
        dur="2.5s"
        repeatCount="indefinite"
        begin={`${delay}s`}
        path={path}
      />
      <animate
        attributeName="opacity"
        values="0;1;1;0"
        dur="2.5s"
        repeatCount="indefinite"
        begin={`${delay}s`}
      />
    </circle>
  );
}

// Star component with optional twinkling
function Star({ star }: { star: typeof starLayers[0][0] }) {
  return (
    <div
      className={`absolute rounded-full bg-white ${star.twinkle ? 'animate-twinkle' : ''}`}
      style={{
        left: `${star.x}%`,
        top: `${star.y}%`,
        width: star.size,
        height: star.size,
        opacity: star.opacity,
        animationDelay: `${star.delay}s`,
      }}
    />
  );
}

// Stat card component
function StatCard({
  stat,
  isVisible,
}: {
  stat: typeof stats[0];
  isVisible: boolean;
}) {
  const Icon = stat.icon;

  return (
    <div
      className={`stat-card relative backdrop-blur-xl rounded-2xl border border-white/[0.08] p-5 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03) inset',
        transitionDelay: `${stat.delay}s`,
        animation: isVisible ? `float 6s ease-in-out infinite ${stat.delay + 0.5}s` : 'none',
      }}
    >
      {/* Glow effect */}
      <div
        className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: 'linear-gradient(135deg, rgba(255,145,0,0.1) 0%, transparent 50%)',
        }}
      />

      <div className="relative flex items-start gap-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: 'linear-gradient(135deg, rgba(255,145,0,0.2) 0%, rgba(255,145,0,0.05) 100%)',
            boxShadow: '0 0 20px rgba(255,145,0,0.15)',
          }}
        >
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className="min-w-0">
          <div
            className="text-2xl font-semibold tracking-tight tabular-nums"
            style={{
              fontFamily: "'Google Sans Display', 'Google Sans', system-ui, sans-serif",
              background: 'linear-gradient(135deg, #FFFFFF 0%, rgba(255,255,255,0.8) 100%)',
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

// Main Globe Component
function GlobeVisualization({ isVisible }: { isVisible: boolean }) {
  const globeSize = 420;

  return (
    <div
      className={`relative transition-all duration-1000 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
      }`}
      style={{ width: globeSize, height: globeSize }}
    >
      {/* Outer glow */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(255,145,0,0.15) 0%, transparent 50%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Globe SVG */}
      <svg
        viewBox={`0 0 ${globeSize} ${globeSize}`}
        className="w-full h-full globe-rotate"
        style={{ filter: 'drop-shadow(0 0 60px rgba(255,145,0,0.2))' }}
      >
        <defs>
          {/* Gradient for globe fill */}
          <radialGradient id="globeGradient" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="rgba(30,35,40,1)" />
            <stop offset="50%" stopColor="rgba(15,18,22,1)" />
            <stop offset="100%" stopColor="rgba(5,8,12,1)" />
          </radialGradient>

          {/* Gradient for globe edge */}
          <radialGradient id="globeEdge" cx="50%" cy="50%" r="50%">
            <stop offset="85%" stopColor="transparent" />
            <stop offset="95%" stopColor="rgba(255,145,0,0.1)" />
            <stop offset="100%" stopColor="rgba(255,145,0,0.3)" />
          </radialGradient>

          {/* Gradient for grid lines */}
          <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,145,0,0.1)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.08)" />
            <stop offset="100%" stopColor="rgba(255,145,0,0.1)" />
          </linearGradient>

          {/* Glow filter for data centers */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Glow filter for arcs */}
          <filter id="arcGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Clip path for globe */}
          <clipPath id="globeClip">
            <circle cx={globeSize / 2} cy={globeSize / 2} r={globeSize / 2 - 10} />
          </clipPath>
        </defs>

        {/* Globe base */}
        <circle
          cx={globeSize / 2}
          cy={globeSize / 2}
          r={globeSize / 2 - 10}
          fill="url(#globeGradient)"
          stroke="rgba(255,145,0,0.15)"
          strokeWidth="1"
        />

        {/* Globe edge glow */}
        <circle
          cx={globeSize / 2}
          cy={globeSize / 2}
          r={globeSize / 2 - 10}
          fill="url(#globeEdge)"
        />

        {/* Grid group with clip */}
        <g clipPath="url(#globeClip)">
          {/* Latitude lines */}
          {[20, 35, 50, 65, 80].map((y, i) => (
            <ellipse
              key={`lat-${i}`}
              cx={globeSize / 2}
              cy={(y / 100) * globeSize}
              rx={globeSize / 2 - 20 - Math.abs(50 - y) * 2}
              ry={15 + Math.abs(50 - y) * 0.3}
              fill="none"
              stroke="url(#gridGradient)"
              strokeWidth="0.5"
              opacity={0.4}
            />
          ))}

          {/* Longitude lines */}
          {[0, 30, 60, 90, 120, 150].map((angle, i) => (
            <ellipse
              key={`lng-${i}`}
              cx={globeSize / 2}
              cy={globeSize / 2}
              rx={Math.cos((angle * Math.PI) / 180) * (globeSize / 2 - 20)}
              ry={globeSize / 2 - 20}
              fill="none"
              stroke="url(#gridGradient)"
              strokeWidth="0.5"
              opacity={0.3}
              transform={`rotate(${angle * 0.3}, ${globeSize / 2}, ${globeSize / 2})`}
            />
          ))}

          {/* Connection arcs */}
          <g filter="url(#arcGlow)">
            {connections.map((conn, i) => {
              const from = datacenters.find((d) => d.id === conn.from)!;
              const to = datacenters.find((d) => d.id === conn.to)!;
              const path = generateArcPath(from.x, from.y, to.x, to.y, globeSize);

              return (
                <g key={`conn-${i}`}>
                  {/* Arc path */}
                  <path
                    d={path}
                    fill="none"
                    stroke="rgba(255,145,0,0.3)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    className="arc-path"
                    style={{
                      strokeDasharray: '200',
                      strokeDashoffset: '200',
                      animation: `dashDraw 3s ease-out forwards ${i * 0.2}s`,
                    }}
                  />

                  {/* Animated data packet */}
                  <DataPacket path={path} delay={i * 0.3} />
                </g>
              );
            })}
          </g>

          {/* Data center points */}
          {datacenters.map((dc) => (
            <g key={dc.id} filter="url(#glow)">
              {/* Outer pulse ring */}
              <circle
                cx={(dc.x / 100) * globeSize}
                cy={(dc.y / 100) * globeSize}
                r="12"
                fill="none"
                stroke="#FF9100"
                strokeWidth="1"
                opacity="0.3"
                className="pulse-ring"
                style={{ animationDelay: `${dc.delay}s` }}
              />

              {/* Inner glow */}
              <circle
                cx={(dc.x / 100) * globeSize}
                cy={(dc.y / 100) * globeSize}
                r="6"
                fill="rgba(255,145,0,0.3)"
              />

              {/* Core point */}
              <circle
                cx={(dc.x / 100) * globeSize}
                cy={(dc.y / 100) * globeSize}
                r="3"
                fill="#FF9100"
                className={`dc-point ${isVisible ? 'animate-appear' : ''}`}
                style={{
                  animationDelay: `${dc.delay + 0.5}s`,
                  opacity: isVisible ? 1 : 0,
                }}
              />
            </g>
          ))}
        </g>

        {/* Specular highlight */}
        <ellipse
          cx={globeSize * 0.35}
          cy={globeSize * 0.3}
          rx={80}
          ry={40}
          fill="rgba(255,255,255,0.02)"
        />
      </svg>

      {/* Reflection/ground glow */}
      <div
        className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[300px] h-[100px] rounded-full"
        style={{
          background: 'radial-gradient(ellipse, rgba(255,145,0,0.15) 0%, transparent 70%)',
          filter: 'blur(30px)',
        }}
      />
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
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 lg:py-40 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #000000 0%, #050508 50%, #000000 100%)' }}
    >
      {/* Starfield background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {starLayers.map((layer) =>
          layer.map((star) => <Star key={star.id} star={star} />)
        )}
      </div>

      {/* Ambient gradients */}
      <div
        className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,145,0,0.05) 0%, transparent 50%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,100,0,0.04) 0%, transparent 50%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div
          className={`text-center mb-16 lg:mb-20 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] mb-6">
            <Server className="w-4 h-4 text-primary" />
            <span className="text-sm text-white/60 font-medium tracking-wide">Global Infrastructure</span>
          </div>

          {/* Headline */}
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight mb-6"
            style={{ fontFamily: "'Google Sans Display', 'Google Sans', system-ui, sans-serif" }}
          >
            <span className="text-white">Rock solid</span>
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                background: 'linear-gradient(135deg, #FF9100 0%, #FFB84D 50%, #FF9100 100%)',
                WebkitBackgroundClip: 'text',
              }}
            >
              and lightning fast
            </span>
          </h2>

          {/* Subheading */}
          <p className="max-w-2xl mx-auto text-lg text-white/50 leading-relaxed">
            Your stores load in milliseconds from anywhere on the planet. Built on a global edge network
            with automatic failover and enterprise-grade reliability.
          </p>
        </div>

        {/* Main visualization area */}
        <div className="relative flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-0">
          {/* Left stat cards */}
          <div className="flex flex-row lg:flex-col gap-4 lg:gap-6 lg:absolute lg:left-0 lg:top-1/2 lg:-translate-y-1/2 z-10">
            {stats.slice(0, 2).map((stat) => (
              <StatCard key={stat.label} stat={stat} isVisible={isVisible} />
            ))}
          </div>

          {/* Globe */}
          <div className="relative lg:mx-auto">
            <GlobeVisualization isVisible={isVisible} />
          </div>

          {/* Right stat cards */}
          <div className="flex flex-row lg:flex-col gap-4 lg:gap-6 lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 z-10">
            {stats.slice(2, 4).map((stat) => (
              <StatCard key={stat.label} stat={stat} isVisible={isVisible} />
            ))}
          </div>
        </div>

        {/* Bottom CTA hint */}
        <div
          className={`text-center mt-16 transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="text-sm text-white/40">
            Powered by <span className="text-primary font-medium">Rendrix Edge Network</span> —
            serving customers in 190+ countries
          </p>
        </div>
      </div>

      {/* Inline styles for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: inherit;
          }
          50% {
            opacity: 0.2;
          }
        }

        @keyframes pulse-ring {
          0% {
            transform: scale(1);
            opacity: 0.4;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        @keyframes dashDraw {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes appear {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }

        .pulse-ring {
          animation: pulse-ring 2s ease-out infinite;
        }

        .globe-rotate {
          animation: rotateGlobe 60s linear infinite;
        }

        @keyframes rotateGlobe {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-appear {
          animation: appear 0.5s ease-out forwards;
        }

        .stat-card {
          width: 220px;
        }

        @media (max-width: 1024px) {
          .stat-card {
            width: auto;
            min-width: 180px;
          }
        }
      `}</style>
    </section>
  );
}

export default GlobalInfrastructureSection;
