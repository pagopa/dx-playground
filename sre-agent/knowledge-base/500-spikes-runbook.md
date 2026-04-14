# DX To-Do - HTTP 500 Error Investigation Runbook

## Trigger Keywords

`500 error`, `internal server error`, `HTTP 500`, `server error`, `application error`, `unresponsive`, `availability`

## Scope

Azure AppService, Function App or APIM endpoints returning HTTP 500 status codes, indicating internal server errors that affect the availability of the service for customers.

---

## Instructions

### Phase 0: Component Metrics

Check metrics such as CPU and memory of involved components.

### Phase 1: Triage

Check configurations, recent application logs and activity logs for any recent changes or anomalies that could have led to the 500 errors. This includes checking for recent deployments, configuration changes, or any other modifications that might have impacted the API's performance.
Use Application Insights, Log Analytics, or any other monitoring tools in place to gather information about the 500 errors. Look for patterns such as specific endpoints, times of occurrence, or any recent deployments that may have triggered the issue.

---

## Common Root Causes

| Symptom                   | Likely Cause                  | Next Step                           |
| ------------------------- | ----------------------------- | ----------------------------------- |
| High CPU + errors         | Resource exhaustion           | Scale out replicas                  |
| High Memory + OOM         | Memory leak or undersized     | Scale up memory, investigate leak   |
| Sudden spike after deploy | Bad code release              | Rollback to previous revision       |
| Dependency timeouts       | Database/API overload         | Check dependency health             |
| Connection refused        | Service down or network issue | Check target service status         |
| NullReferenceException    | Code bug                      | Trace specific request, review code |
