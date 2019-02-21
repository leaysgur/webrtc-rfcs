> [Read original](https://tools.ietf.org/html/draft-ietf-rtcweb-ip-handling-11)
> [Read markdown](../markdown/draft-ietf-rtcweb-ip-handling-11.md)

---

# WebRTC IP Address Handling Requirements

## 1. Introduction

- WebRTCはP2Pできるのがミソ
- ただしP2Pのために集めたIPアドレスの扱いに注意
- そのあたりについて書いた文書

## 2. Terminology

- いつものやつ

## 3. Problem Statement

- ICEで集めたIPの組が見える
- それを見るとわかることがいくつかある
- 懸念されるパターンが3つ紹介されてる
  - VPN使ってるけどばれちゃう
  - NATの向こうのプライベートなIPも
  - 企業FWとかProxyの向こう側のIPも

## 4. Goals

- パフォーマンスとプライバシーどちらも考慮した方法論を模索したい
- そのためのフレームワークを検討する

## 5. Detailed Design

- 本文なし

### 5.1. Principles

- 4つの原則を紹介
  - HTTPが流れるのと同じインターフェースを使う（＝特殊なことはしない）
  - できればP2Pでやる、余計な中継をしない
  - プライベートなローカルIPは収集しない
  - Proxyを介さない

### 5.2. Modes and Recommendations

- パフォーマンスとプライバシーの兼ね合いで、4つのモード（落とし所）を考えた
  - 全収集
  - TURN+ローカルアドレス
  - TURN強制
  - Proxy強制
- 下に行くほどキツい
- 全収集する場合はもちろんユーザー確認したほうがよい

## 6. Implementation Guidance

- これらをどう実装するかの話

### 6.1. Ensuring Normal Routing

- ソケットを`0.0.0.0`とか`::`にする
- OSに任せる
- STUNもTURNも普通に動くはず

### 6.2. Determining Host Candidates

- Webのホストコンポーネントからアドレスを得る
- そうすればパケットをNWに送らずにアドレスを得られる

## 7. Application Guidance

- TURNudp/tcpどちらでも動くようにして公開しておくべし
- hostのcanidateがない場合、Mode3か4になる
