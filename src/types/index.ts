export type Role = 'admin' | 'dosen';

export interface User {
  username: string;
  password?: string;
  role: Role;
  name: string;
  nidn: string;
  isValidator: boolean;
  email?: string;
}

export interface SubmissionNotification {
  time: string;
  text: string;
}

export type SubmissionStatus =
  | 'Menunggu Penugasan Validator'
  | 'Menunggu Review Validator'
  | 'Revisi'
  | 'Menunggu Validasi Akhir Admin'
  | 'Selesai Valid';

export interface Submission {
  id: string;
  dosenNidn: string;
  dosenName: string;
  courseCode: string;
  courseName: string;
  examType: 'UTS' | 'UAS';
  semester: string;
  fileName: string;
  fileData?: string;
  fileUrl?: string; // Google Drive URL in live mode
  status: SubmissionStatus;
  validatorNidn: string;
  validatorName: string;
  notes: string;
  revisionFileName: string;
  revisionFileData?: string;
  revisionFileUrl?: string;
  validationSheetName: string;
  validationSheetData?: string;
  validationSheetUrl?: string;
  notifications: SubmissionNotification[];
  createdAt?: string;
}

export interface Course {
  code: string;
  name: string;
  sks?: number;
  semester?: string;
}

export interface SheetColumn {
  letter: string;
  header: string;
  type: string;
  description: string;
  example: string;
}

export interface SheetDefinition {
  sheetName: string;
  description: string;
  columns: SheetColumn[];
}
