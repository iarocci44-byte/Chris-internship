import React, { useEffect, useState } from "react";
import EthImage from "../images/ethereum.svg";
import { Link, useLocation } from "react-router-dom";
import AuthorImage from "../images/author_thumbnail.jpg";
import nftImage from "../images/nftImage.jpg";


const ItemDetails = () => {
  const [itemData, setItemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    // Derive data from navigation state; avoid redundant API calls
    try {
      setLoading(true);
      const item = location.state?.item;

      // Extract author/creator name from various possible API field names
      const authorName = item?.authorName || item?.author || item?.creator || item?.creatorName || item?.authorID || "Author name unavailable";
      const authorImage = item?.authorImage || AuthorImage;

      const transformedData = item
        ? {
            title: item.title || "Title unavailable",
            description: "Description unavailable",
            views: Math.floor(Math.random() * 500),
            likes: item.likes || Math.floor(Math.random() * 200),
            price: item.price || (Math.random() * 5 + 0.5).toFixed(2),
            owner: {
              name: authorName,
              image: authorImage
            },
            creator: {
              name: authorName,
              image: authorImage
            },
            nftImage: item.nftImage || nftImage
          }
        : {
            // Fallback placeholder when navigated directly without state
            title: "Pinky Ocean",
            description: "Description unavailable",
            views: Math.floor(Math.random() * 500),
            likes: Math.floor(Math.random() * 200),
            price: (Math.random() * 5 + 0.5).toFixed(2),
            owner: {
              name: "Author name unavailable",
              image: AuthorImage
            },
            creator: {
              name: "Author name unavailable",
              image: AuthorImage
            },
            nftImage: nftImage
          };

      setItemData(transformedData);
      setError(null);
    } catch (err) {
      console.error("Error preparing item details:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [location.state]);

  if (loading) {
    return (
      <div id="wrapper">
        <div className="no-bottom no-top" id="content">
          <div id="top"></div>
          <section aria-label="section" className="mt90 sm-mt-0">
            <div className="container">
              <div className="row">
                <div className="col-12 text-center">
                  <h3>Loading...</h3>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div id="wrapper">
        <div className="no-bottom no-top" id="content">
          <div id="top"></div>
          <section aria-label="section" className="mt90 sm-mt-0">
            <div className="container">
              <div className="row">
                <div className="col-12 text-center">
                  <h3>Error: {error}</h3>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>
        <section aria-label="section" className="mt90 sm-mt-0">
          <div className="container">
            <div className="row">
              <div className="col-md-6 text-center">
                <img
                  src={itemData?.nftImage}
                  className="img-fluid img-rounded mb-sm-30 nft-image"
                  alt=""
                />
              </div>
              <div className="col-md-6">
                <div className="item_info">
                  <h2>{itemData?.title}</h2>

                  <div className="item_info_counts">
                    <div className="item_info_views">
                      <i className="fa fa-eye"></i>
                      {itemData?.views}
                    </div>
                    <div className="item_info_like">
                      <i className="fa fa-heart"></i>
                      {itemData?.likes}
                    </div>
                  </div>
                  <p>
                    {itemData?.description}
                  </p>
                  <div className="d-flex flex-row">
                    <div className="mr40">
                      <h6>Owner</h6>
                      <div className="item_author">
                        <div className="author_list_pp">
                          <Link to="/author">
                            <img className="lazy" src={itemData?.owner.image} alt="" />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>
                        <div className="author_list_info">
                          <Link to="/author">{itemData?.owner.name}</Link>
                        </div>
                      </div>
                    </div>
                    <div></div>
                  </div>
                  <div className="de_tab tab_simple">
                    <div className="de_tab_content">
                      <h6>Creator</h6>
                      <div className="item_author">
                        <div className="author_list_pp">
                          <Link to="/author">
                            <img className="lazy" src={itemData?.creator.image} alt="" />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>
                        <div className="author_list_info">
                          <Link to="/author">{itemData?.creator.name}</Link>
                        </div>
                      </div>
                    </div>
                    <div className="spacer-40"></div>
                    <h6>Price</h6>
                    <div className="nft-item-price">
                      <img src={EthImage} alt="" />
                      <span>{itemData?.price}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ItemDetails;
