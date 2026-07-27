# 🚢 Nauta — The Data-Entry Brain for Logistics

> **System Design & Recruiting Case Solution by Luis David Preciado**
> 
> *An end-to-end architectural solution for autonomous, intelligent email and document ingestion in supply chain & logistics operations.*

---

## 📌 Overview

This repository contains **Luis David Preciado's candidate case solution** for the **Nauta System Design Exercise: "The Data-Entry Brain for Logistics"**.

In global logistics, operations inboxes receive a constant stream of unstructured emails, multi-document PDF attachments, spreadsheets (`.xlsx`), and status updates from suppliers, freight forwarders, and maritime carriers. 

This design presents a robust, scalable system that replaces manual data entry by reading incoming inbox communications, parsing complex multi-page documents, resolving entities (orders, containers, invoices, bills of lading), applying custom importer rules, and driving structured record updates in Nauta with high precision and human-in-the-loop confidence routing.

---

## 🏗️ Architecture Highlights

The design separates standard operational execution from importer-specific learning:

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
| 📄 [`SOLUTION.md`](./SOLUTION.md) | **Luis David Preciado's full design submission**, detailing system architecture, pipeline stages, edge cases, and end-to-end email walkthrough. |
| 📋 [`CANDIDATE_CASE.md`](./CANDIDATE_CASE.md) | Original Nauta recruiting case specification detailing requirements and constraints. |
| 🌐 [`docs/`](./docs/) | Interactive Web Presentation ([`index.html`](./docs/index.html)) visually demonstrating the architecture and data flows. |

---

## 🌐 Quick Start — Viewing the Interactive Presentation

1. Visit ([https://luisdapreci.github.io/NautaCase/](https://luisdapreci.github.io/NautaCase/))(https://luisdapreci.github.io/Nauta/) in your browser (or open [`docs/index.html`](./docs/index.html) locally).
2. Navigate through the pipeline stages, Importer Memory mechanics, and the running email trace walkthrough.
