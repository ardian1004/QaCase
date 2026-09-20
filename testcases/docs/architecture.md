# Framework Architecture & Technical Design

## 1. Directory Structure

```text
├── .github/workflows/   # CI/CD Pipeline Automation
├── docs/               # System & Testing Architecture
├── test-cases/         # Manual Test Specification Documents
├── tests/
│   ├── api/            # API Integration & Contract Specs
│   └── e2e/            # End-to-End User Flow Tests
├── package.json        # Dependencies & Test Execution Scripts
└── playwright.config.ts# Playwright Multi-Project Configuration