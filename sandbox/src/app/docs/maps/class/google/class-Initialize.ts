import { LoadApiMap,InitMap } from "../../interface/i-init";
import * as mapstyle from "../../class/google/maps.style.json";
import * as MarkerClusterer from '@google/markerclustererplus';
declare var document: any;
declare var google: any;
declare var require: any;
export class Initialize implements InitMap {
 
    source: LoadApiMap;
    public loadScriptMap(source: LoadApiMap): Promise<any> {
        return new Promise((resolve, reject) => {
            this.source = source;
            let script = document.createElement('script');
            script.type = 'text/javascript';
            let url: string;
            url = source.src + '&key=' + source.key + '&v=' + source.version + '&language=' + source.language
            script.src = url;
            if (script.readyState) {
                script.onreadystatechange = () => {
                    if (script.readyState === "loaded" || script.readyState === "complete") {
                        script.onreadystatechange = null;
                        resolve({ loaded: true, status: 'Loaded' });
                    }
                };
            } else {
                script.onload = () => {
                  //  resolve({ loaded: true, status: 'Loaded' });
                };
													
													  window['APILoaded'] = (ev) => {
                    console.log('google maps api loaded');
                    //resolve(window['google']['maps']);
                    resolve({ loaded: true, status: 'Loaded' });
                }
            }
            script.onerror = (error: any) => {
                reject({ loaded: false, status: 'Error' });
            };
            document.getElementsByTagName('head')[0].appendChild(script);
        });
    }


    initializingMap(): any {
        let mcOptions = {
            gridSize: 100, maxZoom: 19, zoomOnClick: true, ignoreHidden: false, styles: [
                {
                    textColor: 'black',
                    url: require('../../images/icon/icon_pointGroup.png'),
                    anchorText: [0, -2],
                    height: 44,
                    width: 44
                }]
        };
        let map = new google.maps.Map(document.getElementById('map'), {
            center: new google.maps.LatLng(27.215556209029693, 18.45703125),
            zoom: 3,
            disableDefaultUI: true,
            minZoom: 3,
            scaleControl: true,
            draggableCursor: 'default',
            disableDoubleClickZoom: true,
            styles: mapstyle.default
        });
        let markers:any[];
        let traffic = new google.maps.TrafficLayer();
        let transit = new google.maps.TransitLayer();
        let geocoder = new google.maps.Geocoder();
        let placesService = new google.maps.places.PlacesService(map);
        let markercluster = new MarkerClusterer(map, markers, mcOptions);       
        return { map, traffic, transit, geocoder, placesService, markercluster }
    }

    destroyMap() {
        
    }
}
