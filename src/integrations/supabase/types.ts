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
          id?: never
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
          id?: never
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
      analytics_events: {
        Row: {
          attributes: Json | null
          coach_id: string
          created_at: string
          event_name: string
          id: string
          webview: Database["public"]["Enums"]["webview_type"] | null
        }
        Insert: {
          attributes?: Json | null
          coach_id: string
          created_at?: string
          event_name: string
          id?: string
          webview?: Database["public"]["Enums"]["webview_type"] | null
        }
        Update: {
          attributes?: Json | null
          coach_id?: string
          created_at?: string
          event_name?: string
          id?: string
          webview?: Database["public"]["Enums"]["webview_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coach_rating"
            referencedColumns: ["coach_id"]
          },
          {
            foreignKeyName: "analytics_events_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coaches"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          calcom_event_id: string | null
          coach_id: string
          created_at: string
          email: string
          id: string
          marketing_consent: boolean
          name: string
          offering_id: string | null
          scheduled_at: string | null
          scheduled_tz: string | null
          status: Database["public"]["Enums"]["booking_status"]
          stripe_payment_intent_id: string | null
          stripe_setup_intent_id: string | null
          updated_at: string
        }
        Insert: {
          calcom_event_id?: string | null
          coach_id: string
          created_at?: string
          email: string
          id?: string
          marketing_consent?: boolean
          name: string
          offering_id?: string | null
          scheduled_at?: string | null
          scheduled_tz?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          stripe_payment_intent_id?: string | null
          stripe_setup_intent_id?: string | null
          updated_at?: string
        }
        Update: {
          calcom_event_id?: string | null
          coach_id?: string
          created_at?: string
          email?: string
          id?: string
          marketing_consent?: boolean
          name?: string
          offering_id?: string | null
          scheduled_at?: string | null
          scheduled_tz?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          stripe_payment_intent_id?: string | null
          stripe_setup_intent_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coach_rating"
            referencedColumns: ["coach_id"]
          },
          {
            foreignKeyName: "bookings_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coaches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_offering_id_fkey"
            columns: ["offering_id"]
            isOneToOne: false
            referencedRelation: "offerings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_offering_id_fkey"
            columns: ["offering_id"]
            isOneToOne: false
            referencedRelation: "public_offerings"
            referencedColumns: ["id"]
          },
        ]
      }
      calcom_events: {
        Row: {
          data: Json
          id: string
          processed: boolean
          received_at: string
          type: string
        }
        Insert: {
          data: Json
          id: string
          processed?: boolean
          received_at?: string
          type: string
        }
        Update: {
          data?: Json
          id?: string
          processed?: boolean
          received_at?: string
          type?: string
        }
        Relationships: []
      }
      calendar_sources: {
        Row: {
          coach_id: string
          created_at: string
          external_username: string
          id: string
          is_active: boolean
          provider: string
        }
        Insert: {
          coach_id: string
          created_at?: string
          external_username: string
          id?: string
          is_active?: boolean
          provider?: string
        }
        Update: {
          coach_id?: string
          created_at?: string
          external_username?: string
          id?: string
          is_active?: boolean
          provider?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_sources_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coach_rating"
            referencedColumns: ["coach_id"]
          },
          {
            foreignKeyName: "calendar_sources_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coaches"
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
          id?: never
          name?: string
          timezone?: string
          workspace_id: number
        }
        Update: {
          created_at?: string
          id?: never
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
      coach_policies: {
        Row: {
          coach_id: string
          created_at: string
          quiet_from: string
          quiet_timezone: string
          quiet_to: string
          retention_facturacion: unknown
          retention_s1_sin_s2: unknown
        }
        Insert: {
          coach_id: string
          created_at?: string
          quiet_from?: string
          quiet_timezone?: string
          quiet_to?: string
          retention_facturacion?: unknown
          retention_s1_sin_s2?: unknown
        }
        Update: {
          coach_id?: string
          created_at?: string
          quiet_from?: string
          quiet_timezone?: string
          quiet_to?: string
          retention_facturacion?: unknown
          retention_s1_sin_s2?: unknown
        }
        Relationships: [
          {
            foreignKeyName: "coach_policies_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: true
            referencedRelation: "coach_rating"
            referencedColumns: ["coach_id"]
          },
          {
            foreignKeyName: "coach_policies_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: true
            referencedRelation: "coaches"
            referencedColumns: ["id"]
          },
        ]
      }
      coach_profiles: {
        Row: {
          average_rating: number | null
          bio: string
          coaching_methods: string[] | null
          created_at: string
          currency: string | null
          hourly_rate: number | null
          id: string
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
          hourly_rate?: number | null
          id?: string
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
          hourly_rate?: number | null
          id?: string
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
      coaches: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string
          id: string
          is_published: boolean
          languages: string[] | null
          location: string | null
          profile_id: string
          role_label: string | null
          social_instagram: string | null
          social_tiktok: string | null
          specialties: string[] | null
          updated_at: string
          whatsapp_enabled: boolean
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name: string
          id?: string
          is_published?: boolean
          languages?: string[] | null
          location?: string | null
          profile_id: string
          role_label?: string | null
          social_instagram?: string | null
          social_tiktok?: string | null
          specialties?: string[] | null
          updated_at?: string
          whatsapp_enabled?: boolean
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string
          id?: string
          is_published?: boolean
          languages?: string[] | null
          location?: string | null
          profile_id?: string
          role_label?: string | null
          social_instagram?: string | null
          social_tiktok?: string | null
          specialties?: string[] | null
          updated_at?: string
          whatsapp_enabled?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "coaches_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      consent_logs: {
        Row: {
          booking_id: string
          consent_id: string
          granted: boolean
          granted_at: string
          id: string
        }
        Insert: {
          booking_id: string
          consent_id: string
          granted?: boolean
          granted_at?: string
          id?: string
        }
        Update: {
          booking_id?: string
          consent_id?: string
          granted?: boolean
          granted_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "consent_logs_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consent_logs_consent_id_fkey"
            columns: ["consent_id"]
            isOneToOne: false
            referencedRelation: "consents"
            referencedColumns: ["id"]
          },
        ]
      }
      consents: {
        Row: {
          id: string
          legal_base: Database["public"]["Enums"]["consent_base"]
          scope: string[]
        }
        Insert: {
          id: string
          legal_base: Database["public"]["Enums"]["consent_base"]
          scope: string[]
        }
        Update: {
          id?: string
          legal_base?: Database["public"]["Enums"]["consent_base"]
          scope?: string[]
        }
        Relationships: []
      }
      faq: {
        Row: {
          answer: string
          coach_id: string
          created_at: string
          id: string
          position: number
          question: string
        }
        Insert: {
          answer: string
          coach_id: string
          created_at?: string
          id?: string
          position?: number
          question: string
        }
        Update: {
          answer?: string
          coach_id?: string
          created_at?: string
          id?: string
          position?: number
          question?: string
        }
        Relationships: [
          {
            foreignKeyName: "faq_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coach_rating"
            referencedColumns: ["coach_id"]
          },
          {
            foreignKeyName: "faq_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coaches"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_flags: {
        Row: {
          coach_id: string
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          coach_id: string
          id?: string
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          coach_id?: string
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "feature_flags_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coach_rating"
            referencedColumns: ["coach_id"]
          },
          {
            foreignKeyName: "feature_flags_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coaches"
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
          id?: never
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
          id?: never
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
      lib_screen_json: {
        Row: {
          app: Json
          created_at: string
          handle: string
          id: string
          updated_at: string
        }
        Insert: {
          app: Json
          created_at?: string
          handle: string
          id?: string
          updated_at?: string
        }
        Update: {
          app?: Json
          created_at?: string
          handle?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
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
          id?: never
          role?: string
          user_id: string
          workspace_id: number
        }
        Update: {
          created_at?: string
          id?: never
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
      offerings: {
        Row: {
          badge: string | null
          coach_id: string
          created_at: string
          currency: Database["public"]["Enums"]["currency"]
          duration_min: number
          id: string
          is_active: boolean
          position: number
          price: number | null
          title: string
          type: Database["public"]["Enums"]["offering_type"]
        }
        Insert: {
          badge?: string | null
          coach_id: string
          created_at?: string
          currency?: Database["public"]["Enums"]["currency"]
          duration_min: number
          id?: string
          is_active?: boolean
          position?: number
          price?: number | null
          title: string
          type: Database["public"]["Enums"]["offering_type"]
        }
        Update: {
          badge?: string | null
          coach_id?: string
          created_at?: string
          currency?: Database["public"]["Enums"]["currency"]
          duration_min?: number
          id?: string
          is_active?: boolean
          position?: number
          price?: number | null
          title?: string
          type?: Database["public"]["Enums"]["offering_type"]
        }
        Relationships: [
          {
            foreignKeyName: "offerings_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coach_rating"
            referencedColumns: ["coach_id"]
          },
          {
            foreignKeyName: "offerings_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coaches"
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
          email: string
          email_confirm: boolean | null
          email_notifications: boolean | null
          full_name: string
          handle: string
          id: string
          is_active: boolean
          language: string | null
          marketing_emails: boolean | null
          phone: string | null
          push_notifications: boolean | null
          role: Database["public"]["Enums"]["user_role_enum"]
          status: string | null
          timezone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          email: string
          email_confirm?: boolean | null
          email_notifications?: boolean | null
          full_name: string
          handle: string
          id?: string
          is_active?: boolean
          language?: string | null
          marketing_emails?: boolean | null
          phone?: string | null
          push_notifications?: boolean | null
          role?: Database["public"]["Enums"]["user_role_enum"]
          status?: string | null
          timezone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          email?: string
          email_confirm?: boolean | null
          email_notifications?: boolean | null
          full_name?: string
          handle?: string
          id?: string
          is_active?: boolean
          language?: string | null
          marketing_emails?: boolean | null
          phone?: string | null
          push_notifications?: boolean | null
          role?: Database["public"]["Enums"]["user_role_enum"]
          status?: string | null
          timezone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reels: {
        Row: {
          coach_id: string
          created_at: string
          duration_seconds: number | null
          headline: string | null
          id: string
          is_featured: boolean
          poster_url: string | null
          transcript: string | null
          video_url: string
        }
        Insert: {
          coach_id: string
          created_at?: string
          duration_seconds?: number | null
          headline?: string | null
          id?: string
          is_featured?: boolean
          poster_url?: string | null
          transcript?: string | null
          video_url: string
        }
        Update: {
          coach_id?: string
          created_at?: string
          duration_seconds?: number | null
          headline?: string | null
          id?: string
          is_featured?: boolean
          poster_url?: string | null
          transcript?: string | null
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "reels_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coach_rating"
            referencedColumns: ["coach_id"]
          },
          {
            foreignKeyName: "reels_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coaches"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          author_name: string | null
          coach_id: string
          created_at: string
          id: string
          published_at: string | null
          rating: number
          text: string | null
        }
        Insert: {
          author_name?: string | null
          coach_id: string
          created_at?: string
          id?: string
          published_at?: string | null
          rating: number
          text?: string | null
        }
        Update: {
          author_name?: string | null
          coach_id?: string
          created_at?: string
          id?: string
          published_at?: string | null
          rating?: number
          text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coach_rating"
            referencedColumns: ["coach_id"]
          },
          {
            foreignKeyName: "reviews_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coaches"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_pages: {
        Row: {
          canonical_url: string | null
          coach_id: string
          id: string
          meta_description: string | null
          meta_title: string
          noindex: boolean
          og_image_url: string | null
          route: string
        }
        Insert: {
          canonical_url?: string | null
          coach_id: string
          id?: string
          meta_description?: string | null
          meta_title: string
          noindex?: boolean
          og_image_url?: string | null
          route: string
        }
        Update: {
          canonical_url?: string | null
          coach_id?: string
          id?: string
          meta_description?: string | null
          meta_title?: string
          noindex?: boolean
          og_image_url?: string | null
          route?: string
        }
        Relationships: [
          {
            foreignKeyName: "seo_pages_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coach_rating"
            referencedColumns: ["coach_id"]
          },
          {
            foreignKeyName: "seo_pages_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coaches"
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
          coach_profile_id: string | null
          created_at: string
          created_by: string
          description: string | null
          ends_at: string
          id: string
          location: string | null
          meeting_link: string | null
          notes: string | null
          price_eur: number | null
          session_type: string | null
          starts_at: string
          status: Database["public"]["Enums"]["session_status_enum"]
          title: string | null
          type: Database["public"]["Enums"]["session_type_enum"]
          updated_at: string
          workspace_id: number
        }
        Insert: {
          calendar_id?: number
          cancellation_reason?: string | null
          cancelled_at?: string | null
          client_notes?: string | null
          client_profile_id?: string | null
          coach_notes?: string | null
          coach_profile_id?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          ends_at: string
          id?: string
          location?: string | null
          meeting_link?: string | null
          notes?: string | null
          price_eur?: number | null
          session_type?: string | null
          starts_at: string
          status?: Database["public"]["Enums"]["session_status_enum"]
          title?: string | null
          type?: Database["public"]["Enums"]["session_type_enum"]
          updated_at?: string
          workspace_id?: number
        }
        Update: {
          calendar_id?: number
          cancellation_reason?: string | null
          cancelled_at?: string | null
          client_notes?: string | null
          client_profile_id?: string | null
          coach_notes?: string | null
          coach_profile_id?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          ends_at?: string
          id?: string
          location?: string | null
          meeting_link?: string | null
          notes?: string | null
          price_eur?: number | null
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
      showup_stats: {
        Row: {
          coach_id: string
          created_at: string
          id: string
          period: unknown
          showup_percent: number
        }
        Insert: {
          coach_id: string
          created_at?: string
          id?: string
          period: unknown
          showup_percent: number
        }
        Update: {
          coach_id?: string
          created_at?: string
          id?: string
          period?: unknown
          showup_percent?: number
        }
        Relationships: [
          {
            foreignKeyName: "showup_stats_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coach_rating"
            referencedColumns: ["coach_id"]
          },
          {
            foreignKeyName: "showup_stats_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coaches"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_events: {
        Row: {
          data: Json
          id: string
          processed: boolean
          received_at: string
          type: string
        }
        Insert: {
          data: Json
          id: string
          processed?: boolean
          received_at?: string
          type: string
        }
        Update: {
          data?: Json
          id?: string
          processed?: boolean
          received_at?: string
          type?: string
        }
        Relationships: []
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
          id?: never
          name: string
          workspace_id: number
        }
        Update: {
          created_at?: string
          id?: never
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
          id?: never
          name: string
        }
        Update: {
          created_at?: string
          id?: never
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      coach_rating: {
        Row: {
          coach_id: string | null
          rating_avg: number | null
          rating_count: number | null
        }
        Relationships: []
      }
      coach_showup: {
        Row: {
          coach_id: string | null
          showup_percent: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coach_rating"
            referencedColumns: ["coach_id"]
          },
          {
            foreignKeyName: "bookings_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coaches"
            referencedColumns: ["id"]
          },
        ]
      }
      public_offerings: {
        Row: {
          badge: string | null
          coach_id: string | null
          created_at: string | null
          currency: Database["public"]["Enums"]["currency"] | null
          duration_min: number | null
          id: string | null
          is_active: boolean | null
          position: number | null
          price: number | null
          title: string | null
          type: Database["public"]["Enums"]["offering_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "offerings_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coach_rating"
            referencedColumns: ["coach_id"]
          },
          {
            foreignKeyName: "offerings_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coaches"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      create_s1_booking: {
        Args: {
          p_coach_id: string
          p_email: string
          p_marketing_consent?: boolean
          p_name: string
        }
        Returns: string
      }
      current_profile_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_profile_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      update_user_role: {
        Args: { new_role: string; user_email: string }
        Returns: undefined
      }
      verify_uuid_consistency: {
        Args: Record<PropertyKey, never>
        Returns: {
          table_name: string
          total_records: number
          uuid_columns: number
        }[]
      }
    }
    Enums: {
      activity_type_enum: "call" | "email" | "meeting" | "note" | "task"
      booking_status:
        | "pending"
        | "confirmed"
        | "canceled"
        | "no_show"
        | "completed"
      channel_enum:
        | "instagram"
        | "tiktok"
        | "lib"
        | "seo"
        | "referral"
        | "ads"
        | "otros"
      consent_base: "Art. 6.1.a" | "Art. 6.1.b"
      currency: "EUR" | "USD" | "GBP"
      flag_state: "on" | "off"
      lead_channel_enum:
        | "web"
        | "phone"
        | "email"
        | "social"
        | "referral"
        | "organic"
      lead_stage_enum:
        | "S1 reservado"
        | "S1 realizado"
        | "S2 vendido"
        | "S2 realizado"
        | "cerrado ganado"
        | "cerrado perdido"
      offering_type: "S1" | "S2" | "S3" | "package"
      priority_enum: "baja" | "media" | "alta" | "urgente"
      role: "coach" | "psychologist" | "admin" | "staff"
      session_status_enum:
        | "scheduled"
        | "confirmed"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "no_show"
      session_type_enum: "S1" | "S2" | "follow_up" | "consultation"
      user_role_enum: "client" | "coach" | "admin" | "psychologist" | "staff"
      webview_type: "instagram" | "tiktok" | "other"
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
      activity_type_enum: ["call", "email", "meeting", "note", "task"],
      booking_status: [
        "pending",
        "confirmed",
        "canceled",
        "no_show",
        "completed",
      ],
      channel_enum: [
        "instagram",
        "tiktok",
        "lib",
        "seo",
        "referral",
        "ads",
        "otros",
      ],
      consent_base: ["Art. 6.1.a", "Art. 6.1.b"],
      currency: ["EUR", "USD", "GBP"],
      flag_state: ["on", "off"],
      lead_channel_enum: [
        "web",
        "phone",
        "email",
        "social",
        "referral",
        "organic",
      ],
      lead_stage_enum: [
        "S1 reservado",
        "S1 realizado",
        "S2 vendido",
        "S2 realizado",
        "cerrado ganado",
        "cerrado perdido",
      ],
      offering_type: ["S1", "S2", "S3", "package"],
      priority_enum: ["baja", "media", "alta", "urgente"],
      role: ["coach", "psychologist", "admin", "staff"],
      session_status_enum: [
        "scheduled",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
        "no_show",
      ],
      session_type_enum: ["S1", "S2", "follow_up", "consultation"],
      user_role_enum: ["client", "coach", "admin", "psychologist", "staff"],
      webview_type: ["instagram", "tiktok", "other"],
    },
  },
} as const
