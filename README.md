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

| LPの素材 | 元ファイル | 変換方法 |
|---|---|---|
| `assets/day-{001,010,030,050,100}.webp` | `design/images/day-*.jpg` | `cwebp -q 80 -resize 1120 0` |
| `assets/phone-{plants,plant-detail,plant-story,photo-moment-onboarding}.webp` | `design/images/store-iphone17pro-*.png` | `cwebp -q 85 -alpha_q 100 -resize 900 0` |
| `assets/photo-moment.webp` | `design/images/onboarding-photo-moment.jpg` | `cwebp -q 85 -resize 900 0` |
| `assets/plant-*.webp` | `design/images/onboarding-plant-grid/*.png` | `cwebp -q 80 -resize 700 0` |
| `assets/app-icon.png` | `design/images/AppIconDisplay.png` | `sips -Z 256` |
| `assets/plant-story.mp4` | `PlantMoment/Resources/OnboardingPlantStory.mp4` | `ffmpeg -an -vf scale=720:-2 -c:v libx264 -crf 26 -pix_fmt yuv420p -movflags +faststart` |
| `assets/screen-{list,detail,photo}.mp4` | シミュレータで収録（下記） | `ffmpeg -ss 0.4 -an -vf "fps=30,scale=600:-2" -c:v libx264 -crf 27 -pix_fmt yuv420p -movflags +faststart` |
| `assets/*-poster.jpg` | 各mp4の先頭付近のフレーム | `ffmpeg -ss 0.5 -frames:v 1 -q:v 5` |
| `assets/fonts/*.woff2` | `PlantMoment/Resources/Fonts/` | `python3 -m fontTools.ttLib.woff2 compress`（ライセンスは同じフォルダの `*-OFL.txt`） |

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
