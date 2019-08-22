> Read [original](https://tools.ietf.org/html/draft-ietf-rtcweb-rtp-usage-26) / [markdown](../markdown/draft-ietf-rtcweb-rtp-usage-26.md)

---

# WebRTC: Media Transport and Use of RTP

## 1. Introduction

- 映像や音声をネットワーク越しにリアルタイムで送信するためのRTP
- WebRTCでもRTPを使うが、どのように使っているかを解説する
  - WebRTCを実装する場合の参考にもなるはず

## 2. Rationale

- RTPフレームワークは以下から成る
  - RTP自体
  - RTCP
  - RTPのペイロードやプロファイルや拡張
- RTPは拡張性の高い仕組みになっていて、たくさんの拡張がある
  - WebRTCで使っているのは、過去を踏まえて選ばれたもの

## 3. Terminology

- いつもの

## 4. WebRTC Use of RTP: Core Protocols

- RTPプロファイルに沿って、RTP/RTCPとして実装されるべきものを紹介
- 今日のネットワークにおいて必須となる拡張についても紹介する

### 4.1. RTP and RTCP

- まずはRTPとRTCPで必須となる実装について

- 単一のRTPセッションで複数のSSRCをやり取りすること
  - RFC3550
  - RFC8108
- SSRCをランダムに選んで、衝突耐性を備えること
- CSRCのサポート
- LipSyncのためにRTCPのSRを送信すること
  - 詳細はSection 5.2.1にて
- 複数の同期コンテキストをサポートすること
  - 単一のRTCPのCNAMEで、複数のストリームを扱う
- RTCPのSR, RR, SDES, BYEのサポート
  - 基本的にその他はオプショナルでよい
  - が、プロファイルによっては新たな拡張を持つかも
    - BUNDLEを利用する場合は、RTCPのSDESのMIDなど
    - RFC7941
- 単一のRTPセッションで複数のエンドポイントをやり取りした場合に、RTCPをよしなにハンドリングすること
- RTCPで使用する帯域を指定できるようにすること
- Reduced-Size RTCPのサポート
- ポーズ、レジュームに対応すること
  - 音声だけでなくどんなフォーマットでも
- 未知のRTCPパケットやRTPヘッダー拡張については無視すること
  - 混合パケットだったとしても適切に捨てること
- WebRTC以前のシステムでは、これらの拡張をサポートしていないかも
  - RTCP自体サポートされてないかも
  - システムを流用するなら注意してね

### 4.2. Choice of the RTP Profile

- どのRTPプロファイルを使うか
- WebRTCでは、RTP/SAVPFが必須
  - RFC5124
  - RFC7707
- RTP/SAVPFは、RTP/AVP + RTP/AVPF + RTP/SAVPである
  - RFC3551
  - RFC5104
  - RFC4585
  - RFC3711
- RTCP-Based Feedback拡張を実装することで、より効率的にRTCPを使える
- SRTP拡張はメディアを暗号化に必要
  - 暗号化しないパケットを絶対に送信してはいけない
  - DTLS-SRTPによって設定する

### 4.3. Choice of RTP Payload Formats

- どのペイロードを使うか
- 基本的にはこれらのドラフトに記載されているもの
  - draft-ietf-rtcweb-audio
  - draft-ietf-rtcweb-video
  - ただそのほかも、シグナリングすれば使える
- むしろ、シグナリングされていないものは使えない
  - ペイロードタイプのマッピングが双方に必要
  - SDPの`a=rtpmap`や`a=fmtp`に記載する
- ペイロードタイプはユニークである必要がある
- 単一のSSRCの中であれば、RTPのペイロードタイプを変更することができる
  - ただしクロックレートが異なる場合などは注意が必要
  - RFC7160

### 4.4. Use of RTP Sessions

- RTPを使って通信するエンドポイントの塊をRTPのセッションという
- WebRTCでは、複数のセッションをやり取りできる必要がある
  - 映像で1セッション、音声で1セッション
  - それぞれトランスポート（ポート）は別
- しかし昨今のネットワークでは、単一のセッション・トランスポートで済ませたい
  - シグナリングの時に同意できれば可能

### 4.5. RTP and RTCP Multiplexing

- 従来、RTPとRTCPは異なるポートを使っていた
  - 単一のRTPセッションにおいて2つ
- こちらもネットワークの制約もあって、RTP/RTCPのポート多重化が要求される
  - RFC5761
- 多重化した場合、メディアが流れていなくてもRTCPだけ定期的に流れるはず

### 4.6. Reduced Size RTCP

- 本来のRTCPは、複合パケットで送られる
  - SRかRRを筆頭とする
- ただしRTCP-Based Feedbackがあれば無駄になるものも多い
  - 帯域も減らしたい
- そこでReduced-Size RTCPを使える
  - RFC5506
- もちろん事前のシグナリングが必要
- 後方互換のため、複合パケットのみを送るようにできる必要もある

### 4.7. Symmetric RTP/RTCP

- Symmetricな通信もサポートする必要がある
  - RFC4961

### 4.8. Choice of RTP Synchronisation Source (SSRC)

- SSRCのサポートが必要
  - `a=ssrc`
  - RFC5576
- ただしRTPのセッションで実際に使用されるかどうかはオプショナル
  - ランダムなSSRCにも対応する必要がある
  - 衝突耐性も
- RTPの一連のパケットは、RTPとは関係のないコンテキストで管理すべき
  - 例えばSSRCと`MediaStreamTrack`を関連付けるなど
  - SSRCがない場合は、ペイロードタイプで管理されるかもしれない

### 4.9. Generation of the RTCP Canonical Name (CNAME)

- RTCPのCNAMEは、トランスポートのレベルでRTPのエンドポイントを識別するもの
- SSRCは衝突すれば変わるし、RTPのセッションごとに変わる
- CNAMEは、`RTCPeerConnection`のライフタイムでしか変わらない
  - 単一のCNAMEに基づくSSRCは全て同一のクロックを参照する
  - それが同期コンテキスト
- CNAMEの選び方は別途
  - RFC7022

### 4.10. Handling of Leap Seconds

- うるう秒についても考慮すべき
  - RFC7164

## 5. WebRTC Use of RTP: Extensions

- RTPの拡張がいくつもある
  - 一般的なものもあれば、会議用のものも
- WebRTCで使われる拡張を解説していく

### 5.1. Conferencing Extensions and Topologies

- RTPを使ってグループでコミュニケーションをとる方法はいくつかある
  - 中央にミドルボックスを置いて再配布してもらう方法
  - メッシュ状に参加者が相互にセッションを展開する方法
- いずれにせよ、WebRTCではサポートするべき
  - RFC7667
- 以下で解説する拡張は、中央集権的な配信システムのために設計された拡張
  - もちろん参加するエンドポイントがこれらをサポートしてなくても問題ない
  - ただしパフォーマンスは悪くなるはず
  - WebRTCではサポートされるべきもの

#### 5.1.1. Full Intra Request (FIR)

- FIRというフィードバック
  - RFC5104
- 新しいIntraピクチャ（= キーフレーム）を要求するためのもの
  - 入力ソースが変わったとか
- WebRTCのエンドポイントは、これの受信と対応が必要
- 送信すること自体はオプショナル

#### 5.1.2. Picture Loss Indication (PLI)

- PLIというフィードバック
  - RFC4585
- FIRと似てるけど異なる
  - より寛大なもの
  - キャッシュから返すなど復旧の方法がいくつかある
- WebRTCのエンドポイントは、これの受信と対応が必要

#### 5.1.3. Slice Loss Indication (SLI)

- SLIというフィードバック
  - RFC4585
- マクロブロックの欠損を知らせるためのもの
  - マクロブロックに対応したコーデックの場合に使われる
- SLIを受け取ったら、その欠損を修復すべき

#### 5.1.4. Reference Picture Selection Indication (RPSI)

- RPSIというフィードバック
  - RFC4585
- 対応したコーデックあれば利用できる
- エンコーダーとデコーダーの同期ズレに気付いた場合、このFBを送信する

#### 5.1.5. Temporal-Spatial Trade-off Request (TSTR)

- TSTRというフィードバック
  - RFC5104
- クオリティ優先で、フレームレートを下げたい場合など
- オプショナルなサポートでよい

#### 5.1.6. Temporary Maximum Media Stream Bit Rate Request (TMMBR)

- TMMBRというフィードバック
  - RFC5104
- 受信側が帯域に制限があることを通知できる
- 受信した場合は、その帯域制限に従う必要がある
- 送信は任意

### 5.2. Header Extensions

- RTPのヘッダ拡張への対応はオプショナルでよい
  - RFC5285
- しかし利用される場合は、事前のシグナリングが必要
- あくまで拡張なので、既存のものに影響を与えてはいけない

#### 5.2.1. Rapid Synchronisation

- 映像と音声の同期は、RTCPのSRパケットによって、受信側で行われる
  - ただしこれは遅い
- 代案として、Rapid Synchronisation拡張がある
  - RFC6051

#### 5.2.2. Client-to-Mixer Audio Level

- Client to Mixer Audio Level拡張
  - RFC6464
- ミドルボックスに、音声の入力レベルを伝えることができる
- 実装は必須
- ヘッダの暗号化も推奨
  - RFC6904
  - シグナリング時に暗号化しない設定にもできるように

#### 5.2.3. Mixer-to-Client Audio Level

- Mixer to Client Audio Level拡張
  - RFC6465
- さっきの逆
- 実装はオプショナル
- 使用する場合はヘッダを暗号化する
  - シグナリング時に暗号化しない設定にもできるように

#### 5.2.4. Media Stream Identification

- MID拡張
- RTPを`mid`でバンドルするために必要

#### 5.2.5. Coordination of Video Orientation

- Coordination of Video Orientation拡張
  - CVOと略す
  - RFC7742
- 映像を送受信するエンドポイントは必ず実装する

## 6. WebRTC Use of RTP: Improving Transport Robustness

- RTPパケットのパケロスを防ぐためのツールはいろいろある
  - ただしもちろんオーバーヘッドもある
  - 輻輳も考慮しておく必要がある
- そんな方法をいくつか解説していく

### 6.1. Negative Acknowledgements and RTP Retransmission

- NACKというフィードバック
  - RFC4585
- RTCPのフィードバックの容量制限に従って、RTPのパケロスを送信側に通知できる
  - 送信側はそれを受けてエンコーディングを調整する
- 送信側はGeneric NACKを理解する必要があるが、無視することもできる
- 受信側は、パケロスに際してNACKを送信できる
  - ただしすべてのパケロスで送信するべきではない
- RTPの再送ペイロードフォーマットで、NACKによってわかったパケロスを再送できる
  - RFC4588
  - 再送なので、RTTが小さい場合には効果的
  - ただしその分の帯域を食う
  - 再送は義務ではなく、必要かどうか送信側が判断する必要がある
- 受信側は、このSSRCの多重化による再送パケットをサポートする必要がある
  - セッション多重化による再送パケットも同じく

### 6.2. Forward Error Correction (FEC)

- 前方誤り訂正
  - 一定の帯域のオーバーヘッドを使って、パケロスに対応する
- FECのスキームはいくつかあって、ペイロードタイプに固有のものもある
- WebRTCで使えるFECはこちらを参照
  - draft-ietf-rtcweb-fec-10
  - ただしネゴシエーションすれば他の仕組みも使われるかも

## 7. WebRTC Use of RTP: Rate Control and Media Adaptation

### 7.1. Boundary Conditions and Circuit Breakers

### 7.2. Congestion Control Interoperability and Legacy Systems

## 8. WebRTC Use of RTP: Performance Monitoring

## 9. WebRTC Use of RTP: Future Extensions

## 10. Signalling Considerations

## 11. WebRTC API Considerations

## 12. RTP Implementation Considerations

### 12.1. Configuration and Use of RTP Sessions

#### 12.1.1. Use of Multiple Media Sources Within an RTP Session

#### 12.1.2. Use of Multiple RTP Sessions

#### 12.1.3. Differentiated Treatment of RTP Streams

### 12.2. Media Source, RTP Streams, and Participant Identification

#### 12.2.1. Media Source Identification

#### 12.2.2. SSRC Collision Detection

#### 12.2.3. Media Synchronisation Context

## 13. Security Considerations
