import Header from './components/Header';
import logo from './assets/final-logo-nb.png';
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
import {ClassesUser} from './pages/Users/ClassesUser';
import { EnrolmentUser } from './pages/Users/EnrolmentUser';
import { ConfigurationUser } from './pages/Users/ConfigurationUser';
import { useTranslation } from 'react-i18next';
import  TeacherProfile  from './components/TeachersProfile';
function App() {

  const { t } = useTranslation();
  const links = [
    { label: t("header.home"), to: "#hero" },
    { label: t("header.packages"), to: "#packages" },
    { label: t("header.about"), to: "#about" },
    { label: t("header.contact"), to: "#contact" },
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
                <TeacherProfile/>
                <ContactUS />
                <Footer />
              </>
            } />
            <Route path="/login" element={<LoginPage />} />
            <Route path='/changePassword' element={<ChangePassword />} />

            {/* Privado */}
            <Route path="/user" element={
              <UserLayout />
            }>
              <Route index element={<ProfileUser />} />         {/* /user */}
              <Route path="profile" element={<ProfileUser />} />{/* /user/profile */}
              <Route path="classes" element={<ClassesUser />} /> {/* /user/classes */}
              <Route path="enrollments" element={<EnrolmentUser />} /> {/* /user/enrollments */}
              <Route path="configuration" element={<ConfigurationUser />} /> {/* /user/configuration */}
            </Route>

          </Routes>

        </div>
      </main>
    </>
  )
}

export default App
