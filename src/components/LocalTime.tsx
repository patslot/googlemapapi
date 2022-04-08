import React, { useEffect } from 'react';
import useHttp from '../hook/useHttp';
import { getLocalTime } from '../api/api';
import { Divider } from 'antd';
interface LocalTimeProps {
  location: string;
  loc: string;
}
const LocalTime = ({ location, loc }: LocalTimeProps) => {
  const {
    sendRequest,
    status,
    data: local,
    error,
  } = useHttp(getLocalTime, true);

  useEffect(() => {
    sendRequest(loc);
  }, [sendRequest, loc]);

  if (error) {
    return <p>{error}</p>;
  }

  if (status === 'completed' && (!local || local.length === 0)) {
    return <p> No post </p>;
  }
  return (
    <div>
      <Divider plain>Local time of {location}</Divider>
      <p style={{ textAlign: 'center' }}> {local}</p>
      <Divider plain></Divider>
    </div>
  );
};

export default LocalTime;
