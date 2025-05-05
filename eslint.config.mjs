import {dirname} from "path";
import {fileURLToPath} from "url";
import {FlatCompat} from "@eslint/eslintrc";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  {
    ignores: [
      "src/generated/**/*",
      ".next/**/*",
      "dist/**/*",
      "**/*.d.ts",
      "node_modules/**/*"
    ],
  },
  {
    languageOptions: {
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-object-type": ["warn"],
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];