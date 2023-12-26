import './App.css';
import {useEffect, useState} from 'react';
import Select from 'react-select'
import {Toaster, toast} from 'sonner'



function App() {
  const [updated,setUpdated] = useState(false);

  //usestate for update 
  const [URegional, setURegional] = useState("");
  const [UYear, setUYear] = useState(0);
  const [UGrowth, setUGrowth] = useState(0);
  const [USubRegion, setUSubRegion] = useState("");
  const [UCountryCode, setUCountryCode] = useState("");

  const [Search, setSearch] = useState("");
  const [gdpdata,setGdpData] = useState([]);

  //Year select options
  const yearoption = [
    {value: "2017", label: "2017"},
    {value: "2018", label: "2018"},
    {value: "2019", label: "2019"},
    {value: "2020", label: "2020"},
    {value: "2021", label: "2021"},
    {value: "2022", label: "2022"},
    {value: "2023", label: "2023"},
  ];

  //ComponentMount fetch Dataset
  useEffect(()=>{
    setUpdated(false);
    fetch("http://localhost:8000/gdp")
    .then(res => res.json())
    .then(data=> setGdpData(data));  
  },[setUpdated])


  //Filter Database based from year
  const handleChange = (selectedOption) =>{
    console.log("handleChange", selectedOption.value);
    fetch(`http://localhost:8000/gdpyear?year=${selectedOption.value}`)
    .then(response => response.json())
    .then(data=>setGdpData(data));
  }

  //Find Country / Search Feature
  const findCountry= () => {
    fetch(`http://localhost:8000/search?country=${Search}`)
    .then(response => response.json())
    .then(data=>setGdpData(data));;
  }

  //Update Feature
  const displayInfo=() => {
    let UpdateGDP;
    if(URegional && USubRegion && UCountryCode &&UGrowth){
      if(UYear>2000 && UYear<2100){
        //this object will be send into backend as the req.body;
        UpdateGDP = {
          regional : URegional,
          year : UYear,
          growth: UGrowth,
          subregion: USubRegion,
          countrycode: UCountryCode
        }
      }
    }
    
    if(UpdateGDP !== undefined){
      fetch('http://localhost:8000/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Specify the content type as JSON
      },
      body: JSON.stringify(UpdateGDP), // Convert data to JSON format
    })
    .then(response => response.json())
    .then(setUpdated(true))
    .then(toast.success("Dataset Updated"))
    }

    if(!URegional || !UYear || !UGrowth || !UCountryCode || !USubRegion){
      toast.error("Please Fill all the Requirements")
    }
  }


  //Delete row from the table
  function handleSubmit(year, country){
    fetch(`http://localhost:8000/delete?year=${year}&country=${country}`, {
  method: 'DELETE',
})
    .then(response => response.json())
    .then(
        fetch(`http://localhost:8000/gdpyear?year=${year}`)
      .then(response => response.json())
      .then(toast.success("Dataset Deleted."))
    )
  }

  return (
    <div className="App">
      <Toaster />
      <div className="rowform">
        <div className='columnform th'>RegionalMember</div>
        <div className='columnform th'>Year</div>
        <div className='columnform th'>GDP_Growth in %</div>
        <div className='columnform th'>SubRegion</div>
        <div className='columnform th'>Country Code</div>
      </div>

      <div className="form">
        <input className="box" type="text" onChange={(event)=>{setURegional(event.target.value)}} name="RegionalMember" />
        <input className="box" onChange={(event)=>{setUYear(event.target.value)}} type="number" name="Year" />
        <input className="box" type="number" onChange={(event)=>{setUGrowth(event.target.value)}}name="GDP Growth " />
        <input className="box" type="text" onChange={(event)=>{setUSubRegion(event.target.value)}}name="Subregion" />
        <input className="box" type="text" onChange={(event)=>{setUCountryCode(event.target.value)}} name="CountryCode" />
        <button className="btn" onClick={displayInfo}>Update</button>
      </div>

      <div className="userinteraction">
        <input className="box" type="text" onChange={(event)=>{setSearch(event.target.value)}} name="SearchCountry" />
        <button className="btn" onClick={findCountry}>Find Country!</button>
        <Select className="selectbar" options={yearoption} onChange={handleChange} placeholder="Year" />
      </div>
      <div className="content">
        <div className="row">
          <div className='column th'>RegionalMember</div>
          <div className='column th'>Year</div>
          <div className='column th'>GDP_Growth</div>
          <div className='column th'>SubRegion</div>
          <div className='column th'>Country Code</div>
        </div>

        {gdpdata.map(item=>{
        return(
            <div className="row">
                <div className="column">{item.RegionalMember}</div>
                <div  className="column">{item.Year}</div>
                <div  className="column">{item.GDP_growth}%</div>
                <div  className="column">{item.Subregion}</div>
                <div  className="column">{item.Country_Code}</div>
                <button className="delete-btn" onClick={e => handleSubmit(item.Year,item.RegionalMember)}>Delete</button>
            </div>
        )
       })}
      </div>
    </div>
  );
}

export default App;
