// electron/osc.d.ts

/**
 * Type declarations for the 'osc' module.
 *
 * This module provides a basic interface for sending and receiving OSC (Open Sound Control)
 * messages over UDP. It defines options for configuring UDP ports, the UDPPort class to manage
 * OSC communication, and the structure of an OSC message.
 *
 * @module osc
 */

declare module 'osc' {
  /**
   * Options for configuring a UDPPort instance.
   *
   * @property localAddress - The local network address to bind to.
   * @property localPort - The local port to bind to.
   * @property remoteAddress - (Optional) The remote network address to send OSC messages to.
   * @property remotePort - (Optional) The remote port to send OSC messages to.
   * @property metadata - (Optional) If true, messages will include additional metadata.
   */
  export interface UDPPortOptions {
    localAddress: string;
    localPort: number;
    remoteAddress?: string;
    remotePort?: number;
    metadata?: boolean;
  }

  /**
   * Class representing a UDP port for OSC communication.
   *
   * Provides methods to open and close the port, send OSC messages, and register event handlers.
   */
  export class UDPPort {
    /**
     * Creates a new UDPPort instance.
     * @param options - Configuration options for the UDP port.
     */
    constructor(options: UDPPortOptions);

    /**
     * Opens the UDP port for communication.
     */
    open(): void;

    /**
     * Closes the UDP port.
     */
    close(): void;

    /**
     * Sends an OSC message.
     * @param message - The OSC message to be sent. It should typically follow the structure of OscMessage.
     */
    send(message: any): void;

    /**
     * Registers an event handler for a specific OSC event.
     *
     * @param event - The event type to listen for. Currently supports:
     *    - 'message': Triggered when an OSC message is received.
     *    - 'ready': Triggered when the UDP port is ready for communication.
     * @param callback - The callback function to execute when the event occurs.
     *    For 'message' events, the callback receives the OSC message, a time tag, and additional info.
     */
    on(
      event: 'message',
      callback: (oscMsg: OscMessage, timeTag: any, info: any) => void
    ): void;
    on(event: 'ready', callback: () => void): void;
  }

  /**
   * Represents an OSC (Open Sound Control) message.
   *
   * @property address - The OSC address pattern (similar to a URL path) indicating the message destination.
   * @property args - An array of arguments included with the message, each specifying a type and a value.
   */
  export interface OscMessage {
    address: string;
    args: Array<{ type: string; value: any }>;
  }
}
