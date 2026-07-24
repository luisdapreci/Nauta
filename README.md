# 🚢 Nauta — The Data-Entry Brain for Logistics

> **An end-to-end system design for autonomous, intelligent email and document ingestion in supply chain & logistics operations.**

---

## 📌 Overview

In global logistics, operations inboxes receive a constant stream of unstructured emails, multi-document PDF attachments, spreadsheets (`.xlsx`), and status updates from suppliers, freight forwarders, and maritime carriers. 

**Nauta's Data-Entry Brain** replaces manual data entry by reading incoming inbox communications, parsing complex multi-page documents, resolving entities (orders, containers, invoices, bills of lading), applying custom importer rules, and driving structured record updates in Nauta with high precision and human-in-the-loop confidence routing.

---

## 🏗️ Architecture Highlights

The system separates standard operational execution from importer-specific learning:

* **The Spine (6-Stage Execution Pipeline)**:
  1. **Ingestion & Deconstruction** — Email splitting, attachment unpacking, and document decomposition.
  2. **Extraction & Normalization** — Key-field extraction across invoices, packing lists, and BLs.
  3. **Identity & Reconciliation** — Graph matching against Nauta's existing system of record.
  4. **Interpretation & Business Rules** — Executing importer-specific heuristics and override rules.
  5. **Confidence & Routing** — Multi-dimensional confidence scoring for automated write vs. back-office review.
  6. **Action Execution & Lineage** — Immutable ledger mutation with audit trail.

* **The Brain (Importer Memory & Learning Loop)**:
  * **Importer Memory** — Persists entity mapping graphs, forwarder rules, and historical heuristics per client.
  * **Learning Loop** — Converts back-office reviewer feedback into learned rules and auto-tuned confidence thresholds.

---

## 📁 Repository Structure

| Path / File | Description |
| :--- | :--- |
| 📄 [`SOLUTION_DRAFT.md`](./SOLUTION_DRAFT.md) | Comprehensive system design document detailing architecture, pipeline stages, edge cases, and end-to-end walkthroughs. |
| 📋 [`CANDIDATE_CASE.md`](./CANDIDATE_CASE.md) | Problem specification detailing logistics ingestion challenges and constraints. |
| 🌐 [`site/`](./site/) | Interactive Web Presentation ([`index.html`](./site/index.html)) for exploring the architecture and data flows visually. |

---

## 🌐 Quick Start — Viewing the Interactive Presentation

To explore the architecture and interactive diagrams:

1. Open [`site/index.html`](./site/index.html) in your browser.
2. Navigate through the pipeline stages, Importer Memory mechanics, and running email walkthrough.
