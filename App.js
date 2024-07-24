import RootLayout from './app/stack/RootLayout';
import { Provider } from 'react-redux';
import store from './app/store';
 const App = () => {
  return (
    <Provider store={store}>
    <RootLayout/>    
  </Provider>
  );
}

export default App;