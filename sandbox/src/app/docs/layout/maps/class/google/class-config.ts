import { IMapOptions } from "../../interface/i-config";
import * as  ObjectMap from "../class-objmap";
import * as mark from "../../test.markers.json";
import * as MarkerClusterer from '@google/markerclustererplus';
import { Injectable } from "@angular/core";

export namespace Google {
    declare var google: any;
    let markerCluster: any;
    let markers: any[] = [];
    let radiusObject: any;
    let polygonArea: any[] = [];

    @Injectable()
    export class Options implements IMapOptions {
        constructor(private objMap: ObjectMap.Map.ObjectMap) {
        }

        showMarker(obj: any, markercluster: any) {
            try {
                let marker = new google.maps.Marker({
                    position: new google.maps.LatLng(obj.Address.Lat, obj.Address.Lng),
                    draggable: false,
                    visible: true,
                    clickable: true,
                    icon: { url: './assets/icons_map/icon_hotel.png' },
                    title: obj.Hotelname
                });

                marker.setMap(this.objMap.map);
                markers.push(marker);
                if (markercluster !== null) {
                    markercluster.addMarker(marker, true);
                    markercluster.repaint();
                }
                markerCluster = markercluster;
            }
            catch (error) {
                console.log(error);
            }
        }

        setZoomLevel(type: string) {
            try {
                let currentZoom = this.objMap.map.getZoom();
                if (type === 'plus') {
                    this.objMap.map.setZoom(currentZoom + 1);
                }
                else {
                    this.objMap.map.setZoom(currentZoom - 1);
                }
            }
            catch (error) {
                console.log(error);
            }
        }

        drawingShapesMap(type: any) {
            try {
                let drawingManager;
                var radius: number = 10000;
                if (drawingManager != null) {
                    drawingManager.setMap(null);
                }
                if (radiusObject != null) {
                    radiusObject.setMap(null);
                }

                if (polygonArea !== null) {
                    polygonArea.forEach((item) => {
                        item.setMap(null);
                        item.getPath().clear();
                    });

                }
                let option: any;
                if (type == 'stop') {
                }

                if (type === 'circle') {
                    var center = new google.maps.LatLng({ lat: 55.755814, lng: 37.617635 });
                    option = {
                        strokeColor: '#1E90FF',
                        strokeOpacity: 0.9,
                        strokeWeight: 3.5,
                        fillColor: '#1E90FF',
                        fillOpacity: 0.35,
                        center: center,
                        radius: radius,
                        draggable: true,
                        editable: true,
                    }
                    radiusObject = new google.maps.Circle(option);
                    radiusObject.setMap(this.objMap.map);
                    google.maps.event.addListener(radiusObject, 'radius_changed', function () {
                        console.log('radius CHANGE')
                    });

                    google.maps.event.addListener(radiusObject, 'dragend', function () {
                        console.log('dragend')

                    });
                }

                if (type == 'area') {
                    let map: any = this.objMap.map;
                    let poly: any;
                    polygonArea = [];
                    this.draggableMap(true);
                    google.maps.event.addDomListener(map.getDiv(), 'mousedown', () => {
                        poly = new google.maps.Polyline({
                            map: map,
                            clickable: false, strokeColor: '#1E90FF',
                            strokeOpacity: 0.9,
                            strokeWeight: 3.5,
                            fillColor: '#1E90FF',
                            fillOpacity: 0.35,
                        });

                        polygonArea.push(poly)
                        var move = google.maps.event.addListener(map, 'mousemove', e => {
                            poly.getPath().push(e.latLng);

                        });
                        google.maps.event.addListenerOnce(map, 'mouseup', () => {
                            google.maps.event.removeListener(move);
                            var path = poly.getPath();
                            poly.setMap(null);
                            poly = new google.maps.Polygon({
                                map: map,
                                path: path, strokeColor: '#1E90FF',
                                strokeOpacity: 0.9,
                                strokeWeight: 3.5,
                                fillColor: '#1E90FF',
                                fillOpacity: 0.35,
                            });
                            map.setOptions({
                                draggable: true,
                                scrollwheel: true,
                                disableDoubleClickZoom: true
                            });
                            polygonArea.push(poly);
                            google.maps.event.clearListeners(map.getDiv(), 'mousedown');
                            let array = poly.getPath().getArray();
                            let bounds = new google.maps.LatLngBounds();
                            for (var n = 0; n < array.length; n++) {
                                bounds.extend(array[n]);
                            }
                            map.panToBounds(bounds);
                            map.fitBounds(bounds);
                            let x1: any[] = [];
                            let y1: any[] = [];
                            array.forEach((item) => {
                                x1.push(item.lat());
                                y1.push(item.lng());
                            });
                            markers.forEach(item => func(item, x1, y1));
                        });
                    });
                }

                let func = (item, x1, y1) => {
                    let b = this.inclusionMarkersPolygon(item, x1, y1);
                    if (b === false) {
                        item.setMap(null);
                        if (markerCluster != null) {
                            markerCluster.resetViewport_();
                            markerCluster.removeMarker(item, false);
                            markerCluster.redraw_();
                        }

                    }
                }
            }
            catch (error) {
                console.log(error);
            }
        }

        inclusionMarkersPolygon(item: any, xp: any[], yp: any[]): boolean {
            let x = item.position.lat();
            let y = item.position.lng();
            let npol = xp.length;
            let j: any = npol - 1;
            let c: boolean = false;
            for (let i = 0; i < npol; i++) {
                if ((((yp[i] <= y) && (y < yp[j])) || ((yp[j] <= y) && (y < yp[i]))) &&
                    (x > (xp[j] - xp[i]) * (y - yp[i]) / (yp[j] - yp[i]) + xp[i])) {
                    c = !c
                }
                j = i;
            }
            return c;
        }
        inclusionMarkersRadius(Lat1: number, Lng1: number, Lat2: number, Lng2: number) {

        }

        setZoomMin(zoom: number) {

        }
        setZoomMax(zoom: number) {

        }

        setMarkers = () => {
            try {              
                this.clearMap();
                let zoom = this.objMap.map.getZoom();
                var bounds = this.objMap.map.getBounds();
                let sending = false;
                if (zoom > 5) {
                    sending = true;

                }
                if (zoom == 3) {
                    this.clearMap();
                }
                for (let i = 0; i < mark.default.length; i++) {
                    let item = mark.default[i];
                    let marker = new google.maps.Marker({
                        position: new google.maps.LatLng(item.Address.Lat, item.Address.Lng),
                        draggable: false,
                        visible: true,
                        clickable: true,
                        icon: { url: './assets/icons_map/icon_hotel.png' },
                        title: item.Hotelname
                    });
                    if (sending) {
                        if (bounds.contains(marker.getPosition()) === true) {
                            markers.push(marker);
                        }
                    }

                }
                let mcOptions = {
                    gridSize: 100, maxZoom: 19, zoomOnClick: true, ignoreHidden: false, styles: [
                        {
                            textColor: 'black',
                            url: './assets/icons_map/icon_pointgroup.png',
                            anchorText: [0, -2],
                            height: 44,
                            width: 44
                        }]
                };
                markerCluster = new MarkerClusterer(this.objMap.map, markers, mcOptions);
            }
            catch (error) {
                console.log(error);
            }
        }

        clearMap() {
            try {
                markers.forEach((item) => {
                    item.setMap(null);
                });
                if (markerCluster != null) {
                    markerCluster.clearMarkers();

                }

                if (radiusObject != null) {
                    radiusObject.setMap(null);

                }
                if (polygonArea != null) {
                    polygonArea.forEach((item) => {
                        item.setMap(null);
                        item.getPath().clear();
                    });

                }
                polygonArea = [];
                markers = [];
            }
            catch (error) {
                console.log(error);
            }

        }
        resizeMap() {
            console.log('resizeMap')
        }
        routeMap(start: any, end: any, show: boolean) {

        }
        fitBounds() {

        }
        setCenterMap() {

        }
        getBounds() {

        }
        resetMap() {

        }

        getZoom(): number {
            return this.objMap.map.getZoom();
        }

        setZoom(zoom: number) {
            this.objMap.map.setZoom(zoom);
        }

        transitLayer(transit: any, boolean: boolean) {
            if (boolean) {
                transit.setMap(this.objMap.map);
            }
            else {
                transit.setMap(null);
            }
        }
        trafficLayer(traffic: any, boolean: boolean) {
            if (boolean) {
                traffic.setMap(this.objMap.map);
            }
            else {
                traffic.setMap(null);
            }
        }
        getAddress(coord: any) {
            console.log('GETADDRESS')
        }

        draggableMap(boolean: any) {
            if (boolean) {
                console.log('grable false')
                this.objMap.map.setOptions({
                    draggable: false,
                    scrollwheel: false,
                    disableDoubleClickZoom: false
                });
            }
            else {
                this.objMap.map.setOptions({
                    draggable: true,
                    scrollwheel: true,
                    disableDoubleClickZoom: true
                });
            }
        }
    }
}