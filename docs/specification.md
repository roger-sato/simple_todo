# Simple Todo アプリケーション仕様書

## 概要

Simple Todo Appは、ユーザー認証機能を持つシンプルなタスク管理アプリケーションです。Next.js 15.4.2とReact 19.1.0を使用して構築されており、フロントエンドのみで動作するように設計されています。

## 技術スタック

### フロントエンド
- **フレームワーク**: Next.js 15.4.2 (App Router)
- **UI ライブラリ**: React 19.1.0
- **言語**: TypeScript 5
- **スタイリング**: Tailwind CSS 4
- **フォント**: Geist, Geist Mono (Google Fonts)

### 開発環境
- **パッケージマネージャー**: npm
- **コンテナ化**: Docker対応
  - 開発用Dockerfile
  - docker-compose.yml (Node.js 20-alpine)

## アーキテクチャ

### ディレクトリ構造
```
simple_todo/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # ルートレイアウト
│   ├── page.tsx           # メインページ
│   ├── globals.css        # グローバルスタイル
│   └── favicon.ico        # ファビコン
├── components/            # Reactコンポーネント
│   ├── AuthForm.tsx       # 認証フォーム
│   ├── AddTodo.tsx        # Todo追加フォーム
│   └── TodoList.tsx       # Todoリスト表示
├── contexts/              # React Context
│   ├── AuthContext.tsx    # 認証状態管理
│   └── TodoContext.tsx    # Todo状態管理
├── types/                 # TypeScript型定義
│   └── todo.ts            # Todo型定義
├── public/                # 静的ファイル
└── docs/                  # ドキュメント
```

## 機能仕様

### 1. 認証機能

#### 1.1 ユーザー登録（サインアップ）
- **入力項目**:
  - メールアドレス（必須）
  - パスワード（必須、最小6文字）
- **バリデーション**:
  - メールアドレスの形式チェック
  - パスワードの最小文字数チェック
  - 既存ユーザーとの重複チェック
- **データ保存**: localStorage（`users`キー）

#### 1.2 ログイン
- **入力項目**:
  - メールアドレス
  - パスワード
- **特別アカウント**:
  - 管理者アカウント: `admin@example.com` / `password!`
- **認証方法**: localStorage内のユーザーデータと照合
- **セッション管理**: localStorage（`user`キー）

#### 1.3 ログアウト
- セッション情報（localStorage）のクリア
- ユーザー状態のリセット

### 2. Todo管理機能

#### 2.1 Todo追加
- **入力**: テキスト（空白文字のトリム処理あり）
- **自動設定項目**:
  - ID: タイムスタンプベース
  - 作成日時: ISO形式
  - ユーザーID: ログイン中のユーザーID
  - 完了状態: false（デフォルト）

#### 2.2 Todo一覧表示
- ログイン中のユーザーのTodoのみ表示
- リアルタイムでの表示更新
- 空の状態の表示メッセージ

#### 2.3 Todo編集
- インライン編集機能
- Enterキーでの保存対応
- キャンセル機能

#### 2.4 Todo完了/未完了切り替え
- チェックボックスによる状態切り替え
- 完了時の取り消し線表示

#### 2.5 Todo削除
- 確認なしの即時削除
- リストからの即時反映

## データモデル

### User型
```typescript
interface User {
  id: string;
  email: string;
}
```

### Todo型
```typescript
interface Todo {
  id: string;
  text: string;
  completed: boolean;
  userId: string;
  createdAt: string;
}
```

### 内部ストレージ構造（localStorage）
```typescript
// ユーザーデータ
interface StoredUser {
  id: string;
  email: string;
  password: string; // 実際の実装ではハッシュ化が必要
}

// localStorageキー
- "users": StoredUser[]
- "user": User（現在のセッション）
- "todos": Todo[]
```

## UI/UXデザイン

### レイアウト
- レスポンシブデザイン
- 最大幅: 4xl (56rem)
- 中央配置レイアウト

### カラースキーム
- プライマリ: Blue (blue-500/600)
- 背景: Gray (gray-50)
- カード背景: White
- テキスト: Gray (gray-800)
- エラー: Red (red-500)

### コンポーネントスタイリング
- Tailwind CSSによるユーティリティファーストアプローチ
- フォーカス状態のリング表示
- ホバー効果の実装
- トランジション効果（duration-200）

## セキュリティ考慮事項

### 現在の実装の制限
1. **パスワード保存**: 平文での保存（本番環境では要ハッシュ化）
2. **認証トークン**: なし（localStorageのみ）
3. **CSRF対策**: なし
4. **XSS対策**: Reactのデフォルト保護のみ

### 推奨される改善点
1. パスワードのハッシュ化（bcrypt等）
2. JWTトークンによる認証
3. HTTPSの使用
4. 入力値のサニタイゼーション強化

## パフォーマンス最適化

### 実装済みの最適化
1. **フォント最適化**: next/fontによる自動最適化
2. **Turbopackの使用**: 開発時の高速化
3. **コンポーネントの適切な分割**: 再レンダリングの最小化

### 今後の改善余地
1. メモ化（useMemo, useCallback）の活用
2. 仮想スクロールの実装（大量Todo対応）
3. Service Workerによるオフライン対応

## 開発・デプロイ

### 開発環境セットアップ
```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# Dockerを使用する場合
docker-compose up
```

### ビルド・デプロイ
```bash
# プロダクションビルド
npm run build

# プロダクションサーバーの起動
npm start
```

### 推奨デプロイ先
- Vercel（Next.jsの開発元）
- その他のNode.js対応ホスティングサービス

## 今後の拡張案

1. **バックエンドAPI統合**
   - RESTful APIまたはGraphQL
   - リアルタイムデータベース統合

2. **機能追加**
   - Todoのカテゴリー分け
   - 期限設定機能
   - 優先度設定
   - 検索・フィルター機能
   - ソート機能

3. **UX改善**
   - ドラッグ＆ドロップでの並び替え
   - アニメーション強化
   - ダークモード対応
   - 多言語対応

4. **モバイル対応**
   - PWA化
   - プッシュ通知
   - オフライン同期