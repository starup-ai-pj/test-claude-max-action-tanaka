# macOS Font Setup Guide for DXF to PNG Converter

Mac環境でDXF→PNG変換時の日本語フォント設定ガイド

## 🚨 macOS固有の問題と解決策

### 問題点

1. **デフォルトフォントの制限**
   - matplotlibのデフォルトフォントは日本語非対応
   - macOSのシステムフォントへのアクセスが制限的

2. **フォントパスの複雑性**
   - macOSは複数のフォントディレクトリを使用
   - アプリケーション固有のフォントが分散

3. **権限の問題**
   - システムフォントディレクトリへの読み取り権限
   - サンドボックス環境での制限

## ✅ 解決方法

### 方法1: Homebrewでフォントをインストール（推奨）

```bash
# Homebrewがインストールされていない場合
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Noto CJKフォントをインストール
brew tap homebrew/cask-fonts
brew install --cask font-noto-sans-cjk-jp
brew install --cask font-noto-serif-cjk-jp

# その他の日本語フォント
brew install --cask font-source-han-sans
brew install --cask font-source-han-serif
```

### 方法2: macOS標準フォントを活用

macOSには以下の日本語フォントが標準搭載されています：

- **Hiragino Sans** (ヒラギノ角ゴ)
- **Hiragino Kaku Gothic Pro**
- **Yu Gothic** (游ゴシック)
- **Osaka**

これらを使用するには、スクリプトが自動検出します。

### 方法3: Microsoft Officeフォントを利用

Microsoft Officeがインストールされている場合：

```python
# 利用可能なフォント
- MS Gothic (ＭＳ ゴシック)
- MS Mincho (ＭＳ 明朝)
- Meiryo (メイリオ)
- Yu Mincho (游明朝)
```

### 方法4: 手動でフォントをインストール

1. [Google Noto Fonts](https://www.google.com/get/noto/)からダウンロード
2. ダウンロードしたフォントファイルをダブルクリック
3. Font Bookで「インストール」をクリック

## 🛠️ トラブルシューティング

### フォントが認識されない場合

1. **フォントキャッシュをクリア**
   ```bash
   # ターミナルで実行
   sudo atsutil databases -remove
   atsutil server -shutdown
   atsutil server -ping
   ```

2. **Pythonを再起動**
   ```python
   # Pythonスクリプト内で
   import matplotlib.font_manager as fm
   fm._rebuild()  # フォントキャッシュを再構築
   ```

3. **フォントパスを確認**
   ```bash
   # インストール済みフォントの確認
   ls /Library/Fonts/ | grep -i noto
   ls ~/Library/Fonts/ | grep -i japan
   ```

### 環境別の対処法

#### 1. ローカルPython環境

```python
# 仮想環境を作成
python3 -m venv dxf_env
source dxf_env/bin/activate

# パッケージをインストール
pip install ezdxf matplotlib pillow

# フォントを確認
python dxf_to_png_converter.py --check-fonts
```

#### 2. Jupyter Notebook (ローカル)

```python
# カーネルを再起動
# Kernel → Restart & Clear Output

# フォントを明示的に設定
import matplotlib.pyplot as plt
plt.rcParams['font.family'] = 'Hiragino Sans'
```

#### 3. VS Code

```json
// settings.json
{
    "python.terminal.activateEnvironment": true,
    "jupyter.runStartupCommands": [
        "import matplotlib.pyplot as plt",
        "plt.rcParams['font.family'] = 'Hiragino Sans'"
    ]
}
```

## 📝 使用方法

### コマンドライン

```bash
# 単一ファイルの変換
python dxf_to_png_converter.py test_file1.dxf -o output.png

# バッチ変換
python dxf_to_png_converter.py ./dxf_files/ -o ./png_output/

# 高解像度出力
python dxf_to_png_converter.py input.dxf -d 600

# フォントチェック
python dxf_to_png_converter.py --check-fonts
```

### Pythonスクリプト内

```python
from dxf_to_png_converter import convert_dxf_to_png

# 基本的な使用
success = convert_dxf_to_png("input.dxf", "output.png")

# 高解像度
success = convert_dxf_to_png("input.dxf", "output.png", dpi=600)
```

## 🎯 ベストプラクティス

1. **プロジェクト開始時にフォントをチェック**
   ```bash
   python dxf_to_png_converter.py --check-fonts
   ```

2. **requirements.txtを作成**
   ```txt
   ezdxf>=0.17.0
   matplotlib>=3.5.0
   pillow>=9.0.0
   ```

3. **Docker環境の場合**
   ```dockerfile
   FROM python:3.9
   RUN apt-get update && apt-get install -y fonts-noto-cjk
   ```

## 🆘 それでも動かない場合

1. **システム情報を収集**
   ```bash
   python -c "import platform; print(platform.platform())"
   python -c "import matplotlib; print(matplotlib.__version__)"
   sw_vers  # macOSバージョン確認
   ```

2. **デバッグモードで実行**
   ```python
   import logging
   logging.basicConfig(level=logging.DEBUG)
   ```

3. **最小限のテストコード**
   ```python
   import matplotlib.pyplot as plt
   plt.text(0.5, 0.5, 'テスト日本語', fontsize=20)
   plt.savefig('test.png')
   ```

## 📚 参考リンク

- [matplotlib日本語対応](https://matplotlib.org/stable/tutorials/text/text_props.html)
- [macOSフォント管理](https://support.apple.com/ja-jp/guide/font-book/welcome/mac)
- [Homebrew Fonts](https://github.com/Homebrew/homebrew-cask-fonts)

---

問題が解決しない場合は、具体的なエラーメッセージと環境情報を含めてissueを作成してください。