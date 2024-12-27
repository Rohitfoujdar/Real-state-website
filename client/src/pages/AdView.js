import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
    <div>
      <pre>{JSON.stringify({ ad, related }, null, 4)}</pre>
    </div>
  );
}
