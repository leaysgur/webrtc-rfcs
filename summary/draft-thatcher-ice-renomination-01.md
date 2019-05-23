> Read [original](https://tools.ietf.org/html/draft-thatcher-ice-renomination-01) / [markdown](../markdown/draft-thatcher-ice-renomination-01.md)

---

# ICE Renomination: Dynamically selecting ICE candidate pairs

## 1. Introduction

- ICEのAgentは`CONTROLLING`か`CONTROLLED`のどちらか
- `CONTROLLING`側が常にcandidateを選ぶ
  - しかし`CONTROLLED`がどのペアを選択するかはわからない
  - 通常のノミネーションでも、アグレッシブノミネーションでも
- 最初にノミネーションしたネットワークよりも、良いものが見つかることもある
  - Wi−Fiが使えるようになったりとか
  - その場合に、切り替えたくてもどうしようもない

## 2. Terminology

- いつもの

## 3. Renomination

- `a=ice-options:renomination`を追加する
- これが解釈された場合は、いつでも新しいペアをノミネーションしてよい
  - アグレッシブノミネーションを無効にして、後勝ちにできる
  - STUNのレスポンスが返ってくるまで送信する
- 解釈されない場合
  - アグレッシブノミネーションは無効
  - `CONTROLLING`側は、複数ノミネーションしてはいけない

## 4. "Nomination" attribute

- 新しいSTUNの属性に`nomination`を定義
  - 最下位3byteに24bitの整数
- `CONTROLLED`側は、この値が最大のものを常に選択する

## 5. IANA Considerations

- IANAには関係ない

## 6. Security Considerations

- TODO
