import { e as ensure_array_like, f as escape_html, p as pop, a as push } from "../../../../chunks/index.js";
import "../../../../chunks/supabase.js";
import "chart.js/auto";
import { format } from "date-fns";
function _page($$payload, $$props) {
  push();
  let filteredActivity = [];
  const each_array = ensure_array_like(filteredActivity);
  $$payload.out += `<div class="p-4"><h1 class="text-xl font-bold mb-4">Admin Activity Report</h1> <div class="flex gap-4 mb-6"><div><label class="block text-sm mb-1">Show Last</label> <select class="border p-1 rounded"><option value="1">1 day</option><option value="7">7 days</option><option value="30">30 days</option><option value="90">90 days</option></select></div> <div><label class="block text-sm mb-1">Event Type</label> <select class="border p-1 rounded"><option value="all">All</option><option value="comment">Comments</option><option value="drawing">Drawings</option><option value="order">Orders</option><option value="user">New Users</option></select></div> <div><label class="block text-sm mb-1">Label</label> <select class="border p-1 rounded"><option value="all">All</option><option value="stable">Stable</option><option value="increasing">Increasing</option><option value="decreasing">Decreasing</option><option value="anomaly">Anomaly</option></select></div></div> <canvas class="mb-8 rounded-lg shadow-md border border-gray-300 svelte-1uzbk91"></canvas> <table class="w-full text-sm border border-gray-300 shadow-md rounded overflow-hidden"><thead class="bg-gray-100 text-left"><tr><th class="p-2">Type</th><th class="p-2">Actor</th><th class="p-2">Target</th><th class="p-2">Description</th><th class="p-2">At</th><th class="p-2">Push</th></tr></thead><tbody><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let row = each_array[$$index];
    $$payload.out += `<tr class="border-t hover:bg-gray-50 transition-all"><td class="p-2 font-mono">${escape_html(row.event_type)}</td><td class="p-2 truncate">${escape_html(row.actor_id)}</td><td class="p-2 truncate">${escape_html(row.target_user_id || "-")}</td><td class="p-2">${escape_html(row.description)}</td><td class="p-2">${escape_html(format(new Date(row.occurred_at), "PPpp"))}</td><td class="p-2">${escape_html(row.push_sent ? "✅" : row.push_error ? "❌" : "-")}</td></tr>`;
  }
  $$payload.out += `<!--]--></tbody></table></div> <svg width="0" height="0"><filter id="kif"><feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" result="turbulence"></feTurbulence><feDisplacementMap in2="turbulence" in="SourceGraphic" scale="2"></feDisplacementMap></filter></svg>`;
  pop();
}
export {
  _page as default
};
