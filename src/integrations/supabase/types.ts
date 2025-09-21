export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          amount: number | null
          created_at: string
          created_by: string
          done_at: string | null
          id: number
          lead_id: number
          notes: string | null
          scheduled_at: string | null
          type: Database["public"]["Enums"]["activity_type_enum"]
          updated_at: string
          workspace_id: number
        }
        Insert: {
          amount?: number | null
          created_at?: string
          created_by: string
          done_at?: string | null
          id?: number
          lead_id: number
          notes?: string | null
          scheduled_at?: string | null
          type: Database["public"]["Enums"]["activity_type_enum"]
          updated_at?: string
          workspace_id: number
        }
        Update: {
          amount?: number | null
          created_at?: string
          created_by?: string
          done_at?: string | null
          id?: number
          lead_id?: number
          notes?: string | null
          scheduled_at?: string | null
          type?: Database["public"]["Enums"]["activity_type_enum"]
          updated_at?: string
          workspace_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      availability_exceptions: {
        Row: {
          calendar_id: number
          created_at: string
          date: string
          end_time: string
          id: number
          is_open: boolean
          note: string | null
          start_time: string
          updated_at: string
          workspace_id: number
        }
        Insert: {
          calendar_id: number
          created_at?: string
          date: string
          end_time: string
          id?: number
          is_open?: boolean
          note?: string | null
          start_time: string
          updated_at?: string
          workspace_id: number
        }
        Update: {
          calendar_id?: number
          created_at?: string
          date?: string
          end_time?: string
          id?: number
          is_open?: boolean
          note?: string | null
          start_time?: string
          updated_at?: string
          workspace_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "availability_exceptions_calendar_id_fkey"
            columns: ["calendar_id"]
            isOneToOne: false
            referencedRelation: "calendars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "availability_exceptions_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      availability_rules: {
        Row: {
          active: boolean
          calendar_id: number
          created_at: string
          end_time: string
          id: number
          start_time: string
          updated_at: string
          weekday: number
          workspace_id: number
        }
        Insert: {
          active?: boolean
          calendar_id: number
          created_at?: string
          end_time: string
          id?: number
          start_time: string
          updated_at?: string
          weekday: number
          workspace_id: number
        }
        Update: {
          active?: boolean
          calendar_id?: number
          created_at?: string
          end_time?: string
          id?: number
          start_time?: string
          updated_at?: string
          weekday?: number
          workspace_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "availability_rules_calendar_id_fkey"
            columns: ["calendar_id"]
            isOneToOne: false
            referencedRelation: "calendars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "availability_rules_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      calendars: {
        Row: {
          created_at: string
          id: number
          name: string
          timezone: string
          workspace_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string
          timezone?: string
          workspace_id: number
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          timezone?: string
          workspace_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "calendars_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_tags: {
        Row: {
          lead_id: number
          tag_id: number
        }
        Insert: {
          lead_id: number
          tag_id: number
        }
        Update: {
          lead_id?: number
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "lead_tags_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          amount: number | null
          channel: Database["public"]["Enums"]["lead_channel_enum"] | null
          created_at: string
          due_at: string | null
          email: string | null
          full_name: string
          id: number
          last_contact_at: string | null
          next_step: string | null
          owner_id: string
          phone: string | null
          priority: Database["public"]["Enums"]["priority_enum"]
          score: number | null
          stage: Database["public"]["Enums"]["lead_stage_enum"]
          updated_at: string
          workspace_id: number
        }
        Insert: {
          amount?: number | null
          channel?: Database["public"]["Enums"]["lead_channel_enum"] | null
          created_at?: string
          due_at?: string | null
          email?: string | null
          full_name: string
          id?: number
          last_contact_at?: string | null
          next_step?: string | null
          owner_id: string
          phone?: string | null
          priority?: Database["public"]["Enums"]["priority_enum"]
          score?: number | null
          stage?: Database["public"]["Enums"]["lead_stage_enum"]
          updated_at?: string
          workspace_id: number
        }
        Update: {
          amount?: number | null
          channel?: Database["public"]["Enums"]["lead_channel_enum"] | null
          created_at?: string
          due_at?: string | null
          email?: string | null
          full_name?: string
          id?: number
          last_contact_at?: string | null
          next_step?: string | null
          owner_id?: string
          phone?: string | null
          priority?: Database["public"]["Enums"]["priority_enum"]
          score?: number | null
          stage?: Database["public"]["Enums"]["lead_stage_enum"]
          updated_at?: string
          workspace_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "leads_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          created_at: string
          id: number
          role: string
          user_id: string
          workspace_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          role?: string
          user_id: string
          workspace_id: number
        }
        Update: {
          created_at?: string
          id?: number
          role?: string
          user_id?: string
          workspace_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      session_reminders: {
        Row: {
          created_at: string
          id: number
          method: string
          send_at: string
          sent_at: string | null
          session_id: number
          status: string | null
          workspace_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          method?: string
          send_at: string
          sent_at?: string | null
          session_id: number
          status?: string | null
          workspace_id: number
        }
        Update: {
          created_at?: string
          id?: number
          method?: string
          send_at?: string
          sent_at?: string | null
          session_id?: number
          status?: string | null
          workspace_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "session_reminders_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_reminders_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "view_calendar_week"
            referencedColumns: ["session_id"]
          },
          {
            foreignKeyName: "session_reminders_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          calendar_id: number
          created_at: string
          created_by: string
          ends_at: string
          id: number
          lead_id: number | null
          notes: string | null
          price_eur: number | null
          starts_at: string
          status: Database["public"]["Enums"]["session_status_enum"]
          type: Database["public"]["Enums"]["session_type_enum"]
          updated_at: string
          workspace_id: number
        }
        Insert: {
          calendar_id: number
          created_at?: string
          created_by: string
          ends_at: string
          id?: number
          lead_id?: number | null
          notes?: string | null
          price_eur?: number | null
          starts_at: string
          status?: Database["public"]["Enums"]["session_status_enum"]
          type: Database["public"]["Enums"]["session_type_enum"]
          updated_at?: string
          workspace_id: number
        }
        Update: {
          calendar_id?: number
          created_at?: string
          created_by?: string
          ends_at?: string
          id?: number
          lead_id?: number | null
          notes?: string | null
          price_eur?: number | null
          starts_at?: string
          status?: Database["public"]["Enums"]["session_status_enum"]
          type?: Database["public"]["Enums"]["session_type_enum"]
          updated_at?: string
          workspace_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "sessions_calendar_id_fkey"
            columns: ["calendar_id"]
            isOneToOne: false
            referencedRelation: "calendars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          created_at: string
          id: number
          name: string
          workspace_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          workspace_id: number
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          workspace_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "tags_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          created_at: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      view_calendar_week: {
        Row: {
          calendar_id: number | null
          ends_at: string | null
          lead_id: number | null
          lead_name: string | null
          notes: string | null
          price_eur: number | null
          session_id: number | null
          starts_at: string | null
          status: Database["public"]["Enums"]["session_status_enum"] | null
          type: Database["public"]["Enums"]["session_type_enum"] | null
          workspace_id: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_calendar_id_fkey"
            columns: ["calendar_id"]
            isOneToOne: false
            referencedRelation: "calendars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      view_quick_availability: {
        Row: {
          calendar_id: number | null
          day: string | null
          end_time: string | null
          start_time: string | null
          workspace_id: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      activity_type_enum:
        | "S1"
        | "S2"
        | "Pago"
        | "Nota"
        | "Email"
        | "Llamada"
        | "Reunión"
        | "Mensaje"
      lead_channel_enum:
        | "instagram"
        | "google_ads"
        | "referido"
        | "orgánico"
        | "otros"
      lead_stage_enum:
        | "S1 reservado"
        | "S1 hecho"
        | "S2 reservado"
        | "Propuesta"
        | "Ganado"
        | "Perdido"
      priority_enum: "baja" | "media" | "alta" | "critica"
      session_status_enum: "scheduled" | "completed" | "cancelled" | "no_show"
      session_type_enum: "S1" | "S2" | "S3"
      Status: "Not started" | "Started" | "Completed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      activity_type_enum: [
        "S1",
        "S2",
        "Pago",
        "Nota",
        "Email",
        "Llamada",
        "Reunión",
        "Mensaje",
      ],
      lead_channel_enum: [
        "instagram",
        "google_ads",
        "referido",
        "orgánico",
        "otros",
      ],
      lead_stage_enum: [
        "S1 reservado",
        "S1 hecho",
        "S2 reservado",
        "Propuesta",
        "Ganado",
        "Perdido",
      ],
      priority_enum: ["baja", "media", "alta", "critica"],
      session_status_enum: ["scheduled", "completed", "cancelled", "no_show"],
      session_type_enum: ["S1", "S2", "S3"],
      Status: ["Not started", "Started", "Completed"],
    },
  },
} as const
