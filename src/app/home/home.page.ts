import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface infoDataCities {
  name: string;
  state: string;
  id: number;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  apiKey = '56f3da811c960ad0e832a441d917db5e';
  city = 'RJ';
  country = 'BR';

  resultPrevision: infoDataCities[] = [];
  searchFilter: infoDataCities[] = [];
  resultPagination: infoDataCities[] = [];
  uniqueStates: any[]=[];

  currentPage = 1;
  itemsPerPage = 20;
  totalPages = 1;

  filterCity = '';
  filterState = '';

  darkModeEnabled: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getStatesForCountry();
  }

  getStatesForCountry() {
    const url = `http://apiadvisor.climatempo.com.br/api/v1/locale/city?country=${this.country}&token=${this.apiKey}`;
    this.http.get<infoDataCities[]>(url).subscribe((data) => {
      this.resultPrevision = data;
      this.searchFilter = data;
      this.resultPagination = this.resultPrevision.slice(0, this.itemsPerPage);
      this.totalPages = Math.ceil(this.resultPrevision.length / this.itemsPerPage);

      this.getUniqueStates();
    });
  }

  getUniqueStates() {
    const states = new Set<string>();
    this.resultPrevision.forEach((data) => {
      states.add(data.state);
    });
    this.uniqueStates = Array.from(states);
  }

  applyFilter() {
    let filteredData = this.resultPrevision;

    if (this.filterCity) {
      filteredData = filteredData.filter(data =>
        data.name.toLowerCase().includes(this.filterCity.toLowerCase())
      );
    }

    if (this.filterState) {
      filteredData = filteredData.filter(data =>
        data.state.toLowerCase() === this.filterState.toLowerCase()
      );
    }

    this.searchFilter = filteredData;
    this.resultPagination = this.searchFilter.slice(0, this.itemsPerPage);
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.searchFilter.length / this.itemsPerPage);
  }

  pageLoading(direction: number) {
    const newPage = this.currentPage + direction;
    if (newPage >= 1 && newPage <= this.totalPages) {
      const startIndex = (newPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.resultPagination = this.searchFilter.slice(startIndex, endIndex);
      this.currentPage = newPage;
    }
  }

  getTemperatureImage(temperature: number): string {
    if (temperature >= 30) {
      return 'assets/images/sunny.png';
    } else if (temperature >= 20) {
      return 'assets/images/partly_sunny.png';
    } else {
      return 'assets/images/cloudy.png';
    }
  }
}
