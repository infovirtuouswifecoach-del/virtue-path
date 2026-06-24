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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          created_at: string
          event_path: string | null
          event_type: string
          id: string
          metadata: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          event_path?: string | null
          event_type: string
          id?: string
          metadata?: Json
          user_id: string
        }
        Update: {
          created_at?: string
          event_path?: string | null
          event_type?: string
          id?: string
          metadata?: Json
          user_id?: string
        }
        Relationships: []
      }
      assessment_responses: {
        Row: {
          created_at: string
          id: string
          scores: Json
          strongest_pillar: string | null
          user_id: string
          weakest_pillar: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          scores: Json
          strongest_pillar?: string | null
          user_id: string
          weakest_pillar?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          scores?: Json
          strongest_pillar?: string | null
          user_id?: string
          weakest_pillar?: string | null
        }
        Relationships: []
      }
      calendar_events: {
        Row: {
          created_at: string
          event_date: string
          event_type: string
          id: string
          notes: string | null
          recurring: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_date: string
          event_type?: string
          id?: string
          notes?: string | null
          recurring?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_date?: string
          event_type?: string
          id?: string
          notes?: string | null
          recurring?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_completions: {
        Row: {
          created_at: string
          day: string
          id: string
          items: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          day?: string
          id?: string
          items?: Json
          user_id: string
        }
        Update: {
          created_at?: string
          day?: string
          id?: string
          items?: Json
          user_id?: string
        }
        Relationships: []
      }
      dare_completions: {
        Row: {
          completed_at: string
          dare_id: string
          dare_title: string | null
          id: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          dare_id: string
          dare_title?: string | null
          id?: string
          user_id: string
        }
        Update: {
          completed_at?: string
          dare_id?: string
          dare_title?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      gratitude_entries: {
        Row: {
          created_at: string
          day: string
          id: string
          items: string[]
          user_id: string
        }
        Insert: {
          created_at?: string
          day?: string
          id?: string
          items?: string[]
          user_id: string
        }
        Update: {
          created_at?: string
          day?: string
          id?: string
          items?: string[]
          user_id?: string
        }
        Relationships: []
      }
      memories: {
        Row: {
          created_at: string
          id: string
          latitude: number | null
          location_name: string
          longitude: number | null
          memory_date: string | null
          note: string | null
          photo_url: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          latitude?: number | null
          location_name: string
          longitude?: number | null
          memory_date?: string | null
          note?: string | null
          photo_url?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          latitude?: number | null
          location_name?: string
          longitude?: number | null
          memory_date?: string | null
          note?: string | null
          photo_url?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      prayer_entries: {
        Row: {
          answered: boolean
          answered_at: string | null
          body: string | null
          created_at: string
          id: string
          title: string
          user_id: string
        }
        Insert: {
          answered?: boolean
          answered_at?: string | null
          body?: string | null
          created_at?: string
          id?: string
          title: string
          user_id: string
        }
        Update: {
          answered?: boolean
          answered_at?: string | null
          body?: string | null
          created_at?: string
          id?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          biggest_struggle: string | null
          children: Json
          created_at: string
          display_name: string | null
          going_well: string | null
          husband_name: string | null
          marital_status: string | null
          marriage_date: string | null
          marriage_length_years: number | null
          onboarded: boolean
          spiritual_season: string | null
          timezone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          biggest_struggle?: string | null
          children?: Json
          created_at?: string
          display_name?: string | null
          going_well?: string | null
          husband_name?: string | null
          marital_status?: string | null
          marriage_date?: string | null
          marriage_length_years?: number | null
          onboarded?: boolean
          spiritual_season?: string | null
          timezone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          biggest_struggle?: string | null
          children?: Json
          created_at?: string
          display_name?: string | null
          going_well?: string | null
          husband_name?: string | null
          marital_status?: string | null
          marriage_date?: string | null
          marriage_length_years?: number | null
          onboarded?: boolean
          spiritual_season?: string | null
          timezone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      shop_products: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          external_url: string | null
          id: string
          image_url: string | null
          price_cents: number | null
          product_type: string
          published: boolean
          sort_order: number
          title: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          external_url?: string | null
          id?: string
          image_url?: string | null
          price_cents?: number | null
          product_type?: string
          published?: boolean
          sort_order?: number
          title: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          external_url?: string | null
          id?: string
          image_url?: string | null
          price_cents?: number | null
          product_type?: string
          published?: boolean
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
      soap_entries: {
        Row: {
          application: string | null
          created_at: string
          day: string
          id: string
          observation: string | null
          prayer: string | null
          scripture_ref: string | null
          scripture_text: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          application?: string | null
          created_at?: string
          day?: string
          id?: string
          observation?: string | null
          prayer?: string | null
          scripture_ref?: string | null
          scripture_text?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          application?: string | null
          created_at?: string
          day?: string
          id?: string
          observation?: string | null
          prayer?: string | null
          scripture_ref?: string | null
          scripture_text?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          category: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          published: boolean
          sort_order: number
          thumbnail_url: string | null
          title: string
          youtube_url: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          published?: boolean
          sort_order?: number
          thumbnail_url?: string | null
          title: string
          youtube_url: string
        }
        Update: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          published?: boolean
          sort_order?: number
          thumbnail_url?: string | null
          title?: string
          youtube_url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "member"
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
      app_role: ["admin", "member"],
    },
  },
} as const
