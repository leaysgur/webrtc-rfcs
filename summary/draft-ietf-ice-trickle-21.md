> Read [original](https://tools.ietf.org/html/draft-ietf-ice-trickle-21) / [markdown](../markdown/draft-ietf-ice-trickle-21.md)

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
- リストのペアは100までなので余りを捨てる

## 11. Receiving Trickled Candidates

- Trickleなcandidateは受け取り側も同じように処理する
  - ローカルのcandidateが用意できるまでペアにしないとか
- 冗長なペアを見つけたとき、リモートがprflexならそれを削除
  - 削除したペアの優先度を、残す方のペアの優先度にする
- リストのペアは100までなので余りを捨てる

## 12. Inserting Trickled Candidate Pairs into a Check List

- リストに追加されたペアがどう処理されていくか図で説明

## 13. Generating an End-of-Candidates Indication

- candidate収集の終了をどう明示するか
  - すべてのcandidateが集め終わったら
  - ICEのセッションが期限切れになったら
- なんらかの方法でそれを伝える
  - できればcontrollingから
- もちろん収集の途中でやめるのを宣言してもいい
  - その後はcandidateを収集してはいけない

## 14. Receiving an End-of-Candidates Indication

- 終了の意志を受け取ったら
  - チェックリストの状態を更新しvalidペアがないならICEは失敗

## 15. Subsequent Exchanges and ICE Restarts

- candidateをやりとりする過程で、ufragやpasswordの変化に気づくかも
- それはICEリスタートを意味する
- Trickleなセッションは、リスタート後もTrickleが有効

## 16. Half Trickle

- リモートがTrickleをサポートしてるかわからない時に使う
- controlling側は、Trickleではなく普通にcandidateを集めてから送る
  - 全てではなく一部のcandidate
  - そのときにTrickleをサポートしてると伝えられる
  - リモートはそれを見てTrickleすることができる
- Halfだとしても、UXの改善になる

## 17. Preserving Candidate Order while Trickling

- Trickleだとローカルとリモートでの疎通確認が必ずしも同期で行われない
  - だいたいのタイミング的な意味で
- candidateを適切に並べ替えることで、ある程度そこをsyncできる
  - componentIDの小さい順に

## 18. Requirements for Using Protocols

- Trickle ICEを実現するためにプロトコルに求められること
  - サポート状況の通知
  - candidateを逐次伝える仕組み
  - 送信順の保証など

## 19. IANA Considerations

- 新しいICEオプションを追加した
- `trickle`

## 20. Security Considerations

- ICEでのセキュリティへの懸念を引き継ぐ
