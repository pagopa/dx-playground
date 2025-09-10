import { Construct } from 'constructs';
import { TerraformStack } from 'cdktf';
import { provider, portalDashboard } from '@cdktf/provider-azurerm';
import { DashboardConfig } from '../types/openapi';
import { buildDashboardPropertiesTemplate } from './dashboard-properties';

export class AzureDashboardConstruct extends TerraformStack {
  constructor(scope: Construct, id: string, config: DashboardConfig) {
    super(scope, id);

    // Configure Azure provider
    new provider.AzurermProvider(this, 'azure', {
      features: {}
    });

    // Create the dashboard using CDKTF PortalDashboard
    new portalDashboard.PortalDashboard(this, 'dashboard', {
      name: config.name.replace(/\s+/g, '_'), // Same as Python version
      resourceGroupName: 'dashboards', // Hardcoded as in Python version
      location: config.location,
      dashboardProperties: buildDashboardPropertiesTemplate(config)
    });
  }
}
