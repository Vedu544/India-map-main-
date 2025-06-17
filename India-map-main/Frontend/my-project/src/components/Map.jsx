import { MapContainer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import geoJsonData from '../data/india_state.json';

const numericCodeToNameMap = {
  "1": "Jammu & Kashmir",
  "2": "Himachal Pradesh",
  "3": "Punjab",
  "4": "Chandigarh",
  "5": "Uttarakhand",
  "6": "Haryana",
  "7": "Delhi",
  "8": "Rajasthan",
  "9": "Uttar Pradesh",
  "10": "Bihar",
  "11": "Sikkim",
  "12": "Arunachal Pradesh",
  "13": "Nagaland",
  "14": "Manipur",
  "15": "Mizoram",
  "16": "Tripura",
  "17": "Meghalaya",
  "18": "Assam",
  "19": "West Bengal",
  "20": "Jharkhand",
  "21": "Orissa",
  "22": "Chhattisgarh",
  "23": "Madhya Pradesh",
  "24": "Gujarat",
  "27": "Maharashtra",
  "29": "Karnataka",
  "30": "Goa",
  "32": "Kerala",
  "33": "Tamil Nadu",
  "34": "Puducherry",
  "35": "Andaman & Nicobar Islands",
  "36": "Telangana",
  "37": "Andhra Pradesh"
};

const Map = ({ gsdpData, onStateClick }) => {
  console.log('GSDP Data:', gsdpData);

  const getColor = (gsdp) => {
    if (!gsdp || gsdp === 0) return '#e0e0e0'; // Light Gray for GSDP N/A or 0

    // Filter out invalid GSDP values and sort to find the median
    const validGsdpValues = gsdpData
      .map(d => d.gsdp)
      .filter(g => g && g !== 0)
      .sort((a, b) => a - b);
    
    // Calculate the median GSDP
    const midIndex = Math.floor(validGsdpValues.length / 2);
    const medianGsdp = validGsdpValues.length % 2 === 0
      ? (validGsdpValues[midIndex - 1] + validGsdpValues[midIndex]) / 2
      : validGsdpValues[midIndex];

    // Assign colors based on whether GSDP is below or above the median
    if (gsdp <= medianGsdp) {
      return '#ff0000'; // Red for low GSDP
    } else {
      return '#00ff00'; // Green for high GSDP
    }
  };

  const styleFeature = (feature) => {
    const stateName = feature.properties.NAME_1;
    const stateCode = Object.keys(numericCodeToNameMap).find(
      code => numericCodeToNameMap[code] === stateName
    );
    const stateData = gsdpData.find(d => d.state_code === stateCode);
    console.log(`State: ${stateName}, Code: ${stateCode}, GSDP: ${stateData?.gsdp}`);
    return {
      fillColor: getColor(stateData?.gsdp),
      weight: 1,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.7,
    };
  };

  const onEachFeature = (feature, layer) => {
    const stateName = feature.properties.NAME_1;
    const stateCode = Object.keys(numericCodeToNameMap).find(
      code => numericCodeToNameMap[code] === stateName
    );
    const stateData = gsdpData.find(d => d.state_code === stateCode);
    const gsdp = stateData ? stateData.gsdp : 'N/A';
    
    // Keep the original popup
    layer.bindPopup(`<b>${stateName}</b><br>GSDP: ${gsdp}`);
    
    // Add click handler for state card
    layer.on('click', () => {
      onStateClick({
        stateName,
        stateCode,
        gsdp
      });
    });
  };

  if (!geoJsonData) return <div>Loading map...</div>;

  return (
    <MapContainer
      key={JSON.stringify(gsdpData)}
      center={[20.5937, 78.9629]}
      zoom={5}
      style={{ height: '100%', width: '100%' }}
      attributionControl={false}
    >
      <GeoJSON
        data={geoJsonData}
        style={styleFeature}
        onEachFeature={onEachFeature}
      />
    </MapContainer>
  );
};

export default Map;