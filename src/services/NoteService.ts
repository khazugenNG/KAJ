/**
 * Služba pro správu poznámek
 * 
 * Poskytuje:
 * - Vytváření různých typů poznámek (text, todo, image)
 * - Ukládání a načítání poznámek z localStorage
 * - Generování unikátních ID
 * 
 * @author Mike
 * @version 1.0.0
 */

import type { Note, TextNote, TodoNote, ImageNote } from '../types/Note';

const NOTES_KEY_PREFIX = 'noteflow-notes-';

export class NoteService {
  /**
   * Vytvoření nové poznámky podle typu
   * @param type - Typ poznámky ('text', 'todo', 'image')
   * @param userId - ID uživatele
   * @returns Nová poznámka s vygenerovaným ID a timestampy
   */
  static createNote(type: 'text' | 'todo' | 'image', userId: string): Note {
    const baseNote = {
      id: this.generateId(),
      title: '',
      type,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      color: undefined,
      tags: []
    };

    switch (type) {
      case 'text':
        return {
          ...baseNote,
          content: ''
        } as TextNote;
      
      case 'todo':
        return {
          ...baseNote,
          items: [],
          assignedUsers: []
        } as TodoNote;
      
      case 'image':
        return {
          ...baseNote,
          imageUrl: '',
          caption: ''
        } as ImageNote;
      
      default:
        throw new Error(`Neznámý typ poznámky: ${type}`);
    }
  }

  /**
   * Generování unikátního ID pro poznámku
   * @returns Unikátní string ID
   */
  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Načtení poznámek uživatele z localStorage
   * @param userId - ID uživatele
   * @returns Pole poznámek nebo prázdné pole
   */
  static getNotes(userId: string): Note[] {
    const storedNotes = localStorage.getItem(`${NOTES_KEY_PREFIX}${userId}`);
    if (!storedNotes) return [];

    try {
      const notes = JSON.parse(storedNotes);
      // Konverze stringů na Date objekty
      return notes.map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt),
      }));
    } catch {
      return [];
    }
  }

  /**
   * Uložení poznámek uživatele do localStorage
   * @param userId - ID uživatele
   * @param notes - Pole poznámek k uložení
   */
  static saveNotes(userId: string, notes: Note[]): void {
    localStorage.setItem(`${NOTES_KEY_PREFIX}${userId}`, JSON.stringify(notes));
  }
} 