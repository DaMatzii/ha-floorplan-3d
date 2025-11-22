import axios from 'axios';

const axiosInstance = axios.create({
	headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
	},
	timeout: 5000,
});
export default axiosInstance
