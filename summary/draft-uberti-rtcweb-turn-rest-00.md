> Read [original](https://tools.ietf.org/html/draft-uberti-rtcweb-turn-rest-00) / [markdown](../markdown/draft-uberti-rtcweb-turn-rest-00.md)

---

# A REST API For Access To TURN Services

## 1. Introduction

- TURNはP2Pの接続確立を上げられる仕組み
  - RFC5766
- TURNはその仕組み上、インターネットから接続される
- サーバーを管理するコストもあるので、アクセス管理はほぼ必須
- TURNは`long-term`な認証を使用する
  - usernameとpasswordによる
  - これらcredentialsが漏洩する危険性と隣り合う
- そのために、credentialsを期限付きにしてAPI経由で取得する方式を提案する
  - WebサービスとTURNは、共通の秘密鍵さえ保持してればよい

## 2. HTTP Interactions

- まずPOSTリクエストでcredentialsを発行する
  - ユーザーIDのようなものをオプションでつけてもよい
  - 主にデバッグ用途ではある
  - ただどのユーザーIDにcredentialsをいくつ発行したかなど追える
- JSON形式でレスポンスされる
  - TURNに送信するusernameとハッシュ化されたpasswordを返す
- このレスポンスには期限がある
  - つまり、ICEのリスタート時などには再取得が必要

### 2.1. Request

- リクエストに含むパラメータの例
- 基本的に任意

### 2.2. Response

- レスポンスに含むパラメータの例
- `username`: TURNのusername
  - `:`でUNIXタイムスタンプと適当なユーザー名をつないだもの
  - ユーザー名の部分は任意
  - タイムスタンプの形式も任意だが、UNIXタイムスタンプがわかりやすい
- `password`: TURNのpassword
  - 事前に共有された秘密鍵で計算する
  - `base64(hmac-sha1(secretkey, username))`
  - HMAC-SHA1でもいいし、なんでもいい
- `ttl`: このcredentialsが有効な秒数
  - 任意だが、1日（86400秒）が推奨値
- `uris`: TURNのURLの配列
  - 提供しているTURNのポート、トランスポートに応じて返す

## 3. WebRTC Interactions

- JSONのレスポンスは、`RTCPeerConnection`に渡される
  - `RTCConfiguration`の`iceServers`として
- credentialsの更新時には、それ用のメソッドを使う
  - `getConfiguration()` + `setConfiguration()`で`iceServers`を更新する

## 4. TURN Interactions

- 本文なし

### 4.1. Client

- `username`は、TURNの`USERNAME`属性にあたる
- `password`は、TURNの`MESSAGE-INTEGRITY`属性

### 4.2. Server

- `ALLOCATE`リクエスト時
  - `USERNAME`属性の値をユーザー名とタイムスタンプに分割する
  - そしてタイムスタンプを検証し、期限がきれているなら`401(Unauthorized)`を返す
- ユーザーIDの検証は任意で行ってもよい
  - このときも`401(Unauthorized)`を返す
  - ただし外部サービスと連携することになるはずなので、TPOに応じて
- それ以外のリクエスト時
  - `USERNAME`はそのまま`ALLOCATE`時のものと照合される
- `MESSAGE-INTEGRITY`属性は、`USERNAME`とあわせて照合される
  - 照合用のpasswordは、ユーザー名と秘密鍵によって計算する

## 5. Implementation Notes

- 本文なし

### 5.1. Revocation

- このような仕組みなので、credentialsを取り消すことはできない
- 期限が切れるのを待つのがコスパとして妥当であろう
- 極端に不正利用される場合は、ブラックリストを用意するなど

### 5.2. Key Rotation

- HMACの特性から、定期的に鍵をローテーションするのが望ましい
  - RFC2104
  - ロールオーバーのために、少なくとも2つの鍵で`MESSAGE-INTEGRITY`を検証できるようにしたい

## 6. Security Considerations

- `USERNAME`属性は盗聴できる
- なのでわかりやすいIDだとトラッキングされるかも

## 7. IANA Considerations

- IANAとは関係ない
