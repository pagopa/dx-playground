import { describe, it, expect } from "vitest";
import { App } from "cdktf";
import { promises as fs } from "fs";
import * as os from "os";
import * as path from "path";

import { AzureOpexStack } from "../../src/infrastructure/terraform/azure-dashboard.js";
import { DashboardConfig, Endpoint } from "../../src/domain/index.js";

describe("synth: tags are applied to dashboard and alerts", () => {
  it("emits tags in cdk.tf for portal dashboard and alerts", async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "opex-tags-"));

    const endpoint: Endpoint = {
      path: "/api/v1/services",
      availability_threshold: 0.99,
      response_time_threshold: 1,
    } as Endpoint;

    const dataSource =
      "/subscriptions/uuid/resourceGroups/my-rg/providers/Microsoft.Network/applicationGateways/my-gtw";

    const config: DashboardConfig = {
      oa3_spec: "spec.yaml",
      name: "Tags Dashboard",
      data_source: dataSource,
      resource_type: "app-gateway",
      timespan: "5m",
      resource_group_name: "dashboards",
      resourceIds: [dataSource],
      hosts: ["app-backend.io.italia.it"],
      endpoints: [endpoint],
      tags: { Environment: "TEST", CostCenter: "CC123" },
    } as unknown as DashboardConfig;

    const app = new App({ outdir: tmp, hclOutput: false });
    // eslint-disable-next-line no-new
    new AzureOpexStack(app, "opex-dashboard", config);
    app.synth();

    // Prefer JSON output from CDKTF; fall back to legacy paths if needed
    const candidates = [
      path.join(tmp, "stacks", "opex-dashboard", "cdk.tf.json"),
      path.join(tmp, "stacks", "opex-dashboard", "cdk.tf"),
      path.join(tmp, "cdk.tf.json"),
      path.join(tmp, "cdk.tf"),
    ];

    let tf: string | undefined;
    let tfPath: string | undefined;
    for (const p of candidates) {
      try {
        tf = await fs.readFile(p, "utf8");
        tfPath = p;
        break;
      } catch {
        // try next candidate
      }
    }

    if (!tf || !tfPath) {
      throw new Error(
        `Could not find synthesized Terraform output. Tried: ${candidates.join(", ")}`,
      );
    }
    const json = JSON.parse(tf);

    // Dashboard has tags
    const dashboard = json.resource.azurerm_portal_dashboard.dashboard;
    expect(dashboard).toBeDefined();
    expect(dashboard.tags).toMatchObject({
      Environment: "TEST",
      CostCenter: "CC123",
    });

    // Alerts have tags
    const alerts = json.resource.azurerm_monitor_scheduled_query_rules_alert;
    expect(alerts.alarm_availability_0.tags).toMatchObject({
      Environment: "TEST",
      CostCenter: "CC123",
    });
    expect(alerts.alarm_time_0.tags).toMatchObject({
      Environment: "TEST",
      CostCenter: "CC123",
    });
  });
});
