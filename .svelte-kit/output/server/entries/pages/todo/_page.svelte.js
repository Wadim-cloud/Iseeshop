import { q as fallback, e as ensure_array_like, b as attr, d as escape_html, t as bind_props, p as pop, a as push } from "../../../chunks/index.js";
import { s as supabase } from "../../../chunks/supabase.js";
import { o as onDestroy } from "../../../chunks/index-server.js";
function TodoList($$payload, $$props) {
  push();
  let todos = fallback($$props["todos"], () => [], true);
  let onToggleDone = $$props["onToggleDone"];
  let onRemove = $$props["onRemove"];
  const each_array = ensure_array_like(todos);
  $$payload.out += `<ul class="svelte-1dl020x"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let todo = each_array[$$index];
    $$payload.out += `<li class="svelte-1dl020x"><input type="checkbox"${attr("checked", todo.done, true)} class="svelte-1dl020x"> <span>${escape_html(todo.description)}</span> <button aria-label="Remove" class="svelte-1dl020x"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="svelte-1dl020x"><path fill="#888" stroke="none" d="M22 4.2h-5.6L15 1.6c-.1-.2-.4-.4-.7-.4H9.6c-.2 0-.5.2-.6.4L7.6 4.2H2c-.4 0-.8.4-.8.8s.4.8.8.8h1.8V22c0 .4.3.8.8.8h15c.4 0 .8-.3.8-.8V5.8H22c.4 0 .8-.3.8-.8s-.4-.8-.8-.8zM10.8 16.5c0 .4-.3.8-.8.8s-.8-.3-.8-.8V10c0-.4.3-.8.8-.8s.8.3.8.8v6.5zm4 0c0 .4-.3.8-.8.8s-.8-.3-.8-.8V10c0-.4.3-.8.8-.8s.8.3.8.8v6.5z" class="svelte-1dl020x"></path></svg></button></li>`;
  }
  $$payload.out += `<!--]--></ul>`;
  bind_props($$props, { todos, onToggleDone, onRemove });
  pop();
}
function _page($$payload, $$props) {
  push();
  let todos = [];
  let sharedTodos = [];
  let newTodo = "";
  let shareEmail = "";
  let user;
  onDestroy(() => {
    supabase.removeAllChannels();
  });
  async function toggleDone(todo, isShared = false) {
    try {
      const { error } = await supabase.from("todos").update({ done: !todo.done }).eq("id", todo.id);
      if (error) {
        console.error("Error updating todo:", error.message);
        alert("Failed to update todo. Please try again.");
        return;
      }
      if (isShared) {
        sharedTodos = sharedTodos.map((t) => t.id === todo.id ? { ...t, done: !t.done } : t);
      } else {
        todos = todos.map((t) => t.id === todo.id ? { ...t, done: !t.done } : t);
      }
    } catch (err) {
      console.error("Unexpected error while updating todo:", err);
      alert("An unexpected error occurred. Please try again.");
    }
  }
  async function remove(todo) {
    try {
      const { error } = await supabase.from("todos").delete().eq("id", todo.id).eq("user_id", user.id);
      if (error) {
        console.error("Error deleting todo:", error.message);
        alert("Failed to delete todo. Please try again.");
        return;
      }
      todos = todos.filter((t) => t.id !== todo.id);
    } catch (err) {
      console.error("Unexpected error while deleting todo:", err);
      alert("An unexpected error occurred. Please try again.");
    }
  }
  const each_array = ensure_array_like(sharedTodos);
  const each_array_1 = ensure_array_like(todos);
  $$payload.out += `<div class="board svelte-dn77k5"><textarea placeholder="What needs to be done?" rows="1" class="todo-input svelte-dn77k5">`;
  const $$body = escape_html(newTodo);
  if ($$body) {
    $$payload.out += `${$$body}`;
  }
  $$payload.out += `</textarea> <div class="todo"><h2 class="svelte-dn77k5">My Tasks - Todo</h2> `;
  TodoList($$payload, {
    todos: todos.filter((t) => !t.done),
    onToggleDone: toggleDone,
    onRemove: remove
  });
  $$payload.out += `<!----></div> <div class="done"><h2 class="svelte-dn77k5">My Tasks - Done</h2> `;
  TodoList($$payload, {
    todos: todos.filter((t) => t.done),
    onToggleDone: toggleDone,
    onRemove: remove
  });
  $$payload.out += `<!----></div> <div class="shared svelte-dn77k5"><h2 class="svelte-dn77k5">Shared with Me</h2> <!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let todo = each_array[$$index];
    $$payload.out += `<div><p class="svelte-dn77k5">Shared by: ${escape_html(todo.shared_by_email)}</p> `;
    TodoList($$payload, {
      todos: [todo],
      onToggleDone: (t) => toggleDone(t, true),
      onRemove: () => {
      }
    });
    $$payload.out += `<!----></div>`;
  }
  $$payload.out += `<!--]--></div> <div class="share svelte-dn77k5"><h2 class="svelte-dn77k5">Share a Task</h2> <textarea placeholder="Who do you want to share with? (email)" rows="1" class="email-input svelte-dn77k5">`;
  const $$body_1 = escape_html(shareEmail);
  if ($$body_1) {
    $$payload.out += `${$$body_1}`;
  }
  $$payload.out += `</textarea> <!--[-->`;
  for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
    let todo = each_array_1[$$index_1];
    $$payload.out += `<button class="svelte-dn77k5">Share: ${escape_html(todo.description)}</button>`;
  }
  $$payload.out += `<!--]--></div></div>`;
  pop();
}
export {
  _page as default
};
