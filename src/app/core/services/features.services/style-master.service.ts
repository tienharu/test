import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { NotificationService } from "../notification.service";
import { Injectable } from "@angular/core";

import { StyleMasterColorModel } from '@app/core/models/style-master-color-model';
import { StyleMasterMaterialModel } from '@app/core/models/style-master-material-model';
import { StyleMasterModel } from '@app/core/models/style-master-model';
import { StyleMasterPOCSModel } from '@app/core/models/style-master-po-cs-model';
import { StyleMasterPOModel } from '@app/core/models/style-master-po-model';
import { StyleMasterSwatchModel } from '@app/core/models/style-master-swatch-model';
import { StyleMasterYieldModel } from '@app/core/models/style-master-yield-model';

@Injectable()
export class StyleMasterService {
    private styleMasterColorModel: StyleMasterColorModel;
    private styleMasterMaterialModel: StyleMasterMaterialModel;
    private styleMasterModel: StyleMasterModel;
    private styleMasterPOCSModel: StyleMasterPOCSModel;
    private styleMasterPOModel: StyleMasterPOModel;
    private styleMasterSwatchModel: StyleMasterSwatchModel;
    private styleMasterYiledModel: StyleMasterYieldModel;


    constructor(private api: CRMSolutionApiService,
        private notificationService: NotificationService) {
        this.styleMasterColorModel = new StyleMasterColorModel();
        this.styleMasterMaterialModel = new StyleMasterMaterialModel();
        this.styleMasterModel = new StyleMasterModel();
        this.styleMasterPOCSModel = new StyleMasterPOCSModel();
        this.styleMasterPOModel = new StyleMasterPOModel();
        this.styleMasterSwatchModel = new StyleMasterSwatchModel();
        this.styleMasterYiledModel = new StyleMasterYieldModel();

    }

    getStyleMasterColorModel(): StyleMasterColorModel {
        return this.styleMasterColorModel;
    }

    getStyleMasterMaterialModel(): StyleMasterMaterialModel {
        return this.styleMasterMaterialModel;
    }

    getStyleMasterModel(): StyleMasterModel {
        return this.styleMasterModel;
    }

    getStyleMasterPOCSModel(): StyleMasterPOCSModel {
        return this.styleMasterPOCSModel;
    }

    getStyleMasterPOModel(): StyleMasterPOModel {
        return this.styleMasterPOModel;
    }

    getStyleMasterSwatchModel(): StyleMasterSwatchModel {
        return this.styleMasterSwatchModel;
    }

    getStyleMasterYielddModel(): StyleMasterYieldModel {
        return this.styleMasterYiledModel;
    }

    storeStyleMasterColorModel(styleMasterColorModel: StyleMasterColorModel) {
        this.styleMasterColorModel = styleMasterColorModel;
    }

    storeStyleMasterMaterialModel(styleMasterMaterialModel: StyleMasterMaterialModel) {
        this.styleMasterMaterialModel = styleMasterMaterialModel;
    }

    storeStyleMasterModel(styleMasterModel: StyleMasterModel) {
        this.styleMasterModel = styleMasterModel;
    }

    storeStyleMasterPOCSModel(styleMasterPOCSModel: StyleMasterPOCSModel) {
        this.styleMasterPOCSModel = styleMasterPOCSModel;
    }

    storeStyleMasterPOModel(styleMasterPOModel: StyleMasterPOModel) {
        this.styleMasterPOModel = styleMasterPOModel;
    }

    storeStyleMasterSwatchModel(styleMasterSwatchModel: StyleMasterSwatchModel) {
        this.styleMasterSwatchModel = styleMasterSwatchModel;
    }

    storeStyleMasterYiledModel(styleMasterYiledModel: StyleMasterYieldModel) {
        this.styleMasterYiledModel = styleMasterYiledModel;
    }

    resetStyleMasterColorModel() {
        this.styleMasterColorModel = new StyleMasterColorModel();
    }

    resetStyleMasterMaterialModel() {
        this.styleMasterMaterialModel = new StyleMasterMaterialModel();
    }

    resetStyleMasterModel() {
        this.styleMasterModel = new StyleMasterModel();
    }

    resetStyleMasterPOCSModel() {
        this.styleMasterPOCSModel = new StyleMasterPOCSModel();
    }

    resetStyleMasterPOModel() {
        this.styleMasterPOModel = new StyleMasterPOModel();
    }

    resetStyleMasterSwatchModel() {
        this.styleMasterSwatchModel = new StyleMasterSwatchModel();
    }

    resetStyleMasterYiledModel() {
        this.styleMasterYiledModel = new StyleMasterYieldModel();
    }


    //------------------- Style Header-----------------------------------
    public search(cri) {
        if(cri.styleNo === ''){
            cri.styleNo = null;
        }
        if(cri.brand === ''){
            cri.brand = null;
        }
        if(cri.buyer === ''){
            cri.buyer = 0;
        }
        return new Promise<any>((resolve, reject) => {
            this.api.get(`api/v1/order/mas-style/styleNo=${cri.styleNo}&orderType=${cri.orderType}&buyer=${cri.buyer}&brand=${cri.brand}`)
                .subscribe(rs => {
                    resolve(rs);
                    return;
                });
        });
    }

    public getAllStyle() {
        return new Promise<any>((resolve, reject) => {
            this.api.get(`api/v1/order/mas-style`)
                .subscribe(data => {
                    resolve(data.data);
                    return;
                });
        });
    }

    public getStyleById(id) {
        return new Promise<any>((resolve, reject) => {
            this.api.get(`api/v1/order/mas-style/${id}`).subscribe(data => {
                resolve(data);
            });
        });
    }

    public insertStyle(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post(`api/v1/order/mas-style`, model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public updateStyle(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.put(`api/v1/order/mas-style`, model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public deleteStyle(id) {
        return new Promise<any>((resolve, reject) => {
            this.api.delete(`api/v1/order/mas-style/${id}`).subscribe(data => {
                resolve(data);
            });
        });
    }
    //------------------- Regist Swatch-----------------------------------
    public getListStyleMasterSwatch() {
        return new Promise<any>((resolve, reject) => {
            this.api.get(`api/v1/order/mas-style-swatch`)
                .subscribe(data => {
                    resolve(data);
                    return;
                });
        });
    }

    public getStyleMasterSwatchByStyle(styleId) {
        return new Promise<any>((resolve, reject) => {
            this.api.get(`api/v1/order/mas-style-swatch/style/${styleId}`).subscribe(data => {
                resolve(data);
            });
        });
    }

    public getStyleMasterSwatch(id) {
        return new Promise<any>((resolve, reject) => {
            this.api.get(`api/v1/order/mas-style-swatch/${id}`).subscribe(data => {
                resolve(data);
            });
        });
    }

    public insertStyleMasterSwatch(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post(`api/v1/order/mas-style-swatch`, model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public updateStyleMasterSwatch(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.put(`api/v1/order/mas-style-swatch`, model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public deleteStyleMasterSwatch(id) {
        return new Promise<any>((resolve, reject) => {
            this.api.delete(`api/v1/order/mas-style-swatch/${id}`).subscribe(data => {
                resolve(data);
            });
        });
    }

    //------------------- Regist Color-----------------------------------
    public getListStyleMasterColor() {
        return new Promise<any>((resolve, reject) => {
            this.api.get(`api/v1/order/mas-style-color`)
                .subscribe(data => {
                    resolve(data);
                    return;
                });
        });
    }

    public getStyleMasterColor(id) {
        return new Promise<any>((resolve, reject) => {
            this.api.get(`api/v1/order/mas-style-color/${id}`).subscribe(data => {
                resolve(data);
            });
        });
    }

    public getStyleMasterColorByType(typeId) {
        return new Promise<any>((resolve, reject) => {
            this.api.get(`api/v1/order/mas-style-color/type/${typeId}`).subscribe(data => {
                resolve(data);
            });
        });
    }

    public getStyleMasterColorByStyle(styleId) {
        return new Promise<any>((resolve, reject) => {
            this.api.get(`api/v1/order/mas-style-color/style/${styleId}`).subscribe(data => {
                resolve(data);
            });
        });
    }

    public insertStyleMasterColor(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post(`api/v1/order/mas-style-color`, model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public updateStyleMasterColor(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.put(`api/v1/order/mas-style-color`, model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public deleteStyleMasterColor(id) {
        return new Promise<any>((resolve, reject) => {
            this.api.delete(`api/v1/order/mas-style-color/${id}`).subscribe(data => {
                resolve(data);
            });
        });
    }

    //------------------- Regist Yield-----------------------------------
    public getListStyleMasterYield() {
        return new Promise<any>((resolve, reject) => {
            this.api.get(`api/v1/order/mas-style-yield`)
                .subscribe(data => {
                    resolve(data);
                    return;
                });
        });
    }

    public getStyleMasterYieldByStyleId(styleId) {
        return new Promise<any>((resolve, reject) => {
            this.api.get(`api/v1/order/mas-style-yield/style/${styleId}`).subscribe(data => {
                resolve(data);
            });
        });
    }

    public getStyleMasterYield(id) {
        return new Promise<any>((resolve, reject) => {
            this.api.get(`api/v1/order/mas-style-yield/${id}`).subscribe(data => {
                resolve(data);
            });
        });
    }

    public insertStyleMasterYield(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post(`api/v1/order/mas-style-yield`, model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public updateStyleMasterYield(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.put(`api/v1/order/mas-style-yield`, model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public deleteStyleMasterYield(id) {
        return new Promise<any>((resolve, reject) => {
            this.api.delete(`api/v1/order/mas-style-yield/${id}`).subscribe(data => {
                resolve(data);
            });
        });
    }

    //------------------- Regist Material-----------------------------------
    public getListStyleMasterMaterialByStyle(styleId) {
        return new Promise<any>((resolve, reject) => {
            this.api.get(`api/v1/order/mas-style-material/style/${styleId}`)
                .subscribe(data => {
                    resolve(data);
                    return;
                });
        });
    }

    public getStyleMasterMaterialById(styleId, materialId, colorId) {
        return new Promise<any>((resolve, reject) => {
            this.api.get(`api/v1/order/mas-style-material/style/${styleId}/material/${materialId}/color/${colorId}`).subscribe(data => {
                resolve(data);
            });
        });
    }

    public insertStyleMasterMaterial(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post(`api/v1/order/mas-style-material`, model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public updateStyleMasterMaterial(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.put(`api/v1/order/mas-style-material`, model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public deleteStyleMasterMaterial(styleId, materialId, colorId) {
        return new Promise<any>((resolve, reject) => {
            this.api.delete(`api/v1/order/mas-style-material/style/${styleId}/material/${materialId}/color/${colorId}`).subscribe(data => {
                resolve(data);
            });
        });
    }

    //------------------- Regist PO-----------------------------------
    public getListStyleMasterPO() {
        return new Promise<any>((resolve, reject) => {
            this.api.get(`api/v1/order/mas-style-po`)
                .subscribe(data => {
                    resolve(data);
                    return;
                });
        });
    }

    public getStyleMasterPO(poId) {
        return new Promise<any>((resolve, reject) => {
            this.api.get(`api/v1/order/mas-style-po/${poId}`).subscribe(data => {
                resolve(data);
            });
        });
    }

    public getStyleMasterPOByStyle(styleId) {
        return new Promise<any>((resolve, reject) => {
            this.api.get(`api/v1/order/mas-style-po/style/${styleId}`).subscribe(data => {
                resolve(data);
            });
        });
    }

    public insertStyleMasterPO(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post(`api/v1/order/mas-style-po`, model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public updateStyleMasterPO(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.put(`api/v1/order/mas-style-po`, model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public deleteStyleMasterPO(id) {
        return new Promise<any>((resolve, reject) => {
            this.api.delete(`api/v1/order/mas-style-po/${id}`).subscribe(data => {
                resolve(data);
            });
        });
    }

    //------------------- Regist POCS-----------------------------------
    public getListStyleMasterPOCS() {
        return new Promise<any>((resolve, reject) => {
            this.api.get(`api/v1/order/mas-style-po-cs`)
                .subscribe(data => {
                    resolve(data);
                    return;
                });
        });
    }

    public getStyleMasterPOCSByPo(poId) {
        return new Promise<any>((resolve, reject) => {
            this.api.get(`api/v1/order/mas-style-po-cs/po/${poId}`).subscribe(data => {
                resolve(data);
            });
        });
    }

    public getStyleMasterPOCS(poId, styleId, sizeId, colorId) {
        return new Promise<any>((resolve, reject) => {
            this.api.get(`api/v1/order/mas-style-po-cs/po/${poId}/style/${styleId}/size/${sizeId}/color/${colorId}`).subscribe(data => {
                resolve(data);
            });
        });
    }

    public insertStyleMasterPOCS(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post(`api/v1/order/mas-style-po-cs`, model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public updateStyleMasterPOCS(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.put(`api/v1/order/mas-style-po-cs`, model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public deleteStyleMasterPOCS(poId, styleId, sizeId, colorId) {
        return new Promise<any>((resolve, reject) => {
            this.api.delete(`api/v1/order/mas-style-po-cs/po/${poId}/style/${styleId}/size/${sizeId}/color/${colorId}`).subscribe(data => {
                resolve(data);
            });
        });
    }

    public getStyleBrand() {
        return new Promise<any>((resolve, reject) => {
            this.api.get(`api/v1/order/mas-general/brand`)
                .subscribe(data => {
                    resolve(data);
                    return;
                });
        });
    }
}
