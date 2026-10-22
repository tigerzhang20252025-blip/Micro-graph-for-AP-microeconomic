import { BilingualText } from './registry';

export interface Point2D {
  x: number;
  y: number;
}

export interface CurveSpec {
  id: string;
  name: BilingualText;
  shortLabel: string; // e.g. "D", "S", "MC", "MR"
  points: Point2D[];
  color: string;
  strokeWidth?: number;
  strokeDasharray?: string; // e.g. 'none', '5,5', '2,2' for accessibility
  visible: boolean;
  equation?: string;
  endLabelPosition?: 'start' | 'end' | 'middle';
}

export interface KeyPointSpec {
  id: string;
  label: BilingualText;
  shortLabel: string; // e.g. "E₀", "(Q*, P*)"
  x: number;
  y: number;
  color?: string;
  showDropLines?: boolean;
  xLabel?: string;
  yLabel?: string;
}

export interface ShadedAreaSpec {
  id: string;
  label: BilingualText;
  points: Point2D[];
  fill: string;
  opacity?: number;
  pattern?: 'dots' | 'diagonal-left' | 'diagonal-right' | 'cross' | 'solid';
  value?: number;
  valuePrefix?: string;
  visible: boolean;
}

export interface AxisConfig {
  xLabel: BilingualText;
  yLabel: BilingualText;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  xStep?: number;
  yStep?: number;
  xPrefix?: string;
  xSuffix?: string;
  yPrefix?: string;
  ySuffix?: string;
}

export interface ResultMetric {
  id: string;
  label: BilingualText;
  shortLabel?: string;
  value: number | string;
  prefix?: string;
  suffix?: string;
  color?: string;
  formula?: string;
  interpretation?: BilingualText;
}

export interface SliderControlSpec {
  type: 'slider';
  id: string;
  label: BilingualText;
  min: number;
  max: number;
  step: number;
  unit?: string;
  help?: BilingualText;
}

export interface ToggleControlSpec {
  type: 'toggle';
  id: string;
  label: BilingualText;
  help?: BilingualText;
}

export interface SelectControlSpec {
  type: 'select';
  id: string;
  label: BilingualText;
  options: {
    id: string;
    label: BilingualText;
  }[];
}

export type ControlSpec = SliderControlSpec | ToggleControlSpec | SelectControlSpec;

export interface ScenarioPreset {
  id: string;
  name: BilingualText;
  description: BilingualText;
  params: Record<string, any>;
}

export interface GraphCalculationOutput {
  axes: AxisConfig;
  curves: CurveSpec[];
  points: KeyPointSpec[];
  shadedAreas: ShadedAreaSpec[];
  results: ResultMetric[];
  explanation: BilingualText;
  analysisPoints: BilingualText[];
}

export interface EconomicModel {
  id: string;
  topicId: string;
  name: BilingualText;
  description: BilingualText;
  defaultParams: Record<string, any>;
  controls: ControlSpec[];
  presets?: ScenarioPreset[];
  calculate: (params: Record<string, any>) => GraphCalculationOutput;
}
