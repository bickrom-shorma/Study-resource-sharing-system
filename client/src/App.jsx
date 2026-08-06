import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import BrowseNotes from './pages/BrowseNotes';
import UploadNote from './pages/UploadNote';
import MyNotes from './pages/MyNotes';
import PdfViewerPage from './pages/PdfViewerPage';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/notes" element={<BrowseNotes />} />
              <Route path="/notes/:id" element={<PdfViewerPage />} />

              {/* Protected User Routes */}
              <Route
                path="/upload"
                element={
                  <ProtectedRoute>
                    <UploadNote />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-notes"
                element={
                  <ProtectedRoute>
                    <MyNotes />
                  </ProtectedRoute>
                }
              />

              {/* 404 Page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
