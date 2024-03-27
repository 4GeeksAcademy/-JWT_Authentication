const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],
			user:[],
			autentificacion:false, //Tiene que estar falso para que no esté logado nada más entrar en la web
			
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},

		
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			},

			

			login: (email,password) => {
				console.log("login desde flux", email, password)
				const requestOptions = {
					method: "POST",
					headers: {"Content-Type": "application/json"},
					body: JSON.stringify({
						"email": email,
						"password": password
					  })
				  };
				  
				  fetch(process.env.BACKEND_URL + "/api/login", requestOptions)
				  .then((response) => {
					console.log(response.status)
					if (response.status==200){
						setStore({ autentificacion: true });
					}
					return response.json()
				  })
				  .then((data) => {
					localStorage.setItem("token", data.token)
					localStorage.setItem("email", data.user.email)
					console.log("DATA Login-->", data)
					console.log("TOKEN", data.token)
				  })
				  .catch((error) => console.error(error));
			},

			addUser: (email,password) => {
				console.log("signup desde flux", email, password)
				const requestOptions = {
					method: "POST",
					headers: {"Content-Type": "application/json"},
					body: JSON.stringify({
						"email": email,
						"password": password
					  })
				  };
				  
				  fetch(process.env.BACKEND_URL + "/api/signup", requestOptions)
				  .then((response) => {
					console.log(response.status)
					return response.json()
				  })
				  .then((data) => {
					localStorage.setItem("token", data.access_token)
					console.log("DATA AddUser-->", data)
				  })
				  .catch((error) => console.error(error));
			},

			 
			privateZone: async () => {
					try {
						const token = localStorage.getItem('token');
						
						const requestOptions = {
							method: 'GET',
							headers: { 
								"Content-Type": "application/json",
								'Authorization': 'Bearer ' + token
							} 
						};
	
						const resp = await fetch(process.env.BACKEND_URL + "/api/protected", requestOptions);
	
						if (!resp.ok) {
							throw new Error("There was a problem in the login request");
						} else if (resp.status === 403) {
							throw new Error("Missing or invalid token");
						}
	
						const data = await resp.json();
						console.log("This is the data you requested", data);
						return data;
					} catch (error) {
						console.error(error);
						setStore({ errorMessage: error.message });
					}
				
			},

			logout: ()=>{
				console.log("sacame de aqui");
				setStore({ autentificacion: false })
				localStorage.removeItem("token")
			}
		}
	};
};

export default getState;
