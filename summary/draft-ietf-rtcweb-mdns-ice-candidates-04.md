> Read [original](https://tools.ietf.org/html/draft-ietf-rtcweb-mdns-ice-candidates-04) / [markdown](../markdown/draft-ietf-rtcweb-mdns-ice-candidates-04.md)

---

# Using Multicast DNS to protect privacy when exposing ICE candidates

## 1. Introduction

- プライベートIPを露出させると、P2Pの成功率は上がる
  - しかし同時にfingerprintingの問題がある
- mDNSを使うことでローカルのプライベートIPの露出を防ぐことができる
  - 事前にこの名前とIPを変換するだけ
  - ICEの手順は今までどおり
- mDNS自体は、RFC6762を参照

## 2. Terminology

- いつもの

## 3. Description

- ICEのエージェントの挙動に沿って説明していく

### 3.1. ICE Candidate Gathering

- まずは候補収集
- ローカルIPをmDNSでどう扱うか

#### 3.1.1. Procedure

- 以下の手順に沿って処理される
- 1: 収集したIPがICEのポリシーとして、公開して良いかチェック
  - よいなら今まで通りのICEの手順へ
- 2: そのIPに対するmDNSホスト名が既に登録されているか確認
  - あるならそれをcandidateとして使う
- 3: ホスト名を生成
  - `${uuid/v4}.local`
- 4: ホスト名を登録
  - それをネットワークに周知してもよい
- 5: 将来のためにキャッシュする
- 6: IPアドレスを置き換えて、アプリケーション側に渡す
- ホスト名の登録は事前にやっておいてもよい
  - 同じ結果になるなら実装方法は任意
- mDNSに非対応の場合、そもそも`host`のcandidateを公開しない実装もあるかも
- IPv4とIPv6では異なるホスト名になる

#### 3.1.2. Implementation Guidance

- 本文なし

##### 3.1.2.1. Registration

- ホスト名の登録をネットワークに周知するのは非同期になる
- ただしアドレス自体のアプリケーションの返答は即座にする必要がある

##### 3.1.2.2. Determining Address Privacy and Server-Reflexive Candidates

- グローバルなIPについては、mDNSで保護しなくてもよい
  - 既にグローバルに公開されてるので
- ただしIPだけ見て、それがmDNSで保護されてるかどうかは判断できない
- STUNで`srflx`のアドレスを集めた時に、同じアドレスが帰ってくれば、グローバルだと判断はできる
- `srflx`の`raddr`は`0.0.0.0`/`::`で、`rport`は`9`にする

##### 3.1.2.3. Special Handling for IPv6 Addresses

- IPv6は特殊な特性なため、mDNSで保護しないという判断もあるかも

##### 3.1.2.4. mDNS Candidate Encoding

- mDNSのホスト名は、SDPの`c=`行の`connection-address`で使われる
  - ただそれが唯一の候補の場合は載せてはいけない
- アドレス: `0.0.0.0`/`::` + ポート: `9`を使う

### 3.2. ICE Candidate Processing

- 収集したcandidateの扱いについて

#### 3.2.1. Procedure

- `connection-address`の値が、`.local`で終わらない場合
- または`.`が複数含まれている場合
  - 今までどおりのICEの手順
- それ以外ならmDNSのホスト名のはず
- ホスト名でIPを解決して、以降は通常のICEの手順

#### 3.2.2. Implementation Guidance

- ホスト名を解決したときに、複数のアドレスが返ってくるかも
- これはcandidateとしても無視するべき

### 3.3. Additional Privacy Considerations

- ICE以外の部分でもプライベートなIPを保護する必要がある

#### 3.3.1. Statistics

- 統計データを残す場合も、mDNSのホスト名を使う
- `prflx`なアドレスも開示してはいけない

#### 3.3.2. Interactions With TURN Servers

- TURNにはIPを伝える必要がある
- なので自身の`relay`と、リモートの`host`はペアにしてはいけない
  - その逆は問題ない

#### 3.3.3. Generated Name Reuse

- mDNSのホスト名は、定期的にリセットされるべき
- これが永続したら、IPアドレスよりも追跡がしやすい
- そのウェブページの寿命と同じが望ましい

#### 3.3.4. Specific Browsing Contexts

- 同じデバイス上で2つのピアがP2Pすると一瞬で接続できる
- 例えば3rdパーティのコンテキストから（`iframe`とか）つながれるかも
  - そのようなコンテキストでは、mDNSの登録をすべきではない

#### 3.3.5. Network Interface Enumeration

- mDNSのホスト名の数で、ネットワークインターフェースの数がわかる
  - それもFingerprintの側面がある
- 公開するmDNSのホストの数を制限することが有効

#### 3.3.6. Monitoring of Sessions

- mDNSの登録・解除自体を監視される可能性もある
- それによって、通信してるかどうか、頻度などがわかってしまう
- これはこの仕様の範囲外

## 4. Potential Limitations

- 本文なし

### 4.1. Reduced Connectivity

- 同じネットワークに接続している場合、`host`のcandidate同士で接続できる
- mDNSを使うと、各エンドポイントがmDNSに対応していれば問題ない
  - でも対応していないと、つながらなくなってしまう
  - あまりに広域なネットワークでもつながらない可能性はある
- mDNSが失敗するとTURNを使おうとするかもしれないが、接続までの時間やコストが増える
- IPv6はmDNSで保護しないようにするなどで、これは緩和できる
- STUN+mDNSを使う環境での接続テストの統計を見ると次のようになった
  - 片側だけ有効に比べて、両側で有効な場合のICEの接続率への影響は2%ほど
  - STUNが必要になるケースは94%から97%に増加した
  - NATのヘアピンに失敗してるのが理由であろう

### 4.2. Connection Setup Latency

- mDNSのホスト解決がある分、実行に時間はかかる
- ホスト名を事前に登録していれば少しは軽減できる

### 4.3. Backward Compatibility

- 後方互換性には影響ないはず
- mDNSの名前をもらっても解決できないだけのはず
  - ただしそれがエラーになるなどICEが失敗するエンドポイントも稀にあった
- シグナリング時に受信してないホストからの接続確認を処理できない
  - おそらくこの理由によって、接続率は3%減少した

  ## 5. Examples

  - 簡単な例と少し複雑な例を紹介する

  ### 5.1. Normal Handling

  - お互いにmDNSの解決ができる場合

  ### 5.2. Peer-reflexive Candidate From Slow Signaling

  - mDNSのcandidateが届く前に、STUNがきた場合
  - それは`prflx`のcandidateとして扱われる

  ### 5.3. Peer-reflexive Candidate From Slow Resolution

  - mDNSの解決が完了する前に、STUNがきた場合
  - それも`prflx`のcandidateとして扱われる

  ### 5.4. IPv4, IPv6, and STUN handling

  - IPv4とIPv6両対応のエンドポイントどうしが通信する場合

  ## 6. Security Considerations

  - 本文なし

  ### 6.1. mDNS Message Flooding

  - この仕様を満たすためには、ブラウザにmDNSの機能が必要
    - 登録・解決
    - OS側にももちろん実装されてる必要がある
  - この実装を悪用される恐れはある
    - ページを開くだけでmDNSの登録・削除を行うとか
  - その処理にレート制限を入れるなどして対策すべき

  ### 6.2. Malicious Responses to Deny Name Registration

  - mDNSの登録を拒まれる場合
    - そのcandidateは破棄されてしまう
  - ローカルのネットワークに悪意のあるエンドポイントがいる場合は、この仕様の範囲外

  ### 6.3. Unsolicited ICE Communications

  - ICEを悪用してトラフィック攻撃に使われるかも
  - mDNSホスト名が公開されていると、その標的にされる可能性がある
  - ホスト名のフォーマットをチェックしてmDNSの解決をしないようにするなどする

  ## 7. IANA Considerations

  - IANAには関係ない
