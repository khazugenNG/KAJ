/**
 * Služba pro autentifikaci uživatelů
 * 
 * Poskytuje:
 * - Registraci nových uživatelů
 * - Přihlášení existujících uživatelů
 * - Odhlášení uživatelů
 * - Správu session dat
 * - Bezpečné hashování hesel
 * 
 * @author Mike
 * @version 1.0.0
 */

import type { User, Session } from '../types/User';
import { security } from '../utils/security';

const USERS_KEY = 'noteflow-users';
const SESSIONS_KEY = 'noteflow-sessions';

export class AuthService {
  private users: User[] = [];
  private sessions: Session[] = [];

  constructor() {
    // Vždy vytvoříme nový testovací účet při inicializaci
    const testUser: User = {
      id: '1',
      email: 'test@example.com',
      username: 'test',
      password: security.hashPassword('Test123456')
    };
    this.users = [testUser];
    this.saveUsers();
    console.log('Created fresh test user:', { 
      email: testUser.email, 
      passwordHash: testUser.password 
    });
    
    this.loadSessions();
  }

  private loadSessions(): void {
    const storedSessions = localStorage.getItem(SESSIONS_KEY);
    if (storedSessions) {
      this.sessions = JSON.parse(storedSessions);
    }
  }

  private saveUsers(): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(this.users));
  }

  private saveSessions(): void {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(this.sessions));
  }

  /**
   * Registrace nového uživatele
   * @param username - Uživatelské jméno
   * @param email - Email uživatele
   * @param password - Heslo (bude zahashováno)
   * @returns Promise s výsledkem registrace
   */
  async register(username: string, email: string, password: string): Promise<User> {
    // Sanitizace vstupu
    username = security.sanitizeInput(username);
    email = security.sanitizeInput(email);
    password = security.sanitizeInput(password);

    // Validace vstupů
    if (!security.validateUsername(username)) {
      throw new Error('Uživatelské jméno musí obsahovat 3-20 znaků (písmena, čísla a podtržítko)');
    }

    if (!security.validateEmail(email)) {
      throw new Error('Neplatný formát emailu');
    }

    if (!security.validatePassword(password)) {
      throw new Error('Heslo musí obsahovat minimálně 8 znaků, včetně velkého písmene, malého písmene a čísla');
    }

    // Kontrola duplicit
    if (this.users.some(u => u.email === email)) {
      throw new Error('Email je již registrován');
    }

    if (this.users.some(u => u.username === username)) {
      throw new Error('Uživatelské jméno je již použito');
    }

    // Hashování hesla pro bezpečné uložení
    const hashedPassword = security.hashPassword(password);
    
    // Vytvoření nového uživatele
    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      username,
      password: hashedPassword
    };

    this.users.push(newUser);
    this.saveUsers();

    console.log(`Uživatel ${username} byl úspěšně zaregistrován`);
    return newUser;
  }

  /**
   * Přihlášení uživatele
   * @param email - Email uživatele
   * @param password - Heslo
   * @returns Promise s session daty
   */
  async login(email: string, password: string): Promise<{ user: User; session: Session }> {
    console.log('Login attempt:', { email });
    
    // Sanitizace vstupu
    email = security.sanitizeInput(email);
    password = security.sanitizeInput(password);

    // Kontrola formátu emailu
    if (!security.validateEmail(email)) {
      console.log('Invalid email format');
      throw new Error('Neplatný formát emailu');
    }

    // Hledání uživatele
    const user = this.users.find(u => u.email === email);
    console.log('User lookup:', { email, found: !!user });
    
    if (!user) {
      throw new Error('Neplatný email nebo heslo');
    }

    // Ověření hesla
    const passwordValid = security.verifyPassword(password, user.password);
    console.log('Password verification:', { email, valid: passwordValid });
    
    if (!passwordValid) {
      throw new Error('Neplatný email nebo heslo');
    }

    // Vytvoření session
    const session: Session = {
      id: crypto.randomUUID(),
      userId: user.id,
      user,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hodin
    };

    this.sessions.push(session);
    this.saveSessions();

    console.log('Login successful:', { email, sessionId: session.id });
    return { user, session };
  }

  /**
   * Odhlášení uživatele
   * @param sessionId - ID session k ukončení
   * @returns Promise s výsledkem odhlášení
   */
  async logout(sessionId: string): Promise<void> {
    this.sessions = this.sessions.filter(s => s.id !== sessionId);
    this.saveSessions();
  }

  /**
   * Získání session podle ID
   * @param sessionId - ID session
   * @returns Session nebo null, pokud neexistuje
   */
  getSession(sessionId: string): Session | undefined {
    const session = this.sessions.find(s => s.id === sessionId);
    if (session) {
      const user = this.users.find(u => u.id === session.userId);
      if (user) {
        return {
          ...session,
          user
        };
      }
    }
    return undefined;
  }

  /**
   * Získání uživatele podle ID
   * @param userId - ID uživatele
   * @returns Uživatel nebo null, pokud neexistuje
   */
  getUser(userId: string): User | undefined {
    return this.users.find(u => u.id === userId);
  }
} 