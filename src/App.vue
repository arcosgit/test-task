<script setup>
</script>
<template>
<div class="container mx-auto">
  <nav class="mt-10 bg-zinc-900 p-4 border-2 border-gray-700 rounded-2xl shadow-xl backdrop-blur-sm bg-opacity-90">
    <div class="flex justify-center items-center gap-x-6 max-[555px]:flex-col max-[555px]:gap-y-2">
      <router-link to="/orders" class="text-lg font-medium px-4 py-2 rounded-lg transition-all duration-300 max-[555px]:w-full flex justify-center items-center" :class="{
          'text-blue-400 bg-gray-800 shadow-inner': $route.path === '/orders',
          'text-gray-300 hover:text-white hover:bg-gray-800': $route.path !== '/orders'
        }">
        <span class="flex items-center gap-2">Заказы</span>
      </router-link>
      <router-link to="/sales" class="text-lg font-medium px-4 py-2 rounded-lg transition-all duration-300 max-[555px]:w-full flex justify-center items-center"
        :class="{
          'text-emerald-400 bg-gray-800 shadow-inner': $route.path === '/sales',
          'text-gray-300 hover:text-white hover:bg-gray-800': $route.path !== '/sales'
        }"
      >
        <span class="flex items-center gap-2">Продажи</span>
      </router-link>
      <router-link to="/stocks" class="text-lg font-medium px-4 py-2 rounded-lg transition-all duration-300 max-[555px]:w-full flex justify-center items-center"
        :class="{
          'text-amber-400 bg-gray-800 shadow-inner': $route.path === '/stocks',
          'text-gray-300 hover:text-white hover:bg-gray-800': $route.path !== '/stocks'
        }"
      >
        <span class="flex items-center gap-2">Склады</span>
      </router-link>
      <router-link to="/incomes" class="text-lg font-medium px-4 py-2 rounded-lg transition-all duration-300 max-[555px]:w-full flex justify-center items-center"
        :class="{
          'text-purple-400 bg-gray-800 shadow-inner': $route.path === '/incomes',
          'text-gray-300 hover:text-white hover:bg-gray-800': $route.path !== '/incomes'
        }"
      >
        <span class="flex items-center gap-2">Доходы</span>
      </router-link>
    </div>
  </nav>
  <router-view />
</div>
</template>
