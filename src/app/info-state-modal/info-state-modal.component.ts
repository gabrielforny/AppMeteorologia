import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

interface infoCity {
  days: any;
}

@Component({
  selector: 'app-info-state-modal',
  templateUrl: './info-state-modal.component.html',
  styleUrls: ['./info-state-modal.component.scss'],
})
export class InfoStateModalComponent implements OnInit{
  @Input() weatherData: any;

  apiKeyWeatherData = 'HUZWA8TRND726T4JHJ25QJEF4';
  temperatureImg = '';
  temperatureCurrente = 0;
  temperatureMax = 0;
  temperatureMin = 0;
  humidity = 0;
  indexuv = 0;
  visibility = 0;
  windspeed = 0;

  constructor(private modalController: ModalController, private http: HttpClient) {}

  ngOnInit(): void {
    this.getTemperatureCurrent(this.weatherData);
  }

  closeModal() {
    this.modalController.dismiss();
  }

  getTemperatureImage(temperature: number): string {

    if (temperature >= 25) {
      return this.temperatureImg ='assets/imgs/sunny.png';
    } else if (temperature >= 20) {
      return this.temperatureImg = 'assets/imgs/partly_sunny.png';
    } else {
      return this.temperatureImg = 'assets/imgs/cloudy.png';
    }
  }

  getTemperatureCurrent(data: any) {
    const city = data.name +','+ data.state+','+data.country;
    const url= `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&include=events&key=${this.apiKeyWeatherData}&contentType=json`

    this.http.get<infoCity>(url).subscribe((result) => {
      this.temperatureCurrente = result.days[0].temp;

      this.getTemperatureImage(this.temperatureCurrente);

      this.temperatureMax = result.days[0].tempmax;
      this.temperatureMin = result.days[0].tempmin;
      this.humidity = result.days[0].humidity;
      this.indexuv = result.days[0].uvindex;
      this.visibility = result.days[0].visibility;
      this.windspeed = result.days[0].windspeed;
    })
  }
}
