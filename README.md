# Plant Moment LP

iOSアプリ [Plant Moment](https://apps.apple.com/jp/app/id6813776052) のランディングページです。ビルドの要らない静的サイトです（HTML / CSS / JavaScriptだけで、外部ライブラリは使っていません）。GitHub Pagesで、リポジトリのルートをそのまま公開しています。

- 日本語: https://yamakentoc.github.io/PlantMoment-LP/
- English: https://yamakentoc.github.io/PlantMoment-LP/en/

```sh
python3 -m http.server 8080   # http://localhost:8080
```

## 構成

| パス | 内容 |
|---|---|
| `index.html` | ページ本体（日本語） |
| `en/index.html` | ページ本体（英語）。`../styles.css` と `../main.js` を共有する |
| `styles.css` | スタイル |
| `main.js` | ナビの背景、表示時のフェードイン、動画の再生制御、使い方の動画とステップ表示の同期 |
| `assets/` | 画像・動画・フォント。英語版の画面素材は `assets/en/` |
| `.nojekyll` | GitHub PagesでJekyllの処理を無効にする |

## フォント

[LINE Seed JP](https://github.com/line/seed)（OFL）のRegularとBoldを、ページで使う文字とASCIIだけにサブセット化しています。ライセンスは `assets/fonts/LINESeedJP-OFL.txt` です。**文言を変えたら作り直してください。**

```sh
pip3 install fonttools brotli
for w in Regular Bold; do
  python3 -m fontTools.subset <seed>/LINESeedJP/fonts/ttf/LINESeedJP-$w.ttf \
    --text-file=<(cat index.html en/index.html) --unicodes=U+0020-007E,U+2014,U+2018-201D,U+00A9,U+3000-303F \
    --flavor=woff2 --layout-features='*' --output-file=assets/fonts/LINESeedJP-$w-subset.woff2
done
```
