
# Şeffaf Kariyer (ReplyRate) — Basic React Native/Expo MVP

> İş başvurularındaki **geri dönüş şeffaflığını** kişisel ölçekte tutan basit bir mobil uygulama.  
> Özellikler: Deneyim ekle, şirket bazında geri dönüş oranını gör, detayları incele. **Tamamen offline**, AsyncStorage üzerinde çalışır.

## Kurulum

```bash
# 1) Bağımlılıkları yükle
npm install

# 2) Geliştirme sunucusunu başlat
npm run start

# 3) Expo Go ile cihazda aç veya emulator/simulator ile çalıştır
```

## İçerik

- `src/screens/HomeScreen.tsx` — Şirketlere göre gruplanmış istatistik listesi
- `src/screens/AddExperienceScreen.tsx` — Deneyim (başvuru) ekleme formu
- `src/screens/CompanyScreen.tsx` — Seçilen şirkete ait deneyimlerin listesi
- `src/store/storage.ts` — AsyncStorage ile veri kaydetme/okuma ve gruplayıp oran hesaplama
- `src/models.ts` — Basit tipler
- `src/components/CompanyCard.tsx` — Liste kartı

## Notlar

- Bu MVP **internet/beklenti olmadan** çalışır; veri cihazda saklanır.  
- İleride (v1.1) Gmail okuma, paylaşımla ilan alma, dışa aktarma (CSV), ve spam/troll önleme gibi özellikler eklenebilir.
- Lisans: MIT

Oluşturulma zamanı: 2025-09-19T13:58:07.397918
