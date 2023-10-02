// import { clearToken } from "../features/auth/AuthSlice";

// const tokenMiddleware = (store) => (next) => (action) => {
//     if (action.type === 'api/failed') {
//         const statusCode = action.error.status;
//         if (statusCode === 401) {
//         // Token expired
//         store.dispatch(clearToken());
//         // Redirect to the login page using React Router
//         window.location.href = '/login';
//         }
//     }
//     return next(action);
// };

// export default tokenMiddleware;