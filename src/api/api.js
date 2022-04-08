export async function getLocalTime(loc) {
  const targetDate = new Date();
  const timestamp =
    targetDate.getTime() / 1000 + targetDate.getTimezoneOffset() * 60;
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/timezone/json?location=${loc}&timestamp=${timestamp}&key=AIzaSyBRZVZc-HnQyRjmlkCEVZcjFGzK-uElufE`,
    {
      method: 'GET',
      headers: {},
    }
  );
  const data = await response.json();
  var offsets = data.dstOffset * 1000 + data.rawOffset * 1000; // get DST and time zone offsets in milliseconds
  var localdate = new Date(timestamp * 1000 + offsets); // Date object containing current time of target location
  // console.log(data);
  if (!response.ok) {
    throw new Error(data.message || 'Could not fetch quotes.');
  }
  return localdate.toString();
}
