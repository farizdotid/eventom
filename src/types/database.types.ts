/**
 * Tipe database, ditulis tangan sambil menunggu schema lengkap.
 * Setelah migration dijalankan di project Supabase, ganti seluruh file ini:
 *   npx supabase gen types typescript --linked > src/types/database.types.ts
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ProfileRole = "owner" | "admin" | "staff";
export type EventStatus = "Draft" | "Berlangsung" | "Selesai";
export type ParticipantStatus = "Hadir" | "Terlambat" | "Belum hadir";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: ProfileRole;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: ProfileRole;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role?: ProfileRole;
          created_at?: string;
        };
        Relationships: [];
      };
      events: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          slug: string;
          status: EventStatus;
          config: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          slug: string;
          status?: EventStatus;
          config?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          name?: string;
          slug?: string;
          status?: EventStatus;
          config?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      participants: {
        Row: {
          id: string;
          event_id: string;
          name: string;
          email: string;
          org: string | null;
          phone: string | null;
          code: string;
          status: ParticipantStatus;
          checked_in_at: string | null;
          registered_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          name: string;
          email: string;
          org?: string | null;
          phone?: string | null;
          code: string;
          status?: ParticipantStatus;
          checked_in_at?: string | null;
          registered_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          name?: string;
          email?: string;
          org?: string | null;
          phone?: string | null;
          code?: string;
          status?: ParticipantStatus;
          checked_in_at?: string | null;
          registered_at?: string;
        };
        Relationships: [];
      };
      certificates: {
        Row: {
          event_id: string;
          config: Json;
          issued: number;
          updated_at: string;
        };
        Insert: {
          event_id: string;
          config?: Json;
          issued?: number;
          updated_at?: string;
        };
        Update: {
          event_id?: string;
          config?: Json;
          issued?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
