# Guia de Publicação — Caderno Unirversos (App Store & Google Play)

Este projeto em `APP-CADERNO` empacota automaticamente o **Caderno de Unir Versos** (de `../SITE`) em um aplicativo nativo para **iOS (App Store)** e **Android (Google Play)** usando **Capacitor**.

---

## 0. Caminho 100% Gratuito (US$ 0 — sem taxa de lojas!)

Você pode distribuir o **Caderno Unirversos** hoje mesmo sem pagar nada:

### A. Android — Gerar `.apk` grátis na nuvem (GitHub Actions)
Não precisa instalar Android Studio no seu Windows!
1. Crie um repositório **privado e gratuito** no GitHub (ex.: `caderno-unirversos-app`).
2. Envie esta pasta `APP-CADERNO` para o GitHub (os comandos já estão prontos).
3. Abra a aba **Actions** no GitHub → clique no workflow **Gerar APK Android (Gratuito)** → baixe o arquivo **`Caderno-Unirversos-APK`** (dentro dele está o `Caderno-Unirversos.apk`).
4. Você pode:
   - Enviar o `Caderno-Unirversos.apk` direto para testar no seu celular Android ou oferecer para download no seu site (`unirversos.com`).
   - Publicar gratuitamente em lojas alternativas de Android: **Samsung Galaxy Store** e **Amazon Appstore** (ambas sem taxa de cadastro).

### B. iPhone / iPad e Android — PWA gratuito pelo site
O Caderno em `https://unirversos.com/idiomas/caderno/` já tem `manifest.webmanifest` e funciona offline:
- **iPhone / iPad (Safari)**: tocar em **Compartilhar (⬆️) → Adicionar à Tela de Início**.
- **Android (Chrome)**: tocar em **⋮ → Instalar aplicativo**.
Abre em tela cheia com ícone próprio, sem barra do navegador e **custo zero**.

---

## 1. Pré-requisitos no Windows (uma única vez)
1. Instale o **Node.js LTS** em https://nodejs.org (marque a opção *Add to PATH*).
2. Abra o terminal na pasta `C:\Users\aline\UNIRVERSOS.COM\APP-CADERNO` e rode:
   ```powershell
   npm install
   npm run sync:web
   npx cap add ios
   npx cap add android
   ```
3. Sempre que você evoluir o Caderno no site (`../SITE`), basta rodar:
   ```powershell
   npm run cap:sync
   ```
   O script `scripts/sync-web.mjs` copia os arquivos atualizados, remove as barras do site, ativa `modo-app` e injeta a ponte nativa (`app-nativo.js` com Haptics e StatusBar).

---

## 2. Como publicar na Apple App Store (mesmo estando no Windows!)
Como compilar `.ipa` para iOS exige macOS/Xcode, você **não precisa comprar um Mac** — use build na nuvem:

1. **Conta Apple Developer** (US$ 99/ano): https://developer.apple.com/programs/
2. Suba a pasta `APP-CADERNO` para um repositório privado no **GitHub**.
3. Conecte esse repositório no **Codemagic** (https://codemagic.io — tem plano gratuito mensal para builds macOS!) ou use **GitHub Actions** com runner `macos-latest`:
   - O Codemagic detecta projetos Capacitor automaticamente, assina o app com o seu certificado da Apple e envia direto para o **TestFlight** no App Store Connect!
4. Teste no seu próprio iPhone/iPad via app **TestFlight** e clique em **Enviar para Revisão** no App Store Connect.

---

## 3. Como publicar na Google Play (Android)
1. **Conta Google Play Console** (US$ 25 taxa única): https://play.google.com/console
2. Instale o **Android Studio** no Windows (ou use o mesmo Codemagic).
3. Rode `npm run cap:android`, clique em **Build → Generate Signed Bundle (.aab)** e suba no Google Play Console.

---

## 4. Checklist de Aprovação da Apple (para passar de primeira)
- [x] **Funciona 100% offline na 1ª abertura** (IndexedDB + glossário offline + caneta + flashcards).
- [x] **Sem login obrigatório** (Guideline 5.1.1 — o usuário cria cadernos e desenha sem precisar de conta; botão de login oculto no app V1).
- [x] **Sem barras/menus do site** (`body.modo-app.app-nativo` remove `.sitebar`, `.trail`, `Recolher`, `Alternar Modo App` e baú flutuante).
- [x] **Recursos nativos reais** (Haptics ao virar página/estudar, StatusBar, Safe Areas, botão Voltar no Android, backup `.json` via Share Sheet nativo).
- [x] **Ícone 1024×1024 px** (sem transparência) e **Splash Screen** gerados em `assets/`, `ios/` e `android/` (`npm run assets:gen`).
- [x] **Info.plist configurado** (`ITSAppUsesNonExemptEncryption=false`, `pt-BR`, descrições de Câmera e Galeria para fotos nas páginas).
- [x] **Pipeline na nuvem pronto** (`codemagic.yaml` para gerar `.ipa` do iOS sem Mac e `.aab` do Android).
- [ ] **Subir `APP-CADERNO` para um repositório privado no GitHub** e conectar no Codemagic.
- [ ] **Política de Privacidade**: informe `https://unirversos.com/privacidade/` no App Store Connect e no Google Play Console.
- [ ] **Screenshots**: tire 3–5 capturas (iPhone 6.7" e iPad 13") mostrando:
  1. Livro aberto em 2 páginas com papel de Kanji + caneta/marca-texto
  2. Dicionário japonês com pronúncia 🔊
  3. Modo Estudo (Flashcards)
  4. Estante de cadernos + busca

---

## 5. Textos prontos para App Store Connect & Google Play Console
- **Nome do App**: `Caderno Unirversos`
- **Subtítulo (App Store, até 30 caracteres)**: `Caderno de Japonês & Kanji`
- **Descrição curta (Google Play, até 80 caracteres)**: `Escreva, desenhe kanji, estude flashcards e use o dicionário japonês offline.`
- **Palavras-chave (App Store, até 100 caracteres)**: `japonês,kanji,hiragana,katakana,caderno,flashcards,dicionário,estudo,idiomas,offline`
- **Categoria**: Educação (`Education`)
- **Classificação indicativa**: Livre (`4+` na Apple / `Livre` no Google Play)
- **Coleta de dados (Privacy Nutrition Label / Data Safety)**: `Não coleta dados do usuário` (V1 100% offline-first no aparelho).
