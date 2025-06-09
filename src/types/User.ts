/**
 * Typy pro uživatele a session v aplikaci KajNotes
 * 
 * Definuje strukturu pro:
 * - User: Informace o uživateli
 * - Session: Přihlašovací session
 * 
 * @author Mike
 * @version 1.0.0
 */

// Informace o uživateli
export interface User {
  id: string; // Unikátní ID uživatele
  username: string; // Zobrazované jméno uživatele
  email: string; // Email uživatele (používá se pro přihlášení)
  password: string; // Zahashované heslo
}

// Přihlašovací session
export interface Session {
  id: string; // Unikátní ID session
  userId: string; // ID uživatele
  createdAt: string; // Datum vytvoření session (ISO string)
  expiresAt: string; // Datum vypršení session (ISO string)
  user: User; // Kompletní data uživatele
}

export type UserPublic = Omit<User, 'password'>; 