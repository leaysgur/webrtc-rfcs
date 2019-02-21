> Read [original](https://tools.ietf.org/html/draft-ietf-rtcweb-jsep-25) / [markdown](../markdown/draft-ietf-rtcweb-jsep-25.md)

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

- JSPEが実装するAPIについて
- 実装されてる変数名・関数名は微妙に違うかもしれないので注意

### 4.1. PeerConnection

- 本文なし

#### 4.1.1. Constructor

- ICE/STUN/TURNの設定などグローバルなパラメータを指定できる
- `iceCandidatePolicy`: `all` or `relay`
  - `all`: デフォルト、特に制限されず全部を対象にする
  - `relay`: `relay`だけを使う
- `iceCandidatePoolSize`: 事前に候補収集する数
  - STUN/TURNサーバーのリソースを食うので、要求があるまで普通はやらない
  - なのでデフォルトは`0`
- `bundlePolicy`: `balanced` or `max-compat` or `max-bundle`
  - draft-ietf-mmusic-sdp-bundle-negotiation にあるやつ
  - `balanced`: バランスを取る
  - `max-compat`: バンドルしない
  - `max-bundle`: 最初の`m=`セクションにすべてバンドルする
  - デフォルトは`balanced`
- `rtcpMuxPolicy`: `negotiate` or `require`
  - RTP/RTCPをmultiprexするかどうか
  - `negotiate`: 別々に候補を集めるけど、`a=rtcp-mux`もつける
  - `require`: `a=rtcp-mux-only`をつける
  - デフォルトは`require`

#### 4.1.2. addTrack

- `MediaStreamTrack`を追加する
  - `MediaStream`をあわせて渡すことで、同じ`LS`（LipSync）グループにできる
  - RFC5888
- `signalingState`が`have-remote-offer`のときは、最初の`RtpTransceiver`に
  - それ以外のときは、新しい`RtpTransceiver`を作成する

#### 4.1.3. removeTrack

- `MediaStreamTrack`を削除する
  - どの`RTPSender`かをあわせて指定する
- 削除されたら、その`m=`セクションは`recevonly`か`inactive`になる
  - 次に`createOffer()`されたとき
  - SDPから消えるわけではないので

#### 4.1.4. addTransceiver

- `RtpTransceiver`を追加する
  - `MediaStreamTrack`をあわせて渡すことでセットもできる
- `recvonly`な`RtpTransceiver`を作りたいときに便利
- `direction`と`sendEncodings`を設定できる

#### 4.1.5. createDataChannel

- Data Channelを作る
  - はじめて作った場合は、ネゴシエーションが必要
- 作られたすべてのDCは、同じSCTP/DTLSアソシエーションを使う
  - なので同じ`m=`セクションに入る
  - そういうわけで、一度ネゴシエーションできたなら、後から増やしてもJSEPには関係ない
- その他指定できるオプションもいろいろあるが、それもJSEPには関係ない

#### 4.1.6. createOffer

- オファーSDPを生成する
  - そこには既に設定されたメディアやシステムのコーデックなどが載る
  - 既に集められたICEのcandidateがあればそれも
  - `iceRestart`のためのオプションも渡せる
- セッション確立後に呼ぶと、それまでの変更点が更新される
- できたSDPは`setLocalDescription()`できるものでないといけない
- これを呼んだ後は、ICEのクレデンシャルを生成するなどしてよい
  - ただ実際に候補を収集したりはしない
  - もちろんメディアを送ったりもしない

#### 4.1.7. createAnswer

- アンサーSDPを生成する
  - 直近の`setRemoteDescription()`を反映したもの
- 基本的には`createOffer()`のときと同じ

#### 4.1.8. SessionDescriptionType

- SDPのタイプは4つ
  - `offer`, `pranswer`, `answer`, `rollback`
- `offer`: オファー
- `pranswer`: Provisionalなアンサー
- `answer`: アンサー
- `rollback`: 最後に`stable`だった状態に戻す用

##### 4.1.8.1. Use of Provisional Answers

- 最終的な`answer`が届くまでの一時的なもの

##### 4.1.8.2. Rollback

- `have-local-offfer`とかになったのをキャンセルできる
- 中身は空っぽ

#### 4.1.9. setLocalDescription

- 自身のSDPを設定する
- ICEの候補収集がはじまる
  - プールされてるものがあればそれを使う
- 既にオファーが`setRemoteDescription()`されていれば、メディアの送受信がはじまる
  - メディアの準備ができてれば

#### 4.1.10. setRemoteDescription

- メディアのエンコードと送信をはじめられる
- 既にアンサーを`setLocalDescription()`されていれば、メディアの送受信がはじまる
  - メディアの準備ができてれば

#### 4.1.11. currentLocalDescription

- `localDescription`というGetterがコレ
- 何もなければ`null`

#### 4.1.12. pendingLocalDescription

- `pendingLocalDescription`というGetterがコレ
- `stable`か`have-remote-offer`のときは`null`

#### 4.1.13. currentRemoteDescription

- `remoteDescription`というGetterがコレ
- 何もなければ`null`

#### 4.1.14. pendingRemoteDescription

- `pendingRemoteDescription`というGetterがコレ
- `stable`か`have-local-offer`のときは`null`

#### 4.1.15. canTrickleIceCandidates

- リモート側が、TrickleICEできるかどうかを示すプロパティ
  - たぶん実装されてない
  - 3つの値がある
- `null`: SDPがなくてわからない、初期状態
- `ture`: 利用できる
- `false`: 利用できない

#### 4.1.16. setConfiguration

- グローバルな設定を変えられる
  - Construcotrで指定してたやつ
- `iceServers`、`iceTransportPolicy`を変更すると、次の候補収集の挙動が変わる
  - `needs-ice-restart`フラグが立つことがある
    - ICEクレデンシャルが更新される
- `iceCandidatePoolSize`は変更できない
  - `setLocalDescription()`してないならできる
- `rtcpMuxPolicy`と`bundlePolicy`は変更できない

#### 4.1.17. addIceCandidate

- ICE Agentに`IceCandidate`を渡すことで更新を伝える
  - `candidate`プロパティがあれば、新たな候補として扱う
  - それがないなら、候補の終わりとして扱われる
- それぞれどの`m=`セクション、`mid`に属するか決められる
- 新たな候補を受け取ったら、接続確認が行われる

### 4.2. RtpTransceiver

- 本文なし

#### 4.2.1. stop

- `RTPTransceiver`を止める
- 一度止めると、それに紐づく`m=`セクションに影響がある

#### 4.2.2. stopped

- 状態を表すフラグ
- `stopped`が`true`なら、RTP/RTCPを送受信しない

#### 4.2.3. setDirection

- `direction`を変更するメソッド
  - `recvonly`, `sendrecv`, `sendonly`, `inactive`のいずれか
- Offer側では指定したものがそのままSDPに載る
- 変えたら即そうなるのではなく、Answerが受理されてやっと変わる

#### 4.2.4. direction

- `direction`を表す

#### 4.2.5. currentDirection

- 現状の`direction`を表す
  - `setDirection()`しても即変わらないので
- リモート側で`recv`なら、こっちでは`send`のように反転される

#### 4.2.6. setCodecPreferences

- コーデックの設定ができる
- あくまで希望の表明である
  - 実装がないかもしれないので

## 5. SDP Interaction Procedures

- SDPを作る・パースする方法について

### 5.1. Requirements Overview

- オファー側もアンサー側もここにある手順に従ってね

#### 5.1.1. Usage Requirements

- 以下の仕様を満たしていなければエラーになる
  - ICE: RFC84445
    - もしかしたらICE-Liteがいるかもしれないがよしなにせよ
  - DTLS: RFC6347 or DTLS-SRTP: RFC5763
- SDESは使わない、DTLS-SRTPを使う

#### 5.1.2. Profile Names and Interoperability

- プロファイルが決まってる
  - Media: `UDP/TLS/RTP/SAVPF`
  - Data: `UDP/DTLS/SCTP`
- でも実際はどれか欠けたりするのでよしなにせよ
  - `TCP`とか使ったりするし

### 5.2. Constructing an Offer

- `createOffer()`時にSDPをつくる
- その手順についての詳細

#### 5.2.1. Initial Offers

- 最初の1回とそれ以外でアップデートする内容が違う
- 最初なのでセッション全体に関する記述が必要
  - `v=0`とか`o=`とか
- 詳細は割愛

#### 5.2.2. Subsequent Offers

- 2回目以降、既に`localDescription`がある場合など
- `setLocalDescription()`してる・してないで微妙に違う
- 詳細は割愛

#### 5.2.3. Options Handling

- `createOffer()`の引数である`RTCOfferOptions`について

##### 5.2.3.1. IceRestart

- `iceRestart`: `boolean`
- 新しい`ufrag`と`pwd`を生成しなおす
- もちろん初オファーの場合には意味がない

##### 5.2.3.2. VoiceActivityDetection

- `voiceActivityDetection`: `boolean`
- いわゆるDTX(DiscontinuousTransmission): 話してないときに帯域を節約する
  - CN(ComfortNoise)対応のコーデックのとき
- 実装されてなさそう

### 5.3. Generating an Answer

- `createAnswer()`時にSDPをつくる
- その手順についての詳細

#### 5.3.1. Initial Answers

- こちらも初回と以降で微妙に違う
- `remoteDescription`がない状態では、`createAnswer()`できない
- 詳細は割愛

#### 5.3.2. Subsequent Answers

- `setLocalDescription()`してる・してないで微妙に違う
- 詳細は割愛

#### 5.3.3. Options Handling

- `createAnswer()`の引数である`RTCAnswerOptions`について

##### 5.3.3.1. VoiceActivityDetection

- `voiceActivityDetection`: `boolean`
- 実装されてなさそう

### 5.4. Modifying an Offer or Answer

- `createOffer()`や`createAnswer()`で得たSDPは、修正してはいけない
  - そのまま`setLocalDescription()`に渡す必要がある
  - 修正したいものは`RtpTransceiver`のAPIや、それ用のオプションを使う
- `setLocalDescription()`後、リモートに送るSDPは修正されるかもしれない
  - いろいろな理由で
  - 解釈される保証はないし、なんかあっても自己責任

### 5.5. Processing a Local Description

- `setLocalDescription()`すると何が起きるか
- 詳細は後述

### 5.6. Processing a Remote Description

- `setRemoteDescription()`すると何が起きるか
- 詳細は後述

### 5.7. Processing a Rollback

- SDPのtype: `rollback`
- `signalingState`を`stable`に戻す
- `RtpTransceiver`と`m=`セクションの紐付けなど注意が必要

### 5.8. Parsing a Session Description

- SDPは言うなればただのテキスト
- これを内部的なオブジェクトに変換していく
- なにかしらよくわからない行があればエラーにする

#### 5.8.1. Session-Level Parsing

- セッション全体のところ
- 並びも固定になってる
  - `a=`行は順不同
- SDPの仕様にはあるけど、JSEPとしては見てないフィールドもたくさんある
- 詳細は割愛

#### 5.8.2. Media Section Parsing

- `m=`セクションのこと
- 詳細は割愛

#### 5.8.3. Semantics Verification

- パースが終わったSDPオブジェクトを検証するステップがある
- 何かあったらエラーにする
- 詳細は割愛

### 5.9. Applying a Local Description

- `localDescription`を反映する
  - ICEの`ufrag`と`pwd`が変わってたらICEをリスタートするとか
- 詳細は割愛

### 5.10. Applying a Remote Description

- `remoteDescription`を反映する
  - `canTrickleIceCandidates`をアップデートしたり
- 詳細は割愛

### 5.11. Applying an Answer

- SDPが`pranswer`と`answer`だった場合、加えてこのステップが必要
- 詳細は割愛

## 6. Processing RTP/RTCP

- bundleするときは、その紐付けを`m=`セクションにマークする
- そうすると、`RtpTransceiver`がRTP/RTCPを扱えるようになる

## 7. Examples

- シチュエーション別のSDPの解説
- SDPのサンプルがもっと欲しい場合: draft-ietf-rtcweb-sdp

### 7.1. Simple Example

- 最低限の動画・音声通話の例
- Vanilla ICE

### 7.2. Detailed Example

- より踏み込んだ例
- Full Trickle ICE
- `max-bundle`, `rtcpMuxPolicy`: `require`
- TURN利用
- 最初は音声とデータだけ、後から2本のビデオを一方通行で追加

### 7.3. Early Transport Warmup Example

- 動画と音声を送るが、最初は`sendonly`で応答する
  - あとから`sendrecv`にする
  - こうすることで先に疎通を済ませておくことができるテクニック
- `iceTransportPolicy`: `relay`

## 8. Security Considerations

- セキュリティに関しては2つの文書がある
  - draft-ietf-rtcweb-security-arch
  - draft-ietf-rtcweb-security
- JSの実行はユーザーに任されるので、間で何をされるかわからない
  - `createOffer()`したSDPがそのまま`setLocalDescription()`されないかも
  - なので固めの実装方針にして、エラーで落とすようにしてる
- JSのAPIから触れない部分があることも知っておく
