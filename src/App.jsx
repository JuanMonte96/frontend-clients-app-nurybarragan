import Header from './components/Header';
import logo from './assets/logo_menu_nury_barragan.png';
import HeroSection from './components/HeroSection';
import PackagePage from './pages/E-commerce/PackagePage';
import Footer from './components/Footer';
import LoginPage from './pages/Login/LoginPage';
import { Route, Routes } from 'react-router-dom';
import AboutUs from './components/AboutUs';
import { ContactUS } from './components/ContactUs';
import { ChangePassword } from './pages/Login/ChangePassword';
import UserLayout from './pages/Users/UserLayout';
import { ProfileUser } from './pages/Users/ProfileUser';
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
                <AboutUs />
                <PackagePage />
                <ContactUS />
                <Footer />
              </>
            } />
            <Route path="/login" element={<LoginPage />} />
            <Route path='/changePassword' element={<ChangePassword />} />

            {/* Privado */}
            <Route path="/user" element={<UserLayout />}>
              <Route index element={<ProfileUser />} />         {/* /user */}
              <Route path="profile" element={<ProfileUser />} />{/* /user/profile */}
            </Route>

          </Routes>

        </div>
      </main>
    </>
  )
}

export default App
