import { useHistory } from 'react-router-dom';
import { React, useState } from 'react';
import mainstyle from '../styles/Mainstyles.module.scss';
import { 
  Button,
  Typography
} from '@material-ui/core';


//Generate bnavbar button 
export const SideButton = ({name, isSelected, onSelect}) => {

  return (
    <Button className={mainstyle.buttonNormal + (isSelected ? ' ' + mainstyle.selectedButton : ' ')} onClick={onSelect}>
      <Typography className={mainstyle.buttonText}>{name}</Typography>
    </Button>
  );
}
    

export default function Navbar ({selected}) {
  const directory = ["Main", "Commands", "Map"];
  const pages = ["dashboard", "commands", "map"];
  const [select, setSelect] = useState(selected);
  let history = useHistory();

  const getIndex = (nav, arr) => {
    return arr.indexOf(nav);
  }

  return(
    <div>
      {
        directory.map((title, titleIdx) => (
          <SideButton
            name={title}
            isSelected={titleIdx === select}
            onSelect={() =>{
              setSelect(getIndex(title, directory));    
              history.push('/' + pages[getIndex(title, directory)]);
            }}
          />        
        ))
      }
    </div>
  );
}