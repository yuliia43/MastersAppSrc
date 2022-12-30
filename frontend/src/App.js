import logo from './logo.svg';
import React, { Component } from 'react';
import { Route, Routes} from "react-router";
import {
  BrowserRouter as Router,
  Switch,
  useLocation
} from "react-router-dom";
import './App.css'
import './style.css'
import './main.css'
import ModelToShow from "./components/model"
import Models from "./components/main"
import AddModel from "./components/addModel"
import PredictionPage from "./components/predict"

class App extends Component {
	render() {
		return (
			<Router>
				<ul>
					<li>
					</li>
					<li>
						<Routes>
              <Route exact path="/" element={<Models/>} />
              <Route exact path="/create" element={<AddModel/>} />
              <Route path="/predict/:id" element={<PredictionPage/>} />
			  <Route path="/model/:id" element={<ModelToShow/>} />
						</Routes>
					</li>
				</ul>
			</Router>
		)
	}
}
export default App;
