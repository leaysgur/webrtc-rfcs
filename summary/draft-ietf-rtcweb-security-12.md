> Read [original](https://tools.ietf.org/html/draft-ietf-rtcweb-security-12) / [markdown](../markdown/draft-ietf-rtcweb-security-12.md)

---

# Security Considerations for WebRTC

## 1. Introduction

## 2. Terminology

## 3. The Browser Threat Model

### 3.1. Access to Local Resources

### 3.2. Same-Origin Policy

### 3.3. Bypassing SOP: CORS, WebSockets, and consent to communicate

## 4. Security for WebRTC Applications

### 4.1. Access to Local Devices

#### 4.1.1. Threats from Screen Sharing

#### 4.1.2. Calling Scenarios and User Expectations

##### 4.1.2.1. Dedicated Calling Services

##### 4.1.2.2. Calling the Site You're On

#### 4.1.3. Origin-Based Security

#### 4.1.4. Security Properties of the Calling Page

### 4.2. Communications Consent Verification

#### 4.2.1. ICE

#### 4.2.2. Masking

#### 4.2.3. Backward Compatibility

#### 4.2.4. IP Location Privacy

### 4.3. Communications Security

#### 4.3.1. Protecting Against Retrospective Compromise

#### 4.3.2. Protecting Against During-Call Attack

##### 4.3.2.1. Key Continuity

##### 4.3.2.2. Short Authentication Strings

##### 4.3.2.3. Third Party Identity

##### 4.3.2.4. Page Access to Media

#### 4.3.3. Malicious Peers

### 4.4. Privacy Considerations

#### 4.4.1. Correlation of Anonymous Calls

#### 4.4.2. Browser Fingerprinting

## 5. Security Considerations