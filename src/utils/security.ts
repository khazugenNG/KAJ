import { SHA256 } from 'crypto-js';

// Salt pro hashování hesel - v produkci by měl být uložen v .env souboru
const SALT = 'noteflow-salt-2024';

export const security = {
  /**
   * Hashuje heslo pomocí SHA-256 a soli
   * V produkci by se mělo použít bcrypt nebo Argon2
   */
  hashPassword(password: string): string {
    const hash = SHA256(password + SALT).toString();
    console.log('Hashování hesla:', { password, salt: SALT, hash });
    return hash;
  },

  /**
   * Porovná heslo s hashem
   */
  verifyPassword(password: string, hash: string): boolean {
    const newHash = this.hashPassword(password);
    console.log('Ověřování hesla:', { password, storedHash: hash, newHash, match: newHash === hash });
    return newHash === hash;
  },

  /**
   * Generuje bezpečný token pro session
   */
  generateSessionToken(): string {
    return SHA256(Date.now().toString() + Math.random().toString()).toString();
  },

  /**
   * Sanitizuje uživatelský vstup proti XSS
   */
  sanitizeInput(input: string): string {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  },

  /**
   * Validuje email adresu
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validuje heslo (minimálně 8 znaků, alespoň jedno velké písmeno, jedno malé písmeno a jedno číslo)
   */
  validatePassword(password: string): boolean {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    const isValid = passwordRegex.test(password);
    console.log('Validace hesla:', { password, isValid });
    return isValid;
  },

  /**
   * Validuje uživatelské jméno (3-20 znaků, pouze písmena, čísla a podtržítko)
   */
  validateUsername(username: string): boolean {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  }
}; 