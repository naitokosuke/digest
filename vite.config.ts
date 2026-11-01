// Vite+ project configuration. Nuxt owns dev/build (package.json scripts).
// lint and typecheck run through the Vize CLI, which reads the `vue` settings below
// (so does the editor integration); formatting is Oxfmt via `vp fmt`.
// https://vizejs.dev/guide/vite-plus/
import { defineConfig } from '@vizejs/vite-plugin/vite-plus'

const sources = 'app server shared nuxt.config.ts vite.config.ts'

export default defineConfig(
  {
    fmt: {
      singleQuote: true,
      semi: false,
      trailingComma: 'none',
      // Markdown keeps its own style (docs/); Oxfmt would rewrite list markers
      ignorePatterns: ['.nuxt/**', '.output/**', '.wrangler/**', 'pnpm-lock.yaml', '**/*.md']
    },
    run: {
      tasks: {
        lint: `vize lint --max-warnings 0 ${sources}`,
        'lint:fix': `vize lint --fix ${sources}`,
        fmt: 'vp fmt',
        'fmt:check': 'vp fmt --check',
        typecheck: 'vize check',
        check: 'vp run typecheck && vp run lint && vp run fmt:check'
      }
    }
  },
  // tasks: the generated ones would mix Oxlint into lint; fmt: keep .vue with Oxfmt too
  { tasks: false, fmt: false }
).withVue({
  // `lint` under withVue is Oxlint-shaped in the Vite+ helper; `linter` is Vize's native linter
  linter: {
    preset: 'happy-path'
  }
})
