import commandsstyles from '../styles/commandsstyles.module.scss'
import { React, useState } from 'react'
import { Button, Typography } from '@material-ui/core'
import mainstyle from '../styles/Mainstyles.module.scss'
import { ApiService as api } from '../api/api'

export default function Commands () {
  const [result, setResult] = useState('Nothing yet.');
  const [ip, changeIp] = useState('google.com');
  const [command, changeCommand] = useState('echo test');

  function updateIp(event) {
    changeIp(event.target.value);
  }

  function updateCommand(event) {
    changeCommand(event.target.value);
  }

  return (
    <div className={commandsstyles.root}>
      <div>
        <div className={commandsstyles.group}>
          CAN
          <div>
            <Button className={mainstyle.buttonNormal} onClick={
              () =>
                api.can_dump0().then(res => setResult(JSON.stringify(res, null, 2)))
            }>
              <Typography className={mainstyle.buttonText}>candump can0</Typography>
            </Button>
            <Button className={mainstyle.buttonNormal} onClick={
              () =>
                api.can_dump1().then(res => setResult(JSON.stringify(res, null, 2)))
            }>
              <Typography className={mainstyle.buttonText}>candump can1</Typography>
            </Button>
            <div>
              Command for cansend:
              <input value={command} onChange={updateCommand}/>
            </div>
            <Button className={mainstyle.buttonNormal} onClick={
              () =>
                api.can_send0(command).then(res => setResult(JSON.stringify(res, null, 2)))
            }>
              <Typography className={mainstyle.buttonText}>cansend can0 123#deadbeef</Typography>
            </Button>
            <Button className={mainstyle.buttonNormal} onClick={
              () =>
                api.can_send1(command).then(res => setResult(JSON.stringify(res, null, 2)))
            }>
              <Typography className={mainstyle.buttonText}>cansend can1 123#deadbeef</Typography>
            </Button>
            <Button className={mainstyle.buttonNormal} onClick={
              () =>
                api.ls_0().then(res => setResult(JSON.stringify(res, null, 2)))
            }>
              <Typography className={mainstyle.buttonText}>ls /sys/bus/spi/devices/spi0.0/net</Typography>
            </Button>
            <Button className={mainstyle.buttonNormal} onClick={
              () =>
                api.ls_1().then(res => setResult(JSON.stringify(res, null, 2)))
            }>
              <Typography className={mainstyle.buttonText}>ls /sys/bus/spi/devices/spi0.1/net</Typography>
            </Button>
          </div>
        </div>
        <div className={commandsstyles.group}>
          Ethernet - address to ping:
          <input value={ip} onChange={updateIp}/>
          <div>
            <Button className={mainstyle.buttonNormal} onClick={
              () =>
                api.ping(ip).then(res => setResult(JSON.stringify(res, null, 2)))
            }>
              <Typography className={mainstyle.buttonText}>Ping</Typography>
            </Button>
          </div>
        </div>
        <div className={commandsstyles.group}>
          Network
          <div>
            <Button className={mainstyle.buttonNormal} onClick={
              () =>
                api.ifconfig().then(
                  res => setResult(JSON.stringify(res, null, 2))
                )
            }>
              <Typography className={mainstyle.buttonText}>ifconfig</Typography>
            </Button>
          </div>
        </div>
        <div className={commandsstyles.group}>
          Check system status
          <div>
            <Button className={mainstyle.buttonNormal} onClick={
              () =>
                  api.testConnection().then(
                      res => setResult(JSON.stringify(res, null, 2))
                  )
            }>
              <Typography className={mainstyle.buttonText}>networktest</Typography>
            </Button>
          </div>
        </div>
      </div>
      <div className={commandsstyles.result}>
        Result
        <div className={commandsstyles.resultbox}>
          <pre id="json">{result}</pre>
        </div>
      </div>
    </div>
  );
}