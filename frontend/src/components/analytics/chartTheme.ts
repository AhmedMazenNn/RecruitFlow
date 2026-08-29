export interface ChartPalette {
  brand: string;
  accent: string;
  success: string;
  warning: string;
  grid: string;
  axis: string;
  tooltipBg: string;
  tooltipBorder: string;
  tooltipText: string;
}

export const chartPalettes: Record<'light' | 'dark', ChartPalette> = {
  light: {
    brand: '#4F46E5',
    accent: '#8B5CF6',
    success: '#169160',
    warning: '#CA8A04',
    grid: '#E5E7EF',
    axis: '#8A91A3',
    tooltipBg: '#FFFFFF',
    tooltipBorder: '#E5E7EF',
    tooltipText: '#141721'
  },
  dark: {
    brand: '#8182F8',
    accent: '#A784FA',
    success: '#34BD84',
    warning: '#E3A72A',
    grid: '#282D3C',
    axis: '#767D8F',
    tooltipBg: '#1C202B',
    tooltipBorder: '#282D3C',
    tooltipText: '#ECEEF5'
  }
};