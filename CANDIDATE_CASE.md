# Design Case: The Data-Entry Brain for Logistics

## What this is

This is a design exercise. We want to see how you think about a hard, real, agentic problem — a real problem at the center of Nauta.

There is **no code to write and nothing to run**. We want a written document: your **end-to-end architecture and the flow** of a system that solves the problem below. Take roughly **a week**, at whatever length and format you think does the idea justice. Afterwards we'll sit down together and you'll walk us through it while we ask questions.

Use whatever you want — AI assistants, research, anything is on the table. We assume you'll use these tools; we're interested in the thinking you do with them, and you'll be expected to defend every decision in person.

You don't need prior logistics knowledge — everything you need is here. What we're looking at is how you design under the kind of mess this problem actually has.

---

## The setup

Nauta is a supply-chain and logistics platform. Importers use it to manage their orders, shipments, containers, and documents in one place. But the world doesn't send them clean API calls — it sends them **email**.

An importer's operations inbox receives a constant stream of messages from everyone they work with: suppliers, maritime lines, freight forwarders, customs brokers, and their own internal teams. Buried in those emails and their attachments is the data that runs the importer's business — a new purchase order, an invoice, a bill of lading, a container that just changed its estimated arrival, a booking confirmation. Today a human reads each message, opens the attachments, figures out what it means, and types the result into Nauta.

We are building the system that replaces that human: Nauta's main data entry point, a system that **reads everything arriving in the importer's inbox and turns it into the right records in Nauta, automatically.**

Concretely, for every incoming email this system must:

1. **Understand what arrived** — read the email and every attachment.
2. **Extract the structured data** — classify each document (invoice? packing list? bill of lading?) and pull out the fields that matter.
3. **Reconcile it against Nauta** — check it against what the importer already has, resolve references (which order? which container? which supplier?), and link the new information to the right existing records.
4. **Decide what to do** — create, update, or ignore records in Nauta — or, when it isn't sure, hand the case to the back-office team for human review instead of guessing.

You also have a resource available: **a team of human reviewers who can check the system's output and correct it when needed.**

The entities the system works with are the core nouns of importing: **orders, invoices, bills of lading, containers, bookings, shipments, suppliers, maritime lines.** Documents reference each other through a handful of key identifiers — a purchase order number, an invoice number, a container number, a bill-of-lading number, a booking number — and the relationships between those identifiers are what tie a shipment's whole story together.

This sounds like a document-extraction task. It is not. The extraction is the easy part. What makes it hard is everything around it.

---

## Why this is hard

### 1. It has to ingest *anything*

The inbox does not cooperate. Attachments arrive as PDFs (clean exports, scanned-and-photographed, or a photo of a screen), spreadsheets (`.xlsx`, `.xls`, macro-enabled `.xlsm`), Word documents, plain text, images, and `.zip` files containing more of the above. A single PDF might be **three separate invoices**, or **an invoice plus its packing list plus a bill of lading**. A spreadsheet might be one container manifest that simply spans hundreds of rows. There is no template, no schema, no guarantee of structure. The system has to make sense of whatever shows up.

### 2. Every importer's rules are different, specific, and illogical

This is the heart of the problem.

There is no single correct way to read these documents, because **every importer interprets them differently**, and their rules are not the clean, logical rules you'd hope for. They are the accumulated quirks of how a real logistics operation actually runs. For example (all real in spirit):

- "Emails from *this* freight forwarder are just status noise — never create anything from them."
- "This document is titled **Purchase Order**, but for *this* importer a supplier's 'PO' is actually a Proforma Invoice — never treat it as an order."
- "Ignore the date printed on the bill of lading; the ETA we trust is the one in the email body."
- "For this one supplier, the PO number we care about is in the filename, not anywhere in the document."
- "This supplier writes the container number with a typo every time — it's still the same container."

These rules **contradict the face value of the documents**, they **contradict each other**, and they are **different for every importer.** There is no global schema you can write down once. The system's behaviour has to bend to each importer's particular, illogical reality.

### 3. The same entity is named ten different ways

The data in the email rarely matches what's already in Nauta cleanly. A supplier called "Acme" in the email is "Acme Inc." in Nauta. A maritime line might be referenced by a shortened name, a code, or a misspelling. A container or PO number might carry a typo, an OCR error, or a different prefix. The system has to **resolve** these — match the messy incoming reference to the correct existing supplier, order, or container in Nauta — and know the difference between "this is a brand-new entity" and "this is one I already have, just spelled differently." Resolving a name to the wrong Nauta ID silently corrupts a shipment's record.

### 4. Being wrong is expensive

The output isn't a suggestion on a screen — it writes into Nauta, the importer's system of record. A wrong invoice created automatically, or an ETA update applied to the wrong container, is worse than doing nothing, because the whole operations team downstream trusts it. So the system can't just always act. It needs a notion of **how confident it is**, and a way to **route a case to the back-office reviewers** when it isn't sure — while still acting automatically often enough to actually save the importer work. Where that line sits, and how the system knows which side of it a given extraction falls on, is part of the problem.

### 5. The rules aren't given to you

Nobody hands you the list of an importer's illogical rules up front. They are not written down anywhere — they live in the heads of the people who do this work today. What you *do* have is the team of human reviewers: they can look at what the system produced and tell you when it's wrong and what the right answer was. How you make use of that is up to you.

### 6. The input is untrusted

The emails come from outside parties — suppliers and forwarders the system has never met. Their content cannot be treated as trustworthy instructions. An email might contain text that, read naively, looks like a command. The system has to act on what a message *means* for the importer's shipments without ever letting the message's content hijack what it does.

### 7. It has to do all of this at scale

This isn't one inbox. It's many importers, each with many senders, each with their own quirks, processing a continuous high volume of email — reliably, without losing or double-processing a single message, and cheaply enough to make business sense.

---

## What we want from you

Design the system.

Give us a written document — your **high-level solution** and the **end-to-end flow** of how an email becomes the right outcome in Nauta, from the moment it lands in the importer's inbox to the moment a record is created, updated, ignored, or sent to review.

We are **not** asking you to pick a tech stack or name specific tools, frameworks, or vendors. Stay at the level of the design. What we most want to see is the **agentic architecture**, what each part is responsible for, how they coordinate, how information and decisions flow between them, and why that shape fits this problem.

We care about **how you reason about the problem far more than about a polished final picture.** Show us the choices you considered, where the genuinely hard parts are, what you'd do about them, and where your design would break. Make the trade-offs explicit.

There is no expected answer and no required structure. Spend about a week. Then come talk us through it.
