> Read [original](https://tools.ietf.org/html/draft-ietf-mmusic-msid-17) / [markdown](../markdown/draft-ietf-mmusic-msid-17.md)

---

# WebRTC MediaStream Identification in the Session Description Protocol

## 1. Introduction

- 本文なし

### 1.1. Terminology

- いつもの

### 1.2. Structure Of This Document

- RTPストリームにIDを振る、グルーピングするための仕様をSDPに追加する
- WebRTCのための拡張である

### 1.3. Why A New Mechanism Is Needed

- なぜ拡張が必要だったのか
- RTPセッション中のRTPストリームは、SSRCによって一意に識別できた
  - そもそもRTPセッションは、トランスポートアドレスで別れているものだった
- しかしWebRTCではBUNDLEすることができてしまう
  - SDPグルーピングについては、RFC5888
- しかしそれはSDP内に閉じた話で、アプリケーションレベルでこれを知る必要が往々にしてある
  - そのためにこの拡張が必要

### 1.4. The WEBRTC MediaStream

- WebRTCではメディアを`MediaStream`として扱い、`MediaStreamTrack`を含む
- `MediaStreamTrack`は、RTPセッション中の単一のSSRCを表すもの
  - サイマルキャストなど、このSSRCが増えることもあるがそれはこの仕様と関係ない
  - そしてこれは一方通行なもの
- RTPセッションでは、RTPストリームはSSRCで識別されつつ、CNAMEの情報を持ってる
- しかしこのCNAMEもRTPセッションも、`MediaStream`とは対応していない
- SDPにおける`m=`セクションは、それぞれが`MediaStreamTrack`と対応する
  - そしてBUNDLEされると、いくつかの`MediaStreamTrack`がRTPセッションとなる
  - そこで、どの`MediaStream`に`MediaStreamTrack`が属するかの情報が必要になる

## 2. The Msid Mechanism

- `msid`属性をSDPのメディアレベルに追加する
  - `a=msid:{id} {appdata}`
- `msid:examplefoo examplebar`
  - この場合は`examplefoo`というIDに、`examplebar`という値

## 3. Procedures

- `msid`はどう決まるのか
  - `MediaStream`の`id`が、`{id}`に紐づく
  - `MediaStreamTrack`の`id`が、`{appdata}`に紐づく
- `msid`の`{id}`が新たに増えた = 新たな`MediaStream`を受信したとわかる
  - `{appdata}`が新たに増えた = 新たな`MediaStreamTrack`
- `{appdata}`がなく`{id}`だけ増えるパターンもある
  - その場合は受信側が自分で割り当てる
- `{id}`が`-`の場合は、`MediaStream`がないことを表す
- `MediaStreamTrack`の終了条件
  - `a=msid`が消えた時
  - すべてのSSRCでBYEパケットを受信したとき
  - タイムアウトしたとき
  - `m=`行のポートに`0`が指定されたとき

### 3.1. Handling of non-signalled tracks

- `msid`を使用しない、紐付けないRTPパケットが送信されてくることもある
  - 既にセッションがあるときに、後から`MediaStreamTrack`を追加した場合
  - 再ネゴシエーションが発生して、アンサーが受領されるまでの間
  - = `RTCSignalingState`が`stable`でない間

### 3.2. Detailed Offer/Answer Procedures

- オファー・アンサーについては別の仕様に詳細がある
  - RFC3264

#### 3.2.1. Generating the initial offer

- オファーのSDPに`a=msid`が載るまで
- 送信したい`MediaStream`の数だけ定義する
  - `id`を`msid`の`{id}`に
- 次いで、`MediaStreamTrack`の`id`を`{appdata}`に

#### 3.2.2. Answerer processing of the Offer

- アンサー側がどうするか
- `{appdata}`でもって`MediaStreamTrack`のインスタンスを探す or 作る
- `{id}`を使って`MediaStream`を探す or 作る
- ユーザーに知らせる

#### 3.2.3. Generating the answer

- アンサーを発行するときは、オファーを発行するときと同じ
- オファー側が影響を与えることはない

#### 3.2.4. Offerer processing of the answer

- 同上

#### 3.2.5. Modifying the session

- セッション中の再ネゴシエーションで注意点が1つだけある
- `ended`になっていない`MediaStreamTrack`について
  - SDPにその`id`が`{appdata}`と同じものが存在するかチェック
  - 存在しなくなってたら、`ended`にしてしまう

### 3.3. Example SDP description

- 2つの`MediaStream`を送る場合のSDPの例

## 4. IANA Considerations

- 本文なし

### 4.1. Attribute registration in existing registries

- `msid`属性をSDPの`att-field`に追加する
  - これはメディアレベル限定

## 5. Security Considerations

- SDPを改ざんされるおそれはある
  - そうなるとバッファリング実装のメモリを枯渇させることができるかも
- IDを生成するときも、UUIDのv3や4を使うなど推奨

## Appendix A. Design considerations, rejected alternatives

- 代案について
- CNAMEを使う案
  - CNAMEは`MediaStreamTrack`をsyncするためのもの
- RTCPのSRパケットを使う案
  - 全ての`MediaStreamTrack`の状況を把握できない
- `a=wms-semantic`という属性もあった
  - 2015年4月に削除された
  - 実際には`a=msid-semantic:WMS`から続く行
    - 今もChromeやFirefoxがSDPに載せてくる
