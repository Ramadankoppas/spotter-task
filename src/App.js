// import logo from './logo.svg';
import './App.css';
import React, { useState  , useEffect , Suspense} from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Lottie = React.lazy(() => import("lottie-react"));

function App() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departDate, setDepartDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [TextRoundTrip , setTextRoundTrip] = useState('Round trip')
  const [valueAdult , setValueAdult] = useState(1)
  const [valueChildren , setValueChildren] = useState(0)
  const [ValueRoundTrip , setValueRoundTrip] = useState(-1) 
  const [imageTriangleRoundTrip , setImageTriangleRoundTrip] = useState('/assets/images/triangleGray.webp')
  const [displayChooesRoundTrip , setDisplayChooesRoundTrip] = useState('none')
  const [rotateTriangleRoundTrip , setRotateTriangleRoundTrip] = useState('0deg')
  const [backGroundFocusRoundTrip , setBackGroundFocusRoundTrip] = useState('#36373a')
  const [imageTrianglePassanger , setImageTrianglePassanger] = useState('/assets/images/triangleGray.webp')
  const [displayChooesPassanger , setDisplayChooesPassanger] = useState('none')
  const [rotateTrianglePassanger , setRotateTrianglePassanger] = useState('0deg')
  const [backGroundFocusPassanger , setBackGroundFocusPassanger] = useState('#36373a')
  const [ViewSearchDivFrom , setViewSearchDivFrom ] = useState('none')
  const [ViewSearchDivTo , setViewSearchDivTo ] = useState('none')
  const [resultSearchFrom , setResultSearchFrom] = useState([]);
  const [resultSearchTo , setResultSearchTo] = useState([]);
  const [results, setResults] = useState([]);
  const [DisplayNotFound, setDisplayNotFound] = useState('none');
  const [mockFlights , setmockFlights] = useState([])
  const [loading , setLoadig] = useState(true)
  const animationData = require('./assets/Animation - 1737028807153.json')
  const renderChooesRoundTrip=()=>{
    const data_round = [{'name':'Round trip' , 'value':-1} , {'name':'One way' , 'value':0} , {'name':'Multi-city' , 'value':1}]
    const element = []
    for(let i = 0; i < data_round.length; i++){
      element.push(
        <div key={i} className='itemRoundTrip' onClick={()=>{
          setTextRoundTrip(data_round[i]['name'])
          setValueRoundTrip(data_round[i]['value'])
        }}>
          {data_round[i]['name']}
        </div>
      )
    }
    return element
  }
  const renderPassengerValue=()=>{
      const data_passenger = [{'name':'Adults' , 'value':valueAdult , 'setValue' :setValueAdult} , {'name':'Children <br> Aged 2-11','value':valueChildren , 'setValue':setValueChildren}]
      const element = []
      for(let i = 0; i < data_passenger.length; i++){
        element.push(
          <div key={i} className='itemPerson'>
              <p dangerouslySetInnerHTML={{ __html: data_passenger[i]['name']}}></p>
              <div className='itemPersonCount'>
                <img
                  onClick={()=>{
                    if(data_passenger[i]['value'] > 0){
                      data_passenger[i]['setValue'](data_passenger[i]['value'] - 1)
                    }
                  }}
                src="/assets/images/minus.webp" alt="minus spotter"/>
                <p>{data_passenger[i]['value']}</p>
                <img
                  onClick={()=>{
                    if(data_passenger[i]['value'] < 11){
                      data_passenger[i]['setValue'](data_passenger[i]['value'] + 1)
                    }
                  }}
                 className='plusImage' src="/assets/images/plus.webp" alt="plus spotter"/>
              </div>
          </div>
        )
      }
      return element
  }
  function convertMinutesToHoursAndMinutes(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  }
  const viewPassengerChooes = ()=>{
    if(rotateTrianglePassanger === '0deg'){
      setImageTrianglePassanger('/assets/images/triangleBabyBlue.webp')
      setRotateTrianglePassanger('180deg')
      setDisplayChooesPassanger('block')
    }else{
      setImageTrianglePassanger('/assets/images/triangleBabyBlue.webp')
      setRotateTrianglePassanger('0deg')
      setDisplayChooesPassanger('none')
    }
  }
  const formatTime = (num , status)=>{
    let finalNum = ''
    let timeStatus = ''
    num >= 10 ? finalNum = String(num):finalNum = `0${num}`
    status === 'hours' && num >= 12 ? timeStatus = 'PM' : timeStatus = 'AM'
    return[finalNum , timeStatus]
  }
  const searchAirLinesFrom = (searchText)=>{
    let array = [] , uniqueFlights = [] 
    mockFlights.forEach((flight)=>{
      if(flight.legs[0]['origin']['city'].toLowerCase().startsWith(searchText.toLowerCase())){
          array.push({'id':flight.legs[0],'from':flight.legs[0]['origin']['city'] , 'to':flight.legs[0]['destination']['city'] , 'price':parseInt(flight.price.raw), 'duration':convertMinutesToHoursAndMinutes(flight.legs[0].durationInMinutes) , 'stops':flight.legs[0].stopCount , 'departure':flight.legs[0].departure , 'arrival':flight.legs[0]['arrival']})
      }else if(flight.legs[1]['origin']['city'].toLowerCase().startsWith(searchText.toLowerCase())){
          array.push({'id':flight.legs[1],'from':flight.legs[1]['origin']['city'] , 'to':flight.legs[1]['destination']['city'] , 'price':parseInt(flight.price.raw), 'duration':convertMinutesToHoursAndMinutes(flight.legs[1].durationInMinutes) , 'stops':flight.legs[1].stopCount , 'departure':flight.legs[1].departure , 'arrival':flight.legs[1]['arrival']})
      }
    })
    uniqueFlights = array.filter((flight, index, self) =>
      index === self.findIndex(f => f.from === flight.from && f.to === flight.to)
    );
    setResultSearchFrom(uniqueFlights)
  }
  const searchAirLinesTo = (searchText)=>{
    let array = [] , uniqueFlights = [] 
    mockFlights.forEach((flight)=>{
      if(flight.legs[0]['destination']['city'].toLowerCase().startsWith(searchText.toLowerCase())){
          array.push({'id':flight.legs[0],'from':flight.legs[0]['origin']['city'] , 'to':flight.legs[0]['destination']['city'] , 'price':parseInt(flight.price.raw), 'duration':convertMinutesToHoursAndMinutes(flight.legs[0].durationInMinutes) , 'stops':flight.legs[0].stopCount , 'departure':flight.legs[0].departure , 'arrival':flight.legs[0]['arrival']})
      }else if(flight.legs[1]['destination']['city'].toLowerCase().startsWith(searchText.toLowerCase())){
          array.push({'id':flight.legs[1],'from':flight.legs[1]['origin']['city'] , 'to':flight.legs[1]['destination']['city'] , 'price':parseInt(flight.price.raw), 'duration':convertMinutesToHoursAndMinutes(flight.legs[1].durationInMinutes) , 'stops':flight.legs[1].stopCount , 'departure':flight.legs[1].departure , 'arrival':flight.legs[1]['arrival']})
      }
    })
    uniqueFlights = array.filter((flight, index, self) =>
      index === self.findIndex(f => f.from === flight.from && f.to === flight.to)
    );
    setResultSearchTo(uniqueFlights)
  }
  const handleSearch = async(e) => {
    e.preventDefault();
    if(ValueRoundTrip === -1){
      alert('Please chooes round trip')
    }
    if(valueAdult === 0){
      alert('minmum adult must be 1')
      return
    }
    if(origin === ''){
      alert('Please insert orgin')
      return
    }
    if(destination === ''){
      alert('Please insert destinition')
      return
    }
    if(departDate === null){
      alert('please chooes depart date')
      return
    }
    console.log('click')
    if(results.length > 0){
      setResults([])
    }
    await new Promise((resolve) => setTimeout(resolve, 100)); 
    console.log(results)
    const array = []
    let uniqueFlights = []
    mockFlights.forEach(flight => {
      if(returnDate == null){
        const DateApi= new Date(flight.legs[0]['departure'])
        const DateApi1= new Date(flight.legs[1]['departure']) 
        if(flight.legs[0]['origin']['city'] === origin && flight.legs[0]['destination']['city'] === destination && (ValueRoundTrip === 0 ? flight.legs[0]['stopCount'] === 0 : flight.legs[0]['stopCount'] > 0) && `${DateApi.getFullYear()}-${DateApi.getMonth()}-${DateApi.getDate()}` === `${departDate.getFullYear()}-${departDate.getMonth()}-${departDate.getDate()}`){
          array.push({'id':flight.legs[0]['id'],'from':flight.legs[0]['origin']['city'] , 'to':flight.legs[0]['destination']['city'] , 'price':parseInt(flight.price.raw), 'duration':convertMinutesToHoursAndMinutes(flight.legs[0].durationInMinutes) , 'stops':flight.legs[0].stopCount , 'departure':new Date(flight.legs[0].departure ), 'arrival':flight.legs[0]['arrival'] , 'carriers':flight.legs[0]['carriers']['marketing'][0]['name']})
        }else if(flight.legs[1]['origin']['city'] === origin && flight.legs[1]['destination']['city'] === destination && (ValueRoundTrip === 0 ? flight.legs[1]['stopCount'] === 0 : flight.legs[1]['stopCount'] > 0) && `${DateApi1.getFullYear()}-${DateApi1.getMonth()}-${DateApi1.getDate()}` === `${departDate.getFullYear()}-${departDate.getMonth()}-${departDate.getDate()}`){
          array.push({'id':flight.legs[1]['id'],'from':flight.legs[1]['origin']['city'] , 'to':flight.legs[1]['destination']['city'] , 'price':parseInt(flight.price.raw), 'duration':convertMinutesToHoursAndMinutes(flight.legs[1].durationInMinutes) , 'stops':flight.legs[1].stopCount , 'departure':new Date(flight.legs[1].departure) , 'arrival':flight.legs[1]['arrival'] , 'carriers':flight.legs[1]['carriers']['marketing'][0]['name']})
        }
      }else{
        const subArray = [] 
        const DateApi= new Date(flight.legs[0]['departure'])
        const DateApi1= new Date(flight.legs[1]['departure']) 
        if(flight.legs[0]['origin']['city'] === origin && flight.legs[0]['destination']['city'] === destination && (ValueRoundTrip === 0 ? flight.legs[0]['stopCount'] === 0 : flight.legs[0]['stopCount'] > 0) && `${DateApi.getFullYear()}-${DateApi.getMonth()}-${DateApi.getDate()}` === `${departDate.getFullYear()}-${departDate.getMonth()}-${departDate.getDate()}`){
          subArray.push({'id':flight.legs[0]['id'],'from':flight.legs[0]['origin']['city'] , 'to':flight.legs[0]['destination']['city'] , 'price':parseInt(flight.price.raw), 'duration':convertMinutesToHoursAndMinutes(flight.legs[0].durationInMinutes) , 'stops':flight.legs[0].stopCount , 'departure':new Date(flight.legs[0].departure ), 'arrival':flight.legs[0]['arrival'] , 'carriers':flight.legs[0]['carriers']['marketing'][0]['name']})
        }else if(flight.legs[1]['origin']['city'] === origin && flight.legs[1]['destination']['city'] === destination && (ValueRoundTrip === 0 ? flight.legs[1]['stopCount'] === 0 : flight.legs[1]['stopCount'] > 0) && `${DateApi1.getFullYear()}-${DateApi1.getMonth()}-${DateApi1.getDate()}` === `${departDate.getFullYear()}-${departDate.getMonth()}-${departDate.getDate()}`){
          subArray.push({'id':flight.legs[1]['id'],'from':flight.legs[1]['origin']['city'] , 'to':flight.legs[1]['destination']['city'] , 'price':parseInt(flight.price.raw), 'duration':convertMinutesToHoursAndMinutes(flight.legs[1].durationInMinutes) , 'stops':flight.legs[1].stopCount , 'departure':new Date(flight.legs[1].departure) , 'arrival':flight.legs[1]['arrival'] , 'carriers':flight.legs[1]['carriers']['marketing'][0]['name']})
        }
        if(flight.legs[0]['destination']['city'] === origin && flight.legs[0]['origin']['city'] === destination && (ValueRoundTrip === 0 ? flight.legs[0]['stopCount'] === 0 : flight.legs[0]['stopCount'] > 0) && `${DateApi.getFullYear()}-${DateApi.getMonth()}-${DateApi.getDate()}` === `${returnDate.getFullYear()}-${returnDate.getMonth()}-${returnDate.getDate()}`){
          subArray.push({'id':flight.legs[0]['id'],'from':flight.legs[0]['origin']['city'] , 'to':flight.legs[0]['destination']['city'] , 'price':parseInt(flight.price.raw), 'duration':convertMinutesToHoursAndMinutes(flight.legs[0].durationInMinutes) , 'stops':flight.legs[0].stopCount , 'departure':new Date(flight.legs[0].departure ), 'arrival':flight.legs[0]['arrival'] , 'carriers':flight.legs[0]['carriers']['marketing'][0]['name']})
        }else if(flight.legs[1]['destination']['city'] === origin && flight.legs[1]['origin']['city'] === destination && (ValueRoundTrip === 0 ? flight.legs[1]['stopCount'] === 0 : flight.legs[1]['stopCount'] > 0) && `${DateApi1.getFullYear()}-${DateApi1.getMonth()}-${DateApi1.getDate()}` === `${returnDate.getFullYear()}-${returnDate.getMonth()}-${returnDate.getDate()}`){
          subArray.push({'id':flight.legs[1]['id'],'from':flight.legs[1]['origin']['city'] , 'to':flight.legs[1]['destination']['city'] , 'price':parseInt(flight.price.raw), 'duration':convertMinutesToHoursAndMinutes(flight.legs[1].durationInMinutes) , 'stops':flight.legs[1].stopCount , 'departure':new Date(flight.legs[1].departure) , 'arrival':flight.legs[1]['arrival'] , 'carriers':flight.legs[1]['carriers']['marketing'][0]['name']})
        }
        if(subArray.length > 0){
          array.push(subArray)
        }
      }
    }
    );
    if(array.length > 0){
      uniqueFlights = array.filter((flight, index, self) =>
        index === self.findIndex((f) => {
          if(returnDate == null){
            return f.id === flight.id
          }else{
            if (Array.isArray(flight)) {
              if(flight.length > 1){
                return f.length > 1 ? f[0].id === flight[0].id && f[1].id === flight[1].id : flight
              }else if(flight.length  === 1){
                if(f[0] !== undefined){
                    return f[0].id === flight[0].id
                  }
              }
            }
          }
          return flight
        })
      );
      if (uniqueFlights.length === 0) {
          setDisplayNotFound('block')
      } else {
        setResults(uniqueFlights);
      }
    }else{
      setDisplayNotFound('block')
      setResults([])
    }
  };
  useEffect(()=>{
    const getData = async()=>{
      const url = 'https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlights?originSkyId=LOND&destinationSkyId=NYCA&originEntityId=27544008&destinationEntityId=27537542&date=2025-02-14&returnDate=2025-03-12&cabinClass=economy&adults=1&sortBy=best&currency=USD&market=en-US&countryCode=US';
      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': '347285eadbmshd8bc27c30b5170ep168d55jsn294917742e62',
          'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com'
        }
      };
      
      try {
        const response = await fetch(url, options);
        const result = await response.text()
        const object = JSON.parse(result)
        setmockFlights(object['data']['itineraries'])
        setLoadig(false)
      } catch (error) {
        console.error(error);
      }
    }
    getData()
  },[])
  if(loading){
    return(
      <div className="loadindDiv">
          <Suspense >
              <Lottie
                  animationData={animationData}
                  loop={true}
                  style={{width:250 , height:250}}
              />
          </Suspense>
      </div>
    );
  }else{
    return (
      <div className="container">
      <div className='banner'>
        <img src="https://www.gstatic.com/travel-frontend/animation/hero/flights_nc_dark_theme_4.svg" alt="" />
        <h1>Flights</h1>
      </div>
      <form onSubmit={handleSearch} className="search-form">
        <div className='mainDataPassenger'>
          <div style={{backgroundColor:backGroundFocusRoundTrip}} className='mainRoundTrip'
            tabIndex={0}
           onFocus={()=>{
            setBackGroundFocusRoundTrip('#4d5767')
            setImageTriangleRoundTrip('/assets/images/triangleBabyBlue.webp')
          }}
          onBlur={()=>{
            setBackGroundFocusRoundTrip('#36373a')
            setImageTriangleRoundTrip('/assets/images/triangleGray.webp')
            setRotateTriangleRoundTrip('0deg')
            setDisplayChooesRoundTrip('none')
          }}
          >
            <img className='roundTripImage' src="/assets/images/roundTrip.webp" alt="rotate spotter" />
            <div>
              <div 
              onClick={()=>{
                  if(rotateTriangleRoundTrip === '0deg'){
                    setImageTriangleRoundTrip('/assets/images/triangleBabyBlue.webp')
                    setRotateTriangleRoundTrip('180deg')
                    setDisplayChooesRoundTrip('block')
                  }else{
                    setImageTriangleRoundTrip('/assets/images/triangleBabyBlue.webp')
                    setRotateTriangleRoundTrip('0deg')
                    setDisplayChooesRoundTrip('none')
                  }
              }} className='dataRoundTrip'>
                <p>{TextRoundTrip}</p>
                <img style={{transform:`rotate(${rotateTriangleRoundTrip})`}} src={imageTriangleRoundTrip} alt="triangle spotter" />
              </div>
              <div style={{display:displayChooesRoundTrip}} className='mainItemRoundTrip'>
                {renderChooesRoundTrip()}
              </div>
  
            </div>
          </div>
          <div style={{backgroundColor:backGroundFocusPassanger}} className='mainRoundTrip'
            tabIndex={0}
          onFocus={()=>{
            setBackGroundFocusPassanger('#4d5767')
            setImageTrianglePassanger('/assets/images/triangleBabyBlue.webp')
          }}
          onBlur={()=>{
            setBackGroundFocusPassanger('#36373a')
            setImageTrianglePassanger('/assets/images/triangleGray.webp')
            setRotateTrianglePassanger('0deg')
            setDisplayChooesPassanger('none')
          }}
          >
            <img onClick={()=>{viewPassengerChooes()}} className='person' src="/assets/images/person.webp" alt="person spotter" />
            <div>
              <div onClick={()=>{
                viewPassengerChooes()
              }}
             className='dataPerson'>
                <p>{valueAdult + valueChildren}</p>
                <img style={{transform:`rotate(${rotateTrianglePassanger})`}} src={imageTrianglePassanger} alt="triangle spotter" />
              </div>
              <div style={{display:displayChooesPassanger}} className='mainItemChoeesPassanger'>
                {renderPassengerValue()}
              </div>
            </div>
          </div>
  
        </div>
        <div className='mainInsertForm'>
          <div className='orgin-destination'>
            <div className="input-group From-input">
              <span></span>
              <input
                type="text"
                value={origin}
                onChange={(e) => {
                  const searchText = e.target.value
                  setOrigin(searchText)
                  searchAirLinesFrom(searchText)
                  if(searchText.length > 0){
                    setViewSearchDivFrom('block')
                  }else{
                    setViewSearchDivFrom('none')
                  }
                }}
                onBlur={()=>{
                  if(origin.length > 0){
                    let status = false
                    mockFlights.forEach(flight =>{
                      if(flight.legs[0]['origin']['city'] === origin || flight.legs[1]['origin']['city'] === origin ){
                         status = true
                      } 
                    })
                    if(!status){
                      setOrigin('')
                    }
                    if(resultSearchFrom.length > 0){
                      setOrigin(resultSearchFrom[0]['from'])
                    }
                  }
                  setViewSearchDivFrom('none')
                }}
                placeholder="From"
              />
              <div style={{display:ViewSearchDivFrom}} className='mainItemSearch'>
                {
                  resultSearchFrom.map(flight=>(
                    <div onClick={()=>{
                      setOrigin(flight.from)
                      setViewSearchDivFrom('none')
                    }} className='itemSearch' key={flight.id}>{flight.from}</div>
                  ))
                }
              </div>
            </div>
            <img className='rotateDestition' src="/assets/images/rotate.webp" alt="rotate spotter" />
            <div className="input-group to-input">
              <span></span>
              <input
                type="text"
                value={destination}
                onChange={(e) =>{
                  const searchText = e.target.value
                  setDestination(searchText)
                  searchAirLinesTo(searchText)
                  if(searchText.length > 0){
                    setViewSearchDivTo('block')
                  }else{
                    setViewSearchDivTo('none')
                  }
                }}
                onBlur={()=>{
                  if(destination.length > 0){
                    let status = false
                    mockFlights.forEach(flight =>{
                      if(flight.from === destination){
                         status = true
                      } 
                    })
                    if(!status){
                      setDestination('')
                    }
                    if(resultSearchTo.length > 0){
                      setDestination(resultSearchTo[0]['to'])
                    }
                  }
                  setViewSearchDivTo('none')
                }}
                placeholder="Where to?"
              />
              <div style={{display:ViewSearchDivTo}} className='mainItemSearch'>
                {
                  resultSearchTo.map(flight=>(
                    <div onClick={()=>{
                      setDestination(flight.to)
                      setViewSearchDivTo('none')
                    }} className='itemSearch' key={flight.id}>{flight.to}</div>
                  ))
                }
              </div>
            </div>
          </div>
          <div className='datePackerSection'>
              <img src="/assets/images/calender.webp" alt="calender spotter" srcSet="" />
              <div className="input-dateDeparture">
                <DatePicker
                  selected={departDate}
                  onChange={date => setDepartDate(date)}
                  minDate={new Date()}
                  placeholderText="Departure"
                />
              </div>
  
              <div className="input-date">
                <DatePicker
                  selected={returnDate}
                  onChange={date => setReturnDate(date)}
                  minDate={departDate || new Date()}
                  placeholderText="Return"
                />
              </div>
          </div>
        </div>
        <div className='searchButton'>
          <img src="/assets/images/search.webp" alt="search spotter" />
          <button type="submit" className="search-button">
            Explore
          </button>
        </div>
      </form>
  
      <div className="results-container">
        {results.length > 0?
            results.map(flight => (
              !Array.isArray(flight)?
              <div key={flight.id} className="flight-card">
                <h3>{flight.airline}</h3>
                <p>Price: {(flight.price * valueAdult) + (flight.price * valueChildren)}$</p>
                <p>Duration: {flight.duration}</p>
                <p>Stops: {flight.stops}</p>
                <p>Carriers : {flight.carriers}</p>
                <p>Time :{`${formatTime(flight.departure.getHours() , 'hours')[0]}:${formatTime(flight.departure.getMinutes() , 'minutes')[0]} ${formatTime(flight.departure.getHours() , 'hours')[1]}`}</p>
                <button className="select-button">Select Flight</button>
              </div>:
              flight.length === 0 ?
              <div style={{display:DisplayNotFound}} className='notfound'>Not found trip</div>:
              flight.length === 1?
              <div key={flight[0].id} className="flight-card">
                    <h3>{flight[0].airline}</h3>
                    <p>Price: {(flight[0].price * valueAdult) + (flight[0].price * valueChildren)}$</p>
                    <p>Duration: {flight[0].duration}</p>
                    <p>Stops: {flight[0].stops}</p>
                    <p>Carriers : {flight[0].carriers}</p>
                    <p>Time :{`${formatTime(flight[0].departure.getHours() , 'hours')[0]}:${formatTime(flight[0].departure.getMinutes() , 'minutes')[0]} ${formatTime(flight[0].departure.getHours() , 'hours')[1]}`}</p>
                    <button className="select-button">Select Flight</button>
                  </div>:
              <div key={flight[0].id} className='fullTrip'>
                  <div  className="flight-card1">
                    <h1>Departure</h1>
                    <h3>{flight[0].airline}</h3>
                    <p>Price: {(flight[0].price * valueAdult) + (flight[0].price * valueChildren)}$</p>
                    <p>Duration: {flight[0].duration}</p>
                    <p>Stops: {flight[0].stops}</p>
                    <p>Carriers : {flight[0].carriers}</p>
                    <p>Time :{`${formatTime(flight[0].departure.getHours() , 'hours')[0]}:${formatTime(flight[0].departure.getMinutes() , 'minutes')[0]} ${formatTime(flight[0].departure.getHours() , 'hours')[1]}`}</p>
                    <div className='totalPrice'>
                      <button className="select-button">Select Flight</button>
                      <p>Total : {((flight[0].price * valueAdult) + (flight[0].price * valueChildren)) + ((flight[1].price * valueAdult) + (flight[1].price * valueChildren))}$</p>
                    </div>
                  </div>
                  <div className="flight-card2">
                    <h1>Return</h1>
                    <h3>{flight[1].airline}</h3>
                    <p>Price: {(flight[1].price * valueAdult) + (flight[1].price * valueChildren)}$</p>
                    <p>Duration: {flight[1].duration}</p>
                    <p>Stops: {flight[1].stops}</p>
                    <p>Carriers : {flight[1].carriers}</p>
                    <p>Time :{`${formatTime(flight[1].departure.getHours() , 'hours')[0]}:${formatTime(flight[1].departure.getMinutes() , 'minutes')[0]} ${formatTime(flight[1].departure.getHours() , 'hours')[1]}`}</p>
                  </div>

              </div>

            )):
            <div style={{display:DisplayNotFound}} className='notfound'>Not found trip</div>}
      </div>
    </div>
    );
  }
};

export default App;
