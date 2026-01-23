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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      petition_signatures: {
        Row: {
          cdc_matricula: string
          consumo_valor_atual: string
          created_at: string
          documento: string
          email: string
          foto_conta_url: string | null
          id: string
          media_consumo: string
          nome: string
        }
        Insert: {
          cdc_matricula: string
          consumo_valor_atual: string
          created_at?: string
          documento: string
          email: string
          foto_conta_url?: string | null
          id?: string
          media_consumo: string
          nome: string
        }
        Update: {
          cdc_matricula?: string
          consumo_valor_atual?: string
          created_at?: string
          documento?: string
          email?: string
          foto_conta_url?: string | null
          id?: string
          media_consumo?: string
          nome?: string
        }
        Relationships: []
      }
      water_analyses: {
        Row: {
          cdc_dv: string
          charged_value: number
          consumption: number
          created_at: string
          current_reading: number
          current_reading_date: string
          cycle_days: number
          daily_consumption: number
          diagnosis_items: Json
          difference_absolute: number
          difference_percent: number
          fixed_fee: number
          historical_average: number | null
          historical_entries: Json
          id: string
          include_sewer: boolean
          normalized_consumption: number
          previous_reading: number
          previous_reading_date: string
          sewer_value: number
          tariff_breakdown: Json
          total_technical_value: number
          user_name: string
          volume_anomaly: number | null
          water_value: number
        }
        Insert: {
          cdc_dv: string
          charged_value: number
          consumption: number
          created_at?: string
          current_reading: number
          current_reading_date: string
          cycle_days: number
          daily_consumption: number
          diagnosis_items?: Json
          difference_absolute: number
          difference_percent: number
          fixed_fee: number
          historical_average?: number | null
          historical_entries?: Json
          id?: string
          include_sewer?: boolean
          normalized_consumption: number
          previous_reading: number
          previous_reading_date: string
          sewer_value: number
          tariff_breakdown?: Json
          total_technical_value: number
          user_name: string
          volume_anomaly?: number | null
          water_value: number
        }
        Update: {
          cdc_dv?: string
          charged_value?: number
          consumption?: number
          created_at?: string
          current_reading?: number
          current_reading_date?: string
          cycle_days?: number
          daily_consumption?: number
          diagnosis_items?: Json
          difference_absolute?: number
          difference_percent?: number
          fixed_fee?: number
          historical_average?: number | null
          historical_entries?: Json
          id?: string
          include_sewer?: boolean
          normalized_consumption?: number
          previous_reading?: number
          previous_reading_date?: string
          sewer_value?: number
          tariff_breakdown?: Json
          total_technical_value?: number
          user_name?: string
          volume_anomaly?: number | null
          water_value?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
