import './App.css'
import { getPosts } from './api/posts.api';
import { useFetch } from './hooks/useFetch';
import type { Post } from './types/api';

function App() {
  const { data, loading } = useFetch<Post>(getPosts);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <h1 className="text-3xl font-bold underline text-green-500">
        Hello world!
      </h1>
      <ul>
        {data.map(post => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </>
  )
}

export default App
