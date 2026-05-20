#!/bin/bash
set -e

echo "Installing Piper TTS..."
pip install piper-tts

echo "Downloading Vietnamese Piper model..."
mkdir -p models
piper --download-dir ./models --model vi_VN-25Hz_hifi-trs

echo "✓ Piper TTS environment ready"
echo "Model location: models/vi_VN-25Hz_hifi-trs/"
