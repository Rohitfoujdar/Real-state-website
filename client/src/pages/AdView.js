import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ImageGallery from "../components/misc/ImageGallery";
import AdFeatures from "../components/cards/AdFeatures";
import { formatNumber } from "../helpers/Ad";
import dayjs from "dayjs";


import relativeTime from "dayjs/plugin/relativeTime"
import LikeUnlike from "../components/misc/LikeUnlike";
dayjs.extend(relativeTime);

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
      <div className="container-fluid">
        <div className="row mt-2">
          <div className="col-lg-4">
              <div className="d-flex justify-content-between">
              <button className="btn btn-primary disabled mt-2">{ad?.type} for {ad?.action}</button>
              <LikeUnlike ad={ad}/>
              </div>
            <div className="mt-4 mb-4">{ad?.sold ? "❌Off market" : "✅In market"}</div>
            <h1>{ad?.address}</h1>
            <AdFeatures  ad={ad}/>
            <h3 className="mt-5 h2">${formatNumber(ad?.price)}</h3>
            <p className="text-muted">{dayjs(ad?.createdAt).from()}</p>
          </div>
          <div className="col-lg-8">
           <ImageGallery/>
          </div>
        </div>
      </div>
      {/* <pre>{JSON.stringify({ ad, related }, null, 4)}</pre> */}
    </>
  );
}
