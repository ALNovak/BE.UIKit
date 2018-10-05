import { IConfig } from '../interfaces/i-config';
import { AbstractMarkerCluster } from './abstract-marker-cluster';
import { BaseMarker } from '../entity/base-marker';
import { IPoint } from '../interfaces/i-point';
import { ShapeType } from '../enum/e-shape-type';
import { IPolygonOptions } from '../interfaces/i-polygon';
import { AbstractRouteBuilder } from './abstract-route-builder';
import { IRouteInfo } from '../interfaces/i-route-info';
import { IPosition } from '../interfaces/i-position';
import { AbstractMap } from './abstract-map';
import { TravelMode } from '../enum/e-travel-mode';
import { TrafficMode } from '../enum/e-traffic-mode';
import { GeoContainer } from '../entity/geo-container';
import { ICircleOptions } from '../interfaces/i-circle-options';
import { IPolylineOptions } from '../interfaces/i-polyline-options';
import { Injectable } from "@angular/core";
import { IInitMap } from '../interfaces/i-init-map';
import * as mark from "../../test.markers.json";
import { IEventClickMap } from '../providers/google/interfaces/i-event-clik-map';
import { IMapOptions } from '../interfaces/i-map-options';
import { Position } from '../entity/position';
import { Point } from '../entity/point';
import { IBaseMarkerOptions } from '../interfaces/i-base-marker-options';

declare var google;

@Injectable()
export abstract class AbstractConfig implements IConfig, IInitMap {

    map: AbstractMap;

    initMap(map: AbstractMap): void {
        this.map = map;
    }

    geo: GeoContainer;
    marker: BaseMarker;
    markerCluster: AbstractMarkerCluster;
    radiusShape: ShapeType;
    loadMarkers: boolean;
    routeBuilder: AbstractRouteBuilder;

    buildRoute(from: IPoint, to: IPoint, show?: boolean): void {
        if (show) {
            let routeOptions;
            let route = this.routeBuilder
                .setMap(this.map)
                .setOptions(routeOptions)
                .setStartPoint(from)
                .setFinishPoint(to)
                .build();

            route.showRoute();
        }
    }

    clearMap(): void {
        this.map.geo.clearAll();
    }

    drawMarkersOnMap(): void {
        try {

            let zoom = this.getZoom();
            let markersVisible = false;
            if (zoom <= 3) {
                this.clearMap();
            }
            if (zoom > 5) {
                markersVisible = true;
            }

            if (markersVisible) {
                for (let i = 0; i < mark.default.length; i++) {
                    let item = mark.default[i];
                    let point: Point = new Point();
                    point.position = new Position();
                    point.position.latitude = item.Address.Lat;
                    point.position.longitude = item.Address.Lng;
                    if (this.boundsContainsMarker(point)) {

                    }
                }
            }

        }
        catch (error) {
            console.log(error);
        }
    }
    getBounds(): any {

        throw new Error("Method not implemented.");
    }
    abstract getDetailsPoint(placeId: string): IPoint[]
    abstract drawCircle(options: ICircleOptions): void;
    abstract drawPolyline(options: IPolylineOptions): void;
    abstract drawPolygon(options: IPolygonOptions): void;

    drawShapeOnMap(type: ShapeType): void {

        try {
            let path;
            let circleOptions: ICircleOptions = {
                strokeColor: "#000000",
                strokeOpacity: 1.0,
                strokeWeight: 0.5,
                fillColor: "#298BEA",
                fillOpacity: 1.0,
                center: {
                    latitude: 0.0,
                    longitude: 0.0
                },
                radius: 10000,
                draggable: true,
                editable: true
            };

            let polygonOptions: IPolygonOptions = {
                path: path,
                strokeColor: '#1E90FF',
                strokeOpacity: 0.9,
                strokeWeight: 3.5,
                fillColor: '#1E90FF',
                fillOpacity: 0.35,
            };

            let polylineOptions: IPolylineOptions = {
                clickable: false,
                strokeColor: '#1E90FF',
                strokeOpacity: 0.9,
                strokeWeight: 3.5,
                fillColor: '#1E90FF',
                fillOpacity: 0.35,
            };

            this.clearMap();

            switch (type) {
                case ShapeType.CIRCLE:
                    this.drawCircle(circleOptions);
                    break;

                case ShapeType.AREA:
                    this.drawPolygon(polygonOptions);
                    break;

                default:
                case ShapeType.STOP:
                    break;
            }

        }
        catch (error) {
            console.log(error);
        }
        this.loadMarkers = false;
    }

    getAddress(position: Position): IPoint[] {

        return null;

    }

    getZoom(): number { return null }

    markersFitsBounds(): void {
        throw new Error("Method not implemented.");
    }

    abstract onClickMap(event: IEventClickMap);

    abstract boundsContainsMarker(point: IPoint): boolean;

    polygonsContainsMarker(marker: BaseMarker, polygon: IPolygonOptions): boolean {

        let markerLatitude = marker.point.position.latitude;
        let markerLongitude = marker.point.position.longitude;

        let polygonPointsLatitude = polygon.path.map(val => {
            return val.position.latitude;
        });

        let polygonPointsLongitude = polygon.path.map(val => {
            return val.position.longitude;
        });

        let polygonPointsCount = polygon.path.length;
        let contains: boolean = false;

        /* 

        NOTE:
            i - current index of marker in array
            j - current index of polygon point in array

        */
        for (let i = 0, j = polygonPointsCount - 1; i < polygonPointsCount; j = i++) {
            if ((((polygonPointsLongitude[i] <= markerLongitude) && (markerLongitude < polygonPointsLongitude[j]))
                || ((polygonPointsLongitude[j] <= markerLongitude) && (markerLongitude < polygonPointsLongitude[i])))
                && (markerLatitude > (polygonPointsLatitude[j] - polygonPointsLatitude[i]) * (markerLongitude - polygonPointsLongitude[i])
                    / (polygonPointsLongitude[j] - polygonPointsLongitude[i]) + polygonPointsLatitude[i]))
                contains = !contains;
        }
        return contains;
    }

    radiusContainsMarker(marker: BaseMarker, position: IPosition): number {
        let circleCenterLatitude = position.latitude;
        let circleCenterLongitude = position.longitude;

        let pointLatitude = marker.point.position.latitude;
        let pointLongitude = marker.point.position.longitude;

        let radiansCircleCenterLatitude = circleCenterLatitude * (Math.PI / 180);
        let radiansCircleCenterLongitude = circleCenterLongitude * (Math.PI / 180);
        let radiansPointLatitude = pointLatitude * (Math.PI / 180);
        let radiansPointLongitude = pointLongitude * (Math.PI / 180);

        const EARTH_RADIUS = 6372.795;

        let radiansDifferenceOfLongitudes = radiansPointLongitude - radiansCircleCenterLongitude;

        let arcTanganceOfTop = Math.sqrt(Math.pow(Math.cos(radiansPointLatitude) * Math.sin(radiansDifferenceOfLongitudes), 2) + Math.pow(Math.cos(radiansCircleCenterLatitude) * Math.sin(radiansPointLatitude) - Math.sin(radiansCircleCenterLatitude) * Math.cos(radiansPointLatitude) * Math.cos(radiansDifferenceOfLongitudes), 2));
        let arcTanganceOfBottom = Math.sin(circleCenterLatitude) * Math.sin(pointLatitude) + Math.cos(circleCenterLatitude) * Math.cos(pointLatitude) * Math.cos(radiansDifferenceOfLongitudes);
        let angle = Math.atan2(arcTanganceOfTop, arcTanganceOfBottom);
        let length = EARTH_RADIUS * angle;

        return length;
    }

    abstract routeInfo(): IRouteInfo;

    showMarker(point: IPoint): void {

        try {
            let marker = new BaseMarker({
                title: point.title,
                icon: {
                    url: './assets/icons_map/icon_hotel.png',
                    title: ""
                },
                clickable: true,
                draggable: false,
                visible: true
            });
        }
        catch (error) {
            console.log(error);
        }
    }

    abstract setZoom(zoom: number): void;

    abstract setMinZoom(zoom: number): void;

    abstract setMaxZoom(zoom: number): void;

    abstract setCenter(position: IPosition): void;

    toggleMapDragging(enabled: boolean) {
        if (enabled) {
            this.map.options.allowScrolling = false;
            this.map.options.enableZoomByDoubleClick = true;
            this.map.options.draggable = false;
        }
        else {
            this.map.options.allowScrolling = true;
            this.map.options.enableZoomByDoubleClick = false;
            this.map.options.draggable = true;
        }
    }

    getMapOptions(): IMapOptions {

        return this.map.options;
    }

    abstract toggleTrafficLayer(show: boolean): void;

    abstract toggleTransitLayer(show: boolean): void;

    abstract zoomIn(): void;

    abstract zoomOut(): void;

}