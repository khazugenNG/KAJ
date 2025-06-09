/**
 * Typy pro poznámky v aplikaci KajNotes
 * 
 * Definuje strukturu pro různé typy poznámek:
 * - TextNote: Textové poznámky s obsahem
 * - TodoNote: Seznamy úkolů s položkami
 * - ImageNote: Obrázkové poznámky s náhledem
 * 
 * @author Mike
 * @version 1.0.0
 */

export type NoteType = 'text' | 'todo' | 'image';

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

// Základní rozhraní pro všechny typy poznámek
export interface BaseNote {
  id: string; // Unikátní identifikátor poznámky
  type: 'text' | 'todo' | 'image'; // Typ poznámky
  title: string; // Název poznámky
  createdAt: Date; // Datum vytvoření
  updatedAt: Date; // Datum poslední úpravy
  userId: string; // ID uživatele, který poznámku vytvořil
  color?: string; // ID kategorie/barvy (volitelné)
  tags?: string[]; // Tagy pro kategorizaci (volitelné)
}

// Textová poznámka s obsahem
export interface TextNote extends BaseNote {
  type: 'text';
  content: string; // Textový obsah poznámky
}

// Seznam úkolů (todo poznámka)
export interface TodoNote extends BaseNote {
  type: 'todo';
  items: TodoItem[]; // Seznam úkolů
  assignedUsers?: string[]; // ID uživatelů, kterým jsou úkoly přiřazeny (volitelné)
}

// Obrázková poznámka
export interface ImageNote extends BaseNote {
  type: 'image';
  imageUrl: string; // URL nebo base64 data obrázku
  caption?: string; // Popisek obrázku (volitelné)
}

// Union typ pro všechny typy poznámek
export type Note = TextNote | TodoNote | ImageNote; 