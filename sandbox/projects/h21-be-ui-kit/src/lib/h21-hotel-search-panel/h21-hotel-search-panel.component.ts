import { DestinationLoaderService } from './../../services/destination-loader.service';
import { IDestinationItem } from './../../dto/i-destination-item';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material';
import { H21RightOverlayPanelService } from '../h21-right-overlay-panel/h21-right-overlay-panel.service';
import { IHotelSearchOptions } from '../../dto/i-hotel-search-options';
import { debounceTime } from 'rxjs/operators';
import { environment } from '../../../../../src/environments/environment';
import { DateTime } from 'luxon';

@Component({
	selector: 'h21-hotel-search-panel',
	templateUrl: './h21-hotel-search-panel.component.html'
})
export class H21HotelSearchPanelComponent {
	searchOptions: IHotelSearchOptions;
	adultsCount: number = 1;
	childrenCount: number = 0;
	childAge_1: number = null;
	childAge_2: number = null;
	childAgeFakeArray: Array<any> = new Array(18);
	destinations: Array<IDestinationItem>;
	destinationsFiltered: Array<IDestinationItem>;
	filterStartLettersCount = 3;

	destinationControl: FormControl = new FormControl('', [Validators.required]);
	nationalityControl: FormControl = new FormControl('', [Validators.required]);
	defaultNationality: string = 'Russian';

	@Input()
	searchMode: 'hotel' | 'room' = 'hotel';

	@Output()
	onSearch: EventEmitter<IHotelSearchOptions> = new EventEmitter<IHotelSearchOptions>();
	@Output()
	onClearSearch: EventEmitter<void> = new EventEmitter<void>();

	constructor(private _rightPanelDialog: H21RightOverlayPanelService, private destinationLoader: DestinationLoaderService) {
		this.searchOptions = <IHotelSearchOptions>{
			paymentMethod: 'account',
			destination: '',
			hotelName: '',
			nationality: this.defaultNationality,
			checkInDate: DateTime.local().toJSDate(),
			checkOutDate: DateTime.local()
				.plus({ days: 1 })
				.toJSDate(),
			nightsCount: 1,
			roomCount: 1
		};
	}

	ngOnInit(): void {
		this.fetchDestinations();
		this.destinationControl.valueChanges
			.pipe(debounceTime(environment.debouncingTime))
			.subscribe((event) => this.onDestinationEdited(event));
	}

	fetchDestinations() {
		this.destinationLoader
			.url(
				'https://gist.githubusercontent.com/atthealchemist/8c2f402868bd40f4bf167aea495cc2de/raw/3aa308e229cef0b0ed629e3a2bb878813a722918/destinations.json'
			)
			.getDestinations()
			.subscribe(
				(data) => (this.destinationsFiltered = data as Array<IDestinationItem>),
				(error) => console.log('[FETCHING] Error', error),
				() => console.log('[FETCHING] Successfully fetching destinations', this.destinationsFiltered)
			);
	}

	onDestinationEdited(event) {
		if (event instanceof Object) {
			return;
		}
		let enteredValue = event.toLowerCase();

		let valueIsEmpty = !enteredValue || enteredValue === '';
		let valueIsLessThanStartLettersCount = enteredValue.length < this.filterStartLettersCount;
		let destinationsEmptyOrOne = this.destinationsFiltered.length <= 1;

		if (valueIsEmpty || valueIsLessThanStartLettersCount || destinationsEmptyOrOne) {
			this.fetchDestinations();
			this.destinations = this.destinationsFiltered;
		} else {
			console.log('[TYPING] onDestinationEdited.enteredValue', enteredValue);
			this.destinations = this.destinationsFiltered.filter((value) => {
				console.log('[TYPING FILTERING] this.destinations');
				return value.name.toLowerCase().startsWith(enteredValue);
			});
		}
		console.log('onDestinationEdited.destinations', this.destinations);
	}

	changeCheckInDate($event) {
		this.searchOptions.checkInDate = $event;
		this.setNightsCount();
	}

	changeCheckOutDate($event) {
		this.searchOptions.checkOutDate = $event;
		this.setNightsCount();
	}

	setNightsCount() {
		if (this.searchOptions.checkInDate && this.searchOptions.checkOutDate) {
			const oneDayTime = 86400000; // let oneDayTime = 24 * 60 * 60 * 1000;
			let diffTime = this.searchOptions.checkOutDate.getTime() - this.searchOptions.checkInDate.getTime();
			this.searchOptions.nightsCount = diffTime / oneDayTime;
		} else {
			this.searchOptions.nightsCount = null;
		}
	}

	changeAdultsCount($event) {
		if ($event < this.adultsCount) {
			this.showTravelers();
		} else {
			this.adultsCount = $event;
		}
	}

	addTraveler() {
		this._rightPanelDialog.open('h21-selected-passengers');
	}

	showTravelers() {
		this._rightPanelDialog.open('h21-selected-passengers');
	}

	clearSearch() {

		this.destinationControl.setValue('');

		this.searchOptions.paymentMethod = 'account';
		this.searchOptions.destination = '';
		this.searchOptions.nationality = this.defaultNationality;
		this.searchOptions.checkInDate = null;
		this.searchOptions.checkOutDate = null;
		this.searchOptions.nightsCount = 1;
		this.searchOptions.roomCount = 1;

		this.onClearSearch.emit();
	}

	search() {
		this.onSearch.emit(this.searchOptions);
	}
}
