import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Gallery from "react-photo-gallery";
import ErrorBoundary from "./ErrorHandle";

const photos = [
  {
    src: "https://i1.au.reastatic.net/712x480,smart=85,r=33,g=40,b=46,quality=60,progressive/002c0070af054375c1bdb7cb446c8d2b8a7edf11edcb06c648a369c0d038df0c/image0.jpg",
    width: 4,
    height: 3
  },
  {
    src: "http://example.com/example/img2.jpg",
    width: 1,
    height: 1
  }
];



export default function AdView() {
  const [ad, setAd] = useState({});
  const [related, setRelated] = useState([]);
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

  return (
    <>
     <ErrorBoundary>
     <Gallery photos={photos} />
     </ErrorBoundary>
      <pre>{JSON.stringify({ ad, related }, null, 4)}</pre>
    </>
  );
}

