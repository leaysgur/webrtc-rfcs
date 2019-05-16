> Read [original](https://tools.ietf.org/html/draft-ietf-mmusic-sdp-mux-attributes-17) / [markdown](../markdown/draft-ietf-mmusic-sdp-mux-attributes-17.md)

---

# A Framework for SDP Attributes when Multiplexing

## 1. Introduction

- そもそものSDP
  - セッションレベル
  - 各メディアレベル
- 各メディアも別々のトランスポートで送ってた
- しかし`a=group:BUNDLE`ができるようになって事情が変わった
  - ICEの属性たちが各メディアレベルにあっても混乱する
- SDPの属性もたくさんあるし、用途によって使い分ける必要がある
  - それをまとめたものをフレームワークと称する

## 2. Terminology

- いつもの

## 3. Motivation

- ICE, DTLS, SRTP, RTPなどのスタックを使う昨今
  - NAT超えのコストもあるし、できれば利用するトランスポートは限定したい
- そこでBUNDLEするようになったはいいが、SDPとしては制約も増えた
- 属性のコンビネーションが問題になってくる
  - 古き良きSDPの制約は、1ポートに多重化すると意味をなさなかったり不整合があったり
- いま現在250のSDP属性があって、この先も増えていくだろう

## 4. SDP Attribute Analysis Framework

- SDPの構成は3層
  - セッションレベル
  - メディアレベル
  - ソースレベル
- これらを構成する各属性が多重化される場合にどうなるかを、カテゴリに分けて解説する
  - メディアに関するもの
  - RTCP/RTCPやネットワークアドレス、QoSなど
  - メタ情報
  - グルーピングなど、メディアに関するものの関連付けに関するもの

### 4.1. Category: NORMAL

- `NORMAL`カテゴリ
- 多重化されるときも意味合いは変わらない
- `sendonly`などの`direction`や、`a=label`など

### 4.2. Category: CAUTION

- `CAUTION`カテゴリ
- 多重化されると意味合いが変わる
- DCCPに関するものなど
  - WebRTCでは使わない

### 4.3. Category: IDENTICAL

- `IDENTICAL`カテゴリ
- 多重化されていても、すべての`m=`セクションに必要
- `a=rtcp-mux`など
- とはいってもBUNDLEする場合は、ベースとなる`m=`にだけ適用するものもある

### 4.4. Category: SUM

- `SUM`カテゴリ
- 多重化される場合に、合算されるべきもの
- `b=AS`など

### 4.5. Category: TRANSPORT

- `TRANSPORT`カテゴリ
- すべての`m=`セクションに記述されていても、BUNDLEのベースとなるものを採用する
- `a=crypto`など

### 4.6. Category: INHERIT

- `INHERIT`カテゴリ
- RFC5939のSDP Capability Negotiationを使うときに
- WebRTCでは使ってない

### 4.7. Category: IDENTICAL-PER-PT

- `IDENTICAL-PER-PT`カテゴリ
  - PT: ペイロードタイプ
- その`m=`セクションで使われるRTPのペイロードタイプに関するもの
- 複数回登場する場合でも、ペイロードタイプは同じ数値になる
  - 拡張を表す属性値も同じになる

### 4.8. Category: SPECIAL

- `SPECIAL`カテゴリ
- 簡単には説明できないので、各仕様を参照してほしいもの
- `extmap`属性など

### 4.9. Category: TBD

- `TBD`カテゴリ
- 挙動が決まってないので、多重化されるべきではないもの

## 5. Analysis of Existing Attributes

- 既存のRFCで定義されているSDP属性について改めて分類
- 表記は以下
  - S: セッションレベル
  - M: メディアレベル
  - B: セッションレベルでもメディアレベルでも
  - SR: ソースレベル

### 5.1. RFC4566: SDP

- `sendrecv`: B, NORMAL
  - その他の方向属性も同じ
- `rtpmap`: M, IDENTICAL-PER-PT
- `fmtp`: M, IDENTICAL-PER-PT

### 5.2. RFC4585: RTP/AVPF

- `rtcp-fb`: M, IDENTICAL-PER-PT

### 5.3. RFC5761: Multiplexing RTP and RTCP

- `rtcp-mux`: M, IDENTICAL

### 5.4. RFC3312: Integration of Resource Management and SIP

- WebRTCでは使ってない

### 5.5. RFC4574: SDP Label Attribute

- WebRTCでは使ってない

### 5.6. RFC5432: QOS Mechanism Selection in SDP

- WebRTCでは使ってない

### 5.7. RFC4568: SDP Security Descriptions

- WebRTCでは使ってない

### 5.8. RFC5762: RTP over DCCP

- WebRTCでは使ってない

### 5.9. RFC6773: DCCP-UDP Encapsulation

- WebRTCでは使ってない

### 5.10. RFC5506: Reduced-Size RTCP in RTP Profile

- `rtcp-rsize`: M, IDENTICAL

### 5.11. RFC6787: Media Resource Control Protocol Version 2

- WebRTCでは使ってない

### 5.12. RFC5245: ICE

- `ice-lite`: S, NORMAL
- `ice-options`: S, NORMAL
- `ice-mismatch`: S, NORMAL
- `ice-pwd`: B, TRANSPORT
- `ice-ufrag`: B, TRANSPORT
- `candidate`: M, TRANSPORT
- `remote-candidates`: M, TRANSPORT

### 5.13. RFC5285: RTP Header Extensions

- `extmap`: B, SPECIAL

### 5.14. RFC3605: RTCP attribute in SDP

- `rtcp`: M, TRANSPORT

### 5.15. RFC5576: Source-Specific SDP Attributes

- `ssrc`: M, NORMAL
- `ssrc-group`: M, NORMAL

### 5.16. RFC7273: RTP Clock Source Signalling

- WebRTCでは使ってない

### 5.17. RFC6236: Image Attributes in SDP

- `imageattr`: M, IDENTICAL-PER-PT

### 5.18. RFC7197: Duplication Delay Attribute in SDP

- WebRTCでは使ってない

### 5.19. RFC7266: RTCP XR Blocks for MOS Metric Reporting

- WebRTCでは使ってない

### 5.20. RFC6285: Rapid Acquisition of Multicast RTP Sessions

- WebRTCでは使ってない

### 5.21. RFC6230: Media Control Channel Framework

- WebRTCでは使ってない

### 5.22. RFC6364: SDP Elements for FEC Framework

- WebRTCでは使ってない

### 5.23. RFC4796: Content Attribute

- WebRTCでは使ってない

### 5.24. RFC3407: SDP Simple Capability Declaration

- WebRTCでは使ってない

### 5.25. RFC6284: Port Mapping between Unicast and Multicast RTP Sessions

- WebRTCでは使ってない

### 5.26. RFC6714: MSRP-CEMA

- WebRTCでは使ってない

### 5.27. RFC4583: SDP Format for BFCP Streams

- WebRTCでは使ってない

### 5.28. RFC5547: SDP Offer/Answer for File Transfer

- WebRTCでは使ってない

### 5.29. RFC6849: SDP and RTP Media Loopback Extension

- WebRTCでは使ってない

### 5.30. RFC5760: RTCP with Unicast Feedback

- WebRTCでは使ってない

### 5.31. RFC3611: RTCP XR

- WebRTCでは使ってない

### 5.32. RFC5939: SDP Capability Negotiation

- WebRTCでは使ってない

### 5.33. RFC6871: SDP Media Capabilities Negotiation

- WebRTCでは使ってない

### 5.34. RFC7006: Miscellaneous Capabilities Negotiation SDP

- WebRTCでは使ってない

### 5.35. RFC4567: Key Management Extensions for SDP and RTSP

- WebRTCでは使ってない

### 5.36. RFC4572: Comedia over TLS in SDP

- `fingerprint`: B, TRANSPORT

### 5.37. RFC4570: SDP Source Filters

- WebRTCでは使ってない

### 5.38. RFC6128: RTCP Port for Multicast Sessions

- WebRTCでは使ってない

### 5.39. RFC6189: ZRTP

- WebRTCでは使ってない

### 5.40. RFC4145: Connection-Oriented Media

- `setup`: B, TRANSPORT

### 5.41. RFC6947: The SDP altc Attribute

- WebRTCでは使ってない

### 5.42. RFC7195: SDP Extension for Circuit Switched Bearers in PSTN

- WebRTCでは使ってない

### 5.43. RFC7272: IDMS Using the RTP Control Protocol (RTCP)

- WebRTCでは使ってない

### 5.44. RFC5159: Open Mobile Alliance (OMA) Broadcast (BCAST) SDP Attributes

- WebRTCでは使ってない

### 5.45. RFC6193: Media Description for IKE in SDP

- WebRTCでは使ってない

### 5.46. RFC2326: Real Time Streaming Protocol

- WebRTCでは使ってない

### 5.47. RFC6064: SDP and RTSP Extensions for 3GPP

- WebRTCでは使ってない

### 5.48. RFC3108: ATM SDP

- WebRTCでは使ってない

### 5.49. 3GPP TS 26.114

- WebRTCでは使ってない

### 5.50. 3GPP TS 183.063

- WebRTCでは使ってない

### 5.51. 3GPP TS 24.182

- WebRTCでは使ってない

### 5.52. 3GPP TS 24.183

- WebRTCでは使ってない

### 5.53. 3GPP TS 24.229

- WebRTCでは使ってない

### 5.54. ITU T.38

- WebRTCでは使ってない

### 5.55. ITU-T Q.1970

- WebRTCでは使ってない

### 5.56. ITU-T H.248.15

- WebRTCでは使ってない

### 5.57. RFC4975: The Message Session Relay Protocol

- WebRTCでは使ってない

### 5.58. Historical Attributes

- WebRTCでは使ってない

## 6. bwtype Attribute Analysis

- 同様に、帯域に関する設定について
  - `b=AS`とか

### 6.1. RFC4566: SDP

- `AS`: B, SUM

### 6.2. RFC3556: SDP Bandwidth Modifiers for RTCP Bandwidth

- `RS`: B, SUM
- `RR`: B, SUM

### 6.3. RFC3890: Bandwidth Modifier for SDP

- `TIAS`: B, SPECIAL

## 7. rtcp-fb Attribute Analysis

- `a=rtcp-fb`で指定する値について
- ここに記載があるもの以外でもWebRTCで使われてるものはある
  - `transport-cc`, `goog-remb`

### 7.1. RFC4585: RTP/AVPF

- `nack`: M, IDENTICAL-PER-PT
- `nack pli`: M, IDENTICAL-PER-PT

### 7.2. RFC5104: Codec Control Messages in AVPF

- WebRTCでは使ってない

### 7.3. RFC6285: Unicast-Based Rapid Acquisition of Multicast RTP Sessions (RAMS)

- WebRTCでは使ってない

### 7.4. RFC6679: ECN for RTP over UDP/IP

- WebRTCでは使ってない

### 7.5. RFC6642: Third-Party Loss Report

- WebRTCでは使ってない

### 7.6. RFC5104: Codec Control Messages in AVPF

- `ccm fir`: M, IDENTICAL-PER-PT

## 8. group Attribute Analysis

- `a=group`で指定する値について

### 8.1. RFC5888: SDP Grouping Framework

- WebRTCでは使ってない

### 8.2. RFC3524: Mapping Media Streams to Resource Reservation Flows

- WebRTCでは使ってない

### 8.3. RFC4091: ANAT Semantics

- WebRTCでは使ってない

### 8.4. RFC5956: FEC Grouping Semantics in SDP

- WebRTCでは使ってない

### 8.5. RFC5583: Signaling Media Decoding Dependency in SDP

- WebRTCでは使ってない

### 8.6. RFC7104: Duplication Grouping Semantics in the SDP

- WebRTCでは使ってない

## 9. ssrc-group Attribute Analysis

- `a=ssrc-group`で指定する値について

### 9.1. RFC5576: Source-Specific SDP Attributes

- `FID`: SR, NORMAL

### 9.2. RFC7104: Duplication Grouping Semantics in the SDP

- WebRTCでは使ってない

## 10. QoS Mechanism Token Analysis

- QoSに関するものについて

### 10.1. RFC5432: QoS Mechanism Selection in SDP

- WebRTCでは使ってない

## 11. k= Attribute Analysis

- 本文なし

### 11.1. RFC4566: SDP

- WebRTCでは使ってない

## 12. content Attribute Analysis

- 本文なし

### 12.1. RFC4796

- WebRTCでは使ってない

## 13. Payload Formats

- 本文なし

### 13.1. RFC5109: RTP Payload Format for Generic FEC

- WebRTCでは使ってない

## 14. Multiplexing Considerations for Encapsulating Attributes

- 他の属性を要約・カプセル化する属性について
- WebRTCでは使ってない

### 14.1. RFC3407: cpar Attribute Analysis

- WebRTCでは使ってない

### 14.2. RFC5939 Analysis

- WebRTCでは使ってない

#### 14.2.1. Recommendation: Procedures for Potential Configuration Pairing

- WebRTCでは使ってない

##### 14.2.1.1. Example: Transport Capability Multiplexing

- WebRTCでは使ってない

##### 14.2.1.2. Example: Attribute Capability Multiplexing

- WebRTCでは使ってない

### 14.3. RFC6871 Analysis

- WebRTCでは使ってない

#### 14.3.1. Recommendation: Dealing with Payload Type Numbers

- WebRTCでは使ってない

##### 14.3.1.1. Example: Attribute Capability Under Shared Payload Type

- WebRTCでは使ってない

#### 14.3.2. Recommendation: Dealing with Latent Configurations

- WebRTCでは使ってない

## 15. IANA Considerations

- IANAに関して

### 15.1. New 'Multiplexing Categories' subregistry

- `NORMAL`や`IDENTICAL`など、カテゴリを登録する

### 15.2. 'Mux Category' column for subregistries

- SDPの属性それぞれと、カテゴリを紐付ける

#### 15.2.1. Table: SDP bwtype

- `bwtype`にもそれぞれカテゴリを紐付ける

#### 15.2.2. Table: att-field (session level)

- セッションレベルの`att-field`の部分も、カテゴリを紐付ける

#### 15.2.3. Table: att-field (both session and media level)

- セッションレベルとメディアレベルの`att-field`の部分も、カテゴリを紐付ける

#### 15.2.4. Table: att-field (media level only)

- メディアレベルの`att-field`の部分も、カテゴリを紐付ける

#### 15.2.5. Table: att-field (source level)

- ソースレベルの`att-field`の部分も、カテゴリを紐付ける

#### 15.2.6. Table: content SDP Parameters

- WebRTCでは使ってない

#### 15.2.7. Table: Semantics for the 'group' SDP Attribute

- `a=group`にも、カテゴリを紐付ける

#### 15.2.8. Table: 'rtcp-fb' Attribute Values

- `a=rtcp-fb`にも、カテゴリを紐付ける

#### 15.2.9. Table: 'ack' and 'nack' Attribute Values

- `ack`と`nack`についてもカテゴリを紐付ける

#### 15.2.10. Table: 'depend' SDP Attribute Values

- WebRTCでは使ってない

#### 15.2.11. Table: 'cs-correlation' Attribute Values

- WebRTCでは使ってない

#### 15.2.12. Table: Semantics for the 'ssrc-group' SDP Attribute

- `a=ssrc-group`にも、カテゴリを紐付ける

#### 15.2.13. Table: SDP/RTSP key management protocol identifiers

- WebRTCでは使ってない

#### 15.2.14. Table: Codec Control Messages

- WebRTCでは使ってない

#### 15.2.15. Table: QoS Mechanism Tokens

- WebRTCでは使ってない

#### 15.2.16. Table: SDP Capability Negotiation Option Tags

- WebRTCでは使ってない

#### 15.2.17. Table: Timestamp Reference Clock Source Parameters

- WebRTCでは使ってない

#### 15.2.18. Table: Media Clock Source Parameters

- WebRTCでは使ってない

## 16. Security Considerations

- 既存のものに準ずる
- `CAUTION`カテゴリに属するものは注意
