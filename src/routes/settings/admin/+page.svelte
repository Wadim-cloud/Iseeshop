<script lang="ts">
    import { onMount } from 'svelte';
    import { supabase } from '$lib/supabase';
    import { Chart } from 'chart.js/auto';
    import { format, subDays, isAfter } from 'date-fns';
  
    let activity = [];
    let filteredActivity = [];
    let chartCanvas: HTMLCanvasElement;
    let chartInstance: Chart;
  
    let selectedDays = 7;
    let selectedType = 'all';
    let selectedLabel = 'all';
  
    let summary = {};
    let dailyLabels = [];
  
    const loadActivity = async () => {
      const { data, error } = await supabase
        .from('admin_activity_feed')
        .select('*')
        .order('occurred_at', { ascending: false });
  
      if (error) {
        console.error('Failed to load admin activity feed:', error);
        return;
      }
  
      activity = data;
      applyFilters();
    };
  
    function applyFilters() {
      const now = new Date();
      filteredActivity = activity.filter(row => {
        const occurredAt = new Date(row.occurred_at);
        const withinTime = isAfter(occurredAt, subDays(now, selectedDays));
        const matchesType = selectedType === 'all' || row.event_type === selectedType;
        return withinTime && matchesType;
      });
  
      buildSummaryAndLabels();
      drawChart();
    }
  
    function buildSummaryAndLabels() {
      summary = filteredActivity.reduce((acc, entry) => {
        const date = format(new Date(entry.occurred_at), 'yyyy-MM-dd');
        acc[date] = acc[date] || { total: 0, comment: 0, drawing: 0, order: 0, user: 0 };
        acc[date][entry.event_type]++;
        acc[date].total++;
        return acc;
      }, {});
  
      const dates = Object.keys(summary).sort();
      dailyLabels = [];
  
      dates.forEach((date, i) => {
        const currentTotal = summary[date].total;
        const prevDate = dates[i - 1];
        const prevTotal = prevDate ? summary[prevDate]?.total || 0 : 0;
  
        let label = 'Stable';
        if (prevTotal > 0) {
          const change = ((currentTotal - prevTotal) / prevTotal) * 100;
          if (change >= 100) label = 'Anomaly';
          else if (change >= 10) label = 'Increasing';
          else if (change <= -10) label = 'Decreasing';
        }
  
        dailyLabels.push({ date, label });
      });
    }
  
    function drawChart() {
      let displayLabels = dailyLabels;
  
      if (selectedLabel !== 'all') {
        displayLabels = dailyLabels.filter(l => l.label.toLowerCase() === selectedLabel);
      }
  
      const comments = displayLabels.map(l => summary[l.date]?.comment || 0);
      const drawings = displayLabels.map(l => summary[l.date]?.drawing || 0);
      const orders = displayLabels.map(l => summary[l.date]?.order || 0);
      const users = displayLabels.map(l => summary[l.date]?.user || 0);
  
      if (chartInstance) chartInstance.destroy();
  
      chartInstance = new Chart(chartCanvas, {
        type: 'bar',
        data: {
          labels: displayLabels.map(l => `${l.date} (${l.label})`),
          datasets: [
            { label: 'Comments', data: comments },
            { label: 'Drawings', data: drawings },
            { label: 'Orders', data: orders },
            { label: 'New Users', data: users },
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Admin Activity Overview' }
          }
        }
      });
    }
  
    onMount(loadActivity);
  </script>
  
  <div class="p-4">
    <h1 class="text-xl font-bold mb-4">Admin Activity Report</h1>
  
    <div class="flex gap-4 mb-6">
      <div>
        <label class="block text-sm mb-1">Show Last</label>
        <select bind:value={selectedDays} on:change={applyFilters} class="border p-1 rounded">
          <option value="1">1 day</option>
          <option value="7">7 days</option>
          <option value="30">30 days</option>
          <option value="90">90 days</option>
        </select>
      </div>
      <div>
        <label class="block text-sm mb-1">Event Type</label>
        <select bind:value={selectedType} on:change={applyFilters} class="border p-1 rounded">
          <option value="all">All</option>
          <option value="comment">Comments</option>
          <option value="drawing">Drawings</option>
          <option value="order">Orders</option>
          <option value="user">New Users</option>
        </select>
      </div>
      <div>
        <label class="block text-sm mb-1">Label</label>
        <select bind:value={selectedLabel} on:change={applyFilters} class="border p-1 rounded">
          <option value="all">All</option>
          <option value="stable">Stable</option>
          <option value="increasing">Increasing</option>
          <option value="decreasing">Decreasing</option>
          <option value="anomaly">Anomaly</option>
        </select>
      </div>
    </div>
  
    <canvas bind:this={chartCanvas} class="mb-8 rounded-lg shadow-md border border-gray-300"></canvas>
  
    <table class="w-full text-sm border border-gray-300 shadow-md rounded overflow-hidden">
      <thead class="bg-gray-100 text-left">
        <tr>
          <th class="p-2">Type</th>
          <th class="p-2">Actor</th>
          <th class="p-2">Target</th>
          <th class="p-2">Description</th>
          <th class="p-2">At</th>
          <th class="p-2">Push</th>
        </tr>
      </thead>
      <tbody>
        {#each filteredActivity as row}
          <tr class="border-t hover:bg-gray-50 transition-all">
            <td class="p-2 font-mono">{row.event_type}</td>
            <td class="p-2 truncate">{row.actor_id}</td>
            <td class="p-2 truncate">{row.target_user_id || '-'}</td>
            <td class="p-2">{row.description}</td>
            <td class="p-2">{format(new Date(row.occurred_at), 'PPpp')}</td>
            <td class="p-2">{row.push_sent ? '✅' : (row.push_error ? '❌' : '-')}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  
  <style>
    canvas {
      filter: url('#kif');
    }
  </style>
  
  <svg width="0" height="0">
    <filter id="kif">
      <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" result="turbulence" />
      <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="2" />
    </filter>
  </svg>
  