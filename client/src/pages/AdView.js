import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const photos = [
  "https://saterdesign.com/cdn/shop/articles/bicYNooDCfCQAbvnQ8Xf0FjmW5nfKtOX1669132421_894x.jpg?v=1669242585",
  "https://architecturesstyle.b-cdn.net/wp-content/uploads/2021/08/Types-of-Houses-1024x675.webp"
];

export default function AdView() {
  const [ad, setAd] = useState({});
  const [related, setRelated] = useState([]);
  const [current, setCurrent] = useState(0); 
  const [isOpen, setIsOpen] = useState(false); 
  const params = useParams();

  useEffect(() => {
    if (params?.slug) fetchAds();
  }, [params?.slug]);

  const fetchAds = async () => {
    try {
      const { data } = await axios.get(`ad/${params.slug}`);
      setAd(data.ad);
      setRelated(data.related);
    } catch (err) {
      console.log(err);
    }
  };

  const openCarousel = (index) => {
    setCurrent(index);
    setIsOpen(true);
  };

  const closeCarousel = () => {
    setIsOpen(false);
  };

  const nextPhoto = () => {
    setCurrent((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrent((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <>
      <div className="gallery">
        {photos.map((photo, index) => (
          <img
            key={index}
            src={photo}
            alt={`Photo ${index + 1}`}
            className="gallery-item"
            onClick={() => openCarousel(index)}
          />
        ))}
      </div>

      {isOpen && (
        <div className="carousel">
          <span className="close" onClick={closeCarousel}>
            &times;
          </span>
          <img src={photos[current]} alt={`Photo ${current + 1}`} className="carousel-image" />
          <button className="prev" onClick={prevPhoto}>
            &#10094;
          </button>
          <button className="next" onClick={nextPhoto}>
            &#10095;
          </button>
        </div>
      )}
      <pre>{JSON.stringify({ ad, related }, null, 4)}</pre>
    </>
  );
}
