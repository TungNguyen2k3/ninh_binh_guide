<template>
  <div class="flex flex-col gap-1">
    <!-- Label -->
    <label
      v-if="label"
      :for="inputId"
      class="text-sm font-medium text-gray-700"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-0.5" aria-hidden="true">*</span>
    </label>

    <!-- Input wrapper -->
    <div class="relative">
      <!-- Prefix slot -->
      <div
        v-if="$slots.prefix"
        class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400"
      >
        <slot name="prefix" />
      </div>

      <input
        :id="inputId"
        v-bind="$attrs"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        class="block w-full rounded-xl border bg-white px-3 py-2.5 text-base text-gray-900 placeholder-gray-400 transition-colors duration-150"
        :class="[
          $slots.prefix ? 'pl-10' : '',
          $slots.suffix ? 'pr-10' : '',
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none'
            : 'border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none',
          disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''
        ]"
        @input="onInput"
        @blur="emit('blur', $event)"
      />

      <!-- Suffix slot -->
      <div
        v-if="$slots.suffix"
        class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400"
      >
        <slot name="suffix" />
      </div>
    </div>

    <!-- Error message -->
    <p
      v-if="error"
      class="text-sm text-red-600"
      role="alert"
    >
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label?: string
  type?: string
  placeholder?: string
  error?: string
  modelValue?: string
  required?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
}>()

// Generate a stable unique id for label-input association
const inputId = useId()

function onInput(event: Event): void {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>
