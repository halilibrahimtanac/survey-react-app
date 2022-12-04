import React from 'react';
import Survey from './Component/Survey';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Questions from './Component/Questions';
import SignUp from './Component/SignUp';
import SignIn from './Component/SignIn';
import SurveyList from './Component/SurveyList';
import Result from './Component/Result';
import SurveyArchive from './Component/SurveyArchive';

function App() {
 
  return (
    <React.Fragment>
      <BrowserRouter>
         <Routes>
          <Route path='/' element={<SignIn></SignIn>}></Route>
          <Route path='/survey' element={<Survey></Survey>}></Route>
          <Route path='/surveyList' element={<SurveyList></SurveyList>}></Route>   
          <Route path='signup' element={<SignUp></SignUp>}></Route>
          <Route path='question' element={<Questions></Questions>}></Route>
          <Route path='result' element={<Result></Result>}></Route>
          <Route path='archive' element={<SurveyArchive></SurveyArchive>}></Route>
         </Routes>
      </BrowserRouter>
      
    </React.Fragment>
  );
}

export default App;
