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
| `main.js` | ナビの背景、表示時のフェードイン、動画の再生制御、使い方の動画とステップ表示の同期 |
| `assets/` | アプリのリポジトリの素材から変換したもの（下記） |
| `.nojekyll` | GitHub PagesでJekyllの処理を無効にする |

## 素材の出どころと再生成

素材は [yamakentoc/PlantMoment](https://github.com/yamakentoc/PlantMoment) から変換してコピーしています（サブモジュールにはしていません）。元ファイルのパスはPlantMomentリポジトリのルートからの相対パスです。

| LPの素材 | 元ファイル | 変換後 |
|---|---|---|
| `assets/plant-story.mp4` | `PlantMoment/Resources/OnboardingPlantStory.mp4` | H.264、幅720px、音声なし（`ffmpeg -an -vf scale=720:-2 -crf 26 -movflags +faststart`） |
| `assets/day-{001,010,030,050,100}.webp` | `PlantMoment/Resources/OnboardingPlantStory.mp4` | ヒーローのPlant Storyと同じモンステラの各クリップから1フレーム（0.6・2.6・4.6・6.8・8.9秒）を書き出し、WebP、834×1112（`cwebp -q 80`） |
| `assets/howto.mp4` | シミュレータで収録（下記） | H.264、幅720px、30fps、音声なし |
| `assets/moment-t{1..6}.webp` | シミュレータのスクリーンショット（下記） | Photo Momentのプレビュー部分を切り抜き、WebP、幅720px |
| `assets/iphone17pro-frame.webp` | `PlantMoment/design/images/store-iphone17pro-*.png`（pen.devのストア画像に使われているAppleのiPhone 17 Proフレーム、1350×2760） | 画面部分（1206×2622、角丸225）を透明にし、Dynamic Islandは`store-iphone17pro-plants-en-bezel-fixed.png`（明るい画面）から島の形（x489〜861・y112〜219、内側2px）だけを切り出してレンズまで残したもの。四隅は角丸190〜225の間を黒で塗り、元の画面の色が残らないようにしている。WebP・幅900px（`cwebp -q 92 -alpha_q 100 -exact -resize 900 0`） |
| `assets/onboarding-backdrop.jpg` | `PlantMoment/PlantMoment/Assets.xcassets/OnboardingPlantList.imageset/screenshot.jpg` | ヒーローのiPhone画面（Plant Storyの再生画面）の背景。`ffmpeg -vf "scale=240:-1,gblur=sigma=10,crop=iw*0.85:ih*0.85" -q:v 4` |
| `assets/story-thumb-{001,010,030,050,100}.webp` | `PlantMoment/Assets.xcassets/OnboardingStoryVideoDay*.imageset/thumbnail.jpg` | WebP、幅180px（`cwebp -q 80 -resize 180 0`） |
| `assets/shot-{care,detail,story,plants,register}.webp` | シミュレータのスクリーンショット（下記） | WebP、幅600px（`cwebp -q 82 -resize 600 0`） |
| `assets/*-poster.jpg` | 各mp4の先頭フレーム | JPEG（`ffmpeg -frames:v 1`） |
| `assets/app-icon.png` | `design/images/AppIconDisplay.png` | PNG、256×256px（`sips -Z 256`） |
| `assets/fonts/LINESeedJP-*-subset.woff2` | [line/seed](https://github.com/line/seed) のリリース `LINESeedJP/fonts/ttf/` | WOFF2（サブセット、下記）。ライセンスは `assets/fonts/LINESeedJP-OFL.txt` |

### シミュレータでの撮影

PlantMomentのDebugビルドを `landingPage` シナリオで起動すると、写真付きの植物6株と今日のお手入れが入った状態になります。データはメモリ上だけにあり、操作は実際の画面で行います。Photo Momentのカメラには `tools/simulator-camera-bridge` で `design/images/day-100.jpg` を流します。

```sh
python3 tools/simulator-camera-bridge/plant_moment_camera_bridge.py --image design/images/day-100.jpg
SIMCTL_CHILD_PLANTMOMENT_SCENARIO=landingPage \
  xcrun simctl launch --terminate-running-process booted com.yamakentoc.PlantMoment.debug \
  -AppleLanguages "(ja)" -AppleLocale ja_JP
xcrun simctl io booted recordVideo --codec=h264 --force raw.mp4   # 操作後にCtrl+Cで終了
```

- `howto.mp4`: 植物タブから、Momentタブ →「写真を撮る」→ モンステラ → シャッター → テンプレートを切り替えて「完了」まで、続けて操作して収録します。カメラには `PlantMoment/Assets.xcassets/OnboardingWelcomeMonstera.imageset/plant.jpg` を流しています。収録した動画は可変フレームレートなので、一度 `fps=30` で書き出してから、撮影直後の読み込みと「完了」後の処理待ちを除いた3区間を `trim` と `concat` でつないでいます（`-crf 26 -movflags +faststart`）。
- `moment-t*.webp`: 編集画面で各テンプレートを選び、`xcrun simctl screenshot` で撮影します。iPhone 17（1206×2622）では `crop=1026:1282:90:345` でプレビュー部分を切り抜けます。
- `shot-care.webp` はお手入れタブ、`shot-detail.webp` はモンステラの植物画面、`shot-story.webp` はMomentタブのPlant Story、`shot-plants.webp` は植物タブ、`shot-register.webp` は植物タブの「＋」から開く登録画面です。

### フォント

[LINE Seed JP](https://github.com/line/seed)（OFL）のRegularとBoldを、`index.html` で使う文字とASCIIだけにサブセット化しています。**文言を変えたら作り直してください。**

```sh
pip3 install fonttools brotli
for w in Regular Bold; do
  python3 -m fontTools.subset <seed>/LINESeedJP/fonts/ttf/LINESeedJP-$w.ttf \
    --text-file=index.html --unicodes=U+0020-007E,U+2014,U+00A9,U+3000-303F \
    --flavor=woff2 --layout-features='*' --output-file=assets/fonts/LINESeedJP-$w-subset.woff2
done
```
