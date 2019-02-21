> Read [original](https://tools.ietf.org/html/draft-ietf-rtcweb-overview-19) / [markdown](../markdown/draft-ietf-rtcweb-overview-19.md)

---

# Overview: Real Time Protocols for Browser-based Applications

## 1. Introduction

- インターネットでリアルタイムになんかするのをずっとやってきた
- IETFとW3Cの協力でWebRTCというものが生まれ、過去を刷新するであろう
- ユースケースはRFC 7478に詳しい

## 2. Principles and Terminology

- 本文なし

### 2.1. Goals of this document

- この文書は、WebRTCの全容を説明するもの
- この文書と引用されてる仕様を読めば、WebRTC自体の実装も可能
- なので最初にコレを読んで、そこから広げていくべし

### 2.2. Relationship between API and protocol

- IETFによるプロトコル仕様と、W3CのJavaScriptのAPIの両方の理解が必要
- あとは用語説明が続く

### 2.3. On interoperability and innovation

- 互換性は単独ではありえない概念
- なので歩調あわせて実装したり仕様を検討したりしましょうね的な内容
- それがインターネットですよね

## 3. Architecture and Functionality groups

- ブラウザにはJSでRTC系のAPIを公開して、それを開発者が使う
- MediaのパスとSignalingのパスは別で、Signalingの方法は規定しない
- などなどプロトコルとしてのWebRTCのレイヤー・登場人物の紹介

## 4. Data transport

- トランスポート = データの送受信
- 最低限必要な実装は、`draft-ietf-rtcweb-transports`にあるもの

## 5. Data framing and securing

- メディアはRTPとSRTPを使う
- RTP以外にDataChannelの実装が必要
- これらに関するドラフトがいくつかある

## 6. Data formats

- 仕様としてはつながることが最優先で、データのフォーマットは二の次
- 必須のコーデックやプロファイルは、RFC 7874とRFC 7742を参照

## 7. Connection management

- SignalingにはSDPを使う
- ブラウザはWebRTCのAPIとして`ietf-rtcweb-jsep`にあるものを実装する
- ブラウザ以外は、ネットワークレイヤーのものだけ実装すればいい

## 8. Presentation and control

- 開発者がAPIをどのように使うか
- Peer Connection APIと、Media Capture APIの2つが必要

## 9. Local system support functions

- エコーキャンセラーやHW的なカメラの設定などについて
- RFC 7874の実装は必要

## 10. IANA Considerations

- IANAには関係ない

## 11. Security Considerations

- できることが増えるということは、セキュリティのリスクも増えるということ
- こういうことに気をつけなさいよ
