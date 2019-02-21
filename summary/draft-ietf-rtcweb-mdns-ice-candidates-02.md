> Read [original](https://tools.ietf.org/html/draft-ietf-rtcweb-mdns-ice-candidates-02) / [markdown](../markdown/draft-ietf-rtcweb-mdns-ice-candidates-02.md)

---

# Using Multicast DNS to protect privacy when exposing ICE candidates

## 1. Introduction

- プライベートIPを露出させると、P2Pの成功率は上がる
- しかし同時にfingerprintingの問題もある
- mDNSを使うことでローカルのプライベートIPの露出を防ぐことができる
  - 事前にこの名前とIPを変換するだけ
  - ICEの手順は今までどおり
- mDNS自体は、RFC6762を参照

## 2. Terminology

- いつもの

## 3. Principle

- ICEの挙動をおさらいする
- ICEエージェントが実装されてる前提ですすめる

### 3.1. ICE Candidate Gathering

- type: hostのcandidateはこう扱われる
  - 名前解決ができるならその名前を使う
  - ないならホスト名を作って登録する
    - uuid-v4
    - `.local`
  - 登録に失敗したら、そのcandidateは使わない
  - 登録したものはキャッシュしておく
- この処理は前もってやっておいてもいい
  - 候補収集のタイミングより先に
- mDNSがそもそも利用できるかどうかも事前に調べていい
- mDNSの名前で引いた`srflx`な候補
  - raddrは`0.0.0.0`
  - rportも`0`

### 3.2. ICE Candidate Processing

- リモートから受け取ったcandidateはこう扱われる
- `.local`で終わらない、`.`を1つ以上含む（普通のIPアドレス）場合
  - 今までどおりに処理する
- mDNSな名前だった場合、名前解決する
  - 解決できなかったら、candidateを使わない
- 場合によっては複数のIPが解決できるかもしれない
  - 最初のIPv6もしくは最初のIPv4アドレスを選ぶ

## 4. Examples

- mDNSを使ったcandidateが交換される例
- STUNの疎通確認がmDNSの登録より先になると、`prflx`の候補が取れるかも

## 5. Privacy Considerations

- この仕組の目的は、プライベートIPを隠すこと
- そのために気をつけるべきポイント

### 5.1. Statistics

- 統計情報にも露出させてはいけない
- 別のシグナリングでそのIP・ポートを知っていない限り、`prflx`でも露出させてはいけない

### 5.2. Interactions With TURN Servers

- TURNにもIPとポートを知られてはいけない
- リモートがmDNSのcandidateと、ローカルのrelayのcandidateはペアにしてはいけない
- 逆は問題ないし、TURNが使えないわけではない

### 5.3. Generated Names Reuse

- 登録される名前は期限付きであるべき

### 5.4. Specific Browsing Contexts

- 同じデバイスでこれらの処理が実行される可能性がある
  - そして悪意のあるツールかもしれない
- よって、3rdパーティのオリジンなどではmDNSの登録をすべきではない
- 0に近い待ち時間でWebRTC接続が成されたなら、それは同一デバイスである可能性が高い

## 6. Security Considerations

- 本文なし

### 6.1. mDNS Message Flooding

- mDNSを登録・解決・削除できる機能が必要
  - おそらくOSレベルの機能になる
- 悪意あるWebアプリは、ローカルネットワークにmDSNのメッセージを氾濫させるかも
  - 登録と削除を繰り返すとか
  - 雑なcandidateを作って登録するとか
- ブラウザ実装者は、そのあたりの仕組みを濫用されないように

### 6.2. Malicious Responses to Deny Name Registration

- 悪意ある名前解決が行われる可能性もある
  - それはcandidateを使わない結果に終わるはず
- 名前登録の際にprobingをスキップすれば回避できる
  - ただ別のアプローチで同じ攻撃ができる
- これは仕様の範囲外

### 6.3. Monitoring of Sessions

- mDNSの操作が盗み見られている可能性
- 同一ネットワーク内でのP2Pしてることが知られる

## 7. IANA Considerations

- IANAは関係なし

## 8. Specification Requirements

- SDPのconnection-addressにmDNSでの名前がでる
- ICEの候補収集のときに、mDNSへの登録が必要になる
- デフォルトがMode3になる w/ mDNS
  - draft-ietf-rtcweb-ip-handling
