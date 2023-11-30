import { BOOKING_STATUS } from './status'

const customerCancelReasons = [
  {
    status: BOOKING_STATUS.CUSTOMER_CANCEL,
    reason: 'Tôi không sắp xếp được thời gian cho buổi hẹn'
  },
  {
    status: BOOKING_STATUS.CUSTOMER_CANCEL,
    reason: 'Tôi không có nhu cầu đi xăm nữa'
  },
  {
    status: BOOKING_STATUS.CUSTOMER_CANCEL,
    reason: 'Tôi đã tìm thấy tiệm xăm khác'
  },
  {
    status: BOOKING_STATUS.CUSTOMER_CANCEL,
    reason: 'Lý do khác'
  },
]

export default customerCancelReasons;