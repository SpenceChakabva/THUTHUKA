
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Landing } from './pages/Landing';
import { Home } from './pages/Home';
import { Accommodation } from './pages/Accommodation';
import { Exams } from './pages/Exams';
import { Funding } from './pages/Funding';
import { Profile } from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="home" element={<Home />} />
          <Route path="accommodation" element={<Accommodation />} />
          <Route path="exams" element={<Exams />} />
          <Route path="funding" element={<Funding />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
