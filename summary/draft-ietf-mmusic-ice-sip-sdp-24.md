> Read [original](https://tools.ietf.org/html/draft-ietf-mmusic-ice-sip-sdp-24) / [markdown](../markdown/draft-ietf-mmusic-ice-sip-sdp-24.md)

---

# SDP Offer/Answer procedures for ICE

## 1. Introduction

## 2. Terminology

## 3. SDP Offer/Answer Procedures

### 3.1. Introduction

### 3.2. Generic Procedures

#### 3.2.1. Encoding

##### 3.2.1.1. Data Streams

##### 3.2.1.2. Candidates

##### 3.2.1.3. Username and Password

##### 3.2.1.4. Lite Implementations

##### 3.2.1.5. ICE Extensions

##### 3.2.1.6. Inactive and Disabled Data Streams

#### 3.2.2. RTP/RTCP Considerations

#### 3.2.3. Determining Role

#### 3.2.4. STUN Considerations

#### 3.2.5. Verifying ICE Support Procedures

#### 3.2.6. SDP Example

### 3.3. Initial Offer/Answer Exchange

#### 3.3.1. Sending the Initial Offer

#### 3.3.2. Sending the Initial Answer

#### 3.3.3. Receiving the Initial Answer

#### 3.3.4. Concluding ICE

### 3.4. Subsequent Offer/Answer Exchanges

#### 3.4.1. Sending Subsequent Offer

##### 3.4.1.1. Procedures for All Implementations

###### 3.4.1.1.1. ICE Restarts

###### 3.4.1.1.2. Removing a Data Stream

###### 3.4.1.1.3. Adding a Data Stream

##### 3.4.1.2. Procedures for Full Implementations

###### 3.4.1.2.1. Before Nomination

###### 3.4.1.2.2. After Nomination

##### 3.4.1.3. Procedures for Lite Implementations

#### 3.4.2. Sending Subsequent Answer

##### 3.4.2.1. ICE Restart

##### 3.4.2.2. Lite Implementation specific procedures

#### 3.4.3. Receiving Answer for a Subsequent Offer

##### 3.4.3.1. Procedures for Full Implementations

###### 3.4.3.1.1. ICE Restarts

##### 3.4.3.2. Procedures for Lite Implementations

## 4. Grammar

### 4.1. "candidate" Attribute

### 4.2. "remote-candidates" Attribute

### 4.3. "ice-lite" and "ice-mismatch" Attributes

### 4.4. "ice-ufrag" and "ice-pwd" Attributes

### 4.5. "ice-pacing" Attribute

### 4.6. "ice-options" Attribute

## 5. Keepalives

## 6. SIP Considerations

### 6.1. Latency Guidelines

#### 6.1.1. Offer in INVITE

#### 6.1.2. Offer in Response

### 6.2. SIP Option Tags and Media Feature Tags

### 6.3. Interactions with Forking

### 6.4. Interactions with Preconditions

### 6.5. Interactions with Third Party Call Control

## 7. Relationship with ANAT

## 8. Security Considerations

### 8.1. Attacks on the Offer/Answer Exchanges

### 8.2. Insider Attacks

#### 8.2.1. The Voice Hammer Attack

#### 8.2.2. Interactions with Application Layer Gateways and SIP

## 9. IANA Considerations

### 9.1. SDP Attributes

#### 9.1.1. candidate Attribute

#### 9.1.2. remote-candidates Attribute

#### 9.1.3. ice-lite Attribute

#### 9.1.4. ice-mismatch Attribute

#### 9.1.5. ice-pwd Attribute

#### 9.1.6. ice-ufrag Attribute

#### 9.1.7. ice-options Attribute

#### 9.1.8. ice-pacing Attribute

### 9.2. Interactive Connectivity Establishment (ICE) Options Registry

## Appendix A. Examples

## Appendix B. The remote-candidates Attribute

## Appendix C. Why Is the Conflict Resolution Mechanism Needed?

## Appendix D. Why Send an Updated Offer?