<script setup>
import { Bar } from 'vue-chartjs';
import {Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale} from 'chart.js';
import { format, subDays } from 'date-fns';
import setPagesForPaginate from '@/js/setPagesForPaginate.js';
import SelectPeriod from '@/Components/SelectPeriod.vue';
import axios from 'axios';
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { useChartDataStore } from '@/store/chartData';
defineOptions({
    name: 'SalesPage'
});
const touchLine = ref(0);
const choiceSort = ref(null);
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)
const salesData = reactive({data: ['loading'], pages: [], currentPage: 1, lastPage: null, date: {dateFrom: null, dateTo: null}, loaded: false});
const getSales = async (page) => {
    try{
        const sales = await axios.get(`http://109.73.206.144:6969/api/sales?dateFrom=${salesData.date.dateFrom}&dateTo=${salesData.date.dateTo}&page=${page}&limit=10&key=E6kUTYrYwZq2tN4QEtyzsbEBk3ie`);
        useChartDataStore().labels = sales.data.data.map(order => 'Бренд: ' + order.brand + '\nдата: ' + order.date);
        useChartDataStore().datasets[0].data = sales.data.data.map(order => order.total_price);
        salesData.data = sales.data.data;
        salesData.lastPage = sales.data.meta.last_page;
        salesData.currentPage = page;
        touchLine.value++;
        salesData.pages = setPagesForPaginate(page, salesData.lastPage);
    } catch {
        salesData.data = [];
    }
}
const changeDate = (event) => {
  salesData.date.dateFrom = event.dateFrom;
  salesData.date.dateTo = event.dateTo;
  getSales(1);
}

onMounted(async() => {
  const today = new Date();
  salesData.date.dateFrom = format(subDays(today, 1), 'yyyy-MM-dd');
  salesData.date.dateTo = format(today, 'yyyy-MM-dd');
  await getSales(salesData.currentPage);
  salesData.loaded = true;
})

onBeforeUnmount(() => {
    useChartDataStore().reseteData();
})
</script>
<template>
    <SelectPeriod @date="changeDate($event)"></SelectPeriod>
    <div v-show="salesData.data.length > 0 || !salesData.loaded">
        <div class="mt-4 text-white text-xl text-center">Цена каждого товара проданного в конкретный период времени</div>
        <Bar :key="touchLine" class="bg-zinc-800 mt-4 rounded-xl" :data="useChartDataStore()" :options="{responsive: true}" />
        <div class="flex justify-between items-center mt-4">
            <div class="fake"></div>
            <div class="text-white text-xl text-center">Дополнительная информация</div>
            <div class="relative group">
                <svg fill="#ffffff" width="40px" height="40px" viewBox="0 0 24.00 24.00" id="filter-alt" data-name="Flat Line" xmlns="http://www.w3.org/2000/svg" class="icon flat-line cursor-pointer" transform="matrix(1, 0, 0, 1, 0, 0)rotate(0)" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.144"></g><g id="SVGRepo_iconCarrier"><path id="secondary" d="M5,17a2,2,0,1,0,2,2A2,2,0,0,0,5,17ZM12,3a2,2,0,1,0,2,2A2,2,0,0,0,12,3Zm7,7a2,2,0,1,0,2,2A2,2,0,0,0,19,10Z" style="fill: #2ca9bc; stroke-width:0.768;"></path><path id="primary" d="M5,3V17M12,7V21m7-7v7m0-11V3" style="fill: none; stroke: #ffffff; stroke-linecap: round; stroke-linejoin: round; stroke-width:0.768;"></path><path id="primary-2" data-name="primary" d="M5,17a2,2,0,1,0,2,2A2,2,0,0,0,5,17ZM12,3a2,2,0,1,0,2,2A2,2,0,0,0,12,3Zm7,7a2,2,0,1,0,2,2A2,2,0,0,0,19,10Z" style="fill: none; stroke: #ffffff; stroke-linecap: round; stroke-linejoin: round; stroke-width:0.768;"></path></g></svg>
                <div class="absolute scale-0 w-30 group-hover:scale-100 bg-zinc-800 border-2 border-zinc-700 rounded-xl right-0 transition duration-150">
                <div class="text-white border-b p-1 text-center">Сортировать</div>
                <div @click.prevent="salesData.data.sort((a, b) => Number(b.total_price) - Number(a.total_price)), choiceSort = 'price'" :class="choiceSort == 'price' ? 'text-blue-400' : 'text-blue-50 hover:text-blue-200'" class="p-1 text-center cursor-pointer">По цене</div>
                <div @click.prevent="salesData.data.sort((a, b) => Number(b.discount_percent) - Number(a.discount_percent)), choiceSort = 'discount'" :class="choiceSort == 'discount' ? 'text-blue-400' : 'text-blue-50 hover:text-blue-200'" class="p-1 text-center cursor-pointer border-t border-t-zinc-500">По скидке</div>
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
                <tr v-for="sale in salesData.data" :key="sale" class="hover:bg-gray-800 transition-colors text-center">
            <td class="p-2 text-blue-400 font-mono">{{ sale.brand }}</td>
            <td class="p-2 text-emerald-400 font-mono">{{ sale.category }}</td>
            <td class="px-4 py-3 text-cyan-400">{{ sale.date }}</td>
            <td class="px-4 py-3 text-center text-green-500">{{ sale.discount_percent }}</td>
            <td class="p-2 font-medium text-fuchsia-400">{{ sale.total_price }}</td>
            <td class="p-2 text-pink-500">{{ sale.warehouse_name }}</td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="flex flex-wrap gap-y-2 justify-center items-center mt-4 mb-4 gap-x-2">
        <div v-for="page in salesData.pages" :key="page" class="bg-zinc-800 rounded-lg text-lg text-white cursor-pointer">
            <button @click.prevent="getSales(page), choiceSort = null" :class="{'border-cyan-400': salesData.currentPage == page, 'border-zinc-800': salesData.currentPage != page, 'hover:border-cyan-200': salesData.currentPage != page}" class="min-w-12 min-h-12 border flex justify-center items-center cursor-pointer rounded-lg transition duration-150">{{ page }}</button>
        </div>
        <div v-if="salesData.currentPage != salesData.lastPage && salesData.lastPage - 1 != salesData.currentPage" class="bg-zinc-800 rounded-lg text-lg text-white cursor-pointer">
            <div @click.prevent="getSales(salesData.lastPage), choiceSort = null" class="min-w-12 border border-zinc-800 rounded-lg hover:border-cyan-400 min-h-12 flex justify-center items-center transition duration-150">{{ salesData.lastPage }}</div>
        </div>
        </div>
    </div>
    <div class="text-xl text-gray-400 text-center mt-4" v-if="salesData.data.length <= 0">В этот период времени продаж нет</div>

</template>