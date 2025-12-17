import { Route, Routes } from 'react-router-dom';
import './App.css'
import MainLayout from './layout/MainLayout';
import Home from './pages/Home/Home';
import SearchResults from './pages/SearchPage/SearchResults';

function App() {
 
  return (
     <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
      </Routes>
    </MainLayout>
  )
}

export default App
