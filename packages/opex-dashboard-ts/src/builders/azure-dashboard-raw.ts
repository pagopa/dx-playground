import { DashboardConfig } from '../utils/config-validation';
import { buildDashboardPropertiesTemplate } from '../constructs/dashboard-properties';

export class AzureDashboardRawBuilder {
  constructor(private config: DashboardConfig) {}

  build(): string {
    return buildDashboardPropertiesTemplate(this.config);
  }
}
