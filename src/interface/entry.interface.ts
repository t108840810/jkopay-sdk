export interface JKoPayEntryParams {
    platform_order_id: string;
    store_id: string;
    currency: "TWD";
    total_price: number;
    final_price: number;
    unredeem?: number;
    valid_time?: string;
    confirm_url?: string;
    result_url?: string;
    result_display_url?: string;
    payment_type?: "onetime" | "regular";
    escrow?: boolean;
    products?: JKoPayProduct[];
}

export interface JKoPayProduct {
    name: string;
    img?: string;
    unit_count: number;
    unit_price: number;
    unit_final_price: number;
}

export interface EntryOptions {
    /**
     * 不可折抵金額
     */
    unredeem?: number;
    /**
     * 訂單有效期限，依 UTC+8 時區。
     *
     * 格式 : YYYY-mm-dd HH:MM
     */
    validTime?: string;
    /**
     * 買家在街口確認付款頁面輸入密碼後，街口服務器訪問此電商平台服務器網址確認訂單正確性與存貨彈性。
     */
    confirmUrl?: string;
    /**
     * 消費者付款完成後，街口服務器訪問此網址，並在參數中提供街口交易序號與訂單交易狀態代碼。
     */
    resultUrl?: string;
    /**
     * 消費者付款完成後點選完成按鈕，將消費者導向此電商平台客戶端付款結果頁網址。
     */
    resultDisplayUrl?: string;
    /**
     * 付款模式 :
     * - onetime 為一次性付款
     * - regular 為定期定額付款
     *
     * 預設為一次性付款。
     */
    paymentType?: "onetime" | "regular";
    /**
     * 是否支持價金保管，預設為 False 不支持。
     */
    escrow?: boolean;
    products?: Product[];
}

export interface Product {
    /**
     * 商品名稱（charset=utf-8）
     */
    name: string;
    /**
     * 商品網址
     */
    img?: string;
    /**
     * 商品數量
     */
    unitCount: number;
    /**
     * 商品單價（原價）
     */
    unitPrice: number;
    /**
     * 商品單價（付款價格）
     */
    unitFinalPrice: number;
}

export interface EntryResponse {
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
         * 付款導向網址
         */
        payment_url: string;
        /**
         * QRCode 圖檔
         */
        qr_img: string;
        /**
         * QRCode/payment_url 失效時間
         */
        qr_timeout: number;
    };
}
