import { AbstractRouteBuilder } from "../../abstract/abstract-route-builder";
import { RouteInfo } from "../../classes/route-info";

declare var google;

export class BaiduRouteBuilder extends AbstractRouteBuilder {
    build(): void {
        throw new Error("Method not implemented.");
    }

    getInfoDistance(): RouteInfo {
        throw new Error("Method not implemented.");
    }

    showStartPoint(): void {
        throw new Error("Method not implemented.");
    }
    showFinishPoint(): void {
        throw new Error("Method not implemented.");
    }

}