import { Construct } from 'constructs';
import { App } from 'cdktf';
import { DashboardConfig } from '../types/openapi';
import { AzureDashboardConstruct } from '../constructs/azure-dashboard';
import { AzureAlertsConstruct } from '../constructs/azure-alerts';

export class AzureDashboardCdkBuilder {
  constructor(private config: DashboardConfig) {}

  build(): string {
    const app = new App();

    // Create the main stack with dashboard and alerts
    const stack = new AzureDashboardStack(app, 'opex-dashboard', this.config);

    // Synthesize to generate Terraform code
    app.synth();

    // Return the generated Terraform code (this would be from the cdktf.out directory)
    return 'Terraform code generated in cdktf.out directory';
  }
}

class AzureDashboardStack extends Construct {
  constructor(scope: Construct, id: string, config: DashboardConfig) {
    super(scope, id);

    // Create dashboard
    new AzureDashboardConstruct(this, 'dashboard', config);

    // Create alerts
    new AzureAlertsConstruct(this, config);
  }
}
