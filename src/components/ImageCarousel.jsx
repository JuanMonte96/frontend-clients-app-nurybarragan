import { useState, useEffect } from 'react';
import classes1 from '../assets/classes.jpg';
import classes2 from '../assets/classes2.jpg';
import classes3 from '../assets/classes6.jpg';
import classes4 from '../assets/classes4Prueba.jpg';
import classes5 from '../assets/classes8.jpeg';

export default function ImageCarousel() {
  // Array con las 5 imágenes
  const images = [classes1, classes2, classes3, classes4, classes5];
  
  // Estado para el índice actual de la imagen
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // useEffect para cambiar la imagen cada 5 segundos (automático)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // 5000ms = 5 segundos
    
    // Limpiar el interval cuando el componente se desmonte
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Contenedor de imágenes - fondo */}
      <div className="relative w-full h-full">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`background slide ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        
        {/* Overlay oscuro para mejorar legibilidad del texto */}
        <div className="absolute inset-0"></div>
      </div>
    </div>
  );
}
