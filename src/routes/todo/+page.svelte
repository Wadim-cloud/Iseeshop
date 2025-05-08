<script>
	import { supabase } from '$lib/supabase';
	import TodoList from './TodoList.svelte';
	import { onMount, onDestroy } from 'svelte';
  
	let todos = [];
	let sharedTodos = [];
	let newTodo = '';
	let shareEmail = '';
	let user;
  
	// Fetch user and todos on mount
	onMount(async () => {
	  const { data: { user: authUser } } = await supabase.auth.getUser();
	  user = authUser;
	  if (user) {
		await fetchTodos();
		await fetchSharedTodos();
  
		// Set up real-time subscriptions
		supabase
		  .channel('todos')
		  .on('postgres_changes', { event: '*', schema: 'public', table: 'todos', filter: `user_id=eq.${user.id}` }, fetchTodos)
		  .on('postgres_changes', { event: '*', schema: 'public', table: 'shared_todos', filter: `shared_with_user_id=eq.${user.id}` }, fetchSharedTodos)
		  .subscribe();
	  }
	});
  
	// Clean up subscriptions on destroy
	onDestroy(() => {
	  supabase.removeAllChannels();
	});
  
	async function fetchTodos() {
	  const { data, error } = await supabase
		.from('todos')
		.select('*')
		.eq('user_id', user.id)
		.order('id', { ascending: true });
  
	  if (error) {
		console.error('Error fetching todos:', error.message);
		return;
	  }
  
	  todos = data || [];
	}
  
	async function fetchSharedTodos() {
	  const { data, error } = await supabase
		.rpc('get_shared_todos', { p_user_id: user.id });
  
	  if (error) {
		console.error('Error fetching shared todos:', error.message);
		return;
	  }
  
	  sharedTodos = data ? data.map(item => ({
		...item,
		shared_by_email: item.shared_by_email || 'Unknown'
	  })) : [];
	}
  
	async function addTodo() {
	  if (!newTodo.trim()) {
		alert('Please enter a todo description.');
		return;
	  }
  
	  try {
		const { data, error } = await supabase
		  .from('todos')
		  .insert([{ description: newTodo.trim(), done: false, user_id: user.id }])
		  .select();
  
		if (error) {
		  console.error('Error adding todo:', error.message);
		  alert('Failed to add todo. Please try again.');
		  return;
		}
  
		if (Array.isArray(data)) {
		  todos = [...todos, ...data];
		}
		newTodo = '';
	  } catch (err) {
		console.error('Unexpected error while adding todo:', err);
		alert('An unexpected error occurred. Please try again.');
	  }
	}
  
	async function toggleDone(todo, isShared = false) {
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
  
		if (isShared) {
		  sharedTodos = sharedTodos.map((t) => (t.id === todo.id ? { ...t, done: !t.done } : t));
		} else {
		  todos = todos.map((t) => (t.id === todo.id ? { ...t, done: !t.done } : t));
		}
	  } catch (err) {
		console.error('Unexpected error while updating todo:', err);
		alert('An unexpected error occurred. Please try again.');
	  }
	}
  
	async function remove(todo) {
	  try {
		const { error } = await supabase
		  .from('todos')
		  .delete()
		  .eq('id', todo.id)
		  .eq('user_id', user.id);
  
		if (error) {
		  console.error('Error deleting todo:', error.message);
		  alert('Failed to delete todo. Please try again.');
		  return;
		}
  
		todos = todos.filter((t) => t.id !== todo.id);
	  } catch (err) {
		console.error('Unexpected error while deleting todo:', err);
		alert('An unexpected error occurred. Please try again.');
	  }
	}
  
	async function shareTodo(todo) {
	  if (!shareEmail.trim()) {
		alert('Please enter an email to share with.');
		return;
	  }
  
	  try {
		const cleanedEmail = shareEmail.trim().toLowerCase();
		console.log('Attempting to share with email:', cleanedEmail);
  
		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(cleanedEmail)) {
		  console.error('Invalid email format:', cleanedEmail);
		  alert('Please enter a valid email address.');
		  return;
		}
  
		// Fetch user by email from collaborators (case-insensitive)
		const { data: sharedUsers, error: userError } = await supabase
		  .from('collaborators')
		  .select('id')
		  .ilike('email', cleanedEmail);
  
		console.log('Query result:', { sharedUsers, userError });
  
		if (userError) {
		  console.error('Error querying collaborators:', userError.message);
		  alert('Error finding user. Please try again.');
		  return;
		}
  
		if (!sharedUsers || sharedUsers.length === 0) {
		  console.error('No user found for email:', cleanedEmail);
		  alert('User not found. Please check the email.');
		  return;
		}
  
		if (sharedUsers.length > 1) {
		  console.error('Multiple users found for email:', cleanedEmail, sharedUsers);
		  alert('Multiple users found with this email. Please contact support.');
		  return;
		}
  
		const sharedUser = sharedUsers[0];
		console.log('Found user ID:', sharedUser.id);
  
		// Check if the todo is already shared with this user
		const { data: existingShare, error: shareError } = await supabase
		  .from('shared_todos')
		  .select('id')
		  .eq('todo_id', todo.id)
		  .eq('shared_with_user_id', sharedUser.id)
		  .single();
  
		if (existingShare) {
		  alert('This todo is already shared with this user.');
		  return;
		}
  
		if (shareError && shareError.code !== 'PGRST116') {
		  console.error('Error checking existing share:', shareError.message);
		  alert('Failed to check existing shares. Please try again.');
		  return;
		}
  
		const { error } = await supabase
		  .from('shared_todos')
		  .insert({
			todo_id: todo.id,
			shared_with_user_id: sharedUser.id,
			shared_by_user_id: user.id
		  });
  
		if (error) {
		  console.error('Error sharing todo:', error.message);
		  alert('Failed to share todo. Please try again.');
		  return;
		}
  
		alert('Todo shared successfully!');
		shareEmail = '';
	  } catch (err) {
		console.error('Unexpected error while sharing todo:', err);
		alert('An unexpected error occurred. Please try again.');
	  }
	}
  </script>
  
  <div class="board">
	<textarea
	  placeholder="What needs to be done?"
	  bind:value={newTodo}
	  on:keydown={(e) => {
		if (e.key === 'Enter') {
		  e.preventDefault();
		  addTodo();
		}
	  }}
	  rows="1"
	  class="todo-input"
	></textarea>
  
	<div class="todo">
	  <h2>My Tasks - Todo</h2>
	  <TodoList todos={todos.filter((t) => !t.done)} onToggleDone={toggleDone} onRemove={remove} />
	</div>
  
	<div class="done">
	  <h2>My Tasks - Done</h2>
	  <TodoList todos={todos.filter((t) => t.done)} onToggleDone={toggleDone} onRemove={remove} />
	</div>
  
	<div class="shared">
	  <h2>Shared with Me</h2>
	  {#each sharedTodos as todo}
		<div>
		  <p>Shared by: {todo.shared_by_email}</p>
		  <TodoList todos={[todo]} onToggleDone={(t) => toggleDone(t, true)} onRemove={() => {}} />
		</div>
	  {/each}
	</div>
  
	<div class="share">
	  <h2>Share a Task</h2>
	  <textarea
		placeholder="Who do you want to share with? (email)"
		bind:value={shareEmail}
		rows="1"
		class="email-input"
	  ></textarea>
	  {#each todos as todo}
		<button on:click={() => shareTodo(todo)}>Share: {todo.description}</button>
	  {/each}
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
  
	.todo-input,
	.email-input {
	  font-size: 1.4em;
	  grid-column: 1/3;
	  padding: 0.5em;
	  margin: 0 0 1rem 0;
	  width: 100%;
	  box-sizing: border-box;
	  resize: none;
	  white-space: normal;
	  overflow-wrap: break-word;
	  line-height: 1.4;
	  border: 1px solid #ddd;
	  border-radius: 4px;
	}
  
	.email-input {
	  font-size: 1.2em;
	  margin: 0.5em 0;
	}
  
	.shared,
	.share {
	  grid-column: 1/3;
	  margin-top: 1em;
	}
  
	h2 {
	  font-size: 2em;
	  font-weight: 200;
	}
  
	button {
	  background: none;
	  border: 1px solid #ddd;
	  cursor: pointer;
	  padding: 0.5em;
	  margin: 0.5em 0;
	  display: block;
	}
  
	p {
	  font-size: 0.9em;
	  color: #555;
	}
  </style>