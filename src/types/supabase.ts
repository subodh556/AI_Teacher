/**
 * This file defines the TypeScript types for the Supabase database schema.
 * It follows the ERD defined in the SSD document.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      Users: {
        Row: {
          id: string
          email: string
          name: string
          created_at: string
          last_login: string | null
          preferences: Json | null
        }
        Insert: {
          id: string
          email: string
          name: string
          created_at?: string
          last_login?: string | null
          preferences?: Json | null
        }
        Update: {
          id?: string
          email?: string
          name?: string
          created_at?: string
          last_login?: string | null
          preferences?: Json | null
        }
        Relationships: []
      }
      Topics: {
        Row: {
          id: string
          name: string
          description: string
          parent_id: string | null
          difficulty_level: number
        }
        Insert: {
          id?: string
          name: string
          description: string
          parent_id?: string | null
          difficulty_level: number
        }
        Update: {
          id?: string
          name?: string
          description?: string
          parent_id?: string | null
          difficulty_level?: number
        }
        Relationships: [
          {
            foreignKeyName: "Topics_parent_id_fkey"
            columns: ["parent_id"]
            referencedRelation: "Topics"
            referencedColumns: ["id"]
          }
        ]
      }
      Content: {
        Row: {
          id: string
          topic_id: string
          title: string
          content_type: string
          content_data: Json
          difficulty_level: number
        }
        Insert: {
          id?: string
          topic_id: string
          title: string
          content_type: string
          content_data: Json
          difficulty_level: number
        }
        Update: {
          id?: string
          topic_id?: string
          title?: string
          content_type?: string
          content_data?: Json
          difficulty_level?: number
        }
        Relationships: [
          {
            foreignKeyName: "Content_topic_id_fkey"
            columns: ["topic_id"]
            referencedRelation: "Topics"
            referencedColumns: ["id"]
          }
        ]
      }
      Assessments: {
        Row: {
          id: string
          title: string
          description: string
          topic_id: string
          adaptive: boolean
        }
        Insert: {
          id?: string
          title: string
          description: string
          topic_id: string
          adaptive: boolean
        }
        Update: {
          id?: string
          title?: string
          description?: string
          topic_id?: string
          adaptive?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "Assessments_topic_id_fkey"
            columns: ["topic_id"]
            referencedRelation: "Topics"
            referencedColumns: ["id"]
          }
        ]
      }
      Questions: {
        Row: {
          id: string
          assessment_id: string
          question_text: string
          question_type: string
          options: Json | null
          correct_answer: string
          difficulty_level: number
          explanation: string
        }
        Insert: {
          id?: string
          assessment_id: string
          question_text: string
          question_type: string
          options?: Json | null
          correct_answer: string
          difficulty_level: number
          explanation: string
        }
        Update: {
          id?: string
          assessment_id?: string
          question_text?: string
          question_type?: string
          options?: Json | null
          correct_answer?: string
          difficulty_level?: number
          explanation?: string
        }
        Relationships: [
          {
            foreignKeyName: "Questions_assessment_id_fkey"
            columns: ["assessment_id"]
            referencedRelation: "Assessments"
            referencedColumns: ["id"]
          }
        ]
      }
      UserProgress: {
        Row: {
          id: string
          user_id: string
          topic_id: string
          proficiency_level: number
          last_interaction: string
          completed: boolean
        }
        Insert: {
          id?: string
          user_id: string
          topic_id: string
          proficiency_level: number
          last_interaction: string
          completed: boolean
        }
        Update: {
          id?: string
          user_id?: string
          topic_id?: string
          proficiency_level?: number
          last_interaction?: string
          completed?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "UserProgress_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "UserProgress_topic_id_fkey"
            columns: ["topic_id"]
            referencedRelation: "Topics"
            referencedColumns: ["id"]
          }
        ]
      }
      UserAssessments: {
        Row: {
          id: string
          user_id: string
          assessment_id: string
          score: number
          completed_at: string
          answers: Json
        }
        Insert: {
          id?: string
          user_id: string
          assessment_id: string
          score: number
          completed_at: string
          answers: Json
        }
        Update: {
          id?: string
          user_id?: string
          assessment_id?: string
          score?: number
          completed_at?: string
          answers?: Json
        }
        Relationships: [
          {
            foreignKeyName: "UserAssessments_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "UserAssessments_assessment_id_fkey"
            columns: ["assessment_id"]
            referencedRelation: "Assessments"
            referencedColumns: ["id"]
          }
        ]
      }
      Achievements: {
        Row: {
          id: string
          name: string
          description: string
          criteria: Json
          icon_url: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          criteria: Json
          icon_url: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          criteria?: Json
          icon_url?: string
        }
        Relationships: []
      }
      UserAchievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          earned_at: string
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: string
          earned_at: string
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: string
          earned_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "UserAchievements_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "UserAchievements_achievement_id_fkey"
            columns: ["achievement_id"]
            referencedRelation: "Achievements"
            referencedColumns: ["id"]
          }
        ]
      }
      StudyPlans: {
        Row: {
          id: string
          user_id: string
          created_at: string
          updated_at: string
          plan_data: Json
          ai_generated: boolean
        }
        Insert: {
          id?: string
          user_id: string
          created_at: string
          updated_at: string
          plan_data: Json
          ai_generated: boolean
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          updated_at?: string
          plan_data?: Json
          ai_generated?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "StudyPlans_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "Users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
