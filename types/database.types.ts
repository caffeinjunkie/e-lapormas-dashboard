export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
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
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string;
          display_name: string;
          id: number;
          email: string;
          profile_img: string;
          is_super_admin: boolean;
          is_verified: boolean;
          rating: number;
          user_id: string;
          is_hidden: boolean;
        };
        Insert: {
          display_name?: string;
          email?: string;
          profile_img?: string;
          is_super_admin?: boolean;
          is_verified?: boolean;
          rating?: number;
          user_id?: string;
        };
        Update: {
          display_name?: string;
          email?: string;
          profile_img?: string;
          is_super_admin?: boolean;
          is_verified?: boolean;
          rating?: number;
          user_id?: string;
        };
        Relationships: [];
      };
      app_config: {
        Row: {
          id: number;
          org_name: string;
          timezone: string;
        };
        Insert: {
          org_name?: string;
          timezone?: string;
        };
        Update: {
          org_name?: string;
          timezone?: string;
        };
        Relationships: [];
      };
      general_statistics: {
        Row: {
          month_year: string;
          total_new_tasks: number;
          total_finished_tasks: number;
          current_in_progress_tasks: number;
          current_pending_tasks: number;
          current_completed_tasks: number;
          user_satisfactions: number;
        };
        Relationships: [];
      },
      location_statistics: {
        Row: {
          location: string;
          total_tasks: number;
          total_finished_tasks: number;
          flag_color: string;
        };
        Relationships: [];
      },
      category_statistics: {
        Row: {
          category: string;
          total_tasks: number;
          total_finished_tasks: number;
        };
        Relationships: [];
      },
      tasks: {
        Row: {
          address: Json | null;
          category: string;
          created_at: string | null;
          data: Json | null;
          description: string;
          id: string;
          images: string[] | null;
          priority: Database["public"]["Enums"]["task_priority"];
          progress: Json | null;
          rating: number | null;
          finished_at: string | null;
          status: Database["public"]["Enums"]["task_status"] | null;
          title: string;
          tracking_id: string;
        };
        Insert: {
          address?: Json | null;
          category: string;
          created_at?: string | null;
          data?: Json | null;
          description: string;
          id?: string;
          images?: string[] | null;
          priority: Database["public"]["Enums"]["task_priority"];
          progress?: Json | null;
          rating?: number | null;
          finished_at?: string | null;
          status?: Database["public"]["Enums"]["task_status"] | null;
          title: string;
          tracking_id: string;
        };
        Update: {
          address?: Json | null;
          category?: string;
          created_at?: string | null;
          data?: Json | null;
          description?: string;
          id?: string;
          images?: string[] | null;
          priority?: Database["public"]["Enums"]["task_priority"];
          progress?: Json | null;
          rating?: number | null;
          finished_at?: string | null;
          status?: Database["public"]["Enums"]["task_status"] | null;
          title?: string;
          tracking_id?: string;
        };
        Relationships: [];
      };
      timezones: {
        Row: {
          id: number;
          zone: string;
          key: string;
          utc: number;
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
      task_priority: "LOW" | "MID" | "HIGH" | "CRITICAL";
      task_status: "COMPLETED" | "IN_PROGRESS" | "PENDING";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;
