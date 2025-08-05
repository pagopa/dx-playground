#!/usr/bin/env bash

currentPercentage=${3:-0}

nextPercentage=$((currentPercentage + 20))
afterMs=10000

jq -n --arg nextPercentage "$nextPercentage" --arg afterMs "$afterMs" \
  '{nextPercentage: $nextPercentage | tonumber, afterMs: $afterMs | tonumber}'
