import React, { useEffect, useRef, useState } from 'react';
import styles from './Autocomplete.module.scss';

interface AutoCompleteProps extends google.maps.MapOptions {
  googlemap: google.maps.Map;
  onSeachLocation: (
    location: google.maps.places.PlaceResult,
    m: google.maps.Map
  ) => void;
}

const AutoComplete = ({ googlemap, onSeachLocation }: AutoCompleteProps) => {
  const ACinput = useRef<HTMLInputElement>(null);
  const [locations, setLocations] = useState<google.maps.places.PlaceResult>();
  useEffect(() => {
    if (locations) {
      // console.log(locations);
      onSeachLocation(locations, googlemap);
    }
  }, [locations]);
  useEffect(() => {
    const ACoptions = {
      fields: ['formatted_address', 'geometry', 'name'],
      strictBounds: false,
      types: ['establishment'],
    };
    let service: google.maps.places.PlacesService;
    const request = {
      query: 'CN Tower',
      fields: ['name', 'geometry'],
    };
    if (googlemap) {
      service = new google.maps.places.PlacesService(googlemap);
      service.findPlaceFromQuery(
        request,
        (
          results: google.maps.places.PlaceResult[] | null,
          status: google.maps.places.PlacesServiceStatus
        ) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            googlemap.setCenter(results[0].geometry!.location!);
          }
        }
      );
    }
    if (!ACinput.current) throw Error('input not ready yet');
    let autocomplete = new google.maps.places.Autocomplete(
      ACinput.current,
      ACoptions
    );
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();

      if (!place.geometry || !place.geometry.location) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert("No details available for input: '" + place.name + "'");
        return;
      } else {
        setLocations(place);
      }
      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        googlemap.fitBounds(place.geometry.viewport);
      } else {
        googlemap.setCenter(place.geometry.location);
        googlemap.setZoom(17);
      }
    });
  }, [googlemap]);

  return (
    <div className={styles.formcontainer}>
      <input
        ref={ACinput}
        className={styles.placeinput}
        id="pac-input"
        type="text"
        placeholder="Enter a location"
      ></input>
    </div>
  );
};

export default AutoComplete;
