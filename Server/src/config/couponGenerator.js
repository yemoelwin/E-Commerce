// import { config } from 'dotenv'
// config();

function coupongenerator(length) {
    var coupon = '';
    var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++){
        coupon += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return coupon;
}


export default coupongenerator;