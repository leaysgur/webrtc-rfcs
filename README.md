# webrtc-rfcs

WebRTC related RFCs, Dradts, and Specs.

- See [`/markdown`](./markdown) for Markdown formatted RFC.
- See [`/summary`](./summary) for Japanese summary of each RFC.

Linked means I've already read through.

## Overview

- [draft-ietf-rtcweb-overview-19](./summary/draft-ietf-rtcweb-overview-19.md)
  - Overview: Real Time Protocols for Browser-based Applications
  - そもそもの思想や全体像について
- [RFC7478](./summary/rfc7478.md)
  - Web Real-Time Communication Use Cases and Requirements
  - WebRTCのユースケースと、その実現に必要なコンポーネント、実装に対する要求について
- [draft-ietf-rtcweb-transports-17](./summary/draft-ietf-rtcweb-transports-17.md)
  - Transports for WebRTC
  - WebRTCで使用しているトランスポートや実装すべきプロトコルについて
- [webrtc-nv-use-cases](https://w3c.github.io/webrtc-nv-use-cases/)
  - WebRTC Next Version Use Cases
  - 過去を踏まえたこれからのWebRTCのユースケースについて
- [RFC7742](./summary/rfc7742.md)
  - WebRTC Video Processing and Codec Requirements
  - WebRTCで扱う映像の概要について
- [RFC7874](./summary/rfc7874.md)
  - WebRTC Audio Processing and Codec Requirements
  - WebRTCで扱う音声の概要について

## W3C JavaScript API

- [draft-ietf-rtcweb-jsep-26](./summary/draft-ietf-rtcweb-jsep-26.md)
  - JavaScript Session Establishment Protocol
  - JavaScriptのAPI、各RFCとAPIがどう関係してるかなど実践的な全体像について
- [webrtc-pc](https://w3c.github.io/webrtc-pc/)
  - WebRTC 1.0: Real-time Communication Between Browsers
  - `RTCPeerConnection`について
- [webrtc-stats](https://w3c.github.io/webrtc-stats/)
  - Identifiers for WebRTC's Statistics API
  - `getStats()`について
- [mediacapture-main](https://w3c.github.io/mediacapture-main/)
  - Media Capture and Streams
  - `MediaStream`と`getUserMedia()`について
- [mediacapture-image](https://w3c.github.io/mediacapture-image/)
  - MediaStream Image Capture
  - `ImageCapture`について
- [mediacapture-fromelement](https://w3c.github.io/mediacapture-fromelement/)
  - Media Capture from DOM Elements
  - `captureStream()`について
- [mediacapture-record](https://w3c.github.io/mediacapture-record/)
  - MediaStream Recording
  - `MediaRecorder`について
- [mediacapture-output](https://w3c.github.io/mediacapture-output/)
  - Audio Output Devices API
  - `sinkId`と`setSinkId()`について
- [mediacapture-screen-share](https://w3c.github.io/mediacapture-screen-share/)
  - Screen Capture
  - `getDisplayMedia()`について
- [webrtc-svc](https://w3c.github.io/webrtc-svc/)
  - Scalable Video Coding (SVC) Extension for WebRTC
  - WebRTCでSVCを実現するための拡張について
- [webrtc-ice](https://w3c.github.io/webrtc-ice/)
  - IceTransport Extensions for WebRTC
  - `RTCIceTransport`について
- [webrtc-quic](https://w3c.github.io/webrtc-quic/)
  - QUIC API for Peer-to-peer Connections
  - `RTCQuicTransport`について
- [webrtc-quic/cs](https://w3c.github.io/webrtc-quic/cs.html)
  - QUIC API for Client-to-Server Connections
  - `RTCQuicStream`について

## ICE

- [RFC8445](./summary/rfc8445.md)
  - ICE: A Protocol for Network Address Translator (NAT) Traversal
  - NATを越えて通信するためのプロトコルであるICEについて
- [RFC7675](./summary/rfc7675.md)
  - STUN Usage for Consent Freshness
  - ICEのKeepAliveの代わりに行うConsentFreshnessという手順について
- [draft-ietf-ice-trickle-21](./summary/draft-ietf-ice-trickle-21.md)
  - Trickle ICE: Incremental Provisioning of Candidates for the ICE Protocol
  - ICEのcandidateを送るタイミングを早めるTrickleというデファクトスタンダードな手法について
- [RFC8421](./summary/rfc8421.md)
  - Guidelines for Multihomed and IPv4/IPv6 Dual-Stack ICE
  - candidateの優先度計算でIPv4とIPv6の違いをどう考慮するかについて
- [draft-thatcher-ice-renomination-01](./summary/draft-thatcher-ice-renomination-01.md)
  - ICE Renomination: Dynamically selecting ICE candidate pairs
  - ノミネーションを動的に行い通信経路をいつでも変えられるようにするICE Renominationについて
- [RFC5389](./summary/rfc5389.md)
  - Session Traversal Utilities for NAT
  - ICEの過程で使われるSTUNプロトコルについて
- [RFC7064](./summary/rfc7064.md)
  - STUN URI Scheme for the STUN Protocol
  - STUNサーバーをURIで表すための`stun`と`stuns`について
- [draft-ietf-ice-pac-02](./summary/draft-ietf-ice-pac-02.md)
  - ICE Patiently Awaiting Connectivity
  - ICEで`prflx`な候補を見つけるためのタイマーについて
- RFC6544
  - TCP Candidates with ICE
- draft-ietf-tram-turnbis-21
  - Traversal Using Relays around NAT (TURN): Relay Extensions to STUN

## SDP

- [draft-ietf-rtcweb-sdp-11](./summary/draft-ietf-rtcweb-sdp-11.md)
  - Annotated Example SDP for WebRTC
  - WebRTCで実際に使われるSDPのサンプルについて
- [RFC4566](./summary/rfc4556.md)
  - SDP: Session Description Protocol
  - WebRTC以前からあるSDPの基本について
- [RFC3264](./summary/rfc3264.md)
  - An Offer/Answer Model with the SDP
  - WebRTCのオファー・アンサーモデルでSDPをどう使うかについて
- [draft-ietf-mmusic-ice-sip-sdp-39](./summary/draft-ietf-mmusic-ice-sip-sdp-39.md)
  - SDP Offer/Answer procedures for ICE
  - ICEの情報をSDPにどう載せて使うかについて
- [RFC4145](./summary/rfc4145.md)
  - TCP-Based Media Transport in the SDP
  - 元々はTCPのコネクションを確立するための`a=setup`行の成り立ちについて
- [RFC8122](./summary/rfc8122.md)
  - Connection-Oriented Media Transport over the TLS Protocol in the SDP
  - セキュアにメディアを転送するための`a=fingerprint`行の成り立ちについて
- [RFC5763](./summary/rfc5763.md)
  - Framework for Establishing a SRTP Security Context Using DTLS
  - SRTPの鍵交換にDTLSを使うための`a=setup`行とその後の手順について
- [RFC3605](./summary/rfc3605.md)
  - RTCP attribute in SDP
  - RTCPのポート番号を定義する`a=rtcp`行について
- [RFC5506](./summary/rfc5506.md)
  - Support for Reduced-Size RTCP: Opportunities and Consequences
  - 通常のRTCPの複合パケットとは別で送られるReduced-Size RTCPの使用を意味する`a=rtcp-rsize`行について
- [RFC5761](./summary/rfc5761.md)
  - Multiplexing RTP Data and Control Packets on a Single Port
  - RTPとRTCPを多重化するメディアレベルの`a=rtcp-mux`行について
- [draft-ietf-mmusic-mux-exclusive-12](./summary/draft-ietf-mmusic-mux-exclusive-12.md)
  - Indicating Exclusive Support of RTP/RTCP Multiplexing using SDP
  - RTPとRTCPの多重化を強制するメディアレベルの`a=rtcp-mux-only`行について
- [draft-roach-mmusic-unified-plan-00](./summary/draft-roach-mmusic-unified-plan-00.md)
  - A Unified Plan for Using SDP with Large Numbers of Media Flows
  - 複数のメディアをSDPにどう記述するかを定めたUnifiedPlanの基本の考え方について
- [RFC5576](./summary/rfc5576.md)
  - Source-Specific Media Attributes in the SDP
  - RTPのSSRCとの関連を表すソースレベルの`a=ssrc`行について
- [RFC5888](./summary/rfc5888.md)
  - The Session Description Protocol (SDP) Grouping Framework
  - メディアをグルーピングできるセッションレベルの`a=group`属性とメディアレベルの`a=mid`属性について
- [draft-ietf-mmusic-sdp-bundle-negotiation-54](./summary/draft-ietf-mmusic-sdp-bundle-negotiation-54.md)
  - Negotiating Media Multiplexing Using the SDP
  - 1つのポートで複数のメディアを多重化するための`a=group:BUNDLE`について
- [draft-ietf-mmusic-msid-17](./summary/draft-ietf-mmusic-msid-17.md)
  - WebRTC MediaStream Identification in the Session Description Protocol
  - SDPとMediaStream(Track)を紐付けるメディアレベルの`a=msid`行について
- [draft-ietf-mmusic-sdp-mux-attributes-17](./summary/draft-ietf-mmusic-sdp-mux-attributes-17.md)
  - A Framework for SDP Attributes when Multiplexing
  - 多重化を実施する場合に、それぞれのSDPの属性がどのように影響を受けるかについて
- RFC5956
  - Forward Error Correction Grouping Semantics in the SDP
- RFC3556
  - SDP Bandwidth Modifiers for RTCP Bandwidth

## DTLS

- [RFC6347](./summary/rfc6347.md)
  - Datagram Transport Layer Security Version 1.2
  - UDPでTLSを使用するための、DTLS 1.2について
- [RFC5764](./summary/rfc5764.md)
  - DTLS Extension to Establish Keys for the SRTP
  - SRTPのための鍵を取得するためのDLTSの`use_srtp`拡張について
- [RFC7983](./summary/rfc7983.md)
  - Multiplexing Scheme Updates for SRTP Extension for DTLS
  - STUN/DTLS/SRTPがすべて多重化された場合の識別方法について

## SRTP

- RFC3711
  - The Secure Real-time Transport Protocol (SRTP)
- RFC6904
  - Encryption of Header Extensions in the SRTP
- RFC6562
  - Guidelines for the Use of Variable Bit Rate Audio with Secure RTP

## RTP/RTCP

- [draft-ietf-rtcweb-rtp-usage-26](./summary/draft-ietf-rtcweb-rtp-usage-26.md)
  - WebRTC Media Transport and Use of RTP
  - WebRTCにおけるRTPの関係とその使い方について
- RFC3550
  - RTP: A Transport Protocol for Real-Time Applications
- RFC8108
  - Sending Multiple RTP Streams in a Single RTP Session
- RFC7160
  - Support for Multiple Clock Rates in an RTP Session
- RFC7164
  - RTP and Leap Seconds
- RFC7667
  - RTP Topologies
- RFC4588
  - RTP Retransmission Payload Format
- RFC8083
  - Multimedia Congestion Control: Circuit Breakers for Unicast RTP Sessions
- RFC3611
  - RTP Control Protocol Extended Reports (RTCP XR)
- RFC6792
  - Guidelines for Use of the RTP Monitoring Framework
- RFC2736
  - Guidelines for Writers of RTP Payload Format Specifications
- RFC5968
  - Guidelines for Extending the RTCP
- RFC5285
  - A General Mechanism for RTP Header Extensions
- RFC6051
  - Rapid Synchronisation of RTP Flow
- RFC3551
  - RTP Profile for Audio and Video Conferences with Minimal Control
- RFC5104
  - Codec Control Messages in the RTP Audio-Visual Profile with Feedback (AVPF)
- RFC5761
  - Multiplexing RTP Data and Control Packets on a Single Port
- RFC4961
  - Symmetric RTP / RTCP
- RFC7022
  - Guidelines for Choosing RTCP Canonical Names (CNAMEs)
- RFC4585
  - Extended RTP Profile for RTCP-Based Feedback (RTP/AVPF)
- RFC5124
  - Extended Secure RTP Profile for RTCP-Based Feedback (RTP/SAVPF)
- RFC6464
  - A RTP Header Extension for Client-to-Mixer Audio Level Indication
- RFC6465
  - A RTP Header Extension for Mixer-to-Client Audio Level Indication
- RFC7941
  - A RTP Header Extension for the RTCP Source Description Items
- draft-ietf-rtcweb-fec-10
  - WebRTC Forward Error Correction Requirements
- draft-ietf-rmcat-cc-requirements-09
  - Congestion Control Requirements for Interactive Real-Time Media

## SCTP

- RFC4960
  - Stream Control Transmission Protocol

## DataChannel

- [draft-ietf-rtcweb-data-channel-13](./summary/draft-ietf-rtcweb-data-channel-13.md)
  - WebRTC Data Channels
  - WebRTCのData Channelについて
- draft-ietf-rtcweb-data-protocol-09
  - WebRTC Data Channel Establishment Protocol

## Security
- [draft-ietf-rtcweb-ip-handling-12](./summary/draft-ietf-rtcweb-ip-handling-12.md)
  - WebRTC IP Address Handling Requirements
  - P2Pするために集めたIPアドレスの扱いについて
- [draft-ietf-rtcweb-mdns-ice-candidates-03](./summary/draft-ietf-rtcweb-mdns-ice-candidates-03.md)
  - Using Multicast DNS to protect privacy when exposing ICE candidates
  - プライバシー保護のためにプライベートIPの代わりにmDNSの登録名を使う提案について
- [draft-ietf-rtcweb-security-12](./summary/draft-ietf-rtcweb-security-12.md)
  - Security Considerations for WebRTC
  - WebRTCにおけるセキュリティについて
- draft-ietf-rtcweb-security-arch-17
  - WebRTC Security Architecture

## Not yet maintained

<details>

---

## Simulcast / SVC

- draft-ietf-mmusic-sdp-simulcast-14
  - Using Simulcast in SDP and RTP Sessions
- draft-ietf-mmusic-rid-15
  - RTP Payload Format Restrictions
- draft-ietf-avtext-rid-09
  - RTP Stream Identifier Source Description (SDES)

## WebTransport

- draft-vvv-webtransport-overview-00
  - The WebTransport Protocol Framework
- draft-vvv-webtransport-http3-00
  - WebTransport over HTTP/3
- draft-vvv-webtransport-quic-00
  - WebTransport over QUIC

---

</details>
