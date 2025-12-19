import { Route, Routes } from 'react-router-dom';
import './App.css'
import MainLayout from './layout/MainLayout';
import Home from './pages/Home/Home';
import SearchResults from './pages/SearchPage/SearchResults';
import ProDetail from './pages/Pro/ProDetail';
import { Categories } from './pages/Categories/Categories';
import { SousCategories } from './pages/SousCategories/SousCategories';
import { Villes } from './pages/Villes/Villes';

function App() {
 
  return (
     <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/pro/:id" element={<ProDetail />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/sous-categories" element={<SousCategories />} />
        <Route path="/villes" element={<Villes />} />
      </Routes>
    </MainLayout>
  )
}

export default App
