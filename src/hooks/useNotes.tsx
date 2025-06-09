/**
 * Custom hook pro správu poznámek
 * 
 * Obsahuje:
 * - State pro poznámky a archivované poznámky
 * - Funkce pro CRUD operace
 * - Drag & Drop funkcionalitu
 * - Todo položky editaci
 * 
 * @author Mike
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import { NoteService } from '../services/NoteService';
import type { Note, TextNote, TodoNote, ImageNote } from '../types/Note';
import type { Session } from '../types/User';

/**
 * Hook pro správu poznámek
 * Poskytuje kompletní funkcionalitu pro práci s poznámkami
 */
export function useNotes(session: Session | null) {
  // ===== STATE PRO SPRÁVU POZNÁMEK =====
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [archivedNotes, setArchivedNotes] = useState<any[]>([]);

  // ===== STATE PRO VYTVÁŘENÍ POZNÁMEK =====
  const [isCreating, setIsCreating] = useState(false);
  const [newNoteType, setNewNoteType] = useState<'text' | 'todo' | 'image'>('text');
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newTodoItems, setNewTodoItems] = useState([{ id: Date.now().toString(), text: '', completed: false }]);
  const [newImage, setNewImage] = useState<string | null>(null);
  const [newImageCaption, setNewImageCaption] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // ===== STATE PRO ÚPRAVU TODO POLOŽEK =====
  const [editingTodoItem, setEditingTodoItem] = useState<{noteId: string, itemId: string, text: string} | null>(null);

  // ===== STATE PRO EDITACI POZNÁMEK =====
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // ===== STATE PRO DRAG & DROP =====
  const [draggedNote, setDraggedNote] = useState<string | null>(null);
  const [dragOverNote, setDragOverNote] = useState<string | null>(null);

  // ===== USE EFFECT HOOKS =====
  
  /**
   * Načtení poznámek při změně session
   */
  useEffect(() => {
    if (session) {
      const userNotes = NoteService.getNotes(session.user.id);
      setNotes(userNotes);
    } else {
      setNotes([]);
    }
  }, [session]);

  /**
   * Uložení poznámek do localStorage při změně
   */
  useEffect(() => {
    if (session && notes.length > 0) {
      localStorage.setItem(`noteflow-notes-${session.user.id}`, JSON.stringify(notes));
    }
  }, [session, notes]);

  // ===== FUNKCE PRO SPRÁVU POZNÁMEK =====
  
  /**
   * Smazání poznámky
   */
  const handleDeleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    if (selectedNote?.id === noteId) {
      setSelectedNote(null);
    }
  };

  /**
   * Přepnutí stavu úkolu
   */
  const handleToggleTodoItem = (noteId: string, itemId: string) => {
    setNotes((prev) => prev.map((note) => {
      if (note.id === noteId && note.type === 'todo') {
        const todoNote = note as TodoNote;
        return {
          ...todoNote,
          items: todoNote.items.map((item) => 
            item.id === itemId ? { ...item, completed: !item.completed } : item
          )
        };
      }
      return note;
    }));
  };

  /**
   * Začátek editace todo položky
   */
  const handleStartEditTodoItem = (noteId: string, itemId: string, currentText: string) => {
    setEditingTodoItem({ noteId, itemId, text: currentText });
  };

  /**
   * Uložení změn v editované todo položce
   */
  const handleSaveTodoItemEdit = (newText: string) => {
    if (!editingTodoItem || !newText.trim()) return;
    
    setNotes((prev) => prev.map((note) => {
      if (note.id === editingTodoItem.noteId && note.type === 'todo') {
        const todoNote = note as TodoNote;
        return {
          ...todoNote,
          items: todoNote.items.map((item) => 
            item.id === editingTodoItem.itemId ? { ...item, text: newText.trim() } : item
          )
        };
      }
      return note;
    }));
    
    setEditingTodoItem(null);
  };

  /**
   * Zrušení editace todo položky
   */
  const handleCancelTodoItemEdit = () => {
    setEditingTodoItem(null);
  };

  /**
   * Přidání nové todo položky
   */
  const handleAddTodoItem = (noteId: string) => {
    const newItemId = Date.now().toString() + Math.random();
    setNotes((prev) => prev.map((note) => {
      if (note.id === noteId && note.type === 'todo') {
        const todoNote = note as TodoNote;
        return {
          ...todoNote,
          items: [...todoNote.items, { 
            id: newItemId, 
            text: '', 
            completed: false 
          }]
        };
      }
      return note;
    }));
    
    // Automaticky začít editaci nové položky
    setTimeout(() => {
      setEditingTodoItem({ noteId, itemId: newItemId, text: '' });
    }, 100);
  };

  /**
   * Smazání todo položky
   */
  const handleDeleteTodoItem = (noteId: string, itemId: string) => {
    setNotes((prev) => prev.map((note) => {
      if (note.id === noteId && note.type === 'todo') {
        const todoNote = note as TodoNote;
        return {
          ...todoNote,
          items: todoNote.items.filter(item => item.id !== itemId)
        };
      }
      return note;
    }));
  };

  // ===== FUNKCE PRO EDITACI POZNÁMEK =====
  
  /**
   * Otevření modalu pro editaci poznámky
   */
  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsEditModalOpen(true);
  };

  /**
   * Uložení změn v editované poznámce
   */
  const handleSaveNoteEdit = (updatedNote: Note) => {
    setNotes(prev => prev.map(note => 
      note.id === updatedNote.id ? updatedNote : note
    ));
    setEditingNote(null);
    setIsEditModalOpen(false);
  };

  /**
   * Zavření modalu pro editaci
   */
  const handleCloseEditModal = () => {
    setEditingNote(null);
    setIsEditModalOpen(false);
  };

  /**
   * Přepnutí stavu dokončení poznámky
   */
  const handleToggleNoteCompleted = (noteId: string) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId ? { ...note, completed: !note.completed, updatedAt: new Date() } : note
    ));
  };

  /**
   * Vytvoření nové poznámky
   */
  const handleCreateNote = async (currentLocation: {lat: number, lng: number} | null) => {
    if (!session) return;
    let note;
    if (newNoteType === 'todo') {
      note = NoteService.createNote('todo', session.user.id) as TodoNote;
      note.title = newNoteTitle;
      note.items = newTodoItems.filter(i => i.text.trim());
    } else if (newNoteType === 'image') {
      note = NoteService.createNote('image', session.user.id) as ImageNote;
      note.title = newNoteTitle;
      if (newImage) {
        note.imageUrl = newImage;
      }
      note.caption = newImageCaption;
    } else {
      note = NoteService.createNote('text', session.user.id) as TextNote;
      note.title = newNoteTitle;
      note.content = newNoteContent;
    }
    
    // Přiřadit kategorii k poznámce
    if (selectedCategory) {
      note.color = selectedCategory;
    }
    
    // Přiřadit geolokaci k poznámce, pokud je dostupná
    if (currentLocation) {
      (note as any).location = currentLocation;
    }
    
    setNotes(prev => [...prev, note]);
    setNewNoteTitle('');
    setNewNoteContent('');
    setIsCreating(false);
    setNewTodoItems([{ id: Date.now().toString(), text: '', completed: false }]);
    setNewImage(null);
    setNewImageCaption('');
    setSelectedCategory('');
  };

  /**
   * Archivace poznámky
   */
  const handleArchiveNote = (noteId: string) => {
    const noteToArchive = notes.find(note => note.id === noteId);
    if (noteToArchive) {
      setArchivedNotes(prev => [...prev, { ...noteToArchive, archivedAt: new Date() }]);
      setNotes(prev => prev.filter(note => note.id !== noteId));
      if (selectedNote?.id === noteId) {
        setSelectedNote(null);
      }
    }
  };

  /**
   * Obnovení poznámky z archivu
   */
  const handleRestoreNote = (noteId: string) => {
    const noteToRestore = archivedNotes.find(note => note.id === noteId);
    if (noteToRestore) {
      const { archivedAt, ...noteWithoutArchive } = noteToRestore;
      setNotes(prev => [...prev, noteWithoutArchive]);
      setArchivedNotes(prev => prev.filter(note => note.id !== noteId));
    }
  };

  /**
   * Trvalé smazání poznámky z archivu
   */
  const handleDeleteFromArchive = (noteId: string) => {
    setArchivedNotes(prev => prev.filter(note => note.id !== noteId));
  };

  // ===== DRAG & DROP FUNKCE =====
  
  /**
   * Začátek přetahování poznámky
   */
  const handleDragStart = (e: React.DragEvent, noteId: string) => {
    setDraggedNote(noteId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', noteId);
  };

  /**
   * Přetahování nad poznámkou
   */
  const handleDragOver = (e: React.DragEvent, noteId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverNote(noteId);
  };

  /**
   * Opuštění oblasti poznámky při přetahování
   */
  const handleDragLeave = () => {
    setDragOverNote(null);
  };

  /**
   * Přetažení poznámky na novou pozici
   */
  const handleDrop = (e: React.DragEvent, targetNoteId: string) => {
    e.preventDefault();
    const draggedNoteId = e.dataTransfer.getData('text/plain');
    
    if (draggedNoteId && draggedNoteId !== targetNoteId) {
      setNotes(prev => {
        const notesCopy = [...prev];
        const draggedIndex = notesCopy.findIndex(note => note.id === draggedNoteId);
        const targetIndex = notesCopy.findIndex(note => note.id === targetNoteId);
        
        if (draggedIndex !== -1 && targetIndex !== -1) {
          const [draggedNote] = notesCopy.splice(draggedIndex, 1);
          notesCopy.splice(targetIndex, 0, draggedNote);
        }
        
        return notesCopy;
      });
    }
    
    setDraggedNote(null);
    setDragOverNote(null);
  };

  /**
   * Konec přetahování
   */
  const handleDragEnd = () => {
    setDraggedNote(null);
    setDragOverNote(null);
  };

  // ===== RESET FUNKCE =====
  
  /**
   * Reset formuláře pro vytváření poznámky
   */
  const resetCreateForm = () => {
    setIsCreating(false);
    setNewNoteTitle('');
    setNewNoteContent('');
    setNewTodoItems([{ id: Date.now().toString(), text: '', completed: false }]);
    setNewImage(null);
    setNewImageCaption('');
    setSelectedCategory('');
  };

  return {
    // State
    notes,
    selectedNote,
    archivedNotes,
    isCreating,
    newNoteType,
    newNoteTitle,
    newNoteContent,
    newTodoItems,
    newImage,
    newImageCaption,
    selectedCategory,
    editingTodoItem,
    editingNote,
    isEditModalOpen,
    draggedNote,
    dragOverNote,
    
    // Setters
    setSelectedNote,
    setIsCreating,
    setNewNoteType,
    setNewNoteTitle,
    setNewNoteContent,
    setNewTodoItems,
    setNewImage,
    setNewImageCaption,
    setSelectedCategory,
    
    // Functions
    handleDeleteNote,
    handleToggleTodoItem,
    handleStartEditTodoItem,
    handleSaveTodoItemEdit,
    handleCancelTodoItemEdit,
    handleAddTodoItem,
    handleDeleteTodoItem,
    handleEditNote,
    handleSaveNoteEdit,
    handleCloseEditModal,
    handleToggleNoteCompleted,
    handleCreateNote,
    handleArchiveNote,
    handleRestoreNote,
    handleDeleteFromArchive,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
    resetCreateForm
  };
} 