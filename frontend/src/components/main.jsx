import React, { Component } from 'react';
import ApiService from "../service/ApiService";
import plus from './plus.png';
import { Link } from 'react-router-dom';

class Models extends Component {
    constructor(props){
        super(props);
        this.state = {
            id: null,
            models: []
        }
        this.reloadModelList = this.reloadModelList.bind(this);
    }

    componentDidMount() {
        this.reloadModelList();
    }

    reloadModelList() {
        ApiService.fetchModels()
            .then((res) => {
                this.setState({models: res.data})
            });
    }

    renderAllData(model) {
            let id = model.id, 
            model_link = model.model_link,
            model_name = model.model_name,
            model_description = model.model_description,
            json_model = model.json_model,
            model_weights_path = model.model_weights_path,
            training_graphics_path = model.training_graphics_path,
            no_disease_precision = model.no_disease_precision,
            val_no_disease_precision = model.val_no_disease_precision,
            accuracy = model.accuracy,
            val_accuracy = model.val_accuracy,
            completeness = model.completeness,
            classes = model.classes

            console.log(json_model);
        return (
            <tr>
                <td>
                    <a href={"/model/" + id}>{ model_name }</a>
                </td>
                <td><a href={json_model.link}>{ json_model.model_name}</a></td>
                <td><a href={ model_weights_path }>Download</a></td>
                <td><a href={ training_graphics_path }>Download</a></td>
                <td>{ no_disease_precision }</td>
                <td>{ val_no_disease_precision }</td>
                <td>{ accuracy }</td>
                <td>{ val_accuracy }</td>
                <td>{ completeness }</td>
                <td>
                    <Link to={`/predict/${id}`} >Predict</Link>
                </td>
            </tr>
        );
    }

    renderModels() {
        let res = [];
        if (this.state.models!=null) {
            for (let i of this.state.models) {
                res.push(this.renderAllData(i));
            }
        }
        return res;
    }
    render() {
        return (
            <div>
                <div className='header_home'>
                    <div><h2 className="text_header">Training models</h2></div>
                    <div><a href='/create' className="btn_home"> <img alt="Add Model" src={plus} ></img></a></div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Model name</th>
                            <th>Model JSON</th>
                            <th>Model weights path</th>
                            <th>Training graphics path</th>
                            <th>No disease precision</th>
                            <th>Val no disease precision</th>
                            <th>Accuracy</th>
                            <th>Val acurracy</th>
                            <th>Completeness</th>
                            <th>Predict</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderModels()}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Models;

