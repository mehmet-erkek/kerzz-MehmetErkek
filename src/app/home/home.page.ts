import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { RestaurantService } from '../services/restaurant.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  restaurants: any[] = [];
  allRestaurants: any[] = [];

  limit: number = 10;
  skip: number = 0;
  latitude: number=0;
  longitude: number=0;

  constructor(private geolocation: Geolocation, private restaurantService: RestaurantService) { }

  ngOnInit() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      this.loadRestaurants();
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  loadRestaurants(event?: any) {
    if (this.latitude !== undefined && this.longitude !== undefined) {
      this.restaurantService.getRestaurants(this.latitude, this.longitude, this.limit, this.skip).subscribe((data) => {
      
        this.restaurants = this.restaurants.concat(data.response); 
        this.restaurants.forEach((restaurant) => {
          restaurant.distance = this.calculateDistanceInKilometers(this.latitude, this.longitude, restaurant.storeInfo.geoLocation.latitude, restaurant.storeInfo.geoLocation.longitude);
        });
        
        this.allRestaurants = this.restaurants;

        if (event) {
          event.target.complete();
        }
        this.skip += this.limit;
      });
    }
  }

  loadMore(event: any) {
    this.loadRestaurants(event);
  }

  filterRestaurants(event: any) {
    const searchTerm = event.target.value.toLowerCase();

    if (searchTerm) {
      this.restaurants = this.allRestaurants.filter(restaurant => {
        return restaurant.title.toLowerCase().includes(searchTerm) ||
          restaurant.text.toLowerCase().includes(searchTerm);
      });
    } else {
      this.restaurants = this.allRestaurants;
    }
  }
  
  calculateDistanceInKilometers(lat1: number, long1: number, lat2: number, long2: number): number {
    let EARTH_RADIUS_KM = 6371; // Dünya'nın kilometre olarak yarıçapı
    let distance = Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(long2 - long1, 2));
    let distanceInKm = distance * (Math.PI / 180) * EARTH_RADIUS_KM; //işletme konumu ile kullanıcının konumu arasındaki mesafe hesaplanır
    return Number(distanceInKm.toFixed(2)); // Sonucu ondalıklı sayı  formatına döner örn: 1.149875646 değerini  1.15  km olarak 

}

}
