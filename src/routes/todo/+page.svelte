<script>
	import { supabase } from '$lib/supabase';
	import TodoList from './TodoList.svelte';
	import { onMount } from 'svelte';
  
	let todos = [];
	let newTodo = '';
  
	// Fetch todos from Supabase on mount
	onMount(async () => {
	  await fetchTodos();
	});
  
	async function fetchTodos() {
	  const { data, error } = await supabase
		.from('todos')
		.select('*')
		.order('id', { ascending: true });
  
	  if (error) {
		console.error('Error fetching todos:', error.message);
		return;
	  }
  
	  todos = data;
	}
  
	async function addTodo() {
	  if (!newTodo.trim()) return;

	  try {
		// Add new todo and fetch the inserted row
		const { data, error } = await supabase
		  .from('todos')
		  .insert([{ description: newTodo, done: false }])
		  .select(); // Use `select()` to retrieve the inserted row
  
		if (error) {
		  console.error('Error adding todo:', error.message);
		  alert('Failed to add todo. Please try again.');
		  return;
		}
  
		// Ensure data is an array before adding it to the UI
		if (Array.isArray(data)) {
		  todos = [...todos, ...data];
		}
		newTodo = ''; // Clear input field
	  } catch (err) {
		console.error('Unexpected error while adding todo:', err);
		alert('An unexpected error occurred. Please try again.');
	  }
	}
  
	async function toggleDone(todo) {
	  try {
		const { error } = await supabase
		  .from('todos')
		  .update({ done: !todo.done })
		  .eq('id', todo.id);
  
		if (error) {
		  console.error('Error updating todo:', error.message);
		  alert('Failed to update todo. Please try again.');
		  return;
		}

		// Immediately update the local state
		todos = todos.map((t) => (t.id === todo.id ? { ...t, done: !t.done } : t));
	  } catch (err) {
		console.error('Unexpected error while updating todo:', err);
		alert('An unexpected error occurred. Please try again.');
	  }
	}
  
	async function remove(todo) {
	  const { error } = await supabase
		.from('todos')
		.delete()
		.eq('id', todo.id);
  
	  if (error) {
		console.error('Error deleting todo:', error.message);
		alert('Failed to delete todo. Please try again.');
		return;
	  }
  
	  todos = todos.filter((t) => t.id !== todo.id); // Remove from UI
	}
</script>
  
<div class="board">
	<input
	  placeholder="What needs to be done?"
	  bind:value={newTodo}
	  on:keydown={(e) => e.key === 'Enter' && addTodo()}
	/>
  
	<div class="todo">
	  <h2>Todo</h2>
	  <TodoList todos={todos.filter((t) => !t.done)} onToggleDone={toggleDone} onRemove={remove} />
	</div>
  
	<div class="done">
	  <h2>Done</h2>
	  <TodoList todos={todos.filter((t) => t.done)} onToggleDone={toggleDone} onRemove={remove} />
	</div>
</div>
  
<style>
	.board {
	  display: grid;
	  grid-template-columns: 1fr 1fr;
	  grid-column-gap: 1em;
	  max-width: 36em;
	  margin: 0 auto;
	}
  
	.board > input {
	  font-size: 1.4em;
	  grid-column: 1/3;
	  padding: 0.5em;
	  margin: 0 0 1rem 0;
	}
  
	h2 {
	  font-size: 2em;
	  font-weight: 200;
	}
</style>
