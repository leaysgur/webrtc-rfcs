> Read [original](https://tools.ietf.org/html/draft-ietf-mmusic-sdp-bundle-negotiation-54) / [markdown](../markdown/draft-ietf-mmusic-sdp-bundle-negotiation-54.md)

---

# Negotiating Media Multiplexing Using the SDP

## 1. Introduction

### 1.1. Background

### 1.2. BUNDLE Mechanism

### 1.3. Protocol Extensions

## 2. Terminology

## 3. Conventions

## 4. Applicability Statement

## 5. SDP Grouping Framework BUNDLE Extension

## 6. SDP 'bundle-only' Attribute

## 7. SDP Offer/Answer Procedures

### 7.1. Generic SDP Considerations

#### 7.1.1. Connection Data (c=)

#### 7.1.2. Bandwidth (b=)

#### 7.1.3. Attributes (a=)

### 7.2. Generating the Initial SDP Offer

#### 7.2.1. Suggesting the Offerer tagged 'm=' section

#### 7.2.2. Example: Initial SDP Offer

### 7.3. Generating the SDP Answer

#### 7.3.1. Answerer Selection of tagged 'm=' sections

#### 7.3.2. Moving A Media Description Out Of A BUNDLE Group

#### 7.3.3. Rejecting a Media Description in a BUNDLE Group

#### 7.3.4. Example: SDP Answer

### 7.4. Offerer Processing of the SDP Answer

### 7.5. Modifying the Session

#### 7.5.1. Adding a Media Description to a BUNDLE group

#### 7.5.2. Moving a Media Description Out of a BUNDLE Group

#### 7.5.3. Disabling a Media Description in a BUNDLE Group

## 8. Protocol Identification

### 8.1. STUN, DTLS, SRTP

## 9. RTP Considerations

### 9.1. Single RTP Session

#### 9.1.1. Payload Type (PT) Value Reuse

### 9.2. Associating RTP/RTCP Streams with the Correct SDP Media Description

### 9.3. RTP/RTCP Multiplexing

#### 9.3.1. SDP Offer/Answer Procedures

##### 9.3.1.1. Generating the Initial SDP BUNDLE Offer

##### 9.3.1.2. Generating the SDP Answer

##### 9.3.1.3. Offerer Processing of the SDP Answer

##### 9.3.1.4. Modifying the Session

## 10. ICE Considerations

## 11. DTLS Considerations

## 12. RTP Header Extensions Consideration

## 13. Update to RFC 3264

### 13.1. Original text of section 5.1 (2nd paragraph) of RFC 3264

### 13.2. New text replacing section 5.1 (2nd paragraph) of RFC 3264

### 13.3. Original text of section 8.4 (6th paragraph) of RFC 3264

### 13.4. New text replacing section 8.4 (6th paragraph) of RFC 3264

## 14. Update to RFC 5888

### 14.1. Original text of section 9.2 (3rd paragraph) of RFC 5888

### 14.2. New text replacing section 9.2 (3rd paragraph) of RFC 5888

## 15. RTP/RTCP extensions for identification-tag transport

### 15.1. RTCP MID SDES Item

### 15.2. RTP SDES Header Extension For MID

## 16. IANA Considerations

### 16.1. New SDES item

### 16.2. New RTP SDES Header Extension URI

### 16.3. New SDP Attribute

### 16.4. New SDP Group Semantics

## 17. Security Considerations

## 18. Examples

### 18.1. Example: Tagged m= Section Selections

### 18.2. Example: BUNDLE Group Rejected

### 18.3. Example: Offerer Adds a Media Description to a BUNDLE Group

### 18.4. Example: Offerer Moves a Media Description Out of a BUNDLE Group

### 18.5. Example: Offerer Disables a Media Description Within a BUNDLE Group

## Appendix A. Design Considerations

### A.1. UA Interoperability

### A.2. Usage of Port Number Value Zero

### A.3. B2BUA And Proxy Interoperability

#### A.3.1. Traffic Policing

#### A.3.2. Bandwidth Allocation

### A.4. Candidate Gathering