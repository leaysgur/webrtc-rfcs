> Read [original](https://tools.ietf.org/html/draft-ietf-rtcweb-sdp-11) / [markdown](../markdown/draft-ietf-rtcweb-sdp-11.md)

---

# Annotated Example SDP for WebRTC

## 1. Introduction

- JSEPしかり、WebRTCのオファー・アンサーではSDPでそのやり取りが行われる
- この文書は、あらゆるユースケースにおいてそのSDPがどうなるかを書いてる

## 2. Terminology

- いつもの

## 3. SDP and the WebRTC

- ここではSDPの概要を説明する
  - 詳細はRFC4566
- SDPはWebRTCのものではなく、元から広く使われていたもの
  - SIP, RTSP, RTPなど
- SDPの構成要素
  - Session Metadata
  - Network Description
  - Stream Description
  - Security Description
  - QoS, Grouping Description

## 4. Offer/Answer and the WebRTC

- WebRTCでSDPはオファー・アンサーの過程で使われる
  - 詳細はRFC3264
- 初期のオファーを発行して、その内容に対してアンサーを返す
  - アンサーは拒否されることもある
- またセッションの途中に新たなオファーを発行することもある
  - そのあたりの状態はJSEPが担保してる

## 5. WebRTC Session Description Examples

- だいたいのWebRTCはこんな感じ
  - 0本以上のメディア（動画のみ、音声のみ、両方あり）
  - データのセッションもあるかも
  - DTLS-SRTPでセキュリティを担保
  - ICEを使ってNATを越える
  - RTCPを使ったフィードバック
  - IPv4かIPv6、またはデュアル
  - 5taple単位でバンドルする
    - IPとポートの組、プロトコル

### 5.1. Some Conventions

- 以降に続くサンプルの読み方に関する注意

### 5.2. Basic Examples

- 本文なし

#### 5.2.1. Audio Only Session

- 音声のみのセッション

#### 5.2.2. Audio/Video Session

- 音声・動画のセッション
- 動画の`m=`セクションが増えるだけ

##### 5.2.2.1. IPv4 audio/video session

- IPv4のとき

##### 5.2.2.2. Dual Stack audio/video session

- デュアルスタックのとき
- `a=candidate`にIPv6のが入るだけ

#### 5.2.3. Data Only Session

- DataChannelのみ

#### 5.2.4. Audio Call On Hold

- 音声のオファーを`inactive`でアンサー
- 一方通行で音声が流れる

#### 5.2.5. Audio with DTMF Session

- 音声とDTMFで合計2本の音声ストリーム

#### 5.2.6. One Way Audio/Video Session - Document Camera

- `sendonly`のオファーと`recvonly`のアンサー

#### 5.2.7. Audio, Video Session with BUNDLE Support Unknown

- BUNDLEがサポートされてないかもしれない環境
- WebRTCではありえない

#### 5.2.8. Audio, Video and Data Session

- 音声・動画・データのBUNDLE

#### 5.2.9. Audio, Video Session with BUNDLE Unsupported

- BUNDLEがサポートされてない環境
- WebRTCではありえない

#### 5.2.10. Audio, Video BUNDLED, but Data (Not BUNDLED)

- 音声・動画のBUNDLE
- データはBUNDLEしない
- WebRTCではありえない

#### 5.2.11. Audio Only, Add Video to BUNDLE

- 最初は音声のみ
- あとから動画を送ってBUNDLEする

### 5.3. MultiResolution, RTX, FEC Examples

- サイマルキャストなどマルチストリームの場合の例
- RTXとかFECとか

#### 5.3.1. Sendonly Simulcast Session with 2 cameras and 2 encodings per camera

- 1つの音声2つの動画
- 動画は解像度が2つずつ
  - VP8とH264
- この1 + 4RTPストリームをすべてBUNDLEする

#### 5.3.2. Successful SVC Video Session

- H264-SVCを選んで返す例

#### 5.3.3. Successful Simulcast Video Session with Retransmission

- RTXで多重化する例

#### 5.3.4. Successful 1-way Simulcast Session with 2 resolutions and RTX -One resolution rejected

- RTXで多重化して2本送るけど1つは拒否される例

#### 5.3.5. Simulcast Video Session with Forward Error Correction

- FECを使う例

### 5.4. Others

- それ以外のユースケース例
- RTPヘッダの拡張を使うやつとか

#### 5.4.1. Audio Session - Voice Activity Detection

- RTPの拡張でVADする例

#### 5.4.2. Audio Conference - Voice Activity Detection

- 同じくRTPの拡張でVADする例（ルーム）

#### 5.4.3. Successful legacy Interop Fallback with bundle-only

- レガシーVoIP環境とつなげる例
- 片や`bundle-only`で動画と音声をオファー
- 片やそれを無視して音声のみでつながる

#### 5.4.4. Legacy Interop with RTP/AVP profile

- 少し古いプロファイルであるAVPを使う例
- もちろんつながる

## 6. IANA Considerations

- IANAは関係なし

## 7. Security Considerations

- 別の仕様があるのでそれを参照
  - draft-ietf-rtcweb-security-arch
- SDPにはプライベートな情報が含まれるので、TLSなど暗号化が使われる

## 8. Acknowledgments

- 謝辞

## Appendix A. Appendix

- 本文なし

### A.1. JSEP SDP Attributes Checklist

- SDPの文法が正しいかを調べるためのチェックリスト

#### A.1.1. Common Checklist

- SDPのフォーマットについての決まりごと
  - `v=0`からはじまるとか
  - `s=-`は絶対に3行目とか

#### A.1.2. RTP Media Description Checklist

- RTPに関する記述のチェックリスト
  - JSEPでは`UDP/TLS/RTP/SAVPF`をプロトコルに指定するとか
  - `SAVPF`だけでなく、`S?AVPF?`をもれなくサポートせよとか
  - `a=group:LS`は`mid`と必ずセットにするとか

#### A.1.3. DataChannel Media Description checklist

- DataChannelのSDPのためのチェックリスト
  - タイプは`application`
  - `UDP/DTLS/SCTP`がプロトコル
