interface QuestionAnswer {
  q: string;
  a: string;
}

interface Progress {
  updatedBy: string;
  status: "IN_PROGRESS" | "COMPLETED";
  updatedDate: string;
  message: string;
  img?: string;
}

interface Address {
  fullAddress: string;
  street: string;
  village: string;
  district: string;
  lat: string;
  lng: string;
}

export interface ReportCellType {
  id: string;
  title: string;
  address: Address;
  createdDate: string;
  category: string;
  status: "COMPLETED" | "IN_PROGRESS" | "PENDING";
  priority: "LOW" | "MID" | "HIGH" | "CRITICAL";
}

export interface Report extends ReportCellType {
  description: string;
  category:
    | "kebijakan-publik"
    | "kondisi-jalan"
    | "fasilitas-umum"
    | "makanan-bergizi"
    | "program-pemerintah"
    | "keamanan"
    | "pungli"
    | "lainnya";
  images: string;
  data?: {
    follow_up_questions: QuestionAnswer[];
  } | null;
  rating: number;
  progress?: Progress | null;
}
