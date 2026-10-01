import React from 'react';
import { Link } from 'react-router-dom';
import { Hotel, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--primary)',
      color: '#ffffff',
      paddingTop: '3.5rem',
      paddingBottom: '2rem',
      marginTop: 'auto',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem',
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'var(--accent)',
                padding: '0.4rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex'
              }}>
                <Hotel size={22} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em' }}>
                HOSPITALITY<span style={{ color: 'var(--accent)' }}>.</span>
              </span>
            </div>
            <p style={{ color: 'var(--text-light)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              A full-stack enterprise hotel booking system with real-time room availability, double-booking prevention, and AI-powered concierge.
            </p>
            <div style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 600 }}>
              Java Full Stack Portfolio Project
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.2rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Explore
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <li><Link to="/" style={{ color: 'var(--text-light)', transition: 'color 0.2s' }}>Home</Link></li>
              <li><Link to="/hotels" style={{ color: 'var(--text-light)', transition: 'color 0.2s' }}>Browse All Hotels</Link></li>
              <li><Link to="/hotels?city=Pune" style={{ color: 'var(--text-light)', transition: 'color 0.2s' }}>Pune Hotels</Link></li>
              <li><Link to="/hotels?city=Mumbai" style={{ color: 'var(--text-light)', transition: 'color 0.2s' }}>Mumbai Stays</Link></li>
              <li><Link to="/hotels?city=Goa" style={{ color: 'var(--text-light)', transition: 'color 0.2s' }}>Goa Beach Resorts</Link></li>
            </ul>
          </div>

          {/* Technology Stack */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.2rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Tech Stack
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--text-light)' }}>
              <li>Backend: Java 21 & Spring Boot 3</li>
              <li>Security: Spring Security & JWT</li>
              <li>Database: PostgreSQL & JPA/Hibernate</li>
              <li>Frontend: React 18 & Axios</li>
              <li>AI: Gemini API & Fallback Service</li>
            </ul>
          </div>

          {/* Contact Support */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.2rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Guest Support
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={15} color="var(--accent)" />
                <span>+91 (020) 2456-7890</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={15} color="var(--accent)" />
                <span>support@hospitalityplatform.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={15} color="var(--accent)" />
                <span>Baner, Pune, Maharashtra 411045</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.825rem',
          color: 'var(--text-light)'
        }}>
          <div>
            © 2026 Hospitality Platform. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Built with <Heart size={14} color="#ef4444" fill="#ef4444" /> for Java Full Stack Fresher Portfolio
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
