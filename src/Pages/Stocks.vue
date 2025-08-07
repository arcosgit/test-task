<script setup>
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { format } from 'date-fns';
import setPagesForPaginate from '@/js/setPagesForPaginate.js';
import axios from 'axios';
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { useChartDataStore } from '@/store/chartData';
defineOptions({
    name: 'StockPage'
});
const touchLine = ref(0);
const choiceSort = ref(null);
ChartJS.register(ArcElement, Tooltip, Legend)
const today = new Date();
const stockData = reactive({data: ['loading'], pages: [], currentPage: 1, lastPage: null, loaded: false});
const getStock = async (page) => {
    try{
        const stock = await axios.get(`http://109.73.206.144:6969/api/stocks?dateFrom=${format(today, 'yyyy-MM-dd')}&dateTo=${format(today, 'yyyy-MM-dd')}&page=${page}&limit=10&key=E6kUTYrYwZq2tN4QEtyzsbEBk3ie`);
        const filteredStock = stock.data.data.filter(stock => stock.category != null && stock.brand != null && stock.price != null);
        useChartDataStore().labels = filteredStock.map(order => 'Бренд: ' + order.brand);
        useChartDataStore().datasets[0].data = filteredStock.map(order => order.price);
        stockData.data = filteredStock;
        stockData.lastPage = stock.data.meta.last_page;
        stockData.currentPage = page;
        touchLine.value++;
        stockData.pages = setPagesForPaginate(page, stockData.lastPage);
    } catch {
        stockData.data = [];
    }
}

onMounted(async() => {
  await getStock(stockData.currentPage);
  stockData.loaded = true;
})

onBeforeUnmount(() => {
    useChartDataStore().reseteData();
})
</script>
<template>
    <div v-show="stockData.data.length > 0 || !stockData.loaded">
        <div class="mt-4 text-white text-xl text-center">Бренд и цена каждого товара со склада</div>
        <div class="mt-2 text-sm text-orange-300 text-center">Обратите внимание, товары у которых нет бренда, категории или цены были убраны</div>
        <Pie :key="touchLine" class="bg-zinc-800 mt-4 rounded-xl" :data="useChartDataStore()" :options="{responsive: true}" />
        <div class="flex justify-between items-center mt-4">
            <div class="fake"></div>
            <div class="text-white text-xl text-center">Дополнительная информация</div>
            <div class="relative group">
                <svg fill="#ffffff" width="40px" height="40px" viewBox="0 0 24.00 24.00" id="filter-alt" data-name="Flat Line" xmlns="http://www.w3.org/2000/svg" class="icon flat-line cursor-pointer" transform="matrix(1, 0, 0, 1, 0, 0)rotate(0)" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.144"></g><g id="SVGRepo_iconCarrier"><path id="secondary" d="M5,17a2,2,0,1,0,2,2A2,2,0,0,0,5,17ZM12,3a2,2,0,1,0,2,2A2,2,0,0,0,12,3Zm7,7a2,2,0,1,0,2,2A2,2,0,0,0,19,10Z" style="fill: #2ca9bc; stroke-width:0.768;"></path><path id="primary" d="M5,3V17M12,7V21m7-7v7m0-11V3" style="fill: none; stroke: #ffffff; stroke-linecap: round; stroke-linejoin: round; stroke-width:0.768;"></path><path id="primary-2" data-name="primary" d="M5,17a2,2,0,1,0,2,2A2,2,0,0,0,5,17ZM12,3a2,2,0,1,0,2,2A2,2,0,0,0,12,3Zm7,7a2,2,0,1,0,2,2A2,2,0,0,0,19,10Z" style="fill: none; stroke: #ffffff; stroke-linecap: round; stroke-linejoin: round; stroke-width:0.768;"></path></g></svg>
                <div class="absolute scale-0 w-30 group-hover:scale-100 bg-zinc-800 border-2 border-zinc-700 rounded-xl right-0 transition duration-150">
                <div class="text-white border-b p-1 text-center">Сортировать</div>
                <div @click.prevent="stockData.data.sort((a, b) => Number(b.price) - Number(a.price)), choiceSort = 'price'" :class="choiceSort == 'price' ? 'text-blue-400' : 'text-blue-50 hover:text-blue-200'" class="p-1 text-center cursor-pointer">По цене</div>
                <div @click.prevent="stockData.data.sort((a, b) => Number(b.discount) - Number(a.discount)), choiceSort = 'discount'" :class="choiceSort == 'discount' ? 'text-blue-400' : 'text-blue-50 hover:text-blue-200'" class="p-1 text-center cursor-pointer border-t border-t-zinc-500">По скидке</div>
                </div>
            </div>
        </div>
        <div class="mt-4 bg-zinc-800 rounded-xl shadow-lg overflow-x-auto">
            <table class="w-full text-white">
                <thead>
                <tr class="border-b border-zinc-500 text-center text-gray-300">
                    <th class="p-2 font-medium">Бренд</th>
                    <th class="p-2 font-medium">Категория</th>
                    <th class="p-2 font-medium">Скидка</th>
                    <th class="p-2 font-medium">Цена</th>
                    <th class="p-2 font-medium">Склад</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="sale in stockData.data" :key="sale" class="hover:bg-gray-800 transition-colors text-center">
                    <td class="p-2 text-blue-400 font-mono truncate">{{ sale.brand }}</td>
                    <td class="p-2 text-emerald-400 font-mono">{{ sale.category }}</td>
                    <td class="px-4 py-3 text-center text-green-500">{{ sale.discount }}</td>
                    <td class="p-2 font-medium text-fuchsia-400">{{ sale.price }}</td>
                    <td class="p-2 text-pink-500">{{ sale.warehouse_name }}</td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="flex flex-wrap gap-y-2 justify-center items-center mt-4 mb-4 gap-x-2">
        <div v-for="page in stockData.pages" :key="page" class="bg-zinc-800 rounded-lg text-lg text-white cursor-pointer">
            <button @click.prevent="getStock(page), choiceSort = null" :class="{'border-cyan-400': stockData.currentPage == page, 'border-zinc-800': stockData.currentPage != page, 'hover:border-cyan-200': stockData.currentPage != page}" class="min-w-12 min-h-12 border flex justify-center items-center cursor-pointer rounded-lg transition duration-150">{{ page }}</button>
        </div>
        <div v-if="stockData.currentPage != stockData.lastPage && stockData.lastPage - 1 != stockData.currentPage" class="bg-zinc-800 rounded-lg text-lg text-white cursor-pointer">
            <div @click.prevent="getStock(stockData.lastPage), choiceSort = null" class="min-w-12 border border-zinc-800 rounded-lg hover:border-cyan-400 min-h-12 flex justify-center items-center transition duration-150">{{ stockData.lastPage }}</div>
        </div>
        </div>
    </div>
    <div class="text-xl text-gray-400 text-center mt-4" v-if="stockData.data.length <= 0">
        <div>На складе ничего не найдено</div>
        <div class="mt-2 text-sm text-orange-300 text-center">Обратите внимание, товары у которых нет бренда, категории или цены были убраны</div>
    </div>

</template>