> Read [original](https://tools.ietf.org/html/draft-ietf-rtcweb-data-channel-13) / [markdown](../markdown/draft-ietf-rtcweb-data-channel-13.md)

---

# WebRTC Data Channels

## 1. Introduction

- WebRTCにおいて送信できるメディアは映像と音声だけではない
  - 映像と音声はSRTPで送信される
- それ以外はSCTPを使って送信される
  - RFC4960
- DTLSでカプセル化される
  - RFC8261
  - DTLSはICE/UDPによってNATを超えて接続できる
- SCTPによって、信頼性のある通信が可能（部分的に信頼性をもたせることも）
  - RFC3758
- 複数のストリームを1つのアソシエーションに束ねる仕組み
  - RFC6525

## 2. Conventions

- いつもの

## 3. Use Cases

- ユースケースの紹介

### 3.1. Use Cases for Unreliable Data Channels

- 信頼性なしモード
- リアルタイムゲームにおけるオブジェクトの状態や位置の伝送
- 誰かがミュートしたなど、クリティカルではないメディア通信に関するメタデータ

### 3.2. Use Cases for Reliable Data Channels

- 信頼性ありモード
- リアルタイムゲームにおけるクリティカルなデータの伝送
- リアルタイムでなくてもよいファイル伝送
- リアルタイムのテキストチャット
- `RTCPeerConnection`のネゴシエーションに使うデータ
- プロキシ実装のバックエンドとして

## 4. Requirements

- 2つのブラウザがP2PでDataChannelを利用するときの要件
- 同時に複数のチャンネルをサポートすること
  - SRTPを使ったメディア転送とも平行利用できる
- 信頼性ありとなしの2つのモード
- 輻輳制御されること
  - 個別でも、トランスポート全体でも
  - SRTPの帯域に影響を与えないこと
- そのチャンネルの帯域使用における優先度が指定できる
- セキュアであること
- メッセージの分割ができること
- DataChannelトランスポート自体は、IPアドレスを内部で参照しない
- ストリームのように実質無制限のサイズの送信ができること
- IPの断片化を避け、PMTUを守ること
- ユーザーのアプリケーションで、プロトコルの実装ができること

## 5. SCTP over DTLS over UDP Considerations

- WebRTCにおけるSCTPの重要な機能について
  - TCPに優しい輻輳制御
  - SRTP側の輻輳制御との親和性
  - 複数の一方向ストリーム
  - 順序保証、非保証のメッセージ伝送
  - 断片化による大きいデータの伝送
  - PMTU判別
  - 信頼性、部分的信頼性のサポート
- SCTPのマルチホーミングはサポートしない
  - DTLSレイヤーが公開する単一のホスト上で動作
- SCTPで送信されるユーザーメッセージは、PPIDが付与される
  - UTF8、バイナリのデータのほか、DCEP(Data Channel Establishment Protocol)を判別する
  - draft-ietf-rtcweb-data-protocol
- これらのメッセージは、SCTP上でやりとりされるが、SCTP自体はDTLSのペイロードであることに注意
  - 多重化を解く時など
- ICEがセッションの途中でIPアドレスを変えた場合
  - SCTPはそれを検知する必要がある
  - PMTUをリセットしたり、輻輳制御の状態をリセットする
- SCTPでは1つのアソシエーションで1つの輻輳ウィンドウを管理する
  - その中で複数のストリームが管理される

## 6. The Usage of SCTP for Data Channels

- 本文なし

### 6.1. SCTP Protocol Considerations

- SCTPパケットは必ずDTLSでカプセル化すること
- 複数のSCTPストリームをサポートすること
- 順序保証と信頼性は、共に有効・無効化できること
- 以下の拡張をサポートすること
  - RFC6525
  - RFC5061
  - RFC3758

### 6.2. SCTP Association Management

- WebRTCでは、SDPでネゴシエーションされたときにSCTPのアソシエーションをセットアップする
  - ICEによって選ばれつながれたDTLSの上でセットアップ
  - このDTLSの接続は、SRTPのメディアの接続と共有される
- 1アソシエーションで扱えるストリームの数の上限は`65535`
- アソシエーションの終了方法は2つ
  - 送受信中のメッセージを失わないグレイスフルな方法
  - 片方がいきなり切断する方法
- メッセージの到達をチェックし、再送があまりに増えた場合に切断する
- アソシエーションが閉じると、DataChannelも閉じられる
  - いきなり切断された場合などは、エラーの通達などが望ましい

### 6.3. SCTP Streams

- SCTPのストリームは、アソシエーション内に一方向の流れとして存在するもの
  - 多重化のためにシーケンス番号を保持
  - 順序保証されたものだけが並べ替えられる

### 6.4. Data Channel Definition

- DataChannelはWebSocketのように、対応するAPIが用意される
  - `label`によって、チャンネルを区別できる
- DataChannelはSCTPストリームのペアで、同じIDを持っている
  - このIDの紐付けは実装依存
- そのほかの属性
  - 信頼性の有無（ストリームではなくメッセージの属性）
  - 順序保証の有無（ストリームではなくメッセージの属性）
  - 2byteのUIntで表される優先度
    - 128: below normal
    - 256: normal
    - 512: high
    - 1024: extra high
  - ラベル（オプショナル）
  - プロトコル（オプショナル）

### 6.5. Opening a Data Channel

- DataChannelは、in-bandなネゴシエーションとout-bandなネゴシエーションで確立できる
  - out-bandな方法についてはここでは触れない
- in-bandな方法は以下にて
  - draft-ietf-rtcweb-data-protocol

### 6.6. Transferring User Data on a Data Channel

- 送受信されるメッセージは、そのDataChannelの設定によって伝送される
  - 信頼性や順序保証について
- 1つのSCTPのユーザーメッセージの中には、アプリ側のメッセージも1つしか含めてはいけない
- 送信するデータによって、次のPPIDを使用する
  - WebRTC String
  - WebRTC String Empty
  - WebRTC Binary
  - WebRTC Binary Empty
- SCTP自体は空メッセージをサポートしていない
  - なのでそのためのPPIDを指定して、0byteのメッセージを送る
- 不正な、無効なPPIDのメッセージを受信した場合、そのDataChannelを閉じてもよい
  - つまりネゴシエーションなしにPPIDを拡張できない
- 特定のストリームで大きいデータを送信すると、そのアソシエーション全体に影響が出る
  - それを回避するための実装がある
  - RFC8260
  - これに沿わない場合は、16KB以内に制限する必要がある
- それでも、メッセージサイズには制限を設けることが推奨される
  - draft-ietf-mmusic-sctp-sdp-26
- Nagleアルゴリズムは使わないほうがよい

### 6.7. Closing a Data Channel

- DataChannelを閉じるためには、外向きのSCTPストリームをリセットする
  - それに呼応して、リモート側もリセットする
  - ので、内向きのSCTPストリームがリセットされる
- リセットに際しては、SSN(Stream Sequence Number)を`0`に戻す
  - そのストリームはまたいつか再利用されるかも
- リセットする前に、全てのデータを送受信する必要がある
  - RFC6525

## 7. Security Considerations

- 特別に懸念される事項はなし
- 受信側は、送信側が巨大なメッセージを送信する可能性があることを考慮すべし

## 8. IANA Considerations

- SCTPのPPIDを6ヶ使用している
  - うち2つはDeprecated
  - 51: `WebRTC String`
  - 53: `WebRTC Binary`
  - 56: `WebRTC String Empty`
  - 57: `WebRTC Binary Empty`
