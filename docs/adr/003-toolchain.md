# ADR-003: Vite+ と Vize の採用、Cloudflare cf CLI の見送り

## ステータス

採用 (cf CLI は見送り)

## コンテキスト

依存を最新化するにあたり、パッケージ管理とタスク実行を Vite+ (`vp`) に、Vue のツールチェインを Vize (ubugeeei 作) に寄せ、あわせて Cloudflare の新 CLI である cf への移行を検討した。
2026 年 11 月 1 日時点の状況は次のとおり。

* Nuxt 4.6.3、Vue 3.5.44、TypeScript 7.0.2、Vite+ 1.4.0 が最新
* Vize 0.627.0 は `@vizejs/nuxt` モジュールとして Nuxt に組み込める
* cf は 1.0.0-beta.26 で、Cloudflare は wrangler を cf に置き換える方針を公表している

## 決定

### Vite+

`vp migrate` で Vite+ を導入し、`vite-plus` を devDependency に入れる。
`pnpm-workspace.yaml` の catalog と overrides により、Nuxt が使う Vite も Vite+ 同梱のもの (`@voidzero-dev/vite-plus-core`) に差し替わる。
dev と build は引き続き Nuxt の CLI が担い、`vp run dev` と `vp run build` で呼ぶ。

### Vize

lint と type check は Vize の CLI で、format は Vite+ 同梱の Oxfmt で行う。
`vite.config.ts` で `@vizejs/vite-plugin/vite-plus` の `defineConfig(...).withVue(...)` を使い、`withVue` 側に linter の設定、Vite+ 側に `fmt` の設定を置く。
Vize の CLI とエディタ連携はこの設定を読む。Nuxt はこのファイルを読まない。

* `vp run check` は `vize check` (Corsa による型検査)、`vize lint`、`vp fmt --check` を順に実行する
* `vp run lint` と `vp run lint:fix` は `vize lint` (happy-path プリセット)
* `vp run fmt` と `vp run fmt:check` は `vp fmt` (Oxfmt)。`.vue` も Oxfmt が整形する
* タスクは `run.tasks` で明示的に定義し、ヘルパーが生成するタスクは `tasks: false` で無効にしている。生成される lint タスクは Vize と Oxlint を両方走らせる設計のため
* ヘルパーの `fmt: false` で、`.vue` を Oxfmt から除外する既定の挙動を止めている
* Markdown は Oxfmt の対象から外している。箇条書きの記号を `-` に書き換えてしまうため

ESLint (`@nuxt/eslint`) は削除した。
typescript-eslint が TypeScript 7.0 に対応しておらず、`eslint` の起動自体が失敗するため、Vize の lint に役割を寄せた。

`@vizejs/nuxt` の SFC コンパイラは `vize.compiler: false` で無効にしている。
有効にすると `/` のプリレンダ時に `<NuxtImg>` が `@nuxt/image` のコンポーネントではなく Nuxt 組み込みのスタブに解決され、ビルドが失敗する。
`#components` から明示的に import しても同じ結果だった。
上流で直り次第、有効に戻す。

### cf CLI

cf への移行は見送り、デプロイは引き続き wrangler で行う。

cf は Nuxt プロジェクトを検出すると `nuxt build` を実行し、その結果が Build Output Specification (`.cloudflare/output/v0`) の形式であることを期待する。
Nitro の `cloudflare_module` プリセットはこの形式を出力しないため、`cf build` も `cf deploy --prebuilt` も失敗する。
Vite プラグインを使わないプロジェクトでは cf 自身も wrangler をバンドラとして呼ぶため、移行しても wrangler への依存は残る。
Nitro 向けの対応は cloudflare/cf の issue 45 で要望として挙がっているが、未対応のまま。

## 影響

* CI は `voidzero-dev/setup-vp` で vp を入れ、`vp install` のあと `vp run check` と `vp run build` を実行する
* `pnpm-workspace.yaml` の `allowBuilds` で esbuild などのビルドスクリプトを許可している (pnpm 12 は未承認のビルドスクリプトがあると install が失敗する)
* 新しい記事の反映は `.github/workflows/deploy.yml` の定期実行に依存する
* cf が Nitro 出力を扱えるようになったら、`cf migrate` からやり直す
