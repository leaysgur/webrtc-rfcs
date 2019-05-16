> Read [original](https://tools.ietf.org/html/draft-ietf-mmusic-sdp-mux-attributes-17) / [summary](../summary/draft-ietf-mmusic-sdp-mux-attributes-17.md)

---

# A Framework for SDP Attributes when Multiplexing

## 1. Introduction

SDP defines several attributes for capturing characteristics that apply to the individual media descriptions (described by "m=" lines") and the overall multimedia session.  Typically different media types (audio, video, etc.) described using different media descriptions represent separate RTP sessions that are carried over individual transport layer flows.  However [I-D.ietf-mmusic-sdp-bundle-negotiation] defines a way to use a single address:port combination (BUNDLE address) for receiving media associated with multiple SDP media descriptions.  This would, for example allow the usage of a single set of Interactive Connectivity Establishment (ICE) [RFC5245] candidates for multiple media descriptions.  This in turn has made it necessary to understand the interpretation and usage of the SDP attributes defined for the multiplexed media descriptions.

Given the number of SDP attributes registered with the [IANA] and possibility of new attributes being defined in the future, there is need for a framework to analyze these attributes for their applicability in the transport multiplexing use-cases.

The document starts with providing the motivation for requiring such a framework.  This is followed by introduction to the SDP attribute analysis framework/procedures, following which several sections apply the framework to the SDP attributes registered with the [IANA].

## 2. Terminology

5-tuple: A collection of the following values: source address, source port, destination address, destination port, and transport-layer protocol.

3GPP: Third Generation Partnership Project; see http://www.3gpp.org for more information about this organization.

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC2119].

## 3. Motivation

The time and complications of setting up ICE [RFC5245] and Datagram Transport Layer Security (DTLS) based Secure Real-time Transport Protocol (SRTP) [RFC5763] transports for use by RTP, reasons to conserve ports bindings on the Network Address Translators (NAT), forms a requirement to try and reduce the number of transport level flows needed.  This has resulted in the definition of ways, such as [I-D.ietf-mmusic-sdp-bundle-negotiation] to multiplex RTP over a single transport flow in order to preserve network resources such as port numbers.  This imposes further restrictions on applicability of the SDP attributes as they are defined today.

The specific problem is that there are attribute combinations which make sense when specified on independent "m=" lines -- as with classical SDP -- that do not make sense when those "m=" lines are then multiplexed over the same transport.  To give an obvious example, ICE permits each "m=" line to have an independently specified ice-ufrag attribute.  However, if the media from multiple "m=" lines is multiplexed over the same ICE component, then the meaning of media-level ice-ufrag attributes becomes muddled.

At the time of writing this document there are close to 250 SDP attributes registered with the [IANA] and more will be added in the future.  There is no clearly defined procedure to establish the validity/applicability of these attributes when used with transport multiplexing.

## 4. SDP Attribute Analysis Framework

Attributes in an SDP session description can be defined at the session-level or media-level or source-level.  Informally, there are various semantic groupings for these attributes.  One such grouping could be notes as below:

*  Attributes related to media content such as media type, encoding schemes and payload types.

*  Attributes specifying media transport characteristics like RTP/RTP Control Protocol (RTCP) port numbers, network addresses and QOS.

*  Metadata description attributes capturing session timing and origin information.

*  Attributes establishing relationships between media descriptions such as grouping framework [RFC5888]

The proposed framework analyzes the SDP attributes usage under multiplexing and assigns each SDP attribute to an appropriate multiplexing category.  Since the multiplexing categories defined in this specification are independent of any informal semantic groupings of the SDP attributes, the categorizations assigned are normative.

### 4.1. Category: NORMAL

The attributes in the NORMAL category can be independently specified when multiplexed and they retain their original semantics.

In the example given below, the direction and label attributes are independently specified for audio and video "m=" lines.  These attributes are not impacted by multiplexing these media streams over a single transport layer flow.


```
        v=0
        o=alice 2890844526 2890844527 IN IP4 host.atlanta.example.com
        s=
        c=IN IP4 host.atlanta.example.com
        t=0 0
        m=audio 49172 RTP/AVP 99
        a=sendonly
        a=label:1
        a=rtpmap:99 iLBC/8000
        m=video 49172 RTP/AVP 31
        a=recvonly
        a=label:2
        a=rtpmap:31 H261/90000
```

### 4.2. Category: CAUTION

The attributes in the CAUTION category are advised against multiplexing since their usage under multiplexing might lead to incorrect behavior.

Example: Multiplexing media descriptions over a single Datagram Congestion Control Protocol (DCCP) transport [RFC5762] is not recommended since DCCP being a connection oriented protocol doesn't allow multiple connections on the same 5-tuple.


```
        v=0
        o=bob 2890844527 2890844527 IN IP4 client.biloxi.example.com
        s=
        c=IN IP4 client.biloxi.example.com
        t=0 0
        m=video 5004 DCCP/RTP/AVP 99
        a=rtpmap:99 h261/9000
        a=dccp-service-code:SC=x52545056
        a=setup:passive
        a=connection:new
        m=video 5004 DCCP/RTP/AVP 100
        a=rtpmap:100 h261/9000
        a=dccp-service-code:SC=x5254504f
        a=setup:passive
        a=connection:new
```

### 4.3. Category: IDENTICAL

The attributes and their associated values (if any) in the IDENTICAL category MUST be repeated across all the media descriptions under multiplexing.

Attributes such as rtcp-mux fall into this category.  Since RTCP reporting is done per RTP session, RTCP Multiplexing MUST be enabled for both the audio and video "m=" lines if they are transported over a single 5-tuple.


```
        v=0
        o=bob 2890844527 2890844527 IN IP4 client.biloxi.example.com
        s=
        c=IN IP4 client.biloxi.example.com
        t=0 0
        m=audio 34567 RTP/AVP 97
        a=rtcp-mux
        m=video 34567 RTP/AVP 31
        a=rtpmap:31 H261/90000
        a=rtcp-mux
```

Note: Eventhough IDENTICAL attributes must be repeated across all media descriptions under multiplexing, they might not always be explicitly encoded across all media descriptions. [I-D.ietf-mmusic-sdp-bundle-negotiation] defines rules for when attributes and their values are implicitly applied to media description.



### 4.4. Category: SUM

The attributes in the SUM category can be set as they are normally used but software using them in the multiplexing scenario MUST apply the sum of all the attributes being multiplexed instead of trying to use them independently.  This is typically used for bandwidth or other rate limiting attributes to the underlying transport.

The software parsing the SDP sample below, should use the aggregate Application Specific (AS) bandwidth value from the individual media descriptions to determine the AS value for the multiplexed session. Thus the calculated AS value would be 256+64 kilobits per second for the given example.


```
         v=0
         o=test 2890844526 2890842807 IN IP4 client.biloxi.example.com
         c=IN IP4 client.biloxi.example.com
         t=0 0
         m=audio 49170 RTP/AVP 0
         b=AS:64
         m=video 51372 RTP/AVP 31
         b=AS:256
```

### 4.5. Category: TRANSPORT

The attributes in the TRANSPORT category can be set normally for multiple items in a multiplexed group but the software MUST pick the one that's associated with the "m=" line whose information is used for setting up the underlying transport.

In the example below, "a=crypto" attribute is defined for both the audio and the video "m=" lines.  The video media line's a=crypto attribute is chosen since its mid value (bar) appears first in the a=group:BUNDLE line.  This is due to BUNDLE grouping semantic [I-D.ietf-mmusic-sdp-bundle-negotiation] which mandates the values from "m=" line corresponding to the mid appearing first on the a=group:BUNDLE line to be considered for setting up the RTP Transport.


```
        v=0
        o=alice 2890844526 2890844527 IN IP4 host.atlanta.example.com
        s=
        c=IN IP4 host.atlanta.example.com
        t=0 0
        a=group:BUNDLE bar foo
        m=audio 49172 RTP/AVP 99
        a=mid:foo
        a=crypto:1 AES_CM_128_HMAC_SHA1_80
          inline:d0RmdmcmVCspeEc3QGZiNWpVLFJhQX1cfHAwJSoj|2^20|1:32
        a=rtpmap:99 iLBC/8000
        m=video 51374 RTP/AVP 31
        a=mid:bar
        a=crypto:1 AES_CM_128_HMAC_SHA1_80
          inline:EcGZiNWpFJhQXdspcl1ekcmVCNWpVLcfHAwJSoj|2^20|1:32
        a=rtpmap:96 H261/90000
```

### 4.6. Category: INHERIT

The attributes in the INHERIT category encapsulate other SDP attributes or parameters.  These attributes inherit their multiplexing characteristics from the attributes or parameters they encapsulate.  Such attributes are defined in [RFC3407], [RFC5939] and [RFC6871] as part of a generic framework for indicating and negotiating transport, media, and media format related capabilities in the SDP.

The inheritance manifests itself when the encapsulated attribute or parameter is being leveraged.  In the case of SDP Capability Negotiation [RFC5939] for example, this occurs when a capability (encapsulating attribute) is used as part of a configuration; the configuration inherits the multiplexing category of each of its constituent (encapsulated) attributes and parameters.  The inherited attributes MUST be coherent in order to form a valid configuration from a multiplexing point of view (see Section 14 for further details).


```
          v=0
          o=alice 2890844526 2890844527 IN IP4 host.atlanta.example.com
          s=
          c=IN IP4 host.atlanta.example.com
          t=0 0
          m=video 3456 RTP/AVP 100
          a=rtpmap:100 VP8/90000
          a=fmtp:100 max-fr=30;max-fs=8040
          a=sqn: 0
          a=cdsc: 1 video RTP/AVP 100
          a=cpar: a=rtcp-mux
          m=video 3456 RTP/AVP 101
          a=rtpmap:101 VP8/90000
          a=fmtp:100 max-fr=15;max-fs=1200
          a=cdsc: 2 video RTP/AVP 101
          a=cpar: a=rtcp-mux
```

In the above example, the category IDENTICAL is inherited by the cpar encapsulated rtcp-mux attribute.

### 4.7. Category: IDENTICAL-PER-PT

The attributes in the IDENTICAL-PER-PT category define the RTP payload configuration on per Payload Type basis and MUST have identical values across all the media descriptions for a given RTP Payload Type when repeated.  These Payload Types identify the same codec configuration as defined in the Section 10.1.2 of [I-D.ietf-mmusic-sdp-bundle-negotiation] under this context.

In the SDP example below, Payload Types 96 and 97 are repeated across all the video "m=" lines and all the payload specific parameters (ex: rtpmap, fmtp) are identical (Note: some line breaks included are due to formatting only).


```
        v=0
        o=alice 2890844526 2890844527 IN IP4 host.atlanta.example.com
        s=
        c=IN IP4 host.atlanta.example.com
        t=0 0
        a=group:BUNDLE cam1 cam2
        m=video 96 97
        a=mid:cam1
        a=rtpmap:96 H264/90000
        a=fmtp:96 profile-level-id=42400d; max-fs=3600; max-fps=3000;
        max-mbps=108000; max-br=1000
        a=rtpmap:97 H264/90000
        a=fmtp:97 profile-level-id=42400a; max-fs=240; max-fps=3000;
        max-mbps=7200; max-br=200
        m=video  96 97
        a=mid:cam2
        a=rtpmap:96 H264/90000
        a=fmtp:96 profile-level-id=42400d; max-fs=3600; max-fps=3000;
        max-mbps=108000; max-br=1000
        a=rtpmap:97 H264/90000
        a=fmtp:97 profile-level-id=42400a; max-fs=240; max-fps=3000;
        max-mbps=7200; max-br=200
```

### 4.8. Category: SPECIAL

For the attributes in the SPECIAL category, the text in the specification defining the attribute MUST be consulted for further handling when multiplexed.

As an exampe, for the attribute extmap [RFC5285], the specification defining the extension needs to be referred to understand the multiplexing implications.

### 4.9. Category: TBD

The attributes in the TBD category have not been analyzed under the proposed multiplexing framework and SHOULD NOT be multiplexed.

## 5. Analysis of Existing Attributes

This section analyzes attributes listed in [IANA], grouped under the IETF document that defines them.

The "Level" column indicates whether the attribute is currently specified as:

*  S -- Session level

*  M -- Media level

*  B -- Both (Implies either a session level or a media level attribute)

*  SR -- Source-level (for a single SSRC) [RFC5576]

The "Mux Category" column identifies multiplexing category assigned per attribute and the "Notes" column captures additional informative details regarding the assigned category, wherever necessary.

### 5.1. RFC4566: SDP

[RFC4566] defines SDP that is intended for describing multimedia sessions for the purposes of session announcement, session invitation, and other forms of multimedia session initiation.


```
   +----------------+-----------------------+-------+------------------+
   | Name           | Notes                 | Level | Mux Category     |
   +----------------+-----------------------+-------+------------------+
   | sendrecv       | Not impacted          | B     | NORMAL           |
   |                |                       |       |                  |
   | sendonly       | Not impacted          | B     | NORMAL           |
   |                |                       |       |                  |
   | recvonly       | Not impacted          | B     | NORMAL           |
   |                |                       |       |                  |
   | inactive       | Not impacted          | B     | NORMAL           |
   |                |                       |       |                  |
   | cat            | Not impacted          | S     | NORMAL           |
   |                |                       |       |                  |
   | ptime          | The attribute value   | M     | IDENTICAL-PER-PT |
   |                | MUST be same for a    |       |                  |
   |                | given codec           |       |                  |
   |                | configuration         |       |                  |
   |                |                       |       |                  |
   | maxptime       | The attribute value   | M     | IDENTICAL-PER-PT |
   |                | MUST be same for a    |       |                  |
   |                | given codec           |       |                  |
   |                | configuration         |       |                  |
   |                |                       |       |                  |
   | orient         | Not Impacted          | M     | NORMAL           |
   |                |                       |       |                  |
   | framerate      | The attribute value   | M     | IDENTICAL-PER-   |
   |                | MUST be same for a    |       | PT               |
   |                | given codec           |       |                  |
   |                | configuration         |       |                  |
   |                |                       |       |                  |
   | quality        | Not Impacted          | M     | NORMAL           |
   |                |                       |       |                  |
   | rtpmap         | The attribute value   | M     | IDENTICAL-PER-PT |
   |                | MUST be same for a    |       |                  |
   |                | given codec           |       |                  |
   |                | configuration         |       |                  |
   |                |                       |       |                  |
   | fmtp           | The attribute value   | M     | IDENTICAL-PER-PT |
   |                | MUST be same for a    |       |                  |
   |                | given codec           |       |                  |
   |                | configuration         |       |                  |
   |                |                       |       |                  |
   | keywds         | Not impacted          | S     | NORMAL           |
   |                |                       |       |                  |
   | type           | Not Impacted          | S     | NORMAL           |
   |                |                       |       |                  |
   | type:broadcast | Not Impacted          | S     | NORMAL           |
   |                |                       |       |                  |
   | type:H332      | Not Impacted          | S     | NORMAL           |
   |                |                       |       |                  |
   | type:meeting   | Not Impacted          | S     | NORMAL           |
   |                |                       |       |                  |
   | type:moderated | Not Impacted          | S     | NORMAL           |
   |                |                       |       |                  |
   | type:test      | Not Impacted          | S     | NORMAL           |
   |                |                       |       |                  |
   | tool           | Not Impacted          | S     | NORMAL           |
   |                |                       |       |                  |
   | charset        | Not Impacted          | S     | NORMAL           |
   |                |                       |       |                  |
   | sdplang        | Not Impacted          | B     | NORMAL           |
   |                |                       |       |                  |
   | lang           | Not Impacted          | B     | NORMAL           |
   |                |                       |       |                  |
   +----------------+-----------------------+-------+------------------+

                      5.1 RFC4566 Attribute Analysis
```

### 5.2. RFC4585: RTP/AVPF

[RFC4585] defines an extension to the Audio-visual Profile (AVP) that enables receivers to provide, statistically, more immediate feedback to the senders and thus allows for short-term adaptation and efficient feedback-based repair mechanisms to be implemented.


```
   +---------+------------------------------+-------+------------------+
   | Name    | Notes                        | Level | Mux Category     |
   +---------+------------------------------+-------+------------------+
   | rtcp-   | Since RTCP feedback          | M     | IDENTICAL-PER-   |
   | fb      | attributes are Payload Type  |       | PT               |
   |         | (PT) scoped, their values    |       |                  |
   |         | MUST be identical for a      |       |                  |
   |         | given PT across the          |       |                  |
   |         | multiplexed "m=" lines.      |       |                  |
   |         |                              |       |                  |
   +---------+------------------------------+-------+------------------+

                      5.2 RFC4585 Attribute Analysis
```

### 5.3. RFC5761: Multiplexing RTP and RTCP

[RFC5761] discusses issues that arise when multiplexing RTP data packets and RTP Control Protocol (RTCP) packets on a single UDP port. It describes when such multiplexing is and is not appropriate, and it explains how the SDP can be used to signal multiplexed sessions.


```
   +----------+------------------------------------+-------+-----------+
   | Name     | Notes                              | Level | Mux       |
   |          |                                    |       | Category  |
   +----------+------------------------------------+-------+-----------+
   | rtcp-    | RTP and RTCP Multiplexing affects  | M     | IDENTICAL |
   | mux      | the entire RTP session             |       |           |
   |          |                                    |       |           |
   +----------+------------------------------------+-------+-----------+

                      5.3 RFC5761 Attribute Analysis
```

### 5.4. RFC3312: Integration of Resource Management and SIP

[RFC3312]  defines a generic framework for preconditions, which are extensible through IANA registration.  This document also discusses how network quality of service can be made a precondition for establishment of sessions initiated by the Session Initiation Protocol (SIP).  These preconditions require that the participant reserve network resources before continuing with the session.


```
         +-------+-----------------------+-------+--------------+
         | Name  | Notes                 | Level | Mux Category |
         +-------+-----------------------+-------+--------------+
         | des   | Refer to notes below  | M     | CAUTION      |
         |       |                       |       |              |
         | conf  | Refer to notes below  | M     | CAUTION      |
         |       |                       |       |              |
         | curr  | Refer to notes below  | M     | CAUTION      |
         |       |                       |       |              |
         +-------+-----------------------+-------+--------------+

                      5.4 RFC3312 Attribute Analysis
```

NOTE: A mismatched set of preconditions across media descriptions results in Session establishment failures due to inability to meet right resource reservations requested.

### 5.5. RFC4574: SDP Label Attribute

[RFC4574] defines a new SDP media-level attribute: "label".  The "label" attribute carries a pointer to a media stream in the context of an arbitrary network application that uses SDP.  The sender of the SDP document can attach the "label" attribute to a particular media stream or streams.  The application can then use the provided pointer to refer to each particular media stream in its context.


```
             +--------+---------------+-------+--------------+
             | Name   | Notes         | Level | Mux Category |
             +--------+---------------+-------+--------------+
             | label  | Not Impacted  | M     | NORMAL       |
             |        |               |       |              |
             +--------+---------------+-------+--------------+

                      5.5 RFC4574 Attribute Analysis
```

### 5.6. RFC5432: QOS Mechanism Selection in SDP

[RFC5432] defines procedures to negotiate QOS mechanisms using the SDP offer/answer model.


```
     +----------------+-----------------------+-------+--------------+
     | Name           | Notes                 | Level | Mux Category |
     +----------------+-----------------------+-------+--------------+
     | qos-mech-send  | Refer to Section 10   | B     | TRANSPORT    |
     |                |                       |       |              |
     | qos-mech-recv  | Refer to Section 10   | B     | TRANSPORT    |
     |                |                       |       |              |
     +----------------+-----------------------+-------+--------------+

                      5.6 RFC5432 Attribute Analysis
```

### 5.7. RFC4568: SDP Security Descriptions

[RFC4568] defines a SDP cryptographic attribute for unicast media streams.  The attribute describes a cryptographic key and other parameters that serve to configure security for a unicast media stream in either a single message or a roundtrip exchange.


```
   +--------+--------------------------------------+-------+-----------+
   | Name   | Notes                                | Level | Mux       |
   |        |                                      |       | Category  |
   +--------+--------------------------------------+-------+-----------+
   | crypto | crypto attribute MUST be the one     | M     | TRANSPORT |
   |        | that corresponds to the "m=" line    |       |           |
   |        | chosen for setting up the underlying |       |           |
   |        | transport flow                       |       |           |
   |        |                                      |       |           |
   +--------+--------------------------------------+-------+-----------+

                      5.7 RFC4568 Attribute Analysis
```

### 5.8. RFC5762: RTP over DCCP

RTP is a widely used transport for real-time multimedia on IP networks.  DCCP is a transport protocol that provides desirable services for real-time applications.  [RFC5762] specifies a mapping of RTP onto DCCP, along with associated signaling, such that real-time applications can make use of the services provided by DCCP.


```
   +-------------------+--------------------------+---------+----------+
   | Name              | Notes                    | Current | Mux      |
   |                   |                          |         | Category |
   +-------------------+--------------------------+---------+----------+
   | dccp-service-     | If RFC6773 is not being  | M       | CAUTION  |
   | code              | used in addition to      |         |          |
   |                   | RFC5762, the port in the |         |          |
   |                   | "m=" line is a DCCP      |         |          |
   |                   | port. DCCP being a       |         |          |
   |                   | connection oriented      |         |          |
   |                   | protocol does not allow  |         |          |
   |                   | multiple connections on  |         |          |
   |                   | the same 5-tuple         |         |          |
   |                   |                          |         |          |
   +-------------------+--------------------------+---------+----------+

                      5.8 RFC5762 Attribute Analysis
```

NOTE: If RFC6773 is being used in addition to RFC5762 and provided that DCCP-in-UDP layer has additional demultiplexing, then it can be possible to use different DCCP service codes for each DCCP flow, given each uses a different DCCP port.  Although doing so might conflict with the media type of the "m=" line.  None of this is standardized yet and it wouldn't work as explained.  Hence performing multiplexing is not recommended even in this alternate scenario.

### 5.9. RFC6773: DCCP-UDP Encapsulation

[RFC6773] specifies an alternative encapsulation of DCCP, referred to as DCCP-UDP.  This encapsulation allows DCCP to be carried through the current generation of Network Address Translation (NAT) middle boxes without modification of those middle boxes.


```
   +-----------+------------------------------------+-------+----------+
   | Name      | Notes                              | Level | Mux      |
   |           |                                    |       | Category |
   +-----------+------------------------------------+-------+----------+
   | dccp-     | Multiplexing is not recommended    | M     | CAUTION  |
   | port      | due to potential conflict between  |       |          |
   |           | the port used for DCCP             |       |          |
   |           | en/decapsulation and the RTP       |       |          |
   |           |                                    |       |          |
   +-----------+------------------------------------+-------+----------+

                      5.9 RFC6773 Attribute Analysis
```

NOTE: RFC6773 is about tunneling DCCP in UDP, with the UDP port being the port of the DCCP en-/de-capsulation service.  This encapsulation allows arbitrary DCCP packets to be encapsulated and the DCCP port chosen can conflict with the port chosen for the RTP traffic.  For multiplexing several DCCP-in-UDP encapsulations on the same UDP port with no RTP traffic on the same port implies collapsing several DCCP port spaces together.  This can or cannot work depending on the nature of DCCP encapsulation and ports choices thus rendering it to be very application dependent.

### 5.10. RFC5506: Reduced-Size RTCP in RTP Profile

[RFC5506] discusses benefits and issues that arise when allowing RTCP packets to be transmitted with reduced size.


```
   +------------+----------------------------------+-------+-----------+
   | Name       | Notes                            | Level | Mux       |
   |            |                                  |       | Category  |
   +------------+----------------------------------+-------+-----------+
   | rtcp-      | Reduced size RTCP affects the    | M     | IDENTICAL |
   | rsize      | entire RTP session               |       |           |
   |            |                                  |       |           |
   +------------+----------------------------------+-------+-----------+

                      5.10 RFC5506 Attribute Analysis
```

### 5.11. RFC6787: Media Resource Control Protocol Version 2

The Media Resource Control Protocol Version 2 (MRCPv2) allows client hosts to control media service resources such as speech synthesizers, recognizers, verifiers, and identifiers residing in servers on the network.  MRCPv2 is not a "stand-alone" protocol -- it relies on other protocols, such as the SIP, to coordinate MRCPv2 clients and servers, and manage session between them, and SDP to describe, discover, and exchange capabilities.  It also depends on SIP and SDP to establish the media sessions and associated parameters between the media source or sink and the media server.  Once this is done, the MRCPv2 exchange operates over the control session established above, allowing the client to control the media processing resources on the speech resource server.  [RFC6787] defines attributes for this purpose.


```
           +-----------+---------------+-------+--------------+
           | Name      | Notes         | Level | Mux Category |
           +-----------+---------------+-------+--------------+
           | resource  | Not Impacted  | M     | NORMAL       |
           |           |               |       |              |
           | channel   | Not Impacted  | M     | NORMAL       |
           |           |               |       |              |
           | cmid      | Not Impacted  | M     | NORMAL       |
           |           |               |       |              |
           +-----------+---------------+-------+--------------+

                      5.11 RFC6787 Attribute Analysis
```

### 5.12. RFC5245: ICE

[RFC5245] describes a protocol for NAT traversal for UDP-based multimedia sessions established with the offer/answer model.  ICE makes use of the Session Traversal Utilities for NAT (STUN) protocol and its extension, Traversal Using Relay NAT (TURN).  ICE can be used by any protocol utilizing the offer/answer model, such as the SIP.


```
   +-------------------+---------------------------+-------+-----------+
   | Name              | Notes                     | Level | Mux       |
   |                   |                           |       | Category  |
   +-------------------+---------------------------+-------+-----------+
   | ice-lite          | Not Impacted              | S     | NORMAL    |
   |                   |                           |       |           |
   | ice-options       | Not Impacted              | S     | NORMAL    |
   |                   |                           |       |           |
   | ice-mismatch      | Not Impacted              | S     | NORMAL    |
   |                   |                           |       |           |
   | ice-pwd           | ice-pwd MUST be the one   | B     | TRANSPORT |
   |                   | that corresponds to the   |       |           |
   |                   | "m=" line chosen for      |       |           |
   |                   | setting up the underlying |       |           |
   |                   | transport flow            |       |           |
   |                   |                           |       |           |
   | ice-ufrag         | ice-ufrag MUST be the one | B     | TRANSPORT |
   |                   | that corresponds to the   |       |           |
   |                   | "m=" line chosen for      |       |           |
   |                   | setting up the underlying |       |           |
   |                   | transport flow            |       |           |
   |                   |                           |       |           |
   | candidate         | ice candidate MUST be the | M     | TRANSPORT |
   |                   | one that corresponds to   |       |           |
   |                   | the "m=" line chosen for  |       |           |
   |                   | setting up the underlying |       |           |
   |                   | transport flow            |       |           |
   |                   |                           |       |           |
   | remote-           | ice remote candidate MUST | M     | TRANSPORT |
   | candidates        | be the one that           |       |           |
   |                   | corresponds to the "m="   |       |           |
   |                   | line chosen for setting   |       |           |
   |                   | up the underlying         |       |           |
   |                   | transport flow            |       |           |
   |                   |                           |       |           |
   +-------------------+---------------------------+-------+-----------+

                      5.12 RFC5245 Attribute Analysis
```

### 5.13. RFC5285: RTP Header Extensions

[RFC5285] provides a general mechanism to use the header extension feature of RTP.  It provides the option to use a small number of small extensions in each RTP packet, where the universe of possible extensions is large and registration is de-centralized.  The actual extensions in use in a session are signaled in the setup information for that session.


```
   +--------+---------------------------------------+-------+----------+
   | Name   | Notes                                 | Level | Mux      |
   |        |                                       |       | Category |
   +--------+---------------------------------------+-------+----------+
   | extmap | Refer to the document defining the    | B     | SPECIAL  |
   |        | specific RTP Extension                |       |          |
   |        |                                       |       |          |
   +--------+---------------------------------------+-------+----------+

                      5.13 RFC5285 Attribute Analysis
```

### 5.14. RFC3605: RTCP attribute in SDP

Originally, SDP assumed that RTP and RTCP were carried on consecutive ports.  However, this is not always true when NATs are involved. [RFC3605] specifies an early mechanism to indicate the RTCP port.


```
   +------+----------------------------------------+-------+-----------+
   | Name | Notes                                  | Level | Mux       |
   |      |                                        |       | Category  |
   +------+----------------------------------------+-------+-----------+
   | rtcp | RTCP Port MUST be the one that         | M     | TRANSPORT |
   |      | corresponds to the "m=" line chosen    |       |           |
   |      | for setting up the underlying          |       |           |
   |      | transport flow.                        |       |           |
   |      |                                        |       |           |
   +------+----------------------------------------+-------+-----------+

                      5.14 RFC3605 Attribute Analysis
```

### 5.15. RFC5576: Source-Specific SDP Attributes

[RFC5576] defines a mechanism to describe RTP media sources, which are identified by their synchronization source (SSRC) identifiers, in SDP, to associate attributes with these sources, and to express relationships among sources.  It also defines several source-level attributes that can be used to describe properties of media sources.


```
   +---------------+------------------------+-------+------------------+
   | Name          | Notes                  | Level | Mux Category     |
   +---------------+------------------------+-------+------------------+
   | ssrc          | Refer to Notes below   | M     | NORMAL           |
   |               |                        |       |                  |
   | ssrc-group    | Refer to Section 9 for | M     | NORMAL           |
   |               | specific analysis of   |       |                  |
   |               | the grouping           |       |                  |
   |               | semantics              |       |                  |
   |               |                        |       |                  |
   | cname         | Not Impacted           | SR    | NORMAL           |
   |               |                        |       |                  |
   | previous-     | Refer to notes below   | SR    | NORMAL           |
   | ssrc          |                        |       |                  |
   |               |                        |       |                  |
   | fmtp          | The attribute value    | SR    | IDENTICAL-PER-   |
   |               | MUST be same for a     |       | PT               |
   |               | given codec            |       |                  |
   |               | configuration          |       |                  |
   |               |                        |       |                  |
   +---------------+------------------------+-------+------------------+

                      5.15 RFC5576 Attribute Analysis
```

NOTE: If SSRCs are repeated across "m=" lines being multiplexed, they MUST all represent the same underlying RTP Source.

### 5.16. RFC7273: RTP Clock Source Signalling

[RFC7273] specifies SDP signalling that identifies timestamp reference clock sources and SDP signalling that identifies the media clock sources in a multimedia session.


```
       +--------------------+---------------+-------+--------------+
       | Name               | Notes         | Level | Mux Category |
       +--------------------+---------------+-------+--------------+
       | ts-refclk          | Not Impacted  | B     | NORMAL       |
       |                    |               |       |              |
       | mediaclk           | Not Impacted  | B     | NORMAL       |
       |                    |               |       |              |
       | ts-refclk:ntp      | Not Impacted  | B     | NORMAL       |
       |                    |               |       |              |
       | ts-refclk:ptp      | Not Impacted  | B     | NORMAL       |
       |                    |               |       |              |
       | ts-refclk:gps      | Not Impacted  | B     | NORMAL       |
       |                    |               |       |              |
       | ts-refclk:gal      | Not Impacted  | B     | NORMAL       |
       |                    |               |       |              |
       | ts-refclk:glonass  | Not Impacted  | B     | NORMAL       |
       |                    |               |       |              |
       | ts-refclk:local    | Not Impacted  | B     | NORMAL       |
       |                    |               |       |              |
       | ts-refclk:private  | Not Impacted  | B     | NORMAL       |
       |                    |               |       |              |
       | mediaclk:sender    | Not Impacted  | B     | NORMAL       |
       |                    |               |       |              |
       | mediaclk:direct    | Not Impacted  | B     | NORMAL       |
       |                    |               |       |              |
       | mediaclk:IEEE1722  | Not Impacted  | B     | NORMAL       |
       |                    |               |       |              |
       +--------------------+---------------+-------+--------------+

                      5.16 RFC7273 Attribute Analysis
```

### 5.17. RFC6236: Image Attributes in SDP

[RFC6236] proposes a new generic session setup attribute to make it possible to negotiate different image attributes such as image size. A possible use case is to make it possible for a low-end hand-held terminal to display video without the need to rescale the image, something that may consume large amounts of memory and processing power.  The document also helps to maintain an optimal bitrate for video as only the image size that is desired by the receiver is transmitted.


```
   +-----------+----------------------------+-------+------------------+
   | Name      | Notes                      | Level | Mux Category     |
   +-----------+----------------------------+-------+------------------+
   | imageattr | The attribute value MUST   | M     | IDENTICAL-PER-   |
   |           | be same for a given codec  |       | PT               |
   |           | configuration              |       |                  |
   |           |                            |       |                  |
   +-----------+----------------------------+-------+------------------+

                      5.17 RFC6236 Attribute Analysis
```

### 5.18. RFC7197: Duplication Delay Attribute in SDP

[RFC7197] defines an attribute to indicate the presence of temporally redundant media streams and the duplication delay in SDP.


```
       +--------------------+---------------+-------+--------------+
       | Name               | Notes         | Level | Mux Category |
       +--------------------+---------------+-------+--------------+
       | duplication-delay  | Not Impacted  | B     | NORMAL       |
       |                    |               |       |              |
       +--------------------+---------------+-------+--------------+

                      5.18 RFC7197 Attribute Analysis
```

### 5.19. RFC7266: RTCP XR Blocks for MOS Metric Reporting

[RFC7266] defines an RTCP Extended Report (XR) Block including two new segment types and associated SDP parameters that allow the reporting of mean opinion score (MOS) Metrics for use in a range of RTP applications.


```
          +-------------+---------------+-------+--------------+
          | Name        | Notes         | Level | Mux Category |
          +-------------+---------------+-------+--------------+
          | calgextmap  | Not Impacted  | B     | NORMAL       |
          |             |               |       |              |
          +-------------+---------------+-------+--------------+

                      5.19 RFC7266 Attribute Analysis
```

### 5.20. RFC6285: Rapid Acquisition of Multicast RTP Sessions

[RFC6285] describes a method using the existing RTP and RTCP machinery that reduces the acquisition delay.  In this method, an auxiliary unicast RTP session carrying the Reference Information to the receiver precedes or accompanies the multicast stream.  This unicast RTP flow can be transmitted at a faster than natural bitrate to further accelerate the acquisition.  The motivating use case for this capability is multicast applications that carry real-time compressed audio and video.

```
        +---------------+------------------+-------+--------------+
        | Name          | Notes            | Level | Mux Category |
        +---------------+------------------+-------+--------------+
        | rams-updates  | Not recommended  | M     | CAUTION      |
        |               |                  |       |              |
        +---------------+------------------+-------+--------------+

                      5.20 RFC6285 Attribute Analysis
```

### 5.21. RFC6230: Media Control Channel Framework

[RFC6230] describes a framework and protocol for application deployment where the application programming logic and media processing are distributed.  This implies that application programming logic can seamlessly gain access to appropriate resources that are not co-located on the same physical network entity.  The framework uses SIP to establish an application-level control mechanism between application servers and associated external servers such as media servers.


```
            +---------+---------------+-------+--------------+
            | Name    | Notes         | Level | Mux Category |
            +---------+---------------+-------+--------------+
            | cfw-id  | Not Impacted  | M     | NORMAL       |
            |         |               |       |              |
            +---------+---------------+-------+--------------+

                      5.21 RFC6230 Attribute Analysis
```

### 5.22. RFC6364: SDP Elements for FEC Framework

[RFC6364] specifies the use of SDP to describe the parameters required to signal the Forward Error Correction (FEC) Framework Configuration Information between the sender(s) and receiver(s). This document also provides examples that show the semantics for grouping multiple source and repair flows together for the applications that simultaneously use multiple instances of the FEC Framework.


```
   +-----------------+------------------------------+-------+----------+
   | Name            | Notes                        | Level | Mux      |
   |                 |                              |       | Category |
   +-----------------+------------------------------+-------+----------+
   | fec-source-     | Refer to the document        | M     | SPECIAL  |
   | flow            | defining specific FEC        |       |          |
   |                 | Scheme                       |       |          |
   |                 |                              |       |          |
   | fec-repair-     | Refer to the document        | M     | SPECIAL  |
   | flow            | defining specific FEC        |       |          |
   |                 | Scheme                       |       |          |
   |                 |                              |       |          |
   | repair-window   | Refer to the document        | M     | SPECIAL  |
   |                 | defining specific FEC        |       |          |
   |                 | Scheme                       |       |          |
   |                 |                              |       |          |
   +-----------------+------------------------------+-------+----------+

                      5.22 RFC6364 Attribute Analysis
```

### 5.23. RFC4796: Content Attribute

[RFC4796] defines a new SDP media-level attribute, 'content'.  The 'content' attribute defines the content of the media stream to a more detailed level than the media description line.  The sender of an SDP session description can attach the 'content' attribute to one or more media streams.  The receiving application can then treat each media stream differently (e.g., show it on a big or small screen) based on its content.


```
            +----------+---------------+-------+--------------+
            | Name     | Notes         | Level | Mux Category |
            +----------+---------------+-------+--------------+
            | content  | Not Impacted  | M     | NORMAL       |
            |          |               |       |              |
            +----------+---------------+-------+--------------+

                      5.23 RFC4796 Attribute Analysis
```

### 5.24. RFC3407: SDP Simple Capability Declaration

[RFC3407] defines a set of SDP attributes that enables SDP to provide a minimal and backwards compatible capability declaration mechanism.


```
       +----------+------------------------+-------+--------------+
       | Name     | Notes                  | Level | Mux Category |
       +----------+------------------------+-------+--------------+
       | sqn      | Not Impacted           | B     | NORMAL       |
       |          |                        |       |              |
       | cdsc     | Not Impacted.          | B     | NORMAL       |
       |          |                        |       |              |
       | cpar     | Refer to Section 14    | B     | INHERIT      |
       |          |                        |       |              |
       | cparmin  | Refer to notes below   | B     | SPECIAL      |
       |          |                        |       |              |
       | cparmax  | Refer to notes below   | B     | SPECIAL      |
       |          |                        |       |              |
       +----------+------------------------+-------+--------------+

                      5.24 RFC3407 Attribute Analysis
```

NOTE: The attributes (a=cparmin and a=cparmax) define minimum and maximum numerical values associated with the attributes described in a=cpar.

Since the cpar attribute can either define a 'b=' attribute or any 'a=' attribute, the multiplexing category depends on actual attribute being encapsulated and the implications of the numerical values assigned.  Hence it is recommended to consult the specification defining attributes (cparmin/cparmax) to further analyze their behavior under multiplexing.

### 5.25. RFC6284: Port Mapping between Unicast and Multicast RTP Sessions

[RFC6284] presents a port mapping solution that allows RTP receivers to choose their own ports for an auxiliary unicast session in RTP applications using both unicast and multicast services.  The solution provides protection against denial-of-service or packet amplification attacks that could be used to cause one or more RTP packets to be sent to a victim client.


```
   +-----------------+------------------------------+-------+----------+
   | Name            | Notes                        | Level | Mux      |
   |                 |                              |       | Category |
   +-----------------+------------------------------+-------+----------+
   | portmapping-    | Not recommended, if port     | M     | CAUTION  |
   | req             | mapping is required by the   |       |          |
   |                 | application                  |       |          |
   |                 |                              |       |          |
   +-----------------+------------------------------+-------+----------+

                      5.25 RFC6284 Attribute Analysis
```

### 5.26. RFC6714: MSRP-CEMA

[RFC6714] defines a Message Session Relay Protocol (MSRP) extension, Connection Establishment for Media Anchoring (CEMA).  Support of this extension is optional.  The extension allows middle boxes to anchor the MSRP connection, without the need for middle boxes to modify the MSRP messages; thus, it also enables secure end-to-end MSRP communication in networks where such middle boxes are deployed.  This document also defines a SDP attribute, 'msrp-cema', that MSRP endpoints use to indicate support of the CEMA extension.


```
       +------------+-----------------------+-------+--------------+
       | Name       | Notes                 | Level | Mux Category |
       +------------+-----------------------+-------+--------------+
       | msrp-cema  | Refer to notes below  | M     | TBD          |
       |            |                       |       |              |
       +------------+-----------------------+-------+--------------+

                      5.26 RFC6714 Attribute Analysis
```

NOTE: As per section 9 of [I-D.ietf-mmusic-sdp-bundle-negotiation], there exists no publicly available specification that defines procedures for multiplexing/demultiplexing MRSP flows over a single 5-tuple.  Once such a specification is available, the multiplexing categories assignments for the attributes in this section could be revisited.

### 5.27. RFC4583: SDP Format for BFCP Streams

[RFC4583] document specifies how to describe Binary Floor Control Protocol (BFCP) streams in SDP descriptions.  User agents using the offer/answer model to establish BFCP streams use this format in their offers and answers.


```
       +------------+-----------------------+-------+--------------+
       | Name       | Notes                 | Level | Mux Category |
       +------------+-----------------------+-------+--------------+
       | floorctrl  | Refer to notes below  | M     | TBD          |
       |            |                       |       |              |
       | confid     | Not Impacted          | M     | NORMAL       |
       |            |                       |       |              |
       | userid     | Not Impacted          | M     | NORMAL       |
       |            |                       |       |              |
       | floorid    | Not Impacted          | M     | NORMAL       |
       |            |                       |       |              |
       +------------+-----------------------+-------+--------------+

                      5.27 RFC4583 Attribute Analysis
```

NOTE: As per section 9 of [I-D.ietf-mmusic-sdp-bundle-negotiation], there exists no publicly available specification that defines procedures for multiplexing/demultiplexing BFCP streams over a single 5-tuple.  Once such a specification is available, the multiplexing categories assignments for the attributes in this section could be revisited.

### 5.28. RFC5547: SDP Offer/Answer for File Transfer

[RFC5547] provides a mechanism to negotiate the transfer of one or more files between two endpoints by using the SDP offer/answer model specified in [RFC3264].


```
   +-------------------+-----------------------+-------+--------------+
   | Name              | Notes                 | Level | Mux Category |
   +-------------------+-----------------------+-------+--------------+
   | file-selector     | Refer to notes below  | M     | TBD          |
   |                   |                       |       |              |
   | file-transfer-id  | Refer to notes below  | M     | TBD          |
   |                   |                       |       |              |
   | file-disposition  | Refer to notes below  | M     | TBD          |
   |                   |                       |       |              |
   | file-date         | Refer to notes below  | M     | TBD          |
   |                   |                       |       |              |
   | file-icon         | Refer to notes below  | M     | TBD          |
   |                   |                       |       |              |
   | file-range        | Refer to notes below  | M     | TBD          |
   |                   |                       |       |              |
   +-------------------+-----------------------+-------+--------------+

                      5.28 RFC5547 Attribute Analysis
```

NOTE: As per section 9 of [I-D.ietf-mmusic-sdp-bundle-negotiation], there exists no publicly available specification that defines procedures for multiplexing/demultiplexing MRSP flows over a single 5-tuple.  Once such a specification is available, the multiplexing categories assignments for attributes in this section could be revisited.

### 5.29. RFC6849: SDP and RTP Media Loopback Extension

[RFC6849] adds new SDP media types and attributes, which enable establishment of media sessions where the media is looped back to the transmitter.  Such media sessions will serve as monitoring and troubleshooting tools by providing the means for measurement of more advanced Voice over IP (VoIP), Real-time Text, and Video over IP performance metrics.


```
   +--------------------+-------------------+-------+------------------+
   | Name               | Notes             | Level | Mux Category     |
   +--------------------+-------------------+-------+------------------+
   | loopback rtp-pkt-  | The attribute     | M     | IDENTICAL-PER-   |
   | loopback           | value MUST be     |       | PT               |
   |                    | same for a given  |       |                  |
   |                    | codec             |       |                  |
   |                    | configuration     |       |                  |
   |                    |                   |       |                  |
   | loopback rtp-      | The attribute     | M     | IDENTICAL-PER-   |
   | media-loopback     | value MUST be     |       | PT               |
   |                    | same for a given  |       |                  |
   |                    | codec             |       |                  |
   |                    | configuration     |       |                  |
   |                    |                   |       |                  |
   | loopback-source    | Not Impacted      | M     | NORMAL           |
   |                    |                   |       |                  |
   | loopback-mirror    | Not Impacted      | M     | NORMAL           |
   |                    |                   |       |                  |
   +--------------------+-------------------+-------+------------------+

                           5.29 RFC6849 Analysis
```

### 5.30. RFC5760: RTCP with Unicast Feedback

[RFC5760] specifies an extension to RTCP to use unicast feedback to a multicast sender.  The proposed extension is useful for single-source multicast sessions such as Source-Specific Multicast (SSM) communication where the traditional model of many-to-many group communication is either not available or not desired.


```
   +--------------+--------------------------------+-------+-----------+
   | Name         | Notes                          | Level | Mux       |
   |              |                                |       | Category  |
   +--------------+--------------------------------+-------+-----------+
   | rtcp-        | The attribute MUST be reported | M     | IDENTICAL |
   | unicast      | across all "m=" lines          |       |           |
   |              | multiplexed                    |       |           |
   |              |                                |       |           |
   +--------------+--------------------------------+-------+-----------+

                      5.30 RFC5760 Attribute Analysis
```

### 5.31. RFC3611: RTCP XR

[RFC3611] defines the Extended Report (XR) packet type for RTCP, and defines how the use of XR packets can be signaled by an application if it employs the Session Description Protocol (SDP).


```
            +----------+---------------+-------+--------------+
            | Name     | Notes         | Level | Mux Category |
            +----------+---------------+-------+--------------+
            | rtcp-xr  | Not Impacted  | B     | NORMAL       |
            |          |               |       |              |
            +----------+---------------+-------+--------------+

                      5.31 RFC3611 Attribute Analysis
```

### 5.32. RFC5939: SDP Capability Negotiation

[RFC5939] defines a general SDP Capability Negotiation framework.  It also specifies how to provide attributes and transport protocols as capabilities and negotiate them using the framework.  Extensions for other types of capabilities (e.g., media types and media formats) may be provided in other documents.


```
        +---------+-----------------------+-------+--------------+
        | Name    | Notes                 | Level | Mux Category |
        +---------+-----------------------+-------+--------------+
        | pcfg    | Refer to Section 14   | M     | SPECIAL      |
        |         |                       |       |              |
        | acfg    | Refer to Section 14   | M     | SPECIAL      |
        |         |                       |       |              |
        | csup    | Not Impacted          | B     | NORMAL       |
        |         |                       |       |              |
        | creq    | Not Impacted          | B     | NORMAL       |
        |         |                       |       |              |
        | acap    | Refer to Section 14   | B     | INHERIT      |
        |         |                       |       |              |
        | tcap    | Refer to Section 14   | B     | INHERIT      |
        |         |                       |       |              |
        | cap-v0  | Not Impacted          | B     | NORMAL       |
        |         |                       |       |              |
        +---------+-----------------------+-------+--------------+

                      5.32 RFC5939 Attribute Analysis
```

### 5.33. RFC6871: SDP Media Capabilities Negotiation

SDP capability negotiation provides a general framework for indicating and negotiating capabilities in SDP.  The base framework defines only capabilities for negotiating transport protocols and attributes.  [RFC6871] extends the framework by defining media capabilities that can be used to negotiate media types and their associated parameters.


```
      +---------+-----------------------+-------+-------------------+
      | Name    | Notes                 | Level | Mux Category      |
      +---------+-----------------------+-------+-------------------+
      | rmcap   | Refer to Section 14   | B     | IDENTICAL-PER-PT  |
      |         |                       |       |                   |
      | omcap   | Not Impacted          | B     | NORMAL            |
      |         |                       |       |                   |
      | mfcap   | Refer to Section 14   | B     | IDENTICAL-PER-PT  |
      |         |                       |       |                   |
      | mscap   | Refer to Section 14   | B     | INHERIT           |
      |         |                       |       |                   |
      | lcfg    | Refer to Section 14   | B     | SPECIAL           |
      |         |                       |       |                   |
      | sescap  | Refer to notes below  | S     | CAUTION           |
      |         |                       |       |                   |
      | med-v0  | Not Impacted          | S     | NORMAL            |
      |         |                       |       |                   |
      +---------+-----------------------+-------+-------------------+

                     5.33 RFC6871 - Attribute Analysis
```

NOTE: The "sescap" attribute is not recommended for use with multiplexing.  The reason is that it requires the use of unique configuration numbers across the entire SDP (per [RFC6871]) as opposed to within a media description only (per [RFC5939]).  As described in Section 14, the use of identical configuration numbers between multiplexed (bundled) media descriptions is the default way of indicating compatible configurations in a bundle.

### 5.34. RFC7006: Miscellaneous Capabilities Negotiation SDP

[RFC7006] extends the SDP capability negotiation framework to allow endpoints to negotiate three additional SDP capabilities.  In particular, this memo provides a mechanism to negotiate bandwidth ("b=" line), connection data ("c=" line), and session or media titles ("i=" line for each session or media).


```
   +---------+-------------------------------------+-------+-----------+
   | Name    | Notes                               | Level | Mux       |
   |         |                                     |       | Category  |
   +---------+-------------------------------------+-------+-----------+
   | bcap    | Inherit the category SUM as         | B     | INHERIT   |
   |         | applicable to b= attribute          |       |           |
   |         |                                     |       |           |
   | bcap-v0 | Not Impacted                        | B     | NORMAL    |
   |         |                                     |       |           |
   | ccap    | The connection address type MUST be | B     | IDENTICAL |
   |         | identical across all the            |       |           |
   |         | multiplexed "m=" lines              |       |           |
   |         |                                     |       |           |
   | ccap-v0 | Not Impacted                        | B     | NORMAL    |
   |         |                                     |       |           |
   | icap    | Not Impacted                        | B     | NORMAL    |
   |         |                                     |       |           |
   | icap-v0 | Not Impacted                        | B     | NORMAL    |
   |         |                                     |       |           |
   +---------+-------------------------------------+-------+-----------+

                     5.34 RFC7006 - Attribute Analysis
```

### 5.35. RFC4567: Key Management Extensions for SDP and RTSP

[RFC4567] defines general extensions for SDP and Real Time Streaming Protocol (RTSP) to carry messages, as specified by a key management protocol, in order to secure the media.  These extensions are presented as a framework, to be used by one or more key management protocols.  As such, their use is meaningful only when complemented by an appropriate key management protocol.


```
   +----------+------------------------------------+-------+-----------+
   | Name     | Notes                              | Level | Mux       |
   |          |                                    |       | Category  |
   +----------+------------------------------------+-------+-----------+
   | key-     | Key management protocol MUST be    | B     | IDENTICAL |
   | mgmt     | identical across all the "m="      |       |           |
   |          | lines                              |       |           |
   |          |                                    |       |           |
   | mikey    | Key management protocol MUST be    | B     | IDENTICAL |
   |          | identical across all the "m="      |       |           |
   |          | lines                              |       |           |
   |          |                                    |       |           |
   +----------+------------------------------------+-------+-----------+

                      5.35 RFC4567 Attribute Analysis
```

### 5.36. RFC4572: Comedia over TLS in SDP

[RFC4572] specifies how to establish secure connection-oriented media transport sessions over the Transport Layer Security (TLS) protocol using SDP.  It defines a new SDP protocol identifier, 'TCP/TLS'.  It also defines the syntax and semantics for an SDP 'fingerprint' attribute that identifies the certificate that will be presented for the TLS session.  This mechanism allows media transport over TLS connections to be established securely, so long as the integrity of session descriptions is assured.


```
   +-------------+---------------------------------+-------+-----------+
   | Name        | Notes                           | Level | Mux       |
   |             |                                 |       | Category  |
   +-------------+---------------------------------+-------+-----------+
   | fingerprint | fingerprint value MUST be the   | B     | TRANSPORT |
   |             | one that corresponds to the     |       |           |
   |             | "m=" line chosen for setting up |       |           |
   |             | the underlying transport flow   |       |           |
   |             |                                 |       |           |
   +-------------+---------------------------------+-------+-----------+

                      5.36 RFC4572 Attribute Analysis
```

### 5.37. RFC4570: SDP Source Filters

[RFC4570] describes how to adapt SDP to express one or more source addresses as a source filter for one or more destination "connection" addresses.  It defines the syntax and semantics for an SDP "source-filter" attribute that may reference either IPv4 or IPv6 address(es) as either an inclusive or exclusive source list for either multicast or unicast destinations.  In particular, an inclusive source-filter can be used to specify a Source-Specific Multicast (SSM) session.


```
   +---------------+-------------------------------+-------+-----------+
   | Name          | Notes                         | Level | Mux       |
   |               |                               |       | Category  |
   +---------------+-------------------------------+-------+-----------+
   | source-       | The attribute MUST be         | B     | IDENTICAL |
   | filter        | repeated across all "m="      |       |           |
   |               | lines multiplexed             |       |           |
   |               |                               |       |           |
   +---------------+-------------------------------+-------+-----------+

                      5.37 RFC4570 Attribute Analysis
```

### 5.38. RFC6128: RTCP Port for Multicast Sessions

SDP has an attribute that allows RTP applications to specify an address and a port associated with the RTCP traffic.  In RTP-based source-specific multicast (SSM) sessions, the same attribute is used to designate the address and the RTCP port of the Feedback Target in the SDP description.  However, the RTCP port associated with the SSM session itself cannot be specified by the same attribute to avoid ambiguity, and thus, is required to be derived from the "m=" line of the media description.  Deriving the RTCP port from the "m=" line imposes an unnecessary restriction.  [RFC6128] removes this restriction by introducing a new SDP attribute.


```
   +----------------+------------------------------+-------+-----------+
   | Name           | Notes                        | Level | Mux       |
   |                |                              |       | Category  |
   +----------------+------------------------------+-------+-----------+
   | multicast-     | Multicast RTCP port MUST be  | B     | IDENTICAL |
   | rtcp           | identical across all the     |       |           |
   |                | "m=" lines                   |       |           |
   |                |                              |       |           |
   +----------------+------------------------------+-------+-----------+

                      5.38 RFC6128 Attribute Analysis
```

### 5.39. RFC6189: ZRTP

[RFC6189] defines ZRTP, a protocol for media path Diffie-Hellman exchange to agree on a session key and parameters for establishing unicast SRTP sessions for (VoIP applications.


```
   +-----------+-----------------------------------+-------+-----------+
   | Name      | Notes                             | Level | Mux       |
   |           |                                   |       | Category  |
   +-----------+-----------------------------------+-------+-----------+
   | zrtp-     | zrtp-hash attribute MUST be the   | M     | TRANSPORT |
   | hash      | one that corresponds to the "m="  |       |           |
   |           | line chosen for setting up the    |       |           |
   |           | underlying transport flow         |       |           |
   |           |                                   |       |           |
   +-----------+-----------------------------------+-------+-----------+

                      5.39 RFC6189 Attribute Analysis
```

### 5.40. RFC4145: Connection-Oriented Media

[RFC4145] describes how to express media transport over TCP using SDP.  It defines the SDP 'TCP' protocol identifier, the SDP 'setup' attribute, which describes the connection setup procedure, and the SDP 'connection' attribute, which handles connection reestablishment.


```
   +------------+----------------------------------+-------+-----------+
   | Name       | Notes                            | Level | Mux       |
   |            |                                  |       | Category  |
   +------------+----------------------------------+-------+-----------+
   | setup      | The setup attribute MUST be the  | B     | TRANSPORT |
   |            | one that corresponds to the "m=" |       |           |
   |            | line chosen for setting up the   |       |           |
   |            | underlying transport flow.       |       |           |
   |            |                                  |       |           |
   | connection | The connection attribute MUST be | B     | TRANSPORT |
   |            | the one that corresponds to the  |       |           |
   |            | "m=" line chosen for setting up  |       |           |
   |            | the underlying transport flow.   |       |           |
   |            |                                  |       |           |
   +------------+----------------------------------+-------+-----------+

                      5.40 RFC4145 Attribute Analysis
```

### 5.41. RFC6947: The SDP altc Attribute

[RFC6947] proposes a mechanism that allows the same SDP offer to carry multiple IP addresses of different address families (e.g., IPv4 and IPv6).  The proposed attribute, the "altc" attribute, solves the backward-compatibility problem that plagued Alternative Network Address Types (ANAT) due to their syntax.


```
   +------+----------------------------------------+-------+-----------+
   | Name | Notes                                  | Level | Mux       |
   |      |                                        |       | Category  |
   +------+----------------------------------------+-------+-----------+
   | altc | The IP Address and port MUST be the    | M     | TRANSPORT |
   |      | one that corresponds to the "m=" line  |       |           |
   |      | chosen for setting up the underlying   |       |           |
   |      | transport flow                         |       |           |
   |      |                                        |       |           |
   +------+----------------------------------------+-------+-----------+

                      5.41 RFC6947 Attribute Analysis
```



### 5.42. RFC7195: SDP Extension for Circuit Switched Bearers in PSTN

[RFC7195] describes use cases, requirements, and protocol extensions for using SDP offer/answer model for establishing audio and video media streams over circuit-switched bearers in the Public Switched Telephone Network (PSTN).


```
   +-------------------------+-------------------+-------+-------------+
   | Name                    | Notes             | Level | Mux         |
   |                         |                   |       | Category    |
   +-------------------------+-------------------+-------+-------------+
   | cs-                     | Refer to notes    | M     | TBD         |
   | correlation:callerid    | below             |       |             |
   |                         |                   |       |             |
   | cs-correlation:uuie     | Refer to notes    | M     | TBD         |
   |                         | below             |       |             |
   |                         |                   |       |             |
   | cs-correlation:dtmf     | Refer to notes    | M     | TBD         |
   |                         | below             |       |             |
   |                         |                   |       |             |
   | cs-                     | Refer to notes    | M     | TBD         |
   | correlation:external    | below             |       |             |
   |                         |                   |       |             |
   +-------------------------+-------------------+-------+-------------+

                      5.42 RFC7195 Attribute Analysis
```

NOTE: [RFC7195] defines SDP attributes for establishing audio and video media streams over circuit-switched bearers by defining a new nettype value "PSTN".  However, section 7.2 of [I-D.ietf-mmusic-sdp-bundle-negotiation] requires the "c=" line nettype value of "IN".  If in future there exists a specification that defines procedures to multiplex media streams over nettype "PSTN", the multiplexing categories for attributes in this section could be revisited.

### 5.43. RFC7272: IDMS Using the RTP Control Protocol (RTCP)

[RFC7272] defines a new RTCP Packet Type and an RTCP Extended Report (XR) Block Type to be used for achieving Inter-Destination Media Synchronization (IDMS).


```
           +------------+---------------+-------+--------------+
           | Name       | Notes         | Level | Mux Category |
           +------------+---------------+-------+--------------+
           | rtcp-idms  | Not Impacted  | M     | NORMAL       |
           |            |               |       |              |
           +------------+---------------+-------+--------------+

                      5.43 RFC7272 Attribute Analysis
```

### 5.44. RFC5159: Open Mobile Alliance (OMA) Broadcast (BCAST) SDP Attributes

[RFC5159] provides descriptions of SDP attributes used by the Open Mobile Alliance's Broadcast Service and Content Protection specification.


```
   +--------------------+-----------------------+-------+--------------+
   | Name               | Notes                 | Level | Mux Category |
   +--------------------+-----------------------+-------+--------------+
   | bcastversion       | Not Impacted          | S     | NORMAL       |
   |                    |                       |       |              |
   | stkmstream         | Not Impacted          | B     | NORMAL       |
   |                    |                       |       |              |
   | SRTPAuthentication | Needs further         | M     | TBD          |
   |                    | analysis              |       |              |
   |                    |                       |       |              |
   | SRTPROCTxRate      | Needs further         | M     | TBD          |
   |                    | analysis              |       |              |
   |                    |                       |       |              |
   +--------------------+-----------------------+-------+--------------+

                      5.44 RFC5159 Attribute Analysis
```

### 5.45. RFC6193: Media Description for IKE in SDP

[RFC6193] specifies how to establish a media session that represents a virtual private network using the Session Initiation Protocol for the purpose of on-demand media/application sharing between peers.  It extends the protocol identifier of SDP so that it can negotiate use of the Internet Key Exchange Protocol (IKE) for media sessions in the SDP offer/answer model.


```
   +------------------+-----------------------------+-------+----------+
   | Name             | Notes                       | Level | Mux      |
   |                  |                             |       | Category |
   +------------------+-----------------------------+-------+----------+
   | ike-setup        | Unlikely to use IKE in the  | B     | CAUTION  |
   |                  | context of multiplexing     |       |          |
   |                  |                             |       |          |
   | psk-fingerprint  | Unlikely to use IKE in the  | B     | CAUTION  |
   |                  | context of multiplexing     |       |          |
   |                  |                             |       |          |
   | ike-esp          | Unlikely to use IKE in the  | B     | CAUTION  |
   |                  | context of multiplexing     |       |          |
   |                  |                             |       |          |
   | ike-esp-         | Unlikely to use IKE in the  | B     | CAUTION  |
   | udpencap         | context of multiplexing     |       |          |
   |                  |                             |       |          |
   +------------------+-----------------------------+-------+----------+

                      5.45 RFC6193 Attribute Analysis
```

### 5.46. RFC2326: Real Time Streaming Protocol

The Real Time Streaming Protocol, or RTSP, is an application-level protocol for control over the delivery of data with real-time properties.  RTSP provides an extensible framework to enable controlled, on-demand delivery of real-time data, such as audio and video.


```
   +---------+-------------------------------------+-------+-----------+
   | Name    | Notes                               | Level | Mux       |
   |         |                                     |       | Category  |
   +---------+-------------------------------------+-------+-----------+
   | etag    | RTSP is not supported for RTP       | B     | CAUTION   |
   |         | Stream multiplexing                 |       |           |
   |         |                                     |       |           |
   | range   | RTSP is not supported for RTP       | B     | CAUTION   |
   |         | Stream multiplexing                 |       |           |
   |         |                                     |       |           |
   | control | RTSP is not supported for RTP       | B     | CAUTION   |
   |         | Stream multiplexing                 |       |           |
   |         |                                     |       |           |
   | mtag    | RTSP is not supported for RTP       | B     | CAUTION   |
   |         | Stream multiplexing                 |       |           |
   |         |                                     |       |           |
   +---------+-------------------------------------+-------+-----------+

                      5.46 RFC2326 Attribute Analysis
```

NOTE: [RFC2326] defines SDP attributes that are applicable in the declarative usage of SDP alone.  For purposes of this document, only the Offer/Answer usage of SDP is considered as mandated by [I-D.ietf-mmusic-sdp-bundle-negotiation].

### 5.47. RFC6064: SDP and RTSP Extensions for 3GPP

The Packet-switched Streaming Service (PSS) and the Multimedia Broadcast/Multicast Service (MBMS) defined by 3GPP use SDP and RTSP with some extensions.  [RFC6064] provides information about these extensions and registers the RTSP and SDP extensions with IANA.


```
   +--------------------------------+---------------+-------+----------+
   | Name                           | Notes         | Level | Mux      |
   |                                |               |       | Category |
   +--------------------------------+---------------+-------+----------+
   | X-predecbufsize                | Refer to      | M     | CAUTION  |
   |                                | notes below   |       |          |
   |                                |               |       |          |
   | X-initpredecbufperiod          | Refer to      | M     | CAUTION  |
   |                                | notes below   |       |          |
   |                                |               |       |          |
   | X-initpostdecbufperiod         | Refer to      | M     | CAUTION  |
   |                                | notes below   |       |          |
   |                                |               |       |          |
   | X-decbyterate                  | Refer to      | M     | CAUTION  |
   |                                | notes below   |       |          |
   |                                |               |       |          |
   | 3gpp-videopostdecbufsize       | Refer to      | M     | CAUTION  |
   |                                | notes below   |       |          |
   |                                |               |       |          |
   | framesize                      | Refer to      | M     | CAUTION  |
   |                                | notes below   |       |          |
   |                                |               |       |          |
   | 3GPP-Integrity-Key             | Refer to      | S     | CAUTION  |
   |                                | notes below   |       |          |
   |                                |               |       |          |
   | 3GPP-SDP-Auth                  | Refer to      | S     | CAUTION  |
   |                                | notes below   |       |          |
   |                                |               |       |          |
   | 3GPP-SRTP-Config               | Refer to      | M     | CAUTION  |
   |                                | notes below   |       |          |
   |                                |               |       |          |
   | alt                            | Refer to      | M     | CAUTION  |
   |                                | notes below   |       |          |
   |                                |               |       |          |
   | alt-default-id                 | Refer to      | M     | CAUTION  |
   |                                | notes below   |       |          |
   |                                |               |       |          |
   | alt-group                      | Refer to      | S     | CAUTION  |
   |                                | notes below   |       |          |
   |                                |               |       |          |
   | 3GPP-Adaptation-Support        | Refer to      | M     | CAUTION  |
   |                                | notes below   |       |          |
   |                                |               |       |          |
   | 3GPP-Asset-Information         | Refer to      | B     | CAUTION  |
   |                                | notes below   |       |          |
   |                                |               |       |          |
   | mbms-mode                      | Refer to      | B     | CAUTION  |
   |                                | notes below   |       |          |
   |                                |               |       |          |
   | mbms-flowid                    | Refer to      | M     | CAUTION  |
   |                                | notes below   |       |          |
   |                                |               |       |          |
   | mbms-repair                    | Refer to      | B     | CAUTION  |
   |                                | notes below   |       |          |
   |                                |               |       |          |
   | 3GPP-QoE-Metrics               | Refer to      | M     | CAUTION  |
   |                                | notes below   |       |          |
   |                                |               |       |          |
   | 3GPP-QoE-Metrics:Corruption    | Refer to      | M     | CAUTION  |
   | duration                       | notes below   |       |          |
   |                                |               |       |          |
   | 3GPP-QoE-Metrics:Rebuffering   | Refer to      | M     | CAUTION  |
   | duration                       | notes below   |       |          |
   |                                |               |       |          |
   | 3GPP-QoE-Metrics:Initial       | Refer to      | M     | CAUTION  |
   | buffering duration             | notes below   |       |          |
   |                                |               |       |          |
   | 3GPP-QoE-Metrics:Successive    | Refer to      | M     | CAUTION  |
   | loss of RTP packets            | notes below   |       |          |
   |                                |               |       |          |
   | 3GPP-QoE-Metrics:Frame rate    | Refer to      | M     | CAUTION  |
   | deviation                      | notes below   |       |          |
   |                                |               |       |          |
   | 3GPP-QoE-Metrics:Jitter        | Refer to      | M     | CAUTION  |
   | duration                       | notes below   |       |          |
   |                                |               |       |          |
   | 3GPP-QoE-Metrics:Content       | Refer to      | B     | CAUTION  |
   | Switch Time                    | notes below   |       |          |
   |                                |               |       |          |
   | 3GPP-QoE-Metrics:Average Codec | Refer to      | M     | CAUTION  |
   | Bitrate                        | notes below   |       |          |
   |                                |               |       |          |
   | 3GPP-QoE-Metrics:Codec         | Refer to      | M     | CAUTION  |
   | Information                    | notes below   |       |          |
   |                                |               |       |          |
   | 3GPP-QoE-Metrics:Buffer        | Refer to      | M     | CAUTION  |
   | Status                         | notes below   |       |          |
   |                                |               |       |          |
   +--------------------------------+---------------+-------+----------+

                      5.47 RFC6064 Attribute Analysis
```

NOTE: [RFC6064] defines SDP attributes that are applicable in the declarative usage of SDP alone.  For purposes of this document, only the Offer/Answer usage of SDP is considered as mandated by [I-D.ietf-mmusic-sdp-bundle-negotiation].

### 5.48. RFC3108: ATM SDP

[RFC3108] describes conventions for using SDP described for controlling ATM Bearer Connections, and any associated ATM Adaptation Layer (AAL).


```
   +-----------------------+--------------------+-------+--------------+
   | Name                  | Notes              | Level | Mux Category |
   +-----------------------+--------------------+-------+--------------+
   | aalType               | Refer to notes     | B     | CAUTION      |
   |                       | below              |       |              |
   | eecid                 | Refer to notes     | B     | CAUTION      |
   |                       | below              |       |              |
   | capability            | Refer to notes     | B     | CAUTION      |
   |                       | below              |       |              |
   | qosClass              | Refer to notes     | B     | CAUTION      |
   |                       | below              |       |              |
   | bcob                  | Refer to notes     | B     | CAUTION      |
   |                       | below              |       |              |
   | stc                   | Refer to notes     | B     | CAUTION      |
   |                       | below              |       |              |
   | upcc                  | Refer to notes     | B     | CAUTION      |
   |                       | below              |       |              |
   | atmQOSparms           | Refer to notes     | B     | CAUTION      |
   |                       | below              |       |              |
   | atmTrfcDesc           | Refer to notes     | B     | CAUTION      |
   |                       | below              |       |              |
   | abrParms              | Refer to notes     | B     | CAUTION      |
   |                       | below              |       |              |
   | abrSetup              | Refer to notes     | B     | CAUTION      |
   |                       | below              |       |              |
   | bearerType            | Refer to notes     | B     | CAUTION      |
   |                       | below              |       |              |
   | lij                   | Refer to notes     | B     | CAUTION      |
   |                       | below              |       |              |
   | anycast               | Refer to notes     | B     | CAUTION      |
   |                       | below              |       |              |
   | cache                 | Refer to notes     | B     | CAUTION      |
   |                       | below              |       |              |
   | bearerSigIE           | Refer to notes     | B     | CAUTION      |
   |                       | below              |       |              |
   | aalApp                | Refer to notes     | B     | CAUTION      |
   |                       | below              |       |              |
   | cbrRate               | Refer to notes     | B     | CAUTION      |
   |                       | below              |       |              |
   | sbc                   | Refer to notes     | B     | CAUTION      |
   |                       | below              |       |              |
   | clkrec                | Refer to notes     | B     | CAUTION      |
   |                       | below              |       |              |
   | fec                   | Refer to notes     | B     | CAUTION      |
   |                       | below              |       |              |
   | prtfl                 | Refer to notes     | B     | CAUTION      |
   |                       | below              |       |              |
   | structure             | Refer to notes     | B     | CAUTION      |
   |                       | below              |       |              |
   | cpsSDUsize            | Refer to notes     | B     | CAUTION      |
   |                       | below              |       |              |
   | aal2CPS               | Refer to notes     | B     | CAUTION      |
   |                       | below              |       |              |
   | aal2CPSSDUrate        | Refer to notes     | B     | CAUTION      |
   |                       | below              |       |              |
   | aal2sscs3661unassured | Refer to notes     | B     | CAUTION      |
   |                       | below              |       |              |
   | aal2sscs3661assured   | Refer to notes     | B     | CAUTION      |
   |                       | below              |       |              |
   | aal2sscs3662          | Refer to notes     | B     | CAUTION      |
   |                       | below              |       |              |
   | aal5sscop             | Refer to notes     | B     | CAUTION      |
   |                       | below              |       |              |
   | atmmap                | Refer to notes     | B     | CAUTION      |
   |                       | below              |       |              |
   | silenceSupp           | Refer to notes     | B     | CAUTION      |
   |                       | below              |       |              |
   | ecan                  | Refer to notes     | B     | CAUTION      |
   |                       | below              |       |              |
   | gc                    | Refer to notes     | B     | CAUTION      |
   |                       | below              |       |              |
   | profileDesc           | Refer to notes     | B     | CAUTION      |
   |                       | below              |       |              |
   | vsel                  | Refer to notes     | B     | CAUTION      |
   |                       | below              |       |              |
   | dsel                  | Refer to notes     | B     | CAUTION      |
   |                       | below              |       |              |
   | fsel                  | Refer to notes     | B     | CAUTION      |
   |                       | below              |       |              |
   | onewaySel             | Refer to notes     | B     | CAUTION      |
   |                       | below              |       |              |
   | codecconfig           | Refer to notes     | B     | CAUTION      |
   |                       | below              |       |              |
   | isup_usi              | Refer to notes     | B     | CAUTION      |
   |                       | below              |       |              |
   | uiLayer1_Prot         | Refer to notes     | B     | CAUTION      |
   |                       | below              |       |              |
   | chain                 | Refer to notes     | B     | CAUTION      |
   |                       | below              |       |              |
   |                       |                    |       |              |
   +-----------------------+--------------------+-------+--------------+

                      5.48 RFC3108 Attribute Analysis
```

NOTE: RFC3108 describes conventions for using SDP for characterizing ATM bearer connections using an AAL1, AAL2 or AAL5 adaptation layers. For AAL1, AAL2 and AAL5, bearer connections can be used to transport single media streams.  In addition, for AAL1 and AAL2, multiple media streams can be multiplexed into a bearer connection.  For all adaptation types (AAL1, AAL2 and AAL5), bearer connections can be bundled into a single media group.  In all cases addressed by RFC3108, a real-time media stream (voice, video, voiceband data, pseudo-wire, and others) or a multiplex of media streams is mapped directly into an ATM connection.  RFC3108 does not address cases where ATM serves as a low-level transport pipe for IP packets which in turn can carry one or more real-time (e.g.  VoIP) media sessions with a life-cycle different from that of the underlying ATM transport.

### 5.49. 3GPP TS 26.114

[R3GPPTS26.114] specifies IP multimedia subsystem: Media handling and interaction


```
   +---------------------+--------------------------+-------+----------+
   | Name                | Notes                    | Level | Mux      |
   |                     |                          |       | Category |
   +---------------------+--------------------------+-------+----------+
   | 3gpp_sync_info      | Usage defined for the IP | M     | NORMAL   |
   |                     | Multimedia Subsystem     |       |          |
   |                     |                          |       |          |
   | 3gpp_MaxRecvSDUSize | Usage defined for the IP | M     | NORMAL   |
   |                     | Multimedia Subsystem     |       |          |
   |                     |                          |       |          |
   +---------------------+--------------------------+-------+----------+

                  5.49 3GPP TS 26.114 Attribute Analysis
```

### 5.50. 3GPP TS 183.063

[R3GPPTS183.063] Telecommunications and Internet converged Services and Protocols for Advanced Networking (TISPAN);


```
      +---------------------+---------------+-------+--------------+
      | Name                | Notes         | Level | Mux Category |
      +---------------------+---------------+-------+--------------+
      | PSCid               | Not Impacted  | S     | NORMAL       |
      |                     |               |       |              |
      | bc_service          | Not Impacted  | S     | NORMAL       |
      |                     |               |       |              |
      | bc_program          | Not Impacted  | S     | NORMAL       |
      |                     |               |       |              |
      | bc_service_package  | Not Impacted  | S     | NORMAL       |
      |                     |               |       |              |
      +---------------------+---------------+-------+--------------+

                  5.50 3GPP TS 183.063 Attribute Analysis
```

### 5.51. 3GPP TS 24.182

[R3GPPTS24.182] specifies IP multimedia subsystem Custom Alerting tones


```
   +------------+----------------------------------+-------+-----------+
   | Name       | Notes                            | Level | Mux       |
   |            |                                  |       | Category  |
   +------------+----------------------------------+-------+-----------+
   | g.3gpp.cat | Usage defined for the IP         | M     | NORMAL    |
   |            | Multimedia Subsystem             |       |           |
   |            |                                  |       |           |
   +------------+----------------------------------+-------+-----------+

                  5.51 3GPP TS 24.182 Attribute Analysis
```

### 5.52. 3GPP TS 24.183

[R3GPPTS24.183] specifies IP multimedia subsystem Custom Ringing Signal


```
   +------------+----------------------------------+-------+-----------+
   | Name       | Notes                            | Level | Mux       |
   |            |                                  |       | Category  |
   +------------+----------------------------------+-------+-----------+
   | g.3gpp.crs | Usage defined for the IP         | M     | NORMAL    |
   |            | Multimedia Subsystem             |       |           |
   |            |                                  |       |           |
   +------------+----------------------------------+-------+-----------+

                  5.52 3GPP TS 24.183 Attribute Analysis
```

### 5.53. 3GPP TS 24.229

[R3GPPTS24.229] specifies IP multimedia call control protocol based on Session Initial protocol and Session Description Protocol.


```
   +-----------------+-----------------------------+-------+-----------+
   | Name            | Notes                       | Level | Mux       |
   |                 |                             |       | Category  |
   +-----------------+-----------------------------+-------+-----------+
   | secondary-      | secondary-realm  MUST be    | M     | TRANSPORT |
   | realm           | the one that corresponds to |       |           |
   |                 | the "m=" line chosen for    |       |           |
   |                 | setting up the underlying   |       |           |
   |                 | transport flow              |       |           |
   |                 |                             |       |           |
   | visited-realm   | visited-realm MUST be the   | M     | TRANSPORT |
   |                 | one that corresponds to the |       |           |
   |                 | "m=" line chosen for        |       |           |
   |                 | setting up the underlying   |       |           |
   |                 | transport flow              |       |           |
   |                 |                             |       |           |
   | omr-m-cksum     | Not Impacted                | M     | NORMAL    |
   |                 |                             |       |           |
   | omr-s-cksum     | Not Impacted                | M     | NORMAL    |
   |                 |                             |       |           |
   | omr-m-att       | Not Impacted                | M     | NORMAL    |
   |                 |                             |       |           |
   | omr-s-att       | Not Impacted                | M     | NORMAL    |
   |                 |                             |       |           |
   | omr-m-bw        | Not Impacted                | M     | NORMAL    |
   |                 |                             |       |           |
   | omr-s-bw        | Not Impacted                | M     | NORMAL    |
   |                 |                             |       |           |
   | omr-codecs      | Not Impacted                | M     | NORMAL    |
   |                 |                             |       |           |
   +-----------------+-----------------------------+-------+-----------+

                  5.53 3GPP TS 24.229 Attribute Analysis
```

### 5.54. ITU T.38

[T.38] defines procedures for real-time Group 3 facsimile communications over IP networks.


```
   +-----------------------+--------------------+-------+--------------+
   | Name                  | Notes              | Level | Mux Category |
   +-----------------------+--------------------+-------+--------------+
   | T38FaxVersion         | Refer to notes     | M     | TBD          |
   |                       | below              |       |              |
   |                       |                    |       |              |
   | T38MaxBitRate         | Refer to notes     | M     | TBD          |
   |                       | below              |       |              |
   |                       |                    |       |              |
   | T38FaxFillBitRemoval  | Refer to notes     | M     | TBD          |
   |                       | below              |       |              |
   |                       |                    |       |              |
   | T38FaxTranscodingMMR  | Refer to notes     | M     | TBD          |
   |                       | below              |       |              |
   |                       |                    |       |              |
   | T38FaxTranscodingJBIG | Refer to notes     | M     | TBD          |
   |                       | below              |       |              |
   |                       |                    |       |              |
   | T38FaxRateManagement  | Refer to notes     | M     | TBD          |
   |                       | below              |       |              |
   |                       |                    |       |              |
   | T38FaxMaxBuffer       | Refer to notes     | M     | TBD          |
   |                       | below              |       |              |
   |                       |                    |       |              |
   | T38FaxMaxDatagram     | Refer to notes     | M     | TBD          |
   |                       | below              |       |              |
   |                       |                    |       |              |
   | T38FaxUdpEC           | Refer to notes     | M     | TBD          |
   |                       | below              |       |              |
   |                       |                    |       |              |
   | T38FaxMaxIFP          | Refer to notes     | M     | TBD          |
   |                       | below              |       |              |
   |                       |                    |       |              |
   | T38FaxUdpECDepth      | Refer to notes     | M     | TBD          |
   |                       | below              |       |              |
   |                       |                    |       |              |
   | T38FaxUdpFECMaxSpan   | Refer to notes     | M     | TBD          |
   |                       | below              |       |              |
   |                       |                    |       |              |
   | T38ModemType          | Refer to notes     | M     | TBD          |
   |                       | below              |       |              |
   |                       |                    |       |              |
   | T38VendorInfo         | Refer to notes     | M     | TBD          |
   |                       | below              |       |              |
   |                       |                    |       |              |
   +-----------------------+--------------------+-------+--------------+

                     5.54 ITU T.38 Attribute Analysis
```

NOTE: As per section 9 of [I-D.ietf-mmusic-sdp-bundle-negotiation], there exists no publicly available specification that defines procedures for multiplexing/demultiplexing fax protocols flows over a single 5-tuple.  Once such a specification is available, the multiplexing category assignments for the attributes in this section could be revisited.

### 5.55. ITU-T Q.1970

[Q.1970] defines Bearer Independent Call Control (BICC) IP bearer control protocol.


```
   +-------+----------------------------------------+-------+----------+
   | Name  | Notes                                  | Level | Mux      |
   |       |                                        |       | Category |
   +-------+----------------------------------------+-------+----------+
   | ipbcp | ipbcp version identifies type of IP    | S     | SPECIAL  |
   |       | bearer control protocol (IPBCP)        |       |          |
   |       | message used in BICC (ITU-T Q.1901)    |       |          |
   |       | environment which are limited to       |       |          |
   |       | single media payload. Refer to the     |       |          |
   |       | pertinent ITU-T specifications while   |       |          |
   |       | multiplexing                           |       |          |
   |       |                                        |       |          |
   +-------+----------------------------------------+-------+----------+

                   5.55 ITU-T Q.1970 Attribute Analysis
```

### 5.56. ITU-T H.248.15

ITU-T H.248.15 [H.248.15] defines Gateway Control Protocol SDP H.248 package attribute


```
   +----------+-------------------------------------+-------+----------+
   | Name     | Notes                               | Level | Mux      |
   |          |                                     |       | Category |
   +----------+-------------------------------------+-------+----------+
   | h248item | It is only applicable for signaling | B     | SPECIAL  |
   |          | the inclusion of H.248 extension    |       |          |
   |          | packages to a gateway via the local |       |          |
   |          | and remote descriptors. The         |       |          |
   |          | attribute itself is unaffected by   |       |          |
   |          | multiplexing, but the packaged      |       |          |
   |          | referenced in a specific use of the |       |          |
   |          | attribute can be impacted. Further  |       |          |
   |          | analysis of each package is needed  |       |          |
   |          | to determine if there is an issue.  |       |          |
   |          | This is only a concern in           |       |          |
   |          | environments using a decomposed     |       |          |
   |          | server/gateway with H.248 signaled  |       |          |
   |          | between them. The ITU-T will need   |       |          |
   |          | to do further analysis of various   |       |          |
   |          | packages when they specify how to   |       |          |
   |          | signal the use of multiplexing to a |       |          |
   |          | gateway                             |       |          |
   |          |                                     |       |          |
   +----------+-------------------------------------+-------+----------+

                  5.56 ITU-T H.248.15 Attribute Analysis
```

### 5.57. RFC4975: The Message Session Relay Protocol

[RFC4975] the Message Session Relay Protocol, a protocol for transmitting a series of related instant messages in the context of a session.  Message sessions are treated like any other media stream when set up via a rendezvous or session creation protocol such as the Session Initiation Protocol.


```
   +----------------------+---------------------+-------+--------------+
   | Name                 | Notes               | Level | Mux Category |
   +----------------------+---------------------+-------+--------------+
   | accept-types         | Refer to notes      | M     | TBD          |
   |                      | below               |       |              |
   |                      |                     |       |              |
   | accept-wrapped-      | Refer to notes      | M     | TBD          |
   | types                | below               |       |              |
   |                      |                     |       |              |
   | max-size             | Refer to notes      | M     | TBD          |
   |                      | below               |       |              |
   |                      |                     |       |              |
   | path                 | Refer to notes      | M     | TBD          |
   |                      | below               |       |              |
   |                      |                     |       |              |
   +----------------------+---------------------+-------+--------------+

                      5.57 RFC4975 Attribute Analysis
```

NOTE: As per section 9 of [I-D.ietf-mmusic-sdp-bundle-negotiation], there exists no publicly available specification that defines procedures for multiplexing/demultiplexing MRSP flows over a single 5-tuple.  Once such a specification is available, the multiplexing categories assignments for the attributes in this section could be revisited.

### 5.58. Historical Attributes

This section specifies analysis for the attributes that are included for historic usage alone by the [IANA].


```
        +----------+----------------------+-------+--------------+
        | Name     | Notes                | Level | Mux Category |
        +----------+----------------------+-------+--------------+
        | rtpred1  | Historic attributes  | M     | CAUTION      |
        |          |                      |       |              |
        | rtpred2  | Historic attributes  | M     | CAUTION      |
        |          |                      |       |              |
        +----------+----------------------+-------+--------------+

                    5.58 Historical Attribute Analysis
```

## 6. bwtype Attribute Analysis

This section specifies handling of specific bandwidth attributes when used in multiplexing scenarios.



### 6.1. RFC4566: SDP

[RFC4566] defines SDP that is intended for describing multimedia sessions for the purposes of session announcement, session invitation, and other forms of multimedia session initiation.


```
   +-----------+------------------------------------+-------+----------+
   | Name      | Notes                              | Level | Mux      |
   |           |                                    |       | Category |
   +-----------+------------------------------------+-------+----------+
   | bwtype:CT | Not Impacted                       | S     | NORMAL   |
   |           |                                    |       |          |
   | bwtype:AS | For the media level usage, the     | B     | SUM      |
   |           | aggregate of individual bandwidth  |       |          |
   |           | values is considered               |       |          |
   |           |                                    |       |          |
   +-----------+------------------------------------+-------+----------+

                        6.1 RFC4566 bwtype Analysis
```

### 6.2. RFC3556: SDP Bandwidth Modifiers for RTCP Bandwidth

[RFC3556] defines an extension to SDP to specify two additional modifiers for the bandwidth attribute.  These modifiers may be used to specify the bandwidth allowed for RTCP packets in a RTP session.


```
   +-----------+------------------------------------+-------+----------+
   | Name      | Notes                              | Level | Mux      |
   |           |                                    |       | Category |
   +-----------+------------------------------------+-------+----------+
   | bwtype:RS | Session level usage represents     | B     | SUM      |
   |           | session aggregate and media level  |       |          |
   |           | usage indicates SUM of the         |       |          |
   |           | individual values while            |       |          |
   |           | multiplexing                       |       |          |
   |           |                                    |       |          |
   | bwtype:RR | Session level usage represents     | B     | SUM      |
   |           | session aggregate and media level  |       |          |
   |           | usage indicates SUM of the         |       |          |
   |           | individual values while            |       |          |
   |           | multiplexing                       |       |          |
   |           |                                    |       |          |
   +-----------+------------------------------------+-------+----------+

                        6.2 RFC3556 bwtype Analysis
```

### 6.3. RFC3890: Bandwidth Modifier for SDP

[RFC3890] defines SDP Transport Independent Application Specific Maximum (TIAS) bandwidth modifier that does not include transport overhead; instead an additional packet rate attribute is defined. The transport independent bit-rate value together with the maximum packet rate can then be used to calculate the real bit-rate over the transport actually used.


```
   +-------------+----------------------------------+-------+----------+
   | Name        | Notes                            | Level | Mux      |
   |             |                                  |       | Category |
   +-------------+----------------------------------+-------+----------+
   | bwtype:TIAS | The usage of TIAS is not defined | B     | SPECIAL  |
   |             | under Offer/Answer usage.        |       |          |
   |             |                                  |       |          |
   | maxprate    | The usage of TIAS and maxprate   | B     | SPECIAL  |
   |             | is not well defined under        |       |          |
   |             | multiplexing                     |       |          |
   |             |                                  |       |          |
   +-------------+----------------------------------+-------+----------+

                        6.3 RFC3890 bwtype Analysis
```

NOTE: The intention of TIAS is that the media level bit-rate is multiplied with the known per-packet overhead for the selected transport and the maxprate value to determine the worst case bit-rate from the transport to more accurately capture the required usage. Summing TIAS values independently across "m=" lines and multiplying the computed sum with maxprate and the per-packet overhead would inflate the value significantly.  Instead performing multiplication and adding the individual values is a more appropriate usage.

## 7. rtcp-fb Attribute Analysis

This section analyzes rtcp-fb SDP attributes.

### 7.1. RFC4585: RTP/AVPF

[RFC4585] defines an extension to the Audio-visual Profile (AVP) that enables receivers to provide, statistically, more immediate feedback to the senders and thus allows for short-term adaptation and efficient feedback-based repair mechanisms to be implemented.


```
   +---------+------------------------------+-------+------------------+
   | Name    | Notes                        | Level | Mux Category     |
   +---------+------------------------------+-------+------------------+
   | ack     | The attribute value MUST be  | M     | IDENTICAL-PER-   |
   | rpsi    | same for a given codec       |       | PT               |
   |         | configuration                |       |                  |
   |         |                              |       |                  |
   | ack     | Feedback parameters MUST be  | M     | SPECIAL          |
   | app     | handled in the app specific  |       |                  |
   |         | way when multiplexed         |       |                  |
   |         |                              |       |                  |
   | nack    | The attribute value MUST be  | M     | IDENTICAL-PER-   |
   |         | same for a given codec       |       | PT               |
   |         | configuration                |       |                  |
   |         |                              |       |                  |
   | nack    | The attribute value MUST be  | M     | IDENTICAL-PER-   |
   | pli     | same for a given codec       |       | PT               |
   |         | configuration                |       |                  |
   |         |                              |       |                  |
   | nack    | The attribute value MUST be  | M     | IDENTICAL-PER-   |
   | sli     | same for a given codec       |       | PT               |
   |         | configuration                |       |                  |
   |         |                              |       |                  |
   | nack    | The attribute value MUST be  | M     | IDENTICAL-PER-   |
   | rpsi    | same for a given codec       |       | PT               |
   |         | configuration                |       |                  |
   |         |                              |       |                  |
   | nack    | Feedback parameters MUST be  | M     | SPECIAL          |
   | app     | handled in the app specific  |       |                  |
   |         | way when multiplexed         |       |                  |
   |         |                              |       |                  |
   | trr-    | The attribute value MUST be  | M     | IDENTICAL-PER-   |
   | int     | same for a given codec       |       | PT               |
   |         | configuration                |       |                  |
   |         |                              |       |                  |
   +---------+------------------------------+-------+------------------+

                      7.1 RFC4585 Attribute Analysis
```

### 7.2. RFC5104: Codec Control Messages in AVPF

[RFC5104] specifies a few extensions to the messages defined in the Audio-Visual Profile with Feedback (AVPF).  They are helpful primarily in conversational multimedia scenarios where centralized multipoint functionalities are in use.  However, some are also usable in smaller multicast environments and point-to-point calls.


```
   +------+---------------------------------+-------+------------------+
   | Name | Notes                           | Level | Mux Category     |
   +------+---------------------------------+-------+------------------+
   | ccm  | The attribute value MUST be     | M     | IDENTICAL-PER-   |
   |      | same for a given codec          |       | PT               |
   |      | configuration                   |       |                  |
   |      |                                 |       |                  |
   +------+---------------------------------+-------+------------------+

                      7.2 RFC5104 Attribute Analysis
```

### 7.3. RFC6285: Unicast-Based Rapid Acquisition of Multicast RTP Sessions (RAMS)

[RFC6285] describes a method using the existing RTP and RTCP machinery that reduces the acquisition delay.  In this method, an auxiliary unicast RTP session carrying the Reference Information to the receiver precedes or accompanies the multicast stream.  This unicast RTP flow can be transmitted at a faster than natural bitrate to further accelerate the acquisition.  The motivating use case for this capability is multicast applications that carry real-time compressed audio and video.


```
   +--------+-------------------------------+-------+------------------+
   | Name   | Notes                         | Level | Mux Category     |
   +--------+-------------------------------+-------+------------------+
   | nack   | The attribute value MUST be   | M     | IDENTICAL-PER-   |
   | rai    | same for a given codec        |       | PT               |
   |        | configuration                 |       |                  |
   |        |                               |       |                  |
   +--------+-------------------------------+-------+------------------+

                      7.3 RFC6285 Attribute Analysis
```

### 7.4. RFC6679: ECN for RTP over UDP/IP

[RFC6679] specifies how Explicit Congestion Notification (ECN) can be used with the RTP running over UDP, using the RTCP as a feedback mechanism.  It defines a new RTCP Extended Report (XR) block for periodic ECN feedback, a new RTCP transport feedback message for timely reporting of congestion events, and a STUN extension used in the optional initialization method using ICE.


```
   +-----------------+-----------------------------+-------+-----------+
   | Name            | Notes                       | Level | Mux       |
   |                 |                             |       | Category  |
   +-----------------+-----------------------------+-------+-----------+
   | ecn-capable-    | ECN markup are enabled at   | M     | IDENTICAL |
   | rtp             | the RTP session level       |       |           |
   |                 |                             |       |           |
   | nack ecn        | This attribute enables ECN  | M     | IDENTICAL |
   |                 | at the RTP session level    |       |           |
   |                 |                             |       |           |
   +-----------------+-----------------------------+-------+-----------+

                      7.4 RFC6679 Attribute Analysis
```

### 7.5. RFC6642: Third-Party Loss Report

In a large RTP session using the RTCP feedback mechanism defined in [RFC4585], a feedback target may experience transient overload if some event causes a large number of receivers to send feedback at once.  This overload is usually avoided by ensuring that feedback reports are forwarded to all receivers, allowing them to avoid sending duplicate feedback reports.  However, there are cases where it is not recommended to forward feedback reports, and this may allow feedback implosion.  [RFC6642] memo discusses these cases and defines a new RTCP Third-Party Loss Report that can be used to inform receivers that the feedback target is aware of some loss event, allowing them to suppress feedback.  Associated SDP signaling is also defined.


```
   +---------+------------------------------+-------+------------------+
   | Name    | Notes                        | Level | Mux Category     |
   +---------+------------------------------+-------+------------------+
   | nack    | The attribute value MUST be  | M     | IDENTICAL-PER-   |
   | tllei   | same for a given codec       |       | PT               |
   |         | configuration                |       |                  |
   |         |                              |       |                  |
   | nack    | The attribute value MUST be  | M     | IDENTICAL-PER-   |
   | pslei   | same for a given codec       |       | PT               |
   |         | configuration                |       |                  |
   |         |                              |       |                  |
   +---------+------------------------------+-------+------------------+

                      7.5 RFC6642 Attribute Analysis
```

### 7.6. RFC5104: Codec Control Messages in AVPF

[RFC5104] specifies a few extensions to the messages defined in the Audio-Visual Profile with Feedback (AVPF).  They are helpful primarily in conversational multimedia scenarios where centralized multipoint functionalities are in use.  However, some are also usable in smaller multicast environments and point-to-point calls.


```
   +--------+-------------------------------+-------+------------------+
   | Name   | Notes                         | Level | Mux Category     |
   +--------+-------------------------------+-------+------------------+
   | ccm    | The attribute value MUST be   | M     | IDENTICAL-PER-   |
   | fir    | same for a given codec        |       | PT               |
   |        | configuration                 |       |                  |
   |        |                               |       |                  |
   | ccm    | The attribute value MUST be   | M     | IDENTICAL-PER-   |
   | tmmbr  | same for a given codec        |       | PT               |
   |        | configuration                 |       |                  |
   |        |                               |       |                  |
   | ccm    | The attribute value MUST be   | M     | IDENTICAL-PER-   |
   | tstr   | same for a given codec        |       | PT               |
   |        | configuration                 |       |                  |
   |        |                               |       |                  |
   | ccm    | The attribute value MUST be   | M     | IDENTICAL-PER-   |
   | vbcm   | same for a given codec        |       | PT               |
   |        | configuration                 |       |                  |
   |        |                               |       |                  |
   +--------+-------------------------------+-------+------------------+

                      7.6 RFC5104 Attribute Analysis
```

## 8. group Attribute Analysis

This section analyzes SDP "group" attribute semantics [RFC5888].

### 8.1. RFC5888: SDP Grouping Framework

[RFC5888] defines a framework to group "m" lines in SDP for different purposes.


```
           +------------+---------------+-------+--------------+
           | Name       | Notes         | Level | Mux Category |
           +------------+---------------+-------+--------------+
           | group:LS   | Not Impacted  | S     | NORMAL       |
           |            |               |       |              |
           | group:FID  | Not Impacted  | S     | NORMAL       |
           |            |               |       |              |
           +------------+---------------+-------+--------------+

                      8.1 RFC5888 Attribute Analysis
```

### 8.2. RFC3524: Mapping Media Streams to Resource Reservation Flows

[RFC3524] defines an extension to the SDP grouping framework.  It allows requesting a group of media streams to be mapped into a single resource reservation flow.  The SDP syntax needed is defined, as well as a new "semantics" attribute called Single Reservation Flow (SRF).


```
           +------------+---------------+-------+--------------+
           | Name       | Notes         | Level | Mux Category |
           +------------+---------------+-------+--------------+
           | group:SRF  | Not Impacted  | S     | NORMAL       |
           |            |               |       |              |
           +------------+---------------+-------+--------------+

                      8.2 RFC3524 Attribute Analysis
```

### 8.3. RFC4091: ANAT Semantics

[RFC4091] defines ANAT semantics for the SDP grouping framework.  The ANAT semantics allow alternative types of network addresses to establish a particular media stream.


```
   +-------------+------------------------------+-------+--------------+
   | Name        | Notes                        | Level | Mux Category |
   +-------------+------------------------------+-------+--------------+
   | group:ANAT  | ANAT semantics is obsoleted  | S     | CAUTION      |
   |             |                              |       |              |
   +-------------+------------------------------+-------+--------------+

                      8.3 RFC4091 Attribute Analysis
```

### 8.4. RFC5956: FEC Grouping Semantics in SDP

[RFC5956] defines the semantics for grouping the associated source and FEC-based (Forward Error Correction) repair flows in SDP.  The semantics defined in the document are to be used with the SDP Grouping Framework [RFC5888].  These semantics allow the description

of grouping relationships between the source and repair flows when one or more source and/or repair flows are associated in the same group, and they provide support for additive repair flows.  SSRC-level (Synchronization Source) grouping semantics are also defined in this document for RTP streams using SSRC multiplexing.


```
         +---------------+---------------+-------+--------------+
         | Name          | Notes         | Level | Mux Category |
         +---------------+---------------+-------+--------------+
         | group:FEC-FR  | Not Impacted  | S     | NORMAL       |
         |               |               |       |              |
         +---------------+---------------+-------+--------------+

                      8.4 RFC5956 Attribute Analysis
```

### 8.5. RFC5583: Signaling Media Decoding Dependency in SDP

[RFC5583] defines semantics that allow for signaling the decoding dependency of different media descriptions with the same media type in SDP.  This is required, for example, if media data is separated and transported in different network streams as a result of the use of a layered or multiple descriptive media coding process.


```
   +-----------+----------------------------+-------+------------------+
   | Name      | Notes                      | Level | Mux Category     |
   +-----------+----------------------------+-------+------------------+
   | group:DDP | Not Impacted               | S     | NORMAL           |
   |           |                            |       |                  |
   | depend    | The attribute value MUST   | M     | IDENTICAL-PER-   |
   | lay       | be same for a given codec  |       | PT               |
   |           | configuration              |       |                  |
   |           |                            |       |                  |
   | depend    | The attribute value MUST   | M     | IDENTICAL-PER-   |
   | mdc       | be same for a given codec  |       | PT               |
   |           | configuration              |       |                  |
   |           |                            |       |                  |
   +-----------+----------------------------+-------+------------------+

                      8.5 RFC5583 Attribute Analysis
```

### 8.6. RFC7104: Duplication Grouping Semantics in the SDP

[RFC7104] defines the semantics for grouping redundant streams in SDP, The semantics defined in this document are to be used with the SDP Grouping Framework.  Grouping semantics at the SSRC)level are also defined in this document for RTP streams using SSRC multiplexing.


```
           +------------+---------------+-------+--------------+
           | Name       | Notes         | Level | Mux Category |
           +------------+---------------+-------+--------------+
           | group:DUP  | Not Impacted  | S     | NORMAL       |
           |            |               |       |              |
           +------------+---------------+-------+--------------+

                      8.6 RFC7104 Attribute Analysis
```

## 9. ssrc-group Attribute Analysis

This section analyzes "ssrc-group" semantics.

### 9.1. RFC5576: Source-Specific SDP Attributes

[RFC5576] defines a mechanism to describe RTP media sources, which are identified by their synchronization source (SSRC) identifiers, in SDP, to associate attributes with these sources, and to express relationships among sources.  It also defines several source-level attributes that can be used to describe properties of media sources.


```
       +--------------------+---------------+-------+--------------+
       | Name               | Notes         | Level | Mux Category |
       +--------------------+---------------+-------+--------------+
       | ssrc-group:FID     | Not Impacted  | SR    | NORMAL       |
       |                    |               |       |              |
       | ssrc-group:FEC     | Not Impacted  | SR    | NORMAL       |
       |                    |               |       |              |
       | ssrc-group:FEC-FR  | Not Impacted  | SR    | NORMAL       |
       |                    |               |       |              |
       +--------------------+---------------+-------+--------------+

                      9.1 RFC5576 Attribute Analysis
```

### 9.2. RFC7104: Duplication Grouping Semantics in the SDP

[RFC7104] defines the semantics for grouping redundant streams in SDP.  The semantics defined in this document are to be used with the SDP Grouping Framework.  Grouping semantics at the Synchronization Source (SSRC) level are also defined in this document for RTP streams using SSRC multiplexing.


```
        +-----------------+---------------+-------+--------------+
        | Name            | Notes         | Level | Mux Category |
        +-----------------+---------------+-------+--------------+
        | ssrc-group:DUP  | Not Impacted  | SR    | NORMAL       |
        |                 |               |       |              |
        +-----------------+---------------+-------+--------------+

                      9.2 RFC7104 Attribute Analysis
```

## 10. QoS Mechanism Token Analysis

This section analyzes QoS tokes specified with SDP.

### 10.1. RFC5432: QoS Mechanism Selection in SDP

[RFC5432] defines procedures to negotiate QOS mechanisms using the SDP offer/answer model.


```
   +------+----------------------------------------+-------+-----------+
   | Name | Notes                                  | Level | Mux       |
   |      |                                        |       | Category  |
   +------+----------------------------------------+-------+-----------+
   | rsvp | rsvp attribute MUST be the one that    | B     | TRANSPORT |
   |      | corresponds to the "m=" line chosen    |       |           |
   |      | for setting up the underlying          |       |           |
   |      | transport flow                         |       |           |
   |      |                                        |       |           |
   | nsis | rsvp attribute MUST be the one that    | B     | TRANSPORT |
   |      | corresponds to the "m=" line chosen    |       |           |
   |      | for setting up the underlying          |       |           |
   |      | transport                              |       |           |
   |      |                                        |       |           |
   +------+----------------------------------------+-------+-----------+

                      10.1 RFC5432 Attribute Analysis
```

NOTE: A single Differentiated Services Code Point (DSCP) code point per flow being multiplexed doesn't impact multiplexing since QOS mechanisms are signaled/scoped per flow.  For scenarios that involve having different DSCP code points for packets being transmitted over the same 5-tuple, issues as discussed in [RFC7657] need to be taken into consideration.

## 11. k= Attribute Analysis

### 11.1. RFC4566: SDP

[RFC4566] defines SDP that is intended for describing multimedia sessions for the purposes of session announcement, session invitation, and other forms of multimedia session initiation.


```
   +------+-----------------------------------------+-------+----------+
   | Name | Notes                                   | Level | Mux      |
   |      |                                         |       | Category |
   +------+-----------------------------------------+-------+----------+
   | k=   | It is not recommended to use this       | S     | CAUTION  |
   |      | attribute under multiplexing            |       |          |
   |      |                                         |       |          |
   +------+-----------------------------------------+-------+----------+

                      11.1 RFC4566 Attribute Analysis
```

## 12. content Attribute Analysis

### 12.1. RFC4796

[RFC4796] defines a new SDP media-level attribute, 'content'.  The 'content' attribute defines the content of the media stream to a more detailed level than the media description line.  The sender of an SDP session description can attach the 'content' attribute to one or more media streams.  The receiving application can then treat each media stream differently (e.g., show it on a big or small screen) based on its content.


```
        +------------------+---------------+-------+--------------+
        | Name             | Notes         | Level | Mux Category |
        +------------------+---------------+-------+--------------+
        | content:slides   | Not Impacted  | M     | NORMAL       |
        |                  |               |       |              |
        | content:speaker  | Not Impacted  | M     | NORMAL       |
        |                  |               |       |              |
        | content:main     | Not Impacted  | M     | NORMAL       |
        |                  |               |       |              |
        | content:sl       | Not Impacted  | M     | NORMAL       |
        |                  |               |       |              |
        | content:alt      | Not Impacted  | M     | NORMAL       |
        |                  |               |       |              |
        +------------------+---------------+-------+--------------+

                      12.1 RFC4796 Attribute Analysis
```

## 13. Payload Formats

### 13.1. RFC5109: RTP Payload Format for Generic FEC

[RFC5109] describes a payload format for generic Forward Error Correction (FEC) for media data encapsulated in RTP.  It is based on the exclusive-or (parity) operation.  The payload format allows end systems to apply protection using various protection lengths and levels, in addition to using various protection group sizes to adapt to different media and channel characteristics.  It enables complete recovery of the protected packets or partial recovery of the critical parts of the payload depending on the packet loss situation.


```
   +--------------------+---------------------------+-------+----------+
   | Name               | Notes                     | Level | Mux      |
   |                    |                           |       | Category |
   +--------------------+---------------------------+-------+----------+
   | audio/ulpfec       | Not recommended for       | M     | CAUTION  |
   |                    | multiplexing due to reuse |       |          |
   |                    | of SSRCs                  |       |          |
   |                    |                           |       |          |
   | video/ulpfec       | Not recommended for       | M     | CAUTION  |
   |                    | multiplexing due to reuse |       |          |
   |                    | of SSRCs                  |       |          |
   |                    |                           |       |          |
   | text/ulpfec        | Not recommended for       | M     | CAUTION  |
   |                    | multiplexing due to reuse |       |          |
   |                    | of SSRCs                  |       |          |
   |                    |                           |       |          |
   | application/ulpfec | Not recommended for       | M     | CAUTION  |
   |                    | multiplexing due to reuse |       |          |
   |                    | of SSRCs                  |       |          |
   |                    |                           |       |          |
   +--------------------+---------------------------+-------+----------+

                   13.1 RFC5109 Payload Format Analysis
```

## 14. Multiplexing Considerations for Encapsulating Attributes

This sections deals with recommendations for defining the multiplexing characteristics of the SDP attributes that encapsulate other SDP attributes/parameters.  Such attributes as of today, for example, are defined in [RFC3407], [RFC5939] and [RFC6871] as part of a generic framework for indicating and negotiating transport, media, and media format related capabilities in the SDP.

The behavior of such attributes under multiplexing is in turn defined by the multiplexing behavior of the attributes they encapsulate which are made known once the Offer/Answer negotiation process is completed.

### 14.1. RFC3407: cpar Attribute Analysis

[RFC3407] capability parameter attribute (a=cpar) encapsulates b= (bandwidth) or an a= attribute.  For bandwidth attribute encapsulation, the category SUM is inherited.  For the case of a= attribute, the category corresponding to the SDP attribute being encapsulated is inherited.


```
    v=0
    o=alice 2890844526 2890844527 IN IP4 host.atlanta.example.com
    s=
    c=IN IP4 host.atlanta.example.com
    t=0 0
    m=video 3456 RTP/AVP 100
    a=rtpmap:100 VP8/90000
    a=sqn: 0
    a=cdsc: 1 video RTP/AVP 100
    a=cpar: a=rtcp-mux
    m=video 3456 RTP/AVP 101
    a=rtpmap:101 VP8/90000
    a=fmtp:100 max-fr=15;max-fs=1200
    a=cdsc: 2 video RTP/AVP 101
    a=cpar: a=rtcp-mux
```

In the above example,the category IDENTICAL is inherited for the cpar encapsulated rtcp-mux attribute.

### 14.2. RFC5939 Analysis

[RFC5939] defines a general SDP capability negotiation framework.  It also specifies how to provide transport protocols and SDP attributes as capabilities and negotiate them using the framework.

For this purpose, [RFC5939] defines the following

*  A set of capabilities for the session and its associated media stream components, supported by each side.  The attribute ("a=acap") defines how to list an attribute name and its associated value (if any) as a capability.  The attribute ("a=tcap") defines how to list transport protocols (e.g., "RTP/ AVP") as capabilities.

*  A set of potential configurations ("a=pcfg") provided by the offerer to indicate which combinations of those capabilities can be used for the session and its associated media stream components.  Potential configurations are not ready for use until fully negotiated.  They provide an alternative that MAY be used, subject to SDP capability negotiation procedures.  In particular the answerer MAY choose one of the potential configurations for use as part of the current Offer/Answer exchange.

*  An actual configuration ("a=acfg") for the session and its associated media stream components.  The actual configuration identifies the potential configuration that was negotiated for use.  Use of an actual configuration does not require any further negotiation.

*  A negotiation process that takes the current actual and the set of potential configurations (combinations of capabilities) as input and provides the negotiated actual configurations as output.  In [RFC5939] the negotiation process is done independently for each media description.

#### 14.2.1. Recommendation: Procedures for Potential Configuration Pairing

This section provides recommendations for entities generating and processing SDP under the generic capability negotiation framework as defined in [RFC5939] under the context of media stream multiplexing.

These recommendations are provided for the purposes of enabling the Offerer to make sure that the generated potential configurations between the multiplexed streams can (easily) be negotiated to be consistent between those streams.  In particular, the procedures aim to simplify Answerer's procedure to choose potential configurations that are consistent across all the multiplexed media descriptions.

A potential configuration selects a set of attributes and parameters that become part of the media description when negotiated.  When multiplexing media descriptions with potential configurations specified, there MAY be a need for coordinating this selection between multiplexed media descriptions to ensure the right multiplexing behavior.

Although it is possible to analyze the various potential configurations in multiplexed media descriptions to find combinations that satisfy such constraints, it can quickly become complicated to do so.

The procedures defined in [RFC5939] state that each potential configuration in the SDP has a unique configuration number, however the scope of uniqueness is limited to each media description.  To make it simple for the answerer to chose valid combinations of potential configurations across media descriptions in a given bundle group, we provide a simple rule for constructing potential configurations

*  Let m-bundle be the set of media descriptions that form a given bundle .

*  Let m-bundle-pcfg be the set of media descriptions in m-bundle that include one or more potential configurations.

*  Each media description in m-bundle-pcfg MUST have at least one potential configuration with the same configuration number (e.g. "1").

*  For each potential configuration with configuration number x in m-bundle-pcfg, the offerer MUST ensure that if the answerer chooses configuration number x in each of the media descriptions in m-bundle-pcfg, then the resulting SDP will have all multiplexing constraints satisfied for those media descriptions.

*  Since it is nearly impossible to define a generic mechanism for various capability extensions, this document does't provide procedures for dealing with the capability extension attributes. However, Section 14.3 provide analysis of media capability extension attributes as defined in [RFC6871].

The above allows the answerer to easily find multiplexing compatible combinations of potential configurations: The answerer simply choses a potential configuration (number) that is present in all of the media descriptions with potential configurations in the bundle.

Note that it is still possible for the offerer to provide additional potential configurations with independent configuration numbers.  The answerer will have to perform more complicated analysis to determine valid multiplexed combinations of those.

##### 14.2.1.1. Example: Transport Capability Multiplexing


```
   v=0
   o=alice 2890844526 2890844527 IN IP4 host.atlanta.example.com
   s=
   c=IN IP4 host.atlanta.example.com
   t=0 0
   a=tcap:1 RTP/SAVPF
   a=tcap:2 RTP/SAVP
   a=group:BUNDLE audio video
   m=audio
   a=mid:audio
   a=pcfg:1 t=1
   a=pcfg:2
   m=video
   a=mid:video
   a=pcfg:1 t=1
   a=pcfg:2 t=2
```

In the example above, the potential configurations that offer transport protocol capability of RTP/SAVPF has the same configuration number "1" in both the audio and video media descriptions.

##### 14.2.1.2. Example: Attribute Capability Multiplexing


```
   v=0
   o=alice 2890844526 2890844527 IN IP4 host.atlanta.example.com
   s=
   c=IN IP4 host.atlanta.example.com
   t=0 0
   a=acap:1 a=rtcp-mux
   a=acap:2 a=crypto:1 AES_CM_128_HMAC_SHA1_80
     inline:EcGZiNWpFJhQXdspcl1ekcmVCNWpVLcfHAwJSoj|2^20|1:32
   a=group:BUNDLE audio video
   m=audio 49172 RTP/AVP 99
   a=mid:audio
   a=pcfg:1 a=1
   a=pcfg:2
   m=video 560024 RTP/AVP 100
   a=mid:video
   a=pcfg:1 a=1
   a=pcfg:2 a=2
```

In the example above, the potential configuration number "1" is repeated while referring to attribute capability a=rtcp-mux, since the behavior is IDENTICAL for the attribute a=rtcp-mux under multiplexing.



### 14.3. RFC6871 Analysis

[RFC6871] extends the capability negotiation framework described in [RFC5939] by defining media capabilities that can be used to indicate and negotiate media types and their associated format parameters.  It also allows indication of latent configurations and session capabilities.

#### 14.3.1. Recommendation: Dealing with Payload Type Numbers

[RFC6871] defines a new payload type ("pt") parameter to be used with the potential, actual, and latent configuration parameters.  The parameter associates RTP payload type numbers with the referenced RTP-based media format capabilities ("a=rmcap") defined in [RFC6871] and is appropriate only when the transport protocol uses RTP.  This means that the same payload type number can be assigned as part of potential or actual configurations in different media descriptions in a bundle.  There are rules for the usage of identical Payload Type values across multiplexed "m=" lines as described in [I-D.ietf-mmusic-sdp-bundle-negotiation], which must be followed here as well.  As described in Section 14.2.1, the use of identical configuration numbers for compatible configurations in different media descriptions that are part of the bundle provides a way to ensure that the answerer can easily pick compatible configurations here as well.

##### 14.3.1.1. Example: Attribute Capability Under Shared Payload Type

The attributes (a=rmcap, a=mfcap) follow the above recommendations under multiplexing.


```
   v=0
   o=- 25678 753849 IN IP4 192.0.2.1
   s=
   c=IN IP4 192.0.2.1
   t=0 0
   a=creq:med-v0
   m=audio 54322 RTP/AVP 96
   a=rtpmap:96 AMR-WB/16000/1
   a=fmtp:96 mode-change-capability=1; max-red=220;
   mode-set=0,2,4,7
   a=rmcap:1,3 audio AMR-WB/16000/1
   a=rmcap:2 audio AMR/8000/1
   a=mfcap:1,2 mode-change-capability=1
   a=mfcap:3 mode-change-capability=2
   a=pcfg:1 m=1 pt=1:96
   a=pcfg:2 m=2 pt=2:97
   a=pcfg:3 m=3 pt=3:98
   m=audio 54322 RTP/AVP 96
   a=rtpmap:96 AMR-WB/16000/1
   a=fmtp:96 mode-change-capability=1; max-red=220;
   mode-set=0,2,4,7
   a=rmcap:4 audio AMR/8000/1
   a=rmcap:5 audio OPUS/48000/2
   a=mfcap:5 minptime=40
   a=mfcap:4 mode-change-capability=1
   a=pcfg:1 m=4 pt=4:97
   a=pcfg:4 m=5 pt=5:101
```

In the example above, the potential configuration number "1" is repeated when referring to media and media format capability used for the Payload Type 96.  This implies that both the media capability 2 and 4 along with their media format capabilities MUST refer to the same codec configuration, as per the definition of IDENTICAL-PER-PT.

#### 14.3.2. Recommendation: Dealing with Latent Configurations

[RFC6871] adds the notion of a latent configurations, which provides configuration information that may be used to guide a subsequent offer/exchange, e.g. by adding another media stream or use alternative codec combinations not currently offered.  Latent configurations have configuration numbers which cannot overlap with the potential configuration numbers [RFC6871].  Supported combinations of potential and latent configurations are indicated by use of the "a=sescap" attribute, however use of this attribute is not recommended with multiplexed media, since it requires the use of unique configuration numbers across the SDP.  Taken together, this means there is no well-defined way to indicate supported combinations of latent configurations, or combinations of latent and potential configurations with multiplexed media.  It is still allowed to use the latent configuration attribute, however the limitations above will apply.  To determine valid combinations, actual negotiation will have to be attempted subsequently instead.

## 15. IANA Considerations

[RFC EDITOR NOTE: Please replace RFCXXXX with the RFC number of this document.]

Section 15.1 defines a new subregistry to be added by the IANA for identifying the initial registrations for various multiplexing categories applicable, as proposed in this document.

IANA is also requested to add a new column named "Mux Category" to several of the subregistries in the "Session Description Protocol (SDP) Parameters" registry.  The tables in Section 15.2 identify name of an entry in the existing subregistry and specify the value to be put in the new "Mux Category" column of the associated IANA registry.

### 15.1. New 'Multiplexing Categories' subregistry

A new sub-registry needs to be defined called the "Multiplexing Categories", with the following registrations created initially: "NORMAL", "CAUTION", "IDENTICAL", "TRANSPORT", "SUM", "INHERIT", "IDENTICAL-PER-PT", "SPECIAL" and "TBD" as defined in this document.

Initial value registration for "Multiplexing Categories".


```
   +-------------------------+-----------+
   | Multiplexing Categories | Reference |
   +-------------------------+-----------+
   | NORMAL                  | RFCXXXX   |
   | CAUTION                 | RFCXXXX   |
   | IDENTICAL               | RFCXXXX   |
   | TRANSPORT               | RFCXXXX   |
   | SUM                     | RFCXXXX   |
   | INHERIT                 | RFCXXXX   |
   | IDENTICAL-PER-PT        | RFCXXXX   |
   | SPECIAL                 | RFCXXXX   |
   | TBD                     | RFCXXXX   |
   +-------------------------+-----------+
```

Further entries can be registered using Standard Actions policies outlined in [RFC5226], which requires IESG review and approval and standards-track IETF RFC publication.



Each registration needs to indicate the multiplexing category value to be added to the "Multiplexing Categories" subregistry as defined in this section.

Such a registration MUST also indicate the applicability of the newly defined multiplexing category value to various subregistries defined at the "Session Description Protocol (SDP) Parameters" registry.

### 15.2. 'Mux Category' column for subregistries

Each sub-section identifies a subregistry in the "Session Description Protocol (SDP) Parameters" registry.  The tables list the column that identifies the SDP attribute name/Token/Value from the corresponding subregistries and the values to be used for the new "Mux Category" column to be added.

For the entries in the existing subregistries, under the "Session Description Protocol (SDP) Parameters" registry, that lack a value for the "Mux Category" in this specification will get a value of "TBD".

The registration policy for updates to the 'Mux Category' column values for existing parameters, or when registering new parameters, are beyond the scope of this document.  The registration policy for the affected table is defined in [I-D.ietf-mmusic-rfc4566bis].

#### 15.2.1. Table: SDP bwtype

The following values are to be added to the 'SDP bwtype' subregistry in the "Session Description Protocol (SDP) Parameters" registry.  The references should be updated to point at this RFC as well as the previous references.


```
   +----------+--------------+
   | SDP Name | Mux Category |
   +----------+--------------+
   | CT       | NORMAL       |
   | AS       | SUM          |
   | RS       | SUM          |
   | RR       | SUM          |
   | TIAS     | SPECIAL      |
   +----------+--------------+
```

#### 15.2.2. Table: att-field (session level)

The following values are to be added to the "att-field (session level)" subregistry in the "Session Description Protocol (SDP)



Parameters" registry.  The references should be updated to point at this RFC as well as the previous references.


```
   +---------------------+--------------+
   | SDP Name            | Mux Category |
   +---------------------+--------------+
   | cat                 | NORMAL       |
   | keywds              | NORMAL       |
   | type                | NORMAL       |
   | type:broadcast      | NORMAL       |
   | type:H332           | NORMAL       |
   | type:meeting        | NORMAL       |
   | type:moderated      | NORMAL       |
   | type:test           | NORMAL       |
   | charset             | NORMAL       |
   | charset:iso8895-1   | NORMAL       |
   | tool                | NORMAL       |
   | ipbcp               | SPECIAL      |
   | group               | NORMAL       |
   | ice-lite            | NORMAL       |
   | ice-options         | NORMAL       |
   | bcastversion        | NORMAL       |
   | 3GPP-Integrity-Key  | CAUTION      |
   | 3GPP-SDP-Auth       | CAUTION      |
   | alt-group           | CAUTION      |
   | PSCid               | NORMAL       |
   | bc_service          | NORMAL       |
   | bc_program          | NORMAL       |
   | bc_service_package  | NORMAL       |
   | sescap              | CAUTION      |
   | rtsp-ice-d-m        | TBD          |
   +---------------------+--------------+
```

#### 15.2.3. Table: att-field (both session and media level)

The following values are to be added to the "att-field (both session and media level)" subregistry in the "Session Description Protocol (SDP) Parameters" registry.  The references should be updated to point at this RFC as well as the previous references.

NOTE: The attributes from draft-ietf-rmt-flute-sdp ('flute-tsi', 'flute-ch', 'FEC-declaration', 'FEC-OTI-extension', 'content-desc') were not analyzed for their multiplexing behavior due to the expired status of the draft.  For purposes of this specification, the multiplexing category of 'TBD' is assigned.


```
   +-------------------------+-------------------+
   | SDP Name                | Mux Category      |
   +-------------------------+-------------------+
   | recvonly                | NORMAL            |
   | sendrecv                | NORMAL            |
   | sendonly                | NORMAL            |
   | sdplang                 | NORMAL            |
   | lang                    | NORMAL            |
   | h248item                | SPECIAL           |
   | sqn                     | NORMAL            |
   | cdsc                    | NORMAL            |
   | cpar                    | INHERIT           |
   | cparmin                 | SPECIAL           |
   | cparmax                 | SPECIAL           |
   | rtcp-xr                 | NORMAL            |
   | maxprate                | SPECIAL           |
   | setup                   | TRANSPORT         |
   | connection              | TRANSPORT         |
   | key-mgmt                | IDENTICAL         |
   | source-filter           | IDENTICAL         |
   | inactive                | NORMAL            |
   | fingerprint             | TRANSPORT         |
   | flute-tsi               | TBD               |
   | flute-ch                | TBD               |
   | FEC-declaration         | TBD               |
   | FEC-OTI-extension       | TBD               |
   | content-desc            | TBD               |
   | ice-pwd                 | TRANSPORT         |
   | ice-ufrag               | TRANSPORT         |
   | stkmstream              | NORMAL            |
   | extmap                  | SPECIAL           |
   | qos-mech-send           | TRANSPORT         |
   | qos-mech-recv           | TRANSPORT         |
   | csup                    | NORMAL            |
   | creq                    | NORMAL            |
   | acap                    | INHERIT           |
   | tcap                    | INHERIT           |
   | 3GPP-QoE-Metrics        | CAUTION           |
   | 3GPP-Asset-Information  | CAUTION           |
   | mbms-mode               | CAUTION           |
   | mbms-repair             | CAUTION           |
   | ike-setup               | IDENTICAL         |
   | psk-fingerprint         | IDENTICAL         |
   | multicast-rtcp          | IDENTICAL         |
   | rmcap                   | IDENTICAL-PER-PT  |
   | omcap                   | NORMAL            |
   | mfcap                   | IDENTICAL-PER-PT  |
   | mscap                   | INHERIT           |
   | 3gpp.iut.replication    | TBD               |
   | bcap                    | INHERIT           |
   | ccap                    | IDENTICAL         |
   | icap                    | NORMAL            |
   | 3gpp_sync_info          | NORMAL            |
   | 3gpp_MaxRecvSDUSize     | NORMAL            |
   | etag                    | CAUTION           |
   | duplication-delay       | NORMAL            |
   | range                   | CAUTION           |
   | control                 | CAUTION           |
   | mtag                    | CAUTION           |
   | ts-refclk               | NORMAL            |
   | mediaclk                | NORMAL            |
   | calgextmap              | NORMAL            |
   +-------------------------+-------------------+
```

#### 15.2.4. Table: att-field (media level only)

The following values are to be added to the "att-field (media level only)" registry in the "Session Description Protocol (SDP) Parameters" registry.  The references should be updated to point at this RFC as well as the previous references.


```
   +---------------------------+-------------------+
   | SDP Name                  | Mux Category      |
   +---------------------------+-------------------+
   | ptime                     | IDENTICAL-PER-PT  |
   | orient                    | NORMAL            |
   | orient:portrait           | NORMAL            |
   | orient:landscape          | NORMAL            |
   | orient:seascape           | NORMAL            |
   | framerate                 | IDENTICAL-PER-PT  |
   | quality                   | NORMAL            |
   | rtpmap                    | IDENTICAL-PER-PT  |
   | fmtp                      | IDENTICAL-PER-PT  |
   | rtpred1                   | CAUTION           |
   | rtpred2                   | CAUTION           |
   | T38FaxVersion             | TBD               |
   | T38MaxBitRate             | TBD               |
   | T38FaxFillBitRemoval      | TBD               |
   | T38FaxTranscodingMMR      | TBD               |
   | T38FaxTranscodingJBIG     | TBD               |
   | T38FaxRateManagement      | TBD               |
   | T38FaxMaxBuffer           | TBD               |
   | T38FaxMaxDatagram         | TBD               |
   | T38FaxUdpEC               | TBD               |
   | maxptime                  | IDENTICAL-PER-PT  |
   | des                       | CAUTION           |
   | curr                      | CAUTION           |
   | conf                      | CAUTION           |
   | mid                       | NORMAL            |
   | rtcp                      | TRANSPORT         |
   | rtcp-fb                   | IDENTICAL-PER-PT  |
   | label                     | NORMAL            |
   | T38VendorInfo             | TBD               |
   | crypto                    | TRANSPORT         |
   | eecid                     | CAUTION           |
   | aalType                   | CAUTION           |
   | capability                | CAUTION           |
   | qosClass                  | CAUTION           |
   | bcob                      | CAUTION           |
   | stc                       | CAUTION           |
   | upcc                      | CAUTION           |
   | atmQOSparms               | CAUTION           |
   | atmTrfcDesc               | CAUTION           |
   | abrParms                  | CAUTION           |
   | abrSetup                  | CAUTION           |
   | bearerType                | CAUTION           |
   | lij                       | CAUTION           |
   | anycast                   | CAUTION           |
   | cache                     | CAUTION           |
   | bearerSigIE               | CAUTION           |
   | aalApp                    | CAUTION           |
   | cbrRate                   | CAUTION           |
   | sbc                       | CAUTION           |
   | clkrec                    | CAUTION           |
   | fec                       | CAUTION           |
   | prtfl                     | CAUTION           |
   | structure                 | CAUTION           |
   | cpsSDUsize                | CAUTION           |
   | all2CPS                   | CAUTION           |
   | all2CPSSDUrate            | CAUTION           |
   | aal2sscs3661unassured     | CAUTION           |
   | aal2sscs3661assured       | CAUTION           |
   | aal2sscs3662              | CAUTION           |
   | aal5sscop                 | CAUTION           |
   | atmmap                    | CAUTION           |
   | silenceSupp               | CAUTION           |
   | ecan                      | CAUTION           |
   | gc                        | CAUTION           |
   | profileDesc               | CAUTION           |
   | vsel                      | CAUTION           |
   | dsel                      | CAUTION           |
   | fsel                      | CAUTION           |
   | onewaySel                 | CAUTION           |
   | codecconfig               | CAUTION           |
   | isup_usi                  | CAUTION           |
   | uiLayer1_Prot             | CAUTION           |
   | chain                     | CAUTION           |
   | floorctrl                 | TBD               |
   | confid                    | NORMAL            |
   | userid                    | NORMAL            |
   | floorid                   | NORMAL            |
   | FEC                       | NORMAL            |
   | accept-types              | TBD               |
   | accept-wrapped-types      | TBD               |
   | max-size                  | TBD               |
   | path                      | TBD               |
   | dccp-service-code         | CAUTION           |
   | rtcp-mux                  | IDENTICAL         |
   | candidate                 | TRANSPORT         |
   | ice-mismatch              | NORMAL            |
   | remote-candidates         | TRANSPORT         |
   | SRTPAuthentication        | TBD               |
   | SRTPROCTxRate             | TBD               |
   | rtcp-rsize                | IDENTICAL         |
   | file-selector             | TBD               |
   | file-transfer-id          | TBD               |
   | file-disposition          | TBD               |
   | file-date                 | TBD               |
   | file-icon                 | TBD               |
   | file-range                | TBD               |
   | depend                    | IDENTICAL-PER-PT  |
   | ssrc                      | NORMAL            |
   | ssrc-group                | NORMAL            |
   | rtcp-unicast              | IDENTICAL         |
   | pcfg                      | SPECIAL           |
   | acfg                      | SPECIAL           |
   | zrtp-hash                 | TRANSPORT         |
   | X-predecbufsize           | CAUTION           |
   | X-initpredecbufperiod     | CAUTION           |
   | X-initpostdecbufperiod    | CAUTION           |
   | X-decbyterate             | CAUTION           |
   | 3gpp-videopostdecbufsize  | CAUTION           |
   | framesize                 | CAUTION           |
   | 3GPP-SRTP-Config          | CAUTION           |
   | alt                       | CAUTION           |
   | alt-default-id            | CAUTION           |
   | 3GPP-Adaption-Support     | CAUTION           |
   | mbms-flowid               | CAUTION           |
   | fec-source-flow           | SPECIAL           |
   | fec-repair-flow           | SPECIAL           |
   | repair-window             | SPECIAL           |
   | rams-updates              | CAUTION           |
   | imageattr                 | IDENTICAL-PER-PT  |
   | cfw-id                    | NORMAL            |
   | portmapping-req           | CAUTION           |
   | g.3gpp.cat                | NORMAL            |
   | g.3gpp.crs                | NORMAL            |
   | ecn-capable-rtp           | IDENTICAL         |
   | visited-realm             | TRANSPORT         |
   | secondary-realm           | TRANSPORT         |
   | omr-s-cksum               | NORMAL            |
   | omr-m-cksum               | NORMAL            |
   | omr-codecs                | NORMAL            |
   | omr-m-att                 | NORMAL            |
   | omr-s-att                 | NORMAL            |
   | omr-m-bw                  | NORMAL            |
   | omr-s-bw                  | NORMAL            |
   | msrp-cema                 | TBD               |
   | dccp-port                 | CAUTION           |
   | resource                  | NORMAL            |
   | channel                   | NORMAL            |
   | cmid                      | NORMAL            |
   | content                   | NORMAL            |
   | lcfg                      | SPECIAL           |
   | loopback                  | NORMAL            |
   | loopback-source           | NORMAL            |
   | loopback-mirror           | NORMAL            |
   | chatroom                  | TBD               |
   | altc                      | TRANSPORT         |
   | T38FaxMaxIFP              | TBD               |
   | T38FaxUdpECDepth          | TBD               |
   | T38FaxUdpFECMaxSpan       | TBD               |
   | T38ModemType              | TBD               |
   | cs-correlation            | TBD               |
   | rtcp-idms                 | NORMAL            |
   +---------------------------+-------------------+
```

#### 15.2.5. Table: att-field (source level)

The following values are to be added to the "att-field (source level)" registry in the "Session Description Protocol (SDP) Parameters" registry.  The references should be updated to point at this RFC as well as the previous references.


```
   +----------------+-------------------+
   | SDP Name       | Mux Category      |
   +----------------+-------------------+
   | cname          | NORMAL            |
   | previous-ssrc  | NORMAL            |
   | fmtp           | IDENTICAL-PER-PT  |
   | ts-refclk      | NORMAL            |
   | mediaclk       | NORMAL            |
   +----------------+-------------------+
```

#### 15.2.6. Table: content SDP Parameters

The following values are to be added to the "content SDP Parameters" subregistry in the "Session Description Protocol (SDP) Parameters" registry.  The references should be updated to point at this RFC as well as the previous references.


```
   +----------+--------------+
   | SDP Name | Mux Category |
   +----------+--------------+
   | slides   | NORMAL       |
   | speaker  | NORMAL       |
   | sl       | NORMAL       |
   | main     | NORMAL       |
   | alt      | NORMAL       |
   +----------+--------------+
```

#### 15.2.7. Table: Semantics for the 'group' SDP Attribute

The following values are to be added to the "Semantics for the "group" SDP Attribute" subregistry in the "Session Description Protocol (SDP) Parameters" registry.  The references should be updated to point at this RFC as well as the previous references.


```
   +---------+--------------+
   | Token   | Mux Category |
   +---------+--------------+
   | LS      | NORMAL       |
   | FID     | NORMAL       |
   | SRF     | NORMAL       |
   | ANAT    | CAUTION      |
   | FEC     | NORMAL       |
   | FEC-FR  | NORMAL       |
   | CS      | NORMAL       |
   | DDP     | NORMAL       |
   | DUP     | NORMAL       |
   +---------+--------------+
```

#### 15.2.8. Table: 'rtcp-fb' Attribute Values

The following values are to be added to the " 'rtcp-fb' Attribute Values" subregistry in the "Session Description Protocol (SDP) Parameters" registry.  The references should be updated to point at this RFC as well as the previous references.


```
   +------------+-------------------+
   | Value Name | Mux Category      |
   +------------+-------------------+
   | ack        | IDENTICAL-PER-PT  |
   | app        | SPECIAL           |
   | ccm        | IDENTICAL-PER-PT  |
   | nack       | IDENTICAL-PER-PT  |
   | trr-int    | IDENTICAL-PER-PT  |
   +------------+-------------------+
```

#### 15.2.9. Table: 'ack' and 'nack' Attribute Values

The following values are to be added to the " 'ack' and 'nack' Attribute Values" subregistry in the "Session Description Protocol (SDP) Parameters" registry.  The references should be updated to point at this RFC as well as the previous references.


```
   +------------+-------------------+
   | Value Name | Mux Category      |
   +------------+-------------------+
   | sli        | IDENTICAL-PER-PT  |
   | pli        | IDENTICAL-PER-PT  |
   | rpsi       | IDENTICAL-PER-PT  |
   | app        | SPECIAL           |
   | rai        | IDENTICAL-PER-PT  |
   | tllei      | IDENTICAL-PER-PT  |
   | pslei      | IDENTICAL-PER-PT  |
   | ecn        | IDENTICAL         |
   +------------+-------------------+
```

#### 15.2.10. Table: 'depend' SDP Attribute Values

The following values are to be added to the " 'depend' SDP Attribute Values" subregistry in the "Session Description Protocol (SDP) Parameters" registry.  The references should be updated to point at this RFC as well as the previous references.


```
   +-------+-------------------+
   | Token | Mux Category      |
   +-------+-------------------+
   | lay   | IDENTICAL-PER-PT  |
   | mdc   | IDENTICAL-PER-PT  |
   +-------+-------------------+
```

#### 15.2.11. Table: 'cs-correlation' Attribute Values

The following values are to be added to the " "cs-correlation" Attribute Values" subregistry in the "Session Description Protocol (SDP) Parameters" registry.  The references should be updated to point at this RFC as well as the previous references.


```
   +-----------+--------------+
   | Value     | Mux Category |
   +-----------+--------------+
   | callerid  | TBD          |
   | uuie      | TBD          |
   | dtmf      | TBD          |
   | external  | TBD          |
   +-----------+--------------+
```

#### 15.2.12. Table: Semantics for the 'ssrc-group' SDP Attribute

The following values are to be added to the Semantics for the "Semantics for the "ssrc-group" SDP Attribute" subregistry in the "Session Description Protocol (SDP) Parameters" registry.  The references should be updated to point at this RFC as well as the previous references.


```
   +---------+--------------+
   | Token   | Mux Category |
   +---------+--------------+
   | FID     | NORMAL       |
   | FEC     | NORMAL       |
   | FEC-FR  | NORMAL       |
   | DUP     | NORMAL       |
   +---------+--------------+
```

#### 15.2.13. Table: SDP/RTSP key management protocol identifiers

The following values are to be added to the "SDP/RTSP key management protocol identifiers" subregistry in the "Session Description Protocol (SDP) Parameters" registry.  The references should be updated to point at this RFC as well as the previous references.


```
   +------------+--------------+
   | Value Name | Mux Category |
   +------------+--------------+
   | mikey      | IDENTICAL    |
   +------------+--------------+
```

#### 15.2.14. Table: Codec Control Messages

The following values are to be added to the "Codec Control Messages" subregistry in the "Session Description Protocol (SDP) Parameters" registry.  The references should be updated to point at this RFC as well as the previous references.


```
   +------------+-------------------+
   | Value Name | Mux Category      |
   +------------+-------------------+
   | fir        | IDENTICAL-PER-PT  |
   | tmmbr      | IDENTICAL-PER-PT  |
   | tstr       | IDENTICAL-PER-PT  |
   | vbcm       | IDENTICAL-PER-PT  |
   +------------+-------------------+
```

#### 15.2.15. Table: QoS Mechanism Tokens

The following values are to be added to the "QoS Mechanism Tokens" subregistry in the "Session Description Protocol (SDP) Parameters" registry.  The references should be updated to point at this RFC as well as the previous references.


```
   +---------------+--------------+
   | QoS Mechanism | Mux Category |
   +---------------+--------------+
   | rsvp          | TRANSPORT    |
   | nsis          | TRANSPORT    |
   +---------------+--------------+
```

#### 15.2.16. Table: SDP Capability Negotiation Option Tags

The following values are to be added to the "SDP Capability Negotiation Option Tags" subregistry in the "Session Description Protocol (SDP) Parameters" registry.  The references should be updated to point at this RFC as well as the previous references.


```
   +------------+--------------+
   | Option Tag | Mux Category |
   +------------+--------------+
   | cap-v0     | NORMAL       |
   | med-v0     | NORMAL       |
   | bcap-v0    | NORMAL       |
   | ccap-v0    | NORMAL       |
   | icap-v0    | NORMAL       |
   +------------+--------------+
```

#### 15.2.17. Table: Timestamp Reference Clock Source Parameters

The following values are to be added to the "Timestamp Reference Clock Source Parameters" subregistry in the "Session Description Protocol (SDP) Parameters" registry.  The references should be updated to point at this RFC as well as the previous references.


```
   +----------+--------------+
   | Name     | Mux Category |
   +----------+--------------+
   | ntp      | NORMAL       |
   | ptp      | NORMAL       |
   | gps      | NORMAL       |
   | gal      | NORMAL       |
   | glonass  | NORMAL       |
   | local    | NORMAL       |
   | private  | NORMAL       |
   +----------+--------------+
```

#### 15.2.18. Table: Media Clock Source Parameters

The following values are to be added to the "Media Clock Source Parameters" subegistry in the "Session Description Protocol (SDP) Parameters" registry.  The references should be updated to point at this RFC as well as the previous references.


```
   +-----------+--------------+
   | Name      | Mux Category |
   +-----------+--------------+
   | sender    | NORMAL       |
   | direct    | NORMAL       |
   | IEEE1722  | NORMAL       |
   +-----------+--------------+
```

## 16. Security Considerations

The primary security for RTP including the way it is used here is described in [RFC3550] and [RFC3711].

When multiplexing SDP attributes with the category "CAUTION", the implementations should be aware of possible issues as described in this specification.
