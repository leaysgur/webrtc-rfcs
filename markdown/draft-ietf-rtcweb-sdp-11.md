> Read [original](https://tools.ietf.org/html/draft-ietf-rtcweb-sdp-11) / [summary](../summary/draft-ietf-rtcweb-sdp-11.md)

---

# Annotated Example SDP for WebRTC

## 1. Introduction

Javascript Session Establishment Protocol(JSEP) [I-D.ietf-rtcweb-jsep] specifies a generic protocol needed to generate [RFC3264] Offers and Answers negotiated between the [WebRTC] peers for setting up, updating and tearing down a WebRTC session. For this purpose, SDP is used to construct [RFC3264] Offers/Answers for describing (media and non-media) streams as appropriate for the recipients of the session description to participate in the session.

The remainder of this document is organized as follows: Sections 3 and 4 provides an overview of SDP and the Offer/Answer exchange mechanism.  Section 5 provides sample SDP generated for the most common WebRTC use-cases.

## 2. Terminology

The key words "MUST", "MUST NOT", "REQUIRED", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC2119].

Readers should be familiar with the terminology defined in [RFC3264] and in [RFC7656].

## 3. SDP and the WebRTC

The purpose of this section is to provide a general overview of SDP and its components.  For a more in-depth understanding, the readers are advised to refer to [RFC4566].

The Session Description Protocol (SDP) [RFC4566] describes multimedia sessions, which can contain audio, video, whiteboard, fax, modem, and other streams.  SDP provides a general purpose, standard representation to describe various aspects of multimedia session such as media capabilities, transport addresses and related metadata in a transport agnostic manner, for the purposes of session announcement, session invitation and parameter negotiation.

As of today SDP is widely used in the context of Session Initiation Protocol [RFC3261], Real-time Transport Protocol [RFC3550] and Real-time Streaming Protocol applications [RFC7826].

Below figure introduces high-level breakup of SDP into components that semantically describe a multimedia session, in our case, a WebRTC session [WebRTC].  It by no means captures everything about SDP and hence, should be used for informational purposes only.


```
                                                 +---------------------+
                                                 |        v=           |
                                                 +---------------------+
                 +---------------------+         +---------------------+
         ====    |   Session Metadata  |  =====  |        o=           |
         |       +---------------------+         +----------------------
         |                                       +---------------------+
         |                                       |        t=           |
         |                                       +---------------------+
         |
         |
         |                                       +---------------------+
         |                                       |        c=           |
         |                                       +---------------------+
         |       +---------------------+
         ====    | Network Description |   =====
         |       +---------------------+
         |                                       +---------------------+
         |                                       |    a=candidate      |
         |                                       +---------------------+
         |
         |
         |                                       +---------------------+
         |                                       |        m=           |
         |                                       +---------------------+
         |        +---------------------+        +---------------------+
         ====     | Stream Description  |  ===== |      a=rtpmap       |
         |        +---------------------+        +----------------------
         |                                       +---------------------+
         |                                       |      a=fmtp         |
         |                                       +---------------------+
         |                                       +---------------------+
         |                                       |      a=sendrecv..   |
         |                                       +---------------------+
 +---------------+
 |    SEMANTIC   |
 | COMPONENTS OF |
 |     SDP       |
 +---------------+
         |                                       +---------------------+
         |                                       |      a=crypto       |
         |                                       +---------------------+
         |         +---------------------+       +---------------------+
         ====      |Security Descriptions|  =====|      a=ice-frag     |
         |         +---------------------+       +----------------------
         |                                       +---------------------+
         |                                       |      a=ice-pwd      |
         |                                       +---------------------+
         |                                       +---------------------+
         |                                       |     a=fingerprint   |
         |                                       +---------------------+
         |
         |
         |
         |                                       +---------------------+
         |                                       |      a=rtcp-fb      |
         |                                       +---------------------+
         |         +---------------------+       +---------------------+
         ====      |   Qos,Grouping      |       |                     |
                   |   Descriptions      |  =====|       a=group       |
                   +---------------------+       +----------------------
                                                 +---------------------+
                                                 |       a=rtcpmux     |
                                                 +---------------------+





                   Figure 1: Semantic Components of SDP
```

[WebRTC] proposes JavaScript application to fully specify and control the signaling plane of a multimedia session as described in the JSEP specification [I-D.ietf-rtcweb-jsep].  JSEP provides mechanisms to create session characterization and media definition information to conduct the session based on SDP exchanges.

In this context, SDP serves two purposes:

1.  Provide grammatical structure syntactically.

2.  Semantically convey participant's intention and capabilities required to successfully negotiate a session.

## 4. Offer/Answer and the WebRTC

This section introduces SDP Offer/Answer Exchange mechanism mandated by WebRTC for negotiating session capabilities while setting up, updating and tearing down a WebRTC session.  This section is intentionally brief in nature and interested readers are recommended to refer [RFC3264] for specific details on the protocol operation.

The Offer/Answer [RFC3264] model specifies rule for the bilateral exchange of Session Description Protocol (SDP) messages for creation of multimedia streams.  It defines protocol with involved participants exchanging desired session characteristics from each others perspective constructed as SDP to negotiate the session between them.

In the most basic form,the protocol operation begins by one of the participants sending an initial SDP Offer describing its intent to start a multimedia communication session.  The participant receiving the offer MAY generate an SDP Answer accepting the offer or it MAY reject the offer.  If the session is accepted the Offer/Answer model guarantees a common view of the multimedia session between the participants.

At any time, either participant MAY generate a new SDP offer that updates the session in progress.

With in the context of WebRTC, the Offer/Answer model defines the state-machinery for WebRTC peers to negotiate session descriptions between them during the initial setup stages as well as for eventual session updates.  JSEP specification [I-D.ietf-rtcweb-jsep] for WebRTC provides the mechanism for generating [RFC3264] SDP Offers and Answers in order for both sides of the session to agree upon the details such as the list of media formats to be sent/received, bandwidth information, crypto parameters, transport parameters, for example.

## 5. WebRTC Session Description Examples

A typical web based real-time multimedia communication session can be characterized as below:

*  It has zero or more Audio only, Video only or Audio/Video RTP Sessions,

*  MAY contain zero or more non-media data sessions,

*  All the sessions are secured with DTLS-SRTP,

*  Supports NAT traversal using ICE mechanism,

*  Provides RTCP based feedback mechanisms,

*  Sessions can be over IPv4-only, IPv6-only, dual-stack based clients,

*  Supports BUNDLE based grouping of media streams over a single 5-tuple transport.

### 5.1. Some Conventions

The examples given in this document follow the conventions listed below:

*  In all the examples, Alice and Bob are assumed to be the WebRTC peers.

*  It is assumed that for most of the examples, the support for [I-D.ietf-mmusic-sdp-bundle-negotiation] is established apriori either out-of-band or as a consequence of successful Offer/Answer negotiation between Alice and Bob, unless explicitly stated otherwise.

*  Call-flow diagrams that accompany the use-cases capture only the prominent aspects of the system behavior and intentionally is not detailed to improve readability.

*  Eventhough the call-flow diagrams shows SDP being exchanged between the parties, it doesn't represent the only way an WebRTC setup is expected to work.  Other approaches may involve WebRTC applications to exchange the media setup information via non-SDP mechanisms as long as they confirm to the [I-D.ietf-rtcweb-jsep] API specification.

*  The SDP examples deviate from actual on-the-wire SDP notation in several ways.  This is done to facilitate readability and to conform to the restrictions imposed by the RFC formatting rules.

   *  Visual markers/Empty lines in any SDP example are inserted to make functional divisions in the SDP clearer, and are not actually part of the SDP syntax.

   *  Any SDP line that is indented (compared to the initial line in the SDP block) is a continuation of the preceding line.  The line break and indent are to be interpreted as a single space character.

   *  Excepting the above two conventions, line endings are to be interpreted as <CR><LF> pairs (that is, an ASCII 13 followed by an ASCII 10).

*  Against each SDP line, pointers to the appropriate RFCs are provided for further informational reference.  Also an attempt has been made to provide explanatory notes to enable better understanding of the SDP usage, wherever appropriate.

*  Following SDP details are common across all the use-cases defined in this document unless mentioned otherwise.

   *  DTLS fingerprint for SRTP (a=fingerprint)

   *  RTP/RTCP Multiplexing (a=rtcp-mux)

   *  RTCP Feedback support (a=rtcp-fb)

   *  Host and server-reflexive candidate lines (a=candidate)

   *  SRTP Setup framework parameters (a=setup)

   *  RTCP attribute (a=rtcp)

   *  RTP header extension indicating audio-levels from client to the mixer

For specific details, readers must refer to [I-D.ietf-rtcweb-jsep] specification.

*  The term "Session" is used rather loosely in this document to refer to either a "Communication Session" or a "RTP Session" or a "RTP Stream" depending on the context.

*  Payload type 109 is usually used for OPUS, 0 for PCMU, 8 for PCMA, 99 for H.264 and 120 for VP8 in most of the examples to maintain uniformity.

*  The IP Address:Port combinations '192.0.2.4:61665' (host) and '203.0.113.141:54609' (Server Reflexive) is typically used for Alice.

*  The IP Address:Port combinations '198.51.100.7:51556' (host) and '203.0.113.77:49203' (Server Reflexive) is typically used for Bob.

*  The IPv6 addresses 2001:DB8:8101:3a55:4858:a2a9:22ff:99b9 and 2001:DB8:30c:1266:5916:3779:22f6:77f7 are used to represent Alice and Bob host addresses respectively.

*  In the actual use the values that represent SSRCs, ICE candidate foundations, WebRTC Mediastream, MediaStreamTrack Ids values shall be much larger and/or random than the ones shown in the examples.

*  tls-id attribute values 89J2LRATQ3ULA24G9AHWVR31VJWSLB68 and UKA29UQLTF69OJW4WNPNUO2Y0GF1FJOZ are used for Alice.  The values CJ6FF9ZZMJW7MDRJIR7XVIQM48GE1G31 and 9AIFS8AQ009IXF5D6QQUJ7P8BXPEZJ8G are used for Bob.

*  identity attribute values are split across multiple lines to enhance readability, thus any line breaks and indentations in the value must be ignored.

*  SDP attributes in the examples closely follow the checklist defined in section Appendix A.1.

### 5.2. Basic Examples

#### 5.2.1. Audio Only Session

This common scenario shows SDP for secure two-way audio session with Alice offering Opus, PCMU, PCMA and Bob accepting all the offered audio codecs.

This example also shows the endpoints being [RFC8445] compliant by including "ice2" ice-options attribute.


```
           2-Way Audio Only Session

   Alice                                Bob
   |                                     |
   |                                     |
   |    Offer(Audio:Opus,PCMU,PCMA)      |
   |------------------------------------>|
   |                                     |
   |                                     |
   |   Answer(Audio:Opus,PCMU,PCMA)      |
   |<------------------------------------|
   |                                     |
   |                                     |
   |Two-way Opus Audio (preferred-codec) |
   |.....................................|
   |                                     |
   |                                     |
```


```
   +---------------------------------------------+---------------------+
   | Offer SDP Contents                          | RFC#/Notes          |
   +---------------------------------------------+---------------------+
   | v=0                                         | [RFC4566]           |
   | o=- 20518 0 IN IP4 0.0.0.0                  | [RFC4566] - Session |
   |                                             | Origin Information  |
   | s=-                                         | [RFC4566]           |
   | t=0 0                                       | [RFC4566]           |
   | a=group:BUNDLE audio                        | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=ice-options:trickle                       | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | a=ice-options:ice2                          | [RFC8445]           |
   | a=identity:eyJpZHAiOnsiZG9tYWluIjoibmlpZi5o | Section 5.6 of [I-D |
   | dSIsInByb3RvY29sIjoiaWRwLmh0bWwifSwiYXNzZXJ | .ietf-rtcweb-securi |
   | 0a W9uIjoiZXlKaGJHY2lPaUpTVXpJMU5pSXNJblI1Y | ty-arch]            |
   | 0NJNklrcFhVeUo5LmV5SmpiMjUwWlc1MGN5STZleUpt |                     |
   | YVc1b lpYSndjbWx1ZENJNlczc2lZV3huYjNKcGRHaH |                     |
   | RJam9pYzJoaExUSTFOaUlzSW1ScFoyVnpkQ0k2SWpre |                     |
   | k9rTXdPa kl6T2pKR09rRXlPakF3T2pBd09qQkVPalV |                     |
   | 4T2tGRE9rUXlPalUwT2pZMU9rWTBPak5DT2pkRU9qa3 |                     |
   | lPa1JET2pnN E9qTXpPalV4T2pJek9qUXdPamN5T2pr |                     |
   | eE9qZ3pPalZDT2pBeE9qSkdPalV3T2pjNE9qTkdJbjF |                     |
   | kZlN3aWFXUmxib lJwZEhraU9pSnRhWE5wUUc1cGFXW |                     |
   | XVhSFVpZlEuSTVQdGhKNFFDT05TOFVXd25OOUh3MEda |                     |
   | TDl3d0RBVGRrTWtFW llmdlNVTTJ6Umd5R09WSGgzRm |                     |
   | pnc2FPZklkRnFsNUx6azBFbndVOTNQOUlCQ0xZOWtia |                     |
   | 3V1c0V1S25YRGVNLTNIN WFmdTJvZl9CTlZjUnB3Mmd |                     |
   | BdlNBbVR6SlltcEpqMFEtdmV0TmtVT1huZE9HLUIzT3 |                     |
   | ZGb3QwZVNENlZSNUdhb2wyc GduS3FSTktOd3dacEZ1 |                     |
   | eUZZbFRodHJIdGNiT19WV3o4QnZpTThKS25OdExWd1J |                     |
   | xNUhMX2ZLTlRCNzFDYkoyWmh5W XU1UEdwWDhXcXJMW |                     |
   | C1ybm5YSFY3RnhoTTh5OHdrLWd5cnRZazVnbFlZeUFr |                     |
   | cTVqZklSXzRzWER5d19Qc1BWTW1aZ XltenVGV3BQTz |                     |
   | VFWlJYR0ZpRjFET0o4Q0Q3Z3Zta2dUdlBXSWpkemtBI |                     |
   | n0=                                         |                     |
   | ****** Audio m=line *********               | ******************* |
   |                                             | **********          |
   | m=audio 54609 UDP/TLS/RTP/SAVPF 109 0 8     | [RFC4566]           |
   | c=IN IP4 203.0.113.141                      | [RFC4566]           |
   | a=mid:audio                                 | [RFC5888]           |
   | a=msid:ma ta                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (ta)             |
   | a=sendrecv                                  | [RFC3264] - Alice   |
   |                                             | can send and recv   |
   |                                             | audio               |
   | a=rtpmap:109 opus/48000/2                   | [RFC7587] - Opus    |
   |                                             | Codec 48khz, 2      |
   |                                             | channels            |
   | a=rtpmap:0 PCMU/8000                        | [RFC3551] PCMU      |
   |                                             | Audio Codec         |
   | a=rtpmap:8 PCMA/8000                        | [RFC3551] PCMA      |
   |                                             | Audio Codec         |
   | a=maxptime:120                              | [RFC4566]           |
   | a=ice-ufrag:074c6550                        | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp] - ICE    |
   |                                             | user fragment       |
   | a=ice-pwd:a28a397a4c3f31747d1ee3474af08a068 | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp] - ICE    |
   |                                             | password            |
   | a=fingerprint:sha-256 19:E2:1C:3B:4B:9F:81: | [RFC8122] - DTLS    |
   | E6:B8:5C:F4:A5:A8:D8:73:04:BB:05:2F:70:9F:0 | Fingerprint for     |
   | 4:A9:0E:05:E9:26:33:E8:70:88:A2             | SRTP                |
   | a=setup:actpass                             | [RFC5763] - Alice   |
   |                                             | can act as DTLS     |
   |                                             | client or server    |
   | a=tls-id:89J2LRATQ3ULA24G9AHWVR31VJWSLB68   | [I-D.ietf-mmusic-dt |
   |                                             | ls-sdp]             |
   | a=rtcp-mux                                  | [RFC5761] - Alice   |
   |                                             | can perform         |
   |                                             | RTP/RTCP Muxing     |
   | a=rtcp:60065 IN IP4 203.0.113.141           | [RFC3605]           |
   | a=rtcp-rsize                                | [RFC5506] - Alice   |
   |                                             | intends to use      |
   |                                             | reduced size RTCP   |
   |                                             | for this session    |
   | a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc- | [RFC6464] Alice     |
   | audio-level                                 | supports RTP header |
   |                                             | extension to        |
   |                                             | indicate audio      |
   |                                             | levels              |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=candidate:0 1 UDP 2122194687 192.0.2.4    | [I-D.ietf-mmusic-ic |
   | 61665 typ host                              | e-sip-sdp] - RTP    |
   |                                             | Host Candidate      |
   | a=candidate:1 1 UDP 1685987071              | [I-D.ietf-mmusic-ic |
   | 203.0.113.141 54609 typ srflx raddr         | e-sip-sdp] - RTP    |
   | 192.0.2.4 rport 61665                       | Server Reflexive    |
   |                                             | ICE Candidate       |
   | a=candidate:0 2 UDP 2122194687 192.0.2.4    | [I-D.ietf-mmusic-ic |
   | 61667 typ host                              | e-sip-sdp] - RTCP   |
   |                                             | Host Candidate      |
   | a=candidate:1 2 UDP 1685987071              | [I-D.ietf-mmusic-ic |
   | 203.0.113.141 60065 typ srflx raddr         | e-sip-sdp] - RTCP   |
   | 192.0.2.4 rport 61667                       | Server Reflexive    |
   |                                             | ICE Candidate       |
   | a=end-of-candidates                         | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   +---------------------------------------------+---------------------+

                         Table 1: 5.2.1 SDP Offer
```


```
   +---------------------------------------------+---------------------+
   | Answer SDP Contents                         | RFC#/Notes          |
   +---------------------------------------------+---------------------+
   | v=0                                         | [RFC4566]           |
   | o=-  16833 0 IN IP4 0.0.0.0                 | [RFC4566] - Session |
   |                                             | Origin Information  |
   | s=-                                         | [RFC4566]           |
   | t=0 0                                       | [RFC4566]           |
   | a=group:BUNDLE audio                        | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=ice-options:trickle                       | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | a=ice-options:ice2                          | [RFC8445]           |
   | a=identity:ew0KICAiaWRwIjp7DQogICAgImRvbWFp | Section 5.6 of [I-D |
   | biI6ICJjaXNjb3NwYXJrLmNvbSIsDQogICAg InByb3 | .ietf-rtcweb-securi |
   | RvY29sIjogImRlZmF1bHQiDQogIH0sDQogICJhc3Nlc | ty-arch]            |
   | nRpb24iOiAibEp3WkVocmFVOXBTblJo V0U1d1VVYzF |                     |
   | jR0ZYV1hWaFNGVnBabEV1U1RWUWRHaEtORkZEVDA1VE |                     |
   | 9GVlhkMjVPT1VoM01FZGFURGwz ZDBSQlZHUnJUV3RG |                     |
   | Vw0KICAgICAgICAgICAgICBsbG1kbE5WVFRKNlVtZDV |                     |
   | SMDlXU0dnelJtcG5jMkZQ Wmtsa1JuRnNOVXg2YXpCR |                     |
   | mJuZFZPVE5RT1VsQ1EweFpPV3RpYTNWMWMwVjFTMjVZ |                     |
   | UkdWTkxUTklODQog ICAgICAgICAgICAgIFdGbWRUSn |                     |
   | ZabDlDVGxaalVuQjNNbWRCZGxOQmJWUjZTbGx0Y0Vwc |                     |
   | U1GRXRkbVYw VG10VlQxaHVaRTlITFVJelQzWkdiM1F |                     |
   | 3WlZORU5sWlNOVWRoYjJ3eWMNCiAgICAgICAgICAgIC |                     |
   | AgR2R1 UzNGU1RrdE9kM2RhY0VaMWVVWlpiRlJvZEhK |                     |
   | SWRHTmlUMTlXVjNvNFFuWnBUVGhLUzI1T2RFeFdkMUp |                     |
   | 4 TlVoTVgyWkxUbFJDTnpGRFlrb3lXbWg1VyINCn0=  |                     |
   | ****** Audio m=line *********               | ******************* |
   |                                             | **********          |
   | m=audio 49203 UDP/TLS/RTP/SAVPF 109 0 8     | [RFC4566]           |
   | c=IN IP4 203.0.113.77                       | [RFC4566]           |
   | a=mid:audio                                 | [RFC5888]           |
   | a=msid:ma ta                                | [I-D.ietf-mmusic-ms |
   |                                             | id] Identifies      |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (ta)             |
   | a=sendrecv                                  | [RFC3264] - Bob can |
   |                                             | send and recv audio |
   | a=rtpmap:109 opus/48000/2                   | [RFC7587] Opus      |
   |                                             | Codec               |
   | a=rtpmap:0 PCMU/8000                        | [RFC3551] PCMU      |
   |                                             | Audio Codec         |
   | a=rtpmap:8 PCMA/8000                        | [RFC3551] PCMA      |
   |                                             | Audio Codec         |
   | a=maxptime:120                              | [RFC4566]           |
   | a=ice-ufrag:05067423                        | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp] - ICE    |
   |                                             | user fragment       |
   | a=ice-pwd:1747d1ee3474a28a397a4c3f3af08a068 | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp] - ICE    |
   |                                             | password parameter  |
   | a=fingerprint:sha-256 6B:8B:F0:65:5F:78:E2: | [RFC8122] - DTLS    |
   | 51:3B:AC:6F:F3:3F:46:1B:35:DC:B8:5F:64:1A:2 | Fingerprint for     |
   | 4:C2:43:F0:A1:58:D0:A1:2C:19:08             | SRTP                |
   | a=setup:active                              | [RFC5763] - Bob is  |
   |                                             | the DTLS client     |
   | a=tls-id:CJ6FF9ZZMJW7MDRJIR7XVIQM48GE1G31   | [I-D.ietf-mmusic-dt |
   |                                             | ls-sdp]             |
   | a=rtcp-mux                                  | [RFC5761] - Bob can |
   |                                             | perform RTP/RTCP    |
   |                                             | Muxing on port      |
   |                                             | 49203               |
   | a=rtcp-rsize                                | [RFC5506] - Bob     |
   |                                             | intends to use      |
   |                                             | reduced size RTCP   |
   |                                             | for this session    |
   | a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc- | [RFC6464] Bob       |
   | audio-level                                 | supports audio      |
   |                                             | level RTP header    |
   |                                             | extension as well   |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=candidate:0 1 UDP 2122194687 198.51.100.7 | [I-D.ietf-mmusic-ic |
   | 51556 typ host                              | e-sip-sdp] -        |
   |                                             | RTP/RTCP Host ICE   |
   |                                             | Candidate           |
   | a=candidate:1 1 UDP 1685987071 203.0.113.77 | [I-D.ietf-mmusic-ic |
   | 49203 typ srflx raddr 198.51.100.7 rport    | e-sip-sdp] -        |
   | 51556                                       | RTP/RTCP Server     |
   |                                             | Reflexive ICE       |
   |                                             | Candidate           |
   | a=end-of-candidates                         | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   +---------------------------------------------+---------------------+

                         Table 2: 5.2.1 SDP Answer
```

#### 5.2.2. Audio/Video Session

Alice and Bob establish a two-way audio and video session with Opus as the audio codec and H.264 as the video codec.


```
            2-Way Audio,Video Session

   Alice                                       Bob
   |                                            |
   |                                            |
   |Offer(Audio:Opus,PCMU,PCMA Video:H.264,VP8) |
   |------------------------------------------->|
   |                                            |
   |                                            |
   |      Answer(Audio:Opus,Video:H.264)        |
   |<-------------------------------------------|
   |                                            |
   |                                            |
   |     Two-way Opus Audio, H.264 Video        |
   |............................................|
   |                                            |
```



##### 5.2.2.1. IPv4 audio/video session

This section shows the IPv4 only Offer/Answer exchange.


```
   +---------------------------------------------+---------------------+
   | Offer SDP Contents                          | RFC#/Notes          |
   +---------------------------------------------+---------------------+
   | v=0                                         | [RFC4566]           |
   | o=- 20518 0 IN IP4 0.0.0.0                  | [RFC4566] - Session |
   |                                             | Origin Information  |
   | s=-                                         | [RFC4566]           |
   | t=0 0                                       | [RFC4566]           |
   | a=group:BUNDLE audio video                  | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=group:LS audio video                      | [RFC5888] - Alice   |
   |                                             | wants to lip sync   |
   |                                             | her audio and video |
   |                                             | sreams              |
   | a=ice-options:trickle                       | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Audio m=line *********               | ******************* |
   |                                             | **********          |
   | m=audio 54609 UDP/TLS/RTP/SAVPF 109 0 8     | [RFC4566]           |
   | c=IN IP4 203.0.113.141                      | [RFC4566]           |
   | a=mid:audio                                 | [RFC5888]           |
   | a=msid:ma ta                                | [I-D.ietf-mmusic-ms |
   |                                             | id] Identifies      |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (ta)             |
   | a=sendrecv                                  | [RFC3264] - Alice   |
   |                                             | can send and recv   |
   |                                             | audio               |
   | a=rtpmap:109 opus/48000/2                   | [RFC7587] - Opus    |
   |                                             | Codec 48khz, 2      |
   |                                             | channels            |
   | a=rtpmap:0 PCMU/8000                        | [RFC3551] PCMU      |
   |                                             | Audio Codec         |
   | a=rtpmap:8 PCMA/8000                        | [RFC3551] PCMA      |
   |                                             | Audio Codec         |
   | a=maxptime:120                              | [RFC4566]           |
   | a=ice-ufrag:074c6550                        | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp] - ICE    |
   |                                             | user fragment       |
   | a=ice-pwd:a28a397a4c3f31747d1ee3474af08a068 | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp] - ICE    |
   |                                             | password parameter  |
   | a=fingerprint:sha-256 19:E2:1C:3B:4B:9F:81: | [RFC8122] - DTLS    |
   | E6:B8:5C:F4:A5:A8:D8:73:04:BB:05:2F:70:9F:0 | Fingerprint for     |
   | 4:A9:0E:05:E9:26:33:E8:70:88:A2             | SRTP                |
   | a=setup:actpass                             | [RFC5763] - Alice   |
   |                                             | can act as DTLS     |
   |                                             | client or server    |
   | a=tls-id:89J2LRATQ3ULA24G9AHWVR31VJWSLB68   | [I-D.ietf-mmusic-dt |
   |                                             | ls-sdp]             |
   | a=rtcp-mux                                  | [RFC5761] - Alice   |
   |                                             | can perform         |
   |                                             | RTP/RTCP Muxing     |
   | a=rtcp-mux-only                             | [I-D.ietf-mmusic-mu |
   |                                             | x-exclusive]        |
   | a=rtcp-rsize                                | [RFC5506] - Alice   |
   |                                             | intends to use      |
   |                                             | reduced size RTCP   |
   |                                             | for this session    |
   | a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc- | [RFC6464]           |
   | audio-level                                 |                     |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=candidate:0 1 UDP 2122194687 192.0.2.4    | [I-D.ietf-mmusic-ic |
   | 61665 typ host                              | e-sip-sdp] -        |
   |                                             | RTP/RTCP Host       |
   |                                             | Candidate           |
   | a=candidate:1 1 UDP 1685987071              | [I-D.ietf-mmusic-ic |
   | 203.0.113.141 54609 typ srflx raddr         | e-sip-sdp] -        |
   | 192.0.2.4 rport 61665                       | RTP/RTCP Server     |
   |                                             | Reflexive ICE       |
   |                                             | Candidate           |
   | a=end-of-candidates                         | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Video m=line *********               | ******************* |
   |                                             | **********          |
   | m=video 0 UDP/TLS/RTP/SAVPF 99 120          | [RFC4566]           |
   | c=IN IP4 203.0.113.141                      | [RFC4566]           |
   | a=bundle-only                               | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=mid:video                                 | [RFC5888]           |
   | a=msid:ma tb                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (tb)             |
   | a=sendrecv                                  | [RFC3264] - Alice   |
   |                                             | can send and recv   |
   |                                             | video               |
   | a=rtpmap:99 H264/90000                      | [RFC6184] - H.264   |
   |                                             | Video Codec         |
   | a=fmtp:99 profile-level-                    | [RFC6184]           |
   | id=4d0028;packetization-mode=1              |                     |
   | a=rtpmap:120 VP8/90000                      | [RFC7741] - VP8     |
   |                                             | video codec         |
   | a=rtcp-fb:99 nack                           | [RFC4585] -         |
   |                                             | Indicates NACK RTCP |
   |                                             | feedback support    |
   | a=rtcp-fb:99 nack pli                       | [RFC4585] -         |
   |                                             | Indicates support   |
   |                                             | for Picture loss    |
   |                                             | Indication and NACK |
   | a=rtcp-fb:99 ccm fir                        | [RFC5104] - Full    |
   |                                             | Intra Frame         |
   |                                             | Request-Codec       |
   |                                             | Control Message     |
   |                                             | support             |
   | a=rtcp-fb:120 nack                          | [RFC4585] -         |
   |                                             | Indicates NACK RTCP |
   |                                             | feedback support    |
   | a=rtcp-fb:120 nack pli                      | [RFC4585] -         |
   |                                             | Indicates support   |
   |                                             | for Picture loss    |
   |                                             | Indication and NACK |
   | a=rtcp-fb:120 ccm fir                       | [RFC5104] - Full    |
   |                                             | Intra Frame         |
   |                                             | Request-Codec       |
   |                                             | Control Message     |
   |                                             | support             |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   +---------------------------------------------+---------------------+

                        Table 3: 5.2.2.1 SDP Offer
```
```
   +---------------------------------------------+---------------------+
   | Answer SDP Contents                         | RFC#/Notes          |
   +---------------------------------------------+---------------------+
   | v=0                                         | [RFC4566]           |
   | o=-  16833 0 IN IP4 0.0.0.0                 | [RFC4566] - Session |
   |                                             | Origin Information  |
   | s=-                                         | [RFC4566]           |
   | t=0 0                                       | [RFC4566]           |
   | a=group:BUNDLE audio video                  | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=group:LS audio video                      | [RFC5888] - Bob     |
   |                                             | agrees to do the    |
   |                                             | same                |
   | a=ice-options:trickle                       | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Audio m=line *********               | ******************* |
   |                                             | **********          |
   | m=audio 49203 UDP/TLS/RTP/SAVPF 109         | [RFC4566]           |
   | c=IN IP4 203.0.113.77                       | [RFC4566]           |
   | a=mid:audio                                 | [RFC5888]           |
   | a=msid:ma ta                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (ta)             |
   | a=sendrecv                                  | [RFC3264] - Bob can |
   |                                             | send and recv audio |
   | a=rtpmap:109 opus/48000/2                   | [RFC7587] - Bob     |
   |                                             | accepts only Opus   |
   |                                             | Codec               |
   | a=maxptime:120                              | [RFC4566]           |
   | a=ice-ufrag:c300d85b                        | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp] -  ICE   |
   |                                             | username frag       |
   | a=ice-pwd:de4e99bd291c325921d5d47efbabd9a2  | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp] - ICE    |
   |                                             | password            |
   | a=fingerprint:sha-256 6B:8B:F0:65:5F:78:E2: | [RFC8122] - DTLS    |
   | 51:3B:AC:6F:F3:3F:46:1B:35:DC:B8:5F:64:1A:2 | Fingerprint for     |
   | 4:C2:43:F0:A1:58:D0:A1:2C:19:08             | SRTP                |
   | a=setup:active                              | [RFC5763] - Bob is  |
   |                                             | the DTLS client     |
   | a=tls-id:CJ6FF9ZZMJW7MDRJIR7XVIQM48GE1G31   | [I-D.ietf-mmusic-dt |
   |                                             | ls-sdp]             |
   | a=rtcp-mux                                  | [RFC5761] - Bob can |
   |                                             | perform RTP/RTCP    |
   |                                             | Muxing              |
   | a=rtcp-mux-only                             | [I-D.ietf-mmusic-mu |
   |                                             | x-exclusive]        |
   | a=rtcp-rsize                                | [RFC5506] - Bob     |
   |                                             | intends to use      |
   |                                             | reduced size RTCP   |
   |                                             | for this session    |
   | a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc- | [RFC6464]           |
   | audio-level                                 |                     |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=candidate:0 1 UDP 3618095783 198.51.100.7 | [I-D.ietf-mmusic-ic |
   | 49203 typ host                              | e-sip-sdp] -        |
   |                                             | RTP/RTCP Host ICE   |
   |                                             | Candidate           |
   | a=candidate:1 1 UDP 565689203 203.0.113.77  | [I-D.ietf-mmusic-ic |
   | 49203 typ srflx raddr 198.51.100.7 rport    | e-sip-sdp] -        |
   | 51556                                       | RTP/RTCP Server     |
   |                                             | Reflexive ICE       |
   |                                             | Candidate           |
   | a=end-of-candidates                         | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Video m=line *********               | ******************* |
   |                                             | **********          |
   | m=video 0 UDP/TLS/RTP/SAVPF 99              | [RFC4566]           |
   | c=IN IP4 203.0.113.77                       | [RFC4566]           |
   | a=bundle-only                               | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=mid:video                                 | [RFC5888]           |
   | a=msid:ma tb                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (tb)             |
   | a=sendrecv                                  | [RFC3264] - Bob can |
   |                                             | send and recv video |
   | a=rtpmap:99 H264/90000                      | [RFC6184] - Bob     |
   |                                             | accepts H.264 Video |
   |                                             | Codec.              |
   | a=fmtp:99 profile-level-                    | [RFC6184]           |
   | id=4d0028;packetization-mode=1              |                     |
   | a=rtcp-fb:99 nack                           | [RFC4585] -         |
   |                                             | Indicates support   |
   |                                             | for NACK based RTCP |
   |                                             | feedback            |
   | a=rtcp-fb:99 nack pli                       | [RFC4585] -         |
   |                                             | Indicates support   |
   |                                             | for Picture loss    |
   |                                             | Indication and NACK |
   | a=rtcp-fb:99 ccm fir                        | [RFC5104] - Full    |
   |                                             | Intra Frame         |
   |                                             | Request- Codec      |
   |                                             | Control Message     |
   |                                             | support             |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   +---------------------------------------------+---------------------+

                        Table 4: 5.2.2.1 SDP Answer
```

##### 5.2.2.2. Dual Stack audio/video session

This section captures offer/answer exchange when Alice and Bob support both IPv4 and IPv6 host addresses.


```
   +---------------------------------------------+---------------------+
   | Offer SDP Contents                          | RFC#/Notes          |
   +---------------------------------------------+---------------------+
   | v=0                                         | [RFC4566]           |
   | o=- 20518 0 IN IP4 0.0.0.0                  | [RFC4566] - Session |
   |                                             | Origin Information  |
   | s=-                                         | [RFC4566]           |
   | t=0 0                                       | [RFC4566]           |
   | a=group:BUNDLE audio video                  | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=group:LS audio video                      | [RFC5888] - Alice   |
   |                                             | wants to lip sync   |
   |                                             | her audio and video |
   |                                             | sreams              |
   | a=ice-options:trickle                       | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Audio m=line *********               | ******************* |
   |                                             | **********          |
   | m=audio 54609 UDP/TLS/RTP/SAVPF 109 0 8     | [RFC4566]           |
   | c=IN IP4 203.0.113.141                      | [RFC4566]           |
   | a=mid:audio                                 | [RFC5888]           |
   | a=msid:ma ta                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (ta)             |
   | a=sendrecv                                  | [RFC3264] - Alice   |
   |                                             | can send and recv   |
   |                                             | audio               |
   | a=rtpmap:109 opus/48000/2                   | [RFC7587] - Opus    |
   |                                             | Codec 48khz, 2      |
   |                                             | channels            |
   | a=rtpmap:0 PCMU/8000                        | [RFC3551] PCMU      |
   |                                             | Audio Codec         |
   | a=rtpmap:8 PCMA/8000                        | [RFC3551] PCMA      |
   |                                             | Audio Codec         |
   | a=maxptime:120                              | [RFC4566]           |
   | a=ice-ufrag:074c6550                        | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp] - ICE    |
   |                                             | user fragment       |
   | a=ice-pwd:a28a397a4c3f31747d1ee3474af08a068 | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp] - ICE    |
   |                                             | password parameter  |
   | a=fingerprint:sha-256 19:E2:1C:3B:4B:9F:81: | [RFC8122] - DTLS    |
   | E6:B8:5C:F4:A5:A8:D8:73:04:BB:05:2F:70:9F:0 | Fingerprint for     |
   | 4:A9:0E:05:E9:26:33:E8:70:88:A2             | SRTP                |
   | a=setup:actpass                             | [RFC5763] - Alice   |
   |                                             | can act as DTLS     |
   |                                             | client or server    |
   | a=tls-id:89J2LRATQ3ULA24G9AHWVR31VJWSLB68   | [I-D.ietf-mmusic-dt |
   |                                             | ls-sdp]             |
   | a=rtcp-mux                                  | [RFC5761] - Alice   |
   |                                             | can perform         |
   |                                             | RTP/RTCP Muxing     |
   | a=rtcp-mux-only                             | [I-D.ietf-mmusic-mu |
   |                                             | x-exclusive]        |
   | a=rtcp-rsize                                | [RFC5506] - Alice   |
   |                                             | intends to use      |
   |                                             | reduced size RTCP   |
   |                                             | for this session    |
   | a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc- | [RFC6464]           |
   | audio-level                                 |                     |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=candidate:0 1 UDP 2122194687 192.0.2.4    | [I-D.ietf-mmusic-ic |
   | 61665 typ host                              | e-sip-sdp] -        |
   |                                             | RTP/RTCP Host       |
   |                                             | Candidate           |
   | a=candidate:0 1 UDP 2122194687              | [I-D.ietf-mmusic-ic |
   | 2001:DB8:8101:3a55:4858:a2a9:22ff:99b9      | e-sip-sdp] -        |
   | 61665 typ host                              | RTP/RTCP IPv6 Host  |
   |                                             | Candidate           |
   | a=end-of-candidates                         | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Video m=line *********               | ******************* |
   |                                             | **********          |
   | m=video 0 UDP/TLS/RTP/SAVPF 99 120          | [RFC4566]           |
   | c=IN IP4 203.0.113.141                      | [RFC4566]           |
   | a=bundle-only                               | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=mid:video                                 | [RFC5888]           |
   | a=msid:ma tb                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (tb)             |
   | a=sendrecv                                  | [RFC3264] - Alice   |
   |                                             | can send and recv   |
   |                                             | video               |
   | a=rtpmap:99 H264/90000                      | [RFC6184] - H.264   |
   |                                             | Video Codec         |
   | a=fmtp:99 profile-level-                    | [RFC6184]           |
   | id=4d0028;packetization-mode=1              |                     |
   | a=rtpmap:120 VP8/90000                      | [RFC7741] - VP8     |
   |                                             | video codec         |
   | a=rtcp-fb:99 nack                           | [RFC4585] -         |
   |                                             | Indicates NACK RTCP |
   |                                             | feedback support    |
   | a=rtcp-fb:99 nack pli                       | [RFC4585] -         |
   |                                             | Indicates support   |
   |                                             | for Picture loss    |
   |                                             | Indication and NACK |
   | a=rtcp-fb:99 ccm fir                        | [RFC5104] - Full    |
   |                                             | Intra Frame         |
   |                                             | Request-Codec       |
   |                                             | Control Message     |
   |                                             | support             |
   | a=rtcp-fb:120 nack                          | [RFC4585] -         |
   |                                             | Indicates NACK RTCP |
   |                                             | feedback support    |
   | a=rtcp-fb:120 nack pli                      | [RFC4585] -         |
   |                                             | Indicates support   |
   |                                             | for Picture loss    |
   |                                             | Indication and NACK |
   | a=rtcp-fb:120 ccm fir                       | [RFC5104] - Full    |
   |                                             | Intra Frame         |
   |                                             | Request-Codec       |
   |                                             | Control Message     |
   |                                             | support             |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   +---------------------------------------------+---------------------+

                        Table 5: 5.2.2.2 SDP Offer
```
```
   +---------------------------------------------+---------------------+
   | Answer SDP Contents                         | RFC#/Notes          |
   +---------------------------------------------+---------------------+
   | v=0                                         | [RFC4566]           |
   | o=-  16833 0 IN IP4 0.0.0.0                 | [RFC4566] - Session |
   |                                             | Origin Information  |
   | s=-                                         | [RFC4566]           |
   | t=0 0                                       | [RFC4566]           |
   | a=group:BUNDLE audio video                  | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=group:LS audio video                      | [RFC5888] - Bob     |
   |                                             | agrees to do the    |
   |                                             | same                |
   | a=ice-options:trickle                       | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Audio m=line *********               | ******************* |
   |                                             | **********          |
   | m=audio 49203 UDP/TLS/RTP/SAVPF 109         | [RFC4566]           |
   | c=IN IP4 203.0.113.77                       | [RFC4566]           |
   | a=mid:audio                                 | [RFC5888]           |
   | a=msid:ma ta                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (ta)             |
   | a=sendrecv                                  | [RFC3264] - Bob can |
   |                                             | send and recv audio |
   | a=rtpmap:109 opus/48000/2                   | [RFC7587] - Bob     |
   |                                             | accepts only Opus   |
   |                                             | Codec               |
   | a=maxptime:120                              | [RFC4566]           |
   | a=ice-ufrag:c300d85b                        | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp] -  ICE   |
   |                                             | username frag       |
   | a=ice-pwd:de4e99bd291c325921d5d47efbabd9a2  | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp] - ICE    |
   |                                             | password            |
   | a=fingerprint:sha-256 6B:8B:F0:65:5F:78:E2: | [RFC8122] - DTLS    |
   | 51:3B:AC:6F:F3:3F:46:1B:35:DC:B8:5F:64:1A:2 | Fingerprint for     |
   | 4:C2:43:F0:A1:58:D0:A1:2C:19:08             | SRTP                |
   | a=setup:active                              | [RFC5763] - Bob is  |
   |                                             | the DTLS client     |
   | a=tls-id:CJ6FF9ZZMJW7MDRJIR7XVIQM48GE1G31   | [I-D.ietf-mmusic-dt |
   |                                             | ls-sdp]             |
   | a=rtcp-mux                                  | [RFC5761] - Bob can |
   |                                             | perform RTP/RTCP    |
   |                                             | Muxing              |
   | a=rtcp-mux-only                             | [I-D.ietf-mmusic-mu |
   |                                             | x-exclusive]        |
   | a=rtcp-rsize                                | [RFC5506] - Bob     |
   |                                             | intends to use      |
   |                                             | reduced size RTCP   |
   |                                             | for this session    |
   | a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc- | [RFC6464]           |
   | audio-level                                 |                     |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=candidate:0 1 UDP 3618095783 198.51.100.7 | [I-D.ietf-mmusic-ic |
   | 49203 typ host                              | e-sip-sdp] -        |
   |                                             | RTP/RTCP Host ICE   |
   |                                             | Candidate           |
   | a=candidate:0 1 UDP 3618095783              | [I-D.ietf-mmusic-ic |
   | 2001:DB8:30c:1266:5916:3779:22f6:77f7 49203 | e-sip-sdp] -        |
   | typ host                                    | RTP/RTCP IPv6 Host  |
   |                                             | ICE Candidate       |
   | a=end-of-candidates                         | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Video m=line *********               | ******************* |
   |                                             | **********          |
   | m=video 0 UDP/TLS/RTP/SAVPF 99              | [RFC4566]           |
   | c=IN IP4 203.0.113.77                       | [RFC4566]           |
   | a=bundle-only                               | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=mid:video                                 | [RFC5888]           |
   | a=msid:ma tb                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (tb)             |
   | a=sendrecv                                  | [RFC3264] - Bob can |
   |                                             | send and recv video |
   | a=rtpmap:99 H264/90000                      | [RFC6184] - Bob     |
   |                                             | accepts H.264 Video |
   |                                             | Codec.              |
   | a=fmtp:99 profile-level-                    | [RFC6184]           |
   | id=4d0028;packetization-mode=1              |                     |
   | a=rtcp-fb:99 nack                           | [RFC4585] -         |
   |                                             | Indicates support   |
   |                                             | for NACK based RTCP |
   |                                             | feedback            |
   | a=rtcp-fb:99 nack pli                       | [RFC4585] -         |
   |                                             | Indicates support   |
   |                                             | for Picture loss    |
   |                                             | Indication and NACK |
   | a=rtcp-fb:99 ccm fir                        | [RFC5104] - Full    |
   |                                             | Intra Frame         |
   |                                             | Request- Codec      |
   |                                             | Control Message     |
   |                                             | support             |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   +---------------------------------------------+---------------------+

                        Table 6: 5.2.2.2 SDP Answer
```

#### 5.2.3. Data Only Session

This scenario illustrates the SDP negotiated to setup a data-only session based on the SCTP Data Channel, thus enabling use-cases such as file-transfer, real-time game control for example.


```
         2-Way DataChannel Session

   Alice                            Bob
   |                                 |
   |                                 |
   |                                 |
   |      Offer(DataChannel)         |
   |-------------------------------->|
   |                                 |
   |                                 |
   |      Answer(DataChannel)        |
   |<--------------------------------|
   |                                 |
   |                                 |
   | Two-way SCTP based DataChannel  |
   |.................................|
   |                                 |
   |                                 |
```


```
   +---------------------------------------------+---------------------+
   | Offer SDP Contents                          | RFC#/Notes          |
   +---------------------------------------------+---------------------+
   | v=0                                         | [RFC4566]           |
   | o=- 20518 0 IN IP4 0.0.0.0                  | [RFC4566] - Session |
   |                                             | Origin Information  |
   | s=-                                         | [RFC4566]           |
   | t=0 0                                       | [RFC4566]           |
   | a=group:BUNDLE data                         | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=ice-options:trickle                       | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Application m=line *********         | ******************* |
   |                                             | **********          |
   | m=application 54609 UDP/DTLS/SCTP webrtc-   | [I-D.ietf-rtcweb-da |
   | datachannel                                 | ta-channel]         |
   | c=IN IP4 203.0.113.141                      | [RFC4566]           |
   | a=mid:data                                  | [RFC5888]           |
   | a=sendrecv                                  | [RFC3264] - Alice   |
   |                                             | can send and recv   |
   |                                             | non-media data      |
   | a=sctp-port:5000                            | [I-D.ietf-mmusic-sc |
   |                                             | tp-sdp]             |
   | a=max-message-size:100000                   | [I-D.ietf-mmusic-sc |
   |                                             | tp-sdp]             |
   | a=setup:actpass                             | [RFC5763] - Alice   |
   |                                             | can act as DTLS     |
   |                                             | client or server    |
   | a=tls-id:89J2LRATQ3ULA24G9AHWVR31VJWSLB68   | [I-D.ietf-mmusic-dt |
   |                                             | ls-sdp]             |
   | a=ice-ufrag:074c6550                        | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp] -        |
   |                                             | Session Level ICE   |
   |                                             | parameter           |
   | a=ice-pwd:a28a397a4c3f31747d1ee3474af08a068 | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp] -        |
   |                                             | Session Level ICE   |
   |                                             | parameter           |
   | a=fingerprint:sha-256 19:E2:1C:3B:4B:9F:81: | [RFC8122] - Session |
   | E6:B8:5C:F4:A5:A8:D8:73:04:BB:05:2F:70:9F:0 | DTLS Fingerprint    |
   | 4:A9:0E:05:E9:26:33:E8:70:88:A2             | for SRTP            |
   | a=candidate:0 1 UDP 2113667327 192.0.2.4    | [I-D.ietf-mmusic-ic |
   | 61665 typ host                              | e-sip-sdp]          |
   | a=candidate:1 1 UDP 1694302207              | [I-D.ietf-mmusic-ic |
   | 203.0.113.141 54609 typ srflx raddr         | e-sip-sdp]          |
   | 192.0.2.4 rport 61665                       |                     |
   | a=end-of-candidates                         | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   +---------------------------------------------+---------------------+

                         Table 7: 5.2.3 SDP Offer
```


```
   +---------------------------------------------+---------------------+
   | Answer SDP Contents                         | RFC#/Notes          |
   +---------------------------------------------+---------------------+
   | v=0                                         | [RFC4566]           |
   | o=-  16833 0 IN IP4 0.0.0.0                 | [RFC4566] - Session |
   |                                             | Origin Information  |
   | s=-                                         | [RFC4566]           |
   | t=0 0                                       | [RFC4566]           |
   | a=group:BUNDLE data                         | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | ****** Application m=line *********         | ******************* |
   |                                             | **********          |
   | m=application 49203 UDP/DTLS/SCTP webrtc-   | [I-D.ietf-mmusic-sc |
   | datachannel                                 | tp-sdp]             |
   | c=IN IP4 203.0.113.77                       | [RFC4566]           |
   | a=mid:data                                  | [RFC5888]           |
   | a=sendrecv                                  | [RFC3264] - Bob can |
   |                                             | send and recv non-  |
   |                                             | media data          |
   | a=sctp-port:5000                            | [I-D.ietf-mmusic-sc |
   |                                             | tp-sdp]             |
   | a=max-message-size:100000                   | [I-D.ietf-mmusic-sc |
   |                                             | tp-sdp]             |
   | a=setup:active                              | [RFC5763] - Bob is  |
   |                                             | the DTLS client     |
   | a=tls-id:CJ6FF9ZZMJW7MDRJIR7XVIQM48GE1G31   | [I-D.ietf-mmusic-dt |
   |                                             | ls-sdp]             |
   | a=ice-ufrag:c300d85b                        | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp] -        |
   |                                             | Session Level ICE   |
   |                                             | username frag       |
   | a=ice-pwd:de4e99bd291c325921d5d47efbabd9a2  | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp] -        |
   |                                             | Session Level ICE   |
   |                                             | password            |
   | a=fingerprint:sha-256 6B:8B:F0:65:5F:78:E2: | [RFC8122] - Session |
   | 51:3B:AC:6F:F3:3F:46:1B:35:DC:B8:5F:64:1A:2 | DTLS Fingerprint    |
   | 4:C2:43:F0:A1:58:D0:A1:2C:19:08             | for SRTP            |
   | a=candidate:0 1 UDP 2113667327 198.51.100.7 | [I-D.ietf-mmusic-ic |
   | 51556 typ host                              | e-sip-sdp]          |
   | a=candidate:1 1 UDP 1694302207 203.0.113.77 | [I-D.ietf-mmusic-ic |
   | 49203 typ srflx raddr 198.51.100.7 rport    | e-sip-sdp]          |
   | 51556                                       |                     |
   | a=end-of-candidates                         | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   +---------------------------------------------+---------------------+

                         Table 8: 5.2.3 SDP Answer
```

#### 5.2.4. Audio Call On Hold

Alice calls Bob, but when Bob answers he places Alice on hold by setting the SDP direction attribute to a=inactive in the Answer.


```
              Audio On Hold

   Alice                            Bob
   |                                 |
   |                                 |
   |      Offer(Audio:Opus)          |
   |-------------------------------->|
   |                                 |
   |                                 |
   |  Answer(Audio:Opus,a=inactive)  |
   |<--------------------------------|
   |                                 |
   |                                 |
   |      One-way Opus Audio         |
   |.................................|
   |                                 |
```


```
   +---------------------------------------------+---------------------+
   | Offer SDP Contents                          | RFC#/Notes          |
   +---------------------------------------------+---------------------+
   | v=0                                         | [RFC4566]           |
   | o=- 20518 0 IN IP4 0.0.0.0                  | [RFC4566] - Session |
   |                                             | Origin Information  |
   | s=-                                         | [RFC4566]           |
   | t=0 0                                       | [RFC4566]           |
   | a=group:BUNDLE audio                        | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=ice-options:trickle                       | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Audio m=line *********               | ******************* |
   |                                             | **********          |
   | m=audio 54609 UDP/TLS/RTP/SAVPF 109         | [RFC4566]           |
   | c=IN IP4 203.0.113.141                      | [RFC4566]           |
   | a=mid:audio                                 | [RFC5888]           |
   | a=msid:ma ta                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (ta)             |
   | a=sendrecv                                  | [RFC3264] - Alice   |
   |                                             | can send and recv   |
   |                                             | audio               |
   | a=rtpmap:109 opus/48000/2                   | [RFC7587] - Opus    |
   |                                             | Codec 48khz, 2      |
   |                                             | channels            |
   | a=maxptime:120                              | [RFC4566]           |
   | a=ice-ufrag:074c6550                        | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp] -  ICE   |
   |                                             | user fragment       |
   | a=ice-pwd:a28a397a4c3f31747d1ee3474af08a068 | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp] -  ICE   |
   |                                             | password            |
   | a=fingerprint:sha-256 19:E2:1C:3B:4B:9F:81: | [RFC8122] - DTLS    |
   | E6:B8:5C:F4:A5:A8:D8:73:04:BB:05:2F:70:9F:0 | Fingerprint for     |
   | 4:A9:0E:05:E9:26:33:E8:70:88:A2             | SRTP                |
   | a=setup:actpass                             | [RFC5763] - Alice   |
   |                                             | can act as DTLS     |
   |                                             | client or server    |
   | a=tls-id:89J2LRATQ3ULA24G9AHWVR31VJWSLB68   | [I-D.ietf-mmusic-dt |
   |                                             | ls-sdp]             |
   | a=rtcp-mux                                  | [RFC5761] - Alice   |
   |                                             | can perform         |
   |                                             | RTP/RTCP Muxing     |
   | a=rtcp-mux-only                             | [I-D.ietf-mmusic-mu |
   |                                             | x-exclusive]        |
   | a=rtcp-rsize                                | [RFC5506]           |
   | a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc- | [RFC6464]           |
   | audio-level                                 |                     |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=candidate:0 1 UDP 2113667327 192.0.2.4    | [I-D.ietf-mmusic-ic |
   | 61665 typ host                              | e-sip-sdp]          |
   | a=candidate:1 1 UDP 1685987071              | [I-D.ietf-mmusic-ic |
   | 203.0.113.141 54609 typ srflx raddr         | e-sip-sdp]          |
   | 192.0.2.4 rport 61665                       |                     |
   | a=end-of-candidates                         | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   +---------------------------------------------+---------------------+

                         Table 9: 5.2.4 SDP Offer
```
```
   +---------------------------------------------+---------------------+
   | Answer SDP Contents                         | RFC#/Notes          |
   +---------------------------------------------+---------------------+
   | v=0                                         | [RFC4566]           |
   | o=-  16833 0 IN IP4 0.0.0.0                 | [RFC4566] - Session |
   |                                             | Origin Information  |
   | s=-                                         | [RFC4566]           |
   | t=0 0                                       | [RFC4566]           |
   | a=group:BUNDLE audio                        | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | ****** Audio m=line *********               | ******************* |
   |                                             | **********          |
   | m=audio 49203 UDP/TLS/RTP/SAVPF 109         | [RFC4566]           |
   | c=IN IP4 203.0.113.77                       | [RFC4566]           |
   | a=mid:audio                                 | [RFC5888]           |
   | a=msid:ma ta                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (ta)             |
   | a=inactive                                  | [RFC3264] - Bob     |
   |                                             | puts call On Hold   |
   | a=rtpmap:109 opus/48000/2                   | [RFC7587] - Bob     |
   |                                             | accepts Opus Codec  |
   | a=maxptime:120                              | [RFC4566]           |
   | a=ice-ufrag:c300d85b                        | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp] - ICE    |
   |                                             | username frag       |
   | a=ice-pwd:de4e99bd291c325921d5d47efbabd9a2  | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp] - ICE    |
   |                                             | password            |
   | a=fingerprint:sha-256 6B:8B:F0:65:5F:78:E2: | [RFC8122] - DTLS    |
   | 51:3B:AC:6F:F3:3F:46:1B:35:DC:B8:5F:64:1A:2 | Fingerprint for     |
   | 4:C2:43:F0:A1:58:D0:A1:2C:19:08             | SRTP                |
   | a=setup:active                              | [RFC5763] - Bob is  |
   |                                             | the DTLS client     |
   | a=tls-id:CJ6FF9ZZMJW7MDRJIR7XVIQM48GE1G31   | [I-D.ietf-mmusic-dt |
   |                                             | ls-sdp]             |
   | a=rtcp-mux                                  | [RFC5761] - Bob can |
   |                                             | perform RTP/RTCP    |
   |                                             | Muxing              |
   | a=rtcp-mux-only                             | [I-D.ietf-mmusic-mu |
   |                                             | x-exclusive]        |
   | a=rtcp-rsize                                | [RFC5506]           |
   | a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc- | [RFC6464]           |
   | audio-level                                 |                     |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=candidate:0 1 UDP 2113667327 198.51.100.7 | [I-D.ietf-mmusic-ic |
   | 51556 typ host                              | e-sip-sdp] - Host   |
   |                                             | candidate           |
   | a=candidate:1 1 UDP 1685987071              | [I-D.ietf-mmusic-ic |
   | 203.0.113.141 49203 typ srflx raddr         | e-sip-sdp] -        |
   | 198.51.100.7 rport 51556                    | Server Reflexive    |
   |                                             | candidate           |
   | a=end-of-candidates                         | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   +---------------------------------------------+---------------------+

                        Table 10: 5.2.4 SDP Answer
```

#### 5.2.5. Audio with DTMF Session

In this example, Alice wishes to establish two separate audio streams, one for normal audio and the other for telephone-events. Alice offers first audio stream with three codecs and the other with [RFC4733] tones (for DTMF).  Bob accepts both the audio streams by choosing Opus as the audio codec and telephone-event for the other stream.


```
               Audio Session with DTMF

   Alice                                              Bob
   |                                                   |
   |                                                   |
   |                                                   |
   |  Offer(Audio:Opus,PCMU,PCMA Audio:telephone-event)|
   |-------------------------------------------------->|
   |                                                   |
   |                                                   |
   |    Answer(Audio:Opus, Audio:telephone-event)      |
   |<--------------------------------------------------|
   |                                                   |
   |                                                   |
   |   Opus audio stream and telephone-event stream    |
   |...................................................|
   |                                                   |
```
```
   +---------------------------------------------+---------------------+
   | Offer SDP Contents                          | RFC#/Notes          |
   +---------------------------------------------+---------------------+
   | v=0                                         | [RFC4566]           |
   | o=- 20518 0 IN IP4 0.0.0.0                  | [RFC4566] - Session |
   |                                             | Origin Information  |
   | s=-                                         | [RFC4566]           |
   | t=0 0                                       | [RFC4566]           |
   | a=group:BUNDLE audio dtmf                   | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=ice-options:trickle                       | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Audio m=line *********               | ******************* |
   |                                             | **********          |
   | m=audio 54609 UDP/TLS/RTP/SAVPF 109 0 8     | [RFC4566]           |
   | c=IN IP4 203.0.113.141                      | [RFC4566]           |
   | a=mid:audio                                 | [RFC5888]           |
   | a=msid:ma ta                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (ta)             |
   | a=sendrecv                                  | [RFC3264] - Alice   |
   |                                             | can send and recv   |
   |                                             | audio               |
   | a=rtpmap:109 opus/48000/2                   | [RFC7587] - Opus    |
   |                                             | Codec 48khz, 2      |
   |                                             | channels            |
   | a=rtpmap:0 PCMU/8000                        | [RFC3551] PCMU      |
   |                                             | Audio Codec         |
   | a=rtpmap:8 PCMA/8000                        | [RFC3551] PCMA      |
   |                                             | Audio Codec         |
   | a=maxptime:120                              | [RFC4566]           |
   | a=ice-ufrag:074c6550                        | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp] -  ICE   |
   |                                             | user fragment       |
   | a=ice-pwd:a28a397a4c3f31747d1ee3474af08a068 | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp] - ICE    |
   |                                             | password parameter  |
   | a=fingerprint:sha-256 19:E2:1C:3B:4B:9F:81: | [RFC8122] - DTLS    |
   | E6:B8:5C:F4:A5:A8:D8:73:04:BB:05:2F:70:9F:0 | Fingerprint for     |
   | 4:A9:0E:05:E9:26:33:E8:70:88:A2             | SRTP                |
   | a=setup:actpass                             | [RFC5763] - Alice   |
   |                                             | can act as DTLS     |
   |                                             | client or server    |
   | a=tls-id:89J2LRATQ3ULA24G9AHWVR31VJWSLB68   | [I-D.ietf-mmusic-dt |
   |                                             | ls-sdp]             |
   | a=rtcp-mux                                  | [RFC5761] - Alice   |
   |                                             | can perform         |
   |                                             | RTP/RTCP Muxing     |
   | a=rtcp-mux-only                             | [I-D.ietf-mmusic-mu |
   |                                             | x-exclusive]        |
   | a=rtcp-rsize                                | [RFC5506]           |
   | a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc- | [RFC6464]           |
   | audio-level                                 |                     |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=candidate:0 1 UDP 2122194687 192.0.2.4    | [I-D.ietf-mmusic-ic |
   | 61665 typ host                              | e-sip-sdp]          |
   | a=candidate:1 1 UDP 1685987071              | [I-D.ietf-mmusic-ic |
   | 203.0.113.141 54609 typ srflx raddr         | e-sip-sdp]          |
   | 192.0.2.4 rport 61665                       |                     |
   | a=end-of-candidates                         | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** DTMF m=line *********                | ******************* |
   |                                             | **********          |
   | m=audio 0 UDP/TLS/RTP/SAVPF 126             | [RFC4566]           |
   | c=IN IP4 203.0.113.141                      | [RFC4566]           |
   | a=bundle-only                               | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=mid:dtmf                                  | [RFC5888]           |
   | a=msid:ma tb                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (tb)             |
   | a=sendonly                                  | [RFC3264] - Alice   |
   |                                             | can send DTMF       |
   |                                             | Events              |
   | a=rtpmap:126 telephone-event/8000           | [RFC4733]           |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   +---------------------------------------------+---------------------+

                         Table 11: 5.2.5 SDP Offer
```


```
   +---------------------------------------------+---------------------+
   | Answer SDP Contents                         | RFC#/Notes          |
   +---------------------------------------------+---------------------+
   | v=0                                         | [RFC4566]           |
   | o=-  16833 0 IN IP4 0.0.0.0                 | [RFC4566] - Session |
   |                                             | Origin Information  |
   | s=-                                         | [RFC4566]           |
   | t=0 0                                       | [RFC4566]           |
   | a=group:BUNDLE audio dtmf                   | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | ****** Audio m=line *********               | ******************* |
   |                                             | **********          |
   | m=audio 49203 UDP/TLS/RTP/SAVPF 109         | [RFC4566]           |
   | c=IN IP4 203.0.113.77                       | [RFC4566]           |
   | a=mid:audio                                 | [RFC5888]           |
   | a=msid:ma ta                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (ta)             |
   | a=sendrecv                                  | [RFC3264] - Bob can |
   |                                             | send and receive    |
   |                                             | Opus audio          |
   | a=rtpmap:109 opus/48000/2                   | [RFC7587] - Bob     |
   |                                             | accepts Opus Codec  |
   | a=maxptime:120                              | [RFC4566]           |
   | a=ice-ufrag:c300d85b                        | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp] -  ICE   |
   |                                             | username frag       |
   | a=ice-pwd:de4e99bd291c325921d5d47efbabd9a2  | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp] -  ICE   |
   |                                             | password            |
   | a=fingerprint:sha-256 6B:8B:F0:65:5F:78:E2: | [RFC8122] -         |
   | 51:3B:AC:6F:F3:3F:46:1B:35:DC:B8:5F:64:1A:2 | Fingerprint for     |
   | 4:C2:43:F0:A1:58:D0:A1:2C:19:08             | SRTP                |
   | a=setup:active                              | [RFC5763] - Bob is  |
   |                                             | the DTLS client     |
   | a=tls-id:CJ6FF9ZZMJW7MDRJIR7XVIQM48GE1G31   | [I-D.ietf-mmusic-dt |
   |                                             | ls-sdp]             |
   | a=rtcp-mux                                  | [RFC5761] - Bob can |
   |                                             | perform RTP/RTCP    |
   |                                             | Muxing on port      |
   |                                             | 49203               |
   | a=rtcp-mux-only                             | [I-D.ietf-mmusic-mu |
   |                                             | x-exclusive]        |
   | a=rtcp-rsize                                | [RFC5506] - Alice   |
   |                                             | intends to use      |
   |                                             | reduced size RTCP   |
   |                                             | for this session    |
   | a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc- | [RFC6464]           |
   | audio-level                                 |                     |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=candidate:0 1 UDP 2122194687 198.51.100.7 | [I-D.ietf-mmusic-ic |
   | 51556 typ host                              | e-sip-sdp]          |
   | a=candidate:1 1 UDP 1685987071 203.0.113.77 | [I-D.ietf-mmusic-ic |
   | 49203 typ srflx raddr 198.51.100.7 rport    | e-sip-sdp]          |
   | 51556                                       |                     |
   | a=end-of-candidates                         | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** DTMF m=line *********                | ******************* |
   |                                             | **********          |
   | m=audio 0 UDP/TLS/RTP/SAVPF 126             | [RFC4566]           |
   | c=IN IP4 203.0.113.77                       | [RFC4566]           |
   | a=bundle-only                               | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=mid:dtmf                                  | [RFC5888]           |
   | a=msid:ma tb                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (tb)             |
   | a=recvonly                                  | [RFC3264] - Alice   |
   |                                             | can receive DTMF    |
   |                                             | events              |
   | a=rtpmap:126 telephone-event/8000           | [RFC4733]           |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   +---------------------------------------------+---------------------+

                        Table 12: 5.2.5 SDP Answer
```

#### 5.2.6. One Way Audio/Video Session - Document Camera

In this scenario Alice and Bob engage in a 1 way audio and video session with Bob receiving Alice's audio and her presentation slides as video stream.


```
      One Way Audio & Video Session - Document Camera


   Alice                                                 Bob
   |                                                      |
   |                                                      |
   |                                                      |
   |   Alice Offers sendonly audio and video streams.     |
   |  The video stream corresponds to her presentation    |
   |                                                      |
   |           Offer(Audio:Opus, Video: VP8)              |
   |----------------------------------------------------->|
   |                                                      |
   |                                                      |
   |            (Audio:Opus, Video: VP8)                  |
   |<-----------------------------------------------------|
   |                                                      |
   |                                                      |
   |          One-way Opus Audio, VP8 Video               |
   |......................................................|
   |   Bob can hear Alice and see her presentation slides.|
   |                                                      |
   |                                                      |
```


```
   +---------------------------------------------+---------------------+
   | Offer SDP Contents                          | RFC#/Notes          |
   +---------------------------------------------+---------------------+
   | v=0                                         | [RFC4566]           |
   | o=- 20519 0 IN IP4 0.0.0.0                  | [RFC4566]           |
   | s=-                                         | [RFC4566]           |
   | t=0 0                                       | [RFC4566]           |
   | a=group:BUNDLE audio video                  | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=group:LS audio video                      | [RFC5888]           |
   | a=ice-options:trickle                       | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Audio m=line *********               | ******************* |
   |                                             | **********          |
   | m=audio 54609 UDP/TLS/RTP/SAVPF 109         | [RFC4566]           |
   | c=IN IP4 203.0.113.141                      | [RFC4566]           |
   | a=mid:audio                                 | [RFC5888]           |
   | a=msid:ma ta                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (ta)             |
   | a=sendonly                                  | [RFC3264] - Send    |
   |                                             | only audio stream   |
   | a=rtpmap:109 opus/48000/2                   | [RFC7587]           |
   | a=maxptime:120                              | [RFC4566]           |
   | a=ice-ufrag:074c6550                        | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=ice-pwd:a28a397a4c3f31747d1ee3474af08a068 | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=fingerprint:sha-256 19:E2:1C:3B:4B:9F:81: | [RFC8122]           |
   | E6:B8:5C:F4:A5:A8:D8:73:04:BB:05:2F:70:9F:0 |                     |
   | 4:A9:0E:05:E9:26:33:E8:70:88:A2             |                     |
   | a=setup:actpass                             | [RFC5763] - Alice   |
   |                                             | can act as DTLS     |
   |                                             | client or server    |
   | a=tls-id:89J2LRATQ3ULA24G9AHWVR31VJWSLB68   | [I-D.ietf-mmusic-dt |
   |                                             | ls-sdp]             |
   | a=rtcp-mux                                  | [RFC5761]           |
   | a=rtcp-mux-only                             | [I-D.ietf-mmusic-mu |
   |                                             | x-exclusive]        |
   | a=rtcp-rsize                                | [RFC5506]           |
   | a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc- | [RFC6464]           |
   | audio-level                                 |                     |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=candidate:0 1 UDP 2122194687              | [I-D.ietf-mmusic-ic |
   | 203.0.113.141 54609 typ host                | e-sip-sdp]          |
   | a=end-of-candidates                         | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Video m=line *********               | ******************* |
   |                                             | **********          |
   | m=video 0 UDP/TLS/RTP/SAVPF 120             | [RFC4566]           |
   | c=IN IP4 203.0.113.141                      | [RFC4566]           |
   | a=bundle-only                               | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=mid:video                                 | [RFC5888]           |
   | a=msid:ma tb                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (tb)             |
   | a=sendonly                                  | [RFC3264] - Send    |
   |                                             | only video stream   |
   | a=rtpmap:120 VP8/90000                      | [RFC7741]           |
   | a=content:slides                            | [RFC4796] - Alice's |
   |                                             | presentation video  |
   |                                             | stream              |
   | a=rtcp-fb:120 nack                          | [RFC4585]           |
   | a=rtcp-fb:120 nack pli                      | [RFC4585]           |
   | a=rtcp-fb:120 ccm fir                       | [RFC5104]           |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   +---------------------------------------------+---------------------+

                         Table 13: 5.2.6 SDP Offer
```


```
   +---------------------------------------------+---------------------+
   | Answer SDP Contents                         | RFC#/Notes          |
   +---------------------------------------------+---------------------+
   | v=0                                         | [RFC4566]           |
   | o=- 16833 0 IN IP4 0.0.0.0                  | [RFC4566]           |
   | s=-                                         | [RFC4566]           |
   | t=0 0                                       | [RFC4566]           |
   | a=group:BUNDLE audio video                  | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=group:LS audio video                      | [RFC5888]           |
   | a=ice-options:trickle                       | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Audio m=line *********               | ******************* |
   |                                             | **********          |
   | m=audio 49203 UDP/TLS/RTP/SAVPF 109         | [RFC4566]           |
   | c=IN IP4 203.0.113.77                       | [RFC4566]           |
   | a=mid:audio                                 | [RFC5888]           |
   | a=msid:ma ta                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (ta)             |
   | a=recvonly                                  | [RFC3264] - Receive |
   |                                             | only audio stream   |
   | a=rtpmap:109 opus/48000/2                   | [RFC7587]           |
   | a=maxptime:120                              | [RFC4566]           |
   | a=ice-ufrag:c300d85b                        | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=ice-pwd:de4e99bd291c325921d5d47efbabd9a2  | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=fingerprint:sha-256 6B:8B:F0:65:5F:78:E2: | [RFC8122]           |
   | 51:3B:AC:6F:F3:3F:46:1B:35:DC:B8:5F:64:1A:2 |                     |
   | 4:C2:43:F0:A1:58:D0:A1:2C:19:08             |                     |
   | a=setup:active                              | [RFC5763] - Bob is  |
   |                                             | the DTLS client     |
   | a=tls-id:CJ6FF9ZZMJW7MDRJIR7XVIQM48GE1G31   | [I-D.ietf-mmusic-dt |
   |                                             | ls-sdp]             |
   | a=rtcp-mux                                  | [RFC5761]           |
   | a=rtcp-mux-only                             | [I-D.ietf-mmusic-mu |
   |                                             | x-exclusive]        |
   | a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc- | [RFC6464]           |
   | audio-level                                 |                     |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=candidate:0 1 UDP 2113667327 203.0.113.77 | [I-D.ietf-mmusic-ic |
   | 49203 typ host                              | e-sip-sdp]          |
   | a=end-of-candidates                         | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Video m=line *********               | ******************* |
   |                                             | **********          |
   | m=video 0 UDP/TLS/RTP/SAVPF 120             | [RFC4566]           |
   | c=IN IP4 203.0.113.77                       | [RFC4566]           |
   | a=bundle-only                               | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=mid:video                                 | [RFC5888]           |
   | a=msid:ma tb                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (tb)             |
   | a=recvonly                                  | [RFC3264]           |
   | a=rtpmap:120 VP8/90000                      | [RFC7741]           |
   | a=content:slides                            | [RFC4796] -         |
   |                                             | presentation stream |
   | a=rtcp-fb:120 nack                          | [RFC4585]           |
   | a=rtcp-fb:120 nack pli                      | [RFC4585]           |
   | a=rtcp-fb:120 ccm fir                       | [RFC5104]           |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   +---------------------------------------------+---------------------+

                        Table 14: 5.2.6 SDP Answer
```

#### 5.2.7. Audio, Video Session with BUNDLE Support Unknown

In this example, since Alice is unsure of the Bob's support of the BUNDLE framework, following steps are performed in order to negotiate and setup a BUNDLE Address for the session

*  An SDP Offer, in which the Alice assigns unique addresses to each "m=" line in the BUNDLE group, and requests the Answerer to select the Offerer's BUNDLE address.

*  An SDP Answer, in which the Bob indicates its support for BUNDLE, selects the offerer's BUNDLE address, selects its own BUNDLE address and associates it with each BUNDLED m=line within the BUNDLE group.

Once the Offer/Answer exchange completes, both Alice and Bob each end up using single RTP Session for both the Media Streams.




```
    Two-Way Secure Audio,Video with BUNDLE support unknown

   Alice                                                 Bob
   |                                                      |
   |                                                      |
   |   Alice offers BUNDLE support with unique address    |
   |        for the audio and video m-line                |
   |                                                      |
   |                                                      |
   |          Offer(Audio:Opus Video:VP8)                 |
   |----------------------------------------------------->|
   |                                                      |Bob
   |                                                      |supports
   |                                                      |BUNDLE,
   |                                                      |Uses
   |                                                      |identical
   |                                                      |address
   |          Answer(Audio:Opus Video:VP8)                |
   |<-----------------------------------------------------|
   |                                                      |
   |    2 Way Call with Audio and Video Multiplexed       |
   |......................................................|
   |                                                      |
```


```
   +---------------------------------------------+---------------------+
   | Offer SDP Contents                          | RFC#/Notes          |
   +---------------------------------------------+---------------------+
   | v=0                                         | [RFC4566]           |
   | o=- 20518 0 IN IP4 0.0.0.0                  | [RFC4566]           |
   | s=-                                         | [RFC4566]           |
   | t=0 0                                       | [RFC4566]           |
   | a=group:BUNDLE audio video                  | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n] Alice supports   |
   |                                             | grouping of m=lines |
   |                                             | under BUNDLE        |
   |                                             | semantics           |
   | a=group:LS audio video                      | [RFC5888]           |
   | a=ice-options:trickle                       | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Audio m=line *********               | ******************* |
   |                                             | **********          |
   | m=audio 54609 UDP/TLS/RTP/SAVPF 109         | [RFC4566]           |
   | c=IN IP4 203.0.113.141                      | [RFC4566]           |
   | a=mid:audio                                 | [RFC5888] Audio     |
   |                                             | m=line part of      |
   |                                             | BUNDLE group with a |
   |                                             | unique port number  |
   | a=msid:ma ta                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (ta)             |
   | a=sendrecv                                  | [RFC3264]           |
   | a=rtpmap:109 opus/48000/2                   | [RFC7587]           |
   | a=maxptime:120                              | [RFC4566]           |
   | a=ice-ufrag:074c6550                        | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=ice-pwd:a28a397a4c3f31747d1ee3474af08a068 | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=fingerprint:sha-256 19:E2:1C:3B:4B:9F:81: | [RFC8122]           |
   | E6:B8:5C:F4:A5:A8:D8:73:04:BB:05:2F:70:9F:0 |                     |
   | 4:A9:0E:05:E9:26:33:E8:70:88:A2             |                     |
   | a=setup:actpass                             | [RFC5763] - Alice   |
   |                                             | can act as DTLS     |
   |                                             | client or server    |
   | a=tls-id:89J2LRATQ3ULA24G9AHWVR31VJWSLB68   | [I-D.ietf-mmusic-dt |
   |                                             | ls-sdp]             |
   | a=rtcp-mux                                  | [RFC5761]           |
   | a=rtcp:54610 IN IP4 203.0.113.141           | [RFC3605] - RTCP    |
   |                                             | port different from |
   |                                             | RTP Port            |
   | a=rtcp-rsize                                | [RFC5506]           |
   | a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc- | [RFC6464]           |
   | audio-level                                 |                     |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=candidate:0 1 UDP 2122194687 192.0.2.4    | [I-D.ietf-mmusic-ic |
   | 61665 typ host                              | e-sip-sdp] - RTP    |
   |                                             | host candidate      |
   | a=candidate:1 1 UDP 1685987071              | [I-D.ietf-mmusic-ic |
   | 203.0.113.141 54609 typ srflx raddr         | e-sip-sdp] - RTP    |
   | 192.0.2.4 rport 61665                       | Server Reflexive    |
   |                                             | candidate           |
   | a=candidate:0 2 UDP 2122194687 192.0.2.4    | [I-D.ietf-mmusic-ic |
   | 61666 typ host                              | e-sip-sdp] - RTCP   |
   |                                             | host candidate      |
   | a=candidate:1 2 UDP 1685987071              | [I-D.ietf-mmusic-ic |
   | 203.0.113.141 54610 typ srflx raddr         | e-sip-sdp] - RTCP   |
   | 192.0.2.4 rport 61666                       | Server Reflexive    |
   |                                             | candidate           |
   | ****** Video m=line *********               | ******************* |
   |                                             | **********          |
   | m=video 62537 UDP/TLS/RTP/SAVPF 120         | [RFC4566]           |
   | c=IN IP4 203.0.113.141                      | [RFC4566]           |
   | a=mid:video                                 | [RFC5888] Video     |
   |                                             | m=line part of the  |
   |                                             | Bundle group with a |
   |                                             | unique port number  |
   | a=msid:ma tb                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (tb)             |
   | a=sendrecv                                  | [RFC3264]           |
   | a=rtpmap:120 VP8/90000                      | [RFC7741]           |
   | a=ice-ufrag:6550074c                        | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=ice-pwd:74af08a068a28a397a4c3f31747d1ee34 | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=fingerprint:sha-256 19:E2:1C:3B:4B:9F:81: | [RFC8122]           |
   | E6:B8:5C:F4:A5:A8:D8:73:04:BB:05:2F:70:9F:0 |                     |
   | 4:A9:0E:05:E9:26:33:E8:70:88:A2             |                     |
   | a=setup:actpass                             | [RFC5763] - Alice   |
   |                                             | can act as DTLS     |
   |                                             | client or server    |
   | a=tls-id:UKA29UQLTF69OJW4WNPNUO2Y0GF1FJOZ   | [I-D.ietf-mmusic-dt |
   |                                             | ls-sdp]             |
   | a=rtcp-mux                                  | [RFC5761]           |
   | a=rtcp:62538 IN IP4 203.0.113.141           | [RFC3605]           |
   | a=rtcp-rsize                                | [RFC5506]           |
   | a=rtcp-fb:120 nack                          | [RFC4585]           |
   | a=rtcp-fb:120 nack pli                      | [RFC4585]           |
   | a=rtcp-fb:120 ccm fir                       | [RFC5104]           |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=candidate:0 1 UDP 2122194687 192.0.2.4    | [I-D.ietf-mmusic-ic |
   | 61886 typ host                              | e-sip-sdp] - RTP    |
   |                                             | Host candidate      |
   | a=candidate:1 1 UDP 1685987071              | [I-D.ietf-mmusic-ic |
   | 203.0.113.141 62537 typ srflx raddr         | e-sip-sdp] - RTP    |
   | 192.0.2.4 rport 61886                       | Server Reflexive    |
   |                                             | candidate           |
   | a=candidate:0 2 UDP 2122194687 192.0.2.4    | [I-D.ietf-mmusic-ic |
   | 61888 typ host                              | e-sip-sdp] - RTCP   |
   |                                             | host candidate      |
   | a=candidate:1 2 UDP 1685987071              | [I-D.ietf-mmusic-ic |
   | 203.0.113.141 62538 typ srflx raddr         | e-sip-sdp] - RTCP   |
   | 192.0.2.4 rport 61888                       | Server Reflexive    |
   |                                             | candidate           |
   +---------------------------------------------+---------------------+

                    Table 15: 5.2.7 SDP Offer w/BUNDLE
```
```
   +---------------------------------------------+---------------------+
   | Answer SDP Contents                         | RFC#/Notes          |
   +---------------------------------------------+---------------------+
   | v=0                                         | [RFC4566]           |
   | o=-  16833 0 IN IP4 0.0.0.0                 | [RFC4566]           |
   | s=-                                         | [RFC4566]           |
   | t=0 0                                       | [RFC4566]           |
   | a=group:BUNDLE audio video                  | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n] Bob supports     |
   |                                             | BUNDLE semantics.   |
   | a=group:LS audio video                      | [RFC5888]           |
   | a=ice-options:trickle                       | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Audio m=line *********               | ******************* |
   |                                             | **********          |
   | m=audio 49203 UDP/TLS/RTP/SAVPF 109         | [RFC4566]           |
   | c=IN IP4 203.0.113.77                       | [RFC4566]           |
   | a=mid:audio                                 | [RFC5888] Audio     |
   |                                             | m=line part of the  |
   |                                             | BUNDLE group        |
   | a=msid:ma ta                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (ta)             |
   | a=sendrecv                                  | [RFC3264]           |
   | a=rtpmap:109 opus/48000/2                   | [RFC7587]           |
   | a=maxptime:120                              | [RFC4566]           |
   | a=ice-ufrag:c300d85b                        | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=ice-pwd:de4e99bd291c325921d5d47efbabd9a2  | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=fingerprint:sha-256 6B:8B:F0:65:5F:78:E2: | [RFC8122]           |
   | 51:3B:AC:6F:F3:3F:46:1B:35:DC:B8:5F:64:1A:2 |                     |
   | 4:C2:43:F0:A1:58:D0:A1:2C:19:08             |                     |
   | a=setup:active                              | [RFC5763] - Bob is  |
   |                                             | the DTLS client     |
   | a=tls-id:CJ6FF9ZZMJW7MDRJIR7XVIQM48GE1G31   | [I-D.ietf-mmusic-dt |
   |                                             | ls-sdp]             |
   | a=rtcp-mux                                  | [RFC5761]           |
   | a=rtcp-rsize                                | [RFC5506]           |
   | a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc- | [RFC6464]           |
   | audio-level                                 |                     |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=candidate:0 1 UDP 2122194687 198.51.100.7 | [I-D.ietf-mmusic-ic |
   | 49203 typ host                              | e-sip-sdp]          |
   | a=candidate:1 1 UDP 1685987071 203.0.113.77 | [I-D.ietf-mmusic-ic |
   | 51556 typ srflx raddr 198.51.100.7 rport    | e-sip-sdp]          |
   | 49203                                       |                     |
   | ****** Video m=line *********               | ******************* |
   |                                             | **********          |
   | m=video 0 UDP/TLS/RTP/SAVPF 120             | [RFC4566]           |
   | c=IN IP4 203.0.113.77                       | [RFC4566]           |
   | a=bundle-only                               | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=mid:video                                 | [RFC5888] Video     |
   |                                             | m=line part of the  |
   |                                             | BUNDLE group with   |
   |                                             | the port from audio |
   |                                             | line repeated       |
   | a=msid:ma tb                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (tb)             |
   | a=sendrecv                                  | [RFC3264]           |
   | a=rtpmap:120 VP8/90000                      | [RFC7741]           |
   | a=rtcp-fb:120 nack                          | [RFC4585]           |
   | a=rtcp-fb:120 nack pli                      | [RFC4585]           |
   | a=rtcp-fb:120 ccm fir                       | [RFC5104]           |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   +---------------------------------------------+---------------------+

                    Table 16: 5.2.7 SDP Answer w/BUNDLE
```

#### 5.2.8. Audio, Video and Data Session

This example shows SDP for negotiating a session with Audio, Video and data streams between Alice and Bob with BUNDLE support known.




```
       Audio,Video,Data with BUNDLE support known

   Alice                                       Bob
   |                                            |
   |                                            |
   |   Alice indicates BUNDLE support with      |
   |  identical address across all the m=lines  |
   |                                            |
   |                                            |
   |     Offer(Audio:Opus Video:VP8 Data)       |
   |------------------------------------------->|
   |                                            |Bob does
   |                                            |the same
   |    Answer(Audio:Opus,Video:VP8 Data)       |
   |<-------------------------------------------|
   |                                            |
   |                                            |
   |                                            |
   |    Two-way Audio,Video, Data multiplexed   |
   |............................................|
   |                                            |
   |                                            |
```
```
   +---------------------------------------------+---------------------+
   | Offer SDP Contents                          | RFC#/Notes          |
   +---------------------------------------------+---------------------+
   | v=0                                         | [RFC4566]           |
   | o=- 20518 0 IN IP4 0.0.0.0                  | [RFC4566]           |
   | s=-                                         | [RFC4566]           |
   | t=0 0                                       | [RFC4566]           |
   | a=group:BUNDLE audio video data             | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=group:LS audio video                      | [RFC5888]           |
   | a=ice-options:trickle                       | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Audio m=line *********               | ******************* |
   |                                             | **********          |
   | m=audio 54609 UDP/TLS/RTP/SAVPF 109         | [RFC4566]           |
   | c=IN IP4 203.0.113.141                      | [RFC4566]           |
   | a=msid:ma ta                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (ta)             |
   | a=mid:audio                                 | [RFC5888]           |
   | a=sendrecv                                  | [RFC3264]           |
   | a=rtpmap:109 opus/48000/2                   | [RFC7587]           |
   | a=maxptime:120                              | [RFC4566]           |
   | a=ice-ufrag:074c6550                        | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=ice-pwd:a28a397a4c3f31747d1ee3474af08a068 | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=fingerprint:sha-256 19:E2:1C:3B:4B:9F:81: | [RFC8122]           |
   | E6:B8:5C:F4:A5:A8:D8:73:04:BB:05:2F:70:9F:0 |                     |
   | 4:A9:0E:05:E9:26:33:E8:70:88:A2             |                     |
   | a=setup:actpass                             | [RFC5763]           |
   | a=tls-id:89J2LRATQ3ULA24G9AHWVR31VJWSLB68   | [I-D.ietf-mmusic-dt |
   |                                             | ls-sdp]             |
   | a=rtcp-mux                                  | [RFC5761]           |
   | a=rtcp-mux-only                             | [I-D.ietf-mmusic-mu |
   |                                             | x-exclusive]        |
   | a=rtcp-rsize                                | [RFC5506]           |
   | a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc- | [RFC6464]           |
   | audio-level                                 |                     |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=candidate:0 1 UDP 2122194687 192.0.2.4    | [I-D.ietf-mmusic-ic |
   | 61665 typ host                              | e-sip-sdp]          |
   | a=candidate:1 1 UDP 1685987071              | [I-D.ietf-mmusic-ic |
   | 203.0.113.141 54609 typ srflx raddr         | e-sip-sdp]          |
   | 192.0.2.4 rport 61665                       |                     |
   | a=end-of-candidates                         | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Video m=line *********               | ******************* |
   |                                             | **********          |
   | m=video 0 UDP/TLS/RTP/SAVPF 120             | [RFC4566]           |
   | c=IN IP4 203.0.113.141                      | [RFC4566]           |
   | a=bundle-only                               | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=mid:video                                 | [RFC5888]           |
   | a=msid:ma tb                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (tb)             |
   | a=sendrecv                                  | [RFC3264]           |
   | a=rtpmap:120 VP8/90000                      | [RFC7741]           |
   | a=rtcp-fb:120 nack                          | [RFC4585]           |
   | a=rtcp-fb:120 nack pli                      | [RFC4585]           |
   | a=rtcp-fb:120 ccm fir                       | [RFC5104]           |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | ****** Application m=line *********         | ******************* |
   |                                             | **********          |
   | m=application 0 UDP/DTLS/SCTP webrtc-       | [I-D.ietf-rtcweb-da |
   | datachannel                                 | ta-channel]         |
   | c=IN IP4 203.0.113.141                      | [RFC4566]           |
   | a=bundle-only                               | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=mid:data                                  | [RFC5888]           |
   | a=sctp-port:5000                            | [I-D.ietf-mmusic-sc |
   |                                             | tp-sdp]             |
   | a=max-message-size:100000                   | [I-D.ietf-mmusic-sc |
   |                                             | tp-sdp]             |
   | a=sendrecv                                  | [RFC3264]           |
   +---------------------------------------------+---------------------+

                         Table 17: 5.2.8 SDP Offer
```
```
   +---------------------------------------------+---------------------+
   | Answer SDP Contents                         | RFC#/Notes          |
   +---------------------------------------------+---------------------+
   | v=0                                         | [RFC4566]           |
   | o=- 16833 0 IN IP4 0.0.0.0                  | [RFC4566] - Session |
   |                                             | Origin Information  |
   | s=-                                         | [RFC4566]           |
   | t=0 0                                       | [RFC4566]           |
   | a=group:BUNDLE audio video data             | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=group:LS audio video                      | [RFC5888]           |
   | a=ice-options:trickle                       | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Audio m=line *********               | ******************* |
   |                                             | **********          |
   | m=audio 49203 UDP/TLS/RTP/SAVPF 109         | [RFC4566]           |
   | c=IN IP4 203.0.113.77                       | [RFC4566]           |
   | a=msid:ma ta                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (ta)             |
   | a=mid:audio                                 | [RFC5888]           |
   | a=sendrecv                                  | [RFC3264]           |
   | a=rtpmap:109 opus/48000/2                   | [RFC7587]           |
   | a=maxptime:120                              | [RFC4566]           |
   | a=ice-ufrag:c300d85b                        | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=ice-pwd:de4e99bd291c325921d5d47efbabd9a2  | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=fingerprint:sha-256 6B:8B:F0:65:5F:78:E2: | [RFC8122]           |
   | 51:3B:AC:6F:F3:3F:46:1B:35:DC:B8:5F:64:1A:2 |                     |
   | 4:C2:43:F0:A1:58:D0:A1:2C:19:08             |                     |
   | a=setup:active                              | [RFC5763]           |
   | a=tls-id:CJ6FF9ZZMJW7MDRJIR7XVIQM48GE1G31   | [I-D.ietf-mmusic-dt |
   |                                             | ls-sdp]             |
   | a=rtcp-mux                                  | [RFC5761]           |
   | a=rtcp-mux-only                             | [I-D.ietf-mmusic-mu |
   |                                             | x-exclusive]        |
   | a=rtcp-rsize                                | [RFC5506]           |
   | a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc- | [RFC6464]           |
   | audio-level                                 |                     |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=candidate:0 1 UDP 2122194687 198.51.100.7 | [I-D.ietf-mmusic-ic |
   | 51556 typ host                              | e-sip-sdp]          |
   | a=candidate:1 1 UDP 1685987071 203.0.113.77 | [I-D.ietf-mmusic-ic |
   | 49203 typ srflx raddr 198.51.100.7 rport    | e-sip-sdp]          |
   | 51556                                       |                     |
   | a=end-of-candidates                         | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Video m=line *********               | ******************* |
   |                                             | **********          |
   | m=video 0 UDP/TLS/RTP/SAVPF 120             | [RFC4566]           |
   | c=IN IP4 203.0.113.77                       | [RFC4566]           |
   | a=bundle-only                               | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=mid:video                                 | [RFC5888]           |
   | a=msid:ma tb                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (tb)             |
   | a=sendrecv                                  | [RFC3264]           |
   | a=rtpmap:120 VP8/90000                      | [RFC7741]           |
   | a=rtcp-fb:120 nack                          | [RFC4585]           |
   | a=rtcp-fb:120 nack pli                      | [RFC4585]           |
   | a=rtcp-fb:120 ccm fir                       | [RFC5104]           |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | ****** Application m=line *********         | ******************* |
   |                                             | **********          |
   | m=application 0 UDP/DTLS/SCTP webrtc-       | [I-D.ietf-mmusic-sc |
   | datachannel                                 | tp-sdp]             |
   | c=IN IP4 203.0.113.77                       | [RFC4566]           |
   | a=bundle-only                               | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=mid:data                                  | [RFC5888]           |
   | a=sctp-port:5000                            | [I-D.ietf-mmusic-sc |
   |                                             | tp-sdp]             |
   | a=max-message-size:100000                   | [I-D.ietf-mmusic-sc |
   |                                             | tp-sdp]             |
   | a=sendrecv                                  | [RFC3264]           |
   +---------------------------------------------+---------------------+

                        Table 18: 5.2.8 SDP Answer
```

#### 5.2.9. Audio, Video Session with BUNDLE Unsupported

This use-case illustrates SDP Offer/Answer exchange where the far-end (Bob) either doesn't support media bundling or doesn't want to group m=lines over a single 5-tuple.

The same is indicated by dropping the "a=group:BUNDLE" line and BUNDLE RTP header extension in the Answer SDP.

On successful Offer/Answer exchange, Alice and Bob each end up using unique 5-tuple for audio and video media streams respectively.


```
      Two-Way Secure Audio,Video with BUNDLE Unsupported

   Alice                                                 Bob
   |                                                      |
   |                                                      |
   |     Alice offers BUNDLE support with unique address  |
   |           for the audio and video m-line             |
   |                                                      |
   |                                                      |
   |           Offer(Audio:Opus Video:VP8)                |
   |----------------------------------------------------->|
   |                                                      |Bob
   |                                                      |doesn't
   |                                                      |support
   |                                                      |BUNDLE
   |           Answer(Audio:Opus Video:VP8)               |
   |<-----------------------------------------------------|
   |                                                      |Bob uses
   |                                                      |unique
   |                                                      |addresses
   |                                                      |across the
   |                                                      |m=lines
   |                                                      |
   |2Way Call with Audio and Video on different 5-tuples  |
   |......................................................|
   |                                                      |
   |                                                      |
```
```
   +---------------------------------------------+---------------------+
   | Offer SDP Contents                          | RFC#/Notes          |
   +---------------------------------------------+---------------------+
   | v=0                                         | [RFC4566]           |
   | o=- 20518 0 IN IP4 0.0.0.0                  | [RFC4566]           |
   | s=-                                         | [RFC4566]           |
   | t=0 0                                       | [RFC4566]           |
   | a=group:BUNDLE audio video                  | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n] Alice supports   |
   |                                             | grouping of m=lines |
   |                                             | under BUNDLE        |
   |                                             | semantics           |
   | a=group:LS audio video                      | [RFC5888]           |
   | a=ice-options:trickle                       | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Audio m=line *********               | ******************* |
   |                                             | **********          |
   | m=audio 54609 UDP/TLS/RTP/SAVPF 109         | [RFC4566]           |
   | c=IN IP4 203.0.113.141                      | [RFC4566]           |
   | a=mid:audio                                 | [RFC5888] Audio     |
   |                                             | m=line part of      |
   |                                             | BUNDLE group with a |
   |                                             | unique port number  |
   | a=msid:ma ta                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (ta)             |
   | a=sendrecv                                  | [RFC3264]           |
   | a=rtpmap:109 opus/48000/2                   | [RFC7587]           |
   | a=maxptime:120                              | [RFC4566]           |
   | a=ice-ufrag:074c6550                        | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=ice-pwd:a28a397a4c3f31747d1ee3474af08a068 | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=fingerprint:sha-256 19:E2:1C:3B:4B:9F:81: | [RFC8122]           |
   | E6:B8:5C:F4:A5:A8:D8:73:04:BB:05:2F:70:9F:0 |                     |
   | 4:A9:0E:05:E9:26:33:E8:70:88:A2             |                     |
   | a=setup:actpass                             | [RFC5763] - Alice   |
   |                                             | can act as DTLS     |
   |                                             | client or server    |
   | a=tls-id:89J2LRATQ3ULA24G9AHWVR31VJWSLB68   | [I-D.ietf-mmusic-dt |
   |                                             | ls-sdp]             |
   | a=rtcp-mux                                  | [RFC5761]           |
   | a=rtcp:55232 IN IP4 203.0.113.141           | [RFC3605] - RTCP    |
   |                                             | port different from |
   |                                             | RTP port            |
   | a=rtcp-rsize                                | [RFC5506]           |
   | a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc- | [RFC6464]           |
   | audio-level                                 |                     |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=candidate:0 1 UDP 2122194687 192.0.2.4    | [I-D.ietf-mmusic-ic |
   | 61665 typ host                              | e-sip-sdp]          |
   | a=candidate:1 1 UDP 1685987071              | [I-D.ietf-mmusic-ic |
   | 203.0.113.141 54609 typ srflx raddr         | e-sip-sdp]          |
   | 192.0.2.4 rport 61665                       |                     |
   | a=candidate:0 2 UDP 2122194687 192.0.2.4    | [I-D.ietf-mmusic-ic |
   | 61666 typ host                              | e-sip-sdp]          |
   | a=candidate:1 2 UDP 1685987071              | [I-D.ietf-mmusic-ic |
   | 203.0.113.141 55232 typ srflx raddr         | e-sip-sdp]          |
   | 192.0.2.4 rport 61666                       |                     |
   | a=end-of-candidates                         | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Video m=line *********               | ******************* |
   |                                             | **********          |
   | m=video 54332 UDP/TLS/RTP/SAVPF 120         | [RFC4566]           |
   | c=IN IP4 203.0.113.141                      | [RFC4566]           |
   | a=mid:video                                 | [RFC5888] Video     |
   |                                             | m=line part of the  |
   |                                             | BUNDLE group with a |
   |                                             | unique port number  |
   | a=msid:ma tb                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (tb)             |
   | a=sendrecv                                  | [RFC3264]           |
   | a=rtpmap:120 VP8/90000                      | [RFC7741]           |
   | a=ice-ufrag:7872093                         | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=ice-pwd:ee3474af08a068a28a397a4c3f31747d1 | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=fingerprint:sha-256 19:E2:1C:3B:4B:9F:81: | [RFC8122]           |
   | E6:B8:5C:F4:A5:A8:D8:73:04:BB:05:2F:70:9F:0 |                     |
   | 4:A9:0E:05:E9:26:33:E8:70:88:A2             |                     |
   | a=setup:actpass                             | [RFC5763] - Alice   |
   |                                             | can act as DTLS     |
   |                                             | client or server    |
   | a=tls-id:UKA29UQLTF69OJW4WNPNUO2Y0GF1FJOZ   | [I-D.ietf-mmusic-dt |
   |                                             | ls-sdp]             |
   | a=rtcp-mux                                  | [RFC5761]           |
   | a=rtcp:60052 IN IP4 203.0.113.141           | [RFC3605]           |
   | a=rtcp-rsize                                | [RFC5506]           |
   | a=rtcp-fb:120 nack                          | [RFC4585]           |
   | a=rtcp-fb:120 nack pli                      | [RFC4585]           |
   | a=rtcp-fb:120 ccm fir                       | [RFC5104]           |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=candidate:0 1 UDP 2122194687 192.0.2.4    | [I-D.ietf-mmusic-ic |
   | 71775 typ host                              | e-sip-sdp]          |
   | a=candidate:1 1 UDP 1685987071              | [I-D.ietf-mmusic-ic |
   | 203.0.113.141 54332 typ srflx raddr         | e-sip-sdp]          |
   | 192.0.2.4 rport 71775                       |                     |
   | a=candidate:0 2 UDP 2122194687 192.0.2.4    | [I-D.ietf-mmusic-ic |
   | 71776 typ host                              | e-sip-sdp]          |
   | a=candidate:1 2 UDP 1685987071              | [I-D.ietf-mmusic-ic |
   | 203.0.113.141 60052 typ srflx raddr         | e-sip-sdp]          |
   | 192.0.2.4 rport 71776                       |                     |
   | a=end-of-candidates                         | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   +---------------------------------------------+---------------------+


                    Table 19: 5.2.9 SDP Offer w/BUNDLE
```
```
   +-------------------------------------------------+-----------------+
   | Answer SDP Contents                             | RFC#/Notes      |
   +-------------------------------------------------+-----------------+
   | v=0                                             | [RFC4566]       |
   | o=-  16833 0 IN IP4 0.0.0.0                     | [RFC4566]       |
   | s=-                                             | [RFC4566]       |
   | t=0 0                                           | [RFC4566]       |
   | a=group:LS audio video                          | [RFC5888]       |
   | a=ice-options:trickle                           | [I-D.ietf-mmusi |
   |                                                 | c-trickle-ice]  |
   | ****** Audio m=line *********                   | *************** |
   |                                                 | **************  |
   | m=audio 53214 UDP/TLS/RTP/SAVPF 109             | [RFC4566]       |
   | c=IN IP4 203.0.113.77                           | [RFC4566]       |
   | a=mid:audio                                     | [RFC5888]       |
   | a=msid:ma ta                                    | Identifies      |
   |                                                 | RTCMediaStream  |
   |                                                 | ID (ma) and RTC |
   |                                                 | MediaStreamTrac |
   |                                                 | k ID (ta)       |
   | a=sendrecv                                      | [RFC3264]       |
   | a=rtpmap:109 opus/48000/2                       | [RFC7587]       |
   | a=maxptime:120                                  | [RFC4566]       |
   | a=ice-ufrag:c300d85b                            | [I-D.ietf-mmusi |
   |                                                 | c-ice-sip-sdp]  |
   | a=ice-pwd:de4e99bd291c325921d5d47efbabd9a2      | [I-D.ietf-mmusi |
   |                                                 | c-ice-sip-sdp]  |
   | a=fingerprint:sha-256 6B:8B:F0:65:5F:78:E2:51:3 | [RFC8122]       |
   | B:AC:6F:F3:3F:46:1B:35:DC:B8:5F:64:1A:24:C2:43: |                 |
   | F0:A1:58:D0:A1:2C:19:08                         |                 |
   | a=setup:active                                  | [RFC5763] - Bob |
   |                                                 | is the DTLS     |
   |                                                 | client          |
   | a=tls-id:CJ6FF9ZZMJW7MDRJIR7XVIQM48GE1G31       | [I-D.ietf-mmusi |
   |                                                 | c-dtls-sdp]     |
   | a=rtcp-mux                                      | [RFC5761]       |
   | a=rtcp-rsize                                    | [RFC5506]       |
   | a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc-     | [RFC6464]       |
   | audio-level                                     |                 |
   | a=candidate:0 1 UDP 2122194687 198.51.100.7     | [I-D.ietf-mmusi |
   | 51556 typ host                                  | c-ice-sip-sdp]  |
   | a=candidate:1 1 UDP 1685987071 203.0.113.77     | [I-D.ietf-mmusi |
   | 53214 typ srflx raddr 198.51.100.7 rport 51556  | c-ice-sip-sdp]  |
   | a=candidate:0 2 UDP 2122194687 198.51.100.7     | [I-D.ietf-mmusi |
   | 51558 typ host                                  | c-ice-sip-sdp]  |
   | a=candidate:1 2 UDP 1685987071 203.0.113.77     | [I-D.ietf-mmusi |
   | 60065 typ srflx raddr 198.51.100.7 rport 51558  | c-ice-sip-sdp]  |
   | ****** Video m=line *********                   | *************** |
   |                                                 | **************  |
   | m=video 58679 UDP/TLS/RTP/SAVPF 120             | [RFC4566]       |
   | c=IN IP4 203.0.113.77                           | [RFC4566]       |
   | a=mid:video                                     | [RFC5888]       |
   | a=msid:ma tb                                    | Identifies      |
   |                                                 | RTCMediaStream  |
   |                                                 | ID (ma) and RTC |
   |                                                 | MediaStreamTrac |
   |                                                 | k ID (tb)       |
   | a=sendrecv                                      | [RFC3264]       |
   | a=rtpmap:120 VP8/90000                          | [RFC7741]       |
   | a=ice-ufrag:85bC300                             | [I-D.ietf-mmusi |
   |                                                 | c-ice-sip-sdp]  |
   | a=ice-pwd:325921d5d47efbabd9a2de4e99bd291c      | [I-D.ietf-mmusi |
   |                                                 | c-ice-sip-sdp]  |
   | a=fingerprint:sha-256                           | [RFC8122]       |
   | 6B:8B:F0:65:5F:78:E2:51:3B:AC:6F:F3:3F:46:1B:35 |                 |
   | :DC:B8:5F:64:1A:24:C2:43:F0:A1:58:D0:A1:2C:19:0 |                 |
   | 8                                               |                 |
   | a=setup:active                                  | [RFC5763] - Bob |
   |                                                 | is the DTLS     |
   |                                                 | client          |
   | a=tls-id:9AIFS8AQ009IXF5D6QQUJ7P8BXPEZJ8G       | [I-D.ietf-mmusi |
   |                                                 | c-dtls-sdp]     |
   | a=rtcp-mux                                      | [RFC5761]       |
   | a=rtcp-rsize                                    | [RFC5506]       |
   | a=rtcp-fb:120 nack                              | [RFC4585]       |
   | a=rtcp-fb:120 nack pli                          | [RFC4585]       |
   | a=rtcp-fb:120 ccm fir                           | [RFC5104]       |
   | a=candidate:0 1 UDP 2122194687 198.51.100.7     | [I-D.ietf-mmusi |
   | 61556 typ host                                  | c-ice-sip-sdp]  |
   | a=candidate:1 1 UDP 1685987071 203.0.113.77     | [I-D.ietf-mmusi |
   | 58679 typ srflx raddr 198.51.100.7 rport 61556  | c-ice-sip-sdp]  |
   | a=end-of-candidates                             | [I-D.ietf-mmusi |
   |                                                 | c-trickle-ice]  |
   +-------------------------------------------------+-----------------+

                 Table 20: 5.2.9 SDP Answer without BUNDLE
```

#### 5.2.10. Audio, Video BUNDLED, but Data (Not BUNDLED)

This example show-cases SDP for negotiating a session with Audio, Video and data streams between Alice and Bob with data stream not being part of the BUNDLE group.  This is shown by assigning unique port for data media section and not adding the "mid" identification tag to the BUNDLE group.


```
          Audio, Video, with Data (Not in BUNDLE)

   Alice                                                 Bob
   |                                                      |
   |                                                      |
   |Alice wants to multiplex audio, video but not data    |
   |                                                      |
   |                                                      |
   |  Offer(Audio:Opus Video:VP8, Data(not in BUNDLE))    |
   |----------------------------------------------------->|
   |                                                      |
   |                                                      |
   |       Answer(Audio:Opus Video:VP8, Data)             |
   |<-----------------------------------------------------|
   |                                                      |
   |                                                      |
   |2 Way Call with Audio, Video Multiplexed except data  |
   |......................................................|
   |                                                      |
```


```
   +---------------------------------------------+---------------------+
   | Offer SDP Contents                          | RFC#/Notes          |
   +---------------------------------------------+---------------------+
   | v=0                                         | [RFC4566]           |
   | o=- 20518 0 IN IP4 0.0.0.0                  | [RFC4566]           |
   | s=-                                         | [RFC4566]           |
   | t=0 0                                       | [RFC4566]           |
   | a=group:BUNDLE audio video                  | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n] Alice wants to   |
   |                                             | BUNDLE only audio   |
   |                                             | and video media.    |
   | a=group:LS audio video                      | [RFC5888]           |
   | a=ice-options:trickle                       | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Audio m=line *********               | ******************* |
   |                                             | **********          |
   | m=audio 54609 UDP/TLS/RTP/SAVPF 109         | [RFC4566]           |
   | c=IN IP4 203.0.113.141                      | [RFC4566]           |
   | a=mid:audio                                 | [RFC5888]           |
   | a=msid:ma ta                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (ta)             |
   | a=sendrecv                                  | [RFC3264]           |
   | a=rtpmap:109 opus/48000/2                   | [RFC7587]           |
   | a=maxptime:120                              | [RFC4566]           |
   | a=ice-ufrag:074c6550                        | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=ice-pwd:a28a397a4c3f31747d1ee3474af08a068 | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=fingerprint:sha-256 19:E2:1C:3B:4B:9F:81: | [RFC8122]           |
   | E6:B8:5C:F4:A5:A8:D8:73:04:BB:05:2F:70:9F:0 |                     |
   | 4:A9:0E:05:E9:26:33:E8:70:88:A2             |                     |
   | a=setup:actpass                             | [RFC5763]           |
   | a=tls-id:89J2LRATQ3ULA24G9AHWVR31VJWSLB68   | [I-D.ietf-mmusic-dt |
   |                                             | ls-sdp]             |
   | a=rtcp-mux                                  | [RFC5761]           |
   | a=rtcp-mux-only                             | [I-D.ietf-mmusic-mu |
   |                                             | x-exclusive]        |
   | a=rtcp-rsize                                | [RFC5506]           |
   | a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc- | [RFC6464]           |
   | audio-level                                 |                     |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=candidate:0 1 UDP 2113667327 192.0.2.4    | [I-D.ietf-mmusic-ic |
   | 54609 typ host                              | e-sip-sdp]          |
   | a=end-of-candidates                         | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Video m=line *********               | ******************* |
   |                                             | **********          |
   | m=video 0 UDP/TLS/RTP/SAVPF 120             | [RFC4566]           |
   | c=IN IP4 203.0.113.141                      | [RFC4566]           |
   | a=bundle-only                               | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=mid:video                                 | [RFC5888]           |
   | a=msid:ma tb                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (tb)             |
   | a=sendrecv                                  | [RFC3264]           |
   | a=rtpmap:120 VP8/90000                      | [RFC7741]           |
   | a=rtcp-fb:120 nack                          | [RFC4585]           |
   | a=rtcp-fb:120 nack pli                      | [RFC4585]           |
   | a=rtcp-fb:120 ccm fir                       | [RFC5104]           |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | ****** Application m=line *********         | ******************* |
   |                                             | **********          |
   | m=application 10000 UDP/DTLS/SCTP webrtc-   | [I-D.ietf-rtcweb-da |
   | datachannel                                 | ta-channel]         |
   | c=IN IP4 203.0.113.141                      | [RFC4566]           |
   | a=mid:data                                  | [RFC5888]           |
   | a=sctp-port:5000                            | [I-D.ietf-mmusic-sc |
   |                                             | tp-sdp]             |
   | a=max-message-size:100000                   | [I-D.ietf-mmusic-sc |
   |                                             | tp-sdp]             |
   | a=sendrecv                                  | [RFC3264]           |
   | a=setup:actpass                             | [RFC5763]           |
   | a=tls-id:UKA29UQLTF69OJW4WNPNUO2Y0GF1FJOZ   | [I-D.ietf-mmusic-dt |
   |                                             | ls-sdp]             |
   | a=ice-ufrag:89819013                        | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=ice-pwd:1747d1ee3474af08a068a28a397a4c3f3 | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=fingerprint:sha-256 29:E2:1C:3B:4B:9F:81: | [RFC8122]           |
   | E6:B8:5C:F4:A5:A8:D8:73:04:BB:05:2F:70:9F:0 |                     |
   | 4:A9:0E:05:E9:26:33:E8:70:88:A2             |                     |
   | a=candidate:0 1 UDP 2113667327 192.0.2.4    | [I-D.ietf-mmusic-ic |
   | 10000 typ host                              | e-sip-sdp]          |
   | a=end-of-candidates                         | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   +---------------------------------------------+---------------------+

                        Table 21: 5.2.10 SDP Offer
```
```
   +---------------------------------------------+---------------------+
   | Answer SDP Contents                         | RFC#/Notes          |
   +---------------------------------------------+---------------------+
   | v=0                                         | [RFC4566]           |
   | o=-  16833 0 IN IP4 0.0.0.0                 | [RFC4566] - Session |
   |                                             | Origin Information  |
   | s=-                                         | [RFC4566]           |
   | t=0 0                                       | [RFC4566]           |
   | a=group:BUNDLE audio video                  | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=group:LS audio video                      | [RFC5888]           |
   | a=ice-options:trickle                       | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Audio m=line *********               | ******************* |
   |                                             | **********          |
   | m=audio 49203 UDP/TLS/RTP/SAVPF 109         | [RFC4566]           |
   | c=IN IP4 203.0.113.77                       | [RFC4566]           |
   | a=mid:audio                                 | [RFC5888]           |
   | a=msid:ma ta                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (ta)             |
   | a=sendrecv                                  | [RFC3264]           |
   | a=rtpmap:109 opus/48000/2                   | [RFC7587]           |
   | a=maxptime:120                              | [RFC4566]           |
   | a=ice-ufrag:c300d85b                        | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=ice-pwd:de4e99bd291c325921d5d47efbabd9a2  | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=fingerprint:sha-256 6B:8B:F0:65:5F:78:E2: | [RFC8122]           |
   | 51:3B:AC:6F:F3:3F:46:1B:35:DC:B8:5F:64:1A:2 |                     |
   | 4:C2:43:F0:A1:58:D0:A1:2C:19:08             |                     |
   | a=setup:active                              | [RFC5763]           |
   | a=tls-id:CJ6FF9ZZMJW7MDRJIR7XVIQM48GE1G31   | [I-D.ietf-mmusic-dt |
   |                                             | ls-sdp]             |
   | a=rtcp-mux                                  | [RFC5761]           |
   | a=rtcp-mux-only                             | [I-D.ietf-mmusic-mu |
   |                                             | x-exclusive]        |
   | a=rtcp-rsize                                | [RFC5506]           |
   | a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc- | [RFC6464]           |
   | audio-level                                 |                     |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=candidate:0 1 UDP 2113667327 198.51.100.7 | [I-D.ietf-mmusic-ic |
   | 49203 typ host                              | e-sip-sdp]          |
   | a=end-of-candidates                         | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Video m=line *********               | ******************* |
   |                                             | **********          |
   | m=video 0 UDP/TLS/RTP/SAVPF 120             | [RFC4566]           |
   | c=IN IP4 203.0.113.77                       | [RFC4566]           |
   | a=bundle-only                               | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=mid:video                                 | [RFC5888]           |
   | a=msid:ma tb                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (tb)             |
   | a=sendrecv                                  | [RFC3264]           |
   | a=rtpmap:120 VP8/90000                      | [RFC7741]           |
   | a=rtcp-fb:120 nack                          | [RFC4585]           |
   | a=rtcp-fb:120 nack pli                      | [RFC4585]           |
   | a=rtcp-fb:120 ccm fir                       | [RFC5104]           |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | ****** Application m=line *********         | ******************* |
   |                                             | **********          |
   | m=application 20000 UDP/DTLS/SCTP webrtc-   | [I-D.ietf-mmusic-sc |
   | datachannel                                 | tp-sdp]             |
   | c=IN IP4 203.0.113.77                       | [RFC4566]           |
   | a=mid:data                                  | [RFC5888]           |
   | a=sctp-port:5000                            | [I-D.ietf-mmusic-sc |
   |                                             | tp-sdp]             |
   | a=max-message-size:100000                   | [I-D.ietf-mmusic-sc |
   |                                             | tp-sdp]             |
   | a=setup:active                              | [RFC5763]           |
   | a=tls-id:9AIFS8AQ009IXF5D6QQUJ7P8BXPEZJ8G   | [I-D.ietf-mmusic-dt |
   |                                             | ls-sdp]             |
   | a=sendrecv                                  | [RFC3264]           |
   | a=ice-ufrag:991Ca2a5e                       | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=ice-pwd:921d5d47efbabd9a2de4e99bd291c325  | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=fingerprint:sha-256 7B:8B:F0:65:5F:78:E2: | [RFC8122]           |
   | 51:3B:AC:6F:F3:3F:46:1B:35:DC:B8:5F:64:1A:2 |                     |
   | 4:C2:43:F0:A1:58:D0:A1:2C:19:08             |                     |
   | a=candidate:0 1 UDP 2113667327 198.51.100.7 | [I-D.ietf-mmusic-ic |
   | 20000 typ host                              | e-sip-sdp]          |
   | a=end-of-candidates                         | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   +---------------------------------------------+---------------------+

                        Table 22: 5.2.10 SDP Answer
```

#### 5.2.11. Audio Only, Add Video to BUNDLE

This example involves 2 Offer/Answer exchanges.  First one is used to negotiate and setup BUNDLE support for Audio-only session followed by an updated Offer/Answer exchange to add video stream to the ongoing session.  Also the newly added video stream is BUNDLED with the audio stream.


```
            Audio Only , Add Video and BUNDLE

   Alice                                                 Bob
   |                                                      |
   |                                                      |
   |        Alice indicates support for BUNDLE            |
   |                                                      |
   |                Offer(Audio:Opus)                     |
   |----------------------------------------------------->|
   |                                                      |Bob
   |                                                      |supports
   |                                                      |BUNDLE
   |                Answer(Audio:Opus)                    |
   |<-----------------------------------------------------|
   |                                                      |Alice adds
   |                                                      |video stream
   |        Updated Offer(Audio:Opus, Video:VP8)          |to BUNDLE
   |----------------------------------------------------->|
   |                                                      |
   |                                                      |Bob accepts
   |        Updated Answer(Audio:Opus, Video:VP8)         |
   |<-----------------------------------------------------|
   |                                                      |
   |   2Way Call with Audio and Video Multiplexed         |
   |......................................................|
   |                                                      |
   |                                                      |
```
```
   +---------------------------------------------+---------------------+
   | Offer SDP Contents                          | RFC#/Notes          |
   +---------------------------------------------+---------------------+
   | v=0                                         | [RFC4566]           |
   | o=- 20518 0 IN IP4 0.0.0.0                  | [RFC4566]           |
   | s=-                                         | [RFC4566]           |
   | t=0 0                                       | [RFC4566]           |
   | a=group:BUNDLE audio                        | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n] Alice adds audio |
   |                                             | m=line to the       |
   |                                             | BUNDLE group        |
   | a=ice-options:trickle                       | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Audio m=line *********               | ******************* |
   |                                             | **********          |
   | m=audio 54609 UDP/TLS/RTP/SAVPF 109         | [RFC4566]           |
   | c=IN IP4 203.0.113.141                      | [RFC4566]           |
   | a=mid:audio                                 | [RFC5888]           |
   | a=msid:ma ta                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (ta)             |
   | a=sendrecv                                  | [RFC3264]           |
   | a=rtpmap:109 opus/48000/2                   | [RFC7587]           |
   | a=maxptime:120                              | [RFC4566]           |
   | a=ice-ufrag:074c6550                        | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=ice-pwd:a28a397a4c3f31747d1ee3474af08a068 | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=fingerprint:sha-256 19:E2:1C:3B:4B:9F:81: | [RFC8122]           |
   | E6:B8:5C:F4:A5:A8:D8:73:04:BB:05:2F:70:9F:0 |                     |
   | 4:A9:0E:05:E9:26:33:E8:70:88:A2             |                     |
   | a=setup:actpass                             | [RFC5763]           |
   | a=tls-id:89J2LRATQ3ULA24G9AHWVR31VJWSLB68   | [I-D.ietf-mmusic-dt |
   |                                             | ls-sdp]             |
   | a=rtcp-mux                                  | [RFC5761]           |
   | a=rtcp-mux-only                             | [I-D.ietf-mmusic-mu |
   |                                             | x-exclusive]        |
   | a=rtcp-rsize                                | [RFC5506]           |
   | a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc- | [RFC6464]           |
   | audio-level                                 |                     |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=candidate:0 1 UDP 2113667327 192.0.2.4    | [I-D.ietf-mmusic-ic |
   | 61665 typ host                              | e-sip-sdp]          |
   | a=candidate:1 1 UDP 694302207 203.0.113.141 | [I-D.ietf-mmusic-ic |
   | 54609 typ srflx raddr 192.0.2.4 rport 61665 | e-sip-sdp]          |
   | a=end-of-candidates                         | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   +---------------------------------------------+---------------------+

                        Table 23: 5.2.11 SDP Offer
```
```
   +---------------------------------------------+---------------------+
   | Answer SDP Contents                         | RFC#/Notes          |
   +---------------------------------------------+---------------------+
   | v=0                                         | [RFC4566]           |
   | o=-  16833 0 IN IP4 0.0.0.0                 | [RFC4566] - Session |
   |                                             | Origin Information  |
   | s=-                                         | [RFC4566]           |
   | t=0 0                                       | [RFC4566]           |
   | a=group:BUNDLE audio                        | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=ice-options:trickle                       | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Audio m=line *********               | ******************* |
   |                                             | **********          |
   | m=audio 49203 UDP/TLS/RTP/SAVPF 109         | [RFC4566]           |
   | c=IN IP4 203.0.113.77                       | [RFC4566]           |
   | a=mid:audio                                 | [RFC5888]           |
   | a=msid:ma ta                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (ta)             |
   | a=sendrecv                                  | [RFC3264]           |
   | a=rtpmap:109 opus/48000/2                   | [RFC7587]           |
   | a=maxptime:120                              | [RFC4566]           |
   | a=ice-ufrag:c300d85b                        | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=ice-pwd:de4e99bd291c325921d5d47efbabd9a2  | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=fingerprint:sha-256 6B:8B:F0:65:5F:78:E2: | [RFC8122]           |
   | 51:3B:AC:6F:F3:3F:46:1B:35:DC:B8:5F:64:1A:2 |                     |
   | 4:C2:43:F0:A1:58:D0:A1:2C:19:08             |                     |
   | a=setup:active                              | [RFC5763]           |
   | a=tls-id:CJ6FF9ZZMJW7MDRJIR7XVIQM48GE1G31   | [I-D.ietf-mmusic-dt |
   |                                             | ls-sdp]             |
   | a=rtcp-mux                                  | [RFC5761]           |
   | a=rtcp-mux-only                             | [I-D.ietf-mmusic-mu |
   |                                             | x-exclusive]        |
   | a=rtcp-rsize                                | [RFC5506]           |
   | a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc- | [RFC6464]           |
   | audio-level                                 |                     |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=candidate:0 1 UDP 2113667327 198.51.100.7 | [I-D.ietf-mmusic-ic |
   | 51556 typ host                              | e-sip-sdp]          |
   | a=candidate:1 1 UDP 1694302207 203.0.113.77 | [I-D.ietf-mmusic-ic |
   | 49203 typ srflx raddr 198.51.100.7 rport    | e-sip-sdp]          |
   | 51556                                       |                     |
   | a=end-of-candidates                         | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   +---------------------------------------------+---------------------+

                        Table 24: 5.2.10 SDP Answer
```
```
   +---------------------------------------------+---------------------+
   | Updated Offer SDP Contents                  | RFC#/Notes          |
   +---------------------------------------------+---------------------+
   | v=0                                         | Version number      |
   |                                             | incremented         |
   |                                             | [RFC4566]           |
   | o=- 20518 1 IN IP4 0.0.0.0                  | [RFC4566]           |
   | s=-                                         | [RFC4566]           |
   | t=0 0                                       | [RFC4566]           |
   | a=group:BUNDLE audio video                  | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=group:LS audio video                      | [RFC5888]           |
   | a=ice-options:trickle                       | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Audio m=line *********               | ******************* |
   |                                             | **********          |
   | m=audio 54609 UDP/TLS/RTP/SAVPF 109         | [RFC4566]           |
   | c=IN IP4 203.0.113.141                      | [RFC4566]           |
   | a=mid:audio                                 | [RFC5888]           |
   | a=msid:ma ta                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (ta)             |
   | a=sendrecv                                  | [RFC3264]           |
   | a=rtpmap:109 opus/48000/2                   | [RFC7587]           |
   | a=maxptime:120                              | [RFC4566]           |
   | a=ice-ufrag:074c6550                        | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=ice-pwd:a28a397a4c3f31747d1ee3474af08a068 | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=fingerprint:sha-256 19:E2:1C:3B:4B:9F:81: | [RFC8122]           |
   | E6:B8:5C:F4:A5:A8:D8:73:04:BB:05:2F:70:9F:0 |                     |
   | 4:A9:0E:05:E9:26:33:E8:70:88:A2             |                     |
   | a=setup:actpass                             | [RFC5763]           |
   | a=tls-id:89J2LRATQ3ULA24G9AHWVR31VJWSLB68   | [I-D.ietf-mmusic-dt |
   |                                             | ls-sdp]Alice want's |
   |                                             | to use the same     |
   |                                             | DTLS association    |
   | a=rtcp-mux                                  | [RFC5761]           |
   | a=rtcp-mux-only                             | [I-D.ietf-mmusic-mu |
   |                                             | x-exclusive]        |
   | a=rtcp-rsize                                | [RFC5506]           |
   | a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc- | [RFC6464]           |
   | audio-level                                 |                     |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=candidate:0 1 UDP 2113667327 192.0.2.4    | [I-D.ietf-mmusic-ic |
   | 61665 typ host                              | e-sip-sdp]          |
   | a=candidate:1 1 UDP 694302207 203.0.113.141 | [I-D.ietf-mmusic-ic |
   | 54609 typ srflx raddr 192.0.2.4 rport 61665 | e-sip-sdp]          |
   | a=end-of-candidates                         | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Video m=line *********               | ******************* |
   |                                             | **********          |
   | m=video 0 UDP/TLS/RTP/SAVPF 120             | [RFC4566]           |
   | c=IN IP4 203.0.113.141                      | [RFC4566]           |
   | a=bundle-only                               | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=mid:video                                 | [RFC5888]           |
   | a=msid:ma tb                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (tb)             |
   | a=sendrecv                                  | [RFC3264]           |
   | a=rtpmap:120 VP8/90000                      | [RFC7741]           |
   | a=rtcp-fb:120 nack                          | [RFC4585]           |
   | a=rtcp-fb:120 nack pli                      | [RFC4585]           |
   | a=rtcp-fb:120 ccm fir                       | [RFC5104]           |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   +---------------------------------------------+---------------------+

                    Table 25: 5.2.11 SDP Updated Offer
```
```
   +---------------------------------------------+---------------------+
   | Updated Answer SDP Contents                 | RFC#/Notes          |
   +---------------------------------------------+---------------------+
   | v=0                                         | [RFC4566] Version   |
   |                                             | number incremented  |
   | o=-  16833 1 IN IP4 0.0.0.0                 | [RFC4566] - Session |
   |                                             | Origin Information  |
   | s=-                                         | [RFC4566]           |
   | t=0 0                                       | [RFC4566]           |
   | a=group:BUNDLE audio video                  | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=group:LS audio video                      | [RFC5888]           |
   | a=ice-options:trickle                       | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Audio m=line *********               | ******************* |
   |                                             | **********          |
   | m=audio 49203 UDP/TLS/RTP/SAVPF 109         | [RFC4566]           |
   | c=IN IP4 203.0.113.77                       | [RFC4566]           |
   | a=mid:audio                                 | [RFC5888]           |
   | a=msid:ma ta                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (ta)             |
   | a=sendrecv                                  | [RFC3264]           |
   | a=rtpmap:109 opus/48000/2                   | [RFC7587]           |
   | a=maxptime:120                              | [RFC4566]           |
   | a=ice-ufrag:c300d85b                        | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=ice-pwd:de4e99bd291c325921d5d47efbabd9a2  | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=fingerprint:sha-256 6B:8B:F0:65:5F:78:E2: | [RFC8122]           |
   | 51:3B:AC:6F:F3:3F:46:1B:35:DC:B8:5F:64:1A:2 |                     |
   | 4:C2:43:F0:A1:58:D0:A1:2C:19:08             |                     |
   | a=setup:active                              | [RFC5763]           |
   | a=tls-id:CJ6FF9ZZMJW7MDRJIR7XVIQM48GE1G31   | [I-D.ietf-mmusic-dt |
   |                                             | ls-sdp] - Bob       |
   |                                             | agrees to use the   |
   |                                             | same DTLS           |
   |                                             | association         |
   | a=rtcp-mux                                  | [RFC5761]           |
   | a=rtcp-mux-only                             | [I-D.ietf-mmusic-mu |
   |                                             | x-exclusive]        |
   | a=rtcp-rsize                                | [RFC5506]           |
   | a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc- | [RFC6464]           |
   | audio-level                                 |                     |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=candidate:0 1 UDP 2113667327 198.51.100.7 | [I-D.ietf-mmusic-ic |
   | 51556 typ host                              | e-sip-sdp]          |
   | a=candidate:1 1 UDP 1694302207 203.0.113.77 | [I-D.ietf-mmusic-ic |
   | 49203 typ srflx raddr 198.51.100.7 rport    | e-sip-sdp]          |
   | 51556                                       |                     |
   | a=end-of-candidates                         | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Video m=line *********               | ******************* |
   |                                             | **********          |
   | m=video 0 UDP/TLS/RTP/SAVPF 120             | [RFC4566]           |
   | c=IN IP4 203.0.113.77                       | [RFC4566]           |
   | a=bundle-only                               | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=mid:video                                 | [RFC5888]           |
   | a=msid:ma tb                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (tb)             |
   | a=sendrecv                                  | [RFC3264]           |
   | a=rtpmap:120 VP8/90000                      | [RFC7741]           |
   | a=rtcp-fb:120 nack                          | [RFC4585]           |
   | a=rtcp-fb:120 nack pli                      | [RFC4585]           |
   | a=rtcp-fb:120 ccm fir                       | [RFC5104]           |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   +---------------------------------------------+---------------------+

                    Table 26: 5.2.11 SDP Updated Answer
```

### 5.3. MultiResolution, RTX, FEC Examples

This section provides examples related to multi-source, multi-stream negotiation such as layered coding, simulcast.  Further included are few examples that cover techniques to deal with providing robustness against transmission errors such as FEC and RTX.  Also to note, mechanisms such as FEC and RTX could be envisioned in the above basic scenarios as well.

#### 5.3.1. Sendonly Simulcast Session with 2 cameras and 2 encodings per camera

The SDP below shows Offer/Answer exchange with one audio and two video sources (say 2 video cameras).  Each of the video source can be sent at two different resolutions.

One video source corresponds to VP8 encoding, while the other corresponds to H.264 encoding.

[I-D.ietf-mmusic-rid] framework is used to further constrain the media format encodings and map the payload types (PT) to the 'rid' identifiers.

[I-D.ietf-mmusic-sdp-simulcast] framework identifies the simulcast streams via their 'rid' identifiers.

bundle-only attribute is used for the video sources in the Offer to ensure enabling video sources in the context of BUNDLE alone.

BUNDLE grouping framework enables multiplexing of all the 5 Source RTP Streams (1 audio stream + 4 video streams) over a single RTP Session.

Also, the audio and one video source RTP stream form a lip sync group while the other video source RTP stream represents a non-interactive media data.


```
          1 Way Successful Simulcast w/BUNDLE

   Alice                                            Bob
   |                                                 |
   |                                                 |
   |     Alice offers 2 sendonly video sources       |
   |     with 2 simulcast encodings per source       |
   |           and bundle-only for video             |
   |                                                 |
   |                                                 |
   |   Offer(Audio:Opus,Video1:VP8,Video2:H.264)     |
   |------------------------------------------------>|
   |                                                 |
   |                                                 |
   |    Answer(Audio:Opus Video1:VP8,Video2:H.264)   |
   |<------------------------------------------------|
   |                                                 |
   |One-Way 1 Opus, 2 H.264 and 2 VP8 video streams, |
   | all multiplexed                                 |
   |.................................................|
   |                                                 |
   |                                                 |
```


```
   +---------------------------------------------+---------------------+
   | Offer SDP Contents                          | RFC#/Notes          |
   +---------------------------------------------+---------------------+
   | v=0                                         | [RFC4566]           |
   | o=- 20519 0 IN IP4 0.0.0.0                  | [RFC4566]           |
   | s=-                                         | [RFC4566]           |
   | t=0 0                                       | [RFC4566]           |
   | a=group:BUNDLE m0 m1 m2                     | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n] Alice supports   |
   |                                             | grouping of m=lines |
   |                                             | under BUNDLE        |
   |                                             | semantics           |
   | a=group:LS m0 m1                            | [RFC5888]           |
   | a=ice-options:trickle                       | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Audio m=line *********               | ******************* |
   |                                             | **********          |
   | m=audio 54609 UDP/TLS/RTP/SAVPF 109         | [RFC4566]           |
   | c=IN IP4 203.0.113.141                      | [RFC4566]           |
   | a=mid:m0                                    | [RFC5888]           |
   | a=msid:ma ta                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (ta)             |
   | a=sendonly                                  | [RFC3264]           |
   | a=rtpmap:109 opus/48000/2                   | [RFC7587]           |
   | a=maxptime:120                              | [RFC4566]           |
   | a=ice-ufrag:074c6550                        | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=ice-pwd:a28a397a4c3f31747d1ee3474af08a068 | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=fingerprint:sha-256 19:E2:1C:3B:4B:9F:81: | [RFC8122]           |
   | E6:B8:5C:F4:A5:A8:D8:73:04:BB:05:2F:70:9F:0 |                     |
   | 4:A9:0E:05:E9:26:33:E8:70:88:A2             |                     |
   | a=setup:actpass                             | [RFC5763]           |
   | a=tls-id:89J2LRATQ3ULA24G9AHWVR31VJWSLB68   | [I-D.ietf-mmusic-dt |
   |                                             | ls-sdp]             |
   | a=rtcp-mux                                  | [RFC5761]           |
   | a=rtcp-rsize                                | [RFC5506]           |
   | a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc- | [RFC6464]           |
   | audio-level                                 |                     |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=candidate:0 1 UDP 2113667327 192.0.2.4    | [I-D.ietf-mmusic-ic |
   | 61665 typ host                              | e-sip-sdp]          |
   | a=candidate:1 1 UDP 694302207 203.0.113.141 | [I-D.ietf-mmusic-ic |
   | 54609 typ srflx raddr 192.0.2.4 rport 61665 | e-sip-sdp]          |
   | a=end-of-candidates                         | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Video-1 m=line *********             | ******************* |
   |                                             | **********          |
   | m=video 0 UDP/TLS/RTP/SAVPF 98 100          | bundle-only video   |
   |                                             | line with port      |
   |                                             | number set to zero  |
   | c=IN IP4 203.0.113.141                      | [RFC4566]           |
   | a=bundle-only                               | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=mid:m1                                    | [RFC5888] Video     |
   |                                             | m=line part of      |
   |                                             | BUNDLE group        |
   | a=msid:ma tb                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (tb)             |
   | a=sendonly                                  | [RFC3264] - Send    |
   |                                             | only video stream   |
   | a=rtpmap:98 VP8/90000                       | [RFC7741]           |
   | a=fmtp:98 max-fr=30                         | [RFC4566]           |
   | a=rtpmap:100 VP8/90000                      | [RFC7741]           |
   | a=fmtp:100 max-fr=15                        | [RFC4566]           |
   | a=rtcp-fb:* nack                            | [RFC4585]           |
   | a=rtcp-fb:* nack pli                        | [RFC4585]           |
   | a=rtcp-fb:* ccm fir                         | [RFC5104]           |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=extmap:3 urn:ietf:params:rtp-             | [I-D.ietf-avtext-ri |
   | hdrext:sdes:rtp-stream-id                   | d]                  |
   | a=rid:1 send pt=98;max-width=1280;max-      | [I-D.ietf-mmusic-ri |
   | height=720                                  | d] 1:1 rid mapping  |
   |                                             | to payload type and |
   |                                             | specify resolution  |
   |                                             | constraints         |
   | a=rid:2 send pt=100;max-width=640;max-      | [I-D.ietf-mmusic-ri |
   | height=480                                  | d] 1:1 rid mapping  |
   |                                             | to payload type and |
   |                                             | specify resolution  |
   |                                             | constraints         |
   | a=simulcast:send 1;~2                       | [I-D.ietf-mmusic-sd |
   |                                             | p-simulcast] Alice  |
   |                                             | can send 2          |
   |                                             | resolutions         |
   |                                             | identified by the   |
   |                                             | 'rid' identifiers   |
   |                                             | Also, the second    |
   |                                             | stream is initially |
   |                                             | paused.             |
   | ****** Video-2 m=line *********             | ******************* |
   |                                             | **********          |
   | m=video 0 UDP/TLS/RTP/SAVPF 101 102         | bundle-only video   |
   |                                             | line with port      |
   |                                             | number set to zero  |
   | c=IN IP4 203.0.113.141                      | [RFC4566]           |
   | a=bundle-only                               | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=mid:m2                                    | [RFC5888] Video     |
   |                                             | m=line part of      |
   |                                             | BUNDLE group        |
   | a=msid:ma tc                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (tc)             |
   | a=sendonly                                  | [RFC3264] - Send    |
   |                                             | only video stream   |
   | a=rtpmap:101 H264/90000                     | [RFC6184]           |
   | a=rtpmap:102 H264/90000                     | [RFC6184]           |
   | a=fmtp:101 profile-level-                   | [RFC6184]Camera-2,E |
   | id=42401f;packetization-mode=0;max-fr=30    | ncoding-1           |
   | a=fmtp:102 profile-level-                   | [RFC6184]Camera-2,E |
   | id=42401f;packetization-mode=1;max-fr=15    | ncoding-2           |
   | a=rtcp-fb:* nack                            | [RFC4585]           |
   | a=rtcp-fb:* nack pli                        | [RFC4585]           |
   | a=rtcp-fb:* ccm fir                         | [RFC5104]           |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=extmap:3 urn:ietf:params:rtp-             | [I-D.ietf-avtext-ri |
   | hdrext:sdes:rtp-stream-id                   | d]                  |
   | a=rid:3 send pt=101;max-width=1280;max-     | [I-D.ietf-mmusic-ri |
   | height=720                                  | d] 1:1 rid mapping  |
   |                                             | to payload type and |
   |                                             | specify resolution  |
   |                                             | constraints         |
   | a=rid:4 send pt=102;max-width=640;max-      | [I-D.ietf-mmusic-ri |
   | height=360                                  | d] 1:1 rid mapping  |
   |                                             | to payload type and |
   |                                             | specify resolution  |
   |                                             | constraints         |
   | a=simulcast:send 3;4                        | [I-D.ietf-mmusic-sd |
   |                                             | p-simulcast] Alice  |
   |                                             | can send 2          |
   |                                             | resolutions         |
   |                                             | identified by the   |
   |                                             | 'rid' identifiers   |
   +---------------------------------------------+---------------------+

                         Table 27: 5.3.1 SDP Offer
```
```
   +---------------------------------------------+---------------------+
   | Answer SDP Contents                         | RFC#/Notes          |
   +---------------------------------------------+---------------------+
   | v=0                                         | [RFC4566]           |
   | o=- 20519 0 IN IP4 0.0.0.0                  | [RFC4566]           |
   | s=-                                         | [RFC4566]           |
   | t=0 0                                       | [RFC4566]           |
   | a=group:BUNDLE m0 m1 m2                     | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n] Alice supports   |
   |                                             | grouping of m=lines |
   |                                             | under BUNDLE        |
   |                                             | semantics           |
   | a=group:LS m0 m1                            | [RFC5888]           |
   | a=ice-options:trickle                       | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Audio m=line *********               | ******************* |
   |                                             | **********          |
   | m=audio 49203 UDP/TLS/RTP/SAVPF 109         | [RFC4566]           |
   | c=IN IP4 203.0.113.77                       | [RFC4566]           |
   | a=mid:m0                                    | [RFC5888]           |
   | a=msid:ma ta                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (ta)             |
   | a=recvonly                                  | [RFC3264]           |
   | a=rtpmap:109 opus/48000/2                   | [RFC7587]           |
   | a=maxptime:120                              | [RFC4566]           |
   | a=ice-ufrag:c300d85b                        | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=ice-pwd:de4e99bd291c325921d5d47efbabd9a2  | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=fingerprint:sha-256 6B:8B:F0:65:5F:78:E2: | [RFC8122]           |
   | 51:3B:AC:6F:F3:3F:46:1B:35:DC:B8:5F:64:1A:2 |                     |
   | 4:C2:43:F0:A1:58:D0:A1:2C:19:08             |                     |
   | a=setup:active                              | [RFC5763]           |
   | a=tls-id:CJ6FF9ZZMJW7MDRJIR7XVIQM48GE1G31   | [I-D.ietf-mmusic-dt |
   |                                             | ls-sdp]             |
   | a=rtcp-mux                                  | [RFC5761]           |
   | a=rtcp-rsize                                | [RFC5506]           |
   | a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc- | [RFC6464]           |
   | audio-level                                 |                     |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=candidate:0 1 UDP 2113667327 198.51.100.7 | [I-D.ietf-mmusic-ic |
   | 61665 typ host                              | e-sip-sdp]          |
   | a=candidate:1 1 UDP 694302207 203.0.113.77  | [I-D.ietf-mmusic-ic |
   | 49203 typ srflx raddr 198.51.100.7 rport    | e-sip-sdp]          |
   | 61665                                       |                     |
   | a=end-of-candidates                         | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Video-1 m=line *********             | ******************* |
   |                                             | **********          |
   | m=video 0 UDP/TLS/RTP/SAVPF 98 100          | BUNDLE accepted     |
   | c=IN IP4 203.0.113.77                       | [RFC4566]           |
   | a=bundle-only                               | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=mid:m1                                    | [RFC5888] Video     |
   |                                             | m=line part of      |
   |                                             | BUNDLE group        |
   | a=msid:ma tb                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (tb)             |
   | a=recvonly                                  | [RFC3264] - receive |
   |                                             | only video stream   |
   | a=rtpmap:98 VP8/90000                       | [RFC7741]           |
   | a=rtpmap:100 VP8/90000                      | [RFC7741]           |
   | a=fmtp:98 max-fr=30                         | [RFC4566]           |
   | a=fmtp:100 max-fr=15                        | [RFC4566]           |
   | a=rtcp-fb:* nack                            | [RFC4585]           |
   | a=rtcp-fb:* nack pli                        | [RFC4585]           |
   | a=rtcp-fb:* ccm fir                         | [RFC5104]           |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=extmap:3 urn:ietf:params:rtp-             | [I-D.ietf-avtext-ri |
   | hdrext:sdes:rtp-stream-id                   | d]                  |
   | a=rid:1 recv pt=98;max-width=1280;max-      | [I-D.ietf-mmusic-ri |
   | height=720                                  | d] Bob accepts the  |
   |                                             | offered payload     |
   |                                             | format constraints  |
   | a=rid:2 recv pt=100;max-width=640;max-      | [I-D.ietf-mmusic-ri |
   | height=480                                  | d] Bob accepts the  |
   |                                             | offered payload     |
   |                                             | format constraints  |
   | a=simulcast:recv 1;2                        | [I-D.ietf-mmusic-sd |
   |                                             | p-simulcast] Bob    |
   |                                             | accepts the offered |
   |                                             | simulcast streams   |
   |                                             | and removes the     |
   |                                             | paused state of     |
   |                                             | stream with 'rid'   |
   |                                             | value 2.            |
   | ****** Video-2 m=line *********             | ******************* |
   |                                             | **********          |
   | m=video 0 UDP/TLS/RTP/SAVPF 101 102         | BUNDLE accepted     |
   | c=IN IP4 203.0.113.77                       | [RFC4566]           |
   | a=bundle-only                               | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=mid:m2                                    | [RFC5888] Video     |
   |                                             | m=line part of      |
   |                                             | BUNDLE group        |
   | a=msid:ma tc                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (tc)             |
   | a=recvonly                                  | [RFC3264]           |
   | a=rtpmap:101 H264/90000                     | [RFC6184]           |
   | a=rtpmap:102 H264/90000                     | [RFC6184]           |
   | a=fmtp:101 profile-level-                   | [RFC6184]           |
   | id=42401f;packetization-mode=1;max-fr=30    |                     |
   | a=fmtp:102 profile-level-                   | [RFC6184]           |
   | id=42401f;packetization-mode=1;max-fr=15    |                     |
   | a=rtcp-fb:* nack                            | [RFC4585]           |
   | a=rtcp-fb:* nack pli                        | [RFC4585]           |
   | a=rtcp-fb:* ccm fir                         | [RFC5104]           |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=extmap:3 urn:ietf:params:rtp-             | [I-D.ietf-avtext-ri |
   | hdrext:sdes:rtp-stream-id                   | d]                  |
   | a=rid:3 recv pt=101;max-width=1280;max-     | [I-D.ietf-mmusic-ri |
   | height=720                                  | d] Bob accepts the  |
   |                                             | offered payload     |
   |                                             | format constraints  |
   | a=rid:4 recv pt=102;max-width=640;max-      | [I-D.ietf-mmusic-ri |
   | height=360                                  | d] Bob accepts the  |
   |                                             | offered payload     |
   |                                             | format constraints  |
   | a=simulcast:recv 3;4                        | [I-D.ietf-mmusic-sd |
   |                                             | p-simulcast] Bob    |
   |                                             | accepts the offered |
   |                                             | simulcast streams.  |
   +---------------------------------------------+---------------------+

                        Table 28: 5.3.1 SDP Answer
```

#### 5.3.2. Successful SVC Video Session

This section shows an SDP Offer/Answer for a session with an audio and a single video source.  The video source being encoded both as non-scalable and scalable H.264-SVC RTP stream (in the SST mode).

The Answerer picks the payload type corresponding to scalable encoding.


```
          SVC Session - 3 Layers w/BUNDLE

  Alice                                            Bob
  |                                                 |
  |                                                 |
  |      Alice offers sendonly video stream         |
  |      with non-scalable and scalable encodings.  |
  |                                                 |
  |                                                 |
  |            Offer(Video:H.264/H.264-SVC)         |
  |------------------------------------------------>|
  |                                                 |
  |                                                 |Bob accepts Alice's
  |                                                 |offered Codec
  |                                                 |operation points
  |                                                 |
  |             Answer(Video:H.264-SVC)             |
  |<------------------------------------------------|
  |                                                 |
  |One-Way  H.264-SVC video streams                 |
  |.................................................|
  |                                                 |
  |                                                 |
```


```
   +---------------------------------------------+---------------------+
   | Offer SDP Contents                          | RFC#/Notes          |
   +---------------------------------------------+---------------------+
   | v=0                                         | [RFC4566]           |
   | o=- 20519 0 IN IP4 0.0.0.0                  | [RFC4566]           |
   | s=-                                         | [RFC4566]           |
   | t=0 0                                       | [RFC4566]           |
   | a=group:BUNDLE m0 m1                        | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n] Alice supports   |
   |                                             | grouping of m=lines |
   |                                             | under BUNDLE        |
   |                                             | semantics           |
   | a=group:LS m0 m1                            | [RFC5888]           |
   | a=ice-options:trickle                       | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Audio m=line *********               | ******************* |
   |                                             | **********          |
   | m=audio 54609 UDP/TLS/RTP/SAVPF 109         | [RFC4566]           |
   | c=IN IP4 203.0.113.141                      | [RFC4566]           |
   | a=mid:m0                                    | [RFC5888] Audio     |
   |                                             | m=line part of      |
   |                                             | BUNDLE group with a |
   |                                             | unique port number  |
   | a=msid:ma ta                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (ta)             |
   | a=sendonly                                  | [RFC3264]           |
   | a=rtpmap:109 opus/48000/2                   | [RFC7587]           |
   | a=maxptime:120                              | [RFC4566]           |
   | a=ice-ufrag:074c6550                        | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=ice-pwd:a28a397a4c3f31747d1ee3474af08a068 | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=fingerprint:sha-256 19:E2:1C:3B:4B:9F:81: | [RFC8122]           |
   | E6:B8:5C:F4:A5:A8:D8:73:04:BB:05:2F:70:9F:0 |                     |
   | 4:A9:0E:05:E9:26:33:E8:70:88:A2             |                     |
   | a=setup:actpass                             | [RFC5763]           |
   | a=tls-id:89J2LRATQ3ULA24G9AHWVR31VJWSLB68   | [I-D.ietf-mmusic-dt |
   |                                             | ls-sdp]             |
   | a=rtcp-mux                                  | [RFC5761]           |
   | a=rtcp-rsize                                | [RFC5506]           |
   | a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc- | [RFC6464]           |
   | audio-level                                 |                     |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=candidate:0 1 UDP 2113667327 192.0.2.4    | [I-D.ietf-mmusic-ic |
   | 61665 typ host                              | e-sip-sdp]          |
   | a=candidate:1 1 UDP 694302207 203.0.113.141 | [I-D.ietf-mmusic-ic |
   | 54609 typ srflx raddr 192.0.2.4 rport 61665 | e-sip-sdp]          |
   | a=end-of-candidates                         | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Video m=line *********               | ******************* |
   |                                             | **********          |
   | m=video 0 UDP/TLS/RTP/SAVPF 96 100          | bundle-only video   |
   |                                             | line with port      |
   |                                             | number set to zero  |
   | c=IN IP4 203.0.113.141                      | [RFC4566]           |
   | a=bundle-only                               | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=mid:m1                                    | [RFC5888] Video     |
   |                                             | m=line part of      |
   |                                             | BUNDLE group        |
   | a=msid:ma tb                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (tc)             |
   | a=sendonly                                  | [RFC3264] - Send    |
   |                                             | only video stream   |
   | a=rtpmap:96 H264/90000                      | [RFC6184]           |
   | a=fmtp:96 profile-level-id=4d0028;          | [RFC6184]H.264 Non  |
   | packetization-mode=1;max-fr=30;max-fs=8040  | Scalable            |
   | a=rtpmap:100 H264-SVC/90000                 | [RFC6190]           |
   | a=fmtp:100 profile-level-                   | [RFC6190] H.264     |
   | id=53001f;packetization-mode=0              | Scalable Encoding   |
   | a=rtcp-fb:* nack                            | [RFC4585]           |
   | a=rtcp-fb:* nack pli                        | [RFC4585]           |
   | a=rtcp-fb:* ccm fir                         | [RFC5104]           |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   +---------------------------------------------+---------------------+

                    Table 29: 5.3.2 SDP Offer with SVC
```
```
   +---------------------------------------------+---------------------+
   | Answer SDP Contents                         | RFC#/Notes          |
   +---------------------------------------------+---------------------+
   | v=0                                         | [RFC4566]           |
   | o=- 20519 0 IN IP4 0.0.0.0                  | [RFC4566]           |
   | s=-                                         | [RFC4566]           |
   | t=0 0                                       | [RFC4566]           |
   | a=group:BUNDLE m0 m1                        | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=group:LS m0 m1                            | [RFC5888]           |
   | a=ice-options:trickle                       | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Audio m=line *********               | ******************* |
   |                                             | **********          |
   | m=audio 49203 UDP/TLS/RTP/SAVPF 109         | [RFC4566]           |
   | c=IN IP4 203.0.113.77                       | [RFC4566]           |
   | a=mid:m0                                    | [RFC5888]           |
   | a=msid:ma ta                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (ta)             |
   | a=recvonly                                  | [RFC3264]           |
   | a=rtpmap:109 opus/48000/2                   | [RFC7587]           |
   | a=maxptime:120                              | [RFC4566]           |
   | a=ice-ufrag:074c6550                        | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=ice-pwd:a28a397a4c3f31747d1ee3474af08a068 | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=fingerprint:sha-256 6B:8B:F0:65:5F:78:E2: | [RFC8122]           |
   | 51:3B:AC:6F:F3:3F:46:1B:35:DC:B8:5F:64:1A:2 |                     |
   | 4:C2:43:F0:A1:58:D0:A1:2C:19:08             |                     |
   | a=setup:active                              | [RFC5763]           |
   | a=tls-id:CJ6FF9ZZMJW7MDRJIR7XVIQM48GE1G31   | [I-D.ietf-mmusic-dt |
   |                                             | ls-sdp]             |
   | a=rtcp-mux                                  | [RFC5761]           |
   | a=rtcp-rsize                                | [RFC5506]           |
   | a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc- | [RFC6464]           |
   | audio-level                                 |                     |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=candidate:0 1 UDP 2113667326 198.51.100.7 | [I-D.ietf-mmusic-ic |
   | 51556 typ host                              | e-sip-sdp]          |
   | a=candidate:1 1 UDP 1694302206 203.0.113.77 | [I-D.ietf-mmusic-ic |
   | 49203 typ srflx raddr 198.51.100.7 rport    | e-sip-sdp]          |
   | 51556                                       |                     |
   | a=end-of-candidates                         | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Video m=line *********               | ******************* |
   |                                             | **********          |
   | m=video 0 UDP/TLS/RTP/SAVPF 100             | BUNDLE accepted.    |
   | c=IN IP4 203.0.113.77                       | [RFC4566]           |
   | a=bundle-only                               | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=mid:m1                                    | [RFC5888] Video     |
   |                                             | m=line part of      |
   |                                             | BUNDLE group        |
   | a=msid:ma tb                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (tb)             |
   | a=recvonly                                  | [RFC3264] - Receive |
   |                                             | only video stream   |
   | a=rtpmap:100 H264-SVC/90000                 | [RFC6190]           |
   | a=fmtp:100 profile-level-                   | [RFC6190]           |
   | id=53001f;packetization-mode=0              |                     |
   | a=rtcp-fb:* nack                            | [RFC4585]           |
   | a=rtcp-fb:* nack pli                        | [RFC4585]           |
   | a=rtcp-fb:* ccm fir                         | [RFC5104]           |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   +---------------------------------------------+---------------------+

                    Table 30: 5.3.2 SDP Answer with SVC
```

#### 5.3.3. Successful Simulcast Video Session with Retransmission

This section shows an SDP Offer/Answer exchange for a simulcast scenario with 3 resolutions and has [RFC4588] style re-transmission flows.

[I-D.ietf-mmusic-rid] framework is used to specify all the (3) resolution constraints mapped to a single Payload Type (98).

[I-D.ietf-mmusic-sdp-simulcast] framework identifies the simulcast streams via their 'rid' identifiers.


```
           Simulcast Streams with Retransmission

   Alice                                                    Bob
   |                                                         |
   |                                                         |
   |Alice offers single audio and simulcasted video streams  |
   |                                                         |
   |                                                         |
   |    Offer(Audio:Opus Video:VP8 with 3 resolutions)       |
   |    & RTX stream                                         |
   |-------------------------------------------------------->|
   |                                                         |
   |                                                         |
   |          Answer (Bob accepts Alice's offer)             |
   |<--------------------------------------------------------|
   |                                                         |
   |                                                         |
   |One-Way 1 Opus, 3 VP8 and RTX video streams,all muxed    |
   |.........................................................|
   |                                                         |
   |                                                         |
```
```
   +---------------------------------------------+---------------------+
   | Offer SDP Contents                          | RFC#/Notes          |
   +---------------------------------------------+---------------------+
   | v=0                                         | [RFC4566]           |
   | o=- 20519 0 IN IP4 0.0.0.0                  | [RFC4566]           |
   | s=-                                         | [RFC4566]           |
   | t=0 0                                       | [RFC4566]           |
   | a=group:BUNDLE m0 m1                        | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n] Alice supports   |
   |                                             | grouping of m=lines |
   |                                             | under BUNDLE        |
   |                                             | semantics           |
   | a=group:LS m0 m1                            | [RFC5888]           |
   | a=ice-options:trickle                       | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Audio m=line *********               | ******************* |
   |                                             | **********          |
   | m=audio 54609 UDP/TLS/RTP/SAVPF 109         | [RFC4566]           |
   | c=IN IP4 203.0.113.141                      | [RFC4566]           |
   | a=mid:m0                                    | [RFC5888] Audio     |
   |                                             | m=line part of      |
   |                                             | BUNDLE group with a |
   |                                             | unique port number  |
   | a=msid:ma ta                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (ta)             |
   | a=sendonly                                  | [RFC3264]           |
   | a=rtpmap:109 opus/48000/2                   | [RFC7587]           |
   | a=maxptime:120                              | [RFC4566]           |
   | a=ice-ufrag:074c6550                        | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=ice-pwd:a28a397a4c3f31747d1ee3474af08a068 | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=fingerprint:sha-256 19:E2:1C:3B:4B:9F:81: | [RFC8122]           |
   | E6:B8:5C:F4:A5:A8:D8:73:04:BB:05:2F:70:9F:0 |                     |
   | 4:A9:0E:05:E9:26:33:E8:70:88:A2             |                     |
   | a=setup:actpass                             | [RFC5763]           |
   | a=tls-id:89J2LRATQ3ULA24G9AHWVR31VJWSLB68   | [I-D.ietf-mmusic-dt |
   |                                             | ls-sdp]             |
   | a=rtcp-mux                                  | [RFC5761]           |
   | a=rtcp-rsize                                | [RFC5506]           |
   | a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc- | [RFC6464]           |
   | audio-level                                 |                     |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=candidate:0 1 UDP 2113667327 192.0.2.4    | [I-D.ietf-mmusic-ic |
   | 61665 typ host                              | e-sip-sdp]          |
   | a=candidate:1 1 UDP 694302207 203.0.113.141 | [I-D.ietf-mmusic-ic |
   | 54609 typ srflx raddr 192.0.2.4 rport 61665 | e-sip-sdp]          |
   | a=end-of-candidates                         | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Video m=line *********               | ******************* |
   |                                             | **********          |
   | m=video 0 UDP/TLS/RTP/SAVPF 98 103          | bundle-only video   |
   |                                             | line with port      |
   |                                             | number set to zero  |
   | c=IN IP4 203.0.113.141                      | [RFC4566]           |
   | a=bundle-only                               | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=mid:m1                                    | [RFC5888]           |
   | a=msid:ma tb                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (tb)             |
   | a=sendonly                                  | [RFC3264]           |
   | a=rtpmap:98 VP8/90000                       | [RFC7741]           |
   | a=fmtp:98 max-fr=30                         | [RFC4566]           |
   | a=rtpmap:103 rtx/90000                      | [RFC4588]           |
   | a=fmtp:103 apt=98;rtx-time=200              | [RFC4588]           |
   | a=rtcp-fb:* nack                            | [RFC4585]           |
   | a=rtcp-fb:* nack pli                        | [RFC4585]           |
   | a=rtcp-fb:* ccm fir                         | [RFC5104]           |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=extmap:3 urn:ietf:params:rtp-             | [I-D.ietf-avtext-ri |
   | hdrext:sdes:rtp-stream-id                   | d]                  |
   | a=extmap:4 urn:ietf:params:rtp-             | [I-D.ietf-avtext-ri |
   | hdrext:sdes:repaired-rtp-stream-id          | d]                  |
   | a=rid:1 send pt=98;max-fs=921600;max-fr=30  | [I-D.ietf-mmusic-ri |
   |                                             | d]                  |
   | a=rid:2 send pt=98;max-fs=614400;max-fr=15  | [I-D.ietf-mmusic-ri |
   |                                             | d]                  |
   | a=rid:3 send pt=98;max-fs=230400;max-fr=30  | [I-D.ietf-mmusic-ri |
   |                                             | d]                  |
   | a=simulcast:send 1;2;3                      | [I-D.ietf-mmusic-sd |
   |                                             | p-simulcast] Alice  |
   |                                             | can send all the    |
   |                                             | simulcast streams   |
   +---------------------------------------------+---------------------+

                Table 31: 5.3.3 SDP Offer w/Simulcast, RTX
```
```
   +---------------------------------------------+---------------------+
   | Answer SDP Contents                         | RFC#/Notes          |
   +---------------------------------------------+---------------------+
   | v=0                                         | [RFC4566]           |
   | o=- 20519 0 IN IP4 0.0.0.0                  | [RFC4566]           |
   | s=-                                         | [RFC4566]           |
   | t=0 0                                       | [RFC4566]           |
   | a=group:BUNDLE m0 m1                        | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n] Bob supports     |
   |                                             | grouping of m=lines |
   |                                             | under BUNDLE        |
   |                                             | semantics           |
   | a=group:LS m0 m1                            | [RFC5888]           |
   | a=ice-options:trickle                       | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Audio m=line *********               | ******************* |
   |                                             | **********          |
   | m=audio 49203 UDP/TLS/RTP/SAVPF 109         | [RFC4566]           |
   | c=IN IP4 203.0.113.77                       | [RFC4566]           |
   | a=mid:m0                                    | [RFC5888]           |
   | a=msid:ma ta                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (ta)             |
   | a=recvonly                                  | [RFC3264]           |
   | a=rtpmap:109 opus/48000/2                   | [RFC7587]           |
   | a=maxptime:120                              | [RFC4566]           |
   | a=ice-ufrag:074c6550                        | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=ice-pwd:a28a397a4c3f31747d1ee3474af08a068 | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=fingerprint:sha-256 6B:8B:F0:65:5F:78:E2: | [RFC8122]           |
   | 51:3B:AC:6F:F3:3F:46:1B:35:DC:B8:5F:64:1A:2 |                     |
   | 4:C2:43:F0:A1:58:D0:A1:2C:19:08             |                     |
   | a=setup:active                              | [RFC5763]           |
   | a=tls-id:CJ6FF9ZZMJW7MDRJIR7XVIQM48GE1G31   | [I-D.ietf-mmusic-dt |
   |                                             | ls-sdp]             |
   | a=rtcp-mux                                  | [RFC5761]           |
   | a=rtcp-rsize                                | [RFC5506]           |
   | a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc- | [RFC6464]           |
   | audio-level                                 |                     |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=candidate:0 1 UDP 2113667326 198.51.100.7 | [I-D.ietf-mmusic-ic |
   | 51556 typ host                              | e-sip-sdp]          |
   | a=candidate:1 1 UDP 1694302206 203.0.113.77 | [I-D.ietf-mmusic-ic |
   | 49203 typ srflx raddr 198.51.100.7 rport    | e-sip-sdp]          |
   | 51556                                       |                     |
   | a=end-of-candidates                         | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Video m=line *********               | ******************* |
   |                                             | **********          |
   | m=video 0 UDP/TLS/RTP/SAVPF 98 103          | BUNDLE accepted     |
   | c=IN IP4 203.0.113.77                       | [RFC4566]           |
   | a=bundle-only                               | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=mid:m1                                    | [RFC5888] Video     |
   |                                             | m=line part of      |
   |                                             | BUNDLE group        |
   | a=msid:ma tb                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (tb)             |
   | a=recvonly                                  | [RFC3264]           |
   | a=rtpmap:98 VP8/90000                       | [RFC7741]           |
   | a=fmtp:98 max-fr=30                         | [RFC4566]           |
   | a=rtpmap:103 rtx/90000                      | [RFC4588]           |
   | a=fmtp:103 apt=98;rtx-time=200              | [RFC4588]           |
   | a=rtcp-fb:* nack                            | [RFC4585]           |
   | a=rtcp-fb:* nack pli                        | [RFC4585]           |
   | a=rtcp-fb:* ccm fir                         | [RFC5104]           |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=extmap:3 urn:ietf:params:rtp-             | [I-D.ietf-avtext-ri |
   | hdrext:sdes:rtp-stream-id                   | d]                  |
   | a=extmap:4 urn:ietf:params:rtp-             | [I-D.ietf-avtext-ri |
   | hdrext:sdes:repaired-rtp-stream-id          | d]                  |
   | a=rid:1 recv pt=98;max-fs=921600;max-fr=30  | [I-D.ietf-mmusic-ri |
   |                                             | d]                  |
   | a=rid:2 recv pt=98;max-fs=614400;max-fr=15  | [I-D.ietf-mmusic-ri |
   |                                             | d]                  |
   | a=rid:3 recv pt=98;max-fs=230400;max-fr=30  | [I-D.ietf-mmusic-ri |
   |                                             | d]                  |
   | a=simulcast:recv 1;2;3                      | [I-D.ietf-mmusic-sd |
   |                                             | p-simulcast] Bob    |
   |                                             | accepts the offered |
   |                                             | simulcast streams   |
   +---------------------------------------------+---------------------+

                Table 32: 5.3.3 SDP Answer w/Simulcast, RTX
```

#### 5.3.4. Successful 1-way Simulcast Session with 2 resolutions and RTX -One resolution rejected

This section shows an SDP Offer/Answer exchange for a simulcast scenario with 2 two resolutions.

It also showcases where Bob rejects one of the Simulcast Video Stream which results in the rejection of the associated repair stream implicitly.


```
     Simulcast Streams with Retransmission Rejected

Alice                                                    Bob
|                                                         |
|                                                         |
|Alice offers single audio and simulcasted video streams  |
| with bundle-only for video                              |
|                                                         |
|                                                         |
|Offer(Audio:Opus Video:VP8 with 2 resolutions,RTX Stream)|
|-------------------------------------------------------->|
|                                                         |
|                                                         |Bob accepts 1
|                                                         |simulcast,rtx
|                                                         |rejects the
|                                                         |other
|   Answer(Audio:Opus Video:VP8 with 1 res & RTX Stream)  |
|<--------------------------------------------------------|
|                                                         |
|                                                         |
|1-way audio,video session and its associated RTX stream, |
| all multiplexed                                         |
|.........................................................|
|                                                         |
|                                                         |
```


```
   +---------------------------------------------+---------------------+
   | Offer SDP Contents                          | RFC#/Notes          |
   +---------------------------------------------+---------------------+
   | v=0                                         | [RFC4566]           |
   | o=- 20519 0 IN IP4 0.0.0.0                  | [RFC4566]           |
   | s=-                                         | [RFC4566]           |
   | t=0 0                                       | [RFC4566]           |
   | a=group:BUNDLE m0 m1                        | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n] Alice supports   |
   |                                             | grouping of m=lines |
   |                                             | under BUNDLE        |
   |                                             | semantics           |
   | a=group:LS m0 m1                            | [RFC5888]           |
   | a=ice-options:trickle                       | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Audio m=line *********               | ******************* |
   |                                             | **********          |
   | m=audio 54609 UDP/TLS/RTP/SAVPF 109         | [RFC4566]           |
   | c=IN IP4 203.0.113.141                      | [RFC4566]           |
   | a=mid:m0                                    | [RFC5888]           |
   | a=msid:ma ta                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (ta)             |
   | a=sendonly                                  | [RFC3264]           |
   | a=rtpmap:109 opus/48000/2                   | [RFC7587]           |
   | a=maxptime:120                              | [RFC4566]           |
   | a=ice-ufrag:074c6550                        | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=ice-pwd:a28a397a4c3f31747d1ee3474af08a068 | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=fingerprint:sha-256 19:E2:1C:3B:4B:9F:81: | [RFC8122]           |
   | E6:B8:5C:F4:A5:A8:D8:73:04:BB:05:2F:70:9F:0 |                     |
   | 4:A9:0E:05:E9:26:33:E8:70:88:A2             |                     |
   | a=setup:actpass                             | [RFC5763]           |
   | a=tls-id:89J2LRATQ3ULA24G9AHWVR31VJWSLB68   | [I-D.ietf-mmusic-dt |
   |                                             | ls-sdp]             |
   | a=rtcp-mux                                  | [RFC5761]           |
   | a=rtcp-rsize                                | [RFC5506]           |
   | a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc- | [RFC6464]           |
   | audio-level                                 |                     |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=candidate:0 1 UDP 2113667327 192.0.2.4    | [I-D.ietf-mmusic-ic |
   | 61665 typ host                              | e-sip-sdp]          |
   | a=candidate:1 1 UDP 694302207 203.0.113.141 | [I-D.ietf-mmusic-ic |
   | 54609 typ srflx raddr 192.0.2.4 rport 61665 | e-sip-sdp]          |
   | a=end-of-candidates                         | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Video m=line *********               | ******************* |
   |                                             | **********          |
   | m=video 0 UDP/TLS/RTP/SAVPF 98 100 101 103  | bundle-only video   |
   |                                             | line with port      |
   |                                             | number set to zero  |
   | c=IN IP4 203.0.113.141                      | [RFC4566]           |
   | a=bundle-only                               | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=mid:m1                                    | [RFC5888]           |
   | a=msid:ma tb                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (tb              |
   | a=sendonly                                  | [RFC3264]           |
   | a=rtpmap:98 VP8/90000                       | [RFC7741]           |
   | a=rtpmap:100 VP8/90000                      | [RFC7741]           |
   | a=rtpmap:101 rtx/90000                      | [RFC4588]           |
   | a=rtpmap:103 rtx/90000                      | [RFC4588]           |
   | a=fmtp:98 max-fr=30;max-fs=8040             | [RFC4566]           |
   | a=fmtp:100 max-fr=15;max-fs=1200            | [RFC4566]           |
   | a=fmtp:101 apt=98;rtx-time=200              | [RFC4588]           |
   | a=fmtp:103 apt=100;rtx-time=200             | [RFC4588]           |
   | a=rtcp-fb:* nack                            | [RFC4585]           |
   | a=rtcp-fb:* nack pli                        | [RFC4585]           |
   | a=rtcp-fb:* ccm fir                         | [RFC5104]           |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=extmap:3 urn:ietf:params:rtp-             | [I-D.ietf-avtext-ri |
   | hdrext:sdes:rtp-stream-id                   | d]                  |
   | a=extmap:4 urn:ietf:params:rtp-             | [I-D.ietf-avtext-ri |
   | hdrext:sdes:repaired-rtp-stream-id          | d]                  |
   | a=rid:1 send pt=98                          | [I-D.ietf-mmusic-ri |
   |                                             | d] 1:1 mapping      |
   |                                             | between the PT and  |
   |                                             | the 'rid'           |
   |                                             | identifier          |
   | a=rid:2 send pt=100                         | [I-D.ietf-mmusic-ri |
   |                                             | d] 1:1 mapping      |
   |                                             | between the PT and  |
   |                                             | the 'rid'           |
   |                                             | identifier          |
   | a=simulcast:send 1;2                        | [I-D.ietf-mmusic-sd |
   |                                             | p-simulcast]        |
   +---------------------------------------------+---------------------+

                Table 33: 5.3.4 SDP Offer w/Simulcast, RTX
```
```
   +---------------------------------------------+---------------------+
   | Answer SDP Contents                         | RFC#/Notes          |
   +---------------------------------------------+---------------------+
   | v=0                                         | [RFC4566]           |
   | o=- 20519 0 IN IP4 0.0.0.0                  | [RFC4566]           |
   | s=-                                         | [RFC4566]           |
   | t=0 0                                       | [RFC4566]           |
   | a=group:BUNDLE m0 m1                        | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n] Bob supports     |
   |                                             | grouping of m=lines |
   |                                             | under BUNDLE        |
   |                                             | semantics           |
   | a=group:LS m0 m1                            | [RFC5888]           |
   | a=ice-options:trickle                       | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Audio m=line *********               | ******************* |
   |                                             | **********          |
   | m=audio 49203 UDP/TLS/RTP/SAVPF 109         | [RFC4566]           |
   | c=IN IP4 203.0.113.77                       | [RFC4566]           |
   | a=mid:m0                                    | [RFC5888]           |
   | a=msid:ma ta                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (ta)             |
   | a=recvonly                                  | [RFC3264]           |
   | a=rtpmap:109 opus/48000/2                   | [RFC7587]           |
   | a=maxptime:120                              | [RFC4566]           |
   | a=ice-ufrag:074c6550                        | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=ice-pwd:a28a397a4c3f31747d1ee3474af08a068 | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=fingerprint:sha-256 6B:8B:F0:65:5F:78:E2: | [RFC8122]           |
   | 51:3B:AC:6F:F3:3F:46:1B:35:DC:B8:5F:64:1A:2 |                     |
   | 4:C2:43:F0:A1:58:D0:A1:2C:19:08             |                     |
   | a=setup:active                              | [RFC5763]           |
   | a=tls-id:CJ6FF9ZZMJW7MDRJIR7XVIQM48GE1G31   | [I-D.ietf-mmusic-dt |
   |                                             | ls-sdp]             |
   | a=rtcp-mux                                  | [RFC5761]           |
   | a=rtcp-rsize                                | [RFC5506]           |
   | a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc- | [RFC6464]           |
   | audio-level                                 |                     |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=candidate:0 1 UDP 2113667326 198.51.100.7 | [I-D.ietf-mmusic-ic |
   | 51556 typ host                              | e-sip-sdp]          |
   | a=candidate:1 1 UDP 1694302206 203.0.113.77 | [I-D.ietf-mmusic-ic |
   | 49203 typ srflx raddr 198.51.100.7 rport    | e-sip-sdp]          |
   | 51556                                       |                     |
   | a=end-of-candidates                         | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Video m=line *********               | ******************* |
   |                                             | **********          |
   | m=video 0 UDP/TLS/RTP/SAVPF 98 101          | BUNDLE accepted     |
   | c=IN IP4 203.0.113.77                       | [RFC4566]           |
   | a=bundle-only                               | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=mid:m1                                    | [RFC5888]           |
   | a=msid:ma tb                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (tb)             |
   | a=recvonly                                  | [RFC3264]           |
   | a=rtpmap:98 VP8/90000                       | [RFC7741]           |
   | a=rtpmap:101 rtx/90000                      | [RFC4588]           |
   | a=fmtp:101 apt=98;rtx-time=200              | [RFC4588]           |
   | a=rtcp-fb:* nack                            | [RFC4585]           |
   | a=rtcp-fb:* nack pli                        | [RFC4585]           |
   | a=rtcp-fb:* ccm fir                         | [RFC5104]           |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=extmap:3 urn:ietf:params:rtp-             | [I-D.ietf-avtext-ri |
   | hdrext:sdes:rtp-stream-id                   | d]                  |
   | a=extmap:4 urn:ietf:params:rtp-             | [I-D.ietf-avtext-ri |
   | hdrext:sdes:repaired-rtp-stream-id          | d]                  |
   | a=rid:1 recv pt=98                          | [I-D.ietf-mmusic-ri |
   |                                             | d]                  |
   | a=simulcast:recv 1                          | [I-D.ietf-mmusic-sd |
   |                                             | p-simulcast] Bob    |
   |                                             | rejects the second  |
   |                                             | simulcast stream    |
   |                                             | and the associated  |
   |                                             | rtx stream.         |
   +---------------------------------------------+---------------------+

            Table 34: 5.3.4 SDP Answer (one Simulcast Rejected)
```

#### 5.3.5. Simulcast Video Session with Forward Error Correction

This section shows an SDP Offer/Answer exchange for Simulcast video stream at two resolutions and and has [RFC5956] style FEC flows.

On completion of the Offer/Answer exchange mechanism we end up one audio stream, 2 simulcast video streams and 2 associated FEC streams are sent over a single 5-tuple.


```
      Simulcast Streams with Forward Error Correction

Alice                                                            Bob
|                                                               |
|                                                               |
|                                                               |
|Alice offers single audio and simulcasted video streams        |
|with bundle-only                                               |
|                                                               |
|                                                               |
|Offer(Audio:Opus Video:VP8 with 2 resolutions with FEC Streams)|
|-------------------------------------------------------------->|
|                                                               |
|                                                               |Bob
|                                                               |accepts
|                                                               |Alice's
|                                                               |offer
|Answer(Audio:Opus Video:VP8 with 2 resolutions w/FEC Streams)  |
|<--------------------------------------------------------------|
|                                                               |
|One-Way Audio,Video session with 4 video streams(Simulcast     |
| and FEC) all multiplexed                                      |
|...............................................................|
|                                                               |
|                                                               |
|                                                               |
```
```
   +---------------------------------------------+---------------------+
   | Offer SDP Contents                          | RFC#/Notes          |
   +---------------------------------------------+---------------------+
   | v=0                                         | [RFC4566]           |
   | o=- 20519 0 IN IP4 0.0.0.0                  | [RFC4566]           |
   | s=-                                         | [RFC4566]           |
   | t=0 0                                       | [RFC4566]           |
   | a=group:BUNDLE m0 m1                        | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n] Alice supports   |
   |                                             | grouping of m=lines |
   |                                             | under BUNDLE        |
   |                                             | semantics           |
   | a=group:LS m0 m1                            | [RFC5888]           |
   | a=ice-options:trickle                       | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Audio m=line *********               | ******************* |
   |                                             | **********          |
   | m=audio 54609 UDP/TLS/RTP/SAVPF 109         | [RFC4566]           |
   | c=IN IP4 203.0.113.141                      | [RFC4566]           |
   | a=mid:m0                                    | [RFC5888]           |
   | a=msid:ma ta                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (ta)             |
   | a=sendonly                                  | [RFC3264]           |
   | a=rtpmap:109 opus/48000/2                   | [RFC7587]           |
   | a=maxptime:120                              | [RFC4566]           |
   | a=ice-ufrag:074c6550                        | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=ice-pwd:a28a397a4c3f31747d1ee3474af08a068 | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=fingerprint:sha-256 19:E2:1C:3B:4B:9F:81: | [RFC8122]           |
   | E6:B8:5C:F4:A5:A8:D8:73:04:BB:05:2F:70:9F:0 |                     |
   | 4:A9:0E:05:E9:26:33:E8:70:88:A2             |                     |
   | a=setup:actpass                             | [RFC5763]           |
   | a=rtcp-mux                                  | [RFC5761]           |
   | a=tls-id:89J2LRATQ3ULA24G9AHWVR31VJWSLB68   | [I-D.ietf-mmusic-dt |
   |                                             | ls-sdp]             |
   | a=rtcp-rsize                                | [RFC5506]           |
   | a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc- | [RFC6464]           |
   | audio-level                                 |                     |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=candidate:0 1 UDP 2113667327 192.0.2.4    | [I-D.ietf-mmusic-ic |
   | 61665 typ host                              | e-sip-sdp]          |
   | a=candidate:1 1 UDP 694302207 203.0.113.141 | [I-D.ietf-mmusic-ic |
   | 54609 typ srflx raddr 192.0.2.4 rport 61665 | e-sip-sdp]          |
   | a=end-of-candidates                         | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Video m=line *********               | ******************* |
   |                                             | **********          |
   | m=video 0 UDP/TLS/RTP/SAVPF 98 100 101      | bundle-only video   |
   |                                             | line with port      |
   |                                             | number set to zero  |
   | c=IN IP4 203.0.113.141                      | [RFC4566]           |
   | a=bundle-only                               | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=mid:m1                                    | [RFC5888] Video     |
   |                                             | m=line part of      |
   |                                             | BUNDLE group        |
   | a=msid:ma tb                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (tb)             |
   | a=sendonly                                  | [RFC3264]           |
   | a=rtpmap:98 VP8/90000                       | [RFC7741]           |
   | a=rtpmap:100 VP8/90000                      | [RFC7741]           |
   | a=rtpmap:101 flexfec/90000                  | [I-D.ietf-payload-f |
   |                                             | lexible-fec-scheme] |
   | a=fmtp:98 max-fr=30;max-fs=8040             | [RFC4566]           |
   | a=fmtp:100 max-fr=15;max-fs=1200            | [RFC4566]           |
   | a=fmtp:101 L=5; D=10; ToP=2; repair-        | [I-D.ietf-payload-f |
   | window=200000                               | lexible-fec-scheme] |
   | a=rtcp-fb:* nack pli                        | [RFC4585]           |
   | a=rtcp-fb:* ccm fir                         | [RFC5104]           |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=extmap:3 urn:ietf:params:rtp-             | [I-D.ietf-avtext-ri |
   | hdrext:sdes:rtp-stream-id                   | d]                  |
   | a=extmap:4 urn:ietf:params:rtp-             | [I-D.ietf-avtext-ri |
   | hdrext:sdes:repaired-rtp-stream-id          | d]                  |
   | a=rid:1 send pt=98                          | [I-D.ietf-mmusic-ri |
   |                                             | d] 1:1 mapping      |
   |                                             | between the PT and  |
   |                                             | the 'rid'           |
   |                                             | identifier          |
   | a=rid:2 send pt=100                         | [I-D.ietf-mmusic-ri |
   |                                             | d] 1:1 mapping      |
   |                                             | between the PT and  |
   |                                             | the 'rid'           |
   |                                             | identifier          |
   | a=simulcast:send 1;2                        | [I-D.ietf-mmusic-sd |
   |                                             | p-simulcast]        |
   +---------------------------------------------+---------------------+

                         Table 35: 5.3.5 SDP Offer
```
```
   +---------------------------------------------+---------------------+
   | Answer SDP Contents                         | RFC#/Notes          |
   +---------------------------------------------+---------------------+
   | v=0                                         | [RFC4566]           |
   | o=- 20519 0 IN IP4 0.0.0.0                  | [RFC4566]           |
   | s=-                                         | [RFC4566]           |
   | t=0 0                                       | [RFC4566]           |
   | a=group:BUNDLE m0 m1                        | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=group:LS m0 m1                            | [RFC5888]           |
   | a=ice-options:trickle                       | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Audio m=line *********               | ******************* |
   |                                             | **********          |
   | m=audio 49203 UDP/TLS/RTP/SAVPF 109         | [RFC4566]           |
   | c=IN IP4 203.0.113.77                       | [RFC4566]           |
   | a=mid:m0                                    | [RFC5888] Audio     |
   |                                             | m=line part of      |
   |                                             | BUNDLE group with a |
   |                                             | unique port number  |
   | a=msid:ma ta                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (ta)             |
   | a=recvonly                                  | [RFC3264]           |
   | a=rtpmap:109 opus/48000/2                   | [RFC7587]           |
   | a=maxptime:120                              | [RFC4566]           |
   | a=ice-ufrag:074c6550                        | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=ice-pwd:a28a397a4c3f31747d1ee3474af08a068 | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=fingerprint:sha-256 6B:8B:F0:65:5F:78:E2: | [RFC8122]           |
   | 51:3B:AC:6F:F3:3F:46:1B:35:DC:B8:5F:64:1A:2 |                     |
   | 4:C2:43:F0:A1:58:D0:A1:2C:19:08             |                     |
   | a=setup:active                              | [RFC5763]           |
   | a=tls-id:CJ6FF9ZZMJW7MDRJIR7XVIQM48GE1G31   | [I-D.ietf-mmusic-dt |
   |                                             | ls-sdp]             |
   | a=rtcp-mux                                  | [RFC5761]           |
   | a=rtcp-rsize                                | [RFC5506]           |
   | a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc- | [RFC6464]           |
   | audio-level                                 |                     |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=candidate:0 1 UDP 2113667326 198.51.100.7 | [I-D.ietf-mmusic-ic |
   | 51556 typ host                              | e-sip-sdp]          |
   | a=candidate:1 1 UDP 1694302206 203.0.113.77 | [I-D.ietf-mmusic-ic |
   | 49203 typ srflx raddr 198.51.100.7 rport    | e-sip-sdp]          |
   | 51556                                       |                     |
   | a=end-of-candidates                         | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Video m=line *********               | ******************* |
   |                                             | **********          |
   | m=video 0 UDP/TLS/RTP/SAVPF 98 100 101      | BUNDLE accepted.    |
   | c=IN IP4 203.0.113.77                       | [RFC4566]           |
   | a=bundle-only                               | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=mid:m1                                    | [RFC5888] Video     |
   |                                             | m=line part of      |
   |                                             | BUNDLE group        |
   | a=msid:ma tb                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (tb)             |
   | a=recvonly                                  | [RFC3264]           |
   | a=rtpmap:98 VP8/90000                       | [RFC7741]           |
   | a=rtpmap:100 VP8/90000                      | [RFC7741]           |
   | a=rtpmap:101 flexfec/90000                  | [I-D.ietf-payload-f |
   |                                             | lexible-fec-scheme] |
   | a=fmtp:98 max-fr=30;max-fs=8040             | [RFC4566]           |
   | a=fmtp:100 max-fr=15;max-fs=1200            | [RFC4566]           |
   | a=fmtp:101 L=5; D=10; ToP=2; repair-        | [I-D.ietf-payload-f |
   | window=200000                               | lexible-fec-scheme] |
   | a=rtcp-fb:* nack pli                        | [RFC4585]           |
   | a=rtcp-fb:* ccm fir                         | [RFC5104]           |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=extmap:3 urn:ietf:params:rtp-             | [I-D.ietf-avtext-ri |
   | hdrext:sdes:rtp-stream-id                   | d]                  |
   | a=extmap:4 urn:ietf:params:rtp-             | [I-D.ietf-avtext-ri |
   | hdrext:sdes:repaired-rtp-stream-id          | d]                  |
   | a=rid:1 recv pt=98                          | [I-D.ietf-mmusic-ri |
   |                                             | d]                  |
   | a=rid:2 recv pt=100                         | [I-D.ietf-mmusic-ri |
   |                                             | d]                  |
   | a=simulcast:recv 1;2                        | [I-D.ietf-mmusic-sd |
   |                                             | p-simulcast]        |
   +---------------------------------------------+---------------------+

                        Table 36: 5.3.5 SDP Answer
```

### 5.4. Others

The examples in the section provide SDP Offer/Answer exchange for a variety of scenarios related to RTP Header extension for conference usages, Legacy Interop scenarios and more.

#### 5.4.1. Audio Session - Voice Activity Detection

This example shows Alice indicating the support of the RTP header extension to include the audio-level of the audio sample carried in the RTP packet.




```
              2-Way Audio with VAD

    Alice                                    Bob
    |                                         |
    |                                         |
    |Alice indicates support for including    |
    |audio level in RTP header                |
    |                                         |
    |     Offer(Audio:Opus,PCMU,PCMA)         |
    |---------------------------------------->|
    |                                         |
    |                                         |
    |     Answer(Audio:Opus,PCMU,PCMA)        |
    |<----------------------------------------|
    |                                         |
    |                                         |Bob accepts and
    |                                         |indicates his
    |                                         |support as well
    |                                         |
    |     Two way Opus Audio                  |
    |.........................................|
    |                                         |
    |Per packet audio-level is included in the|
    |RTP header                               |
    |                                         |
```


```
   +---------------------------------------------+---------------------+
   | Offer SDP Contents                          | RFC#/Notes          |
   +---------------------------------------------+---------------------+
   | v=0                                         | [RFC4566]           |
   | o=- 20518 0 IN IP4 0.0.0.0                  | [RFC4566]           |
   | s=-                                         | [RFC4566]           |
   | t=0 0                                       | [RFC4566]           |
   | a=group:BUNDLE audio                        | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=ice-options:trickle                       | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Audio m=line *********               | ******************* |
   |                                             | **********          |
   | m=audio 54609 UDP/TLS/RTP/SAVPF 109 0 8     | [RFC4566]           |
   | c=IN IP4 203.0.113.141                      | [RFC4566]           |
   | a=mid:audio                                 | [RFC5888]           |
   | a=msid:ma ta                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (ta)             |
   | a=sendrecv                                  | [RFC3264]           |
   | a=rtpmap:109 opus/48000/2                   | [RFC7587]           |
   | a=rtpmap:0 PCMU/8000                        | [RFC3551]           |
   | a=rtpmap:8 PCMA/8000                        | [RFC3551]           |
   | a=maxptime:120                              | [RFC4566]           |
   | a=ice-ufrag:074c6550                        | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=ice-pwd:a28a397a4c3f31747d1ee3474af08a068 | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=fingerprint:sha-256 19:E2:1C:3B:4B:9F:81: | [RFC8122]           |
   | E6:B8:5C:F4:A5:A8:D8:73:04:BB:05:2F:70:9F:0 |                     |
   | 4:A9:0E:05:E9:26:33:E8:70:88:A2             |                     |
   | a=setup:actpass                             | [RFC5763]           |
   | a=tls-id:89J2LRATQ3ULA24G9AHWVR31VJWSLB68   | [I-D.ietf-mmusic-dt |
   |                                             | ls-sdp]             |
   | a=rtcp-mux                                  | [RFC5761]           |
   | a=rtcp-rsize                                | [RFC5506]           |
   | a=rtcp-fb:* nack                            | [RFC4585]           |
   | a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc- | [RFC6464]           |
   | audio-level                                 |                     |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=candidate:0 1 UDP 2113667327 192.0.2.4    | [I-D.ietf-mmusic-ic |
   | 61665 typ host                              | e-sip-sdp]          |
   | a=candidate:1 1 UDP 694302207 203.0.113.141 | [I-D.ietf-mmusic-ic |
   | 54609 typ srflx raddr 192.0.2.4 rport 61665 | e-sip-sdp]          |
   | a=end-of-candidates                         | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   +---------------------------------------------+---------------------+

                         Table 37: 5.4.1 SDP Offer
```
```
   +---------------------------------------------+---------------------+
   | Answer SDP Contents                         | RFC#/Notes          |
   +---------------------------------------------+---------------------+
   | v=0                                         | [RFC4566]           |
   | o=-  16833 0 IN IP4 0.0.0.0                 | [RFC4566]           |
   | s=-                                         | [RFC4566]           |
   | t=0 0                                       | [RFC4566]           |
   | a=group:BUNDLE audio                        | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=ice-options:trickle                       | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Audio m=line *********               | ******************* |
   |                                             | **********          |
   | m=audio 49203 UDP/TLS/RTP/SAVPF 109 0 8     | [RFC4566]           |
   | c=IN IP4 203.0.113.77                       | [RFC4566]           |
   | a=mid:audio                                 | [RFC5888]           |
   | a=msid:ma ta                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (ta)             |
   | a=sendrecv                                  | [RFC3264] - Bob can |
   |                                             | send and recv audio |
   | a=rtpmap:109 opus/48000/2                   | [RFC7587] - Bob     |
   |                                             | accepts only Opus   |
   |                                             | Codec               |
   | a=rtpmap:0 PCMU/8000                        | [RFC3551] PCMU      |
   |                                             | Audio Codec         |
   | a=rtpmap:8 PCMA/8000                        | [RFC3551] PCMA      |
   |                                             | Audio Codec         |
   | a=maxptime:120                              | [RFC4566]           |
   | a=ice-ufrag:c300d85b                        | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=ice-pwd:de4e99bd291c325921d5d47efbabd9a2  | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=fingerprint:sha-256 6B:8B:F0:65:5F:78:E2: | [RFC8122]           |
   | 51:3B:AC:6F:F3:3F:46:1B:35:DC:B8:5F:64:1A:2 |                     |
   | 4:C2:43:F0:A1:58:D0:A1:2C:19:08             |                     |
   | a=setup:active                              | [RFC5763]           |
   | a=tls-id:CJ6FF9ZZMJW7MDRJIR7XVIQM48GE1G31   | [I-D.ietf-mmusic-dt |
   |                                             | ls-sdp]             |
   | a=rtcp-mux                                  | [RFC5761] - Bob can |
   |                                             | perform RTP/RTCP    |
   |                                             | Muxing on port      |
   |                                             | 49203               |
   | a=rtcp-rsize                                | [RFC5506]           |
   | a=rtcp-fb:* nack                            | [RFC4585]           |
   | a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc- | [RFC6464]           |
   | audio-level                                 |                     |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=candidate:0 1 UDP 2113667327 198.51.100.7 | [I-D.ietf-mmusic-ic |
   | 51556 typ host                              | e-sip-sdp]          |
   | a=candidate:1 1 UDP 1694302207 203.0.113.77 | [I-D.ietf-mmusic-ic |
   | 49203 typ srflx raddr 198.51.100.7 rport    | e-sip-sdp]          |
   | 51556                                       |                     |
   | a=end-of-candidates                         | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   +---------------------------------------------+---------------------+

                        Table 38: 5.4.1 SDP Answer
```

#### 5.4.2. Audio Conference - Voice Activity Detection

This example shows SDP for RTP header extension that allows RTP-level mixers in audio conferences to deliver information about the audio level of individual participants.




```
        Audio Conference with VAD Support

   Alice                                    Mixer
   |                                         |
   |Alice indicates her interest to audio    |
   |levels for the contributing sources      |
   |                                         |
   |Offer(Audio:Opus,PCMU,PCMA)              |
   |---------------------------------------->|
   |                                         |
   |                                         |
   |Answer(Audio:Opus,PCMU,PCMA)             |
   |<----------------------------------------|
   |                                         |
   |                                         |Mixer indicates
   |                                         |it can provide
   |                                         |audio-levels
   |Two way Opus Audio                       |
   |.........................................|
   |                                         |
   |Audio-levels per CSRCS is included in the|
   |RTP header                               |
   |                                         |
```


```
   +---------------------------------------------+---------------------+
   | Offer SDP Contents                          | RFC#/Notes          |
   +---------------------------------------------+---------------------+
   | v=0                                         | [RFC4566]           |
   | o=- 20518 0 IN IP4 0.0.0.0                  | [RFC4566] - Session |
   |                                             | Origin Information  |
   | s=-                                         | [RFC4566]           |
   | t=0 0                                       | [RFC4566]           |
   | a=group:BUNDLE audio                        | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=ice-options:trickle                       | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Audio m=line *********               | ******************* |
   |                                             | **********          |
   | m=audio 54609 UDP/TLS/RTP/SAVPF 109 0 8     | [RFC4566]           |
   | c=IN IP4 203.0.113.141                      | [RFC4566]           |
   | a=mid:audio                                 | [RFC5888]           |
   | a=msid:ma ta                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (ta)             |
   | a=sendrecv                                  | [RFC3264] - Alice   |
   |                                             | can send and recv   |
   |                                             | audio               |
   | a=rtpmap:109 opus/48000/2                   | [RFC7587]           |
   | a=rtpmap:0 PCMU/8000                        | [RFC3551] PCMU      |
   |                                             | Audio Codec         |
   | a=rtpmap:8 PCMA/8000                        | [RFC3551] PCMA      |
   |                                             | Audio Codec         |
   | a=maxptime:120                              | [RFC4566]           |
   | a=ice-ufrag:074c6550                        | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=ice-pwd:a28a397a4c3f31747d1ee3474af08a068 | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=fingerprint:sha-256 19:E2:1C:3B:4B:9F:81: | [RFC8122]           |
   | E6:B8:5C:F4:A5:A8:D8:73:04:BB:05:2F:70:9F:0 |                     |
   | 4:A9:0E:05:E9:26:33:E8:70:88:A2             |                     |
   | a=setup:actpass                             | [RFC5763]           |
   | a=tls-id:89J2LRATQ3ULA24G9AHWVR31VJWSLB68   | [I-D.ietf-mmusic-dt |
   |                                             | ls-sdp]             |
   | a=rtcp-mux                                  | [RFC5761]           |
   | a=rtcp-rsize                                | [RFC5506]           |
   | a=rtcp-fb:* nack                            | [RFC4585]           |
   | a=extmap:1/recvonly urn:ietf:params:rtp-    | [RFC6465]           |
   | hdrext:csrc-audio-level                     |                     |
   | a=extmap:2 urn:ietf:params:rtp-hdrext:ssrc- | [RFC6464]           |
   | audio-level                                 |                     |
   | a=extmap:3 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=candidate:0 1 UDP 2113667327 192.0.2.4    | [I-D.ietf-mmusic-ic |
   | 61665 typ host                              | e-sip-sdp]          |
   | a=candidate:1 1 UDP 694302207 203.0.113.141 | [I-D.ietf-mmusic-ic |
   | 54609 typ srflx raddr 192.0.2.4 rport 61665 | e-sip-sdp]          |
   | a=end-of-candidates                         | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   +---------------------------------------------+---------------------+

                         Table 39: 5.4.2 SDP Offer
```


```
   +---------------------------------------------+---------------------+
   | Answer SDP Contents                         | RFC#/Notes          |
   +---------------------------------------------+---------------------+
   | v=0                                         | [RFC4566]           |
   | o=-  16833 0 IN IP4 0.0.0.0                 | [RFC4566] - Session |
   |                                             | Origin Information  |
   | s=-                                         | [RFC4566]           |
   | t=0 0                                       | [RFC4566]           |
   | a=group:BUNDLE audio                        | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=ice-options:trickle                       | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Audio m=line *********               | ******************* |
   |                                             | **********          |
   | m=audio 49203 UDP/TLS/RTP/SAVPF 109 0 8     | [RFC4566]           |
   | c=IN IP4 203.0.113.77                       | [RFC4566]           |
   | a=mid:audio                                 | [RFC5888]           |
   | a=msid:ma ta                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (ta)             |
   | a=sendrecv                                  | [RFC3264]           |
   | a=rtpmap:109 opus/48000/2                   | [RFC7587]           |
   | a=rtpmap:0 PCMU/8000                        | [RFC3551] PCMU      |
   |                                             | Audio Codec         |
   | a=rtpmap:8 PCMA/8000                        | [RFC3551] PCMA      |
   |                                             | Audio Codec         |
   | a=maxptime:120                              | [RFC4566]           |
   | a=ice-ufrag:c300d85b                        | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=ice-pwd:de4e99bd291c325921d5d47efbabd9a2  | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=fingerprint:sha-256 6B:8B:F0:65:5F:78:E2: | [RFC8122]           |
   | 51:3B:AC:6F:F3:3F:46:1B:35:DC:B8:5F:64:1A:2 |                     |
   | 4:C2:43:F0:A1:58:D0:A1:2C:19:08             |                     |
   | a=setup:active                              | [RFC5763]           |
   | a=tls-id:CJ6FF9ZZMJW7MDRJIR7XVIQM48GE1G31   | [I-D.ietf-mmusic-dt |
   |                                             | ls-sdp]             |
   | a=rtcp-mux                                  | [RFC5761]           |
   | a=rtcp-rsize                                | [RFC5506]           |
   | a=rtcp-fb:* nack                            | [RFC4585]           |
   | a=extmap:1/sendonly urn:ietf:params:rtp-    | [RFC6465]           |
   | hdrext:csrc-audio-level                     |                     |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=candidate:0 1 UDP 2113667327 198.51.100.7 | [I-D.ietf-mmusic-ic |
   | 51556 typ host                              | e-sip-sdp]          |
   | a=candidate:1 1 UDP 1694302207 203.0.113.77 | [I-D.ietf-mmusic-ic |
   | 49203 typ srflx raddr 198.51.100.7 rport    | e-sip-sdp]          |
   | 51556                                       |                     |
   | a=end-of-candidates                         | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   +---------------------------------------------+---------------------+

                        Table 40: 5.4.2 SDP Answer
```

#### 5.4.3. Successful legacy Interop Fallback with bundle-only

In the scenario described below, Alice is a multi-stream capable WebRTC endpoint while Bob is a legacy VOIP end-point.  The SDP Offer/ Answer exchange demonstrates successful session setup with fallback to audio only stream negotiated via bundle-only framework between the end-points.  Specifically,

*  Offer from Alice describes 2 cameras via 2 video m=lines with both marked as bundle-only.

*  Bob doesn't recognize BUNDLE mechanism and since Alice has marked both the video m=lines with port 0, Bob accepts just the audio stream from Alice.

NOTE: Since Alice is unaware of Bob's support for BUNDLE framework, Alice includes separate RTP/RTCP ports and candidate information.


```
         Successful 2-Way WebRTC <-> VOIP Interop

Alice                                                       Bob
|                                                           |
|                                                           |
|       Alice is a multistream capable WebRTC end-point     |
|          & Bob is behind a legacy VOIP system             |
|                                                           |
|Offer(Audio:Opus Video:2 VP8,2 H.264 Streams) with         |
|          bundle-only                                      |
|---------------------------------------------------------->|
|     Alice marks both the video streams as bundle-only     |
|                                                           |
|                                                           |
|                  Answer(Audio:Opus)                       |
|<----------------------------------------------------------|
|                                                           |Bob
|                                                           |accepts
|                                                           |audio
|                                                           |stream,
|                                                           |since he
|                                                           |doesn't
|                                                           |recognize
|                                                           |bundle-only
|                                                           |
|                   Two way Opus Audio                      |
|...........................................................|
|                                                           |
|                                                           |
```
```
   +---------------------------------------------+---------------------+
   | Offer SDP Contents                          | RFC#/Notes          |
   +---------------------------------------------+---------------------+
   | v=0                                         | [RFC4566]           |
   | o=- 20519 0 IN IP4 0.0.0.0                  | [RFC4566]           |
   | s=-                                         | [RFC4566]           |
   | t=0 0                                       | [RFC4566]           |
   | a=group:BUNDLE m0 m1 m2                     | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n] Alice supports   |
   |                                             | grouping of m=lines |
   |                                             | under BUNDLE        |
   |                                             | semantics           |
   | a=group:LS m0 m1                            | [RFC5888]           |
   | a=ice-options:trickle                       | [I-D.ietf-mmusic-tr |
   |                                             | ickle-ice]          |
   | ****** Audio m=line *********               | ******************* |
   |                                             | **********          |
   | m=audio 54609 UDP/TLS/RTP/SAVPF 109         | [RFC4566]           |
   | c=IN IP4 203.0.113.141                      | [RFC4566]           |
   | a=mid:m0                                    | [RFC5888] Audio     |
   |                                             | m=line part of      |
   |                                             | BUNDLE group with a |
   |                                             | unique port number  |
   | a=msid:ma ta                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (ta)             |
   | a=sendrecv                                  | [RFC3264]           |
   | a=rtpmap:109 opus/48000/2                   | [RFC7587]           |
   | a=maxptime:120                              | [RFC4566]           |
   | a=ice-ufrag:074c6550                        | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=ice-pwd:a28a397a4c3f31747d1ee3474af08a068 | [I-D.ietf-mmusic-ic |
   |                                             | e-sip-sdp]          |
   | a=fingerprint:sha-256 19:E2:1C:3B:4B:9F:81: | [RFC8122]           |
   | E6:B8:5C:F4:A5:A8:D8:73:04:BB:05:2F:70:9F:0 |                     |
   | 4:A9:0E:05:E9:26:33:E8:70:88:A2             |                     |
   | a=setup:actpass                             | [RFC5763]           |
   | a=tls-id:89J2LRATQ3ULA24G9AHWVR31VJWSLB68   | [I-D.ietf-mmusic-dt |
   |                                             | ls-sdp]             |
   | a=rtcp-mux                                  | [RFC5761]           |
   | a=rtcp:64678 IN IP4 203.0.113.141           | [RFC3605]           |
   | a=rtcp-rsize                                | [RFC5506]           |
   | a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc- | [RFC6464]           |
   | audio-level                                 |                     |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=candidate:0 1 UDP 2113667327 192.0.2.4    | [I-D.ietf-mmusic-ic |
   | 61665 typ host                              | e-sip-sdp]          |
   | a=candidate:1 1 UDP 694302207 203.0.113.141 | [I-D.ietf-mmusic-ic |
   | 54609 typ srflx raddr 192.0.2.4 rport 61665 | e-sip-sdp]          |
   | a=candidate:0 1 UDP 2113667326 192.0.2.4    | [I-D.ietf-mmusic-ic |
   | 61667 typ host                              | e-sip-sdp]          |
   | a=candidate:1 1 UDP 1694302206              | [I-D.ietf-mmusic-ic |
   | 203.0.113.141 64678 typ srflx raddr         | e-sip-sdp]          |
   | 192.0.2.4 rport 61667                       |                     |
   | ****** Video-1 m=line *********             | ******************* |
   |                                             | **********          |
   | m=video 0 UDP/TLS/RTP/SAVPF 98              | bundle-only video   |
   |                                             | line with port      |
   |                                             | number set to zero  |
   | c=IN IP4 203.0.113.141                      | [RFC4566]           |
   | a=bundle-only                               | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=mid:m1                                    | [RFC5888] Video     |
   |                                             | m=line part of      |
   |                                             | BUNDLE group        |
   | a=msid:ma tb                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (tb)             |
   | a=sendrecv                                  | [RFC3264]           |
   | a=rtpmap:98 VP8/90000                       | [RFC7741]           |
   | a=imageattr:98 [x=1280,y=720]               | [RFC6236]           |
   | a=fmtp:98 max-fr=30                         | [RFC4566]           |
   | a=rtcp-fb:* nack                            | [RFC4585]           |
   | a=rtcp-fb:* nack pli                        | [RFC4585]           |
   | a=rtcp-fb:* ccm fir                         | [RFC5104]           |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | ****** Video-2 m=line *********             | ******************* |
   |                                             | **********          |
   | m=video 0 UDP/TLS/RTP/SAVPF 101 103         | bundle-only video   |
   |                                             | line with port      |
   |                                             | number set to zero  |
   | c=IN IP4 203.0.113.141                      | [RFC4566]           |
   | a=bundle-only                               | [I-D.ietf-mmusic-sd |
   |                                             | p-bundle-negotiatio |
   |                                             | n]                  |
   | a=mid:m2                                    | [RFC5888] Video     |
   |                                             | m=line part of      |
   |                                             | BUNDLE group        |
   | a=msid:ma tc                                | Identifies          |
   |                                             | RTCMediaStream ID   |
   |                                             | (ma) and            |
   |                                             | RTCMediaStreamTrack |
   |                                             | ID (tc)             |
   | a=sendrecv                                  | [RFC3264]           |
   | a=rtpmap:101 H264/90000                     | [RFC6184]           |
   | a=rtpmap:103 H264/90000                     | [RFC6184]           |
   | a=fmtp:101 profile-level-                   | [RFC6184]Camera-2,E |
   | id=4d0028;packetization-mode=1;max-fr=30    | ncoding-1           |
   |                                             | Resolution          |
   | a=rtcp-fb:* nack                            | [RFC4585]           |
   | a=rtcp-fb:* nack pli                        | [RFC4585]           |
   | a=rtcp-fb:* ccm fir                         | [RFC5104]           |
   | a=extmap:2 urn:ietf:params:rtp-             | [I-D.ietf-mmusic-sd |
   | hdrext:sdes:mid                             | p-bundle-negotiatio |
   |                                             | n]                  |
   +---------------------------------------------+---------------------+

                 Table 41: 5.4.3 SDP Simulcast bundle-only
```
```
   +-------------------------------------------------+-----------------+
   | Answer SDP Contents                             | RFC#/Notes      |
   +-------------------------------------------------+-----------------+
   | v=0                                             | [RFC4566]       |
   | o=- 20519 0 IN IP4 0.0.0.0                      | [RFC4566]       |
   | s=-                                             | [RFC4566]       |
   | t=0 0                                           | [RFC4566]       |
   | ****** Audio m=line *********                   | *************** |
   |                                                 | **************  |
   | m=audio 49203 UDP/TLS/RTP/SAVPF 109             | [RFC4566]       |
   | c=IN IP4 203.0.113.141                          | [RFC4566]       |
   | a=rtcp:60065 IN IP4 203.0.113.141               | [RFC3605]       |
   | a=sendrecv                                      | [RFC3264]       |
   | a=rtpmap:109 opus/48000/2                       | [RFC7587]       |
   | a=maxptime:120                                  | [RFC4566]       |
   | a=ice-ufrag:c300d85b                            | [I-D.ietf-mmusi |
   |                                                 | c-ice-sip-sdp]  |
   | a=ice-pwd:de4e99bd291c325921d5d47efbabd9a2      | [I-D.ietf-mmusi |
   |                                                 | c-ice-sip-sdp]  |
   | a=fingerprint:sha-256 6B:8B:F0:65:5F:78:E2:51:3 | [RFC8122]       |
   | B:AC:6F:F3:3F:46:1B:35:DC:B8:5F:64:1A:24:C2:43: |                 |
   | F0:A1:58:D0:A1:2C:19:08                         |                 |
   | a=setup:active                                  | [RFC5763]       |
   | a=rtcp-rsize                                    | [RFC5506]       |
   | a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc-     | [RFC6464]       |
   | audio-level                                     |                 |
   | a=candidate:0 1 UDP 2113667327 198.51.100.7     | [I-D.ietf-mmusi |
   | 51556 typ host                                  | c-ice-sip-sdp]  |
   | a=candidate:1 1 UDP 694302207 203.0.113.77      | [I-D.ietf-mmusi |
   | 49203 typ srflx raddr 198.51.100.7 rport 51556  | c-ice-sip-sdp]  |
   | a=candidate:0 2 UDP 2113667326 198.51.100.7     | [I-D.ietf-mmusi |
   | 51558 typ host                                  | c-ice-sip-sdp]  |
   | a=candidate:1 2 UDP 1694302206 203.0.113.77     | [I-D.ietf-mmusi |
   | 60065 typ srflx raddr 198.51.100.7 rport 51558  | c-ice-sip-sdp]  |
   | ****** Video m=line *********                   | *************** |
   |                                                 | **************  |
   | m=video 0 UDP/TLS/RTP/SAVPF 98 100              | Bob doesn't     |
   |                                                 | recognize       |
   |                                                 | bundle-only and |
   |                                                 | hence the       |
   |                                                 | m=line is       |
   |                                                 | rejected        |
   |                                                 | implicitly due  |
   |                                                 | to port 0       |
   | ****** Video m=line *********                   | *************** |
   |                                                 | **************  |
   | m=video 0 UDP/TLS/RTP/SAVPF 98 100              | Bob doesn't     |
   |                                                 | recognize       |
   |                                                 | bundle-only and |
   |                                                 | hence the       |
   |                                                 | m=line is       |
   |                                                 | rejected        |
   |                                                 | implicitly due  |
   |                                                 | to port 0       |
   +-------------------------------------------------+-----------------+

                        Table 42: 5.4.3 SDP Answer
```

#### 5.4.4. Legacy Interop with RTP/AVP profile

In the scenario described below, Alice is a legacy end-point which sends [RFC3264] Offer with RTP/AVP based audio and video descriptions along with DTLS fingerprint and RTCP feedback information.

On the other hand, Bob being a WebRTC end-point follows procedures in section 5.1.2 of [I-D.ietf-rtcweb-jsep] and accepts the Alice's offer for DTLS-SRTP based session with RTCP feedback.


```
           Successful 2-Way WebRTC <-> VOIP Interop

Alice                                                       Bob
|                                                            |
|                                                            |
|Alice is a legacy VOIP End-point & Bob is a WebRTC End-Point|
|                                                            |
|                                                            |
|                                                            |
|              Offer(Audio:Opus Video:H.264)                 |
|----------------------------------------------------------->|
|                                                            |
|                                                            |
|Alice includes :                                            |
|Legacy compliant media description (RTP/AVP) with dtls      |
|fingerprint and rtcp feedback support                       |
|                                                            |
|             Answer(Audio:Opus, Video:H.264)                |
|<-----------------------------------------------------------|
|                                                            |Bob
|                                                            |accepts
|                                                            |"legacy
|                                                            |compliant"
|                                                            |m=line
|                                                            |
|                                                            |
|             Two way Opus Audio, H.264 Video                |
|............................................................|
|       Session also supports RTP/RTCP Mux, RTCP Feedback    |
|                                                            |
```
```
   +-------------------------------------------------+-----------------+
   | Offer SDP Contents                              | RFC#/Notes      |
   +-------------------------------------------------+-----------------+
   | v=0                                             | [RFC4566]       |
   | o=- 20518 0 IN IP4 0.0.0.0                      | [RFC4566]       |
   | s=-                                             | [RFC4566]       |
   | t=0 0                                           | [RFC4566]       |
   | a=ice-ufrag:074c6550                            | [I-D.ietf-mmusi |
   |                                                 | c-ice-sip-sdp]  |
   | a=ice-pwd:a28a397a4c3f31747d1ee3474af08a068     | [I-D.ietf-mmusi |
   |                                                 | c-ice-sip-sdp]  |
   | a=rtcp-rsize                                    | [RFC5506]       |
   | ****** Audio m=line *********                   | *************** |
   |                                                 | **************  |
   | m=audio 54732 RTP/AVP 109                       | [RFC4566]Alice  |
   |                                                 | includes        |
   |                                                 | RTP/AVP audio   |
   |                                                 | stream          |
   |                                                 | description     |
   | c=IN IP4 203.0.113.141                          | [RFC4566]       |
   | a=fingerprint:sha-256 19:E2:1C:3B:4B:9F:81:E6:B | [RFC8122]       |
   | 8:5C:F4:A5:A8:D8:73:04:BB:05:2F:70:9F:04:A9:0E: |                 |
   | 05:E9:26:33:E8:70:88:A2                         |                 |
   | a=rtpmap:109 opus/48000                         |                 |
   | a=ptime:20                                      |                 |
   | a=sendrecv                                      | [RFC3264]       |
   | a=rtcp-mux                                      | [RFC5761]Alice  |
   |                                                 | still includes  |
   |                                                 | RTP/RTCP Mux    |
   |                                                 | support         |
   | a=rtcp:64678 IN IP4 203.0.113.141               | [RFC3605]       |
   | a=candidate:0 1 UDP 2113667327 192.0.2.4 54732  | [I-D.ietf-mmusi |
   | typ host                                        | c-ice-sip-sdp]  |
   | a=candidate:1 1 UDP 694302207 203.0.113.141     | [I-D.ietf-mmusi |
   | 54732 typ srflx raddr 192.0.2.4 rport 54732     | c-ice-sip-sdp]  |
   | a=candidate:0 2 UDP 2113667326 192.0.2.4 64678  | [I-D.ietf-mmusi |
   | typ host                                        | c-ice-sip-sdp]  |
   | a=candidate:1 2 UDP 1694302206 203.0.113.141    | [I-D.ietf-mmusi |
   | 64678 typ srflx raddr 192.0.2.4 rport 64678     | c-ice-sip-sdp]  |
   | ****** Video m=line *********                   | *************** |
   |                                                 | **************  |
   | m=video 62445 RTP/AVP 120                       | [RFC4566]Alice  |
   |                                                 | includes        |
   |                                                 | RTP/AVP video   |
   |                                                 | stream          |
   |                                                 | description     |
   | c=IN IP4 203.0.113.141                          | [RFC4566]       |
   | a=fingerprint:sha-256 DC:B8:5F:64:1A:24:C2:43:F | [RFC8122]       |
   | 0:A1:58:D0:A1:2C:19:08:6B:8B:F0:65:5F:78:E2:51: |                 |
   | 3B:AC:6F:F3:3F:46:1B:35                         |                 |
   | a=rtpmap:120 VP8/90000                          | [RFC7741]       |
   | a=sendrecv                                      | [RFC3264]       |
   | a=rtcp-mux                                      | [RFC5761]Alice  |
   |                                                 | intends to      |
   |                                                 | perform         |
   |                                                 | RTP/RTCP Mux    |
   | a=rtcp:54721 IN IP4 203.0.113.141               | [RFC3605]       |
   | a=candidate:0 1 UDP 2113667327 192.0.2.4 62445  | [I-D.ietf-mmusi |
   | typ host                                        | c-ice-sip-sdp]  |
   | a=candidate:1 1 UDP 1694302207 203.0.113.141    | [I-D.ietf-mmusi |
   | 62537 typ srflx raddr 192.0.2.4 rport 62445     | c-ice-sip-sdp]  |
   | a=candidate:0 2 UDP 2113667326 192.0.2.4 54721  | [I-D.ietf-mmusi |
   | typ host                                        | c-ice-sip-sdp]  |
   | a=candidate:1 2 UDP 1694302206 203.0.113.141    | [I-D.ietf-mmusi |
   | 54721 typ srflx raddr 192.0.2.4 rport 54721     | c-ice-sip-sdp]  |
   | a=rtcp-fb:120 nack pli                          | [RFC4585] Alice |
   |                                                 | indicates       |
   |                                                 | support for     |
   |                                                 | Picture loss    |
   |                                                 | Indication and  |
   |                                                 | NACK RTCP       |
   |                                                 | feedback        |
   | a=rtcp-fb:120 ccm fir                           | [RFC5104]       |
   +-------------------------------------------------+-----------------+

                         Table 43: 5.4.5 SDP Offer
```
```
   +-------------------------------------------------+-----------------+
   | Answer SDP Contents                             | RFC#/Notes      |
   +-------------------------------------------------+-----------------+
   | v=0                                             | [RFC4566]       |
   | o=-  16833 0 IN IP4 0.0.0.0                     | [RFC4566]       |
   | s=-                                             | [RFC4566]       |
   | t=0 0                                           | [RFC4566]       |
   | ****** Audio m=line *********                   | *************** |
   |                                                 | **************  |
   | m=audio 49203 RTP/AVP 109                       | [RFC4566] Bob   |
   |                                                 | accepts RTP/AVP |
   |                                                 | based audio     |
   |                                                 | stream          |
   | c=IN IP4 203.0.113.77                           | [RFC4566]       |
   | a=rtpmap:109 opus/48000                         |                 |
   | a=ptime:20                                      |                 |
   | a=sendrecv                                      | [RFC3264]       |
   | a=ice-ufrag:c300d85b                            | [I-D.ietf-mmusi |
   |                                                 | c-ice-sip-sdp]  |
   | a=ice-pwd:de4e99bd291c325921d5d47efbabd9a2      | [I-D.ietf-mmusi |
   |                                                 | c-ice-sip-sdp]  |
   | a=fingerprint:sha-256 BB:05:2F:70:9F:04:A9:0E:0 | [RFC8122]       |
   | 5:E9:26:33:E8:70:88:A2:19:E2:1C:3B:4B:9F:81:E6: |                 |
   | B8:5C:F4:A5:A8:D8:73:04                         |                 |
   | a=rtcp-mux                                      | [RFC5761]       |
   | a=candidate:0 1 UDP 2113667327 198.51.100.7     | [I-D.ietf-mmusi |
   | 49203 typ host                                  | c-ice-sip-sdp]  |
   | a=candidate:1 1 UDP 1694302207 203.0.113.77     | [I-D.ietf-mmusi |
   | 49203 typ srflx raddr 198.51.100.7 rport 49203  | c-ice-sip-sdp]  |
   | ****** Video m=line *********                   | *************** |
   |                                                 | **************  |
   | m=video 63130 RTP/AVP 120                       | [RFC4566] Bob   |
   |                                                 | accepts RTP/AVP |
   |                                                 | based video     |
   |                                                 | stram           |
   | c=IN IP4 203.0.113.77                           | [RFC4566]       |
   | a=rtpmap:120 VP8/90000                          | [RFC7741]       |
   | a=sendrecv                                      | [RFC3264]       |
   | a=ice-ufrag:e39091na                            | [I-D.ietf-mmusi |
   |                                                 | c-ice-sip-sdp]  |
   | a=ice-pwd:dbc325921d5dd29e4e99147efbabd9a2      | [I-D.ietf-mmusi |
   |                                                 | c-ice-sip-sdp]  |
   | a=fingerprint:sha-256 BB:0A:0E:05:E9:26:33:E8:7 | [RFC8122]       |
   | 0:88:A2:2F:70:9F:04:19:E2:1C:3B:4B:9F:81:56:2F: |                 |
   | 70:9F:04:F4:A5:A8:D8                            |                 |
   | a=rtcp-mux                                      | [RFC5761]       |
   | a=candidate:0 1 UDP 2113667327 198.51.100.7     | [I-D.ietf-mmusi |
   | 63130 typ host                                  | c-ice-sip-sdp]  |
   | a=candidate:1 1 UDP 1694302207 203.0.113.77     | [I-D.ietf-mmusi |
   | 63130 typ srflx raddr 198.51.100.7 rport 63130  | c-ice-sip-sdp]  |
   | a=rtcp-fb:120 nack pli                          | [RFC4585]       |
   | a=rtcp-fb:120 ccm fir                           | [RFC5104]       |
   +-------------------------------------------------+-----------------+

                        Table 44: 5.4.5 SDP Answer
```

## 6. IANA Considerations

This document requires no actions from IANA.

## 7. Security Considerations

The IETF has published separate documents [I-D.ietf-rtcweb-security-arch] [I-D.ietf-rtcweb-security] describing the security architecture for WebRTC as a whole.

In addition, since the SDP offer and answer messages can contain private information about addresses and sessions to be established between parties, if this information needs to be kept private, some security mechanism (using TLS transport for example) in the protocol used to carry the offers and answers must be used.

## 8. Acknowledgments

We would like to thank Justin Uberti, Chris Flo, Paul Kyzivat, Nils Ohlmeier, Flemming Andreason, Magnus Westerlund for their detailed review and inputs.  Thanks to Adam Roach for providing syntax validation script to help highlight syntax and formatting errors.

## Appendix A. Appendix

### A.1. JSEP SDP Attributes Checklist

This section compiles a high-level checklist of the required SDP attributes to be verified against the examples defined in this specification.  The goal here is to ensure that the examples are compliant to the rules defined in section 5 of the [I-D.ietf-rtcweb-jsep] specification.

#### A.1.1. Common Checklist

This subsection lists SDP attributes that mostly apply at the session level.

*  v=0 MUST be the first SDP line.

*  o= line MUST follow with values '-' for username, 64 bit value for session id and dummy values for 'nettype', 'addrtype' and 'unicast-address' (for example: IN IP4 0.0.0.0).

*  o= line MUST have the session version incremented in the cases of subsequent offers.

*  s= MUST be the third line with the value of '-'.

*  t= line MUST follow with the values for 'start-time' and 'stop-time' set to zeroes.

*  a=identity line MUST be included at the session level if WEBRTC Identity mechanism is being used.

*  a=ice-options:trickle MUST be present at the session level in all offers and answers when supported.

#### A.1.2. RTP Media Description Checklist

Following set of checklist items apply to RTP audio and video media descriptions.

*  The media description's port value MUST either be set to dummy value of '9' or MUST use the port from the default candidate, if available.

*  The media description's proto value MUST be 'UDP/TLS/RTP/SAVPF' for JSEP offers.

*  JSEP answerer MUST support any combination of "RTP/[S]AVP[F]" for interoperability scenarios as defined in section 5 of [I-D.ietf-rtcweb-jsep]

*  c= line MUST be the first line in a media description.  A dummy value of 'IN IP 0.0.0.0' is set if there are no candidates gathered or its value MUST match the default candidate.

*  a=mid attribute MUST be in included.

*  One of a=sendrecv/a=sendonly/a=recvonly/a=inactive SDP direction attributes MUST be present.

*  a=rtpmap and a=fmtp attributes per primary, retransmission and forward error correction media format MUST be included.

*  a=rtcp-fb lines for each supported feedback mechanism MUST be included when using RTP with feedback

*  a=imageattr can be optionally present for video media descriptions.

*  a=msid line MUST be included for all the media senders identifying the MediaStreamTrack (i.e when a=sendonly/a=sendrecv attribute is present).

*  a=extmap line identifying the BUNDLE header extension MUST be present.

*  a=extmap lines for other supported RTP header extensions MUST be included.

*  a=rid line 'per encoding' with the direction of 'send' MUST be included when further constraining the media format or multiple encodings per media format is needed.

*  a=simulcast line MUST be present if there exists more than one 'a=rid' lines for the media senders.

*  a=bundle-only attribute MUST be present for media descriptions that are impacted by various bundle policies (such as max-bundle/ balanced)

*  For media descriptions that aren't "a=bundle-only" and that have unique address, following attributes MUST be present:

   *  a=ice-ufrag and a=ice-pwd

   *  a=fingerprint

   *  a=setup with value 'actpass' in the offers and a value of 'active'/'passive' in the answerer.

   *  a=tls-id

   *  a=rtcp

   *  a=rtcp-mux

   *  For offerers requiring RTCP to be multiplexed, 'a=rtcp-mux-only' line

   *  a=rtcp-rsize

*  a=group:BUNDLE line with all the 'mid' identifiers part of the BUNDLE group is included at the session level.

*  a=group:LS session level attribute MUST be included wth the 'mid' identifiers that are part of the lip same sync group.

#### A.1.3. DataChannel Media Description checklist

If a datachannel is required, an 'application' type media description MUST be included with the following properties:

*  Media description's proto value MUST be 'UDP/DTLS/SCTP' in the JSEP offers.

*  An JSEP answerer MUST support reception of 'UDP/DTLS/SCTP'/'TCP/DTLS/SCTP'/'DTLS/SCTP' for backward compatibility reasons.

*  A value of 'webrtc-datachannel' MUST be used for the media description 'fmt' value.

*  a=mid line MUST be present.

*  a=sctp-port with SCTP port number MUST be included.

*  a=max-message-size MAY be included, if appropriate.
