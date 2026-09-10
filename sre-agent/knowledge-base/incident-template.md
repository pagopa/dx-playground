<!-- This is a template for creating an issue (whether GitHub or Jira) to track an incident triggered by an Azure Monitor alert. The issue should include all relevant information to facilitate investigation and resolution. -->

# Incident Template

When creating an issue for an incident, use the following structured format. This ensures consistency, readability, and actionable write-ups.

---

## Issue Title Format

`[STATUS]: [ALERT NAME] - [SERVICE NAME] (sre agent thread guid)`

**Example**: `[Sev0] Cosmos RU Consumption alert - dx-d-itn-playground-pg-cosno-01 (34fb5a6d)`

## Issue Body Template

Use this exact markdown structure for the issue body:

```markdown
# Incident report: <short description>

- Alert ID: `<id>`
- Rule: `<rule name>`
- Resource: `<resource name>`
- Resource Group: `<resource group name>`
- Severity: `<severity>`
- Fired at: `<timestamp>`
- Current monitor condition: `<condition>`

## Timeline (UTC)

- **~HH:MM:** <First sign / metric anomaly>
- **~HH:MM:** <Error escalation or alert fired>
- **~HH:MM:** <Peak or notable event>

## Evidence

### Console logs (active revision)

<paste relevant error logs, stack traces>

## Root Cause

<1-2 sentences explaining the technical root cause. Reference the specific code path, controller, or component.>

## Remediation

- **Code:** <code-level fix, e.g., "Implement bounded cache or move to persistent store">
- **Defensive:** <validation/throttling, e.g., "Add payload size limits and rate limiting">
- **Platform:** <infrastructure fix, e.g., "Increase memory limit, add memory-based autoscale">
- **Observability:** <monitoring improvements, e.g., "Add alert for OOM exceptions">

## Action Items

| #   | Action                   | Priority |
| --- | ------------------------ | -------- |
| 1   | <specific fix>           | High     |
| 2   | <test to add>            | Medium   |
| 3   | <config change>          | Medium   |
| 4   | <monitoring improvement> | Low      |

## References

- Container App: `<full ARM resource ID>`
- Log Analytics Workspace ID: `<workspace GUID>`
- App Insights: `<full ARM resource ID>`

## I will post updates in this issue as evidence is collected.

_This issue was created by <sre-agent-instance-name>_

Tracked by the SRE agent [here](link-to-sre-agent-dashboard).
```

---

## Labels to Apply

Based on classification, apply these labels to the issue:

| Condition                 | Labels            |
| ------------------------- | ----------------- |
| Any bug                   | `bug`             |
| API-related               | `api-bug`         |
| Frontend-related          | `frontend-bug`    |
| Memory leak / OOM         | `memory-leak`     |
| Critical or high severity | `severity-high`   |
| Medium severity           | `severity-medium` |
| Performance degradation   | `performance`     |

## Tips for Quality Incident Reports

1. **Be specific** — include actual metric values, timestamps, and resource IDs
2. **Include stack traces** — paste the full exception with file:line references
3. **Show before/after** — compare the anomaly window to the normal baseline
4. **Actionable items** — every report must end with concrete next steps
5. **Link resources** — include full ARM resource IDs for quick portal navigation

---

## Incident Report Lifecycle

As you investigate, post a new comment in that issue whenever:

- any relevant status update occurs in the investigation or mitigation process;
- you identify a possible root cause (RCA) which differs from the one previously stated;
- you identify an anomalous metric;
- you discover a workaround that can be applied to the issue;
- you discover a mitigation that can be applied to the issue;
