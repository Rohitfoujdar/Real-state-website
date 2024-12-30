import React from "react";
import { IoBedOutline } from "react-icons/io5";
import { TbBath } from "react-icons/tb";
import { BiArea } from "react-icons/bi";
import { Badge } from "antd";
import {Link} from "react-router-dom";

export default function AdCard({ ad }) {
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(ad?.price);
  return (
    <div className="col-lg-4 p-4 gx-4 gy-4">
      <Link to={`/ad/${ad.slug}`}>
        <Badge.Ribbon
          text={`${ad?.type} for ${ad?.action}`}
          color={ad?.action == "Sell" ? "blue" : "red"}
        >
          <div className="card hoverable shadow">
            <img
              src={ad?.photos}
              alt={`${ad?.type}-${ad?.address}-${ad?.action}-${ad?.price}`}
              style={{ height: "250px", objectFit: "cover" }}
            />
            <div className="card-body">
              <div className="mb-3">
                <h3>{formattedPrice}</h3>
                <h4 className="card-text">{ad?.address}</h4>
                <h4>{ad?.title}</h4>
              </div>
              <p className="card-text d-flex justify-content-between">
                {ad?.bedrooms ? (
                  <span>
                    <IoBedOutline /> {ad?.bedrooms}
                  </span>
                ) : (
                  ""
                )}
                {ad?.bathrooms ? (
                  <span>
                    <TbBath /> {ad?.bathrooms}
                  </span>
                ) : (
                  ""
                )}
                {ad?.landsize ? (
                  <span>
                    <BiArea /> {ad?.landsize}
                  </span>
                ) : (
                  ""
                )}
              </p>
            </div>
          </div>
        </Badge.Ribbon>
      </Link>
    </div>
  );
}
