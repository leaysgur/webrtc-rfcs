> Read [original](https://tools.ietf.org/html/draft-ietf-mmusic-mux-exclusive-12) / [markdown](../markdown/draft-ietf-mmusic-mux-exclusive-12.md)

---

# Indicating Exclusive Support of RTP/RTCP Multiplexing using SDP

## 1. Introduction

- RFC5761で`a=rtcp-mux`を規定した
- これによって、任意でRTP/RTCPが多重化できるようになった
  - 拒否もできる
- WebRTCのような新しいアプリは、後方互換性が必要ない
- そういう環境に限っては、多重化しないことをサポートしない旨を示すことができる
- SDPのメディアレベルに`a=rtcp-mux-only`を記述する

## 2. Conventions

- いつもの

## 3. SDP rtcp-mux-only Attribute

- `a=rtcp-mux-only`をメディアレベルに追加
- オファー側でのみ記述できる
- RTPを使う場合のみ記述できる
- SSRCごとの指定 = ソースレベルの指定はできない

## 4. SDP Offer/Answer Procedures

- 本文なし

### 4.1. General

- オファー・アンサーにおける影響について

### 4.2. Generating the Initial SDP Offer

- 最初のオファーについて
- `a=rtcp-mux-only`をメディアレベルに記述する
- `a=rtcp-mux`もあわせて記述する

### 4.3. Generating the Answer

- それに対するアンサーについて
- 受け入れる場合
  - `a=rtcp-mux`をつけて返す
- 拒否する場合
  - `m=`行のポートを`0`にして返す
  - オファー自体を拒否してもいい

### 4.4. Offerer Processing of the SDP Answer

- オファー側がアンサーを処理するとき
- 受け入れられた場合は今まで通りICEをはじめる
  - RTP/RTCPは多重化して
- 拒否された場合は、おまかせ
  - 新たにオファーを再送するでもいいし
  - その際に`rtcp-mux-only`を外すとか

### 4.5. Modifying the Session

- セッション確立後の再ネゴシエーションのとき
- 過去に`rtcp-mux-only`で確立してるなら、引き続きそうするべき
- ただし途中でやめることもできる
  - 基本的には一度多重化すると決めたなら、多重化し続けるべき

## 5. Update to RFC 5761

- 本文なし

### 5.1. General

- RFC5761からの変更点について
- 多重化する場合は、RTCP用の`a=candidate`を載せない
- `a=rtcp`も載せない

### 5.2. Update to 4th paragraph of section 5.1.1

- 既に書かれた内容なので割愛

### 5.3. Update to 2nd paragraph of section 5.1.3

- 既に書かれた内容なので割愛

## 6. ICE Considerations

- 多重化することがわかってる場合
- ICEのコンポーネントは1つだけになる
  - RTP用でコンポーネントIDは`1`
- RTCPが純粋にサポートされてない場合も同じことになる
  - が、それで判断してはいけない
  - 判断はあくまで`rtcp-mux-only`でやる

## 7. Security Considerations

- セキュリティに関しては特になし

## 8. IANA Considerations

- SDPのメディアレベルに1つ追加する
  - `a=rtcp-mux-only`
