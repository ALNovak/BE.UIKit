import { Component } from '@angular/core';
import { MapManager } from '../entity/map-manager';
import { ZoomType } from '../enum/e-zoom-type';
import { Injectable } from "@angular/core";
import { ShapeType } from '../enum/e-shape-type';
import { Position } from '../entity/position';


@Component({
  selector: 'app-map-toolbar',
  templateUrl: './map-toolbar.component.html',
  styleUrls: ['./map-toolbar.component.css']
})


@Injectable()
export class MapToolbarComponent {

  checked = true;

  constructor(private manager: MapManager) { }

  private zoomLevel(type: string) {

    if (type === ZoomType.In) {

      this.manager.getActiveMap().config.zoomIn();

    }
    else {

      this.manager.getActiveMap().config.zoomOut();

    }
  }


  private drawShape(type: ShapeType) {

    let center = <Position>{
      latitude: 55.755814,
      longitude: 37.617635
    }
    this.manager.getActiveMap().config.drawShapeOnMap(type, 10000, center);
  }

  private onChangeDraggableMarker(event: any) {

    this.manager.getActiveMap().config.setDraggableMarker(event.checked);
  }

  private onChangeLoadMarkers(event: any) {

    this.manager.getActiveMap().loadMarkers = event.checked;
    this.manager.getActiveMap().config.clearAllMap();
  }

  private createMarker(type: string) {

  }

  private clearMap() {

    this.manager.getActiveMap().config.clearAllMap();

  }

  private onChangeTransit(event: any) {

    this.manager.getActiveMap().config.toggleTransitLayer(event.checked);
  }

  private onChangeTraffic(event: any) {

    this.manager.getActiveMap().config.toggleTrafficLayer(event.checked);

  }

  public onChangeShowRoute(event: any) {

  }
  private onChangeClikMap(event: any) {

    this.manager.getActiveMap().clickMap = event.checked;
  }

  private GetDistance() {

  }

}