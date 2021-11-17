import { React } from 'react'
import ReactDOM from 'react-dom'
import dashboard from './pages/dashboard'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'
import Navbar from './components/navbar'
import { Grid } from '@material-ui/core'
import Commands from './pages/commands'
import Livemap from './pages/livemap'

ReactDOM.render(
  <Router>
    <Grid container spacing={1}>
      <Grid item xs={1}>
        <Navbar/>
      </Grid>
      <Grid item xs={11}>
        <Switch>
          <Route path="/" exact component={null} />
          <Route path="/dashboard" component={dashboard} />
          <Route path="/commands" component={Commands} />
          <Route path="/map" component={Livemap} />
        </Switch>
      </Grid>
    </Grid>
  </Router>,
  document.getElementById('root'),
)