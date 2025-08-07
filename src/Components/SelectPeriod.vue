<script setup>
import { reactive } from 'vue';
import { format, subDays } from 'date-fns';
defineOptions({
    name: 'SelectPeriodComponent'
});

const today = new Date();
const date = reactive({start: format(subDays(today, 1), 'yyyy-MM-dd'), end: format(today, 'yyyy-MM-dd')});

</script>
<template>
<div class="mt-6 p-2 inline-block bg-gray-900 border border-gray-700 rounded-2xl shadow-lg bg-opacity-90">
  <div class="flex flex-wrap justify-center items-center gap-4 text-lg">
    <div class="text-gray-300 text-lg">Выберите период:</div>
    <div class="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-xl border border-gray-700 hover:border-blue-500 transition-colors">
      <span class="text-gray-400 text-xl">с</span>
      <input v-model="date.start" type="date" class="bg-transparent text-white focus:outline-none  rounded-lg ">
    </div>
    <div class="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-xl border border-gray-700 hover:border-emerald-500 transition-colors">
      <span class="text-gray-400">до</span>
      <input v-model="date.end" type="date" class="bg-transparent text-white focus:outline-none rounded-lg">
    </div>
    <button @click.prevent="$emit('date', {'dateFrom': date.start, 'dateTo': date.end})" class="px-5 py-2 bg-gradient-to-r cursor-pointer from-blue-600 to-blue-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all active:scale-95">Применить</button>
  </div>
</div>
</template>
<style scoped>
input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(0.8);
}
</style>