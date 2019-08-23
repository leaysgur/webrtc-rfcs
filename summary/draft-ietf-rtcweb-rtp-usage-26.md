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
  - draft-ietf-rtcweb-fec
  - ただしネゴシエーションすれば他の仕組みも使われるかも

## 7. WebRTC Use of RTP: Rate Control and Media Adaptation

- WebRTCは多種多様なネットワークからの接続を前提にしてる
- メディアも非対称に、いろいろな種類のものが流れる
- その多様性や、通信中に起こる変化にも、対応できるようになっている必要がある
- 通信の品質は、そのネットワーク特性に大きく依存する
  - 帯域やパケロスの頻度など
- そこはキモであるものの、輻輳制御のアルゴリズムに決定的なものはまだない
  - draft-ietf-rmcat-cc-requirements

### 7.1. Boundary Conditions and Circuit Breakers

- エンドポイントは、ブレーカーの仕組みが必要
  - RFC8083
- ネットワークの混雑に際してRTPの送信をやめる仕組み
  - なので輻輳制御とは意味が違う
- 輻輳制御に関しては、先述の通り
  - 各エンドポイントが独自に取り組む
- 使用する帯域をシグナリングで決めることもできる
  - SDPの`b=AS`とか`b=CT`とか

### 7.2. Congestion Control Interoperability and Legacy Systems

- WebRTCのエンドポイントは、RTCPとフィードバックのサポートが必要
- レガシーなエンドポイントは、RTCPのRRパケットを数秒起きに送信する
  - RTP/AVPとか
- いずれにせよ、ブレーカーが落ちない範囲で送信しないといけない
- 輻輳制御を独自に実装する場合の注意点
  - もし送信側を起点としたエンドポイントと、受信側を起点としたエンドポイントが通信したら
  - 片方だけが制御され、もう片方は制御されないことになってしまう
  - そういう懸念を踏まえて実装するべき

## 8. WebRTC Use of RTP: Performance Monitoring

- RTCPのSRとRRの生成は必須
- パケロスやジッタの統計が取れるので、パフォーマンス監視にも使える
- RTCPのXRで、他にも様々なメトリクスが取れる
  - RFC3611
  - RFC6792
- ただWebRTCにおいての利用は明示しない
  - もし利用するならシグナリングしてから
  - XRパケットを適切に送る

## 9. WebRTC Use of RTP: Future Extensions

- 将来的にRTPやRTPの拡張が成されるかもしれない
- そのときのガイドラインは以下をそれぞれ参照
- RTPペイロード
  - RFC2736
- RTCP
  - RFC5968
- ただし拡張は毒にも薬にもなりうるので、その見定めが必要

## 10. Signalling Considerations

- RTPはシグナリングチャネルが別に存在することを前提としている
  - そこで各種設定が行われる
  - 設定の詳細が以下
- プロファイル
  - WebRTCではRTP/SAVPF
  - セキュアなものと、そうでないものは、相互に接続できない
- トランスポート
  - ICEによって決定されるIP/ポート
    - RFC8445
  - RTP/RTCPそれぞれ
    - 多重化されることもある
    - RFC5761
- ペイロードタイプなど
  - ペイロードタイプ番号によってマップされる
  - `a=fmtp`
- ヘッダ拡張
  - WebRTCエンドポイント同士では使用する拡張をシグナリングする
  - WebRTCでないエンドポイントと通信する場合は、未知なるRTCPやヘッダ拡張を無視する
- RTCPの帯域
  - SDPを使うなら、そこでシグナリングされるべき
    - RFC3556
- シグナリングはSDPをオファー・アンサーすることで行われる
  - RTPとしては、SDPであってもなくてもよい

## 11. WebRTC API Considerations

- W3Cで定義されるAPIについて
- `MediaStream`に属する`MediaStreamTrack`
  - MSTは基本的には1つのマイクやカメラだが、合成したものを使ったりもできる
  - おなじMSに属するMSTは、同期再生される
- MSTは、RTPのコンテキストではSSRCで管理される
  - 同一のMSTから複数のSSRCが生まれることもある
  - FECや再送、SVCとか
- 単一のデバイスから複数のMSTが生まれることもある
  - その場合は、SSRCも分かれる
- 単一のMSTが異なるMSに属することもある
  - CNAMEは固定なはずなので、それを共有することで判別する
  - ミドルボックスが書き換える必要はない
- CNAMEは`RTCPeerConnection`ごとに異なるべき
  - 追跡できないように
- MS, MSTとSSRCとの関連などは、JSEPにて規定される
  - draft-ietf-rtcweb-jsep

## 12. RTP Implementation Considerations

- WebRTCのエンドポイントを実装するときの注意点など
- ミドルボックス向けの内容も少しある

### 12.1. Configuration and Use of RTP Sessions

- エンドポイントは、1つ以上のRTPセッションに参加する
- 1つのRTPセッションで複数のメディアを送信するし、受信する

#### 12.1.1. Use of Multiple Media Sources Within an RTP Session

- RTPセッションは、複数のRTPパケットストリームを含めることができるようになってる
- WebRTCでは多重化するが、そうでない分野ではメディアごとにトランスポートが異なる
- 多重化すると、1つのセッションで複数のパケットストリームが流れる
- そのほか
  - 複数の異なる入力から映像を送りたい場合
  - FECなど再送パケットを送る場合
  - SVCのように複数のSSRCを送る場合
  - RTPミキサーやミドルボックスなどが送信する場合

#### 12.1.2. Use of Multiple RTP Sessions

- 1つのセッションで複数のRTPパケットストリームを扱う
- それだけでなく、複数のセッションに参加するのがWebRTC
- その理由
  - メディアごとにセッションを作るレガシーなエンドポイントのため
  - ネットワークベースのQoSを個別に取りたいときがある
  - サイマルキャストなどを実現する際に、実装コストを下げるため
  - 単に複数のエンドポイントと同時に接続する（メッシュ状に）ため
  - SFUなどを通じて複数のエンドポイントと接続するため
- ミキサーの実装について
  - 全てのエンドポイントと単一のセッションでやり取りするパターン
  - エンドポイントごとにセッションを作成するパターン
  - 最終的にミドルボックスから届くソースの認証は難しい
    - ミドルボックスとの上りと下りの2経路が信頼できる前提

#### 12.1.3. Differentiated Treatment of RTP Streams

- RTPの差別化
  - どのストリームを優先度付けて送信するか、ビットレートを調整するかなど
- W3CのAPIとして、`MediaStreamTrack`ごとに優先順位を示すAPIが期待されている
  - FECなど再送ストリームに関しても優先度があるはず
  - デフォルトでは入力ストリームと再送ストリームの優先度は同じ
- ネットワークがIPパケットの単位で差別化するかも
  - DiffServ, フローベース, Deep Packet Inspection
- DiffServ
  - DSCPがマークしたパケット
  - draft-ietf-tsvwg-rtcweb-qos
- フローベース
  - 相対的な優先度づけはできない
  - ネットワークと調整するしかない
- DPI
  - SRTPでもRTPヘッダの先頭12byteは暗号化されない
  - なのでそれを見て分類できる
  - コーデックによって、Bフレームのみを優先するなど
  - 基本的に、ココで優先度や並べ替えを行うべきではない
  - RTCPとRTPも同じ優先度でマークされる必要がある

### 12.2. Media Source, RTP Streams, and Participant Identification

- 本文なし

#### 12.2.1. Media Source Identification

- RTPパケットストリームは、1つのSSRCで識別される
- 多重化されたパケットを解く手がかりとしても使う
- ミドルボックスでは、複数のSSRCから成るストリームを結合して、新しいストリームにできる
  - そのときに、結合した元のSSRCを示すCSRCリストを含めることができる
- CSRCは、`MediaStream`のIDにマッピングされるべき

#### 12.2.2. SSRC Collision Detection

- RTPの実装は、SSRCの衝突に対処できなければならない
  - 2つのエンドポイントが、同じSSRCを選んだ場合に起こる
- SDPなどでシグナリングしてから通信するケースでは、衝突可能性は低い
  - 見ればわかるので使わなければよい
  - ただしシグナリングが終わる前にメディアを送信しようとした場合は衝突する可能性がある
- シグナリングされないSSRCが存在することもある
  - 一部のRTPの機能では、送信しないがSSRCを生成することがある
- ミドルボックスへ送信したものが、そのまま返ってくる場合
  - バグではある
  - しかしそれを処理できることが重要

#### 12.2.3. Media Synchronisation Context

- メディアの同期について
- RTPでは、RTCPのCNAMEを使ってコンテキストを判別して同期する
- そして、RTPのタイムスタンプを、RTCPのSRにあるNTP形式のものと比較する
- 受信側はそれを使って同期再生できる

## 13. Security Considerations

- 基本的なセキュリティに関する懸念は以下
  - draft-ietf-rtcweb-security-arch
  - draft-ietf-rtcweb-security
- RTPに関しては、使用するプロファイルの懸念がそのまま該当する
- セキュアなRTPは、DTLS-SRTPによって実現される
  - RFC5764
- RTCPのCNAMEは、使い方によってはユーザーを追跡できる
  - RFC7022
- `b=RR`や`b=RS`で、RTCPの送信回数を意図的に引き上げる攻撃もありうる
- 予定されたインターバルとは異なるタイミングで届いたRTCPは無視する必要がある
- いくつかのコーデックは、可変ビットレートに対応している
  - その場合の懸念はRFC6562
- ミドルボックスはその特性上、確固たるセキュリティが必要となる
  - なりすましを防ぐなど
  - draft-ietf-avtcore-rtp-topologies-update
