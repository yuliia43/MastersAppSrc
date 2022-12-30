import axios from 'axios';

const MODEL_API_BASE_URL = 'http://localhost:5000/';

class ApiService {

    fetchModels() {
        return axios.get(MODEL_API_BASE_URL);
    }

    fetchModelById(modelId) {
        return axios.get(MODEL_API_BASE_URL + '/' + modelId);
    }

    addModel(model) {
        return axios.post(MODEL_API_BASE_URL + '/create', model );
    }
    getAddModel() {
        return axios.get(MODEL_API_BASE_URL + '/create');
    }

    editModel(model) {
        return axios.put(MODEL_API_BASE_URL + '/update', model);
    }

    predict(model) {
        return axios.post(MODEL_API_BASE_URL + '/predict', model );
    }

}

export default new ApiService();