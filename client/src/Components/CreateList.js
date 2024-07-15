import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createNewList } from '../clients/toDoClient';
import ListForm from './ListForm';
import Card from './Card';

const CreateList = () => {
    const navigate = useNavigate();

    const handleSubmit = async (listName) => {
        try {
            const response = await createNewList(listName);
            if (response.status === 'SUCCESS') {
                navigate(`/list/${response.listId}`);
            }
        } catch (error) {
            console.error('Error creating list:', error);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <Card title="Create New ToDo List">
                        <ListForm onSubmit={handleSubmit} />
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CreateList;