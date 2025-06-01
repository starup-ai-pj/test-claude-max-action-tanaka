# Claude Code GitHub Actions セットアップガイド

このガイドでは、`test-claude-max-action-tanaka`プロジェクトにClaude Code GitHub Actionsを導入する手順を説明します。

## 前提条件

1. GitHubリポジトリの管理者権限が必要
2. Anthropic APIキーまたはClaude Maxサブスクリプション
3. Claude Code CLIがローカルにインストールされている

## セットアップ手順

### 1. Claude GitHub Appのインストール

#### オプション A: 自動セットアップ（推奨）
```bash
# Claude Code CLIを起動
claude

# GitHub Appの自動インストールを実行
/install-github-app
```

#### オプション B: 手動セットアップ
1. [Claude GitHub App](https://github.com/apps/claude)にアクセス
2. リポジトリにアプリをインストール
3. 必要な権限を付与

### 2. GitHubシークレットの設定

リポジトリの設定で以下のシークレットを追加：

1. **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret**をクリック
3. 以下のシークレットを追加：

#### Anthropic API使用の場合
```
名前: ANTHROPIC_API_KEY
値: sk-ant-api03-... (あなたのAnthropic APIキー)
```

#### Claude Max使用の場合
参考: [Guillaume Railleのガイド](https://grll.bearblog.dev/use-claude-github-actions-with-claude-max/)


{"claudeAiOauth":{"accessToken":"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","refreshToken":"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","expiresAt":1748779913361,"scopes":["user:inference","user:profile"]}}



以下のシークレットを追加：
```
CLAUDE_ACCESS_TOKEN: (Claude Max認証情報から)
CLAUDE_ACCESS_TOKEN
CLAUDE_REFRESH_TOKEN: (Claude Max認証情報から)
CLAUDE_EXPIRES_AT: (Claude Max認証情報から)
```

認証情報の取得方法：
- **Linux**: `~/.claude/.credentials.json`
- **macOS**: キーチェーンでclaudeを検索 → パスワードを表示
- **Windows**: 詳細はドキュメント参照

### 3. ワークフローファイルの確認

`.github/workflows/claude.yml`が正しく設定されていることを確認：

```yaml
name: Claude PR Assistant

permissions:
  contents: write
  pull-requests: write
  issues: write
  id-token: write

on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
  issues:
    types: [opened, assigned]
  pull_request_review:
    types: [submitted]

jobs:
  claude-code-action:
    if: |
      (github.event_name == 'issue_comment' && contains(github.event.comment.body, '@claude')) ||
      (github.event_name == 'pull_request_review_comment' && contains(github.event.comment.body, '@claude')) ||
      (github.event_name == 'pull_request_review' && contains(github.event.review.body, '@claude')) ||
      (github.event_name == 'issues' && contains(github.event.issue.body, '@claude'))
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 1

      - name: Run Claude Code Action
        uses: anthropics/claude-code-action@beta
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          github_token: ${{ secrets.GITHUB_TOKEN }}
          trigger_phrase: "@claude"
          timeout_minutes: "60"
```

### 4. 動作テスト

1. リポジトリにissueを作成
2. コメントで`@claude`をメンション
3. GitHub Actionsタブで実行状況を確認

## 使用方法

### 基本的な使い方

```markdown
@claude このコードをレビューしてください
```

```markdown
@claude バグを修正してください
```

```markdown
@claude 新しい機能を実装してください
```

### 高度な使い方

- **コードレビュー**: PRで`@claude`をメンションしてレビューを依頼
- **実装支援**: issueで`@claude`をメンションして機能実装を依頼
- **バグ修正**: バグレポートで`@claude`をメンションして修正を依頼

## セキュリティ注意事項

⚠️ **重要**: APIキーは絶対にコードに直接書き込まないでください

✅ **正しい方法**:
```yaml
anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
```

❌ **間違った方法**:
```yaml
anthropic_api_key: "sk-ant-api03-..." # 危険！
```

## トラブルシューティング

### Claudeが応答しない場合
1. GitHub Appが正しくインストールされているか確認
2. ワークフローが有効になっているか確認
3. APIキーがシークレットに正しく設定されているか確認
4. コメントに`@claude`が含まれているか確認（`/claude`ではない）

### 認証エラーの場合
1. APIキーが有効で十分な権限があるか確認
2. Bedrock/Vertex使用時は認証設定を確認
3. シークレット名がワークフローファイルと一致しているか確認

## 参考リンク

- [公式ドキュメント](https://docs.anthropic.com/en/docs/claude-code/github-actions)
- [Claude Code Action Repository](https://github.com/anthropics/claude-code-action)
- [Claude Max使用ガイド](https://grll.bearblog.dev/use-claude-github-actions-with-claude-max/) 