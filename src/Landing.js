import React, { useState, useEffect, useRef } from 'react';
import './Landing.css'; // Import the CSS file

function Landing() {
  const [selectedPet, setSelectedPet] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Flag for loading state
  const [error, setError] = useState(null); // State to store any errors
  const hasFetchedData = useRef(false); // Flag to track API call
  const [businessKey, setBusinessKey] = useState(null); // State to store businessKey

  // API endpoint URL (Start Process Instance)
  const apiUrl = 'http://localhost:8080/process/start';

  // Function to fetch data from the first API
  const fetchData = async () => {
    setIsLoading(true); // Set loading state to true
    setError(null); // Clear any previous errors

    try {
      const randomBusinessKey = Math.floor(Math.random() * 10000) + 1; // Generate random integer (1-10000)

      const response = await fetch(apiUrl, {
        method: 'POST', // Use POST method for sending data
        headers: { 'Content-Type': 'application/json' }, // Set content type
        body: JSON.stringify({
          petType: selectedPet, // Use selected pet from state (initial state is '')
          businessKey: randomBusinessKey,
        }),
      });

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const data = await response.json(); // Parse the JSON response
      setBusinessKey(data.businessKey);
      console.log("API response:", data.businessKey); // Optional: Log the entire response

    } catch (error) {
      setError(error.message); // Set error state if an error occurs
    } finally {
      setIsLoading(false); // Set loading state to false after fetching (or error)
    }
  };

  // Define the handlePetChange function for the select element
  const handlePetChange = (event) => {
    setSelectedPet(event.target.value);
  };

  // Call the API on component mount (using useEffect with conditional logic)
  useEffect(() => {
    if (!hasFetchedData.current) {
      fetchData();
      hasFetchedData.current = true; // Set flag after first call
    }
  }, []); // Empty dependency array ensures it runs only once

  // Function to handle submit button click
  const handleButtonClick = async () => {
    if (!selectedPet) {
      return; // Do nothing if no pet is selected
    }
    // Call the second API using businessKey and selectedPet
    await invokeBoundaryEvent(businessKey, selectedPet);
  };

  const invokeBoundaryEvent = async (businessKey, selectedPet) => {
    setError(null); // Reset the error state

      // Remove existing image element (if any)
  const existingElement = document.getElementById('your-image-id');
  if (existingElement) {
    existingElement.parentNode.removeChild(existingElement);
  }
    console.log (selectedPet, businessKey);

    const imageElement = document.createElement('img');
    imageElement.id = 'your-image-id';
    const secondApiUrl = `http://localhost:8080/process/message/petType/${businessKey}`;
  
    try {
      const response = await fetch(secondApiUrl, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, // Set content type
        body: JSON.stringify({
          petType: selectedPet, // Pass selected pet in the request body
        }),
      });
  
      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }
  
      const data = await response.json(); // Parse the JSON response (optional for handling response)
      const encodedImageData = data.encodedImageData; // Assuming the key is "encodedImageData"

      if (encodedImageData) {
        // Decode the base64 encoded image data
        const byteString = atob(encodedImageData);
        const mimeType = 'image/png'; // Adjust based on actual image type (optional)
        const buffer = new ArrayBuffer(byteString.length);
        const intArray = new Uint8Array(buffer);
        for (let i = 0; i < byteString.length; i++) {
          intArray[i] = byteString.charCodeAt(i);
        }
  
        const blob = new Blob([buffer], { type: mimeType });
        const imageURL = URL.createObjectURL(blob);

         // Update the image element with the decoded data
        imageElement.src = imageURL;
        imageElement.style.display = 'block'; // Show the image element

        document.body.appendChild(imageElement);
  
      } else {
        console.warn('encodedImageData not found in the response');
      }
  
    } catch (error) {
      console.error("Error invoking boundary event:", error); 
      setError(`Error fetching pet image: ${error.message}`); 

    }
 
  };


  return (
    <div className="pet-viewer">
      <h1>Pet Viewer</h1>
      {isLoading && <p>Loading data...</p>}
      {error && <p>Error: {error}</p>}
      <select value={selectedPet} onChange={handlePetChange}>
        <option value="">Select a Pet</option>
        <option value="cat">Cat</option>
        <option value="dog">Dog</option>
        <option value="bear">Bear</option>
      </select>
      <button disabled={!selectedPet} onClick={handleButtonClick}>View Pet</button>
    </div>
  );
}

export default Landing;
