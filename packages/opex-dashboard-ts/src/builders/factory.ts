import { DashboardConfig } from '../utils/config-validation';
import { AzureDashboardRawBuilder } from './azure-dashboard-raw';
import { AzureDashboardCdkBuilder } from './azure-dashboard-cdk';

export type TemplateType = 'azure-dashboard' | 'azure-dashboard-raw';

export class BuilderFactory {
  static createBuilder(templateType: TemplateType, config: DashboardConfig): Builder {
    switch (templateType) {
      case 'azure-dashboard':
        return new AzureDashboardCdkBuilder(config);
      case 'azure-dashboard-raw':
        return new AzureDashboardRawBuilder(config);
      default:
        throw new Error(`Unknown template type: ${templateType}`);
    }
  }
}

export interface Builder {
  build(): string;
}
