#!/bin/bash
find ./docs -name '*.yaml' -exec swagger-cli validate {} \;
