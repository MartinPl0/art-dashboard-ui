require('dotenv').config()

export async function get_daily_overview_data() {

    const response = await fetch(process.env.REACT_APP_DAILY_REPORT_OVERVIEW_ENDPOINT, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json"
        }
    });

    return await response.json();
}

export async function get_expanded_data_for_a_date(date){
    let endpoint = process.env.REACT_APP_DAILY_REPORT_BY_DATE_ENDPOINT;
    endpoint = endpoint+date;

    const response = await fetch(endpoint, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json"
        }
    });
    return await response.json();
}

export async function get_expanded_data_for_a_date_and_fault_code(date){
    let endpoint = process.env.REACT_APP_DAILY_REPORT_BY_FAULT_CODE_BY_DATEWISE;
    endpoint = endpoint+date;

    const response = await fetch(endpoint, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json"
        }
    });
    return await response.json();
}

export async function get_daily_build_data_for_a_date(date){
    let endpoint = process.env.REACT_APP_DAILY_BUILD_DATA_FOR_A_DATE;
    endpoint = endpoint+date;

    const response = await fetch(endpoint, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json"
        }
    });
    return await response.json();
}