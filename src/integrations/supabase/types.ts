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
      activity_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: number
          ip_address: unknown | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: number
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: number
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
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
      availability_schedules: {
        Row: {
          coach_id: number
          created_at: string
          day_of_week: number
          end_time: string
          id: number
          is_active: boolean | null
          start_time: string
        }
        Insert: {
          coach_id: number
          created_at?: string
          day_of_week: number
          end_time: string
          id?: number
          is_active?: boolean | null
          start_time: string
        }
        Update: {
          coach_id?: number
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: number
          is_active?: boolean | null
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "availability_schedules_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coach_profiles"
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
      categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: number
          is_active: boolean | null
          meta_description: string | null
          meta_title: string | null
          name: string
          slug: string
          sort_order: number | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: number
          is_active?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          slug: string
          sort_order?: number | null
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: number
          is_active?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          slug?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      coach_profiles: {
        Row: {
          average_rating: number | null
          bio: string
          coaching_methods: string[] | null
          created_at: string
          currency: string | null
          hourly_rate: number
          id: number
          instant_booking: boolean | null
          is_active: boolean | null
          is_featured: boolean | null
          languages: string[] | null
          response_time_hours: number | null
          specializations: string[] | null
          title: string
          total_reviews: number | null
          total_sessions: number | null
          updated_at: string
          user_id: string
          verification_status: string | null
          years_experience: number | null
        }
        Insert: {
          average_rating?: number | null
          bio: string
          coaching_methods?: string[] | null
          created_at?: string
          currency?: string | null
          hourly_rate: number
          id?: number
          instant_booking?: boolean | null
          is_active?: boolean | null
          is_featured?: boolean | null
          languages?: string[] | null
          response_time_hours?: number | null
          specializations?: string[] | null
          title: string
          total_reviews?: number | null
          total_sessions?: number | null
          updated_at?: string
          user_id: string
          verification_status?: string | null
          years_experience?: number | null
        }
        Update: {
          average_rating?: number | null
          bio?: string
          coaching_methods?: string[] | null
          created_at?: string
          currency?: string | null
          hourly_rate?: number
          id?: number
          instant_booking?: boolean | null
          is_active?: boolean | null
          is_featured?: boolean | null
          languages?: string[] | null
          response_time_hours?: number | null
          specializations?: string[] | null
          title?: string
          total_reviews?: number | null
          total_sessions?: number | null
          updated_at?: string
          user_id?: string
          verification_status?: string | null
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "coach_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
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
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          email_notifications: boolean
          id: string
          language: string
          marketing_emails: boolean
          phone: string | null
          push_notifications: boolean
          role: Database["public"]["Enums"]["user_role_enum"]
          status: string
          timezone: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          email_notifications?: boolean
          id?: string
          language?: string
          marketing_emails?: boolean
          phone?: string | null
          push_notifications?: boolean
          role?: Database["public"]["Enums"]["user_role_enum"]
          status?: string
          timezone?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          email_notifications?: boolean
          id?: string
          language?: string
          marketing_emails?: boolean
          phone?: string | null
          push_notifications?: boolean
          role?: Database["public"]["Enums"]["user_role_enum"]
          status?: string
          timezone?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          client_id: string
          coach_id: number
          comment: string | null
          created_at: string
          id: number
          is_public: boolean | null
          is_verified: boolean | null
          rating: number
          session_id: number
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          client_id: string
          coach_id: number
          comment?: string | null
          created_at?: string
          id?: number
          is_public?: boolean | null
          is_verified?: boolean | null
          rating: number
          session_id: number
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          client_id?: string
          coach_id?: number
          comment?: string | null
          created_at?: string
          id?: number
          is_public?: boolean | null
          is_verified?: boolean | null
          rating?: number
          session_id?: number
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "reviews_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coach_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: true
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: true
            referencedRelation: "view_calendar_week"
            referencedColumns: ["session_id"]
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
          cancellation_reason: string | null
          cancelled_at: string | null
          client_notes: string | null
          client_profile_id: string | null
          coach_notes: string | null
          coach_profile_id: number | null
          created_at: string
          created_by: string
          description: string | null
          ends_at: string
          id: number
          lead_id: number | null
          location: string | null
          meeting_id: string | null
          meeting_link: string | null
          notes: string | null
          price_eur: number | null
          session_recording: string | null
          session_type: string | null
          starts_at: string
          status: Database["public"]["Enums"]["session_status_enum"]
          title: string | null
          type: Database["public"]["Enums"]["session_type_enum"]
          updated_at: string
          workspace_id: number
        }
        Insert: {
          calendar_id: number
          cancellation_reason?: string | null
          cancelled_at?: string | null
          client_notes?: string | null
          client_profile_id?: string | null
          coach_notes?: string | null
          coach_profile_id?: number | null
          created_at?: string
          created_by: string
          description?: string | null
          ends_at: string
          id?: number
          lead_id?: number | null
          location?: string | null
          meeting_id?: string | null
          meeting_link?: string | null
          notes?: string | null
          price_eur?: number | null
          session_recording?: string | null
          session_type?: string | null
          starts_at: string
          status?: Database["public"]["Enums"]["session_status_enum"]
          title?: string | null
          type: Database["public"]["Enums"]["session_type_enum"]
          updated_at?: string
          workspace_id: number
        }
        Update: {
          calendar_id?: number
          cancellation_reason?: string | null
          cancelled_at?: string | null
          client_notes?: string | null
          client_profile_id?: string | null
          coach_notes?: string | null
          coach_profile_id?: number | null
          created_at?: string
          created_by?: string
          description?: string | null
          ends_at?: string
          id?: number
          lead_id?: number | null
          location?: string | null
          meeting_id?: string | null
          meeting_link?: string | null
          notes?: string | null
          price_eur?: number | null
          session_recording?: string | null
          session_type?: string | null
          starts_at?: string
          status?: Database["public"]["Enums"]["session_status_enum"]
          title?: string | null
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
            foreignKeyName: "sessions_client_profile_id_fkey"
            columns: ["client_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "sessions_coach_profile_id_fkey"
            columns: ["coach_profile_id"]
            isOneToOne: false
            referencedRelation: "coach_profiles"
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
      platform_stats: {
        Row: {
          active_coaches: number | null
          completed_sessions: number | null
          total_clients: number | null
          total_coaches: number | null
          total_revenue: number | null
          total_sessions: number | null
          total_users: number | null
        }
        Relationships: []
      }
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
      create_admin_user: {
        Args: { user_email: string }
        Returns: undefined
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
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
      user_role_enum: "client" | "coach" | "admin"
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
      user_role_enum: ["client", "coach", "admin"],
    },
  },
} as const
