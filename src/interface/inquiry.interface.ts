export interface InquiryResponse {
    /**
     * API 回覆代碼
     */
    result: string;
    /**
     * 結果訊息或失敗理由
     */
    message: string | null;
    result_object: {
        transactions: Transaction[];
    };
}

export type Transaction = TransactionSuccess | TransactionError;

export interface TransactionSuccess {
    /**
     * 電商平台端交易序號
     */
    platform_order_id: string;
    /**
     * 請參照 orderStatusCode
     */
    status: number;
    /**
     * 街口端交易序號
     */
    tradeNo: string;
    /**
     * 訂單交易時間
     *
     * 格式: YYYY-mm-dd HH:MM:SS
     */
    trans_time: string;
    /**
     * 訂單實際消費金額
     */
    final_price: string;
    /**
     * 折抵金額
     */
    redeem_amount: string;
    /**
     * 付款方式扣款金額（折抵後金額）
     */
    debit_amount: string;
    /**
     * 付款工具為信用卡時提供卡號前六後四碼
     *
     * 格式：222222******3333
     */
    maskNo?: string;
    /**
     * 列出退款歷程
     */
    refund_history?: RefundHistory[];
}

export interface TransactionError {
    /**
     * 電商平台端交易序號
     */
    platform_order_id: string;
    /**
     * 請參照 orderStatusCode
     */
    status: number;
}

export interface RefundHistory {
    /**
     * 街口端退款交易序號
     */
    refund_tradeNo: string;
    /**
     * 退款時間
     *
     * 格式: YYYY-mm-dd HH:MM:SS
     */
    time: string;
    /**
     * 退款金額
     */
    amount: string;
    /**
     * 退還折抵金額
     */
    redeem_amount: string;
    /**
     * 消費者付款方式退款金額
     */
    debit_amount: string;
}
