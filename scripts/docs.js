#!/usr/bin/env node

const { generateDocumentation } = require("tsdoc-markdown");

const nnsInputFiles = [
  "./packages/nns/src/account_identifier.ts",
  "./packages/nns/src/genesis_token.canister.ts",
  "./packages/nns/src/governance.canister.ts",
  "./packages/nns/src/icp.ts",
  "./packages/nns/src/token.ts",
  "./packages/nns/src/ledger.canister.ts",
  "./packages/nns/src/sns_wasm.canister.ts",
];

const snsInputFiles = [
  "./packages/sns/src/governance.canister.ts",
  "./packages/sns/src/ledger.canister.ts",
  "./packages/sns/src/governance.canister.ts",
  "./packages/sns/src/root.canister.ts",
  "./packages/sns/src/sns.ts",
  "./packages/sns/src/sns.wrapper.ts",
  "./packages/sns/src/swap.canister.ts",
  "./packages/sns/src/utils/ledger.utils.ts",
];

const utilsInputFiles = ["./packages/utils/src/index.ts"];

const cmcInputFiles = ["./packages/cmc/src/cmc.canister.ts"];

generateDocumentation({
  inputFiles: nnsInputFiles,
  outputFile: "./packages/nns/README.md",
  markdownOptions: { headingLevel: "###" },
});

generateDocumentation({
  inputFiles: snsInputFiles,
  outputFile: "./packages/sns/README.md",
  markdownOptions: { headingLevel: "###" },
});

generateDocumentation({
  inputFiles: cmcInputFiles,
  outputFile: "./packages/cmc/README.md",
  markdownOptions: { headingLevel: "###" },
});

generateDocumentation({
  inputFiles: utilsInputFiles,
  outputFile: "./packages/utils/README.md",
  markdownOptions: { headingLevel: "###" },
  buildOptions: { explore: true },
});
