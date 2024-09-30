import io from "socket.io-client";
let _token = localStorage.getItem("accessToken");
let STRAPI_ENDPOINT ="https://api2.growz.uz/?token=" + _token;
export const WS = {socket: io, url: STRAPI_ENDPOINT};
