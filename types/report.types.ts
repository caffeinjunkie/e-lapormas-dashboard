interface QuestionAnswer {
  q: string;
  a: string;
}

interface Progress {
  updated_by: string;
  status: "IN_PROGRESS" | "COMPLETED";
  updated_at: string;
  message: string;
  img?: string;
}

interface Address {
  full_address: string;
  village: string;
  district: string;
  lat: string;
  lng: string;
}

export interface ReportCellType {
  id: string;
  tracking_id: string;
  title: string;
  address: Address;
  created_at: string;
  category:
    | "kebijakan-publik"
    | "kondisi-jalan"
    | "fasilitas-umum"
    | "makanan-bergizi"
    | "program-pemerintah"
    | "keamanan"
    | "pungli"
    | "lainnya";
  status: "COMPLETED" | "IN_PROGRESS" | "PENDING";
  priority: "LOW" | "MID" | "HIGH" | "CRITICAL";
}

export interface Report extends ReportCellType {
  description: string;
  images: string[];
  data?: {
    follow_up_questions: QuestionAnswer[];
  } | null;
  rating: number;
  progress?: Progress[] | null;
}
