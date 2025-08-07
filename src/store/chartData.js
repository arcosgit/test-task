import { defineStore } from "pinia";
export const useChartDataStore = defineStore('chartData', {
    state: () => ({
        labels: [],
        datasets: [
          {
            label: 'цена товара',
            backgroundColor: ['#CD5C5C', '#FF69B4', '#FFA07A', '#FFD700', '#EE82EE', '#0000FF', '#4B0082', '#E6E6FA', '#00FFFF'],
            borderColor: '#4bc0c0',
            pointRadius: 7,
            data: []
          }
        ]
    }),
    actions: {
      reseteData(){
        this.labels = [];
        this.datasets[0].data = [];
        this.datasets[0].label = 'цена товара';
      }
    }
})