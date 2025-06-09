# KajNotes

 Webová aplikace pro správu poznámek a úkolů vytvořená jako semestrální práce do předmětu Klientské aplikace v JavaScriptu. Aplikace je inspirovaná Google Keep a poskytuje uživatelům intuitivní rozhraní pro vytváření a správu různých typů poznámek.

## Cíl projektu

Cílem projektu je vytvořit webovou aplikaci, která demonstruje znalosti a dovednosti v oblasti vývoje klientských webových aplikací. Aplikace umožňuje uživatelům vytvářet a spravovat různé typy poznámek a úkolů s důrazem na moderní UX/UI design a technologické postupy.

## Technologie

- Frontend Framework: React + TypeScript
- Styling: Tailwind CSS
- Build Tool: Vite
- State Management: React Hooks
- Storage: LocalStorage API
- Real-time komunikace: WebSocket API
- Geolokace: Geolocation API
- Drag & Drop: HTML5 Drag & Drop API

## Implementované požadavky

### HTML5
- Validní HTML5 dokument s použitím sémantických značek (section, article, nav)
- Responzivní design pro všechny moderní prohlížeče
- Multimediální prvky (obrázky)
- Formulářové prvky s validací, placeholder a autofocus
- Pokročilé API (Drag & Drop, Geolocation, WebSocket)

### CSS (Tailwind CSS)
- Pokročilé selektory a pseudotřídy (hover, focus, active)
- CSS3 transformace a animace
  - Hover efekty na kartách poznámek
  - Transitions při interakcích
  - Transformace při drag & drop operacích
- Responzivní design pomocí Tailwind breakpointů
- Vendor prefixy řešeny přes autoprefixer

### JavaScript (React + TypeScript)
- OOP přístup:
  - Prototypová dědičnost (třídy Note, TextNote, TodoNote, ImageNote)
  - Jmenné prostory (NoteTypes, NoteService, WebSocketService, AuthService)
- JS API:
  - File API pro nahrávání obrázků
  - Drag & Drop API pro přeuspořádání poznámek
  - LocalStorage API pro offline ukládání
  - Geolocation API pro přidání lokace k poznámkám
  - WebSocket API pro real-time aktualizace
- Offline podpora:
  - LocalStorage pro perzistenci dat
  - Offline režim s indikátorem připojení

### UX/UI Design
- Moderní, čistý design inspirovaný Google Keep
- Responzivní layout pro všechny zařízení
- Intuitivní ovládání s drag & drop
- Animace a přechody pro lepší uživatelský zážitek
- Přístupnost s ARIA atributy a klávesovými zkratkami

## Funkcionalita

### Typy poznámek
1. Textové poznámky
   - Nadpis a obsah s textarea
   - Formátovaný text
   - Tagy a kategorizace

2. Todo seznamy
   - Kontrolovatelné položky s možností označení jako dokončené
   - Priorita úkolů
   - Termíny splnění

3. Obrázkové poznámky
   - Nahrávání obrázků přes File API
   - Popisky a nadpisy
   - Náhledy s možností zvětšení

### Správa poznámek
- Vytváření, editace, mazání poznámek
- Drag & Drop přeuspořádání poznámek
- Archivace a obnovení poznámek
- Trvalé mazání z archivu
- Tagování a kategorizace
- Barevné označení poznámek
- Statistiky a přehledy

### Pokročilé funkce
- Real-time synchronizace přes WebSocket
- Indikátor připojení k serveru
- Geolokace pro přidání lokace k poznámkám
- Offline režim s LocalStorage
- Drag & Drop pro přeuspořádání
- Responzivní design pro mobilní zařízení

## Instalace a spuštění

1. Klonování repozitáře:
   ```bash
   git clone [url-repozitáře]
   cd kaj
   ```

2. Instalace závislostí:
   ```bash
   npm install
   ```

3. Spuštění vývojového serveru:
   ```bash
   npm run dev
   ```

4. Sestavení pro produkci:
   ```bash
   npm run build
   ```

## Struktura projektu

```
src/
├── components/     # React komponenty
├── models/        # Třídy pro poznámky
├── services/      # Služby (NoteService, WebSocketService, AuthService)
├── types/         # TypeScript typy a rozhraní
└── App.tsx        # Hlavní komponenta aplikace
```

## Komentáře ke kódu

Kód je důkladně okomentován v češtině s důrazem na:
- Popis funkcionality jednotlivých komponent
- Dokumentaci typů a rozhraní
- Vysvětlení složitějších algoritmů
- Poznámky k implementaci API
- Dokumentaci parametrů funkcí

## Implementované API

- **Drag & Drop API**: Pro přeuspořádání poznámek
- **Geolocation API**: Pro přidání lokace k poznámkám
- **LocalStorage API**: Pro offline ukládání dat
- **WebSocket API**: Pro real-time synchronizaci
- **File API**: Pro nahrávání obrázků

## Licence

Tento projekt je vytvořen jako semestrální práce a není určen pro komerční použití.

## Autoři

- Mike (2024)
