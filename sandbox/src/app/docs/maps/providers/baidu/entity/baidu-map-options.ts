import { IMapOptions } from "../../../interfaces/i-map-options";
import { IPoint } from "../../../interfaces/i-point";
import { Injectable } from "@angular/core";

declare var BMap;


@Injectable()
export class BaiduMapOptions implements IMapOptions {
    center: IPoint;
    zoom: number;
    minZoom: number;
    enableMapClick: boolean;
    enableAutoResize: boolean;
    allowScrolling: boolean;
    allowZooming: boolean;
    enableScaling: boolean;
    enableZoomByDoubleClick: boolean;
    disableDoubleClickZoom: boolean;
    scaleControl: boolean;
    editable: boolean;
    draggable: boolean;
    disableDefaultUI: boolean;
    draggableCursor: string;
    scrollwheel: false;

    constructor() {
        this.minZoom = 3;
        this.enableMapClick = true,
            this.enableAutoResize = true
        this.zoom = 4
    }
}
