---
name: feature-implementation-workflow
description: 'Vanilla JavaScript Webアプリで新機能を実装する反復ワークフロー。要件整理、影響範囲特定、最小実装、手動確認と tests/calculation-tests.mjs の検証、回帰確認、README更新までを実行したいときに使う。'
argument-hint: '実装したい機能、期待するUI/挙動、非機能要件、完了条件を入力'
user-invocable: true
disable-model-invocation: false
---

# Feature Implementation Workflow

このスキルは、このリポジトリで新機能を安全に追加するための実装手順を提供します。

## When To Use
- UI仕様や挙動の追加・変更を行うとき
- 複数モジュールに跨る実装で、影響範囲の見落としを減らしたいとき
- 実装後に最低限の動作確認と回帰確認を確実に実施したいとき

## Inputs
- 実装目的とユーザー価値（何ができるようになるか）
- 変更対象の画面・設定項目・レンダリング挙動
- 制約（既存API維持、デザイン方針、性能要件など）
- 完了条件（受け入れ基準）

## Default Policy
- 既定方針は「最小差分優先（既存ファイル編集を優先）」とする。
- 新規モジュール追加は、既存責務に収まらないことを示せる場合のみ選択する。

## Workflow
1. 要件を短く再定義する
   - 目的、入力、期待結果、非対象を1つずつ明示する。
   - 曖昧語（いい感じ、適切に等）は具体値に置き換える。
2. 影響範囲を特定する
   - UI変更: `index.html`, `style.css`, `js/dom.js`, `js/ui-events.js` を優先確認。
   - 状態管理変更: `js/state.js`, `js/layout-settings.js` を確認。
   - 描画変更: `js/tanka-renderer.js`, `js/text-layout.js`, `js/svg-renderer.js`, `js/canvas-renderer.js` を確認。
   - 入口・初期化への影響は `script.js`, `js/app.js` を確認。
3. 実装戦略を決める
   - 分岐A: 既存責務で完結するなら既存ファイルの最小変更を優先。
   - 分岐B: 責務が増えるなら `js/` 配下に新規モジュールを追加し、依存方向を明確化。
   - 分岐C: UIのみの変更ならロジック層への影響を避ける。
4. 最小実装を行う
   - 公開APIと既存挙動を壊さない差分で実装する。
   - 複雑な処理ブロックには短い説明コメントを追加する。
5. 検証する
   - 手動確認: `index.html` をブラウザで開き、変更箇所の通常系と境界系を確認。
   - 自動確認: `node tests/calculation-tests.mjs` を実行し、計算系の回帰を確認。
   - 追加テスト: 影響箇所に対するテストを `tests/` 配下へ追加し、変更意図に対応した観点を検証する。
   - エラー確認: 変更ファイルの構文・参照エラーを確認。
6. 仕上げる
   - 必要に応じて `README.md` / `README_ja.md` の機能説明を更新。
   - 変更点・テスト結果・未対応事項を簡潔にまとめる。

## Completion Criteria
- 要件で定義した完了条件を満たしている。
- 既存の主要操作（入力、プレビュー、保存）に回帰がない。
- `node tests/calculation-tests.mjs` が通る。
- 変更した挙動を担保する追加テストが存在し、実行結果が成功している。
- 変更理由と検証結果を説明できる。

## Suggested Prompt Patterns
- 「新機能実装フローで、[機能名] を追加して。制約は [制約]、完了条件は [条件]。」
- 「feature-implementation-workflow を使って、[対象ファイルや機能] の変更を最小差分で実装して。」
- 「このスキルで、実装からテスト、README更新の要否判定まで進めて。」