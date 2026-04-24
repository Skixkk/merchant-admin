import { defineConfig } from 'orval';

export default defineConfig({
  comeat: {
    input: {
      target: './openapi.yaml',
    },
    output: {
      target: './src/api/index.ts',
      client: 'vue-query',
      mode: 'split',
      override: {
        mutator: {
          path: './src/api/mutator.ts',
          name: 'customAxios',
        },
      },
    },
  },
});