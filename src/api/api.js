const APIROOT = 'http://localhost:5000/'

export class ApiService {
  /**
   * Get all the measurements in the database.
   * @returns {Promise<any>} promise with the result
   */
  static measurements () {
    return fetch(APIROOT + 'measurements', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
  }

  /**
   * Returns all datapoints for a certain measurement within a timerange.
   * @param measurement the desired measurement
   * @param begin optional Date object of the start of the time range
   * @param end optional Date object of the end of the time range
   * @returns {Promise<any>} promise with the result
   */
  static rangeOfDataFromMeasurement (measurement, begin = null, end = null) {
    return fetch(
      APIROOT + 'range_of_data_from_measurement?' +
      'measurement=' + measurement +
      (begin ? '&begin=' + begin.getTime() : '') +
      (begin ? '&end=' + end.getTime() : ''),
    ).then(res => res.json());
  }

  /**
   * Returns the last n datapoints for the specified measurement and field.
   * @param components the desired measurement and fields
   * @param n the desired amount of results
   * @param begin optional Date object, specifies point from which to search
   * @param end optional Data object, specifies point where to stop searching
   * @returns {Promise<Response>} a promise with the result
   */
  static lastN (
    components,
    begin,
    end,
    n = null) {
    var body = {}
    body['time_start'] = parseFloat(begin.getTime().toString()) / 1000
    body['time_end'] = parseFloat(end.getTime().toString()) / 1000
    body['n'] = parseInt(n)
    body['components'] = components.map((comps) => {
      var split = comps.split('-')
      return {
        'measurement': split[0],
        'field': split[1],
      }
    })
    return fetch(
      APIROOT + 'last_n_values', {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        method: 'POST',
      },
    ).then(res => res.json());
  }

  static getDefaultData (defaultGraphs) {
    return new Promise((resolve, reject) => {
      defaultGraphs.map((datas, datasId) => {
        if (Object.keys(datas).length < 3) {
        } else {
          ApiService.lastN(datas.components, datas.time_start, datas.time_end,
            datas.n).then((res) => {
            defaultGraphs[datasId]['data'] = res.data
          })
        }
      })
      setTimeout(() => resolve(defaultGraphs), 2000)
    })
  }

  /**
   * Gives all the fields for a given measurement.
   * @param measurement the desired measurements
   * @returns {Promise<any>} a promise with the result
   */
  static allFieldsFromMeasurement (measurement) {
    return fetch(
      APIROOT + 'all_fields_from_measurement?measurement=' + measurement).
      then(res => res.json());
  }

  /**
   * Returns all fields for all measurements.
   * @returns {Promise<any>} a promise with the result
   */
  static allMeasurementsAndTheirFields () {
    return fetch(APIROOT + 'all_measurements_and_their_fields').
      then(res => res.json());
  }

  /**
   * Runs candump can0 the Pi.
   */
  static can_dump0 () {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
    return fetch(APIROOT + 'candump?can=0', requestOptions).
      then(res => res.ok ? res.json() : 'Error')
  }

  /**
   * Runs candump can1 on the Pi.
   */
  static can_dump1 () {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
    return fetch(APIROOT + 'candump?can=1', requestOptions).
      then(res => res.ok ? res.json() : 'Error')
  }

  /**
   * Runs cansend can0 123#deadbeef the Pi.
   */
  static can_send0 (command) {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
    return fetch(APIROOT + 'cansend?can=0&string=' + command, requestOptions).
      then(res => res.json()).catch(() => 'Error');
  }

  /**
   * Runs cansend can1 123#deadbeef on the Pi.
   */
  static can_send1 (command) {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
    return fetch(APIROOT + 'cansend?can=1&string=' + command, requestOptions).
      then(res => res.json()).catch(() => 'Error');
  }

  /**
   * Runs ls /sys/bus/spi/devices/spi0.0/net on the Pi.
   */
  static ls_0 () {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
    return fetch(APIROOT + 'ls?spi=0', requestOptions).
      then(res => res.json()).catch(() => 'Error');
  }

  /**
   * Runs ls /sys/bus/spi/devices/spi0.1/net on the Pi.
   */
  static ls_1 () {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
    return fetch(APIROOT + 'ls?spi=1', requestOptions).
      then(res => res.json()).catch(() => 'Error');
  }

  /**
   * Pings the Pi.
   */
  static ping (ip) {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
    return fetch(APIROOT + 'pingip?ip=' + ip, requestOptions).
      then(() => 'Ping successful').catch(() => 'Ping failed');
  }

  /**
   * Runs ifconfig on the Pi.
   */
  static ifconfig () {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
    return fetch(APIROOT + 'ifconfig', requestOptions).
      then(res => res.json()).catch(() => 'Error');
  }

  /**
   * Runs when a network issue arises. It checks to see if there is an issue,
   * with the connection of the client the ceiling Pi or the brain Pi.
   */
  static testConnection () {
    if (window.navigator.onLine) {
      return fetch(APIROOT + 'ping_ceil').then(res1 => {
        if (res1.ok) {
          return fetch(APIROOT + 'pingip?ip=google.com').then(res2 => {
            return res2.ok ? 'All systems online' : 'Brain Pi is offline'
          }).catch(() => 'Brain Pi is offline')
        } else {
          return 'Ceiling Pi is offline';
        }
      }).catch(() => 'Ceiling Pi is offline')
    } else {
      return 'Client is offline';
    }
  }
}