export enum PaymentStatus {
  UNPAID = 'UNPAID', //Chưa thanh toán
  PAID30PERCENT = 'PAID 30%', //Đã cọc 30%
  PAID = 'PAID', //Đã thanh toán xong
  FAILED = 'FAILED', //Thanh toán thất bại
  REFUNDED = 'REFUNDED', //Đã hoàn tiền
}
