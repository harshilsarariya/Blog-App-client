import axios from "axios";

const client = axios.create({ baseURL: "https://react-native-blogapp.herokuapp.com/api" });

export default client;
