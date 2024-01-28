# CQLab

Clinical Query Lab (CQLab) is an open source toolkit for building clinical workflows.

It is commonly used together with the [FHIR](https://www.hl7.org/fhir/) data model, although other open or proprietary data models can be used as well.

CQLab can be used to fully or partially automate prior-authorization decisions, clinical decision support recommendations, clinical calculations, and more.

## Demo Environment

## CQLab Environments

There are 2 primary environments in a solution - the **Editor Environment** and the **Execution Environment**.

- The **Editor Environment** is a no-code UI environment where flow-diagrams, forms, and other clinical specifications can be designed. Generally this environment targets clinical domain experts without requiring code to be written.

- The **Execution Environment** is where an engineering team uses the specifications created in the editor environment as a template to generate libraries or services that can be deployed in a production software environment.

As a series of npm modules, it can be embedded in custom applications, SMART of FHIR apps, microservices, front-end user interfaces, and any other TypeScript instance.

It's primary purpose is to improve automation.
