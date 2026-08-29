import React from 'react';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis } from
'recharts';
import { hiresOverTime } from '../../data/analytics';
import { chartPalettes } from './chartTheme';
import { useTheme } from '../../contexts/ThemeContext';

export function HiringTrendChart() {
  const { theme } = useTheme();
  const p = chartPalettes[theme];

  return (
    <div className="h-64 w-full px-2 pb-2">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={hiresOverTime} margin={{ top: 12, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid stroke={p.grid} vertical={false} />
          <XAxis dataKey="month" stroke={p.axis} tickLine={false} axisLine={false} fontSize={11} />
          <YAxis yAxisId="left" stroke={p.axis} tickLine={false} axisLine={false} fontSize={11} />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke={p.axis}
            tickLine={false}
            axisLine={false}
            fontSize={11}
            width={34} />
          
          <Tooltip
            contentStyle={{
              backgroundColor: p.tooltipBg,
              border: `1px solid ${p.tooltipBorder}`,
              borderRadius: 8,
              fontSize: 12,
              color: p.tooltipText
            }} />
          
          <Legend
            verticalAlign="top"
            align="right"
            height={28}
            iconType="circle"
            iconSize={7}
            wrapperStyle={{ fontSize: 11, color: p.axis }} />
          
          <Bar yAxisId="left" dataKey="hires" name="Hires" fill={p.brand} radius={[4, 4, 0, 0]} barSize={22} />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="timeToHire"
            name="Time to hire (days)"
            stroke={p.warning}
            strokeWidth={2}
            dot={{ r: 3, fill: p.warning, strokeWidth: 0 }}
            activeDot={{ r: 4 }} />
          
        </ComposedChart>
      </ResponsiveContainer>
    </div>);

}