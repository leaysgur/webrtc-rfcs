> Read [original](https://tools.ietf.org/html/draft-roach-mmusic-unified-plan-00) / [markdown](../markdown/draft-roach-mmusic-unified-plan-00.md)

---

# A Unified Plan for Using SDP with Large Numbers of Media Flows

## 1. Introduction

- 昨今のRTC技術では、たくさんのストリームをやり取りする
- たとえばカンファレンス
  - メインのストリームに加えて、参加者全員分のサムネイルのストリーム
  - もしそれが複数の解像度をサポートしていたら・・？
  - FECやRTXを有効にしていたら・・？
  - その数はゆうに30を越えるだろう
- SDPはメディアレベルにセッション情報（ポート、ICE candidate）が必要なので
  - ストリームが増えるとそれも増える
  - STUNのバインディングポートもそれだけ増えてリソースを圧迫する
- そんな場合にSDPをどうするかについて述べたのがこの仕様
  - 方針としては、出来る限りリソースを節約するように

### 1.1. Design Goals

- 需要はいろいろある
- 以下のゴールを設定する

#### 1.1.1. Support for a large number of arbitrary sources

- 大規模なカンファレンス
- それぞれの環境によって、求めるものは異なるはず
  - 高解像度を重視したいとか
  - 低解像度でいいからサムネイルが欲しいとか
  - スライドも見たいとか
- `large`とか`thumbnail`とかカテゴリを任意に分けてそのグループごとに配信するとかもできる

#### 1.1.2. Support for fine-grained receiver control of sources

- 受信側が様々な要求を出してストリームを表示するためには、それを要求できる仕組みが必要
- そしてその条件に対してベストエフォートで配信側が対応する
- こうしたやり取りはAPIとして公開されるべき

#### 1.1.3. Glareless addition and removal of sources

- たくさんのストリームが追加され削除される
- そのときにSDPをどう修正していくかに注意が必要
- シグナリングでグレアを起こさないためにも

#### 1.1.4. Interworking with other devices

- 環境によっては、この仕様にあるテクニックが使えないこともあるだろう
- その場合は単一の映像と音声だけなど、もっともシンプルな形で配信する

#### 1.1.5. Avoidance of excessive port allocation

- たくさんストリームがあるからといって、たくさんポートを使わないようにしたい
- ポートの数と通信の成功率は比例しない実験結果がある
- SDPのBUNDLEはここでも有効である

#### 1.1.6. Simple binding of MediaStreamTrack to SDP

- ストリームは`MediaStreamTrack`から成る
- この`MediaStreamTrack`はSDPの中で認識できるようにする必要がある

#### 1.1.7. Support for RTX, FEC, simulcast, layered coding

- RTXやFECもサポートする
- simulcastなども同じく
- これらのテクニックを使う・使わないはユーザーが選べるべき

### 1.2. Terminology

- いつもの

### 1.3. Syntax Conventions

- この仕様に記載のあるSDPのサンプルの読み方
  - 改行は見やすさのためとか
  - コメントはコメントだとか

## 2. Solution Overview

- 概要は次のとおり
- `MediaStreamTrack`ごとに`m=`セクションを設ける
- 各`m=`セクションは`a=ssrc`でRTPパケットと紐付けられる
- おなじく`a=msid`をもち`MediaStream`および`MediaStreamTrack`と紐付けられる
- BUNDLEをリソース節約のために使う
- オファー・アンサーは`m=`行ごとに対処する
  - 既にアクティブなストリームへの影響を減らす
  - すべての`m=`行に`a=mid`を必要とする
- BUNDLEされる`m=`行は、それぞれ同じ属性を含める必要がある
  - ここで`IDENTICAL`と書かれているもの
  - draft-ietf-mmusic-sdp-mux-attributes-17

## 3. Detailed Description

- 本文なし

### 3.1. Bundle-Only M-Lines

- 基本的にBUNDLEしていく
- 最初の`m=`だけ通常通り
- ほかの`m=`は、
  - ポートを`0`にする
  - `a=bundle-only`をつける
- 互換性のないエンドポイントは、最初の`m=`以外を拒否するはず

### 3.2. Correlation

- 以下3つの相関関係について
- `m=`行
- `MediaStreamTrack`
- RTPのソース

#### 3.2.1. Correlating RTP Sources with m-lines

- 単一のトランスポートで複数のストリームを送る
- SSRCを使ってそれらを識別する
  - `a=ssrc`をSDPに含めれば基本的にはOK
- しかし3パターンの例外がある
  - セッション確立中に、新たなオファーを発行する場合
  - 既存のSSRCを変更する場合
  - SDPにSSRCを載せることができないレガシー環境の場合

##### 3.2.1.1. RTP Header Extension Correlation

- RTPヘッダ拡張の関連付けについて
- `m=`セクションごとに、`a=extmap`で定義する

##### 3.2.1.2. Payload Type Correlation

- RTPヘッダ拡張をサポートしていないが、BUNDLEは対応したい相手の場合
- 推奨はしないが、ペイロードタイプを利用することでも相関付けられる
  - 2つの動画を送る際、それぞれ同じコーデックでも、異なるペイロードタイプにする
  - 使えるペイロードタイプの番号についての詳細は、RFC3551とRFC5761にて

#### 3.2.2. Correlating Media Stream Tracks with m-lines

- `m=`セクションごとに`a=msid`をつけることで`MediaStreamTrack`を相関付ける

#### 3.2.3. Correlating Media Stream Tracks with RTP Sources

- `MediaStreamTrack`は、RTPソースと相関付けられる
- オファーを発行する時点で`MediaStreamTrack`と`m=`行がペアになる
- `m=`行とRTPソース = SSRCはSection 3.2.1.の通り

### 3.3. Handling of Simulcast, Forward Error Correction, and Retransmission Streams

- サイマルキャストについて
  - 単一の入力ソースを異なる解像度やFPSに分けること
- FECとRTXはどちらもパケロスに対する技術
  - ペイロードタイプとSSRC値はそれぞれで異なる
  - `a=ssrc-group:FID`でグルーピングされる
- サイマルキャスト
  - `a=ssrc`行に`imageattr`属性をさらに付与する
  - `a=ssrc-group:SIMULCAST`

### 3.4. Glare Minimization

#### 3.4.1. Adding a Stream

#### 3.4.2. Changing a Stream

#### 3.4.3. Removing a Stream

### 3.5. Negotiation of Stream Ordinality

### 3.6. Compatibility with Legacy uses

## 4. Examples

- ユースケース別にSDPのサンプルを載せる
- またも仕様に準拠したSDPではなく読みやすさを優先してあるよ

### 4.1. Simple example with one audio and one video

### 4.2. Multiple Videos

### 4.3. Many Videos

### 4.4. Multiple Videos with Simulcast

### 4.5. Video with Simulcast and RTX

### 4.6. Video with Simulcast and FEC

### 4.7. Video with Layered Coding
