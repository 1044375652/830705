export const request = url =>{
	return fetch(url).then( res => res.json());
}