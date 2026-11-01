# ADR-002: フィードをビルド時に取得して静的配信する

## ステータス

採用

## コンテキスト

digest.naito.dev は Cloudflare Workers の無料プランで動いており、1 リクエストあたりの CPU 時間は 10ms に制限されている。
従来は `/api/feeds` がリクエストのたびに 4 つのフィードを取得し、正規表現で解析していた。
加えて `/` の SSR も毎回走るため、CPU 時間の P50 が約 27ms となり、リクエストの約 15% が `Exceeded CPU Time Limits` で失敗していた。

## 検討した選択肢

### KV にキャッシュする

`defineCachedEventHandler` と KV バインディングで取得結果をキャッシュする。
キャッシュミス時は従来どおり解析が走るため、ミスしたリクエストは引き続き上限を超えて失敗する。
KV ネームスペースの作成も必要になる。

### Cache API を使う

`caches.default` でコロケーションごとにキャッシュする。
バインディングは不要だが、コロケーションごとにミスが起きるため、KV と同じ問題が残る。

### ビルド時にプリレンダする

`/` と `/api/feeds` を `routeRules` でプリレンダし、静的アセットとして配信する。
Worker はこれらのパスでは起動せず、CPU 時間を消費しない。
鮮度は GitHub Actions の定期実行でビルドとデプロイをやり直すことで保つ。
main への push は従来どおり Cloudflare の Git 連携 (Workers Builds) がデプロイする。

## 決定

ビルド時にプリレンダする方式を採用する。

## 理由

* 主要なパスでランタイムの処理がなくなり、CPU 上限の問題が根本的に消える
* KV などの追加リソースが不要
* フィードの更新頻度は高くないため、数時間おきの再ビルドで十分

## 影響

* `nuxt.config.ts` の `routeRules` で `/` と `/api/feeds` をプリレンダする
* main への push は Cloudflare の Git 連携が Worker `digest` にデプロイする。`nuxt.config.ts` の `cloudflare.wrangler.name` を `digest` に固定し、wrangler から手でデプロイしても同じ Worker に届くようにした
* `.github/workflows/deploy.yml` は push と PR で `vp run check` と `vp run build` を走らせ、6 時間おきの cron と手動実行のときだけデプロイする
* GitHub リポジトリの secrets に `CLOUDFLARE_API_TOKEN` と `CLOUDFLARE_ACCOUNT_ID` が必要 (定期デプロイ用)
* 新しい記事がサイトに反映されるまで最大 6 時間かかる
* `/api/image` は引き続きランタイムで動く
