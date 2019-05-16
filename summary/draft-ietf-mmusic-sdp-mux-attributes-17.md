> Read [original](https://tools.ietf.org/html/draft-ietf-mmusic-sdp-mux-attributes-17) / [markdown](../markdown/draft-ietf-mmusic-sdp-mux-attributes-17.md)

---

# A Framework for SDP Attributes when Multiplexing

## 1. Introduction

## 2. Terminology

## 3. Motivation

## 4. SDP Attribute Analysis Framework

### 4.1. Category: NORMAL

### 4.2. Category: CAUTION

### 4.3. Category: IDENTICAL

### 4.4. Category: SUM

### 4.5. Category: TRANSPORT

### 4.6. Category: INHERIT

### 4.7. Category: IDENTICAL-PER-PT

### 4.8. Category: SPECIAL

### 4.9. Category: TBD

## 5. Analysis of Existing Attributes

### 5.1. RFC4566: SDP

### 5.2. RFC4585: RTP/AVPF

### 5.3. RFC5761: Multiplexing RTP and RTCP

### 5.4. RFC3312: Integration of Resource Management and SIP

### 5.5. RFC4574: SDP Label Attribute

### 5.6. RFC5432: QOS Mechanism Selection in SDP

### 5.7. RFC4568: SDP Security Descriptions

### 5.8. RFC5762: RTP over DCCP

### 5.9. RFC6773: DCCP-UDP Encapsulation

### 5.10. RFC5506: Reduced-Size RTCP in RTP Profile

### 5.11. RFC6787: Media Resource Control Protocol Version 2

### 5.12. RFC5245: ICE

### 5.13. RFC5285: RTP Header Extensions

### 5.14. RFC3605: RTCP attribute in SDP

### 5.15. RFC5576: Source-Specific SDP Attributes

### 5.16. RFC7273: RTP Clock Source Signalling

### 5.17. RFC6236: Image Attributes in SDP

### 5.18. RFC7197: Duplication Delay Attribute in SDP

### 5.19. RFC7266: RTCP XR Blocks for MOS Metric Reporting

### 5.20. RFC6285: Rapid Acquisition of Multicast RTP Sessions

##   to further accelerate the acquisition. The motivating use case for this capability is multicast applications that carry real-time compressed audio and video.

### 5.21. RFC6230: Media Control Channel Framework

### 5.22. RFC6364: SDP Elements for FEC Framework

### 5.23. RFC4796: Content Attribute

### 5.24. RFC3407: SDP Simple Capability Declaration

### 5.25. RFC6284: Port Mapping between Unicast and Multicast RTP Sessions

### 5.26. RFC6714: MSRP-CEMA

### 5.27. RFC4583: SDP Format for BFCP Streams

### 5.28. RFC5547: SDP Offer/Answer for File Transfer

### 5.29. RFC6849: SDP and RTP Media Loopback Extension

### 5.30. RFC5760: RTCP with Unicast Feedback

### 5.31. RFC3611: RTCP XR

### 5.32. RFC5939: SDP Capability Negotiation

### 5.33. RFC6871: SDP Media Capabilities Negotiation

### 5.34. RFC7006: Miscellaneous Capabilities Negotiation SDP

### 5.35. RFC4567: Key Management Extensions for SDP and RTSP

### 5.36. RFC4572: Comedia over TLS in SDP

### 5.37. RFC4570: SDP Source Filters

### 5.38. RFC6128: RTCP Port for Multicast Sessions

### 5.39. RFC6189: ZRTP

### 5.40. RFC4145: Connection-Oriented Media

### 5.41. RFC6947: The SDP altc Attribute

### 5.42. RFC7195: SDP Extension for Circuit Switched Bearers in PSTN

### 5.43. RFC7272: IDMS Using the RTP Control Protocol (RTCP)

### 5.44. RFC5159: Open Mobile Alliance (OMA) Broadcast (BCAST) SDP Attributes

### 5.45. RFC6193: Media Description for IKE in SDP

### 5.46. RFC2326: Real Time Streaming Protocol

### 5.47. RFC6064: SDP and RTSP Extensions for 3GPP

### 5.48. RFC3108: ATM SDP

### 5.49. 3GPP TS 26.114

### 5.50. 3GPP TS 183.063

### 5.51. 3GPP TS 24.182

### 5.52. 3GPP TS 24.183

### 5.53. 3GPP TS 24.229

### 5.54. ITU T.38

### 5.55. ITU-T Q.1970

### 5.56. ITU-T H.248.15

### 5.57. RFC4975: The Message Session Relay Protocol

### 5.58. Historical Attributes

## 6. bwtype Attribute Analysis

### 6.1. RFC4566: SDP

### 6.2. RFC3556: SDP Bandwidth Modifiers for RTCP Bandwidth

### 6.3. RFC3890: Bandwidth Modifier for SDP

## 7. rtcp-fb Attribute Analysis

### 7.1. RFC4585: RTP/AVPF

### 7.2. RFC5104: Codec Control Messages in AVPF

### 7.3. RFC6285: Unicast-Based Rapid Acquisition of Multicast RTP Sessions (RAMS)

### 7.4. RFC6679: ECN for RTP over UDP/IP

### 7.5. RFC6642: Third-Party Loss Report

### 7.6. RFC5104: Codec Control Messages in AVPF

## 8. group Attribute Analysis

### 8.1. RFC5888: SDP Grouping Framework

### 8.2. RFC3524: Mapping Media Streams to Resource Reservation Flows

### 8.3. RFC4091: ANAT Semantics

### 8.4. RFC5956: FEC Grouping Semantics in SDP

### 8.5. RFC5583: Signaling Media Decoding Dependency in SDP

### 8.6. RFC7104: Duplication Grouping Semantics in the SDP

## 9. ssrc-group Attribute Analysis

### 9.1. RFC5576: Source-Specific SDP Attributes

### 9.2. RFC7104: Duplication Grouping Semantics in the SDP

## 10. QoS Mechanism Token Analysis

### 10.1. RFC5432: QoS Mechanism Selection in SDP

## 11. k= Attribute Analysis

### 11.1. RFC4566: SDP

## 12. content Attribute Analysis

### 12.1. RFC4796

## 13. Payload Formats

### 13.1. RFC5109: RTP Payload Format for Generic FEC

## 14. Multiplexing Considerations for Encapsulating Attributes

### 14.1. RFC3407: cpar Attribute Analysis

### 14.2. RFC5939 Analysis

#### 14.2.1. Recommendation: Procedures for Potential Configuration Pairing

##### 14.2.1.1. Example: Transport Capability Multiplexing

##### 14.2.1.2. Example: Attribute Capability Multiplexing

### 14.3. RFC6871 Analysis

#### 14.3.1. Recommendation: Dealing with Payload Type Numbers

##### 14.3.1.1. Example: Attribute Capability Under Shared Payload Type

#### 14.3.2. Recommendation: Dealing with Latent Configurations

## 15. IANA Considerations

### 15.1. New 'Multiplexing Categories' subregistry

### 15.2. 'Mux Category' column for subregistries

#### 15.2.1. Table: SDP bwtype

#### 15.2.2. Table: att-field (session level)

#### 15.2.3. Table: att-field (both session and media level)

#### 15.2.4. Table: att-field (media level only)

#### 15.2.5. Table: att-field (source level)

#### 15.2.6. Table: content SDP Parameters

#### 15.2.7. Table: Semantics for the 'group' SDP Attribute

#### 15.2.8. Table: 'rtcp-fb' Attribute Values

#### 15.2.9. Table: 'ack' and 'nack' Attribute Values

#### 15.2.10. Table: 'depend' SDP Attribute Values

#### 15.2.11. Table: 'cs-correlation' Attribute Values

#### 15.2.12. Table: Semantics for the 'ssrc-group' SDP Attribute

#### 15.2.13. Table: SDP/RTSP key management protocol identifiers

#### 15.2.14. Table: Codec Control Messages

#### 15.2.15. Table: QoS Mechanism Tokens

#### 15.2.16. Table: SDP Capability Negotiation Option Tags

#### 15.2.17. Table: Timestamp Reference Clock Source Parameters

#### 15.2.18. Table: Media Clock Source Parameters

## 16. Security Considerations