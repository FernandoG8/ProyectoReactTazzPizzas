// src/pages/SobreNosotros.js
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import '../../src/assets/css/SobreNosotros.css';

const integrantes = [
  {
    nombre: 'Luis Fernando Gamaliel',
    alias: 'Xeos',
    descripcion: 'El lider del equipo, nuestro Backend de confianza, Amante de los tacos y noviazgos a larga distancia.',
    img: '/images/xeos.jpg',
    color: '#3a5a78',
    accent: '#457b9d'
  },
  {
    nombre: 'José Manuel Chablé Gómez',
    alias: 'GomezUndercover',
    descripcion: 'Le mueve de todo un poco, amante de los tacos y comidas que no pasen de 30 pesos.',
    img: '/images/gomez.jpg',
    color: '#588157',
    accent: '#81b29a'
  },
  {
    nombre: 'Osiel Alejandro Pérez Barroso',
    alias: 'Macaco',
    descripcion: 'El diseñador aprendiz conector con backend por obligación, amante de los panuchos de cochinita con arta salsa verde.',
    img: '/images/osiel.jpg',
    color: '#b5838d',
    accent: '#e5989b'
  },
];

export default function SobreNosotros() {
  const [activeIndex, setActiveIndex] = useState(null);
  const navigate = useNavigate();

  const handleToggle = (idx) => {
    setActiveIndex((prevIndex) => (prevIndex === idx ? null : idx));
  };

  const goToStore = () => {
    navigate('/tienda');
  };

  return (
    <div className={`sobre-container ${activeIndex !== null ? 'has-selection' : ''}`}>
      {/* Botón flotante para la tienda */}
      <motion.button
        className="store-button"
        onClick={goToStore}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Ir a la Tienda
      </motion.button>

      <motion.h2
        className="sobre-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Nuestro Equipo
      </motion.h2>

      {/* Contenedor fijo para la tarjeta seleccionada */}
      <div className="selected-card-container">
        <AnimatePresence>
          {activeIndex !== null && (
            <Card 
              integrante={integrantes[activeIndex]}
              isOpen={true}
              isSelected={true}
              onToggle={() => handleToggle(activeIndex)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Grid de tarjetas normales */}
      <div className="sobre-grid">
        <AnimatePresence>
          {integrantes.map((integrante, idx) => (
            activeIndex !== idx && (
              <Card
                key={idx}
                integrante={integrante}
                isOpen={false}
                isSelected={false}
                onToggle={() => handleToggle(idx)}
              />
            )
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Card({ integrante, isOpen, isSelected, onToggle }) {
  return (
    <motion.div
      className={`sobre-card ${isSelected ? 'selected' : ''}`}
      onClick={onToggle}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        transition: { delay: isSelected ? 0 : 0.2 }
      }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
        duration: 0.5
      }}
      whileHover={!isSelected ? { scale: 1.03 } : {}}
    >
      <motion.div 
        className="sobre-img-wrapper"
        layout
        style={{
          background: isSelected 
            ? `linear-gradient(135deg, ${integrante.color} 0%, ${integrante.accent} 100%)`
            : 'transparent'
        }}
      >
        <motion.img
          src={integrante.img}
          alt={integrante.nombre}
          className="sobre-img"
          layout
          transition={{ type: 'spring', stiffness: 300 }}
        />
      </motion.div>

      {isSelected && (
        <motion.div
          className="sobre-content-expanded"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h3 className="sobre-name">{integrante.nombre}</h3>
          {integrante.alias && <p className="sobre-alias">Alias: {integrante.alias}</p>}
          <p className="sobre-desc">{integrante.descripcion}</p>
        </motion.div>
      )}
    </motion.div>
  );
}