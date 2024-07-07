export interface BCASuccessVAResponse {
  status_code: string;
  status_message: string;
  transaction_id: string;
  order_id: string;
  gross_amount: string;
  payment_type: string;
  transaction_time: string;
  transaction_status: string;
  va_numbers: {
    bank: string;
    va_number: string;
  }[];
  fraud_status: string;
  currency: string;
}

export interface BCAPendingVAResponse {
  va_numbers: {
    bank: string;
    va_number: string;
  }[];
  transaction_time: string;
  gross_amount: string;
  order_id: string;
  payment_type: string;
  signature_key: string;
  status_code: string;
  transaction_id: string;
  transaction_status: string;
  fraud_status: string;
  status_message: string;
}

export interface BCASettlementVAResponse {
  va_numbers: {
    bank: string;
    va_number: string;
  }[];
  transaction_time: string;
  gross_amount: string;
  order_id: string;
  payment_type: string;
  signature_key: string;
  status_code: string;
  transaction_id: string;
  transaction_status: string;
  fraud_status: string;
  status_message: string;
}

export interface BCAExpiredVAResponse {
  status_code: string;
  status_message: string;
  transaction_id: string;
  order_id: string;
  gross_amount: string;
  payment_type: string;
  transaction_time: string;
  transaction_status: string;
  signature_key: string;
}
export interface QRISSuccessResponse {
  status_code: string;
  status_message: string;
  transaction_id: string;
  order_id: string;
  merchant_id: string;
  gross_amount: string;
  currency: string;
  payment_type: string;
  transaction_time: string;
  transaction_status: string;
  fraud_status: string;
  acquirer: string;
  actions: {
    name: string;
    method: string;
    url: string;
  }[];
}

export interface QRISPendingResponse {
  transaction_time: string;
  transaction_status: string;
  transaction_id: string;
  status_message: string;
  status_code: string;
  signature_key: string;
  payment_type: string;
  order_id: string;
  merchant_id: string;
  gross_amount: string;
  fraud_status: string;
  currency: string;
  acquirer: string;
}
export interface QRISSettlementResponse {
  transaction_type: string;
  transaction_time: string;
  transaction_status: string;
  transaction_id: string;
  status_message: string;
  status_code: string;
  signature_key: string;
  settlement_time: string;
  payment_type: string;
  order_id: string;
  merchant_id: string;
  issuer: string;
  gross_amount: string;
  fraud_status: string;
  currency: string;
  acquirer: string;
  shopeepay_reference_number: string;
  reference_id: string;
}

export interface QRISExpiredResponse {
  transaction_time: string;
  transaction_status: string;
  transaction_id: string;
  status_message: string;
  status_code: string;
  signature_key: string;
  payment_type: string;
  order_id: string;
  merchant_id: string;
  gross_amount: string;
  fraud_status: string;
  currency: string;
  acquirer: string;
}

export interface PaymentResponse {
  status_code: string;
  status_message: string;
  transaction_id: string;
  order_id: string;
  gross_amount: string;
  payment_type: string;
  transaction_time: string;
  transaction_status: string;
  fraud_status: string;
  currency: string;
  acquirer?: string;
  actions?: {
    name: string;
    method: string;
    url: string;
  }[];
  transaction_type?: string;
  settlement_time?: string;
  issuer?: string;
  shopeepay_reference_number?: string;
  reference_id?: string;
  va_numbers?: {
    bank: string;
    va_number: string;
  }[];
  signature_key?: string;
}
