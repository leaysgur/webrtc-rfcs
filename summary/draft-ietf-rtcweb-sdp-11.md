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

#### 5.3.1. Sendonly Simulcast Session with 2 cameras and 2 encodings per camera

#### 5.3.2. Successful SVC Video Session

#### 5.3.3. Successful Simulcast Video Session with Retransmission

#### 5.3.4. Successful 1-way Simulcast Session with 2 resolutions and RTX -One resolution rejected

#### 5.3.5. Simulcast Video Session with Forward Error Correction

### 5.4. Others

#### 5.4.1. Audio Session - Voice Activity Detection

#### 5.4.2. Audio Conference - Voice Activity Detection

#### 5.4.3. Successful legacy Interop Fallback with bundle-only

#### 5.4.4. Legacy Interop with RTP/AVP profile

## 6. IANA Considerations

## 7. Security Considerations

## 8. Acknowledgments

## Appendix A. Appendix

### A.1. JSEP SDP Attributes Checklist

#### A.1.1. Common Checklist

#### A.1.2. RTP Media Description Checklist

#### A.1.3. DataChannel Media Description checklist
