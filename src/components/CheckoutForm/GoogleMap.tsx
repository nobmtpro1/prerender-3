import React, { useEffect, useState } from 'react';
import MapPicker from 'react-google-map-picker';
import Geocode from 'react-geocode';
import GoogleMapReact from 'google-map-react';
import { isEmpty } from 'lodash';

// set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
Geocode.setApiKey('AIzaSyCnhoR2-DBpVvP1aLl3CJ-8O0aueJ_jlCQ');

// set response language. Defaults to english.
Geocode.setLanguage('en');

// set response region. Its optional.
// A Geocoding request with region=es (Spain) will return the Spanish city.
Geocode.setRegion('es');
Geocode.enableDebug();

// Get address from latitude & longitude.
// Geocode.fromLatLng('48.8583701', '2.2922926').then(
//   (response) => {
//     const address = response.results[0].formatted_address;
//     console.log(address);
//   },
//   (error) => {
//     console.error(error);
//   },
// );

// Get formatted address, city, state, country from latitude & longitude when
// Geocode.setLocationType("ROOFTOP") enabled
const AnyReactComponent = () => <div>asd</div>;
const getAddressFromLatLng = (lat: any, lng: any) => {
  let objAddress = {};
  Geocode.fromLatLng('48.8583701', '2.2922926').then(
    (response) => {
      const address = response.results[0].formatted_address;
      let city, state, country;
      for (let i = 0; i < response.results[0].address_components.length; i++) {
        for (let j = 0; j < response.results[0].address_components[i].types.length; j++) {
          switch (response.results[0].address_components[i].types[j]) {
            case 'locality':
              city = response.results[0].address_components[i].long_name;
              break;
            case 'administrative_area_level_1':
              state = response.results[0].address_components[i].long_name;
              break;
            case 'country':
              country = response.results[0].address_components[i].long_name;
              break;
          }
        }
      }
      // console.log(city, state, country);
      // console.log(address);
      objAddress = { ...{ city: city, state: state, country: country, address: address } };
    },
    (error) => {
      console.error(error);
    },
  );

  return objAddress;
};

// Get latitude & longitude from address.
const getLatLngFromAddress = async (address: any) => {
  Geocode.fromAddress(address).then(
    (response) => {
      const { lat, lng } = response.results[0].geometry.location;
      // console.log(lat, lng);
      return { lat: lat, lng: lng };
    },
    (error) => {
      console.error(error);
    },
  );
};

const DefaultLocation = { lat: 10, lng: 106 };
const DefaultZoom = 15;

const GoogleMap = (props: any) => {
  const [defaultLocation, setDefaultLocation] = useState(DefaultLocation);

  const [location, setLocation] = useState(DefaultLocation);
  const [zoom, setZoom] = useState(DefaultZoom);

  function handleChangeLocation(lat: any, lng: any) {
    setLocation({ lat: lat, lng: lng });
    // console.log(location);
  }

  function handleChangeZoom(newZoom: any) {
    setZoom(newZoom);
  }

  function handleResetLocation() {
    setDefaultLocation({ ...DefaultLocation });
    setZoom(DefaultZoom);
  }

  const handleClickSubmit = () => {
    const addressString =
      props.data.street1 + props.data.street2 + props.data.lorem + props.data.city;
    Geocode.fromAddress(addressString).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        setLocation({ lat: lat, lng: lng });
        setDefaultLocation({ lat: lat, lng: lng });
      },
      (error) => {
        console.error(error);
      },
    );
    // setLocation({ lat: latLng?.lat, lng: latLng?.lng });
  };
  const [places, setPlaces] = useState<any>();

  const getMapBounds = (map: any, maps: any, places: any) => {
    const bounds = new maps.LatLngBounds();

    places.forEach((place: any) => {
      bounds.extend(new maps.LatLng(place.geometry.location.lat, place.geometry.location.lng));
    });
    return bounds;
  };

  // Re-center map when resizing the window
  const bindResizeListener = (map: any, maps: any, bounds: any) => {
    maps.event.addDomListenerOnce(map, 'idle', () => {
      maps.event.addDomListener(window, 'resize', () => {
        map.fitBounds(bounds);
      });
    });
  };

  // Fit map to its bounds after the api is loaded
  const apiIsLoaded = (map: any, maps: any, places: any) => {
    // Get bounds by our places
    const bounds = getMapBounds(map, maps, places);
    // Fit map to bounds
    map.fitBounds(bounds);
    // Bind the resize listener
    bindResizeListener(map, maps, bounds);
  };

  // useEffect(() => {
  //   Geocode.fromLatLng('48.8583701', '2.2922926').then(
  //     (response) => {
  //       const address = response.results[0].formatted_address;
  //       setPlaces(response.results);
  //     },
  //     (error) => {
  //       console.error(error);
  //     },
  //   );
  // }, [location]);

  return (
    <>
      {/* <button onClick={handleResetLocation}>Reset Location</button>
      <label>Latitute:</label>
      <input type="text" value={location.lat} disabled />
      <label>Longitute:</label>
      <input type="text" value={location.lng} disabled />
      <label>Zoom:</label>
      <input type="text" value={zoom} disabled />

      <MapPicker
        defaultLocation={DefaultLocation}
        zoom={zoom}
        style={{ height: '300px', margin: '16px 0' }}
        onChangeLocation={handleChangeLocation}
        onChangeZoom={handleChangeZoom}
        apiKey="AIzaSyCnhoR2-DBpVvP1aLl3CJ-8O0aueJ_jlCQ"
      /> */}

      <div style={{ height: '300px', width: '100%' }}>
        {/* <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyCnhoR2-DBpVvP1aLl3CJ-8O0aueJ_jlCQ' }}
          defaultCenter={location}
          defaultZoom={zoom}
          yesIWantToUseGoogleMapApiInternals={true}
        >
          <AnyReactComponent />
        </GoogleMapReact> */}

        <GoogleMapReact
          defaultZoom={10}
          defaultCenter={location}
          yesIWantToUseGoogleMapApiInternals={true}
          bootstrapURLKeys={{ key: 'AIzaSyCnhoR2-DBpVvP1aLl3CJ-8O0aueJ_jlCQ' }}
          // onGoogleApiLoaded={({ map, maps }: any) => apiIsLoaded(map, maps, places)}
        >
          <p>asdasdadad</p>
        </GoogleMapReact>
      </div>
      <div className="submit-box">
        <button>DELETE ADDRESS</button>
        <button onClick={handleClickSubmit}>CONFIRM ADDRESS</button>
      </div>
    </>
  );
};

export default GoogleMap;
