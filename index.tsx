import { renderToString } from "react-dom/server"

const server = Bun.serve({
  hostname: "localhost",
  port: 8080,
  fetch: handler,
});

type Todo= {id: number , text: string }
const todos: Todo[] = []

async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url)
  
  if (url.pathname === ""||url.pathname === "/") {
    
    return new Response(Bun.file('index.html'))
  
  }

  if (url.pathname === "/todos" && request.method === "POST") {
    // const {todo} = await request.json();
    const { todo } = await request.json();
    // const {todo} = JSON.parse(text.trim());
    // console.log(todo)
    if (!todo.length) {
      return new Response('invalodeTodo',{status:500})
    }

    todos.push({
      id: todos.length + 1,
      text: todo
      })
    return new Response(
         renderToString(<TodoLists todos={todos}/>))
  
  }

  if (url.pathname === "/todos" && request.method === "GET") {

    return new Response(
         renderToString(<TodoLists todos={todos}/>))
  
  }

  if(url.pathname==="/delete"&& request.method==="POST"){
    todos.pop()
    return new Response("Todo delete",{status:200})
  }


  return new Response("Not Found Ashu", { status: 404 });
}

function TodoLists(props: { todos: Todo[] }) {
  return <ul>
    { 
      props.todos.length
        ? props.todos.map(todo => <li key={todo.id}>{todo.text}</li>)
        : 'No items added'
    }
  </ul>
}

console.log(`http://${server.hostname}:${server.port}`);
