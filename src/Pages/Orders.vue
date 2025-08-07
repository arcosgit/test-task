<script setup>
import axios from 'axios';
import { Line } from 'vue-chartjs';
import {Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend} from 'chart.js';
import setPagesForPaginate from '@/js/setPagesForPaginate.js';
import { format, subDays } from 'date-fns';
import SelectPeriod from '@/Components/SelectPeriod.vue';
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { useChartDataStore } from '@/store/chartData';
defineOptions({
    name: 'OrdersPage'
});
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
const touchLine = ref(0);
const choiceSort = ref(null);
const ordersData = reactive({data: ['loading'], pages: [], currentPage: 1, lastPage: null, date: {dateFrom: null, dateTo: null}, loaded: false});
const getOrders = async (page) => {
    try{
      const orders = await axios.get(`http://109.73.206.144:6969/api/orders?dateFrom=${ordersData.date.dateFrom}&dateTo=${ordersData.date.dateTo}&page=${page}&limit=10&key=E6kUTYrYwZq2tN4QEtyzsbEBk3ie`);
      useChartDataStore().labels = orders.data.data.map(order => 'Бренд: ' + order.brand + '\nдата: ' + order.date.slice(0, 10));
      useChartDataStore().datasets[0].data = orders.data.data.map(order => order.total_price);
      ordersData.data = orders.data.data;
      ordersData.lastPage = orders.data.meta.last_page;
      ordersData.currentPage = page;
      touchLine.value++;
      ordersData.pages = setPagesForPaginate(page, ordersData.lastPage);
    } catch {
      ordersData.data = []; 
    }
}

const changeDate = (event) => {
  ordersData.date.dateFrom = event.dateFrom;
  ordersData.date.dateTo = event.dateTo;
  getOrders(1);
}

onMounted(async () => {
  const today = new Date();
  ordersData.date.dateFrom = format(subDays(today, 1), 'yyyy-MM-dd');
  ordersData.date.dateTo = format(today, 'yyyy-MM-dd');
  await getOrders(ordersData.currentPage);
  ordersData.loaded = true;
});

onBeforeUnmount(() => {
    useChartDataStore().reseteData();
})

</script>
<template>
  <SelectPeriod @date="changeDate($event)"></SelectPeriod>
  <div v-show="ordersData.data.length > 0 || !ordersData.loaded">
    <div class="mt-4 text-white text-xl text-center">Цена каждого заказанного товара в конкретный период времени</div>
    <Line :key="touchLine" class="bg-zinc-800 mt-4 rounded-xl" :data="useChartDataStore()" :options="{responsive: true}"/>
    <div class="flex justify-between items-center mt-4">
      <div class="fake"></div>
      <div class="text-white text-xl text-center">Дополнительная информация</div>
      <div class="relative group">
        <svg fill="#ffffff" width="40px" height="40px" viewBox="0 0 24.00 24.00" id="filter-alt" data-name="Flat Line" xmlns="http://www.w3.org/2000/svg" class="icon flat-line cursor-pointer" transform="matrix(1, 0, 0, 1, 0, 0)rotate(0)" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.144"></g><g id="SVGRepo_iconCarrier"><path id="secondary" d="M5,17a2,2,0,1,0,2,2A2,2,0,0,0,5,17ZM12,3a2,2,0,1,0,2,2A2,2,0,0,0,12,3Zm7,7a2,2,0,1,0,2,2A2,2,0,0,0,19,10Z" style="fill: #2ca9bc; stroke-width:0.768;"></path><path id="primary" d="M5,3V17M12,7V21m7-7v7m0-11V3" style="fill: none; stroke: #ffffff; stroke-linecap: round; stroke-linejoin: round; stroke-width:0.768;"></path><path id="primary-2" data-name="primary" d="M5,17a2,2,0,1,0,2,2A2,2,0,0,0,5,17ZM12,3a2,2,0,1,0,2,2A2,2,0,0,0,12,3Zm7,7a2,2,0,1,0,2,2A2,2,0,0,0,19,10Z" style="fill: none; stroke: #ffffff; stroke-linecap: round; stroke-linejoin: round; stroke-width:0.768;"></path></g></svg>
        <div class="absolute scale-0 w-30 group-hover:scale-100 bg-zinc-800 border-2 border-zinc-700 rounded-xl right-0 transition duration-150">
          <div class="text-white border-b p-1 text-center">Сортировать</div>
          <div @click.prevent="ordersData.data.sort((a, b) => Number(b.total_price) - Number(a.total_price)), choiceSort = 'price'" :class="choiceSort == 'price' ? 'text-blue-400' : 'text-blue-50 hover:text-blue-200'" class="p-1 text-center cursor-pointer">По цене</div>
          <div @click.prevent="ordersData.data.sort((a, b) => Number(b.discount_percent) - Number(a.discount_percent)), choiceSort = 'discount'" :class="choiceSort == 'discount' ? 'text-blue-400' : 'text-blue-50 hover:text-blue-200'" class="p-1 text-center cursor-pointer border-t border-t-zinc-500">По скидке</div>
        </div>
      </div>
    </div>
    <div class="mt-4 bg-zinc-800 rounded-xl shadow-lg overflow-x-auto">
      <table class="w-full text-white">
        <thead>
          <tr class="border-b border-zinc-500 text-center text-gray-300">
            <th class="p-2 font-medium">Бренд</th>
            <th class="p-2 font-medium">Категория</th>
            <th class="p-2 font-medium">Дата</th>
            <th class="p-2 font-medium">Скидка</th>
            <th class="p-2 font-medium">Цена</th>
            <th class="p-2 font-medium">Склад</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in ordersData.data" :key="order" class="hover:bg-gray-800 transition-colors text-center">
            <td class="p-2 text-blue-400 font-mono">{{ order.brand }}</td>
            <td class="p-2 text-emerald-400 font-mono">{{ order.category }}</td>
            <td class="px-4 py-3 text-cyan-400">{{ order.date }}</td>
            <td class="px-4 py-3 text-center text-green-500">{{ order.discount_percent }}</td>
            <td class="p-2 font-medium text-fuchsia-400">{{ order.total_price }}</td>
            <td class="p-2 text-pink-500">{{ order.warehouse_name }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex flex-wrap gap-y-2 justify-center items-center mt-4 mb-4 gap-x-2">
      <div v-for="page in ordersData.pages" :key="page" class="bg-zinc-800 rounded-lg text-lg text-white cursor-pointer">
        <button @click.prevent="getOrders(page), choiceSort = null" :class="{'border-cyan-400': ordersData.currentPage == page, 'border-zinc-800': ordersData.currentPage != page, 'hover:border-cyan-200': ordersData.currentPage != page}" class="min-w-12 min-h-12 border flex justify-center items-center cursor-pointer rounded-lg transition duration-150">{{ page }}</button>
      </div>
      <div v-if="ordersData.currentPage != ordersData.lastPage && ordersData.lastPage - 1 != ordersData.currentPage" class="bg-zinc-800 rounded-lg text-lg text-white cursor-pointer">
        <div @click.prevent="getOrders(ordersData.lastPage), choiceSort = null" class="min-w-12 border border-zinc-800 rounded-lg hover:border-cyan-400 min-h-12 flex justify-center items-center transition duration-150">{{ ordersData.lastPage }}</div>
      </div>
    </div>
  </div>
  <div class="text-xl text-gray-400 text-center mt-4" v-if="ordersData.data.length <= 0">В этот период времени заказов нет</div>
</template>