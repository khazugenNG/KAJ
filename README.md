# KajNotes

**KajNotes** je moderní webová aplikace pro správu poznámek, úkolů a obrázků, postavená na technologiích React, TypeScript a Tailwind CSS. Umožňuje vytvářet, upravovat a organizovat různé typy poznámek, spravovat kategorie, archivovat poznámky, sledovat statistiky a využívat pokročilé funkce jako drag & drop, geolokaci a real-time aktualizace.

## Funkce

- **Textové poznámky** – rychlé zápisky, myšlenky, nápady.
- **To-Do poznámky** – úkolníčky s možností označovat splněné položky.
- **Obrázkové poznámky** – možnost přidat obrázek s popiskem.
- **Kategorie** – třídění poznámek do vlastních kategorií.
- **Archivace** – přesun poznámek do archivu, možnost obnovení nebo smazání.
- **Statistiky** – přehled o počtu poznámek, úkolech, kategoriích apod.
- **Drag & Drop** – přetahování poznámek pro změnu pořadí.
- **Geolokace** – možnost uložit k poznámce aktuální polohu.
- **Real-time aktualizace** – poznámky se aktualizují v reálném čase (WebSocket).
- **Uživatelské účty** – registrace, přihlášení, odhlášení.
- **Responzivní design** – optimalizováno pro mobilní i desktopová zařízení.
- **Ukládání do LocalStorage** – poznámky a session přetrvávají i po obnovení stránky.
- **Přehledné rozhraní** – moderní UI s animacemi a přechody (Tailwind CSS).

## Technologie

- **React** (TypeScript)
- **Vite** (vývojový server)
- **Tailwind CSS** (styly a animace)
- **WebSocket** (real-time aktualizace)
- **Geolocation API** (získání polohy)
- **LocalStorage** (perzistence dat)
- **Modulární architektura** (rozděleno do komponent a hooků)

## Struktura projektu

```
src/
├── components/      // Znovupoužitelné UI komponenty (NoteCard, Header, atd.)
├── hooks/           // Vlastní React hooky (useNotes, useCategories, ...)
├── pages/           // Stránky aplikace (ArchivePage, StatsPage, ...)
├── services/        // Služby pro práci s daty (AuthService, NoteService, ...)
├── types/           // Sdílené typy (User, Note, Session, ...)
├── App.tsx          // Hlavní komponenta aplikace
└── index.tsx        // Vstupní bod aplikace
```

## Spuštění projektu

1. **Instalace závislostí**
   ```bash
   npm install
   ```

2. **Spuštění vývojového serveru**
   ```bash
   npm run dev
   ```
   Výchozí adresa: [http://localhost:5173](http://localhost:5173)  
   Pokud je port obsazen, použij např. `npm run dev -- --port 5174`.

## Poznámky k použití

- Pro přihlášení můžeš použít testovací účet:
  - **Email:** `test@example.com`
  - **Heslo:** `Test123456`
- Všechna data jsou ukládána pouze do LocalStorage pro účely demonstrace.
- Aplikace je plně offline-ready (kromě WebSocket funkcí).

## Vývoj a rozšiřování

- Kód je rozdělen do menších komponent a hooků pro lepší přehlednost a údržbu.
- Komentáře v kódu jsou v češtině.
- Pro přidání nové funkce vytvoř novou komponentu nebo hook do příslušné složky.

## Dokumentace

### Architektura aplikace

Aplikace je postavena na modulární architektuře s jasným oddělením zodpovědností:

#### Komponenty (`src/components/`)
- **Header.tsx** - Responzivní navigační header s hamburger menu
- **NoteCard.tsx** - Karta poznámky s drag & drop funkcionalitou
- **AuthPage.tsx** - Stránka pro přihlášení a registraci

#### Hooky (`src/hooks/`)
- **useNotes.tsx** - Hlavní logika pro správu poznámek (CRUD operace, drag & drop, archivace)

#### Služby (`src/services/`)
- **AuthService.ts** - Autentifikace a správa uživatelů
- **NoteService.ts** - Generování unikátních ID a pomocné funkce
- **WebSocketService.ts** - Real-time komunikace

#### Stránky (`src/pages/`)
- **ArchivePage.tsx** - Správa archivovaných poznámek
- **CategoriesPage.tsx** - Správa kategorií
- **StatsPage.tsx** - Statistiky a přehledy
- **SharePage.tsx** - Sdílení poznámek

### Typy dat

#### Note (Poznámka)
```typescript
interface Note {
  id: string;
  type: 'text' | 'todo' | 'image';
  title: string;
  content?: string;
  todoItems?: TodoItem[];
  imageUrl?: string;
  imageCaption?: string;
  categoryId?: string;
  location?: { lat: number; lng: number };
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
}
```

#### User (Uživatel)
```typescript
interface User {
  id: string;
  username: string;
  email: string;
  password: string; // zahashované
}
```

#### Session (Přihlašovací session)
```typescript
interface Session {
  id: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
  user: User;
}
```

### Klíčové funkce

#### Drag & Drop
- Implementováno pomocí HTML5 Drag & Drop API
- Poznámky lze přetahovat pro změnu pořadí
- Vizuální feedback během přetahování

#### Real-time aktualizace
- WebSocket simulace pro real-time komunikaci
- Automatické heartbeat zprávy
- Status indikátor (online/offline)

#### Geolokace
- Použití HTML5 Geolocation API
- Možnost uložit GPS souřadnice k poznámkám
- Ošetření chyb a oprávnění

#### Persistence dat
- LocalStorage pro ukládání poznámek
- Session management
- Automatické zálohování dat

### CSS3 Transitions a Animace

Aplikace využívá rozsáhlé CSS3 transitions a animace:

#### Tailwind CSS Transitions
- `transition-all duration-200` - plynulé přechody pro všechny vlastnosti
- `hover:scale-105` - zvětšení při najetí myší
- `transform transition-transform` - animované transformace

#### Drag & Drop Animace
- `opacity-50` - průhlednost při přetahování
- `scale-95` - zmenšení při přetahování
- `shadow-lg` - stínování pro vizuální feedback

#### Responzivní Animace
- `sm:` prefix pro různé breakpointy
- Mobilní hamburger menu s animacemi
- Plynulé přechody mezi desktop a mobilním zobrazením

### Bezpečnost

#### Autentifikace
- Hashování hesel pomocí crypto-js
- Session management s expirací
- Sanitizace vstupů

#### Validace
- Email validace
- Heslo validace (minimálně 8 znaků, velké/malé písmeno, číslo)
- Username validace (3-20 znaků)

### Nasazení

#### GitHub Pages
Aplikace je nasazena na GitHub Pages s následující konfigurací:

```typescript
// vite.config.ts
export default defineConfig({
  base: '/KAJ/', // název repozitáře
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
```

#### Deploy proces
1. `npm run build` - sestavení produkční verze
2. `npm run deploy` - nahrání na GitHub Pages
3. Automatické nasazení na `https://khazugenNG.github.io/KAJ/`

### Testovací účet

Pro demonstraci aplikace je k dispozici testovací účet:
- **Email:** `test@example.com`
- **Heslo:** `Test123456`

### Omezení

- Data jsou ukládána pouze do LocalStorage (demonstrační účely)
- WebSocket je simulován (není skutečné real-time připojení)
- Geolokace vyžaduje HTTPS nebo localhost

### Budoucí rozšíření

- Backend API pro skutečné ukládání dat
- Skutečné WebSocket připojení
- Push notifikace
- Offline mode s Service Workers
- Export/import poznámek
- Sdílení poznámek mezi uživateli

## Autoři

- Mike (2024)
- [Tvůj GitHub profil nebo kontakt]

---

Tento projekt je vytvořen jako semestrální práce a není určen pro komerční použití.
