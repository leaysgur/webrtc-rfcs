> [Read original](../md/draft-ietf-rtcweb-jsep-25.md)

---

# JavaScript Session Establishment Protocol

## 1. Introduction

- `RTCPeerConnection`インターフェースの解説

### 1.1. General Design of JSEP

- MediaプレーンとSignalingプレーンを分けて考えてる
  - そしてMediaプレーンに焦点をあててる
  - 既存の仕組みとの互換性などを考えて、Signalingプレーンはお任せにしてる
- JSEP = セッション確立のための実装
  - SDPの受け渡しAPI（`create{Offer|Answer}()` / `set{Local|Remote}Description()`）
  - 内部的なICEの状態管理
- ICEの状態管理とSignalingの状態も分離して考えてる
  - そうすることでTrickleICEとかにも対応できる

### 1.2. Other Approaches Considered

- もっと細かいAPIを提供することも検討していたけどやめた
  - コードが煩雑になる
  - グレア状態など理解すべきことが多くなる
- `getCapabilities()`を`create{Offer|Answer}()`の代わりに公開することも検討していたけどやめた
  - オファーアンサーの生成を手動でやるのは手間がかかりすぎる
- この仕様を考えた当時はこれが最高の落としどころだと思ってた

## 2. Terminology

- いつもの

## 3. Semantics and Syntax

- 本文なし

### 3.1. Signaling Model

- JSEPはオファーとアンサーのSDPを生成する
- しかしそれをピア同士がどのように交換するかは関与しない
  - Signalingプレーンとはこの部分のこと
- 再送もグレア制御も全ておまかせ

### 3.2. Session Descriptions and State Machine

- JSEPにとってはSDPがすべて
  - 使えるコーデックなど
  - しかしオファー・アンサーが全て受け入れられるとは限らない
  - `m=`行は同じ数でないといけないなど制約もある
  - localかremoteか、offerかanswerかは全て独立している
- アンサーは送り直すことが仕様としては想定されてる
  - ただし最後のものだけが使われる
  - 途中のやつが`pranswer`というやつ（Provisional）
  - しかしJavaScriptのAPIに`createPrAnswer()`とかはない
- オファーも送り直せる
  - もちろんこれも最後のものだけが使われる

### 3.3. Session Description Format

- SDPの扱いにくさは仕方ない
  - いちおう枯れた仕様なのでそっとしてある
- `SessionDescription`クラスでラップしてある
  - 将来的にはコイツをいじればいい感じにSDPを修正できるかも
- まぁSDPをアプリ側で直接修正することはないはず
  - 後述するAPIがあるので

### 3.4. Session Description Control

- ここで紹介するAPIを介することで、`create{Offer|Answer}()`時に生成されるSDPを変えられる

#### 3.4.1. RtpTransceivers

- 単一の`m=`セクションに対応するクラス
  - `RTPSender`と`RTCReceiver`をペアで持つ
  - 手動で追加した場合は、もちろんSDPのそれと数は合わない
- 各`m=`セクションの`mid`を一意に持つ
  - ただし何らかの拍子で同じ`m=`セクションが再利用されると、違う`mid`を持つ新たなインスタンスができることもある
- APIを使って手動でインスタンスを作るか、`setRemoteDescription()`の際に自動で用意される

#### 3.4.2. RtpSenders

- その名の通りRTPを送るためのクラス
- `MediaStreamTrack`を接続するのも仕事
- あとはRTCPとの兼ね合いも

#### 3.4.3. RtpReceivers

- その名の通りRTPを受け取るためのクラス
- `RTPSender`と同じ責務

### 3.5. ICE

- 本文なし

#### 3.5.1. ICE Gathering Overview

- ICEのcandidate収集はきっかけで行われる
  - `m=`行が追加された
  - リスタートによりクレデンシャルが変更された
- その場合は`needs-ice-restart`というフラグが内部で立つ
  - このときに`createOffer()`すると新しいクレデンシャルが得られる
  - そのクレデンシャルを`setLocalDescription()`するとフラグが降りる
- 収集の様子は随時イベントとして知らされる

#### 3.5.2. ICE Candidate Trickling

- TrickleICEの話
  - オファーを送ったらもうcandidateも送る
  - オファー側の全候補収集を待ってからオファーをもらう必要がない
- 対応してないなら全候補が揃ってからオファーを送ればいい

##### 3.5.2.1. ICE Candidate Format

- candidateは`IceCandidate`クラスで内包されてる
  - 基本的にSDPの1行と同じ
  - ただし`a=`はついてない
- 各candidateはICEの`ufrag`を含む
  - これでICEがリスタートしたときなど判別できる
- どの`m=`セクションと紐付いているかも書いてある
  - 何番目かをあらわすインデックス（0はじまり）
  - or `mid`
  - `mid`を優先して使うことで、`RtpTransceiver`と紐付けできる

#### 3.5.3. ICE Candidate Policy

- candidateのtypeを制限できるようにしている
  - host / srflx / relay
- 制限したものは絶対に露出させてはいけない
- その指定が変わったらICEをリスタートする

#### 3.5.4. ICE Candidate Pool

- `setLocalDescription()`でICEは動き出す
  - SDPを見ればcomponentの数がわかるから
- ただ実はそれより前にcandidateを集めてプールしておいてもいい
  - そうすればより早くICEの仕事を終えられる

#### 3.5.5. ICE Versions

- ICEのRFCは5245と8445がある
- 世の中のだいたいは5245をベースに実装してるはず
  - `ice2`という属性があるなら8445対応
- 5245との互換性は保つ必要がある

### 3.6. Video Size Negotiation

- SDPの`a=imageattr`で動画のフレームサイズを設定できる
- 受け取っても再生できないデカさの動画とかあるかも
- JSEP的には、正方形ではないピクセルを送信しない
  - 受信はする

#### 3.6.1. Creating an imageattr Attribute

- 特に制約がない場合、`a=imageattr`は省略される
  - `sendonly`の場合も必ず省略する
- 基本的にdirectionが`recv`のときに使うもの
- 指定の例
  - `a=imageattr:* recv [x=[48:1280],y=[48:720],q=1.0]`
  - 48x48から1280x720まで、フォーマットは不問の場合
  - `q`は`1.0`が推奨値

#### 3.6.2. Interpreting imageattr Attributes

- そもそもSDPでもadvisoryな項目なので、無視されることもある
- JSEP的にはフォーマットごとに1つしか指定しない
  - けどJSEPじゃないやつからは複数送られてくるかも
  - その場合は後勝ち
 - この属性のパースに失敗した場合は、そのフォーマットを送れない

### 3.7. Simulcast

- 単一の`m=`セクションに複数の`MediaStreamTrack`を含むSimulcastができる
  - 複数を送信できるけど、受信は1つ
- `RTPSender`で指定する
  - SDPにそれ用の記述（後述）をする
  - 解釈されなかった場合は最初の設定だけ使う
- Simulcastで受信したい旨を設定する方法は今のところない
  - オファーで提示されても、それに応える術がない
- このあたりの仕様は将来変わるかも
  - 今どうにかするためのあれこれは以下を参照
  - draft-ietf-mmusic-sdp-simulcast
  - draft-ietf-mmusic-rid

### 3.8. Interactions With Forking

- いくつかのSignalingシステムは、複数のエンドポイントに同じオファーを送る
  - これをFolkingという
  - Folkingには直列か並列かの種類がある
- JSEPとしてはSignalingはスコープ外ではあるけど、影響もあるので触れる
  - メディアをどの時点で送受信すればいいかとか

#### 3.8.1. Sequential Forking

- アクティブなセッションは常に1つ
  - 先着1名様か、後勝ちか
- 先着1名の場合、他のアンサーは拒否する
  - SIP用語でACK+BYE
- 後勝ちの場合は、いったんすべて`pranswer`として扱う
  - 最後のを正式な`answer`とする

#### 3.8.2. Parallel Forking

- できるけど推奨してないし、ほとんどのSIPでもやってない
- JSEPとしては、そういうことしたいなら複数の`PeerConnection`を作ってね
  - RFC3960でいう`UPDATE`をやってもいい

## 4. Interface

### 4.1. PeerConnection

#### 4.1.1. Constructor

#### 4.1.2. addTrack

#### 4.1.3. removeTrack

#### 4.1.4. addTransceiver

#### 4.1.5. createDataChannel

#### 4.1.6. createOffer

#### 4.1.7. createAnswer

#### 4.1.8. SessionDescriptionType

##### 4.1.8.1. Use of Provisional Answers

##### 4.1.8.2. Rollback

#### 4.1.9. setLocalDescription

#### 4.1.10. setRemoteDescription

#### 4.1.11. currentLocalDescription

#### 4.1.12. pendingLocalDescription

#### 4.1.13. currentRemoteDescription

#### 4.1.14. pendingRemoteDescription

#### 4.1.15. canTrickleIceCandidates

#### 4.1.16. setConfiguration

#### 4.1.17. addIceCandidate

### 4.2. RtpTransceiver

#### 4.2.1. stop

#### 4.2.2. stopped

#### 4.2.3. setDirection

#### 4.2.4. direction

#### 4.2.5. currentDirection

#### 4.2.6. setCodecPreferences

## 5. SDP Interaction Procedures

### 5.1. Requirements Overview

#### 5.1.1. Usage Requirements

#### 5.1.2. Profile Names and Interoperability

### 5.2. Constructing an Offer

#### 5.2.1. Initial Offers

#### 5.2.2. Subsequent Offers

#### 5.2.3. Options Handling

##### 5.2.3.1. IceRestart

##### 5.2.3.2. VoiceActivityDetection

### 5.3. Generating an Answer

#### 5.3.1. Initial Answers

#### 5.3.2. Subsequent Answers

#### 5.3.3. Options Handling

##### 5.3.3.1. VoiceActivityDetection

### 5.4. Modifying an Offer or Answer

### 5.5. Processing a Local Description

### 5.6. Processing a Remote Description

### 5.7. Processing a Rollback

### 5.8. Parsing a Session Description

#### 5.8.1. Session-Level Parsing

#### 5.8.2. Media Section Parsing

#### 5.8.3. Semantics Verification

### 5.9. Applying a Local Description

### 5.10. Applying a Remote Description

### 5.11. Applying an Answer

## 6. Processing RTP/RTCP

## 7. Examples

### 7.1. Simple Example

### 7.2. Detailed Example

### 7.3. Early Transport Warmup Example

## 8. Security Considerations
