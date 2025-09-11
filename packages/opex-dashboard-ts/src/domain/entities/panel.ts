export interface Panel {
  chart: {
    inputSpecificChart: string;
    settingsSpecificChart: string;
  };
  dimensions: {
    aggregation?: string;
    splitBy?: { name: string; type: string }[];
    xAxis: { name: string; type: string };
    yAxis: { name: string; type: string }[];
  };
  id: number;
  kind: PanelKind;
  path: string;
  position: { colSpan: number; rowSpan: number; x: number; y: number };
  query: string;
  subtitle: string;
  title: string;
}

export type PanelKind = "availability" | "response-codes" | "response-time";
