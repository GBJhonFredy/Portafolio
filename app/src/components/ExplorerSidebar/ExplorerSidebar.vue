<template>
  <div class="w-1/3 min-w-[200px] max-w-[250px] border-r border-slate-300 bg-gradient-to-b from-[#192438] to-[#192438] p-3 text-xs md:text-sm h-full overflow-y-auto">
    
    <!-- Mis sitios Panel -->
    <div class="bg-[#192438] rounded-t-sm rounded-b-sm border border-slate-300 mb-4 overflow-hidden shadow-sm">
      <div class="bg-gradient-to-r from-[#192438] to-[#dbeafe] px-3 py-1.5 border-b border-slate-200 cursor-pointer flex justify-between items-center group">
        <span class="font-bold text-[#fff] group-hover:text-[#3b82f6]">Mis sitios</span>
        <svg viewBox="0 0 24 24" class="w-4 h-4 text-[#fff]"><path d="M12 8l-6 6h12z" fill="currentColor"/></svg>
      </div>
      <div class="bg-blue-50/50 p-2">
        <ul class="space-y-1">
          <!-- Mi PC -->
          <li class="flex items-center gap-2 px-1 py-1 hover:bg-[#4e5661] hover:underline cursor-pointer text-[#fff]" @click="$emit('navigate', 'mi-pc')">
            <svg viewBox="0 0 32 32" class="w-4 h-4 shrink-0">
              <rect x="4" y="4" width="20" height="14" rx="1" fill="#e2e8f0" stroke="#475569" stroke-width="1.5"/>
              <rect x="5.5" y="5.5" width="17" height="11" fill="#3b82f6"/>
              <path d="M10 18.5h8v3h-8z" fill="#cbd5e1" stroke="#475569" stroke-width="1.5"/>
              <path d="M6 21.5h16v2H6z" fill="#94a3b8" stroke="#475569" stroke-width="1.5"/>
              <rect x="23" y="6" width="6" height="16" rx="1" fill="#e2e8f0" stroke="#475569" stroke-width="1.5"/>
              <circle cx="26" cy="9" r="1" fill="#10b981"/>
            </svg>
            <span class="text-xs">Mi PC</span>
          </li>
          
          <!-- Mis documentos -->
          <li class="flex items-center gap-2 px-1 py-1 hover:bg-[#4e5661] hover:underline cursor-pointer text-[#fff]" @click="$emit('navigate', 'mis-documentos')">
            <svg viewBox="0 0 32 32" class="w-4 h-4 shrink-0">
              <path d="M3 8h8l3 4h15v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" fill="#fcd34d" stroke="#b45309" stroke-width="1.5" stroke-linejoin="round"/>
              <path d="M2 13h28v13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V13z" fill="#fde047" stroke="#b45309" stroke-width="1.5" stroke-linejoin="round"/>
            </svg>
            <span class="text-xs">Mis documentos</span>
          </li>
          
          <!-- Disco local (C:) -->
          <li class="flex items-center gap-2 px-1 py-1 hover:bg-[#4e5661] hover:underline cursor-pointer text-[#fff]" @click="$emit('navigate', 'disco-c')">
            <svg viewBox="0 0 32 32" class="w-4 h-4 shrink-0">
              <rect x="3" y="10" width="26" height="12" rx="2" fill="#cbd5e1" stroke="#64748b" stroke-width="1.5"/>
              <path d="M5 14h22v4H5v-4z" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1"/>
              <circle cx="8" cy="16" r="1.5" fill="#10b981"/>
            </svg>
            <span class="text-xs">Disco local (C:)</span>
          </li>
          
          <!-- Papelera -->
          <li class="flex items-center gap-2 px-1 py-1 hover:bg-[#4e5661] hover:underline cursor-pointer text-[#fff]" @click="$emit('navigate', 'papelera')">
            <svg viewBox="0 0 32 32" class="w-4 h-4 shrink-0">
              <path d="M8 8h16l-2 18H10L8 8z" fill="#f8fafc" stroke="#64748b" stroke-width="1.5" stroke-linejoin="round"/>
              <path d="M6 6h20v3H6z" fill="#cbd5e1" stroke="#64748b" stroke-width="1.5"/>
              <path d="M12 3h8v3h-8z" fill="#cbd5e1" stroke="#64748b" stroke-width="1.5"/>
              <path d="M13 11v12M16 11v12M19 11v12" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <span class="text-xs">Papelera de reciclaje</span>
          </li>
        </ul>
      </div>
    </div>
    
  </div>
</template>

<script setup>
defineEmits(['navigate']);
</script>

<style scoped>
/* Scrollbar settings for sidebar */
::-webkit-scrollbar {
  width: 12px;
}
::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-left: 1px solid #cbd5e1;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border: 1px solid #94a3b8;
  border-radius: 2px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
