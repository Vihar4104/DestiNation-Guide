import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, Icon } from "react-leaflet";
import { FaHeart } from "react-icons/fa";
import "./PlaceDetails.css";
import HomeHeader from "./Headers";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { auth, firestore, storage } from "../config/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import image from "../assets/images/logo.png";

const PlaceDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { placeName, placeid } = useParams();
  const [place, setPlace] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);
  const [isFavourite, toggleFavourite] = useState(false);
  const placeId = location.state.placeId;

  const customIcon = new L.Icon({
    iconUrl: image,
    iconSize: [120, 120],
  });

  useEffect(() => {
    const fetchPlaceDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/places/${placeName}`
        );
        setPlace(response.data.place);
        console.log("Place details fetched from backend: ", place);
      } catch (error) {
        console.error("Error fetching place details:", error);
      }
    };

    fetchPlaceDetails();
  }, [placeName]);

  useEffect(() => {
    const startCarousel = () => {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % place.Image.length);
      }, 3000);
    };

    const stopCarousel = () => {
      clearInterval(intervalRef.current);
    };

    if (place && place.Image && place.Image.length > 1) {
      startCarousel();
      return () => stopCarousel();
    }
  }, [place]);

  const redirectToMapWithDirections = () => {
    const { latitude, longitude } = place;
    if (latitude && longitude) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude: userLat, longitude: userLng } = position.coords;
            const url = `https://www.google.com/maps/dir/${userLat},${userLng}/${latitude},${longitude}`;
            window.open(url, "_blank");
          },
          (error) => {
            console.error("Error getting user location:", error);
            openMapWithoutDirections();
          }
        );
      } else {
        console.error("Geolocation is not supported");
        openMapWithoutDirections();
      }
    } else {
      console.error("Latitude and longitude not available");
    }
  };

  const openMapWithoutDirections = () => {
    const { latitude, longitude } = place;
    if (latitude && longitude) {
      const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
      window.open(url, "_blank");
    } else {
      console.error("Latitude and longitude not available");
    }
  };

  useEffect(() => {
    const fetchBookmarkStatus = async () => {
      console.log("placeid: ", placeId);
      try {
        const user = auth.currentUser;
        if (user) {
          const uid = user.uid;
          const userRoleRef = doc(firestore, "userRoles", uid);
          const userSnapshot = await getDoc(userRoleRef);
          const userData = userSnapshot.data();

          if (
            userData &&
            userData.BookmarkedPlaces &&
            userData.BookmarkedPlaces.includes(placeId)
          ) {
            console.log("place is already in bookmarks!");
            toggleFavourite(!isFavourite);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchBookmarkStatus();
  }, []);

  const handlebookmarks = async (placeid) => {
    console.log("bookmarked handled for placeid:", placeid);
    try {
      const user = auth.currentUser;
      if (user) {
        const uid = user.uid;
        const userRoleRef = doc(firestore, "userRoles", uid);
        const userSnapshot = await getDoc(userRoleRef);
        const userData = userSnapshot.data();

        if (
          userData &&
          userData.BookmarkedPlaces &&
          userData.BookmarkedPlaces.includes(placeid)
        ) {
          await updateDoc(userRoleRef, {
            BookmarkedPlaces: arrayRemove(placeid),
          });
          console.log("Bookmark removed from firestore successfully!");
          toast.success(`Bookmarks removed successfully!`, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          toggleFavourite(false);
        } else {
          await updateDoc(userRoleRef, {
            BookmarkedPlaces: arrayUnion(placeid),
          });
          console.log("bookmark added to firestore successfully!");
          toast.success(`Bookmark added successfully!`, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          toggleFavourite(!isFavourite);
        }
      } else {
        toast.success(`User data not found!`, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      toast.success(`Error fetching user data: ${error}`, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error("Error fetching user data:", error);
    }
  };

  return (
    <>
      <div>
        <div className="fixed z-10">
          <HomeHeader />
        </div>
        <div style={{
          paddingTop:'200px'
        }}>
        {place ? (
          <div className="flex">
            <div className="flex flex-col items-center justify-center w-8/12 p-4">
              <h1
                className="mt-10 mb-7 text-center w-96 bg-gradient-to-r from-slate-300 to-slate-400 text-black text-4xl rounded-lg p-4 shadow-md transform"
                style={{ marginLeft: "50px" }}
              >
                {place.Name}
              </h1>
              <div className="carousel-container">
                {place.Image.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Image ${index}`}
                    style={{
                      position: "absolute",
                      top: "0",
                      left: `${index === currentIndex ? "0" : "-100%"}`,
                      transition: "left 1s",
                      width: "95%",
                      height: "97%",
                      margin: 17,
                      objectFit: "cover",
                      borderRadius: 10,
                    }}
                  />
                ))}
                <div>
                  <button onClick={() => handlebookmarks(place.Place_id)}>
                    <FaHeart
                      className="fas fa-heart heart-icon"
                      color={isFavourite ? "red" : "gray"}
                    ></FaHeart>
                  </button>
                </div>
              </div>
              <div className="main-div">
                <p className="Timing">
                  <span className="Timings-h">Timings:-</span> {place.Timings}
                </p>
                <p className="Feelink">
                  <span style={{ fontWeight: "bolder", color: "black" }}>
                    FeeLink:-
                  </span>{" "}
                  <a
                    href={place.FeeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Click Here
                  </a>
                </p>
                <p
                  className="BMTV"
                  style={{ fontWeight: "bolder", color: "black" }}
                >
                  <span className="BMTV-h">BMTV:-</span> {place.BMTV}
                </p>
                <div>
                  <h2
                    className="Amenities"
                    style={{ fontWeight: "bolder", color: "black" }}
                  >
                    Amenities:-
                    <ul className="Amenities">
                      {Array.isArray(place.Amenities) ? (
                        place.Amenities.map((Amenities, index) => (
                          <li key={index}>{Amenities}</li>
                        ))
                      ) : (
                        <li>{place.Category}</li>
                      )}
                    </ul>
                  </h2>
                </div>
                <div>
                  <h2
                    className="Activities"
                    style={{ fontWeight: "bolder", color: "black" }}
                  >
                    Activities:-
                    <ul className="Activities">
                      {Array.isArray(place.Activities) ? (
                        place.Activities.map((Activities, index) => (
                          <li key={index}>{Activities}</li>
                        ))
                      ) : (
                        <li>{place.Category}</li>
                      )}
                    </ul>
                  </h2>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center w-4/12 p-5 mr-10  ">
              <p className="text-xl description">
                <span className="description-heading">Description:-</span>
                <br />
                {place.LongDescription}
              </p>
              <p className="location">
                <span className="location-heading">Location:-</span>{" "}
                {place.City},{place.State},{place.Country}({place.latitude},
                {place.longitude})
              </p>
              <p className="Fee">
                <span className="Fee-h">Fee:-</span> {place.Fee}
              </p>
              <div>
                <h2
                  className="Amenities"
                  style={{
                    fontWeight: "bolder",
                    color: "black",
                    width: "400px",
                    zIndex:'-100'
                  }}
                >
                  Map
                  <MapContainer
                    center={[place.latitude, place.longitude]}
                    zoom={16}
                    style={{ height: "450px",zIndex:1}}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker
                      position={[place.latitude, place.longitude]}
                      icon={customIcon}
                    >
                      <Popup>{place.Name}</Popup>
                    </Marker>
                  </MapContainer>
                </h2>
                <button
                  onClick={redirectToMapWithDirections}
                  className="map-button ml-24 "
                >
                  Get Direction
                </button>
              </div>
              <div>
                <button
                  onClick={() => {
                    navigate("/give-review", {
                      state: { placeName: place.Name },
                    });
                  }}
                  className="map-button ml-0"
                >
                  Give Review
                </button>
              </div>
              <div>
                <button
                  onClick={() => {
                    navigate("/all-reviews", {
                      state: { placeName: place.Name },
                    });
                  }}
                  className="map-button ml-0"
                >
                  See all Review
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
        </div>
      </div>
    </>
  );
};

export default PlaceDetails;
