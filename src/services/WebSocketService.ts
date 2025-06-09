/**
 * WebSocket služba pro real-time komunikaci
 * 
 * Poskytuje:
 * - Automatické připojení a opětovné připojení
 * - Event-driven architekturu
 * - Heartbeat systém pro kontrolu připojení
 * - Simulaci real-time aktualizací
 * 
 * @author Mike
 * @version 1.0.0
 */

export class WebSocketService {
  private ws: WebSocket | null = null; // WebSocket instance
  private reconnectAttempts = 0; // Počet pokusů o opětovné připojení
  private maxReconnectAttempts = 5; // Maximální počet pokusů
  private reconnectInterval = 1000; // Základní interval mezi pokusy (ms)
  private listeners: Map<string, Function[]> = new Map(); // Event listeners

  /**
   * Konstruktor WebSocket služby
   * @param url - URL WebSocket serveru (výchozí: echo.websocket.org pro testování)
   */
  constructor(private url: string = 'wss://echo.websocket.org') {}

  /**
   * Připojení k WebSocket serveru
   * @returns Promise, který se vyřeší při úspěšném připojení
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);
        
        // Úspěšné připojení
        this.ws.onopen = () => {
          console.log('WebSocket připojen');
          this.reconnectAttempts = 0;
          resolve();
        };

        // Příjem zprávy
        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
          } catch (error) {
            console.error('Chyba při parsování WebSocket zprávy:', error);
          }
        };

        // Uzavření spojení
        this.ws.onclose = () => {
          console.log('WebSocket odpojen');
          this.attemptReconnect();
        };

        // Chyba spojení
        this.ws.onerror = (error) => {
          console.error('WebSocket chyba:', error);
          reject(error);
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Pokus o opětovné připojení při výpadku
   * Používá exponenciální backoff strategii
   */
  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Pokus o opětovné připojení ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      
      setTimeout(() => {
        this.connect().catch(() => {
          // Reconnect failed, will try again
        });
      }, this.reconnectInterval * this.reconnectAttempts);
    }
  }

  /**
   * Odpojení od WebSocket serveru
   */
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * Odeslání zprávy přes WebSocket
   * @param data - Data k odeslání (budou automaticky serializována do JSON)
   */
  send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket není připojen');
    }
  }

  /**
   * Registrace event listeneru
   * @param event - Název události
   * @param callback - Callback funkce
   */
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  /**
   * Odebrání event listeneru
   * @param event - Název události
   * @param callback - Callback funkce k odebrání
   */
  off(event: string, callback: Function) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * Zpracování příchozí zprávy
   * Volá všechny registrované callback funkce pro daný typ události
   * @param data - Příchozí data ve formátu {type, payload}
   */
  private handleMessage(data: any) {
    const { type, payload } = data;
    const callbacks = this.listeners.get(type);
    if (callbacks) {
      callbacks.forEach(callback => callback(payload));
    }
  }

  /**
   * Simulace real-time aktualizací
   * Odesílá heartbeat zprávy každých 30 sekund
   */
  simulateRealTimeUpdates() {
    setInterval(() => {
      this.send({
        type: 'heartbeat',
        payload: {
          timestamp: Date.now(),
          status: 'online'
        }
      });
    }, 30000); // Každých 30 sekund
  }
}

// Export singleton instance
export const webSocketService = new WebSocketService(); 