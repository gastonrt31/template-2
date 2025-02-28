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
      users: {
        Row: User
        Insert: Omit<User, 'id' | 'created_at' | 'stages' | 'qr_code'>
        Update: Partial<User>
      }
    }
  }
}

export interface User {
  id: string;
  name: string;
  license_plate: string;
  identity_card_number: string;
  qr_code: string;
  stages: {
    [key: string]: Stage;
  };
  created_at: string;
}

export interface Stage {
  status: 'PENDING' | 'CHECK';
  scan_time?: string;
}

export type StageNumber = '1' | '2' | '3'; 