import { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Map from '../components/Map';

const years = [
  '2012-13', '2013-14', '2014-15', '2015-16',
  '2016-17', '2017-18', '2018-19', '2019-20', '2020-21'
];

// Sample tags for dropdown
const sampleTags = [
  'High Growth',
  'Industrial Hub',
  'IT Center',
  'Tourism Hub',
  'Agricultural Economy',
  'Educational Center',
  'Cultural Heritage',
  'Manufacturing Hub',
  'Service Sector',
  'Infrastructure Rich',
  'Coastal State',
  'Hill Station',
  'Trade Center',
  'Healthcare Hub'
];

// Toast Notification Component
const Toast = ({ isVisible, onClose, message }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{message}</span>
        <button 
          onClick={onClose}
          className="ml-3 text-white hover:text-gray-200"
        >
          ×
        </button>
      </div>
    </div>
  );
};

Toast.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
};

// State Card Component (for tags and upvotes)
const StateCard = ({ selectedState, onClose }) => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (selectedState) {
      fetchTags();
    }
  }, [selectedState]);

  const fetchTags = async () => {
    if (!selectedState?.stateCode) return;
    
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/tags/${selectedState.stateCode}`,
        { withCredentials: true }
      );      
      setTags(response.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
      setTags([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvoteAll = async () => {
    if (tags.length === 0) return;
    
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/tags/upvote/${tags[0]._id}`,
        { withCredentials: true }
      );
      setToastMessage('Upvote successful!');
      setShowToast(true);
      await fetchTags();
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error('Error upvoting:', error);
      alert('Error upvoting. Please try again.');
    }
  };

  const handleSubmitTag = async () => {
    if (!selectedTag || !selectedState?.stateCode) {
      alert('Please select a tag first');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/tags`, {
        state_code: selectedState.stateCode,
        tag_name: selectedTag
      },
      { withCredentials: true }
      );
      
      setToastMessage('New tag added!');
      setShowToast(true);
      setSelectedTag('');
      await fetchTags();
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error('Error adding tag:', error);
      alert('Error adding tag. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate total upvotes
  const totalUpvotes = tags.reduce((sum, tag) => sum + tag.upvotes, 0);

  if (!selectedState) return null;

  return (
    <>
      <Toast 
        isVisible={showToast} 
        onClose={() => setShowToast(false)}
        message={toastMessage}
      />
      
      <div className="fixed top-4 right-4 bg-white border-2 border-blue-300 rounded-lg shadow-lg p-4 w-64 z-40">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h2 className="text-lg font-bold text-gray-800">{selectedState.stateName}</h2>
            <p className="text-sm text-gray-600">GSDP: {selectedState.gsdp || 'N/A'}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-lg font-bold"
          >
            ×
          </button>
        </div>

        <div className="mb-3">
          <h3 className="text-sm font-semibold mb-2 text-gray-700">Development Tags</h3>
          
          {loading ? (
            <div className="text-center py-2">
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              <p className="text-xs text-gray-500 mt-1">Loading...</p>
            </div>
          ) : tags.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-2">No tags available.</p>
          ) : (
            <>
              <div className="space-y-2 mb-3">
                {tags.map(tag => (
                  <div key={tag._id} className="bg-gray-50 p-2 rounded text-xs">
                    <span className="font-medium text-gray-800">{tag.tag_name}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-600 mb-3">Total Upvotes: {totalUpvotes}</p>
              <button
                onClick={handleUpvoteAll}
                className="w-full bg-green-500 text-white px-3 py-2 rounded-md hover:bg-green-600 transition-colors text-sm font-medium mb-3"
              >
                Upvote
              </button>
            </>
          )}

          <div className="border-t pt-3">
            <h4 className="text-sm font-semibold mb-2 text-gray-700">Add New Tag</h4>
            
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a tag...</option>
              {sampleTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>

            <button
              onClick={handleSubmitTag}
              disabled={!selectedTag || submitting}
              className="w-full bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition-colors text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Tag'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

StateCard.propTypes = {
  selectedState: PropTypes.shape({
    stateName: PropTypes.string,
    stateCode: PropTypes.string,
    gsdp: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  }),
  onClose: PropTypes.func.isRequired,
};

// Growth Card Component (for GSDP comparison)
const GrowthCard = ({ selectedState, onClose }) => {
  const [year1, setYear1] = useState('2012-13');
  const [year2, setYear2] = useState('2013-14');
  const [gsdp1, setGsdp1] = useState(null);
  const [gsdp2, setGsdp2] = useState(null);
  const [loading, setLoading] = useState(false);
  const [growthResult, setGrowthResult] = useState('');

  useEffect(() => {
    setGrowthResult(''); // Reset growthResult on state change
    if (selectedState) {
      fetchGsdpData();
    } else {
      setGsdp1(null);
      setGsdp2(null);
      setGrowthResult('');
    }
  }, [selectedState?.stateCode, year1, year2]);

  const fetchGsdpData = async () => {
    if (!selectedState?.stateCode) return;

    setLoading(true);
    try {
      const [response1, response2] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/data/gsdp/${selectedState.stateCode}/${year1}`,
          { withCredentials: true }
        ),
        axios.get(`${import.meta.env.VITE_API_URL}/api/data/gsdp/${selectedState.stateCode}/${year2}`,
          { withCredentials: true }
        )
      ]);
      setGsdp1(response1.data.gsdp ?? 'N/A');
      setGsdp2(response2.data.gsdp ?? 'N/A');
    } catch (error) {
      console.error('Error fetching GSDP data:', error);
      setGsdp1('N/A');
      setGsdp2('N/A');
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateGrowth = () => {
    if (gsdp1 === 'N/A' || gsdp2 === 'N/A' || gsdp1 == null || gsdp2 == null) {
      setGrowthResult('Cannot calculate growth: Missing GSDP data');
      return;
    }

    // Convert years to numbers for comparison (e.g., 2012 for 2012-13)
    const year1Num = parseInt(year1.split('-')[0]);
    const year2Num = parseInt(year2.split('-')[0]);
    const [baseYear, compYear, baseGsdp, compGsdp] = year1Num < year2Num
      ? [year1, year2, gsdp1, gsdp2]
      : [year2, year1, gsdp2, gsdp1];

    const growth = ((compGsdp - baseGsdp) / baseGsdp) * 100;
    const roundedGrowth = Math.round(growth);
    const direction = roundedGrowth >= 0 ? 'higher' : 'lower';
    setGrowthResult(`${compYear} is ${Math.abs(roundedGrowth)}% ${direction} than ${baseYear}`);
  };

  if (!selectedState) return null;

  return (
    <div className="fixed bottom-4 left-4 bg-white border-2 border-blue-300 rounded-lg shadow-lg p-5 w-80 z-40">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h2 className="text-lg font-bold text-gray-800">{selectedState.stateName}</h2>
          <p className="text-sm text-gray-600">Code: {selectedState.stateCode}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-lg font-bold"
        >
          ×
        </button>
      </div>

      <div className="mb-3">
        <h3 className="text-sm font-semibold mb-2 text-gray-700">GSDP Comparison</h3>
        
        <div className="mb-3">
          <label className="text-xs font-medium text-gray-700">Base Year</label>
          <select
            value={year1}
            onChange={(e) => setYear1(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-sm mb-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {years.filter(year => year !== year2).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          {loading ? (
            <p className="text-xs text-gray-600">GSDP: Loading...</p>
          ) : (
            <p className="text-xs text-gray-600">
              GSDP: {gsdp1 !== 'N/A' && gsdp1 != null ? `${gsdp1} Cr` : 'N/A'}
            </p>
          )}
        </div>

        <div className="mb-3">
          <label className="text-xs font-medium text-gray-700">Comparison Year</label>
          <select
            value={year2}
            onChange={(e) => setYear2(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-sm mb-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {years.filter(year => year !== year1).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          {loading ? (
            <p className="text-xs text-gray-600">GSDP: Loading...</p>
          ) : (
            <p className="text-xs text-gray-600">
              GSDP: {gsdp2 !== 'N/A' && gsdp2 != null ? `${gsdp2} Cr` : 'N/A'}
            </p>
          )}
        </div>

        <button
          onClick={handleCalculateGrowth}
          className="w-full bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition-colors text-sm font-medium mb-3"
        >
          Calculate Growth
        </button>

        {growthResult && (
          <p className="text-xs text-gray-800 text-center whitespace-nowrap">{growthResult}</p>
        )}
      </div>
    </div>
  );
};

GrowthCard.propTypes = {
  selectedState: PropTypes.shape({
    stateName: PropTypes.string,
    stateCode: PropTypes.string,
    gsdp: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  }),
  onClose: PropTypes.func.isRequired,
};

function HomePage() {
  const [selectedYear, setSelectedYear] = useState('2012-13');
  const [gsdpData, setGsdpData] = useState([]);
  const [selectedStateForTags, setSelectedStateForTags] = useState(null);
  const [selectedStateForGrowth, setSelectedStateForGrowth] = useState(null);

  useEffect(() => {
    const fetchGsdpData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/data/gsdp/${selectedYear}`,
          { withCredentials: true }
        );
        setGsdpData(response.data);
      } catch (error) {
        console.error('Error fetching GSDP data:', error);
      }
    };
    fetchGsdpData();
  }, [selectedYear]);

  const handleStateClick = (stateInfo) => {
    setSelectedStateForTags(stateInfo);
    setSelectedStateForGrowth(stateInfo);
  };

  const handleCloseStateCard = () => {
    setSelectedStateForTags(null);
  };

  const handleCloseGrowthCard = () => {
    setSelectedStateForGrowth(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 relative">
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold mb-2">India GSDP Visualization</h1>
        <div>
          <label htmlFor="year-select" className="mr-2 font-medium">Select Year:</label>
          <select
            id="year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="p-2 border rounded-md"
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <p className="text-xs text-gray-600 mt-1">
          Colors: Light Gray (GSDP N/A), Red (Low GSDP), Green (High GSDP), White (Borders)
        </p>
      </div>
      
      <div className="w-full max-w-4xl h-[500px] bg-white shadow-lg rounded-lg">
        <Map gsdpData={gsdpData} onStateClick={handleStateClick} />
      </div>
      
      <StateCard 
        selectedState={selectedStateForTags} 
        onClose={handleCloseStateCard}
      />
      <GrowthCard 
        selectedState={selectedStateForGrowth} 
        onClose={handleCloseGrowthCard}
      />
    </div>
  );
}

HomePage.propTypes = {
  // No props passed to HomePage, but included for completeness
};

export default HomePage;