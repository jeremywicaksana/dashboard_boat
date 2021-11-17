import { 
  React, 
  useEffect, 
  useState } from 'react';
import dashboardstyle from '../styles/Dashboardstyles.module.scss';
import { 
  SideButton, 
  ComponentButton, 
  SizeButton, 
  TypeButton,
  TimeButton } from './dashboardButtons';
import {
  Close as CloseIcon
} from '@material-ui/icons';
import { 
  ButtonBase,
  Button,
  CircularProgress,
  Modal,
  Typography,
  TextField } from '@material-ui/core';
import {
  NewCookie,
  addChartCookie,
  removeChartCookie,
  cookieExists,
  getLayoutFromCookie
} from '../cookies/cookie'
import {ApiService} from "../api/api";

export default function DashboardModal ({chooseCreateGraph, createDataViz, setCreateDataViz, curSizeId}) {

	const [select, setSelect] = useState(0);

	//components with measurement-field
	const [components, setComponents] = useState([]);

  //single choices
  const [sizeIndex, setSizeIndex] = useState(-1);
  const [typeIndex, setTypeIndex] = useState(-1);
  const [timeIndex, setTimeIndex] = useState(0);

  //textual information
  const [chosenSize, setChosenSize] = useState(null);
  const [chosenType, setChosenType] = useState(null);
  const [chosenTime, setChosenTime] = useState("static");
  const [compValues, setCompValues] = useState([]);
  const [dataPoints, setDataPoints] = useState(10);

	//dateTime
	const [start, setStart] = useState("");
  const [startTime, setStartTime] = useState("23:59:59");
  const [startTimeError, setStartTimeError] = useState(false);
  const [timeError, setTimeError] = useState("");
  let endDynamic = new Date();
  const [end, setEnd] = useState("");
  const [endTime, setEndTime] = useState("23:59:59");

  //live data
  const [frequency, setFrequency] = useState(0);


	const [loadComps, setLoadComps] = useState(false);

  let graphChoice = ["Single graph", "Multi graph"];
  let graphSize = ["small", "medium", "large"];
  let graphType = ["bar chart", "line chart", "textual data"];
  let graphTime = ["static", "dynamic"];
  let timeRegex = /^(((([0-1][0-9])|(2[0-3])):?[0-5][0-9]:?[0-5][0-9]$))/;
	
	useEffect(async () => {
		if (createDataViz) {
			await Promise.all(
				[
					ApiService.allMeasurementsAndTheirFields()
					.then((res) => {
						res.data.map((elems) => {
							translateComp(elems);
						})
					})
					.catch((err) => {
						console.log("Error " + JSON.stringify(err));
					})
				]
			)
			setLoadComps(true);
		}
	}, [createDataViz])

  /**end result [{key, measurement},{key, measurement}]
   * translate components getting from api into measreument_field
   * @param {*} comps the json object containing the components
   */
	const translateComp = (comps) => {
		comps.fields.map((field) => {
			components[components.length] = {key: comps.measurement+"-"+field, measurement: comps.measurement, field: field}
		})
		setComponents([...components]);
		// setLoadComps(true);
  }

  /**
   *   reset all usestates in modal to default
   */
	const resetModal = () => {
		setSelect(0);
		setSizeIndex(-1);
		setTypeIndex(-1);
    setTimeIndex(0);
    setFrequency(0);
		setCreateDataViz(false);
    setLoadComps(false);
		setChosenSize(null);
		setChosenType(null);
    setChosenTime("static");
		setCompValues([]);
    setComponents([]);
  }

	/**
   *   Closing modal  
   */
	const closeCreator = () => {
		resetModal();
	}
	
  /**
   * get the index of current button selected in modal, components, size, type
   * @param {*} nav current selection in array
   * @param {*} arr the array of the selections
   * @returns 
   */
	 const getIndex = (nav, arr) => {
    return arr.indexOf(nav);
  }

	/**
  * onclick function where it will trigger once generate graph button is click.
  * it will create a graph based on the chosen components.
  * @returns the whole content of modal
  */
  const dataGenerator = () => {
    return (
      <Modal
        open={createDataViz}
      >
        <div className={dashboardstyle.centerSelector}>
					{loadComps ?
						<div className={dashboardstyle.selectorContainer}>
							<ButtonBase className={dashboardstyle.upperRight} onClick={closeCreator}>
								<CloseIcon style={{width: '5vw', height: '5vh'}}></CloseIcon>
							</ButtonBase>
							<div className={dashboardstyle.choices}>
								{graphChoice.map((title, titleIdx) => (
									<SideButton
										name={title}
										isSelected={titleIdx === select}
										onSelect={() =>{
											setSizeIndex(-1);
											setTypeIndex(-1);
											setChosenSize(null);
											setChosenType(null);
											setCompValues([]);
											setSelect(getIndex(title, graphChoice));    
										}}
									/>        
								))}
								{/* chosing either multiple graph or single graph */}
								{chosenGraph(select)}
							</div>
							<div className={dashboardstyle.submitLocation}>
								<Button className={dashboardstyle.submitButton} onClick={generateGraph}>
									Generate Graph
								</Button>
							</div>
						</div>
					:	
						<CircularProgress style={{margin: 'auto'}}/>
					}
        </div>
      </Modal>
    );
  }

	/**
	 * add graph directly by replacing the adding button
	 */
	const generateGraph = () => {
		var notAcceptStatic = (chosenSize === null || chosenType === null || compValues === null || start === "" || end === "");
    var notAcceptDynamic = (chosenSize === null || chosenType === null || compValues === null || start === "");
    var startDateTime = new Date(start+'T'+startTime);
    var endDateTime = new Date(end+'T'+endTime);
		// select === 0 ?// choosing single graph
		// 	notAcceptSingle ?
		// 		alert("size/type/components/start/end are empty")
		// 	: chosenTime === "static" ?
    //     chooseCreateGraph(chosenSize, compValues, chosenType, startDateTime, endDateTime, dataPoints, frequency, resetModal)
    //   : //dynamic
		// 		chooseCreateGraph(chosenSize, compValues, chosenType, startDateTime, endDynamic, dataPoints, frequency, resetModal)
		// : // multi graph
		// 	notAcceptMulti ?
    //     alert("size/type/components/start/end are empty")
    //   : chosenTime === "static" ?
    //     chooseCreateGraph(chosenSize, compValues, chosenType, startDateTime, endDateTime, dataPoints, frequency, resetModal)
		// 	: //dynamic
		// 		chooseCreateGraph(chosenSize, compValues, chosenType, startDateTime, endDynamic, dataPoints, frequency, resetModal)
    chosenTime === "static" ? //if generating static data
			notAcceptStatic ?
				alert("size/type/components/start/end are empty")
			:
        chooseCreateGraph(chosenSize, compValues, chosenType, startDateTime, endDateTime, dataPoints, frequency, resetModal)
    : //dynamic
      notAcceptDynamic ?
        alert("size/type/components/start/end are empty")
      :
        chooseCreateGraph(chosenSize, compValues, chosenType, startDateTime, endDynamic, dataPoints, frequency, resetModal)
	}

  const onStartTimeChange = (e) => {
    const curTime = e.target.value;
    if (curTime.match(timeRegex)) {
      setTimeError("");
      setStartTimeError(false);
    } else {
      setStartTimeError(true);
      setTimeError("Forbidden time");
    }
    setStartTime(e.target.value);
  }

  const onEndTimeChange = (e) => {
    const curTime = e.target.value;
    if (curTime.match(timeRegex)) {
      setTimeError("");
      setStartTimeError(false);
    } else {
      setStartTimeError(true);
      setTimeError("Forbidden time");
    }
    setEndTime(e.target.value);
  }

  /**
  * Creating modal for every components, size, and types
  * @param {*} select between single or multi graph
  * @returns modal of single/multi graph
  */ 
	 const chosenGraph = (selected) => {
    return (
      <div className={dashboardstyle.modalContent}>
        <Typography>
          Components
        </Typography>
        <ComponentButton
          componentName={components}
          compValues={compValues}
          setCompValues={setCompValues}
          graphChoice={selected}//0 == single graph , 1 == multiple graph
        />
        <Typography>
          Size
        </Typography>
        {graphSize.map((size, curIdx) => (
          ( curSizeId >= curIdx ) ?
          <SizeButton
            sizeName={size}
            isSelected={curIdx === sizeIndex}
            onSelect={() =>{
              setSizeIndex(getIndex(size, graphSize));  
              setChosenSize(size);  
            }}
          />
          :
          []
        ))}
        <Typography>
          Type
        </Typography>
        {graphType.map((type, curIdx) => (
          <TypeButton
            typeName={type}
            isSelected={curIdx === typeIndex}
            graphChoice={selected}
            onSelect={() =>{
              setTypeIndex(getIndex(type, graphType));
              setChosenType(type);    
            }}
          />
        ))}
        <Typography>
          Data production
        </Typography>
        {graphTime.map((time, curIdx) => (
          <TimeButton
            timeName={time}
            isSelected={curIdx === timeIndex}
            onSelect={() =>{
              setTimeIndex(getIndex(time, graphTime));
              setChosenTime(time);    
            }}
          />
        ))}
        {chosenTime === "static" ?
          <div style={{display:'flex', height: '10vh', width: '100vw'}}>
            <div style={{paddingLeft: '1%', paddingRight: '1%', paddingTop: '1%', display: 'flex'}}> 
              <TextField
                type="date"
                style={{width: '100%', paddingLeft: '1%'}}
                fullWidth
                onChange = {(event) => {
                  setStart(event.target.value)
                }}
                value={start}
                variant="outlined"
                required />
              <TextField
                label="Time"
                style={{width: '100%', paddingLeft: '1%'}}
                fullWidth
                onChange = {onStartTimeChange}
                value={startTime}
                error={startTimeError}  
                helperText={timeError}
                variant="outlined"
                required />
            </div>
            <Typography style={{marginTop: 'auto', marginBottom: 'auto'}}>
              until
            </Typography>
            <div style={{paddingLeft: '1%', paddingRight: '1%', paddingTop: '1%', display: 'flex'}}> 
              <TextField
                  type="date"
                  style={{width: '100%', paddingLeft: '1%'}}
                  fullWidth
                  onChange = {(event) => {
                    setEnd(event.target.value)
                  }}
                  value={end}
                  variant="outlined"
                  required />
              <TextField
                label="Time"
                style={{width: '100%', paddingLeft: '1%'}}
                fullWidth
                onChange = {onEndTimeChange}
                value={endTime}
                error={startTimeError}  
                helperText={timeError}
                variant="outlined"
                required />
            </div>
          </div>
        :
          <div style={{display:'flex', height: '10vh', width: '100vw'}}>
            <div style={{paddingLeft: '1%', paddingRight: '1%', paddingTop: '1%', display: 'flex'}}> 
              <TextField
                type="date"
                style={{width: '100%', paddingLeft: '1%'}}
                fullWidth
                onChange = {(event) => {
                  setStart(event.target.value)
                }}
                value={start}
                variant="outlined"
                required />
              <TextField
                label="Time"
                style={{width: '100%', paddingLeft: '1%'}}
                fullWidth
                onChange = {onStartTimeChange}
                value={startTime}
                error={startTimeError}  
                helperText={timeError}
                variant="outlined"
                required />
            </div>
            <Typography style={{marginTop: 'auto', marginBottom: 'auto'}}>
              until Present
            </Typography>
            <div style={{width: '200px', paddingLeft: '1%', paddingRight: '1%', paddingTop: '1%'}}> 
              <TextField
                type="number"
                style={{width: '100%', paddingLeft: '1%'}}
                fullWidth
                onChange = {(event) => {setFrequency(event.target.value)}}
                value={frequency}
                variant="outlined"
                required />
            </div>
            <Typography style={{marginTop: 'auto', marginBottom: 'auto'}}>
              Seconds until the data updated again
            </Typography>
          </div>
        }
        <Typography>
          Total Data Points
        </Typography>
        <TextField
          type="number"
          style={{width: '10%', paddingLeft: '1%'}}
          fullWidth
          onChange = {(event) => {setDataPoints(event.target.value)}}
          value={dataPoints}
          variant="outlined"
          required />
      </div>
    );  
  }

  return (
    dataGenerator()
  )

}