import React, { Component } from 'react';
import ApiService from "../service/ApiService";
import home from './home.png';
import plus from './plus.png';

class AddModel extends Component {
    constructor(props){
        super(props);
        this.state = {
            id: null,
            model_name: '',
            model_description: '',
            json_model: null,
            json_model_id: 0,
            json_name: '',
            json_description: '',
            model_weights_path: '',
            training_graphics_path: '',
            no_disease_precision: '',
            val_no_disease_precision: '',
            accuracy: '',
            val_accuracy: '',
            metadata: null,
            classId:0,
            classElem: '',
            classes: [],

            image: null,
            models: [],
            model_to_show: ''
        }
        this.saveModel = this.saveModel.bind(this);
        this.reloadModelList = this.reloadModelList.bind(this);
    }

componentDidMount() {
    this.reloadModelList();
}

reloadModelList() {
    // ApiService.fetchModels()
    //     .then((res) => {
    //         this.setState({models: res.data})
    //     });
    ApiService.getAddModel()
        .then((res) => {
            this.setState({models: res.data})
        });
}

    saveModel = (e) => {
        
        e.preventDefault();
        let model = {
            model_name: this.state.model_name,
            model_description: this.state.model_description,
            model_weights_path: this.state.model_weights_path,
            training_graphics_path: this.state.training_graphics_path,
            no_disease_precision: this.state.no_disease_precision,
            val_no_disease_precision: this.state.val_no_disease_precision,
            accuracy: this.state.accuracy,
            val_accuracy: this.val_accuracy,
            completeness: this.state.completeness,
            json_model_id: this.state.json_model_id,
            json_model: this.state.json_model,
            json_name: this.state.json_name,
            json_description: this.state.json_description,
            metadata: this.state.metadata,
            classes: this.state.classes
        };
        const formData = new FormData();
        formData.append('model_name', "model.model_name");
        formData.append('model_description', this.state.model_description);
        formData.append('training_graphics_path', this.state.training_graphics_path);
        formData.append('val_no_disease_precision', this.state.val_no_disease_precision);
        formData.append('accuracy', this.state.accuracy);
        formData.append('val_accuracy', this.state.val_accuracy);
        formData.append('completeness', this.state.completeness);
        formData.append('json_model_id', model.json_model_id);
        formData.append('json_model', this.state.json_model);
        formData.append('json_name', this.state.json_name);
        formData.append('json_description', this.state.json_description);
        formData.append('model_weights_path', this.state.model_weights_path);
        formData.append('classes', this.state.classes);
        formData.append('metadata', this.state.metadata);
        console.log("Before req");
        ApiService.addModel(formData)
            .then(res => {
                window.location = '/';
            });
    }

    uploadWeightFile = (e) =>
        this.setState({model_weights_path:e.target.files[0]});

    uploadJsonFile = (e) =>
        this.setState({json_model:e.target.files[0]});

    uploadMetadataFile = (e) =>
        this.setState({metadata:e.target.files[0]});

    uploadClassesFile = (e) =>
        this.setState({classes:e.target.files[0]});

    onChange = (e) =>{
        this.setState({ [e.target.name]: e.target.value });
    }
    onChange1 = (e) =>{
        this.setState({ [e.target.name]: e.target.value });
        this.state.models.forEach(el => {

            // alert(this.state.model_to_show);
            if(el.model_name == e.target.value)
            {
                let json_obj = this.state.models.filter(o => o.model_name == e.target.value)[0];
                this.state.json_name = json_obj.model_name;
                this.state.json_description = json_obj.model_description;
                this.state.json_model_id = json_obj.id;
            }
        });
    }

    addClass = (e) =>{
        this.state.classes[parseInt(e.target.id)] = e.target.value ;
        console.log(this.state.classes);
}

    addClassInput = () =>
    {
        console.log("hello here");
        this.state.classId ++;
        console.log("classId: " + this.state.classId);
        var wrapper = document.getElementById('wrapper');
        this.state.classes[this.state.classId] = '';
        const inpu = document.createElement("input");
        inpu.setAttribute('id', this.state.classId)
        inpu.setAttribute('type', "text");
        inpu.setAttribute('value', this.state.classes[this.state.classId]);
        inpu.setAttribute('name', "classElem");
        inpu.onchange = (e) => {
            this.addClass(e);
        };

        const label = document.createElement("label");
        label.onclick = () => {
            this.addClassInput();
          };
        const img = document.createElement("img");
        img.setAttribute('src',plus);
        label.appendChild(img);

        const mydiv = document.createElement("div");

        mydiv.appendChild(inpu)
        mydiv.appendChild(label)
        //wrapper.appendChild(mydiv)
        wrapper.append(mydiv)

        console.log(document.getElementById('wrapper').innerHTML); 
    }

    render() {
        const items = [];

        this.state.models.filter(o => {items.push(<option id={o.id} value={o.model_name}/>)});

        return(
            <div>
                <div className='header_home'>
                    <div><h2 className="text_header">Add Model</h2></div>
                    <div><a href='/' className="btn_home"> <img alt="Home" src={home} ></img></a></div>
                </div>
                <div className='model_form'>
                <form>
                <div className="form-group">
                    <label>Model name:</label>
                    <input type="text" name="model_name" className="form-control" value={this.state.model_name} onChange={this.onChange}/>
                </div>

                <div className="form-group">
                    <label>Model description:</label>
                    <textarea name="model_description" cols="20" rows="5" value={this.state.model_description} onChange={this.onChange}></textarea>
                </div>

                <div className='jsons'>
                    <div className="form-group">
                        <label>Choose existing model:</label><br/>
                        <input type="text" name="model_to_show" list="productName" className="form-control" value={this.state.model_to_show} onChange={this.onChange1}/>
                        
                        <datalist id="productName">
                            {items}
                        </datalist>
                        
                    </div>
                    <div>
                        <label>Model JSON</label>	
                        <input className="file_input" type="file" name="json_model" onChange={this.uploadJsonFile}/>
                    </div>

                    <div>
                        <label>JSON name</label>	
                        <input className="file_input" type="text" name="json_name" value={this.state.json_name} onChange={this.onChange}/>
                    </div>

                    <input hidden="True" type="text" name="json_model_id" value={this.state.json_model_id} onChange={this.onChange}/>
                    <div>
                        <label>JSON decription</label>
                        <textarea name="json_description" cols="20" rows="5" value={this.state.json_description} onChange={this.onChange}></textarea>
                    </div>
                </div>

                <div>
                    <label>Weight File</label>	
                    <input className="file_input" type="file" name="model_weights_path" onChange={this.uploadWeightFile}/>
                </div> 

                <div className="form-group">
                    <label>Training graphics path:</label>
                    <input type="text" name="training_graphics_path" className="form-control" value={this.state.training_graphics_path} onChange={this.onChange}/>
                </div>

                <div className="form-group">
                    <label>No disease precision:</label>
                    <input type="text" name="no_disease_precision" className="form-control" value={this.state.no_disease_precision} onChange={this.onChange}/>
                </div>

                <div className="form-group">
                    <label>Val no disease precision:</label>
                    <input type="text" name="val_no_disease_precision" className="form-control" value={this.state.val_no_disease_precision} onChange={this.onChange}/>
                </div>

                <div className="form-group">
                    <label>Accuracy:</label>
                    <input type="text" name="accuracy" className="form-control" value={this.state.accuracy} onChange={this.onChange}/>
                </div>

                <div className="form-group">
                    <label>Val_accuracy:</label>
                    <input type="text" name="val_accuracy" className="form-control" value={this.state.val_accuracy} onChange={this.onChange}/>
                </div>

                <div>
                    <label>Metadata File</label>	
                    <input className="file_input" type="file" name="metadata" onChange={this.uploadMetadataFile}/>
                </div>   

                <div id="wrapper">
                <label>Classes: </label>
                <div>
                <input id="0" type="text" name="classElem" className="form-control" value={this.state.classes[0]} onChange={this.addClass}/>
                    <label id="lbl_plus" onClick={this.addClassInput}><img alt="Add" src={plus} ></img></label>	
                </div>  
                </div>   

                <button className="btn btn-success" onClick={this.saveModel}>Save</button>
            </form>
                </div>
    </div>
        );
    }
}

export default AddModel;