import React, { Component } from 'react';
import ApiService from "../service/ApiService";
import {Route, Link, Routes, useParams} from 'react-router-dom';
import plus from './home.png';

function Users() {
    // 👇️ get ID from url
    const params = useParams();
  
    console.log(params); // 👉️ {userId: '4200'}
  
    return params.id;
  }

class PredictionPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            id: null,
            predict_img: null,
            dspl_img: null,
            dragActive: false,
            predictions:[],
            showRes: false,
            pdf:''
        }
        //this.reloadModelList = this.reloadModelList.bind(this);
        this.uploadImg = this.uploadImg.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleDrag = this.handleDrag.bind(this)
        this.handleDrop = this.handleDrop.bind(this)
    }

    uploadImg = (e) =>
    {
        let img = e.target.files[0];
        this.setState({predict_img:img});
        this.setState({dspl_img:URL.createObjectURL(img)});
    }
        

    predict(){
        let id = window.location.href.split('/')[4];
        console.log(id);
        let predictDetails = {
            predict_img: this.state.predict_img
        };
        const predictData = new FormData()
        predictData.append('predict_img', this.state.predict_img);
        predictData.append('id', id);
        alert("Started prediction");
        ApiService.predict(predictData)
            .then(res => {
                this.setState({showRes: true});
                this.setState({predictions: res.data});
               if( res.data=='')
               {
                alert("wrong");
               }
               else {
                alert("Prediction results are ready");
               }
            })
    }

    renderAllData(prediction) {
        let desease = prediction.desease, 
        percentage = prediction.percentage
    return (
        <tr>
            <td>{ desease }</td>
            <td>{ percentage}</td>
        </tr>
    );
}

renderPredictions() {
    let res = [];
    if (this.state.predictions!=null) {
        for (let i of this.state.predictions) {
            res.push(this.renderAllData(i));
        }
    }
    return res;
}



    handleChange = function(e) {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            let img = e.target.files[0];
            this.setState({predict_img:img});
            this.setState({dspl_img:URL.createObjectURL(img)});
        }
      };

      
    handleDrag = function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            this.setState({dragActive:true});
        } else if (e.type === "dragleave") {
            this.setState({dragActive:true});
        }
      };

    handleDrop = function(e) {
        console.log("dropped");
        e.preventDefault();
        e.stopPropagation();
        this.setState({dragActive:false});
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            let img = e.dataTransfer.files[0];
            this.setState({predict_img:img});
            this.setState({dspl_img:URL.createObjectURL(img)});
          // handleFiles(e.dataTransfer.files);
        }
      };

      showPDF()
      {
      }


    render(idd) {
          return (
              < div className="cont">
                <div className='header_home'>
                    <div><h2 className="text_header">Predict</h2></div>
                    <div><a href='/' className="btn_home"> <img alt="Home" src={plus}></img></a></div>
                </div>
                < div className="drag_form">
                    <form id="form-file-upload" onDragEnter={this.handleDrag} onSubmit={(e) => e.preventDefault()}>
                        <input  type="file" id="input-file-upload" multiple={true} onChange={this.handleChange} />
                        <label id="label-file-upload" htmlFor="input-file-upload" className={this.state.dragActive? "drag-active" : "" }>
                        <div>
                            {!this.state.dspl_img ? 
                            <p>Drag and drop your file here</p> :
                            <img src={this.state.dspl_img}/>}
                        </div> 
                        </label>
                        { this.state.dragActive && <div id="drag-file-element" onDragEnter={this.handleDrag} onDragLeave={this.handleDrag} onDragOver={this.handleDrag} onDrop={this.handleDrop}></div> }
                    </form>
                </div>
                <div className="results">
                    <div className="btns">
                        <button className="btn btn-success" onClick={() => this.predict(this.state.img)} >Predict</button>
                        
                    </div>
                    {!this.state.showRes ? "":
                    <div className="pred_table">
                        <table class = "prediction_table">
                            <thead>
                                <tr>
                                    <th>Desease</th>
                                    <th>Percent</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.renderPredictions()}
                            </tbody>
                        </table>
                    </div>}
                </div>
            </div >
        )
    }
  }

export default PredictionPage;

