// components/StreamComponent.js

import { useEffect } from 'react';

const StreamComponent = () => {
  useEffect(() => {
    const eventSource = new EventSource('/api/v1/compleation');

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('New message:', data);
      // Handle the data from the stream here
    };

    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div>
      {/* Display streamed data here */}
    </div>
  );
};

export default StreamComponent;
