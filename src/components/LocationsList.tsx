import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import { List, Checkbox } from 'antd';

type searchedLocation = {
  id: string;
  mapLocation: google.maps.places.PlaceResult;
};
interface LocationListProps extends google.maps.MapOptions {
  locations: searchedLocation[];
  onDeleteListUpdate: (list: number[]) => void;
}
const LocationsList: React.FC<LocationListProps> = ({
  locations,
  onDeleteListUpdate,
}) => {
  const [deleteList, setDeleteList] = useState<number[]>([]);
  const onChange = (e: any) => {
    if (deleteList.find((ele) => ele === e.target.value)) {
      let temp = deleteList.filter((ele) => ele !== e.target.value);
      setDeleteList([...temp]);
    } else {
      setDeleteList([...deleteList, e.target.value]);
    }
  };
  useEffect(() => {
    onDeleteListUpdate(deleteList);
  }, [deleteList, onDeleteListUpdate]);
  return (
    <List
      itemLayout="vertical"
      size="large"
      pagination={{ pageSize: 10 }}
      dataSource={locations}
      renderItem={(location) => (
        <List.Item key={location.id}>
          <Checkbox onChange={onChange} value={location.id}>
            {location.mapLocation.name}
          </Checkbox>
        </List.Item>
      )}
    />
  );
};

export default LocationsList;
