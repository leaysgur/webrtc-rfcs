> Read [original](https://tools.ietf.org/html/draft-ietf-mmusic-sdp-bundle-negotiation-54) / [markdown](../markdown/draft-ietf-mmusic-sdp-bundle-negotiation-54.md)

---

# Negotiating Media Multiplexing Using the SDP

## 1. Introduction

- 本文なし

### 1.1. Background

- SDPでオファー・アンサーしてセッションを確立する
- 通常は`m=`セクションごとに異なるトランスポートを使う
- これをまとめて1つのトランスポートで実現できれば、リソース効率の面で魅力的

### 1.2. BUNDLE Mechanism

- まとめられる単一のトランスポートをBUNDLEトランスポートとする
  - メディアを送受信するアドレスとポート
- SDPでBUNDLE用の属性を使う
  - `a=group:BUNDLE`を定義する
  - `m=`セクションをまとめあげる
- ICEで確定する候補は1ペアだけになる
- BUNDLEグループは複数あってもよい
- 後方互換性があるので、BUNDLEできない場合は通常通りに別々にトランスポートを使う

### 1.3. Protocol Extensions

- BUNDLEするときに使う`a=bundle-only`属性を追加する
- その他のRFCへの更新は以下
- 拒否するのではなく、`m=`行のポートに`0`を割り当てられるように
  - RFC3264
- RTCPのSDES項目に`MID`を追加
  - RFC3550
  - およびそのヘッダ拡張
- `MID`拡張のための例外を追加
  - RFC7941

## 2. Terminology

- いつもの

## 3. Conventions

- いつもの

## 4. Applicability Statement

- この仕様に関する内容は、SDPを使ってオファー・アンサーを実施するときのみ有効

## 5. SDP Grouping Framework BUNDLE Extension

- `a=group:BUNDLE`でBUNDLEする意志を表す
  - この属性自体は複数定義できる
  - ただし内包される`m=`セクションは、複数に属してはいけない
- `a=group:BUNDLE foo bar`
    - `foo`がタグ付けされた、ベースとなる`m=`セクション
    - `bar`はBUNDLEされる`bundle-only`な`m=`セクション
- オファー・アンサー手順の詳細はSection 7にて

## 6. SDP 'bundle-only' Attribute

- `a=bundle-only`属性をメディアレベルに追加
  - 値はなし
- アンサー側がBUNDLE非対応だった場合
  - 何もしなくても拒否されるように、`m=`行のポートに`0`を指定してオファーしてもよい
  - アンサー側がBUNDLE対応の場合は、`a=bundle-only`を見てそれを判別できる

## 7. SDP Offer/Answer Procedures

- BUNDLEをやるにあたってオファー・アンサーの手順がどうなるかについて
- アンサー側でもBUNDLEする意思があるときだけ成立する

### 7.1. Generic SDP Considerations

- SDPがどうなるかについて

#### 7.1.1. Connection Data (c=)

- `c=`行について
- `nettype`は`IN`になる
- `addrtype`は`IP4` or `IP6`になる

#### 7.1.2. Bandwidth (b=)

- 特になし（今まで通り）
  - draft-ietf-mmusic-sdp-mux-attributes

#### 7.1.3. Attributes (a=)

- 他の`a=`行の属性も今まで通り
- ただしBUNDLEされる`m=`セクションについての属性に以下の例外を適用する
- `bundle-only`なセクションには、`IDENTICAL`と`TRANSPORT`のカテゴリーの属性はつけてはいけない
  - `a=rtcp`とか`a=rtcp-mux`とか
  - それらは、BUNDLEするベースの`m=`セクションにつけること
- その後のオファーやアンサーでも、タグ付けされたベースの`m=`セクションにだけ、`IDENTICAL`と`TRANSPORT`の属性をつけてよい
- それ以外のカテゴリーの属性は、今まで通りつけてよい

### 7.2. Generating the Initial SDP Offer

- BUNDLEしたい最初のオファーに関して
  - `m=`行のアドレス、ポートに同じものを指定する
  - `a=group:BUNDLE`をつける
- 絶対にBUNDLEしたい場合
  - `a=bundle-only`をつけて、ポートに`0`を指定する

#### 7.2.1. Suggesting the Offerer tagged 'm=' section

- BUNDLEが受け入れられると、その`m=`行に記載のアドレス、ポートでデータが送受信される
- オファー側は、`bundle-only`の`m=`セクションをタグ付けしてはいけない

#### 7.2.2. Example: Initial SDP Offer

- BUNDLEするオファーSDPの例
- `a=group:BUNDLE foo bar`
  - `a=mid:foo`の`m=`セクションが、「タグ付けされた」`m=`セクション
  - ベースとなる`m=`セクション

### 7.3. Generating the SDP Answer

- アンサー側に関して
- BUNDLEが指定されていた時だけ、BUNDLEを指定できる
  - その後の処理は基本的にオファー側と同じ
- BUNDLEを拒否することもできる

#### 7.3.1. Answerer Selection of tagged 'm=' sections

- 以下の条件に合致するなら、同様にBUNDLEする意思を表明する
  - 同様にBUNDLEする意思があり
  - その`m=`セクションを拒否しないつもりで
  - その`m=`行のポートが`0`じゃないなら

#### 7.3.2. Moving A Media Description Out Of A BUNDLE Group

- BUNDLEしないようにしたい場合
  - `a=bundle-only`がついてる場合は拒否できない
  - オファー全体を拒否するか、オファーを再度出し直すか
- それ以外は
  - `m=`セクションに別々のアドレス・ポートを振る
  - `a=group:BUNDLE`のリストに`mid`を含めない
  - `a=bundle-only`を使わない

#### 7.3.3. Rejecting a Media Description in a BUNDLE Group

- BUNDLEを拒否する場合
  - `m=`行のポートを`0`に
  - `a=group:BUNDLE`のリストに`mid`を含めない
  - `a=bundle-only`を使わない

#### 7.3.4. Example: SDP Answer

- BUNDLEを了承するSDPの例
- `a=bundle-only`な`m=`セクションのポートは`0`になる

### 7.4. Offerer Processing of the SDP Answer

- アンサーを受け取ったら
- オファーでBUNDLEした内容から変更ないか確かめる
  - そもそも`a=group:BUNDLE`が残ってるか
  - `m=`セクションのリストがそのままか
- `a=group:BUNDLE`がない場合は、通常のアンサーとして処理する

### 7.5. Modifying the Session

- BUNDLEを使用してネゴシエーションした後、オファー・アンサーする場合
  - タグ付けする`m=`セクションを選び直しても良い
  - 新規にオファーを出すときと同じ
- タグ付けする`m=`セクションを変更する必要があるのは
  - その`m=`セクションを、BUNDLEしたくなくなったとき
  - その`m=`セクションを、disableにしたくなったとき

#### 7.5.1. Adding a Media Description to a BUNDLE group

- BUNDLEに新たな`m=`セクションを追加する場合
- 普通に追加してもいいし、それをタグ付けして使ってもいい

#### 7.5.2. Moving a Media Description Out of a BUNDLE Group

- BUNDLEから外したい場合
- 外した`m=`セクションには
  - 新しいアドレス・ポートを振る
  - `a=group:BUNDLE`のリストには含めない
  - `a=bundle-only`をつけない

#### 7.5.3. Disabling a Media Description in a BUNDLE Group

- BUNDLEしていたものをdisableにしたい場合
- `m=`行のポートを`0`に
- `a=group:BUNDLE`のリストには含めない
- `a=bundle-only`をつけない

## 8. Protocol Identification

- BUNDLEされる`m=`セクションは、同じプロトコルである必要がある
- そうでない場合、より上層のプロトコルは正しく処理される実装になってないといけない
- ここではUDP上でSTUNとDTLSとSRTPがやり取りされる場合についてだけ解説する

### 8.1. STUN, DTLS, SRTP

- STUNとDTLSとSRTPを判別する方法はある
  - RFC5764
- この仕様をサポートしているものとする
- DTLS上で流れるパケットについては、よしなに判別すること
- SRTPを流れるパケットと`m=`セクションとの紐づけは、Section 9.2にて後述

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
