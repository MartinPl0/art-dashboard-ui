import React, {Component} from "react";
import Attribute_transfer_filter_fields_modal from "./attribute_transfer_filter_fields_modal";
import Search_filters_popover from "./search_filters_popover";
import {Link, Redirect} from "react-router-dom";
import {get_builds} from "../../api_calls/build_calls";
import Build_history_table from "./build_history_table";
import {Button, message, Row} from "antd";
import {CSVDownload, CSVLink} from "react-csv";
import {DownloadOutlined, FilterTwoTone, IssuesCloseOutlined} from "@ant-design/icons";


export default class Build_history_home extends Component{

    constructor(props) {
        super(props);
        this.state = {
            query_params: this.props.location.search,
            data: [],
            export_csv_data: [],
            filter_attribute_selection_modal_visible: false,
            query_redirect_string: undefined,
            no_data: false
        }

        this.load_updated_data(this.state.query_params);

        if (this.state.query_params !== undefined && this.state.query_params !== ""){
            this.setState({build_filter_where_cond: JSON.parse(decodeURIComponent(this.state.query_params))});
        }
        else{
            this.setState({build_filter_where_cond: JSON.parse("{}")});
        }

        this.filter_button_toggle_modal_visibility = this.filter_button_toggle_modal_visibility.bind(this);
        this.redirect_to_updated_query_params = this.redirect_to_updated_query_params.bind(this);

    }

    filter_button_toggle_modal_visibility(){
        if(this.state.filter_attribute_selection_modal_visible){
            this.setState({"filter_attribute_selection_modal_visible": false})
        }else{
            this.setState({"filter_attribute_selection_modal_visible": true})
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({query_redirect_string: undefined})
        this.load_updated_data(nextProps.location.search);
    }


    load_updated_data(query_params){

        if (query_params.length !== 0 && query_params[0] === '?'){
            query_params = query_params.slice(1);
        }

        if(query_params !== "" && query_params !== null)
            this.setState({build_filter_where_cond: JSON.parse(decodeURIComponent(query_params))})

        query_params = decodeURIComponent(query_params);

        get_builds(query_params).then((data) => {

            this.setState({data_loaded: true});

           this.setState({data: data["data"]}, ()=>{
               this.generate_data_for_csv_export(this.state.data);
               this.destroy_loading();
           });
        });

    }

    display_loading(){
        message.loading({content: "Loading Data", duration:0, style: {position: "fixed", left: "50%", top: "20%"}});
    }

    destroy_loading(){

        message.destroy()
        message.success({content: "Loaded", duration: 2, style: {position: "fixed", left: "50%", top: "20%", color: "#316DC1"}})

    }

    generate_data_for_csv_export(data){
        let return_data = []

        for(const key in data){
            if(data.hasOwnProperty(key)){
                let result_row = []
                result_row.push(data[key]["build_id"])
                result_row.push(data[key]["fault_code"])
                return_data.push(result_row)
            }
        }

        this.setState({export_csv_data: return_data})

    }

    redirect_to_updated_query_params(where_cond, for_search_filter=false, search_clicked=false){

        let queryString = encodeURIComponent(JSON.stringify(where_cond));
        this.display_loading();
        this.setState({query_redirect_string: queryString})
    }

    render() {

        if(this.state.query_redirect_string !== undefined){
            return <Redirect to={"/build/history/?" + this.state.query_redirect_string}/>;
        }

        else{

            return (
                <div style={{padding: "30px"}}>
                    {!this.state.data_loaded && this.display_loading()}
                    <Attribute_transfer_filter_fields_modal
                        visible={this.state.filter_attribute_selection_modal_visible}
                        handler={this.filter_button_toggle_modal_visibility}
                        handler_to_update_build_table_data={this.redirect_to_updated_query_params}/>
                        <Button/>

                    <Row className={"right"}>
                        <Search_filters_popover handleFilterBuildParamsButton={this.filter_button_toggle_modal_visibility} data={this.state.build_filter_where_cond}/>
                        <Button/>
                    </Row>

                    <Build_history_table data={this.state.data} simple_filter_callback={this.redirect_to_updated_query_params}/>

                    <Row className={"right"} >
                        <CSVLink data={this.state.data} filename={(Date.now()).toString()+ ".csv"} target="_blank">
                            <Button
                                size={"large"}
                                type="primary"
                                shape="circle"
                                style={{
                                    position: "fixed",
                                    right: "50px",
                                    bottom: "50px",
                                    boxShadow: "0 6px 14px 0 #666",
                                }}
                                icon={<DownloadOutlined/>}>
                            </Button>
                            <Button/>
                        </CSVLink>
                    </Row>

                </div>
            );

        }


    }

}