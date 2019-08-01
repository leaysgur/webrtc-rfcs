> Read [original](https://tools.ietf.org/html/draft-ietf-rtcweb-security-12) / [markdown](../markdown/draft-ietf-rtcweb-security-12.md)

---

# Security Considerations for WebRTC

## 1. Introduction

- WebRTCを使った一般的なユースケースでは、Webサーバーを介してセットアップを行う
- WebRTCを使うためのJavaScriptはブラウザに実装されているが、それをコールするのはサーバーから渡されるスクリプトである
- 一般的なこれまでのVoIPのシステムとは異なり、新たなセキュリティリスクが伴う
  - もしかしたら、ページを表示しただけでどこかに通話が開始され、録画されたりするかも
  - DoS攻撃に利用されることもありうる

## 2. Terminology

- いつもの

## 3. The Browser Threat Model

- ブラウザはユーザーを保護する責務がある
- もし悪意のある攻撃者に誘導されてページを閲覧したとしても、安全であることが重要
- WebRTCについても同様に要件を満たす必要がある
- HTMLもJSも、ブラウザのSandbox内で実行され、そのコンピュータに対しては隔離されてる
- Web攻撃者とネットワーク攻撃者がいる
  - ネットワーク攻撃者については、RFC3552

### 3.1. Access to Local Resources

- ブラウザはローカルのリソース（ファイルやカメラなど）にアクセスできる
  - しかしWebサーバーからはアクセスさせない
  - ファイルアップロードもユーザーが明示的にファイルを選択する必要がある
- Flashも、カメラやマイクへのアクセスには許可が必要
- なんらかの実行ファイルも、ダウンロードはできても実行はされない

### 3.2. Same-Origin Policy

- ブラウザからは他のサーバーへのアクセスができる
  - `XHR`などで
- ただしそれにもSame-Origin Policyの制約がかかる
- JavaScriptの変数の参照も、オリジンをまたいでおこなうことはできない

### 3.3. Bypassing SOP: CORS, WebSockets, and consent to communicate

- SOPは堅牢であるが、不便なこともある
  - 複数のAPIサービスのマッシュアップなど
- そのために`CORS`の仕様がW3Cにはある
  - Cross-Origin Resource Sharing
- CROSS-PROTOCOL攻撃には注意が必要

## 4. Security for WebRTC Applications

- 本文なし

### 4.1. Access to Local Devices

- ユーザーの同意なしに、通話を開始してはいけない
- ここでいうユーザーの同意とはなにか
  - どのメディアを送るのか
  - 誰に送ろうとしているのか
- ローカルデバイス利用への同意は、それが送信されることへの同意にもなり得る
- HTTPSなどで暗号化された経路であっても、同意は必要
  - デバイスに対するプライバシー上の同意
  - ネットワークにトラフィックを送信することへの同意

#### 4.1.1. Threats from Screen Sharing

- カメラやマイクだけでなく、画面共有についても考慮が必要
  - カメラやマイクよりもシビアな問題
- 思った以上にシェアされてしまう可能性がある
  - とつぜんの通知であったり、共有を止め忘れたり
- SOPでそのページの内容を見ることができなかったのに、画面共有ならそれが見れてしまう
  - パスワードやトークンなどを写し取られてしまったらどうする

#### 4.1.2. Calling Scenarios and User Expectations

- 通話に関しては多様なパターンがあって、それぞれ一様に同意を得ることはできない

##### 4.1.2.1. Dedicated Calling Services

- 特定のサイトで不特定多数と話すパターン
- 長い期間、カメラやマイクへのアクセスを許可することになる
  - 通話しながらゲームができるとか
- 多くの異なる人と話せる場合は、誰と話しているのかがわかる必要がある

##### 4.1.2.2. Calling the Site You're On

- ショッピングサイトなどにある「担当者と話す」のパターン
- こちらから話したい場合には同意をする
- ただしそれはいつでも通話をよこしても良いという意味ではないはず
- そのサイトがマイクやカメラを利用していることを表示するUIも必要

#### 4.1.3. Origin-Based Security

- 前述の通り、ブラウザのSandboxはオリジンごとである
- たった1度の通話で許可したことを、未来永劫の許可と捉えられるわけにはいかない
  - そこをケアするためにはいくつか同意に区分が必要
- 3つの区分
  - 個人の同意: 通話ごとに許可を
  - 通話相手に対する同意
  - 通話内容が暗号化されることについての同意
- UIを出すだけでいい話ではない
  - ユーザーが何も考えずにOKを押すこともある
- 通話相手への同意は、悪意あるサイトの場合に嘘かもしれない
  - 通話相手を識別するなにかがあれば
  - draft-ietf-rtcweb-security-arch でも言及がある

#### 4.1.4. Security Properties of the Calling Page

- オリジンによるセキュリティの担保は、Web攻撃者には有効
- ただしWebRTCではネットワーク攻撃者についても考慮する必要がある
- HTTPのページで許可をしたあとに、脆弱なネットワークで攻撃されるシナリオ
  - HTTPコネクションを差し替えられて、異なるサイトでも許可したことにされてしまう
- 脆弱なネットワークから離れたあとも影響され続ける

### 4.2. Communications Consent Verification

- Webアプリから無制限にネットワークアクセスはできない
  - これができてしまったら、攻撃プラットフォームに使われてしまう
- トラフィック送信の同意をするためのハンドシェイク以外のトラフィックは許可なく送られてはいけない
- ただし帯域の過剰仕様を防げるわけではない
  - WebRTCを使えば同意なしにトラフィックを送信して帯域を圧迫もできる
- よって適切な輻輳制御がWebRTCプロトコルに実装されている必要がある

#### 4.2.1. ICE

- 同意を得るにはハンドシェイクが必要で、ICEにもその仕組みがある
- 安全にハンドシェイクをするために、応答を偽造されないための仕組みが必要
  - 例えばICEの場合、STUNのトランザクションIDは必ずブラウザが生成する
- トラフィックが流れる間ずっと、受信することを希望していることを確認する仕組みも必要
  - ICEの場合はそれがRFC7675

#### 4.2.2. Masking

- TCPが使われる場合は、WebSocketのようにマスキングが必要
- DTLS上ではマスキングは不要
- TURN TCPでのSRTPパケットは、WebAudioと緻密なタイミング制御によって制御できる

#### 4.2.3. Backward Compatibility

- ICEが使えないクライアントとの互換性
- 攻撃者が偽造できないなんらかの値を含めてやりとりする必要がある
  - ICEを使わずにSTUNをやり取りする場合
  - RTCPを暗黙的に到達確認に使う場合
- WebRTCはICEを使うものなので、STUNだけを使ってもユーザー名とパスワードを検証できない
- RTCPを使う場合も、そもそもRTCPがサポートされてないこともあるのでダメ
- 他にあるとすればICE-Liteの実装のような場合

#### 4.2.4. IP Location Privacy

- ICEで経路を送ると、IPアドレスがわかる
- `srflx`なアドレスは地理的な情報をも含む可能性がある
- TURNを使ってそういった情報を秘匿したいと思うかもしれない
- VPNを介して接続していても隠しきれない可能性もある

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

- この文書自体がセキュリティに関するものであった
