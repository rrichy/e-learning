
export interface NoticeTableRowAttribute {
  id: number;
  author: string;
  subject: string;
  priority: number;
  publish_start: string;
  publish_end: string;
  shown_in_bulletin: boolean;
  shown_in_mail: boolean;
}

export type InquiryRowAttribute = {
  id: number;
  name: string;
  email: string;
  content: string;
  created_at: string;
};

export type MailRowAttribute = {
  id: number;
  title: string;
  content: string;
  priority: number;
  signature_id: number;
  reordered?: boolean;
};