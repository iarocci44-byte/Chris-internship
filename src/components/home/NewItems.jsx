import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthorImage from "../../images/author_thumbnail.jpg";
import nftImage from "../../images/nftImage.jpg";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { sliderSettings } from "../common/sliderConfig";
import SliderButton from "../common/SliderButton";
import SliderImageWrapper from "../common/SliderImageWrapper";

const CountdownTimer = ({ expiryDate }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDate = new Date(expiryDate).getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft("Ended");
        return;
      }

      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [expiryDate]);

  return (
    <div
      style={{
        position: "absolute",
        top: "5px",
        right: "10px",
        background: "#ffffff",
        color: "#000",
        padding: "4px 12px",
        borderRadius: "50px",
        fontSize: "12px",
        fontWeight: "600",
        zIndex: 5,
        whiteSpace: "nowrap",
        border: "1px solid #000"
      }}
    >
      {timeLeft}
    </div>
  );
};

const NewItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = React.useRef(null);

  useEffect(() => {
    const fetchNewItems = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems"
        );
        setItems(response.data || []);
      } catch (error) {
        console.error("Error fetching new items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewItems();
  }, []);

  return (
    <section id="section-items" className="no-bottom section-collections">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>New Items</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          {loading ? (
            new Array(4).fill(0).map((_, index) => (
              <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={index}>
                <div className="nft__item">
                  <div className="author_list_pp">
                    <div className="skeleton skeleton-avatar"></div>
                  </div>
                  <div className="nft__item_wrap">
                    <div className="skeleton skeleton-image" style={{ height: 250 }}></div>
                  </div>
                  <div className="nft__item_info">
                    <div className="skeleton skeleton-title" style={{ width: '60%' }}></div>
                    <div className="skeleton skeleton-text" style={{ width: '40%' }}></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-lg-12">
              <div style={{ position: 'relative' }}>
                <Slider ref={sliderRef} {...sliderSettings}>
                  {items.map((item, index) => (
                    <div key={index}>
                      <div className="nft_coll" style={{ position: "relative", paddingTop: "30px" }}>
                        {item.expiryDate && <CountdownTimer expiryDate={item.expiryDate} />}
                        <SliderImageWrapper 
                          item={item}
                          imageUrl={item.nftImage || nftImage}
                          linkTo="/item-details"
                          state={{ item }}
                        />
                        <div className="nft_coll_pp">
                          <Link to="/author">
                            <img className="lazy pp-coll" src={item.authorImage || AuthorImage} alt="" />
                          </Link>
                          <i className="fa fa-check"></i>
                        </div>
                        <div className="nft_coll_info">
                          <Link to="/item-details" state={{ item }}>
                            <h4>{item.title || "Pinky Ocean"}</h4>
                          </Link>
                          <span>{item.code || "ERC-192"}</span>
                          <div style={{ marginTop: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ fontSize: "14px", fontWeight: "600", paddingLeft: "10px" }}>
                              {item.price || "3.08"} ETH
                            </div>
                            <div style={{ fontSize: "14px", color: "#ddd", paddingRight: "10px" }}>
                              <i className="fa fa-heart"></i>
                              <span style={{ marginLeft: "5px" }}>{item.likes || 69}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
                <SliderButton direction="prev" onClick={() => sliderRef.current.slickPrev()} />
                <SliderButton direction="next" onClick={() => sliderRef.current.slickNext()} />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewItems;
