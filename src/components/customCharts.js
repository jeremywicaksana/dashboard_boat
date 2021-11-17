import
  React,  
  {useEffect, useState}
from 'react';
import dashboardstyle from '../styles/Dashboardstyles.module.scss';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@material-ui/icons';
import { 
  ButtonBase,
  Button,
  Typography
} from '@material-ui/core';
import {
  removeButtonCookie,
  removeChartCookie 
} from '../cookies/cookie'
import { 
  LineChart, 
  BarChart,
  Line, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer } from 'recharts';
import {ApiService} from "../api/api";

function CustomCharts({data, dataId, dataViz, setDataViz, setCurSizeId, setCreateDataViz, setCurAddIndex}) {

  const [curData, setCurData] = useState({});
  const [updateAllow, setUpdateAllow] = useState(true);
  const [intervalId, setIntervalId] = useState(0);

  let colors = [
    "#e47263",
    "#f0a661",
    "#e0832b",
    "#e0822b4f" ,
    "#78d864",
    "#64d8bb",
    "#64a0d8",
    "#6466d8",
    "#a064d8",
    "#d8649a",
    "#4d6e47",
    "#6e6747",
    "#6e4747",
    "#5c476e"]
  
  useEffect(() => {
    console.log("useffect");
    if (data.frequency === 0) {
      console.log("asd");
    } else { // > 0
      const interval = setInterval(async() => {
        // console.log(data.components);
        // console.log(data.time_start);
        // console.log(data.time_end);
        // console.log(data.n);
        ApiService.lastN(data.components, data.time_start, data.time_end, data.n).then((res) => {
          console.log("allow");
          data.data = res.data;
          setCurData({...data});
        })
      }, data.frequency*1000);
      console.log(interval);
      setIntervalId(interval);
      return () => clearInterval(interval); 
    }
  }, [dataViz])

  
  /**
   * 
   * @param {*} multipleComponent the components from current chart
   * @param {*} data all of data from the be
   * @returns the gauge info on top of the chart
   */
	 const gaugeInfo = (multipleComponent, data) => {
    return (
      <div style={{zIndex: -1,  gridRowStart: 1, gridColumnStart: 1}}>
        <Typography align="center">
          {multipleComponent.map(component => {
            if (data !== undefined) {
              if (data.length > 0) {
                return component+"="+data[data.length-1][component]+" ";
              }
            }
            return "no data is retrieved";
          })}
        </Typography>
      </div>
    )
  }

  /** 
  * create linechart could be small, medium, or large size. With chosen components
  * @param {*} data of the graph retrieved by the api
  * @param {*} multipleComponent names of fields and its measurement 
  * @param {*} id the index of current graph
  * @param {*} size small/medium/large graph
  * @returns linechart based on chosen comps
  */
  const lineChart = (data, multipleComponent=[], id, size) => {
    return (
      <div>
        <Button style={{width: '1%', height: '1%'}} onClick={() => {
          dataViz[id] = {"size" : size, "frequency": 0};
          console.log(intervalId);
          setTimeout(()=> clearInterval(intervalId), 2000);
          setUpdateAllow(false);
          console.log(dataViz);
          setDataViz([...dataViz]);
          removeChartCookie(id);
        }}>
          <DeleteIcon style={{color: 'red'}}/>
        </Button>
        <div style={size === "small" ? { width: '22vw', height: '25vh'} : size === "medium" ? { width: '44vw', height: '25vh'}  : { width: '88vw', height: '25vh'}}>
          {gaugeInfo(multipleComponent, data)}
          <ResponsiveContainer>
            <LineChart
              data={data}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              {multipleComponent.map((component, compId) => {
                var randomColor = colors[compId%colors.length];
                return <Line type="monotone" dataKey={component} stroke={randomColor} />;
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  /** 
  * create barChart could be small, medium, or large size. With chosen components
  * @param {*} data of the graph retrieved by the api
  * @param {*} multipleComponent names of fields and its measurement 
  * @param {*} id the index of current graph
  * @param {*} size small/medium/large graph
  * @returns barchart based on chosen comps
  */
  const barChart = (data, multipleComponent=[], id, size) => {
    return (
      <div>
        <Button style={{width: '5%', height: '5%'}} onClick={() => {
          dataViz[id] = {"size" : size, "frequency": 0};
          setDataViz([...dataViz]);
          setUpdateAllow(false);
          removeChartCookie(id);
        }}>
          <DeleteIcon style={{color: 'red'}}/>
        </Button>
        <div style={size === "small" ? { width: '22vw', height: '25vh'} : size === "medium" ? { width: '44vw', height: '25vh'}  : { width: '88vw', height: '25vh'}}>
          {gaugeInfo(multipleComponent, data)}
          <ResponsiveContainer>
            <BarChart
              data={data}
            >
              <CartesianGrid strokesDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              {multipleComponent.map((component, compId) => {
                var randomColor = colors[compId%colors.length];
                return <Bar dataKey={component} fill={randomColor} />;
              })}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  /** 
  * create textualData could be small, medium, or large size. With chosen components
  * @param {*} data of the graph retrieved by the api
  * @param {*} multipleComponent names of fields and its measurement 
  * @param {*} id the index of current graph
  * @param {*} size small/medium/large graph
  * @returns textual data based on chosen comps
  */
  const textualData = (data, comp, id, size) => {
    return (
      <div>
        <Button style={{width: '5%', height: '5%'}} onClick={() => {
          dataViz[id] = {"size" : size, "frequency": 0};
          setDataViz([...dataViz]);
          setUpdateAllow(false);
          removeChartCookie(id);
        }}>
          <DeleteIcon style={{color: 'red'}}/>
        </Button>
        <div style={size === "small" ? { width: '22vw', height: '25vh'} : size === "medium" ? { width: '44vw', height: '25vh'}  : { width: '88vw', height: '25vh'}}>
          {/* needs to be in the center */}
          <Typography align="center" style={size === "small" ? {fontSize: '1.5rem'} : size === "medium" ? {fontSize: '3rem'} : {fontSize: '5rem'}}>
            {comp[0]+"="} 
            {data.length === 0 ?
            ""
            :
            data[data.length-1][comp[0]]
            }
          </Typography>
        </div>
      </div>
    );
  }

  /**
  * choose the right graph based on the json query 
  * @param {*} jsonQuery consisting of key size, type, components, and the data
  * @param {*} id to know where is the location of the graph currently is
  * @returns the chosen graph by the user
  */
  const graphByContent = (jsonQuery, id) => {
    var size = jsonQuery.size;
    var comp = jsonQuery.components;
    var type = jsonQuery.type;
    var data = jsonQuery.data;
    if (type === "bar chart" && data !== undefined) {
      if (size === "small") {
        return barChart(data, comp, id, size);
      } else if (size === "medium") {
        return barChart(data, comp, id, size);
      } else { //size large
        return barChart(data, comp, id, size);
      }
    } else if (type === "line chart") {
      if (size === "small") {
        return lineChart(data, comp, id, size);
      } else if (size === "medium") {
        return lineChart(data, comp, id, size);
      } else { //size large
        return lineChart(data, comp, id, size);
      }
    } else if (type === "textual data") {
      if (size === "small") {
        return textualData(data, comp, id, size);
      } else if (size === "medium") {
        return textualData(data, comp, id, size);
      } else { //size large
        return textualData(data, comp, id, size);
      }
    } else {
      if (size === "small") {
        return smallButton(id);
      } else if (size === "medium") {
        return mediumButton(id);
      } else {// large button
        return largeButton(id);
      }
    }
  }

  /**
  * create small size add button that trigger graph selector
  * @param {*} id to know where is the location of the graph currently is
  * @returns small add button
  */
	 const smallButton = (id) => {
    return (
      <div>
        <Button style={{width: '1%', height: '1%'}} onClick={() => {
          dataViz.splice(id, 1);
          setDataViz([...dataViz]);
          removeButtonCookie(id);
        }}>
          <DeleteIcon style={{color: 'red'}}/>
        </Button>
        <div>
          <ButtonBase className={dashboardstyle.button_small} onClick={() => {
            setCurAddIndex(id);
            setCreateDataViz(true);
            setUpdateAllow(true);
            setCurSizeId(0); //small is index 0
          }}>
            <AddIcon className={dashboardstyle.addIcon}></AddIcon>
          </ButtonBase>
        </div>
      </div>
    );
  }

  /**
  * create medium size add button that trigger graph selector
  * @param {*} id to know where is the location of the graph currently is
  * @returns medium add button
  */
  const mediumButton = (id) => {
    return (
      <div>
        <Button style={{width: '1%', height: '1%'}} onClick={() => {
          dataViz.splice(id, 1);
          setDataViz([...dataViz]);
          removeButtonCookie(id);
        }}>
          <DeleteIcon style={{color: 'red'}}/>
        </Button>
        <div>
          <ButtonBase className={dashboardstyle.button_medium} onClick={() => {
            setCurAddIndex(id);
            setCreateDataViz(true);
            setUpdateAllow(true);
            setCurSizeId(1); //medium index is 1
          }}>
            <AddIcon className={dashboardstyle.addIcon}></AddIcon>
          </ButtonBase>
        </div>
      </div>
    );
  }

  /**
  * create large size add button that trigger graph selector
  * @param {*} id to know where is the location of the graph currently is
  * @returns large add button
  */
  const largeButton = (id) => {
    return (
      <div>
        {
        id === dataViz.length-1 ? 
          []
        :
          deleteButton(id)
        }
        <div>
          <ButtonBase className={dashboardstyle.button_large} onClick={() => {
            setCurAddIndex(id);
            setCreateDataViz(true);
            setUpdateAllow(true);
            setCurSizeId(2); //large index is 2
          }}>
            <AddIcon className={dashboardstyle.addIcon}></AddIcon>
          </ButtonBase>
        </div>
      </div>
    );
  }

  /**
   * a button that remove graph on certain location
   * @param {*} id to know where is the location of the graph currently is
   * @returns delete icon button
   */
  const deleteButton = (id) => {
    return (
      <Button style={{width: '1%', height: '1%'}} onClick={() => {
        dataViz.splice(id, 1);
        setDataViz([...dataViz]);
        removeButtonCookie(id);
      }}>
        <DeleteIcon style={{color: 'red'}}/>
      </Button>
    )
  }


	return (
    Object.keys(curData).length === 0 || data === undefined || updateAllow !== false ?
      graphByContent(data, dataId)
    :
		  graphByContent(curData, dataId)
	)
}

export default React.memo(CustomCharts)