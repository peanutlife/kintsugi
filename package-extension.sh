#!/bin/bash
# Package Kintsugi Extension for Distribution

echo "📦 Packaging Kintsugi Extension..."

# Create releases directory if it doesn't exist
mkdir -p releases

# Get version from manifest
VERSION=$(grep '"version"' kintsugi-extension/manifest.json | sed 's/[^0-9.]//g')
echo "Version: $VERSION"

# Create ZIP filename
FILENAME="kintsugi-extension-v${VERSION}.zip"
OUTPUT="releases/${FILENAME}"

# Remove old ZIP if exists
if [ -f "$OUTPUT" ]; then
    rm "$OUTPUT"
    echo "Removed old package"
fi

# Create ZIP (excluding unnecessary files)
cd kintsugi-extension
zip -r "../$OUTPUT" . \
    -x "*.DS_Store" \
    -x "*node_modules/*" \
    -x "*.git/*" \
    -x "*.idea/*"
cd ..

echo "✅ Extension packaged: $OUTPUT"
echo ""
echo "📋 Distribution checklist:"
echo "  1. Test the ZIP by loading in Chrome"
echo "  2. Create GitHub release with version tag v${VERSION}"
echo "  3. Upload ZIP to GitHub release"
echo "  4. Update README with download link"
echo ""
echo "🚀 Ready to distribute!"
