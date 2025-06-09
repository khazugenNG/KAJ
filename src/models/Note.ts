import type { NoteType, BaseNote, TextNote as ITextNote, TodoNote as ITodoNote, ImageNote as IImageNote, TodoItem } from '../types/Note';

// Base Note class implementing OOP principles
export abstract class NoteModel implements BaseNote {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  color?: string;
  tags?: string[];
  userId: string;
  abstract type: NoteType;

  constructor(data: Partial<BaseNote>) {
    this.id = data.id || crypto.randomUUID();
    this.title = data.title || 'Untitled Note';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.color = data.color;
    this.tags = data.tags || [];
    this.userId = data.userId || '';
  }

  abstract getType(): NoteType;

  updateTitle(title: string): void {
    this.title = title;
    this.updatedAt = new Date();
  }

  addTag(tag: string): void {
    if (!this.tags) this.tags = [];
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
      this.updatedAt = new Date();
    }
  }

  removeTag(tag: string): void {
    if (this.tags) {
      this.tags = this.tags.filter(t => t !== tag);
      this.updatedAt = new Date();
    }
  }

  setColor(color: string): void {
    this.color = color;
    this.updatedAt = new Date();
  }

  toJSON(): BaseNote {
    return {
      id: this.id,
      title: this.title,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      color: this.color,
      tags: this.tags,
      userId: this.userId,
      type: this.type,
    };
  }
}

export class TextNoteModel extends NoteModel implements ITextNote {
  type: 'text' = 'text';
  content: string;

  constructor(data: Partial<ITextNote>) {
    super(data);
    this.content = data.content || '';
  }

  getType(): 'text' {
    return this.type;
  }

  updateContent(content: string): void {
    this.content = content;
    this.updatedAt = new Date();
  }

  toJSON(): ITextNote {
    return {
      ...super.toJSON(),
      type: this.type,
      content: this.content,
    };
  }
}

export class TodoNoteModel extends NoteModel implements ITodoNote {
  type: 'todo' = 'todo';
  items: TodoItem[];
  assignedUsers: string[];

  constructor(data: Partial<ITodoNote>) {
    super(data);
    this.items = data.items || [];
    this.assignedUsers = data.assignedUsers || [];
  }

  getType(): 'todo' {
    return this.type;
  }

  addItem(text: string): void {
    this.items.push({
      id: crypto.randomUUID(),
      text,
      completed: false,
    });
    this.updatedAt = new Date();
  }

  toggleItem(id: string): void {
    const item = this.items.find(item => item.id === id);
    if (item) {
      item.completed = !item.completed;
      this.updatedAt = new Date();
    }
  }

  removeItem(id: string): void {
    this.items = this.items.filter(item => item.id !== id);
    this.updatedAt = new Date();
  }

  toJSON(): ITodoNote {
    return {
      ...super.toJSON(),
      type: this.type,
      items: this.items,
      assignedUsers: this.assignedUsers,
    };
  }
}

export class ImageNoteModel extends NoteModel implements IImageNote {
  type: 'image' = 'image';
  imageUrl: string;
  caption: string;

  constructor(data: Partial<IImageNote>) {
    super(data);
    this.imageUrl = data.imageUrl || '';
    this.caption = data.caption || '';
  }

  getType(): 'image' {
    return this.type;
  }

  updateCaption(caption: string): void {
    this.caption = caption;
    this.updatedAt = new Date();
  }

  toJSON(): IImageNote {
    return {
      ...super.toJSON(),
      type: this.type,
      imageUrl: this.imageUrl,
      caption: this.caption,
    };
  }
} 