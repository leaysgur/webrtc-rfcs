> Read [original](https://tools.ietf.org/html/draft-roach-mmusic-unified-plan-00) / [markdown](../markdown/draft-roach-mmusic-unified-plan-00.md)

---

# A Unified Plan for Using SDP with Large Numbers of Media Flows

## 1. Introduction

### 1.1. Design Goals

#### 1.1.1. Support for a large number of arbitrary sources

#### 1.1.2. Support for fine-grained receiver control of sources

#### 1.1.3. Glareless addition and removal of sources

#### 1.1.4. Interworking with other devices

#### 1.1.5. Avoidance of excessive port allocation

#### 1.1.6. Simple binding of MediaStreamTrack to SDP

#### 1.1.7. Support for RTX, FEC, simulcast, layered coding

### 1.2. Terminology

### 1.3. Syntax Conventions

## 2. Solution Overview

## 3. Detailed Description

### 3.1. Bundle-Only M-Lines

### 3.2. Correlation

#### 3.2.1. Correlating RTP Sources with m-lines

##### 3.2.1.1. RTP Header Extension Correlation

##### 3.2.1.2. Payload Type Correlation

#### 3.2.2. Correlating Media Stream Tracks with m-lines

#### 3.2.3. Correlating Media Stream Tracks with RTP Sources

### 3.3. Handling of Simulcast, Forward Error Correction, and Retransmission Streams

### 3.4. Glare Minimization

#### 3.4.1. Adding a Stream

#### 3.4.2. Changing a Stream

#### 3.4.3. Removing a Stream

### 3.5. Negotiation of Stream Ordinality

### 3.6. Compatibility with Legacy uses

## 4. Examples

### 4.1. Simple example with one audio and one video

### 4.2. Multiple Videos

### 4.3. Many Videos

### 4.4. Multiple Videos with Simulcast

### 4.5. Video with Simulcast and RTX

### 4.6. Video with Simulcast and FEC

### 4.7. Video with Layered Coding