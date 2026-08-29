import React from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { timeInStage } from '../../data/analytics';
import { chartPalettes } from './chartTheme';
import { useTheme } from '../../contexts/ThemeContext';

export function StageTimeChart() {
  const { theme } = useTheme();
  const p = chartPalettes[theme];

  return (
    <div className="h-56 w-full px-2 pb-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={timeInStage} margin={{ top: 12, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid stroke={p.grid} vertical={false} />
          <XAxis dataKey="stage" stroke={p.axis} tickLine={false} axisLine={false} fontSize={11} />
          <YAxis stroke={p.axis} tickLine={false} axisLine={false} fontSize={11} unit="d" />
          <Tooltip
            contentStyle={{
              backgroundColor: p.tooltipBg,
              border: `1px solid ${p.tooltipBorder}`,
              borderRadius: 8,
              fontSize: 12,
              color: p.tooltipText
            }} />
          
          <Bar dataKey="benchmark" name="Target" fill={p.grid} radius={[4, 4, 0, 0]} barSize={16} />
          <Bar dataKey="days" name="Actual" fill={p.accent} radius={[4, 4, 0, 0]} barSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </div>);

}