# ADR-001: フィード取得ライブラリの選定

## ステータス

採用

## コンテキスト

フィードアグリゲーターで以下を実現する必要がある：

1. RSS フィードのパース（Zenn, Blog など）
2. RSS を持たないソース（slides.naito.dev など）から OGP メタデータ取得

---

## OGP 取得ライブラリ

### 検討した選択肢

#### 1. cheerio

- HTML パーサーの定番ライブラリ
- jQuery ライクな API で柔軟性が高い
- 欠点: OGP 取得のためだけにはオーバースペック

#### 2. ofetch + 正規表現

- Nuxt 組み込みの ofetch を使用、追加依存なし
- UnJS エコシステムで統一できる
- 欠点: 正規表現でのパースは堅牢性に欠ける可能性

#### 3. unfurl.js

- OGP / Twitter Cards / oEmbed の取得に特化
- URL を渡すだけで構造化されたメタデータを返す
- Promise ベースで高速
- 欠点: UnJS プロジェクトではない外部依存

### 決定

**unfurl.js** を採用する。

### 理由

- OGP 取得という目的に特化しており、API がシンプル
- oEmbed や Twitter Cards にも対応しており、将来の拡張性がある
- 内部で HTML パースを処理するため、実装がシンプルになる

---

## RSS パーサー

### 検討した選択肢

#### 1. rss-parser

- Node.js での RSS/Atom フィードパースの定番
- TypeScript 対応
- RSS 2.0, Atom 1.0 に対応

#### 2. fast-xml-parser + 自前実装

- 汎用 XML パーサーを使って RSS を自前でパース
- 欠点: RSS/Atom の仕様差異を自分で吸収する必要がある

### 決定

**rss-parser** を採用する。

### 理由

- RSS パースという目的に特化しており、信頼性が高い
- RSS 2.0 と Atom 1.0 の両方に対応
- TypeScript の型定義が含まれている

---

## 影響

- 外部依存が 2 つ増える（unfurl.js, rss-parser）
- UnJS エコシステム外のライブラリに依存する
