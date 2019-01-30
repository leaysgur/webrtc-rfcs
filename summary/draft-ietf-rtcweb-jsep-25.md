> [Read original](../md/draft-ietf-rtcweb-jsep-25.md)

---

# JavaScript Session Establishment Protocol

## 1. Introduction

### 1.1. General Design of JSEP

### 1.2. Other Approaches Considered

## 2. Terminology

## 3. Semantics and Syntax

### 3.1. Signaling Model

### 3.2. Session Descriptions and State Machine

### 3.3. Session Description Format

### 3.4. Session Description Control

#### 3.4.1. RtpTransceivers

#### 3.4.2. RtpSenders

#### 3.4.3. RtpReceivers

### 3.5. ICE

#### 3.5.1. ICE Gathering Overview

#### 3.5.2. ICE Candidate Trickling

##### 3.5.2.1. ICE Candidate Format

#### 3.5.3. ICE Candidate Policy

#### 3.5.4. ICE Candidate Pool

#### 3.5.5. ICE Versions

### 3.6. Video Size Negotiation

#### 3.6.1. Creating an imageattr Attribute

#### 3.6.2. Interpreting imageattr Attributes

### 3.7. Simulcast

### 3.8. Interactions With Forking

#### 3.8.1. Sequential Forking

#### 3.8.2. Parallel Forking

## 4. Interface

### 4.1. PeerConnection

#### 4.1.1. Constructor

#### 4.1.2. addTrack

#### 4.1.3. removeTrack

#### 4.1.4. addTransceiver

#### 4.1.5. createDataChannel

#### 4.1.6. createOffer

#### 4.1.7. createAnswer

#### 4.1.8. SessionDescriptionType

##### 4.1.8.1. Use of Provisional Answers

##### 4.1.8.2. Rollback

#### 4.1.9. setLocalDescription

#### 4.1.10. setRemoteDescription

#### 4.1.11. currentLocalDescription

#### 4.1.12. pendingLocalDescription

#### 4.1.13. currentRemoteDescription

#### 4.1.14. pendingRemoteDescription

#### 4.1.15. canTrickleIceCandidates

#### 4.1.16. setConfiguration

#### 4.1.17. addIceCandidate

### 4.2. RtpTransceiver

#### 4.2.1. stop

#### 4.2.2. stopped

#### 4.2.3. setDirection

#### 4.2.4. direction

#### 4.2.5. currentDirection

#### 4.2.6. setCodecPreferences

## 5. SDP Interaction Procedures

### 5.1. Requirements Overview

#### 5.1.1. Usage Requirements

#### 5.1.2. Profile Names and Interoperability

### 5.2. Constructing an Offer

#### 5.2.1. Initial Offers

#### 5.2.2. Subsequent Offers

#### 5.2.3. Options Handling

##### 5.2.3.1. IceRestart

##### 5.2.3.2. VoiceActivityDetection

### 5.3. Generating an Answer

#### 5.3.1. Initial Answers

#### 5.3.2. Subsequent Answers

#### 5.3.3. Options Handling

##### 5.3.3.1. VoiceActivityDetection

### 5.4. Modifying an Offer or Answer

### 5.5. Processing a Local Description

### 5.6. Processing a Remote Description

### 5.7. Processing a Rollback

### 5.8. Parsing a Session Description

#### 5.8.1. Session-Level Parsing

#### 5.8.2. Media Section Parsing

#### 5.8.3. Semantics Verification

### 5.9. Applying a Local Description

### 5.10. Applying a Remote Description

### 5.11. Applying an Answer

## 6. Processing RTP/RTCP

## 7. Examples

### 7.1. Simple Example

### 7.2. Detailed Example

### 7.3. Early Transport Warmup Example

## 8. Security Considerations