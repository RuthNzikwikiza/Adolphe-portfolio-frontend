import { Route, Routes } from 'react-router-dom';

import RequireAuth from './auth/RequireAuth';
import DashboardLayout from './components/DashboardLayout';
import Layout from './components/Layout';
import About from './pages/About';
import Accolades from './pages/Accolades';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import MessagesManager from './pages/dashboard/MessagesManager';
import {
  AboutEditor,
  AccoladesManager,
  ContactEditor,
  EducationManager,
  FactsManager,
  GalleryManager,
  HomeEditor,
  PressManager,
  SocialsManager,
  WorkManager,
} from './pages/dashboard/sections';
import Gallery from './pages/Gallery';
import Home from './pages/Home';
import ChangePassword from './pages/dashboard/ChangePassword';
import ForgotPassword from './pages/ForgotPassword';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Press from './pages/Press';
import Register from './pages/Register';
import ResendVerification from './pages/ResendVerification';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import Work from './pages/Work';
import Videos from './pages/Videos';
import VideosManager from './pages/dashboard/VideosManager';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/work" element={<Work />} />
        <Route path="/accolades" element={<Accolades />} />
        <Route path="/press" element={<Press />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/resend-verification" element={<ResendVerification />} />
        <Route element={<RequireAuth ownerOnly />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="messages" element={<MessagesManager />} />
            <Route path="home" element={<HomeEditor />} />
            <Route path="about" element={<AboutEditor />} />
            <Route path="contact" element={<ContactEditor />} />
            <Route path="work" element={<WorkManager />} />
            <Route path="accolades" element={<AccoladesManager />} />
            <Route path="press" element={<PressManager />} />
            <Route path="gallery" element={<GalleryManager />} />
            <Route path="videos" element={<VideosManager />} />
            <Route path="facts" element={<FactsManager />} />
            <Route path="education" element={<EducationManager />} />
            <Route path="socials" element={<SocialsManager />} />
            <Route path="password" element={<ChangePassword />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
