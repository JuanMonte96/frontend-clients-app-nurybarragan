import Header from './components/Header';
import logo from './assets/logo_menu_nury_barragan.png';
import HeroSection from './components/HeroSection';
import PackagePage from './pages/PackagePage';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import { Route, Routes } from 'react-router-dom';
import  {UserPage}  from './pages/UserPage';

function App() {

  const links = [
    { label: "INICIO", to: "/" },
    { label: "PACKAGES", to: "/" },
    { label: "NOSOTROS", to: "/" },
    { label: "CONTACTO", to: "/" },
  ];

  return (
    <>
      <main > 
        <div>
          <Routes>
            <Route path="/" element={
              <>
                <Header logo={logo} links={links} />
                <HeroSection />
                <PackagePage />
                <Footer />
              </>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path='/user' element={<UserPage />} />
          </Routes>

        </div>
      </main>
    </>
  )
}

export default App
