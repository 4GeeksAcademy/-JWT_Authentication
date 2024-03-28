const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			signupSuccesfull: null,
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
			
			authentication:false, //Tiene que estar falso para que no esté logado nada más entrar en la web
			 
		},
		actions: {
			// Use getActions to call a function within a fuction
			// exampleFunction: () => {
			// 	getActions().changeColor(0, "green");
			// },

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

		
			// changeColor: (index, color) => {
			// 	//get the store
			// 	const store = getStore();

			// 	//we have to loop the entire demo array to look for the respective index
			// 	//and change its color
			// 	const demo = store.demo.map((elm, i) => {
			// 		if (i === index) elm.background = color;
			// 		return elm;
			// 	});

			// 	//reset the global store
			// 	setStore({ demo: demo });
			// },

			

			login: (email,password) => {
				// console.log("login desde flux", email, password)
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
						setStore({ authentication: true });
					}
					return response.json()
				  })
				  .then((data) => {
					localStorage.setItem("token", data.token)
					localStorage.setItem("email", data.user.email)
					sessionStorage.setItem("token", data.token)
					sessionStorage.setItem("email", data.user.email)
					// console.log("DATA Login-->", data)
					// console.log("TOKEN", data.token)
				  })
				  .catch((error) => {console.error(error)
				 });
			},

			addUser: async (email, password) => {
				const requestOptions = {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						email: email,
						password: password
					})
				};
			
				try {
					const response = await fetch(process.env.BACKEND_URL + "/api/signup", requestOptions);
					const data = await response.json();
			
					if (response.ok) {
						// Si la respuesta indica éxito (código de estado 200), devolver true
						setStore({ signupSuccesfull: "¡Registro exitoso! Ahora puedes iniciar sesión." });
						return true;
					} else if (response.status === 400 && data.msg === "User already exists") {
						// Si el usuario ya existe, devolver false
						return false;
					} else {
						// Si hay algún otro error, lanzar una excepción
						throw new Error(data.msg || "Hubo un problema al procesar tu solicitud. Por favor, intenta nuevamente más tarde.");
					}

					
				} catch (error) {
					// Si ocurre algún error de red u otro error, lanzar una excepción
					console.error("Error al registrar usuario:", error);
					throw new Error("Hubo un problema al procesar tu solicitud. Por favor, intenta nuevamente más tarde.");
				}
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
					
					}
				
			},

			logout: ()=>{
				setStore({ authentication: false });
				localStorage.removeItem("token");
				localStorage.removeItem("email");
				sessionStorage.removeItem("email");
				localStorage.removeItem("token");
			}
		}
	};
};

export default getState;
