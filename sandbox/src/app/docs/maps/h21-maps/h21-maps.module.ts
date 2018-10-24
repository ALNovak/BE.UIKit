import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { H21MapsComponent } from './h21-maps.component';
import { MapsComponent } from '../maps.component';
import { MapToolbarComponent } from '../map-toolbar/map-toolbar.component';
import { MapContainerComponent } from '../map-container/map-container.component';
import { MapSelectorComponent } from '../map-selector/map-selector.component';
import { MapSearchComponent } from '../map-search/map-search.component';
import { MapManager } from '../entity/map-manager';
import { GoogleMap } from '../providers/google/map';
import { GoogleMarkerCluster } from '../providers/google/cluster';
import { GoogleEvent } from '../providers/google/event';
import { GoogleConfig } from '../providers/google/config';
import { GoogleRouteBuilder } from '../providers/google/route';
import { GoogleMarker } from '../providers/google/marker';
import { GoogleMapOptions } from '../providers/google/entity/google-map-options';
import { GeoContainer } from '../entity/geo-container';
import { GoogleSearchMap } from '../providers/google/search';
import { BaiduMap } from '../providers/baidu/map';
import { BaiduMarkerCluster } from '../providers/baidu/cluster';
import { BaiduEvent } from '../providers/baidu/event';
import { BaiduConfig } from '../providers/baidu/config';
import { BaiduRouteBuilder } from '../providers/baidu/route';
import { BaiduMarker } from '../providers/baidu/marker';
import { BaiduMapOptions } from '../providers/baidu/entity/baidu-map-options';
import { BaiduSearchMap } from '../providers/baidu/search';
import { YandexMap } from '../providers/yandex/map';
import { YandexMarkerCluster } from '../providers/yandex/cluster';
import { YandexEvent } from '../providers/yandex/event';
import { YandexConfig } from '../providers/yandex/config';
import { YandexRouteBuilder } from '../providers/yandex/route';
import { YandexMarker } from '../providers/yandex/marker';
import { YandexMapOptions } from '../providers/yandex/entity/yandex-map-options';
import { YandexSearchMap } from '../providers/yandex/search';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [H21MapsComponent],
  providers: [
    MapsComponent,
    MapToolbarComponent,
    MapSelectorComponent,
    MapContainerComponent,
    MapSearchComponent,
    MapManager,
    GoogleMap,
    GoogleMarkerCluster,
    GoogleEvent,
    GoogleConfig,
    GoogleRouteBuilder,
    GoogleMarker,
    GoogleMapOptions,
    GeoContainer,
    GoogleSearchMap,
    BaiduMap,
    BaiduMarkerCluster,
    BaiduEvent,
    BaiduConfig,
    BaiduRouteBuilder,
    BaiduMarker,
    BaiduMapOptions,
    BaiduSearchMap,
    YandexMap,
    YandexMarkerCluster,
    YandexEvent,
    YandexConfig,
    YandexRouteBuilder,
    YandexMarker,
    YandexMapOptions,
    YandexSearchMap,
  ],
})
export class H21MapsModule { }
