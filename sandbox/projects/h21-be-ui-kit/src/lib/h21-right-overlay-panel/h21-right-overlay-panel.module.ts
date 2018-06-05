import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule, MatIconModule} from "@angular/material";
import {H21RightOverlayPanelComponent} from "./h21-right-overlay-panel.component";
import {H21PassangersSearchModule} from "../h21-passangers-search/h21-passangers-search.module";

@NgModule({
	imports: [
		CommonModule,
		MatButtonModule,
		MatIconModule,
		H21PassangersSearchModule
	],
	declarations: [H21RightOverlayPanelComponent],
	exports: [H21RightOverlayPanelComponent]
})
export class H21RightOverlayPanelModule {

}