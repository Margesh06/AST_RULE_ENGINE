import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/RuleList.css'; // Import the CSS file

function RuleList() {
    const [rules, setRules] = useState([]);

    useEffect(() => {
        const fetchRules = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/rules');
                setRules(response.data);
            } catch (error) {
                alert('Error fetching rules');
            }
        };
        fetchRules();
    }, []);

    return (
        <div className="rule-list">
            <h2>Rule List</h2>
            <ul>
                {rules.map((rule) => (
                    <li key={rule.id}>
                        <div>
                            <strong>Rule ID:</strong> <span>{rule.id}</span>
                        </div>
                        <div>
                            <strong>Name:</strong> <span>{rule.name}</span>
                        </div>
                        <div>
                            <strong>Rule String:</strong> <span>{rule.rule_string}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
    
}

export default RuleList;
