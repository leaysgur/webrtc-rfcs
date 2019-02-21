> Read [original](https://tools.ietf.org/html/draft-ietf-rtcweb-transports-17) / [markdown](../markdown/draft-ietf-rtcweb-transports-17.md)

---

# Transports for WebRTC

## 1. Introduction

- WebRTCはプロトコルの集合体である
- データのトランスポートに関して解説する
- 実装の参考にするためにも明文化していく

## 2. Requirements language

- いつもの

## 3. Transport and Middlebox specification

- 本文なし

### 3.1. System-provided interfaces

- UDPとTCPのIPv4/IPv6サポートが必要
- 自分で実装しないといけないかもしれないのが以下
  - TURN
  - STUN
  - ICE
  - TLS
  - DTLS

### 3.2. Ability to use IPv4 and IPv6

- IPv4とIPv6のサポートは必須
- 相互接続はHappy Eyeballsを参考に
  - ietf-mmusic-ice-dualstack-fairness

### 3.3. Usage of temporary IPv6 addresses

- IPv6のアドレスはtemporaryなアドレスを優先
- ただしICEは全部集めるので手動で破棄するなどしたい
  - プライバシーのために
- temporaryなアドレスでも、deprecatedとマークされたら無視してよい

### 3.4. Middle box related functions

- ICEはライトではなく完全実装が必須
- STUN/TURN利用は設定できるようにする必要がある
- UDPが使えない環境のために、TURN/TCPのサポートも必要
  - TURNではIPv6ももちろん使えるように
- ICEはTCPもcandidateとして集める
- STUNの`ALTERNATE-SERVER`も対応必須

### 3.5. Transport protocols implemented

- メディアの送信はSRTP
  - DTLS-SRTPで鍵交換
- データの送信はSCTP over DTLS over ICE
  - SCTPのDNATA拡張もサポート必須
- DTLSとRTPはmultiplexする
  - DTLSを流れるパケットはすべてSCTP

## 4. Media Prioritization

- メディアの送信をmedia flowという（データはdata flow）
- flowには優先度がある
  - very-low, low, medium, high

### 4.1. Local prioritization

- パケットが送られる前に、ローカルの優先度が設定される
- 優先度に差があると輻輳制御下で2倍の転送効率の差になる
  - highはvery-lowの8倍
- かといってストリームごとに輻輳制御をして協調せよといってるわけではない

### 4.2. Usage of Quality of Service - DSCP and Multiplexing

- パケットが送られるときDSCP値がセットされるかもしれない
- QoSのためになんらかの取り組みをすべき
  - 実装依存ではあるが、その際にDSCPを利用しないようにするかも
- SCTP上は単一のDSCPコードポイント
  - TCPを使う場合も同じ
- DSCPを使わずにQoSを担保するやり方もいろいろある
