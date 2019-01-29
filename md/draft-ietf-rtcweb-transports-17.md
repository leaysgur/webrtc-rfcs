# Transports for WebRTC draft-ietf-rtcweb-transports-17

## 1. Introduction

WebRTC is a protocol suite aimed at real time multimedia exchange between browsers, and between browsers and other entities.

WebRTC is described in the WebRTC overview document, [I-D.ietf-rtcweb-overview], which also defines terminology used in this document, including the terms "WebRTC endpoint" and "WebRTC browser".

Terminology for RTP sources is taken from[RFC7656] .

This document focuses on the data transport protocols that are used by conforming implementations, including the protocols used for interaction with intermediate boxes such as firewalls, relays and NAT boxes.

This protocol suite intends to satisfy the security considerations described in the WebRTC security documents, [I-D.ietf-rtcweb-security] and [I-D.ietf-rtcweb-security-arch].

This document describes requirements that apply to all WebRTC endpoints.  When there are requirements that apply only to WebRTC browsers, this is called out explicitly.

## 2. Requirements language

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119 [RFC2119].

## 3. Transport and Middlebox specification

### 3.1. System-provided interfaces

The protocol specifications used here assume that the following protocols are available to the implementations of the WebRTC protocols:

*  UDP [RFC0768].  This is the protocol assumed by most protocol elements described.

*  TCP [RFC0793].  This is used for HTTP/WebSockets, as well as for TURN/TLS and ICE-TCP.

For both protocols, IPv4 and IPv6 support is assumed.

For UDP, this specification assumes the ability to set the DSCP code point of the sockets opened on a per-packet basis, in order to achieve the prioritizations described in [I-D.ietf-tsvwg-rtcweb-qos] (see Section 4.2) when multiple media types are multiplexed.  It does not assume that the DSCP codepoints will be honored, and does assume that they may be zeroed or changed, since this is a local configuration issue.

Platforms that do not give access to these interfaces will not be able to support a conforming WebRTC endpoint.

This specification does not assume that the implementation will have access to ICMP or raw IP.

The following protocols may be used, but can be implemented by a WebRTC endpoint, and are therefore not defined as "system-provided interfaces":

*  TURN - Traversal Using Relays Around NAT, [RFC5766]

*  STUN - Session Traversal Utilities for NAT, [RFC5389]

*  ICE - Interactive Connectivity Establishment, [I-D.ietf-ice-rfc5245bis]

*  TLS - Transport Layer Security, [RFC5246]

*  DTLS - Datagram Transport Layer Security, [RFC6347].

### 3.2. Ability to use IPv4 and IPv6

Web applications running in a WebRTC browser MUST be able to utilize both IPv4 and IPv6 where available - that is, when two peers have only IPv4 connectivity to each other, or they have only IPv6 connectivity to each other, applications running in the WebRTC browser MUST be able to communicate.

When TURN is used, and the TURN server has IPv4 or IPv6 connectivity to the peer or the peer's TURN server, candidates of the appropriate types MUST be supported.  The "Happy Eyeballs" specification for ICE [I-D.ietf-mmusic-ice-dualstack-fairness] SHOULD be supported.

### 3.3. Usage of temporary IPv6 addresses

The IPv6 default address selection specification [RFC6724] specifies that temporary addresses [RFC4941] are to be preferred over permanent addresses.  This is a change from the rules specified by [RFC3484]. For applications that select a single address, this is usually done by the IPV6_PREFER_SRC_TMP preference flag specified in [RFC5014]. However, this rule, which is intended to ensure that privacy-enhanced addresses are used in preference to static addresses, doesn't have the right effect in ICE, where all addresses are gathered and therefore revealed to the application.  Therefore, the following rule is applied instead:

When a WebRTC endpoint gathers all IPv6 addresses on its host, and both non-deprecated temporary addresses and permanent addresses of the same scope are present, the WebRTC endpoint SHOULD discard the permanent addresses before exposing addresses to the application or using them in ICE.  This is consistent with the default policy described in [RFC6724].

If some of the temporary IPv6 addresses, but not all, are marked deprecated, the WebRTC endpoint SHOULD discard the deprecated addresses, unless they are used by an ongoing connection.  In an ICE restart, deprecated addresses that are currently in use MAY be retained.

### 3.4. Middle box related functions

The primary mechanism to deal with middle boxes is ICE, which is an appropriate way to deal with NAT boxes and firewalls that accept traffic from the inside, but only from the outside if it is in response to inside traffic (simple stateful firewalls).

ICE [I-D.ietf-ice-rfc5245bis] MUST be supported.  The implementation MUST be a full ICE implementation, not ICE-Lite.  A full ICE implementation allows interworking with both ICE and ICE-Lite implementations when they are deployed appropriately.

In order to deal with situations where both parties are behind NATs of the type that perform endpoint-dependent mapping (as defined in [RFC5128] section 2.4), TURN [RFC5766] MUST be supported.

WebRTC browsers MUST support configuration of STUN and TURN servers, both from browser configuration and from an application.

Note that there is other work around STUN and TURN sever discovery and management, including [I-D.ietf-tram-turn-server-discovery] for server discovery, as well as [I-D.ietf-rtcweb-return].

In order to deal with firewalls that block all UDP traffic, the mode of TURN that uses TCP between the WebRTC endpoint and the TURN server MUST be supported, and the mode of TURN that uses TLS over TCP between the WebRTC endpoint and the TURN server MUST be supported. See [RFC5766] section 2.1 for details.

In order to deal with situations where one party is on an IPv4 network and the other party is on an IPv6 network, TURN extensions for IPv6 [RFC6156] MUST be supported.

TURN TCP candidates, where the connection from the WebRTC endpoint's TURN server to the peer is a TCP connection, [RFC6062] MAY be supported.

However, such candidates are not seen as providing any significant benefit, for the following reasons.

First, use of TURN TCP candidates would only be relevant in cases which both peers are required to use TCP to establish a PeerConnection.

Second, that use case is supported in a different way by both sides establishing UDP relay candidates using TURN over TCP to connect to their respective relay servers.

Third, using TCP between the WebRTC endpoint's TURN server and the peer may result in more performance problems than using UDP, e.g. due to head of line blocking.

ICE-TCP candidates [RFC6544] MUST be supported; this may allow applications to communicate to peers with public IP addresses across UDP-blocking firewalls without using a TURN server.

If TCP connections are used, RTP framing according to [RFC4571] MUST be used for all packets.  This includes the RTP packets, DTLS packets used to carry data channels, and STUN connectivity check packets.

The ALTERNATE-SERVER mechanism specified in [RFC5389] (STUN) section 11 (300 Try Alternate) MUST be supported.

The WebRTC endpoint MAY support accessing the Internet through an HTTP proxy.  If it does so, it MUST include the "ALPN" header as specified in [RFC7639], and proxy authentication as described in Section 4.3.6 of [RFC7231] and [RFC7235] MUST also be supported.

### 3.5. Transport protocols implemented

For transport of media, secure RTP is used.  The details of the profile of RTP used are described in "RTP Usage" [I-D.ietf-rtcweb-rtp-usage], which mandates the use of a circuit breaker [I-D.ietf-avtcore-rtp-circuit-breakers] and congstion control (see [I-D.ietf-rmcat-cc-requirements] for further guidance).

Key exchange MUST be done using DTLS-SRTP, as described in [I-D.ietf-rtcweb-security-arch].

For data transport over the WebRTC data channel [I-D.ietf-rtcweb-data-channel], WebRTC endpoints MUST support SCTP over DTLS over ICE.  This encapsulation is specified in [I-D.ietf-tsvwg-sctp-dtls-encaps].  Negotiation of this transport in SDP is defined in [I-D.ietf-mmusic-sctp-sdp].  The SCTP extension for NDATA, [I-D.ietf-tsvwg-sctp-ndata], MUST be supported.

The setup protocol for WebRTC data channels described in [I-D.ietf-rtcweb-data-protocol] MUST be supported.

Note: DTLS-SRTP as defined in [RFC5764] section 6.7.1 defines the interaction between DTLS and ICE ( [I-D.ietf-ice-rfc5245bis]).  The effect of this specification is that all ICE candidate pairs associated with a single component are part of the same DTLS association.  Thus, there will only be one DTLS handshake even if there are multiple valid candidate pairs.

WebRTC endpoints MUST support multiplexing of DTLS and RTP over the same port pair, as described in the DTLS-SRTP specification [RFC5764], section 5.1.2, with clarifications in [I-D.ietf-avtcore-rfc5764-mux-fixes].  All application layer protocol payloads over this DTLS connection are SCTP packets.

Protocol identification MUST be supplied as part of the DTLS handshake, as specified in [I-D.ietf-rtcweb-alpn].

## 4. Media Prioritization

The WebRTC prioritization model is that the application tells the WebRTC endpoint about the priority of media and data that is controlled from the API.

In this context, a "flow" is used for the units that are given a specific priority through the WebRTC API.

For media, a "media flow", which can be an "audio flow" or a "video flow", is what [RFC7656] calls a "media source", which results in a "source RTP stream" and one or more "redundancy RTP streams".  This specification does not describe prioritization between the RTP streams that come from a single "media source".

All media flows in WebRTC are assumed to be interactive, as defined in [RFC4594]; there is no browser API support for indicating whether media is interactive or non-interactive.

A "data flow" is the outgoing data on a single WebRTC data channel.

The priority associated with a media flow or data flow is classified as "very-low", "low", "medium or "high".  There are only four priority levels at the API.

The priority settings affect two pieces of behavior: Packet send sequence decisions and packet markings.  Each is described in its own section below.

### 4.1. Local prioritization

Local prioritization is applied at the local node, before the packet is sent.  This means that the prioritization has full access to the data about the individual packets, and can choose differing treatment based on the stream a packet belongs to.

When an WebRTC endpoint has packets to send on multiple streams that are congestion-controlled under the same congestion control regime, the WebRTC endpoint SHOULD cause data to be emitted in such a way that each stream at each level of priority is being given approximately twice the transmission capacity (measured in payload bytes) of the level below.

Thus, when congestion occurs, a "high" priority flow will have the ability to send 8 times as much data as a "very-low" priority flow if both have data to send.  This prioritization is independent of the media type.  The details of which packet to send first are implementation defined.

For example: If there is a high priority audio flow sending 100 byte packets, and a low priority video flow sending 1000 byte packets, and outgoing capacity exists for sending >5000 payload bytes, it would be appropriate to send 4000 bytes (40 packets) of audio and 1000 bytes (one packet) of video as the result of a single pass of sending decisions.

Conversely, if the audio flow is marked low priority and the video flow is marked high priority, the scheduler may decide to send 2 video packets (2000 bytes) and 5 audio packets (500 bytes) when outgoing capacity exists for sending > 2500 payload bytes.

If there are two high priority audio flows, each will be able to send 4000 bytes in the same period where a low priority video flow is able to send 1000 bytes.

Two example implementation strategies are:

*  When the available bandwidth is known from the congestion control algorithm, configure each codec and each data channel with a target send rate that is appropriate to its share of the available bandwidth.

*  When congestion control indicates that a specified number of packets can be sent, send packets that are available to send using a weighted round robin scheme across the connections.

Any combination of these, or other schemes that have the same effect, is valid, as long as the distribution of transmission capacity is approximately correct.

For media, it is usually inappropriate to use deep queues for sending; it is more useful to, for instance, skip intermediate frames that have no dependencies on them in order to achieve a lower bitrate.  For reliable data, queues are useful.

Note that this specification doesn't dictate when disparate streams are to be "congestion controlled under the same congestion control regime".  The issue of coupling congestion controllers is explored further in [I-D.ietf-rmcat-coupled-cc].

### 4.2. Usage of Quality of Service - DSCP and Multiplexing

When the packet is sent, the network will make decisions about queueing and/or discarding the packet that can affect the quality of the communication.  The sender can attempt to set the DSCP field of the packet to influence these decisions.

Implementations SHOULD attempt to set QoS on the packets sent, according to the guidelines in [I-D.ietf-tsvwg-rtcweb-qos].  It is appropriate to depart from this recommendation when running on platforms where QoS marking is not implemented.

The implementation MAY turn off use of DSCP markings if it detects symptoms of unexpected behaviour like priority inversion or blocking of packets with certain DSCP markings.  Some examples of such behaviors are described in [ANRW16].  The detection of these conditions is implementation dependent.

A particularly hard problem is when one media transport uses multiple DSCP code points, where one may be blocked and another may be allowed.  This is allowed even within a single media flow for video in [I-D.ietf-tsvwg-rtcweb-qos].  Implementations need to diagnose this scenario; one possible implementation is to send initial ICE probes with DSCP 0, and send ICE probes on all the DSCP code points that are intended to be used once a candidate pair has been selected. If one or more of the DSCP-marked probes fail, the sender will switch the media type to using DSCP 0.  This can be carried out simultaneously with the initial media traffic; on failure, the initial data may need to be resent.  This switch will of course invalidate any congestion information gathered up to that point.

Failures can also start happening during the lifetime of the call; this case is expected to be rarer, and can be handled by the normal mechanisms for transport failure, which may involve an ICE restart.

Note that when a DSCP code point causes non-delivery, one has to switch the whole media flow to DSCP 0, since all traffic for a single media flow needs to be on the same queue for congestion control purposes.  Other flows on the same transport, using different DSCP code points, don't need to change.

All packets carrying data from the SCTP association supporting the data channels MUST use a single DSCP code point.  The code point used SHOULD be that recommended by [I-D.ietf-tsvwg-rtcweb-qos] for the highest priority data channel carried.  Note that this means that all data packets, no matter what their relative priority is, will be treated the same by the network.

All packets on one TCP connection, no matter what it carries, MUST use a single DSCP code point.

More advice on the use of DSCP code points with RTP and on the relationship between DSCP and congestion control is given in [RFC7657].

There exist a number of schemes for achieving quality of service that do not depend solely on DSCP code points.  Some of these schemes depend on classifying the traffic into flows based on 5-tuple (source address, source port, protocol, destination address, destination port) or 6-tuple (5-tuple + DSCP code point).  Under differing conditions, it may therefore make sense for a sending application to choose any of the configurations:

*  Each media stream carried on its own 5-tuple

*  Media streams grouped by media type into 5-tuples (such as carrying all audio on one 5-tuple)

*  All media sent over a single 5-tuple, with or without differentiation into 6-tuples based on DSCP code points

In each of the configurations mentioned, data channels may be carried in its own 5-tuple, or multiplexed together with one of the media flows.

More complex configurations, such as sending a high priority video stream on one 5-tuple and sending all other video streams multiplexed together over another 5-tuple, can also be envisioned.  More information on mapping media flows to 5-tuples can be found in [I-D.ietf-rtcweb-rtp-usage].

A sending implementation MUST be able to support the following configurations:

*  Multiplex all media and data on a single 5-tuple (fully bundled)

*  Send each media stream on its own 5-tuple and data on its own 5-tuple (fully unbundled)

It MAY choose to support other configurations, such as bundling each media type (audio, video or data) into its own 5-tuple (bundling by media type).

Sending data channel data over multiple 5-tuples is not supported.

A receiving implementation MUST be able to receive media and data in all these configurations.

## 5. IANA Considerations

This document makes no request of IANA.

Note to RFC Editor: this section may be removed on publication as an RFC.

## 6. Security Considerations

RTCWEB security considerations are enumerated in [I-D.ietf-rtcweb-security].

Security considerations pertaining to the use of DSCP are enumerated in [I-D.ietf-tsvwg-rtcweb-qos].
