export interface PaymentIntentData {
  clientSecret: string;
  paymentId: string;
  amount: number;
  event: {
    id: string;
    title: string;
    date: string;
    location: string;
  };
}

export interface PaymentHistory {
  _id: string;
  amount: number;
  currency: string;
  status: "pending" | "succeeded" | "failed" | "refunded";
  createdAt: string;
  event: {
    _id: string;
    title: string;
    date: string;
    location: string;
  };
  receiptUrl?: string;
}

export interface PaymentFormProps {
  eventId: string;
  eventTitle: string;
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}
