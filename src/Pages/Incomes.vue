<script setup>
import axios from 'axios';
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import setPagesForPaginate from '@/js/setPagesForPaginate.js';
import { format, subDays } from 'date-fns';
import SelectPeriod from '@/Components/SelectPeriod.vue';
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { useChartDataStore } from '@/store/chartData';
defineOptions({
    name: 'OrdersPage'
});
ChartJS.register(ArcElement, Tooltip, Legend)
const touchLine = ref(0);
const choiceSort = ref(null);
const incomesData = reactive({data: ['loading'], pages: [], currentPage: 1, lastPage: null, date: {dateFrom: null, dateTo: null}, loaded: false});
const getIncomes = async (page) => {
    try{
      const incomes = await axios.get(`http://109.73.206.144:6969/api/incomes?dateFrom=${incomesData.date.dateFrom}&dateTo=${incomesData.date.dateTo}&page=${page}&limit=10&key=E6kUTYrYwZq2tN4QEtyzsbEBk3ie`);
      useChartDataStore().datasets[0].label = "Количество";
      useChartDataStore().labels = incomes.data.data.map(income => 'Артикль ' + income.supplier_article + ' \nДата: ' + income.date);
      useChartDataStore().datasets[0].data = incomes.data.data.map(income => income.quantity);
      incomesData.data = incomes.data.data;
      incomesData.lastPage = incomes.data.meta.last_page;
      incomesData.currentPage = page;
      touchLine.value++;
      incomesData.pages = setPagesForPaginate(page, incomesData.lastPage);
    } catch {
      incomesData.data = []; 
    }
}

const changeDate = (event) => {
  incomesData.date.dateFrom = event.dateFrom;
  incomesData.date.dateTo = event.dateTo;
  getIncomes(1);
}

onMounted(async () => {
  const today = new Date();
  incomesData.date.dateFrom = format(subDays(today, 1), 'yyyy-MM-dd');
  incomesData.date.dateTo = format(today, 'yyyy-MM-dd');
  await getIncomes(incomesData.currentPage);
  incomesData.loaded = true;
});

onBeforeUnmount(() => {
    useChartDataStore().reseteData();
})

</script>
<template>
  <SelectPeriod @date="changeDate($event)"></SelectPeriod>
  <div v-show="incomesData.data.length > 0 || !incomesData.loaded">
    <div class="mt-4 text-white text-xl text-center">Товар и его количество в этот период времени</div>
    <Doughnut :key="touchLine" class="bg-zinc-800 mt-4 rounded-xl" :data="useChartDataStore()" :options="{responsive: true}"/>
    <div class="flex justify-between items-center mt-4">
      <div class="fake"></div>
      <div class="text-white text-xl text-center">Дополнительная информация</div>
      <div class="relative group">
        <svg fill="#ffffff" width="40px" height="40px" viewBox="0 0 24.00 24.00" id="filter-alt" data-name="Flat Line" xmlns="http://www.w3.org/2000/svg" class="icon flat-line cursor-pointer" transform="matrix(1, 0, 0, 1, 0, 0)rotate(0)" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.144"></g><g id="SVGRepo_iconCarrier"><path id="secondary" d="M5,17a2,2,0,1,0,2,2A2,2,0,0,0,5,17ZM12,3a2,2,0,1,0,2,2A2,2,0,0,0,12,3Zm7,7a2,2,0,1,0,2,2A2,2,0,0,0,19,10Z" style="fill: #2ca9bc; stroke-width:0.768;"></path><path id="primary" d="M5,3V17M12,7V21m7-7v7m0-11V3" style="fill: none; stroke: #ffffff; stroke-linecap: round; stroke-linejoin: round; stroke-width:0.768;"></path><path id="primary-2" data-name="primary" d="M5,17a2,2,0,1,0,2,2A2,2,0,0,0,5,17ZM12,3a2,2,0,1,0,2,2A2,2,0,0,0,12,3Zm7,7a2,2,0,1,0,2,2A2,2,0,0,0,19,10Z" style="fill: none; stroke: #ffffff; stroke-linecap: round; stroke-linejoin: round; stroke-width:0.768;"></path></g></svg>
        <div class="absolute scale-0 w-31 group-hover:scale-100 bg-zinc-800 border-2 border-zinc-700 rounded-xl right-0 transition duration-150">
          <div class="text-white border-b p-1 text-center">Сортировать</div>
          <div @click.prevent="incomesData.data.sort((a, b) => Number(b.quantity) - Number(a.quantity)), choiceSort = 'price'" :class="choiceSort == 'price' ? 'text-blue-400' : 'text-blue-50 hover:text-blue-200'" class="p-1 text-center cursor-pointer">По количеству</div>
        </div>
      </div>
    </div>
    <div class="mt-4 bg-zinc-800 rounded-xl shadow-lg overflow-x-auto">
      <table class="w-full text-white">
        <thead>
          <tr class="border-b border-zinc-500 text-center text-gray-300">
            <th class="p-2 font-medium">Артикль</th>
            <th class="p-2 font-medium">Дата</th>
            <th class="p-2 font-medium">Количество</th>
            <th class="p-2 font-medium">Склад</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in incomesData.data" :key="order" class="hover:bg-gray-800 transition-colors text-center">
            <td class="px-4 py-3 text-blue-400">{{ order.supplier_article }}</td>
            <td class="px-4 py-3 text-emerald-400">{{ order.date }}</td>
            <td class="p-2 font-medium text-fuchsia-400">{{ order.quantity }}</td>
            <td class="p-2 text-pink-500">{{ order.warehouse_name }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex flex-wrap gap-y-2 justify-center items-center mt-4 mb-4 gap-x-2">
      <div v-for="page in incomesData.pages" :key="page" class="bg-zinc-800 rounded-lg text-lg text-white cursor-pointer">
        <button @click.prevent="getIncomes(page), choiceSort = null" :class="{'border-cyan-400': incomesData.currentPage == page, 'border-zinc-800': incomesData.currentPage != page, 'hover:border-cyan-200': incomesData.currentPage != page}" class="min-w-12 min-h-12 border flex justify-center items-center cursor-pointer rounded-lg transition duration-150">{{ page }}</button>
      </div>
      <div v-if="incomesData.currentPage != incomesData.lastPage && incomesData.lastPage - 1 != incomesData.currentPage" class="bg-zinc-800 rounded-lg text-lg text-white cursor-pointer">
        <div @click.prevent="getIncomes(incomesData.lastPage), choiceSort = null" class="min-w-12 border border-zinc-800 rounded-lg hover:border-cyan-400 min-h-12 flex justify-center items-center transition duration-150">{{ incomesData.lastPage }}</div>
      </div>
    </div>
  </div>
  <div class="text-xl text-gray-400 text-center mt-4" v-if="incomesData.data.length <= 0">В этот период времени доходов нет</div>
</template>