# Digest

naitokosuke のフィード (Zenn、しずかなインターネット、Slides、Blog) をまとめて表示するサイト。
https://digest.naito.dev/

Nuxt 4 で作り、Cloudflare Workers で配信している。
フィードはビルド時に取得してプリレンダし、Worker は静的アセットを返すだけにしている (docs/adr を参照)。

パッケージ管理とタスク実行は Vite+ (`vp`) で行う。lint と型検査は Vize、整形は Oxfmt で行う。

## 開発

```bash
vp install
vp run dev
```

## 検証

```bash
vp run check
```

`vize check`、`vize lint`、`vp fmt --check` を順に実行する。個別には `vp run typecheck`、`vp run lint`、`vp run fmt:check` がある。
`vp run fmt` で整形を、`vp run lint:fix` で lint の自動修正を適用する。

## デプロイ

main への push は Cloudflare の Git 連携 (Workers Builds) が Worker `digest` にデプロイする。
`.github/workflows/deploy.yml` は push と PR でチェックとビルドを走らせ、6 時間おきの cron と手動実行のときだけデプロイする (プリレンダしたフィードの更新用)。
定期デプロイには GitHub リポジトリの secrets に `CLOUDFLARE_API_TOKEN` と `CLOUDFLARE_ACCOUNT_ID` が必要。

手元からデプロイする場合:

```bash
vp run build
vp exec wrangler deploy --config .output/server/wrangler.json
```
