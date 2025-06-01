#!/usr/bin/env python3
"""
DXF to PNG converter using ezdxf library
This script converts DXF files to PNG format with proper Japanese text handling
"""

import ezdxf
from ezdxf.addons.drawing import RenderContext, Frontend
from ezdxf.addons.drawing.matplotlib import MatplotlibBackend
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
import os
import sys

# For Google Colab environment
try:
    import google.colab
    IN_COLAB = True
except ImportError:
    IN_COLAB = False

def setup_japanese_font():
    """
    Setup Japanese font for matplotlib to handle Japanese text properly
    Returns the font properties object
    """
    # Common Japanese fonts that might be available
    japanese_fonts = [
        'Noto Sans CJK JP',
        'IPAGothic',
        'IPAPGothic',
        'IPAMincho',
        'IPAPMincho',
        'TakaoGothic',
        'TakaoPGothic',
        'Yu Gothic',
        'Hiragino Sans',
        'MS Gothic',
        'MS PGothic'
    ]
    
    # Try to find an available Japanese font
    available_fonts = [f.name for f in fm.fontManager.ttflist]
    font_prop = None
    
    for font in japanese_fonts:
        if font in available_fonts:
            font_prop = fm.FontProperties(family=font)
            print(f"Using Japanese font: {font}")
            break
    
    if font_prop is None:
        print("Warning: No Japanese font found. Japanese text may not display correctly.")
        print("Available fonts:", sorted(set(available_fonts))[:10], "...")
        
        # In Google Colab, install Japanese fonts
        if IN_COLAB:
            print("Installing Japanese fonts for Google Colab...")
            os.system('apt-get update && apt-get install -y fonts-noto-cjk')
            # Refresh font cache
            fm._rebuild()
            # Try again
            available_fonts = [f.name for f in fm.fontManager.ttflist]
            for font in japanese_fonts:
                if font in available_fonts:
                    font_prop = fm.FontProperties(family=font)
                    print(f"Using Japanese font after installation: {font}")
                    break
    
    return font_prop

def convert_dxf_to_png(dxf_file, png_file, dpi=300):
    """
    Convert a DXF file to PNG format
    
    Args:
        dxf_file (str): Path to input DXF file
        png_file (str): Path to output PNG file
        dpi (int): Resolution for PNG output (default: 300)
    """
    try:
        # Setup Japanese font
        font_prop = setup_japanese_font()
        
        # Read DXF file
        print(f"Reading DXF file: {dxf_file}")
        doc = ezdxf.readfile(dxf_file)
        
        # Get the modelspace
        msp = doc.modelspace()
        
        # Create rendering context
        context = RenderContext(doc)
        
        # Create matplotlib backend
        backend = MatplotlibBackend(context)
        
        # Configure matplotlib for Japanese text
        if font_prop:
            plt.rcParams['font.family'] = font_prop.get_family()
        
        # Create frontend
        frontend = Frontend(context, backend)
        
        # Draw all entities
        frontend.draw_layout(msp)
        
        # Get the figure
        fig = backend.get_figure()
        
        # Set figure size and DPI for good quality
        fig.set_dpi(dpi)
        
        # Save to PNG
        print(f"Saving PNG file: {png_file}")
        fig.savefig(png_file, dpi=dpi, bbox_inches='tight', pad_inches=0.1)
        plt.close(fig)
        
        print(f"Successfully converted {dxf_file} to {png_file}")
        
    except Exception as e:
        print(f"Error converting {dxf_file}: {str(e)}")
        raise

def main():
    """
    Main function to convert test DXF files
    """
    # List of files to convert
    files_to_convert = [
        ("test_file1.dxf", "test_file1_converted.png"),
        ("test_file2.dxf", "test_file2_converted.png")
    ]
    
    # Check if running in Google Colab
    if IN_COLAB:
        print("Running in Google Colab environment")
        # Mount Google Drive if needed
        # from google.colab import drive
        # drive.mount('/content/drive')
    
    # Convert each file
    for dxf_file, png_file in files_to_convert:
        if os.path.exists(dxf_file):
            convert_dxf_to_png(dxf_file, png_file)
        else:
            print(f"Warning: {dxf_file} not found, skipping...")
    
    print("\nConversion completed!")

if __name__ == "__main__":
    # Install required packages if in Google Colab
    if IN_COLAB:
        print("Installing required packages...")
        os.system('pip install ezdxf matplotlib')
    
    main()