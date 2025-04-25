<script>
	export let todos = [];
	export let onToggleDone;
	export let onRemove;
	import { send } from './transition.js';
  </script>
  
  <ul>
	{#each todos as todo (todo.id)}
	  <li transition:send>
		<input
		  type="checkbox"
		  checked={todo.done}
		  on:change={() => onToggleDone(todo)}
		/>
		<span>{todo.description}</span>
		<button on:click={() => onRemove(todo)} aria-label="Remove">
		  <svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width="24"
			height="24"
		  >
			<path
			  fill="#888"
			  stroke="none"
			  d="M22 4.2h-5.6L15 1.6c-.1-.2-.4-.4-.7-.4H9.6c-.2 0-.5.2-.6.4L7.6 4.2H2c-.4 0-.8.4-.8.8s.4.8.8.8h1.8V22c0 .4.3.8.8.8h15c.4 0 .8-.3.8-.8V5.8H22c.4 0 .8-.3.8-.8s-.4-.8-.8-.8zM10.8 16.5c0 .4-.3.8-.8.8s-.8-.3-.8-.8V10c0-.4.3-.8.8-.8s.8.3.8.8v6.5zm4 0c0 .4-.3.8-.8.8s-.8-.3-.8-.8V10c0-.4.3-.8.8-.8s.8.3.8.8v6.5z"
			/>
		  </svg>
		</button>
	  </li>
	{/each}
  </ul>
  
  <style>
	ul {
	  list-style: none;
	  padding: 0;
	  margin: 0;
	}
  
	li {
	  display: flex;
	  align-items: center;
	  justify-content: space-between;
	  padding: 0.5em 0;
	  border-bottom: 1px solid #ddd;
	}
  
	input[type="checkbox"] {
	  margin-right: 1em;
	}
  
	button {
	  background: none;
	  border: none;
	  cursor: pointer;
	  padding: 0;
	  display: flex;
	  align-items: center;
	  justify-content: center;
	}
  
	button:hover svg path {
	  fill: #ff5555;
	}
  
	svg {
	  width: 20px;
	  height: 20px;
	}
  </style>
  