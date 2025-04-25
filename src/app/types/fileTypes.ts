// types/fileTypes.ts

export interface FileType {
    _id: string;
    filename: string;
    url: string;
    tags?: string[];
    createdAt?: string;
    updatedAt?: string;
  }
  