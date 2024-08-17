<template>
  <div class="flex flex-col gap-4">
    <ULink to="/" class="pl-2">⬅️ pavi2410's toolkit</ULink>

    <h1 class="text-2xl font-sembold pl-4">
      <slot name="header" />
    </h1>

    <slot />
  </div>
</template>
