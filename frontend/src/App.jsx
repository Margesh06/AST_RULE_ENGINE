import React from 'react';
import './styles/App.css'; // Import your enhanced CSS file
import RuleForm from './components/RuleForm';
import RuleList from './components/RuleList';
import EvaluateForm from './components/EvaluateForm';

function App() {
    return (
        <div className="App">
            <h1>Rule Engine Application</h1>
            <RuleForm />
            <div className="rule-list">
                <RuleList />
            </div>
            <div className="evaluate-section">
                <EvaluateForm />
            </div>
        </div>
    );
}

export default App;
