export interface JKoPayRefundParams {
    platform_order_id: string;
    refund_amount: number;
}

export interface RefundResponse {
    /**
     * API 回覆代碼
     */
    result: string;
    /**
     * 結果訊息或失敗理由
     */
    message: string | null;
    result_object: {
        /**
         * 街口端退款交易序號
         */
        refund_tradeNo: string;
        /**
         * 消費者付款方式退款金額
         */
        debit_amount: string;
        /**
         * 退還折抵金額
         */
        redeem_amount: string;
        /**
         * 退款時間
         *
         * 格式: YYYY-mm-dd HH:MM:SS
         */
        refund_time: string;
    };
}
