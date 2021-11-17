import React from 'react';
import { 
  Button,
  ButtonBase,
  Typography } from '@material-ui/core';
import {
  CropSquare as CropSquareIcon,
  BarChart as BarChartIcon,
  ShowChart as ShowChartIcon,
  FormatColorText as FormatColorTextIcon } from '@material-ui/icons';
import Multiselect from 'multiselect-react-dropdown';
import mainstyle from '../styles/Mainstyles.module.scss';
import dashboardstyle from '../styles/Dashboardstyles.module.scss';

/*
Choosing either single or multiple graph
@param name single or multiple graph
@param isSelected true or false to check if the name is seleted
@param onSelect calling onSelect in dashboard.js when clicked
*/
export const sideButton = ({name, isSelected, onSelect}) => {
  return (
    <ButtonBase className={dashboardstyle.choices_button + (isSelected ? ' ' + mainstyle.selectedButton : ' ')} onClick={onSelect}>
      <Typography>
        {name}
      </Typography>
    </ButtonBase>
  );
}

export const SideButton = React.memo(sideButton);

export const componentButton = ({componentName, compValues, setCompValues, graphChoice}) => {
  let curComponent = [];


  //it will set compvalues to the list instead of the item
  const add_comp_values = (list, item) => {
    var comp = item.key
    curComponent.push(comp);
    setCompValues([...compValues, comp])
  }

  const remove_comp_values = (list, item) => {
    var comp = item.key;
    compValues = compValues.filter(item => item !== comp);
    setCompValues(compValues);
  }

  return (
    <div>
      <Multiselect
        displayValue="key"
        groupBy="measurement"
        onRemove={remove_comp_values}
        onSelect={add_comp_values}
        singleSelect={graphChoice === 0 ? true : false}
        closeOnSelect={false} 
        options={componentName}
        showCheckbox
      />
    </div>

  );
}

export const ComponentButton = React.memo(componentButton);


export const sizeButton = ({sizeName, isSelected, onSelect}) => {

  const buttonSize = (chartSize) => {
    if (chartSize === "small") {
      return (
        <CropSquareIcon className={dashboardstyle.smallSizeIcon}></CropSquareIcon>
      );
    } else if (chartSize === "medium") {
      return (
        <CropSquareIcon className={dashboardstyle.mediumSizeIcon}></CropSquareIcon>
      );
    } else if (chartSize === "large") {
      return (
        <CropSquareIcon className={dashboardstyle.largeSizeIcon}></CropSquareIcon>
      );
    } else {
      return [];
    }
  }

  return (
    <Button className={(isSelected ? ' ' + mainstyle.selectedButton : ' ')} onClick={onSelect}>
      {buttonSize(sizeName)}
      <Typography>
        {sizeName}
      </Typography>
    </Button>
  );
}

export const SizeButton = React.memo(sizeButton);

export const typeButton = ({typeName, isSelected, onSelect, graphChoice}) => {
  
  const iconGenerate = (charts) => {
    if (charts === "bar chart") {
      return (
        <BarChartIcon className={dashboardstyle.chartType}></BarChartIcon>
      );
    } else if (charts === "textual data") {
      return (
        <FormatColorTextIcon className={dashboardstyle.chartType}></FormatColorTextIcon>
      );
    } else if (charts === "line chart") {
      return (
        <ShowChartIcon className={dashboardstyle.chartType}></ShowChartIcon>
      )  
    }else {
      return [];
    }
  }

  return (
    graphChoice === 1 && typeName === "textual data" ? 
    [] //multiple graph can't generate textual data
    :
    <Button className={(isSelected ? ' ' + mainstyle.selectedButton : ' ')} onClick={onSelect}>
      {iconGenerate(typeName)}
      {typeName}
    </Button>
  );
}

export const TypeButton = React.memo(typeButton);


export const timeButton = ({timeName, isSelected, onSelect}) => {
  
  return (
    <Button className={(isSelected ? ' ' + mainstyle.selectedButton : ' ')} onClick={onSelect}>
      <Typography>
        {timeName}
      </Typography>
    </Button>
  );
}

export const TimeButton = React.memo(timeButton);
