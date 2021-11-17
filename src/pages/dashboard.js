import { 
  React, 
  useEffect, 
  useState } from 'react';
import dashboardstyle from '../styles/Dashboardstyles.module.scss';
import CustomCharts from '../components/customCharts';
import DashboardModal from '../components/dashboardModal';
import { Grid } from '@material-ui/core';
import { 
  CircularProgress,
} from '@material-ui/core';
import {
  NewCookie,
  cookieExists,
  getLayoutFromCookie
} from '../cookies/cookie'
import {ApiService} from "../api/api";

/**
 * update the position of whole graph
 * @param {*} jsonObj data for certain tile
 * @param {*} id current location of the graph
 * @param {*} dataViz all of the graph
 * @param {*} setDataViz function to set current updated data
 * @returns 
 */
function updateGraph (jsonObj, id, dataViz, setDataViz) {
  return new Promise((resolve, reject) => {
    var curSize = dataViz.length;
    dataViz[id] = jsonObj;
    if (id === curSize-1) {//if adding last element in array
      dataViz[curSize] = {"size": "large", "frequency": 0};
    }
    resolve(setDataViz([...dataViz]));
  })
}
export default function Dashboard() {

  const [createDataViz, setCreateDataViz] = useState(false);

  //graph
  const [dataViz, setDataViz] = useState([]);
  const [curAddIndex, setCurAddIndex] = useState(-1); //will changed based on current add button pressed
  const [curSizeId, setCurSizeId] = useState(0); //current id of the button pressed

  let defaultGraphs = [
    {"size": "medium", "components": ["bms-aux_current"], "type": "line chart", "time_start": new Date(2021, 1, 1), "time_end": new Date(2021, 10, 1), "n":2000,"frequency": 0},
    {"size": "small", "components": ["bms-battery_high"], "type": "bar chart", "time_start": new Date(2021, 1, 1), "time_end": new Date(2021, 10, 1), "n":2000, "frequency": 0},
    {"size": "small", "components": ["bms-battery_high"], "type": "bar chart", "time_start": new Date(2021, 1, 1), "time_end": new Date(2021, 10, 1), "n":2000, "frequency": 0},
    {"size": "large", "components": ["bms-aux_current","bms-battery_high"], "type": "bar chart", "time_start": new Date('June 12, 2021 20:17:40 GMT+00:00'), "time_end": new Date('July 2, 2021 20:17:40 GMT+00:00'), "n": 100, "frequency": 0},
    {"size": "large", "components": ["bms-aux_current","bms-battery_high", "bms-battery_average", "bms-aux_voltage", "bms-bms_average"], "type": "bar chart", "time_start": new Date('June 12, 2021 20:17:40 GMT+00:00'), "time_end": new Date('July 2, 2021 20:17:40 GMT+00:00'), "n": 15, "frequency": 0},
    {"size": "large", "components": ["motor-tacho"], "type": "textual data", "time_start": new Date(2021, 1, 1), "time_end": new Date(2021, 10, 1), "frequency": 0},
    {"size": "large", "frequency": 0}
  ];

  useEffect(async () => {

   // api call to get available components
   // api call to get default data

    if (!cookieExists()){
      ApiService.getDefaultData(defaultGraphs).then((val) => {
          setDataViz([...val]);
        });
      NewCookie(defaultGraphs);
    } else {
      let layout = getLayoutFromCookie();
      ApiService.getDefaultData(layout).then((val) => {
          setDataViz([...val]);
        });
    }
  },[])

  /**
   * choosing graph when generate button is click
   * @param {*} chosenSize size of the generated graph
   * @param {*} chosenComp name of component(s)
   * @param {*} chosenType type of the graph
   * @param {*} start start of the datetime
   * @param {*} end end of datetime
   * @param {*} dataPoints total of datapoints
   * 
   */
  const chooseCreateGraph = async (chosenSize, chosenComp, chosenType, start, end, dataPoints, frequency, resetModal) => {
    var data = {};
    //api call to get data based on query maybe observa w/o observables
    await ApiService.lastN(chosenComp, start, end, dataPoints).then((res) => {
      data = res.data;
    })
    if (data === undefined) {
      alert("data is undefined/time is included as a component");
    } else {
      if (chosenSize === "medium" && curSizeId === 2) {//choosing medium size but it was large graph
        await addCharts({"size": chosenSize, "components": chosenComp, "type": chosenType, "time_start": start, "time_end": end, "n": dataPoints, "data": data, "frequency": frequency}, curAddIndex)
        insertCharts({"size": chosenSize, "frequency": 0}, curAddIndex+1) //splice
        resetModal();
        NewCookie(dataViz);
      } else if (chosenSize === "small" && curSizeId === 1) {//choosing small size but it was medium graph
        await addCharts({"size": chosenSize, "components": chosenComp, "type": chosenType, "time_start": start, "time_end": end, "n": dataPoints, "data": data, "frequency": frequency}, curAddIndex)
        insertCharts({"size": chosenSize, "frequency": 0}, curAddIndex+1)
        resetModal();
        NewCookie(dataViz);
      } else if (chosenSize === "small" && curSizeId === 2) {//choosing small size but it was large graph
        await addCharts({"size": chosenSize, "components": chosenComp, "type": chosenType, "time_start": start, "time_end": end, "n": dataPoints, "data": data, "frequency": frequency}, curAddIndex)
        insertCharts({"size": chosenSize, "frequency": 0}, curAddIndex+1)//small button
        insertCharts({"size": "medium", "frequency": 0}, curAddIndex+2)//medium button
        resetModal();
        NewCookie(dataViz);
      } else {
        await addCharts({"size": chosenSize, "components": chosenComp, "type": chosenType, "time_start": start, "time_end": end, "n": dataPoints, "data": data, "frequency": frequency}, curAddIndex)
        resetModal();
        NewCookie(dataViz);
      }
    }

  }
  /** 
  * Adding charts on the given location of the chart
  * @param {*} jsonObj object containing the data
  * @param {*} id index of the chart
  */
  const addCharts = async (jsonObj, id) => {
    updateGraph(jsonObj, id, dataViz, setDataViz).then((res) => {
      setCreateDataViz(false);
    })
  }

  /**
   * insert charts on between the charts
   * @param {*} jsonObj object containing the data
   * @param {*} id index of the chart
   */
  const insertCharts = (jsonObj, id) => {
    dataViz.splice(id, 0, jsonObj)
    setDataViz([...dataViz]); 
  }

  return (
    dataViz.length === 0 ?
    <div className={dashboardstyle.graphContainer}>
      <CircularProgress style={{margin: 'auto'}}/>
    </div>
    :
    <div className={dashboardstyle.graphContainer}>
      <DashboardModal 
        chooseCreateGraph={chooseCreateGraph} 
        createDataViz={createDataViz} 
        setCreateDataViz={setCreateDataViz} 
        curSizeId={curSizeId}/>
      <Grid container spacing={0.1}>
        {dataViz.map((data,dataIdx) => { //while loop based on the current
          return <CustomCharts 
            key={dataIdx} 
            data={data} 
            dataId={dataIdx} 
            dataViz={dataViz} 
            setDataViz={setDataViz} 
            setCurSizeId={setCurSizeId} 
            setCreateDataViz={setCreateDataViz} 
            setCurAddIndex={setCurAddIndex} />
        })}
      </Grid>
    </div>
  );
}
