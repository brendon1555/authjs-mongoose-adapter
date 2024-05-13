import { defineConfig } from "vitest/config"

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    // NOTE: `.spec` is reserved for Playwright tests
    include: ["**/*.test.?(c|m)[jt]s?(x)"],
    coverage: {
      all: true,
      enabled: true,
      include: ["src"],
      reporter: ["text", "json", "html"],
    },
  },
})