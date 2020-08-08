import io from "socket.io-client";
let socket = io("https://codewars-project.herokuapp.com/");
export default socket;