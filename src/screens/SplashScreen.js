import React, { useState, useEffect } from "react";
import tausta from "../assets/tausta.jpg";

const SplashScreen = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const imageArray = [];
    for (let i = 1; i <= 14; i++) {
      const image = require(`../assets/images/linda-${i}.jpeg`);
      imageArray.push(image.default || image);
    }

    // Create 3 cycles of images to appear continuously
    const allImages = [];
    for (let cycle = 0; cycle < 3; cycle++) {
      imageArray.forEach((src, index) => {
        allImages.push({
          id: `${cycle}-${index}`,
          src,
          left: Math.random() * 85 + 5,
          top: Math.random() * 75 + 5,
          delay: cycle * 6 + index * 0.3,
          duration: 15,
        });
      });
    }

    setImages(allImages);
  }, []);

  return (
    <div className="splash-screen">
      <div className="splash-background">
        {images.map((img) => (
          <img
            key={img.id}
            src={img.src}
            alt={`background ${img.id}`}
            className="splash-image"
            style={{
              left: `${img.left}%`,
              top: `${img.top}%`,
              animationDelay: `${img.delay}s`,
              animationDuration: `${img.duration}s`,
            }}
          />
        ))}
      </div>
      <div className="splash-content">
        <h1>Ihanaa kolmekymppistä!</h1>
        <p>Tänä vuonna saat lahjaksi oman ravintolan - omassa kodissasi :3</p>
        <p>Varaa pöytä ja saat herkku illallisen kotiisi!</p>
      </div>
      {/* <img src={tausta} alt="tausta" className="splash-background"></img> */}
    </div>
  );
};

export default SplashScreen;
