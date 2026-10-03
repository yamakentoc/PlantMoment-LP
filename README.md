# Plant Moment LP

iOSアプリ [Plant Moment](https://apps.apple.com/jp/app/id6813776052) のランディングページです。ビルド不要の静的サイト（HTML / CSS / JavaScriptのみ、外部ライブラリなし）で、GitHub Pagesでリポジトリのルートをそのまま公開します。

```sh
python3 -m http.server 8080   # http://localhost:8080
```

## 構成

| パス | 内容 |
|---|---|
| `index.html` | ページ本体（日本語） |
| `styles.css` | スタイル |
| `main.js` | スクロール連動の演出（DAYカウンタ、固定表示での画面切り替え、Photo Momentの縮小、動画の再生制御） |
| `assets/` | アプリのリポジトリの素材から変換したもの（下記） |
| `.nojekyll` | GitHub PagesでJekyllの処理を無効にする |

## 素材の出どころと再生成

素材は [yamakentoc/PlantMoment](https://github.com/yamakentoc/PlantMoment) から変換してコピーしています（サブモジュールにはしていません）。以下のパスはPlantMomentリポジトリのルートからの相対パスです。

変換後のサイズと形式を表にしています。コマンドの品質値は目安です。

| LPの素材 | 元ファイル | 変換後 |
|---|---|---|
| `assets/day-{001,010,030,050,100}.webp` | `design/images/day-*.jpg` | WebP、幅1120px（例: `cwebp -q 80 -resize 1120 0`） |
| `assets/phone-{plants,plant-detail,plant-story,photo-moment-onboarding}.webp` | `design/images/store-iphone17pro-*.png` | WebP、幅900px |
| `assets/photo-moment.webp` | `design/images/onboarding-photo-moment.jpg` | WebP、幅900px |
| `assets/plant-{monstera,pachira,gajumaru,sansevieria}.webp` | `design/images/onboarding-plant-grid/*.png` | WebP、700×700px |
| `assets/app-icon.png` | `design/images/AppIconDisplay.png` | PNG、256×256px（`sips -Z 256`） |
| `assets/plant-story.mp4` | `PlantMoment/Resources/OnboardingPlantStory.mp4` | H.264、幅720px、音声なし（`ffmpeg -an -vf scale=720:-2 -crf 26 -movflags +faststart`） |
| `assets/screen-{list,detail,photo}.mp4` | シミュレータで収録（下記） | H.264、幅600px、音声なし（`ffmpeg -an -vf scale=600:-2 -c:v libx264 -crf 27 -pix_fmt yuv420p -movflags +faststart`） |
| `assets/*-poster.jpg` | 各mp4のフレーム | JPEG（`ffmpeg -frames:v 1`） |
| `assets/fonts/*.woff2` | `PlantMoment/Resources/Fonts/` | WOFF2。ライセンスは同じフォルダの `*-OFL.txt` |

### iPhone画面の動画

PlantMomentのDebugビルドをシミュレータに入れ、撮影用の画面を起動して収録します。この画面にはサンプルデータが表示されます。

```sh
SIMCTL_CHILD_PLANTMOMENT_SCREENSHOT=plantList SIMCTL_CHILD_PLANTMOMENT_SCENARIO=emptyHome \
  xcrun simctl launch --terminate-running-process booted com.yamakentoc.PlantMoment.debug \
  -AppleLanguages "(ja)" -AppleLocale ja_JP
xcrun simctl io booted recordVideo --codec=h264 --force list.mp4   # 操作後にCtrl+Cで終了
```

`PLANTMOMENT_SCREENSHOT` には `plantList`（植物一覧）、`plantDetail`（お手入れの詳細）、`photoMoment`（テンプレートの切り替え）を指定します。

### 見出しのフォント

Noto Serif JPは容量が大きい（約6MB）ため、`index.html` で使う文字だけにサブセット化しています。**見出しの文言を変えたら作り直してください。**

```sh
pip3 install fonttools brotli
python3 -m fontTools.subset <PlantMoment>/PlantMoment/Resources/Fonts/NotoSerifJP-SemiBold.otf \
  --text-file=index.html --flavor=woff2 --layout-features='*' \
  --output-file=assets/fonts/NotoSerifJP-SemiBold-subset.woff2
```
