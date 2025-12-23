'use client';

import * as React from 'react';
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { formatCurrency } from '@rendrix/utils';

// Custom tooltip component
const CustomTooltip = ({
  active,
  payload,
  label,
  valuePrefix = '',
  valueSuffix = '',
  isCurrency = false,
}: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1a1a] border border-white/[0.08] rounded-lg px-3 py-2 shadow-xl">
        <p className="text-xs text-white/50 mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
            {entry.name}: {valuePrefix}
            {isCurrency ? formatCurrency(entry.value, 'USD') : entry.value.toLocaleString()}
            {valueSuffix}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Area Chart
interface AreaChartProps {
  data: Array<{ name: string; [key: string]: any }>;
  dataKey: string;
  secondaryDataKey?: string;
  height?: number;
  color?: string;
  secondaryColor?: string;
  showGrid?: boolean;
  isCurrency?: boolean;
  gradientId?: string;
}

export function AreaChartComponent({
  data,
  dataKey,
  secondaryDataKey,
  height = 300,
  color = '#FF9100',
  secondaryColor = '#3B82F6',
  showGrid = true,
  isCurrency = false,
  gradientId = 'colorValue',
}: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsAreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
          {secondaryDataKey && (
            <linearGradient id={`${gradientId}-secondary`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={secondaryColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={secondaryColor} stopOpacity={0} />
            </linearGradient>
          )}
        </defs>
        {showGrid && (
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
        )}
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
          tickFormatter={(value) => (isCurrency ? `$${(value / 1000).toFixed(0)}k` : value.toLocaleString())}
        />
        <Tooltip content={<CustomTooltip isCurrency={isCurrency} />} />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          fillOpacity={1}
          fill={`url(#${gradientId})`}
          name={dataKey.charAt(0).toUpperCase() + dataKey.slice(1)}
        />
        {secondaryDataKey && (
          <Area
            type="monotone"
            dataKey={secondaryDataKey}
            stroke={secondaryColor}
            strokeWidth={2}
            fillOpacity={1}
            fill={`url(#${gradientId}-secondary)`}
            name={secondaryDataKey.charAt(0).toUpperCase() + secondaryDataKey.slice(1)}
          />
        )}
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}

// Bar Chart
interface BarChartProps {
  data: Array<{ name: string; [key: string]: any }>;
  dataKey: string;
  secondaryDataKey?: string;
  height?: number;
  color?: string;
  secondaryColor?: string;
  isCurrency?: boolean;
  layout?: 'vertical' | 'horizontal';
}

export function BarChartComponent({
  data,
  dataKey,
  secondaryDataKey,
  height = 300,
  color = '#FF9100',
  secondaryColor = '#3B82F6',
  isCurrency = false,
  layout = 'horizontal',
}: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
        data={data}
        layout={layout === 'vertical' ? 'vertical' : 'horizontal'}
        margin={{ top: 10, right: 10, left: layout === 'vertical' ? 80 : 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
        {layout === 'vertical' ? (
          <>
            <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} />
            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} />
          </>
        ) : (
          <>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} />
          </>
        )}
        <Tooltip content={<CustomTooltip isCurrency={isCurrency} />} />
        <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} name={dataKey.charAt(0).toUpperCase() + dataKey.slice(1)} />
        {secondaryDataKey && (
          <Bar dataKey={secondaryDataKey} fill={secondaryColor} radius={[4, 4, 0, 0]} name={secondaryDataKey.charAt(0).toUpperCase() + secondaryDataKey.slice(1)} />
        )}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

// Line Chart
interface LineChartProps {
  data: Array<{ name: string; [key: string]: any }>;
  lines: Array<{ dataKey: string; color: string; name?: string }>;
  height?: number;
  showGrid?: boolean;
  isCurrency?: boolean;
}

export function LineChartComponent({
  data,
  lines,
  height = 300,
  showGrid = true,
  isCurrency = false,
}: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        {showGrid && (
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
        )}
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
        />
        <Tooltip content={<CustomTooltip isCurrency={isCurrency} />} />
        <Legend
          wrapperStyle={{ paddingTop: '20px' }}
          formatter={(value) => <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>{value}</span>}
        />
        {lines.map((line) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            stroke={line.color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: line.color }}
            name={line.name || line.dataKey}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}

// Donut Chart
interface DonutChartProps {
  data: Array<{ name: string; value: number; color: string }>;
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  showLegend?: boolean;
}

export function DonutChartComponent({
  data,
  height = 250,
  innerRadius = 60,
  outerRadius = 90,
  showLegend = true,
}: DonutChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload;
              return (
                <div className="bg-[#1a1a1a] border border-white/[0.08] rounded-lg px-3 py-2 shadow-xl">
                  <p className="text-sm font-medium" style={{ color: data.color }}>
                    {data.name}: {data.value.toLocaleString()}
                  </p>
                </div>
              );
            }
            return null;
          }}
        />
        {showLegend && (
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            formatter={(value) => <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>{value}</span>}
          />
        )}
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}

// Metric Card Component
interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export function MetricCard({
  title,
  value,
  change,
  changeLabel = 'vs last period',
  icon,
  iconBgColor = 'from-primary/20 to-orange-500/10',
  trend,
}: MetricCardProps) {
  const actualTrend = trend || (change !== undefined ? (change >= 0 ? 'up' : 'down') : 'neutral');

  return (
    <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-xl p-5 hover:border-white/[0.12] transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${iconBgColor} flex items-center justify-center`}>
          {icon}
        </div>
        {change !== undefined && (
          <div className="flex items-center text-sm">
            {actualTrend === 'up' ? (
              <span className="text-emerald-500 flex items-center gap-0.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                </svg>
                +{Math.abs(change).toFixed(1)}%
              </span>
            ) : actualTrend === 'down' ? (
              <span className="text-red-500 flex items-center gap-0.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
                </svg>
                {change.toFixed(1)}%
              </span>
            ) : (
              <span className="text-white/40">0%</span>
            )}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-2xl font-semibold text-white tabular-nums">{value}</h3>
        <p className="text-sm text-white/40">{title}</p>
        {changeLabel && change !== undefined && (
          <p className="text-xs text-white/30">{changeLabel}</p>
        )}
      </div>
    </div>
  );
}

// Mini Sparkline Component
interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
}

export function Sparkline({ data, color = '#FF9100', height = 40 }: SparklineProps) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width="100%" height={height} viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`spark-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,100 ${points} 100,100`}
        fill={`url(#spark-${color})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

// Live Indicator
export function LiveIndicator() {
  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
      </span>
      <span className="text-sm font-medium text-emerald-500">Live</span>
    </div>
  );
}
