> Read [original](https://tools.ietf.org/html/draft-ietf-mmusic-mux-exclusive-12) / [summary](../summary/draft-ietf-mmusic-mux-exclusive-12.md)

---

# Indicating Exclusive Support of RTP/RTCP Multiplexing using SDP

## 1. Introduction

[RFC5761] defines how to multiplex RTP and RTCP on a single IP address and port, referred to as RTP/RTCP multiplexing.  [RFC5761] also defines an Session Description Protocol (SDP) [RFC4566] attribute, 'rtcp-mux' that can be used by entities to indicate support, and negotiate usage of, RTP/RTCP multiplexing.

As defined in [RFC5761], if the peer endpoint does not support RTP/ RTCP multiplexing, both endpoints should use separate ports for sending and receiving of RTCP (referred to as fallback to usage of separate ports for RTP and RTCP).

Some newer applications that do not require backward compatibility with peers that cannot multiplex RTCP might choose to not implement separation of RTP and RTCP.  Examples of such applications are W3C WEBRTC [W3C.WD-webrtc-20120209] applications, that are not required to interoperate with non-WEBRTC clients.  For such applications, this document defines an SDP attribute to signal intent to require multiplexing.  The use of this attribute in SDP offers [RFC3264] by entities that ever need to interoperate with peers that do not support RTC/RTCP multiplexing may harm interoperability.  Also, while the SDP answerer [RFC3264] might support, and prefer usage of, fallback to non-multiplex, the attribute indicates that fallback to non-multiplex cannot be enabled.  One example of where non-multiplex is preferred is where an endpoint is connected to a radio interface, and wants to use different bearers (possibly with different quality characteristics) for RTP and RTCP.  Another example is where the one endpoint is acting as a gateway to a network where RTP/RTCP multiplexing cannot be used.  In such case there endpoint may prefer non-multiplexing also towards the other network.  Otherwise the endpoint would have to perform de-multiplexing of RTP and RTCP.

This document defines a new SDP media-level attribute, 'rtcp-mux-only', that can be used by an endpoint to indicate exclusive support of RTP/RTCP multiplexing.  The document also updates [RFC5761], by clarifying that an offerer can use a mechanism to indicate that it is not able to send and receive RTCP on separate ports.

The document also describes the Interactive Connectivity Establishment (ICE) [RFC5245] considerations when indicating exclusive support of RTP/RTCP multiplexing.

## 2. Conventions

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC2119].

## 3. SDP rtcp-mux-only Attribute

This section defines a new SDP media-level attribute, 'rtcp-mux-only'.


```
          Name: rtcp-mux-only

          Value: N/A

          Usage Level: media

          Charset Dependent: no

          Syntax:

              rtcp-mux-only

          Example:

              a=rtcp-mux-only
```

In an SDP offer, the offerer uses the SDP 'rtcp-mux-only' attribute to indicate exclusive support of RTP/RTCP multiplexing for the RTP-based media associated with the SDP media description ("m=" line).

In an SDP answer, the 'rtcp-mux' attribute [RFC5761] indicates that the answerer supports, and accepts usage of, RTP/RTCP multiplexing for the RTP-based media associated with the SDP media description ("m=" line).

The usage of the 'rtcp-mux-only' attribute in an SDP answer is forbidden.

The usage of the SDP 'rtcp-mux-only' attribute is only defined for RTP-based media.

The mux category [I-D.ietf-mmusic-sdp-mux-attributes] for the 'rtcp-mux-only' attribute is 'IDENTICAL', which means that the attribute, if used within a BUNDLE group [I-D.ietf-mmusic-sdp-bundle-negotiation], must be associated with all multiplexed RTP-based media descriptions within the BUNDLE group.

The 'rtcp-mux-only' attribute applies to the whole associated media description.  The attribute MUST NOT be defined per source (using the SDP 'ssrc' attribute [RFC5576]).

The SDP offer/answer [RFC3264] procedures associated with the attribute are defined in Section 4

## 4. SDP Offer/Answer Procedures

### 4.1. General

This section defines the SDP offer/answer [RFC3264] procedures for indicating exclusive support of, and negotiating usage of, RTP/RTCP multiplexing.

The procedures in this section apply to individual RTP-based SDP media descriptions ("m=" lines).

### 4.2. Generating the Initial SDP Offer

When an offerer sends the initial offer, if the offerer wants to indicate exclusive RTP/RTCP multiplexing for RTP-based media, the offerer MUST associate an SDP 'rtcp-mux-only' attribute with the associated SDP media description ("m=" line).

In addition, if the offerer associates an SDP 'rtcp-mux-only' attribute with an SDP media description ("m=" line, the offerer MUST also associate an SDP 'rtcp-mux' attribute with the same SDP media description ("m=" line), following the procedures in [RFC5761].

If the offerer associates an SDP 'rtcp' attribute [RFC3605] with an SDP media description ("m=" line), and if the offerer also associates an SDP 'rtcp-mux-only' attribute with the same SDP media description ("m=" line), the address and port values of the SDP 'rtcp' attribute MUST match the corresponding values for RTP.

NOTE: This specification does not mandate the usage of the SDP 'rtcp' attribute for RTP/RTCP multiplexing.

### 4.3. Generating the Answer

When an answerer receives an offer that contains an SDP 'rtcp-mux-only' attribute, associated with an RTP-based SDP media description ("m=" line), if the answerer accepts the usage of RTP/RTCP multiplexing, the answerer MUST associate an SDP 'rtcp-mux' attribute with the corresponding SDP media description ("m=") in the associated answer, following the procedures in [RFC5761].  If the answerer does not accept the usage of RTP/RTCP multiplexing, the answerer MUST either reject the SDP media description ("m=") by setting the port value to zero in the associated answer, or reject the whole offer, following the procedures in [RFC3264].

The answerer MUST NOT associate an SDP 'rtcp-mux-only' attribute with an SDP media description ("m=" line) in the answer.

### 4.4. Offerer Processing of the SDP Answer

If an offerer associated an SDP 'rtcp-mux-only' attribute with an RTP-based SDP media description ("m=" line) in an offer, and if the corresponding SDP media description ("m=" line) in the associated answer contains an SDP 'rtcp-mux' attribute, the offerer MUST apply the RTP/RTCP multiplexing procedures [RFC5761] to the associated RTP-based media.  If the corresponding SDP media description ("m=" line) in the associated answer does not contain an SDP 'rtcp-mux' attribute, the offerer MUST either take appropriate actions in order to disable the associated RTP-based media, e.g., send a new offer with a zero port value associated with the SDP media description ("m=" line), or send a new offer without associating an SDP 'rtcp-mux-only' attribute with the SDP media description ("m=" line).

NOTE: This document does not mandate specific actions on how to terminate the RTP media.  The offerer might e.g. send a new offer where the port value of the SDP media description is set to zero in order to terminate the RTP media.

### 4.5. Modifying the Session

When an offerer sends a subsequent offer, if the offerer and answerer have previously negotiated usage of exclusive RTP/RTCP multiplexing for the media associated with an RTP-based SDP media description ("m=" line), the offerer SHOULD associate an SDP 'rtcp-mux-only' with the corresponding SDP media description ("m=" line).

In addition, if the offerer associates an SDP 'rtcp-mux-only' attribute with an SDP media description ("m=" line), the offerer MUST also associate an SDP 'rtcp-mux' attribute with the same SDP media description ("m=" line), following the procedures in [RFC5761].

If the offerer does not associate the attributes with the corresponding SDP media description ("m=" line) it is an indication that the offerer no longer wants to use RTP/RTCP multiplexing, and instead MUST fallback to usage of separate ports for RTP and RTCP once the offer has been accepted by the answerer.

When an offerer sends a subsequent offer, if the offerer and answerer have not previously negotiated usage of RTP/RTCP multiplexing for the media associated with an RTP-based SDP media description ("m=" line), the offerer MAY indicate exclusive support of RTP/RTCP multiplexing, following the procedures in Section 4.2.  The offerer MUST process the associated answer following the procedures in Section 4.4.

It is RECOMMENDED to not switch between usage of RTP/RTCP multiplexing and usage of separate ports for RTP and RTCP in a subsequent offer, unless there is a use-case that mandates it.

## 5. Update to RFC 5761

### 5.1. General

This section updates sections 5.1.1 and 5.1.3 of [RFC5761], by clarifying that an offerer can use a mechanism to indicate that it is not able to send and receive RTCP on separate ports, and that the offerer shall terminate the affected streams if the answerer does not indicate support of RTP/RTCP multiplexing.  It also clarifies that, when the offerer is not able to send and receive RTCP on separate ports, the offerer will not provide an SDP 'candidate' attribute for RTCP, nor will the offerer provide a fallback port for RTCP (using the SDP 'rtcp' attribute).

### 5.2. Update to 4th paragraph of section 5.1.1

NOTE: [RFC8035] also updates section 5.1.1 of [RFC5761].  While the paragraph updated in this document is not updated by [RFC8035], the location of the paragraph within section 5.1.1 is moved.


```
OLD TEXT:

   If the answer does not contain an "a=rtcp-mux" attribute, the offerer
   MUST NOT multiplex RTP and RTCP packets on a single port.  Instead,
   it should send and receive RTCP on a port allocated according to the
   usual port-selection rules (either the port pair, or a signalled port
   if the "a=rtcp:" attribute [10] is also included).  This will occur
   when talking to a peer that does not understand the "a=rtcp-mux"
   attribute.


NEW TEXT:

   If the answer does not contain an "a=rtcp-mux" attribute, the offerer
   MUST NOT multiplex RTP and RTCP packets on a single port.  Instead,
   it should send and receive RTCP on a port allocated according to the
   usual port-selection rules (either the port pair, or a signaled port
   if the "a=rtcp:" attribute [10] is also included).  This will occur
   when talking to a peer that does not understand the "a=rtcp-mux"
   attribute. However, if the offerer indicated in the offer that it is
   not able to send and receive RTCP on a separate port, the offerer
   MUST disable the media streams associated with the attribute. The
   mechanism for indicating that the offerer is not able to send and
   receive RTCP on a separate port is outside the scope of this
   specification.
```

### 5.3. Update to 2nd paragraph of section 5.1.3


```
OLD TEXT:

   If it is desired to use both ICE and multiplexed RTP and RTCP, the
   initial offer MUST contain an "a=rtcp-mux" attribute to indicate that
   RTP and RTCP multiplexing is desired and MUST contain "a=candidate:"
   lines for both RTP and RTCP along with an "a=rtcp:" line indicating a
   fallback port for RTCP in the case that the answerer does not support
   RTP and RTCP multiplexing.  This MUST be done for each media where
   RTP and RTCP multiplexing is desired.


NEW TEXT:

   If it is desired to use both ICE and multiplexed RTP and RTCP, the
   initial offer MUST contain an "a=rtcp-mux" attribute to indicate that
   RTP and RTCP multiplexing is desired and MUST contain "a=candidate:"
   lines for both RTP and RTCP along with an "a=rtcp:" line indicating a
   fallback port for RTCP in the case that the answerer does not support
   RTP and RTCP multiplexing.  This MUST be done for each media where
   RTP and RTCP multiplexing is desired. However, if the offerer
   indicates in the offer that it is not able to send and receive RTCP
   on a separate port, the offerer MUST NOT include "a=candidate:"
   lines for RTCP, and the offerer MUST NOT provide a fallback port for
   RTCP using the "a=rtcp:" line.
```

## 6. ICE Considerations

As defined in [RFC5245], if an entity is aware that the remote peer supports, and is willing to use, RTP/RTCP multiplexing, the entity will only provide RTP candidates (component ID 1).  However, only providing RTP candidates does not as such imply exclusive support of RTP/RTCP multiplexing.  RTCP candidates would not be provided also in cases where RTCP is not supported at all.  Therefore, additional information is needed in order to indicate support of exclusive RTP/ RTCP multiplexing.  This document defines such mechanism using the SDP 'rtcp-mux-only' attributes.

## 7. Security Considerations

This document does not introduce new security considerations in additions to those specified in [RFC3605] and [RFC5761].

## 8. IANA Considerations

This document updates the "Session Description Protocol Parameters" registry as specified in Section 8.2.2 of [RFC4566].  Specifically, it adds the SDP 'rtcp-mux-only' attribute to the table for SDP media level attributes.


```
       Attribute name: rtcp-mux-only
       Type of attribute: media-level
       Subject to charset: no
       Purpose: Indicate exclusive support of RTP/RTCP multiplexing
       Appropriate Values: N/A
       Contact name: Christer Holmberg (christer.holmberg@ericsson.com)
       Mux Category: IDENTICAL
```
