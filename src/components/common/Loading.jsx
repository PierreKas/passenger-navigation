import React from 'react';
import { Container, Spinner } from 'react-bootstrap';

const Loading = ({ message = 'Loading...' }) => {
    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
            <div className="text-center">
                <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p className="mt-2">{message}</p>
            </div>
        </Container>
    );
};

export default Loading;