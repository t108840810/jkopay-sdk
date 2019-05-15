import * as crypto from "crypto";
import axios from "axios";
import * as qs from "querystring";

// interfaces
import {JKoPayEntryParams, JKoPayProduct, EntryOptions, Product, EntryResponse} from "./interface/entry.interface";
import {JKoPayRefundParams, RefundResponse} from "./interface/refund.interface";
import {InquiryResponse} from "./interface/inquiry.interface";

export default class JKoPaySDK {
    /**
     * 街口支付伺服器網址
     */
    public readonly serverUrl: string;
    /**
     * 商店ID
     */
    public readonly storeID: string;
    /**
     * 商店Key
     */
    public readonly apiKey: string;
    /**
     * 商店Secret Key
     */
    public readonly secretKey: string;

    /**
     * 初始化
     * @param storeID 商店ID
     * @param apiKey 商店Key
     * @param secretKey 商店Secret Key
     * @param isTestStore 是否為測試商店
     */
    public constructor(storeID: string, apiKey: string, secretKey: string, isTestStore: boolean) {
        this.storeID = storeID;
        this.apiKey = apiKey;
        this.secretKey = secretKey;
        this.serverUrl = isTestStore ? "https://uat-onlinepay.jkopay.app" : "https://onlinepay.jkopay.com";
    }

    /**
     * 請求訂單API
     * @param platformOrderId 電商平台端交易序號
     *                        - 需為唯一值，不可重複。
     * @param totalPrice 訂單原始金額
     * @param finalPrice 訂單實際付款金額
     * @param options 可選選項
     */
    public async entry(
        platformOrderId: string,
        totalPrice: number,
        finalPrice: number,
        options: EntryOptions
    ): Promise<EntryResponse> {
        // 請求資料
        const requestPath = "/platform/entry";
        const requestMethod = "POST";
        const requestBody: JKoPayEntryParams = {
            platform_order_id: platformOrderId,
            store_id: this.storeID,
            currency: "TWD",
            total_price: totalPrice,
            final_price: finalPrice
        };

        // 添加非必傳資料
        if (options.unredeem !== undefined) requestBody.unredeem = options.unredeem;
        if (options.validTime !== undefined) requestBody.valid_time = options.validTime;
        if (options.confirmUrl !== undefined) requestBody.confirm_url = options.confirmUrl;
        if (options.resultUrl !== undefined) requestBody.result_url = options.resultUrl;
        if (options.resultDisplayUrl !== undefined) requestBody.result_display_url = options.resultDisplayUrl;
        if (options.paymentType !== undefined) requestBody.payment_type = options.paymentType;
        if (options.escrow !== undefined) requestBody.escrow = options.escrow;
        if (options.products !== undefined)
            requestBody.products = options.products.map(product => this.productFormat(product));

        // 請求街口伺服器
        const response = await axios({
            url: `${this.serverUrl}${requestPath}`,
            method: requestMethod,
            headers: {
                "Content-type": "application/json",
                "API-KEY": this.apiKey,
                DIGEST: this.digest(JSON.stringify(requestBody))
            },
            data: requestBody,
            timeout: 10000
        });

        return response.data;
    }

    /**
     * 訂單退款API
     *
     * 將該筆電商平台交易序號執行退款，可支援部分、多次部分退款，累積退款金額不可超過訂單實際消費金額。
     * @param platformOrderId 原電商平台端交易序號
     * @param refundAmount 退款金額
     *                     - 允許部分、多次部分退款，但該筆訂單加總退款金額不可超過訂單實際消費金額。
     */
    public async refund(platformOrderId: string, refundAmount: number): Promise<RefundResponse> {
        // 請求資料
        const requestPath = "/platform/refund";
        const requestMethod = "POST";
        const requestBody: JKoPayRefundParams = {
            platform_order_id: platformOrderId,
            refund_amount: refundAmount
        };

        // 請求街口伺服器
        const response = await axios({
            url: `${this.serverUrl}${requestPath}`,
            method: requestMethod,
            headers: {
                "Content-type": "application/json",
                "API-KEY": this.apiKey,
                DIGEST: this.digest(JSON.stringify(requestBody))
            },
            data: requestBody,
            timeout: 10000
        });

        return response.data;
    }

    /**
     * 訂單查詢API
     *
     * 查詢該筆電商平台交易序號的付款、退款歷程。
     * @param platformOrderIds 電商平台端交易序號
     *                         - 最多可以查詢 20 筆交易。
     */
    public async inquiry(platformOrderIds: string | string[]): Promise<InquiryResponse> {
        // 請求資料
        const requestPath = "/platform/inquiry";
        const requestMethod = "GET";
        const requestParams = {
            platform_order_ids: platformOrderIds
        };

        // 請求街口伺服器
        const response = await axios({
            url: `${this.serverUrl}${requestPath}`,
            method: requestMethod,
            headers: {
                "Content-type": "application/json",
                "API-KEY": this.apiKey,
                DIGEST: this.digest(qs.stringify(requestParams))
            },
            params: requestParams,
            timeout: 10000
        });

        return response.data;
    }

    /**
     * 格式化產品資訊，將參數格式化成街口支付API鑰的型態。
     * @param product 產品資訊
     */
    private productFormat(product: Product): JKoPayProduct {
        const jkopayProduct: JKoPayProduct = {
            name: product.name,
            unit_count: product.unitCount,
            unit_price: product.unitPrice,
            unit_final_price: product.unitFinalPrice
        };
        if (product.img !== undefined) jkopayProduct.img = product.img;
        return jkopayProduct;
    }

    /**
     * HMAC-SHA256
     * @param data 序列化後的資料字串
     */
    private digest(data: string) {
        const hmac = crypto.createHmac("sha256", this.secretKey);
        return hmac.update(data).digest("hex");
    }
}
