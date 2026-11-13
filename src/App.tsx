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
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Press from './pages/Press';
import Register from './pages/Register';
import Work from './pages/Work';

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
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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
            <Route path="facts" element={<FactsManager />} />
            <Route path="education" element={<EducationManager />} />
            <Route path="socials" element={<SocialsManager />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
