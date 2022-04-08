import { Wrapper, Status } from '@googlemaps/react-wrapper';
import React, { useState, useEffect, useCallback } from 'react';
// import style from './App.module.scss';
import Map from './components/map';
import LocationsList from './components/LocationsList';
import 'antd/dist/antd.css';
import { Button, Layout } from 'antd';
import Marker from './components/Marker';
import LocalTime from './components/LocalTime';

const { Header, Content } = Layout;
function App() {
  type searchedLocation = {
    id: string;
    mapLocation: google.maps.places.PlaceResult;
  };
  const [searchedLocations, setsearchedLocations] = useState<
    searchedLocation[]
  >([]);
  const [clicks, setClicks] = useState<google.maps.LatLng[]>([]);
  const [zoom, setZoom] = useState(12); // initial zoom
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({
    lat: 0,
    lng: 0,
  });
  const [currentLocation, setcurrentLocation] = useState('Toronto');

  const [deleteList, setDeleteList] = useState<number[]>([]);
  const onDeleteListUpdate = (list: number[]) => {
    setDeleteList(list);
  };
  const onSearchLocation = useCallback(
    (location: google.maps.places.PlaceResult, m: google.maps.Map) => {
      setZoom(m.getZoom()!);
      setCenter(m.getCenter()!.toJSON());
      setsearchedLocations([
        ...searchedLocations,
        {
          id: Math.floor(
            Math.random() * (999999 - 100000 + 1) + 100000
          ).toString(),
          mapLocation: location,
        },
      ]);
      if (location.name) {
        setcurrentLocation(location.name);
      }
      console.log(location);
    },
    [searchedLocations]
  );
  const onDelete = () => {
    deleteList.forEach((deleteItem) => {
      let temp = searchedLocations.filter((loc) => {
        return loc.id !== deleteItem.toString();
      });
      setsearchedLocations(temp);
    });
  };

  const onClick = (e: google.maps.MapMouseEvent) => {
    setClicks([...clicks, e.latLng!]);
    console.log(clicks);
  };
  const onIdle = (m: google.maps.Map) => {
    // console.log('onIdle');
    setZoom(m.getZoom()!);
    setCenter(m.getCenter()!.toJSON());
  };
  const render = (status: Status) => {
    return <h1>{status}</h1>;
  };
  const onGetLocation = () => {
    console.log(clicks);
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log('Latitude is :', position.coords.latitude);
      console.log('Longitude is :', position.coords.longitude);
      setCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      setZoom(15);
    });
  };

  useEffect(() => {
    console.log(deleteList);
  }, [searchedLocations, deleteList]);
  return (
    <>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Button type="primary" onClick={onGetLocation}>
          Get Your Location
        </Button>
        <Button
          onClick={onDelete}
          type="primary"
          danger
          style={{ justifyContent: 'center' }}
        >
          Delete Location
        </Button>
      </Header>
      <Content>
        {' '}
        <Wrapper
          apiKey={'AIzaSyBRZVZc-HnQyRjmlkCEVZcjFGzK-uElufE'}
          render={render}
        >
          <Map
            center={center}
            onClick={onClick}
            onIdle={onIdle}
            onSeachLocation={onSearchLocation}
            zoom={zoom}
            style={{ width: '100%', height: '300px' }}
          >
            {searchedLocations.map((a, i) => {
              if (a.mapLocation.geometry) {
                return (
                  <Marker key={i} position={a.mapLocation.geometry.location} />
                );
              } else {
                return null;
              }
            })}
          </Map>
        </Wrapper>
        <LocalTime
          location={currentLocation}
          loc={`${center.lat},${center.lng}`}
        />
        {searchedLocations && (
          <LocationsList
            locations={searchedLocations}
            onDeleteListUpdate={onDeleteListUpdate}
          />
        )}
      </Content>
    </>
  );
}

export default App;
