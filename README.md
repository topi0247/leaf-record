<img src="https://i.gyazo.com/c272b1386122ac4162bee32114bae900.png" width="600px" />

# サービスURL
https://leaf-record.vercel.app
<br/>

# サービス概要
メモ帳感覚で記録をとりGitHubへコミットできる草生やしアプリです。
<br/>

# 作成経緯
オンラインプログラミングスクールRUNTEQにて、「ミニアプリweek」という短期間でアプリを作るイベントがあります。バグOK、一機能だけでもOKとゆるめのイベントで応募するために作成したものです。<br/>
4/22に開発を開始、4/26にリリースしたので制作期間は5日ほどですが、そのあとも順次ブラッシュアップしています。<br/>
<br/>

# 機能紹介
アプリの仕様上、基本機能はすべてログインしなければ使えません。<br/>
今回は[前回作成したアプリ](https://github.com/topi0247/KotonohaTsumugi)の反省としてレスポンシブ対応をしています。<br/>
PWA対応しているので、ネイティブアプリっぽくも使えます。
| トップ画面PC | トップ画面SP |
| :--: | :--: |
| <img  src="https://i.gyazo.com/7f538705b494fef8cde63f77d06910f9.png" width="800px" /> | <img  src="https://i.gyazo.com/f2250fcbc8794a9398d33be611b94ae5.png" width="250px" /> |
| アプリ説明と仕様上の注意を記載しました。 | メニューボタンは指の届きやすい下側に配置しました |

| リポジトリ一覧画面PC | リポジトリ一覧画面SP |
| :--: | :--: |
| <img  src="https://i.gyazo.com/e9c789d191c61995da0656e12f82b467.png" width="800px" /> | <img  src="https://i.gyazo.com/e993fd440ca9565573eb351e729cb296.png" width="320px" /> |
| すべてのリポジトリではなく、アプリを通じて作成したリポジトリのみ表示しています。 | SP用にレイアウト調整をしました。 |

| 記録画面PC | 記録画面SP |
| :--: | :--: |
| <img  src="https://i.gyazo.com/0a1137679d616f21c54e7de87b7381a5.png" width="800px" /> | <img  src="https://i.gyazo.com/7d48149a5824c192c70eeefa02a00616.png" width="250px" /> |
| 左カラムでファイル作成・選択ができます。記録を上から下に取るので、視線誘導的にファイル削除・ファイル名変更・コミットを下部に配置しています。 | ファイル操作やコミットをすべて下部のボタンから操作できるようにしました。 |

<br/>

# 技術スタック
## 使用技術
| カテゴリ | 技術 |
| :--: | :--: |
| フロントエンド | Next.js14(App Router), Tailwind CSS, shadcn/ui |
| バックエンド | Rails7.1.3 |
| データベース | PostgreSQL |
| 開発環境 | Windows, WSL2, Docker |
| インフラ | Vercel, Render.com |
| その他（フロントエンド） | Axios, Recoil |
| その他（バックエンド） | Octokit, DeviseTokenAuth, OmniAuth |

<br/>

## ER図
<img src="https://i.gyazo.com/f1da9e989658599e72c1a6280ac928a1.png" width="400px" />

<br/>

# その他
Qiitaに記事を書きました。
[【個人開発】メモ帳感覚で使えるGitHub草生やしアプリ「Leaf Record ～大草原不可避～」を作りました【Next.js×Rails】](https://qiita.com/topi_log/items/d362fefb9e006773eac0)