<template>
  <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
    <table class="min-w-full divide-y divide-gray-300">
      <thead class="bg-gray-50">
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {{ column.label }}
          </th>
          <th v-if="actions" scope="col" class="relative px-6 py-3">
            <span class="sr-only">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-if="loading">
          <td :colspan="columns.length + (actions ? 1 : 0)" class="px-6 py-4 text-center">
            <LoadingSpinner />
          </td>
        </tr>
        <tr v-else-if="items.length === 0">
          <td :colspan="columns.length + (actions ? 1 : 0)" class="px-6 py-4 text-center text-gray-500">
            No data available
          </td>
        </tr>
        <tr v-else v-for="(item, index) in items" :key="getRowKey(item, index)" class="hover:bg-gray-50">
          <td
            v-for="column in columns"
            :key="column.key"
            class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
          >
            <slot :name="`cell-${column.key}`" :item="item" :value="getValue(item, column.key)">
              {{ formatValue(getValue(item, column.key), column.format) }}
            </slot>
          </td>
          <td v-if="actions" class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <slot name="actions" :item="item" :index="index">
              <!-- Default actions slot -->
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import LoadingSpinner from './LoadingSpinner.vue'

interface Column {
  key: string
  label: string
  format?: (value: any) => string
}

interface Props {
  columns: Column[]
  items: any[]
  loading?: boolean
  actions?: boolean
  rowKey?: string | ((item: any, index: number) => string | number)
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  actions: false,
})

function getValue(item: any, key: string): any {
  return key.split('.').reduce((obj, k) => obj?.[k], item)
}

function formatValue(value: any, formatter?: (value: any) => string): string {
  if (formatter) {
    return formatter(value)
  }
  if (value === null || value === undefined) {
    return '-'
  }
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'
  }
  if (value instanceof Date) {
    return value.toLocaleString()
  }
  return String(value)
}

function getRowKey(item: any, index: number): string | number {
  if (typeof props.rowKey === 'function') {
    return props.rowKey(item, index)
  }
  if (typeof props.rowKey === 'string') {
    return getValue(item, props.rowKey) ?? index
  }
  return item.id ?? item.key ?? index
}
</script>

