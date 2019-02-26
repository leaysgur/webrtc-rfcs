> Read [original](https://tools.ietf.org/html/draft-ietf-rtcweb-sdp-11) / [markdown](../markdown/draft-ietf-rtcweb-sdp-11.md)

---

# Annotated Example SDP for WebRTC

## 1. Introduction

## 2. Terminology

## 3. SDP and the WebRTC

## 4. Offer/Answer and the WebRTC

## 5. WebRTC Session Description Examples

### 5.1. Some Conventions

### 5.2. Basic Examples

#### 5.2.1. Audio Only Session

#### 5.2.2. Audio/Video Session

##### 5.2.2.1. IPv4 audio/video session

##### 5.2.2.2. Dual Stack audio/video session

#### 5.2.3. Data Only Session

#### 5.2.4. Audio Call On Hold

#### 5.2.5. Audio with DTMF Session

#### 5.2.6. One Way Audio/Video Session - Document Camera

#### 5.2.7. Audio, Video Session with BUNDLE Support Unknown

#### 5.2.8. Audio, Video and Data Session

#### 5.2.9. Audio, Video Session with BUNDLE Unsupported

#### 5.2.10. Audio, Video BUNDLED, but Data (Not BUNDLED)

#### 5.2.11. Audio Only, Add Video to BUNDLE

### 5.3. MultiResolution, RTX, FEC Examples

#### 5.3.1. Sendonly Simulcast Session with 2 cameras and 2 encodings per camera

#### 5.3.2. Successful SVC Video Session

#### 5.3.3. Successful Simulcast Video Session with Retransmission

#### 5.3.4. Successful 1-way Simulcast Session with 2 resolutions and RTX -One resolution rejected

#### 5.3.5. Simulcast Video Session with Forward Error Correction

### 5.4. Others

#### 5.4.1. Audio Session - Voice Activity Detection

#### 5.4.2. Audio Conference - Voice Activity Detection

#### 5.4.3. Successful legacy Interop Fallback with bundle-only

#### 5.4.4. Legacy Interop with RTP/AVP profile

## 6. IANA Considerations

## 7. Security Considerations

## 8. Acknowledgments

## Appendix A. Appendix

### A.1. JSEP SDP Attributes Checklist

#### A.1.1. Common Checklist

#### A.1.2. RTP Media Description Checklist

#### A.1.3. DataChannel Media Description checklist