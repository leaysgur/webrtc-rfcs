> [Read original](../md/draft-ietf-ice-trickle-21.md)

---

# Trickle ICE: Incremental Provisioning of Candidates for the Interactive Connectivity Establishment (ICE) Protocol

## 1. Introduction

- ICEの基本
  - 候補を集める
  - 交換する
  - nominatedからselectedを選ぶ
- しばしばSTUNへの問い合わせやTURNの割当など時間がかかる
  - 非同期に行われるものではあるけど
- ここではTrickleICEという手法を解説
  - 集めた候補をすぐに交換する
  - 疎通確認もすぐにやる

## 2. Terminology

- いつもの

## 3. Determining Support for Trickle ICE

- まずそもそもサポートしてるかどうか
- サポート状況がわからない場合、Half-Trickleという手法に沿ってもよい
  - Section 16.で解説
- 明示的にサポートしてないとわかったら、通常のICEにしなければならない
- SDPにICEオプションとして`trickle`と書くことでサポートしてることを明示できる

## 4. Generating the Initial ICE Description

- UIなどで指示するよりも先に、candidateを集めることもできる
  - Half-Trickleを明示していないなら
- そして集められた候補は、最初のICEの情報（ufrag/passwordなど）と一緒に送っても良い

## 5. Handling the Initial ICE Description and Generating the Initial ICE Response

- 最初のICEの情報を受け取ったら、`trickle`にオプションがあるかチェック
- 明示的なサポートがわからないなら、通常のICEを開始する
- レスポンス側も、事前にcandidateを集めておいてよい

## 6. Handling the Initial ICE Response

- ICEの役割やその後の手順は通常と同じ

## 7. Forming Check Lists

- チェックリストの作成
- 優先度による並べ替えや冗長な経路の削除も同じように
- 通常のICEだと、このチェックリストが必要になった時に既にcandidateはあるはず
  - Trickleの場合は非同期なので、初期状態は空っぽ
- チェックリストの状態はRunning

## 8. Performing Connectivity Checks

- 疎通確認のタイマーが発火したときに、対象となるチェックリストはRunningのもの
  - なのでTrickleで扱うチェックリストの状態もRunningにしておく
  - タイマーが動いて拾ったリストが空なら、それをスキップして次のリストを処理する
- チェックリストの状態を更新で、以下に合致すると状態がFailedになる
  - リスト内のペアがすべてFailed or Succeeded
  - リストにペアがない
- Trickleだとこのパターンにハマりがちなので、以下の条件を追加する
  - ローカルのcandidateの収集が終わっている
  - リモートのcandidateの収集も終わっている

## 9. Gathering and Conveying Newly Gathered Local Candidates

- STUNやTURN経由の候補は、しばしば遅れて非同期で集まる
  - それぞれ通常のICE通りに優先度やbaseやcomponentIDを計算する
- 冗長な候補の削除ももちろん行う
  - ただしTrickleの場合、優先度よりも新しいものを冗長と判断する
- そうして見つかったものがリモートに送られる
  - この間にICEがリスタートしたら、その候補は無視されるべき

## 10. Pairing Newly Gathered Local Candidates

- 集めた候補はペアにする
  - これも通常のICEと同じ
- ただしここにも条件が増える
  - 送信するまでペアにしてはいけない
  - ペアにしようとしているcomponentについて、リモートのcandidateがわかっている必要がある
- 冗長なペアを削除するときも、WaitingかFrozenのもののみ

## 11. Receiving Trickled Candidates

## 12. Inserting Trickled Candidate Pairs into a Check List

## 13. Generating an End-of-Candidates Indication

## 14. Receiving an End-of-Candidates Indication

## 15. Subsequent Exchanges and ICE Restarts

## 16. Half Trickle

## 17. Preserving Candidate Order while Trickling

## 18. Requirements for Using Protocols

## 19. IANA Considerations

## 20. Security Considerations
