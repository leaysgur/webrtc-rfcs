# webrtc-rfcs

WebRTC related RFCs that I have read through.

- See [`/markdown`](./markdown) for Markdown formatted RFC.
- See [`/summary`](./summary) for Japanese summary of each RFC.

## Specs

Linked means I've already read through.

### Overview: まずは全容を知ることから

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

### JavaScript API: ブラウザで実際に使えるAPI

- [draft-ietf-rtcweb-jsep-25](./summary/draft-ietf-rtcweb-jsep-25.md)
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
- [webrtc-ice](https://w3c.github.io/webrtc-ice/)
  - IceTransport Extensions for WebRTC
  - `RTCIceTransport`について
- [webrtc-quic](https://w3c.github.io/webrtc-quic/)
  - QUIC API for Peer-to-peer Connections
  - `RTCQuicTransport`について
- [webrtc-quic/cs](https://w3c.github.io/webrtc-quic/cs.html)
  - QUIC API for Client-to-Server Connections
  - `RTCQuicStream`について

### ICE: セッションを確立する通信経路を探す

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
- RFC6544
  - TCP Candidates with ICE
- [RFC5389](./summary/rfc5389.md)
  - Session Traversal Utilities for NAT
  - ICEの過程で使われるSTUNプロトコルについて
- [RFC7064](./summary/rfc7064.md)
  - STUN URI Scheme for the STUN Protocol
  - STUNサーバーをURIで表すための`stun`と`stuns`について
- draft-ietf-tram-turnbis-21
  - Traversal Using Relays around NAT (TURN): Relay Extensions to STUN

### SDP: どんなセッションを確立したいのか

- [draft-ietf-rtcweb-sdp-11](./summary/draft-ietf-rtcweb-sdp-11.md)
  - Annotated Example SDP for WebRTC
  - WebRTCで実際に使われるSDPのサンプルについて
- [RFC4566](./summary/rfc4556.md)
  - SDP: Session Description Protocol
  - WebRTC以前からあるSDPの基本について
- [RFC3264](./summary/rfc3264.md)
  - An Offer/Answer Model with the Session Description Protocol (SDP)
  - WebRTCのオファー・アンサーモデルでSDPをどう使うかについて
- [RFC5506](./summary/rfc5506.md)
  - Support for Reduced-Size RTCP: Opportunities and Consequences
  - Reduced-Size RTCPの使用を意味する`a=rtcp-rsize`行について
- [RFC5761](./summary/rfc5761.md)
  - Multiplexing RTP Data and Control Packets on a Single Port
  - RTPとRTCPを多重化するメディアレベルの`a=rtcp-mux`行について
- [draft-ietf-mmusic-mux-exclusive-12](./summary/draft-ietf-mmusic-mux-exclusive-12.md)
  - Indicating Exclusive Support of RTP/RTCP Multiplexing using SDP
  - RTPとRTCPの多重化を強制するメディアレベルの`a=rtcp-mux-only`行について
- RFC8122
  - Connection-Oriented Media Transport over the TLS Protocol in the SDP
- [draft-roach-mmusic-unified-plan-00](./summary/draft-roach-mmusic-unified-plan-00.md)
  - A Unified Plan for Using SDP with Large Numbers of Media Flows
  - 複数のメディアをSDPにどう記述するかを定めたUnifiedPlanの基本の考え方について
- [RFC5576](./summary/rfc5576.md)
  - Source-Specific Media Attributes in the SDP
  - RTPのSSRCとの関連を表すソースレベルの`a=ssrc`行について
- RFC5888
  - The Session Description Protocol (SDP) Grouping Framework
- draft-ietf-mmusic-sdp-bundle-negotiation-54
  - Negotiating Media Multiplexing Using the SDP
- [draft-ietf-mmusic-msid-17](./summary/draft-ietf-mmusic-msid-17.md)
  - WebRTC MediaStream Identification in the Session Description Protocol
  - SDPとMediaStream(Track)を紐付けるメディアレベルの`a=msid`行について
- RFC4588
  - RTP Retransmission Payload Format
- RFC5956
  - Forward Error Correction Grouping Semantics in the SDP
- draft-ietf-mmusic-rid-15
  - RTP Payload Format Restrictions

### セキュリティ関連
- [draft-ietf-rtcweb-ip-handling-11](./summary/draft-ietf-rtcweb-ip-handling-11.md)
  - WebRTC IP Address Handling Requirements
  - P2Pするために集めたIPアドレスの扱いについて
- [draft-ietf-rtcweb-mdns-ice-candidates-02](./summary/draft-ietf-rtcweb-mdns-ice-candidates-02.md)
  - Using Multicast DNS to protect privacy when exposing ICE candidates
  - プライバシー保護のためにプライベートIPの代わりにmDNSの登録名を使う提案について
- draft-ietf-rtcweb-security-10
  - Security Considerations for WebRTC
- draft-ietf-rtcweb-security-arch-17
  - WebRTC Security Architecture

<details>

---

> Not yet maintained

### DTLS: すべてのP2P通信の土台

- RFC6347
  - Datagram Transport Layer Security Version 1.2
- RFC5764
  - DTLS Extension to Establish Keys for the SRTP
- RFC7983
  - Multiplexing Scheme Updates for DTLS-SRTP

### MediaChannel: RTPとそのコーデック

- RFC3550
  - RTP: A Transport Protocol for Real-Time Applications
- RFC3711
  - The Secure Real-time Transport Protocol (SRTP)
- draft-ietf-rtcweb-rtp-usage-26
  - WebRTC Media Transport and Use of RTP
- RFC7742
  - WebRTC Video Processing and Codec Requirements
- RFC7874
  - WebRTC Audio Processing and Codec Requirements

### DataChannel: SCTPとそのラッパー

- draft-ietf-rtcweb-data-channel-13
  - WebRTC Data Channels
- draft-ietf-rtcweb-data-protocol-09
  - WebRTC Data Channel Establishment Protocol
- RFC4960
  - Stream Control Transmission Protocol

---

</details>
