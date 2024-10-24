import React, { useState } from 'react';
import axios from 'axios';
import '../styles/EvaluateForm.css'; // Import the CSS file

function EvaluateForm() {
    const [data, setData] = useState('');
    const [result, setResult] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const parsedData = JSON.parse(data);
            console.log('Parsed Data:', parsedData); // Log parsed data
    
            const response = await axios.post('http://localhost:3000/api/rules/evaluate', { data: parsedData });
            console.log('Response:', response.data); // Log response from backend
    
            // Check if eligible is present and its value
            if (typeof response.data.result === 'boolean') {
                setResult(response.data.result ? 'True' : 'False');
                console.log('Eligible:', response.data.result); // Log eligibility
            } else {
                alert('Unexpected response structure');
                setResult(null);
            }
        } catch (error) {
            console.error('Error:', error); // Log error
            alert('Error evaluating rule');
            setResult(null);
        }
    };

    return (
        <div className="evaluate-form">
            <h2>Evaluate Rule</h2>
            <form onSubmit={handleSubmit}>
            <textarea
    placeholder={`Enter JSON data e.g. {
    "ruleId": "7f7c13b3-2260-493b-810d-c83b22e87f1e",
    "age": 35,
    "department": "Marketing",
    "salary": 60000,
    "experience": 6
}`} 
    value={data}
    onChange={(e) => setData(e.target.value)}
    required
/>

                <button type="submit">Evaluate</button>
            </form>
            {result !== null && <p>Result: {result}</p>}
        </div>
    );
}

export default EvaluateForm;
