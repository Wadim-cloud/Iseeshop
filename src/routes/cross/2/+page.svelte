<script>
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';

  let phone1 = '';
  let phone2 = '';
  let product = '';
  let group1 = '', group2 = '', group3 = '';
  let chartCanvas;
  let chartInstance;
  let digits = [];

  function normalizePhone(input) {
    return input.replace(/\D/g, '');
  }

  function toDigits(group) {
    return group.split('');
  }

  function calculateGroups() {
    const num1 = BigInt(normalizePhone(phone1));
    const num2 = BigInt(normalizePhone(phone2));
    const result = num1 * num2;

    product = result.toString().padStart(21, '0');

    group3 = product.slice(0, 7);   // Degrees
    group2 = product.slice(7, 14);  // Transform
    group1 = product.slice(14, 21); // Message

    digits = product.split('').map(d => parseInt(d));
    renderChart();
  }

  function renderChart() {
    const labels = Array.from({ length: 21 }, (_, i) => `P${i + 1}`);
    const backgroundColors = digits.map((_, i) => {
      if (i < 7) return 'rgba(255, 99, 132, 0.6)';      // Message
      if (i < 14) return 'rgba(54, 162, 235, 0.6)';      // Transform
      return 'rgba(75, 192, 192, 0.6)';                  // Degrees
    });

    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(chartCanvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Digit Value',
          data: digits,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors.map(c => c.replace('0.6', '1')),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            min: 0,
            max: 9,
            ticks: {
              stepSize: 1
            },
            title: {
              display: true,
              text: 'Digit Value'
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Digit Pattern of Product (Grouped by 7s)'
          },
          tooltip: {
            callbacks: {
              label: function (ctx) {
                const group = ctx.dataIndex < 7 ? 'Group 1: Message'
                            : ctx.dataIndex < 14 ? 'Group 2: Transform'
                            : 'Group 3: Degrees';
                return `${group} → Digit ${ctx.dataIndex + 1}: ${ctx.formattedValue}`;
              }
            }
          }
        }
      }
    });
  }

  onMount(() => {
    digits = Array(21).fill(0);
    renderChart();
  });
</script>

<style>
  input {
    padding: 6px;
    font-size: 1rem;
    margin: 0.5rem 0;
    width: 100%;
    max-width: 320px;
  }

  button {
    padding: 8px 16px;
    margin-top: 10px;
    font-size: 1rem;
    cursor: pointer;
  }

  .group {
    display: flex;
    gap: 4px;
    margin-bottom: 12px;
    font-family: monospace;
    align-items: center;
  }

  .digit {
    width: 32px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1.2rem;
    background: #f9f9f9;
  }

  .label {
    width: 140px;
    font-weight: bold;
    font-size: 1rem;
  }

  .result {
    margin-top: 1rem;
    font-family: monospace;
    font-size: 0.9rem;
    color: #444;
  }

  canvas {
    max-width: 100%;
    margin-top: 2rem;
  }
</style>

<h2>Phone Number Product Visualizer</h2>

<input bind:value={phone1} placeholder="Enter first phone number" />
<input bind:value={phone2} placeholder="Enter second phone number" />

<button on:click={calculateGroups}>Calculate</button>

{#if product}
  <div class="result">Product: {product}</div>

  <div class="group">
    <div class="label">Group 3 (Degrees)</div>
    {#each toDigits(group3) as digit}
      <div class="digit">{digit}</div>
    {/each}
  </div>

  <div class="group">
    <div class="label">Group 2 (Transform)</div>
    {#each toDigits(group2) as digit}
      <div class="digit">{digit}</div>
    {/each}
  </div>

  <div class="group">
    <div class="label">Group 1 (Message)</div>
    {#each toDigits(group1) as digit}
      <div class="digit">{digit}</div>
    {/each}
  </div>

  <canvas bind:this={chartCanvas}></canvas>
{/if}
