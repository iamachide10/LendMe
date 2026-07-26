package com.lendMe.payout.entity;

public enum PayoutStatus {
    HELD,       // borrower paid, money held in platform balance
    RELEASED,   // transfer initiated with Paystack, awaiting confirmation
    PAID,       // Paystack confirmed the transfer to the lender's MoMo
    FAILED,     // transfer failed (bad MoMo details, network) - can be retried
    REFUNDED    // booking fell through, money returned to borrower
}
