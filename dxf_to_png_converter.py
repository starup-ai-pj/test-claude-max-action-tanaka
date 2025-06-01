#!/usr/bin/env python3
"""
DXF to PNG Converter with Enhanced macOS Support
Converts DXF files to PNG format with proper Japanese text rendering on all platforms
"""

import os
import sys
import platform
import warnings
from pathlib import Path
from typing import List, Optional, Tuple
import subprocess

# Suppress matplotlib warnings
warnings.filterwarnings('ignore')

try:
    import ezdxf
    from ezdxf import recover
    from ezdxf.addons.drawing import matplotlib
except ImportError:
    print("Installing required packages...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "ezdxf", "matplotlib", "pillow"])
    import ezdxf
    from ezdxf import recover
    from ezdxf.addons.drawing import matplotlib

import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
from PIL import Image


class FontManager:
    """Manages font detection and setup across different platforms"""
    
    @staticmethod
    def get_platform_font_paths() -> List[str]:
        """Get platform-specific font paths"""
        system = platform.system()
        paths = []
        
        if system == "Darwin":  # macOS
            paths.extend([
                "/System/Library/Fonts",
                "/Library/Fonts",
                os.path.expanduser("~/Library/Fonts"),
                "/System/Library/Assets/com_apple_MobileAsset_Font6",
                "/System/Library/Assets/com_apple_MobileAsset_Font7",
                "/Applications/Microsoft Word.app/Contents/Resources/DFonts",
                "/Applications/Microsoft Excel.app/Contents/Resources/DFonts",
                "/Applications/Microsoft PowerPoint.app/Contents/Resources/DFonts",
            ])
        elif system == "Linux":
            paths.extend([
                "/usr/share/fonts",
                "/usr/local/share/fonts",
                os.path.expanduser("~/.fonts"),
                "/usr/share/fonts/truetype/noto",
                "/usr/share/fonts/opentype/noto",
                "/usr/share/fonts/opentype/ipafont-gothic",
                "/usr/share/fonts/truetype/fonts-japanese-gothic",
            ])
        elif system == "Windows":
            paths.extend([
                "C:\\Windows\\Fonts",
                os.path.expanduser("~\\AppData\\Local\\Microsoft\\Windows\\Fonts"),
            ])
        
        return [p for p in paths if os.path.exists(p)]
    
    @staticmethod
    def find_japanese_fonts() -> List[Tuple[str, str]]:
        """Find available Japanese fonts on the system"""
        japanese_fonts = []
        font_priority = [
            # macOS preferred fonts
            ("Hiragino Sans", ["Hiragino Sans GB", "Hiragino Kaku Gothic Pro", "ヒラギノ角ゴ Pro W3"]),
            ("Hiragino Kaku Gothic", ["Hiragino Kaku Gothic Pro", "ヒラギノ角ゴ Pro W3"]),
            ("Yu Gothic", ["Yu Gothic", "游ゴシック"]),
            ("Osaka", ["Osaka", "Osaka-Mono"]),
            # Cross-platform fonts
            ("Noto Sans CJK JP", ["Noto Sans CJK JP", "Noto Sans CJK JP Regular"]),
            ("Noto Sans JP", ["Noto Sans JP", "Noto Sans JP Regular"]),
            ("IPAGothic", ["IPAGothic", "IPAゴシック"]),
            ("IPAMincho", ["IPAMincho", "IPA明朝"]),
            ("Takao Gothic", ["TakaoGothic", "Takaoゴシック"]),
            ("Source Han Sans", ["Source Han Sans", "源ノ角ゴシック"]),
            # Windows fonts (might be available on Mac via Office)
            ("MS Gothic", ["MS Gothic", "ＭＳ ゴシック"]),
            ("Meiryo", ["Meiryo", "メイリオ"]),
            ("Yu Mincho", ["Yu Mincho", "游明朝"]),
        ]
        
        # Get all available fonts
        available_fonts = set()
        for font in fm.fontManager.ttflist:
            available_fonts.add(font.name)
        
        # Check priority fonts
        for font_family, font_names in font_priority:
            for font_name in font_names:
                if font_name in available_fonts:
                    japanese_fonts.append((font_family, font_name))
                    break
        
        return japanese_fonts
    
    @staticmethod
    def setup_matplotlib_font() -> Optional[str]:
        """Setup matplotlib with the best available Japanese font"""
        # First, try to find Japanese fonts
        japanese_fonts = FontManager.find_japanese_fonts()
        
        if japanese_fonts:
            font_family, font_name = japanese_fonts[0]
            plt.rcParams['font.family'] = font_name
            print(f"✓ Using Japanese font: {font_name}")
            return font_name
        
        # If no Japanese fonts found, try to install on macOS
        system = platform.system()
        if system == "Darwin":
            print("⚠️  No Japanese fonts found. Attempting to use system fonts...")
            
            # Try to use any available CJK font
            for font in fm.fontManager.ttflist:
                if any(cjk in font.name.lower() for cjk in ['cjk', 'chinese', 'japanese', 'korean', 'hiragino', 'yu']):
                    plt.rcParams['font.family'] = font.name
                    print(f"✓ Using CJK font: {font.name}")
                    return font.name
        
        # Last resort - try to download fonts
        if system in ["Linux", "Darwin"]:
            print("⚠️  No suitable fonts found. Consider installing:")
            print("  macOS: Download from Apple or install via:")
            print("    brew install font-noto-sans-cjk-jp")
            print("  Linux: sudo apt-get install fonts-noto-cjk")
        
        return None
    
    @staticmethod
    def install_fonts_colab():
        """Install Japanese fonts in Google Colab environment"""
        try:
            # Check if we're in Colab
            import google.colab
            print("Detected Google Colab environment. Installing Japanese fonts...")
            
            commands = [
                "apt-get update",
                "apt-get install -y fonts-noto-cjk fonts-ipafont-gothic fonts-ipafont-mincho"
            ]
            
            for cmd in commands:
                subprocess.run(cmd.split(), capture_output=True)
            
            # Clear font cache
            fm._rebuild()
            print("✓ Japanese fonts installed successfully")
            
        except ImportError:
            # Not in Colab
            pass
    
    @staticmethod
    def setup_fonts():
        """Main font setup function"""
        # Add platform-specific font paths to matplotlib
        for path in FontManager.get_platform_font_paths():
            fm.fontManager.addfont(path)
        
        # Install fonts if in Colab
        FontManager.install_fonts_colab()
        
        # Setup matplotlib font
        font = FontManager.setup_matplotlib_font()
        
        if not font:
            print("⚠️  Warning: No Japanese fonts detected.")
            print("  Text may not display correctly.")
            print("\n📝 Font Setup Instructions:")
            
            system = platform.system()
            if system == "Darwin":
                print("\n  macOS Options:")
                print("  1. Install Noto fonts: brew install font-noto-sans-cjk-jp")
                print("  2. Download from: https://www.google.com/get/noto/")
                print("  3. Use Font Book to install system fonts")
                print("  4. Install MS Office for additional Japanese fonts")
            elif system == "Linux":
                print("\n  Linux: sudo apt-get install fonts-noto-cjk")
            elif system == "Windows":
                print("\n  Windows: Install Japanese language pack in Settings")


def convert_dxf_to_png(dxf_file: str, png_file: str, dpi: int = 300) -> bool:
    """
    Convert DXF file to PNG with Japanese text support
    
    Args:
        dxf_file: Path to input DXF file
        png_file: Path to output PNG file
        dpi: Output resolution (default: 300)
    
    Returns:
        bool: True if successful, False otherwise
    """
    try:
        # Setup fonts
        FontManager.setup_fonts()
        
        # Try to load the DXF file
        print(f"Loading DXF file: {dxf_file}")
        try:
            doc = ezdxf.readfile(dxf_file)
        except Exception as e:
            print(f"Standard loading failed: {e}")
            print("Attempting recovery mode...")
            doc, auditor = recover.readfile(dxf_file)
            if auditor.has_errors:
                print(f"Recovery completed with errors: {len(auditor.errors)}")
        
        # Create matplotlib backend
        fig = plt.figure(figsize=(12, 9))
        ax = fig.add_axes([0, 0, 1, 1])
        
        # Get the model space
        msp = doc.modelspace()
        
        # Create backend and draw
        backend = matplotlib.MatplotlibBackend(ax)
        frontend = ezdxf.addons.drawing.Frontend(backend)
        frontend.draw_layout(msp, finalize=True)
        
        # Set proper limits
        ax.set_aspect('equal')
        
        # Save to PNG
        print(f"Saving PNG file: {png_file}")
        fig.savefig(png_file, dpi=dpi, bbox_inches='tight', pad_inches=0.1)
        plt.close(fig)
        
        # Verify the output
        if os.path.exists(png_file):
            img = Image.open(png_file)
            print(f"✓ Conversion successful: {img.size[0]}x{img.size[1]} pixels")
            return True
        else:
            print("✗ Conversion failed: Output file not created")
            return False
            
    except Exception as e:
        print(f"✗ Error during conversion: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def batch_convert(input_dir: str = ".", output_dir: str = "output", dpi: int = 300):
    """Convert all DXF files in a directory"""
    input_path = Path(input_dir)
    output_path = Path(output_dir)
    output_path.mkdir(exist_ok=True)
    
    dxf_files = list(input_path.glob("*.dxf"))
    
    if not dxf_files:
        print(f"No DXF files found in {input_dir}")
        return
    
    print(f"Found {len(dxf_files)} DXF file(s)")
    
    for dxf_file in dxf_files:
        png_file = output_path / f"{dxf_file.stem}.png"
        print(f"\nProcessing: {dxf_file.name}")
        convert_dxf_to_png(str(dxf_file), str(png_file), dpi)


def main():
    """Main function for command-line usage"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description="Convert DXF files to PNG with Japanese text support"
    )
    parser.add_argument("input", help="Input DXF file or directory")
    parser.add_argument(
        "-o", "--output", 
        help="Output PNG file or directory (default: same as input with .png extension)"
    )
    parser.add_argument(
        "-d", "--dpi", 
        type=int, 
        default=300, 
        help="Output resolution in DPI (default: 300)"
    )
    parser.add_argument(
        "--check-fonts",
        action="store_true",
        help="Check available Japanese fonts and exit"
    )
    
    args = parser.parse_args()
    
    if args.check_fonts:
        print("Checking available Japanese fonts...\n")
        FontManager.setup_fonts()
        fonts = FontManager.find_japanese_fonts()
        if fonts:
            print("\n✓ Available Japanese fonts:")
            for family, name in fonts:
                print(f"  - {name}")
        else:
            print("\n✗ No Japanese fonts found")
        print(f"\n📂 Font directories checked:")
        for path in FontManager.get_platform_font_paths():
            print(f"  - {path}")
        return
    
    input_path = Path(args.input)
    
    if input_path.is_file() and input_path.suffix.lower() == ".dxf":
        # Single file conversion
        if args.output:
            output_file = args.output
        else:
            output_file = input_path.with_suffix(".png")
        
        convert_dxf_to_png(str(input_path), str(output_file), args.dpi)
        
    elif input_path.is_dir():
        # Batch conversion
        output_dir = args.output if args.output else "output"
        batch_convert(str(input_path), output_dir, args.dpi)
        
    else:
        print(f"Error: {args.input} is not a valid DXF file or directory")
        sys.exit(1)


if __name__ == "__main__":
    main()