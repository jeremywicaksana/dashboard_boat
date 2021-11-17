import Cookies from 'universal-cookie';


const cookies = new Cookies();

/**
 * This function generates a new cookie.
 * @param basic the basic layout of the dashboard, generated on first visit
 */
export function NewCookie(basic) {

    let layout = {};
    let i = 0;

    for (const x of basic) {
        let lay = getLayoutFromMap(x);

        layout[i] = lay;
        i++;
    }

    let jsonLayout = JSON.stringify(layout);
    jsonLayout = JSON.parse(jsonLayout);
    cookies.set("user", jsonLayout);
}

/**
 * Removes a graph from the cookie that was removed from the dashboard
 * @param id the id of the chart that is being removed
 */
export function removeChartCookie(id){
    let layout = getCookie();
    let size = layout[id]['size'];
    layout[id] = {'size':size, 'frequency':0};
    cookies.set("user", layout);
}

/**
 * Removes a add button from the cookie that was removed from the dashboard
 * @param id the id of the chart that is being removed
 */
export function removeButtonCookie(id){
    let newGraph = [];
    let layout = getCookie();

    delete layout[id.toString()];
    for (var graph in layout) {
        newGraph.push(layout[graph])
    }

    NewCookie(newGraph)
}
// This function returns the layout stored in the cookie
/**
 *
 * @returns {any}, the cookie value
 */
function getCookie() {
    return JSON.parse(JSON.stringify(cookies.get("user")));
}

// This function returns the layout stored in the cookie as an array of maps, as required by the dashboard
/**
 *
 * @returns {*[]}, the layout in the correct format, retrieved from the cookie value
 */
export function getLayoutFromCookie() {
    let cookie = getCookie();
    let i = 0;
    let layout = [];
    while (cookie[i] !== undefined){
        if (cookie[i]['time_start'] !== undefined) {
            cookie[i]['time_start'] = new Date(cookie[i]['time_start']);
            cookie[i]['time_end'] = new Date(cookie[i]['time_end']);
        }
        layout[i] = cookie[i];
        i++;
    }
    return layout
}

// helper function that removes the 'data' key from the map
/**
 *
 * @param map representing one graph
 * @returns {{}}, the resulting graph with the data removed, as it does not need to be stored.
 */
function getLayoutFromMap(map) {
    let entry = Object.entries(map);
    let lay = {};
    
    for (let e of entry){
        if (e[0] !== "data") {
            lay[e[0]] = e[1];
        }
    }

    return lay;
}

// checks if a cookie has been made yet
/**
 *
 * @returns {boolean}
 */
export function cookieExists() {
    return cookies.get("user") != null
}