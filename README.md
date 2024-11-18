## Debug Stick v0.0.3-alpha

これは、マインクラフト Java 版にあるデバッグ棒の再現です。

## 実装済み


## 追記/情報 制作者のメモ

無駄なコードがあるかもしれない。

## 開発メモ
| ID変化系 |
| --- |
| ハーフブロック |
| 日光検知器(日照センサー) |
| リピーター |
| コンパレーター |
| かまど |
| 看板 |

| ステータスがありそうでないアイテム |
| --- |
| シュルカーボックス系 |
| 音ブロック |

| 技術不足系 |
| --- |
| チェストなどアイテムを中に入るもの |
| 文字を書くもの |

## 実装予定なし（保留）
| 種類 | 変化が無いステータス |
| :-: | --- |
| フェンスゲート | `"in_wall_bit"` |
| 壁系 |`"wall_connection_type_east"`<br>`"wall_connection_type_north"`<br>`"wall_connection_type_south"`<br>`"wall_connection_type_west"`<br>`"wall_post_bit"`|

| 保留 | ステータス |
| :-: | --- |
| 葉っぱ | `"persistent_bit"` 近くに木がなくても消滅しないか<br>`"update_bit"` 近くの木をチェックするか |
| ドロッパー<br>ディスペンサー<br>自動作業台（クラフター） | `"triggered_bit"` 起動しているかどうか |
