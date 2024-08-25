import React, { useState } from 'react';
import axios from 'axios';

const InputForm = () => {
  const [apiData, setApiData] = useState('');
  const [filterData, setFilterData] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);


const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state on new submit

    try {
        console.log('apiData:', apiData);

        // Parse apiData into a JSON object
        const dataToSend = JSON.parse(apiData);
        console.log('Parsed Data to Send:', dataToSend);

        // Check if dataToSend.data is an array
        if (!Array.isArray(dataToSend.data)) {
            throw new Error('Invalid input format: "data" should be an array');
        }

        const res = await axios.post(
            'https://66cad55dd1cee3bb54153075--bfhljimil.netlify.app/.netlify/functions/bfhl',
            dataToSend, // Send the parsed JSON object directly
            { headers: { 'Content-Type': 'application/json' } }
        );
        
        setResponse(res.data);
        setFilterData('');
    } catch (err) {
        console.error('Error:', err);

        if (err.response) {
            console.error('Server responded with an error:', err.response.data);
            setError(err.response.data.message);
        } else if (err.request) {
            setError('No response received from server.');
        } else {
            setError('An error occurred while setting up the request.');
        }
    }
};

  const handleFilterChange = (e) => {
    setFilterData(e.target.value);
  };

  const filteredResponse = () => {
    if (!response) return null;
    const filters = filterData.toLowerCase().split(',').map((filter) => filter.trim());
    const filtered = {};

    if (filters.includes('numbers') && response.numbers) {
      filtered.numbers = response.numbers.join(',');
    }
    if (filters.includes('alphabets') && response.alphabets) {
      filtered.alphabets = response.alphabets.join(',');
    }
    if (filters.includes('highest_lowercase_alphabet') && response.highest_lowercase_alphabet) {
      filtered.highest_lowercase_alphabet = response.highest_lowercase_alphabet[0];
    }

    return filtered;
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={apiData}
          onChange={(e) => setApiData(e.target.value)}
          placeholder="Enter JSON data"
        />
        <input
          type="text"
          value={filterData}
          onChange={handleFilterChange}
          placeholder="Enter filters (numbers, alphabets, highest_lowercase_alphabet)"
        />
        <button type="submit">Submit</button>
      </form>
      {error && <div>Error: {error}</div>}
      {response && (
        <div>
          <h2>Filtered Response</h2>
          {filteredResponse()?.numbers && <div>Numbers: {filteredResponse().numbers}</div>}
          {filteredResponse()?.alphabets && <div>Alphabets: {filteredResponse().alphabets}</div>}
          {filteredResponse()?.highest_lowercase_alphabet && (
            <div>Highest lowercase alphabet: {filteredResponse().highest_lowercase_alphabet}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default InputForm;