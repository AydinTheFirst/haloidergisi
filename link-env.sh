#!/bin/bash

# Root dizinindeki .env dosyasının tam yolunu al
DOTENV_PATH=$(pwd)/.env

# .env dosyası var mı kontrol et
if [ ! -f "$DOTENV_PATH" ]; then
    echo "❌ Hata: Root dizininde .env dosyası bulunamadı!"
    exit 1
fi

echo "🔗 Symlink işlemi başlatılıyor..."

find apps packages -maxdepth 2 -name "package.json" | while read -r package; do
    dir=$(dirname "$package")

    echo "⚙️  İşleniyor: $dir"

    # Eğer o klasörde zaten bir .env varsa (dosya veya link) sil
    if [ -e "$dir/.env" ] || [ -L "$dir/.env" ]; then
        rm "$dir/.env"
    fi

    # Symlink'i oluştur
    ln -s "$DOTENV_PATH" "$dir/.env"
    echo "✅ Linklendi: $dir/.env"
done

echo "🚀 İşlem başarıyla tamamlandı!"
