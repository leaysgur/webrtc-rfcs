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

### 4.3. Choice of RTP Payload Formats

### 4.4. Use of RTP Sessions

### 4.5. RTP and RTCP Multiplexing

### 4.6. Reduced Size RTCP

### 4.7. Symmetric RTP/RTCP

### 4.8. Choice of RTP Synchronisation Source (SSRC)

### 4.9. Generation of the RTCP Canonical Name (CNAME)

### 4.10. Handling of Leap Seconds

## 5. WebRTC Use of RTP: Extensions

### 5.1. Conferencing Extensions and Topologies

#### 5.1.1. Full Intra Request (FIR)

#### 5.1.2. Picture Loss Indication (PLI)

#### 5.1.3. Slice Loss Indication (SLI)

#### 5.1.4. Reference Picture Selection Indication (RPSI)

#### 5.1.5. Temporal-Spatial Trade-off Request (TSTR)

#### 5.1.6. Temporary Maximum Media Stream Bit Rate Request (TMMBR)

### 5.2. Header Extensions

#### 5.2.1. Rapid Synchronisation

#### 5.2.2. Client-to-Mixer Audio Level

#### 5.2.3. Mixer-to-Client Audio Level

#### 5.2.4. Media Stream Identification

#### 5.2.5. Coordination of Video Orientation

## 6. WebRTC Use of RTP: Improving Transport Robustness

### 6.1. Negative Acknowledgements and RTP Retransmission

### 6.2. Forward Error Correction (FEC)

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
