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
          job: string | null;
          code: string;
          status: ParticipantStatus;
          checked_in_at: string | null;
          registered_at: string;
          cert_seq: number | null;
        };
        Insert: {
          id?: string;
          event_id: string;
          name: string;
          email: string;
          org?: string | null;
          phone?: string | null;
          job?: string | null;
          code: string;
          status?: ParticipantStatus;
          checked_in_at?: string | null;
          registered_at?: string;
          cert_seq?: number | null;
        };
        Update: {
          id?: string;
          event_id?: string;
          name?: string;
          email?: string;
          org?: string | null;
          phone?: string | null;
          job?: string | null;
          code?: string;
          status?: ParticipantStatus;
          checked_in_at?: string | null;
          registered_at?: string;
          cert_seq?: number | null;
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
      public_event: {
        Args: { p_slug: string };
        Returns: Json;
      };
      check_in: {
        Args: { p_slug: string; p_code: string };
        Returns: Json;
      };
      verify_certificate: {
        Args: { p_code: string };
        Returns: Json;
      };
      register_participant: {
        Args: {
          p_slug: string;
          p_name: string;
          p_email: string;
          p_org?: string | null;
          p_phone?: string | null;
          p_job?: string | null;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
